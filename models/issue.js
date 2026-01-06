const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileID: {
      type: mongoose.Schema.Types.Mixed, // supports ObjectId OR string
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
