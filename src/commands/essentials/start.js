const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, AttachmentBuilder } = require('discord.js');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');
const { prefix } = require('../../../config.json');

// Hàm tìm file thông minh (Tìm GIF trước, không thấy thì tìm PNG)
function findImageFile(folder, filenameBase) {
    const basePath = path.join(__dirname, `../../../assets/${folder}`);
    
    const gifPath = path.join(basePath, `${filenameBase}.gif`);
    if (fs.existsSync(gifPath)) return { path: gifPath, name: `${filenameBase}.gif` };

    const pngPath = path.join(basePath, `${filenameBase}.png`);
    if (fs.existsSync(pngPath)) return { path: pngPath, name: `${filenameBase}.png` };

    const jpgPath = path.join(basePath, `${filenameBase}.jpg`);
    if (fs.existsSync(jpgPath)) return { path: jpgPath, name: `${filenameBase}.jpg` };

    return null; // Không tìm thấy gì cả
}

module.exports = {
    name: 'start',
    description: 'Khởi tạo nhân vật (Smart Detect)',
    
    async execute(client, message, args) {
        const userId = message.author.id;
        const existingUser = await User.findOne({ discordId: userId });
        if (existingUser) return message.reply(`⛔ Bạn đã chơi rồi! Dùng \`${prefix}profile\`.`);

        // --- GIAI ĐOẠN 1: INTRO ---
        // Tự tìm file falling_intro (gif hoặc png đều được)
        const introFile = findImageFile('backgrounds', 'falling_intro');
        
        let introAttachment = [];
        let introURL = 'https://media.tenor.com/E1u3a_WqjWkAAAAM/falling-down.gif'; // Link mạng dự phòng

        if (introFile) {
            introAttachment.push(new AttachmentBuilder(introFile.path, { name: introFile.name }));
            introURL = `attachment://${introFile.name}`;
        }

        const embedIntro = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('⚠️ CẢNH BÁO RƠI TỰ DO!')
            .setDescription(`**${message.author.username}** đang rơi xuống Bãi Rác! Chọn ngay class để tiếp đất:`)
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
            if (interaction.user.id !== userId) return interaction.reply({ content: 'Không phải nút của bạn!', ephemeral: true });

            const chosenClass = interaction.customId;
            let className = '', charBaseName = '', color = '', desc = '';

            if (chosenClass === 'tribal') {
                className = 'Tribal'; charBaseName = 'tribal'; color = '#2ecc71';
                desc = 'Tốc độ cao - Né tránh giỏi';
            }
            if (chosenClass === 'scavenger') {
                className = 'Scavenger'; charBaseName = 'scavenger'; color = '#3498db';
                desc = 'May mắn cao - Tìm đồ xịn';
            }
            if (chosenClass === 'vandal') {
                className = 'Vandal'; charBaseName = 'vandal'; color = '#e74c3c';
                desc = 'Sức mạnh lớn - Dame to';
            }

            // --- GIAI ĐOẠN 2: REVEAL (Tự tìm ảnh/gif nhân vật) ---
            const charFile = findImageFile('characters', charBaseName);
            let finalFiles = [];
            let finalURL = '';

            if (charFile) {
                finalFiles.push(new AttachmentBuilder(charFile.path, { name: charFile.name }));
                finalURL = `attachment://${charFile.name}`;
            } else {
                // Nếu không thấy file nào -> Dùng ảnh lỗi online
                finalURL = 'https://placehold.co/400x400/000000/FFFFFF/png?text=MISSING+FILE';
            }

            try {
                const newUser = new User({
                    discordId: userId,
                    username: message.author.username,
                    class: className,
                    balance: 100,
                });
                await newUser.save();

                await interaction.update({
                    content: null,
                    embeds: [
                        new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`✅ KÍCH HOẠT: ${className.toUpperCase()}`)
                        .setDescription(`Chào mừng **${message.author.username}**.\n${desc}\n\nDùng \`${prefix}farm\` để chơi ngay!`)
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