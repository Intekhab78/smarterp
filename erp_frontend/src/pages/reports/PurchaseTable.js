import { useHeader } from "context/HeaderContext";
import { useSearch } from "context/SearchReportContext";
import React, { useEffect, useState, useMemo } from "react";
import { getPurchaseDetails } from "utils/all_report_api_Utils";

export default function PurchaseTable({ totals }) {
  const { selectedMainHeader } = useHeader();
  const { searchFilters, setSearchResults } = useSearch();

  const [loading, setLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [openInvoiceId, setOpenInvoiceId] = useState(null);
  const toggleInvoice = (id) =>
    setOpenInvoiceId((prev) => (prev === id ? null : id));

  // ------------------------------------------------------
  // FETCH DATA
  // ------------------------------------------------------
  const fetchData = async () => {
    if (!searchFilters.searchClicked) return;

    setLoading(true);
    try {
      let results = await getPurchaseDetails({
        ...searchFilters,
        page: currentPage,
      });

      setPurchaseData(results?.records || []);
      setSearchResults(results);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchFilters.searchClicked]);

  // ------------------------------------------------------
  // LOCAL FILTERING (LIKE SALES)
  // ------------------------------------------------------
  const filteredData = useMemo(() => {
    if (selectedMainHeader !== "P Orders") return purchaseData;

    return purchaseData.filter((inv) => {
      // DATE FILTER
      const invDate = new Date(inv.grn_date);
      const fromDate = searchFilters.dateFrom
        ? new Date(searchFilters.dateFrom)
        : null;
      const toDate = searchFilters.dateTo
        ? new Date(searchFilters.dateTo)
        : null;

      const isWithinDate =
        (!fromDate || invDate >= fromDate) && (!toDate || invDate <= toDate);

      // COMPANY
      const isCompanyMatch =
        !searchFilters.company ||
        inv.company_id === Number(searchFilters.company);

      // LOCATION
      const isLocationMatch =
        !searchFilters.location ||
        inv.location_id === Number(searchFilters.location);

      // VENDOR (EXTRA CONDITION YOU REQUESTED)
      const isVendorMatch =
        !searchFilters.vendor || inv.vendor_id === Number(searchFilters.vendor);

      // INVOICE STATUS
      const isInvoiceStatusMatch =
        !searchFilters.invoiceStatus ||
        inv.approval_status === searchFilters.invoiceStatus;

      return (
        isWithinDate &&
        isCompanyMatch &&
        isLocationMatch &&
        isVendorMatch &&
        isInvoiceStatusMatch
      );
    });
  }, [purchaseData, searchFilters, selectedMainHeader]);

  // ------------------------------------------------------
  // PAGINATION
  // ------------------------------------------------------
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ------------------------------------------------------
  // RETURN UI
  // ------------------------------------------------------
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded">
        <div>Amount... ${totals.amount.toLocaleString()}</div>
        <div>Paid ${totals.paid.toLocaleString()}</div>
        <div>Balance ${totals.balance.toLocaleString()}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1800px] border-collapse text-xs">
          <thead className="bg-gray-900 text-white">
            <tr>
              {[
                "Date",
                "PO Number",
                "Vendor",
                "Amount",
                "Tax",
                "Grand Total",
                "Due Date",
                "PO Status",
              ].map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap font-semibold px-2 py-2 text-left"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {!loading ? (
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={20} className="text-center px-2 py-2">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((inv) => (
                  <React.Fragment key={inv.id}>
                    <tr
                      className="bg-blue-100 font-semibold cursor-pointer hover:bg-blue-200"
                      onClick={() => toggleInvoice(inv.id)}
                    >
                      <td className="px-2 py-2 w-[140px]">{inv.grn_date}</td>
                      <td className="px-2 py-2 w-[160px]">{inv.grn_number}</td>
                      <td className="px-2 py-2 w-[200px]">
                        {inv?.vendor_details?.firstname}{" "}
                        {inv?.vendor_details?.lastname}
                      </td>
                      <td className="px-2 py-2 w-[120px]">{inv.total_net}</td>
                      <td className="px-2 py-2 w-[120px]">{inv.total_vat}</td>
                      <td className="px-2 py-2 w-[140px]">{inv.grand_total}</td>
                      <td className="px-2 py-2 w-[140px]">
                        {inv.vendor_invoice_date?.slice(0, 10)}
                      </td>
                      <td className="px-2 py-2 w-[140px]">
                        {inv.approval_status}
                      </td>
                    </tr>

                    {openInvoiceId === inv.id && (
                      <tr>
                        <td colSpan={20} className="bg-gray-100">
                          <div className="p-3 flex flex-col gap-2">
                            <h3 className="font-bold">Items</h3>

                            <table className="min-w-full text-xs">
                              <thead className="bg-gray-300 font-semibold">
                                <tr className="text-gray-900 text-xs font-bold">
                                  <th className="px-2 py-1">Item Code</th>
                                  <th className="px-2 py-1">Item Name</th>
                                  <th className="px-2 py-1">Category</th>
                                  <th className="px-2 py-1">Family</th>
                                  <th className="px-2 py-1">Sub Family</th>
                                  <th className="px-2 py-1">Brand</th>
                                  <th className="px-2 py-1">Color</th>
                                  <th className="px-2 py-1">Size</th>
                                  <th className="px-2 py-1">UOM</th>
                                  <th className="px-2 py-1">Qty</th>
                                  <th className="px-2 py-1">Price</th>
                                  <th className="px-2 py-1">Discount</th>
                                  <th className="px-2 py-1">VAT</th>
                                  <th className="px-2 py-1">Net Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inv.grn_details?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="px-2 py-1">
                                      {item?.itemLocationModel?.item_code}
                                    </td>
                                    <td className="px-2 py-1">
                                      {item?.itemLocationModel?.item_name}
                                    </td>
                                    <td className="px-2 py-1">
                                      {
                                        item?.itemLocationModel?.itemcategory
                                          ?.itemcatname
                                      }
                                    </td>
                                    <td className="px-2 py-1">
                                      {
                                        item?.itemLocationModel?.family_master
                                          ?.itemfamname
                                      }
                                    </td>
                                    <td className="px-2 py-1">
                                      {
                                        item?.itemLocationModel
                                          ?.sub_family_master?.itemsfamname
                                      }
                                    </td>
                                    <td className="px-2 py-1">
                                      {
                                        item?.itemLocationModel?.brand
                                          ?.brandname
                                      }
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
                                          ?.item_main_prices?.[0]?.item_uom
                                          ?.name
                                      }
                                    </td>
                                    <td className="px-2 py-1">
                                      {item.item_qty}
                                    </td>
                                    <td className="px-2 py-1">
                                      {item.item_price}
                                    </td>
                                    <td className="px-2 py-1">
                                      {item.item_discount_amount}
                                    </td>
                                    <td className="px-2 py-1">
                                      {item.item_vat}
                                    </td>
                                    <td className="px-2 py-1">
                                      {item.item_grand_total}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td
                  colSpan={20}
                  className="text-center py-10 text-blue-700 font-semibold text-sm"
                >
                  Loading data, please wait...
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* PAGINATION */}
      {filteredData.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-4 text-sm font-semibold">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-40"
          >
            Prev
          </button>

          <div>
            Page <strong>{currentPage}</strong> / {totalPages}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
