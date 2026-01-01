const { EmbedBuilder, AttachmentBuilder } = require('discord.js'); // 👈 Đã thêm AttachmentBuilder vào đây
const User = require('../../models/User');
const Item = require('../../models/Item');
const { v4: uuidv4 } = require('uuid');
const ITEM_DATA = require('../../data/items');
const { createCanvas, loadImage } = require('@napi-rs/canvas'); // Thư viện vẽ
const path = require('path');

// Lấy danh sách rác từ file data
const trashList = Object.keys(ITEM_DATA).filter(k => ITEM_DATA[k].type === 'Trash' || ITEM_DATA[k].type === 'Jinki_Base');

const cooldowns = new Set();

module.exports = {
    name: 'farm',
    aliases: ['scavenge', 'nhatrac'],
    description: 'Tìm kiếm rác tại khu vực hiện tại (Visual)',
    
    async execute(client, message, args) {
        const userId = message.author.id;

        // 1. Check Cooldown
        if (cooldowns.has(userId)) return message.reply('⏳ **Thở đi!** Đợi 5 giây nữa.');
        
        const user = await User.findOne({ discordId: userId });
        if (!user) return message.reply('❌ Chưa start game!');

        cooldowns.add(userId);
        setTimeout(() => cooldowns.delete(userId), 5000);

        // 2. Random trượt (30%)
        const chance = Math.random();
        if (chance < 0.3) {
             const messages = ["Không thấy gì...", "Chuột tha mất rồi...", "Khu này sạch quá mức."];
             return message.reply(messages[Math.floor(Math.random() * messages.length)]);
        }

        // 3. Drop Item Logic
        const randomKey = trashList[Math.floor(Math.random() * trashList.length)];
        const itemInfo = ITEM_DATA[randomKey];
        const potential = parseFloat(Math.random().toFixed(4)); 
        
        // Lưu Database
        const newItem = new Item({
            uid: uuidv4(),
            baseId: randomKey,
            ownerId: userId,
            stats: { attack: 0, potential: potential, durability: 100 },
            ownerHistory: [userId]
        });
        await newItem.save();

        // Cộng thưởng
        const expGain = 10;
        const gallaGain = Math.floor(Math.random() * 5) + 1;
        user.exp += expGain;
        user.balance += gallaGain;
        await user.save();

        // --- 4. PHẦN VẼ ẢNH (VISUAL) ---
        const canvas = createCanvas(500, 300);
        const ctx = canvas.getContext('2d');

        // A. Vẽ nền (Khu vực)
        try {
            const bgPath = path.join(__dirname, '../../../assets/backgrounds/slum_bg.png');
            const bg = await loadImage(bgPath);
            ctx.drawImage(bg, 0, 0, 500, 300);
        } catch (e) {
            // Fallback: Nếu chưa có ảnh nền thì vẽ màu nâu đất
            ctx.fillStyle = '#4a3b32'; 
            ctx.fillRect(0, 0, 500, 300);
        }

        // B. Vẽ Nhân vật
        let charFile = 'scavenger.png'; // Mặc định
        if (user.class === 'Tribal') charFile = 'tribal.png';
        if (user.class === 'Vandal') charFile = 'vandal.png';

        try {
            const charPath = path.join(__dirname, `../../../assets/characters/${charFile}`);
            const charImg = await loadImage(charPath);
            ctx.drawImage(charImg, 50, 100, 150, 150); 
        } catch (e) {
            // Không có ảnh nhân vật thì bỏ qua
        }

        // C. Vẽ Vật phẩm tìm được
        try {
            const itemPath = path.join(__dirname, `../../../assets/items/${itemInfo.baseId}.png`);
            const itemIcon = await loadImage(itemPath);
            
            // Hiệu ứng hào quang nếu là đồ xịn
            if (potential > 0.9) {
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 30;
            }
            
            ctx.drawImage(itemIcon, 280, 80, 100, 100); // Vẽ lơ lửng bên phải
            ctx.shadowBlur = 0; // Reset
        } catch (e) {
            // Fallback: Vẽ dấu chấm hỏi nếu chưa có ảnh item
            ctx.fillStyle = '#ffffff';
            ctx.font = '50px Arial';
            ctx.fillText('?', 300, 150);
        }

        // D. Gửi ảnh
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'farm-result.png' });
        
        message.reply({ 
            content: `🗑️ **${message.author.username}** lục lọi và tìm thấy: **${itemInfo.emoji} ${itemInfo.name}**!`, 
            files: [attachment] 
        });
    }
};