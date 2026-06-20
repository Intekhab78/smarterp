// EmployeeRoleRedirect.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import EmployeeList from "pages/Employee_Dashboard/Employee";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "utils/currentUser";
import { toast } from "react-toastify";

export default function EmployeeRoleRedirect() {
  const currentUser = getCurrentUser();

  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 IMPORTANT

  // Load user role + email
  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role_id);
      setUserEmail(currentUser.email);
    }
  }, []);

  // Load and filter employee data
  useEffect(() => {
    if (!userEmail) return;

    axios
      .get(`${constantApi.baseUrl}/employee/list`)
      .then((res) => {
        const filtered = res.data.data.filter(
          (emp) => emp.emp_email === userEmail
        );

        console.log("🎯 Filtered Employee:", filtered);

        setEmployeeData(filtered || []);
        setLoading(false); // 👈 now data is ready
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
        toast.error("Failed to load employee data!");
        setLoading(false);
      });
  }, [userEmail]);

  // 🛑 WAIT UNTIL DATA LOADS
  if (loading) return null;

  // ⛔ If role = 2 → redirect ONLY after employeeData is loaded
  if (userRole === 2) {
    const empId = employeeData[0]?.emp_id;

    console.log("👉 Redirecting to emp ID:", empId);

    if (empId) {
      return <Navigate to={`/employee_details/${empId}`} replace />;
    }

    // fallback if employeeData not found
    return <div className="p-4 text-red-600">Employee not found!</div>;
  }

  // Default
  return <EmployeeList />;
}
