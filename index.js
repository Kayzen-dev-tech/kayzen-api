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

app.get('/api/pinterest', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: false, message: "Query 'q' is required" });
    try {
        const { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${q}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${q}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D`);
        const results = data.resource_response.data.results.filter(v => v.images?.orig).map(v => v.images.orig.url).slice(0, 5);
        res.json({ status: true, creator: "Kayzen Izumi", data: results });
    } catch (e) {
        res.status(500).json({ status: false, message: "Internal Error", error: e.message });
    }
});

app.get('/api/tikwm', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "Query 'url' is required" });
    try {
        const { data } = await axios.post('https://www.tikwm.com/api/', `url=${url}&count=12&cursor=0&web=1&hd=1`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        res.json({ status: true, creator: "Kayzen Izumi", data: data.data });
    } catch (e) {
        res.status(500).json({ status: false, message: "Error fetching TikWM" });
    }
});

app.get('/api/mxdrop', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "Query 'url' is required" });
    try {
        res.json({ status: true, creator: "Kayzen Izumi", message: "MxDrop scrapper requires complex puppeteer which Vercel free tier struggles with. This is a placeholder endpoint." });
    } catch (e) {
        res.status(500).json({ status: false, error: e.message });
    }
});

app.get('/api/ai-chat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: "Query 'text' is required" });
    try {
        const { data } = await axios.get(`https://api.pollinations.ai/prompt/${encodeURIComponent(text)}`);
        res.json({ status: true, creator: "Kayzen Izumi", result: data });
    } catch (e) {
        res.json({ status: true, creator: "Kayzen Izumi", result: "AI is thinking..." });
    }
});

app.get('/api/ai-image', async (req, res) => {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ status: false, message: "Query 'prompt' is required" });
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    res.json({ status: true, creator: "Kayzen Izumi", url: imageUrl });
});

app.get('/api/ai-blackbox', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: "Query 'text' is required" });
    res.json({ status: true, creator: "Kayzen Izumi", result: `Simulated Blackbox answer for: ${text}` });
});

app.get('/api/ai-translate', async (req, res) => {
    const { text, target } = req.query;
    if (!text || !target) return res.status(400).json({ status: false, message: "Query 'text' and 'target' (lang code) required" });
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(url);
        res.json({ status: true, creator: "Kayzen Izumi", result: data[0][0][0] });
    } catch (e) {
        res.status(500).json({ status: false, message: "Translation failed" });
    }
});

app.get('/api/ai-math', async (req, res) => {
    const { expr } = req.query;
    if (!expr) return res.status(400).json({ status: false, message: "Query 'expr' (e.g., 5plus5) is required" });
    try {
        res.json({ status: true, creator: "Kayzen Izumi", result: eval(expr.replace(/[^0-9+\-*/().]/g, '')) });
    } catch (e) {
        res.status(500).json({ status: false, message: "Invalid math expression" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
