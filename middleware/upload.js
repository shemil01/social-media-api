const multer = require("multer");
require("dotenv").config({ path: "./config/.env" });
const fs = require("fs").promises;
const cloudinary = require("../utils/cloudinary");

// Multer storage configuration
const storage = multer.diskStorage({});
const upload = multer({ storage: storage }).fields([
  { name: "profileImage", maxCount: 1 },
  { name: "postImage", maxCount: 1 },
]);

// Middleware to upload images to Cloudinary
const uploadImage = (req, res, next) => {
  upload(req, res, async (error) => {
    if (error) {
      console.error("Multer error:", error);
      return res.status(500).json({ message: "File upload error" });
    }

    try {
      // Check if `profileImage` was uploaded and process it
      if (req.files && req.files.profileImage) {
        const result = await cloudinary.uploader.upload(req.files.profileImage[0].path);
        req.cloudinaryProfileImageUrl = result.secure_url;
        await fs.unlink(req.files.profileImage[0].path); // Delete local file after upload
      }

      // Check if `postImage` was uploaded and process it
      if (req.files && req.files.postImage) {
        const result = await cloudinary.uploader.upload(req.files.postImage[0].path);
        req.cloudinaryPostImageUrl = result.secure_url;
        await fs.unlink(req.files.postImage[0].path); // Delete local file after upload
      }

      next();
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);          
      return res.status(500).json({ message: "Image upload failed" });
    }
  });
};

module.exports = { uploadImage };
 