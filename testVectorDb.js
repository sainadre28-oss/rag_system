require("dotenv").config();
const { chunkText } = require("./services/chunking");
const { generateEmbedding } = require("./services/embeddings");
const { addChunks, getCollection } = require("./services/vectorDb");

async function run() {
    const text = "The sky is blue. Cats are mammals. Paris is the capital of France.";
    const chunks = chunkText(text, 30, 5);

    console.log("Chunks:", chunks);

    const embeddings = [];
    for (const chunk of chunks) {
        const vector = await generateEmbedding(chunk);
        embeddings.push(vector);
    }

    await addChunks("test-doc-1", chunks, embeddings);
    console.log("Added chunks to ChromaDB!");

    const collection = await getCollection();
    const count = await collection.count();
    console.log("Total items in collection:", count);
}

run();
