const express = require("express");
const { send, getByCampaign } = require("../controller/email_send.controller");

const Auth = require("../middleware/Auth");

const router = new express.Router();

/**
 * SEND EMAIL ROUTE
 */
router.post("/send", send);
router.get("/list/:campaign_id", getByCampaign);

module.exports = router;
