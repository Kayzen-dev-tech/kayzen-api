const axios = require('axios');
const cheerio = require('cheerio');

async function hubbleSearch(query) {
  if (!query) return { error: "Query pencarian wajib diisi" };

  try {
    const url = `https://esahubble.org/images/?search=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    $('.row .col-md-3').each((i, el) => {
      const a = $(el).find('a');
      const img = $(el).find('img');
      
      const title = img.attr('alt') || $(el).text().trim();
      const link = a.attr('href');
      const thumbnail = img.attr('src');

      if (link && thumbnail) {
        results.push({
          title: title,
          url: `https://esahubble.org${link}`,
          thumbnail: thumbnail.startsWith('http') ? thumbnail : `https://esahubble.org${thumbnail}`
        });
      }
    });

    return results;

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = hubbleSearch;
