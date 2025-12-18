const axios = require('axios');
const cheerio = require('cheerio');

async function tiktokStalk(username) {
    try {
        const { data } = await axios.get(`https://urlebird.com/user/${username}/`);
        const $ = cheerio.load(data);

        const info = {
            username: $('div.text-center > h1.h5').text().trim(),
            fullname: $('div.text-center > div.h6').text().trim(),
            bio: $('div.text-center > div.description').text().trim(),
            profile_pic: $('div.col-md-3.col-4.text-center > img').attr('src'),
            stats: {
                likes: $('div.col-4.text-center > b').eq(0).text().trim(),
                followers: $('div.col-4.text-center > b').eq(1).text().trim(),
                following: $('div.col-4.text-center > b').eq(2).text().trim()
            }
        };

        if (!info.username) {
            return { status: false, message: 'User tidak ditemukan' };
        }

        return { status: true, data: info };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

module.exports = tiktokStalk;
