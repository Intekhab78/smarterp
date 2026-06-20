import { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DepartmentList from "pages/Employee_Dashboard/Department_Master/Dep_List";
import SubDepartmentList from "pages/Employee_Dashboard/Department_Master/Sub_Dep_List";
import PositionList from "pages/Employee_Dashboard/Department_Master/Dep_Position_List";

import { FiLayers, FiCheckCircle, FiXCircle, FiUsers } from "react-icons/fi";

export default function DepartmentHome() {
  const [activeTab, setActiveTab] = useState("department");

  const statsData = {
    department: { total: 12, active: 9, inactive: 3, employees: 145 },
    sub: { total: 28, active: 22, inactive: 6, employees: 145 },
    position: { total: 56, active: 48, inactive: 8, employees: 145 },
  };

  const currentStats = statsData[activeTab];

  const tabClass = (tab) =>
    `px-4 py-1.5 text-xs font-medium rounded-full transition-all
     ${activeTab === tab
      ? "bg-blue-600 text-white shadow-sm"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  const statCard = (title, value, icon, bg) => (
    <div className="bg-white px-4 py-3 rounded-lg shadow-sm flex items-center gap-3">
      <div className={`p-2 rounded-full ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-[11px] leading-tight">{title}</p>
        <h2 className="text-xl font-bold leading-tight">{value}</h2>
      </div>
    </div>
  );


  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-3 space-y-3">

        {/* ===== HEADER + TABS ===== */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg shadow-sm">
          <h2 className="text-base font-semibold text-gray-800">
            Department Master
          </h2>

          <div className="flex gap-2">
            <button className={tabClass("department")} onClick={() => setActiveTab("department")}>
              Department
            </button>

            <button className={tabClass("sub")} onClick={() => setActiveTab("sub")}>
              Sub Department
            </button>

            <button className={tabClass("position")} onClick={() => setActiveTab("position")}>
              Position
            </button>
          </div>
        </div>

        {/* ===== STATS CARDS (RESPONSIVE) ===== */}
        {/* ===== IMAGE-STYLE HORIZONTAL CARDS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {statCard(
            "Total",
            currentStats.total,
            <FiLayers size={18} className="text-blue-600" />,
            "bg-blue-50"
          )}

          {statCard(
            "Active",
            currentStats.active,
            <FiCheckCircle size={18} className="text-green-600" />,
            "bg-green-50"
          )}

          {statCard(
            "Inactive",
            currentStats.inactive,
            <FiXCircle size={18} className="text-red-600" />,
            "bg-red-50"
          )}

          {statCard(
            "Employees",
            currentStats.employees,
            <FiUsers size={18} className="text-purple-600" />,
            "bg-purple-50"
          )}

        </div>


        {/* ===== LIST AREA ===== */}
        <div className="bg-white rounded-lg shadow-sm p-0.5 min-h-[60vh]">

          {/* <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-800">
              {activeTab === "department"
                ? "Department List"
                : activeTab === "sub"
                  ? "Sub Department List"
                  : "Position List"}
            </h3>
          </div> */}

          {activeTab === "department" && <DepartmentList />}
          {activeTab === "sub" && <SubDepartmentList />}
          {activeTab === "position" && <PositionList />}
        </div>

      </div>
    </DashboardLayout>
  );
}
