import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MonthYearSelector({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  filterStatus,
  setFilterStatus,
}) {
  const navigate = useNavigate();

  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const role_id = Number(localStorage.getItem("role_id"));
    if (role_id) {
      console.log("Employee ID from localStorage:", role_id);

      setRoleId(role_id);
    }
  }, []);
  return (
    <div className="mt-4">
      {roleId === 5 && (
        <div className="flex justify-end pe-8">
          <button
            onClick={() => navigate("/managerpage")}
            className="px-2 py-1 bg-blue-600 text-sm text-white rounded"
          >
            Attendance Aprrove
          </button>
        </div>
      )}

      <div className="flex  items-center gap-8 w-full">
        {/* FROM DATE */}
        <div className="flex flex-col">
          <label className="text-[10px] font-semibold text-gray-600">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded-md text-xs shadow-sm focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* TO DATE */}
        <div className="flex flex-col">
          <label className="text-[10px] font-semibold text-gray-600">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded-md text-xs shadow-sm focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
