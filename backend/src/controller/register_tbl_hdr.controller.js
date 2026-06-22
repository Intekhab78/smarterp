const db = require("../models");
const RegisterHdr = db.register_tbl_hdr;
const RegisterDetails = db.register_tbl_details;
const RegisterSetting = db.register_settings;

exports.createRegisterFloat = async (req, res) => {
  try {
    const { cashier, currency, denominations, total } = req.body;

    if (!cashier || !currency || !denominations || total == null) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    // Step 1: Create header entry
    const headerData = {
      currency: currency,
      date: new Date(),
      time: new Date(),
      open_by: cashier.firstname,
      open_by_id: cashier.id,
      float_amount: total,
      status: "open",
      register_status: "active",
    };

    const hdr = await RegisterHdr.create(headerData);

    // Step 2: Prepare details data
    const detailsData = {
      register_id: hdr.id,
      currency_country: "India",
      currency: currency,
      total: total,
      denomination_2000: denominations[2000] || 0,
      denomination_1000: denominations[1000] || 0,
      denomination_500: denominations[500] || 0,
      denomination_200: denominations[200] || 0,
      denomination_100: denominations[100] || 0,
      denomination_50: denominations[50] || 0,
      denomination_20: denominations[20] || 0,
      denomination_10: denominations[10] || 0,
      denomination_5: denominations[5] || 0,
      denomination_2: denominations[2] || 0,
      denomination_1: denominations[1] || 0,
      denomination_0_5: denominations[0.5] || 0,
      denomination_0_25: denominations[0.25] || 0,
      status: "open",
    };

    await RegisterDetails.create(detailsData);

    res.status(201).json({
      status: true,
      message: "Cash float saved successfully",
      data: {
        hdr_id: hdr.uuid,
        float_amount: total,
      },
    });
  } catch (err) {
    console.error("Error saving float:", err);
    res.status(500).json({
      status: false,
      message: "Failed to save float",
      error: err.message,
    });
  }
};

exports.listRegisterFloat = async (req, res) => {
  try {
    const data = await RegisterHdr.findAll({
      include: [
        {
          model: RegisterDetails,
          as: "details", // make sure this alias matches your model
        },
      ],
      order: [["created_at", "DESC"]], // ✅ match DB column name
    });

    res.status(200).json({
      status: true,
      message: "Float list fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching float list:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch float list",
      error: error.message,
    });
  }
};

exports.closeRegisterFloat = async (req, res) => {
  try {
    const {
      register_id,
      cashier,
      denominations,
      total,
      currency,
      currency_country,
      over_short,
      reason,
    } = req.body;

    console.log("re.body from the close hit ", req.body);

    const hdr = await RegisterHdr.findOne({ where: { id: register_id } });

    if (!hdr) {
      return res.status(404).json({
        status: false,
        message: "Cash float not found",
      });
    }

    const currentDate = new Date();

    // Step 1: Update HDR table
    await hdr.update({
      status: "close",
      close_by: cashier.id,
      close_date: currentDate,
      close_time: currentDate,
      over_short: over_short || 0,
      reason: reason || "",
    });

    // Step 2: Update or insert register_tbl_details
    const details = await RegisterDetails.findOne({
      where: { register_id },
    });

    if (details) {
      await details.update({
        ...denominations,
        total,
        currency,
        currency_country,
        status: "close",
        over_short: over_short || 0,
        reason: reason || "",
      });
    } else {
      await RegisterDetails.create({
        register_tbl_hdr_id: register_id,
        ...denominations,
        total,
        currency,
        currency_country,
        status: "close",
        over_short: over_short || 0,
        reason: reason || "",
      });
    }

    res.status(200).json({
      status: true,
      message: "Cash float closed and details updated successfully",
      data: {
        status: "close",
        close_by: cashier.firstname,
        close_date: currentDate.toISOString().split("T")[0],
        close_time: currentDate.toTimeString().split(" ")[0],
      },
    });
  } catch (err) {
    console.error("Error closing float:", err);
    res.status(500).json({
      status: false,
      message: "Failed to close float",
      error: err.message,
    });
  }
};

