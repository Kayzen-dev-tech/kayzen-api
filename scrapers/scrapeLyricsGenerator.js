const axios = require('axios');

const generateLyrics = async (prompt) => {
  if (!prompt) return { error: "Prompt/topik lagu diperlukan" };

  const url = 'https://lyricsgenerator.com/api/completion';
  const payload = { prompt };

  try {
    const response = await axios.post(url, JSON.stringify(payload), {
      headers: {
        'accept': '*/*',
        'content-type': 'text/plain;charset=UTF-8', // Header asli meminta text/plain
        'origin': 'https://lyricsgenerator.com',
        'referer': 'https://lyricsgenerator.com',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
      }
    });

    return response.data; // Mengembalikan string lirik
  } catch (error) {
    console.error("Error Lyrics Generator:", error.message);
    return { error: "Gagal membuat lirik lagu" };
  }
};

module.exports = generateLyrics;
