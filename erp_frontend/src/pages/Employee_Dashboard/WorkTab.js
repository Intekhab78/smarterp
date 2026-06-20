import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import constantApi from "../../constantApi";

const DEPARTMENTS = [
  { value: "Top Management", label: "Top Management" },
  { value: "Finance & Accounts", label: "Finance & Accounts" },
  { value: "HR", label: "HR" },
  { value: "Administration", label: "Administration" },
  { value: "Sales & Marketing", label: "Sales & Marketing" },
  { value: "Purchase / Procurement", label: "Purchase / Procurement" },
  { value: "Inventory / Warehouse", label: "Inventory / Warehouse" },
  { value: "IT / Technical", label: "IT / Technical" },
  { value: "Operations / Production", label: "Operations / Production" },
  { value: "Customer Service / Support", label: "Customer Service / Support" },
];

const SUB_DEPARTMENTS = {
  "Top Management": [
    "Chairman / CEO",
    "General Manager / COO",
    "Executive Assistant",
  ],
  "Finance & Accounts": [
    "Accounts Payable",
    "Accounts Receivable",
    "General Ledger",
    "Payroll Accounting",
    "Finance & Budgeting",
  ],
  "HR": [
    "Recruitment / Talent Acquisition",
    "Employee Relations",
    "Training & Development",
    "Payroll & Benefits",
    "Attendance & Leave Management",
  ],
  "Administration": [
    "Office Administration",
    "Facility & Vehicle Management",
    "Security & Safety",
    "Document Control / PRO Services",
  ],
  "Sales & Marketing": [
    "Sales Operations",
    "Business Development",
    "Marketing & Digital",
    "Customer Relationship (CRM)",
  ],
  "Purchase / Procurement": [
    "Supplier Evaluation & Selection",
    "Purchase Order Management",
    "Price Comparison / RFQ Handling",
    "Import & Logistics Coordination",
  ],
  "Inventory / Warehouse": [
    "Goods Receiving (GRN)",
    "Material Issuance",
    "Stock Transfer & Adjustment",
    "Batch/Expiry Tracking",
    "Inventory Audit & Reporting",
  ],
  "IT / Technical": [
    "IT Infrastructure",
    "Software Development",
    "Hardware & Support",
    "CCTV / Security Maintenance",
    "Data Backup & Cybersecurity",
  ],
  "Operations / Production": [
    "Production Planning & Control",
    "Quality Assurance / QC",
    "Maintenance & Equipment Handling",
    "Field / Site Operations",
  ],
  "Customer Service / Support": [
    "Service Requests / Complaints",
    "AMC Management",
    "Call Center / Help Desk",
    "Warranty & Replacement Coordination",
  ],
};

