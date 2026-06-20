const express = require("express");
const router = express.Router();
const controller = require("../controller/collectionDetails.controller");

router.get("/list", controller.list); // GET endpoint for collection details

module.exports = router;
