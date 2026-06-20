import React, { useState } from "react";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { useHeader } from "context/HeaderContext";

export default function InvoiceHeader({ tabValue, setTabValue }) {
  const [subHeader, setSubHeader] = useState([]);

  // Get values from context instead of local state
  const {
    selectedMainHeader,
    setSelectedMainHeader,
    selectedSubHeader,
    setSelectedSubHeader,
  } = useHeader();

  const subHeadersMap = {
    Grn: [
      "Create GRN",
      "Pending GRN",
      "Approved GRN",
      "Rejected GRN",
      "All GRN",
    ],
    "P Orders": [
      "New PO",
      "Pending PO",
      "Approved PO",
      "Cancelled PO",
      "All POs",
    ],
    Orders: [
      "New Order",
      "Pending Order",
      "Shipped Orders",
      "Cancelled",
      "All Orders",
    ],
    Invoices: [
      "New Invoice",
      "Pending Invoice",
      "Paid",
      "Overdue",
      "All Invoices",
    ],
    Sales: ["Monthly", "Quarterly", "Yearly", "Forecast", "Actuals"],
    Purchase: ["Projects", "Products", "Departments", "Regions", "All"],
    Cost: ["Direct Cost", "Indirect Cost", "Overhead", "Misc", "All Costs"],
    Resource: [
      "Allocation",
      "Availability",
      "Skills",
      "Teams",
      "All Resources",
    ],
    Reports: [
      "Sales Report",
      "Expense Report",
      "Profit Report",
      "Inventory",
      "All Reports",
    ],
  };

  const tabLabels = [
    "Home",
    // "Grn",
    "P Orders",
    "Orders",
    // "Invoices",
    "Sales",
    "Purchase",
    // "Cost",
    // "Resource",
    // "Reports",
    // "Settings",
  ];

  const tabIcons = [
    HomeIcon,
    ClipboardDocumentListIcon,
    ClipboardDocumentIcon,
    ShoppingCartIcon,
    DocumentTextIcon,
    ChartBarIcon,
    ChartBarIcon,
    ChartBarIcon,
    ChartBarIcon,
    ChartBarIcon,
    Cog6ToothIcon,
  ];

  const handleTabChange = (newValue) => {
    const label = tabLabels[newValue];
    setTabValue(newValue);
    setSelectedSubHeader(null); // reset subheader
    setSelectedMainHeader(label); // store main header in context
    setSubHeader(subHeadersMap[label] || []);
  };

  const handleSubClick = (sub) => {
    setSelectedSubHeader(sub); // store subheader in context
    alert(`Main Header: ${selectedMainHeader}\nSub Header: ${sub}`);
  };

  return (
    <div>
      {/* Main Header */}
      <div className="bg-blue-900 text-white">
        <div className="flex justify-between items-center">
          {tabLabels.map((label, idx) => {
            const Icon = tabIcons[idx];
            const isSelected = tabValue === idx;
            return (
              <button
                key={idx}
                onClick={() => handleTabChange(idx)}
                className={`flex items-center px-2 py-2 font-semibold text-sm ${
                  isSelected ? "bg-white/20 rounded" : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-header */}
      {subHeader.length > 0 && (
        <div className="flex gap-2 px-4 py-2 bg-gray-200 overflow-x-auto">
          {subHeader.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => handleSubClick(sub)}
              className={`px-3 py-1 text-sm font-medium rounded ${
                selectedSubHeader === sub
                  ? "bg-blue-900 text-white"
                  : "bg-white border border-gray-300 hover:bg-blue-100"
              } whitespace-nowrap`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
