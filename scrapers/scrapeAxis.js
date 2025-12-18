const axios = require('axios');

async function scrapeAxis(nomor) {
    try {
        // Menggunakan base URL yang diminta.
        // Catatan: Pastikan endpoint '/api/axis' sesuai dengan dokumentasi asli bendith.my.id
        // Jika endpoint berbeda (misal /cek/axis), silakan sesuaikan path di bawah.
        const apiUrl = `https://bendith.my.id/api/axis?number=${nomor}`;
        
        const { data } = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        console.error("Error scraping Axis:", error);
        return {
            status: false,
            message: "Gagal mengambil data dari penyedia layanan.",
            error: error.message
        };
    }
}

module.exports = scrapeAxis;
