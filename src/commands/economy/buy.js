const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS } = require('../../utils/items');
const { v4: uuidv4 } = require('uuid');
const { t, getName } = require('../../utils/locales');

module.exports = {
    name: 'buy',
    description: 'Mua vật phẩm theo ID. VD: .g buy 001',
    
    async execute(client, message, args) {
        const user = await User.findOne({ discordId: message.author.id });
        if (!user) return message.reply(t('error_no_user', 'vi'));
        const lang = user.language;

        if (!args[0]) return message.reply(t('shop_desc', lang, { prefix: '.g ' }));

        const inputId = args[0].toLowerCase();
        
        // --- TÌM ITEM THEO SHOP ID ---
        let targetKey = null;
        let itemInfo = null;

        // 1. Duyệt qua danh sách để tìm shopId trùng khớp
        for (const [key, item] of Object.entries(ITEMS)) {
            if (item.shopId === inputId) {
                targetKey = key;
                itemInfo = item;
                break;
            }
        }

        // 2. Nếu không tìm thấy shopId, thử tìm theo key gốc (fallback)
        if (!targetKey && ITEMS[inputId]) {
            targetKey = inputId;
            itemInfo = ITEMS[inputId];
        }
        // ------------------------------

        // 1. Kiểm tra tồn tại và có bán không
        if (!itemInfo || !itemInfo.price) {
            return message.reply(t('buy_fail_id', lang, { id: inputId }));
        }

        // 2. Kiểm tra tiền
        if (user.balance < itemInfo.price) {
            return message.reply(t('buy_fail_money', lang, { price: itemInfo.price, balance: user.balance }));
        }

        // 3. Trừ tiền
        user.balance -= itemInfo.price;
        await user.save();

        // 4. Thêm đồ vào kho
        const newItem = new Item({
            uid: uuidv4(),
            baseId: targetKey, // Lưu vào DB thì phải lưu Key gốc (vd: medkit)
            ownerId: user.discordId,
            stats: { 
                attack: itemInfo.damage || 0, 
                durability: 100, 
                potential: 0.5, 
                level: 1, 
                killCount: 0, 
                exp: 0 
            },
            ownerHistory: [{ userId: user.discordId }]
        });
        await newItem.save();

        message.reply(t('buy_success', lang, { item: getName(itemInfo.name, lang), price: itemInfo.price }));
    }
};