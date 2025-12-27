import axios from "axios"

export async function tiktokDownload(url) {
  const res = await axios.get("https://tikwm.com/api", {
    params: { url }
  })
  return res.data
}
