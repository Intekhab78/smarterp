const { FilterCompItemSetting } = require("../models");

exports.saveSettings = async (req, res) => {
  try {
    const { settings, created_by } = req.body;

    if (!settings || !Array.isArray(settings)) {
      return res.status(400).json({
        status: false,
        message: "Settings must be an array.",
      });
    }

    // Delete old settings (optional: delete only settings of that user)
    await FilterCompItemSetting.destroy({ where: {} });

    // Insert new settings
    const formattedSettings = settings.map((s) => ({
      main_company_id: s.main_company_id,
      sub_company_id: s.sub_company_id || null,
      location_id: s.location_id || null,
      created_by: created_by || "system",
    }));

    await FilterCompItemSetting.bulkCreate(formattedSettings);

    return res.json({
      status: true,
      message: "Settings saved successfully.",
    });
  } catch (error) {
    console.error("Save Settings Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await FilterCompItemSetting.findAll({
      order: [["id", "ASC"]],
    });

    return res.json({
      status: true,
      message: "Settings fetched successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Fetch Settings Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FilterCompItemSetting.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Setting not found.",
      });
    }

    return res.json({
      status: true,
      message: "Setting deleted.",
    });
  } catch (error) {
    console.error("Delete Setting Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};
