const multer = require("multer");
const path = require("path");

// Reusable Multer Storage Configuration
const storage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./${folder}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "_" + path.extname(file.originalname);
      cb(null, file.fieldname + "_" + uniqueSuffix);
    },
  });

// Middleware for File Upload
const upload = (folder, fieldName) =>
  multer({ storage: storage(folder) }).single(fieldName);

module.exports = {upload};