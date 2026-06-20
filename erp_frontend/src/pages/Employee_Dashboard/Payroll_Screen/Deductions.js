import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { Link } from "react-router-dom";

const deductionsData = {
  pf: 4200,
  esi: 1200,
  tax: 5200,
  loans: 1500,
  others: 300,
};

const totalDeductions = Object.values(deductionsData).reduce(
  (a, b) => a + b,
  0
);

export default function Deductions() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">Deductions</h1>
        <p className="text-sm text-gray-600 mb-6">
          Apply PF, ESI, tax, loans, and other deductions.
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Provident Fund (PF)
                </td>
                <td className="py-2 text-gray-900">
                  ₹{deductionsData.pf.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Employee State Insurance (ESI)
                </td>
                <td className="py-2 text-gray-900">
                  ₹{deductionsData.esi.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">Income Tax</td>
                <td className="py-2 text-gray-900">
                  ₹{deductionsData.tax.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Loan Repayment
                </td>
                <td className="py-2 text-gray-900">
                  ₹{deductionsData.loans.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Other Deductions
                </td>
                <td className="py-2 text-gray-900">
                  ₹{deductionsData.others.toLocaleString()}
                </td>
              </tr>
              <tr className="border-t font-semibold text-gray-800">
                <td className="py-3">Total Deductions</td>
                <td className="py-3">₹{totalDeductions.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Link
          to="/payrollprocess"
          className="inline-block mt-6 text-blue-600 hover:underline text-sm"
        >
          ← Back to Payroll Process
        </Link>
      </div>
    </DashboardLayout>
  );
}
