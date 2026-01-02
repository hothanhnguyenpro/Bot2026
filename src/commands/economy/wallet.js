const User = require('../../models/User');
const { EmbedBuilder } = require('discord.js');
const { t } = require('../../utils/locales');

module.exports = {
    name: 'wallet',
    description: 'Xem số dư tài khoản',
    aliases: ['bal', 'cash', 'money'],
    
    async execute(client, message, args) {
        const user = await User.findOne({ discordId: message.author.id });
        if (!user) return message.reply("❌ Chưa tạo nhân vật!");

        const lang = user.language || 'vi';

        const embed = new EmbedBuilder()
            .setTitle(t('wallet_title', lang, { name: message.author.username.toUpperCase() }))
            .setDescription(t('wallet_desc', lang, { balance: user.balance.toLocaleString() }))
            .setColor('#f1c40f')
            .setThumbnail(message.author.displayAvatarURL());

        message.reply({ embeds: [embed] });
    }
};