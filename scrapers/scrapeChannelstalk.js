const axios = require('axios');
const cheerio = require('cheerio');

async function channel(url) {
  // Validasi URL sederhana
  if (!url || !url.includes('whatsapp.com/channel')) {
    return { error: "URL tidak valid. Pastikan link berasal dari whatsapp.com/channel" };
  }

  try {
    const res = await axios.get(url, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" 
      }
    });

    const html = res.data;
    const $ = cheerio.load(html);

    const description = $("meta[property='og:description']").attr("content") || "";
    const title = $("meta[property='og:title']").attr("content") || null;
    const image = $("meta[property='og:image']").attr("content") || null;

    // Logika regex untuk mengambil angka followers
    let followers = null;
    const match = description.match(/([\d.,]+)\s*followers/i);
    if (match) {
        followers = match[1]; 
    }

    return {
      name: title,
      followers: followers,
      description: description,
      image: image,
      url: url
    };

  } catch (e) {
    console.error("Error scraping channel:", e.message);
    return null;
  }
}

module.exports = channel;
