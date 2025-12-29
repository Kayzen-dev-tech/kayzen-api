const axios = require('axios');

async function pinSearch(query) {
    try {
        const response = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${query}&data={"options":{"query":"${query}","scope":"pins"},"context":{}}`);
        const pins = response.data.resource_response.data.results.slice(0, 5);
        return pins.map(p => p.images.orig.url);
    } catch (e) {
        return [];
    }
}

module.exports = { pinSearch };
