const express = require("express");
const router = express.Router();
const ctrl = require("../controller/shippingAddress.controller");

router.post("/create", ctrl.createAddress);
router.get("/list/:customer_id", ctrl.listAddresses);
router.get("/details/:id", ctrl.addressDetails);
router.post("/update/:id", ctrl.updateAddress);
router.delete("/delete/:id", ctrl.deleteAddress);

module.exports = router;
