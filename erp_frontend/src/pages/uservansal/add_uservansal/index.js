import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { MenuItem, Select as MUISelect } from "@mui/material";

import Select from "react-select"; // <-- react-select for email only

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

import { axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import axios from "axios";
import constantApi from "../../../constantApi";

function Add_Uservansal() {
  const navigate = useNavigate();

  const [formError, setFormError] = useState({});
  const [isSubmit, setisSubmit] = useState(false);

  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [roleMaster, setRoleMaster] = useState([]);

  const [employeeList, setEmployeeList] = useState([]);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
    company_id: "",
    location_id: "",
    role_id: "",
  });

  // ====================================
  // ROLE MASTER
  // ====================================
  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/role_master/list`)
      .then((res) => setRoleMaster(res.data.data || []))
      .catch((err) => console.log("Role error:", err));
  }, []);

  // ====================================
  // COMPANY LIST
  // ====================================
  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response.status) setCompines(response.data || []);
  };

  // ====================================
  // LOCATION LIST
  // ====================================
  const fetchlocationList = async (companies) => {
    const response = await axios_post(true, "location/loc_list");
    if (!response.status) return;

    const filtered = response.data.filter((loc) =>
      companies.map(String).includes(String(loc.compdesc))
    );

    setlocations(filtered || []);
  };

  useEffect(() => {
    fetchcompanyList();
  }, []);

  // ====================================
  // EMPLOYEE LIST FOR EMAIL DROPDOWN
  // ====================================
  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/employee/list`)
      .then((res) => {
        setEmployeeList(res.data.data || []);
      })
      .catch((err) => console.error("Employee list error:", err));
  }, []);

  const emailOptions = employeeList.map((emp) => ({
    value: emp.emp_email,
    label: `${emp.emp_email} — ${emp.emp_fname} ${emp.emp_lname}`,
  }));

  // ====================================
  // GET EMPLOYEE DETAILS BY EMAIL
  // ====================================
  const fetchEmployeeAutoFill = async (email) => {
    if (!email) return;

    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/employee/details/email/${email}`
      );

      if (res.data.status) {
        const emp = res.data.data;

        console.log("emp data is -----------,emp", emp.work);

        setFormData((prev) => ({
          ...prev,
          firstname: emp.emp_fname || "",
          lastname: emp.emp_lname || "",
          mobile: emp.emp_phone || "",

          // ⭐ AUTO-FILL COMPANY & LOCATION
          // company_id: emp.work?.companyCode || "",
          //           location_id: emp.work?.locationId || "",

          company_id: Number(emp.work?.companyCode) || "",
          location_id: Number(emp.work?.locationId) || "",
        }));
      }
    } catch (err) {
      console.log("Auto-fill error:", err);
    }
  };

  // ====================================
  // VALIDATION
  // ====================================
  const validation = (formData) => {
    let errors = {};

    if (!formData.firstname) errors.firstname = "Firstname is required";
    // if (!formData.lastname) errors.lastname = "Lastname is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.mobile) errors.mobile = "Mobile is required";

    if (!formData.company_id) errors.company_id = "Company is required";

    if (!formData.location_id) errors.location_id = "Location is required";
    if (!formData.role_id) errors.role_id = "Role is required";

    return errors;
  };

  // ====================================
  // HANDLE CHANGE
  // ====================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "companies" && { location_id: "" }),
    }));

    if (name === "companies") {
      const val = Array.isArray(value) ? value : value.split(",");
      fetchlocationList(val);
    }
  };

  // ====================================
  // SUBMIT
  // ====================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setisSubmit(true);

    let errors = validation(formData);
    if (Object.keys(errors).length) {
      setFormError(errors);
      setisSubmit(false);
      return;
    }

    setFormError({});

    try {
      const response = await axios_post(
        true,
        "user_user_master/store",
        formData
      );

      console.log("Submit response:", response);

      // If axios_post returns the data directly (based on your example)
      if (response.status === true) {
        ToastMassage(response.message || "Saved successfully", "success");
        navigate("/uservansal");
      } else {
        ToastMassage(response.message || "Error saving data", "error");
      }
    } catch (error) {
      ToastMassage("Network or server error", "error");
      console.error(error);
    }

    setisSubmit(false);
  };

  const handleSubmit1 = async (event) => {
    setisSubmit(true);
    event.preventDefault();

    let errors = validation(formData);
    if (Object.keys(errors).length) {
      setFormError(errors);
      setisSubmit(false);
      return;
    }

    setFormError({});
    const response = await axios_post(true, "user_user_master/store", formData);

    if (response.status) {
      ToastMassage(response.message, "success");
      navigate("/uservansal");
    } else {
      ToastMassage(response.message, "error");
    }

    setisSubmit(false);
  };

  const handleBack = () => {
    navigate("/uservansal");
  };
  useEffect(() => {
    if (formData.company_id) {
      fetchlocationList([formData.company_id]);
    }
  }, [formData.company_id]);

  // ====================================
  // RETURN UI
  // ====================================
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Card>
                {/* HEADER */}
                <div className="mx-4 mt-[-12px] py-3 px-4 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 shadow-md">
                  <div className="grid grid-cols-12 items-center">
                    {/* Left: Title */}
                    <div className="col-span-6">
                      <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <span className="material-icons text-base">
                          shopping_cart
                        </span>
                        Add User JERP
                      </h2>
                    </div>

                    {/* Right: Back Button */}
                    <div className="col-span-6 text-right">
                      <button
                        onClick={handleBack}
                        className="bg-white text-sky-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>

                {/* ---------------- FORM START ---------------- */}
                {/* ---------------- FORM START ---------------- */}
                <div className="pt-4 pb-3 px-3">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Email */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium mb-1">
                        Email
                      </label>
                      <Select
                        options={emailOptions}
                        placeholder="Search email"
                        className="text-sm"
                        value={
                          emailOptions.find(
                            (e) => e.value === formData.email
                          ) || null
                        }
                        onChange={(selected) => {
                          const email = selected?.value || "";
                          setFormData({ ...formData, email });
                          fetchEmployeeAutoFill(email);
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: 45,
                            minHeight: 45,
                            fontSize: 13,
                          }),
                        }}
                      />
                    </div>

                    {/* Firstname */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium mb-1">
                        Firstname
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="w-full h-[45px] border rounded px-3 text-sm focus:ring focus:ring-blue-200"
                      />
                    </div>

                    {/* Lastname */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium mb-1">
                        Lastname
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="w-full h-[45px] border rounded px-3 text-sm focus:ring focus:ring-blue-200"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium mb-1">
                        Mobile
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={(e) => {
                          if (/^\d{0,10}$/.test(e.target.value))
                            handleChange(e);
                        }}
                        className="w-full h-[45px] border rounded px-3 text-sm focus:ring focus:ring-blue-200"
                      />
                    </div>

                    {/* Company */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium mb-1">
                        Company
                      </label>
                      <Select
                        isMulti={false}
                        options={compines.map((c) => ({
                          value: c.id,
                          label: c.compdesc,
                        }))}
                        value={
                          formData.company_id
                            ? {
                                value: formData.company_id,
                                label:
                                  compines.find(
                                    (c) => c.id === formData.company_id
                                  )?.compdesc || "",
                              }
                            : null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            company_id: selected?.value || "",
                            location_id: "",
                          }))
                        }
                        placeholder="Select Company"
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: 45,
                            minHeight: 45,
                            fontSize: 13,
                          }),
                        }}
                      />
                    </div>

                    {/* Location */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium mb-1">
                        Location
                      </label>
                      <Select
                        options={locations
                          .filter(
                            (loc) =>
                              String(loc.company_id) ===
                              String(formData.company_id)
                          )
                          .map((loc) => ({
                            value: loc.id,
                            label: loc.locname,
                          }))}
                        value={
                          locations.find(
                            (l) => String(l.id) === String(formData.location_id)
                          )
                            ? {
                                value: formData.location_id,
                                label: locations.find(
                                  (l) =>
                                    String(l.id) ===
                                    String(formData.location_id)
                                ).locname,
                              }
                            : null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            location_id: selected?.value || "",
                          }))
                        }
                        placeholder="Select Location"
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: 45,
                            minHeight: 45,
                            fontSize: 13,
                          }),
                        }}
                      />
                    </div>

                    {/* Password */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium mb-1">
                        Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-[45px] border rounded px-3 text-sm focus:ring focus:ring-blue-200"
                      />
                    </div>

                    {/* Role */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium mb-1">
                        Role
                      </label>
                      <select
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        className="w-full h-[45px] border rounded px-3 text-sm focus:ring focus:ring-blue-200"
                      >
                        <option value="">Select Role</option>
                        {roleMaster.map((role) => (
                          <option key={role.id} value={role.role_id}>
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Buttons Row */}
                    <div className="col-span-12 flex justify-end mt-6">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded shadow text-sm"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={handleBack}
                        className="ml-3 bg-gray-500 text-white px-6 py-2 rounded shadow text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </form>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Add_Uservansal;
