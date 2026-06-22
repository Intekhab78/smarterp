const {
  function_master,
  function_action_master_map,
  module_master,
  sub_module_master,
} = require("../models/");

exports.create = async (req, res) => {
  const {
    module_id,
    sub_module_id,
    function_master_name,
    function_master_description,
    note1,
    note2,
    status,
    sorting_order,
    created_at,
    date1,
    date2,
    created_by,
    updated_by,
    actions, // Array of action IDs to associate with the function
  } = req.body;

  try {
    // Create a new function_master record
    const newFunctionMaster = await function_master.create({
      module_id,
      sub_module_id,
      function_master_name,
      function_master_description,
      note1,
      note2,
      status,
      sorting_order,
      created_at,
      date1,
      date2,
      created_by,
      updated_by,
    });

    // Create entries in the function_action_master_map table
    if (actions && actions.length > 0) {
      console.log(actions);
      const actionEntries = actions.map((action_id) => ({
        function_master_id: newFunctionMaster.function_master_id,
        action_id,
      }));

      await function_action_master_map.bulkCreate(actionEntries);
    }

    res.status(201).json({
      message: "Function and actions created successfully!",
      data: newFunctionMaster,
    });
  } catch (error) {
    console.error("Error creating function and actions: ", error);
    res.status(500).json({
      message: "An error occurred while creating the function and actions.",
      error: error.message,
    });
  }
};

// Controller for fetching all records
exports.getAll = async (req, res) => {
  try {
    const modules = await function_master.findAll({
      where: { deleted_at: null },
      include: [
        {
          model: module_master,
          as: "module",
          attributes: ["module_name"], // Select only the module_name attribute
        },
        {
          model: sub_module_master,
          as: "sub_module",
          attributes: ["sub_module_name"],
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
    const module = await function_master.findOne({
      where: { function_master_id: id, deleted_at: null },
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
  const {
    function_master_name,
    function_master_description,
    note1,
    note2,
    updated_by,
    status,
  } = req.body;

  try {
    const module = await function_master.findOne({
      where: { function_master_id: id, deleted_at: null },
    });

    if (!module) {
      return res.status(404).json({
        message: "Module not found.",
      });
    }

    // Update module fields
    await module.update({
      function_master_name,
      function_master_description,
      updated_by,
      note1,
      note2,
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
    const module = await function_master.findOne({
      where: { function_master_id: id, deleted_at: null },
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
