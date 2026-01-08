import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ status: 400, message: "URL Douyin dibutuhkan!" });

  try {
    const payload = { url };
    const { data } = await axios.post(
      "https://api.seekin.ai/ikool/media/download",
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'lang': 'en',
          'timestamp': '1766750360505',
          'sign': 'a90f96ca8fc1307461574c3313ebf03582a5d942f87f51266043f8f0be2ca6b7',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Origin': 'https://seekin.ai',
          'Referer': 'https://seekin.ai/'
        }
      }
    );

    if (data.code !== "0000") return res.status(500).json({ status: 500, message: data.msg || "Gagal mengambil data Douyin" });

    const result = data.data;
    res.json({
      status: 200,
      success: true,
      title: result.title || "Douyin Media",
      thumbnail: result.imageUrl,
      duration: result.duration,
      media: result.medias,
      images: result.images.map(img => ({ url: img.url, format: img.format })),
      description: "Professional AI Media Scraper by AgungDevX"
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 500, success: false, message: err.message || "Server error Douyin Downloader" });
  }
});

export default router;