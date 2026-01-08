import express from "express";
import axios from "axios";
import qs from "qs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL Instagram dibutuhkan" });

  try {
    const data = qs.stringify({ url });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: 'https://kol.id/download-video/instagram',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
      },
      data
    };

    const response = await axios.request(config);
    res.json(response.data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mendownload video Instagram" });
  }
});

export default router;