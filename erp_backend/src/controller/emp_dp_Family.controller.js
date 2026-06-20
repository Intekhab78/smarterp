// controllers/empFamilyController.js
const { emp_dpt_family } = require("../models");

// Create Employee Family
exports.createFamily = async (req, res) => {
  try {
    const {
      familyCode,
      familyName,
      description,
      department,
      note1,
      note2,
      note3,
      date1,
      date2,
      addedBy,
      company,
      location,
      status,
    } = req.body;

    // Map frontend fields → DB fields
    const newFamily = await emp_dpt_family.create({
      emp_dpt_famcode: familyCode,
      emp_dpt_famname: familyName,
      emp_dpt_famlong: description,
      emp_dpt_fdeptname: department,
      note1,
      note2,
      note3,
      amdt1: date1,
      amdt2: date2,
      addedby: addedBy,
      company_id: company === "JTS" ? 1 : 2, // 🔹 adjust logic for company mapping
      location_id: location === "Dubai" ? 1 : 2, // 🔹 adjust logic for location mapping
      status: status === "Active" ? 1 : 0,
    });

    return res.status(201).json({
      message: "Family record created successfully",
      data: newFamily,
    });
    
  } catch (error) {
    console.error("Error creating family:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get All Employee Families
exports.getAllFamilies = async (req, res) => {
  try {
    const families = await emp_dpt_family.findAll();
    return res.status(200).json(families);
  } catch (error) {
    console.error("Error fetching families:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Single Family by ID
exports.getFamilyById = async (req, res) => {
  try {
    const family = await emp_dpt_family.findByPk(req.params.id);
    if (!family) return res.status(404).json({ message: "Family not found" });
    return res.status(200).json(family);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Family
exports.updateFamily = async (req, res) => {
  try {
    const family = await emp_dpt_family.findByPk(req.params.id);
    if (!family) return res.status(404).json({ message: "Family not found" });

    await family.update(req.body);
    return res.status(200).json({ message: "Family updated", data: family });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Family (soft delete because of paranoid:true)
exports.deleteFamily = async (req, res) => {
  try {
    const family = await emp_dpt_family.findByPk(req.params.id);
    if (!family) return res.status(404).json({ message: "Family not found" });

    await family.destroy();
    return res.status(200).json({ message: "Family deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
