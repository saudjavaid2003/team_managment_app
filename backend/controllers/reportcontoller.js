const Task = require("../models/Task");
const User = require("../models/User");
const ExcelJS = require("exceljs");

const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 20 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = Array.isArray(task.assignedTo)
        ? task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ")
        : task.assignedTo
        ? `${task.assignedTo.name} (${task.assignedTo.email})`
        : "";

      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=tasks_report.xlsx`);

    return await workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating report",
      error: error.message,
    });
  }
};

const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate("assignedTo", "name email _id");

    const userTaskMap = {};

    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        tasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (Array.isArray(task.assignedTo)) {
        task.assignedTo.forEach((user) => {
          if (userTaskMap[user._id]) {
            userTaskMap[user._id].tasks += 1;

            if (task.status === "pending") {
              userTaskMap[user._id].pendingTasks += 1;
            } else if (task.status === "in progress") {
              userTaskMap[user._id].inProgressTasks += 1;
            } else if (task.status === "completed") {
              userTaskMap[user._id].completedTasks += 1;
            }
          }
        });
      } else if (task.assignedTo && userTaskMap[task.assignedTo._id]) {
        userTaskMap[task.assignedTo._id].tasks += 1;

        if (task.status === "pending") {
          userTaskMap[task.assignedTo._id].pendingTasks += 1;
        } else if (task.status === "in progress") {
          userTaskMap[task.assignedTo._id].inProgressTasks += 1;
        } else if (task.status === "completed") {
          userTaskMap[task.assignedTo._id].completedTasks += 1;
        }
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Total Tasks", key: "tasks", width: 15 },
      { header: "Pending Tasks", key: "pendingTasks", width: 15 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=users_report.xlsx`);

    return await workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error sorry",
      error: error.message,
    });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
};
