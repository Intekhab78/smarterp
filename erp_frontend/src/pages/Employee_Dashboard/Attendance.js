import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [openMonths, setOpenMonths] = useState({});
  const [openEmployees, setOpenEmployees] = useState({});
  const BACKEND_URL = "http://localhost:5610";
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/attendance/list`);
      setRecords(res.data.data || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      alert("Failed to load attendance data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Export function
  const exportToExcel = () => {
    if (records.length === 0) {
      alert("No attendance data to export!");
      return;
    }

    const exportData = records.map((r) => ({
      Employee: `${r.emp_fname} `,
      Month: r.month,
      "Total Days": r.total_days,
      "Present Days": r.present_days,
      "Check In": r.checkin,
      "Check Out": r.checkout,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Attendance.xlsx");
  };

  const groupedByMonth = records.reduce((acc, rec) => {
    const month = rec.month;
    if (!acc[month]) acc[month] = {};
    const empName = `${rec.emp_fname || ""} `.trim() || `Employee ${rec.emp_id}`;
    if (!acc[month][empName]) acc[month][empName] = [];
    acc[month][empName].push(rec);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 2 }}>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Attendances
          </Typography>
          <Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#7b1fa2",
                textTransform: "none",
                "&:hover": { backgroundColor: "#6a1b9a" },
                mr: 1,
              }}
              onClick={() => navigate("/emp_attendance")}
            >
              ➕ New
            </Button>
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "#fff",
                color: "#7b1fa2",
                textTransform: "none",
                "&:hover": { backgroundColor: "#f3e5f5" },
              }}
              onClick={exportToExcel}
            >
              📥 Export
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <Table>
          <TableHead sx={{ background: "#f3e5f5" }}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total Days</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Present Days</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(groupedByMonth).map((month) => {
              const employees = groupedByMonth[month];
              const totalRecords = Object.values(employees).flat().length;
              return (
                <React.Fragment key={month}>
                  <TableRow
                    sx={{ backgroundColor: "#ede7f6", "&:hover": { backgroundColor: "#d1c4e9" }, cursor: "pointer" }}
                    onClick={() => setOpenMonths({ ...openMonths, [month]: !openMonths[month] })}
                  >
                    <TableCell width="5%">
                      <IconButton size="small">{openMonths[month] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</IconButton>
                    </TableCell>
                    <TableCell colSpan={6} sx={{ fontWeight: 600 }}>
                      {month} ({totalRecords})
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={openMonths[month]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Table size="small">
                            <TableBody>
                              {Object.keys(employees).map((empName) => {
                                const empRecords = employees[empName];
                                return (
                                  <React.Fragment key={empName}>
                                    <TableRow
                                      sx={{ backgroundColor: "#f5f5f5", "&:hover": { backgroundColor: "#e0e0e0" }, cursor: "pointer" }}
                                      onClick={() => setOpenEmployees({ ...openEmployees, [empName]: !openEmployees[empName] })}
                                    >
                                      <TableCell width="5%">
                                        <IconButton size="small">
                                          {openEmployees[empName] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                      </TableCell>
                                      <TableCell colSpan={6}>
                                        {empName} ({empRecords.length})
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                        <Collapse in={openEmployees[empName]} timeout="auto" unmountOnExit>
                                          <Box sx={{ margin: 1 }}>
                                            <Table size="small">
                                              <TableBody>
                                                {empRecords.map((r) => (
                                                  <TableRow key={r.id}>
                                                    <TableCell />
                                                    <TableCell>{r.emp_fname} {r.emp_lname}</TableCell>
                                                    <TableCell>{r.month}</TableCell>
                                                    <TableCell>{r.total_days}</TableCell>
                                                    <TableCell>{r.present_days}</TableCell>
                                                    <TableCell>{r.checkin}</TableCell>
                                                    <TableCell>{r.checkout}</TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </Box>
                                        </Collapse>
                                      </TableCell>
                                    </TableRow>
                                  </React.Fragment>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  );
}
