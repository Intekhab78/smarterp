// module.exports = router;
const express = require("express");
const router = express.Router();
const personalController = require("../controller/personal.controller");

router.post("/create", personalController.createOrUpdatePersonal);
router.delete("/delete/:emp_id", personalController.deletePersonal); // ✅ NEW DELETE ROUTE

module.exports = router;
