const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, AttachmentBuilder } = require('discord.js');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');
const { prefix } = require('../../../config.json');
const { t } = require('../../utils/locales'); // Import hàm dịch

// Hàm tìm file thông minh (Giữ nguyên)
function findImageFile(folder, filenameBase) {
    const basePath = path.join(__dirname, `../../../assets/${folder}`);
    const gifPath = path.join(basePath, `${filenameBase}.gif`);
    if (fs.existsSync(gifPath)) return { path: gifPath, name: `${filenameBase}.gif` };
    const pngPath = path.join(basePath, `${filenameBase}.png`);
    if (fs.existsSync(pngPath)) return { path: pngPath, name: `${filenameBase}.png` };
    const jpgPath = path.join(basePath, `${filenameBase}.jpg`);
    if (fs.existsSync(jpgPath)) return { path: jpgPath, name: `${filenameBase}.jpg` };
    return null; 
}

module.exports = {
    name: 'start',
    description: 'Khởi tạo nhân vật (Smart Detect)',
    
    async execute(client, message, args) {
        // Lấy User để biết ngôn ngữ (Mặc dù chưa start thì chưa có user, nên mặc định là 'vi')
        // Tuy nhiên có thể check user tạm để xem có đổi ngôn ngữ trước không (nếu sau này làm lệnh setlang global)
        // Hiện tại cứ mặc định 'vi' cho người mới chơi
        const userId = message.author.id;
        let existingUser = await User.findOne({ discordId: userId });
        const lang = existingUser ? existingUser.language : 'vi';

        if (existingUser) return message.reply(t('start_exists', lang));

        // --- GIAI ĐOẠN 1: INTRO ---
        const introFile = findImageFile('backgrounds', 'falling_intro');
        let introAttachment = [];
        let introURL = 'https://media.tenor.com/E1u3a_WqjWkAAAAM/falling-down.gif'; 

        if (introFile) {
            introAttachment.push(new AttachmentBuilder(introFile.path, { name: introFile.name }));
            introURL = `attachment://${introFile.name}`;
        }

        const embedIntro = new EmbedBuilder()
            .setColor('#FF0000')
            // Dùng t() để dịch tiêu đề và mô tả
            // Lưu ý: Bạn cần thêm key 'start_warning_title' và 'start_warning_desc' vào locales.js nếu chưa có
            // Ở đây tôi dùng tạm text cứng nếu key chưa có trong locales.js, hoặc bạn thêm vào file locales.js nhé.
            .setTitle(t('start_intro_title', lang) || '⚠️ CẢNH BÁO RƠI TỰ DO!') 
            .setDescription(t('start_intro_desc', lang, { name: message.author.username }) || `**${message.author.username}** đang rơi xuống Bãi Rác! Chọn ngay class để tiếp đất:`)
            .setImage(introURL);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('tribal').setLabel('Tribal').setStyle(ButtonStyle.Success).setEmoji('🛡️'),
            new ButtonBuilder().setCustomId('scavenger').setLabel('Scavenger').setStyle(ButtonStyle.Primary).setEmoji('🎒'),
            new ButtonBuilder().setCustomId('vandal').setLabel('Vandal').setStyle(ButtonStyle.Danger).setEmoji('⚔️')
        );

        const reply = await message.reply({ 
            embeds: [embedIntro], 
            files: introAttachment, 
            components: [row] 
        });

        // --- XỬ LÝ CHỌN ---
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== userId) return interaction.reply({ content: t('error_not_your_button', lang) || 'Không phải nút của bạn!', ephemeral: true });

            const chosenClass = interaction.customId;
            let className = '', charBaseName = '', color = '', descKey = '';

            if (chosenClass === 'tribal') {
                className = 'Tribal'; charBaseName = 'tribal'; color = '#2ecc71';
                descKey = 'class_desc_tribal'; // Key để dịch mô tả class
            }
            if (chosenClass === 'scavenger') {
                className = 'Scavenger'; charBaseName = 'scavenger'; color = '#3498db';
                descKey = 'class_desc_scavenger';
            }
            if (chosenClass === 'vandal') {
                className = 'Vandal'; charBaseName = 'vandal'; color = '#e74c3c';
                descKey = 'class_desc_vandal';
            }

            // --- GIAI ĐOẠN 2: REVEAL ---
            const charFile = findImageFile('characters', charBaseName);
            let finalFiles = [];
            let finalURL = '';

            if (charFile) {
                finalFiles.push(new AttachmentBuilder(charFile.path, { name: charFile.name }));
                finalURL = `attachment://${charFile.name}`;
            } else {
                finalURL = 'https://placehold.co/400x400/000000/FFFFFF/png?text=MISSING+FILE';
            }

            try {
                // Tạo user mới với ngôn ngữ mặc định là 'vi'
                const newUser = new User({
                    discordId: userId,
                    username: message.author.username,
                    class: className,
                    balance: 100,
                    language: 'vi' 
                });
                await newUser.save();

                // Lấy mô tả từ file locales (cần thêm vào locales.js)
                // Fallback text cứng nếu chưa có trong locales
                const descMap = {
                    'class_desc_tribal': 'Tốc độ cao - Né tránh giỏi',
                    'class_desc_scavenger': 'May mắn cao - Tìm đồ xịn',
                    'class_desc_vandal': 'Sức mạnh lớn - Dame to'
                };
                const classDesc = t(descKey, 'vi') || descMap[descKey];

                await interaction.update({
                    content: null,
                    embeds: [
                        new EmbedBuilder()
                        .setColor(color)
                        .setTitle(t('start_success_title', 'vi', { class: className.toUpperCase() }) || `✅ KÍCH HOẠT: ${className.toUpperCase()}`)
                        .setDescription(t('start_success_desc', 'vi', { name: message.author.username, desc: classDesc }) || `Chào mừng **${message.author.username}**.\n${classDesc}\n\nDùng \`${prefix}farm\` để chơi ngay!`)
                        .setImage(finalURL)
                    ],
                    files: finalFiles,
                    components: [] 
                });

            } catch (err) {
                console.error(err);
            }
        });
    }
};