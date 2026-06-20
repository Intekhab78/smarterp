"use strict";

const db = require("../models");
const EcomHomeSection = db.ecom_home_section;
const { Op } = db.Sequelize;

/**
 * CREATE HOME SECTION
 */
exports.create = async (req, res) => {
  try {
    const {
      title,
      slug,
      section_type,
      limit_count,
      sort_order,
      company_id,
      location_id,
      website_ref,
      status,
      note1,
      note2,
      note3,
    } = req.body;

    if (!title || !section_type) {
      return res.status(400).json({
        success: false,
        message: "Title and section type are required",
      });
    }

    const data = await EcomHomeSection.create({
      title,
      slug,
      section_type,
      limit_count,
      sort_order,
      company_id,
      location_id,
      website_ref,
      status: status || "active",
      note1,
      note2,
      note3,
      addedby: req.user?.id || null,
    });

    return res.json({
      success: true,
      message: "Home section created successfully",
      data,
    });
  } catch (error) {
    console.error("Create Home Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * LIST HOME SECTIONS (ERP VIEW)
 */
exports.list = async (req, res) => {
  try {
    const { company_id, location_id, website_ref, status, search } = req.query;

    let where = {};

    if (company_id) where.company_id = company_id;
    if (location_id) where.location_id = location_id;
    if (website_ref) where.website_ref = website_ref;
    if (status) where.status = status;

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const data = await EcomHomeSection.findAll({
      where,
      order: [["sort_order", "ASC"]],
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("List Home Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * UPDATE HOME SECTION
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await EcomHomeSection.findByPk(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Home section not found",
      });
    }

    await section.update(req.body);

    return res.json({
      success: true,
      message: "Home section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Update Home Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * UPDATE STATUS (ENABLE / DISABLE)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const section = await EcomHomeSection.findByPk(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Home section not found",
      });
    }

    await section.update({ status });

    return res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
