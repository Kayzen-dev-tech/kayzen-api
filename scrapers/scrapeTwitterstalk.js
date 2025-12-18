const axios = require('axios');
const crypto = require('crypto');

async function twitterStalk(username) {
    try {
        if (!username) return { status: 'error', msg: 'Username required' };

        const ch = await axios.get(
            'https://twittermedia.b-cdn.net/challenge/',
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
                    'Accept': 'application/json',
                    'origin': 'https://snaplytics.io',
                    'referer': 'https://snaplytics.io/'
                }
            }
        ).then(r => r.data);

        if (!ch.challenge_id) throw new Error('Challenge failed');

        // 2. Hitung Hash Jawaban
        const hash = crypto
            .createHash('sha256')
            .update(String(ch.timestamp) + ch.random_value)
            .digest('hex')
            .slice(0, 8);

        // 3. Request Data Profil
        const result = await axios.get(
            'https://twittermedia.b-cdn.net/viewer/?data=' + username + '&type=profile',
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
                    'Accept': 'application/json',
                    'origin': 'https://snaplytics.io',
                    'referer': 'https://snaplytics.io/',
                    'X-Challenge-ID': ch.challenge_id,
                    'X-Challenge-Solution': hash
                }
            }
        ).then(r => {
            if (!r.data || !r.data.profile) throw new Error('User not found or no data');
            return r.data.profile;
        });

        return result;

    } catch (e) {
        console.error('Error Twitter Stalk:', e.message);
        return { status: 'error', msg: e.message };
    }
}

module.exports = twitterStalk;
