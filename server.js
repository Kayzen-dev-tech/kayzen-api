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
            apiUrl: 'https://kayzen-api.my.id'
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
            apiUrl: 'https://kayzen-api.my.id'
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
        const { query, cookie, csrftoken, limit } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Parameter query diperlukan',
                example: '/api/pinterest/search?query=frieren&limit=5',
                note: 'Cookie dan csrftoken sangat disarankan untuk hasil yang lebih baik'
            });
        }

        const resultLimit = parseInt(limit) || 10;
        if (resultLimit < 1 || resultLimit > 50) {
            return res.status(400).json({
                success: false,
                message: 'Parameter limit harus antara 1-50',
                example: '/api/pinterest/search?query=frieren&limit=10'
            });
        }

        if (!cookie || !csrftoken) {
            return res.status(400).json({
                success: false,
                message: 'Cookie dan csrftoken diperlukan untuk menggunakan Pinterest API',
                tutorial: {
                    step1: 'Buka Pinterest di browser dan login',
                    step2: 'Tekan F12 untuk membuka Developer Tools',
                    step3: 'Buka tab Application → Cookies → https://id.pinterest.com',
                    step4: 'Copy value dari _pinterest_sess dan csrftoken',
                    step5: 'Gunakan sebagai parameter di API'
                },
                example: '/api/pinterest/search?query=frieren&limit=10&cookie=YOUR_COOKIE&csrftoken=YOUR_TOKEN'
            });
        }

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
            'cookie': cookie,
            'origin': 'https://id.pinterest.com',
            'referer': `https://id.pinterest.com/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`,
            'user-agent': randomUserAgent,
            'x-csrftoken': csrftoken,
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

        const mappedResults = shuffledResults.slice(0, resultLimit).map((pin) => ({
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
            limit: resultLimit,
            totalResults: mappedResults.length,
            data: mappedResults,
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzen-api.my.id'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari Pinterest',
            error: error.message,
            note: 'Pastikan cookie dan csrftoken valid dan masih aktif dari Pinterest'
        });
    }
});

app.get('/api/tikwm/download', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'Parameter URL diperlukan',
                example: '/api/tikwm/download?url=https://www.tiktok.com/@username/video/1234567890'
            });
        }

        const apiUrl = 'https://www.tikwm.com/api/';
        
        const response = await axios.post(apiUrl, 
            `url=${encodeURIComponent(url)}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );

        const data = response.data;

        if (data.code !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Gagal mendapatkan data video',
                error: data.msg || 'Unknown error'
            });
        }

        res.json({
            success: true,
            data: {
                id: data.data.id,
                title: data.data.title,
                author: {
                    username: data.data.author.unique_id,
                    nickname: data.data.author.nickname,
                    avatar: data.data.author.avatar
                },
                video: {
                    noWatermark: `https://www.tikwm.com${data.data.play}`,
                    watermark: data.data.wmplay,
                    music: data.data.music,
                    cover: data.data.cover,
                    duration: data.data.duration
                },
                stats: {
                    views: data.data.play_count,
                    likes: data.data.digg_count,
                    comments: data.data.comment_count,
                    shares: data.data.share_count,
                    downloads: data.data.download_count
                },
                createdTime: data.data.create_time
            },
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzen-api.my.id'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari TikWM',
            error: error.message
        });
    }
});

app.get('/api/tikwm/search', async (req, res) => {
    try {
        const { query, limit } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Parameter query diperlukan',
                example: '/api/tikwm/search?query=funny&limit=10'
            });
        }

        const resultLimit = parseInt(limit) || 10;
        if (resultLimit < 1 || resultLimit > 50) {
            return res.status(400).json({
                success: false,
                message: 'Parameter limit harus antara 1-50'
            });
        }

        const apiUrl = 'https://www.tikwm.com/api/feed/search';
        
        const response = await axios.post(apiUrl, 
            `keywords=${encodeURIComponent(query)}&count=${resultLimit}&cursor=0&web=1&hd=1`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );

        const data = response.data;

        if (data.code !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Gagal melakukan pencarian',
                error: data.msg || 'Unknown error'
            });
        }

        const results = data.data.videos.map(video => ({
            id: video.video_id,
            title: video.title,
            author: {
                username: video.author.unique_id,
                nickname: video.author.nickname,
                avatar: video.author.avatar
            },
            video: {
                cover: video.cover,
                duration: video.duration,
                url: `https://www.tiktok.com/@${video.author.unique_id}/video/${video.video_id}`
            },
            stats: {
                views: video.play_count,
                likes: video.digg_count,
                comments: video.comment_count,
                shares: video.share_count
            },
            createdTime: video.create_time
        }));

        res.json({
            success: true,
            query: query,
            limit: resultLimit,
            totalResults: results.length,
            data: results,
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzen-api.my.id'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal melakukan pencarian di TikWM',
            error: error.message
        });
    }
});

app.post('/api/ai/poe', async (req, res) => {
    try {
        const { message, model, apiKey } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Parameter message diperlukan',
                example: { message: 'Hello, how are you?', model: 'gpt-3.5-turbo', apiKey: 'YOUR_POE_API_KEY' }
            });
        }

        if (!apiKey) {
            return res.status(400).json({
                success: false,
                message: 'API Key Poe.com diperlukan',
                tutorial: {
                    step1: 'Buka https://poe.com/api_key',
                    step2: 'Login dengan akun Poe Anda',
                    step3: 'Generate API Key baru',
                    step4: 'Copy API Key dan gunakan di request'
                }
            });
        }

        const selectedModel = model || 'capybara';
        
        const response = await axios.post('https://api.poe.com/bot/chat', {
            query: message,
            bot: selectedModel
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        res.json({
            success: true,
            data: {
                message: message,
                model: selectedModel,
                response: response.data.text || response.data
            },
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzen-api.my.id'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal berkomunikasi dengan Poe AI',
            error: error.message,
            note: 'Pastikan API Key valid dan model yang dipilih tersedia'
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
            ],
            tikwm: [
                '/api/tikwm/download',
                '/api/tikwm/search'
            ],
            ai: [
                '/api/ai/poe'
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
            '/api/mxdrop/info',
            '/api/pinterest/search'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/docs`);
});

module.exports = app;
