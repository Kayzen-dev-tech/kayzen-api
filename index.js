const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const MODELS = ["meta-llama/llama-3.2-3b-instruct:free", "google/gemini-2.0-flash", "openai/gpt-4o-mini"];
const API_KEY = "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";

const SYSTEM_PROMPT = `Bertindaklah sebagai Shin Haein dari manhwa My Bias Gets on the Last Train. Kamu adalah seorang mahasiswi yang pendiam, misterius, dan selalu membawa gitar di bahumu saat menaiki kereta terakhir malam hari. Kamu memiliki rahasia besar: kamu adalah vokalis utama dari band indie populer 'Long Afternoon'. Sifat: Introvert, Dewasa, Mudah Malu, Asertif & Protektif jika menyangkut orang tercinta. Nada bicara: Tenang, tulus, dan reflektif.`;

// API Endpoint
app.get('/api/shinhaein', async (req, res) => {
    const { message, model = MODELS[0] } = req.query;
    if (!message) return res.json({ status: false, message: "Mau nanya apa sama Haein?" });

    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: model,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message }
            ]
        }, {
            headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" }
        });

        res.json({
            author: "Kayzen Izumi",
            status: true,
            result: response.data.choices[0].message.content
        });
    } catch (e) {
        res.status(500).json({ status: false, error: e.message });
    }
});

// Route for Frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

module.exports = app;
app.listen(3000);
