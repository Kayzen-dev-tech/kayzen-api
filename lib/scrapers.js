const axios = require('axios');
const cheerio = require('cheerio');

const scrapers = {
    async aiChat(text, prompt) {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [{ role: "system", content: prompt }, { role: "user", content: text }],
            model: "llama3-8b-8192"
        }, {
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
        });
        return response.data.choices[0].message.content;
    },

    async pinSearch(query) {
        const { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?data={"options":{"query":"${query}","scope":"pins"}}`);
        return data.resource_response.data.results.slice(0, 5).map(v => v.images.orig.url);
    },

    async ttDl(url) {
        const { data } = await axios.post('https://www.tikwm.com/api/', { url });
        return data.data;
    }
};

module.exports = scrapers;
