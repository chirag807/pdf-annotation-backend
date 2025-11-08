const mongoose = require("mongoose")

const versionSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.ObjectId,
    ref: "Document",
    required: true,
  },
  versionNumber: {
    type: Number,
    required: true,
  },
  fileUrl: String,
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  changes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("DocumentVersion", versionSchema)
