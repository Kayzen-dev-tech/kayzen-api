const axios = require('axios');
const cheerio = require('cheerio');

async function tiktokDl(url) {
    if (!url) return { error: "URL TikTok wajib diisi" };

    try {
        const config = {
            method: 'POST',
            url: 'https://savetik.co/api/ajaxSearch',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://savetik.co',
                'Referer': 'https://savetik.co/en'
            },
            data: new URLSearchParams({ q: url, lang: 'en' })
        };

        const response = await axios(config);
        const html = response.data.data;
        
        if (!html) return { error: "Video tidak ditemukan atau link privat" };

        const $ = cheerio.load(html);
        
        const thumbnail = $('.thumbnail img').attr('src');
        const videoNoWm = $('.tik-video .dl-action a').first().attr('href');
        const audio = $('.tik-video .dl-action a[href*="mp3"]').attr('href');
        
        const result = {
            thumbnail: thumbnail,
            video: videoNoWm,
            audio: audio || null
        };

        return result;

    } catch (e) {
        return { error: e.message };
    }
}

module.exports = tiktokDl;
