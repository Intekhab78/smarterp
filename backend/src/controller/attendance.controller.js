const db = require("../models");
const EmpAttendance = db.emp_attendance;
const Employee = db.Employee;

// ✅ Helper function: get total days in a month
const getDaysInMonth = (monthValue) => {
  // monthValue expected format: "YYYY-MM" (e.g. "2025-10")
  const [year, month] = monthValue.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};

// ✅ Create or update attendance
exports.markMonthlyAttendance = async (req, res) => {
  try {
    let { emp_id, emp_fname, month, today_date, remark, checkin, checkout } = req.body;

    if (!emp_id || !emp_fname || !month || !today_date)
      return res
        .status(400)
        .json({ success: false, message: "Employee, month, and date are required" });

    emp_id = parseInt(emp_id);

    const [record, created] = await EmpAttendance.findOrCreate({
      where: { emp_id, month, today_date },
      defaults: { emp_fname, remark, checkin, checkout },
    });

    if (!created) {
      record.emp_fname = emp_fname;
      record.remark = remark;
      record.checkin = checkin;
      record.checkout = checkout;
      await record.save();
    }

    res.status(200).json({
      success: true,
      message: created ? "Attendance added" : "Attendance updated",
      data: record.toJSON(),
    });
  } catch (err) {
    console.error("❌ Error in markMonthlyAttendance:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get all attendance with calculated fields
exports.getMonthlyAttendance = async (req, res) => {
  try {
    const records = await EmpAttendance.findAll({
      include: {
        model: Employee,
        as: "employee",
        attributes: ["emp_id", "emp_fname", "emp_lname"],
      },
      order: [["month", "DESC"]],
    });

    // Group records by emp_id and month
    const groupedData = {};

    records.forEach((rec) => {
      const r = rec.toJSON();
      const month = r.month;
      const empId = r.emp_id;
      const key = `${empId}-${month}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          emp_id: empId,
          emp_fname: r.emp_fname,
          emp_lname: r.emp_lname,
          month: month,
          total_days: getDaysInMonth(month),
          present_days: 0,
          checkin: r.checkin || "",
          checkout: r.checkout || "",
        };
      }

      // increment present_days (count all records where checkin or checkout exist)
      if (r.checkin || r.checkout) {
        groupedData[key].present_days += 1;
      }
    });

    // Calculate percentage and convert to array
    const finalData = Object.values(groupedData).map((item) => {
      const percentage = ((item.present_days / item.total_days) * 100).toFixed(1);
      return { ...item, present_percentage: percentage };
    });

    res.status(200).json({ success: true, data: finalData });
  } catch (err) {
    console.error("❌ Error in getMonthlyAttendance:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get attendance by employee + month
exports.getAttendanceByEmployeeMonth = async (req, res) => {
  try {
    const { emp_id, month } = req.query;

    if (!emp_id || !month)
      return res
        .status(400)
        .json({ success: false, message: "Employee and month required" });

    const record = await EmpAttendance.findAll({ where: { emp_id, month } });

    res.status(200).json({ success: true, data: record || [] });
  } catch (err) {
    console.error("❌ Error in getAttendanceByEmployeeMonth:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
