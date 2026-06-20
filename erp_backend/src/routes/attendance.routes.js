const express = require("express");
const router = express.Router();
const attendanceController = require("../controller/attendance.controller");

// ✅ POST - create or update attendance
router.post("/create", attendanceController.markMonthlyAttendance);

// ✅ GET - list all attendance
router.get("/list", attendanceController.getMonthlyAttendance);

// ✅ GET - get one by emp_id + month
router.get("/get", attendanceController.getAttendanceByEmployeeMonth);

module.exports = router;
