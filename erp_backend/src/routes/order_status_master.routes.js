"use strict";

const express = require("express");
const router = express.Router();

const controller = require("../controller/order_status_master.controller");

// CREATE
router.post("/create", controller.create);

// LIST (company wise)
router.get("/list", controller.list);

// DETAILS
router.get("/:id", controller.details);

// UPDATE
router.post("/update/:id", controller.update);

module.exports = router;
