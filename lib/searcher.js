const axios = require('axios');

module.exports = {
    pinSearch: async (query) => {
        const res = await axios.get(`https://api.deline.web.id/search/pinterest?query=${query}`);
        return res.data.result.slice(0, 5);
    }
};
