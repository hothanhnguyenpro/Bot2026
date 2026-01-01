const GIFEncoder = require('gifencoder');
const { GifReader } = require('omggif'); // Thư viện đọc GIF thuần JS
const { createCanvas, loadImage, createImageData } = require('@napi-rs/canvas');
const fs = require('fs');

async function createAnimatedProfile(user, charPath, bgPath, avatarURL) {
    const width = 600;
    const height = 300;
    
    // 1. Setup Encoder (Bộ tạo GIF)
    const encoder = new GIFEncoder(width, height);
    encoder.start();
    encoder.setRepeat(0);   // 0 = Lặp vô tận
    encoder.setDelay(100);  // 100ms = 10fps
    encoder.setQuality(10); // Chất lượng trung bình

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 2. Load Tài nguyên tĩnh
    let bgImg, avatarImg;
    try { bgImg = await loadImage(bgPath); } catch (e) { bgImg = null; }
    avatarImg = await loadImage(avatarURL);

    // 3. Xử lý Nhân vật (GIF hoặc PNG)
    let charFrames = [];
    const isGif = charPath.endsWith('.gif');

    if (isGif) {
        // --- LOGIC MỚI DÙNG OMGGIF (Không cần C++) ---
        try {
            const gifBuffer = fs.readFileSync(charPath);
            const reader = new GifReader(gifBuffer);
            const numFrames = reader.numFrames();
            
            // Lấy tối đa 10 frame để không bị nặng
            const limitFrames = Math.min(numFrames, 10);

            for (let k = 0; k < limitFrames; k++) {
                // Tạo một canvas tạm để vẽ từng frame của GIF
                const frameInfo = reader.frameInfo(k);
                const frameData = new Uint8ClampedArray(reader.width * reader.height * 4);
                
                // Giải mã pixel vào mảng
                reader.decodeAndBlitFrameRGBA(k, frameData);
                
                // Tạo ImageData từ mảng pixel
                const imageData = createImageData(frameData, reader.width, reader.height);
                
                // Vẽ lên canvas tạm
                const tempCanvas = createCanvas(reader.width, reader.height);
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.putImageData(imageData, 0, 0);
                
                // Lưu lại frame đã xử lý
                charFrames.push(tempCanvas); 
            }
        } catch (err) {
            console.error("Lỗi đọc GIF:", err);
            charFrames.push(await loadImage(charPath)); // Lỗi thì load như ảnh tĩnh
        }
    } else {
        // Nếu là PNG tĩnh
        charFrames.push(await loadImage(charPath));
    }

    // 4. VẼ VÀ GHI GIF
    const loopCount = charFrames.length > 1 ? charFrames.length : 10; // Nếu ảnh tĩnh thì loop 10 lần để chạy hiệu ứng sáng

    for (let i = 0; i < loopCount; i++) {
        // A. Xóa frame cũ
        ctx.clearRect(0, 0, width, height);

        // B. Vẽ Nền
        if (bgImg) ctx.drawImage(bgImg, 0, 0, width, height);
        else { ctx.fillStyle = '#1a1c21'; ctx.fillRect(0, 0, width, height); }

        // C. Vẽ Avatar
        ctx.save();
        ctx.beginPath(); ctx.arc(70, 70, 50, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
        ctx.drawImage(avatarImg, 20, 20, 100, 100);
        ctx.restore();

        // Viền Avatar
        let classColor = '#ffffff';
        if (user.class === 'Vandal') classColor = '#ff4d4d';
        if (user.class === 'Scavenger') classColor = '#3498db';
        if (user.class === 'Tribal') classColor = '#2ecc71';
        
        ctx.strokeStyle = classColor; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(70, 70, 50, 0, Math.PI * 2); ctx.stroke();

        // D. Vẽ Nhân vật (Lấy frame tương ứng)
        // Nếu GIF có ít frame hơn vòng lặp, ta dùng phép chia lấy dư (%)
        const frameIndex = i % charFrames.length;
        const charImg = charFrames[frameIndex];
        
        if (charImg) {
            ctx.shadowColor = 'black'; ctx.shadowBlur = 10;
            // Vẽ nhân vật (resize về 180x180)
            ctx.drawImage(charImg, 400, 50, 180, 180);
            ctx.shadowBlur = 0;
        }

        // E. Text Thông tin
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(user.username, 140, 60);

        ctx.font = '24px Arial';
        ctx.fillStyle = classColor;
        ctx.fillText(`${user.class} • Lv.${user.level}`, 140, 95);

        ctx.fillStyle = '#f1c40f';
        ctx.font = '22px Arial';
        ctx.fillText(`💰 ${user.balance.toLocaleString()} Galla`, 140, 130);

        // F. Thanh XP (Hiệu ứng lấp lánh)
        const xpNeeded = user.level * 100;
        const xpPercent = Math.min(user.exp / xpNeeded, 1);

        ctx.fillStyle = '#202225'; ctx.fillRect(50, 230, 500, 25);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(50, 230, 500, 25);
        ctx.fillStyle = classColor; ctx.fillRect(50, 230, 500 * xpPercent, 25);
        
        // Bóng sáng chạy (Animation)
        const shinePos = 50 + (i * (500 / loopCount)) % 500;
        if (shinePos < 50 + 500 * xpPercent) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(shinePos, 230, 20, 25);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${user.exp}/${xpNeeded}`, 300, 248);
        ctx.textAlign = 'left';

        encoder.addFrame(ctx);
    }

    encoder.finish();
    return encoder.out.getData();
}

module.exports = { createAnimatedProfile };