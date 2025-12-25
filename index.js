import { createServer } from "http"
import { readFileSync } from "fs"
import { extname, join } from "path"

const server = createServer((req, res) => {
  let filePath = req.url === "/" ? "/public/index.html" : req.url
  filePath = join(process.cwd(), filePath)

  try {
    const ext = extname(filePath)
    const map = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".jpg": "image/jpeg",
      ".png": "image/png"
    }
    const data = readFileSync(filePath)
    res.writeHead(200, { "Content-Type": map[ext] || "text/plain" })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end("Not Found")
  }
})

export default server
