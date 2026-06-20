const db = require("../models");
const CurrencyMaster = db.currency_denomination_master;

exports.createCurrencyMaster = async (req, res) => {
  try {
    const body = req.body;

    // Check if the country already exists
    const existingCountry = await CurrencyMaster.findOne({
      where: { currency_country: body.currency_country },
    });

    if (existingCountry) {
      return res.status(400).json({
        status: false,
        message: `Currency for '${body.currency_country}' already exists.`,
      });
    }

    // Prepare cleaned payload
    const cleanedPayload = {
      currency_country: body.currency_country,
      currency: body.currency,
      denomination_2000: body.Denomination_2000 ? 1 : 0,
      denomination_1000: body.Denomination_1000 ? 1 : 0,
      denomination_500: body.Denomination_500 ? 1 : 0,
      denomination_200: body.Denomination_200 ? 1 : 0,
      denomination_100: body.Denomination_100 ? 1 : 0,
      denomination_50: body.Denomination_50 ? 1 : 0,
      denomination_20: body.Denomination_20 ? 1 : 0,
      denomination_10: body.Denomination_10 ? 1 : 0,
      denomination_5: body.Denomination_5 ? 1 : 0,
      denomination_2: body.Denomination_2 ? 1 : 0,
      denomination_1: body.Denomination_1 ? 1 : 0,
      denomination_0_5: body.Fills_05 ? 1 : 0,
      denomination_0_25: body.Fills_025 ? 1 : 0,
    };

    // Create new currency entry
    const newEntry = await CurrencyMaster.create(cleanedPayload);

    res.status(201).json({
      status: true,
      message: "Currency denomination master created",
      data: newEntry,
    });
  } catch (err) {
    console.error("Error creating currency master:", err);
    res.status(500).json({
      status: false,
      message: "Failed to create entry",
    });
  }
};

exports.getAllCurrencyMasters = async (req, res) => {
  try {
    const allData = await CurrencyMaster.findAll();
    res.json({ status: true, data: allData });
  } catch (err) {
    res.status(500).json({ status: false, message: "Fetch failed" });
  }
};

exports.getCurrencyMasterById = async (req, res) => {
  try {
    const data = await CurrencyMaster.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ status: false, message: "Not found" });
    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: "Fetch failed" });
  }
};

exports.updateCurrencyMaster = async (req, res) => {
  try {
    const updated = await CurrencyMaster.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ status: true, message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Update failed" });
  }
};

exports.deleteCurrencyMaster = async (req, res) => {
  try {
    await CurrencyMaster.destroy({ where: { id: req.params.id } });
    res.json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Delete failed" });
  }
};
