import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const { data } = await axios.post(
      "https://api.seekin.ai/ikool/media/download",
      { url },
      {
        headers: {
          "Content-Type": "application/json",
          "lang": "en",
          "timestamp": "1766750360505",
          "sign": "a90f96ca8fc1307461574c3313ebf03582a5d942f87f51266043f8f0be2ca6b7",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    if (data.code !== "0000") {
      return res.status(500).json({ error: "Seekin failed" });
    }

    res.json({
      success: true,
      title: data.data.title,
      media: data.data.medias
    });
  } catch {
    res.status(500).json({ error: "Douyin downloader failed" });
  }
  }
