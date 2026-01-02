const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS, MAX_LEVEL } = require('../../utils/items');
const { ownerId } = require('../../../config.json');
const { t, getName } = require('../../utils/locales');

module.exports = {
    name: 'addexp',
    description: 'Cộng EXP và cưỡng chế tiến hóa (ADMIN ONLY)',
    
    async execute(client, message, args) {
        if (message.author.id !== ownerId) return message.reply("❌ **Admin Only!**");

        if (!args[0]) return message.reply("❌ Cú pháp: `.g addexp <số thứ tự> [exp]`\nVí dụ: `.g addexp 1 1` (Để kích hoạt tiến hóa)");

        const index = parseInt(args[0]) - 1;
        const amount = args[1] ? parseInt(args[1]) : 0; // Mặc định là 0 nếu không nhập

        const items = await Item.find({ ownerId: message.author.id }).sort({ 'stats.level': -1, baseId: 1 });
        if (!items[index]) return message.reply(`❌ Không tìm thấy món đồ số **${index + 1}**.`);

        const item = items[index];
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi';
        
        // Cộng EXP (nếu có)
        if (amount > 0) item.stats.exp += amount;

        let levelsGained = 0;
        let atkGained = 0;
        let evolutionLog = "";
        let hasEvolved = false;

        // VÒNG LẶP XỬ LÝ (Tối đa 100 lần lặp để tránh treo máy nếu lỗi)
        let loopCount = 0;
        while (loopCount < 1000) {
            loopCount++;
            
            // 1. Lấy thông tin hiện tại (Vì ID có thể đổi sau khi tiến hóa)
            const currentBase = ITEMS[item.baseId];
            if (!currentBase) break;

            // 2. CHECK TIẾN HÓA (ƯU TIÊN SỐ 1)
            // Kiểm tra ngay đầu vòng lặp. Nếu đủ điều kiện là cho tiến hóa luôn, kệ Level max hay chưa.
            if (item.stats.level >= 25 && currentBase.evolvesTo) {
                const nextId = currentBase.evolvesTo;
                const nextBase = ITEMS[nextId];

                if (nextBase) {
                    const oldName = getName(currentBase.name, lang);
                    const newName = getName(nextBase.name, lang);

                    // THỰC HIỆN TIẾN HÓA
                    item.baseId = nextId; 
                    item.stats.attack += 50; 
                    atkGained += 50;
                    hasEvolved = true;

                    evolutionLog += `\n✨ **TIẾN HÓA:** ${oldName} ➔ **${newName}**`;
                    
                    // Sau khi tiến hóa, tiếp tục vòng lặp để check xem item mới có up cấp tiếp được không
                    continue; 
                }
            }

            // 3. CHECK MAX LEVEL (Nếu đã max cấp thì dừng lại, KHÔNG CỘNG CẤP NỮA)
            if (item.stats.level >= MAX_LEVEL) {
                item.stats.exp = 0; 
                break;
            }

            // 4. XỬ LÝ LÊN CẤP
            const rarityMult = currentBase.rarity || 1;
            const reqExp = item.stats.level * 100 * rarityMult;

            if (item.stats.exp >= reqExp) {
                item.stats.exp -= reqExp;
                item.stats.level++;
                item.stats.attack += 5;
                
                levelsGained++;
                atkGained += 5;
                // Lên cấp xong quay lại đầu vòng lặp để check tiến hóa tiếp (nếu món mới lại có thể tiến hóa)
            } else {
                break; // Không đủ EXP thì nghỉ
            }
        }

        await item.save();

        // THÔNG BÁO
        const finalBase = ITEMS[item.baseId];
        const finalName = getName(finalBase.name, lang);
        
        let msg = `✅ Đã xử lý item **${finalName}**!`;
        if (levelsGained > 0) msg += `\n🎉 Lên **${levelsGained}** cấp.`;
        if (evolutionLog) msg += evolutionLog;
        if (!hasEvolved && !levelsGained) msg += `\n(Item đã Max cấp hoặc không đủ EXP lên cấp)`;
        
        msg += `\n📊 Hiện tại: **Lv.${item.stats.level}** | ATK: **${item.stats.attack}**`;

        message.reply(msg);
    }
};