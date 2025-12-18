const axios = require('axios');

async function saveTwitter(url) {
    try {
        const formData = new URLSearchParams();
        formData.append('q', url);
        formData.append('lang', 'id');

        const { data } = await axios.post('https://savetwitter.net/api/ajaxSearch', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Origin': 'https://savetwitter.net',
                'Referer': 'https://savetwitter.net/id3'
            }
        });

        if (data && data.data) {
            return {
                status: true,
                result: data.data
            };
        }
        
        return {
            status: false,
            message: 'Gagal mengambil data video.'
        };
    } catch (e) {
        return {
            status: false,
            message: e.message
        };
    }
}

module.exports = saveTwitter;
