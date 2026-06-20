// PatientVisitTreatmentReport.js
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { axios_post } from "../../axios";

/* -------------------- Columns -------------------- */
const columns = [
  { field: "visit_date", headerName: "DATE", width: 120 },
  { field: "patient_code", headerName: "CUSTOMER CODE", width: 140 },
  { field: "patient_name", headerName: "CUSTOMER NAME", width: 200 },
  { field: "age", headerName: "AGE", width: 90 },
  { field: "gender", headerName: "GENDER", width: 110 },
  { field: "doctor_name", headerName: "VENDOR", width: 200 },
  { field: "department", headerName: "DEPARTMENT", width: 160 },
  { field: "visit_type", headerName: "VENDOR TYPE", width: 140 },
  // { field: "diagnosis", headerName: "DIAGNOSIS", width: 220 },
  // { field: "treatment", headerName: "TREATMENT", width: 240 },
  { field: "bill_amount", headerName: "BILL (₹)", width: 120 },
  { field: "hospital_name", headerName: "COMPANY", width: 220 },
];

/* -------------------- CSV Export -------------------- */
function exportCSV(rows) {
  const header = [
    "Date",
    "Customer Code",
    "Customer Name",
    "Age",
    "Gender",
    "Vendor",
    "Department",
    "Vendor Type",
    // "Diagnosis",
    // "Treatment",
    "Bill (₹)",
    "company",
  ];
  const csvRows = [header.join(",")];
  rows.forEach((r) => {
    const row = [
      r.visit_date,
      r.patient_code,
      r.patient_name,
      r.age,
      r.gender,
      r.doctor_name,
      r.department,
      r.visit_type,
      r.diagnosis,
      r.treatment,
      r.bill_amount,
      r.hospital_name,
    ].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`);
    csvRows.push(row.join(","));
  });
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "patient_visit_treatment_report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/* -------------------- PDF Export -------------------- */
function exportPDF(rows) {
  const doc = new jsPDF({ putOnlyUsedFonts: true });
  doc.setFontSize(14);
  doc.text("Patient Visit & Treatment Report", 14, 16);
  doc.setFontSize(10);
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 24;
  const rowHeight = 7;
  const maxY = doc.internal.pageSize.getHeight() - 10;
  const cols = ["Date", "Patient", "Doctor", "Visit Type", "Diagnosis", "Bill"];
  doc.text(cols.join("  |  "), 14, y);
  y += rowHeight;
  rows.forEach((r) => {
    const text = [
      r.visit_date,
      `${r.patient_code} ${r.patient_name}`,
      r.doctor_name,
      r.visit_type,
      (r.diagnosis || "").slice(0, 40),
      r.bill_amount,
    ].join("  |  ");
    if (y + rowHeight > maxY) {
      doc.addPage();
      y = 20;
    }
    doc.text(String(text), 14, y, { maxWidth: pageWidth - 28 });
    y += rowHeight;
  });
  doc.save("patient_visit_treatment_report.pdf");
}

/* -------------------- Main Component -------------------- */
export default function OrderReport() {
  const [doctorValue, setDoctorValue] = useState(null);
  const [patientValue, setPatientValue] = useState(null);
  const [appointmentData, setAppointmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* -------------------- Fetch API Data -------------------- */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios_post(true, "vendor/list");
        setDoctors(response?.data?.records || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios_post(true, "customer/list");
        setPatients(response?.data?.records || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAppointment = async () => {
      try {
        const response = await axios_post(true, "doctor_appointment/list");
        setAppointmentData(response.data || []);
        setFilteredData(response.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctors();
    fetchPatients();
    fetchAppointment();
  }, []);

  /* -------------------- Filter Data -------------------- */
  const handleApplyFilters = () => {
    let filtered = appointmentData;

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Filter by doctor
    if (doctorValue) {
      filtered = filtered.filter(
        (item) =>
          item.doctorId === doctorValue.id || item.doctor?.id === doctorValue.id
      );
    }

    // Filter by patient
    if (patientValue) {
      filtered = filtered.filter(
        (item) =>
          item.patientId === patientValue.id ||
          item.patient?.id === patientValue.id
      );
    }

    setFilteredData(filtered);
  };

  const handleResetFilters = () => {
    setDoctorValue(null);
    setPatientValue(null);
    setStartDate("");
    setEndDate("");
    setFilteredData(appointmentData);
  };

  /* -------------------- Map Data to Table -------------------- */
  /* -------------------- Map Data to Table -------------------- */
  const tableRows = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    // ✅ Define the function outside the map object
    const calculateAge = (dob) => {
      if (!dob) return "N/A";
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    // ✅ Then map your data
    return filteredData.map((item, index) => ({
      id: item.id || index + 1,
      visit_date: item.date || "N/A",
      patient_code: item.patient?.id || "N/A",
      patient_name: `${item.patient?.first_name ?? "N/A"} ${
        item.patient?.last_name ?? ""
      }`.trim(),
      age: calculateAge(item.patient?.dob),
      gender: item.patient?.gender ?? "N/A",
      doctor_name: `${item.doctor?.firstname ?? "N/A"} ${
        item.doctor?.lastname ?? ""
      }`.trim(),
      department: item.doctor_type || item.doctor?.vendor_type || "N/A",
      visit_type: item.status || "N/A",
      // diagnosis: item.reason || "N/A",
      // treatment: item.notes || "N/A",
      bill_amount: "N/A",
      hospital_name: item.doctor?.company_name || "N/A",
    }));
  }, [filteredData]);

  /* -------------------- UI -------------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              {/* Header */}
              <MDBox
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                sx={{
                  backgroundColor: "#E7F7EE",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <MDTypography variant="h6" fontWeight="bold" color="#008060">
                  🧾 Order Report
                </MDTypography>
              </MDBox>

              {/* Filters */}
              <MDBox mb={2}>
                <Grid container spacing={2}>
                  {/* Start Date */}
                  <Grid item xs={12} sm={6} md={2.5}>
                    <InputLabel sx={{ mb: 1 }}>Start Date</InputLabel>
                    <TextField
                      type="date"
                      fullWidth
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Grid>

                  {/* End Date */}
                  <Grid item xs={12} sm={6} md={2.5}>
                    <InputLabel sx={{ mb: 1 }}>End Date</InputLabel>
                    <TextField
                      type="date"
                      fullWidth
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Grid>

                  {/* Doctor */}
                  <Grid item xs={12} sm={6} md={3}>
                    <InputLabel sx={{ mb: 1 }}>Vendor</InputLabel>
                    <Autocomplete
                      options={doctors}
                      getOptionLabel={(opt) =>
                        `${opt.firstname || ""} ${opt.lastname || ""}`.trim()
                      }
                      value={doctorValue}
                      onChange={(e, v) => setDoctorValue(v)}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select doctor" />
                      )}
                    />
                  </Grid>

                  {/* Patient */}
                  <Grid item xs={12} sm={6} md={3}>
                    <InputLabel sx={{ mb: 1 }}>Customer</InputLabel>
                    <Autocomplete
                      options={patients}
                      getOptionLabel={(opt) =>
                        `${opt.first_name || ""} ${opt.last_name || ""}`.trim()
                      }
                      value={patientValue}
                      onChange={(e, v) => setPatientValue(v)}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select patient" />
                      )}
                    />
                  </Grid>

                  {/* Buttons */}
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <MDButton
                      variant="contained"
                      sx={{
                        backgroundColor: "#008060",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#006B50" },
                      }}
                      onClick={handleApplyFilters}
                    >
                      Apply
                    </MDButton>

                    <MDButton
                      variant="outlined"
                      sx={{
                        color: "#008060",
                        borderColor: "#008060",
                        "&:hover": { borderColor: "#006B50", color: "#006B50" },
                      }}
                      onClick={handleResetFilters}
                    >
                      Reset
                    </MDButton>

                    <MDButton
                      variant="contained"
                      sx={{
                        backgroundColor: "#008060",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#006B50" },
                      }}
                      onClick={() => exportCSV(tableRows)}
                    >
                      Export CSV
                    </MDButton>

                    <MDButton
                      variant="contained"
                      sx={{
                        backgroundColor: "#008060",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#006B50" },
                      }}
                      onClick={() => exportPDF(tableRows)}
                    >
                      Export PDF
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>

              {/* Table */}
              <MDBox sx={{ height: 520, width: "100%", mt: 2 }}>
                <DataGrid
                  rows={tableRows}
                  columns={columns}
                  pageSize={8}
                  rowsPerPageOptions={[8, 20, 50]}
                  disableSelectionOnClick
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "white",
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#F1FAF6",
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                      fontWeight: 700,
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "#f7fff8",
                    },
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
