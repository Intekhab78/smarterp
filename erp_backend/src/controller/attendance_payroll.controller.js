const { attendance_payroll, emp_attendance } = require("../models"); // Adjust path as needed
const { Op, fn, col, where } = require("sequelize");

// Always normalize to YYYY-MM-DD
function normalizeDate(dt) {
  if (!dt) return null;

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dt)) return dt;

  // If DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(dt)) {
    const [dd, mm, yyyy] = dt.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  return dt;
}
module.exports = {
  // Create new attendance record
  // create: async (req, res) => {
  //   try {
  //     const data = await attendance_payroll.create(req.body);
  //     res.status(201).json(data);
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(500)
  //       .json({ message: "Error creating attendance record", error });
  //   }
  // },

  create: async (req, res) => {
    try {
      const { emp_id, email_id } = req.body;

      const onlyDate = normalizeDate(req.body.datetime);

      const payrollData = { ...req.body };

      // 1️⃣ Calculate total working hours
      const [result] = await emp_attendance.findAll({
        attributes: [
          [
            fn(
              "SEC_TO_TIME",
              fn("SUM", fn("TIME_TO_SEC", col("working_hours")))
            ),
            "total_working_hours",
          ],
        ],
        where: {
          emp_id: String(emp_id),
          email: email_id,
          punch_out: { [Op.ne]: null }, // 🔴 ignore open punch
          status: "approved",
          [Op.and]: [where(fn("DATE", col("datetime")), onlyDate)],
        },
        raw: true,
      });

      payrollData.working_hours = result.total_working_hours || "00:00:00";

      // 2️⃣ Insert payroll
      const data = await attendance_payroll.create(payrollData);

      // 3️⃣ Approve attendance rows
      const [updatedCount] = await emp_attendance.update(
        { status: "approved" },
        {
          where: {
            emp_id: String(emp_id),
            email: email_id,
            [Op.and]: [where(fn("DATE", col("datetime")), onlyDate)],
          },
        }
      );

      res.status(201).json({
        message: "Payroll saved & attendance approved",
        working_hours: payrollData.working_hours,
        updatedCount,
        data,
      });
    } catch (error) {
      console.error("❌ ERROR:", error);
      res.status(500).json({ message: "Error updating attendance", error });
    }
  },

  create1: async (req, res) => {
    try {
      const { emp_id, email_id } = req.body;

      // Normalize date
      const onlyDate = normalizeDate(req.body.datetime);
      // Remove status
      const payrollData = { ...req.body };
      // delete payrollData.status;

      // Insert payroll
      const data = await attendance_payroll.create(payrollData);
      // DEBUG — Fetch rows BEFORE update
      const beforeRows = await emp_attendance.findAll({
        where: {
          emp_id: String(emp_id),
          email: email_id,
          [Op.and]: [where(fn("DATE", col("datetime")), onlyDate)],
        },
      });

      console.log("🔍 BEFORE UPDATE ROWS FOUND:", beforeRows.length);
      console.log("📝 ROW DATA:");
      beforeRows.forEach((r) => console.log(r.dataValues));

      // UPDATE STATUS
      const [updatedCount] = await emp_attendance.update(
        { status: "approved" },
        {
          where: {
            emp_id: String(emp_id),
            email: email_id,
            [Op.and]: [where(fn("DATE", col("datetime")), onlyDate)],
          },
        }
      );

      console.log("✔ UPDATED ROWS:", updatedCount);

      // DEBUG — Fetch rows AFTER update
      const afterRows = await emp_attendance.findAll({
        where: {
          emp_id: String(emp_id),
          email: email_id,
          [Op.and]: [where(fn("DATE", col("datetime")), onlyDate)],
        },
      });

      console.log("📌 AFTER UPDATE:");
      afterRows.forEach((r) => console.log(r.dataValues));

      res.status(201).json({
        message: "Payroll saved & attendance updated",
        updatedCount,
        data,
      });
    } catch (error) {
      console.error("❌ ERROR:", error);
      res.status(500).json({ message: "Error updating attendance", error });
    }
  },

  // List all attendance records
  list: async (req, res) => {
    try {
      const records = await attendance_payroll.findAll();
      res.json(records);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching attendance records", error });
    }
  },

  // Get single attendance record by id
  view: async (req, res) => {
    try {
      const id = req.params.id;
      const record = await attendance_payroll.findByPk(id);

      if (!record) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      res.json(record);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching attendance record", error });
    }
  },

  // Update attendance record by id
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const [updated] = await attendance_payroll.update(req.body, {
        where: { id },
      });

      if (!updated) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      const updatedRecord = await attendance_payroll.findByPk(id);
      res.json(updatedRecord);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating attendance record", error });
    }
  },
};
