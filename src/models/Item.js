const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    // UID: Mã định danh duy nhất (VD: uuid-v4)
    uid: { type: String, required: true, unique: true }, 
    
    // BaseID: Để map với file utils/items.js (VD: "brick", "katana")
    baseId: { type: String, required: true },
    
    // OwnerID: Discord ID của người sở hữu hiện tại
    ownerId: { type: String, required: true, index: true }, // Thêm index để tìm đồ cho nhanh
    
    // Chỉ số động (Riêng biệt cho từng món)
    stats: {
        attack: { type: Number, default: 0 },    // Sát thương cộng thêm
        durability: { type: Number, default: 100 }, 
        potential: { type: Number, default: 0 }, // 0.0 - 1.0 (Độ thức tỉnh Jinki)
        killCount: { type: Number, default: 0 }, // Đã giết bao nhiêu quái
        exp: { type: Number, default: 0 },       // Nuôi rác
        level: { type: Number, default: 1 }      // Cấp độ của món đồ
    },

    // Lịch sử người cầm (Quan trọng cho cốt truyện)
    ownerHistory: [{ 
        userId: String, 
        receivedAt: { type: Date, default: Date.now } 
    }],

    isEquipped: { type: Boolean, default: false }, // Đang cầm hay đang cất?

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);