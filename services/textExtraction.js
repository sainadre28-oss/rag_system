const fs = require("fs");
const { PDFParse } = require("pdf-parse");

async function extractText(filePath, originalName) {
    const name = originalName.toLowerCase();

    if (name.endsWith(".pdf")) {
        const fileBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: fileBuffer });
        const result = await parser.getText();
        await parser.destroy();
        return result.text;
    }

    if (name.endsWith(".txt")) {
        return fs.readFileSync(filePath, "utf-8");
    }

    throw new Error("UNSUPPORTED_FILE_TYPE");
}

module.exports = { extractText };