import express from "express"
import { chat, joke, quote, motivation, code } from "../services/ai.service.js"

const router = express.Router()

router.get("/chat", async (req, res) => {
  res.json({ result: chat(req.query.q) })
})

router.get("/joke", (_, res) => res.json({ result: joke() }))
router.get("/quote", (_, res) => res.json({ result: quote() }))
router.get("/motivation", (_, res) => res.json({ result: motivation() }))
router.get("/code", (_, res) => res.json({ result: code() }))

export default router
