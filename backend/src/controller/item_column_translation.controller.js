const { item_column_translation } = require("../models");
exports.create = async (req, res) => {
  try {
    const {
      department_id,
      field_name,
      display_label,
      sorting_order,
      status,
      user_id,
    } = req.body;

    const data = await item_column_translation.create({
      department_id,
      field_name,
      display_label,
      sorting_order: sorting_order || 1,
      status: status || 1,
      created_by: user_id,
      updated_by: user_id,
    });

    return res.status(201).json({
      message: "Translation created successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.bulkUpsert = async (req, res) => {
  try {
    const { department_id, fields, user_id } = req.body;

    if (!department_id || !Array.isArray(fields)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const payload = fields.map((field) => ({
      department_id,
      field_name: field.field_name,
      display_label: field.display_label,
      sorting_order: field.sorting_order || 1,
      status: field.status || 1,
      created_by: user_id,
      updated_by: user_id,
    }));

    await item_column_translation.bulkCreate(payload, {
      updateOnDuplicate: [
        "display_label",
        "sorting_order",
        "status",
        "updated_by",
        "updated_at",
      ],
    });

    return res.status(200).json({
      message: "Bulk operation successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, department_id } = req.query;

    const offset = (page - 1) * limit;

    const where = {};
    if (department_id) where.department_id = department_id;

    const { count, rows } = await item_column_translation.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["sorting_order", "ASC"]],
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await item_column_translation.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getByDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;

    const data = await item_column_translation.findAll({
      where: {
        department_id,
        status: 1,
      },
      order: [["sorting_order", "ASC"]],
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_label, sorting_order, status, user_id } = req.body;

    const record = await item_column_translation.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: "Not found" });
    }

    await record.update({
      display_label,
      sorting_order,
      status,
      updated_by: user_id,
    });

    return res.status(200).json({
      message: "Updated successfully",
      record,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await item_column_translation.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: "Not found" });
    }

    await record.destroy();

    return res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
