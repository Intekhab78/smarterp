const { family_mapping } = require("../models");

// Bulk save mappings
exports.saveBulkMappings = async (req, res) => {
  const { company_id, location_id, website_key, family_ids } = req.body;

  if (
    !company_id ||
    !location_id ||
    !website_key ||
    !Array.isArray(family_ids)
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Remove old mappings
    await family_mapping.destroy({
      where: { company_id, location_id, website_key },
    });

    // Prepare new records
    const newMappings = family_ids.map((familyId) => ({
      company_id,
      location_id,
      website_key,
      family_id: familyId,
    }));

    await family_mapping.bulkCreate(newMappings);

    return res
      .status(200)
      .json({ status: true, message: "Family mappings saved" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create or Update single mapping
exports.createOrUpdateMapping = async (req, res) => {
  const { company_id, location_id, website_key, family_id } = req.body;

  try {
    let mapping = await family_mapping.findOne({
      where: { company_id, location_id, website_key, family_id },
    });

    if (mapping) {
      return res
        .status(200)
        .json({ message: "Mapping already exists", data: mapping });
    }

    mapping = await family_mapping.create({
      company_id,
      location_id,
      website_key,
      family_id,
    });

    return res.status(201).json({ message: "Mapping created", data: mapping });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get mappings
exports.getMappings = async (req, res) => {
  const { company_id, location_id, website_key } = req.query;

  try {
    const mappings = await family_mapping.findAll({
      where: { company_id, location_id, website_key },
      include: [
        {
          model: require("../models").item_family,
          attributes: ["id", "itemfamilyname"],
          as: "family",
        },
      ],
    });

    return res.json({ status: true, data: mappings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
