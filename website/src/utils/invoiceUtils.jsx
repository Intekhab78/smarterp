import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../constantApi";
import { Printer, Share2 } from "lucide-react";
import logo1 from "../assets/images/logo1.png";
import { ArrowLeft, X, FileText } from "lucide-react";
import { generateInvoicePDF } from "../utils/InvoicePdfPage";

function InvoicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invoiceNumber = queryParams.get("invoice_number");
  const [shippingAddress, setShippingAddress] = useState(null);

  const [invoiceData, setInvoiceData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    if (!invoiceData?.customer_id) return;

    console.log("✅ Invoice customer_id:", invoiceData.customer_id);

    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${constantApi.baseUrl}/customer/list`);

        console.log("📦 Customer API:", res.data);

        if (res.data?.success && Array.isArray(res.data.customers)) {
          const found = res.data.customers.find(
            (c) => String(c.customer_code) === String(invoiceData.customer_id)
          );

          console.log("🎯 Matched customer:", found);

          if (found) setCustomerData(found);
        }
      } catch (err) {
        console.error("❌ Customer fetch error:", err);
      }
    };

    fetchCustomer();
  }, [invoiceData]);

  const printRef = useRef();

  // =============================
  // Fetch Invoice
  // =============================
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.post(`${constantApi.baseUrl}/invoice/details`, {
          invoice_number: invoiceNumber,
        });

        if (res.data?.status) {
          setInvoiceData(res.data.data);
          console.log("incoice data =========", res.data)
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceNumber]);

  // =============================
  // Fetch Company (ONLY company_id allowed)
  // =============================
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.post(`${constantApi.baseUrl}/company/details`, {
          id: "21",
        });
        if (res.data?.status) {
          setCompanyData(res.data.data);
        }
        console.log("ggggggggggggggg===", res.data)
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, []);


  useEffect(() => {
    if (!invoiceData?.deliver_address_id || !customerData?.id) return;

    console.log("✅ Deliver Address ID:", invoiceData.deliver_address_id);
    console.log("✅ Customer DB ID:", customerData.id);

    const fetchShippingAddress = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/shipping_address/list/${customerData.id}`
        );

        console.log("📦 Shipping API:", res.data);

        if (res.data?.status && Array.isArray(res.data.data)) {
          const matched = res.data.data.find(
            (addr) => Number(addr.id) === Number(invoiceData.deliver_address_id)
          );

          console.log("🎯 Matched Shipping Address:", matched);

          if (matched) setShippingAddress(matched);
        }
      } catch (err) {
        console.error("❌ Shipping address fetch error:", err);
      }
    };

    fetchShippingAddress();
  }, [invoiceData?.deliver_address_id, customerData?.id]);



  // =============================
  // Invoice Item Total
  // =============================
  const getInvoiceItemTotal = (item) => {
    const qty = Number(item.item_qty || 1);

    const backendTotal =
      item.item_total_net ?? item.total_net ?? item.item_grand_total ?? null;

    if (backendTotal != null) {
      return Number(backendTotal); // ✅ NO ROUNDING
    }

    const unitPrice = Number(item.item_price || 0);
    const unitVAT = Number(item.item_vat || 0);

    return (unitPrice + unitVAT) * qty; // ✅ exact
  };
  // const IMAGE_BASE = constantApi.baseUrl.replace("/api", "");

  // console.log(
  //   "LOGO URL =>",
  //   `${constantApi.baseUrl}/uploads/company_logo/${companyData?.clogo}`
  // );

  const handleDownloadPDF = () => {
    if (!invoiceData || !companyData) return;

    const filteredItems =
      invoiceData.invoice_details?.filter(
        (item) =>
          item?.itemLocationModel?.company_id === invoiceData.company_id &&
          item?.itemLocationModel?.location_id === invoiceData.location_id
      ) || [];

    const getInvoiceItemTotal = (item) => {
      const qty = Number(item.item_qty || 1);
      const backendTotal =
        item.item_total_net ?? item.total_net ?? item.item_grand_total ?? null;

      if (backendTotal != null) return Number(backendTotal);

      return (Number(item.item_price || 0) + Number(item.item_vat || 0)) * qty;

    };

    const calculatedTaxableTotal = filteredItems.reduce(
      (sum, item) => sum + Number(item.item_price || 0) * Number(item.item_qty || 1),
      0
    );

    const calculatedTotalVAT = filteredItems.reduce(
      (sum, item) => sum + Number(item.item_vat || 0) * Number(item.item_qty || 1),
      0
    );

    const calculatedGrandTotal = filteredItems.reduce(
      (sum, item) => sum + getInvoiceItemTotal(item),
      0
    );

    const pdfInvoiceData = {
      number: invoiceData.invoice_number,
      date: formatDate(invoiceData.created_at),
      dueDate: formatDate(invoiceData.invoice_due_date),
      orderNo: invoiceData?.orderModel?.order_number || "-",

      website: "islamicbookzone.com",
      gstin: companyData?.ctaxnumber || "-",

      email:
        companyData?.company_address?.[0]?.email ||
        companyData?.company_address?.[0]?.other_email_2 ||
        "-",

      phone:
        companyData?.company_address?.[0]?.contact_no ||
        companyData?.company_address?.[0]?.other_number_2 ||
        "-",

      customer: customerData
        ? {
          name: `${customerData.first_name || ""} ${customerData.last_name || ""}`.trim(),
          phone: customerData.phone || customerData.alternate_phone || "",
          email: customerData.email || "",
          gstin: customerData.gstin || "",
          address: [
            customerData.billing_address,
            customerData.city,
            customerData.state,
            customerData.zipcode,
          ].filter(Boolean).join(", "),
        }
        : null,
      shipping: shippingAddress
        ? {
          name: shippingAddress.full_name,
          phone:
            shippingAddress.phone_number ||
            shippingAddress.alternate_phone_number,
          address: [
            shippingAddress.address_line1,
            shippingAddress.address_line2,
            shippingAddress.city,
            shippingAddress.state,
            shippingAddress.pincode,
            shippingAddress.country,
          ]
            .filter(Boolean)
            .join(", "),
        }
        : null,

      items: filteredItems.map((item) => {
        const price = Number(item.item_price || 0); // unit price
        const qty = Number(item.item_qty || 1);
        const tax = Number(item.item_vat || 0);     // GST for full qty

        const taxable = price * qty;

        const gstPercent =
          taxable > 0 ? ((tax / taxable) * 100).toFixed(0) : "0";

        return {
          name: item?.itemLocationModel?.item_name || "",
          qty,

          size: item?.itemLocationModel?.sizename || "-",
          brand: item?.itemLocationModel?.brandname || "-",
          colour: item?.itemLocationModel?.colorname || "-",
          upc: item?.itemLocationModel?.itemupc || "-",

          price: price,
          tax: tax,                 // full GST
          gstPercent: gstPercent,   // ✅ correct now
          discount: Number(item.item_discount_amount || 0),

          total: Number(getInvoiceItemTotal(item).toFixed(2)),
        };
      }),

      subTotal: Number(calculatedTaxableTotal.toFixed(2)),
      tax: Number(calculatedTotalVAT.toFixed(2)),
      grandTotal: Number(calculatedGrandTotal.toFixed(2)),

      paymentMode: invoiceData?.payment_terms?.name || "Unpaid",
      paymentStatus: invoiceData?.payment_received ? "Paid" : "Unpaid",

    };


    const fullAddress =
      companyData?.company_address
        ?.map(a => [a.address_name, a.address].filter(Boolean).join(", "))
        .join("\n") || "Address not available";

    const pdfCompanyData = {
      name: companyData?.compdesc || "Company",

      address: fullAddress,
      location: selectedLocation?.locname || "",   // ✅ ADD THIS


      email: companyData?.company_address?.[0]?.email || "",

      phone: companyData?.company_address?.[0]?.contact_no || "",

      gst: companyData?.ctaxnumber || ""
    };
    console.log("PDF ORDER NO =>", pdfInvoiceData.orderNo);

    generateInvoicePDF(pdfInvoiceData, pdfCompanyData);
  };


  // =============================
  // Loader
  // =============================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <p className="text-center text-red-600 mt-10 text-sm">
        Invoice not found or invalid.
      </p>
    );
  }

  // =============================
  // Filtered Items
  // =============================
  const filteredItems =
    invoiceData.invoice_details?.filter(
      (item) =>
        item?.itemLocationModel?.company_id === invoiceData.company_id &&
        item?.itemLocationModel?.location_id === invoiceData.location_id
    ) || [];

  // =============================
  // Calculated Totals
  // =============================
  const calculatedGrandTotal = filteredItems.reduce(
    (sum, item) => sum + getInvoiceItemTotal(item),
    0
  );
  const calculatedTaxableTotal = filteredItems.reduce(
    (sum, item) => sum + Number(item.item_price || 0) * Number(item.item_qty || 1),
    0
  );
  const calculatedTotalVAT = filteredItems.reduce(
    (sum, item) => sum + Number(item.item_vat || 0) * Number(item.item_qty || 1),
    0
  );

  // =============================
  // Location filter
  // =============================
  const selectedLocation =
    companyData?.location?.find((loc) => loc.id === invoiceData.location_id) || {};

  // =============================
  // Share & Print
  // =============================
  const handlePrint = () => window.print();
  const formatDate = (dateStr) => {
    if (!dateStr) return "0000-00-00";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleWhatsAppShare = () => {
    const msg = `Invoice No: ${invoiceData.invoice_number}%0AAmount: ₹${Math.round(calculatedGrandTotal)}`;
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleEmailShare = () => {
    window.location.href = `mailto:?subject=Invoice ${invoiceData.invoice_number}&body=Total Amount: ₹${Math.round(calculatedGrandTotal)}`;
  };

  // =============================
  // Render
  // =============================

  const printStyles = `
  .print-footer {
    display: none;
  }

  @media print {
    body {
      margin: 0 !important;
      padding: 0 !important;
    }

    body * {
      visibility: hidden;
    }

    #print-area, #print-area * {
      visibility: visible;
    }

    #print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 210mm;
      min-height: 297mm;
      padding: 12mm;
    }

    table {
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
    }

    thead {
      display: table-header-group;
    }

    /* ✅ SHOW WEBSITE ONLY IN PDF */
    .print-footer {
      display: block;
      position: fixed;
      bottom: 12mm;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 11px;
      color: #6b7280;
    }
  }
`;


  return (
    <>
      <style>{printStyles}</style>

      <div className="max-w-5xl mx-auto p-2 sm:p-4 text-sm">

        {/* HEADER BUTTONS */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-3 py-1.5 !text-white !bg-gray-600 rounded text-xs hover:bg-gray-500"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 px-3 py-1.5 !text-white !bg-red-600 rounded text-xs hover:bg-red-500"
          >
            <X size={16} />
          </button>
        </div>

        {/* TITLE + ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">

          <h1 className="flex items-center gap-2 text-base sm:text-lg font-bold !text-white !bg-gray-700 rounded px-3 py-1 uppercase">
            <FileText size={18} /> Invoice
          </h1>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1 px-3 py-2 !bg-blue-600 !text-white text-xs rounded"
            >
              <Printer size={14} /> Print
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1 px-3 py-1.5 !bg-green-600 !text-white text-xs rounded"
            >
              <Share2 size={16} /> WhatsApp
            </button>

            <button
              onClick={handleEmailShare}
              className="flex items-center gap-1 px-3 py-1.5 !bg-gray-700 !text-white text-xs rounded"
            >
              Email
            </button>
          </div>
        </div>

        {/* INVOICE */}
        <div
          ref={printRef}
          id="print-area"
          className="bg-white p-6 print:p-0 print:shadow-none print:border-0"
        >
          {/* ================= COMPANY HEADER ================= */}
          {/* ================= COMPANY HEADER ================= */}
          <div className="flex items-start justify-between border-b pb-3 mb-3">

            {/* LEFT : COMPANY INFO */}
            <div className="flex-1 min-w-0 pr-3">

              {/* COMPANY NAME */}
              <h2 className="text-sm sm:text-base font-semibold text-gray-800 break-words">
                {companyData?.compdesc || "Company Name"}
              </h2>

              {/* ADDRESS */}
              {/* {companyData?.company_address?.length > 0 ? (
                companyData.company_address.map((addr) => (
                  <div
                    key={addr.id}
                    className="mt-0.5 text-xs text-gray-600 leading-snug break-words"
                  >
                    <p className="whitespace-normal break-words">
                      {addr.address_name}
                    </p>
                    <p className="whitespace-normal break-words">
                      {addr.address}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs">No address available</p>
              )} */}
              {/* COMPANY MAIN ADDRESS */}
              {/* {companyData?.company_address?.length > 0 && (
                <div className="mt-0.5 text-xs text-gray-600 leading-snug">
                  <p className="font-medium">
                    {companyData.company_address[0].address_name}
                  </p>
                  <p>{companyData.company_address[0].address}</p>
                </div>
              )} */}

              {/* LOCATION (SHOP / WAREHOUSE) ADDRESS */}
              {selectedLocation?.locname && (
                <div className="mt-1 text-xs text-gray-700 leading-snug">
                  {/* <p className="font-semibold">Location:</p> */}
                  <p>{selectedLocation.locname}</p>
                  {/* {selectedLocation.locdesclong && (
                    <p>{selectedLocation.locdesclong}</p>
                  )} */}
                </div>
              )}

              {/* CONTACT */}
              <div className="mt-1 text-xs text-gray-600 leading-snug break-words">
                <p className="whitespace-normal">
                  <span className="font-medium">Phone:</span>{" "}
                  {companyData?.company_address?.[0]?.contact_no || "-"}
                </p>
                <p className="whitespace-normal break-all">
                  <span className="font-medium">Email:</span>{" "}
                  {companyData?.company_address?.[0]?.email || "-"}
                </p>
                <p className="whitespace-normal">
                  <span className="font-medium">GSTIN:</span>{" "}
                  {companyData?.ctaxnumber || "-"}
                </p>
              </div>

            </div>

            {/* RIGHT : LOGO */}
            <div className="flex items-start justify-end w-20 shrink-0">
              <img
                src={companyData?.logo_url || logo1}
                alt="Company Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </div>

          </div>

          {/* ================= INVOICE + ORDER INFO BOX ================= */}
          {/* ================= INVOICE + ORDER INFO BOX ================= */}
          <div className="border-b-2 mb-4 text-xs pb-2">

            <div className="flex justify-between gap-3 flex-wrap">

              {/* LEFT : INVOICE INFO */}
              <div className="grid grid-cols-[110px_1fr] gap-y-1">
                <span className="text-gray-500">Invoice No:</span>
                <span className="font-semibold">#{invoiceData?.invoice_number || "-"}</span>

                <span className="text-gray-500">Invoice Date:</span>
                <span>{formatDate(invoiceData?.created_at)}</span>
              </div>

              {/* RIGHT : ORDER INFO */}
              <div className="grid grid-cols-[110px_1fr] gap-y-1 sm:text-right">
                <span className="text-gray-500">Order No:</span>
                <span className="font-semibold">
                  {invoiceData?.orderModel?.order_number || "-"}
                </span>

                <span className="text-gray-500">Order Date:</span>
                <span>
                  {formatDate(
                    invoiceData?.orderModel?.created_at || invoiceData?.created_at
                  )}
                </span>
              </div>

            </div>

          </div>

          {/* INVOICE INFO */}
          <div className="grid sm:grid-cols-2 gap-6 mt-4 text-xs border-b pb-4">

            {/* ================= LEFT : CUSTOMER (BILLING) DETAILS ================= */}
            <div className="grid grid-cols-[90px_1fr] gap-y-1">
              <span className="font-semibold col-span-2 mb-1">Customer Details</span>

              <span className="text-gray-500">Name</span>
              <span className="font-medium">
                {customerData
                  ? `${customerData.first_name || ""} ${customerData.last_name || ""}`.trim()
                  : "-"}
              </span>

              <span className="text-gray-500">Phone</span>
              <span>{customerData?.phone || customerData?.alternate_phone || "-"}</span>

              <span className="text-gray-500">Email</span>
              <span>{customerData?.email || "-"}</span>

              <span className="text-gray-500">Address</span>
              <span className="leading-snug">
                {customerData
                  ? [
                    customerData.billing_address,
                    customerData.city,
                    customerData.state,
                    customerData.zipcode,
                    customerData.country,
                  ]
                    .filter(Boolean)
                    .join(", ")
                  : "-"}
              </span>
            </div>


            {/* ================= RIGHT : SHIPPING DETAILS ================= */}
            <div className="grid grid-cols-[90px_1fr] gap-y-1">
              <span className="font-semibold col-span-2 mb-1">Shipping Address</span>

              <span className="text-gray-500">Name</span>
              <span className="font-medium">
                {shippingAddress?.full_name || "-"}
              </span>

              <span className="text-gray-500">Phone</span>
              <span>{shippingAddress?.phone_number || shippingAddress?.alternate_phone_number || "-"}</span>

              <span className="text-gray-500">Address</span>
              <span className="leading-snug">
                {shippingAddress
                  ? [
                    shippingAddress.address_line1,
                    shippingAddress.address_line2,
                    shippingAddress.city,
                    shippingAddress.state,
                    shippingAddress.pincode,
                    shippingAddress.country,
                  ]
                    .filter(Boolean)
                    .join(", ")
                  : "-"}
              </span>
            </div>

          </div>


          {/* ITEMS */}
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[700px] w-full border border-gray-300 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 border text-center w-8">Sr</th>
                  <th className="px-2 py-1 border text-left">Item / UPC</th>
                  <th className="px-2 py-1 border text-right w-20">Price</th>
                  <th className="px-2 py-1 border text-center w-12">Qty</th>
                  <th className="px-2 py-1 border text-right w-20">Amount</th>
                  <th className="px-2 py-1 border text-right w-16">Disc</th>

                  {/* ✅ NEW COLUMN */}
                  <th className="px-2 py-1 border text-right w-20">Total</th>

                  <th className="px-2 py-1 border text-center w-16">GST</th>
                  <th className="px-2 py-1 border text-right w-24">Net Total</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item, i) => {
                  const qty = Number(item.item_qty || 1);
                  const price = Number(item.item_price || 0);
                  const tax = Number(item.item_vat || 0);
                  const amount = price * qty;
                  const discount = Number(item.item_discount_amount || 0);

                  // ✅ taxable after discount
                  const taxableAfterDisc = amount - discount;

                  const netTotal = getInvoiceItemTotal(item);

                  const gstPercent =
                    taxableAfterDisc > 0 ? ((tax / taxableAfterDisc) * 100).toFixed(0) : "0";

                  return (
                    <tr key={i} className="border-t">

                      {/* SR */}
                      <td className="px-2 py-1 border text-center">{i + 1}</td>

                      {/* ITEM + UPC */}
                      <td className="px-2 py-1 border">
                        <p className="font-medium leading-tight">
                          {item?.itemLocationModel?.item_name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          UPC: {item?.itemLocationModel?.itemupc || "-"}
                        </p>
                      </td>

                      {/* PRICE */}
                      <td className="px-2 py-1 border text-right">
                        {price.toFixed(2)}
                      </td>

                      {/* QTY */}
                      <td className="px-2 py-1 border text-center">
                        {qty % 1 === 0 ? qty : qty.toFixed(2)}
                      </td>

                      {/* AMOUNT */}
                      <td className="px-2 py-1 border text-right">
                        {amount.toFixed(2)}
                      </td>

                      {/* DISCOUNT */}
                      <td className="px-2 py-1 border text-right">
                        {discount.toFixed(2)}
                      </td>

                      {/* ✅ TAXABLE AFTER DISCOUNT */}
                      <td className="px-2 py-1 border text-right">
                        {taxableAfterDisc.toFixed(2)}
                      </td>

                      {/* GST */}
                      <td className="px-2 py-1 border text-center">
                        {gstPercent}%<br />
                        <span className="text-[10px] text-gray-500">
                          {tax.toFixed(2)}
                        </span>
                      </td>

                      {/* NET AMOUNT */}
                      <td className="px-2 py-1 border text-right font-semibold">
                        {netTotal.toFixed(2)}
                      </td>

                    </tr>
                  );
                })}

                {/* ================= TOTAL ROW ================= */}
                <tr className="font-semibold bg-gray-50">

                  <td className="px-2 py-1 border text-center" colSpan={3}>
                    TOTAL
                  </td>

                  {/* QTY TOTAL */}
                  <td className="px-2 py-1 border text-center">
                    {filteredItems.reduce(
                      (s, i) => s + Number(i.item_qty || 1),
                      0
                    )}
                  </td>

                  {/* AMOUNT TOTAL */}
                  <td className="px-2 py-1 border text-right">
                    {calculatedTaxableTotal.toFixed(2)}
                  </td>

                  {/* DISCOUNT TOTAL */}
                  <td className="px-2 py-1 border text-right">
                    {filteredItems.reduce(
                      (s, i) => s + Number(i.item_discount_amount || 0),
                      0
                    ).toFixed(2)}
                  </td>

                  {/* ✅ TAXABLE AFTER DISCOUNT TOTAL */}
                  <td className="px-2 py-1 border text-right">
                    {(calculatedTaxableTotal -
                      filteredItems.reduce(
                        (s, i) => s + Number(i.item_discount_amount || 0),
                        0
                      )
                    ).toFixed(2)}
                  </td>

                  {/* GST TOTAL */}
                  <td className="px-2 py-1 border text-center">
                    {calculatedTotalVAT.toFixed(2)}
                  </td>

                  {/* NET GRAND TOTAL */}
                  <td className="px-2 py-1 border text-right">
                    {calculatedGrandTotal.toFixed(2)}
                  </td>

                </tr>
              </tbody>
            </table>

          </div>

          {/* AMOUNT IN WORDS + TOTAL BOX */}
          <div className="mt-4 flex justify-between items-start gap-6">

            {/* LEFT : AMOUNT IN WORDS + PAYMENT */}
            <div className="text-xs space-y-2 max-w-md mt-40">

              <p>
                <span className="font-semibold">Invoice Amount (in words):</span><br />
                One Thousand Two Hundred Thirty Nine Rupees Only
              </p>

              <p>
                <span className="font-semibold">Payment Mode:</span>{" "}
                {invoiceData?.payment_terms?.name || "Cash"}
              </p>

            </div>

            {/* RIGHT : TOTAL BOX */}
            <div className="w-64 bg-gray-50 border rounded p-3 text-xs">
              {(() => {
                const discountTotal = filteredItems.reduce(
                  (s, i) => s + Number(i.item_discount_amount || 0),
                  0
                );

                const totalAfterDiscount = calculatedTaxableTotal - discountTotal;

                const totalTax = calculatedTotalVAT;
                const halfGST = totalTax / 2;

                const calculatedTotal = totalAfterDiscount + totalTax;
                const invoiceTotal = Math.round(calculatedTotal);

                return (
                  <>
                    {/* Sub Total */}
                    <div className="flex justify-between mb-1">
                      <span>Sub Total</span>
                      <span>₹{calculatedTaxableTotal.toFixed(2)}</span>
                    </div>

                    {/* Discount */}
                    <div className="flex justify-between mb-1 text-red-600">
                      <span>Discount</span>
                      <span>-₹{discountTotal.toFixed(2)}</span>
                    </div>

                    {/* Total After Discount */}
                    <div className="flex justify-between mb-1 font-medium">
                      <span>Total </span>
                      <span>₹{totalAfterDiscount.toFixed(2)}</span>
                    </div>

                    {/* ✅ Total Tax */}
                    {/* <div className="flex justify-between mb-1">
                      <span>Total Tax</span>
                      <span>₹{totalTax.toFixed(2)}</span>
                    </div> */}

                    {/* ✅ CGST */}
                    <div className="flex justify-between mb-1 text-gray-600 ">
                      <span>CGST </span>
                      <span>₹{halfGST.toFixed(2)}</span>
                    </div>

                    {/* ✅ SGST */}
                    <div className="flex justify-between mb-1 text-gray-600 ">
                      <span>SGST </span>
                      <span>₹{halfGST.toFixed(2)}</span>
                    </div>

                    {/* Invoice Total */}
                    <div className="flex justify-between font-semibold border-t pt-1 text-gray-800">
                      <span>Invoice Total</span>
                      <span>₹{invoiceTotal.toFixed(0)}</span>
                    </div>
                  </>
                );
              })()}
            </div>


          </div>

          {/* SIGNATURE */}
          <div className="-mt-8 text-right text-xs">
            <p className="font-medium">Digitally Authorised</p>
          </div>

          <div className="mt-30">
            <p className="text-gray-400 text-xs mt-6">
              <span className="font-semibold">Note:</span><br />
              GST are applicable as per government regulations.<br />
              Thank you for shopping with us. We look forward to serving you again.
            </p></div>
          <div className="mt-10">
            <p className="text-center text-gray-400 text-xs mt-4">
              Thank you for your purchase!
            </p>
          </div>
          {/* PRINT ONLY WEBSITE FOOTER */}
          <div className="print-footer">
            https://islamicbookzone.com/
          </div>

        </div>

      </div>
    </>
  );
}

export default InvoicePage;
