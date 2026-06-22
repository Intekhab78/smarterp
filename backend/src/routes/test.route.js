const express = require("express");
const {
  generateBarcode,
  printLabel,
} = require("../controller/test.controller");
const router = new express.Router();

router.get("/:code", generateBarcode);
router.post("/", printLabel);

module.exports = router;
