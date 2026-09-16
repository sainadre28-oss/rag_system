require("dotenv").config();
const { generateEmbedding } = require("./services/embeddings");

async function run() {
    const vector = await generateEmbedding("This is a test sentence.");
    console.log("Vector length:", vector.length);
    console.log("First 5 values:", vector.slice(0, 5));
}

run();

const express = require("express");
const uploadRouter = require("./routes/upload");
const { multerErrorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/hello/:name", (req, res) => {
    res.send(`Hello, ${req.params.name}!`);
});

app.post("/echo", (req, res) => {
    res.json(req.body);
});

app.use("/upload", uploadRouter);

app.use(multerErrorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});