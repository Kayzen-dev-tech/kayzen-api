const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeKajian(query) {
  if (!query) return { error: "Query pencarian wajib diisi (contoh: doa harian)" };

  try {
    // Menggunakan search engine default kajian.net
    const url = `https://kajian.net/?s=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    // Target elemen artikel/postingan
    $('div.post-listing, article.post').each((i, el) => {
      const title = $(el).find('h2.post-title, h2.title, h3').text().trim();
      const linkPage = $(el).find('a').first().attr('href');
      const snippet = $(el).find('.entry p, .post-entry p').text().trim();
      
      // Mencoba mencari link download mp3 langsung jika ada di snippet/halaman depan
      let audioUrl = $(el).find('a[href$=".mp3"]').attr('href');

      if (title && linkPage) {
        results.push({
          title: title,
          description: snippet || "Tidak ada deskripsi",
          linkPage: linkPage,
          // Jika tidak ada mp3 langsung, user harus membuka linkPage (nanti bisa dibuat endpoint detail jika perlu)
          audio: audioUrl || null 
        });
      }
    });

    if (results.length === 0) {
        return { error: "Tidak ditemukan kajian dengan kata kunci tersebut." };
    }

    return results;

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = scrapeKajian;
