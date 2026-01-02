const { EmbedBuilder } = require('discord.js');
const { prefix } = require('../../../config.json');
const User = require('../../models/User'); // Import User để lấy ngôn ngữ
const { t } = require('../../utils/locales'); // Import hàm dịch

module.exports = {
    name: 'help',
    description: 'Xem danh sách lệnh / View commands',
    
    // Chuyển thành async để chờ lấy dữ liệu User
    async execute(client, message, args) {
        // 1. Lấy ngôn ngữ người dùng
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi'; // Mặc định 'vi'

        // 2. Tạo nội dung các nhóm lệnh (Dùng t() để dịch)
        const basicCmds = 
            `\`start\`: ${t('cmd_desc_start', lang)}\n` +
            `\`profile\`: ${t('cmd_desc_profile', lang)}\n` +
            `\`help\`: ${t('cmd_desc_help', lang)}`;

        const combatCmds = 
            `\`hunt [route]\`: ${t('cmd_desc_hunt', lang)}\n` +
            `\`farm\`: ${t('cmd_desc_farm', lang)}`;

        const itemCmds = 
            `\`inventory\`: ${t('cmd_desc_inv', lang)}\n` +
            `\`equip [id]\`: ${t('cmd_desc_equip', lang)}\n` +
            `\`dict\`: ${t('cmd_desc_dict', lang)}`;

        // 3. Tạo Embed
        const embed = new EmbedBuilder()
            .setTitle(t('help_title', lang))
            .setColor('#e67e22')
            .setDescription(t('help_desc', lang, { prefix })) // Truyền biến prefix vào chuỗi
            .addFields(
                { name: t('help_group_basic', lang), value: basicCmds },
                { name: t('help_group_combat', lang), value: combatCmds },
                { name: t('help_group_items', lang), value: itemCmds }
            )
            .setFooter({ text: t('help_footer', lang) })
            .setThumbnail(client.user.displayAvatarURL());

        message.reply({ embeds: [embed] });
    }
};