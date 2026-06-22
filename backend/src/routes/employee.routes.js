const express = require("express");
const router = express.Router();
const EmployeeController = require("../controller/employee.controller");
// const { upload } = require("../middleware/UploadFile");
const { upload } = require("../UploadFile"); // <-- your dynamic folder multer

router.post(
  "/create",
  upload.any(), // instead of .fields([...])
  EmployeeController.createEmployee
);

// LIST Employees
router.get("/list", EmployeeController.getAllEmployees);

// VIEW Employee by ID
router.get("/details/:emp_id", EmployeeController.getEmployeeById);
// router.get("/details/:emp_email", EmployeeController.getEmployeeByEmail);
router.get("/details/email/:emp_email", EmployeeController.getEmployeeByEmail);

// UPDATE Employee
router.post(
  "/update/:emp_id",
  upload.any(), // instead of .fields([...])
  EmployeeController.updateEmployee
);

// DELETE Employee
router.delete("/delete/:emp_id", EmployeeController.deleteEmployee);

module.exports = router;
