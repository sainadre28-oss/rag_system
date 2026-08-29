const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { extractText } = require("../services/textExtraction");

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

        console.log("Extracted text preview:", extractedText.slice(0, 200));

        res.json({
            originalName,
            textLength: extractedText.length,
            preview: extractedText.slice(0, 200),
        });
    } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (err.message === "UNSUPPORTED_FILE_TYPE") {
            return res.status(400).json({ error: "Unsupported file type. Use .pdf or .txt" });
        }

        console.error("Extraction error:", err);
        res.status(500).json({ error: "Failed to extract text from file" });
    }
});

module.exports = router;