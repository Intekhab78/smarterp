const express = require("express");
const router = express.Router();
const controller = require("../controller/order_action_reason_mapping.controller");

router.post("/create", controller.create);
router.get("/list", controller.list);
router.get("/findAll", controller.findAll);
router.get("/details/:id", controller.details);
router.put("/update/:id", controller.update);
router.put("/status/:id", controller.updateStatus);
router.delete("/delete/:id", controller.remove);

module.exports = router;
