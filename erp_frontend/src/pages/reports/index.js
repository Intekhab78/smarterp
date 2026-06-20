import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";

const reportsMenu = [
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

export default function reports() {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <h2 className="text-xl font-bold p-4 border-b">Reports</h2>
          <ul>
            {reportsMenu.map((menu, idx) => (
              <li key={idx}>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-200 flex justify-between items-center"
                  onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                >
                  {menu.title}
                  <span>{activeMenu === idx ? "-" : "+"}</span>
                </button>
                {activeMenu === idx && (
                  <ul className="pl-8 bg-gray-50">
                    {menu.submenus.map((sub, sidx) => (
                      <li
                        key={sidx}
                        className="py-1 hover:text-blue-600 cursor-pointer"
                      >
                        {sub}
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
          <h1 className="text-2xl font-bold mb-4">Report Viewer</h1>

          {/* Example: GRN Details Report */}
          {activeMenu === 1 && (
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold mb-2">GRN Details Report</h2>

              {/* Filter Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <select className="border p-2 rounded">
                  <option>Company</option>
                </select>
                <select className="border p-2 rounded">
                  <option>Location</option>
                </select>
                <input type="date" className="border p-2 rounded" />
                <select className="border p-2 rounded">
                  <option>Status</option>
                  <option>Open</option>
                  <option>Close</option>
                  <option>Partial</option>
                  <option>Cancel</option>
                  <option>Deleted</option>
                </select>
              </div>

              {/* Report Table */}
              <table className="w-full border border-gray-200 text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">GRN No.</th>
                    <th className="p-2 border">Vendor</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">2025-10-01</td>
                    <td className="p-2 border">GRN001</td>
                    <td className="p-2 border">Vendor A</td>
                    <td className="p-2 border">Open</td>
                  </tr>
                  {/* Add more rows dynamically */}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
