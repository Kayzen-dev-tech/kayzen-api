const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

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

// Export untuk Vercel (Jangan pakai app.listen)
module.exports = app;
