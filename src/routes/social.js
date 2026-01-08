import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    tiktok: "https://tiktok.com/@sczkayzen",
    instagram: "https://instagram.com/kayzenfry",
    youtube: "https://youtube.com/@kayzenfry",
    github: "https://github.com/Kayzen-dev-tech"
  });
});

export default router;