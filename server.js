const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

// 1. Initialize the Express application
const app = express();

// 2. Initialize Multer and define the destination folder for uploaded files
// (Make sure an 'uploads' folder exists in your project directory, or Multer will create it)
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const originalName = req.file.originalname;
        let extractedText = "";

        if (originalName.toLowerCase().endsWith(".pdf")) {
            const fileBuffer = fs.readFileSync(filePath);
            const parser = new PDFParse({ data: fileBuffer });
            const result = await parser.getText();
            extractedText = result.text;
            await parser.destroy();
        } else if (originalName.toLowerCase().endsWith(".txt")) {
            extractedText = fs.readFileSync(filePath, "utf-8");
        } else {
            return res.status(400).json({ error: "Unsupported file type. Use .pdf or .txt" });
        }

        console.log("Extracted text preview:", extractedText.slice(0, 200));

        res.json({
            originalName,
            textLength: extractedText.length,
            preview: extractedText.slice(0, 200),
        });
    } catch (err) {
        console.error("Extraction error:", err);
        res.status(500).json({ error: "Failed to extract text from file" });
    }
});

// 3. Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running and listening on http://localhost:3000");
});