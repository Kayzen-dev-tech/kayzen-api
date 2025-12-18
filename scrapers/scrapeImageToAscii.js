const axios = require('axios');
const FormData = require('form-data');
const cheerio = require('cheerio');

async function imageToAscii(buffer, originalname) {
  try {
    const form = new FormData();
    form.append('image', buffer, originalname || 'image.jpg');
    form.append('u_width', '100');
    form.append('u_contrast', '1');
    form.append('u_color', '0'); 
    form.append('u_back', '1'); 
    
    const { data } = await axios.post('https://text-image.com/convert/', form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://text-image.com',
        'Referer': 'https://text-image.com/convert/'
      }
    });

    const $ = cheerio.load(data);
    const ascii = $('pre').text();

    if (!ascii) return { error: "Gagal mengkonversi gambar. Pastikan file gambar valid." };

    return { 
        ascii: ascii,
        info: "Gunakan font monospace (seperti Courier/Consolas) agar tampilan rapi."
    };

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = imageToAscii;
