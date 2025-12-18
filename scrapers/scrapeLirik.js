const axios = require("axios");
const cheerio = require("cheerio");

const lirik = async (query) => {
  try {
    // 1. Cari di halaman pencarian
    const { data: html } = await axios.get(`https://lirik.my/?s=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);
    const links = [];

    $("article.post").each((i, el) => {
      const url = $(el).find(".entry-title a").attr("href");
      if (url) links.push(url);
    });

    if (links.length === 0) return null;

    // 2. Pilih link (Logika asli: 70% kemungkinan pilih yang pertama, sisanya random)
    const chosen =
      links.length === 1
        ? links[0]
        : Math.random() < 0.7
        ? links[0]
        : links[Math.floor(Math.random() * links.length)];

    // 3. Ambil konten lirik
    const { data: page } = await axios.get(chosen, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $$ = cheerio.load(page);
    const $content = $$(".entry-content").clone();

    // Hapus elemen yang tidak perlu
    $content.find("script,style,.read-more-container,.code-block,.ai-viewports,.wp-block-button").remove();

    // Format teks lirik
    const lyrics = $content
      .html()
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<p[^>]*>/gi, "")
      .replace(/<[^>]+>/g, "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length)
      .join("\n");

    return {
        title: query,
        source: chosen,
        lyrics: lyrics
    };

  } catch (error) {
    console.error("Error Lirik.my:", error.message);
    return null;
  }
};

module.exports = lirik;
