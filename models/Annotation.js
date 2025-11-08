const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.ObjectId,
    ref: "Document",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["comment", "highlight", "drawing"],
    default: "comment",
  },
  content: String,
  color: String,
  coordinates: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
  replies: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
  deletedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model("Annotation", annotationSchema);
