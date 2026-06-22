import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import HolidayCalendar from "./HolidayCalendar";
import GovernmentDeduction from "./GovernmentDeduction";

export default function HrPayrollSettings() {
  const [activeTab, setActiveTab] = useState("holiday");

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-lg font-semibold text-gray-800 mb-1">
            HR & Payroll Settings
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Manage holiday calendar and deduction rules
          </p>

          {/* Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("holiday")}
              className={`px-4 py-2 rounded-lg text-xs font-medium border ${
                activeTab === "holiday"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              Holiday Calendar
            </button>

            <button
              onClick={() => setActiveTab("deduction")}
              className={`px-4 py-2 rounded-lg text-xs font-medium border ${
                activeTab === "deduction"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              Tax Investment Slot
            </button>
          </div>

          {/* Content */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            {activeTab === "holiday" && <HolidayCalendar />}
            {activeTab === "deduction" && <GovernmentDeduction />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
