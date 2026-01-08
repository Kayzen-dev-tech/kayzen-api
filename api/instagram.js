import axios from "axios";
import qs from "qs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const data = qs.stringify({ url });

    const response = await axios.post(
      "https://kol.id/download-video/instagram",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest"
        }
      }
    );

    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: "Instagram downloader failed" });
  }
                                        }
