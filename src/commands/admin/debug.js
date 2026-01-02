const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { ITEMS } = require('../../utils/items');
const { ZONES } = require('../../utils/zones');
// 👇 Thêm dòng này để lấy ID Admin
const { ownerId } = require('../../../config.json'); 

module.exports = {
    name: 'debug',
    description: 'Kiểm tra toàn bộ ảnh bị thiếu trong hệ thống (ADMIN ONLY)',
    
    async execute(client, message, args) {
        // 🛡️ BẢO MẬT: KIỂM TRA CHỦ SỞ HỮU
        // Nếu ID người chat KHÁC ID trong config -> Chặn luôn
        if (message.author.id !== ownerId) {
            return message.reply("❌ **CẢNH BÁO:** Bạn không có quyền dùng lệnh này!");
        }

        // --- NẾU LÀ ADMIN THÌ MỚI CHẠY TIẾP ĐOẠN DƯỚI ---

        let report = "=== BÁO CÁO CÁC FILE ẢNH CÒN THIẾU ===\n\n";
        let missingCount = 0;

        // 1. KIỂM TRA FOLDER GỐC
        const assetDirs = ['items', 'monsters', 'characters', 'backgrounds'];
        report += "[1] KIỂM TRA CẤU TRÚC THƯ MỤC:\n";
        
        assetDirs.forEach(dir => {
            const dirPath = path.join(__dirname, `../../../assets/${dir}`);
            if (!fs.existsSync(dirPath)) {
                report += `❌ Thiếu thư mục: src/assets/${dir} (Cần tạo mới)\n`;
                fs.mkdirSync(dirPath, { recursive: true });
                report += `   -> Đã tự động tạo: src/assets/${dir}\n`;
            } else {
                report += `✅ Đã có: src/assets/${dir}\n`;
            }
        });
        report += "\n--------------------------------------------------\n\n";

        // 2. KIỂM TRA ITEMS
        report += "[2] KIỂM TRA ẢNH VẬT PHẨM (items/*.png):\n";
        Object.keys(ITEMS).forEach(key => {
            const filePath = path.join(__dirname, `../../../assets/items/${key}.png`);
            if (!fs.existsSync(filePath)) {
                // Check name.vi vì giờ name là object đa ngôn ngữ
                const itemName = ITEMS[key].name.vi || ITEMS[key].name; 
                report += `❌ Thiếu: ${key}.png (Cho item: ${itemName})\n`;
                missingCount++;
            }
        });
        if (missingCount === 0) report += "✅ Đủ hết ảnh vật phẩm!\n";
        report += "\n--------------------------------------------------\n\n";

        // 3. KIỂM TRA MONSTERS
        report += "[3] KIỂM TRA ẢNH QUÁI VẬT (monsters/*.png):\n";
        let monsterMissing = 0;
        Object.values(ZONES).forEach(zone => {
            zone.monsters.forEach(m => {
                const fileName = m.imageFile || `${m.name.vi}.png`; 
                const filePath = path.join(__dirname, `../../../assets/monsters/${fileName}`);
                
                if (!fs.existsSync(filePath)) {
                    report += `❌ Thiếu: ${fileName} (Quái: ${m.name.vi || m.name})\n`;
                    monsterMissing++;
                    missingCount++;
                }
            });
        });
        if (monsterMissing === 0) report += "✅ Đủ hết ảnh quái vật!\n";
        report += "\n--------------------------------------------------\n\n";

        // 4. KIỂM TRA CHARACTERS
        report += "[4] KIỂM TRA NHÂN VẬT (characters/*.png):\n";
        const chars = ['scavenger.png', 'tribal.png', 'vandal.png'];
        chars.forEach(c => {
            const filePath = path.join(__dirname, `../../../assets/characters/${c}`);
            if (!fs.existsSync(filePath)) {
                const gifPath = filePath.replace('.png', '.gif');
                if (!fs.existsSync(gifPath)) {
                    report += `❌ Thiếu: ${c} (Hoặc file .gif tương ứng)\n`;
                    missingCount++;
                }
            }
        });
        report += "\n--------------------------------------------------\n\n";

        // 5. KIỂM TRA BACKGROUNDS
        report += "[5] KIỂM TRA BACKGROUNDS (backgrounds/*):\n";
        const bgs = ['profile_bg.png', 'falling_intro.gif'];
        bgs.forEach(bg => {
            const filePath = path.join(__dirname, `../../../assets/backgrounds/${bg}`);
            if (!fs.existsSync(filePath)) {
                if (bg.includes('falling_intro')) {
                     const pngPath = filePath.replace('.gif', '.png');
                     if (!fs.existsSync(pngPath)) {
                         report += `❌ Thiếu: ${bg} (Hoặc .png)\n`;
                         missingCount++;
                     }
                } else {
                    report += `❌ Thiếu: ${bg}\n`;
                    missingCount++;
                }
            }
        });

        report += `\n==================================================\n`;
        report += `TỔNG CỘNG THIẾU: ${missingCount} FILE\n`;
        
        const buffer = Buffer.from(report, 'utf-8');
        const attachment = new AttachmentBuilder(buffer, { name: 'missing_assets_report.txt' });

        message.reply({ 
            content: `🕵️ **Đã quét xong hệ thống!**\nPhát hiện thiếu **${missingCount}** file ảnh.\nXem chi tiết trong file đính kèm 👇`, 
            files: [attachment] 
        });
    }
};