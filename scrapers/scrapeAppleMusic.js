const axios = require('axios');
const cheerio = require('cheerio');

async function appleMusic(url) {
    try {
        const { data } = await axios.get(`https://aaplmusicdownloader.com/api/composer/search/albums?q=${url}`);
        return data;
    } catch (e) {
        return { 
            status: false, 
            message: e.message 
        };
    }
}

module.exports = appleMusic;
