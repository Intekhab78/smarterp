const express = require("express");
const router = express.Router();
const controller = require("../controller/emp_attendance.controller");

router.post("/create", controller.createAttendance);
router.get("/list", controller.listAttendance);
router.get("/punch-details/:email", controller.getByEmailAndDate);
router.put("/update/:id", controller.updateAttendance);
router.delete("/delete/:id", controller.deleteAttendance);
router.get("/list/email/:email", controller.getAttendanceByEmail);

module.exports = router;
