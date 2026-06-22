const express = require("express");
const router = express.Router();
const currencyController = require("../controller/currencyDenominationMaster.controller"); // make sure this path is correct

router.post("/store", currencyController.createCurrencyMaster);
router.post("/list", currencyController.getAllCurrencyMasters);
router.post("/details/:id", currencyController.getCurrencyMasterById);
router.post("/update/:id", currencyController.updateCurrencyMaster);
router.post("/delete/:id", currencyController.deleteCurrencyMaster);

module.exports = router;
