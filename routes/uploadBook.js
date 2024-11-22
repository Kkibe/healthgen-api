const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.fieldname === "image" ? "images" : "files"; // Use field name to determine folder
    cb(null, `./${folder}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "_" + uniqueSuffix);
  },
});

// Middleware to Handle Multiple File Uploads
const upload = (folder, fieldName) =>
  multer({ storage: storage }).fields([
    { name: "image", maxCount: 1 }, // For book cover image
    { name: "file", maxCount: 1 }, // For book file
  ]);

module.exports = { upload };
