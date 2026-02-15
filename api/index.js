const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');
const CryptoJS = require('crypto-js');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Config
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TELEGRAM_TOKEN = process.env.TG_BOT_REQUEST_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

// Helper: Send Telegram Message
const sendTelegram = async (text) => {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        });
    } catch (error) {
        console.error("Telegram Error:", error.message);
    }
};

// --- AIO SCRAPER FUNCTION ---
const scrapeAIO = async (targetUrl) => {
    const baseUrl = 'https://allinonedownloader.com';
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    try {
        const initRes = await axios.get(baseUrl, { headers: { 'User-Agent': ua } });
        const $ = cheerio.load(initRes.data);
        const token = $('#token').val();
        const apiPath = $('#scc').val();
        const cookies = initRes.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ');

        if (!token || !apiPath) throw new Error('Params not found');

        const jsPath = $('script[src*="template/main/assets/js/main.js"]').attr('src');
        const jsUrl = new URL(jsPath, baseUrl).href;
        const { data: jsContent } = await axios.get(jsUrl, { headers: { 'User-Agent': ua, 'Cookie': cookies } });

        const ivMatch = jsContent.match(/CryptoJS\.enc\.Hex\.parse\(['"]([a-f0-9]{32})['"]\)/);
        const ivHex = ivMatch ? ivMatch[1] : 'afc4e290725a3bf0ac4d3ff826c43c10';

        const key = CryptoJS.enc.Hex.parse(token);
        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const urlhash = CryptoJS.AES.encrypt(targetUrl, key, {
            iv: iv,
            padding: CryptoJS.pad.ZeroPadding
        }).toString();

        const apiUrl = apiPath.startsWith('http') ? apiPath : `https://allinonedownloader.com${apiPath}`;
        const { data } = await axios.post(apiUrl, 
            new URLSearchParams({ url: targetUrl, token: token, urlhash: urlhash }).toString(), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': baseUrl,
                    'Cookie': cookies,
                    'User-Agent': ua
                }
            }
        );
        return data;
    } catch (err) {
        return { error: err.message };
    }
};

// --- ROUTES ---

// 1. GET Home Message (API Test)
app.get('/api', (req, res) => {
    res.json({ 
        message: "Welcome to Kayzen Izumi API", 
        status: "Active",
        author: "Kayzen Izumi"
    });
});

// 2. POST Login (Admin Check)
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASS) {
        res.json({ success: true, token: "admin-session-active" });
    } else {
        res.status(401).json({ success: false, message: "Wrong Password" });
    }
});

// 3. POST Create Request (Simpan ke Supabase + Notif Telegram)
app.post('/api/request', async (req, res) => {
    const { name, message, contact } = req.body;

    if (!name || !message) {
        return res.status(400).json({ error: "Name and Message are required" });
    }

    // Insert to Supabase
    const { data, error } = await supabase
        .from('requests')
        .insert([{ name, message, contact_info: contact }])
        .select();

    if (error) return res.status(500).json({ error: error.message });

    // Send Telegram Notif
    const tgMsg = `🔔 *New Request Recieved*\n\n👤 *Name:* ${name}\n💬 *Msg:* ${message}\n📱 *Contact:* ${contact || '-'}`;
    await sendTelegram(tgMsg);

    res.json({ success: true, data });
});

// 4. GET All Requests (Admin Only - Simple Pass Check)
app.post('/api/admin/data', async (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASS) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 5. DELETE Request (Admin Only)
app.post('/api/admin/delete', async (req, res) => {
    const { password, id } = req.body;
    if (password !== ADMIN_PASS) return res.status(401).json({ error: "Unauthorized" });

    const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, message: "Deleted" });
});

// Endpoint AIO Downloader
app.get('/api/aio', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Query parameter 'url' is required" });
    
    const result = await scrapeAIO(url);
    res.json(result);
});

// Export untuk Vercel (Jangan pakai app.listen)
module.exports = app;
