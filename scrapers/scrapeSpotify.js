const axios = require('axios');

async function spotifySearch(q) {
    try {
        const { data } = await axios.get(`https://developer.spotify.com/?q=${q}`);
        return data;
    } catch (e) {
        return { 
            status: false, 
            message: e.message 
        };
    }
}

module.exports = spotifySearch;
