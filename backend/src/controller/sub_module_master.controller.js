// const { sub_module_master } = require("../models"); // Import the module_master model
const { sub_module_master, module_master } = require("../models");

// Controller for creating a new record
exports.create = async (req, res) => {
  const {
    module_id,
    sub_module_name,
    sub_module_id,
    sub_module_description,
    note1,
    note2,
    created_by,
    updated_by,
    sorting_order,
    status,
    created_at,
  } = req.body;

  try {
    // Create a new record in the database
    const newSubModule = await sub_module_master.create({
      module_id,
      sub_module_name,
      sub_module_id,
      sub_module_description,
      note1,
      note2,
      created_by,
      updated_by,
      sorting_order,
      status,
      created_at: created_at || new Date(), // Use current date if not provided
    });

    // Return success response
    res.status(201).json({
      message: "Sub-module created successfully!",
      data: newSubModule,
    });
  } catch (error) {
    console.error("Error creating sub-module: ", error);
    res.status(500).json({
      message: "An error occurred while creating the sub-module.",
      error: error.message,
    });
  }
};

// Controller for fetching all records
exports.getAll = async (req, res) => {
  try {
    const modules = await sub_module_master.findAll({
      where: { deleted_at: null },
      include: [
        {
          model: module_master,
          as: "module",
          attributes: ["module_name"], // Select only the module_name attribute
        },
      ],
    });

    res.status(200).json({
      message: "Modules fetched successfully!",
      data: modules,
    });
  } catch (error) {
    console.error("Error fetching modules: ", error);
    res.status(500).json({
      message: "An error occurred while fetching the modules.",
      error: error.message,
    });
  }
};

// Controller for fetching a single record by ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const module = await sub_module_master.findOne({
      where: { module_id: id, deleted_at: null },
    });

    if (!module) {
      return res.status(404).json({
        message: "Module not found.",
      });
    }

    res.status(200).json({
      message: "Module fetched successfully!",
      data: module,
    });
  } catch (error) {
    console.error("Error fetching module: ", error);
    res.status(500).json({
      message: "An error occurred while fetching the module.",
      error: error.message,
    });
  }
};

// Controller for updating a record
exports.update = async (req, res) => {
  const { id } = req.params;
  const { sub_module_name, sub_module_description, updated_by, status } =
    req.body;

  try {
    const module = await sub_module_master.findOne({
      where: { sub_module_id: id, deleted_at: null },
    });

    if (!module) {
      return res.status(404).json({
        message: "Module not found.",
      });
    }

    // Update module fields
    await module.update({
      sub_module_name,
      sub_module_description,
      updated_by,
      status,
    });

    res.status(200).json({
      message: "Module updated successfully!",
      data: module,
    });
  } catch (error) {
    console.error("Error updating module: ", error);
    res.status(500).json({
      message: "An error occurred while updating the module.",
      error: error.message,
    });
  }
};

// Controller for soft deleting a record
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const module = await sub_module_master.findOne({
      where: { sub_module_id: id, deleted_at: null },
    });

    if (!module) {
      return res.status(404).json({
        message: "Module not found.",
      });
    }

    // Soft delete by setting deleted_at timestamp
    await module.destroy();

    res.status(200).json({
      message: "Module deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting module: ", error);
    res.status(500).json({
      message: "An error occurred while deleting the module.",
      error: error.message,
    });
  }
};
