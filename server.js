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