const express = require("express");
const role_master_Controller = require("../controller/role_master.controller"); // Import the controller

const router = new express.Router();

// POST route to create a new record
router.post("/create", role_master_Controller.create);
router.get("/list", role_master_Controller.getAll);
router.get("/:id", role_master_Controller.getById);
router.put("/:id", role_master_Controller.update);
router.delete("/:id", role_master_Controller.delete);

module.exports = router;
