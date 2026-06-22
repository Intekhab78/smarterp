import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";

const payslipData = [
  {
    id: 1,
    empId: "EMP001",
    name: "Rahul Sharma",
    month: "December 2025",
    department: "Engineering",
    netSalary: "₹45,000",
    status: "Generated",
  },
  {
    id: 2,
    empId: "EMP002",
    name: "Anita Verma",
    month: "December 2025",
    department: "HR",
    netSalary: "₹38,500",
    status: "Generated",
  },
  {
    id: 3,
    empId: "EMP003",
    name: "Mohit Singh",
    month: "December 2025",
    department: "Finance",
    netSalary: "₹52,200",
    status: "Pending",
  },
];

export default function PayslipsAndReports() {
  const [data] = useState(payslipData);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-800 mb-1">
            Payslips & Reports
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Generate and manage employee payslips and statutory reports
          </p>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Employee</th>
                  <th className="px-4 py-3 text-left font-medium">Emp ID</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Month</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Net Salary
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.empId}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.department}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.month}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {item.netSalary}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                          item.status === "Generated"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                        View Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
