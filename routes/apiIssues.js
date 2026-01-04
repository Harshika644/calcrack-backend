const express = require("express");
const Issue = require("../models/issue");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/issues", async (req, res) => {
  try {
    const issues = await Issue.aggregate([
      {
        $lookup: {
          from: "fileUploads.files", // GridFS files collection
          localField: "fileID",
          foreignField: "_id",
          as: "files"
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          files: {
            _id: 1,
            filename: 1,
            "metadata.originalName": 1
          }
        }
      }
    ]);

    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

module.exports = router;

