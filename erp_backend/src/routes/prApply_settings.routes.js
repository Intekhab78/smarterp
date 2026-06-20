const express = require("express");
const router = express.Router();
const controller = require("../controller/prApplySettings.controller");

router.post("/create", controller.saveOrUpdateSettings);
router.get("/list", controller.getAll);
router.get("/detail/:id", controller.getById);
router.put("/update/:id", controller.update);
router.delete("/delete/:id", controller.delete);

module.exports = router;
