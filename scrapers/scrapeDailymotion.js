const axios = require('axios');

async function dailymotion(url) {
  if (!url) return { error: "URL DailyMotion wajib diisi" };

  try {
    const endpoint = 'https://vidomon.com/wp-json/aio-dl/video-data/';
    
    // Payload harus x-www-form-urlencoded sesuai standar plugin aio-dl
    const data = new URLSearchParams();
    data.append('url', url);

    const config = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://vidomon.com',
        'Referer': 'https://vidomon.com/',
        'x-requested-with': 'XMLHttpRequest'
      }
    };

    const response = await axios.post(endpoint, data, config);
    const json = response.data;

    if (!json || json.error) {
      return { error: "Video tidak ditemukan atau URL salah." };
    }

    // Parsing hasil dari API vidomon
    const result = {
      title: json.title || "DailyMotion Video",
      thumbnail: json.thumbnail || null,
      duration: json.duration || null,
      source: json.source || "Dailymotion",
      medias: []
    };

    if (json.medias && Array.isArray(json.medias)) {
      json.medias.forEach(media => {
        result.medias.push({
          quality: media.quality || "Unknown",
          extension: media.extension || "mp4",
          size: media.formattedSize || media.size || "Unknown",
          url: media.url
        });
      });
    }

    return result;

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = dailymotion;
