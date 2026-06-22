import React, { useState, useEffect } from "react";
import { Card, Grid, TextField, Typography, Button } from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import { axios_post } from "../../axios"; // custom axios for POST calls
import constantApi from "../../constantApi";

export default function EmployeeAssignment() {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [form, setForm] = useState({
    department: "",
    designation: "",
  });

  const [saving, setSaving] = useState(false);

  // 🔹 Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios_post(true, "employee/list"); // use axios_post if needed
        const data = res.data || [];
        const options = data.map((emp) => ({
          value: emp.emp_id,
          label: `${emp.emp_fname} ${emp.emp_lname}`,
          emp_fname: emp.emp_fname,
          emp_lname: emp.emp_lname,
          company_id: emp.company_id,
          location_id: emp.location_id,
          department: emp.department,
          designation: emp.designation,
        }));
        setEmployees(options);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employees!");
      }
    };
    fetchEmployees();
  }, []);

  // 🔹 Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios_post(true, "company/com_list");
        if (response?.status && Array.isArray(response.data)) {
          const options = response.data.map((comp) => ({
            value: comp.id, // use id here
            label: comp.compdesc,
          }));
          setCompanies(options);
        } else {
          toast.error(response?.message || "Failed to fetch companies");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load companies!");
      }
    };
    fetchCompanies();
  }, []);

  // 🔹 Fetch Locations by Company
  const fetchLocationsByCompany = async (company) => {
    if (!company) return;
    try {
      const payload = { company_id: company.value }; // send company_id
      const response = await axios_post(true, "location/loc_list", payload);
      if (response.status) {
        const options = response.data.map((loc) => ({
          value: loc.id,
          label: loc.locname,
        }));
        setLocations(options);

        // Auto-select location if employee already assigned
        if (selectedEmployee && selectedEmployee.location_id) {
          const preselected = options.find(
            (loc) => loc.value === selectedEmployee.location_id
          );
          if (preselected) setSelectedLocation(preselected);
        }
      } else {
        setLocations([]);
        toast.error(response.message || "No locations found for this company");
      }
    } catch (err) {
      console.error(err);
      setLocations([]);
      toast.error("Error fetching locations");
    }
  };

  // 🔹 When Employee is selected
  const handleEmployeeChange = (employee) => {
    setSelectedEmployee(employee);
    setForm({
      department: employee.department || "",
      designation: employee.designation || "",
    });

    // Preselect company and fetch locations
    if (employee.company_id) {
      const companyObj = companies.find((c) => c.value === employee.company_id);
      setSelectedCompany(companyObj || null);
      fetchLocationsByCompany(companyObj);
    }
  };

  // 🔹 When Company is selected
  const handleCompanyChange = (company) => {
    setSelectedCompany(company);
    setSelectedLocation(null); // reset location
    fetchLocationsByCompany(company);
  };

  // 🔹 Submit Handler
  const handleSubmit = async () => {
    if (!selectedEmployee) return toast.warning("Please select an employee!");
    if (!selectedCompany) return toast.warning("Please select a company!");
    if (!selectedLocation) return toast.warning("Please select a location!");

    const payload = {
      emp_fname: selectedEmployee.emp_fname,
      emp_lname: selectedEmployee.emp_lname,
      company_id: selectedCompany.value,
      location_id: selectedLocation.value,
      department: form.department,
      designation: form.designation,
    };

    setSaving(true);
    try {
      await axios_post(true, `employee/update/${selectedEmployee.value}`, payload);
      toast.success("✅ Employee updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating employee!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card sx={{ p: 4, boxShadow: 4, borderRadius: 3, maxWidth: 700, mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        👤 Employee Assignment
      </Typography>

      <Grid container spacing={3}>
        {/* Employee */}
        <Grid item xs={12}>
          <Select
            options={employees}
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            placeholder="Select Employee"
            isSearchable
          />
        </Grid>

        {/* Company */}
        <Grid item xs={12}>
          <Select
            options={companies}
            value={selectedCompany}
            onChange={handleCompanyChange}
            placeholder="Select Company"
            isSearchable
            noOptionsMessage={() => "No companies found"}
          />
        </Grid>

        {/* Location */}
        <Grid item xs={12}>
          <Select
            options={locations}
            value={selectedLocation}
            onChange={setSelectedLocation}
            placeholder="Select Location"
            isSearchable
            isDisabled={!selectedCompany}
          />
        </Grid>

        {/* Department */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
        </Grid>

        {/* Designation */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Designation"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          />
        </Grid>

        {/* Submit */}
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 6, py: 1.5, mt: 2, borderRadius: 2 }}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Assignment"}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
