const express = require('express');
const router=express.Router()

const {protect,adminOnly} = require('../middlewears/authmidllewear')
const {getDashboardData,getUserDashboardData,getTasks,createTask,updateTask,deleteTask,updateTaskStatus,updateTskChecklist,getTasKById} = require('../controllers/taskcontroller')

router.get("/dashboardData",protect,getDashboardData)
router.get("/user-dashboard-data",protect,getUserDashboardData)
router.get("/",protect,getTasks)
router.get("/:id",protect,getTasKById) // Assuming you want to get a specific task by ID, otherwise you can remove this line
router.post("/",protect,adminOnly,createTask)
router.put("/:id",protect,updateTask)
router.delete("/:id",protect,adminOnly,deleteTask)
router.put("/:id/status",protect,updateTaskStatus)

router.put("/:id/todo",protect,updateTskChecklist)


module.exports = router
