const axios = require('axios');
const FormData = require('form-data');
const cheerio = require('cheerio');

async function top4top(buffer, filename) {
    try {
        const form = new FormData();
        form.append('file_1_', buffer, { filename });
        form.append('submit', 'Upload');

        const { data } = await axios.post('https://top4top.io/index.php', form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const url = $('div.alert.alert-warning ul li span a').attr('href') || $('input.form-control').eq(1).val();

        if (!url) {
            return {
                status: false,
                message: 'Gagal mengambil URL. File mungkin terlalu besar atau server sibuk.'
            };
        }

        return {
            status: true,
            url: url,
            filename: filename
        };
    } catch (e) {
        return {
            status: false,
            message: e.message
        };
    }
}

module.exports = top4top;
