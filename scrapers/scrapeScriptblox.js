const axios = require('axios');

async function scriptblox(query, page = 1) {
  if (!query) return { error: "Query pencarian wajib diisi" };

  try {
    const config = {
        page: page || 1,
        strict: false,
        max: 20
    };

    const url = `https://scriptblox.com/api/script/search?page=${config.page}&strict=${config.strict}&q=${encodeURIComponent(query)}&max=${config.max}`;

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!data || !data.result || !data.result.scripts) {
        return { error: "Script tidak ditemukan" };
    }

    return data.result.scripts.map(script => ({
        title: script.title,
        game: script.game ? script.game.name : "Unknown",
        type: script.scriptType,
        views: script.views,
        verified: script.verified,
        author: script.owner ? script.owner.username : "Unknown",
        slug: `https://scriptblox.com/script/${script.slug}`,
        image: script.game && script.game.imageUrl ? `https://scriptblox.com${script.game.imageUrl}` : null,
        updatedAt: script.updatedAt
    }));

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = scriptblox;
