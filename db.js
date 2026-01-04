const path = require("path");
const crypto = require("crypto");
const dotenv = require("dotenv");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbInstance = mongoose.connection;

// GridFS init
const gfs = { grid: null };

dbInstance.once("open", () => {
  gfs.grid = Grid(dbInstance.db, mongoose.mongo);
  gfs.grid.collection("fileUploads");
  console.log("✅ GridFS ready");
});

// Multer GridFS storage
const storage = new GridFsStorage({
  db: dbInstance,
  file: (req, file) =>
    new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename =
          buf.toString("hex") + path.extname(file.originalname);

        resolve({
          filename,
          bucketName: "fileUploads",
          metadata: {
            title: req.body.title || file.originalname,
            subject: req.body.subject || "General",
            class: req.body.class || "",
            chapter: req.body.chapter || "",
          },
        });
      });
    }),
});

const upload = multer({ storage });

module.exports = { upload, gfs };
