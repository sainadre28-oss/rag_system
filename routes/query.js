const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { generateEmbedding } = require("../services/embeddings");
const { getCollection } = require("../services/vectorDb");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
        return res.status(400).json({ error: "Question is required" });
    }

    try {
        const questionEmbedding = await generateEmbedding(question);

        const collection = await getCollection();
        const results = await collection.query({
            queryEmbeddings: [questionEmbedding],
            nResults: 3,
        });

        const retrievedChunks = results.documents[0];
        console.log("Retrieved chunks:", retrievedChunks);

        if (!retrievedChunks || retrievedChunks.length === 0) {
            return res.json({ answer: "No relevant documents found to answer this question." });
        }

        const context = retrievedChunks.join("\n\n---\n\n");

        const prompt = `Answer the question using ONLY the context below. If the context doesn't contain the answer, say "I don't have enough information to answer that."

Context:
${context}

Question: ${question}

Answer:`;
        console.log("=== FULL PROMPT SENT TO GEMINI ===");
        console.log(prompt);
        console.log("=== END PROMPT ===");

        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        const sources = retrievedChunks.map((chunk, i) => ({
            excerpt: chunk.slice(0, 150) + (chunk.length > 150 ? "..." : ""),
        }));

        res.json({
            answer,
            sources,
        });
    } catch (err) {
        console.error("Query error:", err);
        res.status(500).json({ error: "Failed to process query" });
    }
});

module.exports = router;