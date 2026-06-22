const { grn_setting } = require("../models");

// Create or Update setting
exports.createSetting = async (req, res) => {
  try {
    const { Is_auto_gen_batch_no, company_id, location_id } = req.body;

    // Check if setting already exists for company + location
    let setting = await grn_setting.findOne({
      where: { company_id, location_id },
    });

    if (setting) {
      // ✅ Update existing
      await setting.update({ Is_auto_gen_batch_no });
      return res.status(200).json({
        success: true,
        message: "Setting updated successfully",
        data: setting,
      });
    } else {
      // ✅ Create new
      setting = await grn_setting.create({
        Is_auto_gen_batch_no,
        company_id,
        location_id,
      });
      return res.status(201).json({
        success: true,
        message: "Setting created successfully",
        data: setting,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all settings
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await grn_setting.findAll();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single setting by ID
exports.getSettingById = async (req, res) => {
  try {
    const setting = await grn_setting.findByPk(req.params.id);
    if (!setting) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update setting
exports.updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { Is_auto_gen_batch_no, company_id, location_id } = req.body;

    const setting = await grn_setting.findByPk(id);
    if (!setting) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    await setting.update({ Is_auto_gen_batch_no, company_id, location_id });
    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete setting
exports.deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const setting = await grn_setting.findByPk(id);

    if (!setting) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    await setting.destroy();
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
