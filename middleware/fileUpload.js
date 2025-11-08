const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

const dotenv = require("dotenv");
dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    if (file.mimetype === "application/pdf") {
      return {
        bucketName: "documents",
        filename: `${Date.now()}-${file.originalname}`,
      };
    } else {
      return null;
    }
  },
});

const upload = multer({ storage });
module.exports = upload;
