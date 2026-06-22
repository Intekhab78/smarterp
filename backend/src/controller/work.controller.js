const db = require("../models");
const Work = db.work;

// Create or Update Work Info
exports.createOrUpdateWork = async (req, res) => {
  const { emp_id, department, position, title, manager, work_address } = req.body;

  if (!emp_id) return res.status(400).json({ success: false, error: "emp_id is required" });

  try {
    let work = await Work.findOne({ where: { emp_id } });

    if (work) {
      // Update existing work
      await Work.update(
        { department, position, title, manager, work_address },
        { where: { emp_id } }
      );
    } else {
      // Create new work record
      work = await Work.create({ emp_id, department, position, title, manager, work_address });
    }

    return res.status(200).json({ success: true, data: work });
  } catch (error) {
    console.error("❌ Error saving work info:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get Work Info by Employee ID
// exports.getWorkByEmpId = async (req, res) => {
//   const { emp_id } = req.params;

//   try {
//     const work = await Work.findOne({ where: { emp_id } });
//     return res.status(200).json({ success: true, data: work });
//   } catch (error) {
//     console.error("❌ Error fetching work info:", error);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };
