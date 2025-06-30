const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, adminOnly } = require("../middlewears/authmidllewear");
const {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTskChecklist,
  getTasKById
} = require("../controllers/taskcontroller")

// ✅ 1. Static routes first (no ID parameter)
router.get("/dashboardData", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);

// ✅ 2. ID validation middleware (for all routes with :id)
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }
  next();
};

// ✅ 3. Dynamic routes (with ID) after static routes
router.get("/:id", protect, validateObjectId, getTasKById);
router.put("/:id", protect, validateObjectId, updateTask);
router.delete("/:id", protect, adminOnly, validateObjectId, deleteTask);
router.put("/:id/status", protect, validateObjectId, updateTaskStatus);
router.put("/:id/todo", protect, validateObjectId, updateTskChecklist);

// ✅ 4. Task creation (no ID needed)
router.post("/", protect, adminOnly, createTask);

module.exports = router;