const axios = require('axios');
const cheerio = require('cheerio');

async function umamusume(slug) {
    try {
        const { data } = await axios.get(`https://umamusumedb.com/characters/${slug}_2025/`);
        const $ = cheerio.load(data);
        return {
            status: true,
            name: $('meta[property="og:title"]').attr('content') || $('title').text(),
            image: $('meta[property="og:image"]').attr('content'),
            description: $('meta[property="og:description"]').attr('content'),
            url: `https://umamusumedb.com/characters/${slug}_2025/`
        };
    } catch (e) {
        return {
            status: false,
            message: e.message
        };
    }
}

module.exports = umamusume;
