// EmployeeContractPayroll.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx";
import constantApi from "../../constantApi";
import { useNavigate } from "react-router-dom";

const defaultElements = [
  "Basic Salary",
  "Rent Allowance",
  "Travel Allowance",
  "Special Allowance",
  "Visa Allowance",
];

export default function EmployeeContractPayroll({
  goToNextTab = () => {},
  preselectedEmpId = null,
  employee = null,
  setEmployee = null,
}) {
  const [employees, setEmployees] = useState([]);
  const [localEmployee, setLocalEmployee] = useState(employee || null);
const navigate = useNavigate();

  const [contract, setContract] = useState({
    emp_id: preselectedEmpId || (employee ? employee.emp_id : ""),
    contract_type: "",
    supervisor: "",
    start_date: "",
    end_date: "",
    salary: "",
    notice_period: "",
    benefits: "",
    terms: "",
  });

  const [payroll, setPayroll] = useState({
    id: null,
    emp_id: preselectedEmpId || (employee ? employee.emp_id : ""),
    startDate: "",
    endDate: "",
    status: "Active",
    employeeType: "",
    contractType: "",
    salaryStructure: [],
  });

  const [elements, setElements] = useState(defaultElements);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showElementModal, setShowElementModal] = useState(false);
  const [newElement, setNewElement] = useState("");
  const [loading, setLoading] = useState(false);

  const [importedData, setImportedData] = useState([]);
  const fileInputRef = useRef(null);

  // ----------------- Fetch employee list (only if no preselected employee) -----------------
  useEffect(() => {
    if (preselectedEmpId || employee) return; // no need
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${constantApi.baseUrl}/employee/list`);
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error("❌ Employee fetch error:", err);
        // non-blocking
      }
    };
    fetchEmployees();
  }, [preselectedEmpId, employee]);

  // ----------------- When parent employee prop changes, keep local copy and populate payroll -----------------
  useEffect(() => {
    if (!employee) return;
    setLocalEmployee(employee);

    // If parent passed payroll_details inside employee, use it
    if (employee.payroll_details) {
      const p = employee.payroll_details;
      // salaryStructure may be stored as string in DB — normalize
      let salaryArray = p.salaryStructure;
      if (typeof salaryArray === "string") {
        try {
          salaryArray = JSON.parse(salaryArray);
        } catch {
          salaryArray = [];
        }
      }
      setPayroll({
        id: p.id || null,
        emp_id: p.emp_id || employee.emp_id,
        startDate: p.start_date || p.startDate || "",
        endDate: p.end_date || p.endDate || "",
        status: p.status || "Active",
        employeeType: p.employeeType || "",
        contractType: p.contract_type || p.contractType || "",
        salaryStructure: salaryArray || [],
      });

      setContract((prev) => ({
        ...prev,
        emp_id: employee.emp_id,
        contract_type: p.contract_type || prev.contract_type,
        supervisor: p.supervisor || prev.supervisor,
        start_date: p.start_date || prev.start_date,
        end_date: p.end_date || prev.end_date,
        salary: p.salary || prev.salary,
        notice_period: p.notice_period || prev.notice_period,
        benefits: p.benefits || prev.benefits,
        terms: p.terms || prev.terms,
      }));
    } else {
      // no payroll_details inside employee — attempt to fetch from payroll/details/:emp_id
      const empId = employee.emp_id;
      if (empId) {
        fetchPayrollByEmpId(empId);
      }
    }
  }, [employee]);

  // ----------------- If preselectedEmpId provided (e.g. from New_Employee), fetch payroll and employee name -----------------
  useEffect(() => {
    const empId = preselectedEmpId;
    if (!empId) return;

    // If we don't have localEmployee, try retrieve employee via your employee GET endpoint (getEmployeeById).
    // Your employee controller has getEmployeeById returning { success: true, data: employee }
   

    const fetchEmployeeAndPayroll = async () => {
  try {
    setLoading(true);
    try {
      const empRes = await axios.get(`${constantApi.baseUrl}/employee/${empId}`);
      const empData = empRes.data?.data || empRes.data || null;

      if (empData) {
        // normalize name keys so your UI always works
        const normalizedEmp = {
          ...empData,
          emp_fname:
            empData.emp_fname ||
            empData.first_name ||
            empData.fname ||
            empData.firstName ||
            "",
          emp_lname:
            empData.emp_lname ||
            empData.last_name ||
            empData.lname ||
            empData.lastName ||
            "",
        };
        setLocalEmployee(normalizedEmp);
      }
    } catch (err) {
      console.error("Employee fetch error:", err);
    }

    await fetchPayrollByEmpId(empId);
  } finally {
    setLoading(false);
  }
};


    fetchEmployeeAndPayroll();
  }, [preselectedEmpId]);

  // Helper: fetch payroll by emp id
  const fetchPayrollByEmpId = async (empId) => {
    if (!empId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${constantApi.baseUrl}/payroll/details/${empId}`);
      // backend controller might return the record directly or wrapped — handle both
      const payload = res.data?.data ?? res.data ?? null;
      if (!payload) {
        // no payroll
        setPayroll((prev) => ({ ...prev, id: null, emp_id: empId, salaryStructure: [] }));
        return;
      }

      let salaryArray = payload.salaryStructure;
      if (typeof salaryArray === "string") {
        try {
          salaryArray = JSON.parse(salaryArray);
        } catch {
          salaryArray = [];
        }
      }

      setPayroll({
        id: payload.id || null,
        emp_id: payload.emp_id || empId,
        startDate: payload.start_date || payload.startDate || "",
        endDate: payload.end_date || payload.endDate || "",
        status: payload.status || "Active",
        employeeType: payload.employeeType || "",
        contractType: payload.contract_type || payload.contractType || "",
        salaryStructure: salaryArray || [],
      });

      // populate contract fields if available
      setContract((prev) => ({
        ...prev,
        emp_id: empId,
        contract_type: payload.contract_type || prev.contract_type,
        supervisor: payload.supervisor || prev.supervisor,
        start_date: payload.start_date || prev.start_date,
        end_date: payload.end_date || prev.end_date,
        salary: payload.salary || prev.salary,
        notice_period: payload.notice_period || prev.notice_period,
        benefits: payload.benefits || prev.benefits,
        terms: payload.terms || prev.terms,
      }));
    } catch (err) {
      // if 404 or not found, keep empty payroll
      setPayroll((prev) => ({ ...prev, id: null, emp_id: empId }));
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Handlers -----------------
  const handleContractChange = (e) => {
    const { name, value } = e.target;
    setContract((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayrollChange = (index, field, value) => {
    const updated = [...payroll.salaryStructure];
    updated[index] = { ...updated[index], [field]: value };
    setPayroll((prev) => ({ ...prev, salaryStructure: updated }));
  };

  const addSalaryRow = () => {
    setPayroll((prev) => ({
      ...prev,
      salaryStructure: [...(prev.salaryStructure || []), { element: "", amount: "" }],
    }));
    setEditingIndex((prev) => (payroll.salaryStructure ? payroll.salaryStructure.length : 0));
  };

  const deleteSalaryRow = (index) => {
    setPayroll((prev) => ({
      ...prev,
      salaryStructure: prev.salaryStructure.filter((_, i) => i !== index),
    }));
  };

  const toggleEdit = (index) => {
    setEditingIndex((cur) => (cur === index ? null : index));
  };

  const handleAddElement = () => {
    if (!newElement.trim()) return;
    if (elements.includes(newElement)) return alert("Element already exists!");
    setElements((prev) => [...prev, newElement]);
    setNewElement("");
    setShowElementModal(false);
  };

  const handleImportClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setImportedData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // ----------------- Create / Update -----------------
  const handleSubmit = async () => {
    if (!contract.emp_id || !contract.contract_type || !contract.start_date) {
      return alert("Please fill Employee, Contract Type, and Start Date");
    }

    // Prepare payload structure matching your controller
    const payload = {
      contract: {
        emp_id: contract.emp_id,
        contract_type: contract.contract_type,
        supervisor: contract.supervisor,
        start_date: contract.start_date,
        end_date: contract.end_date,
        salary: contract.salary,
        notice_period: contract.notice_period,
        benefits: contract.benefits,
        terms: contract.terms,
      },
      payroll: {
        // keep payroll.id separate for update route
        status: payroll.status,
        employeeType: payroll.employeeType,
        contractType: payroll.contractType,
        salaryStructure: payroll.salaryStructure,
        startDate: payroll.startDate,
        endDate: payroll.endDate,
      },
    };

    try {
      if (payroll.id) {
        // UPDATE
        const res = await axios.put(
          `${constantApi.baseUrl}/payroll/update/${payroll.id}`,
          payload
        );
        const updated = res.data?.data ?? res.data;
        alert("✅ Payroll updated successfully!");

        // Update local & parent state
        const normalized = {
          ...updated,
          // ensure salaryStructure is array
          salaryStructure:
            typeof updated.salaryStructure === "string"
              ? JSON.parse(updated.salaryStructure || "[]")
              : updated.salaryStructure || [],
        };
        setPayroll((prev) => ({
          ...prev,
          ...{
            id: normalized.id,
            emp_id: normalized.emp_id || prev.emp_id,
            status: normalized.status || prev.status,
            employeeType: normalized.employeeType || prev.employeeType,
            contractType: normalized.contract_type || prev.contractType,
            salaryStructure: normalized.salaryStructure,
            startDate: normalized.start_date || prev.startDate,
            endDate: normalized.end_date || prev.endDate,
          },
        }));

        if (typeof setEmployee === "function") {
          setEmployee((prev) => ({ ...prev, payroll_details: normalized }));
        }
      } else {
        // CREATE
        const res = await axios.post(`${constantApi.baseUrl}/payroll/create`, payload);
        const created = res.data?.data ?? res.data;
        alert("✅ Payroll created successfully!");

        // Normalize and set
        const normalized = {
          ...created,
          salaryStructure:
            typeof created.salaryStructure === "string"
              ? JSON.parse(created.salaryStructure || "[]")
              : created.salaryStructure || [],
        };

        setPayroll((prev) => ({
          ...prev,
          id: normalized.id,
          emp_id: normalized.emp_id || prev.emp_id,
          status: normalized.status || prev.status,
          employeeType: normalized.employeeType || prev.employeeType,
          contractType: normalized.contract_type || prev.contractType,
          salaryStructure: normalized.salaryStructure,
          startDate: normalized.start_date || prev.startDate,
          endDate: normalized.end_date || prev.endDate,
        }));

        if (typeof setEmployee === "function") {
          setEmployee((prev) => ({ ...prev, payroll_details: normalized }));
        }
      }

      goToNextTab();
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
      alert("Failed to save contract & payroll!");
    }
  };

  // ----------------- Delete -----------------
  const handleDelete = async () => {
    if (!payroll.id) return alert("No payroll to delete");
    if (!window.confirm("Are you sure you want to delete this payroll record?")) return;

    try {
      await axios.delete(`${constantApi.baseUrl}/payroll/delete/${payroll.id}`);
      alert("🗑️ Payroll deleted successfully");

      // Clear local payroll and update parent
      setPayroll({
        id: null,
        emp_id: contract.emp_id,
        startDate: "",
        endDate: "",
        status: "Active",
        employeeType: "",
        contractType: "",
        salaryStructure: [],
      });

      if (typeof setEmployee === "function") {
        setEmployee((prev) => ({ ...prev, payroll_details: null }));
      }
    } catch (err) {
      console.error("❌ Delete payroll error:", err.response?.data || err.message);
      alert("Failed to delete payroll");
    }
  };

  // ----------------- Render -----------------
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200 space-y-6">
      {/* ----------------- CONTRACT SECTION ----------------- */}
      <div className="space-y-4">

       <div className="flex items-center justify-between">
  <h2 className="text-xl font-bold">Employee Contract</h2>
  <button
    type="button"
    onClick={() => navigate("/emp_attendance")}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
  >
    🕒 Attendance
  </button>
</div>

        {/* Employee Selection */}
        <div>
          <label className="block mb-1 font-semibold">Employee</label>
          {(preselectedEmpId || localEmployee) ? (
            <input
              type="text"
            
              value={
  localEmployee
    ? `${localEmployee.emp_fname || localEmployee.first_name || localEmployee.fname || ""} ${localEmployee.emp_lname || localEmployee.last_name || localEmployee.lname || ""} (${localEmployee.emp_id})`
    : `Employee ID: ${preselectedEmpId || contract.emp_id}`
}

              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          ) : (
            <select
              name="emp_id"
              value={contract.emp_id}
              onChange={(e) => {
                const emp = employees.find((emp) => emp.emp_id === parseInt(e.target.value));
                setContract((prev) => ({ ...prev, emp_id: e.target.value }));
                setLocalEmployee(emp || null);
                // fetch payroll for selected emp
                if (e.target.value) fetchPayrollByEmpId(e.target.value);
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.emp_id} value={emp.emp_id}>
                  {emp.emp_fname} {emp.emp_lname} ({emp.emp_id})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Contract Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Contract Type</label>
            <select
              name="contract_type"
              value={contract.contract_type}
              onChange={handleContractChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
              <option value="Intern">Intern</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>
          <div>
            <label>Supervisor</label>
            <input
              type="text"
              name="supervisor"
              value={contract.supervisor}
              onChange={handleContractChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={contract.start_date}
              onChange={handleContractChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={contract.end_date}
              onChange={handleContractChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={contract.salary}
              onChange={handleContractChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Notice Period</label>
            <input
              type="number"
              name="notice_period"
              value={contract.notice_period}
              onChange={handleContractChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="col-span-2">
            <label>Benefits</label>
            <textarea
              name="benefits"
              value={contract.benefits}
              onChange={handleContractChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="col-span-2">
            <label>Terms & Conditions</label>
            <textarea
              name="terms"
              value={contract.terms}
              onChange={handleContractChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>

        {/* IMPORT ATTENDANCE */}
        <div>
          <button
            type="button"
            onClick={handleImportClick}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            📥 Import Attendance
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {importedData.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    {Object.keys(importedData[0]).map((key) => (
                      <th key={key} className="border px-2 py-1">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importedData.map((row, i) => (
                    <tr key={i} className="even:bg-gray-100">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-2 py-1">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ----------------- PAYROLL SECTION ----------------- */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Payroll</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Status</label>
            <select
              value={payroll.status}
              onChange={(e) => setPayroll((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full border rounded px-2 py-1"
            >
              <option>Active</option>
              <option>Terminate</option>
              <option>Resign</option>
              <option>Hold</option>
            </select>
          </div>
          <div>
            <label>Employee Type</label>
            <select
              value={payroll.employeeType}
              onChange={(e) => setPayroll((prev) => ({ ...prev, employeeType: e.target.value }))}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select Type</option>
              <option>Permanent</option>
              <option>Contract</option>
              <option>Intern</option>
              <option>Part-Time</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowElementModal(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            ⚙️ Manage Payroll Elements
          </button>
        </div>

        {/* Salary Structure */}
        {(payroll.salaryStructure || []).map((row, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded bg-gray-50">
            {editingIndex === index ? (
              <>
                <select
                  value={row.element}
                  onChange={(e) => handlePayrollChange(index, "element", e.target.value)}
                  className="border px-2 py-1 rounded w-1/2"
                >
                  <option value="">Select Element</option>
                  {elements.map((el, i) => (
                    <option key={i} value={el}>{el}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={row.amount}
                  onChange={(e) => handlePayrollChange(index, "amount", e.target.value)}
                  className="border px-2 py-1 rounded w-1/3"
                  placeholder="Amount"
                />
                <button onClick={() => toggleEdit(index)} className="text-green-600">
                  <FaSave />
                </button>
              </>
            ) : (
              <>
                <span className="w-1/2">{row.element}</span>
                <span className="w-1/3">{row.amount}</span>
                <button onClick={() => toggleEdit(index)} className="text-blue-600">
                  <FaEdit />
                </button>
                <button onClick={() => deleteSalaryRow(index)} className="text-red-600">
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addSalaryRow}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-2"
        >
          + Add Salary Row
        </button>
      </div>

      {/* ---------------- ACTIONS ---------------- */}
      <div className="flex justify-between mt-6">
        {payroll.id && (
          <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Delete Payroll
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          <button onClick={handleSubmit} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            {payroll.id ? "Update Payroll" : "Save Payroll"}
          </button>
        </div>
      </div>

      {/* ----------------- ELEMENT MODAL ----------------- */}
      {showElementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-bold">Manage Payroll Elements</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {elements.map((el, i) => (
                <div key={i} className="flex justify-between items-center border-b py-1">
                  <span>{el}</span>
                  <button onClick={() => setElements((prev) => prev.filter((_, idx) => idx !== i))} className="text-red-600">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newElement} onChange={(e) => setNewElement(e.target.value)} placeholder="New element" className="flex-1 border px-2 py-1 rounded" />
              <button onClick={handleAddElement} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Add</button>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowElementModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
