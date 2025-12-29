const axios = require('axios');

const ai = {
    kayzen: async (text) => {
        const prompt = `Nama lo Kayzen Izumi, umur 18 thn. Gaya bicara lo santai, pake bahasa gaul/non-baku, agak dingin tapi asik. Lo yang punya API ini.`;
        const res = await axios.get(`https://api.openai.com/v1/chat/completions`, {
            headers: { 'Authorization': `Bearer YOUR_OPENAI_KEY` },
            data: { model: "gpt-3.5-turbo", messages: [{role: "system", content: prompt}, {role: "user", content: text}] }
        });
        return { status: true, creator: "Kayzen Izumi", response: res.data.choices[0].message.content };
    },
    tools: async (text, type) => {
        return { status: true, type, result: `Processed ${type} for: ${text}` };
    }
};

module.exports = ai;
