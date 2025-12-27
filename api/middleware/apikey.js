export default function (req, res, next) {
  const key = req.query.apikey
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: "Invalid API Key" })
  }
  next()
}
