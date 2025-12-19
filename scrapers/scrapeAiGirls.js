/* 
 * Modul Scraper AI Girls (Revisi V2.0)
 * Target Asli: https://ai-girls.pro/ (DEAD/OFFLINE)
 * Target Baru: https://www.wallpaperflare.com/search?wallpaper=ai+girl
 * Alasan Migrasi: Domain asli tidak lagi dapat diakses. Migrasi ke repositori
 * wallpaper publik untuk mempertahankan ketersediaan layanan API.
 * 
 * Fitur Pembaruan:
 * 1. Rotasi User-Agent dinamis (simulasi).
 * 2. Selektor HTML yang lebih presisi.
 * 3. Timeout yang diperpanjang untuk mengakomodasi latensi jaringan.
 * 4. Penanganan error yang lebih deskriptif.
 */

const axios = require('axios');
const cheerio = require('cheerio');

// Daftar User-Agent untuk menghindari pemblokiran statis
const USER_AGENTS =;

async function scrapeAiGirls() {
    try {
        // Pemilihan User-Agent secara acak
        const randomUserAgent = USER_AGENTS;
        
        // Konfigurasi target baru. Menggunakan query pencarian 'ai girl' untuk mendapatkan konten relevan.
        // Opsi URL alternatif jika ini down: 'https://wallpapers.com/search/ai-girl'
        const targetUrl = 'https://www.wallpaperflare.com/search?wallpaper=ai+girl';

        // Konfigurasi request Axios
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': randomUserAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.google.com/', // Menyamarkan traffic seolah dari Google
                'Connection': 'keep-alive'
            },
            timeout: 10000 // Timeout 10 detik, sesuai batas aman fungsi serverless Vercel
        });

        const $ = cheerio.load(response.data);
        const images =;

        // Strategi Ekstraksi:
        // Situs wallpaper biasanya menggunakan Lazy Loading. URL asli sering berada di atribut 'data-src'.
        // Kita menargetkan elemen list spesifik untuk menghindari mengambil icon/avatar.
        
        $('li.lazy-load-item').each((i, el) => {
            const imgElement = $(el).find('img');
            
            // Prioritaskan data-src (resolusi pratinjau yang lebih baik) lalu src
            const src = imgElement.attr('data-src') |

| imgElement.attr('src');
            
            if (src && src.startsWith('http')) {
                // Filter tambahan untuk memastikan bukan gambar placeholder
                if (!src.includes('blank.gif') &&!src.includes('loader.svg')) {
                    images.push(src);
                }
            }
        });

        // Mekanisme Fallback: Jika selektor spesifik gagal (karena perubahan struktur situs),
        // coba selektor umum (mirip kode lama tapi dengan filter lebih ketat).
        if (images.length === 0) {
            console.warn("Selektor spesifik gagal, beralih ke selektor umum.");
            $('img').each((i, el) => {
                const src = $(el).attr('data-src') |

| $(el).attr('src');
                if (src && src.startsWith('http')) {
                    // Filter kata kunci teknis yang menandakan gambar sistem/UI
                    if (!src.match(/logo|icon|avatar|banner|tracker|svg|placeholder|pixel/i)) {
                        // Coba filter berdasarkan dimensi jika atribut tersedia
                        const width = $(el).attr('width');
                        const height = $(el).attr('height');
                        // Hanya ambil jika dimensi tidak ada (asumsi gambar utama) atau cukup besar
                        if ((!width &&!height) |

| (parseInt(width) > 300)) {
                            images.push(src);
                        }
                    }
                }
            });
        }

        // Penanganan kasus di mana tidak ada gambar ditemukan sama sekali
        if (images.length === 0) {
            return {
                status: false,
                message: "Gagal: Tidak ada gambar ditemukan. Struktur situs mungkin telah berubah total."
            };
        }

        // Pemilihan acak dari kumpulan gambar yang berhasil diambil
        const randomImg = images[Math.floor(Math.random() * images.length)];

        // Mengembalikan format data sesuai kontrak API yang diharapkan oleh frontend
        return {
            status: true,
            creator: "Kayzen",
            data: {
                url: randomImg,
                source: "https://www.wallpaperflare.com", // Atribusi sumber yang jujur
                note: "Domain asli (ai-girls.pro) offline, data dialihkan ke sumber alternatif."
            }
        };

    } catch (e) {
        // Log error untuk debugging server-side
        console.error(` ${e.message}`);
        
        // Respons yang aman untuk klien
        return { 
            status: false, 
            message: `Terjadi kesalahan saat mengambil data: ${e.message}` 
        };
    }
}

module.exports = scrapeAiGirls;
