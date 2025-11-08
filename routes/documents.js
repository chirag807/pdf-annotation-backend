const express = require("express");
const { auth } = require("../middleware/auth");
const { getAllDocuments, getStreamingFile, uploadFile } = require("../controller/documentationController");
const upload = require("../middleware/fileUpload");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Documents
 *     description: Document upload and retrieval
 *
 * /api/documents:
 *   get:
 *     tags: [Documents]
 *     summary: List active documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *
 * /api/documents/upload:
 *   post:
 *     tags: [Documents]
 *     summary: Upload a PDF document
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded
 *
 * /api/documents/{docId}/file:
 *   get:
 *     tags: [Documents]
 *     summary: Download document file
 *     parameters:
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF file stream
 */
router.get("/", getAllDocuments);

router.get("/:docId/file", getStreamingFile);

router.post("/upload", auth, upload.single("file"), uploadFile);

module.exports = router;
