const { ChromaClient } = require("chromadb");

const client = new ChromaClient({ path: "http://localhost:8000" });

async function getCollection() {
    return await client.getOrCreateCollection({ name: "documents" });
}

async function addChunks(documentId, chunks, embeddings) {
    const collection = await getCollection();
    const ids = chunks.map((_, i) => `${documentId}-chunk-${i}`);
    const metadatas = chunks.map((_, i) => ({ documentId, chunkIndex: i }));

    await collection.add({
        ids,
        embeddings,
        documents: chunks,
        metadatas,
    });
}

module.exports = { getCollection, addChunks };