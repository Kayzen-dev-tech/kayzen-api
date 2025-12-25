const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

app.get('/api/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'Parameter url is required' });
    try {
        const response = await axios.post('https://www.tikwm.com/api/', { url: url });
        res.json({ status: true, creator: 'Kayzen Izumi', result: response.data.data });
    } catch (e) {
        res.status(500).json({ status: false, message: 'Error fetching data' });
    }
});

app.get('/api/mxdrop', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'Parameter url is required' });
    try {
        res.json({ status: true, creator: 'Kayzen Izumi', message: 'MXDrop endpoint ready (requires headless browser for full bypass)', original_url: url });
    } catch (e) {
        res.status(500).json({ status: false, message: 'Error' });
    }
});

app.get('/api/pinterest', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: false, message: 'Parameter q is required' });
    try {
        const response = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${q}&data={"options":{"isPrefetch":false,"query":"${q}","scope":"pins","no_fetch_context_on_resource":false},"context":{}}`);
        const data = response.data.resource_response.data.results;
        const images = data.slice(0, 5).map(v => v.images.orig.url);
        res.json({ status: true, creator: 'Kayzen Izumi', count: images.length, result: images });
    } catch (e) {
        res.status(500).json({ status: false, message: 'Error searching pinterest' });
    }
});

app.get('/api/ai/chat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: 'Parameter text is required' });
    try {
        res.json({ status: true, creator: 'Kayzen Izumi', result: `AI Response to: ${text} (Simulated)` });
    } catch (e) {
        res.status(500).json({ status: false, message: 'Error' });
    }
});

app.get('/api/ai/image', async (req, res) => {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ status: false, message: 'Parameter prompt is required' });
    try {
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}`;
        res.json({ status: true, creator: 'Kayzen Izumi', result: imageUrl });
    } catch (e) {
        res.status(500).json({ status: false, message: 'Error' });
    }
});

app.get('/api/ai/summary', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: 'Parameter text is required' });
    res.json({ status: true, creator: 'Kayzen Izumi', result: "Summary feature endpoint ready." });
});

app.get('/api/ai/translate', async (req, res) => {
    const { text, lang } = req.query;
    if (!text) return res.status(400).json({ status: false, message: 'Parameter text is required' });
    res.json({ status: true, creator: 'Kayzen Izumi', result: `Translated: ${text} to ${lang || 'en'}` });
});

app.get('/api/ai/code', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ status: false, message: 'Parameter query is required' });
    res.json({ status: true, creator: 'Kayzen Izumi', result: "Code generation endpoint ready." });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
