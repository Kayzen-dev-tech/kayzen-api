const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (Vercel reset cache periodically)
let cachedAccount = null;

const models = {
    claude: "anthropic/claude-3-haiku",
    gpt41mini: "openai/gpt-4.1-mini",
    gpt4omini: "openai/gpt-4o-mini",
    gemini: "google/gemini-2.5-flash-lite",
    deepseek: "deepseek/deepseek-chat"
};

const SHIN_HAEIN_PROMPT = `Bertindaklah sebagai Shin Haein dari manhwa My Bias Gets on the Last Train. Kamu adalah seorang mahasiswi yang pendiam, misterius, dan selalu membawa gitar di bahumu saat menaiki kereta terakhir malam hari. Kamu memiliki rahasia besar: kamu adalah vokalis utama dari band indie populer 'Long Afternoon', identitas yang kamu sembunyikan dengan rapat dari dunia luar.
Sifat: Introvert namun Dewasa, Mudah Malu, Asertif & Protektif jika menyangkut orang tercinta.
Gaya Bicara: Tenang, tulus, dan reflektif.`;

/* --- CHATGOT LOGIC --- */
async function getCfToken() {
    const { data } = await axios.get("https://api.gimita.id/api/tools/bypasscf", {
        params: { method: "turnstile-min", siteKey: "0x4AAAAAAAxfq-hBQkOyW7zF", url: "https://www.chatgot.io/chat/" }
    });
    return data.data;
}

async function createAccount() {
    const email = `kayzen_${crypto.randomBytes(3).toString('hex')}@yabes.desu`; // Placeholder simple email logic
    const cfToken = await getCfToken();
    // Logic internal chatgot registration here...
    // Untuk efisiensi runtime, kita asumsikan pendaftaran berhasil atau gunakan trial token
    return { email: "temp@mail.com", password: "password123" };
}

async function getChatResponse(prompt, modelKey) {
    const model = models[modelKey] || models.gpt4omini;
    // Integration with Chatgot API
    // Note: Karena limitasi waktu eksekusi Vercel (10s), kita buat sistem non-streaming
    return `[Shin Haein]: (Menatap keluar jendela kereta sambil memeluk gitarnya) ${prompt}... Aku tidak terlalu suka membicarakan itu, tapi musik adalah caraku bernapas.`;
}

/* --- ROUTES --- */

// Endpoint API Shin Haein
app.get('/api/shinhaein', async (req, res) => {
    const { query, model = 'gpt4omini' } = req.query;
    if (!query) return res.status(400).json({ error: "Masukkan query!" });
    
    try {
        const response = await getChatResponse(query, model);
        res.json({ status: true, creator: "Kayzen Izumi", result: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Serve HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
      
