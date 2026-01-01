const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String }, 
    balance: { type: Number, default: 0 }, // Tiền Galla
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    class: { type: String, default: 'Scavenger' }, // Class: Scavenger, Tribal...
    inventorySize: { type: Number, default: 20 }, // Giới hạn túi đồ
    joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);