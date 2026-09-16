require("dotenv").config();
const { generateEmbedding } = require("./services/embeddings");

async function run() {
    const vector = await generateEmbedding("This is a test sentence.");
    console.log("Vector length:", vector.length);
    console.log("First 5 values:", vector.slice(0, 5));
}

run();
