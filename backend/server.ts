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
    useCreateIndex: true,
    useFindAndModify: false,
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
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/upload", uploadRoutes);
app.use("/host", downloadRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
