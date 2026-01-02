// src/utils/items.js

const MAX_LEVEL = 99; // Cấp tối đa

const ITEMS = {
    // ============================================================
    // TIER 1: COMMON (RÁC) -> TIẾN HÓA THÀNH TIER 2-3
    // ============================================================
    'trash_can': {
        name: { vi: "Lon Nước Rỗng", en: "Empty Can" },
        rarity: 1, damage: 2, canDrop: true, type: 'weapon',
        evolvesTo: 'titanium_can',
        description: { vi: "Một cái lon nhôm móp méo.", en: "A dented aluminum can." },
        skills: [{ name: { vi: 'Ném Lon', en: 'Can Throw' }, power: 5 }]
    },
    'brick': {
        name: { vi: "Cục Gạch Ống", en: "Red Brick" },
        rarity: 1, damage: 3, canDrop: true, type: 'weapon',
        evolvesTo: 'vibranium_brick',
        description: { vi: "Vũ khí huyền thoại của các 'giang hồ thôn'.", en: "Legendary weapon of street thugs." },
        skills: [{ name: { vi: 'Phang Gạch', en: 'Brick Smash' }, power: 8 }]
    },
    'branch': {
        name: { vi: "Cành Cây Khô", en: "Dry Branch" },
        rarity: 1, damage: 2, canDrop: true, type: 'weapon',
        evolvesTo: 'world_tree_twig',
        description: { vi: "Nhặt ở ven đường, dùng để chọc chó.", en: "Found by the road, used to poke dogs." },
        skills: [{ name: { vi: 'Vụt Nhẹ', en: 'Light Poke' }, power: 4 }]
    },
    'slipper': {
        name: { vi: "Dép Tổ Ong", en: "Honeycomb Slipper" },
        rarity: 1, damage: 5, canDrop: true, type: 'weapon',
        evolvesTo: 'gucci_slipper',
        description: { vi: "Có 100 lỗ thông hơi. Sát thương tâm lý cực cao.", en: "Legendary Vietnamese slipper." },
        skills: [{ name: { vi: 'Phi Dép', en: 'Slipper Shot' }, power: 10 }]
    },
    'newspaper': {
        name: { vi: "Báo Cũ Cuộn Tròn", en: "Rolled Newspaper" },
        rarity: 1, damage: 1, canDrop: true, type: 'weapon',
        evolvesTo: 'death_note',
        description: { vi: "Dùng để đập ruồi thì tốt hơn là đánh quái.", en: "Better for swatting flies than monsters." },
        skills: [{ name: { vi: 'Đập Ruồi', en: 'Swat' }, power: 3 }]
    },

    // ============================================================
    // TIER 2: UNCOMMON (DỤNG CỤ) -> TIẾN HÓA THÀNH TIER 3-4
    // ============================================================
    'fake_gloves': {
        name: { vi: "Găng Tay 3R Fake", en: "Fake 3R Gloves" },
        rarity: 2, damage: 8, canDrop: true, type: 'weapon',
        evolvesTo: 'champion_gloves',
        description: { vi: "Hàng chợ trời, đeo vào đấm hơi êm tay.", en: "Cheap knock-off gloves." },
        skills: [{ name: { vi: 'Đấm Móc', en: 'Uppercut' }, power: 15 }]
    },
    'pipe': {
        name: { vi: "Tuýp Sắt Rỉ", en: "Rusty Pipe" },
        rarity: 2, damage: 10, canDrop: true, type: 'weapon',
        evolvesTo: 'dragon_pipe',
        description: { vi: "Nặng trịch, dính uốn ván nếu bị đánh trúng.", en: "Heavy and rusty. Tetanus hazard." },
        skills: [{ name: { vi: 'Vụt Mạnh', en: 'Heavy Swing' }, power: 18 }]
    },
    'wrench': {
        name: { vi: "Cờ Lê To", en: "Big Wrench" },
        rarity: 2, damage: 9, canDrop: true, type: 'weapon',
        evolvesTo: 'mecha_wrench',
        description: { vi: "Vừa sửa xe vừa sửa mặt quái vật.", en: "Fixes cars and monster faces." },
        skills: [{ name: { vi: 'Siết Ốc', en: 'Tighten' }, power: 16 }]
    },
    'kitchen_knife': {
        name: { vi: "Dao Bếp Cùn", en: "Dull Kitchen Knife" },
        rarity: 2, damage: 11, canDrop: true, type: 'weapon',
        evolvesTo: 'chef_ramsay_knife',
        description: { vi: "Mượn tạm của mẹ, nhớ trả không bị mắng.", en: "Borrowed from mom." },
        skills: [{ name: { vi: 'Chém Bừa', en: 'Wild Slash' }, power: 20 }]
    },
    'baseball_bat': {
        name: { vi: "Gậy Bóng Chày", en: "Baseball Bat" },
        rarity: 2, damage: 12, canDrop: true, type: 'weapon',
        evolvesTo: 'spiked_bat_mk2',
        description: { vi: "Bằng gỗ sồi chắc chắn. Bonk!", en: "Solid oak wood. Bonk!" },
        skills: [{ name: { vi: 'Home Run', en: 'Home Run' }, power: 22 }]
    },

    // ============================================================
    // TIER 3: RARE (VŨ KHÍ THÔ SƠ) -> TIẾN HÓA THÀNH TIER 4-5
    // ============================================================
    'crowbar': {
        name: { vi: "Xà Beng Freeman", en: "Freeman Crowbar" },
        rarity: 3, damage: 18, canDrop: true, type: 'weapon',
        evolvesTo: 'gordon_crowbar',
        description: { vi: "Vật lý trị liệu cho quái vật.", en: "Physical therapy for monsters." },
        skills: [{ name: { vi: 'Cạy Cửa', en: 'Pry Open' }, power: 25 }, { name: { vi: 'Vụt Đầu', en: 'Head Smash' }, power: 30 }]
    },
    'machete': {
        name: { vi: "Mã Tấu", en: "Machete" },
        rarity: 3, damage: 20, canDrop: true, type: 'weapon',
        evolvesTo: 'jungle_king_blade',
        description: { vi: "Sắc bén, chuyên dùng để phát quang bụi rậm.", en: "Sharp blade for clearing bushes." },
        skills: [{ name: { vi: 'Chém Ngang', en: 'Horizontal Slash' }, power: 28 }, { name: { vi: 'Chém Dọc', en: 'Vertical Slash' }, power: 28 }]
    },
    'taser_bat': {
        name: { vi: "Dùi Cui Điện", en: "Stun Baton" },
        rarity: 3, damage: 16, canDrop: true, type: 'weapon',
        evolvesTo: 'thunder_rod',
        description: { vi: "Bzzzt! Tê liệt toàn thân.", en: "Bzzzt! Paralyzing shock." },
        skills: [{ name: { vi: 'Chích Điện', en: 'Shock' }, power: 25 }, { name: { vi: 'Sốc Tim', en: 'Cardiac Arrest' }, power: 32 }]
    },
    'fire_axe': {
        name: { vi: "Rìu Cứu Hỏa", en: "Fire Axe" },
        rarity: 3, damage: 22, canDrop: true, type: 'weapon',
        evolvesTo: 'inferno_axe',
        description: { vi: "Phá cửa cứu người, hoặc phá đầu zombie.", en: "Breach doors or zombie heads." },
        skills: [{ name: { vi: 'Bổ Củi', en: 'Chop' }, power: 35 }, { name: { vi: 'Gạt Chân', en: 'Leg Sweep' }, power: 20 }]
    },
    'spiked_shield': {
        name: { vi: "Khiên Gai", en: "Spiked Shield" },
        rarity: 3, damage: 15, canDrop: true, type: 'weapon',
        evolvesTo: 'rhino_shield',
        description: { vi: "Vừa đỡ vừa đâm. Công thủ toàn diện.", en: "Defend and attack. Versatile." },
        skills: [{ name: { vi: 'Húc Khiên', en: 'Shield Bash' }, power: 20 }, { name: { vi: 'Phản Đòn', en: 'Counter' }, power: 30 }]
    },

    // ============================================================
    // TIER 4: EPIC (QUÂN DỤNG) -> TIẾN HÓA THÀNH TIER 5-6
    // ============================================================
    'katana': {
        name: { vi: "Huyết Kiếm Katana", en: "Blood Katana" },
        rarity: 4, damage: 35, canDrop: true, type: 'weapon',
        evolvesTo: 'demon_slayer_katana',
        description: { vi: "Lưỡi kiếm đỏ rực, chém sắt như chém bùn.", en: "Glowing red blade." },
        skills: [{ name: { vi: 'Rút Kiếm', en: 'Iaido' }, power: 40 }, { name: { vi: 'Tam Đoạn Trảm', en: 'Triple Slash' }, power: 55 }]
    },
    'sniper_rifle': {
        name: { vi: "Súng Tỉa AWM", en: "AWM Sniper" },
        rarity: 4, damage: 45, canDrop: true, type: 'weapon',
        evolvesTo: 'gauss_rifle',
        description: { vi: "Một viên một mạng.", en: "One shot one kill." },
        skills: [{ name: { vi: 'Ngắm Bắn', en: 'Aim Shot' }, power: 30 }, { name: { vi: 'Headshot', en: 'Headshot' }, power: 70 }]
    },
    'chainsaw': {
        name: { vi: "Cưa Máy", en: "Chainsaw" },
        rarity: 4, damage: 38, canDrop: true, type: 'weapon',
        evolvesTo: 'doom_slayer_saw',
        description: { vi: "Ồn ào nhưng hiệu quả.", en: "Noisy but effective." },
        skills: [{ name: { vi: 'Cưa Xương', en: 'Bone Saw' }, power: 45 }, { name: { vi: 'Hoảng Loạn', en: 'Panic' }, power: 40 }]
    },
    'grenade_launcher': {
        name: { vi: "Súng Phóng Lựu", en: "Grenade Launcher" },
        rarity: 4, damage: 40, canDrop: true, type: 'weapon',
        evolvesTo: 'mini_nuke_launcher',
        description: { vi: "Bùm! Bay màu cả đám.", en: "Boom! Area damage." },
        skills: [{ name: { vi: 'Nổ Lan', en: 'Explosion' }, power: 35 }, { name: { vi: 'Đạn Phá', en: 'Breach Round' }, power: 60 }]
    },
    'flamethrower': {
        name: { vi: "Súng Phun Lửa", en: "Flamethrower" },
        rarity: 4, damage: 32, canDrop: true, type: 'weapon',
        evolvesTo: 'dragon_breath',
        description: { vi: "Nướng chín mọi thứ.", en: "Grills everything." },
        skills: [{ name: { vi: 'Thiêu Đốt', en: 'Burn' }, power: 30 }, { name: { vi: 'Hỏa Ngục', en: 'Inferno' }, power: 50 }]
    },

    // ============================================================
    // TIER 5: MYTHIC (THẦN THOẠI) -> TIẾN HÓA THÀNH TIER 6-7
    // ============================================================
    'plasma_cutter': {
        name: { vi: "Dao Cắt Plasma", en: "Plasma Cutter" },
        rarity: 5, damage: 60, canDrop: true, type: 'weapon',
        evolvesTo: 'star_slicer',
        description: { vi: "Cắt xuyên không gian.", en: "Cuts space." },
        skills: [{ name: { vi: 'Tia Plasma', en: 'Plasma Beam' }, power: 70 }, { name: { vi: 'Cắt Phân Tử', en: 'Atomic Cut' }, power: 90 }]
    },
    'gravity_hammer': {
        name: { vi: "Búa Trọng Lực", en: "Gravity Hammer" },
        rarity: 5, damage: 65, canDrop: true, type: 'weapon',
        evolvesTo: 'black_hole_hammer',
        description: { vi: "Thay đổi trọng lực.", en: "Alters gravity." },
        skills: [{ name: { vi: 'Đè Bẹp', en: 'Crush' }, power: 80 }, { name: { vi: 'Lỗ Đen Nhỏ', en: 'Mini Blackhole' }, power: 100 }]
    },
    'laser_saber': {
        name: { vi: "Kiếm Ánh Sáng", en: "Laser Saber" },
        rarity: 5, damage: 58, canDrop: true, type: 'weapon',
        evolvesTo: 'jedi_master_saber',
        description: { vi: "Vũ khí hiệp sĩ vũ trụ.", en: "Space knight weapon." },
        skills: [{ name: { vi: 'Chém Xoáy', en: 'Spin Slash' }, power: 75 }, { name: { vi: 'Phản Đạn', en: 'Deflect' }, power: 60 }]
    },
    'void_scythe': {
        name: { vi: "Lưỡi Hái Hư Không", en: "Void Scythe" },
        rarity: 5, damage: 62, canDrop: true, type: 'weapon',
        evolvesTo: 'death_reaper_scythe',
        description: { vi: "Lấy đi linh hồn.", en: "Reaps souls." },
        skills: [{ name: { vi: 'Gặt Hồn', en: 'Soul Reap' }, power: 85 }, { name: { vi: 'Bóng Tối', en: 'Darkness' }, power: 80 }]
    },
    'thunder_spear': {
        name: { vi: "Thương Sấm Sét", en: "Thunder Spear" },
        rarity: 5, damage: 60, canDrop: true, type: 'weapon',
        evolvesTo: 'zeus_bolt',
        description: { vi: "Triệu hồi sấm sét.", en: "Summons lightning." },
        skills: [{ name: { vi: 'Phóng Sét', en: 'Bolt Strike' }, power: 88 }, { name: { vi: 'Lôi Phạt', en: 'Thunder Wrath' }, power: 95 }]
    },

    // ============================================================
    // TIER 6: SECRET MYTHIC -> TIẾN HÓA THÀNH TIER 7-8
    // ============================================================
    'railgun_mk2': {
        name: { vi: "Pháo Điện Từ Mk2", en: "Railgun Mk2" },
        rarity: 6, damage: 90, canDrop: true, type: 'weapon',
        evolvesTo: 'railgun_mk3_doomsday',
        description: { vi: "Bắn đạn vận tốc Mach 10.", en: "Mach 10 velocity." },
        skills: [{ name: { vi: 'Sạc Năng Lượng', en: 'Charge Up' }, power: 50 }, { name: { vi: 'Siêu Tốc', en: 'Hypersonic' }, power: 150 }]
    },
    'excalibur': {
        name: { vi: "Thánh Kiếm Excalibur", en: "Excalibur" },
        rarity: 6, damage: 85, canDrop: true, type: 'weapon',
        evolvesTo: 'excalibur_morgan',
        description: { vi: "Thanh kiếm của vua.", en: "The King's sword." },
        skills: [{ name: { vi: 'Thánh Quang', en: 'Holy Light' }, power: 120 }, { name: { vi: 'Vua Arthur', en: 'King Arthur' }, power: 140 }]
    },
    'demonic_arm': {
        name: { vi: "Cánh Tay Quỷ", en: "Demonic Arm" },
        rarity: 6, damage: 95, canDrop: true, type: 'weapon',
        evolvesTo: 'lucifer_arm',
        description: { vi: "Cánh tay ký sinh.", en: "Parasitic arm." },
        skills: [{ name: { vi: 'Bóp Nát', en: 'Crush Grip' }, power: 130 }, { name: { vi: 'Hút Máu', en: 'Life Steal' }, power: 100 }]
    },
    'cyber_dragon': {
        name: { vi: "Rồng Máy Tí Hon", en: "Mini Cyber Dragon" },
        rarity: 6, damage: 88, canDrop: true, type: 'weapon',
        evolvesTo: 'mega_cyber_dragon',
        description: { vi: "Rồng robot hỗ trợ.", en: "Drone dragon." },
        skills: [{ name: { vi: 'Khè Lửa', en: 'Flamethrower' }, power: 110 }, { name: { vi: 'Tên Lửa Tự Dẫn', en: 'Homing Missiles' }, power: 135 }]
    },
    'glitch_blade': {
        name: { vi: "Lưỡi Kiếm Lỗi", en: "Glitch Blade" },
        rarity: 6, damage: 1, canDrop: true, type: 'weapon',
        evolvesTo: 'admin_sword',
        description: { vi: "H̷ư hỏ̷ng...", en: "C̷orrup̷ted..." },
        skills: [{ name: { vi: 'Null Pointer', en: 'Null Pointer' }, power: 10 }, { name: { vi: 'Crash Game', en: 'Crash Game' }, power: 200 }]
    },

    // ============================================================
    // TIER 7: JINKI -> TIẾN HÓA THÀNH JINKI THỨC TỈNH (AWAKENED)
    // ============================================================
    'jinki_watchman': {
        name: { vi: "Jinki: Watchman (Tim)", en: "Jinki: Watchman (Heart)" },
        rarity: 7, damage: 120, canDrop: true, type: 'weapon',
        evolvesTo: 'jinki_watchman_awakened',
        description: { vi: "Nhân khí hình trái tim.", en: "Heart-shaped Jinki." },
        skills: [{ name: { vi: 'Tăng Tốc', en: 'Overdrive' }, power: 100 }, { name: { vi: 'Xuyên Phá', en: 'Piercing' }, power: 250 }]
    },
    'jinki_hermes': {
        name: { vi: "Jinki: Hermes (Giày)", en: "Jinki: Hermes (Boots)" },
        rarity: 7, damage: 110, canDrop: true, type: 'weapon',
        evolvesTo: 'jinki_hermes_awakened',
        description: { vi: "Đôi giày có cánh.", en: "Winged boots." },
        skills: [{ name: { vi: 'Đá Xoáy', en: 'Spin Kick' }, power: 180 }, { name: { vi: 'Thiên Cung Cước', en: 'Sky Walk' }, power: 220 }]
    },
    'jinki_vulcan': {
        name: { vi: "Jinki: Vulcan (Găng)", en: "Jinki: Vulcan (Gloves)" },
        rarity: 7, damage: 115, canDrop: true, type: 'weapon',
        evolvesTo: 'jinki_vulcan_awakened',
        description: { vi: "Găng tay lửa địa ngục.", en: "Hellfire gloves." },
        skills: [{ name: { vi: 'Đấm Bùng Nổ', en: 'Explosive Punch' }, power: 200 }, { name: { vi: 'Hỏa Quyền', en: 'Fire Fist' }, power: 240 }]
    },
    'jinki_aegis': {
        name: { vi: "Jinki: Aegis (Khiên)", en: "Jinki: Aegis (Shield)" },
        rarity: 7, damage: 100, canDrop: true, type: 'weapon',
        evolvesTo: 'jinki_aegis_awakened',
        description: { vi: "Tấm khiên bất hoại.", en: "Indestructible shield." },
        skills: [{ name: { vi: 'Bức Tường Thép', en: 'Steel Wall' }, power: 150 }, { name: { vi: 'Phản Hồi', en: 'Reflection' }, power: 300 }]
    },
    'jinki_zanto': {
        name: { vi: "Jinki: Zanto (Trảm Đao)", en: "Jinki: Zanto (Blade)" },
        rarity: 7, damage: 130, canDrop: true, type: 'weapon',
        evolvesTo: 'jinki_zanto_awakened',
        description: { vi: "Lưỡi đao cắt đứt thực tại.", en: "Cuts reality." },
        skills: [{ name: { vi: 'Trảm Thế Giới', en: 'World Slash' }, power: 280 }, { name: { vi: 'Tử Thần', en: 'Reaper' }, power: 350 }]
    },

    // ============================================================
    // TIER 8: SPECIAL (ĐÃ MAX)
    // ============================================================
    'true_3r_gloves': {
        name: { vi: "Găng Tay Rudo (Gốc)", en: "Rudo's Gloves (Original)" },
        rarity: 8, damage: 999, canDrop: false, type: 'weapon',
        description: { vi: "Găng tay của nhân vật chính.", en: "The protagonist's gloves." },
        skills: [{ name: { vi: 'Nhặt Rác', en: 'Trash Pick' }, power: 500 }, { name: { vi: 'Biến Đổi', en: 'Transform' }, power: 999 }]
    },

    // ##################################################################
    // #               VÙNG ĐẤT CỦA CÁC MÓN ĐỒ TIẾN HÓA                 #
    // ##################################################################

    // --- EVOLVED FROM TIER 1 ---
    'titanium_can': {
        name: { vi: "Lon Nước Titan", en: "Titanium Can" },
        rarity: 4, damage: 50, canDrop: false, type: 'weapon',
        description: { vi: "Cứng hơn cả thép. Ném vỡ đầu rồng.", en: "Harder than steel. Can break a dragon's skull." },
        skills: [{ name: { vi: 'Ném Siêu Thanh', en: 'Sonic Throw' }, power: 60 }]
    },
    'vibranium_brick': {
        name: { vi: "Gạch Vibranium", en: "Vibranium Brick" },
        rarity: 4, damage: 55, canDrop: false, type: 'weapon',
        description: { vi: "Gạch làm từ kim loại vũ trụ. Hấp thụ xung lực.", en: "Made of cosmic metal. Absorbs impact." },
        skills: [{ name: { vi: 'Phang Vỡ Sọ', en: 'Skull Crusher' }, power: 70 }]
    },
    'world_tree_twig': {
        name: { vi: "Nhánh Cây Thế Giới", en: "World Tree Twig" },
        rarity: 4, damage: 48, canDrop: false, type: 'weapon',
        description: { vi: "Chứa đựng sức sống vô tận.", en: "Contains infinite vitality." },
        skills: [{ name: { vi: 'Quất Roi', en: 'Nature Whip' }, power: 65 }]
    },
    'gucci_slipper': {
        name: { vi: "Dép Gucci Limited", en: "Gucci Slipper Limited" },
        rarity: 6, damage: 99, canDrop: false, type: 'weapon',
        description: { vi: "Đôi dép ngàn đô. Sát thương = Giá tiền.", en: "Thousand-dollar slippers. Damage = Price." },
        skills: [{ name: { vi: 'Dát Vàng', en: 'Gold Slap' }, power: 150 }, { name: { vi: 'Flexing', en: 'Flexing' }, power: 200 }]
    },
    'death_note': {
        name: { vi: "Sổ Sinh Tử", en: "Death Note" },
        rarity: 5, damage: 70, canDrop: false, type: 'weapon',
        description: { vi: "Ghi tên ai người đó 'bay màu'.", en: "Write a name, they disappear." },
        skills: [{ name: { vi: 'Ghi Tên', en: 'Write Name' }, power: 120 }]
    },

    // --- EVOLVED FROM TIER 2 ---
    'champion_gloves': {
        name: { vi: "Găng Vô Địch", en: "Champion Gloves" },
        rarity: 4, damage: 60, canDrop: false, type: 'weapon',
        description: { vi: "Găng tay của nhà vô địch quyền anh.", en: "Gloves of a boxing champion." },
        skills: [{ name: { vi: 'Cú Đấm Thép', en: 'Steel Punch' }, power: 80 }]
    },
    'dragon_pipe': {
        name: { vi: "Tuýp Rồng", en: "Dragon Pipe" },
        rarity: 4, damage: 65, canDrop: false, type: 'weapon',
        description: { vi: "Tuýp sắt chạm khắc hình rồng.", en: "Pipe carved with dragon patterns." },
        skills: [{ name: { vi: 'Rồng Quẫy Đuôi', en: 'Dragon Tail' }, power: 85 }]
    },
    'mecha_wrench': {
        name: { vi: "Cờ Lê Cơ Giới", en: "Mecha Wrench" },
        rarity: 4, damage: 62, canDrop: false, type: 'weapon',
        description: { vi: "Dụng cụ của thợ máy tương lai.", en: "Tool of a futuristic mechanic." },
        skills: [{ name: { vi: 'Sửa Chữa', en: 'Repair Smash' }, power: 75 }]
    },
    'chef_ramsay_knife': {
        name: { vi: "Dao Vua Bếp", en: "Master Chef Knife" },
        rarity: 4, damage: 68, canDrop: false, type: 'weapon',
        description: { vi: "Dao sắc đến mức cắt được cả không khí.", en: "Sharp enough to cut air." },
        skills: [{ name: { vi: 'Thái Hành Tây', en: 'Onion Dice' }, power: 90 }]
    },
    'spiked_bat_mk2': {
        name: { vi: "Gậy Đinh Mk2", en: "Spiked Bat Mk2" },
        rarity: 4, damage: 70, canDrop: false, type: 'weapon',
        description: { vi: "Gậy bóng chày bọc thép gai.", en: "Baseball bat wrapped in barbed wire." },
        skills: [{ name: { vi: 'Đập Nát', en: 'Smash' }, power: 95 }]
    },

    // --- EVOLVED FROM TIER 3 ---
    'gordon_crowbar': {
        name: { vi: "Xà Beng Khoa Học", en: "Science Crowbar" },
        rarity: 5, damage: 80, canDrop: false, type: 'weapon',
        description: { vi: "Vũ khí của tiến sĩ vật lý.", en: "Weapon of a physicist." },
        skills: [{ name: { vi: 'Vật Lý', en: 'Physics' }, power: 100 }]
    },
    'jungle_king_blade': {
        name: { vi: "Đao Vua Rừng", en: "Jungle King Blade" },
        rarity: 5, damage: 82, canDrop: false, type: 'weapon',
        description: { vi: "Lưỡi đao thống trị rừng rậm.", en: "Blade that rules the jungle." },
        skills: [{ name: { vi: 'Chém Rừng', en: 'Forest Slash' }, power: 105 }]
    },
    'thunder_rod': {
        name: { vi: "Cây Gậy Sét", en: "Thunder Rod" },
        rarity: 5, damage: 78, canDrop: false, type: 'weapon',
        description: { vi: "Tích tụ điện năng cao thế.", en: "Stores high voltage." },
        skills: [{ name: { vi: 'Phóng Điện', en: 'Discharge' }, power: 95 }]
    },
    'inferno_axe': {
        name: { vi: "Rìu Hỏa Ngục", en: "Inferno Axe" },
        rarity: 5, damage: 85, canDrop: false, type: 'weapon',
        description: { vi: "Rìu rực lửa vĩnh cửu.", en: "Eternally burning axe." },
        skills: [{ name: { vi: 'Bổ Núi', en: 'Mountain Split' }, power: 110 }]
    },
    'rhino_shield': {
        name: { vi: "Khiên Tê Giác", en: "Rhino Shield" },
        rarity: 5, damage: 75, canDrop: false, type: 'weapon',
        description: { vi: "Cứng như da tê giác.", en: "Tough as rhino skin." },
        skills: [{ name: { vi: 'Húc Bay', en: 'Charge' }, power: 90 }]
    },

    // --- EVOLVED FROM TIER 4 ---
    'demon_slayer_katana': {
        name: { vi: "Diệt Quỷ Kiếm", en: "Demon Slayer Katana" },
        rarity: 6, damage: 100, canDrop: false, type: 'weapon',
        description: { vi: "Thanh kiếm chuyên dùng để diệt quỷ.", en: "Sword used to slay demons." },
        skills: [{ name: { vi: 'Hơi Thở', en: 'Breath Style' }, power: 130 }]
    },
    'gauss_rifle': {
        name: { vi: "Súng Gauss", en: "Gauss Rifle" },
        rarity: 6, damage: 110, canDrop: false, type: 'weapon',
        description: { vi: "Súng trường gia tốc từ tính.", en: "Magnetic acceleration rifle." },
        skills: [{ name: { vi: 'Bắn Xuyên Táo', en: 'Rail Shot' }, power: 140 }]
    },
    'doom_slayer_saw': {
        name: { vi: "Cưa Hủy Diệt", en: "Doom Saw" },
        rarity: 6, damage: 105, canDrop: false, type: 'weapon',
        description: { vi: "Rip and Tear!", en: "Rip and Tear!" },
        skills: [{ name: { vi: 'Xẻ Thịt', en: 'Rip' }, power: 135 }]
    },
    'mini_nuke_launcher': {
        name: { vi: "Súng Hạt Nhân Tí Hon", en: "Mini Nuke Launcher" },
        rarity: 6, damage: 120, canDrop: false, type: 'weapon',
        description: { vi: "Bắn ra đầu đạn hạt nhân nhỏ.", en: "Fires mini nuclear warheads." },
        skills: [{ name: { vi: 'Nấm Phóng Xạ', en: 'Mushroom Cloud' }, power: 160 }]
    },
    'dragon_breath': {
        name: { vi: "Hơi Thở Rồng", en: "Dragon Breath" },
        rarity: 6, damage: 98, canDrop: false, type: 'weapon',
        description: { vi: "Súng phun lửa xanh.", en: "Blue fire flamethrower." },
        skills: [{ name: { vi: 'Hỏa Long', en: 'Fire Dragon' }, power: 125 }]
    },

    // --- EVOLVED FROM TIER 5 ---
    'star_slicer': {
        name: { vi: "Dao Cắt Tinh Tú", en: "Star Slicer" },
        rarity: 7, damage: 130, canDrop: false, type: 'weapon',
        description: { vi: "Cắt đôi cả ngôi sao.", en: "Slices stars in half." },
        skills: [{ name: { vi: 'Thiên hà', en: 'Galaxy Cut' }, power: 170 }]
    },
    'black_hole_hammer': {
        name: { vi: "Búa Lỗ Đen", en: "Black Hole Hammer" },
        rarity: 7, damage: 140, canDrop: false, type: 'weapon',
        description: { vi: "Mỗi cú đập tạo ra một lỗ đen.", en: "Creates black holes on impact." },
        skills: [{ name: { vi: 'Sự Kiện Chân Trời', en: 'Event Horizon' }, power: 180 }]
    },
    'jedi_master_saber': {
        name: { vi: "Kiếm Ánh Sáng Tối Thượng", en: "Supreme Lightsaber" },
        rarity: 7, damage: 135, canDrop: false, type: 'weapon',
        description: { vi: "Vũ khí của bậc thầy.", en: "Weapon of a master." },
        skills: [{ name: { vi: 'Thần Lực', en: 'The Force' }, power: 175 }]
    },
    'death_reaper_scythe': {
        name: { vi: "Lưỡi Hái Tử Thần", en: "Death Reaper Scythe" },
        rarity: 7, damage: 138, canDrop: false, type: 'weapon',
        description: { vi: "Cái chết là không thể tránh khỏi.", en: "Death is inevitable." },
        skills: [{ name: { vi: 'Đoạt Mệnh', en: 'Fatal Reap' }, power: 178 }]
    },
    'zeus_bolt': {
        name: { vi: "Tia Sét Zeus", en: "Zeus Bolt" },
        rarity: 7, damage: 136, canDrop: false, type: 'weapon',
        description: { vi: "Quyền năng của vua các vị thần.", en: "Power of the King of Gods." },
        skills: [{ name: { vi: 'Thiên Phạt', en: 'Divine Punishment' }, power: 176 }]
    },

    // --- EVOLVED FROM TIER 6 ---
    'railgun_mk3_doomsday': {
        name: { vi: "Pháo Tận Thế Mk3", en: "Doomsday Railgun Mk3" },
        rarity: 7, damage: 160, canDrop: false, type: 'weapon',
        description: { vi: "Vũ khí hủy diệt hành tinh.", en: "Planet destroyer." },
        skills: [{ name: { vi: 'Ngày Tàn', en: 'Doomsday' }, power: 250 }]
    },
    'excalibur_morgan': {
        name: { vi: "Hắc Kiếm Excalibur", en: "Excalibur Morgan" },
        rarity: 7, damage: 155, canDrop: false, type: 'weapon',
        description: { vi: "Phiên bản sa ngã của thánh kiếm.", en: "Corrupted holy sword." },
        skills: [{ name: { vi: 'Hắc Quang', en: 'Dark Light' }, power: 240 }]
    },
    'lucifer_arm': {
        name: { vi: "Cánh Tay Lucifer", en: "Lucifer's Arm" },
        rarity: 7, damage: 165, canDrop: false, type: 'weapon',
        description: { vi: "Cánh tay của chúa quỷ.", en: "Arm of the Devil." },
        skills: [{ name: { vi: 'Địa Ngục', en: 'Hell' }, power: 260 }]
    },
    'mega_cyber_dragon': {
        name: { vi: "Siêu Rồng Máy", en: "Mega Cyber Dragon" },
        rarity: 7, damage: 158, canDrop: false, type: 'weapon',
        description: { vi: "Rồng máy khổng lồ.", en: "Giant cyber dragon." },
        skills: [{ name: { vi: 'Hủy Diệt', en: 'Annihilation' }, power: 245 }]
    },
    'admin_sword': {
        name: { vi: "Kiếm Admin", en: "Admin Sword" },
        rarity: 7, damage: 1, canDrop: false, type: 'weapon',
        description: { vi: "Ban người chơi...", en: "Banning players..." },
        skills: [{ name: { vi: '/kill @all', en: '/kill @all' }, power: 999 }]
    },

    // --- EVOLVED FROM TIER 7 (AWAKENED JINKI) ---
    'jinki_watchman_awakened': {
        name: { vi: "Jinki: Watchman (Thức Tỉnh)", en: "Jinki: Watchman (Awakened)" },
        rarity: 8, damage: 250, canDrop: false, type: 'weapon',
        description: { vi: "Trái tim đập mạnh mẽ hơn bao giờ hết.", en: "Heart beating stronger than ever." },
        skills: [{ name: { vi: 'Nhịp Đập Tử Thần', en: 'Death Beat' }, power: 400 }]
    },
    'jinki_hermes_awakened': {
        name: { vi: "Jinki: Hermes (Thức Tỉnh)", en: "Jinki: Hermes (Awakened)" },
        rarity: 8, damage: 240, canDrop: false, type: 'weapon',
        description: { vi: "Đôi chân vượt qua tốc độ ánh sáng.", en: "Faster than light." },
        skills: [{ name: { vi: 'Thần Tốc', en: 'Godspeed' }, power: 380 }]
    },
    'jinki_vulcan_awakened': {
        name: { vi: "Jinki: Vulcan (Thức Tỉnh)", en: "Jinki: Vulcan (Awakened)" },
        rarity: 8, damage: 245, canDrop: false, type: 'weapon',
        description: { vi: "Ngọn lửa thiêu rụi mọi thứ.", en: "Fire that burns everything." },
        skills: [{ name: { vi: 'Mặt Trời', en: 'The Sun' }, power: 390 }]
    },
    'jinki_aegis_awakened': {
        name: { vi: "Jinki: Aegis (Thức Tỉnh)", en: "Jinki: Aegis (Awakened)" },
        rarity: 8, damage: 220, canDrop: false, type: 'weapon',
        description: { vi: "Phòng thủ tuyệt đối.", en: "Absolute defense." },
        skills: [{ name: { vi: 'Bất Tử', en: 'Immortal' }, power: 350 }]
    },
    'jinki_zanto_awakened': {
        name: { vi: "Jinki: Zanto (Thức Tỉnh)", en: "Jinki: Zanto (Awakened)" },
        rarity: 8, damage: 260, canDrop: false, type: 'weapon',
        description: { vi: "Lưỡi đao cắt đứt thực tại.", en: "Cuts reality." },
        skills: [{ name: { vi: 'Trảm Thế Giới', en: 'World Slash' }, power: 450 }]
    },

    // ##################################################################
    // #               CONSUMABLES (VẬT PHẨM HỒI PHỤC)                 #
    // ##################################################################
    // type: 'consumable' -> Dùng để ăn/uống
    // heal: Lượng HP hồi phục
    // price: Giá bán trong Shop (Galla)
    // canDrop: false (Chỉ bán Shop), true (Có thể rớt từ Boss)

    // TIER 1: Rẻ tiền, hồi ít
    'stale_bread': {
        name: { vi: "Bánh Mì Cũ", en: "Stale Bread" },
        shopId: '001', rarity: 1, type: 'consumable', heal: 20, price: 50, canDrop: false,
        description: { vi: "Hơi cứng nhưng vẫn ăn được.", en: "A bit hard but edible." }
    },
    'water_bottle': {
        name: { vi: "Chai Nước Lọc", en: "Water Bottle" },
        shopId: '002', rarity: 1, type: 'consumable', heal: 15, price: 30, canDrop: false,
        description: { vi: "Nước máy đóng chai.", en: "Bottled tap water." }
    },

    // TIER 2: Bình dân
    'bandage': {
        name: { vi: "Băng Cá Nhân", en: "Bandage" },
        shopId: '003', rarity: 2, type: 'consumable', heal: 50, price: 150, canDrop: false,
        description: { vi: "Cầm máu tạm thời.", en: "Stops bleeding temporarily." }
    },
    'rice_ball': {
        name: { vi: "Cơm Nắm", en: "Rice Ball" },
        shopId: '004', rarity: 2, type: 'consumable', heal: 60, price: 200, canDrop: false,
        description: { vi: "Nắm cơm muối vừng, chắc bụng.", en: "Rice ball with sesame salt." }
    },

    // TIER 3: Hàng xịn
    'medkit': {
        name: { vi: "Hộp Cứu Thương", en: "Medkit" },
        shopId: '005', rarity: 3, type: 'consumable', heal: 150, price: 600, canDrop: false,
        description: { vi: "Đầy đủ dụng cụ sơ cứu.", en: "Full first aid kit." }
    },
    'energy_drink': {
        name: { vi: "Nước Tăng Lực", en: "Energy Drink" },
        shopId: '006', rarity: 3, type: 'consumable', heal: 120, price: 500, canDrop: false,
        description: { vi: "Bò húc! Tỉnh táo ngay lập tức.", en: "Red Bull! Instant energy." }
    },

    // TIER 4: Hàng cao cấp
    'healing_potion': {
        name: { vi: "Thuốc Hồi Phục", en: "Healing Potion" },
        shopId: '007', rarity: 4, type: 'consumable', heal: 500, price: 2000, canDrop: false,
        description: { vi: "Dược phẩm ma thuật, hồi phục vết thương lớn.", en: "Magic potion, heals major wounds." }
    },
    'luxury_meal': {
        name: { vi: "Bữa Ăn Sang Trọng", en: "Luxury Meal" },
        shopId: '008', rarity: 4, type: 'consumable', heal: 600, price: 2500, canDrop: false,
        description: { vi: "Bò Wagyu dát vàng. Ngon tuyệt.", en: "Gold-plated Wagyu. Delicious." }
    },

    // TIER 5: Mythic (Boss Drop hoặc Shop cực đắt)
    'phoenix_tear': {
        name: { vi: "Nước Mắt Phượng Hoàng", en: "Phoenix Tear" },
        shopId: '009', rarity: 5, type: 'consumable', heal: 2000, price: 10000, canDrop: true,
        description: { vi: "Hồi sinh từ cõi chết.", en: "Revive from death." }
    },
    'senzu_bean': {
        name: { vi: "Tiên Đậu", en: "Senzu Bean" },
        shopId: '010', rarity: 5, type: 'consumable', heal: 2500, price: 12000, canDrop: false,
        description: { vi: "Ăn một hạt no cả tuần, hồi full lực.", en: "Restores full power instantly." }
    },

    // TIER 6/7: Jinki/Boss Drop Only (Không bán shop hoặc giá trên trời)
    'dragon_blood': {
        name: { vi: "Huyết Rồng Tinh Khiết", en: "Pure Dragon Blood" },
        shopId: '011', rarity: 6, type: 'consumable', heal: 5000, price: 50000, canDrop: true,
        description: { vi: "Uống vào nóng ran cả người, sức mạnh tuôn trào.", en: "Boils your blood with power." }
    },
    'ambrosia': {
        name: { vi: "Thức Ăn Của Thần", en: "Ambrosia" },
        shopId: '012', rarity: 7, type: 'consumable', heal: 10000, price: 99999, canDrop: true,
        description: { vi: "Món ăn chỉ dành cho các vị thần trên đỉnh Olympus.", en: "Food for gods only." }
    }
};

// Hàm lấy thông tin item theo ID
function getItem(id) {
    return ITEMS[id] || null;
}

module.exports = { ITEMS, getItem, MAX_LEVEL };