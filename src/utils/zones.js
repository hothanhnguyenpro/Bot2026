const ZONES = {
    1: {
        name: { vi: "Khu Ổ Chuột", en: "Slums" },
        difficulty: 1.0,
        monsters: [
            { 
                imageFile: "Chuột Đột Biến.png", // Tên file ảnh trong thư mục assets
                name: { vi: "Chuột Đột Biến", en: "Mutant Rat" }, 
                basePower: 10, exp: 10, money: 15 
            },
            { 
                imageFile: "Gián Khổng Lồ.png",
                name: { vi: "Gián Khổng Lồ", en: "Giant Roach" }, 
                basePower: 12, exp: 12, money: 18 
            },
            { 
                imageFile: "Chó Hoang Cyborg.png",
                name: { vi: "Chó Hoang Cyborg", en: "Cyborg Dog" }, 
                basePower: 15, exp: 15, money: 25 
            },
            { 
                imageFile: "Vệ Binh Phế Liệu.png",
                name: { vi: "Vệ Binh Phế Liệu", en: "Scrap Guard" }, 
                basePower: 18, exp: 20, money: 30 
            },
            { 
                imageFile: "Vua Chuột Cống.png",
                name: { vi: "Vua Chuột Cống", en: "Rat King" }, 
                basePower: 30, exp: 50, money: 100 
            }
        ]
    }
};

module.exports = { ZONES };