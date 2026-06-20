// New_Employee.jsx
import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Header from "./Header";
import WorkTab from "./WorkTab";
import CertificationsTab from "./CertificationsTab";
import PersonalTab from "./PersonalTab";
import DocumentsTab from "./DocumentsTab";
import PayrollTab from "./payroll";
import Settings from "./Settings";
import axios from "axios";
import constantApi from "constantApi";

export default function New_Employee() {
  const [activeTab, setActiveTab] = useState("Work");

  const [empId, setEmpId] = useState(null); // NEW: store employee ID after creation

  // Employee state (empty by default). No dummy data per your request.
  const [employee, setEmployee] = useState({
    profile: {
      title: "",
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      location: "",
      avatar: null,
    },
    work: {
      department: "",
      position: "",
      title: "",
      manager: "",
      address: "",
      resume: null,
      certificates: [],
    },
  });

  const tabs = [
    "Work",
    "Certifications",
    "Personal",
    "Documents",
    "Payroll",
    // "Settings",
  ];

  // Go to next tab (used for stepper-like behavior)
  const goToNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  //------------

  // Handle image upload (profile)
  const handleAvatarUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEmployee({
        ...employee,
        profile: {
          ...employee.profile,
          avatar: URL.createObjectURL(e.target.files[0]), // preview
          avatarFile: e.target.files[0], // actual file
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50 p-6 text-sm">
        <Header />

        <div className="max-w-6xl mx-auto bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Section */}
          <div className="flex items-start gap-6 p-6 border-b bg-white">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <label htmlFor="avatarUpload" className="cursor-pointer">
                {employee.avatar ? (
                  <img
                    src={employee.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border shadow"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs border shadow">
                    Upload
                  </div>
                )}
              </label>
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarUpload} // ✅ FIXED
                className="hidden"
              />
            </div>

            <div className="flex-1 space-y-3">
              {/* Title Dropdown */}
              <select
                name="title"
                value={employee.profile.title || ""}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    profile: { ...employee.profile, title: e.target.value },
                  })
                }
                className="w-1/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1 font-semibold"
              >
                <option value="">Select Title</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
              <br></br>

              {/* Full Name Input */}
              <input
                type="text"
                name="fname"
                value={employee.profile.firstname}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    profile: { ...employee.profile, firstname: e.target.value },
                  })
                }
                placeholder="First Name"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1 font-semibold"
              />

              {/* Last Name Input */}

              <input
                type="text"
                name="lname"
                value={employee.profile.lastname}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    profile: { ...employee.profile, lastname: e.target.value },
                  })
                }
                placeholder="Last Name"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1 "
              />

              {/* Email Input */}
              <input
                type="email"
                name="email"
                value={employee.profile.email}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    profile: { ...employee.profile, email: e.target.value },
                  })
                }
                placeholder="Email"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1"
              />

              {/* Mobile Input */}
              <input
                type="text"
                name="mobile"
                value={employee.profile.mobile}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    profile: { ...employee.profile, mobile: e.target.value },
                  })
                }
                placeholder="Mobile"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1"
              />

              {/* Location Input */}
              {/* <input
                type="text"
                name="location"
                value={employee.profile.location}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    profile: { ...employee.profile, location: e.target.value },
                  })
                }
                placeholder="Location"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1 italic"
              /> */}
              {/* Department Input */}
              {/* <input
                type="text"
                name="departmentId"
                value={employee.profile.departmentId}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    profile: {
                      ...employee.profile,
                      departmentId: e.target.value,
                    },
                  })
                }
                placeholder="Department Id"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1"
              /> */}

              {/* Designation Input */}
              {/* <input
                type="text"
                name="designation"
                value={employee.profile.designation}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    profile: {
                      ...employee.profile,
                      designation: e.target.value,
                    },
                  })
                }
                placeholder="Designation"
                className="w-3/5 border-b border-gray-400 focus:outline-none focus:border-purple-600 p-1"
              /> */}
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-2 px-6 py-2 border-b bg-gray-50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-white border border-b-0 shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Tab Content - pass goToNextTab down to components that can advance */}
          <div className="p-6">
            {activeTab === "Work" && (
              <WorkTab
                employee={employee}
                setEmployee={setEmployee}
                goToNextTab={goToNextTab}
              />
            )}
            {activeTab === "Certifications" && (
              <CertificationsTab
                employee={employee}
                setEmployee={setEmployee}
                goToNextTab={goToNextTab}
              />
            )}

            {activeTab === "Personal" && (
              <PersonalTab
                employee={employee}
                // emp_id={employee?.id}
                setEmployee={setEmployee}
                goToNextTab={goToNextTab}
              />
            )}

            {activeTab === "Documents" && (
              <DocumentsTab
                employee={employee}
                setEmployee={setEmployee}
                employeeId={employee.emp_id} // ✅ correct
                goToNextTab={goToNextTab}
              />
            )}
            {activeTab === "Payroll" && (
              <PayrollTab
                employee={employee}
                setEmployee={setEmployee}
                goToNextTab={goToNextTab}
              />
            )}
            {activeTab === "Settings" && (
              <Settings
                employee={employee}
                setEmployee={setEmployee}
                goToNextTab={goToNextTab}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
