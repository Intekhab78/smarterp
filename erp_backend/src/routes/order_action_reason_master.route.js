const express = require("express");
const router = express.Router();
const controller = require("../controller/order_action_reason_master.controller");

router.post("/create", controller.create);
router.get("/list", controller.list);
router.put("/details/:id", controller.details);
router.put("/update/:id", controller.update);
router.put("/updateStatus/:id", controller.updateStatus);
router.delete("/delete/:id", controller.remove);

module.exports = router;
