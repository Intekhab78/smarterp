import React from "react";

export default function EmployeeDropdown({
  employeeList,
  filteredEmployees,
  inputValue,
  setInputValue,
  open,
  setOpen,
  wrapperRef,
  selectedEmail,
  handleSelectEmployee,
  handleChooseAll,
  month,
  setMonth,
  year,
  setYear,

  // NEW PROPS
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  filterStatus,
  setFilterStatus,
}) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="w-full mb-4 space-y-4">
      {/* --------------------- EMPLOYEE SELECT DROPDOWN --------------------- */}
      <div className="relative w-80" ref={wrapperRef}>
        {/* <label className="block text-xs text-gray-600 mb-1">Employee</label> */}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          placeholder="Select employee..."
          className="border px-3 py-2 rounded w-full text-sm shadow-sm pr-14"
          // Added pr-14 for right padding to fit buttons
        />

        {/* Clear + toggle icon inside input */}
        <div className="absolute right-2 top-1/2  transform -translate-y-1/2 flex gap-1">
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setOpen(true);
              }}
              className="text-xs bg-gray-200 px-2 rounded hover:bg-gray-300"
              aria-label="Clear input"
              type="button"
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs bg-gray-200 px-2 rounded hover:bg-gray-300"
            aria-label="Toggle dropdown"
            type="button"
          >
            ▾
          </button>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute bg-white border rounded w-full max-h-48 overflow-auto mt-1 shadow z-20">
            <div
              onClick={handleChooseAll}
              className={`p-2 text-sm cursor-pointer hover:bg-gray-100 ${
                selectedEmail === "" && "bg-gray-50 font-medium"
              }`}
            >
              All Employees
            </div>

            {filteredEmployees?.length === 0 ? (
              <div className="p-2 text-xs text-gray-500">No match found</div>
            ) : (
              filteredEmployees.map((emp) => (
                <div
                  key={emp.emp_id}
                  onClick={() => handleSelectEmployee(emp.emp_email)}
                  className={`p-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    selectedEmail === emp.emp_email
                      ? "bg-gray-50 font-medium"
                      : ""
                  }`}
                >
                  {emp.emp_fname} {emp.emp_lname} — {emp.emp_email}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
