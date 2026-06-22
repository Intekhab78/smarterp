import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constantApi from "../../constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EmployeeContractEdit() {
  const { emp_id } = useParams(); // 👈 get emp_id from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_fname: "",
    emp_lname: "",
    department: "",
    designation: "",
    contract_type: "",
    start_date: "",
    end_date: "",
    salary: "",
    notice_period: "",
    supervisor: "",
    benefits: "",
    terms: "",
  });

  // ✅ Fetch contract details by emp_id
  const fetchContract = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${constantApi.baseUrl}/contract/get/${emp_id}`);
      if (res.data) setFormData(res.data);
      else toast.error("Contract not found!");
    } catch (err) {
      console.error("Error fetching contract:", err);
      toast.error("Failed to fetch contract details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [emp_id]);

  // ✅ Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Update contract by emp_id
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${constantApi.baseUrl}/contract/update/${emp_id}`, formData);
      toast.success("✅ Contract updated successfully!");
      setTimeout(() => navigate("/view_contract"), 1500);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h1 className="text-lg font-semibold text-indigo-700 mb-4">
            ✏️ Edit Contract
          </h1>

          {loading ? (
            <div className="text-center text-gray-600 py-8">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input type="text" name="emp_id" value={formData.emp_id} readOnly
                className="border rounded-lg p-2 text-sm bg-gray-100" />

              <input type="text" name="emp_fname" value={formData.emp_fname}
                onChange={handleChange} className="border rounded-lg p-2 text-sm"
                placeholder="First Name" required />

              <input type="text" name="emp_lname" value={formData.emp_lname}
                onChange={handleChange} className="border rounded-lg p-2 text-sm"
                placeholder="Last Name" required />

              <input type="text" name="department" value={formData.department}
                onChange={handleChange} className="border rounded-lg p-2 text-sm"
                placeholder="Department" />

              <input type="text" name="designation" value={formData.designation}
                onChange={handleChange} className="border rounded-lg p-2 text-sm"
                placeholder="Designation" />

              <select name="contract_type" value={formData.contract_type}
                onChange={handleChange} className="border rounded-lg p-2 text-sm">
                <option value="">Select Type</option>
                <option value="Permanent">Permanent</option>
                <option value="Temporary">Temporary</option>
                <option value="Intern">Intern</option>
              </select>

              <input type="date" name="start_date" value={formData.start_date}
                onChange={handleChange} className="border rounded-lg p-2 text-sm" />
              <input type="date" name="end_date" value={formData.end_date || ""}
                onChange={handleChange} className="border rounded-lg p-2 text-sm" />

              <input type="number" name="salary" value={formData.salary}
                onChange={handleChange} className="border rounded-lg p-2 text-sm"
                placeholder="Salary" />

              <input type="number" name="notice_period" value={formData.notice_period}
                onChange={handleChange} className="border rounded-lg p-2 text-sm"
                placeholder="Notice Period (Days)" />

              <input type="text" name="supervisor" value={formData.supervisor}
                onChange={handleChange} className="border rounded-lg p-2 text-sm"
                placeholder="Supervisor" />

              <textarea name="benefits" value={formData.benefits}
                onChange={handleChange}
                className="border rounded-lg p-2 text-sm col-span-2 h-20"
                placeholder="Benefits"></textarea>

              <textarea name="terms" value={formData.terms}
                onChange={handleChange}
                className="border rounded-lg p-2 text-sm col-span-2 h-20"
                placeholder="Terms and Conditions"></textarea>

              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => navigate("/view_contract")}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                  {loading ? "Saving..." : "Update Contract"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
