const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS } = require('../../utils/items');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { prefix } = require('../../../config.json');
const { t, getName } = require('../../utils/locales');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'info',
    description: 'Xem chi tiết món đồ (Vũ khí/Đồ ăn)',
    
    async execute(client, message, args) {
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi';

        if (!args[0]) return message.reply(t('info_syntax', lang, { prefix }));
        const index = parseInt(args[0]) - 1;

        if (!user) return message.reply(t('error_no_user', lang));

        const items = await Item.find({ ownerId: message.author.id }).sort({ 'stats.level': -1, baseId: 1 });
        if (!items[index]) return message.reply(t('info_item_not_found', lang));

        const uniqueItem = items[index];
        const baseItem = ITEMS[uniqueItem.baseId];
        const itemName = getName(baseItem.name, lang);

        // --- XỬ LÝ ẢNH (CHUNG CHO TẤT CẢ) ---
        // Cứ tìm ảnh theo ID. Ví dụ: medkit.png, healing_potion.png, katana.png...
        const imagePath = path.join(__dirname, `../../../assets/items/${uniqueItem.baseId}.png`);
        let fileAttachment = null;
        let thumbnailUrl = `https://dummyimage.com/100x100/000/fff&text=${itemName.substring(0,2).toUpperCase()}`;

        if (fs.existsSync(imagePath)) {
            fileAttachment = new AttachmentBuilder(imagePath, { name: 'item.png' });
            thumbnailUrl = 'attachment://item.png';
        }
        // ------------------------------------

        // Phân loại hiển thị chỉ số
        let statsDisplay = "";
        if (baseItem.type === 'consumable') {
            // Đồ ăn
            statsDisplay = `❤️ Hồi phục: **+${baseItem.heal} HP**`;
        } else {
            // Vũ khí
            const requiredExp = 100 * uniqueItem.stats.level * (baseItem.rarity || 1);
            statsDisplay = `⚔️ ATK: **${uniqueItem.stats.attack}**\n🛡️ Độ bền: **${uniqueItem.stats.durability}**\n☠️ Kill: **${uniqueItem.stats.killCount}**\n✨ EXP: **${Math.floor(uniqueItem.stats.exp)}/${requiredExp}**`;
        }

        const embed = new EmbedBuilder()
            .setTitle(t('info_title', lang, { item: itemName }) + (baseItem.type !== 'consumable' ? ` [+${uniqueItem.stats.level}]` : ''))
            .setColor('#3498db')
            .addFields(
                { name: t('info_uid', lang), value: `\`${uniqueItem.uid}\``, inline: false },
                { name: '📊 Chỉ Số', value: statsDisplay, inline: true },
                { 
                    name: t('info_history_title', lang), 
                    value: t('info_history_val', lang, { owner: uniqueItem.ownerId, date: uniqueItem.createdAt.toLocaleDateString('vi-VN') }), 
                    inline: false 
                }
            )
            .setThumbnail(thumbnailUrl);

        const payload = { embeds: [embed] };
        if (fileAttachment) payload.files = [fileAttachment];

        message.reply(payload);
    }
};