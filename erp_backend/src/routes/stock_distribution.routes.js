const express = require("express");
const router = express.Router();
const {
  storeDistribution,
} = require("../controller/stock_distribution.controller");

// 🔒 Add auth middleware if needed
router.post("/store", storeDistribution);

module.exports = router;
