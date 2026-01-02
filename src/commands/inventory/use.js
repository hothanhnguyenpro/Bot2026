const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS } = require('../../utils/items');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { prefix } = require('../../../config.json');
const { t, getName } = require('../../utils/locales');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'use',
    description: 'Dùng vật phẩm (Hồi máu). VD: .g use 1',
    aliases: ['eat', 'heal'],
    
    async execute(client, message, args) {
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi';

        if (!args[0]) return message.reply(t('info_syntax', lang, { prefix }).replace('info', 'use'));
        const index = parseInt(args[0]) - 1;

        if (!user) return message.reply(t('error_no_user', lang));

        // Lấy danh sách item
        const items = await Item.find({ ownerId: message.author.id }).sort({ 'stats.level': -1, baseId: 1 });
        if (!items[index]) return message.reply(t('info_item_not_found', lang));

        const item = items[index];
        const baseItem = ITEMS[item.baseId];

        // 1. Kiểm tra có phải đồ ăn không
        if (baseItem.type !== 'consumable') {
            return message.reply(t('use_fail_not_consumable', lang));
        }

        // 2. Kiểm tra máu
        if (user.hp >= user.maxHp) {
            return message.reply(t('use_fail_max', lang));
        }

        // 3. Thực hiện hồi máu
        const healAmount = baseItem.heal || 0;
        const oldHp = user.hp;
        user.hp = Math.min(user.hp + healAmount, user.maxHp);
        const actualHeal = user.hp - oldHp;

        // 4. Xóa vật phẩm
        await Item.deleteOne({ _id: item._id });
        await user.save();

        // 5. Hiển thị thông báo KÈM ẢNH
        const itemName = getName(baseItem.name, lang);
        
        const imagePath = path.join(__dirname, `../../../assets/items/${item.baseId}.png`);
        let fileAttachment = null;
        let thumbnailUrl = 'https://i.imgur.com/3Zn3e5n.png';

        if (fs.existsSync(imagePath)) {
            fileAttachment = new AttachmentBuilder(imagePath, { name: 'used_item.png' });
            thumbnailUrl = 'attachment://used_item.png';
        }

        const embed = new EmbedBuilder()
            .setColor('#2ecc71') // Màu xanh lá cây (Hồi máu)
            .setDescription(t('use_success', lang, { 
                item: itemName, 
                amount: actualHeal, 
                current: user.hp, 
                max: user.maxHp 
            }))
            .setThumbnail(thumbnailUrl);

        const payload = { embeds: [embed] };
        if (fileAttachment) payload.files = [fileAttachment];

        message.reply(payload);
    }
};