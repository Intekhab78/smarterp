import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import WorkTab from "./WorkTab";
import CertificationsTab from "./CertificationsTab";
import PersonalTab from "./PersonalTab";
import DocumentsTab from "./DocumentsTab";
import PayrollTab from "./payroll";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams } from "react-router-dom";
import Settings from "./Settings";
import { useNavigate } from "react-router-dom";
import constantApi from "constantApi";
import { getCurrentUser } from "utils/currentUser";
import PayrollScreen from "./Payroll_Screen/PayrollScreen";
import ManagerHierarchy from "./ManagerHierarchy";
import Leave from "./NewLeavePage";
import ManagerLeave from "./Manager/ManagerLeavePage";
import LeaveMaster from "./Leave/LeaveMasterPage";
export default function Emp_dashboard() {
  const navigate = useNavigate();
  const goToNewEmployee = () => {
    navigate("/new_employee"); // 👈 your route path
  };
  const [activeTab, setActiveTab] = useState("Work");
  const { emp_id } = useParams();
  // console.log("✅ emp_id", emp_id); // print whole response

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    "Work",
    "Certifications",
    "Personal",
    "Documents",
    "Leave",
    "Attendance",
    // "Manager",
    // "LeaveM",
    "Payroll",
    "Hierarchy",
    // "Settings",
  ];
  //define login here for user edit and save button and move evry where
  const [userRole, setUserRole] = useState();
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserRole(currentUser.role_id);
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/employee/details/${emp_id}`)
      .then((res) => {
        console.log("✅ API Response: for emp details", res.data.data); // print whole response
        // setEmployee(emp);
        setEmployee(res.data.data);
      })
      .catch((err) => {
        console.error("❌ API Error:", err); // print error
        setError(err.message || "Failed to fetch employee");
      });
  }, []);

  // Navigate to details
  const handleClick = (id) => {
    navigate(`/employee_dept/${id}`);
  };

  // UI states
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="p-6">Loading employee...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="p-6 text-red-600">Error: {error}</div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="p-6">Loading employee...</div>
      </DashboardLayout>
    );
  }

  // original UI
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50 p-6 text-sm">
        <Header />
        <div className="max-w-6xl mx-auto bg-white shadow rounded-lg">
          {/* Header */}
          <header className="border-b px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <button className="px-2 py-1 border rounded">Launch Plan</button>
              <button className="px-2 py-1 border rounded">
                Signature Request
              </button> */}
            </div>
            <div className="flex items-center gap-2">
              {/* <button className="px-2 py-1 border rounded">Contacts</button> */}
              <button className="px-2 py-1 border rounded">Versions-2.5</button>
              <button className="px-2 py-1 border rounded bg-gray-200">
                12-jan-2026
              </button>
              <button
                onClick={goToNewEmployee}
                className="px-2 py-1 border rounded bg-purple-600 text-white"
              >
                +
              </button>
            </div>
          </header>

          {/* Profile Section */}
          <div className="flex items-start gap-3 p-4 border-b bg-white">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden border shadow relative cursor-pointer">
              {employee.emp_profile_pic ? (
                <img
                  src={`${constantApi.imageUrl}/Employee_profile/${employee.emp_profile_pic}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-red-600 text-white text-2xl font-bold flex items-center justify-center">
                  {employee.emp_fname?.charAt(0) || "?"}
                </div>
              )}
              {/* File input */}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEmployee({ ...employee, emp_profile_pic_file: file }); // store file temporarily
                    alert("✅ Profile pic selected. Save in Work tab!");
                  }
                }}
              />
            </div>

            {/* Editable Info */}
            <div className="flex-1 space-y-3">
              <input
                type="text"
                name="emp_fname"
                value={employee.emp_fname}
                onChange={(e) =>
                  setEmployee({ ...employee, emp_fname: e.target.value })
                }
                placeholder="Full Name"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1 text-lg font-semibold"
              />

              <input
                type="email"
                name="emp_email"
                value={employee.emp_email}
                onChange={(e) =>
                  setEmployee({ ...employee, emp_email: e.target.value })
                }
                placeholder="Email"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1"
              />

              <input
                type="text"
                name="emp_phone"
                value={employee.emp_phone}
                onChange={(e) =>
                  setEmployee({ ...employee, emp_phone: e.target.value })
                }
                placeholder="emp_phone"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1"
              />

              <input
                type="text"
                name="emp_address"
                value={employee.emp_address}
                onChange={(e) =>
                  setEmployee({ ...employee, emp_address: e.target.value })
                }
                placeholder="emp_address"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1 italic"
              />
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-2 px-6 py-2 border-b bg-gray-50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-t ${activeTab === tab
                  ? "bg-white border border-b-0 font-medium"
                  : "text-gray-600 hover:text-black"
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "Work" && (
              <WorkTab
                employee={employee}
                setEmployee={setEmployee}
                emp_id={emp_id}
                userRole={userRole}
              />
            )}
            {activeTab === "Certifications" && (
              <CertificationsTab
                employee={employee}
                emp_id={emp_id}
                userRole={userRole}
              />
            )}
            {activeTab === "Personal" && (
              <PersonalTab
                employee={employee}
                emp_id={emp_id}
                userRole={userRole}
              />
            )}
            {activeTab === "Documents" && (
              <DocumentsTab employeeId={emp_id} userRole={userRole} />
            )}

            {/* this is taken form the manager page */}
            {activeTab === "Leave" && (
              <Leave
                employee={employee}
                emp_id={emp_id}
                userRole={userRole}
                emp_email={employee.emp_email}
              />
            )}

            {activeTab === "Attendance" && (
              <PayrollScreen
                employee={employee}
                emp_id={emp_id}
                userRole={userRole}
                emp_email={employee.emp_email}
              />
            )}

            {activeTab === "Manager" && (
              <ManagerLeave
                employee={employee}
                emp_id={emp_id}
                userRole={userRole}
                emp_email={employee.emp_email}
              />
            )}
            {activeTab === "LeaveM" && (
              <LeaveMaster
                employee={employee}
                emp_id={emp_id}
                userRole={userRole}
                emp_email={employee.emp_email}
              />
            )}
            {activeTab === "Payroll" && (
              <PayrollTab
                employee={employee}
                emp_id={emp_id}
                userRole={userRole}
              />
            )}
            {activeTab === "Hierarchy" && (
              <ManagerHierarchy
                employee={employee}
                emp_id={emp_id}
                userRole={userRole}
              />
            )}

            {activeTab === "Settings" && (
              <Settings emp_id={emp_id} userRole={userRole} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
