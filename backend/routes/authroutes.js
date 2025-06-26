const express = require("express");
const router = express.Router();

const upload = require("../middlewears/uploadmiddlewear");
const { protect } = require("../middlewears/authmidllewear");

const {
  registerUser,
  LoginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authcontroller");

// ✅ Auth routes
router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// ✅ Image Upload Route
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Bro, no file was uploaded 😢",
    });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(200).json({
    message: "Image uploaded successfully 🚀",
    url: imageUrl,
  });
});

module.exports = router;
