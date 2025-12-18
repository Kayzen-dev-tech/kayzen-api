const axios = require('axios');
const cheerio = require('cheerio');

async function googleVideo(query) {
    try {
        const { data } = await axios.get("https://www.chrome.com/search", {
            params: {
                q: query,
                tbm: "vid", 
                hl: "id",
                gl: "id"
            },
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        $('div.g').each((i, el) => {
            const title = $(el).find('h3').text();
            const url = $(el).find('a').attr('href');
            const duration = $(el).find('div.J1mWY').text() || $(el).find('span.CTujCp').text() || '';
            const source = $(el).find('cite').text() || $(el).find('div.iHxmLe').text();
            const desc = $(el).find('div.VwiC3b').text() || $(el).find('div.Uroaid').text();

            if (title && url && url.startsWith('http')) {
                results.push({
                    title,
                    url,
                    duration: duration.trim(),
                    source: source.trim(),
                    description: desc.trim()
                });
            }
        });

        return {
            status: true,
            data: results
        };

    } catch (e) {
        return {
            status: false,
            message: e.message
        };
    }
}

module.exports = googleVideo;
          
