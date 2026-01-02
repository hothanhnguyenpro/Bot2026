const User = require('../../models/User');
const { ownerId } = require('../../../config.json');

module.exports = {
    name: 'addxp',
    description: 'Cộng EXP cho người chơi (ADMIN ONLY)',
    
    async execute(client, message, args) {
        // 1. Check Admin
        if (message.author.id !== ownerId) return message.reply("❌ **Admin Only!**");

        // 2. Check Input
        if (!args[0]) return message.reply("❌ Nhập số EXP cần cộng. VD: `.g addxp 1000`");
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) return message.reply("❌ Số EXP không hợp lệ.");

        const user = await User.findOne({ discordId: message.author.id });
        if (!user) return message.reply("❌ Chưa tạo nhân vật.");

        // 3. Cộng EXP & Xử lý Level Up (Vòng lặp)
        user.exp += amount;
        let levelsGained = 0;
        let bonusMoney = 0;

        while (user.exp >= user.level * 100) {
            user.exp -= user.level * 100; // Trừ EXP tiêu hao
            user.level++;                 // Tăng cấp
            
            user.maxHp += 100;            // Tăng máu giấy
            user.hp = user.maxHp;         // Hồi đầy máu
            
            const money = 500 * user.level; // Thưởng tiền
            user.balance += money;
            
            levelsGained++;
            bonusMoney += money;
        }

        await user.save();

        let msg = `✅ Đã cộng **${amount} EXP** cho bạn!`;
        if (levelsGained > 0) {
            msg += `\n🎉 **THĂNG CẤP!** Bạn đã lên **${levelsGained}** cấp.`;
            msg += `\n📊 Cấp hiện tại: **${user.level}**`;
            msg += `\n💪 HP: **${user.maxHp}**`;
            msg += `\n💰 Thưởng: **${bonusMoney.toLocaleString()} Galla**`;
        } else {
            msg += `\n(EXP hiện tại: ${Math.floor(user.exp)}/${user.level * 100})`;
        }

        message.reply(msg);
    }
};