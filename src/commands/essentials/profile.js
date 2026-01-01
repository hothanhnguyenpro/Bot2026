const { AttachmentBuilder } = require('discord.js');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');
const { createAnimatedProfile } = require('../../utils/gifHandler'); // Import hàm vẽ GIF
const { prefix } = require('../../../config.json');

module.exports = {
    name: 'profile',
    description: 'Xem thẻ nhân vật ĐỘNG (Animated GIF)',
    
    async execute(client, message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ discordId: userId });
        if (!user) return message.reply(`❌ Bạn chưa chơi game! Gõ \`${prefix}start\` đi.`);

        // Gửi tin nhắn chờ (Vì tạo GIF mất vài giây)
        const loadingMsg = await message.reply('🔄 **Đang khởi tạo Neural Link...** (Vẽ ảnh động)');

        try {
            // 1. Tìm đường dẫn file ảnh nhân vật
            let charBaseName = 'scavenger';
            if (user.class === 'Tribal') charBaseName = 'tribal';
            if (user.class === 'Vandal') charBaseName = 'vandal';

            const charFolder = path.join(__dirname, '../../../assets/characters');
            let charPath = path.join(charFolder, `${charBaseName}.png`); // Mặc định PNG

            // Ưu tiên tìm GIF
            if (fs.existsSync(path.join(charFolder, `${charBaseName}.gif`))) {
                charPath = path.join(charFolder, `${charBaseName}.gif`);
            } else if (fs.existsSync(path.join(charFolder, `${charBaseName}.png`))) {
                charPath = path.join(charFolder, `${charBaseName}.png`);
            }

            // 2. Đường dẫn nền
            const bgPath = path.join(__dirname, '../../../assets/backgrounds/profile_bg.png');

            // 3. Gọi hàm tạo GIF
            const gifBuffer = await createAnimatedProfile(
                user, 
                charPath, 
                bgPath, 
                message.author.displayAvatarURL({ extension: 'png' })
            );

            // 4. Gửi kết quả
            const attachment = new AttachmentBuilder(gifBuffer, { name: 'profile_anim.gif' });
            
            await loadingMsg.edit({ 
                content: `✅ **Thẻ căn cước của ${user.username}:**`, 
                files: [attachment] 
            });

        } catch (error) {
            console.error(error);
            loadingMsg.edit('❌ Máy chủ quá tải khi xử lý hình ảnh! Vui lòng thử lại.');
        }
    }
};