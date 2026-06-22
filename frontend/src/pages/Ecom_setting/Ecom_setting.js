import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Pr_setting from "./Pr_setting";
import CompanyLocationItemSetting from "./CompanyLocationItemSetting";
import Pr_mapping from "./Pr_mapping";
import EcomHomeSectionManager from "./EcomHomeSectionManager";
import EcomHomeSectionItemManager from "./EcomHomeSectionItemManager";

const Ecom_setting = () => {
  const [activeTab, setActiveTab] = useState("pr"); // default to PR tab

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-4 flex gap-4">
        <button
          onClick={() => setActiveTab("pr")}
          className={`px-2 py-1 rounded text-sm ${
            activeTab === "pr" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          PR Item Upload
        </button>
        <button
          onClick={() => setActiveTab("setting")}
          className={`px-2 py-1 rounded  text-sm ${
            activeTab === "setting" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Setting
        </button>
        <button
          onClick={() => setActiveTab("pr_mapping")}
          className={`px-2 py-1 rounded  text-sm ${
            activeTab === "pr_mapping"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          PR Mapping
        </button>
        <button
          onClick={() => setActiveTab("home_section")}
          className={`px-2 py-1 rounded  text-sm ${
            activeTab === "home_section"
              ? "bg-blue-900 text-white"
              : "bg-gray-200"
          }`}
        >
          Home Section
        </button>
        <button
          onClick={() => setActiveTab("home_section_item")}
          className={`px-2 py-1 rounded  text-sm ${
            activeTab === "home_section_item"
              ? "bg-blue-900 text-white"
              : "bg-gray-200"
          }`}
        >
          Home Section Item
        </button>
      </div>

      <div className="p-4">
        {activeTab === "pr" && <Pr_setting />}
        {activeTab === "setting" && <CompanyLocationItemSetting />}
        {activeTab === "pr_mapping" && <Pr_mapping />}
        {activeTab === "home_section" && <EcomHomeSectionManager />}
        {activeTab === "home_section_item" && <EcomHomeSectionItemManager />}
      </div>
    </DashboardLayout>
  );
};

export default Ecom_setting;
