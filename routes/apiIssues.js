const express = require("express");
const Issue = require("../models/issue");

const router = express.Router();

router.get("/issues", async (req, res) => {
  try {
    const issues = await Issue.aggregate([
      // ✅ Only include documents that actually have fileID
      {
        $match: {
          fileID: { $exists: true, $ne: null },
        },
      },

      // ✅ Safely convert string → ObjectId
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

      // ✅ Join with GridFS files collection
      {
        $lookup: {
          from: "files",
          localField: "fileID",
          foreignField: "_id",
          as: "files",
        },
      },

      // ✅ Optional: remove issues without matching files
      {
        $match: {
          files: { $ne: [] },
        },
      },

      // ✅ Clean response
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
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

module.exports = router;


