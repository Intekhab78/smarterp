import { useHeader } from "context/HeaderContext";
import { useSearch } from "context/SearchReportContext";
import React, { useEffect, useState, useMemo } from "react";
import {
  // getPurchaseDetails,
  getInvoiceDetails,
} from "utils/all_report_api_Utils";

export default function SalesTable({ totals }) {
  const { selectedMainHeader } = useHeader();
  const {
    searchFilters,
    setSearchResults,
    setInvoiceData: setGlobalInvoiceData,
  } = useSearch();

  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  console.log("searchFilters--------------------", searchFilters);

  // ✅ For expand/collapse
  const [openInvoiceId, setOpenInvoiceId] = useState(null);
  const toggleInvoice = (id) => {
    setOpenInvoiceId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!searchFilters.searchClicked) return;

      setLoading(true);
      try {
        let results;

        if (selectedMainHeader === "Sales") {
          results = await getInvoiceDetails(searchFilters);
        }

        setInvoiceData(results?.records || []);
        setGlobalInvoiceData(results?.records || []);
        setSearchResults(results);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchFilters.searchClicked, selectedMainHeader]);

  // === Apply filters ===
  const filteredInvoices = useMemo(() => {
    return invoiceData.filter((inv) => {
      const invDate = new Date(inv.invoice_date);
      const fromDate = searchFilters.dateFrom
        ? new Date(searchFilters.dateFrom)
        : null;
      const toDate = searchFilters.dateTo
        ? new Date(searchFilters.dateTo)
        : null;

      // === DATE FILTER ===
      const isWithinDate =
        (!fromDate || invDate >= fromDate) && (!toDate || invDate <= toDate);

      // === COMPANY FILTER ===
      const isCompanyMatch =
        !searchFilters.company ||
        inv.company_id === Number(searchFilters.company);

      // === LOCATION FILTER ===
      const isLocationMatch =
        !searchFilters.location ||
        inv.location_id === Number(searchFilters.location);

      // === CUSTOMER FILTER ===
      const isCustomerMatch =
        !searchFilters.customer ||
        inv.customer_id === Number(searchFilters.customer);

      // === PROJECT FILTER ===
      const isProjectMatch =
        !searchFilters.project ||
        inv.project_id === Number(searchFilters.project);

      // === INVOICE STATUS FILTER ===
      const isInvoiceStatusMatch =
        !searchFilters.invoiceStatus ||
        inv.approval_status === searchFilters.invoiceStatus;

      // === PAYMENT STATUS FILTER ===
      const isPaymentStatusMatch =
        !searchFilters.paymentStatus ||
        inv.payment_status === searchFilters.paymentStatus;

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

  useEffect(() => {
    setGlobalInvoiceData(filteredInvoices);
  }, [filteredInvoices]);

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const paginatedData = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
        <table className="min-w-[1800px] border-collapse text-xs">
          <thead className="bg-gray-900 text-white">
            <tr>
              {[
                { label: "Date", width: "w-[160px]" },
                { label: "Invoice Number", width: "w-[200px]" },
                { label: "Customer", width: "w-[240px]" },
                { label: "Amount", width: "w-[150px]" },
                { label: "Tax", width: "w-[150px]" },
                { label: "Grand Total", width: "w-[160px]" },
                { label: "Due Date", width: "w-[160px]" },
                { label: "Invoice Status", width: "w-[200px]" },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap font-semibold px-2 py-2 text-left ${col.width}`}
                >
                  {col.label}
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
                  <td colSpan={20} className="text-center px-2 py-2">
                    No invoices found for selected filters.
                  </td>
                </tr>
              ) : (
                paginatedData.map((inv) => (
                  <React.Fragment key={inv.id}>
                    {/* ====== CLICKABLE INVOICE HEADER ====== */}
                    <tr
                      className="bg-blue-100 font-semibold cursor-pointer hover:bg-blue-200"
                      onClick={() => toggleInvoice(inv.id)}
                    >
                      <td className="px-2 py-2 w-[140px]">
                        {inv.invoice_date}
                      </td>
                      <td className="px-2 py-2 w-[160px]">
                        {inv.invoice_number}
                      </td>
                      <td className="px-2 py-2 w-[200px]">
                        {inv?.customer_details?.first_name}{" "}
                        {inv?.customer_details?.last_name}
                      </td>
                      <td className="px-2 py-2 w-[120px]">{inv.total_net}</td>
                      <td className="px-2 py-2 w-[120px]">{inv.total_vat}</td>
                      <td className="px-2 py-2 w-[140px]">{inv.grand_total}</td>
                      <td className="px-2 py-2 w-[140px]">
                        {inv.invoice_due_date}
                      </td>
                      <td className="px-2 py-2 w-[160px]">
                        {renderInvoiceStatus(inv.approval_status)}
                      </td>
                    </tr>

                    {/* ====== SHOW DETAILS ONLY IF OPEN ====== */}
                    {openInvoiceId === inv.id && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <table className="min-w-[1800px] w-full text-xs border-t">
                            {/* ==== Details Header ==== */}
                            <thead className="bg-gray-300 text-gray-900 font-bold">
                              <tr>
                                {[
                                  { label: "Item Code", width: "w-[160px]" },
                                  { label: "Item Name", width: "w-[240px]" },
                                  { label: "Family", width: "w-[160px]" },
                                  { label: "Sub Family", width: "w-[180px]" },
                                  { label: "Brand", width: "w-[150px]" },
                                  { label: "Color", width: "w-[150px]" },
                                  { label: "Size", width: "w-[120px]" },
                                  { label: "UOM", width: "w-[120px]" },
                                  { label: "Qty", width: "w-[100px]" },
                                  { label: "Price", width: "w-[120px]" },
                                  { label: "Discount", width: "w-[140px]" },
                                  { label: "VAT", width: "w-[120px]" },
                                  { label: "Net Total", width: "w-[160px]" },
                                ].map((col) => (
                                  <th
                                    key={col.label}
                                    className={`px-2 py-1 ${col.width} whitespace-nowrap text-left`}
                                  >
                                    {col.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            {/* ==== Details Rows ==== */}
                            <tbody>
                              {inv.invoice_details?.map((item, subIndex) => (
                                <tr
                                  key={subIndex}
                                  className={
                                    subIndex % 2 === 0
                                      ? "bg-gray-50"
                                      : "bg-white"
                                  }
                                >
                                  <td className="px-2 py-1">
                                    {item?.itemLocationModel?.item_code}
                                  </td>
                                  <td className="px-2 py-1">
                                    {item?.itemLocationModel?.item_name}
                                  </td>
                                  <td className="px-2 py-1">
                                    {
                                      item?.itemLocationModel?.family_master
                                        ?.itemfamname
                                    }
                                  </td>
                                  <td className="px-2 py-1">
                                    {
                                      item?.itemLocationModel?.sub_family_master
                                        ?.itemsfamname
                                    }
                                  </td>
                                  <td className="px-2 py-1">
                                    {item?.itemLocationModel?.brand?.brandname}
                                  </td>
                                  <td className="px-2 py-1">
                                    {
                                      item?.itemLocationModel?.item_color
                                        ?.itemcolname
                                    }
                                  </td>
                                  <td className="px-2 py-1">
                                    {
                                      item?.itemLocationModel?.size_master
                                        ?.itemsizename
                                    }
                                  </td>
                                  <td className="px-2 py-1">
                                    {
                                      item?.itemLocationModel
                                        ?.item_main_prices?.[0]?.item_uom?.name
                                    }
                                  </td>
                                  <td className="px-2 py-1">{item.item_qty}</td>
                                  <td className="px-2 py-1">
                                    {item.item_price}
                                  </td>
                                  <td className="px-2 py-1">
                                    {item.item_discount_amount}
                                  </td>
                                  <td className="px-2 py-1">{item.item_vat}</td>
                                  <td className="px-2 py-1">
                                    {item.item_grand_total}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
