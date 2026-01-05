const express = require("express");
const mongoose = require("mongoose");
const db = require("../db");

const router = express.Router();

/* ======================
   UPLOAD PDF (SAFE)
   ====================== */
router.post("/upload", (req, res, next) => {
  let upload;

  try {
    upload = db.upload;
  } catch (err) {
    return res.status(503).json({ error: "Upload service not ready" });
  }

  upload.single("file")(req, res, (err) => {
    if (err) return res.status(500).json(err);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      id: req.file.id,
      title: req.file.metadata.title,
    });
  });
});

/* ======================
   LIST ALL FILES
   ====================== */
router.get("/", async (req, res) => {
  let gfs;

  try {
    gfs = db.gfs;
  } catch (err) {
    return res.status(503).json({ error: "GridFS not ready" });
  }

  const files = await gfs.files.find().toArray();
  res.json(files);
});

/* ======================
   VIEW PDF
   ====================== */
router.get("/:id", async (req, res) => {
  let gfs;

  try {
    gfs = db.gfs;
  } catch (err) {
    return res.status(503).json({ error: "GridFS not ready" });
  }

  const file = await gfs.files.findOne({
    _id: new mongoose.Types.ObjectId(req.params.id),
  });

  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  res.set("Content-Type", "application/pdf");
  gfs.createReadStream({ _id: file._id }).pipe(res);
});

/* ======================
   DELETE PDF
   ====================== */
router.delete("/:id", async (req, res) => {
  let gfs;

  try {
    gfs = db.gfs;
  } catch (err) {
    return res.status(503).json({ error: "GridFS not ready" });
  }

  const fileId = new mongoose.Types.ObjectId(req.params.id);

  gfs.remove({ _id: fileId, root: "fileUploads" }, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted successfully" });
  });
});

module.exports = router;




