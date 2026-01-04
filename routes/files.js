const express = require("express");
const mongoose = require("mongoose");
const { upload, gfs } = require("../db");

const router = express.Router();

/* ======================
   UPLOAD PDF (ADMIN)
   ====================== */
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    id: req.file.id,
    title: req.file.metadata.title,
  });
});

/* ======================
   LIST ALL NOTES
   ====================== */
router.get("/", async (req, res) => {
  const files = await gfs.grid.files.find().toArray();
  res.json(files);
});

/* ======================
   VIEW PDF
   ====================== */
router.get("/:id", async (req, res) => {
  const file = await gfs.grid.files.findOne({
    _id: new mongoose.Types.ObjectId(req.params.id),
  });

  if (!file) return res.status(404).json({ error: "File not found" });

  res.set("Content-Type", "application/pdf");

  gfs.grid.createReadStream({ _id: file._id }).pipe(res);
});

/* ======================
   DELETE PDF (ADMIN)
   ====================== */
router.delete("/:id", async (req, res) => {
  const fileId = new mongoose.Types.ObjectId(req.params.id);

  gfs.grid.remove({ _id: fileId, root: "fileUploads" }, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted successfully" });
  });
});

module.exports = router;


