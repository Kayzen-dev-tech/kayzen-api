const axios = require('axios');
const cheerio = require('cheerio');

const randomAnime = {
  waifu: async () => {
    try {
      const page = Math.floor(Math.random() * 5) + 1; // Random page 1-5
      const { data } = await axios.get(`https://www.pngwing.com/id/search?q=waifu&page=${page}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(data);
      const images = [];
      
      // Ambil semua gambar dari hasil pencarian
      $('.png-bloc img').each((i, elem) => {
        let src = $(elem).attr('data-src') || $(elem).attr('src');
        if (src) {
          // Konversi ke URL full jika relative
          if (src.startsWith('//')) {
            src = 'https:' + src;
          }
          images.push(src);
        }
      });
      
      // Jika tidak ada gambar ditemukan, coba selector lain
      if (images.length === 0) {
        $('img[loading="lazy"]').each((i, elem) => {
          let src = $(elem).attr('data-src') || $(elem).attr('src');
          if (src && !src.includes('logo') && !src.includes('icon')) {
            if (src.startsWith('//')) {
              src = 'https:' + src;
            }
            images.push(src);
          }
        });
      }
      
      return images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;
    } catch (e) {
      console.error('Error fetching waifu:', e.message);
      return null;
    }
  },
  
  neko: async () => {
    try {
      const page = Math.floor(Math.random() * 5) + 1;
      const { data } = await axios.get(`https://www.pngwing.com/id/search?q=neko+anime&page=${page}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(data);
      const images = [];
      
      $('.png-bloc img').each((i, elem) => {
        let src = $(elem).attr('data-src') || $(elem).attr('src');
        if (src) {
          if (src.startsWith('//')) {
            src = 'https:' + src;
          }
          images.push(src);
        }
      });
      
      if (images.length === 0) {
        $('img[loading="lazy"]').each((i, elem) => {
          let src = $(elem).attr('data-src') || $(elem).attr('src');
          if (src && !src.includes('logo') && !src.includes('icon')) {
            if (src.startsWith('//')) {
              src = 'https:' + src;
            }
            images.push(src);
          }
        });
      }
      
      return images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;
    } catch (e) {
      console.error('Error fetching neko:', e.message);
      return null;
    }
  },

  loli: async () => {
    try {
      const page = Math.floor(Math.random() * 5) + 1;
      const { data } = await axios.get(`https://www.pngwing.com/id/search?q=anime+loli&page=${page}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(data);
      const images = [];
      
      $('.png-bloc img').each((i, elem) => {
        let src = $(elem).attr('data-src') || $(elem).attr('src');
        if (src) {
          if (src.startsWith('//')) {
            src = 'https:' + src;
          }
          images.push(src);
        }
      });
      
      if (images.length === 0) {
        $('img[loading="lazy"]').each((i, elem) => {
          let src = $(elem).attr('data-src') || $(elem).attr('src');
          if (src && !src.includes('logo') && !src.includes('icon')) {
            if (src.startsWith('//')) {
              src = 'https:' + src;
            }
            images.push(src);
          }
        });
      }
      
      return images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;
    } catch (e) {
      console.error('Error fetching loli:', e.message);
      return null;
    }
  }
};

module.exports = randomAnime;
