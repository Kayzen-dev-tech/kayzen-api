const axios = require('axios');

async function tinyjpg(buffer, filename) {
  try {
    if (!buffer) return { error: "File gambar wajib diupload" };

    // 1. Upload ke TinyJPG Backend
    // TinyJPG menerima raw binary body, bukan multipart/form-data biasa
    const { data: uploadData } = await axios.post(
      'https://tinyjpg.com/backend/opt/shrink',
      buffer,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Content-Type': 'image/jpeg', // Default type, backend biasanya auto-detect
          'Origin': 'https://tinyjpg.com',
          'Referer': 'https://tinyjpg.com/'
        }
      }
    );

    if (!uploadData || !uploadData.output || !uploadData.output.url) {
        return { error: "Gagal mengompres gambar." };
    }

    // 2. Hasil Response
    return {
        status: "success",
        input: {
            size: uploadData.input.size,
            type: uploadData.input.type
        },
        output: {
            size: uploadData.output.size,
            type: uploadData.output.type,
            ratio: uploadData.output.ratio,
            url: uploadData.output.url
        }
    };

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = tinyjpg;
