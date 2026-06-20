const { Op } = require("sequelize");
const db = require("../models");
const ItemVisibilityRule = db.item_visibility_rules;

async function getVisibilityRules({
  organisation_id,
  company_id,
  location_id,
}) {
  // Normalize undefined to null explicitly:
  const c_id = company_id !== undefined ? company_id : null;
  const l_id = location_id !== undefined ? location_id : null;

  return await ItemVisibilityRule.findAll({
    where: {
      status: true,
      [Op.or]: [
        { company_id: c_id, location_id: l_id },
        { company_id: c_id, location_id: null },
        { company_id: null, location_id: null },
      ],
    },
  });
}

function buildRuleMap(rules) {
  const map = {};

  for (const rule of rules) {
    const key = `${rule.company_id || "ALL"}_${rule.location_id || "ALL"}_${
      rule.field_name
    }`;
    map[key] = rule.allow_null;
  }

  return map;
}

function isItemAllowed(item, ruleMap) {
  const fields = [
    { name: "brand_id", value: item.brand_id },
    { name: "images", value: item.images?.length ? "HAS" : null },
  ];

  for (const field of fields) {
    const keys = [
      `${item.company_id}_${item.location_id}_${field.name}`,
      `${item.company_id}_ALL_${field.name}`,
      `ALL_ALL_${field.name}`,
    ];

    let allowNull = true;

    for (const key of keys) {
      if (key in ruleMap) {
        allowNull = ruleMap[key];
        break;
      }
    }

    if (!allowNull && field.value == null) {
      return false;
    }
  }

  return true;
}

module.exports = {
  getVisibilityRules,
  buildRuleMap,
  isItemAllowed,
};
