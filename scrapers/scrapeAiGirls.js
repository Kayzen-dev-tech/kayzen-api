const axios = require('axios');
const cheerio = require('cheerio');

async function aiGirls() {
    try {
        // Fetch halaman utama untuk mengambil daftar gambar terbaru
        const { data } = await axios.get('https://ai-girls.pro/');
        const $ = cheerio.load(data);
        
        let images = [];
        
        // Mencari gambar di dalam elemen postingan/artikel agar tidak mengambil logo/iklan
        $('article img, div.post img, div.entry-content img').each((i, el) => {
            const url = $(el).attr('src') || $(el).attr('data-src'); // Cek src atau lazy-load src
            if (url && url.startsWith('http')) {
                images.push(url);
            }
        });

        // Fallback: Jika tidak menemukan dengan selector di atas, ambil semua img tapi filter
        if (images.length === 0) {
             $('img').each((i, el) => {
                const url = $(el).attr('src');
                if (url && url.startsWith('http') && !url.match(/(logo|icon|avatar|tracker|banner)/i)) {
                    images.push(url);
                }
            });
        }

        if (images.length === 0) {
            return { status: false, message: "Gagal mengambil gambar atau struktur web berubah." };
        }

        // Ambil satu gambar secara random dari array
        const randomUrl = images[Math.floor(Math.random() * images.length)];

        return {
            status: true,
            url: randomUrl,
            source: 'https://ai-girls.pro/'
        };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

module.exports = aiGirls;
