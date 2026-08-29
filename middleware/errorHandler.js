const multer = require("multer");

function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ error: "File too large. Max size is 5MB" });
        }
        return res.status(400).json({ error: err.message });
    }
    next(err);
}

module.exports = { multerErrorHandler };