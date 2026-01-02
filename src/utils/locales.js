const LOCALES = {
    // =========================================================================
    // 🇻🇳 TIẾNG VIỆT
    // =========================================================================
    vi: {
        // --- 🔴 LỖI CHUNG ---
        error_no_user: "❌ Bạn chưa tạo nhân vật! Gõ `.g start` đi.",
        error_cooldown: "⏳ **Từ từ thôi!** Đợi hồi sức đã **<t:{time}:R>**.",
        error_syntax_hunt: "❌ Nhập Route! Ví dụ: `.g hunt 1`",
        error_zone_closed: "❌ Vùng đất này chưa được mở!",
        error_not_your_button: "❌ Không phải nút của bạn!",

        // --- 🆕 KHỞI TẠO (START) ---
        start_exists: "❌ Bạn đã có nhân vật rồi! Gõ `.g profile` để xem.",
        start_intro: "Chào mừng đến với **Gachiakuta**! Hãy chọn hệ phái khởi đầu:",
        start_intro_title: "⚠️ CẢNH BÁO RƠI TỰ DO!",
        start_intro_desc: "**{name}** đang rơi xuống Bãi Rác! Chọn ngay class để tiếp đất:",
        start_success: "✅ Chào mừng **{class}** mới gia nhập thế giới ngầm!",
        start_success_title: "✅ KÍCH HOẠT: {class}",
        start_success_desc: "Chào mừng **{name}**.\n{desc}\n\nDùng `.g farm` để chơi ngay!",
        
        class_desc_tribal: "Tốc độ cao - Né tránh giỏi",
        class_desc_scavenger: "May mắn cao - Tìm đồ xịn",
        class_desc_vandal: "Sức mạnh lớn - Dame to",

        // --- 👤 HỒ SƠ (PROFILE) ---
        profile_title: "HỒ SƠ: {name}",
        profile_header: "✅ **Thẻ căn cước của {name}:**",
        profile_loading: "🔄 **Đang tải dữ liệu nhân vật...**",
        profile_error_gen: "❌ Có lỗi khi tạo ảnh! (Kiểm tra lại file assets)",
        profile_stats: "Cấp độ: **{level}** | Vùng: **{zone}**",
        profile_wallet: "💰 Tài sản: **{balance}** Galla",
        profile_combat: "⚔️ Sức mạnh: **{str}** | ❤️ Máu: **{hp}**",

        // --- ⚔️ CHIẾN ĐẤU (HUNT) ---
        battle_title: "⚔️ TRẬN CHIẾN: ROUTE {route}",
        battle_appear: "**{monster}** xuất hiện!",
        battle_flee: "🏃 Bạn đã bỏ chạy!",
        battle_win: "🏆 CHIẾN THẮNG!",
        battle_lose: "💀 **BẠN ĐÃ GỤC NGÃ!**",
        battle_result: "Hạ gục **{monster}**!\n💰 +{money} Galla | ✨ +{exp} EXP",
        battle_levelup: "\n🆙 **LÊN CẤP {level}!**",
        battle_newzone: "\n🚀 **MỞ KHÓA VÙNG MỚI!**",
        battle_drop: "\n🎁 **NHẶT ĐƯỢC:** [{item}]",
        battle_crit: "💥 **CHÍ MẠNG!**",
        
        action_attack: "👊 Bạn dùng **{skill}** đánh **{dmg}** sát thương!",
        action_monster_attack: "\n💢 **{monster}** vả lại **{dmg}** sát thương!",
        action_new_session: "💨 **Quái vật bỏ chạy vì bạn bắt đầu trận mới!**",
        action_timeout: "⏳ Hết giờ! Quái vật bỏ đi vì chán.",

        // --- 🧺 NÔNG TRẠI (FARM) ---
        farm_cooldown: "⏳ Đang mệt! Nghỉ thêm **{time}s**.",
        farm_found_title: "🔍 TÌM THẤY: {item}",
        farm_found_desc: "Độ hiếm: **{rarity}**\nSát thương gốc: **{dmg}**\nChất lượng: **{quality}** ({pot}%)\n\nBạn có muốn nhặt nó không?",
        farm_quality_normal: "Bình thường",
        farm_quality_good: "Hàng Tuyển",
        farm_quality_bad: "Phế Liệu",
        farm_pick: "Nhặt",
        farm_drop: "Vứt",
        farm_pick_success: "✅ Bạn đã nhặt **{item}** [{quality}] vào túi!\n*UID: {uid}...*",
        farm_drop_success: "🗑️ Bạn đã đá cái **{item}** sang một bên.",
        farm_timeout: "⏳ Đã bỏ qua.",

        // --- 🎒 TÚI ĐỒ (INVENTORY) ---
        inv_empty: "🎒 Túi của bạn trống rỗng!",
        inv_title: "🎒 TÚI ĐỒ CỦA {name}",
        inv_equipped: "⚔️ [ĐANG CẦM]",
        inv_equipped_none: "Tay Không",
        inv_equipped_unknown: "Vũ khí lạ",
        inv_equipped_label: "Đang cầm: **{item}**\nTổng số lượng: **{count}** món",
        inv_footer: "Trang {page}/{total} • Dùng .g equip <số> để cầm",
        inv_item_error: "Lỗi Data ({id})",
        inv_item_equipped_status: "⚔️ [ĐANG CẦM]",
        inv_item_details: "└ Cap: {rarity} | ATK: {atk} | Tiềm năng: {pot}%",

        // --- ⚔️ TRANG BỊ & THÔNG TIN (EQUIP & INFO) ---
        equip_success: "⚔️ **XOẸT!** Bạn đã cầm **{item}** lên tay!",
        equip_success_msg: "⚔️ **XOẸT!** Bạn đã cầm **{item}** lên tay!\n*UID: {uid}... | ATK: {atk}*",
        equip_error_index: "❌ Số thứ tự không hợp lệ hoặc không có trong túi!",
        equip_syntax: "❌ Bạn muốn cầm cái gì? Gõ `{prefix}inventory` xem số rồi gõ `{prefix}equip <số>`",
        equip_invalid_index: "❌ Số thứ tự không hợp lệ!",
        equip_item_not_found: "❌ Trong túi làm gì có món số **{index}**?",

        info_title: "🔍 THÔNG TIN: {item}",
        info_grade: "Đánh giá: **{grade}**",
        info_footer: "Sở hữu bởi: {owner}",
        info_syntax: "❌ Nhập số thứ tự món đồ. VD: `{prefix}info 1`",
        info_item_not_found: "❌ Không tìm thấy món đồ số này.",
        info_uid: "🆔 UID Định Danh",
        info_stats_title: "📊 Chỉ Số Chiến Đấu",
        info_stats_val: "ATK: **{atk}**\nĐộ bền: **{dur}**\nĐã diệt: **{kill}** quái\nEXP: **{exp}/{req}**",
        info_grade_title: "✨ Đánh Giá Jinki",
        info_grade_val: "Tiềm năng: **{pot}%**\nXếp hạng: **{grade}**",
        info_history_title: "📜 Lịch Sử",
        info_history_val: "Sở hữu bởi: <@{owner}>\nNhặt lúc: {date}",

        weapon_evolve: "✨ **CHÚC MỪNG!** {oldItem} đã tiến hóa thành **{newItem}**!",
        weapon_max_level: "🔥 **{item} đã đạt cấp tối đa!**",

        // --- 💰 KINH TẾ (WALLET/SHOP/BUY/SELL) ---
        wallet_title: "💰 VÍ TIỀN CỦA {name}",
        wallet_desc: "Số dư hiện tại: **{balance} Galla**",

        shop_title: "🛒 CỬA HÀNG GALLA",
        shop_desc: "Gõ `{prefix}buy <id>` để mua.\nVí dụ: `{prefix}buy medkit`",
        shop_item: "**{name}** (`{id}`)\n└ Giá: 🪙 **{price}** | Hồi: ❤️ {heal}",
        shop_empty: "Cửa hàng đang đóng cửa!",
        shop_footer: "Trang {page}/{total}",
        shop_item_not_found: "❌ Không tìm thấy món hàng này.",

        buy_success: "✅ Bạn đã mua **{item}** với giá **{price} Galla**!",
        buy_fail_money: "❌ Không đủ tiền! Cần **{price}**, có **{balance}**.",
        buy_fail_id: "❌ Không tìm thấy món hàng mã `{id}`.",

        sell_syntax: "❌ Gõ `{prefix}sell <số thứ tự>` để bán.",
        sell_fail_equip: "❌ Đang cầm món này sao mà bán? Tháo ra trước đi!",
        sell_success: "✅ Đã bán **{item}** thu về 🪙 **{price} Galla** (70%).",
        sell_fail_cant: "❌ Vật phẩm này không thể bán!",
        
        sell_warn_title: "⚠️ CẢNH BÁO: ĐỒ HIẾM",
        sell_warn_desc: "Bạn đang định bán **{item}** ({rarity}).\nBạn có chắc không?",
        btn_confirm: "Bán luôn",
        btn_cancel: "Hủy bỏ",
        btn_always: "Bán & Đừng hỏi lại",

        // --- ❤️ HỒI PHỤC (USE) ---
        use_success: "😋 Bạn đã dùng **{item}** và hồi phục **{amount} HP**! (HP: {current}/{max})",
        use_fail_max: "❌ Máu đã đầy rồi, đừng lãng phí!",
        use_fail_not_consumable: "❌ Cái này không ăn được đâu!",

        // --- 🗺️ BẢN ĐỒ (ZONE) ---
        zone_title: "🗺️ BẢN ĐỒ THẾ GIỚI",
        zone_desc: "📍 Vị trí hiện tại: **Zone {current} - {name}**\n🔓 Khu vực đã mở: **1 - {max}**\n💸 Phí di chuyển: **200 Galla**",
        zone_btn_label: "Khu vực {zone}",
        zone_locked: "🔒 Khu vực này chưa mở khóa! Hãy đánh bại Boss ở Zone {max} trước.",
        zone_same: "❌ Bạn đang ở khu vực này rồi!",
        zone_confirm_title: "🚏 XÁC NHẬN DI CHUYỂN",
        zone_confirm_desc: "Bạn muốn đến **Zone {zone}**?\nChi phí: **200 Galla**.\nSố dư sau khi trả: **{newBal} Galla**.",
        zone_success: "✅ Đã di chuyển đến **Zone {zone}**! Chúc may mắn.",
        zone_fail_money: "❌ Không đủ tiền! Bạn cần **200 Galla** để bắt xe ôm.",
        zone_cancel: "❌ Đã hủy chuyến đi.",

        // --- 📖 TỪ ĐIỂN & HELP (DICT/HELP) ---
        dict_title: "📖 TỪ ĐIỂN: {item}",
        dict_type_weapon: "⚔️ Vũ Khí",
        dict_type_material: "📦 Nguyên Liệu",
        dict_rarity: "Độ Hiếm",
        dict_damage: "Sát Thương Gốc",
        dict_skill: "Kỹ Năng Kích Hoạt",
        dict_skill_none: "Không có",
        dict_desc_none: "Chưa có mô tả...",
        dict_footer: "Trang {page}/{total} • ID: {id}",

        help_title: "📖 DANH SÁCH LỆNH",
        help_desc: "Prefix hiện tại: `{prefix}`",
        help_footer: "Gachiakuta Bot",
        help_group_basic: "🆕 Cơ Bản",
        help_group_combat: "⚔️ Chiến Đấu & Cày Cuốc",
        help_group_items: "🎒 Túi Đồ & Vật Phẩm",

        cmd_desc_start: "Tạo nhân vật mới",
        cmd_desc_profile: "Xem thông tin cá nhân",
        cmd_desc_hunt: "Đi săn quái vật",
        cmd_desc_farm: "Nhặt đồ rác",
        cmd_desc_inv: "Xem túi đồ",
        cmd_desc_equip: "Trang bị vũ khí",
        cmd_desc_dict: "Tra cứu vật phẩm",
        cmd_desc_rank: "Xem bảng xếp hạng",
        cmd_desc_lang: "Đổi ngôn ngữ (VN/EN)",
        cmd_desc_help: "Xem danh sách lệnh",

        // --- 🔤 KHÁC ---
        btn_first: "⏮️ Đầu",
        btn_prev: "◀️ Lùi",
        btn_next: "Tiến ▶️",
        btn_last: "Cuối ⏭️",

        rarity_1: "Common (Thường)",
        rarity_2: "Uncommon (Khá)",
        rarity_3: "Rare (Hiếm)",
        rarity_4: "Epic (Sử Thi)",
        rarity_5: "Mythic (Thần Thoại)",
        rarity_6: "Secret Mythic",
        rarity_7: "Jinki (Nhân Khí)",
        rarity_8: "SPECIAL (Độc Nhất)",

        grade_d: "D (Phế Liệu)",
        grade_c: "C (Thường)",
        grade_b: "B (Khá)",
        grade_a: "A (Hàng Tuyển)",
        grade_s: "S (Cực Phẩm)",
    },

    // =========================================================================
    // 🇺🇸 ENGLISH
    // =========================================================================
    en: {
        // --- 🔴 ERRORS ---
        error_no_user: "❌ You haven't started yet! Type `.g start`.",
        error_cooldown: "⏳ **Chill out!** You can hunt again **<t:{time}:R>**.",
        error_syntax_hunt: "❌ Enter Route! Example: `.g hunt 1`",
        error_zone_closed: "❌ This zone is not opened yet!",
        error_not_your_button: "❌ Not your button!",

        // --- 🆕 START ---
        start_exists: "❌ You already have a character! Type `.g profile` to view.",
        start_intro: "Welcome to **Gachiakuta**! Choose your starting class:",
        start_intro_title: "⚠️ FREEFALL WARNING!",
        start_intro_desc: "**{name}** is falling into the Trash Heap! Pick a class to land:",
        start_success: "✅ Welcome, new **{class}**!",
        start_success_title: "✅ ACTIVATED: {class}",
        start_success_desc: "Welcome **{name}**.\n{desc}\n\nUse `.g farm` to play!",

        class_desc_tribal: "High Speed - High Evasion",
        class_desc_scavenger: "High Luck - Better Loot",
        class_desc_vandal: "High Strength - Big Damage",

        // --- 👤 PROFILE ---
        profile_title: "PROFILE: {name}",
        profile_header: "✅ **ID Card of {name}:**",
        profile_loading: "🔄 **Generating character data...**",
        profile_error_gen: "❌ Error generating image! (Check assets)",
        profile_stats: "Level: **{level}** | Zone: **{zone}**",
        profile_wallet: "💰 Balance: **{balance}** Galla",
        profile_combat: "⚔️ Strength: **{str}** | ❤️ HP: **{hp}**",

        // --- ⚔️ HUNT ---
        battle_title: "⚔️ BATTLE: ROUTE {route}",
        battle_appear: "**{monster}** appeared!",
        battle_flee: "🏃 You fled safely!",
        battle_win: "🏆 VICTORY!",
        battle_lose: "💀 **YOU FAINTED!**",
        battle_result: "Defeated **{monster}**!\n💰 +{money} Galla | ✨ +{exp} EXP",
        battle_levelup: "\n🆙 **LEVEL UP {level}!**",
        battle_newzone: "\n🚀 **NEW ZONE UNLOCKED!**",
        battle_drop: "\n🎁 **DROPPED:** [{item}]",
        battle_crit: "💥 **CRITICAL!**",

        action_attack: "👊 You used **{skill}** dealing **{dmg}** dmg!",
        action_monster_attack: "\n💢 **{monster}** hit back for **{dmg}** dmg!",
        action_new_session: "💨 **Monster fled because you started a new battle!**",
        action_timeout: "⏳ Timeout! The monster got bored and left.",

        // --- 🧺 FARM ---
        farm_cooldown: "⏳ Too tired! Rest for **{time}s**.",
        farm_found_title: "🔍 FOUND: {item}",
        farm_found_desc: "Rarity: **{rarity}**\nBase Damage: **{dmg}**\nQuality: **{quality}** ({pot}%)\n\nDo you want to pick it up?",
        farm_quality_normal: "Normal",
        farm_quality_good: "High Quality",
        farm_quality_bad: "Scrap",
        farm_pick: "Pick",
        farm_drop: "Drop",
        farm_pick_success: "✅ You picked up **{item}** [{quality}]!\n*UID: {uid}...*",
        farm_drop_success: "🗑️ You kicked **{item}** aside.",
        farm_timeout: "⏳ Ignored.",

        // --- 🎒 INVENTORY ---
        inv_empty: "🎒 Your inventory is empty!",
        inv_title: "🎒 {name}'S INVENTORY",
        inv_equipped: "⚔️ [EQUIPPED]",
        inv_equipped_none: "Bare Hands",
        inv_equipped_unknown: "Unknown Weapon",
        inv_equipped_label: "Equipped: **{item}**\nTotal items: **{count}**",
        inv_footer: "Page {page}/{total} • Use {prefix}equip <number> to equip",
        inv_item_error: "Data Error ({id})",
        inv_item_equipped_status: "⚔️ [EQUIPPED]",
        inv_item_details: "└ Rank: {rarity} | ATK: {atk} | Potential: {pot}%",

        // --- ⚔️ EQUIP & INFO ---
        equip_success: "⚔️ **SWISH!** You equipped **{item}**!",
        equip_success_msg: "⚔️ **SWISH!** You equipped **{item}**!\n*UID: {uid}... | ATK: {atk}*",
        equip_error_index: "❌ Invalid number or item not found!",
        equip_syntax: "❌ What do you want to equip? Type `{prefix}inventory` to see numbers, then `{prefix}equip <number>`",
        equip_invalid_index: "❌ Invalid number!",
        equip_item_not_found: "❌ Item number **{index}** does not exist in your bag!",

        info_title: "🔍 INFO: {item}",
        info_grade: "Grade: **{grade}**",
        info_footer: "Owned by: {owner}",
        info_syntax: "❌ Enter item number. Ex: `{prefix}info 1`",
        info_item_not_found: "❌ Item not found.",
        info_uid: "🆔 Unique UID",
        info_stats_title: "📊 Combat Stats",
        info_stats_val: "ATK: **{atk}**\nDurability: **{dur}**\nKilled: **{kill}** mobs\nEXP: **{exp}/{req}**",
        info_grade_title: "✨ Jinki Evaluation",
        info_grade_val: "Potential: **{pot}%**\nGrade: **{grade}**",
        info_history_title: "📜 History",
        info_history_val: "Owned by: <@{owner}>\nObtained: {date}",

        weapon_evolve: "✨ **CONGRATS!** {oldItem} evolved into **{newItem}**!",
        weapon_max_level: "🔥 **{item} reached MAX LEVEL!**",

        // --- 💰 ECONOMY (WALLET/SHOP/BUY/SELL) ---
        wallet_title: "💰 {name}'S WALLET",
        wallet_desc: "Current Balance: **{balance} Galla**",

        shop_title: "🛒 GALLA SHOP",
        shop_desc: "Type `{prefix}buy <id>` to buy.\nExample: `{prefix}buy medkit`",
        shop_item: "**{name}** (`{id}`)\n└ Price: 🪙 **{price}** | Heal: ❤️ {heal}",
        shop_empty: "Shop is closed!",
        shop_footer: "Page {page}/{total}",
        shop_item_not_found: "❌ Item not found.",

        buy_success: "✅ You bought **{item}** for **{price} Galla**!",
        buy_fail_money: "❌ Not enough money! Need **{price}**, have **{balance}**.",
        buy_fail_id: "❌ Item ID `{id}` not found.",

        sell_syntax: "❌ Type `{prefix}sell <number>` to sell.",
        sell_fail_equip: "❌ Cannot sell equipped item! Unequip first.",
        sell_success: "✅ Sold **{item}** for 🪙 **{price} Galla** (70%).",
        sell_fail_cant: "❌ This item cannot be sold!",

        sell_warn_title: "⚠️ WARNING: RARE ITEM",
        sell_warn_desc: "You are selling **{item}** ({rarity}).\nAre you sure?",
        btn_confirm: "Sell",
        btn_cancel: "Cancel",
        btn_always: "Sell & Don't ask again",

        // --- ❤️ USE ---
        use_success: "😋 You used **{item}** and recovered **{amount} HP**! (HP: {current}/{max})",
        use_fail_max: "❌ HP is already full!",
        use_fail_not_consumable: "❌ You can't eat this!",

        // --- 🗺️ ZONE ---
        zone_title: "🗺️ WORLD MAP",
        zone_desc: "📍 Current Location: **Zone {current} - {name}**\n🔓 Unlocked: **1 - {max}**\n💸 Travel Fee: **200 Galla**",
        zone_btn_label: "Zone {zone}",
        zone_locked: "🔒 Zone locked! Defeat the Boss in Zone {max} first.",
        zone_same: "❌ You are already here!",
        zone_confirm_title: "🚏 TRAVEL CONFIRMATION",
        zone_confirm_desc: "Travel to **Zone {zone}**?\nCost: **200 Galla**.\nBalance after payment: **{newBal} Galla**.",
        zone_success: "✅ Arrived at **Zone {zone}**! Good luck.",
        zone_fail_money: "❌ Not enough money! You need **200 Galla**.",
        zone_cancel: "❌ Travel cancelled.",

        // --- 📖 DICT & HELP ---
        dict_title: "📖 DICTIONARY: {item}",
        dict_type_weapon: "⚔️ Weapon",
        dict_type_material: "📦 Material",
        dict_rarity: "Rarity",
        dict_damage: "Base Damage",
        dict_skill: "Active Skills",
        dict_skill_none: "None",
        dict_desc_none: "No description available...",
        dict_footer: "Page {page}/{total} • ID: {id}",

        help_title: "📖 GACHIAKUTA BOT - GUIDE",
        help_desc: "Current prefix: `{prefix}`",
        help_footer: "Gachiakuta Bot",
        help_group_basic: "🆕 Basic",
        help_group_combat: "⚔️ Combat & Grinding",
        help_group_items: "🎒 Inventory & Items",

        cmd_desc_start: "Create character",
        cmd_desc_profile: "View profile",
        cmd_desc_hunt: "Hunt monsters",
        cmd_desc_farm: "Scavenge items",
        cmd_desc_inv: "View inventory",
        cmd_desc_equip: "Equip weapon",
        cmd_desc_dict: "Item dictionary",
        cmd_desc_rank: "View leaderboard",
        cmd_desc_lang: "Change language",
        cmd_desc_help: "View this menu",

        // --- 🔤 OTHERS ---
        btn_first: "⏮️ First",
        btn_prev: "◀️ Prev",
        btn_next: "Next ▶️",
        btn_last: "Last ⏭️",

        rarity_1: "Common",
        rarity_2: "Uncommon",
        rarity_3: "Rare",
        rarity_4: "Epic",
        rarity_5: "Mythic",
        rarity_6: "Secret Mythic",
        rarity_7: "Jinki",
        rarity_8: "SPECIAL",

        grade_d: "D (Scrap)",
        grade_c: "C (Common)",
        grade_b: "B (Good)",
        grade_a: "A (Excellent)",
        grade_s: "S (Masterpiece)",
    }
};

// Hàm lấy tên đa ngôn ngữ (Dùng cho Item/Monster/Skill)
function getName(obj, lang) {
    if (!obj) return "Unknown";
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['vi'] || "Unknown";
}

// Hàm lấy mô tả đa ngôn ngữ
function getDesc(obj, lang) {
    if (!obj) return "";
    return obj[lang] || obj['vi'] || "";
}

// Hàm dịch text
function t(input, lang = 'vi', placeholders = {}) {
    let text;

    // Nếu input là Object { vi: "...", en: "..." }
    if (typeof input === 'object' && input !== null) {
        text = input[lang] || input['vi'] || "Missing Text";
    } 
    // Nếu input là String "key_name" (Tra từ điển)
    else {
        const dict = LOCALES[lang] || LOCALES['vi'];
        text = dict[input] || input;
    }

    // Thay thế biến {variable}
    if (placeholders) {
        for (const prop in placeholders) {
            const regex = new RegExp(`{${prop}}`, 'g'); 
            text = text.replace(regex, placeholders[prop]);
        }
    }
    return text;
}

module.exports = { t, getName, getDesc };