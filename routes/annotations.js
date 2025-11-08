const express = require("express");
const { auth } = require("../middleware/auth");
const { getAnnotationByDocId, addAnnotations, deleteAnnotation, editAnnotation, addReplyForAnnotation } = require("../controller/annotationController");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Annotations
 *     description: Annotation CRUD and replies
 *
 * /api/annotations/document/{docId}:
 *   get:
 *     tags: [Annotations]
 *     summary: Get document and annotations
 *     parameters:
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document with annotations
 *
 * /api/annotations:
 *   post:
 *     tags: [Annotations]
 *     summary: Create annotation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document: { type: string }
 *               page: { type: integer }
 *               type: { type: string }
 *               content: { type: string }
 *               color: { type: string }
 *               coordinates: { type: object }
 *     responses:
 *       201:
 *         description: Annotation created
 *
 * /api/annotations/{id}/reply:
 *   post:
 *     tags: [Annotations]
 *     summary: Add reply to an annotation
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: Reply added
 *
 * /api/annotations/{id}:
 *   put:
 *     tags: [Annotations]
 *     summary: Update annotation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *               color: { type: string }
 *     responses:
 *       200:
 *         description: Annotation updated
 *
 *   delete:
 *     tags: [Annotations]
 *     summary: Delete annotation
 *     responses:
 *       200:
 *         description: Annotation deleted
 */
router.post("/", auth, addAnnotations);
router.get("/document/:docId", auth, getAnnotationByDocId);
router.delete("/:id", auth, deleteAnnotation);
router.put("/:id", auth, editAnnotation);

router.post("/:id/reply", auth, addReplyForAnnotation);

module.exports = router;
