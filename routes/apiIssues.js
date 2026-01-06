const express = require("express");
const mongoose = require("mongoose");
const Issue = require("../models/issue");

const router = express.Router();

/**
 * GET /api/issues
 * Fetch issues with attached GridFS files
 */
router.get("/issues", async (req, res) => {
  try {
    const issues = await Issue.aggregate([
      // 🔥 Ensure fileID is ObjectId (important!)
      {
        $addFields: {
          fileID: {
            $cond: {
              if: { $eq: [{ $type: "$fileID" }, "string"] },
              then: { $toObjectId: "$fileID" },
              else: "$fileID",
            },
          },
        },
      },

      // 🔗 Join with GridFS files collection
      {
        $lookup: {
          from: "files",          // ✅ correct collection
          localField: "fileID",
          foreignField: "_id",
          as: "files",
        },
      },

      // 🧹 Clean response
      {
        $project: {
          title: 1,
          description: 1,
          createdAt: 1,
          files: {
            _id: 1,
            filename: 1,
            length: 1,
            contentType: 1,
            uploadDate: 1,
            "metadata.originalName": 1,
          },
        },
      },
    ]);

    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

module.exports = router;

