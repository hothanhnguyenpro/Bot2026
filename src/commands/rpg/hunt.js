const User = require('../../models/User');
const Item = require('../../models/Item');
const { ITEMS, getItem, MAX_LEVEL } = require('../../utils/items');
const { ZONES } = require('../../utils/zones');
const { t, getName } = require('../../utils/locales');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const fs = require('fs');
const { prefix } = require('../../../config.json');
const { v4: uuidv4 } = require('uuid');

const COOLDOWN = 15;
const BOSS_FEE = 36; // 🆕 Phí đánh Boss
const activeBattles = new Map();

module.exports = {
    name: 'hunt',
    description: 'Chiến đấu theo lượt (Pokemon Style)',
    
    async execute(client, message, args) {
        let user = await User.findOne({ discordId: message.author.id });
        const lang = user ? user.language : 'vi';

        if (!args[0]) return message.reply(t('error_syntax_hunt', lang));
        const route = parseInt(args[0]);
        if (isNaN(route) || route < 1 || route > 25) return message.reply(t('error_syntax_hunt', lang));

        if (!user) return message.reply(t('error_no_user', lang));

        // 🆕 CHECK PHÍ ĐÁNH BOSS (ROUTE 25)
        if (route === 25) {
            if (user.balance < BOSS_FEE) {
                return message.reply(`❌ **Không đủ tiền!** Cần **${BOSS_FEE} Galla** để khiêu chiến Boss.`);
            }
            // Trừ tiền ngay khi vào trận (để tránh spam hoặc thoát ra vào lại)
            user.balance -= BOSS_FEE;
            await user.save();
        }

        if (user.lastHunt) {
            const end = new Date(user.lastHunt).getTime() + (COOLDOWN * 1000);
            const now = Date.now();
            if (now < end) {
                const msg = await message.reply(t('error_cooldown', lang, { time: Math.floor(end/1000) }));
                setTimeout(() => msg.delete().catch(()=>{}), 3000);
                return;
            }
        }

        if (activeBattles.has(message.author.id)) {
            activeBattles.get(message.author.id).stop('new_session');
        }

        user.lastHunt = new Date();
        await user.save();

        const currentZoneId = user.currentZone || 1;
        const zoneData = ZONES[currentZoneId];
        if (!zoneData) return message.reply(t('error_zone_closed', lang));

        let monsterTemplate, isBoss = false;
        if (route === 25) {
            monsterTemplate = zoneData.monsters[zoneData.monsters.length - 1];
            isBoss = true;
        } else {
            const normal = zoneData.monsters.slice(0, -1);
            const max = Math.min(Math.floor(route / 6), normal.length - 1);
            monsterTemplate = normal[Math.floor(Math.random() * (max + 1))];
        }

        const monsterName = getName(monsterTemplate.name, lang); 

        const multiplier = zoneData.difficulty * (1 + route * 0.06);
        let mHP = Math.floor(monsterTemplate.basePower * 10 * multiplier);
        let mMaxHP = mHP;
        let mAtk = Math.floor(monsterTemplate.basePower * multiplier);
        let pHP = user.hp; // Dùng máu hiện tại của user
        let pMaxHP = user.maxHp;

        // Check nếu máu user <= 0 thì không cho đánh
        if (pHP <= 0) return message.reply("❌ Bạn đã kiệt sức! Hãy dùng `.g use` để hồi máu.");

        let weaponBase = null;
        let bonusAtk = 0;
        let skills = [{ name: { vi: 'Đấm Thường', en: 'Punch' }, power: 10 }];

        let equippedItem = null;
        if (user.equipment.weapon) {
            equippedItem = await Item.findOne({ uid: user.equipment.weapon });
            if (equippedItem) {
                weaponBase = getItem(equippedItem.baseId);
                bonusAtk = equippedItem.stats.attack;
                if (weaponBase && weaponBase.skills) skills = weaponBase.skills;
            }
        }

        const canvas = createCanvas(800, 450);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2c3e50'; ctx.fillRect(0, 0, 800, 450);
        
        try {
            const mFileName = monsterTemplate.imageFile || `${monsterTemplate.name.vi || monsterTemplate.name}.png`;
            const mPath = path.join(__dirname, `../../../assets/monsters/${mFileName}`);
            if (fs.existsSync(mPath)) {
                const img = await loadImage(mPath);
                ctx.drawImage(img, 50, 200, 200, 200);
            } else {
                ctx.fillStyle = '#e74c3c'; ctx.fillRect(50, 200, 200, 200);
            }
            let cName = 'scavenger.png';
            if (user.class === 'Tribal') cName = 'tribal.png';
            if (user.class === 'Vandal') cName = 'vandal.png';
            let cPath = path.join(__dirname, `../../../assets/characters/${cName}`);
            if (!fs.existsSync(cPath)) cPath = message.author.displayAvatarURL({ extension: 'png' });
            const pImg = await loadImage(cPath);
            ctx.shadowColor = "black"; ctx.shadowBlur = 15;
            ctx.drawImage(pImg, 550, 50, 220, 220);
            ctx.shadowBlur = 0;
            if (weaponBase) {
                const wPath = path.join(__dirname, `../../../assets/items/${weaponBase.id}.png`);
                if (fs.existsSync(wPath)) ctx.drawImage(await loadImage(wPath), 500, 100, 120, 120);
            }
        } catch (e) {}

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'battle.png' });

        let battleLog = t('battle_appear', lang, { monster: monsterName });
        if (route === 25) battleLog += `\n💸 **Phí vào cửa: -${BOSS_FEE} Galla**`; // Thông báo trừ tiền
        
        const getEmbed = () => new EmbedBuilder()
            .setTitle(t('battle_title', lang, { route }))
            .setDescription(battleLog)
            .setImage('attachment://battle.png')
            .addFields(
                { name: `👹 ${monsterName}`, value: `HP: **${mHP}**/${mMaxHP}`, inline: true },
                { name: `👤 ${user.username}`, value: `HP: **${pHP}**/${pMaxHP}`, inline: true }
            )
            .setColor(isBoss ? '#8e44ad' : '#3498db');

        const getButtons = (disabled = false) => {
            const row = new ActionRowBuilder();
            skills.slice(0, 4).forEach((s, i) => {
                const sName = getName(s.name, lang);
                row.addComponents(new ButtonBuilder().setCustomId(`s_${i}`).setLabel(sName).setStyle(ButtonStyle.Primary).setDisabled(disabled));
            });
            row.addComponents(new ButtonBuilder().setCustomId('flee').setLabel(lang==='vi'?'Chạy':'Flee').setStyle(ButtonStyle.Danger).setDisabled(disabled));
            return row;
        };

        const msg = await message.reply({ embeds: [getEmbed()], files: [attachment], components: [getButtons()] });
        const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 60000 });
        activeBattles.set(message.author.id, collector);

        collector.on('collect', async i => {
            if (i.customId === 'flee') {
                battleLog += `\n` + t('battle_flee', lang);
                await i.update({ embeds: [getEmbed()], components: [] });
                collector.stop('flee'); return;
            }

            const skill = skills[parseInt(i.customId.split('_')[1])];
            const skillName = getName(skill.name, lang);
            let dmg = Math.floor((user.level * 2) + skill.power + bonusAtk + Math.random()*10);
            
            let logLine = t('action_attack', lang, { skill: skillName, dmg });
            if (Math.random() < 0.1) { 
                dmg = Math.floor(dmg * 1.5); 
                logLine = `${t('battle_crit', lang)} ${logLine}`; 
            }
            battleLog = `👊 ${logLine}`;
            mHP -= dmg;

            if (mHP <= 0) {
                mHP = 0;
                user.hp = pHP; // Cập nhật máu còn lại vào DB
                await handleWin(i, user, monsterTemplate, multiplier, route, isBoss, lang, monsterName, equippedItem);
                collector.stop('win'); return;
            }

            let mDmg = Math.floor(mAtk * (0.8 + Math.random() * 0.4));
            pHP -= mDmg;
            battleLog += t('action_monster_attack', lang, { monster: monsterName, dmg: mDmg });

            if (pHP <= 0) {
                pHP = 0;
                user.hp = 0; // Chết
                await user.save();
                battleLog += `\n` + t('battle_lose', lang);
                await i.update({ embeds: [getEmbed()], components: [] });
                collector.stop('lose'); return;
            }

            await i.update({ embeds: [getEmbed()], components: [getButtons()] });
        });

        collector.on('end', (c, r) => {
            activeBattles.delete(message.author.id);
            if (r === 'new_session') msg.edit({ content: t('action_new_session', lang), components: [] });
            else if (r === 'time') msg.edit({ content: t('action_timeout', lang), components: [] });
        });
    }
};

