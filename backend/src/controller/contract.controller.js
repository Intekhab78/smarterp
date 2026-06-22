const db = require("../models");
const Contract = db.contract;
const Employee = db.Employee;

// ✅ Create or update a contract
exports.createOrUpdateContract = async (req, res) => {
  try {
    const {
      emp_id,
      emp_fname,
      emp_lname,
      designation,
      department,
      contract_type,
      start_date,
      end_date,
      salary,
      benefits,
      notice_period,
      supervisor,
      terms,
    } = req.body;

    // 🔹 Validate required fields
    if (!emp_id || !contract_type || !start_date || !salary) {
      return res.status(400).json({ message: "Required fields missing!" });
    }

    // 🔹 Check if contract exists for this emp_id
    let existingContract = await Contract.findOne({ where: { emp_id } });

    if (existingContract) {
      // 🔹 Update existing record
      await existingContract.update({
        emp_fname,
        emp_lname,
        designation,
        department,
        contract_type,
        start_date,
        end_date,
        salary,
        benefits,
        notice_period,
        supervisor,
        terms,
      });

      return res.status(200).json({
        message: "Contract updated successfully",
        data: existingContract,
      });
    }

    // 🔹 Create new contract
    const newContract = await Contract.create({
      emp_id,
      emp_fname,
      emp_lname,
      designation,
      department,
      contract_type,
      start_date,
      end_date,
      salary,
      benefits,
      notice_period,
      supervisor,
      terms,
    });

    res
      .status(201)
      .json({ message: "Contract created successfully", data: newContract });
  } catch (error) {
    console.error("Error creating/updating contract:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all contracts
exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [{ model: Employee, as: "employee" }],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get contract by Employee ID
exports.getContractByEmployee = async (req, res) => {
  try {
    const { emp_id } = req.query;

    const contract = await Contract.findOne({
      where: { emp_id },
      include: [{ model: Employee, as: "employee" }],
    });

    if (!contract)
      return res
        .status(404)
        .json({ message: "No contract found for this employee" });

    res.status(200).json(contract);
  } catch (error) {
    console.error("Error fetching contract:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete contract
exports.deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Contract.destroy({ where: { id } });

    if (!deleted)
      return res.status(404).json({ message: "Contract not found" });

    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (error) {
    console.error("Error deleting contract:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// ✅ Get contract by Employee ID (for edit)
exports.getContractByEmployeeId = async (req, res) => {
  try {
    const { emp_id } = req.params;

    const contract = await Contract.findOne({
      where: { emp_id },
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json(contract);
  } catch (error) {
    console.error("Error fetching contract by emp_id:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update contract by Employee ID
exports.updateContractByEmployeeId = async (req, res) => {
  try {
    const { emp_id } = req.params;

    const [updated] = await Contract.update(req.body, { where: { emp_id } });

    if (!updated) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const updatedContract = await Contract.findOne({ where: { emp_id } });
    res
      .status(200)
      .json({
        message: "Contract updated successfully",
        data: updatedContract,
      });
  } catch (error) {
    console.error("Error updating contract by emp_id:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
