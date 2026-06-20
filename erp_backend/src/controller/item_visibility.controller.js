"use strict";

const db = require("../models");
const ItemVisibilityRule = db.item_visibility_rules;

/**
 * ✅ Create or Update Item Visibility Rules
 * (Same behaviour as createOrUpdateContract)
 */
exports.createOrUpdateItemVisibilityRules = async (req, res) => {
  try {
    const { organisation_id, company_id, location_id, rules } = req.body;

    // 🔹 Validation
    if (!organisation_id || !company_id || !location_id) {
      return res.status(400).json({
        message: "Organisation, Company and Location are required",
      });
    }

    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({
        message: "Rules array is required",
      });
    }

    // 🔹 Remove existing rules for same scope
    await ItemVisibilityRule.destroy({
      where: {
        organisation_id,
        company_id,
        location_id,
      },
    });

    // 🔹 Prepare payload
    const payload = rules.map((rule) => ({
      organisation_id,
      company_id,
      location_id,
      field_name: rule.field_name,
      allow_null: rule.allow_null,
      status: rule.status ?? true,
    }));

    // 🔹 Insert new rules
    const savedRules = await ItemVisibilityRule.bulkCreate(payload);

    return res.status(200).json({
      message: "Item visibility rules saved successfully",
      data: savedRules,
    });
  } catch (error) {
    console.error("Error saving item visibility rules:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ✅ Get Item Visibility Rules (for listing / edit UI)
 */
exports.getItemVisibilityRules = async (req, res) => {
  try {
    const { organisation_id, company_id, location_id } = req.query;

    const where = {};
    if (organisation_id) where.organisation_id = organisation_id;
    if (company_id) where.company_id = company_id;
    if (location_id) where.location_id = location_id;

    const rules = await ItemVisibilityRule.findAll({
      where,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      message: "Item visibility rules fetched successfully",
      data: rules,
    });
  } catch (error) {
    console.error("Error fetching item visibility rules:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ✅ Get Item Visibility Rules by Scope (for edit page)
 */
exports.getItemVisibilityRulesByScope = async (req, res) => {
  try {
    const { organisation_id, company_id, location_id } = req.params;

    const rules = await ItemVisibilityRule.findAll({
      where: {
        organisation_id,
        company_id,
        location_id,
      },
      order: [["id", "ASC"]],
    });

    if (!rules.length) {
      return res.status(404).json({
        message: "No visibility rules found for this scope",
      });
    }

    res.status(200).json(rules);
  } catch (error) {
    console.error("Error fetching visibility rules by scope:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ✅ Delete Visibility Rules by Scope
 */
exports.deleteItemVisibilityRules = async (req, res) => {
  try {
    const { organisation_id, company_id, location_id } = req.params;

    const deleted = await ItemVisibilityRule.destroy({
      where: {
        organisation_id,
        company_id,
        location_id,
      },
    });

    if (!deleted) {
      return res.status(404).json({
        message: "No visibility rules found to delete",
      });
    }

    res.status(200).json({
      message: "Item visibility rules deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item visibility rules:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
