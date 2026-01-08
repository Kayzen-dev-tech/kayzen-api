import express from "express";
import dayjs from "dayjs";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    name: "Kayzen API",
    developer: "Kayzen Izumi",
    theme: "Zero Two",
    status: "online",
    time: dayjs().format(),
    timezone: "Asia/Jakarta",
    version: "1.0.0",
    about_me: "Halo! Aku Kayzen Izumi, developer & kreator API modern.",
    about_web: "Web API realtime dengan Ghost UI, Socket.io, dan tema Zero Two."
  });
});

export default router;