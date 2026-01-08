export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  const reply =
    `Hey darling~ 💕 Aku Zero Two.\n` +
    `Aku akan bantu kamu dengan gaya manis dan sedikit tsundere.\n\n` +
    `Pertanyaan kamu:\n"${prompt}"\n\n` +
    `Jawaban:\nTenang saja, aku di sini 😘`;

  res.json({
    character: "Zero Two",
    partials: reply.split("")
  });
      }
