// controllers/empSubFamilyController.js
const { emp_sub_family } = require("../models");

// Create Sub Family
exports.createSubFamily = async (req, res) => {
  try {
    const {
      subFamilyCode,
      familyMaster,
      subFamilyName,
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

    const newSubFamily = await emp_sub_family.create({
      emp_sub_famcode: subFamilyCode,
      emp_sub_famname: subFamilyName,
      emp_sub_famlong: description,
      emp_sub_fdeptname: department,
      note1,
      note2,
      note3,
      amdt1: date1,
      amdt2: date2,
      addedby: addedBy,
      company_id: company === "JTS" ? 1 : 2, // 🔹 adjust mapping logic
      location_id: location === "Dubai" ? 1 : 2, // 🔹 adjust mapping logic
      status: status === "Active" ? 1 : 0,
    });

    return res.status(201).json({
      message: "Sub Family created successfully",
      data: newSubFamily,
    });
  } catch (error) {
    console.error("Error creating sub family:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get All Sub Families
exports.getAllSubFamilies = async (req, res) => {
  try {
    const subFamilies = await emp_sub_family.findAll();
    return res.status(200).json(subFamilies);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Sub Family by ID
exports.getSubFamilyById = async (req, res) => {
  try {
    const subFamily = await emp_sub_family.findByPk(req.params.id);
    if (!subFamily) return res.status(404).json({ message: "Sub Family not found" });
    return res.status(200).json(subFamily);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Sub Family
exports.updateSubFamily = async (req, res) => {
  try {
    const subFamily = await emp_sub_family.findByPk(req.params.id);
    if (!subFamily) return res.status(404).json({ message: "Sub Family not found" });

    await subFamily.update(req.body);
    return res.status(200).json({ message: "Sub Family updated", data: subFamily });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Sub Family (soft delete, because paranoid:true in model)
exports.deleteSubFamily = async (req, res) => {
  try {
    const subFamily = await emp_sub_family.findByPk(req.params.id);
    if (!subFamily) return res.status(404).json({ message: "Sub Family not found" });

    await subFamily.destroy();
    return res.status(200).json({ message: "Sub Family deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
