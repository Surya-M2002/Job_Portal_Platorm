import express from "express";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";
import { pipeline as streamPipeline } from "stream";

const pipeline = promisify(streamPipeline);

const router = express.Router();

// Separate uploaders to enforce different size limits
const uploadResume = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
const uploadProfile = multer({ limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB

router.post("/resume", uploadResume.single("file"), (req, res) => {
  const file = (req as any).file;
  if (file.detectedFileExtension !== ".pdf") {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
    )
      .then(() => {
        res.send({
          message: "File uploaded successfully",
          url: `/host/resume/${filename}`,
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

router.post("/profile", uploadProfile.single("file"), (req, res) => {
  const file = (req as any).file;
  if (
    file.detectedFileExtension !== ".jpg" &&
    file.detectedFileExtension !== ".png"
  ) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch(() => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

// Multer error handler (e.g., file too large)
router.use((err: any, _req: any, res: any, _next: any) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({
      message: "File too large",
    });
  } else if (err) {
    res.status(400).json({
      message: "Upload error",
    });
  }
});

export default router;
