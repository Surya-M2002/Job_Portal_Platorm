import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import passportConfig from "./lib/passportConfig";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import apiRoutes from "./routes/apiRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import downloadRoutes from "./routes/downloadRoutes";

dotenv.config();

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/jobPortal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}

const app = express();
const port = process.env.PORT || 4444;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
// CORS: allow from FRONTEND_URL if provided; otherwise allow all (dev)
const allowedOrigins =
  (process.env.FRONTEND_URL || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/upload", uploadRoutes);
app.use("/host", downloadRoutes);

// Health and version endpoints for live monitoring
app.get("/health", (_req, res) => {
  const dbState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({
    status: "ok",
    uptime: process.uptime(),
    dbState,
    timestamp: new Date().toISOString(),
  });
});

app.get("/version", (_req, res) => {
  res.json({
    version: process.env.APP_VERSION || "1.0.0",
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
