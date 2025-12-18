const axios = require('axios');
const cheerio = require('cheerio');

const randomAnime = {
  waifu: async () => {
    return await scrapePngWing('waifu');
  },
  
  neko: async () => {
    return await scrapePngWing('nekopara');
  },

  loli: async () => {
    return await scrapePngWing('anime loli');
  }
};

// Fungsi helper supaya tidak menulis ulang kode yang sama
async function scrapePngWing(query) {
    try {
        const { data } = await axios.get(`https://www.pngwing.com/id/search?q=${query}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        const images = [];

        // Mencari semua gambar di hasil pencarian PngWing
        $('figure.gallery-item__figure img').each((i, el) => {
            // PngWing biasanya menyimpan url asli di data-src atau src
            const url = $(el).attr('data-src') || $(el).attr('src');
            if (url) images.push(url);
        });

        if (images.length === 0) return null;

        // Ambil 1 gambar secara random
        const randomImg = images[Math.floor(Math.random() * images.length)];
        return randomImg;

    } catch (e) {
        console.error(`Error scraping ${query}:`, e.message);
        return null;
    }
}

module.exports = randomAnime;
