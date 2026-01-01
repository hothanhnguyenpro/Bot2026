const { AttachmentBuilder } = require('discord.js');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');
// Import hàm vẽ từ file utils vừa tạo
const { createAnimatedProfile } = require('../../utils/gifHandler'); 
const { prefix } = require('../../../config.json');

module.exports = {
    name: 'profile',
    description: 'Xem thẻ nhân vật (Ảnh Động)',
    
    async execute(client, message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ discordId: userId });
        if (!user) return message.reply(`❌ Bạn chưa chơi game! Gõ \`${prefix}start\` để tạo nhân vật.`);

        // Gửi tin nhắn chờ (Vì tạo GIF mất khoảng 2-3 giây)
        const loadingMsg = await message.reply('🔄 **Đang tải dữ liệu nhân vật...**');

        try {
            // 1. Xác định tên file dựa trên Class
            let charBaseName = 'scavenger';
            if (user.class === 'Tribal') charBaseName = 'tribal';
            if (user.class === 'Vandal') charBaseName = 'vandal';

            const charFolder = path.join(__dirname, '../../../assets/characters');
            let charPath = path.join(charFolder, `${charBaseName}.png`); // Mặc định PNG

            // 2. Ưu tiên tìm file GIF
            if (fs.existsSync(path.join(charFolder, `${charBaseName}.gif`))) {
                charPath = path.join(charFolder, `${charBaseName}.gif`);
            } else if (fs.existsSync(path.join(charFolder, `${charBaseName}.png`))) {
                charPath = path.join(charFolder, `${charBaseName}.png`);
            }

            // 3. Đường dẫn nền
            const bgPath = path.join(__dirname, '../../../assets/backgrounds/profile_bg.png');

            // 4. Tạo GIF
            const gifBuffer = await createAnimatedProfile(
                user, 
                charPath, 
                bgPath, 
                message.author.displayAvatarURL({ extension: 'png' })
            );

            // 5. Gửi kết quả
            const attachment = new AttachmentBuilder(gifBuffer, { name: 'profile_anim.gif' });
            
            await loadingMsg.edit({ 
                content: `✅ **Thẻ căn cước của ${user.username}:**`, 
                files: [attachment] 
            });

        } catch (error) {
            console.error(error);
            loadingMsg.edit('❌ Có lỗi khi tạo ảnh! (Kiểm tra lại file assets)');
        }
    }
};