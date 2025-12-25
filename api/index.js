import mxdrop from "./mxdrop.js"
import tikwm from "./tikwm.js"
import pinterest from "./pinterest.js"
import ai from "./ai.js"
import auth from "./middleware.js"

export default async function handler(req, res) {
  const { pathname } = new URL(req.url, "http://localhost")
  req.path = pathname
  await auth(req, res, async () => {
    if (pathname.startsWith("/api/mxdrop")) return mxdrop(req, res)
    if (pathname.startsWith("/api/tikwm")) return tikwm(req, res)
    if (pathname.startsWith("/api/pinterest")) return pinterest(req, res)
    if (pathname.startsWith("/api/ai")) return ai(req, res)
    res.status(404).json({ status: false })
  })
}
