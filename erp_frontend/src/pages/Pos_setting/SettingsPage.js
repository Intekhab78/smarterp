import React, { useState } from "react";
import {
  FaCog,
  FaUsers,
  FaGlobe,
  FaBuilding,
  FaRegCircle,
} from "react-icons/fa";
import { TbReceiptTax } from "react-icons/tb";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import RegisterSetting from "./RegisterSetting";
import TaxSettings from "./TaxSettings";
import GrnSetting from "./GrnSetting";
import SalesSetting from "./SalesSetting";
import SalesMainPage from "./SalesMainPage";

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("general");

  // Pages
  const menuData = {
    general: (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">General Settings</h2>
        <p className="text-gray-600 text-sm">
          Configure system-wide global preferences here.
        </p>
      </div>
    ),

    currency: (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">
          Currency Denomination Settings
        </h2>
        <RegisterSetting />
      </div>
    ),

    tax: (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">Tax Settings</h2>
        <TaxSettings />
      </div>
    ),

    sales: (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <SalesMainPage />
      </div>
    ),

    grn: (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">GRN Settings</h2>
        <GrnSetting />
      </div>
    ),

    website: (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">Website Settings</h2>
        <p className="text-gray-600 text-sm">Manage website configuration.</p>
      </div>
    ),

    inventory: (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">Inventory Settings</h2>
        <p className="text-gray-600 text-sm">
          Configure stock and inventory behavior.
        </p>
      </div>
    ),
    // hr_Payroll: (
    //   <div className="bg-white p-6 rounded-xl shadow-md">
    //     <h2 className="text-xl font-semibold mb-3">HR & Payroll Settings</h2>
    //     <p className="text-gray-600 text-sm">
    //       Configure stock and inventory behavior.
    //     </p>
    //   </div>
    // ),
  };

  // Sidebar items
  const menuItems = [
    { key: "general", label: "General Settings", icon: <FaCog size={18} /> },
    {
      key: "currency",
      label: "Currency Denomination",
      icon: <FaCog size={18} />,
    },
    { key: "sales", label: "Sales", icon: <FaUsers size={18} /> },
    { key: "grn", label: "GRN Settings", icon: <FaUsers size={18} /> },
    { key: "tax", label: "Tax Settings", icon: <TbReceiptTax size={18} /> },
    { key: "website", label: "Website", icon: <FaGlobe size={18} /> },
    { key: "inventory", label: "Inventory", icon: <FaBuilding size={18} /> },
    // {
    //   key: "hr_Payroll",
    //   label: "HR & Payroll",
    //   icon: <FaBuilding size={18} />,
    // },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-xl p-5 border-r border-gray-200">
          <h2 className="text-lg font-semibold mb-6 tracking-wide">Settings</h2>

          {/* Menu List */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    activeMenu === item.key
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {/* Icon Holder */}
                <div
                  className={`p-2 rounded-full flex items-center justify-center transition-all
                    ${
                      activeMenu === item.key
                        ? "bg-white text-blue-600"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  {item.icon}
                </div>

                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {menuData[activeMenu]}
        </main>
      </div>
    </DashboardLayout>
  );
}
