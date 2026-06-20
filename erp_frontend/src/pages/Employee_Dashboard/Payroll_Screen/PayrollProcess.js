// PayrollProcess.js
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Employee Data",
    desc: "Verify employee details, salary structure, and bank information.",
    path: "/employee",
  },
  {
    title: "Attendance & Leave",
    desc: "Process attendance, overtime, leaves, and holidays.",
    path: "/payroll/attendance-leave",
  },
  {
    title: "Earnings Calculation",
    desc: "Calculate basic pay, allowances, incentives, and bonuses.",
    path: "/payroll/earnings-calculation",
  },
  {
    title: "Deductions",
    desc: "Apply PF, ESI, tax, loans, and other deductions.",
    path: "/payroll/deductions",
  },
  {
    title: "Payroll Review",
    desc: "Review payroll summary and validate final amounts.",
    path: "/payslip",
  },
  {
    title: "Salary Disbursement",
    desc: "Transfer salaries to employee bank accounts.",
    path: "/payroll/salary-disbursement",
  },
  {
    title: "Payslips & Reports",
    desc: "Generate payslips and statutory reports.",
    path: "/salary-register",
  },
];

export default function PayrollProcess() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-800 mb-2">
            Payroll Process
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            A simple overview of the monthly payroll workflow
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map(({ title, desc, path }, index) => (
              <Link
                key={index}
                to={path}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-800">
                      {title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
