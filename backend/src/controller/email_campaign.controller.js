const db = require("../models");
const EmailCampaign = db.email_campaign;

/**
 * CREATE EMAIL CAMPAIGN
 */
exports.create = async (req, res) => {
  try {
    const { subject, body, category_id, status } = req.body;

    if (!subject || !body) {
      return res.status(400).json({
        success: false,
        message: "Subject and body are required",
      });
    }

    const attachment = req.file ? req.file.filename : null;

    const campaign = await EmailCampaign.create({
      subject,
      body,
      category_id,
      attachment,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Email campaign created successfully",
      data: campaign,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET ALL EMAIL CAMPAIGNS
 */

exports.getAll = async (req, res) => {
  try {
    const campaigns = await EmailCampaign.findAll({
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: campaigns,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * UPDATE EMAIL CAMPAIGN BY ID
 */
exports.update = async (req, res) => {
  console.log("rebidy is ------------", req.body);

  try {
    const { id } = req.params;
    const { subject, body, status } = req.body;

    if (!subject || !body) {
      return res.status(400).json({
        success: false,
        message: "Subject and body are required",
      });
    }

    const campaign = await EmailCampaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Email campaign not found",
      });
    }

    // Update fields
    campaign.subject = subject;
    campaign.body = body;
    if (status !== undefined) campaign.status = status;

    // Update attachment if new file uploaded
    if (req.file) {
      campaign.attachment = req.file.filename;
    }

    await campaign.save();

    res.json({
      success: true,
      message: "Email campaign updated successfully",
      data: campaign,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
