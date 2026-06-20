const express = require("express");
const router = express.Router();

const controller = require("../controller/priceListMaster.controller");

// CREATE
router.post("/create", controller.create);

// LIST ALL
router.get("/list", controller.list);

// DETAILS BY ID
router.get("/details/:id", controller.details);

// UPDATE
router.put("/update/:id", controller.update);

// DELETE (status → inactive + soft delete)
router.delete("/delete/:id", controller.delete);

module.exports = router;
