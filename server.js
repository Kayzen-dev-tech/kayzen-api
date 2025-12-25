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

app.get('/api/pinterest/search-v2', async (req, res) => {
    try {
        const { query, limit } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Parameter query diperlukan',
                example: '/api/pinterest/search-v2?query=frieren&limit=10'
            });
        }

        const resultLimit = parseInt(limit) || 10;
        if (resultLimit < 1 || resultLimit > 20) {
            return res.status(400).json({
                success: false,
                message: 'Parameter limit harus antara 1-20 untuk endpoint v2',
                example: '/api/pinterest/search-v2?query=frieren&limit=10'
            });
        }

        const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        };

        const response = await axios.get(searchUrl, { 
            headers,
            timeout: 15000,
            maxRedirects: 5
        });

        const html = response.data;
        
        const scriptRegex = /<script[^>]*id="__PWS_INITIAL_PROPS__"[^>]*>(.*?)<\/script>/s;
        const match = html.match(scriptRegex);
        
        const results = [];
        
        if (match && match[1]) {
            try {
                const jsonStr = match[1].trim();
                const jsonData = JSON.parse(jsonStr);
                
                const initialRedux = jsonData?.initialReduxState;
                
                if (initialRedux && initialRedux.pins) {
                    const pins = initialRedux.pins;
                    
                    for (const pinId in pins) {
                        if (results.length >= resultLimit) break;
                        
                        const pin = pins[pinId];
                        if (pin && pin.images) {
                            const pinData = {
                                id: pin.id || pinId,
                                title: pin.grid_title || pin.title || '‎ ‎ ‎',
                                description: pin.description || undefined,
                                imageUrl: pin.images?.['736x']?.url || pin.images?.['474x']?.url || pin.images?.orig?.url || 'N/A',
                                videoUrl: pin.videos?.video_list?.V_720P?.url || pin.story_pin_data?.pages?.[0]?.blocks?.[0]?.video?.video_list?.V_HLSV3_MOBILE?.url || 'gak ada',
                                pinner: pin.pinner?.full_name || pin.pinner?.username || 'Unknown',
                                pinnerUsername: pin.pinner?.username || 'Unknown',
                                boardName: pin.board?.name || 'Unknown',
                                boardUrl: pin.board?.url || '/',
                                link: `https://www.pinterest.com/pin/${pin.id || pinId}/`
                            };
                            results.push(pinData);
                        }
                    }
                }
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError.message);
            }
        }

        if (results.length === 0) {
            const imgRegex = /<img[^>]+src="https:\/\/i\.pinimg\.com\/[^"]+"/g;
            const imgMatches = html.match(imgRegex) || [];
            
            const uniqueImages = new Set();
            imgMatches.forEach(imgTag => {
                const urlMatch = imgTag.match(/src="([^"]+)"/);
                if (urlMatch && urlMatch[1]) {
                    const imgUrl = urlMatch[1];
                    if (imgUrl.includes('736x') || imgUrl.includes('474x')) {
                        uniqueImages.add(imgUrl);
                    }
                }
            });

            let counter = 1;
            for (const imgUrl of uniqueImages) {
                if (results.length >= resultLimit) break;
                
                results.push({
                    id: `scraped_${counter}`,
                    title: `${query} - Image ${counter}`,
                    description: undefined,
                    imageUrl: imgUrl,
                    videoUrl: 'gak ada',
                    pinner: 'Pinterest User',
                    pinnerUsername: 'pinterest',
                    boardName: 'Search Results',
                    boardUrl: '/',
                    link: searchUrl
                });
                counter++;
            }
        }

        res.json({
            success: true,
            query: query,
            limit: resultLimit,
            totalResults: results.length,
            data: results,
            method: 'scraping',
            note: 'Endpoint v2 tanpa cookie - hasil mungkin terbatas',
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzen-api.my.id'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari Pinterest',
            error: error.message,
            note: 'Pinterest mungkin memblokir scraping. Gunakan endpoint /api/pinterest/search dengan cookie untuk hasil yang lebih baik.'
        });
    }
});

app.get('/api/tiktok/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Parameter query diperlukan',
                example: '/api/tiktok/search?query=jedag jedug'
            });
        }

        const postData = new URLSearchParams({
            keywords: query,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1
        });

        const response = await axios.post('https://www.tikwm.com/api/feed/search', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://www.tikwm.com',
                'Referer': 'https://www.tikwm.com/'
            }
        });

        const data = response.data;

        if (data && data.data) {
            res.json({
                success: true,
                query: query,
                total: data.data.length,
                data: data.data,
                author: 'Kayzen Izumi',
                apiUrl: 'https://kayzen-api.my.id'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Tidak ditemukan hasil untuk query tersebut',
                originalResponse: data
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dari TikWM',
            error: error.message
        });
    }
});

app.get('/api/ai/blackbox', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Parameter query diperlukan',
                example: '/api/ai/blackbox?query=apa itu javascript'
            });
        }

        const response = await axios.post('https://www.blackbox.ai/api/chat', {
            messages: [{ id: "K80s36K", content: query, role: "user" }],
            previewToken: null,
            userId: null,
            codeModelMode: true,
            agentMode: {},
            trendingAgentMode: {},
            isMicMode: false,
            isChromeExt: false,
            githubToken: null
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://www.blackbox.ai'
            }
        });

        res.json({
            success: true,
            query: query,
            response: response.data,
            model: 'Blackbox AI',
            author: 'Kayzen Izumi',
            apiUrl: 'https://kayzen-api.my.id'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil respon dari AI',
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
            ],
            pinterest: [
                '/api/pinterest/search (requires cookie)',
                '/api/pinterest/search-v2 (no cookie needed)'
            ],
            tiktok: [
                '/api/tiktok/search'
            ],
            ai: [
                '/api/ai/blackbox'
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
            '/api/pinterest/search',
            '/api/pinterest/search-v2',
            '/api/tiktok/search',
            '/api/ai/blackbox'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/docs`);
});

module.exports = app;
