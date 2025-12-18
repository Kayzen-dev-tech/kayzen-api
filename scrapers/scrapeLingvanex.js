const axios = require('axios');

async function lingvanex(text) {
  if (!text) return { error: "Teks wajib diisi" };

  try {
    const url = 'https://lingvanex.com/translation/';
    
    const payload = {
        platform: 'api',
        from: 'id_ID', // Indonesia
        to: 'su_ID',   // Sunda
        data: text
    };

    const { data } = await axios.post(url, payload, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://lingvanex.com',
        'Referer': 'https://lingvanex.com/translation/indonesia-ke-bahasa-sunda',
        'Content-Type': 'application/json'
      }
    });

    if (!data || !data.result) {
        return { error: "Gagal menerjemahkan." };
    }

    return {
        original: text,
        translation: data.result,
        source_lang: "Indonesia",
        target_lang: "Sunda"
    };

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = lingvanex;