exports.getRegisterFloatById = async (req, res) => {
  try {
    const { id } = req.params;

    const hdr = await RegisterHdr.findOne({ where: { id } });
    const details = await RegisterDetails.findOne({
      where: { register_id: id },
    });

    if (!hdr || !details) {
      return res.status(404).json({
        status: false,
        message: "Cash float not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Cash float fetched successfully",
      data: {
        hdr,
        details,
      },
    });
  } catch (err) {
    console.error("Error fetching float:", err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch float",
      error: err.message,
    });
  }
};

exports.updateRegisterFloat = async (req, res) => {
  try {
    const { id } = req.params;
    const { cashier, currency, denominations, total } = req.body;

    const hdr = await RegisterHdr.findOne({ where: { id } });
    const details = await RegisterDetails.findOne({
      where: { register_id: id },
    });

    if (!hdr || !details) {
      return res.status(404).json({
        status: false,
        message: "Cash float not found",
      });
    }

    // Update header
    await hdr.update({
      currency,
      open_by: cashier.firstname,
      open_by_id: cashier.id,
      float_amount: total,
    });

    // Update details
    await details.update({
      currency,
      total,
      denomination_2000: denominations[2000] || 0,
      denomination_1000: denominations[1000] || 0,
      denomination_500: denominations[500] || 0,
      denomination_200: denominations[200] || 0,
      denomination_100: denominations[100] || 0,
      denomination_50: denominations[50] || 0,
      denomination_20: denominations[20] || 0,
      denomination_10: denominations[10] || 0,
      denomination_5: denominations[5] || 0,
      denomination_2: denominations[2] || 0,
      denomination_1: denominations[1] || 0,
      denomination_0_5: denominations[0.5] || 0,
      denomination_0_25: denominations[0.25] || 0,
    });

    res.status(200).json({
      status: true,
      message: "Cash float updated successfully",
    });
  } catch (err) {
    console.error("Error updating float:", err);
    res.status(500).json({
      status: false,
      message: "Failed to update float",
      error: err.message,
    });
  }
};
exports.deleteRegisterFloat = async (req, res) => {
  try {
    const { id } = req.params;

    const hdr = await RegisterHdr.findOne({ where: { id } });

    if (!hdr) {
      return res.status(404).json({
        status: false,
        message: "Cash float not found",
      });
    }

    // Delete related details first
    await RegisterDetails.destroy({ where: { register_id: id } });

    // Then delete header
    await RegisterHdr.destroy({ where: { id } });

    res.status(200).json({
      status: true,
      message: "Cash float deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting float:", err);
    res.status(500).json({
      status: false,
      message: "Failed to delete float",
      error: err.message,
    });
  }
};

// for cashier and day wise setting
// Inside registerFloatController.js

exports.setRegisterSetting = async (req, res) => {
  try {
    const { mode } = req.body;

    if (!["daywise", "cashierwise"].includes(mode)) {
      return res.status(400).json({ status: false, message: "Invalid mode" });
    }

    // Set all previous settings to "close"
    await RegisterSetting.update({ status: "close" }, { where: {} });

    // Create new setting with status "open"
    const newSetting = await RegisterSetting.create({
      mode,
      status: "open",
    });

    res
      .status(200)
      .json({ status: true, message: "Setting updated", data: newSetting });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error saving setting",
      error: err.message,
    });
  }
};

exports.getRegisterSetting = async (req, res) => {
  try {
    const setting = await RegisterSetting.findOne({
      where: { status: "open" },
      order: [["id", "DESC"]],
    });

    if (!setting) {
      return res
        .status(404)
        .json({ status: false, message: "Setting not found" });
    }

    res.status(200).json({ status: true, mode: setting.mode });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching setting",
      error: err.message,
    });
  }
};
