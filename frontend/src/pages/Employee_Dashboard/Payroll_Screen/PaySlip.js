import React, { useState, useMemo } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Example number to words function (simple version)
const numberToWords = (num) => {
  // You can use a library or implement your own
  // For simplicity, just returning num as string here
  return num.toLocaleString();
};

const payslipData = [
  {
    employee: {
      name: "Intekhab Alam",
      designation: "Project Head",
      empId: "43521",
      doj: "30/06/2020",
      accountNo: "AA/AAA/9999999/99G/9899999",
      eid: "11111111111",
    },
    payslips: [
      {
        month: "November 2025",
        payDate: "30/11/2025",
        earnings: [
          { title: "Basic", amount: 15000, ytd: 165000 },
          { title: "House Rent Allowance", amount: 7500, ytd: 82500 },
          { title: "Conveyance Allowance", amount: 3500, ytd: 38500 },
          { title: "Children Education Allowance", amount: 2500, ytd: 27500 },
          { title: "Fixed Allowance", amount: 2000, ytd: 22000 },
        ],
        deductions: [
          { title: "EPF Contribution", amount: 500, ytd: 0 },
          { title: "Professional Tax", amount: 0, ytd: 0 },
        ],
      },
      {
        month: "December 2025",
        payDate: "31/12/2025",
        earnings: [
          { title: "Basic", amount: 15000, ytd: 180000 },
          { title: "House Rent Allowance", amount: 7500, ytd: 90000 },
          { title: "Conveyance Allowance", amount: 3500, ytd: 42000 },
          { title: "Children Education Allowance", amount: 2500, ytd: 30000 },
          { title: "Fixed Allowance", amount: 2000, ytd: 24000 },
        ],
        deductions: [
          { title: "EPF Contribution", amount: 300, ytd: 0 },
          { title: "Professional Tax", amount: 500, ytd: 0 },
        ],
      },
    ],
  },
  {
    employee: {
      name: "Ashish Yadav",
      designation: "Frontend Developer",
      empId: "55218",
      doj: "15/08/2024",
      accountNo: "AY/BBB/8888888/22H/121212",
      eid: "22222222222",
    },
    payslips: [
      {
        month: "November 2025",
        payDate: "30/11/2025",
        earnings: [
          { title: "Basic", amount: 18000, ytd: 18000 },
          { title: "House Rent Allowance", amount: 8000, ytd: 8000 },
          { title: "Internet Allowance", amount: 2000, ytd: 2000 },
          { title: "Special Allowance", amount: 3000, ytd: 3000 },
        ],
        deductions: [
          { title: "EPF Contribution", amount: 600, ytd: 600 },
          { title: "Professional Tax", amount: 200, ytd: 200 },
        ],
      },
      {
        month: "December 2025",
        payDate: "31/12/2025",
        earnings: [
          { title: "Basic", amount: 18000, ytd: 36000 },
          { title: "House Rent Allowance", amount: 8000, ytd: 16000 },
          { title: "Internet Allowance", amount: 2000, ytd: 4000 },
          { title: "Special Allowance", amount: 3000, ytd: 6000 },
        ],
        deductions: [
          { title: "EPF Contribution", amount: 600, ytd: 1200 },
          { title: "Professional Tax", amount: 200, ytd: 400 },
        ],
      },
    ],
  },
];

