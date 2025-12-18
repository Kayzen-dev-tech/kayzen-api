const axios = require('axios');

async function tebakLirik() {
    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json');
        const random = data[Math.floor(Math.random() * data.length)];
        return {
            status: true,
            soal: random.soal,
            jawaban: random.jawaban
        };
    } catch (e) {
        return { 
            status: false, 
            message: e.message 
        };
    }
}

module.exports = tebakLirik;
