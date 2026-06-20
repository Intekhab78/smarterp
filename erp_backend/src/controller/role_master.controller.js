const { role_master } = require("../models/"); // Import the module_master model

// Controller for creating a new record
exports.create = async (req, res) => {
  const { role_name, role_id, role_description, created_at } = req.body;

  try {
    // Create a new record in the database
    const newrole = await role_master.create({
      role_name,
      role_id,
      role_description,
      created_at,
    });

    // Return success response
    res.status(201).json({
      message: "Role created successfully!",
      data: newrole,
    });
  } catch (error) {
    console.error("Error creating role: ", error);
    res.status(500).json({
      message: "An error occurred while creating the role.",
      error: error.message,
    });
  }
};

// Controller for fetching all records
exports.getAll = async (req, res) => {
  try {
    const roles = await role_master.findAll({
      where: { deleted_at: null },
    });

    res.status(200).json({
      message: "roles fetched successfully!",
      data: roles,
    });
  } catch (error) {
    console.error("Error fetching roles: ", error);
    res.status(500).json({
      message: "An error occurred while fetching the roles.",
      error: error.message,
    });
  }
};

// Controller for fetching a single record by ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await role_master.findOne({
      where: { role_id: id, deleted_at: null },
    });

    if (!role) {
      return res.status(404).json({
        message: "role not found.",
      });
    }

    res.status(200).json({
      message: "Module fetched successfully!",
      data: role,
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
  const { role_name, role_description, updated_by, status } = req.body;

  try {
    const module = await role_master.findOne({
      where: { role_id: id, deleted_at: null },
    });

    if (!module) {
      return res.status(404).json({
        message: "Module not found.",
      });
    }

    // Update module fields
    await module.update({
      role_name,
      role_description,
    });

    res.status(200).json({
      message: "Role updated successfully!",
      data: module,
    });
  } catch (error) {
    console.error("Error updating module: ", error);
    res.status(500).json({
      message: "An error occurred while updating the Role Master.",
      error: error.message,
    });
  }
};

// Controller for soft deleting a record
exports.delete = async (req, res) => {
  const { id } = req.params;
  console.log("id is ", req.params);

  try {
    const role = await role_master.findOne({
      where: { role_id: id, deleted_at: null },
    });

    if (!role) {
      return res.status(404).json({
        message: "role not found.",
      });
    }

    // Soft delete by setting deleted_at timestamp
    await role.destroy();

    res.status(200).json({
      message: "role deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting role: ", error);
    res.status(500).json({
      message: "An error occurred while deleting the role.",
      error: error.message,
    });
  }
};
