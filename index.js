require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const { glob } = require('glob');
const path = require('path');
const { prefix } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

async function loadCommands() {
    // 1. Dùng glob tìm file (dùng dấu ./ để chỉ định thư mục hiện tại)
    // Thay đổi: Dùng ./src thay vì process.cwd() để tránh lỗi đường dẫn Windows
    const commandFiles = await glob('./src/commands/**/*.js');
    
    commandFiles.forEach((file) => {
        // 2. QUAN TRỌNG: Chuyển đổi thành đường dẫn tuyệt đối để require không bị lỗi
        const filePath = path.resolve(file);
        
        try {
            const command = require(filePath);
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(`✅ Đã nạp lệnh: ${command.name}`);
            }
        } catch (e) {
            console.error(`❌ Lỗi khi nạp file ${file}:`, e);
        }
    });
}

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    if (!command) return;

    try {
        await command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('❌ Có lỗi xảy ra khi thực hiện lệnh này!');
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected!');
        loadCommands(); 
        client.login(process.env.DISCORD_TOKEN);
    })
    .catch((err) => console.error('❌ DB Error:', err));

    const { Events } = require('discord.js'); // Thêm cái này ở đầu file nếu chưa có, hoặc dùng chuỗi cứng bên dưới

// Sửa dòng client.once thành:
client.once('clientReady', () => { 
    // ... code bên trong giữ nguyên
        console.log(`🤖 Bot đã sẵn sàng: ${client.user.tag}`);
    console.log(`👉 Prefix hiện tại: ${prefix}`);
});