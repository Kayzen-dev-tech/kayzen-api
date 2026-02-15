const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const qs = require('qs');

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

// --- HELPER AIO DOWNLOADER ---
const AUTH_KEY = '20250901majwlqo';
const DOMAIN_API = 'api-ak.vidssave.com';

async function parseMedia(url) {
    const data = qs.stringify({
        auth: AUTH_KEY,
        domain: DOMAIN_API,
        origin: 'source',
        link: url
    });
    const res = await axios.post('https://api.vidssave.com/api/contentsite_api/media/parse', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data;
}

async function getDownloadLink(requestToken) {
    const data = qs.stringify({
        auth: AUTH_KEY,
        domain: DOMAIN_API,
        request: requestToken,
        no_encrypt: 1
    });
    const res = await axios.post('https://api.vidssave.com/api/contentsite_api/media/download', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data;
}

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
app.get('/api/download', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({
            status: false,
            author: 'Kayzen Izumi',
            message: 'Masukkan parameter URL! Contoh: /api/download?url=LINK_IG'
        });
    }

    try {
        const parsed = await parseMedia(targetUrl);
        
        if (!parsed.data || !parsed.data.resources) {
            return res.status(404).json({ status: false, message: 'Media tidak ditemukan atau tidak didukung.' });
        }

        const resources = parsed.data.resources;
        const video = resources.filter(r => r.type === 'video').map(r => ({
            quality: r.quality,
            format: r.format,
            request: r.resource_content
        }));

        const audio = resources.filter(r => r.type === 'audio').map(r => ({
            format: r.format,
            request: r.resource_content
        }));

        // Ambil link download untuk video kualitas pertama secara otomatis
        let downloadInfo = null;
        if (video.length > 0) {
            const dlData = await getDownloadLink(video[0].request);
            downloadInfo = dlData.data;
        }

        res.json({
            status: true,
            author: 'Kayzen Izumi',
            title: parsed.data.title,
            thumbnail: parsed.data.thumbnail,
            duration: parsed.data.duration,
            video,
            audio,
            download: downloadInfo // Berisi task_id dan URL file final
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        });
    }
});

// Export untuk Vercel (Jangan pakai app.listen)
module.exports = app;
