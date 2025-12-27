import express from "express"
import { tiktokDownload } from "../services/tiktok.service.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const { url } = req.query
  const data = await tiktokDownload(url)
  res.json({ success: true, data })
})

export default router
