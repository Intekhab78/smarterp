import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import constantApi from "../../constantApi";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";

export default function AttendanceCreate() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    emp_id: "",
    emp_fname: "",
    emp_lname: "",
    month: "",
    today_date: "",
    remark: "",
    checkin: "",
    checkout: "",
  });

  // ✅ Fetch employee list only
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${constantApi.baseUrl}/employee/list`);
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error("❌ Employee fetch error:", err);
        toast.error("Failed to load employees!");
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Submit attendance (create only)
  const handleSubmit = async () => {
    if (!form.emp_id || !form.month || !form.today_date) {
      toast.error("Please select Employee, Month, and Today’s Date");
      return;
    }

    try {
      await axios.post(`${constantApi.baseUrl}/attendance/create`, form);
      toast.success("✅ Attendance created successfully!");

      // 🧹 Clear form after success
      setForm({
        emp_id: "",
        emp_fname: "",
        emp_lname: "",
        month: "",
        today_date: "",
        remark: "",
        checkin: "",
        checkout: "",
      });
    } catch (err) {
      console.error("❌ Save error:", err);
      toast.error("Failed to create attendance!");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2">
            <h1 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
              🕒 Create Attendance
            </h1>
            <span className="text-[11px] bg-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Employee */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Employee
            </label>
            <select
              name="emp_id"
              value={form.emp_id}
              onChange={(e) => {
                const emp = employees.find(
                  (emp) => emp.emp_id === parseInt(e.target.value)
                );
                setForm({
                  ...form,
                  emp_id: e.target.value,
                  emp_fname: emp?.emp_fname || "",
                  emp_lname: emp?.emp_lname || "",
                });
              }}
              className="w-full border rounded-md px-3 py-1.5 text-xs text-gray-700 bg-white focus:ring-1 focus:ring-indigo-400"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.emp_id} value={emp.emp_id}>
                  {emp.emp_fname} {emp.emp_lname} ({emp.emp_id})
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Month
            </label>
            <input
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* Today's Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Today’s Date
            </label>
            <input
              type="date"
              value={form.today_date}
              onChange={(e) => setForm({ ...form, today_date: e.target.value })}
              className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* Remark */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Remark
            </label>
            <input
              type="text"
              placeholder="Enter remark (optional)"
              value={form.remark}
              onChange={(e) => setForm({ ...form, remark: e.target.value })}
              className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* Check-in / Check-out */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Check-in Time
              </label>
              <input
                type="time"
                value={form.checkin}
                onChange={(e) => setForm({ ...form, checkin: e.target.value })}
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Check-out Time
              </label>
              <input
                type="time"
                value={form.checkout}
                onChange={(e) => setForm({ ...form, checkout: e.target.value })}
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-red-300"
              />
            </div>
          </div>

         {/* Save & Cancel Buttons */}
<div className="flex justify-end pt-2 space-x-2">
  {/* <button
    type="button"
    onClick={() => goToNextTab("payroll")} // 👈 back to payroll tab
    className="px-4 py-1.5 bg-gray-300 text-gray-800 text-xs font-semibold rounded-md hover:bg-gray-400 transition"
  >
    ❌ Cancel
  </button> */}
  <button
    onClick={handleSubmit}
    className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition"
  >
    💾 Save
  </button>
</div>

        </div>
      </div>
    </DashboardLayout>
  );
}
