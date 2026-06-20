const express = require("express");
const sub_module_master_Controller = require("../controller/sub_module_master.controller"); // Import the controller

const router = new express.Router();

// POST route to create a new record
router.post("/create", sub_module_master_Controller.create);
router.get("/list", sub_module_master_Controller.getAll);
router.get("/:id", sub_module_master_Controller.getById);
router.put("/:id", sub_module_master_Controller.update);
router.delete("/:id", sub_module_master_Controller.delete);

module.exports = router;
