const express = require("express");
const module_master_Controller = require("../controller/module_master.controller"); // Import the controller

const router = new express.Router();

// POST route to create a new record
router.post("/create", module_master_Controller.create);
router.get("/list", module_master_Controller.getAll);
router.get("/:id", module_master_Controller.getById);
router.put("/:id", module_master_Controller.update);
router.delete("/:id", module_master_Controller.delete);

module.exports = router;
