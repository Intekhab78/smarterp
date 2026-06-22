const db = require("../models");
const EmailContact = db.email_contact;
const EmailCampaign = db.email_campaign;
const EmailLog = db.email_log;
const nodemailer = require("nodemailer");
const path = require("path");

/**
 * SEND BULK EMAIL
 */

exports.send = async (req, res) => {
  try {
    const { campaign_id, sender_email } = req.body;

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    if (!sender_email || !["sales", "support"].includes(sender_email)) {
      return res.status(400).json({
        success: false,
        message: "Valid sender_email is required (sales or support)",
      });
    }

    const campaign = await EmailCampaign.findByPk(campaign_id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Fetch only contacts assigned to this campaign and active
    const assignedContacts = await db.email_campaign_contact.findAll({
      where: { campaign_id, status: 1 },
      include: [
        {
          model: EmailContact,
          as: "contact", // alias defined in your model association
          attributes: ["email"],
        },
      ],
    });

    if (!assignedContacts.length) {
      return res.status(400).json({
        success: false,
        message: "No contacts assigned to this campaign",
      });
    }

    // Setup transporters
    const transporterSales = nodemailer.createTransport({
      host: "mail.jtsmiddleeast.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SALES_MAIL_USER,
        pass: process.env.SALES_MAIL_PASS,
      },
    });

    const transporterSupport = nodemailer.createTransport({
      host: "mail.jtsmiddleeast.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SUPPORT_MAIL_USER,
        pass: process.env.SUPPORT_MAIL_PASS,
      },
    });

    const transporter =
      sender_email === "sales" ? transporterSales : transporterSupport;
    const fromEmail =
      sender_email === "sales"
        ? process.env.SALES_MAIL_USER
        : process.env.SUPPORT_MAIL_USER;

    const attachmentPath = campaign.attachment
      ? path.join(
          __dirname,
          "../../public/uploads/Email_Campaign/",
          campaign.attachment
        )
      : null;

    // Send mail to each assigned contact
    for (const assigned of assignedContacts) {
      const email = assigned.contact.email;
      const email_contact_id = assigned.email_contact_id;

      try {
        await transporter.sendMail({
          from: `"JTS MiddleEast" <${fromEmail}>`,
          to: email,
          subject: campaign.subject,
          html: campaign.body,
          attachments: attachmentPath
            ? [{ filename: campaign.attachment, path: attachmentPath }]
            : [],
        });

        await EmailLog.create({
          email,
          email_contact_id,
          campaign_id,
          status: "sent",
        });
      } catch (error) {
        console.error(`Failed to send to ${email}:`, error);

        await EmailLog.create({
          email,
          email_contact_id,
          campaign_id,
          status: "failed",
        });
      }
    }

    res.json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.send1 = async (req, res) => {
  try {
    const { campaign_id, sender_email } = req.body;

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    if (!sender_email || !["sales", "support"].includes(sender_email)) {
      return res.status(400).json({
        success: false,
        message: "Valid sender_email is required (sales or support)",
      });
    }

    const campaign = await EmailCampaign.findByPk(campaign_id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const contacts = await EmailContact.findAll({
      where: { status: 1 },
      attributes: ["email"],
    });

    if (!contacts.length) {
      return res.status(400).json({
        success: false,
        message: "No active email contacts found",
      });
    }

    // Define transporters
    const transporterSales = nodemailer.createTransport({
      host: "mail.jtsmiddleeast.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SALES_MAIL_USER,
        pass: process.env.SALES_MAIL_PASS,
      },
    });

    const transporterSupport = nodemailer.createTransport({
      host: "mail.jtsmiddleeast.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SUPPORT_MAIL_USER,
        pass: process.env.SUPPORT_MAIL_PASS,
      },
    });

    // Choose transporter based on sender_email
    const transporter =
      sender_email === "sales" ? transporterSales : transporterSupport;

    const fromEmail =
      sender_email === "sales"
        ? process.env.SALES_MAIL_USER
        : process.env.SUPPORT_MAIL_USER;

    for (const item of contacts) {
      try {
        const attachmentPath = campaign.attachment
          ? path.join(
              __dirname,
              "../../public/uploads/Email_Campaign/",
              campaign.attachment
            )
          : null;

        console.log(
          `Sending email to ${item.email} with attachment:`,
          attachmentPath
        );

        await transporter.sendMail({
          from: `"JTS MiddleEast" <${fromEmail}>`,
          to: item.email,
          subject: campaign.subject,
          html: campaign.body,
          attachments: attachmentPath
            ? [
                {
                  filename: campaign.attachment,
                  path: attachmentPath,
                },
              ]
            : [],
        });

        await EmailLog.create({
          email: item.email,
          campaign_id,
          status: "sent",
        });
      } catch (error) {
        console.error(`Failed to send to ${item.email}:`, error);

        await EmailLog.create({
          email: item.email,
          campaign_id,
          status: "failed",
        });
      }
    }

    res.json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.send2 = async (req, res) => {
  try {
    const { campaign_id } = req.body;

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    const campaign = await EmailCampaign.findByPk(campaign_id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const contacts = await EmailContact.findAll({
      where: { status: 1 },
      attributes: ["email"],
    });

    if (!contacts.length) {
      return res.status(400).json({
        success: false,
        message: "No active email contacts found",
      });
    }

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS,
    //   },
    // });

    // const transporter = nodemailer.createTransport({
    //   host: "mail.jtsmiddleeast.com", // your cPanel mail server
    //   port: 465, // SSL port, or 587 for TLS
    //   secure: true, // true for 465, false for 587
    //   auth: {
    //     user: process.env.MAIL_USER, // e.g. ashish@jtsmiddleeast.com
    //     pass: process.env.MAIL_PASS, // your email password (not app password)
    //   },
    // });

    const transporterSales = nodemailer.createTransport({
      host: "mail.jtsmiddleeast.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SALES_MAIL_USER,
        pass: process.env.SALES_MAIL_PASS,
      },
    });

    const transporterSupport = nodemailer.createTransport({
      host: "mail.jtsmiddleeast.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SUPPORT_MAIL_USER,
        pass: process.env.SUPPORT_MAIL_PASS,
      },
    });

    for (const item of contacts) {
      try {
        const attachmentPath = campaign.attachment
          ? path.join(
              __dirname,
              "../../public/uploads/Email_Campaign/",
              campaign.attachment
            )
          : null;

        console.log(
          `Sending email to ${item.email} with attachment:`,
          attachmentPath
        );

        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: item.email,
          subject: campaign.subject,
          html: campaign.body,
          attachments: attachmentPath
            ? [
                {
                  filename: campaign.attachment,
                  path: attachmentPath,
                },
              ]
            : [],
        });

        await EmailLog.create({
          email: item.email,
          campaign_id,
          status: "sent",
        });
      } catch (error) {
        console.error(`Failed to send to ${item.email}:`, error);

        await EmailLog.create({
          email: item.email,
          campaign_id,
          status: "failed",
        });
      }
    }

    res.json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getByCampaign = async (req, res) => {
  try {
    const { campaign_id } = req.params;

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    const logs = await EmailLog.findAll({
      where: { campaign_id },
      order: [["sent_at", "DESC"]],
      include: [
        {
          model: db.email_campaign,
          as: "campaign",
          attributes: ["id", "subject"],
          include: [
            {
              model: db.email_category,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getByCampaign1 = async (req, res) => {
  try {
    const { campaign_id } = req.params;

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    const logs = await EmailLog.findAll({
      where: { campaign_id },
      order: [["sent_at", "DESC"]],
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
