const axios = require('axios');

const downloader = {
    tiktok: async (url) => {
        const res = await axios.get(`https://api.deline.web.id/downloader/tiktok?url=${url}`);
        return res.data;
    },
    youtube: async (url, type) => {
        const res = await axios.get(`https://api.y2mate.tools/v1/download?url=${url}&type=${type}`);
        return res.data;
    },
    instagram: async (url) => {
        const res = await axios.get(`https://api.indown.io/api/get?url=${url}`);
        return res.data;
    },
    pinSearch: async (query) => {
        const res = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?data={"options":{"query":"${query}","page_size":5}}`);
        return res.data.resource_response.data.results.map(v => v.images.orig.url);
    },
    pinDown: async (url) => {
        return { status: true, url: url.replace('/pin/', '/offscreen/') };
    },
    twitter: async (url) => {
        const res = await axios.get(`https://twitsave.com/api/info?url=${url}`);
        return res.data;
    }
};

module.exports = downloader;
