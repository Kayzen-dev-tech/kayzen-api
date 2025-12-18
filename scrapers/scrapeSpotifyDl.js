const axios = require('axios');

async function spotifyDl(url) {
    try {
        const { data } = await axios.get(`https://spotisongdownloader.com/api/composer/spotify/recognition?url=${encodeURIComponent(url)}`);
        return data;
    } catch (e) {
        return { 
            status: false, 
            message: e.message 
        };
    }
}

module.exports = spotifyDl;
