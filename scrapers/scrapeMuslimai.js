const axios = require('axios');

async function muslimai(query) {
    const searchUrl = 'https://www.muslimai.io/api/search';
    const answerUrl = 'https://www.muslimai.io/api/answer';
    
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    try {
        // Tahap 1: Cari Referensi (Context)
        const searchResponse = await axios.post(searchUrl, { query: query }, { headers: headers });
        const searchData = searchResponse.data;

        if (!searchData || searchData.length === 0) {
            return { error: "Tidak ditemukan referensi yang relevan untuk pertanyaan ini." };
        }

        const passages = searchData.map(item => item.content).join('\n\n');

        // Tahap 2: Generate Jawaban berdasarkan referensi
        const answerData = {
            prompt: `Use the following passages to answer the query to the best of your ability as a world class expert in the Quran. Do not mention that you were provided any passages in your answer: ${query}\n\n${passages}`
        };

        const answerResponse = await axios.post(answerUrl, answerData, { headers: headers });

        const result = {
            answer: answerResponse.data,
            source: searchData // Mengembalikan sumber referensi juga
        };

        return result;
    } catch (error) {
        console.error('Error MuslimAI:', error.message);
        return { error: `Terjadi kesalahan: ${error.message}` };
    }
}

module.exports = muslimai;
