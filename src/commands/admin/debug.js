const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { ownerId } = require('../../../config.json');

module.exports = {
    name: 'debug',
    description: 'Kiểm tra xem bot có tìm thấy ảnh không',
    
    async execute(client, message, args) {
        // Chỉ chủ bot mới được soi
        if (message.author.id !== ownerId) return;

        const assetsPath = path.join(__dirname, '../../../assets');
        
        // Danh sách các file cần kiểm tra
        const filesToCheck = [
            'backgrounds/falling_intro.gif',
            'backgrounds/slum_bg.png',
            'characters/tribal.gif',
            'characters/scavenger.gif',
            'characters/vandal.gif',
            'items/plastic_bottle.png'
        ];

        let description = "";

        filesToCheck.forEach(file => {
            const fullPath = path.join(assetsPath, file);
            if (fs.existsSync(fullPath)) {
                description += `✅ **Tìm thấy:** \`${file}\`\n`;
            } else {
                description += `❌ **THIẾU:** \`${file}\`\n👉 (Cần tạo file tại: .../assets/${file})\n\n`;
            }
        });

        const embed = new EmbedBuilder()
            .setTitle('🔍 KẾT QUẢ KIỂM TRA FILE ẢNH')
            .setDescription(description)
            .setColor(description.includes('❌') ? '#ff0000' : '#00ff00');

        message.reply({ embeds: [embed] });
    }
};