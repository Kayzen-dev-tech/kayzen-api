const axios = require('axios');
const cheerio = require('cheerio');

async function googleImage(query) {
  if (!query) return { error: "Query pencarian wajib diisi" };

  try {
    const res = await axios.get(
      "https://www.google.com/search",
      { 
        params: { tbm: "isch", q: query, safe: "off" },
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      }
    );

    const html = res.data;
    const $ = cheerio.load(html);
    const results = [];

    const pattern = /\[1,\[0,"[\d\w\-_]+",\["https?:\/\/(?:[^"]+)",\d+,\d+\]/gm;
    const matches = html.match(pattern);

    if (matches) {
        matches.forEach(match => {
            try {
                const clean = JSON.parse('{' + match.replace(/\[1,\[0,("[^"]+"),\[/,' "id": $1, "data": [') + '}');
                if (clean.data && clean.data[0]) {
                    results.push(clean.data[0]);
                }
            } catch (e) {
                // ignore parse error
            }
        });
    }

    if (results.length === 0) {
        $('img').each((i, el) => {
            const src = $(el).attr('data-src') || $(el).attr('src');
            if (src && src.startsWith('http') && !src.includes('google.com/images/branding')) {
                results.push(src);
            }
        });
    }

    return [...new Set(results)];

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = googleImage;