const POSITIONS = {
  // ===== Finance & Accounts =====
  "Accounts Payable": [
    "Accounts Manager",
    "Payroll Executive",
    "Finance Analyst",
    "AP Executive",
    "Accounts Assistant"
  ],
  "Accounts Receivable": [
    "Collections Officer",
    "Billing Specialist",
    "AR Executive",
    "Accounts Assistant"
  ],
  "General Ledger": [
    "Ledger Accountant",
    "Senior Accountant",
    "Accounts Supervisor"
  ],
  "Payroll Accounting": [
    "Payroll Officer",
    "Payroll Specialist",
    "Compensation Analyst"
  ],
  "Finance & Budgeting": [
    "Finance Analyst",
    "Budget Controller",
    "Finance Manager"
  ],

  // ===== HR =====
  "Recruitment / Talent Acquisition": [
    "Recruitment Officer",
    "Talent Acquisition Specialist",
    "HR Recruiter",
    "HR Executive"
  ],
  "Employee Relations": [
    "HR Manager",
    "Employee Relations Officer",
    "HR Business Partner"
  ],
  "Training & Development": [
    "Training Specialist",
    "Learning & Development Manager",
    "HR Trainer"
  ],
  "Payroll & Benefits": [
    "Payroll Executive",
    "Compensation & Benefits Manager",
    "HR Payroll Coordinator"
  ],
  "Attendance & Leave Management": [
    "Attendance Officer",
    "HR Operations Executive",
    "HR Admin"
  ],

  // ===== Administration =====
  "Office Administration": [
    "Office Administrator",
    "Admin Executive",
    "Front Desk Executive"
  ],
  "Facility & Vehicle Management": [
    "Facility Manager",
    "Transport Coordinator",
    "Maintenance Supervisor"
  ],
  "Security & Safety": [
    "Security Officer",
    "Safety Officer",
    "HSE Manager"
  ],
  "Document Control / PRO Services": [
    "Document Controller",
    "PRO Officer",
    "Records Manager"
  ],

  // ===== Sales & Marketing =====
  "Sales Operations": [
    "Sales Executive",
    "Sales Coordinator",
    "Sales Manager"
  ],
  "Business Development": [
    "Business Development Manager",
    "BD Executive",
    "Key Account Manager"
  ],
  "Marketing & Digital": [
    "Marketing Executive",
    "Brand Manager",
    "Digital Marketing Specialist",
    "Content Creator"
  ],
  "Customer Relationship (CRM)": [
    "CRM Executive",
    "CRM Manager",
    "Customer Success Manager"
  ],

  // ===== Purchase / Procurement =====
  "Supplier Evaluation & Selection": [
    "Procurement Officer",
    "Supplier Relationship Manager",
    "Vendor Analyst"
  ],
  "Purchase Order Management": [
    "Purchase Executive",
    "Procurement Coordinator",
    "Purchase Manager"
  ],
  "Price Comparison / RFQ Handling": [
    "RFQ Coordinator",
    "Cost Analyst",
    "Procurement Analyst"
  ],
  "Import & Logistics Coordination": [
    "Logistics Coordinator",
    "Import Executive",
    "Supply Chain Officer"
  ],

  // ===== Inventory / Warehouse =====
  "Goods Receiving (GRN)": [
    "Storekeeper",
    "Warehouse Executive",
    "Receiving Officer"
  ],
  "Material Issuance": [
    "Inventory Clerk",
    "Store Assistant",
    "Warehouse Coordinator"
  ],
  "Stock Transfer & Adjustment": [
    "Inventory Controller",
    "Stock Auditor",
    "Warehouse Supervisor"
  ],
  "Batch/Expiry Tracking": [
    "Quality Inspector",
    "Inventory Analyst",
    "Store Supervisor"
  ],
  "Inventory Audit & Reporting": [
    "Inventory Auditor",
    "MIS Executive",
    "Warehouse Manager"
  ],

  // ===== IT / Technical =====
  "IT Infrastructure": [
    "System Administrator",
    "IT Support",
    "Network Engineer"
  ],
  "Software Development": [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer"
  ],
  "Hardware & Support": [
    "IT Support",
    "Hardware Technician",
    "Desktop Support Engineer"
  ],
  "CCTV / Security Maintenance": [
    "CCTV Technician",
    "Security Systems Engineer",
    "Maintenance Technician"
  ],
  "Data Backup & Cybersecurity": [
    "Cybersecurity Analyst",
    "IT Security Officer",
    "Backup Administrator"
  ],

  // ===== Operations / Production =====
  "Production Planning & Control": [
    "Production Planner",
    "PPC Engineer",
    "Operations Coordinator"
  ],
  "Quality Assurance / QC": [
    "QC Inspector",
    "Quality Engineer",
    "QA Manager"
  ],
  "Maintenance & Equipment Handling": [
    "Maintenance Engineer",
    "Technician",
    "Plant Supervisor"
  ],
  "Field / Site Operations": [
    "Site Engineer",
    "Field Supervisor",
    "Operations Executive"
  ],

  // ===== Customer Service / Support =====
  "Service Requests / Complaints": [
    "Customer Support Executive",
    "Service Coordinator",
    "Complaint Handling Officer"
  ],
  "AMC Management": [
    "AMC Coordinator",
    "Service Manager",
    "Maintenance Planner"
  ],
  "Call Center / Help Desk": [
    "Call Center Executive",
    "Help Desk Technician",
    "Support Team Lead"
  ],
  "Warranty & Replacement Coordination": [
    "Warranty Executive",
    "After Sales Coordinator",
    "Service Engineer"
  ],

  // ===== Top Management =====
  "Chairman / CEO": [
    "Chairman",
    "Chief Executive Officer",
    "Managing Director"
  ],
  "General Manager / COO": [
    "General Manager",
    "Chief Operating Officer",
    "Operations Head"
  ],
  "Executive Assistant": [
    "Executive Assistant",
    "Personal Secretary",
    "Office Coordinator"
  ]
};


