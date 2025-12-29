const axios = require('axios');

module.exports = {
    tiktok: async (url) => {
        const res = await axios.get(`https://api.deline.web.id/downloader/tiktok?url=${url}`);
        return res.data.result;
    },
    pinDl: async (url) => {
        const res = await axios.get(`https://api.deline.web.id/downloader/pinterest?url=${url}`);
        return res.data.result;
    },
    ytmp3: async (url) => {
        const res = await axios.get(`https://api.deline.web.id/downloader/ytmp3?url=${url}`);
        return res.data.result;
    },
    ytmp4: async (url) => {
        const res = await axios.get(`https://api.deline.web.id/downloader/ytmp4?url=${url}`);
        return res.data.result;
    }
};
