const User = require('../../models/User');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ZONES } = require('../../utils/zones');
const { t, getName } = require('../../utils/locales');

const TRAVEL_COST = 200;

module.exports = {
    name: 'zone',
    description: 'Chuyển đổi khu vực săn quái (Phí 200 Galla)',
    
    async execute(client, message, args) {
        const user = await User.findOne({ discordId: message.author.id });
        if (!user) return message.reply("❌ Chưa tạo nhân vật!");
        
        const lang = user.language || 'vi';
        const currentZoneId = user.currentZone || 1;
        const maxZoneId = user.maxZone || 1;

        const currentZoneData = ZONES[currentZoneId] || { name: { vi: 'Vùng Đất Lạ', en: 'Unknown Land' } };
        const zoneName = getName(currentZoneData.name, lang);

        // 1. TẠO EMBED CHÍNH
        const embed = new EmbedBuilder()
            .setTitle(t('zone_title', lang))
            .setDescription(t('zone_desc', lang, { 
                current: currentZoneId, 
                name: zoneName,
                max: maxZoneId 
            }))
            .setColor('#3498db');

        // 2. TẠO HÀNG NÚT
        const row = new ActionRowBuilder();
        for (let i = 1; i <= 5; i++) {
            const isLocked = i > maxZoneId;
            const isCurrent = i === currentZoneId;
            
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`zone_${i}`)
                    .setLabel(t('zone_btn_label', lang, { zone: i }))
                    .setStyle(isCurrent ? ButtonStyle.Success : (isLocked ? ButtonStyle.Secondary : ButtonStyle.Primary))
                    .setDisabled(isLocked || isCurrent)
                    .setEmoji(isLocked ? '🔒' : '📍') // Đã sửa lỗi Emoji
            );
        }

        const msg = await message.reply({ embeds: [embed], components: [row] });

        // 3. XỬ LÝ SỰ KIỆN CHỌN ZONE
        const filter = i => i.user.id === message.author.id;
        
        // Chỉ nhận 1 lần bấm chọn Zone để tránh lỗi xung đột
        const collector = msg.createMessageComponentCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', async i => {
            try {
                // Chặn nếu interaction đã được xử lý (Fix lỗi 40060)
                if (i.replied || i.deferred) return;

                const selectedZone = parseInt(i.customId.split('_')[1]);

                // Check tiền
                if (user.balance < TRAVEL_COST) {
                    return i.reply({ content: t('zone_fail_money', lang), ephemeral: true });
                }

                // --- HIỆN BẢNG XÁC NHẬN ---
                const confirmEmbed = new EmbedBuilder()
                    .setTitle(t('zone_confirm_title', lang))
                    .setDescription(t('zone_confirm_desc', lang, { 
                        zone: selectedZone, 
                        newBal: (user.balance - TRAVEL_COST).toLocaleString() 
                    }))
                    .setColor('#f1c40f');

                const confirmRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('confirm_yes').setLabel('✅ OK').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('confirm_no').setLabel('❌ Cancel').setStyle(ButtonStyle.Danger)
                );

                // Cập nhật tin nhắn sang dạng xác nhận
                await i.update({ embeds: [confirmEmbed], components: [confirmRow] });

                // --- COLLECTOR CON (XỬ LÝ YES/NO) ---
                const confirmCollector = msg.createMessageComponentCollector({ 
                    filter: subI => subI.user.id === message.author.id, 
                    time: 15000, 
                    max: 1 
                });

                confirmCollector.on('collect', async subI => {
                    try {
                        if (subI.replied || subI.deferred) return; // Chặn double click

                        if (subI.customId === 'confirm_yes') {
                            // TRỪ TIỀN & LƯU DB
                            user.balance -= TRAVEL_COST;
                            user.currentZone = selectedZone;
                            await user.save();

                            const successEmbed = new EmbedBuilder()
                                .setTitle("✈️ TRAVEL SUCCESS")
                                .setDescription(t('zone_success', lang, { zone: selectedZone }))
                                .setColor('#2ecc71');

                            await subI.update({ embeds: [successEmbed], components: [] });
                        } else {
                            // HỦY
                            await subI.update({ content: t('zone_cancel', lang), embeds: [], components: [] });
                        }
                    } catch (err) {
                        console.error("Zone Confirm Error:", err);
                    }
                });

            } catch (error) {
                console.error("Zone Main Error:", error);
                // Nếu lỗi, thử gửi tin nhắn báo lỗi (nếu chưa reply)
                if (!i.replied) i.reply({ content: "❌ Có lỗi xảy ra, vui lòng thử lại.", ephemeral: true }).catch(()=>{});
            }
        });

        collector.on('end', (collected, reason) => {
            // Chỉ xóa nút nếu chưa có ai bấm (hết giờ)
            if (reason === 'time' && msg.editable) {
                msg.edit({ components: [] }).catch(()=>{});
            }
        });
    }
};