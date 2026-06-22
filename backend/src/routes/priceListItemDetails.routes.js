const express = require("express");
const router = express.Router();

const controller = require("../controller/priceListItemDetails.controller");

// CREATE
router.post("/create", controller.create);
// CREATE
router.post("/bilk-create", controller.createBulk);

// LIST ALL
router.get("/list", controller.list);

// DETAILS
router.get("/details/:id", controller.details);

// UPDATE
router.put("/update/:id", controller.update);

// DELETE (status → inactive + soft delete)
router.delete("/delete/:id", controller.delete);

module.exports = router;
