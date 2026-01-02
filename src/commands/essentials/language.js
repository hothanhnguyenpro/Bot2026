const User = require('../../models/User');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { t } = require('../../utils/locales'); // Import hàm dịch

module.exports = {
    name: 'language',
    aliases: ['lang', 'setlang'],
    description: 'Change bot language (VN/EN)',
    
    async execute(client, message, args) {
        let user = await User.findOne({ discordId: message.author.id });
        if (!user) {
            // Nếu chưa start thì tạo tạm user ảo hoặc bắt start (tùy bạn), ở đây mình báo lỗi
            return message.reply("❌ Please `.g start` first!");
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('lang_vi').setLabel('Tiếng Việt 🇻🇳').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('lang_en').setLabel('English 🇺🇸').setStyle(ButtonStyle.Danger)
        );

        const reply = await message.reply({ 
            content: t('lang_select', user.language), 
            components: [row] 
        });

        const collector = reply.createMessageComponentCollector({
            filter: i => i.user.id === message.author.id,
            time: 30000
        });

        collector.on('collect', async i => {
            const newLang = i.customId === 'lang_vi' ? 'vi' : 'en';
            
            user.language = newLang;
            await user.save();

            await i.update({
                content: t(`lang_set_${newLang}`, newLang),
                components: []
            });
        });
    }
};