export default function Payslip() {
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(
    payslipData[0].payslips[0].month
  );

  // Get selected employee object
  const selectedEmployee = payslipData[selectedEmployeeIndex];

  // Get payslip for selected month
  const selectedPayslip = selectedEmployee.payslips.find(
    (p) => p.month === selectedMonth
  );

  // Calculate totals dynamically
  const grossEarnings = useMemo(() => {
    return selectedPayslip.earnings.reduce((sum, e) => sum + e.amount, 0);
  }, [selectedPayslip]);

  const totalDeductions = useMemo(() => {
    return selectedPayslip.deductions.reduce((sum, d) => sum + d.amount, 0);
  }, [selectedPayslip]);

  const netPay = grossEarnings - totalDeductions;

  const handlePrint = () => {
    const content = document.getElementById("payslip-print").innerHTML;
    const win = window.open("", "_blank", "width=900,height=650");
    win.document.write(`
    <html>
      <head>
        <title>Payslip</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            font-size: 12px; 
            background: white;
            color: #000;
          }
          h1, h2, h3, p, div, span {
            margin: 0;
            padding: 0;
          }
          table {
            width: 100%; 
            border-collapse: collapse; 
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ccc; 
            padding: 6px 8px; 
            vertical-align: top;
          }
          thead {
            background-color: #f3f4f6; /* like Tailwind's bg-gray-100 */
          }
          tbody tr:nth-child(odd) {
            background-color: #f9fafb; /* like Tailwind's bg-gray-50 */
          }
          .font-semibold {
            font-weight: 600;
          }
          .text-right {
            text-align: right;
          }
          .text-xs {
            font-size: 12px;
          }
          .border-t {
            border-top: 1px solid #ccc;
          }
          .mb-4 {
            margin-bottom: 16px;
          }
          .mb-2 {
            margin-bottom: 8px;
          }
          .p-3 {
            padding: 12px;
          }
          .bg-gray-50 {
            background-color: #f9fafb;
          }
          .shadow {
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .flex {
            display: flex;
          }
          .justify-between {
            justify-content: space-between;
          }
          .text-xs.text-gray-500 {
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `);
    win.document.close();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Employee and Month Dropdowns + Print */}
      <div className="flex justify-end items-center gap-3 max-w-4xl mx-auto px-4 mb-2">
        {/* Employee Dropdown */}
        <select
          value={selectedEmployeeIndex}
          onChange={(e) => {
            setSelectedEmployeeIndex(Number(e.target.value));
            // reset month when employee changes
            setSelectedMonth(
              payslipData[Number(e.target.value)].payslips[0].month
            );
          }}
          className="border px-2 py-1 text-sm rounded"
        >
          {payslipData.map((item, index) => (
            <option key={index} value={index}>
              {item.employee.name}
            </option>
          ))}
        </select>

        {/* Month Dropdown */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-2 py-1 text-sm rounded"
        >
          {selectedEmployee.payslips.map((p) => (
            <option key={p.month} value={p.month}>
              {p.month}
            </option>
          ))}
        </select>

        <button
          onClick={handlePrint}
          className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded"
        >
          🖨️ Print Payslip
        </button>
      </div>

      <div
        id="payslip-print"
        className="max-w-4xl mx-auto bg-white shadow p-6 text-sm"
      >
        {/* Header */}
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">JTS Middle East</h1>
            <p className="text-xs text-gray-500">Dubai</p>
          </div>
          <div className="text-right">
            <p className="text-xs">Pay Slip for the Month</p>
            <p className="font-semibold">{selectedPayslip.month}</p>
          </div>
        </div>

        {/* Employee Summary */}
        <div className="border-t pt-3 mb-4">
          <h2 className="font-semibold mb-2">EMPLOYEE SUMMARY</h2>
          {[
            ["Employee Name", selectedEmployee.employee.name],
            ["Designation", selectedEmployee.employee.designation],
            ["Employee ID", selectedEmployee.employee.empId],
            ["Date of Joining", selectedEmployee.employee.doj],
            ["Pay Period", selectedPayslip.month],
            ["Pay Date", selectedPayslip.payDate],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-2 mb-1">
              <span>{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* Account */}
        <div className="flex justify-between mb-4">
          <span>
            A/C Number : <strong>{selectedEmployee.employee.accountNo}</strong>
          </span>
          <span>
            EID : <strong>{selectedEmployee.employee.eid}</strong>
          </span>
        </div>

        {/* Table */}
        <table className="w-full border border-gray-300 text-xs mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                EARNINGS
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                AMOUNT
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                YTD
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                DEDUCTIONS
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                AMOUNT
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                YTD
              </th>
            </tr>
          </thead>

          <tbody>
            {selectedPayslip.earnings.map((e, i) => (
              <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                <td className="border border-gray-300 px-3 py-2">{e.title}</td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {e.amount}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {e.ytd}
                </td>

                <td className="border border-gray-300 px-3 py-2">
                  {selectedPayslip.deductions[i]?.title || ""}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {selectedPayslip.deductions[i]?.amount || ""}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {selectedPayslip.deductions[i]?.ytd || ""}
                </td>
              </tr>
            ))}

            {/* Totals Row */}
            <tr className="font-semibold bg-gray-50">
              <td colSpan="2" className="border border-gray-300 px-3 py-2">
                Gross Earnings
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                {grossEarnings}
              </td>
              <td colSpan="2" className="border border-gray-300 px-3 py-2">
                Total Deductions
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                {totalDeductions}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Net Pay */}
        <div className="flex justify-between p-3 bg-gray-50 border mb-2">
          <div>
            <p className="font-semibold">TOTAL NET PAYABLE</p>
            <p className="text-xs text-gray-500">
              Gross Earnings - Total Deductions
            </p>
          </div>
          <div className="font-bold">{netPay}</div>
        </div>

        {/* Amount in Words */}
        <p className="text-right text-xs mt-2">
          Amount in Words :{" "}
          <span className="font-medium">{numberToWords(netPay)} Only</span>
        </p>
      </div>
    </DashboardLayout>
  );
}
