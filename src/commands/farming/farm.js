const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS } = require('../../utils/items');
// 👇 Thêm AttachmentBuilder vào đây
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { prefix } = require('../../../config.json');
const { t, getName } = require('../../utils/locales');
// 👇 Thêm thư viện xử lý file
const path = require('path');
const fs = require('fs');

const COOLDOWN = 25;

module.exports = {
    name: 'farm',
    description: 'Tìm kiếm vật phẩm (Common - Rare)',
    
    async execute(client, message, args) {
        // 1. Lấy ngôn ngữ User
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi';

        if (!user) return message.reply(t('error_no_user', lang));

        // 2. Check Cooldown
        if (user.lastHunt) {
            const diff = (new Date() - new Date(user.lastHunt)) / 1000;
            if (diff < COOLDOWN) return message.reply(t('farm_cooldown', lang, { time: Math.ceil(COOLDOWN - diff) }));
        }

        // 3. Random đồ từ Common (1) đến Rare (3)
        const allowedItems = Object.keys(ITEMS).filter(key => ITEMS[key].rarity <= 3);
        const randomId = allowedItems[Math.floor(Math.random() * allowedItems.length)];
        const itemBase = ITEMS[randomId];
        
        const itemName = getName(itemBase.name, lang);

        // --- 🆕 XỬ LÝ HÌNH ẢNH ITEM ---
        const imagePath = path.join(__dirname, `../../../assets/items/${randomId}.png`);
        let fileAttachment = null;
        let thumbnailUrl = 'https://i.imgur.com/3Zn3e5n.png'; // Ảnh mặc định nếu thiếu file

        if (fs.existsSync(imagePath)) {
            // Tạo file đính kèm
            fileAttachment = new AttachmentBuilder(imagePath, { name: 'loot.png' });
            thumbnailUrl = 'attachment://loot.png';
        }
        // ------------------------------

        // 4. Random Tiềm năng & Chất lượng
        const potential = parseFloat(Math.random().toFixed(2)); 
        let qualityKey = 'farm_quality_normal';
        if (potential > 0.8) qualityKey = 'farm_quality_good';
        if (potential < 0.2) qualityKey = 'farm_quality_bad';
        
        const qualityText = t(qualityKey, lang);

        // Màu sắc
        let color = '#95a5a6';
        if (itemBase.rarity === 2) color = '#2ecc71';
        if (itemBase.rarity === 3) color = '#3498db';

        // 5. Tạo Embed
        const embed = new EmbedBuilder()
            .setTitle(t('farm_found_title', lang, { item: itemName }))
            .setDescription(t('farm_found_desc', lang, { 
                rarity: itemBase.rarity,
                dmg: itemBase.damage,
                quality: qualityText,
                pot: Math.floor(potential * 100)
            }))
            .setColor(color)
            .setThumbnail(thumbnailUrl); // 👈 Hiển thị ảnh nhỏ bên phải

        // 6. Tạo Nút
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('pick').setLabel(t('farm_pick', lang)).setStyle(ButtonStyle.Success).setEmoji('🎒'),
            new ButtonBuilder().setCustomId('drop').setLabel(t('farm_drop', lang)).setStyle(ButtonStyle.Secondary).setEmoji('🗑️')
        );

        // 7. Gửi tin nhắn (Kèm file ảnh nếu có)
        const replyPayload = { embeds: [embed], components: [row] };
        if (fileAttachment) replyPayload.files = [fileAttachment];

        const reply = await message.reply(replyPayload);
        
        // 8. Xử lý sự kiện
        const collector = reply.createMessageComponentCollector({ 
            filter: i => i.user.id === message.author.id, 
            time: 15000 
        });

        collector.on('collect', async i => {
            if (i.customId === 'pick') {
                const newItem = new Item({
                    uid: uuidv4(),
                    baseId: randomId,
                    ownerId: user.discordId,
                    stats: {
                        attack: itemBase.damage, 
                        durability: 50 + Math.floor(Math.random() * 50),
                        potential: potential,
                        killCount: 0,
                        exp: 0,
                        level: 1
                    },
                    ownerHistory: [{ userId: user.discordId }]
                });

                await newItem.save();
                
                user.lastHunt = new Date();
                user.exp += 5;
                await user.save();

                await i.update({ 
                    content: t('farm_pick_success', lang, { item: itemName, quality: qualityText, uid: newItem.uid.split('-')[0] }), 
                    embeds: [], components: [], files: [] // Xóa ảnh khi nhặt xong cho gọn
                });
            } else {
                user.lastHunt = new Date();
                await user.save();
                await i.update({ 
                    content: t('farm_drop_success', lang, { item: itemName }), 
                    embeds: [], components: [], files: [] 
                });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) reply.edit({ content: t('farm_timeout', lang), components: [], files: [] });
        });
    }
};