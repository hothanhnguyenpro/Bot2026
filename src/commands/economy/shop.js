const { ITEMS } = require('../../utils/items');
const User = require('../../models/User');
const Item = require('../../models/Item');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { prefix } = require('../../../config.json');
const { t, getName, getDesc } = require('../../utils/locales');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// 👇 Import Canvas
const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = {
    name: 'shop',
    description: 'Xem cửa hàng dạng hình ảnh. VD: .g shop',
    
    async execute(client, message, args) {
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi';

        // ================================================================
        // 1. HÀM VẼ SHOP (CANVAS GENERATOR)
        // ================================================================
        async function drawShopImage(items, page, totalPages, userBalance) {
            // Kích thước ảnh
            const width = 800;
            const rowHeight = 160; // Chiều cao mỗi ngăn
            const headerHeight = 100;
            const footerHeight = 60;
            const height = headerHeight + (items.length * rowHeight) + footerHeight;

            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            // --- A. VẼ NỀN (Background) ---
            ctx.fillStyle = '#2c3e50'; // Màu tối chủ đạo
            ctx.fillRect(0, 0, width, height);

            // --- B. VẼ HEADER ---
            // Thanh tiêu đề
            ctx.fillStyle = '#f1c40f'; // Màu vàng Galla
            ctx.fillRect(0, 0, width, headerHeight);
            
            // Chữ tiêu đề
            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 50px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(t('shop_title', lang), width / 2, 65);

            // Số trang bên phải
            ctx.font = '30px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`Page ${page + 1}/${totalPages}`, width - 20, 65);

            // --- C. VẼ TỪNG MÓN HÀNG (LOOP) ---
            ctx.textAlign = 'left';
            
            for (let i = 0; i < items.length; i++) {
                const [key, item] = items[i];
                const y = headerHeight + (i * rowHeight);

                // 1. Vẽ nền ngăn kệ (Chẵn lẻ đổi màu cho dễ nhìn)
                ctx.fillStyle = i % 2 === 0 ? '#34495e' : '#2c3e50';
                ctx.fillRect(0, y, width, rowHeight);

                // 2. Vẽ đường kẻ dưới (Cái kệ)
                ctx.fillStyle = '#7f8c8d';
                ctx.fillRect(20, y + rowHeight - 2, width - 40, 2);

                // 3. Số thứ tự (1, 2, 3...)
                ctx.fillStyle = '#ecf0f1';
                ctx.font = 'bold 40px Arial';
                ctx.fillText(`${i + 1}.`, 30, y + 90);

                // 4. Vẽ ảnh vật phẩm
                const imgPath = path.join(__dirname, `../../../assets/items/${key}.png`);
                try {
                    let img;
                    if (fs.existsSync(imgPath)) {
                        img = await loadImage(imgPath);
                    } else {
                        // Nếu không có ảnh, load ảnh mặc định hoặc vẽ ô vuông
                        img = await loadImage('https://i.imgur.com/3Zn3e5n.png'); 
                    }
                    // Vẽ ảnh bo tròn hoặc vuông
                    ctx.drawImage(img, 100, y + 30, 100, 100);
                } catch (e) {
                    // Lỗi load ảnh thì vẽ ô vuông đỏ
                    ctx.fillStyle = '#c0392b';
                    ctx.fillRect(100, y + 30, 100, 100);
                }

                // 5. Tên vật phẩm
                const iName = getName(item.name, lang);
                ctx.fillStyle = '#f1c40f'; // Màu tên
                ctx.font = 'bold 36px Arial';
                ctx.fillText(iName, 230, y + 60);

                // 6. Thông số (Dame/Heal) & Mã số
                let statText = "";
                if (item.type === 'consumable') {
                    statText = `❤️ Heal: +${item.heal}`;
                    ctx.fillStyle = '#2ecc71'; // Xanh lá cho máu
                } else {
                    statText = `⚔️ DMG: ${item.damage}`;
                    ctx.fillStyle = '#e74c3c'; // Đỏ cho dame
                }
                ctx.font = '30px Arial';
                ctx.fillText(statText, 230, y + 110);

                // Mã số bên cạnh
                ctx.fillStyle = '#bdc3c7';
                ctx.font = 'italic 20px Arial';
                ctx.fillText(`ID: ${item.shopId || key}`, 230, y + 140);

                // 7. Giá tiền (Căn phải)
                const priceText = `${item.price.toLocaleString()} G`;
                ctx.fillStyle = '#f39c12';
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(priceText, width - 40, y + 95);
                ctx.textAlign = 'left'; // Reset về trái
            }

            // --- D. VẼ FOOTER ---
            const footerY = height - footerHeight;
            ctx.fillStyle = '#1a252f';
            ctx.fillRect(0, footerY, width, footerHeight);

            ctx.fillStyle = '#ecf0f1';
            ctx.font = 'bold 25px Arial';
            ctx.textAlign = 'center';
            const balanceText = lang === 'vi' 
                ? `Tài sản: ${userBalance.toLocaleString()} Galla`
                : `Balance: ${userBalance.toLocaleString()} Galla`;
            ctx.fillText(balanceText, width / 2, footerY + 40);

            return canvas.toBuffer('image/png');
        }

        // ================================================================
        // 2. HÀM HIỂN THỊ CHI TIẾT (KHI BẤM NÚT SỐ HOẶC GÕ ID)
        // ================================================================
        async function showItemDetails(interactionOrMessage, itemKey, itemData) {
            const iName = getName(itemData.name, lang);
            const iDesc = getDesc(itemData.description, lang);
            
            const imagePath = path.join(__dirname, `../../../assets/items/${itemKey}.png`);
            let fileAttachment = null;
            let thumbnailUrl = 'https://i.imgur.com/3Zn3e5n.png';

            if (fs.existsSync(imagePath)) {
                fileAttachment = new AttachmentBuilder(imagePath, { name: 'product.png' });
                thumbnailUrl = 'attachment://product.png';
            }

            let statsInfo = itemData.type === 'consumable'
                ? (lang === 'vi' ? `❤️ Hồi phục: **+${itemData.heal} HP**` : `❤️ Recover: **+${itemData.heal} HP**`)
                : (lang === 'vi' ? `⚔️ Sát thương: **${itemData.damage}**` : `⚔️ Damage: **${itemData.damage}**`);

            const embed = new EmbedBuilder()
                .setTitle(`🛒 ${iName}`)
                .setDescription(`${iDesc}\n\n${statsInfo}\n💰 **${itemData.price.toLocaleString()} Galla**`)
                .setColor('#f1c40f')
                .setThumbnail(thumbnailUrl);

            const btnLabel = lang === 'vi' ? `Mua (${itemData.price})` : `Buy (${itemData.price})`;
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`buy_${itemKey}`).setLabel(btnLabel).setStyle(ButtonStyle.Success).setEmoji('🛒')
            );

            const payload = { embeds: [embed], components: [row] };
            if (fileAttachment) payload.files = [fileAttachment];

            let sentMsg;
            if (interactionOrMessage.type === 2 || interactionOrMessage.type === 3) {
                sentMsg = await interactionOrMessage.reply({ ...payload, ephemeral: true, fetchReply: true });
            } else {
                sentMsg = await interactionOrMessage.reply(payload);
            }

            // Collector Mua
            const collector = sentMsg.createMessageComponentCollector({ time: 60000 });
            collector.on('collect', async i => {
                if (i.user.id !== user.discordId) return i.reply({ content: "❌ Not your button!", ephemeral: true });
                const itemKey = i.customId.split('_')[1];
                const itemToBuy = ITEMS[itemKey];
                const currentUser = await User.findOne({ discordId: user.discordId });
                
                if (currentUser.balance < itemToBuy.price) {
                    return i.reply({ content: t('buy_fail_money', lang, { price: itemToBuy.price, balance: currentUser.balance }), ephemeral: true });
                }

                currentUser.balance -= itemToBuy.price;
                const newItem = new Item({
                    uid: uuidv4(), baseId: itemKey, ownerId: currentUser.discordId,
                    stats: { attack: itemToBuy.damage || 0, durability: 100, potential: 0.5, level: 1, killCount: 0, exp: 0 },
                    ownerHistory: [{ userId: currentUser.discordId }]
                });
                await newItem.save();
                await currentUser.save();
                i.reply({ content: t('buy_success', lang, { item: getName(itemToBuy.name, lang), price: itemToBuy.price }), ephemeral: true });
            });
        }

        // ================================================================
        // 3. LOGIC CHÍNH: XỬ LÝ LỆNH
        // ================================================================

        // === TRƯỜNG HỢP 1: TÌM KIẾM CỤ THỂ ===
        if (args[0]) {
            const inputId = args[0].toLowerCase();
            let foundKey = null, foundItem = null;
            for (const [key, item] of Object.entries(ITEMS)) {
                if (item.shopId === inputId || key === inputId) {
                    foundKey = key; foundItem = item; break;
                }
            }
            if (!foundItem || !foundItem.price) return message.reply(t('shop_item_not_found', lang));
            return showItemDetails(message, foundKey, foundItem);
        }

        // === TRƯỜNG HỢP 2: XEM DANH SÁCH (CANVAS) ===
        // Lấy data và sắp xếp
        let shopItems = Object.entries(ITEMS)
            .filter(([key, item]) => item.price && item.price > 0)
            .sort((a, b) => {
                const idA = a[1].shopId || '9999';
                const idB = b[1].shopId || '9999';
                return idA.localeCompare(idB);
            });

        if (shopItems.length === 0) return message.reply(t('shop_empty', lang));

        const ITEMS_PER_PAGE = 5;
        let currentPage = 0;
        const totalPages = Math.ceil(shopItems.length / ITEMS_PER_PAGE);

        // Hàm gửi tin nhắn Shop (Image + Buttons)
        const sendShopMessage = async (page) => {
            const start = page * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentItems = shopItems.slice(start, end);

            // 1. Tạo ảnh
            const buffer = await drawShopImage(currentItems, page, totalPages, user.balance);
            const attachment = new AttachmentBuilder(buffer, { name: 'shop_list.png' });

            // 2. Tạo nút
            const navRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('prev').setLabel('⬅️').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
                new ButtonBuilder().setCustomId('next').setLabel('➡️').setStyle(ButtonStyle.Secondary).setDisabled(page === totalPages - 1)
            );

            const selectionRow = new ActionRowBuilder();
            currentItems.forEach((_, index) => {
                selectionRow.addComponents(
                    new ButtonBuilder().setCustomId(`select_${index}`).setLabel(`${index + 1}`).setStyle(ButtonStyle.Primary)
                );
            });

            return { files: [attachment], components: [navRow, selectionRow] };
        };

        // Gửi tin nhắn đầu tiên (Loading chút vì vẽ ảnh)
        const initialPayload = await sendShopMessage(currentPage);
        const msg = await message.reply(initialPayload);

        // Collector
        const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 60000 });
        
        collector.on('collect', async i => {
            if (i.customId === 'prev' || i.customId === 'next') {
                await i.deferUpdate(); // Báo Discord là đã nhận lệnh để không bị lỗi timeout
                if (i.customId === 'prev') currentPage--;
                else currentPage++;
                
                const newPayload = await sendShopMessage(currentPage);
                await msg.edit(newPayload);
            }
            
            if (i.customId.startsWith('select_')) {
                const indexOnPage = parseInt(i.customId.split('_')[1]);
                const realIndex = (currentPage * ITEMS_PER_PAGE) + indexOnPage;
                const selectedEntry = shopItems[realIndex];

                if (selectedEntry) {
                    await showItemDetails(i, selectedEntry[0], selectedEntry[1]);
                } else {
                    i.reply({ content: "❌ Error!", ephemeral: true });
                }
            }
        });
    }
};