const { Op } = require("sequelize");
const db = require("../models");
const SystemSetting = db.system_setting;

// GET all settings for company + location
exports.getSettings = async (req, res) => {
  try {
    const { companyId, locationId } = req.params;

    const settings = await SystemSetting.findAll({
      where: { company_id: companyId, location_id: locationId },
    });

    const formatted = {};
    settings.forEach((row) => {
      formatted[row.setting_key] = row.setting_value;
    });

    return res.json({ success: true, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE OR UPDATE a setting
exports.updateSetting = async (req, res) => {
  try {
    const { companyId, locationId } = req.params;
    const { key, value } = req.body;

    await SystemSetting.upsert({
      company_id: companyId,
      location_id: locationId,
      setting_key: key,
      setting_value: value,
    });

    return res.json({
      success: true,
      message: "Setting saved successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// RESET all settings
exports.resetSettings = async (req, res) => {
  try {
    const { companyId, locationId } = req.params;

    await SystemSetting.destroy({
      where: { company_id: companyId, location_id: locationId },
    });

    return res.json({
      success: true,
      message: "Settings reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
