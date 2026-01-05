const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const mongoURI = process.env.MONGO_URI;

let gfs;
let upload;

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    const conn = mongoose.connection;

    // Init GridFS
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("fileUploads");

    // Init GridFS Storage (AFTER connection)
    const storage = new GridFsStorage({
      db: conn.db,
      file: (req, file) => {
        return {
          filename: file.originalname,
          bucketName: "fileUploads",
          metadata: {
            title: req.body.title || file.originalname,
          },
        };
      },
    });

    upload = multer({ storage });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = {
  get upload() {
    return upload;
  },
  get gfs() {
    return gfs;
  },
};


