const express = require("express");
const router = express.Router();

const {
  getCompanyLevelStockList,
} = require("../controller/companyLevelStock.controller");

// GET /company-level-stock
// Example: /company-level-stock?company_id=1
router.get("/list", getCompanyLevelStockList);

module.exports = router;
