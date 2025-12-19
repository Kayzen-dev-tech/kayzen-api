const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAiGirls() {
    try {
        const { data } = await axios.get('https://ai-girls.pro/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            timeout: 5000 // Timeout 5 detik
        });
        
        const $ = cheerio.load(data);
        const images =;

        $('img').each((i, el) => {
            const src = $(el).attr('src') |

| $(el).attr('data-src');
            
            if (src && src.startsWith('http')) {
                if (!src.match(/logo|icon|avatar|banner|tracker|svg/i)) {
                    images.push(src);
                }
            }
        });

        if (images.length === 0) return { status: false, message: "Gagal: Tidak ada gambar ditemukan." };

        const randomImg = images[Math.floor(Math.random() * images.length)];
        return {
            status: true,
            creator: "Kayzen",
            data: { url: randomImg, source: "https://ai-girls.pro/" }
        };

    } catch (e) {
        console.error("Error AiGirls:", e.message);
        return { 
            status: false, 
            message: `Gagal mengambil data: ${e.message}` 
        };
    }
}

module.exports = scrapeAiGirls;
