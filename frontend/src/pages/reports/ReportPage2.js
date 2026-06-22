// InvoicePageRedesign.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SearchIcon from "@mui/icons-material/Search";
import ReplayIcon from "@mui/icons-material/Replay";

const sampleData = [
  {
    date: "2017-08-01",
    invoice: "INV-5713114PQR",
    customer: "Cisco Systems",
    project: "CISCO-Image Processing CS",
    amount: 6302,
    paid: 6302,
    balance: 0,
    dueDate: "2017-08-31",
    lateDays: 0,
    paymentStatus: "Paid",
    invoiceStatus: "Invoiced",
  },
  {
    date: "2017-07-31",
    invoice: "INV-5713113PQR",
    customer: "Ecker Design",
    project: "Design Revamp",
    amount: 500,
    paid: 0,
    balance: 500,
    dueDate: "2017-08-07",
    lateDays: 0,
    paymentStatus: "Not Due",
    invoiceStatus: "Draft",
  },
  {
    date: "2017-07-20",
    invoice: "INV-5713112PQR",
    customer: "Finisar",
    project: "Bonsai",
    amount: 1600,
    paid: 0,
    balance: 1600,
    dueDate: "2017-07-20",
    lateDays: 12,
    paymentStatus: "Late",
    invoiceStatus: "Invoiced",
  },
  {
    date: "2017-07-18",
    invoice: "INV-5713111PQR",
    customer: "Cisco Systems",
    project: "CISCO-Image Processing CS",
    amount: 4302,
    paid: 0,
    balance: 4302,
    dueDate: "2017-08-17",
    lateDays: 0,
    paymentStatus: "Not Due",
    invoiceStatus: "Invoiced",
  },
  {
    date: "2017-07-13",
    invoice: "INV-5713110PQR",
    customer: "Finisar",
    project: "Bonsai",
    amount: 21600,
    paid: 0,
    balance: 21600,
    dueDate: "2017-07-13",
    lateDays: 19,
    paymentStatus: "Late",
    invoiceStatus: "Invoiced",
  },
  {
    date: "2017-07-07",
    invoice: "INV-571309PQR",
    customer: "Cisco Systems",
    project: "CISCO-Image Processing CS",
    amount: 14316.54,
    paid: 9998.5,
    balance: 4318.04,
    dueDate: "2017-08-06",
    lateDays: 0,
    paymentStatus: "Not Due",
    invoiceStatus: "Invoiced",
  },
  {
    date: "2017-07-05",
    invoice: "INV-571308PQR",
    customer: "Finisar",
    project: "Bonsai",
    amount: 4000,
    paid: 0,
    balance: 4000,
    dueDate: "2017-07-05",
    lateDays: 27,
    paymentStatus: "Late",
    invoiceStatus: "Invoiced",
  },
  {
    date: "2017-07-03",
    invoice: "INV-571307PQR",
    customer: "Cisco Systems",
    project: "CISCO-Image Processing CS",
    amount: 15001.5,
    paid: 15001.5,
    balance: 0,
    dueDate: "2017-08-02",
    lateDays: 0,
    paymentStatus: "Paid",
    invoiceStatus: "Invoiced",
  },
  {
    date: "2017-07-01",
    invoice: "INV-571306PQR",
    customer: "Ecker Design",
    project: "Design Revamp",
    amount: 500,
    paid: 0,
    balance: 500,
    dueDate: "2017-07-08",
    lateDays: 24,
    paymentStatus: "Late",
    invoiceStatus: "Invoiced",
  },
];

