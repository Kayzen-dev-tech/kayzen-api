export default function(req, res, next) {
  if (req.query.apikey !== "KAYZEN") {
    return res.status(403).json({ status: false, message: "Invalid API Key" })
  }
  next()
}
