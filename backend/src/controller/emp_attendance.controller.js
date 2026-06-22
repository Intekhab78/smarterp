const db = require("../models");
const emp_attendance = db.emp_attendance;
const Summary = db.emp_attendance_summary;
const { Op, Sequelize } = require("sequelize");

const tzlookup = require("tz-lookup");
const moment = require("moment-timezone");

exports.createAttendance1 = async (req, res) => {
  try {
    const { datetime, latitude, longitude, ...rest } = req.body;

    // derive timezone & server-local timestamps
    const timezone = tzlookup(Number(latitude), Number(longitude));
    const serverLocalTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");

    const todayDate = moment(serverLocalTime).format("YYYY-MM-DD");
    const currentTime = moment(serverLocalTime).format("HH:mm"); // e.g. "17:02"

    // Get the last record for this employee for today (if any)
    const lastRecord = await emp_attendance.findOne({
      where: {
        emp_id: rest.emp_id,
        date_only: todayDate,
      },
      order: [["id", "DESC"]],
    });

    // -------------------------
    // CASE A → NO RECORD YET (first punch)
    // -------------------------
    if (!lastRecord) {
      const newRow = await emp_attendance.create({
        emp_id: rest.emp_id,
        email: rest.email,
        datetime,
        latitude,
        longitude,
        match_percentage: rest.match_percentage,
        device_id: rest.device_id,
        device_brand: rest.device_brand,
        device_model: rest.device_model,
        device_manufacturer: rest.device_manufacturer,
        device_type: rest.device_type,
        server_time: serverLocalTime,

        date_only: todayDate,
        punch_in: currentTime,
        punch_out: null,
        working_hours: null,
        status: "active",
      });

      return res.json({
        status: true,
        message: "First Punch IN recorded",
        data: newRow,
      });
    }

    // -------------------------
    // CASE B → There is a lastRecord
    // We must:
    // 1) If lastRecord.punch_out is NULL → update it with currentTime & working_hours
    // 2) Always create a NEW row with punch_in = currentTime
    // This ensures every punch creates a new row and previous row gets closed.
    // -------------------------

    // If lastRecord.punch_in might be null or malformed, guard it:
    const lastPunchIn = lastRecord.punch_in || currentTime;
    // If previous row has no punch_out, update it now
    let updatedPrev = null;
    if (!lastRecord.punch_out) {
      const punchInMoment = moment(lastRecord.punch_in, "HH:mm");
      let punchOutMoment = moment(currentTime, "HH:mm");

      if (punchOutMoment.isBefore(punchInMoment)) {
        punchOutMoment = punchOutMoment.add(1, "day");
      }

      const duration = moment.duration(punchOutMoment.diff(punchInMoment));
      const hours = String(Math.floor(duration.asHours())).padStart(2, "0");
      const minutes = String(duration.minutes()).padStart(2, "0");
      const workingHours = `${hours}:${minutes}`;

      updatedPrev = await lastRecord.update({
        punch_out: currentTime,
        working_hours: workingHours,
      });
    }

    // Create the new row (new punch_in)
    const newRow = await emp_attendance.create({
      emp_id: rest.emp_id,
      email: rest.email,
      datetime,
      latitude,
      longitude,
      match_percentage: rest.match_percentage,
      device_id: rest.device_id,
      device_brand: rest.device_brand,
      device_model: rest.device_model,
      device_manufacturer: rest.device_manufacturer,
      device_type: rest.device_type,
      server_time: serverLocalTime,

      date_only: todayDate,
      punch_in: currentTime,
      punch_out: null,
      working_hours: null,
      status: "active",
    });

    return res.json({
      status: true,
      message: "Your punch has been recorded.",
      // message: "Previous row closed (if open) and new Punch IN recorded",
      updatedPrevious: updatedPrev, // null if previous already had punch_out
      newRow,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const { datetime, latitude, longitude, ...rest } = req.body;

    // derive timezone & server-local timestamps
    const timezone = tzlookup(Number(latitude), Number(longitude));
    const serverLocalTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");

    const todayDate = moment(serverLocalTime).format("YYYY-MM-DD");
    const currentTime = moment(serverLocalTime).format("HH:mm"); // e.g. "17:02"

    // Get the last record for this employee for today (if any)
    const lastRecord = await emp_attendance.findOne({
      where: {
        emp_id: rest.emp_id,
        date_only: todayDate,
      },
      order: [["id", "DESC"]],
    });

    // -------------------------
    // CASE A → NO RECORD YET (first punch → Punch IN)
    // -------------------------
    if (!lastRecord) {
      const newRow = await emp_attendance.create({
        emp_id: rest.emp_id,
        email: rest.email,
        datetime,
        latitude,
        longitude,
        match_percentage: rest.match_percentage,
        device_id: rest.device_id,
        device_brand: rest.device_brand,
        device_model: rest.device_model,
        device_manufacturer: rest.device_manufacturer,
        device_type: rest.device_type,
        server_time: serverLocalTime,

        date_only: todayDate,
        punch_in: currentTime,
        punch_out: null,
        working_hours: null,
        status: "active",
      });

      return res.json({
        status: true,
        message: "Punch IN recorded",
        data: newRow,
      });
    }

    // -------------------------
    // CASE B → TOGGLE LOGIC
    // -------------------------

    // CASE B1 → Punch OUT (if last punch has no punch_out)
    if (!lastRecord.punch_out) {
      const punchInMoment = moment(lastRecord.punch_in, "HH:mm");
      let punchOutMoment = moment(currentTime, "HH:mm");

      if (punchOutMoment.isBefore(punchInMoment)) {
        punchOutMoment = punchOutMoment.add(1, "day");
      }

      const duration = moment.duration(punchOutMoment.diff(punchInMoment));
      const hours = String(Math.floor(duration.asHours())).padStart(2, "0");
      const minutes = String(duration.minutes()).padStart(2, "0");
      const workingHours = `${hours}:${minutes}`;

      const updatedRow = await lastRecord.update({
        punch_out: currentTime,
        working_hours: workingHours,
      });

      return res.json({
        status: true,
        message: "Punch OUT recorded",
        data: updatedRow,
      });
    }

    // CASE B2 → Punch IN (create new row)
    const newRow = await emp_attendance.create({
      emp_id: rest.emp_id,
      email: rest.email,
      datetime,
      latitude,
      longitude,
      match_percentage: rest.match_percentage,
      device_id: rest.device_id,
      device_brand: rest.device_brand,
      device_model: rest.device_model,
      device_manufacturer: rest.device_manufacturer,
      device_type: rest.device_type,
      server_time: serverLocalTime,

      date_only: todayDate,
      punch_in: currentTime,
      punch_out: null,
      working_hours: null,
      status: "active",
    });

    return res.json({
      status: true,
      message: "Punch IN recorded",
      data: newRow,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

exports.listAttendance = async (req, res) => {
  try {
    // const logs = await emp_attendance.findAll({
    //   where: { status: "active" },
    // });

    const logs = await emp_attendance.findAll();

    console.log("logs ------------------", logs);

    res.json({ status: true, data: logs });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// exports.getByEmailAndDate = async (req, res) => {
//   try {
//     const { email } = req.params; // ✅ FIX HERE
//     const { date } = req.query;

//     const whereCondition = {};

//     // email is REQUIRED
//     if (email) {
//       whereCondition.email = email;
//     }

//     // optional date filter
//     if (date) {
//       whereCondition.datetime = {
//         [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
//       };
//     }

//     const logs = await emp_attendance.findAll({
//       where: whereCondition,
//       order: [["id", "DESC"]],
//     });

//     if (logs.length === 0) {
//       return res.json({
//         status: true,
//         count: 0,
//         message: "No punch records found for the selected date",
//         data: [],
//       });
//     }

//     const formattedData = logs.map((item) => ({
//       id: item.id,
//       emp_id: item.emp_id,
//       email: item.email,
//       datetime: item.datetime,
//       date_only: moment(item.datetime).format("YYYY-MM-DD"),
//       punch_in: item.punch_in || null,
//       punch_out: item.punch_out || null,
//       working_hours: item.working_hours || "00:00",
//       server_time: moment().format("YYYY-MM-DD HH:mm:ss"),
//     }));

//     return res.json({
//       status: true,
//       count: formattedData.length,
//       message: "Punch records fetched successfully",
//       data: formattedData,
//     });
//   } catch (err) {
//     console.error("Attendance list error ❌", err);
//     return res.status(500).json({
//       status: false,
//       message: err.message,
//     });
//   }
// };

//below controller is working fine no issue in this we does not calculate the total presedn and absed of that month
exports.getByEmailAndDate1 = async (req, res) => {
  try {
    const { email } = req.params;
    let { date } = req.query;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    // DD-MM-YYYY → YYYY-MM-DD
    if (date) {
      const parts = date.split("-");
      if (parts.length === 3 && parts[0].length === 2) {
        date = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const whereCondition = { email };

    if (date) {
      whereCondition.date_only = date;
    }

    const logs = await emp_attendance.findAll({
      where: whereCondition,
      attributes: [
        "id",
        "emp_id",
        "email",
        "datetime",
        "date_only",
        "punch_in",
        "punch_out",
        "working_hours",
        "server_time",
      ],
      order: [["datetime", "DESC"]],
    });

    return res.json({
      status: true,
      count: logs.length,
      message: "Punch records fetched successfully",
      data: logs,
    });
  } catch (err) {
    console.error("Attendance list error ❌", err);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

//below controller is working fine no issue in this we  calculate the total presedn and absed of that month also

exports.getByEmailAndDate = async (req, res) => {
  try {
    const { email } = req.params;
    let { date } = req.query;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    // Convert DD-MM-YYYY → YYYY-MM-DD
    if (date) {
      const parts = date.split("-");
      if (parts.length === 3 && parts[0].length === 2) {
        date = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    // Decide target month
    const today = new Date();
    const targetDate = date ? new Date(date) : today;
    const summaryDate = today; // ALWAYS today

    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based

    const monthStart = new Date(year, month, 1);
    const monthEnd = today; // ALWAYS today
    // const monthEnd =
    //   year === today.getFullYear() && month === today.getMonth()
    //     ? today
    //     : new Date(year, month + 1, 0);

    // Build DB query (FULL MONTH, not single day)
    const whereCondition = {
      email,
      date_only: {
        [Op.between]: [
          monthStart.toISOString().split("T")[0],
          monthEnd.toISOString().split("T")[0],
        ],
      },
    };

    const logsWhere = {
      email,
    };

    if (date) {
      logsWhere.date_only = date; // EXACT DATE ONLY
    }

    const logs = await emp_attendance.findAll({
      // where: whereCondition,
      where: logsWhere,
      attributes: [
        "id",
        "emp_id",
        "email",
        "datetime",
        "date_only",
        "punch_in",
        "punch_out",
        "working_hours",
        "server_time",
      ],
      order: [["datetime", "DESC"]],
    });

    const summaryLogs = await emp_attendance.findAll({
      where: {
        email,
        date_only: {
          [Op.between]: [
            monthStart.toISOString().split("T")[0],
            monthEnd.toISOString().split("T")[0],
          ],
        },
      },
      attributes: ["date_only", "punch_in", "punch_out"],
    });

    // Group punches by date
    const attendanceByDate = {};

    for (const log of summaryLogs) {
      const d = log.date_only;

      if (!attendanceByDate[d]) {
        attendanceByDate[d] = {
          hasPunchIn: false,
          hasPunchOut: false,
        };
      }

      if (log.punch_in) attendanceByDate[d].hasPunchIn = true;
      if (log.punch_out) attendanceByDate[d].hasPunchOut = true;
    }

    // Calculate monthly summary (1st → today)
    let present = 0;
    let absent = 0;
    let singlePunch = 0;

    for (
      let d = new Date(monthStart);
      d <= monthEnd;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split("T")[0];
      const record = attendanceByDate[dateKey];

      if (!record) {
        absent++;
      } else if (record.hasPunchIn && record.hasPunchOut) {
        present++;
      } else {
        singlePunch++;
      }
    }

    return res.json({
      status: true,
      count: logs.length,
      message: "Punch records fetched successfully",
      monthly_summary: {
        present,
        absent,
        single_punch: singlePunch,
      },
      data: logs,
    });
  } catch (err) {
    console.error("Attendance list error ❌", err);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

exports.getAttendanceByEmail1 = async (req, res) => {
  try {
    const { email } = req.params;
    let { month, year } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }

    // ✅ Default: current month & year
    const currentMonth = moment().month() + 1; // 1-12
    const currentYear = moment().year();

    month = month ? Number(month) : currentMonth;
    year = year ? Number(year) : currentYear;
    // ✅ Start & End date of selected month
    const baseDate = moment({ year, month: month - 1, day: 1 });

    const startDate = baseDate.clone().startOf("month").format("YYYY-MM-DD");
    const endDate = baseDate.clone().endOf("month").format("YYYY-MM-DD");
    // Fetch attendance logs
    const logs = await emp_attendance.findAll({
      where: {
        email,
        status: "active",
        date_only: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["server_time", "ASC"]],
    });

    // Group by date
    const grouped = {};

    logs.forEach((log) => {
      const date = log.date_only;

      if (!grouped[date]) {
        grouped[date] = {
          emp_id: log.emp_id,
          email: log.email,
          date_only: date,
          punch_in: log.punch_in, // first punch
          punch_out: log.punch_in, // temp
          server_time: log.server_time,
          status: log.status,
        };
      }

      // update last punch
      grouped[date].punch_out = log.punch_in;
    });

    // Calculate working hours
    const finalResult = Object.values(grouped).map((rec) => {
      // format punch in/out with AM/PM
      if (rec.punch_in) {
        rec.punch_in = moment(rec.punch_in, "HH:mm").format("hh:mm A");
      }

      if (rec.punch_out) {
        rec.punch_out = moment(rec.punch_out, "HH:mm").format("hh:mm A");
      }

      if (rec.punch_in && rec.punch_out && rec.punch_in !== rec.punch_out) {
        // const start = moment(rec.punch_in, "HH:mm");
        // const end = moment(rec.punch_out, "HH:mm");
        // const diff = moment.duration(end.diff(start));
        // rec.working_hours = moment.utc(diff.asMilliseconds()).format("HH:mm");
        const start = moment(grouped[rec.date_only]?.punch_in, "HH:mm");
        const end = moment(grouped[rec.date_only]?.punch_out, "HH:mm");
        const diff = moment.duration(end.diff(start));
        rec.working_hours = moment.utc(diff.asMilliseconds()).format("HH:mm");
      } else {
        rec.working_hours = null;
      }
      return rec;
    });

    res.json({
      status: true,
      message: "Attendance fetched successfully",
      month,
      year,
      data: finalResult,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAttendanceByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    let { month, year } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }

    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();

    month = month ? Number(month) : currentMonth;
    year = year ? Number(year) : currentYear;

    const baseDate = moment({ year, month: month - 1, day: 1 });
    const startDate = baseDate.clone().startOf("month").format("YYYY-MM-DD");
    const endDate = baseDate.clone().endOf("month").format("YYYY-MM-DD");

    const logs = await emp_attendance.findAll({
      where: {
        email,
        status: "active",
        date_only: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["server_time", "ASC"]],
    });

    // 🔹 Group by date
    const grouped = {};

    logs.forEach((log) => {
      const date = log.date_only;

      if (!grouped[date]) {
        grouped[date] = {
          emp_id: log.emp_id,
          email: log.email,
          date_only: date,
          punch_in_raw: log.punch_in,
          punch_out_raw: log.punch_in,
          server_time: log.server_time,
          status: log.status,
        };
      }

      grouped[date].punch_out_raw = log.punch_in;
    });

    // 🔹 Final calculation
    const finalResult = Object.values(grouped).map((rec) => {
      let working_hours = null;

      if (
        rec.punch_in_raw &&
        rec.punch_out_raw &&
        rec.punch_in_raw !== rec.punch_out_raw
      ) {
        // ✅ COMBINE DATE + TIME (THIS IS THE FIX)
        const start = moment(
          `${rec.date_only} ${rec.punch_in_raw}`,
          "YYYY-MM-DD HH:mm",
        );

        let end = moment(
          `${rec.date_only} ${rec.punch_out_raw}`,
          "YYYY-MM-DD HH:mm",
        );

        // ✅ Overnight shift
        if (end.isBefore(start)) {
          end.add(1, "day");
        }

        const diffMinutes = end.diff(start, "minutes");
        working_hours = moment.utc(diffMinutes * 60 * 1000).format("HH:mm");
      }

      return {
        emp_id: rec.emp_id,
        email: rec.email,
        date_only: rec.date_only,
        punch_in: moment(rec.punch_in_raw, "HH:mm").format("hh:mm A"),
        punch_out: moment(rec.punch_out_raw, "HH:mm").format("hh:mm A"),
        server_time: rec.server_time,
        status: rec.status,
        working_hours,
      };
    });

    res.json({
      status: true,
      message: "Attendance fetched successfully",
      month,
      year,
      data: finalResult,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await emp_attendance.update(req.body, {
      where: { id },
    });

    res.json({ status: true, message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await emp_attendance.update({ status: "inactive" }, { where: { id } });

    res.json({ status: true, message: "Deleted (inactive) successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