async function handleWin(i, user, monster, multiplier, route, isBoss, lang, monsterName, equippedItem) {
    const money = Math.floor(monster.money * multiplier);
    const exp = Math.floor(monster.exp * multiplier);
    user.balance += money; 
    user.exp += exp;

    // --- CẬP NHẬT EXP VŨ KHÍ & TIẾN HÓA ---
    let weaponMsg = "";
    if (equippedItem) {
        // Logic vũ khí giữ nguyên
        equippedItem.stats.killCount += 1;
        if (equippedItem.stats.level < MAX_LEVEL) {
            equippedItem.stats.exp += 10 * multiplier;
            const wBase = ITEMS[equippedItem.baseId];
            const rarityMult = wBase.rarity || 1;
            const requiredExp = equippedItem.stats.level * 100 * rarityMult;
            
            if (equippedItem.stats.exp >= requiredExp) {
                equippedItem.stats.level += 1;
                equippedItem.stats.exp -= requiredExp;
                equippedItem.stats.attack += 5;
                const wName = getName(wBase.name, lang);
                weaponMsg = "\n" + t('weapon_levelup', lang, { item: wName, level: equippedItem.stats.level, bonus: 5 });

                if (equippedItem.stats.level === 25 && wBase.evolvesTo) {
                    const newItemId = wBase.evolvesTo;
                    const newItemBase = ITEMS[newItemId];
                    if (newItemBase) {
                        equippedItem.baseId = newItemId;
                        equippedItem.stats.attack += 50; 
                        const newName = getName(newItemBase.name, lang);
                        weaponMsg += "\n" + t('weapon_evolve', lang, { oldItem: wName, newItem: newName });
                    }
                }
            }
        }
        await equippedItem.save();
    }

    // --- DROP ITEM ---
    let dropMsg = "";
    // (Logic drop giữ nguyên)
    let dropChance = route === 25 ? 0.3 : 0.05; 
    if (Math.random() < dropChance) {
        const roll = Math.random() * 100;
        let selectedTier = 3;
        if (route === 25) { // Boss drop xịn hơn
            if (roll < 1) selectedTier = 7;
            else if (roll < 6) selectedTier = 6;
            else if (roll < 46) selectedTier = 5;
            else selectedTier = 4;
        } else {
            if (roll < 0.1) selectedTier = 6;
            else if (roll < 1.1) selectedTier = 5;
            else if (roll < 21.1) selectedTier = 4;
            else selectedTier = 3;
        }
        const validItems = Object.keys(ITEMS).filter(k => ITEMS[k].rarity === selectedTier && ITEMS[k].canDrop);
        if (validItems.length === 0) {
            const backupItems = Object.keys(ITEMS).filter(k => ITEMS[k].rarity === 3);
            if (backupItems.length > 0) validItems.push(...backupItems);
        }
        if (validItems.length > 0) {
            const baseId = validItems[Math.floor(Math.random() * validItems.length)];
            const base = ITEMS[baseId];
            const atkBonus = route === 25 ? 1.1 : 1.0; 
            const newItem = new Item({
                uid: uuidv4(), baseId: baseId, ownerId: user.discordId,
                stats: { 
                    attack: Math.floor((base.damage || 10) * atkBonus * (0.9 + Math.random() * 0.2)), 
                    durability: 100, potential: Math.random(), 
                    level: 1, killCount: 0, exp: 0 
                },
                ownerHistory: [{ userId: user.discordId }]
            });
            await newItem.save();
            dropMsg = t('battle_drop', lang, { item: getName(base.name, lang) });
        }
    }

    // --- LEVEL UP USER ---
    let lvMsg = "";
    while (user.exp >= user.level * 100) {
        user.exp -= user.level * 100;
        user.level++;
        user.maxHp += 100;
        user.hp = user.maxHp; 
        // ... trong vòng lặp while
user.balance += 100 * user.level; // SỬA: 500 -> 100
lvMsg += `\n🎉 **UP LEVEL ${user.level}!** (+100 HP, +${100 * user.level} Galla)`; // Sửa Text
// ...
    }

    // --- 🆕 MỞ KHÓA ZONE (KHÔNG TỰ CHUYỂN) ---
    if (isBoss && user.currentZone === user.maxZone && user.maxZone < 5) {
        user.maxZone++; 
        // Chỉ tăng maxZone, KHÔNG tăng currentZone
        lvMsg += `\n🔓 **Đã mở khóa Zone ${user.maxZone}!** (Dùng lệnh \`.g zone\` để di chuyển)`;
    }

    await user.save();
    
    const embed = new EmbedBuilder()
        .setTitle(t('battle_win', lang))
        .setDescription(t('battle_result', lang, { monster: monsterName, money, exp }) + dropMsg + lvMsg + weaponMsg)
        .setColor('#f1c40f')
        .setImage('attachment://battle.png');

    await i.update({ embeds: [embed], components: [] });
}