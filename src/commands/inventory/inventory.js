const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS } = require('../../utils/items');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { prefix } = require('../../../config.json');
const { t, getName } = require('../../utils/locales'); // Import hàm dịch

module.exports = {
    name: 'inventory',
    description: 'Xem túi đồ (có phân trang)',
    aliases: ['inv', 'bag'], 

    async execute(client, message, args) {
        // Lấy ngôn ngữ
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi';

        if (!user) return message.reply(t('error_no_user', lang));

        // Lấy danh sách đồ
        const items = await Item.find({ ownerId: message.author.id }).sort({ 'stats.level': -1, baseId: 1 });
        
        if (items.length === 0) {
            return message.reply(t('inv_empty', lang)); // Key chung đã có
        }

        const ITEMS_PER_PAGE = 5;
        let currentPage = 0;
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

        const generateEmbed = (page) => {
            const start = page * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentItems = items.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle(t('inv_title', lang, { name: user.username.toUpperCase() }))
                .setDescription(t('inv_equipped_label', lang, { 
                    item: getEquippedName(user, items, lang), 
                    count: items.length 
                }))
                .setColor('#3498db')
                .setFooter({ text: t('inv_footer', lang, { page: page + 1, total: totalPages, prefix: prefix }) });

            let listString = "";
            currentItems.forEach((item, index) => {
                // --- ĐOẠN FIX LỖI CRASH ---
                let itemInfo = ITEMS[item.baseId];
                
                // Nếu không tìm thấy thông tin item
                if (!itemInfo) {
                    itemInfo = { 
                        name: t('inv_item_error', lang, { id: item.baseId }), 
                        rarity: 1 
                    };
                }
                // ---------------------------

                // Lấy tên item theo ngôn ngữ
                const iName = getName(itemInfo.name, lang);

                const globalIndex = start + index + 1;
                let statusIcon = "";
                if (item.uid === user.equipment.weapon) statusIcon = t('inv_item_equipped_status', lang);

                listString += `**[${globalIndex}] ${iName}** ${statusIcon}\n`;
                listString += t('inv_item_details', lang, { 
                    rarity: getRarityName(itemInfo.rarity, lang), 
                    atk: item.stats.attack, 
                    pot: Math.floor(item.stats.potential * 100) 
                }) + '\n';
            });

            embed.setDescription(embed.data.description + "\n\n" + listString);
            return embed;
        };

        const generateButtons = (page) => {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('prev').setLabel('⬅️').setStyle(ButtonStyle.Primary).setDisabled(page === 0),
                    new ButtonBuilder().setCustomId('next').setLabel('➡️').setStyle(ButtonStyle.Primary).setDisabled(page === totalPages - 1)
                );
            return row;
        };

        const reply = await message.reply({ 
            embeds: [generateEmbed(currentPage)], 
            components: [generateButtons(currentPage)] 
        });

        const collector = reply.createMessageComponentCollector({
            filter: i => i.user.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async i => {
            if (i.customId === 'prev') currentPage--;
            if (i.customId === 'next') currentPage++;
            await i.update({ embeds: [generateEmbed(currentPage)], components: [generateButtons(currentPage)] });
        });

        collector.on('end', () => reply.edit({ components: [] }));
    }
};

// Helper: Lấy tên vũ khí đang cầm (Có hỗ trợ ngôn ngữ)
function getEquippedName(user, allItems, lang) {
    if (!user.equipment.weapon) return t('inv_equipped_none', lang);
    const equippedItem = allItems.find(i => i.uid === user.equipment.weapon);
    if (equippedItem && ITEMS[equippedItem.baseId]) {
        return getName(ITEMS[equippedItem.baseId].name, lang);
    }
    return t('inv_equipped_unknown', lang);
}

// Helper: Lấy tên độ hiếm (Có hỗ trợ ngôn ngữ - Dùng lại key rarity_1, rarity_2...)
function getRarityName(r, lang) {
    // Lưu ý: Key trong locales.js là rarity_1, rarity_2...
    // Nếu r = 6 (SM) thì key là rarity_6
    return t(`rarity_${r}`, lang) || `Tier ${r}`;
}