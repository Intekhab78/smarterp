const express = require("express");
const items = require("../controller/invoice_log.controller");
const Auth = require("../middleware/Auth");
const router = new express.Router();

router.post("/insert", items.invoice_log_insert);

module.exports = router;
