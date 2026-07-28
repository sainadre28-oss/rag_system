const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies (needed before any route that reads req.body)
app.use(express.json());

// Route 1: GET "/" — basic health check
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Route 2: GET "/hello/:name" — reads a URL parameter
app.get("/hello/:name", (req, res) => {
    const name = req.params.name;
    res.send(`Hello, ${name}!`);
});

// Route 3: POST "/echo" — reads the JSON body and sends it back
app.post("/echo", (req, res) => {
    console.log("Received body:", req.body);
    res.json(req.body);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
    res.json(req.file);
});