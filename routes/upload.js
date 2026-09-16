const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { extractText } = require("../services/textExtraction");
const prisma = require("../services/prismaClient");
const { chunkText } = require("../services/chunking");
const { generateEmbedding } = require("../services/embeddings");
const { addChunks } = require("../services/vectorDb");

const router = express.Router();

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file was uploaded" });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    try {
        const extractedText = await extractText(filePath, originalName);

        if (!extractedText || extractedText.trim().length === 0) {
            fs.unlinkSync(filePath);
            return res.status(422).json({ error: "File appears to be empty or unreadable" });
        }

        const document = await prisma.document.create({
            data: {
                filename: req.file.filename,
                originalName: originalName,
                userId: 1,
            },
        });

        const chunks = chunkText(extractedText);

        const embeddings = [];
        for (const chunk of chunks) {
            const vector = await generateEmbedding(chunk);
            embeddings.push(vector);
        }

        await addChunks(document.id.toString(), chunks, embeddings);

        res.json({
            id: document.id,
            originalName: document.originalName,
            textLength: extractedText.length,
            chunkCount: chunks.length,
        });
    } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (err.message === "UNSUPPORTED_FILE_TYPE") {
            return res.status(400).json({ error: "Unsupported file type. Use .pdf or .txt" });
        }

        console.error("Upload processing error:", err);
        res.status(500).json({ error: "Failed to process file" });
    }
});

module.exports = router;
