const { department_mapping } = require("../models");

// Bulk save mappings (create/update)
exports.saveBulkMappings = async (req, res) => {
  const { company_id, location_id, website_key, department_ids } = req.body;

  if (
    !company_id ||
    !location_id ||
    !website_key ||
    !Array.isArray(department_ids)
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Delete existing mappings for this company/location/website
    await department_mapping.destroy({
      where: { company_id, location_id, website_key },
    });

    // Prepare new mappings
    const newMappings = department_ids.map((deptId) => ({
      company_id,
      location_id,
      website_key,
      department_id: deptId,
    }));

    // Bulk create new mappings
    await department_mapping.bulkCreate(newMappings);

    return res.status(200).json({ status: true, message: "Mappings saved" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get mappings for given company/location/website (unchanged)
exports.getMappings = async (req, res) => {
  const { company_id, location_id, website_key } = req.query;

  try {
    const mappings = await department_mapping.findAll({
      where: { company_id, location_id, website_key },
      include: [
        {
          model: require("../models").ItemDepartment,
          attributes: ["id", "itemdeptname"],
        },
      ],
    });

    return res.json({ status: true, data: mappings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create or Update mapping
exports.createOrUpdateMapping = async (req, res) => {
  const { company_id, location_id, website_key, department_id } = req.body;

  try {
    // Check if record exists
    let mapping = await department_mapping.findOne({
      where: { company_id, location_id, website_key, department_id },
    });

    if (mapping) {
      // Already exists, maybe update if needed
      return res
        .status(200)
        .json({ message: "Mapping already exists", data: mapping });
    } else {
      // Create new
      mapping = await department_mapping.create({
        company_id,
        location_id,
        website_key,
        department_id,
      });
      return res
        .status(201)
        .json({ message: "Mapping created", data: mapping });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get mappings for given company/location/website
exports.getMappings = async (req, res) => {
  const { company_id, location_id, website_key } = req.query;

  try {
    const mappings = await department_mapping.findAll({
      where: { company_id, location_id, website_key },
      include: [
        {
          model: require("../models").ItemDepartment,
          attributes: ["id", "itemdeptname"],
        },
      ],
    });

    return res.json({ status: true, data: mappings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
