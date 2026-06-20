import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaMapMarkedAlt } from "react-icons/fa";

<button
  onClick={() => {
    const url = `https://www.google.com/maps?q=${rec.latitude},${rec.longitude}&t=k`;
    window.open(url, "_blank");
  }}
  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  title="Open Map"
>
  <FaMapMarkedAlt size={20} />
</button>;

import React, { useEffect, useState } from "react";
import constantApi from "constantApi";

export default function ManagerPage() {
  const navigate = useNavigate();

  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("active"); // default
  const [editableRows, setEditableRows] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [empList, setEmpList] = useState([]);

  useEffect(() => {
    fetch(`${constantApi.baseUrl}/employee/list`)
      .then((res) => res.json())
      .then((res) => {
        console.log("setEmpList-----------------", res.data);
        setEmpList(res.data);
      })
      .catch((err) => console.error("API ERROR:", err));
  }, []);

  const fetchAttendance = () => {
    fetch(`${constantApi.baseUrl}/emp_attendance/list`)
      .then((res) => res.json())
      .then((res) => {
        console.log("FULL API RESPONSE:", res.data);

        const data = Array.isArray(res.data) ? res.data : [];
        setApiData(data);

        const onlyActive = data.filter((item) => item.status === "active");
        setFilteredData(onlyActive);
      })
      .catch((err) => console.error("API ERROR:", err));
  };

  useEffect(() => {
    fetchAttendance(); // load data first time
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredData(apiData);
    } else {
      setFilteredData(apiData.filter((item) => item.status === statusFilter));
    }
  }, [statusFilter, apiData]);

  function getManagerName(managerId) {
    if (!managerId) return "—";

    const manager = empList.find(
      (emp) => String(emp.emp_id) === String(managerId)
    );

    if (!manager) return managerId; // fallback show ID only

    return `${manager.emp_fname} ${manager.emp_lname}`;
  }

  const managerOptions = [
    { label: "None", value: "" },
    ...empList.map((e) => ({
      label: `${e.emp_fname} ${e.emp_lname}`,
      value: e.emp_id,
    })),
  ];

  useEffect(() => {
    const grouped = buildGroupedRows(filteredData);
    console.log("grouped data is --------------", grouped);

    const init = grouped.map((g) => ({
      key: g.key,
      email_id: g.email,
      emp_id: g.emp_id,
      datetime: g.date,
      punch_in: g.punch_in,
      punch_out: g.punch_out,
      working_hours: g.working_hours,
      status: "",
      approved_by: "",
      manager_comments: "",
      hr_status: "",
      hr_comment: "",
      punches: g.punches,
      records: g.records,
    }));

    setEditableRows(init);
    setOpenRow(null);
  }, [filteredData]);

  function buildGroupedRows(data = []) {
    const byKey = {};

    data.forEach((item) => {
      // if (!item || !item.datetime) return;
      if (!item || !item.server_time) return;

      if (!item.emp_id) return;

      // const dateOnly = item.datetime.split("T")[0];
      const dateOnly = item.server_time.split(" ")[0]; // yyyy-mm-dd

      const key = `${item.email}_${item.emp_id}_${dateOnly}`;

      if (!byKey[key]) {
        byKey[key] = {
          key,
          email: item.email,
          emp_id: item.emp_id,
          date: dateOnly,
          punches: [],
          records: [],
        };
      }

      byKey[key].punches.push(item.datetime);
      byKey[key].records.push(item);
    });

    return Object.values(byKey).map((r) => {
      const sorted = r.punches.slice().sort();
      const punch_in = sorted[0] ? formatTimeUTC(sorted[0]) : "";
      // const punch_in = sorted[0] ? formatServerTime(sorted[0]) : "";

      const punch_out = sorted[sorted.length - 1]
        ? formatTimeUTC(sorted[sorted.length - 1])
        : "";

      let working_hours = "0";
      if (sorted.length > 1)
        working_hours = calcWorking(sorted[0], sorted[sorted.length - 1]);

      return {
        ...r,
        punch_in,
        punch_out,
        working_hours,
      };
    });
  }

  // function formatTime(dt) {
  //   const d = new Date(dt);
  //   return d.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: false,
  //   });
  // }

  function formatTimeUTC(dt) {
    const d = new Date(dt);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC", // 👈 This keeps time in UTC
    });
  }

  function formatServerTime(serverTime) {
    // serverTime = "2025-11-27 12:38:30"
    const d = new Date(serverTime.replace(" ", "T"));
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function calcWorking(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    const diff = (e - s) / 1000 / 60;
    const h = Math.floor(diff / 60);
    const m = Math.floor(diff % 60);
    return `${h}h ${m}m`;
  }

  function updateRowField(key, field, value) {
    setEditableRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
    );
  }

  // -------------------------------------------------------
  // 🔥 FINAL APPROVE API BODY (Exact format you asked)
  // -------------------------------------------------------

  function handleApprove(row) {
    const payload = {
      email_id: row.email_id,
      emp_id: row.emp_id,
      datetime: row.datetime,
      punch_in: row.punch_in,
      punch_out: row.punch_out,
      working_hours: row.working_hours,
      status: row.status,
      approved_by: row.approved_by,
      manager_comments: row.manager_comments,
      hr_status: row.hr_status,
      hr_comment: row.hr_comment,
    };

    console.log("FINAL SUBMITTED PAYLOAD:", payload);

    fetch(`${constantApi.baseUrl}/attendance_payroll/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Saved:", res);

        if (res.status === false) {
          toast.error(res.message || "Something went wrong!");
        } else {
          toast.success(res.message || "Attendance approved successfully!");
          fetchAttendance();
        }
      })
      .catch((err) => {
        console.error("SAVE ERROR:", err);
        toast.error("Network error! Please try again.");
      });
  }

  function toggleRow(i) {
    setOpenRow((prev) => (prev === i ? null : i));
  }

  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const role_id = Number(localStorage.getItem("role_id"));
    if (role_id) {
      console.log("Employee ID from localStorage:", role_id);

      setRoleId(role_id);
    }
  }, []);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [searchEmp, setSearchEmp] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-4">
        {roleId === 5 && (
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold mb-4">Attendance Payroll</h1>
            <button
              onClick={() => navigate("/payrollscreen")}
              className="px-2 py-1 bg-blue-600 text-sm text-white rounded"
            >
              Payroll
            </button>
          </div>
        )}

        {/* ---------------- FILTER SECTION ---------------- */}
        {/* ---------------- FILTER SECTION ---------------- */}
        <div className="bg-white p-3 mb-4 rounded shadow flex flex-wrap items-center gap-3">
          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-600">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border p-1.5 text-xs rounded w-36"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-600">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border p-1.5 text-xs rounded w-36"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-600">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-1.5 text-xs rounded w-32"
            >
              <option value="active">Active</option>
              <option value="approved">Approved</option>
              <option value="all">All</option>
            </select>
          </div>

          {/* Employee Dropdown */}
          <div className="relative flex flex-col w-48">
            <label className="text-[11px] font-semibold text-gray-600">
              Employee
            </label>

            <div
              onClick={() => {
                setOpenDropdown(!openDropdown);
                setSearchEmp("");
                setSearchEmail("");
              }}
              className="border p-1.5 text-xs rounded cursor-pointer bg-white"
            >
              {selectedEmployee
                ? `${
                    empList.find((x) => x.emp_id == selectedEmployee)?.emp_fname
                  } ${
                    empList.find((x) => x.emp_id == selectedEmployee)?.emp_lname
                  }`
                : "-- Select Employee --"}
            </div>

            {openDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded shadow z-50 p-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchEmp}
                  onChange={(e) => setSearchEmp(e.target.value)}
                  className="border p-1 text-xs rounded w-full mb-2"
                />

                <div className="max-h-40 overflow-y-auto text-xs">
                  {empList
                    .filter((emp) => {
                      const nameMatch = emp.emp_fname
                        .toLowerCase()
                        .includes(searchEmp.toLowerCase());
                      const emailMatch = emp.emp_email
                        .toLowerCase()
                        .includes(searchEmail.toLowerCase());
                      return nameMatch && emailMatch;
                    })
                    .map((emp) => (
                      <div
                        key={emp.emp_email}
                        onClick={() => {
                          setSelectedEmployee(emp.emp_id);
                          setSearchEmail(emp.emp_email);
                          setOpenDropdown(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                      >
                        {emp.emp_fname} {emp.emp_lname} — {emp.emp_email}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setSearchEmail("");
              setSelectedEmployee("");
            }}
            className="px-3 py-1.5 bg-gray-700 text-white text-xs rounded h-[32px]"
          >
            Reset
          </button>
        </div>

        {/* Status Filter */}

        <div className="overflow-x-auto border rounded-md shadow-sm">
          <table className="min-w-[1300px] text-xs text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-[11px] uppercase text-left">
                <th className="p-2 border w-48">Email</th>
                {/* <th className="p-2 border w-28">Emp ID</th> */}
                <th className="p-2 border w-28">Date</th>
                <th className="p-2 border w-24">Punch In</th>
                <th className="p-2 border w-24">Punch Out</th>
                <th className="p-2 border w-28">Working</th>

                <th className="p-2 border w-32">Status</th>
                <th className="p-2 border w-36">Manager</th>
                <th className="p-2 border w-36">Approved By</th>
                <th className="p-2 border w-48">Manager Comment</th>
                <th className="p-2 border w-32">HR Status</th>
                <th className="p-2 border w-48">HR Comment</th>
                <th className="p-2 border w-28">Action</th>
              </tr>
            </thead>

            <tbody>
              {editableRows
                .filter((row) => {
                  return searchEmail
                    ? row.email_id
                        .toLowerCase()
                        .includes(searchEmail.toLowerCase())
                    : true;
                })
                // 🔥 SORT DESCENDING BY DATE
                .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
                .filter((row) => {
                  if (fromDate && row.datetime < fromDate) return false;
                  if (toDate && row.datetime > toDate) return false;
                  return true;
                })
                .map((r, i) => (
                  <React.Fragment key={r.key}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRow(i)}
                    >
                      <td className="p-2 border">{r.email_id}</td>
                      <td className="p-2 border">{r.datetime}</td>
                      <td className="p-2 border">{r.punch_in}</td>
                      <td className="p-2 border">{r.punch_out}</td>
                      <td className="p-2 border">{r.working_hours}</td>

                      {/* STATUS */}
                      <td className="p-2 border">
                        <select
                          value={r.status}
                          onChange={(e) =>
                            updateRowField(r.key, "status", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="border p-1 w-full text-xs rounded"
                        >
                          <option value="">Select</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Half Day">Half Day</option>
                          <option value="Reject">Reject</option>
                        </select>
                      </td>

                      {/* MANAGER NAME */}
                      <td className="p-2 border">
                        {getManagerName(
                          r.emp_id &&
                            empList.find((emp) => emp.emp_email === r.email_id)
                              ?.work?.manager
                        )}
                      </td>

                      {/* APPROVED BY DROPDOWN */}
                      <td className="p-2 border">
                        {(() => {
                          const emp = empList.find(
                            (e) => e.emp_email === r.email_id
                          );
                          const managerId = emp?.work?.manager;

                          const manager = empList.find(
                            (e) => String(e.emp_id) === String(managerId)
                          );

                          const managerName = manager
                            ? `${manager.emp_fname} ${manager.emp_lname}`
                            : "None";

                          return (
                            <select
                              value={r.approved_by || ""}
                              onChange={(e) =>
                                updateRowField(
                                  r.key,
                                  "approved_by",
                                  e.target.value
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="border p-1 w-full text-xs rounded bg-white"
                            >
                              <option value="">None</option>
                              {manager && (
                                <option value={manager.emp_id}>
                                  {managerName}
                                </option>
                              )}
                            </select>
                          );
                        })()}
                      </td>

                      {/* MANAGER COMMENT */}
                      <td className="p-2 border">
                        <input
                          value={r.manager_comments}
                          onChange={(e) =>
                            updateRowField(
                              r.key,
                              "manager_comments",
                              e.target.value
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="border p-1 w-full text-xs rounded"
                          placeholder="Manager comment"
                        />
                      </td>

                      {/* HR STATUS */}
                      <td className="p-2 border">
                        <select
                          value={r.hr_status}
                          onChange={(e) =>
                            updateRowField(r.key, "hr_status", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="border p-1 w-full text-xs rounded"
                        >
                          <option value="">Select</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>

                      {/* HR COMMENT */}
                      <td className="p-2 border">
                        <input
                          value={r.hr_comment}
                          onChange={(e) =>
                            updateRowField(r.key, "hr_comment", e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="border p-1 w-full text-xs rounded"
                          placeholder="HR note"
                        />
                      </td>

                      {/* APPROVE BUTTON */}
                      <td className="p-2 border text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(r);
                          }}
                          disabled={r.records.some(
                            (rec) => rec.status === "approved"
                          )}
                          className={`text-xs px-3 py-1 rounded 
                ${
                  r.records.some((rec) => rec.status === "approved")
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>

                    {/* ------------------ EXPANDED ROW ------------------------- */}
                    {openRow === i && (
                      <tr>
                        <td colSpan={12} className="bg-gray-50 p-4 border">
                          <p className="font-semibold mb-2">
                            Punching Records:
                          </p>

                          <div className="overflow-x-auto">
                            <table className="w-full text-xs border">
                              <thead className="bg-gray-200 text-left">
                                <tr>
                                  <th className="border p-1">Datetime</th>
                                  <th className="border p-1">Server Time</th>
                                  <th className="border p-1">Punch In</th>
                                  <th className="border p-1">Punch Out</th>
                                  <th className="border p-1">Working Hour</th>
                                  <th className="border p-1">Latitude</th>
                                  <th className="border p-1">Longitude</th>
                                  <th className="border p-1">View On Map</th>
                                  <th className="border p-1">Match %</th>
                                  <th className="border p-1">Device</th>
                                  <th className="border p-1">Type</th>
                                  <th className="border p-1">Status</th>
                                </tr>
                              </thead>

                              <tbody>
                                {r.records
                                  .slice()
                                  .sort(
                                    (a, b) =>
                                      new Date(b.datetime) -
                                      new Date(a.datetime)
                                  )
                                  .map((rec) => {
                                    const dt1 = new Date(rec.datetime);

                                    // If server_time lacks timezone → treat as UTC
                                    const serverTimeStr =
                                      rec.server_time.includes("Z")
                                        ? rec.server_time
                                        : rec.server_time.replace(" ", "T") +
                                          "Z";

                                    const dt2 = new Date(serverTimeStr);

                                    const diffMs = Math.abs(dt1 - dt2);
                                    const diffMin = diffMs / (1000 * 60);

                                    const mismatch = diffMin > 5;

                                    return (
                                      <tr
                                        key={rec.id}
                                        className={mismatch ? "bg-red-100" : ""}
                                      >
                                        <td className="border p-1">
                                          {rec.datetime}
                                        </td>
                                        <td className="border p-1">
                                          {rec.server_time}
                                        </td>
                                        <td className="border p-1">
                                          {rec.punch_in}
                                        </td>
                                        <td className="border p-1">
                                          {rec.punch_out}
                                        </td>
                                        <td className="border p-1">
                                          {rec.working_hours}
                                        </td>
                                        <td className="border p-1">
                                          {rec.latitude}
                                        </td>
                                        <td className="border p-1">
                                          {rec.longitude}
                                        </td>

                                        <td className="border p-1">
                                          <button
                                            onClick={() => {
                                              const url = `https://www.google.com/maps?q=${rec.latitude},${rec.longitude}&t=k`;
                                              window.open(url, "_blank");
                                            }}
                                            className="px-2 py-1 bg-blue-500 text-white rounded"
                                          >
                                            <FaMapMarkedAlt size={20} />
                                          </button>
                                        </td>

                                        <td className="border p-1">
                                          {rec.match_percentage}
                                        </td>
                                        <td className="border p-1">
                                          {rec.device_brand} {rec.device_model}
                                        </td>
                                        <td className="border p-1">
                                          {rec.device_type}
                                        </td>
                                        <td className="border p-1">
                                          {rec.status}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
