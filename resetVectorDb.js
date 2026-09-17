const { getCollection } = require("./services/vectorDb");
const { ChromaClient } = require("chromadb");

async function run() {
    const client = new ChromaClient({ host: "localhost", port: 8000, ssl: false });
    try {
        await client.deleteCollection({ name: "documents" });
        console.log("Deleted old collection.");
    } catch (err) {
        console.log("Nothing to delete or already clean.");
    }
}

run();