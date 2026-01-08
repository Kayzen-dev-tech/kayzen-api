import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  const reply = `Hmm~ *${prompt}*… Aku akan bantu kamu dengan gaya anime Zero Two ✨`;
  const partials = reply.split(""); 

  res.json({
    ai: "Zero Two (Gemini+GPT hybrid)",
    partials
  });
});

export default router;
