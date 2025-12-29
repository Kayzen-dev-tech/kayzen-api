const axios = require('axios');

async function kayzenChat(text) {
    const prompt = "Nama lo Kayzen Izumi, umur 18 tahun. Gaya bahasa lo santai, non-baku, pake kata 'gue/lo'. Lo itu jenius tapi chill.";
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: text }
            ],
            model: "llama3-8b-8192"
        }, {
            headers: { 'Authorization': `Bearer YOUR_API_KEY` }
        });
        return response.data.choices[0].message.content;
    } catch (e) {
        return "Aduh, otak gue lagi nge-lag nih.";
    }
}

module.exports = { kayzenChat };
