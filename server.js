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
            return res.status(400).json({
                success: false,
                message: 'Parameter URL diperlukan',
                example: '/api/mxdrop/download?url=https://mxdrop.to/xxxxx'
            });
        }

        if (!url.includes('mxdrop.to')) {
            return res.status(400).json({
                success: false,
                message: 'URL harus dari mxdrop.to'
            });
        }

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        const title = $('title').text().trim() || 'Unknown';
        const downloadButton = $('a.btn.btn-primary').attr('href');
        const fileSize = $('.card-body p:contains("Size")').text().replace('Size:', '').trim() || 'Unknown';
        const uploadDate = $('.card-body p:contains("Uploaded")').text().replace('Uploaded:', '').trim() || 'Unknown';

        let directDownloadUrl = null;
        if (downloadButton) {
            try {
                const downloadPage = await axios.get(downloadButton, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': url
                    }
                });
                const $2 = cheerio.load(downloadPage.data);
                directDownloadUrl = $2('a.btn.btn-success').attr('href') || downloadButton;
            } catch (error) {
                directDownloadUrl = downloadButton;
            }
        }

        res.json({
            success: true,
            data: {
                title: title,
                fileSize: fileSize,
                uploadDate: uploadDate,
                downloadUrl: directDownloadUrl || 'Not found',
                originalUrl: url
            },
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzenapi.com'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari mxdrop.to',
            error: error.message
        });
    }
});

app.get('/api/mxdrop/info', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'Parameter URL diperlukan',
                example: '/api/mxdrop/info?url=https://mxdrop.to/xxxxx'
            });
        }

        if (!url.includes('mxdrop.to')) {
            return res.status(400).json({
                success: false,
                message: 'URL harus dari mxdrop.to'
            });
        }

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        const title = $('title').text().trim() || 'Unknown';
        const description = $('meta[name="description"]').attr('content') || 'No description';
        const fileSize = $('.card-body p:contains("Size")').text().replace('Size:', '').trim() || 'Unknown';
        const uploadDate = $('.card-body p:contains("Uploaded")').text().replace('Uploaded:', '').trim() || 'Unknown';
        const views = $('.card-body p:contains("Views")').text().replace('Views:', '').trim() || 'Unknown';

        res.json({
            success: true,
            data: {
                title: title,
                description: description,
                fileSize: fileSize,
                uploadDate: uploadDate,
                views: views,
                url: url
            },
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzenapi.com'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil informasi dari mxdrop.to',
            error: error.message
        });
    }
});

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: {
            mxdrop: [
                '/api/mxdrop/download',
                '/api/mxdrop/info'
            ]
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
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan',
        availableEndpoints: [
            '/',
            '/docs',
            '/api/status',
            '/api/mxdrop/download',
            '/api/mxdrop/info'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/docs`);
});

module.exports = app;
