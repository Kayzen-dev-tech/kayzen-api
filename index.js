const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const cheerio = require("cheerio");
const qs = require("qs");
const FormData = require("form-data");
const yts = require("yt-search");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const AUTHOR = "Kayzen Izumi";
const API_KEY = "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";

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

/* ================= AI & UTILS ================= */

app.get("/api/shinhaein", async (req, res) => {
    const { prompt } = req.query;
    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "meta-llama/llama-3.2-3b-instruct:free",
            messages: [{ role: "system", content: "Bertindaklah sebagai Shin Haein dari My Bias Gets on the Last Train." }, { role: "user", content: prompt }]
        }, { headers: { Authorization: `Bearer ${API_KEY}` } });
        res.json({ status: true, author: AUTHOR, result: response.data.choices[0].message.content });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/islamic-ai", async (req, res) => {
    try {
        const payload = { action: 'sendMessage', sessionId: crypto.randomUUID(), chatInput: req.query.q };
        const response = await axios.post('https://n8n.srv787268.hstgr.cloud/webhook/0eaacdaa-e724-4565-b3b3-21b7f92a6059/chat', payload);
        res.json({ status: true, author: AUTHOR, result: response.data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/flatai", async (req, res) => {
    try {
        const { data: html } = await axios.get('https://flatai.org/ai-image-generator-free-no-signup/');
        const nonce = html.match(/"nonce"\s*:\s*"([a-f0-9]{10})"/i)?.[1];
        const body = new URLSearchParams({ action: 'ai_generate_image', nonce, prompt: req.query.prompt, style_model: 'flataipro' });
        const { data } = await axios.post('https://flatai.org/wp-admin/admin-ajax.php', body.toString());
        res.json({ status: true, author: AUTHOR, result: data.data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

/* ================= DOWNLOADER ================= */

app.get("/api/douyin", async (req, res) => {
    try {
        const { data } = await axios.post("https://snapvideotools.com/id/api/snap", { text: req.query.url });
        res.json({ status: true, author: AUTHOR, result: data.data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/tiktok", async (req, res) => {
    try {
        const { data } = await axios.post("https://www.tikwm.com/api/", qs.stringify({ url: req.query.url }));
        res.json({ status: true, author: AUTHOR, result: data.data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/instagram", async (req, res) => {
    try {
        const parse = await axios.post('https://api.vidssave.com/api/contentsite_api/media/parse', qs.stringify({ auth: '20250901majwlqo', link: req.query.url }));
        res.json({ status: true, author: AUTHOR, result: parse.data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/twitter", async (req, res) => {
    try {
        const { data: html } = await axios.get('https://ssstwitter.com/id');
        const tt = html.match(/tt:'([^']+)'/)?.[1];
        const ts = html.match(/ts:(\d+)/)?.[1];
        const { data } = await axios.post('https://ssstwitter.com/id', new URLSearchParams({ id: req.query.url, tt, ts, source: 'form' }));
        const $ = cheerio.load(data);
        res.json({ status: true, author: AUTHOR, download: $('a.download-btn').attr('href') });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/spotify", async (req, res) => {
    try {
        const { data } = await axios.post('https://spotdown.org/api/download', { url: req.query.url });
        res.json({ status: true, author: AUTHOR, result: data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/on4t", async (req, res) => {
    try {
        const { data } = await axios.post('https://on4t.com/all-video-download', new URLSearchParams({ "link[]": req.query.url }));
        res.json({ status: true, author: AUTHOR, result: data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/play", async (req, res) => {
    try {
        const search = await yts(req.query.q);
        const form = new FormData();
        form.append("action", "yt_convert");
        form.append("youtube_url", search.videos[0].url);
        const { data } = await axios.post("https://youtubemp4free.com/wp-admin/admin-ajax.php", form);
        res.json({ status: true, author: AUTHOR, result: data.data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/ytdl", async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.zenkey.my.id/api/download/ytdl?url=${req.query.url}`);
        res.json({ status: true, author: AUTHOR, result: data.result });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

/* ================= SEARCH & SCRAPER ================= */

app.get("/api/donghua", async (req, res) => {
    try {
        const { data: html } = await axios.get("https://donghuafilm.com/", { params: { s: req.query.s } });
        const $ = cheerio.load(html);
        const result = [];
        $("article.bs").each((i, v) => result.push({ title: $(v).find('a').attr("title"), url: $(v).find('a').attr("href") }));
        res.json({ status: true, author: AUTHOR, result });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/otakudesu", async (req, res) => {
    try {
        const { data: html } = await axios.get(`https://otakudesu.best/?s=${req.query.s}&post_type=anime`);
        const $ = cheerio.load(html);
        const result = [];
        $('.chivsrc li').each((_, el) => result.push({ title: $(el).find('h2').text().trim(), url: $(el).find('a').attr('href') }));
        res.json({ status: true, author: AUTHOR, result });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/komikindo", async (req, res) => {
    try {
        const { data: html } = await axios.get("https://komikindo.ch/", { params: { s: req.query.s } });
        const $ = cheerio.load(html);
        const result = [];
        $(".animposx").each((_, el) => result.push({ title: $(el).find("h3").text().trim(), link: $(el).find("a").attr("href") }));
        res.json({ status: true, author: AUTHOR, result });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/cosmic-search", async (req, res) => {
    try {
        const { data: html } = await axios.get(`https://lc4.cosmicscans.asia/?s=${req.query.s}`);
        const $ = cheerio.load(html);
        const results = [];
        $(".bsx").each((_, el) => results.push({ title: $(el).find(".tt").text().trim(), link: $(el).find("a").attr("href") }));
        res.json({ status: true, author: AUTHOR, results });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/cosmic-genre", async (req, res) => {
    try {
        const { data: html } = await axios.get(`https://lc4.cosmicscans.asia/genres/${req.query.g || 'action'}/`);
        const $ = cheerio.load(html);
        const results = [];
        $(".bsx").each((_, el) => results.push({ title: $(el).find(".tt").text().trim(), link: $(el).find("a").attr("href") }));
        res.json({ status: true, author: AUTHOR, results });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/pixiv", async (req, res) => {
    try {
        const { data } = await axios.get(`https://api.nekolabs.web.id/discovery/pixiv/safe`, { params: { q: req.query.q } });
        res.json({ status: true, author: AUTHOR, result: data.result });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/pinterest", async (req, res) => {
    try {
        const url = "https://id.pinterest.com/resource/BaseSearchResource/get/";
        const data = `data=${encodeURIComponent(JSON.stringify({ options: { query: req.query.q, scope: "pins" }, context: {} }))}`;
        const resP = await axios.post(url, data);
        res.json({ status: true, author: AUTHOR, result: resP.data.resource_response.data.results });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/tiktok-search", async (req, res) => {
    try {
        const form = new FormData();
        form.append('keywords', req.query.q);
        const { data } = await axios.post('https://tikwm.com/api/feed/search', form, { headers: form.getHeaders() });
        res.json({ status: true, author: AUTHOR, result: data.data.videos });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

app.get("/api/tiktok-stalk", async (req, res) => {
    try {
        const { data } = await axios.get(`https://www.anonymous-viewer.com/api/tiktok/display?username=${req.query.user}`);
        res.json({ status: true, author: AUTHOR, result: data });
    } catch (e) { res.json({ status: false, error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started` [PORT]));
