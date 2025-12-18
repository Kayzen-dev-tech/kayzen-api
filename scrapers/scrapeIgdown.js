const axios = require('axios');
const cheerio = require('cheerio');

async function igdown(url) {
  if (!url) return { error: "URL Instagram wajib diisi" };

  try {
    const endpoint = 'https://fastdl.app/c/';
    
    const data = new URLSearchParams();
    data.append('url', url);
    data.append('lang_code', 'id');
    data.append('token', '');

    const config = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://fastdl.app',
        'Referer': 'https://fastdl.app/id',
        'x-requested-with': 'XMLHttpRequest',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    };

    const response = await axios.post(endpoint, data, config);
    const json = response.data;

    if (!json || !json.data) {
        return { error: "Gagal mengambil data. Pastikan akun tidak privat." };
    }

    const $ = cheerio.load(json.data);
    const results = [];

    $('.output-list-item').each((i, el) => {
        const downloadBtn = $(el).find('a.button--filled, a.button--outline');
        let mediaUrl = downloadBtn.attr('href');
        
        let type = 'image';
        if (mediaUrl && (mediaUrl.includes('.mp4') || $(el).find('.video-icon').length > 0)) {
            type = 'video';
        }

        const thumbnail = $(el).find('img').attr('src');

        if (mediaUrl) {
            results.push({
                type: type,
                url: mediaUrl,
                thumbnail: thumbnail || null
            });
        }
    });

    if (results.length === 0) {
        return { error: "Media tidak ditemukan." };
    }

    return {
        source: "FastDL",
        wm: "No Watermark",
        total: results.length,
        media: results
    };

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = igdown;
