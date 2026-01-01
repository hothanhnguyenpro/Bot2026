const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    // UID riêng biệt cho từng món đồ (để định danh hàng độc bản)
    uid: { type: String, required: true, unique: true }, 
    
    // ID gốc (ví dụ: "plastic_bottle") để biết nó là cái gì
    baseId: { type: String, required: true },
    
    // Chủ sở hữu hiện tại (Discord ID)
    ownerId: { type: String, required: true },
    
    // Chỉ số động (Dynamic Stats) - Dùng Map để linh hoạt
    stats: {
        attack: { type: Number, default: 0 },
        durability: { type: Number, default: 100 }, // Độ bền
        potential: { type: Number, default: 0 },    // Chỉ số tiềm năng (0.0 - 1.0)
        killCount: { type: Number, default: 0 },    // Đã giết bao nhiêu quái
        exp: { type: Number, default: 0 }           // XP đã bơm vào (cho tính năng nuôi rác)
    },

    // Lịch sử sở hữu (Lưu danh sách ID những người từng cầm món này)
    ownerHistory: [{ type: String }],

    // Thời gian tạo ra món đồ này
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);