const express = require("express");
const db = require("../db");

const router = express.Router();

/* ======================
   MULTI FILE UPLOAD (SAFE)
   ====================== */
router.post("/", (req, res, next) => {
  let upload;

  try {
    upload = db.upload;
  } catch (err) {
    return res.status(503).json({ error: "Upload service not ready" });
  }

  upload.array("file", 3)(req, res, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Files uploaded successfully" });
  });
});

module.exports = router;

