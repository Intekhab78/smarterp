import axios from "axios";
import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useRef, useState } from "react";

import EmployeeDropdown from "./EmployeeDropdown";
import MonthYearSelector from "./MonthYearSelector";
import AttendanceCalendar from "./AttendanceCalendar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useLocation, useParams } from "react-router-dom";
import { axios_post } from "../../../axios";

export default function PayrollScreen({
  emp_id,
  userRole,
  employee,
  emp_email,
}) {
  const location = useLocation();
  const isEmployeeDetailsPage =
    location.pathname.startsWith("/employee_details/");
  const isPayrollScreen = location.pathname === "/payrollscreen";
  const { id: urlEmpId } = useParams(); // /employee_details/1 → 1

  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const role_id = Number(localStorage.getItem("role_id"));
    if (role_id) {
      setRoleId(role_id);
    }
  }, []);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [data, setData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Dropdown search input
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Month / Year state for calendar
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0–11
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);

  useEffect(() => {
    if (!isEmployeeDetailsPage) return;
    if (!urlEmpId) return;
    if (employeeList.length === 0) return;

    const emp = employeeList.find((e) => Number(e.emp_id) === Number(urlEmpId));

    if (emp) {
      setSelectedEmail(emp.emp_email);
      setInputValue(`${emp.emp_fname} ${emp.emp_lname} - ${emp.emp_email}`);
    }
  }, [isEmployeeDetailsPage, urlEmpId, employeeList]);

  const isLockedUser = isEmployeeDetailsPage;

  // Fetch payroll records
  useEffect(() => {
    fetch(`${constantApi.baseUrl}/attendance_payroll/list`)
      .then((res) => {
        console.log("Raw response:", res);
        return res.json();
      })
      .then((json) => {
        // console.log("API Response JSON 👉", json);
        // If API returns data inside a key, adjust here
        setData(Array.isArray(json) ? json : json?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Payroll API Error ❌", err);
        setLoading(false);
      });
  }, []);

  // Fetch employee list
  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/employee/list`)
      .then((res) => setEmployeeList(res.data.data || []))
      .catch((err) => console.log(err));
  }, []);

  const getEmployeeName = (id) => {
    const emp = employeeList.find((e) => e.emp_id === id);
    if (!emp) return ""; // or return "Unknown"
    return `${emp.emp_fname} ${emp.emp_lname}`;
  };

  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    console.log("fetch company list ", response.data);

    if (response) {
      if (response.status) {
        let companies = response.data;

        // If any company has is_main_comp = "yes", keep only those
        const mainCompanies = companies.filter((c) => c.is_main_comp != "yes");

        if (mainCompanies.length > 0) {
          setCompines(mainCompanies);
        } else {
          setCompines(companies);
        }
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchlocationList = async () => {
    const response = await axios_post(true, "location/loc_list");
    if (response) {
      if (response.status) {
        setlocations(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  useEffect(() => {
    fetchcompanyList();
    fetchlocationList();
  }, []);

  // Auto select employee if userRole = 2
  useEffect(() => {
    if (isLockedUser && employee?.emp_email) {
      setSelectedEmail(employee.emp_email);
      setInputValue(
        `${employee.emp_fname} ${employee.emp_lname} - ${employee.emp_email}`
      );
    }
  }, [isLockedUser, employee]);

  // Keep inputValue in sync with selected item (only for admin)
  useEffect(() => {
    if (isLockedUser) return;
    if (!selectedEmail) {
      setInputValue("");
      return;
    }
    const emp = employeeList.find((e) => e.emp_email === selectedEmail);
    if (emp)
      setInputValue(`${emp.emp_fname} ${emp.emp_lname} - ${emp.emp_email}`);
    else setInputValue(selectedEmail);
  }, [selectedEmail, employeeList, isLockedUser]);

  useEffect(() => {
    if (isLockedUser) return;
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLockedUser]);

  const formatDate = (datetime) => {
    const d = new Date(datetime);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  let filteredData = data;

  // 1. Employee filter
  if (isLockedUser) {
    filteredData = filteredData.filter(
      (item) => item.email_id === employee.emp_email
    );
  } else if (selectedEmail) {
    filteredData = filteredData.filter(
      (item) => item.email_id === selectedEmail
    );
  }

  // 2. Date filter
  if (fromDate) {
    filteredData = filteredData.filter(
      (item) => new Date(item.datetime) >= new Date(fromDate)
    );
  }

  if (toDate) {
    filteredData = filteredData.filter(
      (item) => new Date(item.datetime) <= new Date(toDate)
    );
  }

  // 3. Status filter
  if (filterStatus === "present") {
    filteredData = filteredData.filter(
      (item) => item.status?.toLowerCase() === "present"
    );
  }

  if (filterStatus === "absent") {
    filteredData = filteredData.filter(
      (item) => item.status?.toLowerCase() === "absent"
    );
  }

  // Search filter (admin only)
  const searchText = inputValue.trim().toLowerCase();
  const filteredEmployees = employeeList.filter((emp) => {
    if (!searchText) return true;
    const combined =
      `${emp.emp_fname} ${emp.emp_lname} ${emp.emp_email}`.toLowerCase();
    return combined.includes(searchText);
  });

  const handleSelectEmployee = (email) => {
    if (isLockedUser) return;
    setSelectedEmail(email);
    setOpen(false);
  };

  const handleChooseAll = () => {
    if (isLockedUser) return;
    setSelectedEmail("");
    setInputValue("");
    setOpen(false);
  };

  function getMonthYear(baseMonth, baseYear, offset) {
    let m = baseMonth + offset;
    let y = baseYear;

    while (m < 0) {
      m += 12;
      y -= 1;
    }

    while (m > 11) {
      m -= 12;
      y += 1;
    }

    return { month: m, year: y };
  }

  const cal1 = getMonthYear(viewMonth, viewYear, -2);
  const cal2 = getMonthYear(viewMonth, viewYear, -1);
  const cal3 = getMonthYear(viewMonth, viewYear, 0);

  const btnBase =
    "px-2 py-1 rounded-md text-xs font-medium border shadow-sm transition-all duration-200";

  const getBtnClass = (status) => {
    const active =
      filterStatus === status
        ? status === "present"
          ? "bg-green-600 text-white border-green-600"
          : status === "absent"
          ? "bg-red-600 text-white border-red-600"
          : "bg-blue-600 text-white border-blue-600"
        : "bg-white hover:bg-gray-100";

    return `${btnBase} ${active}`;
  };

  const handleDownloadExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to download");
      return;
    }

    const formattedData = filteredData.map((item) => {
      const employee = employeeList.find(
        (emp) => emp.emp_id === Number(item.emp_id)
      );

      // Find company by companyCode from employee.work
      const company = compines.find(
        (c) => c.id === employee?.work?.companyCode
      );
      // Find company by companyCode from employee.work
      const location = locations.find(
        (l) => l.id === employee?.work?.locationId
      );

      return {
        Company: company?.compdesc || "",
        Location: location?.locname || "",
        Date: item.datetime,
        "Employee Name": getEmployeeName(Number(item.emp_id)),
        Email: item.email_id,
        "Punch In": item.punch_in,
        "Punch Out": item.punch_out,
        "Working Hours": item.working_hours,
        Status: item.status,
        "Manager Name": getEmployeeName(Number(item.approved_by)),
        "Manager Comments": item.manager_comments,
        "HR Status": item.hr_status,
        "HR Comment": item.hr_comment,
        "Created Date": item.created_date,
        "Modified Date": item.modified_date,
      };
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const fileName = `Attendance_${new Date().toLocaleDateString()}.xlsx`;
    saveAs(new Blob([excelBuffer]), fileName);
  };

  const mainContent = (
    <>
      <div className=" flex justify-between items-center">
        {/* Searchable Dropdown Component */}
        <EmployeeDropdown
          employeeList={isLockedUser ? [] : employeeList}
          filteredEmployees={isLockedUser ? [] : filteredEmployees}
          inputValue={inputValue}
          setInputValue={isLockedUser ? () => {} : setInputValue}
          open={isLockedUser ? false : open}
          setOpen={isLockedUser ? () => {} : setOpen}
          wrapperRef={wrapperRef}
          selectedEmail={selectedEmail}
          handleSelectEmployee={handleSelectEmployee}
          handleChooseAll={handleChooseAll}
          locked={isLockedUser} // send flag to dropdown
        />

        {/* Month + Year Selector */}

        <MonthYearSelector
          month={viewMonth}
          year={viewYear}
          setMonth={setViewMonth}
          setYear={setViewYear}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>

      {/* Attendance Calendars */}
      <div className="flex flex-wrap  w-full">
        <div className="w-full md:w-1/3">
          <AttendanceCalendar
            data={filteredData}
            month={cal1.month}
            year={cal1.year}
          />
        </div>

        <div className="w-full md:w-1/3">
          <AttendanceCalendar
            data={filteredData}
            month={cal2.month}
            year={cal2.year}
          />
        </div>

        <div className="w-full md:w-1/3">
          <AttendanceCalendar
            data={filteredData}
            month={cal3.month}
            year={cal3.year}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-6xl mx-auto mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-3">
            Attendance Pay Register
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("present")}
              className={getBtnClass("present")}
            >
              Present
            </button>

            <button
              onClick={() => setFilterStatus("absent")}
              className={getBtnClass("absent")}
            >
              Absent
            </button>

            <button
              onClick={() => setFilterStatus("")}
              className={getBtnClass("")}
            >
              Clear
            </button>

            {/* ---- DOWNLOAD BUTTON ---- */}
            <button
              onClick={handleDownloadExcel}
              className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-md shadow hover:bg-yellow-600 transition"
            >
              Download Excel
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm">Loading...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-sm text-red-500">No Records Available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100 text-xs">
                <tr>
                  <th className="px-2 py-1 border">Date</th>
                  <th className="px-2 py-1 border">Email</th>
                  {/* <th className="px-2 py-1 border">Emp ID</th> */}
                  <th className="px-2 py-1 border">Punch In</th>
                  <th className="px-2 py-1 border">Punch Out</th>
                  <th className="px-2 py-1 border">Hours</th>
                  <th className="px-2 py-1 border">Status</th>
                  <th className="px-2 py-1 border">Approved By</th>
                  <th className="px-2 py-1 border">Manager Comment</th>
                  <th className="px-2 py-1 border">HR Status</th>
                  <th className="px-2 py-1 border">HR Comment</th>
                </tr>
              </thead>

              <tbody className="text-xs">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-1 border">
                      {formatDate(item.datetime)}
                    </td>
                    <td className="px-2 py-1 border">{item.email_id}</td>
                    {/* <td className="px-2 py-1 border">{item.emp_id}</td> */}
                    <td className="px-2 py-1 border">{item.punch_in}</td>
                    <td className="px-2 py-1 border">{item.punch_out}</td>
                    <td className="px-2 py-1 border">{item.working_hours}</td>
                    <td className="px-2 py-1 border">{item.status}</td>
                    <td className="px-2 py-1 border">
                      {getEmployeeName(Number(item.approved_by))}
                    </td>

                    {/* <td className="px-2 py-1 border">{item.approved_by}</td> */}
                    <td className="px-2 py-1 border">
                      {item.manager_comments}
                    </td>
                    <td className="px-2 py-1 border">{item.hr_status}</td>
                    <td className="px-2 py-1 border">{item.hr_comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
  if (isPayrollScreen) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        {mainContent}
      </DashboardLayout>
    );
  }

  return <>{mainContent}</>;
}
