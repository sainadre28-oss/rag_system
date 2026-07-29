const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const app = express();
const PORT = 3000;

app.use(express.json());

// Multer config with a file size limit added
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/hello/:name", (req, res) => {
    res.send(`Hello, ${req.params.name}!`);
});

app.post("/echo", (req, res) => {
    res.json(req.body);
});

app.post("/upload", upload.single("file"), async (req, res) => {
    // Validation: was a file actually sent?
    if (!req.file) {
        return res.status(400).json({ error: "No file was uploaded" });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    try {
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
            fs.unlinkSync(filePath); // clean up the rejected file
            return res.status(400).json({ error: "Unsupported file type. Use .pdf or .txt" });
        }

        // Validation: was anything actually extracted?
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
        console.error("Extraction error:", err);

        // Clean up the file even if extraction crashed
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(500).json({ error: "Failed to extract text from file" });
    }
});

// Multer-specific error handler (must come after your routes)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ error: "File too large. Max size is 5MB" });
        }
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});