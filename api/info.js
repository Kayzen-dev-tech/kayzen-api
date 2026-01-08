import dayjs from "dayjs";

export default function handler(req, res) {
  res.json({
    name: "Kayzen API",
    developer: "Kayzen Izumi",
    theme: "Zero Two",
    status: "online",
    time: dayjs().toISOString(),
    timezone: "Asia/Jakarta",
    version: "1.0.0",
    about_me: "Kayzen Izumi — developer & anime aesthetic enthusiast.",
    about_web: "Zero Two Ghost UI Web API (Vercel-only, polling based)."
  });
}
