import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Paper, Box } from "@mui/material";

import InvoiceHeader from "./InvoiceHeader";
import InvoiceFilters from "./InvoiceFilters";
import InvoiceTable from "./InvoiceTable";

import sampleData from "./sampleData"; // move sampleData to separate file if needed
import { HeaderProvider } from "context/HeaderContext";
import { useHeader } from "context/HeaderContext";

import { SearchProvider } from "context/SearchReportContext";
import SalesTable from "./SalesTable";
import PurchaseTable from "./PurchaseTable";

export default function ReportPage() {
  // return (
  //   <SearchProvider>
  //     <HeaderProvider>
  //       <ReportPageContent /> {/* ⭐ Move logic here */}
  //     </HeaderProvider>
  //   </SearchProvider>
  // );
  return (
    <HeaderProvider>
      {" "}
      {/* Header context first */}
      <SearchProvider>
        {" "}
        {/* Then Search context */}
        <ReportPageContent />
      </SearchProvider>
    </HeaderProvider>
  );
}

function ReportPageContent() {
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    customer: "",
    project: "",
    paymentStatus: "",
    invoiceStatus: "",
  });

  const customers = useMemo(
    () => Array.from(new Set(sampleData.map((d) => d.customer))),
    []
  );
  const projects = useMemo(
    () => Array.from(new Set(sampleData.map((d) => d.project))),
    []
  );

  const { selectedMainHeader } = useHeader(); // ✅ NOW it works (provider above)

  // useEffect(() => {
  //   if (selectedMainHeader) {
  //     alert(`Selected Header: ${selectedMainHeader}`);
  //   }
  // }, [selectedMainHeader]);

  const handleFilterChange = (key) => (e) =>
    setFilters((s) => ({ ...s, [key]: e.target.value }));

  const handleReset = () =>
    setFilters({
      dateFrom: "",
      dateTo: "",
      customer: "",
      project: "",
      paymentStatus: "",
      invoiceStatus: "",
    });

  const filtered = useMemo(
    () =>
      sampleData.filter((row) => {
        if (filters.customer && row.customer !== filters.customer) return false;
        if (filters.project && row.project !== filters.project) return false;
        if (
          filters.paymentStatus &&
          row.paymentStatus !== filters.paymentStatus
        )
          return false;
        if (
          filters.invoiceStatus &&
          row.invoiceStatus !== filters.invoiceStatus
        )
          return false;
        if (filters.dateFrom && row.date < filters.dateFrom) return false;
        if (filters.dateTo && row.date > filters.dateTo) return false;
        return true;
      }),
    [filters]
  );

  const totals = useMemo(
    () => ({
      amount: filtered.reduce((s, r) => s + (r.amount || 0), 0),
      paid: filtered.reduce((s, r) => s + (r.paid || 0), 0),
      balance: filtered.reduce((s, r) => s + (r.balance || 0), 0),
    }),
    [filtered]
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box sx={{ mb: 2 }}>
        <InvoiceHeader tabValue={tabValue} setTabValue={setTabValue} />
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={3}>
        <InvoiceFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleReset={handleReset}
          customers={customers}
          projects={projects}
        />
      </Paper>

      {/* <InvoiceTable data={filtered} totals={totals} /> */}
      {selectedMainHeader == "Invoices" && (
        <InvoiceTable data={filtered} totals={totals} />
      )}
      {selectedMainHeader == "Sales" && (
        <SalesTable data={filtered} totals={totals} />
      )}
      {selectedMainHeader == "Purchase" && (
        <PurchaseTable data={filtered} totals={totals} />
      )}
      {/* <SalesTable data={filtered} totals={totals} /> */}

      <Box sx={{ height: 40 }} />
    </DashboardLayout>
  );
}
