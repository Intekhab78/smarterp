import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

const reportsMenu = [
  {
    title: "Report",
    submenus: ["Order Report"],
    link: "/order-report",
  },
  {
    title: "Master Report",
    submenus: [
      "Company Master",
      "Location Master",
      "Items Master",
      "UOM Master",
      "User Master",
      "User Rights",
    ],
  },
  {
    title: "Purchase",
    submenus: [
      "Purchase Order",
      "Open Purchase Order",
      "Partial Purchase Order",
      "Close Purchase Order",
      "GRN Details Report",
    ],
    link: "/order-report",
  },
  {
    title: "Sales",
    submenus: ["POs and Sales"],
  },
  {
    title: "Inventory",
    submenus: ["Inventory Reports"],
  },
  {
    title: "Stock",
    submenus: ["Stock Movement", "Stock on Hand", "Running Stock"],
  },
];

export default function ReportPage() {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const handleSubmenuClick = (menu, sub) => {
    if (menu.title === "Report" && sub === "Order Report") {
      navigate(menu.link);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <div className="p-4 border-b flex items-center gap-2">
            <FileText className="text-blue-600 w-5 h-5" />
            <h2 className="text-sm font-semibold tracking-wide text-gray-800">
              Reports Dashboard
            </h2>
          </div>

          <ul className="p-2 space-y-1 text-sm">
            {reportsMenu.map((menu, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 ${
                    activeMenu === idx
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {menu.title}
                  {activeMenu === idx ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {activeMenu === idx && (
                  <ul className="ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3 text-gray-600">
                    {menu.submenus.map((sub, sidx) => (
                      <li
                        key={sidx}
                        onClick={() => handleSubmenuClick(menu, sub)}
                        className="py-1.5 cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all duration-150 text-xs"
                      >
                        • {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5">
            <h1 className="text-lg font-semibold text-gray-800 mb-4">
              Report Viewer
            </h1>

            {/* GRN Details Report Example */}
            {activeMenu === 1 && (
              <div className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                <h2 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">
                  GRN Details Report
                </h2>

                {/* Filter Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
                  <select className="border p-2 rounded-md focus:ring-1 focus:ring-blue-400 outline-none">
                    <option>Company</option>
                  </select>
                  <select className="border p-2 rounded-md focus:ring-1 focus:ring-blue-400 outline-none">
                    <option>Location</option>
                  </select>
                  <input
                    type="date"
                    className="border p-2 rounded-md focus:ring-1 focus:ring-blue-400 outline-none"
                  />
                  <select className="border p-2 rounded-md focus:ring-1 focus:ring-blue-400 outline-none">
                    <option>Status</option>
                    <option>Open</option>
                    <option>Close</option>
                    <option>Partial</option>
                    <option>Cancel</option>
                    <option>Deleted</option>
                  </select>
                </div>

                {/* Report Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-200 rounded-lg">
                    <thead className="bg-blue-50 text-gray-700">
                      <tr>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">GRN No.</th>
                        <th className="p-2 border">Vendor</th>
                        <th className="p-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-blue-50 transition">
                        <td className="p-2 border">2025-10-01</td>
                        <td className="p-2 border">GRN001</td>
                        <td className="p-2 border">Vendor A</td>
                        <td className="p-2 border text-green-600 font-medium">
                          Open
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
