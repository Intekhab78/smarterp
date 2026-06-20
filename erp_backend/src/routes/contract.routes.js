const express = require("express");
const router = express.Router();
const contractController = require("../controller/contract.controller");

// ✅ POST - create or update contract
router.post("/create", contractController.createOrUpdateContract);

// ✅ GET - list all contracts
router.get("/list", contractController.getAllContracts);

// ✅ GET - get contract by emp_id
router.get("/get", contractController.getContractByEmployee);


router.get("/get/:emp_id", contractController.getContractByEmployeeId);

// ✅ Update contract by emp_id
router.put("/update/:emp_id", contractController.updateContractByEmployeeId);


// ✅ DELETE - delete contract by id
router.delete("/delete/:id", contractController.deleteContract);

module.exports = router;
