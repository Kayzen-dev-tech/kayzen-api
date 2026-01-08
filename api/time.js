export default function handler(req, res) {
  const now = new Date();
  res.json({
    time: now.toLocaleTimeString("id-ID", { hour12: false }),
    date: now.toLocaleDateString("id-ID")
  });
}
