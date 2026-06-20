const db = require("../models");
const Payroll = db.Payroll_details;

// ✅ CREATE (Contract + Payroll unified)
exports.create = async (req, res) => {
  try {
    const { contract, payroll } = req.body;

    if (!contract?.emp_id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Merge contract + payroll data
    let salaryStructure = payroll?.salaryStructure || [];
    if (typeof salaryStructure === "string") {
      try {
        salaryStructure = JSON.parse(salaryStructure);
      } catch {
        salaryStructure = [];
      }
    }

    const record = await Payroll.create({
      emp_id: contract.emp_id,
      contract_type: contract.contract_type,
      supervisor: contract.supervisor,
      start_date: contract.start_date,
      end_date: contract.end_date,
      salary: contract.salary,
      notice_period: contract.notice_period,
      benefits: contract.benefits,
      terms: contract.terms,
      status: payroll?.status || "Active",
      employeeType: payroll?.employeeType || "",
      salaryStructure,
    });

    return res.status(201).json({ message: "Payroll record created", data: record });
  } catch (err) {
    console.error("❌ Create payroll error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { contract, payroll } = req.body;

    if (!contract && !payroll) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // Merge data for update
    const updateData = {
      ...(contract || {}),
      ...(payroll || {}),
    };

    // Parse salaryStructure if needed
    if (updateData.salaryStructure && typeof updateData.salaryStructure === "string") {
      try {
        updateData.salaryStructure = JSON.parse(updateData.salaryStructure);
      } catch {
        updateData.salaryStructure = [];
      }
    }

    const [updatedCount] = await Payroll.update(updateData, { where: { id } });
    if (!updatedCount) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    const updated = await Payroll.findByPk(id);
    return res.json({ message: "Payroll record updated", data: updated });
  } catch (err) {
    console.error("❌ Update payroll error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ GET BY EMPLOYEE ID
exports.getByEmployeeId = async (req, res) => {
  try {
    const emp_id = parseInt(req.params.emp_id); // ensure it's number
    const record = await Payroll.findOne({ where: { emp_id } });

    if (!record) {
      return res.status(404).json({ message: "No payroll found for this employee" });
    }

    return res.status(200).json(record);
  } catch (err) {
    console.error("❌ Fetch payroll error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Payroll.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Payroll record not found" });
    return res.json({ message: "Payroll record deleted successfully" });
  } catch (err) {
    console.error("❌ Delete payroll error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL
exports.findAll = async (req, res) => {
  try {
    const records = await Payroll.findAll();
    return res.json(records);
  } catch (err) {
    console.error("❌ Fetch all payroll error:", err);
    return res.status(500).json({ error: err.message });
  }
};
