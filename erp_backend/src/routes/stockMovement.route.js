const express = require("express");
const router = express.Router();
const stockMovementController = require("../controller/stockMovement.controller");

router.post("/list", stockMovementController.list);
router.get(
  "/itemprocessdetails/:item_id",
  stockMovementController.itemWiseStockReport
);

module.exports = router;
