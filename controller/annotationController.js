const Annotation = require("../models/Annotation");
const Document = require("../models/Document");
const mongoose = require("mongoose");

const getAnnotationByDocId = async (req, res) => {
  try {
    const docId = req.params.docId;
    const doc = await Document.findById(docId).populate("owner", "name email");
    if (!doc) return res.status(404).json({ message: "Document not found" });
    const annotations = await Annotation.find({ document: docId }).populate("user", "name email").populate("updatedBy", "name email");
    res.json({ document: doc, annotations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching document", error: error.message });
  }
};

const addAnnotations = async (req, res) => {
  try {
    const { document, page, type, content, color, coordinates } = req.body;

    const doc = await Document.findById(document);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // const isOwner = doc.owner.toString() === req.user._id.toString();
    // const hasPerm = doc.permissions.some((p) => p.user.toString() === req.user._id.toString() && (p.role === "annotate" || p.role === "manage"));

    // if (!isOwner && !hasPerm) {
    //   return res.status(403).json({ message: "You do not have permission to annotate" });
    // }

    const annotation = new Annotation({
      document,
      user: req.user._id,
      page,
      type,
      content,
      color,
      coordinates,
    });

    await annotation.save();
    await annotation.populate("user", "name email");

    res.status(201).json(annotation);
  } catch (error) {
    res.status(500).json({ message: "Error creating annotation", error: error.message });
  }
};

const deleteAnnotation = async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);

    if (!annotation) {
      return res.status(404).json({ message: "Annotation not found" });
    }

    // if (annotation.user.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Only creator can delete annotation" });
    // }

    await Annotation.findByIdAndDelete(req.params.id);
    res.json({ message: "Annotation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting annotation", error: error.message });
  }
};

const editAnnotation = async (req, res) => {
  try {
    const { content, color, userId } = req.body;
    const annotation = await Annotation.findById(req.params.id);

    if (!annotation) {
      return res.status(404).json({ message: "Annotation not found" });
    }

    // if (annotation.user.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Only creator can edit annotation" });
    // }

    annotation.content = content || annotation.content;
    annotation.color = color || annotation.color;
    annotation.updatedAt = Date.now();
    annotation.updatedBy = new mongoose.Types.ObjectId(userId);

    await annotation.save();
    res.json(annotation);
  } catch (error) {
    res.status(500).json({ message: "Error updating annotation", error: error.message });
  }
};

const addReplyForAnnotation = async (req, res) => {
  try {
    const { content } = req.body;
    const annotation = await Annotation.findById(req.params.id);

    if (!annotation) {
      return res.status(404).json({ message: "Annotation not found" });
    }

    annotation.replies.push({
      user: req.user._id,
      content,
    });

    await annotation.save();
    await annotation.populate("replies.user", "name email");

    res.json(annotation);
  } catch (error) {
    res.status(500).json({ message: "Error adding reply", error: error.message });
  }
};
module.exports = { getAnnotationByDocId, addAnnotations, deleteAnnotation, editAnnotation, addReplyForAnnotation };
