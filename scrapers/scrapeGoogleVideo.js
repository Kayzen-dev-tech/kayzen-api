const axios = require('axios');
const cheerio = require('cheerio');

async function googleVideo(query) {
    try {
        // Menggunakan User-Agent Desktop Chrome agar hasil lebih standar
        const { data } = await axios.get("https://www.google.com/search", {
            params: {
                q: query,
                tbm: "vid", // Mode Video Search
                hl: "id",   // Bahasa Indonesia
                gl: "id"    // Region Indonesia
            },
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9,id;q=0.8"
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        // Loop setiap elemen hasil pencarian (container 'div.g')
        $('div.g').each((i, el) => {
            // 1. Ambil Judul & Link (Selector paling aman)
            const titleElement = $(el).find('h3');
            const linkElement = $(el).find('a').first();
            
            const title = titleElement.text().trim();
            const url = linkElement.attr('href');

            // 2. Ambil Durasi, Sumber, dan Deskripsi (Coba beberapa selector alternatif)
            // Google sering mengubah class, jadi kita coba cari text di sekitar elemen
            const duration = $(el).find('div[class*="dn"]').text() || $(el).find('span[aria-label]').text() || ""; 
            const source = $(el).find('cite').text() || $(el).find('.iHxmLe').text() || "";
            
            // Deskripsi biasanya ada di div st (standard text) atau VwiC3b
            const desc = $(el).find('.VwiC3b').text() || $(el).find('.st').text() || $(el).find('div[style*="-webkit-line-clamp"]').text() || "";

            // 3. Validasi: Pastikan ada Judul dan URL valid
            if (title && url && url.startsWith('http')) {
                // Bersihkan durasi jika ada text aneh
                let cleanDuration = duration.match(/\d{1,2}:\d{2}/); // Cari pola angka:angka (contoh 04:20)
                
                results.push({
                    title: title,
                    url: url,
                    duration: cleanDuration ? cleanDuration[0] : "N/A",
                    source: source || "Google Video",
                    description: desc || ""
                });
            }
        });

        // Cek jika kosong, mungkin kena blokir
        if (results.length === 0) {
            // Coba cek apakah halaman mengandung kata "captcha" atau "consent"
            const isBlocked = $('body').text().toLowerCase().includes('captcha') || $('body').text().toLowerCase().includes('consent');
            if (isBlocked) {
                return {
                    status: false,
                    message: "Google mendeteksi traffic tidak wajar (Captcha/Consent Block). Coba lagi nanti atau ganti IP."
                };
            }
            return {
                status: true,
                message: "Tidak ditemukan hasil video untuk query tersebut.",
                data: []
            };
        }

        return {
            status: true,
            data: results
        };

    } catch (e) {
        return {
            status: false,
            message: e.message
        };
    }
}

module.exports = googleVideo;
