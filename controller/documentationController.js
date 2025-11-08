const mongoose = require("mongoose");
const Document = require("../models/Document");
const dotenv = require("dotenv");
dotenv.config();

const conn = mongoose.connection;

let gfsBucket;
conn.once("open", () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "documents",
  });
  console.log("GridFSBucket initialized");
});
const getAllDocuments = async (request, response) => {
  try {
    const documents = await Document.find({ status: "active" }).populate("owner", "name email");
    response.json(documents);
  } catch (error) {
    response.status(500).json({ message: "Error fetching documents", error: error.message });
  }
};

const getStreamingFile = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (!gfsBucket) return res.status(500).json({ message: "GridFSBucket not initialized" });

    const files = await gfsBucket.find({ _id: new mongoose.Types.ObjectId(doc.fileId) }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];
    res.set("Content-Type", file.contentType);

    const readStream = gfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);

    readStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      res.status(500).json({ message: "Error streaming file", error: err.message });
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Error fetching file", error: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title, description } = req.body;

    const document = new Document({
      title,
      description,
      owner: req.user?._id,
      fileId: req.file.id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.contentType,
    });

    await document.save();

    res.status(201).json({ message: "Document uploaded", document: { ...document.toObject() } });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ message: "Error uploading document", error: error.message });
  }
};
module.exports = { getAllDocuments, getStreamingFile, uploadFile };
