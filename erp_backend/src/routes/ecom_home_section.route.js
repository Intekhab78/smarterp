const express = require("express");
const router = express.Router();
const controller = require("../controller/ecom_home_section.controller");

router.post("/create", controller.create);
router.get("/list", controller.list);
router.put("/update/:id", controller.update);
router.put("/status/:id", controller.updateStatus);

module.exports = router;
