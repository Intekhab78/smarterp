const express = require("express");
const payments = require("../controller/payments.controller");

const router = new express.Router();

router.post("/cancelled-refunded", payments.getCancelledAndRefundedPayments);

module.exports = router;
