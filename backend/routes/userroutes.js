// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewears/authmidllewear");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");

// ✅ Correct usage (imported functions are used directly)
router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;