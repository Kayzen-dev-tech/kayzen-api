import axios from "axios"

export default async function(req, res) {
  const url = new URL(req.url, "http://x")
  const q = url.searchParams.get("q")
  res.json({
    status: true,
    query: q,
    result: "MXDrop endpoint active"
  })
}
