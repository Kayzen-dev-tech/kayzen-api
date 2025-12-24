const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors');

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

app.get('/api/mxdrop/download', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ success: false, message: 'Parameter URL diperlukan' });
        }
        if (!url.includes('mxdrop.to')) {
            return res.status(400).json({ success: false, message: 'URL harus dari mxdrop.to' });
        }
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        res.json({
            success: true,
            data: {
                title: "File Name.zip",
                fileSize: "150 MB",
                uploadDate: "2024-01-15",
                downloadUrl: "https://direct.download.link/file.zip",
                originalUrl: url
            },
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzenapi.com'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data dari mxdrop.to', error: error.message });
    }
});

app.get('/api/mxdrop/info', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ success: false, message: 'Parameter URL diperlukan' });
        }
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        res.json({
            success: true,
            data: {
                title: "File Name.zip",
                description: "File description here",
                fileSize: "150 MB",
                uploadDate: "2024-01-15",
                views: "1,234",
                url: url
            },
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzenapi.com'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil informasi dari mxdrop.to', error: error.message });
    }
});

app.get('/api/ai/poe', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: 'Parameter query diperlukan.' });
        }
        const response = {
            success: true,
            data: {
                response: `Hasil untuk query "${query}"`,
                query: query
            }
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data dari AI Poe.com', error: error.message });
    }
});

app.get('/api/pinterest/search', async (req, res) => {
});

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        status: 'online',
        endpoints: {
            mxdrop: ['/api/mxdrop/download', '/api/mxdrop/info'],
            pinterest: ['/api/pinterest/search'],
            ai: ['/api/ai/poe']
        },
        author: 'Kayzen Izumi',
        contact: {
            whatsapp: '628152313006',
            telegram: '@nonewpo',
            instagram: '@kayzenfry'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
