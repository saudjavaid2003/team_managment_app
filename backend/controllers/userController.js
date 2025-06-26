// controllers/userController.js
const User = require("../models/User");
const Task = require("../models/Task");

// ✅ Properly exported functions
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select("-password");
        const pendingTasks = await Task.countDocuments({ assignedTo: users._id, status: "pending" });
        const tasksInProgress = await Task.countDocuments({ assignedTo: users._id, status: "in progress" });
        const completedTasks = await Task.countDocuments({ assignedTo: users._id, status: "completed" });
        
        res.status(200).json({
            users,
            pendingTasks,
            tasksInProgress,
            completedTasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User nt found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};