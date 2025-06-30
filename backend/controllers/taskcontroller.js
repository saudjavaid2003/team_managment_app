const Task = require("../models/Task");

// ✅ Create a New Task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      todoChecklists,
      attachments,
    } = req.body;

    if (!title || !dueDate || !assignedTo) {
      return res.status(400).json({ message: "Title, dueDate, and assignedTo are required." });
    }

    // Validate todoChecklists is an array of objects
    if (todoChecklists && !Array.isArray(todoChecklists)) {
      return res.status(400).json({
        message: "todoChecklists must be an array of objects like { text, completed }",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoChecklists,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
};

// ✅ Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      todoChecklists,
      attachments,
    } = req.body;

    // Validate todoChecklists format if provided
    if (todoChecklists && !Array.isArray(todoChecklists)) {
      return res.status(400).json({
        message: "todoChecklists must be an array of objects like { text, completed }",
      });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.attachments = attachments || task.attachments;
    task.assignedTo = assignedTo || task.assignedTo;
    if (todoChecklists) task.todoChecklists = todoChecklists;

    const updatedTask = await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

// ✅ Get Task By ID
const getTasKById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching task",
      error: error.message,
    });
  }
};

// ✅ Get All Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// ✅ Delete Task

const deleteTask=async (req,res)=>{
  try{
    const task=await Task.findById(req.params.id);
    if(!task){
      return res.json({
        message:"enter a task please"
      })
    }
    await task.deleteOne()
    res.status(200).json({
      message:"your task has been deleted successfully"
    })

  }
  catch(error){
    res.status(500).json({
      message:"any internet server error has been occured"
    })

  }
}


// ✅ Update Task Status Only
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        message: "Please enter a valid task ID",
      });
    }


    // Check if the user is assigned to this task or is admin
    const isAssigned = task.assignedTo.some((userId) =>
      userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not aurized to update this task status",
      });
    }

    task.status = req.body.status || task.status;

    if (task.status === "completed") {
      task.todoChecklist.forEach((item) => {
        item.completed = true;
      });
      task.progress = 100;
    }

    await task.save();

    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Update Checklist of a Task
const updateTskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body; // ✅ Destructure from req.body

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found. Please enter a valid task ID",
      });
    }

    // ✅ Authorization: only assigned users or admins can update
    const isAssigned = task.assignedTo.some((userId) =>
      userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized",
      });
    }

    // ✅ Update checklist
    task.todoChecklist = todoChecklist;

    // ✅ Calculate progress
    const completedCount = task.todoChecklist.filter((item) => item.completed).length;
    const totalItems = task.todoChecklist.length;
    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // ✅ Update status
    if (task.progress === 100) {
      task.status = "completed";
    } else if (task.progress > 0) {
      task.status = "In progress";
    } else {
      task.status = "pending";
    }

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");

    res.status(200).json({
      message: "Checklist updated successfully",
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getDashboardData = async (req, res) => {
  try {
    // Basic counts
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const inProgressTasks = await Task.countDocuments({ status: "In progress" });
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const overDueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" }
    });

    const taskStatuses = ["pending", "In progress", "completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "_");
      acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["ALL"] = totalTasks;

    const taskPriorities = ["low", "medium", "high"];
    const taskPrioritiesLevelRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      },
    ]);

    const taskPrioritiesLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPrioritiesLevelRaw.find(item => item._id === priority)?.count || 0;
      return acc;
    }, {});

    taskPrioritiesLevel["ALL"] = totalTasks;

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status dueDate createdAt assignedTo");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overDueTasks
      },
      charts: {
        taskDistribution,
        taskPrioritiesLevel
      },
      recentTasks
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Use await for all database operations
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ 
      assignedTo: userId, 
      status: "pending" 
    });
    const completedTasks = await Task.countDocuments({ 
      assignedTo: userId, 
      status: "completed" 
    });
    const overDueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" }
    });

    // Status distribution (removed "In progress")
    const taskStatuses = ["pending", "completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "_");
      acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
      return acc;
    }, {});
    
    taskDistribution["ALL"] = totalTasks;

    // Priority distribution
    const taskPriorities = ["low", "medium", "high"];
    const taskPrioritiesLevelRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    const taskPrioritiesLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPrioritiesLevelRaw.find(item => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Recent tasks
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status dueDate createdAt assignedTo")
      .populate('assignedTo', 'name email');

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overDueTasks
      },
      charts: {
        taskDistribution,
        taskPrioritiesLevel
      },
      recentTasks
    });

  } catch(error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
module.exports = {
  createTask,
  updateTask,
  getTasKById,
  getTasks,
  deleteTask,
  updateTaskStatus,
  updateTskChecklist,
  getDashboardData,
  getUserDashboardData,
};
