const axios = require('axios');

const gptReq = async (prompt, text) => {
    try {
        const res = await axios.get(`https://api.vreden.my.id/api/ai-chat?prompt=${encodeURIComponent(prompt)}&text=${encodeURIComponent(text)}`);
        return res.data.result;
    } catch (e) {
        return "Error connecting to AI service.";
    }
};

module.exports = {
    kayzenChat: (t) => gptReq("Nama lo Kayzen Izumi, 18 thn. Gaya bahasa non-baku, santai, jenius, pake gue/lo.", t),
    aiArtPrompt: (t) => gptReq("Create a high-quality Midjourney prompt from this description.", t),
    aiLogic: (t) => gptReq("Solve this logic problem step by step clearly.", t),
    aiTranslate: (t) => gptReq("Translate this text into casual Japanese anime style.", t),
    aiCode: (t) => gptReq("Write clean, efficient code for this request without any comments.", t)
};
