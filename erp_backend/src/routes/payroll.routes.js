// routes/work.routes.js
const express = require("express");
const router = express.Router();
const payrollController = require("../controller/payroll.controller");

router.post("/create", payrollController.create);

// ✅ Update Payroll
router.put("/update/:id", payrollController.update);

router.get("/details/:emp_id", payrollController.getByEmployeeId);


// ✅ Delete Payroll
router.delete("/delete/:id", payrollController.delete);

module.exports = router;
