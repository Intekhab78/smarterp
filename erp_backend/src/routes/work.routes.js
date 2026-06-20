const express = require("express");
const router = express.Router();
const WorkController = require("../controller/work.controller");

// Create Work Info
// router.post("/create", WorkController.createWork);
router.post("/create", WorkController.createOrUpdateWork);


// Get Work Info by Employee ID
// router.get("/details/:emp_id", WorkController.getWorkByEmpId);

// // Update Work Info by Employee ID
// router.put("/update/:emp_id", WorkController.updateWork);
// router.get("/details/:emp_id", WorkController.getWorkByEmpId);
// routes/employee.routes.js
// router.delete("/delete/:emp_id", WorkController.deleteWork);


module.exports = router;
