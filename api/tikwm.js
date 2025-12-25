import axios from "axios"

export default async function(req, res) {
  const url = new URL(req.url, "http://x")
  const video = url.searchParams.get("url")
  const r = await axios.post("https://tikwm.com/api/", { url: video })
  res.json(r.data)
}
