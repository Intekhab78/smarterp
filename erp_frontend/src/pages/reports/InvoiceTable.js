import { useHeader } from "context/HeaderContext";
import { useSearch } from "context/SearchReportContext";
import React, { useEffect, useState, useMemo } from "react";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import {
  getPurchaseDetails,
  getInvoiceDetails,
} from "utils/all_report_api_Utils";

export default function InvoiceTable({ totals }) {
  const { selectedMainHeader, selectedSubHeader } = useHeader();
  const {
    searchFilters,
    setSearchResults,
    setInvoiceData: setGlobalInvoiceData,
  } = useSearch();
  const [loading, setLoading] = useState(false);

  const [invoiceData, setInvoiceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  console.log("selectedMainHeader--------------", selectedMainHeader);

  console.log("searchFilters------------", searchFilters);
  // console.log("invoiceData------------", invoiceData);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchFilters.searchClicked) return;

      setLoading(true); // start loader

      try {
        let results;

        if (selectedMainHeader === "Invoices") {
          results = await getInvoiceDetails(searchFilters);
        } else if (selectedMainHeader === "P Orders") {
          results = await getPurchaseDetails(searchFilters);
        }

        setInvoiceData(results?.records || []);
        setGlobalInvoiceData(results?.records || []);
        setSearchResults(results);
        setCurrentPage(1);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchData();
  }, [searchFilters.searchClicked, selectedMainHeader]);

  // === Apply filters to invoiceData ===
  const filteredInvoices = useMemo(() => {
    console.log("invoiceData------------------", invoiceData);

    return invoiceData.filter((inv) => {
      const invDate = new Date(inv.invoice_date);
      const fromDate = searchFilters.dateFrom
        ? new Date(searchFilters.dateFrom)
        : null;
      const toDate = searchFilters.dateTo
        ? new Date(searchFilters.dateTo)
        : null;

      // ✅ Date range filter (if provided)
      const isWithinDate =
        (!fromDate || invDate >= fromDate) && (!toDate || invDate <= toDate);

      // ✅ Company filter (if provided)
      const isCompanyMatch =
        !searchFilters.company ||
        inv.company_id === Number(searchFilters.company);

      // ✅ Location filter (if provided)
      const isLocationMatch =
        !searchFilters.location ||
        inv.location_id === Number(searchFilters.location);

      // ✅ Customer filter (if provided)
      const isCustomerMatch =
        !searchFilters.customer ||
        inv.customer_id === Number(searchFilters.customer);

      // ✅ Invoice Status filter (if provided)
      const isInvoiceStatusMatch =
        !searchFilters.invoiceStatus ||
        inv.approval_status === searchFilters.invoiceStatus;

      // ✅ Payment Status filter (if provided)
      const isPaymentStatusMatch =
        !searchFilters.paymentStatus ||
        inv.paymentStatus === searchFilters.paymentStatus;

      // ✅ Project filter (if provided)
      const isProjectMatch =
        !searchFilters.project || inv.project === searchFilters.project;

      // ✅ Combine all conditions
      return (
        isWithinDate &&
        isCompanyMatch &&
        isLocationMatch &&
        isCustomerMatch &&
        isInvoiceStatusMatch &&
        isPaymentStatusMatch &&
        isProjectMatch
      );
    });
  }, [invoiceData, searchFilters]);

  // ✅ New: sync filtered data to context for Excel export
  useEffect(() => {
    setGlobalInvoiceData(filteredInvoices);
  }, [filteredInvoices]);

  // console.log("filteredInvoices-------------", filteredInvoices);

  // === Pagination ===
  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const paginatedData = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // === Render Invoice Status ===
  const renderInvoiceStatus = (status) => {
    if (status === "Invoiced")
      return (
        <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-200 rounded">
          Invoiced
        </span>
      );
    if (status === "Draft")
      return (
        <span className="px-2 py-0.5 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded">
          Draft
        </span>
      );
    return (
      <span className="px-2 py-0.5 text-xs font-semibold bg-gray-200 rounded">
        {status || "N/A"}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {/* === Totals Section === */}
      <div className="flex justify-between bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded">
        <div>Amount ${totals.amount.toLocaleString()}</div>
        <div>Paid ${totals.paid.toLocaleString()}</div>
        <div>Balance ${totals.balance.toLocaleString()}</div>
      </div>

      {/* === Table === */}
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] border-collapse text-xs">
          <thead className="bg-gray-900 text-white">
            <tr>
              {[
                "Date",
                "Invoice Number",
                "Customer",
                "Amount",
                "Tax",
                "Grand Total",
                "Due Date",
                // "Payment Status",
                "Invoice Status",
              ].map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap font-semibold px-2 py-1 text-left"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <div className="text-center py-10 text-blue-700 font-semibold text-sm">
              Loading data, please wait...
            </div>
          ) : (
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center px-2 py-2">
                    No invoices found for selected filters.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, id) => (
                  <tr
                    key={row.id}
                    className={id % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-2 py-1">{row.invoice_date}</td>
                    <td className="px-2 py-1">
                      <button
                        className="text-blue-600 hover:underline text-xs p-0"
                        onClick={() => alert(`Open invoice ${row.id}`)}
                      >
                        {row.invoice_number}
                      </button>
                    </td>
                    <td className="px-2 py-1">
                      {row?.customer_details?.first_name}{" "}
                      {row?.customer_details?.last_name}
                    </td>
                    <td className="px-2 py-1">
                      {row.total_net?.toLocaleString()}
                    </td>
                    <td className="px-2 py-1">
                      {row.total_vat?.toLocaleString()}
                    </td>
                    <td className="px-2 py-1">
                      {row.grand_total?.toLocaleString()}
                    </td>
                    <td className="px-2 py-1">{row.invoice_due_date}</td>
                    {/* <td className="px-2 py-1">
                    {renderPaymentStatus(row.paymentStatus)}
                  </td> */}
                    <td className="px-2 py-1">
                      {renderInvoiceStatus(row.approval_status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* === Pagination === */}
      {filteredInvoices.length > 0 && (
        <div className="flex justify-between items-center mt-2 text-sm">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
