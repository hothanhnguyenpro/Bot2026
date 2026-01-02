const { AttachmentBuilder } = require('discord.js');
const User = require('../../models/User');
const path = require('path');
const fs = require('fs');
// Import hàm vẽ từ file utils
const { createAnimatedProfile } = require('../../utils/gifHandler'); 
const { prefix } = require('../../../config.json');
const { t } = require('../../utils/locales'); // Import hàm dịch

module.exports = {
    name: 'profile',
    description: 'Xem thẻ nhân vật (Ảnh Động)',
    
    async execute(client, message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ discordId: userId });
        
        // 1. Xác định ngôn ngữ (nếu chưa có user thì mặc định 'vi')
        const lang = user ? user.language : 'vi';

        // Dùng t() cho thông báo lỗi
        if (!user) return message.reply(t('error_no_user', lang));

        // --- 🆕 LOGIC TỰ ĐỘNG LÊN CẤP (AUTO LEVEL UP) ---
        // Đặt ở đây để cập nhật chỉ số TRƯỚC khi vẽ ảnh
        let isLevelUp = false;
        let totalBonus = 0;

        // Dùng vòng lặp while: Nếu dư nhiều EXP thì cho lên nhiều cấp luôn
        while (user.exp >= user.level * 100) {
            user.exp -= user.level * 100; // Trừ EXP tiêu hao (giữ lại phần dư)
            user.level++;                 // Tăng cấp
            
            user.maxHp += 100;            // Tăng máu tối đa (+100 mỗi cấp)
            user.hp = user.maxHp;         // Hồi đầy máu (Quà lên cấp)
            
            // Thưởng tiền: Càng cấp cao thưởng càng nhiều (500 * Level)
// ... trong vòng lặp while
const bonus = 100 * user.level; // SỬA: 500 -> 100
// ...
            user.balance += bonus;
            totalBonus += bonus;
            
            isLevelUp = true;
        }

        if (isLevelUp) {
            await user.save(); // Lưu dữ liệu mới ngay
            // Gửi thông báo chúc mừng riêng
            const congratsMsg = lang === 'vi' 
                ? `🎉 **LEVEL UP!** Chúc mừng **${user.username}** đã đạt cấp **${user.level}**!\n💪 HP Tối đa: **${user.maxHp}** | 💰 Thưởng nóng: **${totalBonus.toLocaleString()} Galla**`
                : `🎉 **LEVEL UP!** Congrats **${user.username}** reached Level **${user.level}**!\n💪 Max HP: **${user.maxHp}** | 💰 Bonus: **${totalBonus.toLocaleString()} Galla**`;
            
            message.channel.send(congratsMsg);
        }
        // ----------------------------------------------------

        // 2. Gửi tin nhắn chờ (Dịch thông báo Loading)
        const loadingMsg = await message.reply(t('profile_loading', lang));

        try {
            // --- LOGIC TÌM ẢNH & TẠO GIF (GIỮ NGUYÊN) ---
            let charBaseName = 'scavenger';
            if (user.class === 'Tribal') charBaseName = 'tribal';
            if (user.class === 'Vandal') charBaseName = 'vandal';

            const charFolder = path.join(__dirname, '../../../assets/characters');
            let charPath = path.join(charFolder, `${charBaseName}.png`); // Mặc định PNG

            // Ưu tiên tìm file GIF
            if (fs.existsSync(path.join(charFolder, `${charBaseName}.gif`))) {
                charPath = path.join(charFolder, `${charBaseName}.gif`);
            } else if (fs.existsSync(path.join(charFolder, `${charBaseName}.png`))) {
                charPath = path.join(charFolder, `${charBaseName}.png`);
            }

            // Đường dẫn nền
            const bgPath = path.join(__dirname, '../../../assets/backgrounds/profile_bg.png');

            // Tạo GIF
            const gifBuffer = await createAnimatedProfile(
                user, 
                charPath, 
                bgPath, 
                message.author.displayAvatarURL({ extension: 'png' })
            );

            // --- GỬI KẾT QUẢ ---
            const attachment = new AttachmentBuilder(gifBuffer, { name: 'profile_anim.gif' });
            
            // Sửa lại nội dung tin nhắn kết quả theo ngôn ngữ
            await loadingMsg.edit({ 
                content: t('profile_header', lang, { name: user.username }), 
                files: [attachment] 
            });

        } catch (error) {
            console.error(error);
            // Thông báo lỗi theo ngôn ngữ
            loadingMsg.edit(t('profile_error_gen', lang));
        }
    }
};