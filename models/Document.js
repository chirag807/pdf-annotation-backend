const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a document title"],
  },
  description: String,
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  fileUrl: String,
  fileSize: Number,
  pages: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["active", "archived", "deleted"],
    default: "active",
  },
  permissions: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["view", "annotate", "manage"],
        default: "view",
      },
    },
  ],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  versions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "DocumentVersion",
    },
  ],
  fileName: {
    type: String,
    required: true,
  },
  fileId: { type: mongoose.Schema.ObjectId, required: true },
});

module.exports = mongoose.model("Document", documentSchema);
