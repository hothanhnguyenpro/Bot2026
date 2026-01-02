const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS } = require('../../utils/items');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { prefix } = require('../../../config.json');
const { t, getName } = require('../../utils/locales');

module.exports = {
    name: 'sell',
    description: 'Bán vật phẩm (70% giá gốc)',
    
    async execute(client, message, args) {
        const user = await User.findOne({ discordId: message.author.id });
        if (!user) return message.reply(t('error_no_user', 'vi'));
        const lang = user.language;

        if (!args[0]) return message.reply(t('sell_syntax', lang, { prefix }));
        const index = parseInt(args[0]) - 1;

        const items = await Item.find({ ownerId: message.author.id }).sort({ 'stats.level': -1, baseId: 1 });
        if (!items[index]) return message.reply(t('info_item_not_found', lang));

        const item = items[index];
        const baseItem = ITEMS[item.baseId];
        
        // 1. Kiểm tra điều kiện bán
        // Nếu không có giá (đồ rớt đặc biệt) hoặc đang trang bị
        if (!baseItem.price && !baseItem.canDrop) { 
             // Nếu muốn cho bán đồ farm được, bạn có thể tự định giá ở đây hoặc thêm price vào item farm
             // Tạm thời nếu item không có giá trong items.js thì không cho bán
             return message.reply(t('sell_fail_cant', lang));
        }

        if (item.isEquipped) return message.reply(t('sell_fail_equip', lang));

        // Giá bán = 70% giá gốc (Nếu không có giá gốc thì mặc định là 10 xu)
        const originalPrice = baseItem.price || 10; 
        const sellPrice = Math.floor(originalPrice * 0.7);

        const itemName = getName(baseItem.name, lang);

        // --- 🔴 LOGIC CẢNH BÁO ĐỒ HIẾM ---
        // Nếu độ hiếm >= 3 (Rare) VÀ người dùng CHƯA tắt cảnh báo
        if (baseItem.rarity >= 3 && !user.settings?.disableSellWarning) {
            
            const embed = new EmbedBuilder()
                .setTitle(t('sell_warn_title', lang))
                .setDescription(t('sell_warn_desc', lang, { item: itemName, rarity: `Tier ${baseItem.rarity}` }))
                .setColor('#e74c3c');

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('confirm').setLabel(t('btn_confirm', lang)).setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('cancel').setLabel(t('btn_cancel', lang)).setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('always').setLabel(t('btn_always', lang)).setStyle(ButtonStyle.Primary) // Nút tắt cảnh báo
            );

            const msg = await message.reply({ embeds: [embed], components: [row] });
            
            // Xử lý sự kiện bấm nút
            const filter = i => i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 30000, max: 1 });

            collector.on('collect', async i => {
                if (i.customId === 'cancel') {
                    await i.update({ content: "❌ Đã hủy bán.", embeds: [], components: [] });
                } 
                else {
                    // Nếu chọn 'always', cập nhật setting
                    if (i.customId === 'always') {
                        // Khởi tạo settings nếu chưa có (phòng lỗi data cũ)
                        if (!user.settings) user.settings = {};
                        user.settings.disableSellWarning = true;
                    }

                    // Thực hiện bán
                    await performSell(i, user, item, sellPrice, itemName, lang);
                }
            });
            return;
        }

        // Nếu không cần cảnh báo (đồ cùi hoặc đã tắt), bán luôn
        await performSell(message, user, item, sellPrice, itemName, lang);
    }
};

// Hàm xử lý bán tách riêng để tái sử dụng
async function performSell(interactionOrMessage, user, item, price, itemName, lang) {
    // 1. Xóa item
    await Item.deleteOne({ _id: item._id });

    // 2. Cộng tiền
    user.balance += price;
    await user.save();

    const text = t('sell_success', lang, { item: itemName, price: price });

    // Nếu là interaction (bấm nút)
    if (interactionOrMessage.update) {
        await interactionOrMessage.update({ content: text, embeds: [], components: [] });
    } else {
        // Nếu là message (lệnh thường)
        interactionOrMessage.reply(text);
    }
}