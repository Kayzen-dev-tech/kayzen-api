const express = require('express');
const cors = require('cors');
const path = require('path');
const ai = require('../lib/ai');
const downloader = require('../lib/downloader');
const searcher = require('../lib/searcher');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/docs.html'));
});

const validateKey = (req, res, next) => {
    const { apikey } = req.query;
    if (apikey === 'kayzen-secret') {
        return next();
    }
    res.status(403).json({ status: false, message: 'Invalid API Key' });
};

app.get('/api/ai/chat', validateKey, async (req, res) => {
    const result = await ai.kayzenChat(req.query.text);
    res.json({ status: true, result });
});

app.get('/api/ai/logic', validateKey, async (req, res) => {
    const result = await ai.aiLogic(req.query.text);
    res.json({ status: true, result });
});

app.get('/api/ai/art', validateKey, async (req, res) => {
    const result = await ai.aiArtPrompt(req.query.text);
    res.json({ status: true, result });
});

app.get('/api/ai/translate', validateKey, async (req, res) => {
    const result = await ai.aiTranslate(req.query.text);
    res.json({ status: true, result });
});

app.get('/api/ai/code', validateKey, async (req, res) => {
    const result = await ai.aiCode(req.query.text);
    res.json({ status: true, result });
});

app.get('/api/tiktok', validateKey, async (req, res) => {
    const result = await downloader.tiktok(req.query.url);
    res.json({ status: true, result });
});

app.get('/api/pinterest', validateKey, async (req, res) => {
    const { query, url } = req.query;
    const result = url ? await downloader.pinDl(url) : await searcher.pinSearch(query);
    res.json({ status: true, result });
});

app.get('/api/youtube', validateKey, async (req, res) => {
    const result = req.query.type === 'mp3' ? await downloader.ytmp3(req.query.url) : await downloader.ytmp4(req.query.url);
    res.json({ status: true, result });
});

module.exports = app;
