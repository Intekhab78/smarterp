import React, { createContext, useState, useContext } from "react";
import * as XLSX from "xlsx"; // ✅ add this
import { useHeader } from "./HeaderContext";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const { selectedMainHeader } = useHeader(); // ✅ NOW it works (provider above)
  console.log("selectedMainHeader---------------------", selectedMainHeader);

  // existing states
  const [searchFilters, setSearchFilters] = useState({
    dateFrom: "",
    dateTo: "",
    company: "",
    location: "",
    customer: "",
    vendor: "",
    invoiceStatus: "",
    project: "",
    paymentStatus: "",
    searchClicked: false,
  });

  const [searchResults, setSearchResults] = useState([]);

  // ✅ add these new states
  const [invoiceData, setInvoiceData] = useState([]);

  const exportToExcel = () => {
    if (!invoiceData || invoiceData.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headerType = String(selectedMainHeader).toLowerCase().trim();
    console.log("Export type:", headerType);

    let formattedData = [];

    if (headerType.includes("invoice")) {
      // --------------------------
      // EXPORT FOR INVOICE
      // --------------------------
      invoiceData.forEach((inv) => {
        const invoiceBase = {
          Invoice_Number: inv.invoice_number,
          Invoice_Date: inv.invoice_date,
          Customer: inv.customer_details
            ? `${inv.customer_details.first_name} ${inv.customer_details.last_name} - ${inv.customer_details.customer_code}`
            : "N/A",
          Salesman: inv.salesman
            ? `${inv.salesman.firstname} ${inv.salesman.lastname} - ${inv.salesman?.salesmanInfo?.salesman_code}`
            : "N/A",
          Company: inv.company?.compdesc || "N/A",
          Location: inv.location?.locname || "N/A",
        };

        if (inv.invoice_details?.length > 0) {
          inv.invoice_details.forEach((item) => {
            formattedData.push({
              ...invoiceBase,
              Item: `${item?.itemLocationModel?.item_code} - ${item?.itemLocationModel?.item_name}`,
              Price: item.item_price,
              Qty: item.item_qty,
              Discount: item.item_discount_amount,
              Total: item.item_net,
              VAT: item.item_vat,
              Item_Grand_Total: item.item_grand_total,
            });
          });
        } else {
          formattedData.push(invoiceBase);
        }
      });
    } else if (headerType.includes("sales")) {
      // --------------------------
      // EXPORT FOR SALES

      invoiceData.forEach((inv) => {
        const invoiceBase = {
          Company: inv.company?.compdesc || "N/A",
          Location: inv.location?.locname || "N/A",
          Invoice_Number: inv.invoice_number,
          Invoice_Type: inv.invoice_type,
          Invoice_Date: inv.invoice_date,
          Customer: inv.customer_details
            ? `${inv.customer_details.first_name} ${inv.customer_details.last_name} - ${inv.customer_details.customer_code}`
            : "",
          Mobile: inv.customer_details ? `${inv.customer_details.phone}` : "",
          Email: inv.customer_details ? `${inv.customer_details.email}` : "",
          Salesman: inv.salesman
            ? `${inv.salesman.firstname} ${inv.salesman.lastname} - ${inv.salesman?.salesmanInfo?.salesman_code}`
            : "",
        };

        if (inv.invoice_details?.length > 0) {
          inv.invoice_details.forEach((item) => {
            const qty = parseFloat(item.item_qty) || 0;
            const revenue = parseFloat(item.item_grand_total) || 0;
            const landedPerUnit = parseFloat(item.landed_cost_per_unit) || 0;

            const totalLandedCost = landedPerUnit * qty;
            const margin = revenue - totalLandedCost;
            formattedData.push({
              ...invoiceBase,
              // Item_Sno: item?.itemLocationModel?.item_code,
              Item_Upc: item?.itemLocationModel?.itemupc,
              Item: `${item?.itemLocationModel?.item_name}`,
              Author: `${item?.itemLocationModel?.itemdesclong}`,
              Publisher: `${item?.itemLocationModel?.itemdesc3}`,
              Language: `${item?.itemLocationModel?.itemdesc4}`,
              Department:
                item?.itemLocationModel?.item_department?.itemdeptname,
              // Category: item?.itemLocationModel?.itemcategory?.itemcatname,

              Family: item?.itemLocationModel?.family_master?.itemfamname,
              SubFamily:
                item?.itemLocationModel?.sub_family_master?.itemsfamname,
              Uom: item?.itemLocationModel?.item_main_prices[0]?.item_uom?.name,
              Size: item?.itemLocationModel?.size_master?.itemsizename,
              Color: item?.itemLocationModel?.item_color?.itemcolname,
              Brand: item?.itemLocationModel?.brand?.brandname,

              Price: item.item_price,
              Qty: item.item_qty,
              Discount: item.item_discount_amount,
              // DiscountType: item.discounttype,
              DiscountType:
                item.discounttype?.toLowerCase() === "amount"
                  ? "Amount"
                  : item.discounttype,

              Total: item.item_net,
              // VAT: item.item_vat, // for gulf
              GST: parseFloat(item.item_vat) || 0, // for India
              CGST: (parseFloat(item.item_vat) || 0) / 2, // for India
              SGST: (parseFloat(item.item_vat) || 0) / 2, // for India

              // Item_Grand_Total: item.item_grand_total,

              Item_Grand_Total: revenue,
              landed_cost_per_unit: landedPerUnit,
              Total_Landed_cost: totalLandedCost,
              Margin: margin,
            });
          });
        } else {
          formattedData.push(invoiceBase);
        }
      });
    }

    // Generate excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    let fileName;
    let sheetName;

    if (headerType?.toLowerCase() == "sales") {
      fileName = "sales_report";
      sheetName = "Sales Report";
    } else {
      sheetName = headerType.replace(/[:\\\/\?\*\[\]]/g, "").slice(0, 31);
      fileName = sheetName;
    }
    const safeName = headerType.replace(/[:\\\/\?\*\[\]]/g, "").slice(0, 31);

    // XLSX.utils.book_append_sheet(workbook, worksheet, safeName);
    // XLSX.writeFile(workbook, `${safeName}.xlsx`);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <SearchContext.Provider
      value={{
        searchFilters,
        setSearchFilters,
        searchResults,
        setSearchResults,

        // ✅ add these to context value
        invoiceData,
        setInvoiceData,
        exportToExcel,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
