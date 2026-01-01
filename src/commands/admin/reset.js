const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const User = require('../../models/User');
const Item = require('../../models/Item');
const { ownerId } = require('../../../config.json');

module.exports = {
    name: 'reset',
    description: 'Xóa toàn bộ dữ liệu nhân vật (Chỉ Admin)',
    
    async execute(client, message, args) {
        // 1. CHỐT CHẶN BẢO MẬT: Chỉ chủ bot mới được dùng
        if (message.author.id !== ownerId) {
            return message.reply('⛔ **Lỗi quyền hạn:** Chỉ có Nhà phát triển (Owner) mới được dùng lệnh này!');
        }

        // 2. Xác định đối tượng cần xóa
        // Nếu gõ ".g reset" -> Xóa chính mình
        // Nếu gõ ".g reset @User" -> Xóa người đó (sau này dùng để ban hack)
        const targetId = message.mentions.users.first() ? message.mentions.users.first().id : message.author.id;

        // 3. Hỏi xác nhận lần cuối (Cho chắc ăn)
        const confirmEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('⚠️ CẢNH BÁO NGUY HIỂM')
            .setDescription(`Bạn có chắc chắn muốn **XÓA VĨNH VIỄN** dữ liệu của <@${targetId}> không?\n\nHành động này không thể hoàn tác:\n- Mất toàn bộ Level, Tiền.\n- Mất sạch Túi đồ, Jinki.`)
            .setFooter({ text: 'Bạn có 15 giây để quyết định.' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('confirm_reset').setLabel('XÓA NGAY').setStyle(ButtonStyle.Danger).setEmoji('🗑️'),
            new ButtonBuilder().setCustomId('cancel_reset').setLabel('Hủy bỏ').setStyle(ButtonStyle.Secondary)
        );

        const reply = await message.reply({ embeds: [confirmEmbed], components: [row] });

        // 4. Xử lý nút bấm
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 15000,
            filter: (i) => i.user.id === message.author.id // Chỉ người gõ lệnh mới bấm được
        });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'cancel_reset') {
                await interaction.update({ content: '✅ Đã hủy thao tác xóa.', embeds: [], components: [] });
                return;
            }

            if (interaction.customId === 'confirm_reset') {
                try {
                    // --- BẮT ĐẦU THANH TRỪNG ---
                    
                    // Xóa User trong bảng Users
                    const deletedUser = await User.findOneAndDelete({ discordId: targetId });
                    
                    // Xóa tất cả Item của User đó trong bảng Items
                    const deletedItems = await Item.deleteMany({ ownerId: targetId });

                    if (!deletedUser) {
                        return interaction.update({ content: '❌ Người này chưa có dữ liệu để xóa!', embeds: [], components: [] });
                    }

                    await interaction.update({
                        content: `♻️ **HOÀN TẤT!**\nĐã xóa dữ liệu của <@${targetId}>.\n- User Profile: Đã bay màu.\n- Items: Đã đốt ${deletedItems.deletedCount} món đồ.\n\nGiờ bạn có thể gõ \`.g start\` để chơi lại từ đầu!`,
                        embeds: [],
                        components: []
                    });
                    
                } catch (error) {
                    console.error(error);
                    interaction.reply('❌ Lỗi Database khi xóa!');
                }
            }
        });
    }
};