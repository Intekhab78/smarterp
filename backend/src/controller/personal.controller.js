// ✅ Create or Update Personal Details
const db = require("../models");

const Personal_Details = db.Personal_Details;
const Employee = db.Employee;
const EmpFamMember = db.emp_fam_member;

// ✅ Create or Update Personal + Family Members
exports.createOrUpdatePersonal = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const {
      emp_id,
      email,
      phone,
      bank,
      emergencyContact,
      emergencyPhone,
      permitNo,
      permitExpiry,
      address,
      distance,
      certificate,
      fieldOfStudy,
      legalName,
      birthday,
      birthPlace,
      gender,
      nationality,
      idNo,
      ssn,
      passport,
      maritalStatus,
      dependents,

      fatherTitle,
      fatherName,
      motherTitle,
      motherName,
      spouseName,
      marriageDate,

      familyMembers = [],
    } = req.body;

    if (!emp_id) {
      return res
        .status(400)
        .json({ success: false, message: "emp_id is required" });
    }

    // 🔎 Check employee
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // 🔍 Find existing personal details
    let personal = await Personal_Details.findOne({
      where: { emp_id },
      transaction: t,
    });

    if (personal) {
      // 🔄 UPDATE
      await personal.update(
        {
          email,
          phone,
          bank,
          emergencyContact,
          emergencyPhone,
          permitNo,
          permitExpiry,
          address,
          distance,
          certificate,
          fieldOfStudy,
          legalName,
          birthday,
          birthPlace,
          gender,
          nationality,
          idNo,
          ssn,
          passport,
          maritalStatus,
          dependents,
          fatherTitle,
          fatherName,
          motherTitle,
          motherName,
          spouseName,
          marriageDate,
        },
        { transaction: t },
      );
    } else {
      // ➕ CREATE
      personal = await Personal_Details.create(
        {
          emp_id,
          email,
          phone,
          bank,
          emergencyContact,
          emergencyPhone,
          permitNo,
          permitExpiry,
          address,
          distance,
          certificate,
          fieldOfStudy,
          legalName,
          birthday,
          birthPlace,
          gender,
          nationality,
          idNo,
          ssn,
          passport,
          maritalStatus,
          dependents,
          fatherTitle,
          fatherName,
          motherTitle,
          motherName,
          spouseName,
          marriageDate,
        },
        { transaction: t },
      );
    }

    // 🧹 Remove old family members
    await EmpFamMember.destroy({
      where: { personal_details_id: personal.id },
      transaction: t,
    });

    // ➕ Insert new family members
    if (Array.isArray(familyMembers) && familyMembers.length > 0) {
      const familyPayload = familyMembers.map((fm) => ({
        emp_id: String(emp_id),
        email,
        personal_details_id: personal.id,
        relation: fm.relationship, // UI uses "relationship"
        fullName: fm.name,
      }));

      await EmpFamMember.bulkCreate(familyPayload, { transaction: t });
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Personal & family details saved successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.createOrUpdatePersonal1 = async (req, res) => {
  try {
    const { emp_id } = req.body;

    if (!emp_id) {
      return res
        .status(400)
        .json({ success: false, message: "emp_id is required" });
    }

    // Check if employee exists
    const employee = await Employee.findByPk(emp_id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Extract fields from body
    const {
      email,
      phone,
      bank,
      emergencyContact,
      emergencyPhone,
      permitNo,
      permitExpiry,
      address,
      distance,
      certificate,
      fieldOfStudy,
      legalName,
      birthday,
      birthPlace,
      gender,
      nationality,
      idNo,
      ssn,
      passport,
      maritalStatus,
      dependents,
    } = req.body;

    // Check if personal details already exist
    let personal = await Personal_Details.findOne({ where: { emp_id } });

    if (personal) {
      // 🔄 Update existing record
      await personal.update({
        email,
        phone,
        bank,
        emergencyContact,
        emergencyPhone,
        permitNo,
        permitExpiry,
        address,
        distance,
        certificate,
        fieldOfStudy,
        legalName,
        birthday,
        birthPlace,
        gender,
        nationality,
        idNo,
        ssn,
        passport,
        maritalStatus,
        dependents,
      });
    } else {
      // ➕ Create new record
      personal = await Personal_Details.create({
        emp_id,
        email,
        phone,
        bank,
        emergencyContact,
        emergencyPhone,
        permitNo,
        permitExpiry,
        address,
        distance,
        certificate,
        fieldOfStudy,
        legalName,
        birthday,
        birthPlace,
        gender,
        nationality,
        idNo,
        ssn,
        passport,
        maritalStatus,
        dependents,
      });
    }

    return res.status(201).json({
      success: true,
      data: personal,
      message: "Personal details saved successfully",
    });
  } catch (error) {
    console.error("❌ Error saving personal details:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// controller/personal.controller.js

// ✅ Delete personal details by emp_id
exports.deletePersonal1 = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const deleted = await Personal_Details.destroy({ where: { emp_id } });

    force: true; // hard delete

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "❌ No personal record found for this employee." });
    }

    res
      .status(200)
      .json({ message: "✅ Personal details deleted successfully." });
  } catch (error) {
    console.error("❌ Delete Personal Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
exports.deletePersonal = async (req, res) => {
  try {
    const { emp_id } = req.params;

    const deleted = await Personal_Details.destroy({
      where: { emp_id },
      force: true, // ✅ hard delete (ignores paranoid)
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "❌ No personal record found for this employee." });
    }

    res
      .status(200)
      .json({ message: "✅ Personal details deleted successfully." });
  } catch (error) {
    console.error("❌ Delete Personal Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
