import express from "express"
import { searchPinterest } from "../services/pinterest.service.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const { query } = req.query
  const data = await searchPinterest(query)
  res.json({ success: true, images: data })
})

export default router
