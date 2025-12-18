const axios = require("axios");
const FormData = require("form-data");

async function identifyAnime(fileBuffer, fileName) {
  try {
    const form = new FormData();
    // Menggunakan buffer langsung dari upload user
    form.append("image", fileBuffer, fileName || "image.jpg");

    const res = await axios.post("https://www.animefinder.xyz/api/identify", form, {
      headers: { 
          ...form.getHeaders(),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const d = res.data;
    
    // Cek jika API mengembalikan error atau tidak ada data
    if (!d || d.error) {
        return { error: true, message: "Karakter/Anime tidak ditemukan." };
    }

    const result = {
      anime: {
        title: d.animeTitle || null,
        synopsis: d.synopsis || null,
        genres: d.genres || [],
        studio: d.productionHouse || null,
        premiered: d.premiereDate || null
      },
      character: {
        name: d.character || null,
        description: d.description || null
      },
      references: Array.isArray(d.references)
        ? d.references.map(r => ({
            site: r.site,
            url: r.url
          }))
        : []
    };
    return result;
  } catch (err) {
    console.error("Error Anime Finder:", err.message);
    return { error: true, message: "Terjadi kesalahan saat identifikasi gambar." };
  }
}

module.exports = identifyAnime;
