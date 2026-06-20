import React, { useState } from "react";
import ItemVisibilityPermission from "./ItemVisibilityPermission";
import DepartmentVisibilitySettings from "./DepartmentVisibilitySetting";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import FamilyVisibilitySettings from "./FamilyVisibilitySettings";

export default function Visibility_Setting() {
  const [activeTab, setActiveTab] = useState("itemVisibility");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-4 max-w-6xl mx-auto font-sans text-xs">
        {/* Buttons on top */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded text-xs font-semibold ${
              activeTab === "itemVisibility"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("itemVisibility")}
          >
            Item Visibility Setting
          </button>

          <button
            className={`px-4 py-2 rounded text-xs font-semibold ${
              activeTab === "departmentSetting"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("departmentSetting")}
          >
            Department Setting
          </button>
          <button
            className={`px-4 py-2 rounded text-xs font-semibold ${
              activeTab === "familySetting"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("familySetting")}
          >
            Family Setting
          </button>
        </div>

        {/* Render based on selected tab */}
        <div>
          {activeTab === "itemVisibility" && <ItemVisibilityPermission />}

          {activeTab === "departmentSetting" && (
            <DepartmentVisibilitySettings />
          )}

          {activeTab === "familySetting" && <FamilyVisibilitySettings />}
        </div>
      </div>
    </DashboardLayout>
  );
}
