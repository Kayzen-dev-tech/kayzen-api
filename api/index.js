const express = require('express');
const cors = require('cors');
const path = require('path');
const ai = require('../lib/ai');
const downloader = require('../lib/downloader');
const searcher = require('../lib/searcher');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

const validateKey = (req, res, next) => {
    const { apikey } = req.query;
    if (apikey === 'kayzen-secret') {
        return next();
    }
    res.status(403).json({ status: false, message: 'Invalid or missing API Key' });
};

app.get('/api/ai/chat', validateKey, async (req, res) => {
    const { text } = req.query;
    const result = await ai.kayzenChat(text);
    res.json({ status: true, result });
});

app.get('/api/ai/logic', validateKey, async (req, res) => {
    const { text, prompt } = req.query;
    const result = await ai.customAI(text, prompt);
    res.json({ status: true, result });
});

app.get('/api/tiktok', validateKey, async (req, res) => {
    const { url } = req.query;
    const result = await downloader.tiktok(url);
    res.json({ status: true, result });
});

app.get('/api/youtube', validateKey, async (req, res) => {
    const { url, type } = req.query;
    const result = type === 'mp3' ? await downloader.ytmp3(url) : await downloader.ytmp4(url);
    res.json({ status: true, result });
});

app.get('/api/pinterest', validateKey, async (req, res) => {
    const { query, url } = req.query;
    if (url) {
        const result = await downloader.pinDl(url);
        return res.json({ status: true, result });
    }
    const result = await searcher.pinSearch(query);
    res.json({ status: true, result });
});

module.exports = app;