export default function WorkTab({
  employee,
  setEmployee,
  userRole,
  goToNextTab = () => { },
}) {
  const [workData, setWorkData] = useState({
    companyCode: "",
    compdesc: "",
    locationId: "",
    department: "",
    subDepartment: "",
    position: "",
    title: "",
    manager: "",
    work_address: "",
    resume: null,
  });

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const forceDownload = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/employee/list`)
      .then((res) => {
        console.log("✅ API Response: for emp details", res.data.data); // print whole response
        // setEmployee(emp);
        setEmployeeList(res.data.data);
      })
      .catch((err) => {
        console.error("❌ API Error:", err); // print error
        setError(err.message || "Failed to fetch employee");
      });
  }, []);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.post(`${constantApi.baseUrl}/company/com_list`);
        const records = res.data?.data || [];
        setCompanies(records.map((c) => ({ value: c.id, label: c.compdesc })));
      } catch (err) {
        console.error("❌ Failed to load companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch locations by company
  const fetchLocationsByCompany = async (companyId) => {
    try {
      if (!companyId) return setLocations([]);
      const response = await axios.post(
        `${constantApi.baseUrl}/location/loc_list`,
        { company_id: companyId },
      );
      const records = response.data?.data || [];
      setLocations(records.map((l) => ({ value: l.id, label: l.locname })));
    } catch (err) {
      console.error("❌ Failed to load locations:", err);
      setLocations([]);
    }
  };

  useEffect(() => {
    if (employee?.work) {
      const work = employee.work;
      console.log("employee----------", employee);

      setWorkData({
        companyCode: work.companyCode || "",
        compdesc: work.compdesc || "",
        locationId: work.locationId || "",
        department: work.department || "",
        subDepartment: work.subDepartment || "",
        position: work.position || "",
        title: work.title || "",
        manager: work.manager || "",
        work_address: work.work_address || "",
        resume: work.resume || null,
      });
      if (work.companyCode) fetchLocationsByCompany(work.companyCode);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setWorkData((prev) => ({ ...prev, resume: e.target.files[0].name }));
    }
  };

  // ✅ SAVE
  const handleSave = async () => {
    try {
      const formData = new FormData();

      // --- Employee Profile ---
      formData.append("emp_title", employee.profile.title || "");
      formData.append("emp_fname", employee.profile.firstname || "");
      formData.append("emp_lname", employee.profile.lastname || "");
      formData.append("emp_email", employee.profile.email || "");
      formData.append("emp_phone", employee.profile.mobile || "");
      formData.append("emp_address", employee.profile.location || "");
      formData.append("emp_department", employee.profile.departmentId || "");
      formData.append("emp_designation", employee.profile.designation || "");

      if (employee.profile.avatarFile) {
        formData.append("emp_profile_pic", employee.profile.avatarFile);
      }

      // --- Work Details ---
      formData.append("department", workData.department);
      formData.append("subDepartment", workData.subDepartment);
      formData.append("position", workData.position);
      formData.append("title", workData.title);
      formData.append("manager", workData.manager);
      formData.append("work_address", workData.work_address);
      formData.append("companyCode", workData.companyCode);
      formData.append("locationId", workData.locationId);

      if (resumeFile) formData.append("resume", resumeFile);

      const res = await axios.post(
        `${constantApi.baseUrl}/employee/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setEmployee((prev) => ({
        ...prev,
        emp_id: res.data.data.employee.emp_id,
        work: res.data.data.work,
      }));

      alert("✅ Employee + Work info saved successfully!");
      goToNextTab();
    } catch (err) {
      console.error("❌ Save failed:", err.response?.data || err.message);
      alert("❌ Failed to save employee!");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!employee?.emp_id) {
        alert("❌ No employee ID found!");
        return;
      }

      const formData = new FormData();
      formData.append("emp_title", employee.emp_title || "");
      formData.append("emp_fname", employee.emp_fname || "");
      formData.append("emp_lname", employee.emp_lname || "");
      formData.append("emp_email", employee.emp_email || "");
      formData.append("emp_phone", employee.emp_phone || "");
      formData.append("emp_address", employee.emp_address || "");
      formData.append("emp_department", employee.emp_department || "");
      formData.append("emp_designation", employee.emp_designation || "");

      if (employee.avatarFile) {
        formData.append("emp_profile_pic", employee.avatarFile);
      }

      // --- Work Info ---
      formData.append("department", workData.department || "");
      formData.append("subDepartment", workData.subDepartment || "");
      formData.append("position", workData.position || "");
      formData.append("title", workData.title || "");
      formData.append("manager", workData.manager || "");
      formData.append("work_address", workData.work_address || "");
      formData.append("companyCode", workData.companyCode || "");
      formData.append("locationId", workData.locationId || "");

      if (resumeFile) formData.append("resume", resumeFile);

      const res = await axios.post(
        `${constantApi.baseUrl}/employee/update/${employee.emp_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setEmployee((prev) => ({
        ...prev,
        ...res.data.data.employee,
        work: res.data.data.work,
      }));

      alert("✅ Employee updated successfully!");
    } catch (err) {
      console.error("❌ Update failed:", err.response || err.message || err);
      alert(
        `❌ Failed to update employee! ${err.response?.data?.message || ""}`,
      );
    }
  };

  // ✅ DELETE
  const handleDelete = async () => {
    if (!employee?.emp_id) return alert("❌ No employee selected!");
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axios.delete(
        `${constantApi.baseUrl}/employee/delete/${employee.emp_id}`,
      );

      setWorkData({
        department: "",
        subDepartment: "",
        position: "",
        title: "",
        manager: "",
        work_address: "",
        resume: null,
      });

      setEmployee(null);
      alert("✅ Employee deleted successfully!");
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err.message);
      alert("❌ Failed to delete employee!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Work Info Section */}
      <section className="bg-gray-50 border p-6 rounded-xl">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Work Information
        </h4>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Company */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Company
            </label>
            <Select
              options={companies}
              value={
                companies.find(
                  (c) => String(c.value) === String(workData.companyCode),
                ) || null
              }
              onChange={(opt) => {
                setWorkData((prev) => ({
                  ...prev,
                  companyCode: opt?.value || "",
                  compdesc: opt?.label || "",
                  locationId: "",
                }));
                fetchLocationsByCompany(opt?.value);
              }}
              placeholder="Select Company"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Location
            </label>
            <Select
              options={locations}
              value={
                locations.find(
                  (l) => String(l.value) === String(workData.locationId),
                ) || null
              }
              onChange={(opt) =>
                setWorkData((prev) => ({
                  ...prev,
                  locationId: opt?.value || "",
                }))
              }
              placeholder="Select Location"
              isDisabled={!workData.companyCode}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Department
            </label>
            <Select
              options={DEPARTMENTS}
              value={
                workData.department
                  ? { value: workData.department, label: workData.department }
                  : null
              }
              onChange={(opt) =>
                setWorkData((prev) => ({
                  ...prev,
                  department: opt?.value || "",
                  subDepartment: "",
                  position: "",
                }))
              }
              placeholder="Select Department"
            />
          </div>

          {/* Sub Department */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sub Department
            </label>
            <Select
              options={
                workData.department
                  ? SUB_DEPARTMENTS[workData.department].map((sd) => ({
                    value: sd,
                    label: sd,
                  }))
                  : []
              }
              value={
                workData.subDepartment
                  ? {
                    value: workData.subDepartment,
                    label: workData.subDepartment,
                  }
                  : null
              }
              onChange={(opt) =>
                setWorkData((prev) => ({
                  ...prev,
                  subDepartment: opt?.value || "",
                  position: "",
                }))
              }
              placeholder="Select Sub Department"
              isDisabled={!workData.department}
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Position
            </label>
            <Select
              options={
                workData.subDepartment
                  ? (POSITIONS[workData.subDepartment] || []).map((p) => ({
                    value: p,
                    label: p,
                  }))
                  : []
              }
              value={
                workData.position
                  ? { value: workData.position, label: workData.position }
                  : null
              }
              onChange={(opt) =>
                setWorkData((prev) => ({ ...prev, position: opt?.value || "" }))
              }
              placeholder="Select Position"
              isDisabled={!workData.subDepartment}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              name="title"
              value={workData.title}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Manager */}
          {/* <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Manager
            </label>
            <input
              name="manager"
              value={workData.manager}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div> */}
          {/* Manager Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Manager
            </label>
            <select
              name="manager"
              value={workData.manager}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="0">None</option> {/* None option with value 0 */}
              <option value="">Select Manager</option>{" "}
              {/* Optional placeholder */}
              {employeeList
                .filter((emp) => emp.emp_id !== employee.emp_id) // exclude current employee
                .map((emp) => (
                  <option key={emp.emp_id} value={emp.emp_id}>
                    {emp.emp_title} {emp.emp_fname} {emp.emp_lname}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="bg-gray-50 border p-6 rounded-xl">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Work Address
        </label>
        <textarea
          name="work_address"
          value={workData.work_address}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </section>

      {/* Resume */}
      {/* <section className="bg-gray-50 border p-6 rounded-xl">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2">
          Resume
        </h4>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeUpload}
          className="border p-2 mt-3 rounded-md"
        />
        {workData.resume && (
          <span className="ml-3 text-sm text-green-600">
            📎 {workData.resume}
          </span>
        )}
      </section> */}
      {/* Resume */}
      <section className="bg-gray-50 border p-6 rounded-xl">
        <h4 className="text-blue-700 font-semibold text-sm uppercase border-b pb-2 mb-4">
          Resume
        </h4>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Upload */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="border p-2 rounded-md text-sm w-[260px]"
          />

          {/* Right Side: Name + View + Download */}
          {workData.resume && (
            <div className="flex items-center gap-4 text-sm bg-white px-4 py-2 rounded-lg border shadow-sm">
              <span className="text-gray-700 max-w-[220px] truncate">
                📎 {workData.resume}
              </span>

              <a
                href={`${constantApi.imageUrl}/Employee_profile/${encodeURIComponent(
                  workData.resume,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                View
              </a>

              <button
                type="button"
                onClick={() =>
                  forceDownload(
                    `${constantApi.imageUrl}/Employee_profile/${encodeURIComponent(
                      workData.resume,
                    )}`,
                    workData.resume,
                  )
                }
                className="text-green-600 font-medium hover:underline"
              >
                Download
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Buttons */}
      {/* {(userRole === 1 || userRole === 5) && ( */}
      {userRole != 2 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Delete
          </button>
          <div className="space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Update
            </button>

            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
