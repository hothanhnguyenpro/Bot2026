const mongoose = require('mongoose');

// Định nghĩa cấu trúc của 1 món đồ trong túi (Inventory)
const InventoryItemSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        default: 1 
    },
    // Sau này muốn thêm tính năng "Độ bền" hay "Đã cường hóa +1" thì thêm vào đây dễ hơn
    durability: { 
        type: Number, 
        default: 100 
    }
}, { _id: false }); // _id: false để không tạo ID rác cho từng món đồ, tiết kiệm bộ nhớ

module.exports = InventoryItemSchema;