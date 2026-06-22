const { v4: uuidv4 } = require("uuid");
const { tax_settings } = require("../models"); // adjust path if needed

// CREATE new tax setting
exports.createTaxSetting = async (req, res) => {
  try {
    const {
      tax_name,
      status,
      company_id,
      location_id,
      organisation_id,
      is_tax_registered,
      trn_text,
      number,
      register_date,
      composition_scheme,
      international_trade,
      composition_scheme_percentage,
      digital_services,
    } = req.body;

    const newTaxSetting = await tax_settings.create({
      uuid: uuidv4(),
      tax_name,
      status,
      company_id,
      location_id,
      organisation_id,
      is_tax_registered,
      trn_text,
      number,
      register_date,
      composition_scheme,
      international_trade,
      composition_scheme_percentage,
      digital_services,
    });

    return res.status(201).json({
      success: true,
      message: "Tax setting created successfully",
      data: newTaxSetting,
    });
  } catch (error) {
    console.error("Error creating tax setting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tax setting",
      error: error.message,
    });
  }
};

// GET all tax settings
exports.getAllTaxSettings = async (req, res) => {
  try {
    const settings = await tax_settings.findAll({
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching tax settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tax settings",
      error: error.message,
    });
  }
};

// UPDATE tax setting
exports.updateTaxSetting = async (req, res) => {
  try {
    const { id } = req.params; // this is actually UUID
    const { tax_name } = req.body;

    console.log("req.body-----", req.body);

    const setting = await tax_settings.findOne({ where: { uuid: id } });
    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "Setting not found" });
    }

    setting.tax_name = tax_name;
    await setting.save();

    return res.json({
      success: true,
      message: "Tax setting updated",
      data: setting,
    });
  } catch (error) {
    console.error("Error updating tax setting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tax setting",
      error: error.message,
    });
  }
};

// UPDATE tax setting status
exports.updateTaxSettingStatus = async (req, res) => {
  try {
    const { tax_name } = req.body; // 'inclusive' or 'exclusive'

    if (!tax_name) {
      return res
        .status(400)
        .json({ success: false, message: "Tax type is required" });
    }

    // Set 1 for selected tax, 0 for the other
    const inclusiveStatus = tax_name === "inclusive" ? 1 : 0;
    const exclusiveStatus = tax_name === "exclusive" ? 1 : 0;

    // Update both records
    await tax_settings.update(
      { status: inclusiveStatus },
      { where: { tax_name: "inclusive" } }
    );

    await tax_settings.update(
      { status: exclusiveStatus },
      { where: { tax_name: "exclusive" } }
    );

    return res.json({
      success: true,
      message: `Tax status updated to ${tax_name}`,
    });
  } catch (error) {
    console.error("Error updating tax status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tax status",
      error: error.message,
    });
  }
};
