const express=require('express');
const router=express.Router();
const {exportTasksReport,exportUsersReport}=require("../controllers/reportcontoller");
const {protect,adminOnly}=require("../middlewears/authmidllewear");

router.get("/export/tasks",protect,adminOnly,exportTasksReport);
router.get("/export/users",protect,adminOnly,exportUsersReport);

module.exports=router;
