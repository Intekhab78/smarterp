// controllers/email_campaign_contact.controller.js

const db = require("../models");
const EmailCampaign = db.email_campaign;
const EmailContact = db.email_contact;

/**
 * Get contacts assigned to a specific campaign
 */
exports.getContactsByCampaign = async (req, res) => {
  try {
    const { campaign_id } = req.params;

    const campaign = await EmailCampaign.findByPk(campaign_id, {
      include: [
        {
          model: EmailContact,
          as: "contacts",
          attributes: ["id", "email"],
          through: { attributes: [] }, // exclude junction data
        },
      ],
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      data: campaign.contacts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update contacts assigned to a campaign (add/remove contacts)
 * Expects `contactIds` array in request body
 */
exports.updateContactsForCampaign = async (req, res) => {
  try {
    const { campaign_id } = req.params;
    const { contactIds } = req.body;

    if (!Array.isArray(contactIds)) {
      return res.status(400).json({
        success: false,
        message: "contactIds must be an array",
      });
    }

    const campaign = await EmailCampaign.findByPk(campaign_id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Update many-to-many relationship
    await campaign.setContacts(contactIds);

    res.json({
      success: true,
      message: "Contacts updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
