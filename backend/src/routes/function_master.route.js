const express = require("express");
const function_master_Controller = require("../controller/function_master.controller"); // Import the controller

const router = new express.Router();

// POST route to create a new record
router.post("/create", function_master_Controller.create);
router.get("/list", function_master_Controller.getAll);
router.get("/:id", function_master_Controller.getById);
router.put("/:id", function_master_Controller.update);
router.delete("/:id", function_master_Controller.delete);

module.exports = router;
