const { action_master } = require("../models"); // Import the action_master model

// Controller to search for an action by name
exports.search = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Action name is required." });
  }

  try {
    const action = await action_master.findOne({
      where: { action_name: name,},
    });

    if (action) {
      res.status(200).json({ exists: true, action });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error searching for action:", error);
    res.status(500).json({
      message: "An error occurred while searching for the action.",
      error: error.message,
    });
  }
};

// Controller to create a new action
exports.create = async (req, res) => {
    const {
        action_name,
        created_at,
        updated_at,
        deleted_at,
      } = req.body;

  if (!action_name) {
    return res.status(400).json({ message: "Action name is required." });
  }

  try {
    // Create the new action
    const newAction = await action_master.create({
      action_name,
      created_at,
      updated_at,
      deleted_at,
      created_by: 1, // Example: replace with the actual user ID
      updated_by: 1, // Example: replace with the actual user ID
      status: 1, // Default status
      sorting_order: 1, // Default sorting order
    });

    res.status(201).json({
      message: "Action created successfully!",
      action: newAction,
    });
  } catch (error) {
    console.error("Error creating action:", error);
    res.status(500).json({
      message: "An error occurred while creating the action.",
      error: error.message,
    });
  }
};

// Controller to fetch all actions
exports.getAll = async (req, res) => {
  try {
    const actions = await action_master.findAll({
      where: { status: 1 },
    });

    res.status(200).json({
      message: "Actions fetched successfully!",
      data: actions,
    });
  } catch (error) {
    console.error("Error fetching actions:", error);
    res.status(500).json({
      message: "An error occurred while fetching the actions.",
      error: error.message,
    });
  }
};
