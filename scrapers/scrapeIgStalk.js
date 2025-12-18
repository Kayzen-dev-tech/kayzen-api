const axios = require('axios');
const cheerio = require('cheerio');

async function igStalk(username) {
    try {
        const { data } = await axios.get(`https://dumpoir.com/v/${username}`);
        const $ = cheerio.load(data);
        
        const info = {
            username: username,
            fullname: $('div.user__title > h1').text().trim(),
            bio: $('div.user__info-desc').text().trim(),
            profile_pic: $('div.user__img').attr('style')?.match(/url\('(.*)'\)/)?.[1] || '',
            posts: $('ul.list-posts > li').length,
            followers: $('ul.list-stat > li').eq(1).text().replace('Followers', '').trim(),
            following: $('ul.list-stat > li').eq(2).text().replace('Following', '').trim()
        };

        if (!info.fullname) {
            return { status: false, message: 'User tidak ditemukan' };
        }

        return { status: true, data: info };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

module.exports = igStalk;
