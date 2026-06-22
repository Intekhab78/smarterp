import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import constantApi from "../../../constantApi";

export default function AddPosition({ open, onClose }) {
    if (!open) return null;

    const [formData, setFormData] = useState({
        company_id: "",
        location_id: "",
        department_id: "",
        sub_department_id: "",
        position_name: "",
        position_head: "",
        start_date: "",
        end_date: "",
        description: "",
        note1: "",
        note2: "",
        added_by: "Admin",
    });

    const [companies, setCompanies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subDepartments, setSubDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios
            .get(`${constantApi.baseUrl}/employee/list`)
            .then((res) => {
                const list = res.data?.data || [];
                setEmployees(
                    list.map((emp) => ({
                        value: emp.emp_id,
                        label: `${emp.emp_fname} ${emp.emp_lname}`.trim(),
                    }))
                );
            })
            .catch((err) => console.error("❌ Employee API Error:", err));
    }, []);

    useEffect(() => {
        axios
            .post(`${constantApi.baseUrl}/company/com_list`)
            .then((res) =>
                setCompanies(
                    (res.data?.data || []).map((c) => ({
                        value: c.id,
                        label: c.compdesc,
                    }))
                )
            );
    }, []);

    const fetchLocations = async (companyId) => {
        const res = await axios.post(
            `${constantApi.baseUrl}/location/loc_list`,
            { company_id: companyId }
        );
        setLocations(
            (res.data?.data || []).map((l) => ({
                value: l.id,
                label: l.locname,
            }))
        );
    };

    const fetchDepartments = async (locationId) => {
        const res = await axios.post(
            `${constantApi.baseUrl}/departments/dep_list`,
            { location_id: locationId }
        );
        setDepartments(
            (res.data?.data || []).map((d) => ({
                value: d.id,
                label: d.department_name,
            }))
        );
    };

    const fetchSubDepartments = async (departmentId) => {
        const res = await axios.post(
            `${constantApi.baseUrl}/sub_departments/list`,
            { department_id: departmentId }
        );
        setSubDepartments(
            (res.data?.data || []).map((s) => ({
                value: s.id,
                label: s.sub_department_name,
            }))
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));

        if (name === "company_id") {
            setLocations([]);
            setDepartments([]);
            setSubDepartments([]);
            setFormData((p) => ({
                ...p,
                location_id: "",
                department_id: "",
                sub_department_id: "",
            }));
            fetchLocations(value);
        }

        if (name === "location_id") {
            setDepartments([]);
            setSubDepartments([]);
            setFormData((p) => ({
                ...p,
                department_id: "",
                sub_department_id: "",
            }));
            fetchDepartments(value);
        }

        if (name === "department_id") {
            setSubDepartments([]);
            setFormData((p) => ({ ...p, sub_department_id: "" }));
            fetchSubDepartments(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // await axios.post(`${constantApi.baseUrl}/positions/create`, formData);

            Swal.fire({
                icon: "success",
                title: "Position Added Successfully",
                timer: 1500,
                showConfirmButton: false,
            });

            onClose(); // ✅ CLOSE MODAL AFTER SAVE

            setFormData({
                company_id: "",
                location_id: "",
                department_id: "",
                sub_department_id: "",
                position_name: "",
                position_head: "",
                start_date: "",
                end_date: "",
                description: "",
                note1: "",
                note2: "",
                added_by: "Admin",
            });
        } catch {
            Swal.fire("Error", "Failed to add position", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-[1px]">
            <div className="bg-white w-full max-w-[520px] rounded-xl shadow-xl p-3 animate-fadeIn">

                {/* ===== HEADER ===== */}
                <div className="flex justify-between items-center mb-2 pb-1 border-b">
                    <h2 className="text-sm font-semibold text-gray-800">
                        Add Position
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-sm"
                    >
                        ✖
                    </button>
                </div>

                {/* ===== FORM ===== */}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-3 gap-y-2">

                    <Select
                        label="Company *"
                        name="company_id"
                        value={formData.company_id}
                        onChange={handleChange}
                        options={companies}
                    />

                    <Select
                        label="Location *"
                        name="location_id"
                        value={formData.location_id}
                        onChange={handleChange}
                        options={locations}
                        disabled={!formData.company_id}
                    />

                    <Select
                        label="Department *"
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleChange}
                        options={departments}
                        disabled={!formData.location_id}
                    />

                    <Select
                        label="Sub Department *"
                        name="sub_department_id"
                        value={formData.sub_department_id}
                        onChange={handleChange}
                        options={subDepartments}
                        disabled={!formData.department_id}
                    />

                    <Input
                        label="Position Name *"
                        name="position_name"
                        value={formData.position_name}
                        onChange={handleChange}
                    />

                    <Select
                        label="Position Head"
                        name="position_head"
                        value={formData.position_head}
                        onChange={handleChange}
                        options={employees}
                    />

                    <Input
                        type="date"
                        label="Start Date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                    />

                    <Input
                        type="date"
                        label="End Date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                    />

                    <Input
                        label="Note 1"
                        name="note1"
                        value={formData.note1}
                        onChange={handleChange}
                    />

                    <Input
                        label="Note 2"
                        name="note2"
                        value={formData.note2}
                        onChange={handleChange}
                    />

                    {/* Description (Full Width) */}
                    <div className="col-span-2">
                        <label className="block mb-0.5 text-gray-500 text-[10px]">
                            Description
                        </label>
                        <textarea
                            rows="2"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full text-[11px] border rounded px-1.5 py-1
                       focus:outline-none focus:ring-1 focus:ring-blue-500
                       resize-none"
                        />
                    </div>

                    {/* ===== ACTION BUTTON ===== */}
                    <div className="col-span-2 flex justify-end pt-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-7 px-4 text-[11px] bg-blue-600 text-white rounded-md
                       hover:bg-blue-700 disabled:opacity-60 transition"
                        >
                            {loading ? "Saving..." : "Save Position"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );

}

/* ================= REUSABLE COMPONENTS ================= */

const Select = ({ label, options = [], ...props }) => (
    <div>
        <label className="block mb-0.5 text-gray-500 text-[10px]">
            {label}
        </label>
        <select
            {...props}
            className="w-full h-7 text-[11px] border rounded px-1.5
                 focus:outline-none focus:ring-1 focus:ring-blue-500
                 disabled:bg-gray-100"
        >
            <option value="">Select</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    </div>
);

const Input = ({ label, ...props }) => (
    <div>
        <label className="block mb-0.5 text-gray-500 text-[10px]">
            {label}
        </label>
        <input
            {...props}
            className="w-full h-7 text-[11px] border rounded px-1.5
                 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
    </div>
);

