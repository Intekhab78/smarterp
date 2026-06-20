const db = require("../models");
const EmailContact = db.email_contact;

/**
 * BULK CREATE EMAIL CONTACTS
 */
exports.create = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Emails array is required",
      });
    }

    const data = emails.map((email) => ({
      email: email.trim(),
    }));

    await EmailContact.bulkCreate(data, {
      ignoreDuplicates: true,
    });

    res.status(201).json({
      success: true,
      message: "Emails stored successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET ALL EMAIL CONTACTS
 */
exports.getAll = async (req, res) => {
  try {
    const contacts = await EmailContact.findAll({
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
