// routes/email_campaign_contact.routes.js

const express = require("express");
const router = express.Router();
const controller = require("../controller/email_campaign_contact.controller");

// Get contacts assigned to campaign
router.get("/list/:campaign_id", controller.getContactsByCampaign);

// Update contacts assigned to campaign
router.post("/update/:campaign_id", controller.updateContactsForCampaign);

module.exports = router;