export default function ReportPage2() {
  const navigate = useNavigate(); // keep for tab navigation
  const [tabValue, setTabValue] = useState(5); // set to Invoices roughly
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    customer: "",
    project: "",
    paymentStatus: "",
    invoiceStatus: "",
  });

  // derived lists for dropdowns
  const customers = useMemo(
    () => Array.from(new Set(sampleData.map((d) => d.customer))),
    []
  );
  const projects = useMemo(
    () => Array.from(new Set(sampleData.map((d) => d.project))),
    []
  );

  // Filter logic (basic)
  const filtered = useMemo(() => {
    return sampleData.filter((row) => {
      if (filters.customer && row.customer !== filters.customer) return false;
      if (filters.project && row.project !== filters.project) return false;
      if (filters.paymentStatus && row.paymentStatus !== filters.paymentStatus)
        return false;
      if (filters.invoiceStatus && row.invoiceStatus !== filters.invoiceStatus)
        return false;
      if (filters.dateFrom && row.date < filters.dateFrom) return false;
      if (filters.dateTo && row.date > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const totals = useMemo(() => {
    const amount = filtered.reduce((s, r) => s + (r.amount || 0), 0);
    const paid = filtered.reduce((s, r) => s + (r.paid || 0), 0);
    const balance = filtered.reduce((s, r) => s + (r.balance || 0), 0);
    return { amount, paid, balance };
  }, [filtered]);

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
    // simple routing - you can expand to match your app routes
    switch (newValue) {
      case 0:
        return navigate("/home");
      case 1:
        return navigate("/time");
      case 2:
        return navigate("/resource-allocation");
      case 3:
        return navigate("/utilization");
      case 4:
        return navigate("/expenses");
      case 5:
        return navigate("/invoices");
      case 6:
        return navigate("/budget");
      case 7:
        return navigate("/profitability");
      case 8:
        return navigate("/cost");
      case 9:
        return navigate("/resource");
      case 10:
        return navigate("/reports");
      case 11:
        return navigate("/settings");
      default:
        break;
    }
  };

  const handleFilterChange = (key) => (e) => {
    setFilters((s) => ({ ...s, [key]: e.target.value }));
  };

  const handleReset = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      customer: "",
      project: "",
      paymentStatus: "",
      invoiceStatus: "",
    });
  };

  const renderPaymentStatus = (status) => {
    if (status === "Paid")
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Paid"
          color="success"
          size="small"
        />
      );
    if (status === "Draft")
      return (
        <Chip
          icon={<HourglassEmptyIcon />}
          label="Draft"
          color="warning"
          size="small"
        />
      );
    if (status === "Late")
      return (
        <Chip icon={<CancelIcon />} label="Late" color="error" size="small" />
      );
    return <Chip label={status} size="small" />;
  };

  const renderInvoiceStatus = (status) => {
    if (status === "Invoiced")
      return <Chip label="Invoiced" size="small" color="primary" />;
    if (status === "Draft")
      return <Chip label="Draft" size="small" color="warning" />;
    return <Chip label={status} size="small" />;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Top Navigation (wide like screenshot) */}
      <Box sx={{ mb: 2 }}>
        <AppBar
          position="static"
          color="default"
          elevation={2}
          sx={{ background: "#0b57a4" }}
        >
          <Toolbar variant="dense" sx={{ px: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="inherit"
              indicatorColor="secondary"
              sx={{
                ".MuiTab-root": {
                  minWidth: 60, // smaller width
                  textTransform: "none",
                  fontWeight: 600,
                  padding: "4px 8px", // smaller padding
                  fontSize: "0.75rem", // smaller text
                },
                ".Mui-selected": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                  borderRadius: 1,
                },
              }}
            >
              <Tab
                icon={<HomeIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Home"
                value={0}
              />
              {/* <Tab
                icon={<AccessTimeIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Time"
                value={1}
              /> */}
              <Tab
                icon={<EventNoteIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Grn"
                value={2}
              />
              <Tab
                icon={<AssignmentIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Purchase Orders"
                value={3}
              />
              <Tab
                icon={<ReceiptIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Orders"
                value={4}
              />
              <Tab
                icon={<ReceiptIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Invoices"
                value={5}
              />
              <Tab
                icon={<AssessmentIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Budget"
                value={6}
              />
              <Tab
                icon={<AssessmentIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Profitability"
                value={7}
              />
              <Tab
                icon={<AssessmentIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Cost"
                value={8}
              />
              <Tab
                icon={<AssessmentIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Resource"
                value={9}
              />
              <Tab
                icon={<AssessmentIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Reports"
                value={10}
              />
              <Tab
                icon={<SettingsIcon style={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Settings"
                value={11}
              />
            </Tabs>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Filters area */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <TextField
              label="Date From"
              type="date"
              value={filters.dateFrom}
              onChange={handleFilterChange("dateFrom")}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Date To"
              type="date"
              value={filters.dateTo}
              onChange={handleFilterChange("dateTo")}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Select
              value={filters.customer}
              onChange={handleFilterChange("customer")}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">---All Customers---</MenuItem>
              {customers.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} md={2}>
            <Select
              value={filters.project}
              onChange={handleFilterChange("project")}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">---All Projects---</MenuItem>
              {projects.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6} md={2}>
            <Select
              value={filters.paymentStatus}
              onChange={handleFilterChange("paymentStatus")}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">---All Payment Status---</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Not Due">Not Due</MenuItem>
              <MenuItem value="Late">Late</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={6} md={2}>
            <Select
              value={filters.invoiceStatus}
              onChange={handleFilterChange("invoiceStatus")}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">---All Invoice Status---</MenuItem>
              <MenuItem value="Invoiced">Invoiced</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} md={6} sx={{ mt: { xs: 1, md: 0 } }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => {
                /* already applied by controlled filters — placeholder */
              }}
              color="primary"
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<ReplayIcon />}
              onClick={handleReset}
              sx={{ ml: 2 }}
            >
              Reset
            </Button>
          </Grid>

          {/* export icons row */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: "left", md: "right" } }}
          >
            <Tooltip title="QuickBooks Online Export">
              <Chip
                label="QB Online"
                icon={<FileDownloadIcon />}
                sx={{ mr: 1 }}
              />
            </Tooltip>
            <Tooltip title="QuickBooks Export">
              <Chip
                label="QB Export"
                icon={<FileDownloadIcon />}
                sx={{ mr: 1 }}
              />
            </Tooltip>
            <Tooltip title="Export CSV">
              <IconButton>
                <SaveAltIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Get PDF">
              <IconButton>
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary strip */}
      {/* Summary strip */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper
          sx={{
            flex: 1,
            p: 2,
            background: "#63a4ff", // light blue
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "0.75rem", color: "#fff" }}
          >
            Amount ${totals.amount.toLocaleString()}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "0.75rem", color: "#fff" }}
          >
            Paid ${totals.paid.toLocaleString()}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "0.75rem", color: "#fff" }}
          >
            Balance ${totals.balance.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      {/* Table */}
      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          width: "100%", // full width
          overflowX: "auto", // horizontal scroll
        }}
        elevation={3}
      >
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#63a4ff" }}>
              {[
                { label: "Date", width: 100 },
                { label: "Invoice Number", width: 200 },
                { label: "Customer", width: 150 },
                { label: "Project", width: 150 },
                { label: "Amount", width: 100 },
                { label: "Paid", width: 100 },
                { label: "Balance", width: 100 },
                { label: "Due Date", width: 120 },
                { label: "Late Days", width: 100 },
                { label: "Payment Status", width: 150 },
                { label: "Invoice Status", width: 150 },
              ].map((col) => (
                <TableCell
                  key={col.label}
                  sx={{
                    color: "white",
                    fontWeight: 600, // semi-bold
                    fontSize: "0.75rem", // small text
                    py: 0.5, // smaller vertical padding
                    px: 1, // optional horizontal padding
                    width: col.width, // set width
                    minWidth: col.width, // ensure scroll works
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row, idx) => (
              <TableRow
                key={row.invoice}
                hover
                sx={{
                  backgroundColor: idx % 2 === 0 ? "#fafafa" : "white",
                }}
              >
                <TableCell sx={{ fontSize: "0.75rem", width: 100, py: 0.5 }}>
                  {row.date}
                </TableCell>
                <TableCell sx={{ width: 150, py: 0.5 }}>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ fontSize: "0.75rem", py: 0 }}
                    onClick={() => alert(`Open invoice ${row.invoice}`)}
                  >
                    {row.invoice}
                  </Button>
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", width: 150, py: 0.5 }}>
                  {row.customer}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", width: 150, py: 0.5 }}>
                  {row.project}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    width: 100,
                    py: 0.5,
                  }}
                >
                  ${row.amount.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    width: 100,
                    py: 0.5,
                  }}
                >
                  ${row.paid.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    width: 100,
                    py: 0.5,
                  }}
                >
                  ${row.balance.toLocaleString()}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", width: 120, py: 0.5 }}>
                  {row.dueDate}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", width: 100, py: 0.5 }}>
                  {row.lateDays}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", width: 150, py: 0.5 }}>
                  {renderPaymentStatus(row.paymentStatus)}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", width: 150, py: 0.5 }}>
                  {renderInvoiceStatus(row.invoiceStatus)}
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={11}
                  align="center"
                  sx={{ py: 4, fontSize: "0.75rem" }}
                >
                  No invoices found for selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ height: 40 }} />
    </DashboardLayout>
  );
}
