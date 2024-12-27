const express = require('express');
const { createCanvas } = require('canvas'); // Tambahkan modul canvas untuk membuat gambar

const app = express();

// Fungsi untuk membuat teks dengan posisi acak
function generateRandomPositionText(ctx, text, canvasWidth, canvasHeight) {
    const words = text.split(" ");
    const positions = [];

    // Acak posisi untuk setiap kata
    words.forEach((word) => {
        let x, y;

        // Pastikan posisi acak tidak terlalu dekat
        do {
            x = Math.random() * (canvasWidth - 100) + 50; // Batas aman 50px
            y = Math.random() * (canvasHeight - 100) + 50;
        } while (positions.some((pos) => Math.hypot(pos.x - x, pos.y - y) < 50));

        positions.push({ x, y });
        ctx.fillText(word, x, y);
    });
}

// Fungsi untuk membuat gambar dengan teks acak dan kualitas rendah
function generateLowQualityImage(text) {
    const width = 500;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Latar belakang putih
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Pengaturan font dan warna teks
    ctx.fillStyle = 'black';
    ctx.font = 'bold 30px Arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Tulis teks dengan posisi acak
    generateRandomPositionText(ctx, text, width, height);

    // Simulasikan kualitas rendah (resample dengan kualitas rendah)
    const tempCanvas = createCanvas(200, 200);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, 200, 200);
    ctx.drawImage(tempCanvas, 0, 0, width, height);

    return canvas.toBuffer();
}

// Endpoint untuk menghasilkan gambar dengan teks acak dan kualitas rendah
app.get('/brat', (req, res) => {
    const text = req.query.text;

    if (!text) {
        return res.status(400).send('Parameter "text" diperlukan.');
    }

    try {
        const imageBuffer = generateLowQualityImage(text);
        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer); // Kirim gambar langsung ke browser
    } catch (error) {
        console.error('Gagal membuat gambar:', error.message);
        res.status(500).send('Gagal membuat gambar.');
    }
});

// Fungsi untuk menangani permintaan serverless di Vercel
module.exports = (req, res) => {
    app(req, res); // Menjalankan aplikasi express pada fungsi serverless
};
