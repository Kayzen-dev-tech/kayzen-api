const express = require('express');
const cors = require('cors');
const path = require('path');
const downloader = require('./downloader');
const ai = require('./ai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const validateKey = (req, res, next) => {
    const { apikey } = req.query;
    if (apikey === 'KAYZEN_99X_PRO') return next();
    res.status(403).json({ status: false, message: 'Invalid or missing API Key' });
};

app.get('/api/tiktok', validateKey, async (req, res) => {
    const { url, type } = req.query;
    const result = await downloader.tiktok(url, type);
    res.json(result);
});

app.get('/api/youtube', validateKey, async (req, res) => {
    const { url, type } = req.query;
    const result = await downloader.youtube(url, type);
    res.json(result);
});

app.get('/api/instagram', validateKey, async (req, res) => {
    const { url, type } = req.query;
    const result = await downloader.instagram(url, type);
    res.json(result);
});

app.get('/api/pinterest', validateKey, async (req, res) => {
    const { query, url } = req.query;
    const result = url ? await downloader.pinDown(url) : await downloader.pinSearch(query);
    res.json(result);
});

app.get('/api/twitter', validateKey, async (req, res) => {
    const { url } = req.query;
    const result = await downloader.twitter(url);
    res.json(result);
});

app.get('/api/ai/chat', validateKey, async (req, res) => {
    const { text } = req.query;
    const result = await ai.kayzen(text);
    res.json(result);
});

app.get('/api/ai/logic', validateKey, async (req, res) => {
    const { text, type } = req.query;
    const result = await ai.tools(text, type);
    res.json(result);
});

module.exports = app;
