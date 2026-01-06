require("dotenv").config();
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("❌ MONGO_URI is missing in .env");
}

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
  console.log("✅ GridFS connected");
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => ({
    filename: file.originalname,
    bucketName: "fs",
  }),
});

const upload = multer({ storage });

module.exports = { upload, gfs };



