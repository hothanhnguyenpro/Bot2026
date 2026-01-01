const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const Item = require('../../models/Item');
const User = require('../../models/User');
const ITEM_DATA = require('../../data/items'); 
const path = require('path');
const { prefix } = require('../../../config.json');

module.exports = {
    name: 'inv',
    aliases: ['bag'],
    description: 'Xem túi đồ dạng hình ảnh Pixel',
    
    async execute(client, message, args) {
        const userId = message.author.id;
        const user = await User.findOne({ discordId: userId });
        if (!user) return message.reply(`❌ Chưa chơi game! Gõ \`${prefix}start\`.`);

        const items = await Item.find({ ownerId: userId });

        // 1. Gom nhóm item (như cũ)
        const inventoryMap = {};
        items.forEach(item => {
            if (!inventoryMap[item.baseId]) {
                inventoryMap[item.baseId] = { count: 0, baseId: item.baseId };
            }
            inventoryMap[item.baseId].count++;
        });
        
        // Chuyển map thành mảng để dễ duyệt
        const inventoryArray = Object.values(inventoryMap);

        // --- VẼ CANVAS ---
        // Kích thước: 600x400 (Tùy chỉnh theo ảnh nền của bạn)
        const canvas = createCanvas(600, 400);
        const ctx = canvas.getContext('2d');

        // A. Tải ảnh nền (Cái tủ đồ pixel art bạn vẽ sẵn)
        // Nếu chưa có ảnh, mình tạm vẽ màu xám
        try {
            const bg = await loadImage(path.join(__dirname, '../../../assets/backgrounds/inventory_bg.png'));
            ctx.drawImage(bg, 0, 0, 600, 400);
        } catch (e) {
            ctx.fillStyle = '#2b2b2b';
            ctx.fillRect(0, 0, 600, 400);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`BALO CỦA ${user.username.toUpperCase()}`, 20, 35);

        // B. Vẽ lưới vật phẩm (Grid System)
        // Giả sử bắt đầu vẽ từ tọa độ X=30, Y=60
        // Mỗi ô rộng 64px, cách nhau 10px
        const startX = 30;
        const startY = 60;
        const cellSize = 64;
        const gap = 15;
        const cols = 7; // 7 cột mỗi hàng

        for (let i = 0; i < inventoryArray.length; i++) {
            const item = inventoryArray[i];
            const itemInfo = ITEM_DATA[item.baseId];

            // Tính tọa độ ô thứ i
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cellSize + gap);
            const y = startY + row * (cellSize + gap);

            // 1. Vẽ khung ô (Nếu ảnh nền chưa có khung sẵn)
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.strokeStyle = '#aaaaaa';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cellSize, cellSize);

            // 2. Vẽ Icon Item (Load từ thư mục assets/items/)
            try {
                // Tên file ảnh phải trùng tên ID trong items.js (vd: plastic_bottle.png)
                const iconPath = path.join(__dirname, `../../../assets/items/${item.baseId}.png`);
                const icon = await loadImage(iconPath);
                ctx.drawImage(icon, x + 4, y + 4, 56, 56); // Vẽ nhỏ hơn ô một chút
            } catch (err) {
                // Nếu không tìm thấy ảnh thì vẽ dấu hỏi chấm
                ctx.fillStyle = '#ff0000';
                ctx.font = '30px Arial';
                ctx.fillText('?', x + 20, y + 40);
            }

            // 3. Vẽ số lượng (Góc dưới phải)
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(`x${item.count}`, x + 35, y + 60); // Viền đen cho chữ dễ đọc
            ctx.fillText(`x${item.count}`, x + 35, y + 60);
        }

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'inventory.png' });
        message.reply({ files: [attachment] });
    }
};