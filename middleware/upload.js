const multer = require("multer");
require("dotenv").config({ path: "./config/.env" });
const fs = require("fs").promises;
const cloudinary = require("../utils/cloudinary");

// Multer storage configuration
const storage = multer.diskStorage({});

// Multer upload configuration
const upload = multer({ storage: storage });

// Middleware to upload image to Cloudinary or use provided URL
const uploadImage = (req, res, next) => {
  upload.single("profailPicture")(req, res, async (error) => {
    if (error) {
      console.error("Multer error:", error);
      return res.status(500).json({ message: "File upload error" });
    }

    try {
      // If an image file is uploaded via multer
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        req.cloudinaryImageUrl = result.secure_url;

        // Delete the local file after uploading
        await fs.unlink(req.file.path);
      } else if (req.body.imageURL) {
        // If an image URL is provided instead of a file
        req.cloudinaryImageUrl = req.body.imageURL;
      }

      next();
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);
      return res.status(500).json({ message: "Image upload failed" });
    }
  });
};

module.exports = { uploadImage };
