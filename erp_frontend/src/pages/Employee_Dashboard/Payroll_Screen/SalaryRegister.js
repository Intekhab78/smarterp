import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";

const employees = [
  {
    id: 1110,
    name: "Ashish Yadav",
    dept: 1,
    workdays: 30,
    daysWorked: 21,
    basic: 22000,
    da: 2200,
    pf: 1100,
    esi: 0,
    hra: 8800,
    medical: 2000,
    earnings: 35000,
    deductions: 1100,
    net: 33900,
  },
  {
    id: 1111,
    name: "Mohit Maurya",
    dept: 1,
    workdays: 30,
    daysWorked: 20,
    basic: 23000,
    da: 2300,
    pf: 1150,
    esi: 0,
    hra: 9200,
    medical: 2000,
    earnings: 36500,
    deductions: 1150,
    net: 35350,
  },
  {
    id: 1112,
    name: "Faisal Khan",
    dept: 2,
    workdays: 30,
    daysWorked: 22,
    basic: 25000,
    da: 2500,
    pf: 1250,
    esi: 500,
    hra: 10000,
    medical: 2200,
    earnings: 40000,
    deductions: 1750,
    net: 38250,
  },
  {
    id: 1113,
    name: "Zia Ali",
    dept: 2,
    workdays: 30,
    daysWorked: 19,
    basic: 21000,
    da: 2100,
    pf: 1050,
    esi: 450,
    hra: 8400,
    medical: 1900,
    earnings: 35500,
    deductions: 1500,
    net: 34000,
  },
  {
    id: 1114,
    name: "Adal Hussain",
    dept: 3,
    workdays: 30,
    daysWorked: 25,
    basic: 28000,
    da: 2800,
    pf: 1400,
    esi: 600,
    hra: 11200,
    medical: 2500,
    earnings: 45500,
    deductions: 2000,
    net: 43500,
  },
  {
    id: 1115,
    name: "Intekhab Alam",
    dept: 3,
    workdays: 30,
    daysWorked: 23,
    basic: 26000,
    da: 2600,
    pf: 1300,
    esi: 550,
    hra: 10400,
    medical: 2300,
    earnings: 42200,
    deductions: 1850,
    net: 40350,
  },
];

export default function SalaryRegister() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6 text-[11px] text-gray-800 font-sans bg-white">
        {/* Header */}
        <div className="border-b pb-2 mb-3">
          <h1 className="text-sm font-semibold">JTSMiddle East FZE</h1>
          <p className="text-[10px]">
            SRTIP Free Zone,Block B - B20-017, Sharjah, UAE
          </p>
        </div>

        <h2 className="text-xs font-semibold mb-3">
          Salary Register for the period of May 2024
        </h2>

        {/* Table */}
        <div className="overflow-x-auto border">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="px-2 py-1 border">Sl</th>
                <th className="px-2 py-1 border">Emp ID</th>
                <th className="px-2 py-1 border text-left">Name</th>
                <th className="px-2 py-1 border">Dept</th>
                <th className="px-2 py-1 border">Workdays</th>
                <th className="px-2 py-1 border">Days</th>
                <th className="px-2 py-1 border">Basic</th>
                <th className="px-2 py-1 border">DA</th>
                <th className="px-2 py-1 border">PF</th>
                <th className="px-2 py-1 border">ESI</th>
                <th className="px-2 py-1 border">HRA</th>
                <th className="px-2 py-1 border">Medical</th>
                <th className="px-2 py-1 border">Earnings</th>
                <th className="px-2 py-1 border">Deductions</th>
                <th className="px-2 py-1 border">Net Pay</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id} className="border-b">
                  <td className="px-2 py-1 border text-center">{index + 1}</td>
                  <td className="px-2 py-1 border text-center">{emp.id}</td>
                  <td className="px-2 py-1 border">{emp.name}</td>
                  <td className="px-2 py-1 border text-center">{emp.dept}</td>
                  <td className="px-2 py-1 border text-center">
                    {emp.workdays}
                  </td>
                  <td className="px-2 py-1 border text-center">
                    {emp.daysWorked}
                  </td>
                  <td className="px-2 py-1 border text-right">{emp.basic}</td>
                  <td className="px-2 py-1 border text-right">{emp.da}</td>
                  <td className="px-2 py-1 border text-right">{emp.pf}</td>
                  <td className="px-2 py-1 border text-right">{emp.esi}</td>
                  <td className="px-2 py-1 border text-right">{emp.hra}</td>
                  <td className="px-2 py-1 border text-right">{emp.medical}</td>
                  <td className="px-2 py-1 border text-right">
                    {emp.earnings}
                  </td>
                  <td className="px-2 py-1 border text-right">
                    {emp.deductions}
                  </td>
                  <td className="px-2 py-1 border text-right font-medium">
                    {emp.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-4 text-[10px]">
          <p>Location: Dubai</p>
          <p className="italic">Authorized Signature</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
