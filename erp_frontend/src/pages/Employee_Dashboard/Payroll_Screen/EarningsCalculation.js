import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { Link } from "react-router-dom";

const earningsData = {
  basicPay: 35000,
  allowances: {
    housing: 8000,
    transport: 3000,
    medical: 1500,
  },
  incentives: 4000,
  bonuses: 2500,
};

const totalEarnings =
  earningsData.basicPay +
  Object.values(earningsData.allowances).reduce((a, b) => a + b, 0) +
  earningsData.incentives +
  earningsData.bonuses;

export default function EarningsCalculation() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          Earnings Calculation
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Calculate basic pay, allowances, incentives, and bonuses.
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">Basic Pay</td>
                <td className="py-2 text-gray-900">
                  ₹{earningsData.basicPay.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Housing Allowance
                </td>
                <td className="py-2 text-gray-900">
                  ₹{earningsData.allowances.housing.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Transport Allowance
                </td>
                <td className="py-2 text-gray-900">
                  ₹{earningsData.allowances.transport.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Medical Allowance
                </td>
                <td className="py-2 text-gray-900">
                  ₹{earningsData.allowances.medical.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">Incentives</td>
                <td className="py-2 text-gray-900">
                  ₹{earningsData.incentives.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">Bonuses</td>
                <td className="py-2 text-gray-900">
                  ₹{earningsData.bonuses.toLocaleString()}
                </td>
              </tr>
              <tr className="border-t font-semibold text-gray-800">
                <td className="py-3">Total Earnings</td>
                <td className="py-3">₹{totalEarnings.toLocaleString()}</td>
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
