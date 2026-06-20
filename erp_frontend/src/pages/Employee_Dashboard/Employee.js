import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constantApi from "constantApi";
import { getCurrentUser } from "utils/currentUser";

export default function EmployeeList() {
  const [userRole, setUserRole] = useState();
  const [userEmail, setUserEmail] = useState();
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserRole(currentUser.role_id);
      setUserEmail(currentUser.email);
      console.log("email is -----------", currentUser.email);
    }
  }, []);
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isCollapsed, setIsCollapsed] = useState(false); // 👈 Collapsible toggle
  useEffect(() => {
    if (!userEmail) return; // wait until email is available

    axios
      .get(`${constantApi.baseUrl}/employee/list`)
      .then((res) => {
        console.log("📦 Employee Data:--------------------", res.data.data);
        const isAdmin =
          userEmail === "admin@jtserp.com" || userEmail === "admin@jtserp.com";

        // const result = res.data.data.filter(
        //   (user) => user.emp_email === userEmail
        // );
        const result = isAdmin
          ? res.data.data
          : res.data.data.filter((user) => user.emp_email === userEmail);

        console.log("result--------------", result);

        setEmployeeData(result || []);
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
        toast.error("Failed to load employee data!");
      });
  }, [userEmail]); // 👈 IMPORTANT

  // useEffect(() => {
  //   axios
  //     .get(`${constantApi.baseUrl}/employee/list`)
  //     .then((res) => {
  //       console.log("📦 Employee Data:", res.data.data); // 🔹 Log only the data field
  //       const result = res.data.data.filter(
  //         (user) => user.emp_email === userEmail
  //       );

  //       setEmployeeData(result || []);
  //     })
  //     .catch((err) => {
  //       console.error("❌ API Error:", err);
  //       toast.error("Failed to load employee data!");
  //     });
  // }, []);

  const goToNewEmployee = () => navigate("/new_employee");

  const getStatusCount = (status) =>
    employeeData.filter(
      (e) => e?.payroll_details?.status?.toLowerCase() === status.toLowerCase()
    ).length;

  const totalEmployees = employeeData.length;
  const activeCount = getStatusCount("Active");
  const terminateCount = getStatusCount("Terminate");
  const resignedCount = getStatusCount("Resign");
  const holdCount = getStatusCount("Hold");

  const filteredEmployees = employeeData.filter((emp) => {
    const matchesSearch =
      emp.emp_fname?.toLowerCase().includes(search.toLowerCase()) ||
      emp.emp_email?.toLowerCase().includes(search.toLowerCase());
    if (filter === "All") return matchesSearch;
    return (
      matchesSearch &&
      emp?.payroll_details?.status?.toLowerCase() === filter.toLowerCase()
    );
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-70 min-h-screen">
        {/* HEADER */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-gradient-to-r from-indigo-300 to-blue-400 p-4 rounded-2xl shadow-lg cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)} // 👈 toggle collapse
        >
          {/* Left: Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              Employee
              <span
                className={`transition-transform transform ${
                  isCollapsed ? "rotate-180" : "rotate-0"
                }`}
              >
                ⬇️
              </span>
            </h1>
          </div>

          {/* Right: Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent collapse toggle when clicking add button
              goToNewEmployee();
            }}
            className="mt-3 sm:mt-0 px-4 py-1.5 text-xs sm:text-sm bg-white text-indigo-600 font-medium rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-1"
          >
            ➕ Add Employee
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-5 mb-10">
          <StatCard
            color="indigo"
            label="Total"
            value={totalEmployees}
            icon="👤"
          />
          <StatCard
            color="green"
            label="Active"
            value={activeCount}
            icon="✅"
          />
          <StatCard
            color="red"
            label="Terminate"
            value={terminateCount}
            icon="🚫"
          />
          <StatCard
            color="yellow"
            label="Resign"
            value={resignedCount}
            icon="📄"
          />
          <StatCard color="purple" label="Hold" value={holdCount} icon="⏸️" />
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="🔍 Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-3 py-2 w-64 text-sm rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 text-sm focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Hold">Hold</option>
            <option value="Resign">Resign</option>
            <option value="Terminate">Terminate</option>
          </select>
        </div>

        {/* COLLAPSIBLE EMPLOYEE LIST */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isCollapsed ? "max-h-0 opacity-0" : "max-h-[4000px] opacity-100"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {filteredEmployees.map((emp) => (
              <EmployeeCard key={emp.emp_id} emp={emp} />
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <p className="text-center text-gray-500 mt-10 text-sm">
              Loading...
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* --- EMPLOYEE CARD --- */
function EmployeeCard({ emp }) {
  const [userRole, setUserRole] = useState();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserRole(currentUser.role_id);
    }
  }, []);
  const navigate = useNavigate();
  const [editableEmp, setEditableEmp] = useState(emp);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(
    emp.emp_profile_pic
      ? `${constantApi.imageUrl}/Employee_profile/${emp.emp_profile_pic}`
      : null
  );
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(editableEmp).forEach((key) => {
        if (editableEmp[key] !== undefined)
          formData.append(key, editableEmp[key]);
      });
      if (file) formData.append("emp_profile_pic", file);
      await axios.post(
        `${constantApi.baseUrl}/employee/update/${emp.emp_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("✅ Employee updated!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Update failed!");
    }
  };

  const handleClick = (empId) => {
    navigate(`/employee_details/${empId}`);
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-2xl p-5 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
      {/* STATUS */}
      <div
        className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
          emp.payroll_details?.status?.toLowerCase() === "active"
            ? "bg-green-100 text-green-700"
            : emp.payroll_details?.status?.toLowerCase() === "terminate"
            ? "bg-red-100 text-red-700"
            : emp.payroll_details?.status?.toLowerCase() === "resign"
            ? "bg-yellow-100 text-yellow-700"
            : emp.payroll_details?.status?.toLowerCase() === "hold"
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {emp.payroll_details?.status || "Active"}
      </div>

      {/* PROFILE */}
      <div className="flex flex-col items-center mt-4">
        {preview ? (
          <img
            src={preview}
            alt={emp.emp_fname}
            className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover shadow-md"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-lg font-bold shadow-md">
            {emp.emp_fname?.charAt(0) || "?"}
          </div>
        )}

        {isEditing && (
          <label className="mt-2 text-[11px] text-indigo-600 font-semibold cursor-pointer">
            🖼️ Change
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        )}

        <EditableInput
          value={editableEmp.emp_fname}
          onChange={(v) => setEditableEmp({ ...editableEmp, emp_fname: v })}
          isEditing={isEditing}
          className="text-sm font-bold text-gray-700"
        />
        <EditableInput
          value={editableEmp.emp_department}
          onChange={(v) =>
            setEditableEmp({ ...editableEmp, emp_department: v })
          }
          isEditing={isEditing}
          className="text-xs text-indigo-500"
        />
      </div>

      {/* CONTACT INFO */}
      <div className="mt-3 bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1.5 border border-gray-100">
        <EditableField
          icon="📧"
          value={editableEmp.emp_email}
          onChange={(v) => setEditableEmp({ ...editableEmp, emp_email: v })}
          isEditing={isEditing}
        />
        <EditableField
          icon="📞"
          value={editableEmp.emp_phone}
          onChange={(v) => setEditableEmp({ ...editableEmp, emp_phone: v })}
          isEditing={isEditing}
        />
        <EditableField
          icon="📍"
          value={editableEmp.emp_address}
          onChange={(v) => setEditableEmp({ ...editableEmp, emp_address: v })}
          isEditing={isEditing}
        />
      </div>

      {/* FOOTER */}
      <div className="mt-3 flex justify-between items-center">
        {/* {isEditing ? (
          <button
            onClick={handleUpdate}
            className="px-3 py-1 bg-green-500 text-white text-[11px] rounded-lg shadow hover:bg-green-600"
          >
            💾 Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            ✏️ Edit
          </button>
        )} */}

        {(userRole === 1 || userRole === 5) &&
          (isEditing ? (
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-green-500 text-white text-[11px] rounded-lg shadow hover:bg-green-600"
            >
              💾 Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              ✏️ Edit
            </button>
          ))}

        <button
          onClick={() => handleClick(emp.emp_id)}
          className="px-3 py-1 bg-indigo-500 text-white text-[11px] rounded-lg shadow hover:bg-indigo-600"
        >
          View →
        </button>
      </div>
    </div>
  );
}

/* SMALL INPUTS */
function EditableInput({ value, onChange, isEditing, className = "" }) {
  return isEditing ? (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`text-center border-b border-indigo-300 focus:outline-none text-sm ${className}`}
    />
  ) : (
    <p className={`text-center ${className}`}>{value}</p>
  );
}

/* SMALL FIELD */
function EditableField({ icon, value, onChange, isEditing }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs">{icon}</span>
      {isEditing ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-indigo-200 text-xs text-gray-700 focus:outline-none"
        />
      ) : (
        <span className="w-full text-xs text-gray-700">{value || "—"}</span>
      )}
    </div>
  );
}

/* STAT CARD */
function StatCard({ color, label, value, icon }) {
  const colorMap = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    green: "text-green-600 bg-green-50 border-green-100",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-100",
    red: "text-red-600 bg-red-50 border-red-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
  };
  return (
    <div
      className={`border rounded-xl p-6 flex flex-col items-center justify-center text-xs font-medium hover:-translate-y-1 shadow-md transition-all duration-300 ${colorMap[color]}`}
    >
      <div className="text-lg mb-1">{icon}</div>
      <span className="text-xl font-bold">{value}</span>
      <p>{label}</p>
    </div>
  );
}
