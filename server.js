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

app.get('/api/pinterest/search', async (req, res) => {
    try {
        const { query, cookie, csrftoken } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Parameter query diperlukan',
                example: '/api/pinterest/search?query=frieren'
            });
        }

        const defaultCookie = '_pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4VHN5dHNEYXByaWJ5OGh1R3M3ZkhWRGU2TmhLR0VEanVnQ2hXY3VncFZWZldJVWJOdEFJR09ZQktnVmplMFhaUVVrQ2daQT09; csrftoken=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
        const defaultCsrftoken = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

        const randomSuffix = Math.floor(Math.random() * 10000);
        const modifiedQuery = `${query} ${randomSuffix}`;

        const userAgents = [
            'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        ];
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        const randomPageSize = Math.floor(Math.random() * 30) + 20;

        const url = 'https://id.pinterest.com/resource/BaseSearchResource/get/';
        const headers = {
            'accept': 'application/json, text/javascript, */*, q=0.01',
            'accept-language': 'id-ID',
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': cookie || defaultCookie,
            'origin': 'https://id.pinterest.com',
            'referer': `https://id.pinterest.com/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`,
            'user-agent': randomUserAgent,
            'x-csrftoken': csrftoken || defaultCsrftoken,
            'x-pinterest-appstate': 'active',
            'x-pinterest-source-url': `/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`,
            'x-requested-with': 'XMLHttpRequest',
        };

        const postData = new URLSearchParams();
        postData.append('source_url', `/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`);
        postData.append('data', JSON.stringify({
            options: {
                query: modifiedQuery,
                scope: 'pins',
                page_size: randomPageSize,
                appliedProductFilters: '---',
                domains: null,
                user: null,
                seoDrawerEnabled: false,
                applied_unified_filters: null,
                auto_correction_disabled: false,
                journey_depth: null,
                source_id: null,
                source_module_id: null,
                source_url: `/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`,
                static_feed: false,
                selected_one_bar_modules: null,
                query_pin_sigs: null,
                price_max: null,
                price_min: null,
                request_params: null,
                top_pin_ids: null,
                article: null,
                corpus: null,
                customized_rerank_type: null,
                filters: null,
                rs: 'typed',
                redux_normalize_feed: true,
                bookmarks: [],
            },
            context: {},
        }));

        const response = await axios.post(url, postData.toString(), { 
            headers,
            timeout: 15000
        });

        const results = response.data?.resource_response?.data?.results || [];

        const shuffledResults = [...results].sort(() => Math.random() - 0.5);

        const mappedResults = shuffledResults.map((pin) => ({
            id: pin.id,
            title: pin.grid_title || '‎ ‎ ‎',
            description: pin.description || undefined,
            imageUrl: pin.images?.['736x']?.url || pin.images?.['474x']?.url || 'N/A',
            videoUrl: pin.story_pin_data?.pages?.[0]?.blocks?.[0]?.video?.video_list?.V_HLSV3_MOBILE?.url || 'gak ada',
            pinner: pin.pinner?.full_name || 'Unknown',
            pinnerUsername: pin.pinner?.username || 'Unknown',
            boardName: pin.board?.name || 'Unknown',
            boardUrl: pin.board?.url || '/',
        }));

        res.json({
            success: true,
            query: query,
            totalResults: mappedResults.length,
            data: mappedResults,
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzenapi.com'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari Pinterest',
            error: error.message,
            note: 'Pastikan cookie dan csrftoken valid. Anda bisa mendapatkannya dari browser dengan login ke Pinterest terlebih dahulu.'
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
            ],
            pinterest: [
                '/api/pinterest/search'
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
