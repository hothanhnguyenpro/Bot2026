const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS } = require('../../utils/items');
const { prefix } = require('../../../config.json');
const { t, getName } = require('../../utils/locales'); // Import hàm dịch

module.exports = {
    name: 'equip',
    description: 'Trang bị vũ khí theo số thứ tự trong túi. VD: .g equip 1',
    
    async execute(client, message, args) {
        // Lấy user trước để xác định ngôn ngữ hiển thị lỗi
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi';

        // 1. Kiểm tra input
        if (!args[0]) return message.reply(t('equip_syntax', lang, { prefix }));
        
        const index = parseInt(args[0]) - 1; // Người dùng nhập 1 -> Index 0
        if (isNaN(index) || index < 0) return message.reply(t('equip_invalid_index', lang));

        if (!user) return message.reply(t('error_no_user', lang));

        // 2. Lấy danh sách đồ (Phải sort GIỐNG HỆT lệnh inventory thì số mới khớp)
        const items = await Item.find({ ownerId: message.author.id }).sort({ 'stats.level': -1, baseId: 1 });

        if (index >= items.length) {
            return message.reply(t('equip_item_not_found', lang, { index: index + 1 }));
        }

        // 3. Lấy món đồ cần cầm
        const selectedItem = items[index];
        const itemInfo = ITEMS[selectedItem.baseId];
        
        // Lấy tên item theo ngôn ngữ
        const iName = getName(itemInfo.name, lang);

        // 4. Cập nhật Database
        // Cập nhật trạng thái item cũ (nếu có)
        if (user.equipment.weapon) {
            await Item.updateOne({ uid: user.equipment.weapon }, { isEquipped: false });
        }

        // Lưu UID của món đồ độc bản vào user
        user.equipment.weapon = selectedItem.uid;
        await user.save();

        // Cập nhật trạng thái item mới
        selectedItem.isEquipped = true;
        await selectedItem.save();

        message.reply(t('equip_success_msg', lang, { 
            item: iName, 
            uid: selectedItem.uid.split('-')[0], 
            atk: selectedItem.stats.attack 
        }));
    }
};