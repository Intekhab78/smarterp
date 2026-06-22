const express = require("express");
const router = express.Router();
const attendanceController = require("../controller/attendance_payroll.controller");

// Create new attendance record
router.post("/create", attendanceController.create);

// Get all attendance records
router.get("/list", attendanceController.list);

// Get attendance record by id
router.get("/detail/:id", attendanceController.view);

// Update attendance record by id
router.put("/update/:id", attendanceController.update);

module.exports = router;
