import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import apikey from "./middleware/apikey.js"
import tiktok from "./routes/tiktok.js"
import youtube from "./routes/youtube.js"
import ytmp3 from "./routes/ytmp3.js"
import pinterest from "./routes/pinterest.js"
import ai from "./routes/ai.js"

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

app.use("/api", apikey)
app.use("/api/tiktok", tiktok)
app.use("/api/youtube", youtube)
app.use("/api/ytmp3", ytmp3)
app.use("/api/pinterest", pinterest)
app.use("/api/ai", ai)

app.get("/docs", (_, res) => {
  res.sendFile(path.join(__dirname, "../views/docs.html"))
})

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"))
})

export default app
