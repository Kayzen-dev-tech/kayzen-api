import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const now = new Date();
  const options = { timeZone: "Asia/Jakarta", hour12: false };
  res.json({
    time: now.toLocaleTimeString("id-ID", options),
    date: now.toLocaleDateString("id-ID", options)
  });
});

export default router;