const express = require("express");
const router = express.Router();
const queueController = require("../controller/queue.controller");

router.get("/list", queueController.getQueueList);
router.post("/update", queueController.updateQueueStatus);
router.post("/cashier-update", queueController.cashierUpdateStatus);
router.get("/by-order", queueController.getByOrderNo);

module.exports = router;
