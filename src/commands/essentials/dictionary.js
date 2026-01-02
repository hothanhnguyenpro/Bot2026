const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    AttachmentBuilder 
} = require('discord.js');
const { ITEMS } = require('../../utils/items');
const path = require('path');
const fs = require('fs');
const User = require('../../models/User'); // Import User để lấy ngôn ngữ
const { t, getName, getDesc } = require('../../utils/locales'); // Import các hàm dịch

module.exports = {
    name: 'dictionary',
    description: 'Tra cứu bách khoa toàn thư về Vật Phẩm & Vũ Khí',
    aliases: ['dict', 'wiki'], 

    async execute(client, message, args) {
        // Lấy thông tin user để biết ngôn ngữ
        const user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi'; // Mặc định 'vi'

        // 1. Chuyển đổi ITEMS từ Object sang Array
        const itemsList = Object.keys(ITEMS).map(key => ({
            id: key,
            ...ITEMS[key]
        }));

        if (itemsList.length === 0) return message.reply(t('dict_empty', lang) || "❌ Game chưa có vật phẩm nào!");

        // 2. Biến theo dõi trang
        let currentPage = 0;
        const totalPages = itemsList.length;

        // 3. Hàm tạo Embed hiển thị
        const generateEmbed = async (pageIndex) => {
            const item = itemsList[pageIndex];
            
            // Tìm ảnh
            const imagePath = path.join(__dirname, `../../../assets/items/${item.id}.png`);
            let fileAttachment = null;
            let imageUrl = 'https://i.imgur.com/3Zn3e5n.png'; 

            if (fs.existsSync(imagePath)) {
                fileAttachment = new AttachmentBuilder(imagePath, { name: 'item_image.png' });
                imageUrl = 'attachment://item_image.png';
            }

            // Lấy Tên và Mô tả đa ngôn ngữ
            const iName = getName(item.name, lang);
            const iDesc = getDesc(item.description, lang);

            // Tạo danh sách Kỹ năng (nếu có) - Đa ngôn ngữ
            let skillText = t('dict_skill_none', lang);
            if (item.skills && item.skills.length > 0) {
                skillText = item.skills.map(s => `🔹 **${getName(s.name, lang)}**: Power ${s.power}`).join('\n');
            }

            // Màu sắc
            const colors = { 1: '#95a5a6', 2: '#2ecc71', 3: '#3498db', 4: '#9b59b6', 5: '#f1c40f', 6: '#e74c3c', 7: '#ff0000', 8: '#000000' };
            
            const embed = new EmbedBuilder()
                .setTitle(t('dict_title', lang, { item: iName.toUpperCase() }))
                .setDescription(`*${iDesc || t('dict_desc_none', lang)}*`)
                .setColor(colors[item.rarity] || '#ffffff')
                .addFields(
                    { name: t('dict_type', lang) || 'Loại', value: item.type === 'weapon' ? t('dict_type_weapon', lang) : t('dict_type_material', lang), inline: true },
                    { name: t('dict_rarity', lang), value: `${getRarityName(item.rarity, lang)}`, inline: true },
                    { name: t('dict_damage', lang), value: `💥 ${item.damage || 0}`, inline: true },
                    { name: t('dict_skill', lang), value: skillText, inline: false }
                )
                .setImage(imageUrl)
                .setFooter({ text: t('dict_footer', lang, { page: pageIndex + 1, total: totalPages, id: item.id }) });

            return { embed, file: fileAttachment };
        };

        // 4. Hàm tạo Hàng Nút Bấm (Đa ngôn ngữ cho Label nút)
        const generateButtons = (curr, total) => {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('first')
                        .setLabel(t('btn_first', lang))
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(curr === 0),
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel(t('btn_prev', lang))
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(curr === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel(t('btn_next', lang))
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(curr === total - 1),
                    new ButtonBuilder()
                        .setCustomId('last')
                        .setLabel(t('btn_last', lang))
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(curr === total - 1)
                );
            return row;
        };

        // 5. Gửi tin nhắn đầu tiên
        const data = await generateEmbed(currentPage);
        const initialMsg = await message.reply({ 
            embeds: [data.embed], 
            components: [generateButtons(currentPage, totalPages)],
            files: data.file ? [data.file] : []
        });

        // 6. Xử lý sự kiện
        const collector = initialMsg.createMessageComponentCollector({
            filter: i => i.user.id === message.author.id,
            time: 300000
        });

        collector.on('collect', async i => {
            if (i.customId === 'first') currentPage = 0;
            if (i.customId === 'prev' && currentPage > 0) currentPage--;
            if (i.customId === 'next' && currentPage < totalPages - 1) currentPage++;
            if (i.customId === 'last') currentPage = totalPages - 1;

            const newData = await generateEmbed(currentPage);
            
            await i.update({
                embeds: [newData.embed],
                components: [generateButtons(currentPage, totalPages)],
                files: newData.file ? [newData.file] : []
            });
        });

        collector.on('end', () => {
            initialMsg.edit({ components: [] });
        });
    }
};

// Helper function tên độ hiếm (Đa ngôn ngữ)
function getRarityName(r, lang) {
    // Dùng key rarity_1, rarity_2 trong locales.js
    return t(`rarity_${r}`, lang) || `Tier ${r}`;
}