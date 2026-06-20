const { function_action_master_map, sequelize } = require("../models");

exports.getFunctionActionMasterMaps = async (req, res) => {
  try {
    const functionActionMaps = await function_action_master_map.findAll({
      include: [
        {
          model: sequelize.models.function_master, // Referring to the function_master model
          as: "function_master", // Alias defined in the model's association
          attributes: ["function_master_id", "function_master_name"],
        },
        {
          model: sequelize.models.action_master, // Referring to the action_master model
          as: "action_master", // Alias defined in the model's association
          attributes: ["action_id", "action_name"],
        },
      ],
      //logging: console.log,  // Add logging to print SQL queries for debugging
    });

    if (functionActionMaps.length === 0) {
      return res.status(404).json({ message: "No function-action mappings found." });
    }

    res.status(200).json({
      status: "success",
      data: functionActionMaps,
    });
  } catch (error) {
    console.error("Error fetching function-action mappings:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch function-action mappings.",
      error: error.message,
    });
  }
};
