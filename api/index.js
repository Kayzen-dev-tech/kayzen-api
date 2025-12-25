const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/docs', (req, res) => {
    res.json({
        message: "Kayzen API Documentation",
        endpoints: {
            tikwm: "/api/tikwm?url=VIDEO_URL",
            mxdrop: "/api/mxdrop?query=SEARCH_OR_URL",
            pinterest: "/api/pinterest?query=SEARCH",
            ai: ["/api/ai/chatgpt", "/api/ai/bard", "/api/ai/claude", "/api/ai/midjourney", "/api/ai/image-gen"]
        }
    });
});

app.get('/api/tikwm', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: "Input URL TikTok" });
    try {
        const response = await axios.post('www.tikwm.com', { url });
        res.json({ status: true, data: response.data.data });
    } catch (e) {
        res.json({ status: false });
    }
});

app.get('/api/mxdrop', async (req, res) => {
    const { query } = req.query;
    res.json({ status: true, message: "Endpoint mxdrop ready", query });
});

app.get('/api/pinterest', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, message: "Input query" });
    const dummyImages = Array.from({length: 5}, (_, i) => `picsum.photos{query}${i}/800/1200`);
    res.json({ status: true, results: dummyImages });
});

app.get('/api/ai/chatgpt', (req, res) => { res.json({ status: true, model: "ChatGPT" }); });
app.get('/api/ai/bard', (req, res) => { res.json({ status: true, model: "Google Bard" }); });
app.get('/api/ai/claude', (req, res) => { res.json({ status: true, model: "Claude" }); });
app.get('/api/ai/midjourney', (req, res) => { res.json({ status: true, model: "Midjourney" }); });
app.get('/api/ai/image-gen', (req, res) => { res.json({ status: true, model: "DALL-E" }); });

module.exports = app;
