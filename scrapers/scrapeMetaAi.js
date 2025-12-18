const axios = require('axios');

async function metaAi(prompt) {
  if (!prompt) return { error: "Prompt wajib diisi" };

  try {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://duckduckgo.com',
        'Referer': 'https://duckduckgo.com/',
        'x-vqd-accept': '1'
    };

    // 1. Dapatkan Token VQD (Virtual Queue ID)
    const statusUrl = 'https://duckduckgo.com/duckchat/v1/status';
    const statusRes = await axios.get(statusUrl, { headers });
    const vqdToken = statusRes.headers['x-vqd-4'];

    if (!vqdToken) {
        return { error: "Gagal mendapatkan token akses (VQD)." };
    }

    // 2. Kirim Chat ke Model Meta Llama 3
    const chatUrl = 'https://duckduckgo.com/duckchat/v1/chat';
    const payload = {
        model: "meta-llama/Llama-3-70b-chat-hf", // Model asli Meta AI
        messages: [
            { role: "user", content: prompt }
        ]
    };

    const chatRes = await axios.post(chatUrl, payload, {
        headers: {
            ...headers,
            'Content-Type': 'application/json',
            'x-vqd-4': vqdToken
        }
    });

    if (!chatRes.data) {
        return { error: "Gagal mendapatkan respons dari Meta AI." };
    }

    // 3. Parsing Stream Data
    // Respons dari DDG berupa stream "data: ...", kita perlu menggabungkannya
    const rawData = chatRes.data;
    const lines = rawData.split('\n');
    let fullMessage = '';

    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '');
            if (jsonStr === '[DONE]') break;
            try {
                const json = JSON.parse(jsonStr);
                if (json.message) {
                    fullMessage += json.message;
                }
            } catch (e) {
                // abaikan error parse per baris
            }
        }
    }

    return {
        status: "success",
        model: "Meta Llama 3 (70B)",
        answer: fullMessage.trim()
    };

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = metaAi;
