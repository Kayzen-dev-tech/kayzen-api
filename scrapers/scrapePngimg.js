const axios = require('axios');
const cheerio = require('cheerio');

async function pngimg(query) {
  if (!query) return { error: "Query pencarian wajib diisi" };

  try {
    const url = `https://pngimg.com/search?search=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    const $ = cheerio.load(data);
    const results = [];

    $('.png_img').each((i, el) => {
      const imgEl = $(el).find('img');
      const linkEl = $(el).find('a');

      let imgUrl = imgEl.attr('src');
      let pageUrl = linkEl.attr('href');
      const title = imgEl.attr('alt') || query;

      if (imgUrl && pageUrl) {
        if (!imgUrl.startsWith('http')) imgUrl = `https://pngimg.com${imgUrl}`;
        if (!pageUrl.startsWith('http')) pageUrl = `https://pngimg.com${pageUrl}`;

        // Mencoba mendapatkan resolusi penuh dengan menghapus path 'small' jika ada
        const fullUrl = imgUrl.replace('/small/', '/');

        results.push({
          title: title.trim(),
          preview: imgUrl,
          url: fullUrl,
          page: pageUrl
        });
      }
    });

    return results;

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = pngimg;
