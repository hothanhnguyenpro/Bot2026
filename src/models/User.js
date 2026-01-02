const mongoose = require('mongoose');
const InventoryItemSchema = require('./InventoryItem'); 

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String },
    class: { type: String, default: 'Scavenger' },
    level: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    
    // Chỉ số chiến đấu
    hp: { type: Number, default: 100 },
    maxHp: { type: Number, default: 100 }, 
    strength: { type: Number, default: 10 },

    inventory: [InventoryItemSchema], 
    equipment: { weapon: { type: String, default: null } },
    
    currentZone: { type: Number, default: 1 }, 
    maxZone: { type: Number, default: 1 },     
    lastHunt: { type: Date, default: null },

    createdAt: { type: Date, default: Date.now },
    language: { type: String, default: 'vi' },

    // 👇 THÊM PHẦN CÀI ĐẶT NÀY 👇
    settings: {
        disableSellWarning: { type: Boolean, default: false } // false = vẫn hiện cảnh báo
    }
});

module.exports = mongoose.model('User', userSchema);