const express = require("express");
const router = express.Router();
const paymentController = require("../controller/phonepe.controller");
const callbackController = require("../controller/phonepe.callback");
const customerAuth = require("../middleware/customerAuth");

// router.post("/pay", paymentController.createPayment);
// router.post("/callback", callbackController.phonepeCallback);
router.post("/generate-hash", paymentController.generatePaymentHash);
router.post("/payu-success", paymentController.payuSuccess);
router.get("/payu-success", paymentController.payuSuccess);
router.post("/payu-failure", paymentController.payuFailure);
router.get("/payu-failure", paymentController.payuFailure);
router.get(
  "/payu-details/:txnid",
  //   customerAuth,
  paymentController.getPayuPaymentDetails
);

module.exports = router;
