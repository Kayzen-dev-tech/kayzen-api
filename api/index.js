const express = require('express');
const cors = require('cors');
const path = require('path');
const scraper = require('../lib/scrapers');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const VALID_API_KEY = "KAYZEN_SECRET_8891";

const validateKey = (req, res, next) => {
    const { apikey } = req.query;
    if (apikey === VALID_API_KEY) return next();
    res.status(401).json({ status: false, message: "Invalid or missing API Key" });
};

app.get('/api/ai/chat', validateKey, async (req, res) => {
    const { text } = req.query;
    const prompt = `Nama lo Kayzen Izumi, umur 18 tahun. Gaya bicara lo asik, non-baku, pake lo-gue, dan santai banget kayak anak muda zaman sekarang. Jangan kaku.`;
    try {
        const result = await scraper.aiChat(text, prompt);
        res.json({ status: true, creator: "Kayzen Izumi", result });
    } catch (e) {
        res.status(500).json({ status: false, error: e.message });
    }
});

app.get('/api/pinterest', validateKey, async (req, res) => {
    const { query, url } = req.query;
    try {
        const result = query ? await scraper.pinSearch(query) : await scraper.pinDl(url);
        res.json({ status: true, creator: "Kayzen Izumi", result });
    } catch (e) {
        res.status(500).json({ status: false, error: e.message });
    }
});

app.get('/api/tiktok', validateKey, async (req, res) => {
    const { url, query, username } = req.query;
    try {
        let result;
        if (url) result = await scraper.ttDl(url);
        else if (query) result = await scraper.ttSearch(query);
        else if (username) result = await scraper.ttStalk(username);
        res.json({ status: true, creator: "Kayzen Izumi", result });
    } catch (e) {
        res.status(500).json({ status: false, error: e.message });
    }
});

module.exports = app;
