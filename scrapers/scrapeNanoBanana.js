const axios = require('axios');

async function nanoBanana(prompt) {
  if (!prompt) return { error: "Prompt wajib diisi" };

  try {
    const baseUrl = 'https://supawork.ai';
    const endpoint = `${baseUrl}/api/generate`; 
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': baseUrl,
      'Referer': `${baseUrl}/id/nano-banana/`
    };

    const payload = {
      prompt: prompt,
      model: "nano-banana",
      aspect_ratio: "1:1" 
    };

    const { data } = await axios.post(endpoint, payload, { headers });

    if (!data || !data.url) {
        return { error: "Gagal membuat gambar, coba lagi nanti atau periksa endpoint." };
    }

    return {
      status: "success",
      prompt: prompt,
      result: data.url,
      metadata: data.meta || {}
    };

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = nanoBanana;
