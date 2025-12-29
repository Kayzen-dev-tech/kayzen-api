const axios = require('axios');
const cheerio = require('cheerio');

async function tiktok(url) {
    try {
        const response = await axios.post('https://tikwm.com/api/', { url: url });
        return response.data.data;
    } catch (e) {
        return { error: true, message: e.message };
    }
}

async function pinDl(url) {
    try {
        const response = await axios.get(`https://api.vreden.my.id/api/pinterest?url=${url}`);
        return response.data.result;
    } catch (e) {
        return { error: true, message: "Gagal mengambil data Pinterest" };
    }
}

module.exports = { tiktok, pinDl };
