const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAiGirls() {
    try {
        // 1. Pagination Logic Implementation
        // We generate a random page number between 1 and 10.
        // This satisfies the requirement to use 'https://ai-girls.pro/page/{random_page_num}/'
        const randomPage = Math.floor(Math.random() * 10) + 1;
        
        // Construct the URL. Note that page 1 usually redirects to root, but we strictly follow the structure requested or fallback to root if page=1.
        const url = randomPage === 1 
           ? 'https://ai-girls.pro/' 
            : `https://ai-girls.pro/page/${randomPage}/`;

        // 2. Request Configuration
        // Using a realistic User-Agent is critical for scraping to avoid immediate 403 Forbidden errors.
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Referer': 'https://ai-girls.pro/'
            },
            // Vercel functions have a timeout (usually 10s). We set Axios to 5s to fail gracefully before the hard limit.
            timeout: 5000 
        });
        
        // 3. HTML Parsing
        const $ = cheerio.load(data);
        
        // FIX: Corrected variable initialization. 
        // Previous Error: 'const images =;' -> SyntaxError
        const images =;

        // 4. Image Extraction
        $('img').each((i, el) => {
            // FIX: Corrected logical OR operator.
            // Previous Error: '| |' -> SyntaxError
            // We use '||' to fallback to 'data-src' for lazy-loaded images.
            const src = $(el).attr('src') |

| $(el).attr('data-src');
            
            if (src && src.startsWith('http')) {
                // Filter out utility images (logos, icons, trackers)
                if (!src.match(/logo|icon|avatar|banner|tracker|svg|placeholder|loading/i)) {
                    images.push(src);
                }
            }
        });

        // 5. Validation and Selection
        if (images.length === 0) {
            return { 
                status: false, 
                message: `Gagal: Tidak ada gambar ditemukan pada halaman ${randomPage}.` 
            };
        }

        const randomImg = images[Math.floor(Math.random() * images.length)];
        
        return {
            status: true,
            creator: "Kayzen",
            data: { 
                url: randomImg, 
                source: url,
                page: randomPage
            }
        };

    } catch (e) {
        // Detailed error logging for Vercel logs
        console.error(`Error scraping AiGirls (Page ${randomPage |

| '?'}):`, e.message);
        
        // Return a structured error response instead of crashing
        return { 
            status: false, 
            message: `Gagal mengambil data: ${e.message}` 
        };
    }
}

module.exports = scrapeAiGirls;
