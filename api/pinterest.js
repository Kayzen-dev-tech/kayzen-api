import axios from "axios"
import cheerio from "cheerio"

export default async function(req, res) {
  const url = new URL(req.url, "http://x")
  const q = url.searchParams.get("q")
  const html = await axios.get("https://www.pinterest.com/search/pins/?q=" + q)
  const $ = cheerio.load(html.data)
  const images = []
  $("img").each((i, el) => {
    if (images.length < 5) images.push($(el).attr("src"))
  })
  res.json({ status: true, images })
}
