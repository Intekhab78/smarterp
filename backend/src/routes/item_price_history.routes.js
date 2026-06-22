const express = require("express");
const router = express.Router();
const {
  createItemPriceHistory,
} = require("../controller/item_price_history.controller");

// Route to save item price history
router.post("/save", createItemPriceHistory);

module.exports = router;
