import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import infoRoutes from "./routes/info.js";
import timeRoutes from "./routes/time.js";
import socialRoutes from "./routes/social.js";
import aiRoutes from "./routes/ai.js";
import instagramRoutes from "./routes/instagram.js";
import douyinRoutes from "./routes/douyin.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/v1/info", infoRoutes);
app.use("/api/v1/time", timeRoutes);
app.use("/api/v1/social", socialRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/instagram", instagramRoutes);
app.use("/api/v1/douyin", douyinRoutes);

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Socket.io Realtime Clock
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  const sendTime = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Jakarta", hour12: false };
    const time = now.toLocaleTimeString("id-ID", options);
    const date = now.toLocaleDateString("id-ID", options);
    socket.emit("update_time", { time, date, status: "ONLINE" });
  };

  sendTime();
  const interval = setInterval(sendTime, 1000);

  socket.on("disconnect", () => clearInterval(interval));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
