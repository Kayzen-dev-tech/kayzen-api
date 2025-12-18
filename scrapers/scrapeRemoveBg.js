const axios = require('axios');
const FormData = require('form-data');

async function removeBg(fileBuffer, fileName) {
  try {
    const form = new FormData();
    // Menggunakan buffer langsung dengan opsi filename
    form.append("file", fileBuffer, { filename: fileName || 'image.jpg' });

    const res = await axios.post("https://removebg.one/api/predict/v2", form, {
      headers: {
        ...form.getHeaders(),
        "accept": "application/json, text/plain, */*",
        "locale": "en-US",
        "platform": "PC",
        "product": "REMOVEBG",
        "sec-ch-ua": "\"Chromium\";v=\"127\", \"Not)A;Brand\";v=\"99\", \"Microsoft Edge Simulate\";v=\"127\", \"Lemur\";v=\"127\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "Referer": "https://removebg.one/upload"
      }
    });

    const data = res.data?.data;
    
    if (!data) return { error: "Gagal menghapus background, coba gambar lain." };

    return {
        original: data.url,
        result: data.cutoutUrl, // Ini hasil no-bg nya
        mask: data.maskUrl
    };

  } catch (e) {
    console.error("Error RemoveBg:", e.message);
    return { error: e.message };
  }
}

module.exports = removeBg;
