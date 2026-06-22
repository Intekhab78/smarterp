import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constantApi from "../../constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EmployeeContractForm() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    emp_id: "",
    emp_fname: "",
    emp_lname: "",
    designation: "",
    department: "",
    contract_type: "",
    start_date: "",
    end_date: "",
    salary: "",
    benefits: "",
    notice_period: "",
    supervisor: "",
    terms: "",
  });

  // ✅ Fetch employee list
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

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ Submit Contract
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.emp_id || !form.start_date || !form.contract_type) {
      toast.error("Please select Employee, Contract Type, and Start Date");
      return;
    }

    try {
      await axios.post(`${constantApi.baseUrl}/contract/create`, form);
      toast.success("✅ Employee Contract created successfully!");

      // 🧹 Clear form after success
      setForm({
        emp_id: "",
        emp_fname: "",
        emp_lname: "",
        designation: "",
        department: "",
        contract_type: "",
        start_date: "",
        end_date: "",
        salary: "",
        benefits: "",
        notice_period: "",
        supervisor: "",
        terms: "",
      });
    } catch (err) {
      console.error("❌ Save error:", err);
      toast.error("Failed to create contract!");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2">
            <h1 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
              🧾 Employee Contract Form
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
              isSearchable
              placeholder="Select Employee"
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

          {/* Designation / Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Enter designation"
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Enter department"
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Contract Type / Supervisor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Contract Type
              </label>
              <select
                name="contract_type"
                value={form.contract_type}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
              >
                <option value="">Select Contract Type</option>
                <option value="Permanent">Permanent</option>
                <option value="Temporary">Temporary</option>
                <option value="Intern">Intern</option>
                <option value="Consultant">Consultant</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Supervisor
              </label>
              <input
                type="text"
                name="supervisor"
                value={form.supervisor}
                onChange={handleChange}
                placeholder="Enter supervisor name"
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Start / End Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-red-300"
              />
            </div>
          </div>

          {/* Salary / Notice Period */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Salary (₹)
              </label>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Notice Period (Days)
              </label>
              <input
                type="number"
                name="notice_period"
                value={form.notice_period}
                onChange={handleChange}
                placeholder="Enter notice period"
                className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Benefits
            </label>
            <textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              rows="2"
              placeholder="Enter benefits (optional)"
              className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* Terms */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Terms & Conditions
            </label>
            <textarea
              name="terms"
              value={form.terms}
              onChange={handleChange}
              rows="3"
              placeholder="Enter terms & conditions"
              className="w-full border rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition"
            >
              💾 Save Contract
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
