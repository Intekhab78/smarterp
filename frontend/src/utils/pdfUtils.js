// src/utils/pdfUtils.js
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import logo from "../assets/images/logos/jtserplogo.png"; // adjust relative path
import { axios_post } from "../axios"; // adjust your axios_post import
import constantApi from "constantApi";

export const generateInvoicePdf = async (pdfData) => {
  console.log("📦 Invoice Data:", pdfData);

  // ========================================================
  // 🔹 INITIALIZE VARIABLES
  // ========================================================
  let companyDetails = {};
  let locationDetails = {};
  let companyAddress = {}; // define once globally, not redeclare inside try

  const toBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // enable CORS
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png")); // Base64 string
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  // ========================================================
  // 🔹 TOTAL VALUE PLACEHOLDERS
  // ========================================================
  let totalQtyPriceVal = "0.00";
  let totalDiscountVal = "0.00";
  let totalTaxableVal = "0.00";
  let grandTotalVal = "0.00";

  // ========================================================
  // 🔹 FETCH COMPANY + LOCATION DETAILS
  // ========================================================
  try {
    const response = await axios_post(true, "company/details", {
      id: pdfData.company_id,
    });

    if (response.status) {
      const orderData = response.data;
      console.log("🏢 Company API Response:", orderData);

      // -------------------------------
      // COMPANY DETAILS
      // -------------------------------
      companyDetails = {
        company_id: orderData.id,
        company_name: orderData.compdesc || "N/A",
        company_code: orderData.compcode || "N/A",
        company_logo: orderData.clogo || "",
        company_tax: orderData.ctaxnumber || "-",
        company_currency: orderData.ccurrency || "-",
        company_finyear: orderData.cfinyear || "-",
        company_license: orderData.clicense || "-",
        company_address: orderData.company_address || [],
      };

      // -------------------------------
      // COMPANY ADDRESS (use outer var, NOT let again)
      // -------------------------------
      companyAddress = {
        address: orderData?.company_address?.[0]?.address || "N/A",
        address_name: orderData?.company_address?.[0]?.address_name || "N/A",
        email: orderData?.company_address?.[0]?.email || "N/A",
        contact_no: orderData?.company_address?.[0]?.contact_no || "N/A",
        postal_code: orderData?.company_address?.[0]?.postal_code || "N/A",
      };

      // -------------------------------
      // LOCATION DETAILS
      // -------------------------------
      if (orderData.location && orderData.location.length > 0) {
        const loc = orderData.location[0];
        locationDetails = {
          location_id: loc.id,
          location_name: loc.locname || "N/A",
          location_code: loc.loccode || "N/A",
          location_address: loc.locdesclong || "-",
          location_currency: loc.ccurrency || "-",
          ctaxnumber: loc.ctaxnumber || orderData.ctaxnumber || "-", // ✅ added
          clicense: loc.clicense || orderData.clicense || "-", // ✅ added
        };
      }

      // -------------------------------
      // CALCULATE TOTALS
      // -------------------------------
      let totalQtyPrice = 0;
      let totalDiscount = 0;
      let totalTaxable = 0;
      let grandTotal = 0;

      pdfData?.invoice_details?.forEach((item) => {
        const qty = parseFloat(item.item_qty || 0);
        const unitPrice = parseFloat(item.item_gross || 0);
        const total = qty * unitPrice;
        let discount = 0;
        if (item.discounttype === "Percentage") {
          discount = (total * parseFloat(item.item_discount_amount || 0)) / 100;
        } else {
          discount = parseFloat(item.item_discount_amount || 0);
        }
        // const discount = parseFloat(item.item_discount_amount || 0);
        const netAmount = parseFloat(item.item_net || 0);
        //  const netAmount = total - discount;
        const includeGst = parseFloat(
          item.includeVatAmount || item.item_grand_total || 0
        );

        totalQtyPrice += total;
        totalDiscount += discount;
        totalTaxable += netAmount;
        grandTotal += includeGst;
      });

      totalQtyPriceVal = totalQtyPrice.toFixed(2);
      totalDiscountVal = totalDiscount.toFixed(2);
      totalTaxableVal = totalTaxable.toFixed(2);
      grandTotalVal = grandTotal.toFixed(2);
    }
  } catch (err) {
    console.error("❌ Failed to fetch company/location details:", err);
  }

  // ========================================================
  // 🔹 DEBUG LOGS
  // ========================================================
  console.log("✅ Company Details:", companyDetails);
  console.log("🏠 Company Address:", companyAddress);
  console.log("📍 Location Details:", locationDetails);

  // ========================================================
  // 🔹 PDF CREATION START
  // ========================================================
  const customer = pdfData.customer_details;
  const items = pdfData.invoice_details;

  const doc = new jsPDF("p", "mm", "a4");

  // -------------------------------
  // HEADER + LOGO
  // -------------------------------
  doc.setFillColor(235, 235, 235);
  doc.ellipse(210, -15, 140, 60, "F");

  if (companyDetails.company_logo) {
    try {
      const logoUrl = `${constantApi.imageUrl}/logos/${companyDetails.company_logo}`;
      const logoBase64 = await toBase64(logoUrl);
      doc.addImage(logoBase64, "PNG", 12, 12, 25, 20);
    } catch (err) {
      console.warn("⚠️ Failed to load company logo:", err);
    }
  } else {
    // No company logo, use default imported logo
    const defaultLogoBase64 = await toBase64(logo);
    doc.addImage(defaultLogoBase64, "PNG", 12, 12, 25, 20);
  }

  // ========================================================
  // 🔹 COMPANY DETAILS (RIGHT SIDE)
  // ========================================================
  let startX = 150;
  let startY = 15;
  const lineHeight = 6;

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`${companyDetails?.company_name || "Company Name"}`, startX, startY);

  // Normal text for details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Location
  const locationText = doc.splitTextToSize(
    `${locationDetails?.location_name || "Location Name"}`,
    48
  );
  doc.text(locationText, startX, startY + lineHeight);

  let currentY =
    startY + lineHeight + (locationText.length - 1) * lineHeight + lineHeight;

  // Company Address details
  doc.text(`Address: ${companyAddress?.address_name || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Phone: ${companyAddress?.contact_no || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Email: ${companyAddress?.email || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Tax No: ${locationDetails?.ctaxnumber || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`License: ${locationDetails?.clicense || "-"}`, startX, currentY);

  // ========================================================
  // 🔹 VENDOR DETAILS (LEFT SIDE)
  // ========================================================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let custStartY = 50;

  // doc.text(
  //   `Company: ${pdfData?.customer_details?.company_name || ""}`,
  //   15,
  //   custStartY
  // );
  // doc.text(
  //   `Tax Number: ${pdfData?.customer_details?.import_license_no || ""}`,
  //   15,
  //   custStartY + 6
  // );
  doc.text(
    `Customer: ${pdfData?.customer_details?.first_name || ""}  ${
      pdfData?.customer_details?.last_name || ""
    }`,
    15,
    custStartY + 12
  );
  doc.text(
    `Mobile No: ${pdfData?.customer_details?.phone || ""}`,
    15,
    custStartY + 18
  );
  doc.text(
    `Email: ${pdfData?.customer_details?.email || ""}`,
    15,
    custStartY + 24
  );

  // ========================================================
  // 🔹 TITLE + DATES
  // ========================================================
  doc.setFontSize(14);
  doc.setTextColor(23, 162, 184);
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice No ${pdfData.invoice_number}`, 80, 57);

  doc.setDrawColor(180);
  doc.roundedRect(140, 60, 60, 16, 2, 2);
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("Invoice Date", 144, 66);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 144, 69);
  doc.text("Due Date", 170, 66);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 170, 69);

  // ========================================================
  // 🔹 ITEMS TABLE
  // ========================================================
  doc.autoTable({
    startY: 80,
    head: [
      [
        "Sr No",
        "Code",
        "Description",
        "Qty",
        "Unit Price",
        "Total",
        "Discount",
        "Sub Total",
        "GST Amount",
        "Grand Amount",
      ],
    ],
    body: items.map((item, index) => {
      const qty = parseFloat(item.item_qty || 0);
      const unitPrice = parseFloat(item.item_gross || 0);
      // const unitPrice = parseFloat(item.item_price || 0);
      const total = qty * unitPrice;
      let discount = 0;
      if (item.discounttype === "Percentage") {
        discount = (total * parseFloat(item.item_discount_amount || 0)) / 100;
      } else {
        discount = parseFloat(item.item_discount_amount || 0);
      }
      // const discount = parseFloat(item.item_discount_amount || 0);
      const netAmount = parseFloat(item.item_net || 0);
      // const netAmount = total - discount;

      const gstAmount = parseFloat(item.vatAmount || item.taxa_ble || 0);
      const includeGst = parseFloat(
        item.includeVatAmount || item.item_grand_total || 0
      );

      return [
        index + 1,
        item.itemLocationModel?.item_code || "-",
        item.itemLocationModel?.itemdesc ||
          item.itemLocationModel?.item_name ||
          "",
        qty.toFixed(2),
        unitPrice.toFixed(2),
        total.toFixed(2),
        discount.toFixed(2),
        netAmount.toFixed(2),
        gstAmount.toFixed(2),
        includeGst.toFixed(2),
      ];
    }),
  });

  // ========================================================
  // 🔹 FOOTER + TOTALS
  // ========================================================
  const afterTableY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text("Payment terms: Immediate Payment", 12, afterTableY);

  const boxY = afterTableY + 10;
  doc.setDrawColor(180);
  doc.rect(120, boxY, 80, 35);
  doc.setFontSize(9);
  doc.setTextColor(0);

  doc.text("Total (Qty x Price)", 122, boxY + 6);
  doc.text(`${totalQtyPriceVal}`, 185, boxY + 6, { align: "right" });
  doc.text("Total Discount", 122, boxY + 12);
  doc.text(`${totalDiscountVal}`, 185, boxY + 12, { align: "right" });
  doc.text("Subtotal", 122, boxY + 18);
  doc.text(`${totalTaxableVal}`, 185, boxY + 18, { align: "right" });
  doc.text("GST", 122, boxY + 24);
  doc.text(`${(grandTotalVal - totalTaxableVal).toFixed(2)}`, 185, boxY + 24, {
    align: "right",
  });

  doc.setFillColor(23, 162, 184);
  doc.setTextColor(255);
  doc.rect(120, boxY + 26, 80, 9, "F");
  doc.text("Grand Total", 122, boxY + 33);
  doc.text(`${grandTotalVal}`, 185, boxY + 33, { align: "right" });

  // ========================================================
  // 🔹 SIGNATURE + FOOTER
  // ========================================================
  doc.setDrawColor(0);
  doc.rect(160, 260, 40, 20);
  doc.text("Signature", 165, 275);

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`${customer?.email || ""}`, 12, 290);
  doc.text("Page 1 / 1", 200, 290, { align: "right" });

  // ========================================================
  // 🔹 SAVE PDF
  // ========================================================
  doc.save(`Invoice_${pdfData.invoice_number}.pdf`);
};

export const generateInvoicePdf1 = async (pdfData, params) => {
  console.log("PDF Data:", pdfData);

  // 🔹 Fetch company & location details
  let companyDetails = {};
  let locationDetails = {};

  try {
    const response = await axios_post(true, "company/details", {
      id: pdfData.company_id,
    });
    if (response.status) {
      const orderData = response.data;

      companyDetails = {
        company_id: orderData.id,
        company_name: orderData.compdesc || "N/A",
        company_code: orderData.compcode || "N/A",
        company_logo: orderData.clogo || "",
        company_tax: orderData.ctaxnumber || "-",
        company_currency: orderData.ccurrency || "-",
        company_finyear: orderData.cfinyear || "-",
        company_license: orderData.clicense || "-",
      };

      if (orderData.location && orderData.location.length > 0) {
        const loc = orderData.location[0]; // assuming first location
        locationDetails = {
          location_id: loc.id,
          location_name: loc.locname || "N/A",
          location_code: loc.loccode || "N/A",
          location_address: loc.locdesclong || "-",
          location_currency: loc.ccurrency || "-",
        };
      }
    }
  } catch (err) {
    console.error("Failed to fetch company/location details:", err);
  }

  // 🔹 Print company & location details
  console.log("Company Details:", companyDetails);
  console.log("Location Details:", locationDetails);

  // 🔹 Start PDF generation
  const customer = pdfData.customer;
  const items = pdfData.invoice_details;

  const doc = new jsPDF("p", "mm", "a4");

  // Header background curve
  doc.setFillColor(235, 235, 235);
  doc.ellipse(210, -15, 140, 60, "F");

  // Logo
  doc.addImage(logo, "PNG", 12, 12, 25, 20);

  // Set bold font for all
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  // Company Name
  doc.text(`${companyDetails?.company_name || "Company Name"}`, 150, 15);

  // Location (may wrap into multiple lines)
  const locationText = doc.splitTextToSize(
    locationDetails?.location_name || "Location Name",
    50
  );
  const lineHeight = 6; // consistent spacing

  doc.text(locationText, 150, 15 + lineHeight);

  // Calculate Y after ALL location lines
  const locationHeight = locationText.length * lineHeight;
  const nextY = 15 + locationHeight + lineHeight;

  // License No
  doc.text(
    `License No: ${companyDetails?.company_license || "XXXXXX"}`,
    150,
    nextY
  );

  // ================== Customer Details (Left side) ==================
  doc.setFont("helvetica");
  doc.setFontSize(11);

  let startY = 50; // align with company details on right

  // Customer Name
  doc.text(
    `Customer Name: ${pdfData.customer_details?.first_name || "N/A"}`,
    15,
    startY
  );

  // Mobile No
  doc.text(
    `Mobile No: ${pdfData.customer_details?.phone || "N/A"}`,
    15,
    startY + 6
  );

  // GST Number
  doc.text(
    `Tax Number: ${pdfData.customer_details?.gst_number || "N/A"}`,
    15,
    startY + 12
  );

  // ================== Invoice Title (Center) ==================
  doc.setFontSize(14);
  doc.setTextColor(23, 162, 184);
  doc.setFont("helvetica", "bold");
  doc.text(`TAX Invoice ${pdfData.invoice_number}`, 120, 50);

  // ================== Dates (Right box) ==================
  doc.setDrawColor(180);
  doc.roundedRect(140, 55, 60, 16, 2, 2);
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("Invoice Date", 144, 60);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 144, 65);
  doc.text("Due Date", 170, 60);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 170, 65);

  // Items Table
  // doc.autoTable({
  //   startY: 80,
  //   head: [["Description", "Qty", "Unit Price", "Vat", "Unit Total", "Total"]],
  //   body: items.map((item) => [
  //     item.itemLocationModel?.itemdesc ||
  //       item.itemLocationModel?.item_name ||
  //       "",
  //     item.item_qty || "",
  //     `${item.item_price}`,
  //     `${item.item_vat || 0}`,
  //     `${item.perItem_Total || 0}`,
  //     `${parseFloat(item.item_grand_total || 0).toFixed(2)}`,
  //   ]),
  //   theme: "grid",
  //   headStyles: { fillColor: [23, 162, 184], textColor: 255, halign: "center" },
  //   bodyStyles: { fontSize: 8 },
  // });
  // Items Table (Improved Red Header + Responsive Width)
  // Items Table with full columns
  doc.autoTable({
    startY: 80,
    head: [
      [
        "Sr No",
        "Model",
        "Description",
        "Qty",
        "Unit Price",
        "Amount Without GST",
        "GST Amount",
        "Include GST Amount",
      ],
    ],
    body: items.map((item, index) => [
      index + 1, // Sr No
      item.itemLocationModel?.item_model || "", // Model
      item.itemLocationModel?.itemdesc ||
        item.itemLocationModel?.item_name ||
        "", // Description
      item.item_qty || "",
      `${item.item_price || 0}`,
      `${item.item_net || 0}`,
      `${item.item_vat || 0}`,
      `${parseFloat(item.item_grand_total || 0).toFixed(2)}`,
    ]),
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
      lineColor: [220, 220, 220],
      textColor: [40, 40, 40],
    },
    headStyles: {
      fillColor: [23, 162, 184], // 💙 Info color (#17A2B8)

      textColor: 255,

      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" }, // Sr No
      1: { cellWidth: 20 }, // Model
      2: { cellWidth: 55 }, // Description
      3: { cellWidth: 15, halign: "center" }, // Qty
      4: { cellWidth: 20, halign: "right" }, // Unit Price
      5: { cellWidth: 25, halign: "right" }, // Amount Without VAT
      6: { cellWidth: 20, halign: "right" }, // VAT Amount
      7: { cellWidth: 25, halign: "right" }, // Include VAT Amount
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    didDrawPage: (data) => {
      // Optional: adjust table width dynamically if still too wide
      const pageWidth = doc.internal.pageSize.getWidth();
      const tableWidth = data.table.width;
      const margin = 10;

      if (tableWidth > pageWidth - margin * 2) {
        const scale = (pageWidth - margin * 2) / tableWidth;
        data.table.width *= scale;
        data.table.columns.forEach((col) => {
          col.width *= scale;
        });
      }
    },
  });

  const afterTableY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text("Payment terms: Immediate Payment", 12, afterTableY);

  // Totals
  const boxY = afterTableY + 10;
  doc.setDrawColor(180);
  doc.rect(120, boxY, 80, 25);
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text("Untaxed Amount", 122, boxY + 6);
  doc.text(`${pdfData.total_net} `, 185, boxY + 6, { align: "right" });
  doc.text("GST", 122, boxY + 12);
  doc.text(`${pdfData.total_vat || 0} `, 185, boxY + 12, { align: "right" });
  doc.setFillColor(23, 162, 184);
  doc.setTextColor(255);
  doc.rect(120, boxY + 18, 80, 7, "F");
  doc.text("Grand Total", 122, boxY + 23);
  doc.text(`${pdfData.grand_total} `, 185, boxY + 23, { align: "right" });

  // Signature
  doc.setDrawColor(0);
  doc.rect(160, 260, 40, 20);
  doc.text("Signature", 165, 275);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`${customer?.email || ""}`, 12, 290);
  doc.text("Page 1 / 1", 200, 290, { align: "right" });

  // Save PDF
  doc.save(`Invoice_${pdfData.invoice_number}.pdf`);
};
export const generatePurchaseOrderPdf = async (pdfData) => {
  console.log("📦 Purchase order Data:", pdfData);

  // ========================================================
  // 🔹 INITIALIZE VARIABLES
  // ========================================================
  let companyDetails = {};
  let locationDetails = {};
  let companyAddress = {}; // define once globally, not redeclare inside try

  const toBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // enable CORS
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png")); // Base64 string
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  // ========================================================
  // 🔹 TOTAL VALUE PLACEHOLDERS
  // ========================================================
  let totalQtyPriceVal = "0.00";
  let totalDiscountVal = "0.00";
  let totalTaxableVal = "0.00";
  let grandTotalVal = "0.00";

  // ========================================================
  // 🔹 FETCH COMPANY + LOCATION DETAILS
  // ========================================================
  try {
    const response = await axios_post(true, "company/details", {
      id: pdfData.company_id,
    });

    if (response.status) {
      const orderData = response.data;
      console.log("🏢 Company API Response:", orderData);

      // -------------------------------
      // COMPANY DETAILS
      // -------------------------------
      companyDetails = {
        company_id: orderData.id,
        company_name: orderData.compdesc || "N/A",
        company_code: orderData.compcode || "N/A",
        company_logo: orderData.clogo || "",
        company_tax: orderData.ctaxnumber || "-",
        company_currency: orderData.ccurrency || "-",
        company_finyear: orderData.cfinyear || "-",
        company_license: orderData.clicense || "-",
        company_address: orderData.company_address || [],
      };

      // -------------------------------
      // COMPANY ADDRESS (use outer var, NOT let again)
      // -------------------------------
      companyAddress = {
        address: orderData?.company_address?.[0]?.address || "N/A",
        address_name: orderData?.company_address?.[0]?.address_name || "N/A",
        email: orderData?.company_address?.[0]?.email || "N/A",
        contact_no: orderData?.company_address?.[0]?.contact_no || "N/A",
        postal_code: orderData?.company_address?.[0]?.postal_code || "N/A",
      };

      // -------------------------------
      // LOCATION DETAILS
      // -------------------------------
      if (orderData.location && orderData.location.length > 0) {
        const loc = orderData.location[0];
        locationDetails = {
          location_id: loc.id,
          location_name: loc.locname || "N/A",
          location_code: loc.loccode || "N/A",
          location_address: loc.locdesclong || "-",
          location_currency: loc.ccurrency || "-",
          ctaxnumber: loc.ctaxnumber || orderData.ctaxnumber || "-", // ✅ added
          clicense: loc.clicense || orderData.clicense || "-", // ✅ added
        };
      }

      // -------------------------------
      // CALCULATE TOTALS
      // -------------------------------
      let totalQtyPrice = 0;
      let totalDiscount = 0;
      let totalTaxable = 0;
      let grandTotal = 0;

      pdfData?.order_details?.forEach((item) => {
        const qty = parseFloat(item.item_qty || 0);
        const unitPrice = parseFloat(item.item_price || 0);
        const total = qty * unitPrice;
        let discount = 0;
        if (item.discounttype === "Percentage") {
          discount = (total * parseFloat(item.item_discount_amount || 0)) / 100;
        } else {
          discount = parseFloat(item.item_discount_amount || 0);
        }
        // const discount = parseFloat(item.item_discount_amount || 0);
        const netAmount = parseFloat(item.item_net || 0);
        //  const netAmount = total - discount;
        const includeGst = parseFloat(
          item.includeVatAmount || item.item_grand_total || 0
        );

        totalQtyPrice += total;
        totalDiscount += discount;
        totalTaxable += netAmount;
        grandTotal += includeGst;
      });

      totalQtyPriceVal = totalQtyPrice.toFixed(2);
      totalDiscountVal = totalDiscount.toFixed(2);
      totalTaxableVal = totalTaxable.toFixed(2);
      grandTotalVal = grandTotal.toFixed(2);
    }
  } catch (err) {
    console.error("❌ Failed to fetch company/location details:", err);
  }

  // ========================================================
  // 🔹 DEBUG LOGS
  // ========================================================
  console.log("✅ Company Details:", companyDetails);
  console.log("🏠 Company Address:", companyAddress);
  console.log("📍 Location Details:", locationDetails);

  // ========================================================
  // 🔹 PDF CREATION START
  // ========================================================
  const customer = pdfData.vendor_details;
  const items = pdfData.order_details;
  const doc = new jsPDF("p", "mm", "a4");

  // -------------------------------
  // HEADER + LOGO
  // -------------------------------
  doc.setFillColor(235, 235, 235);
  doc.ellipse(210, -15, 140, 60, "F");

  if (companyDetails.company_logo) {
    try {
      const logoUrl = `${constantApi.imageUrl}/logos/${companyDetails.company_logo}`;
      const logoBase64 = await toBase64(logoUrl);
      doc.addImage(logoBase64, "PNG", 12, 12, 25, 20);
    } catch (err) {
      console.warn("⚠️ Failed to load company logo:", err);
    }
  } else {
    // No company logo, use default imported logo
    const defaultLogoBase64 = await toBase64(logo);
    doc.addImage(defaultLogoBase64, "PNG", 12, 12, 25, 20);
  }

  // ========================================================
  // 🔹 COMPANY DETAILS (RIGHT SIDE)
  // ========================================================
  let startX = 150;
  let startY = 15;
  const lineHeight = 6;

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`${companyDetails?.company_name || "Company Name"}`, startX, startY);

  // Normal text for details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Location
  const locationText = doc.splitTextToSize(
    `${locationDetails?.location_name || "Location Name"}`,
    48
  );
  doc.text(locationText, startX, startY + lineHeight);

  let currentY =
    startY + lineHeight + (locationText.length - 1) * lineHeight + lineHeight;

  // Company Address details
  doc.text(`Address: ${companyAddress?.address_name || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Phone: ${companyAddress?.contact_no || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Email: ${companyAddress?.email || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Tax No: ${locationDetails?.ctaxnumber || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`License: ${locationDetails?.clicense || "-"}`, startX, currentY);

  // doc.text(
  //   `Tax No: ${locationDetails[0]?.ctaxnumber || "-"}`,
  //   startX,
  //   currentY
  // );
  // currentY += lineHeight;
  // doc.text(
  //   `License: ${companyDetails?.company_license || "-"}`,
  //   startX,
  //   currentY
  // );

  // ========================================================
  // 🔹 VENDOR DETAILS (LEFT SIDE)
  // ========================================================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let custStartY = 50;

  doc.text(
    `Company: ${pdfData?.vendor_details?.company_name || ""}`,
    15,
    custStartY
  );
  doc.text(
    `Tax Number: ${pdfData?.vendor_details?.import_license_no || ""}`,
    15,
    custStartY + 6
  );
  doc.text(
    `Vendor: ${pdfData?.vendor_details?.firstname || ""}`,
    15,
    custStartY + 12
  );
  doc.text(
    `Mobile No: ${pdfData?.vendor_details?.VendorMobileNumber || ""}`,
    15,
    custStartY + 18
  );
  doc.text(
    `Email: ${pdfData?.vendor_details?.VendorEmail || ""}`,
    15,
    custStartY + 24
  );

  // ========================================================
  // 🔹 TITLE + DATES
  // ========================================================
  doc.setFontSize(14);
  doc.setTextColor(23, 162, 184);
  doc.setFont("helvetica", "bold");
  doc.text(`Purchase Order ${pdfData.order_number}`, 140, 57);

  doc.setDrawColor(180);
  doc.roundedRect(140, 60, 60, 16, 2, 2);
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("PO Date", 144, 66);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 144, 69);
  doc.text("Due Date", 170, 66);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 170, 69);

  // ========================================================
  // 🔹 ITEMS TABLE
  // ========================================================
  doc.autoTable({
    startY: 80,
    head: [
      [
        "Sr No",
        "Code",
        "Description",
        "Qty",
        "Unit Price",
        "Total",
        "Discount",
        "Sub Total",
        "GST Amount",
        "Grand Amount",
      ],
    ],
    body: items.map((item, index) => {
      const qty = parseFloat(item.item_qty || 0);
      const unitPrice = parseFloat(item.item_price || 0);
      const total = qty * unitPrice;
      let discount = 0;
      if (item.discounttype === "Percentage") {
        discount = (total * parseFloat(item.item_discount_amount || 0)) / 100;
      } else {
        discount = parseFloat(item.item_discount_amount || 0);
      }
      // const discount = parseFloat(item.item_discount_amount || 0);
      const netAmount = parseFloat(item.item_net || 0);
      // const netAmount = total - discount;

      const gstAmount = parseFloat(item.vatAmount || item.taxa_ble || 0);
      const includeGst = parseFloat(
        item.includeVatAmount || item.item_grand_total || 0
      );

      return [
        index + 1,
        item.itemLocationModel?.item_code || "-",
        item.itemLocationModel?.itemdesc ||
          item.itemLocationModel?.item_name ||
          "",
        qty.toFixed(2),
        unitPrice.toFixed(2),
        total.toFixed(2),
        discount.toFixed(2),
        netAmount.toFixed(2),
        gstAmount.toFixed(2),
        includeGst.toFixed(2),
      ];
    }),
  });

  // ========================================================
  // 🔹 FOOTER + TOTALS
  // ========================================================
  const afterTableY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text("Payment terms: Immediate Payment", 12, afterTableY);

  const boxY = afterTableY + 10;
  doc.setDrawColor(180);
  doc.rect(120, boxY, 80, 35);
  doc.setFontSize(9);
  doc.setTextColor(0);

  doc.text("Total (Qty x Price)", 122, boxY + 6);
  doc.text(`${totalQtyPriceVal}`, 185, boxY + 6, { align: "right" });
  doc.text("Total Discount", 122, boxY + 12);
  doc.text(`${totalDiscountVal}`, 185, boxY + 12, { align: "right" });
  doc.text("Subtotal", 122, boxY + 18);
  doc.text(`${totalTaxableVal}`, 185, boxY + 18, { align: "right" });
  doc.text("GST", 122, boxY + 24);
  doc.text(`${(grandTotalVal - totalTaxableVal).toFixed(2)}`, 185, boxY + 24, {
    align: "right",
  });

  doc.setFillColor(23, 162, 184);
  doc.setTextColor(255);
  doc.rect(120, boxY + 26, 80, 9, "F");
  doc.text("Grand Total", 122, boxY + 33);
  doc.text(`${grandTotalVal}`, 185, boxY + 33, { align: "right" });

  // ========================================================
  // 🔹 SIGNATURE + FOOTER
  // ========================================================
  doc.setDrawColor(0);
  doc.rect(160, 260, 40, 20);
  doc.text("Signature", 165, 275);

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`${customer?.email || ""}`, 12, 290);
  doc.text("Page 1 / 1", 200, 290, { align: "right" });

  // ========================================================
  // 🔹 SAVE PDF
  // ========================================================
  doc.save(`PurchaseOrder_${pdfData.order_number}.pdf`);
};

export const generateOrderPdf = async (pdfData, params) => {
  console.log(" order Data:", pdfData);

  // ========================================================
  // 🔹 INITIALIZE VARIABLES
  // ========================================================
  let companyDetails = {};
  let locationDetails = {};
  let companyAddress = {}; // define once globally, not redeclare inside try

  const toBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // enable CORS
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png")); // Base64 string
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  // ========================================================
  // 🔹 TOTAL VALUE PLACEHOLDERS
  // ========================================================
  let totalQtyPriceVal = "0.00";
  let totalDiscountVal = "0.00";
  let totalTaxableVal = "0.00";
  let grandTotalVal = "0.00";

  // ========================================================
  // 🔹 FETCH COMPANY + LOCATION DETAILS
  // ========================================================
  try {
    const response = await axios_post(true, "company/details", {
      id: pdfData.company_id,
    });

    if (response.status) {
      const orderData = response.data;
      console.log("🏢 Company API Response:", orderData);

      // -------------------------------
      // COMPANY DETAILS
      // -------------------------------
      companyDetails = {
        company_id: orderData.id,
        company_name: orderData.compdesc || "N/A",
        company_code: orderData.compcode || "N/A",
        company_logo: orderData.clogo || "",
        company_tax: orderData.ctaxnumber || "-",
        company_currency: orderData.ccurrency || "-",
        company_finyear: orderData.cfinyear || "-",
        company_license: orderData.clicense || "-",
        company_address: orderData.company_address || [],
      };

      // -------------------------------
      // COMPANY ADDRESS (use outer var, NOT let again)
      // -------------------------------
      companyAddress = {
        address: orderData?.company_address?.[0]?.address || "N/A",
        address_name: orderData?.company_address?.[0]?.address_name || "N/A",
        email: orderData?.company_address?.[0]?.email || "N/A",
        contact_no: orderData?.company_address?.[0]?.contact_no || "N/A",
        postal_code: orderData?.company_address?.[0]?.postal_code || "N/A",
      };

      // -------------------------------
      // LOCATION DETAILS
      // -------------------------------
      if (orderData.location && orderData.location.length > 0) {
        const loc = orderData.location[0];
        locationDetails = {
          location_id: loc.id,
          location_name: loc.locname || "N/A",
          location_code: loc.loccode || "N/A",
          location_address: loc.locdesclong || "-",
          location_currency: loc.ccurrency || "-",
          ctaxnumber: loc.ctaxnumber || orderData.ctaxnumber || "-", // ✅ added
          clicense: loc.clicense || orderData.clicense || "-", // ✅ added
        };
      }

      // -------------------------------
      // CALCULATE TOTALS
      // -------------------------------
      let totalQtyPrice = 0;
      let totalDiscount = 0;
      let totalTaxable = 0;
      let grandTotal = 0;

      pdfData?.order_details?.forEach((item) => {
        const qty = parseFloat(item.item_qty || 0);
        const unitPrice = parseFloat(item.item_price || 0);
        const total = qty * unitPrice;
        let discount = 0;
        if (item.discounttype === "Percentage") {
          discount = (total * parseFloat(item.item_discount_amount || 0)) / 100;
        } else {
          discount = parseFloat(item.item_discount_amount || 0);
        }
        // const discount = parseFloat(item.item_discount_amount || 0);
        const netAmount = parseFloat(item.item_net || 0);
        //  const netAmount = total - discount;
        const includeGst = parseFloat(
          item.includeVatAmount || item.item_grand_total || 0
        );

        totalQtyPrice += total;
        totalDiscount += discount;
        totalTaxable += netAmount;
        grandTotal += includeGst;
      });

      totalQtyPriceVal = totalQtyPrice.toFixed(2);
      totalDiscountVal = totalDiscount.toFixed(2);
      totalTaxableVal = totalTaxable.toFixed(2);
      grandTotalVal = grandTotal.toFixed(2);
    }
  } catch (err) {
    console.error("❌ Failed to fetch company/location details:", err);
  }

  // ========================================================
  // 🔹 DEBUG LOGS
  // ========================================================
  console.log("✅ Company Details:", companyDetails);
  console.log("🏠 Company Address:", companyAddress);
  console.log("📍 Location Details:", locationDetails);

  // ========================================================
  // 🔹 PDF CREATION START
  // ========================================================
  const customer = pdfData.customer_details;
  const items = pdfData.order_details;
  const doc = new jsPDF("p", "mm", "a4");

  // -------------------------------
  // HEADER + LOGO
  // -------------------------------
  doc.setFillColor(235, 235, 235);
  doc.ellipse(210, -15, 140, 60, "F");

  console.log(
    "companyDetails.company_logo ----------",
    companyDetails.company_logo
  );

  if (companyDetails.company_logo) {
    try {
      const logoUrl = `${constantApi.imageUrl}/logos/${companyDetails.company_logo}`;
      console.log("logo url is ----------", logoUrl);

      const logoBase64 = await toBase64(logoUrl);
      doc.addImage(logoBase64, "PNG", 12, 12, 25, 20);
      console.log("logo url is ----------", logoUrl);
    } catch (err) {
      console.warn("⚠️ Failed to load company logo:", err);
    }
  } else {
    // No company logo, use default imported logo
    const defaultLogoBase64 = await toBase64(logo);
    doc.addImage(defaultLogoBase64, "PNG", 12, 12, 25, 20);
  }

  // ========================================================
  // 🔹 COMPANY DETAILS (RIGHT SIDE)
  // ========================================================
  let startX = 150;
  let startY = 15;
  const lineHeight = 6;

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`${companyDetails?.company_name || "Company Name"}`, startX, startY);

  // Normal text for details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Location
  const locationText = doc.splitTextToSize(
    `${locationDetails?.location_name || "Location Name"}`,
    48
  );
  doc.text(locationText, startX, startY + lineHeight);

  let currentY =
    startY + lineHeight + (locationText.length - 1) * lineHeight + lineHeight;

  // Company Address details
  doc.text(`Address: ${companyAddress?.address_name || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Phone: ${companyAddress?.contact_no || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Email: ${companyAddress?.email || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Tax No: ${locationDetails?.ctaxnumber || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`License: ${locationDetails?.clicense || "-"}`, startX, currentY);

  // ========================================================
  // 🔹 VENDOR DETAILS (LEFT SIDE)
  // ========================================================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let custStartY = 50;

  // doc.text(
  //   `Company: ${pdfData?.customer_details?.company_name || ""}`,
  //   15,
  //   custStartY
  // );
  // doc.text(
  //   `Tax Number: ${pdfData?.customer_details?.import_license_no || ""}`,
  //   15,
  //   custStartY + 6
  // );
  doc.text(
    `Customer: ${pdfData?.customer_details?.first_name || ""}  ${
      pdfData?.customer_details?.last_name || ""
    }`,
    15,
    custStartY + 12
  );
  doc.text(
    `Mobile No: ${pdfData?.customer_details?.phone || ""}`,
    15,
    custStartY + 18
  );
  doc.text(
    `Email: ${pdfData?.customer_details?.email || ""}`,
    15,
    custStartY + 24
  );

  // ========================================================
  // 🔹 TITLE + DATES
  // ========================================================
  doc.setFontSize(14);
  doc.setTextColor(23, 162, 184);
  doc.setFont("helvetica", "bold");
  doc.text(`Order ${pdfData.order_number}`, 80, 57);

  doc.setDrawColor(180);
  doc.roundedRect(140, 60, 60, 16, 2, 2);
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("Order Date", 144, 66);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 144, 69);
  doc.text("Due Date", 170, 66);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 170, 69);

  // ========================================================
  // 🔹 ITEMS TABLE
  // ========================================================
  doc.autoTable({
    startY: 80,
    head: [
      [
        "Sr No",
        "Code",
        "Description",
        "Qty",
        "Unit Price",
        "Total",
        "Discount",
        "Sub Total",
        "GST Amount",
        "Grand Amount",
      ],
    ],
    body: items.map((item, index) => {
      const qty = parseFloat(item.item_qty || 0);
      const unitPrice = parseFloat(item.item_price || 0);
      const total = qty * unitPrice;
      let discount = 0;
      if (item.discounttype === "Percentage") {
        discount = (total * parseFloat(item.item_discount_amount || 0)) / 100;
      } else {
        discount = parseFloat(item.item_discount_amount || 0);
      }
      // const discount = parseFloat(item.item_discount_amount || 0);
      const netAmount = parseFloat(item.item_net || 0);
      // const netAmount = total - discount;

      const gstAmount = parseFloat(item.vatAmount || item.taxa_ble || 0);
      const includeGst = parseFloat(
        item.includeVatAmount || item.item_grand_total || 0
      );

      return [
        index + 1,
        item.itemLocationModel?.item_code || "-",
        item.itemLocationModel?.itemdesc ||
          item.itemLocationModel?.item_name ||
          "",
        qty.toFixed(2),
        unitPrice.toFixed(2),
        total.toFixed(2),
        discount.toFixed(2),
        netAmount.toFixed(2),
        gstAmount.toFixed(2),
        includeGst.toFixed(2),
      ];
    }),
  });

  // ========================================================
  // 🔹 FOOTER + TOTALS
  // ========================================================
  const afterTableY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text("Payment terms: Immediate Payment", 12, afterTableY);

  const boxY = afterTableY + 10;
  doc.setDrawColor(180);
  doc.rect(120, boxY, 80, 35);
  doc.setFontSize(9);
  doc.setTextColor(0);

  doc.text("Total (Qty x Price)", 122, boxY + 6);
  doc.text(`${totalQtyPriceVal}`, 185, boxY + 6, { align: "right" });
  doc.text("Total Discount", 122, boxY + 12);
  doc.text(`${totalDiscountVal}`, 185, boxY + 12, { align: "right" });
  doc.text("Subtotal", 122, boxY + 18);
  doc.text(`${totalTaxableVal}`, 185, boxY + 18, { align: "right" });
  doc.text("GST", 122, boxY + 24);
  doc.text(`${(grandTotalVal - totalTaxableVal).toFixed(2)}`, 185, boxY + 24, {
    align: "right",
  });

  doc.setFillColor(23, 162, 184);
  doc.setTextColor(255);
  doc.rect(120, boxY + 26, 80, 9, "F");
  doc.text("Grand Total", 122, boxY + 33);
  doc.text(`${grandTotalVal}`, 185, boxY + 33, { align: "right" });

  // ========================================================
  // 🔹 SIGNATURE + FOOTER
  // ========================================================
  doc.setDrawColor(0);
  doc.rect(160, 260, 40, 20);
  doc.text("Signature", 165, 275);

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`${customer?.email || ""}`, 12, 290);
  doc.text("Page 1 / 1", 200, 290, { align: "right" });

  // ========================================================
  // 🔹 SAVE PDF
  // ========================================================
  doc.save(`Order_${pdfData.order_number}.pdf`);
};

export const generateOrderPdf1 = async (pdfData, params) => {
  console.log("order Data:", pdfData);

  // 🔹 Fetch company & location details
  let companyDetails = {};
  let locationDetails = {};

  try {
    const response = await axios_post(true, "company/details", {
      id: pdfData.company_id,
    });
    if (response.status) {
      const orderData = response.data;

      companyDetails = {
        company_id: orderData.id,
        company_name: orderData.compdesc || "N/A",
        company_code: orderData.compcode || "N/A",
        company_logo: orderData.clogo || "",
        company_tax: orderData.ctaxnumber || "-",
        company_currency: orderData.ccurrency || "-",
        company_finyear: orderData.cfinyear || "-",
        company_license: orderData.clicense || "-",
      };

      if (orderData.location && orderData.location.length > 0) {
        const loc = orderData.location[0]; // assuming first location
        locationDetails = {
          location_id: loc.id,
          location_name: loc.locname || "N/A",
          location_code: loc.loccode || "N/A",
          location_address: loc.locdesclong || "-",
          location_currency: loc.ccurrency || "-",
        };
      }
    }
  } catch (err) {
    console.error("Failed to fetch company/location details:", err);
  }

  // 🔹 Print company & location details
  console.log("Company Details:", companyDetails);
  console.log("Location Details:", locationDetails);

  // 🔹 Start PDF generation
  const customer = pdfData.customer;
  const items = pdfData.order_details;

  const doc = new jsPDF("p", "mm", "a4");

  // Header background curve
  doc.setFillColor(235, 235, 235);
  doc.ellipse(210, -15, 140, 60, "F");

  // Logo
  doc.addImage(logo, "PNG", 12, 12, 25, 20);

  // Set bold font for all
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  // Company Name
  doc.text(`${companyDetails?.company_name || "Company Name"}`, 150, 15);

  // Location (may wrap into multiple lines)
  const locationText = doc.splitTextToSize(
    locationDetails?.location_name || "Location Name",
    50
  );
  const lineHeight = 6; // consistent spacing

  doc.text(locationText, 150, 15 + lineHeight);

  // Calculate Y after ALL location lines
  const locationHeight = locationText.length * lineHeight;
  const nextY = 15 + locationHeight + lineHeight;

  // License No
  doc.text(
    `License No: ${companyDetails?.company_license || "XXXXXX"}`,
    150,
    nextY
  );

  // ================== Customer Details (Left side) ==================
  doc.setFont("helvetica");
  doc.setFontSize(11);

  let startY = 50; // align with company details on right

  // Customer Name
  doc.text(
    `Customer Name: ${pdfData?.vendor_details?.first_name || ""}`,
    15,
    startY
  );

  // Mobile No
  doc.text(
    `Mobile No: ${pdfData?.vendor_details?.mobile || ""}`,
    15,
    startY + 6
  );

  // GST Number
  doc.text(
    `GST Number: ${pdfData?.vendor_details?.import_license_no || ""}`,
    15,
    startY + 12
  );

  // ================== Invoice Title (Center) ==================
  doc.setFontSize(14);
  doc.setTextColor(23, 162, 184);
  doc.setFont("helvetica", "bold");
  doc.text(`Order ${pdfData.order_number}`, 120, 50);

  // ================== Dates (Right box) ==================
  doc.setDrawColor(180);
  doc.roundedRect(140, 55, 60, 16, 2, 2);
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("Invoice Date", 144, 60);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 144, 65);
  doc.text("Due Date", 170, 60);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 170, 65);

  // Items Table
  // doc.autoTable({
  //   startY: 80,
  //   head: [["Description", "Qty", "Unit Price", "Vat", "Unit Total", "Total"]],
  //   body: items.map((item) => [
  //     item.itemLocationModel?.itemdesc ||
  //       item.itemLocationModel?.item_name ||
  //       "",
  //     item.item_qty || "",
  //     `${item.item_price}`,
  //     `${item.item_vat || 0}`,
  //     `${item.perItem_Total || 0}`,
  //     `${parseFloat(item.item_grand_total || 0).toFixed(2)}`,
  //   ]),
  //   theme: "grid",
  //   headStyles: { fillColor: [23, 162, 184], textColor: 255, halign: "center" },
  //   bodyStyles: { fontSize: 8 },
  // });

  doc.autoTable({
    startY: 80,
    head: [
      [
        "Sr No",
        "Model",
        "Description",
        "Qty",
        "Unit Price",
        "Amount Without GST",
        "GST Amount",
        "Include GST Amount",
      ],
    ],
    body: items.map((item, index) => [
      index + 1, // Sr No
      item.itemLocationModel?.item_model || "", // Model
      item.itemLocationModel?.item_name ||
        item.itemLocationModel?.itemdesc ||
        "", // Description
      item.item_qty || "",
      `${item.item_price || 0}`,
      `${item.item_net || 0}`,
      `${item.taxa_ble || 0}`,
      `${parseFloat(item.item_grand_total || 0).toFixed(2)}`,
    ]),
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
      lineColor: [220, 220, 220],
      textColor: [40, 40, 40],
    },
    headStyles: {
      fillColor: [23, 162, 184], // 💙 Info color (#17A2B8)

      textColor: 255,

      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" }, // Sr No
      1: { cellWidth: 20 }, // Model
      2: { cellWidth: 55 }, // Description
      3: { cellWidth: 15, halign: "center" }, // Qty
      4: { cellWidth: 20, halign: "right" }, // Unit Price
      5: { cellWidth: 25, halign: "right" }, // Amount Without GST
      6: { cellWidth: 20, halign: "right" }, // GST Amount
      7: { cellWidth: 25, halign: "right" }, // Include GST Amount
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    didDrawPage: (data) => {
      // Optional: adjust table width dynamically if still too wide
      const pageWidth = doc.internal.pageSize.getWidth();
      const tableWidth = data.table.width;
      const margin = 10;

      if (tableWidth > pageWidth - margin * 2) {
        const scale = (pageWidth - margin * 2) / tableWidth;
        data.table.width *= scale;
        data.table.columns.forEach((col) => {
          col.width *= scale;
        });
      }
    },
  });

  const afterTableY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text("Payment terms: Immediate Payment", 12, afterTableY);

  // Totals
  const boxY = afterTableY + 10;
  doc.setDrawColor(180);
  doc.rect(120, boxY, 80, 25);
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text("Untaxed Amount", 122, boxY + 6);
  doc.text(`${pdfData.total_net} `, 185, boxY + 6, { align: "right" });
  doc.text("GST", 122, boxY + 12);
  doc.text(`${pdfData.total_vat || 0} `, 185, boxY + 12, { align: "right" });
  doc.setFillColor(23, 162, 184);
  doc.setTextColor(255);
  doc.rect(120, boxY + 18, 80, 7, "F");
  doc.text("Grand Total", 122, boxY + 23);
  doc.text(`${pdfData.grand_total} `, 185, boxY + 23, { align: "right" });

  // Signature
  doc.setDrawColor(0);
  doc.rect(160, 260, 40, 20);
  doc.text("Signature", 165, 275);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`${customer?.email || ""}`, 12, 290);
  doc.text("Page 1 / 1", 200, 290, { align: "right" });

  // Save PDF
  doc.save(`Order_${pdfData.order_number}.pdf`);
};

export const generateGrnPdf = async (pdfData) => {
  console.log("📦 Purchase order Data:", pdfData);

  // ========================================================
  // 🔹 INITIALIZE VARIABLES
  // ========================================================
  let companyDetails = {};
  let locationDetails = {};
  let companyAddress = {}; // define once globally, not redeclare inside try

  const toBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // enable CORS
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png")); // Base64 string
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  // ========================================================
  // 🔹 TOTAL VALUE PLACEHOLDERS
  // ========================================================
  let totalQtyPriceVal = "0.00";
  let totalDiscountVal = "0.00";
  let totalTaxableVal = "0.00";
  let grandTotalVal = "0.00";

  // ========================================================
  // 🔹 FETCH COMPANY + LOCATION DETAILS
  // ========================================================
  try {
    const response = await axios_post(true, "company/details", {
      id: pdfData.company_id,
    });

    if (response.status) {
      const orderData = response.data;
      console.log("🏢 Company API Response:", orderData);

      // -------------------------------
      // COMPANY DETAILS
      // -------------------------------
      companyDetails = {
        company_id: orderData.id,
        company_name: orderData.compdesc || "N/A",
        company_code: orderData.compcode || "N/A",
        company_logo: orderData.clogo || "",
        company_tax: orderData.ctaxnumber || "-",
        company_currency: orderData.ccurrency || "-",
        company_finyear: orderData.cfinyear || "-",
        company_license: orderData.clicense || "-",
        company_address: orderData.company_address || [],
      };

      // -------------------------------
      // COMPANY ADDRESS (use outer var, NOT let again)
      // -------------------------------
      companyAddress = {
        address: orderData?.company_address?.[0]?.address || "N/A",
        address_name: orderData?.company_address?.[0]?.address_name || "N/A",
        email: orderData?.company_address?.[0]?.email || "N/A",
        contact_no: orderData?.company_address?.[0]?.contact_no || "N/A",
        postal_code: orderData?.company_address?.[0]?.postal_code || "N/A",
      };

      // -------------------------------
      // LOCATION DETAILS
      // -------------------------------
      if (orderData.location && orderData.location.length > 0) {
        const loc = orderData.location[0];
        locationDetails = {
          location_id: loc.id,
          location_name: loc.locname || "N/A",
          location_code: loc.loccode || "N/A",
          location_address: loc.locdesclong || "-",
          location_currency: loc.ccurrency || "-",
          ctaxnumber: loc.ctaxnumber || orderData.ctaxnumber || "-", // ✅ added
          clicense: loc.clicense || orderData.clicense || "-", // ✅ added
        };
      }

      // -------------------------------
      // CALCULATE TOTALS
      // -------------------------------
      let totalQtyPrice = 0;
      let totalDiscount = 0;
      let totalTaxable = 0;
      let grandTotal = 0;

      pdfData?.grn_details?.forEach((item) => {
        const qty = parseFloat(item.item_qty || 0);
        const unitPrice = parseFloat(item.item_gross || 0);
        const total = qty * unitPrice;
        let discount = 0;
        if (item.discounttype === "Percentage") {
          discount = (total * parseFloat(item.item_discount_amount || 0)) / 100;
        } else {
          discount = parseFloat(item.item_discount_amount || 0);
        }
        // const discount = parseFloat(item.item_discount_amount || 0);
        const netAmount = parseFloat(item.item_net || 0);
        //  const netAmount = total - discount;
        const includeGst = parseFloat(
          item.includeVatAmount || item.item_grand_total || 0
        );

        totalQtyPrice += total;
        totalDiscount += discount;
        totalTaxable += netAmount;
        grandTotal += includeGst;
      });

      totalQtyPriceVal = totalQtyPrice.toFixed(2);
      totalDiscountVal = totalDiscount.toFixed(2);
      totalTaxableVal = totalTaxable.toFixed(2);
      grandTotalVal = grandTotal.toFixed(2);
    }
  } catch (err) {
    console.error("❌ Failed to fetch company/location details:", err);
  }

  // ========================================================
  // 🔹 DEBUG LOGS
  // ========================================================
  console.log("✅ Company Details:", companyDetails);
  console.log("🏠 Company Address:", companyAddress);
  console.log("📍 Location Details:", locationDetails);

  // ========================================================
  // 🔹 PDF CREATION START
  // ========================================================
  const customer = pdfData.vendor_details;
  const items = pdfData.grn_details;
  const doc = new jsPDF("p", "mm", "a4");

  // -------------------------------
  // HEADER + LOGO
  // -------------------------------
  doc.setFillColor(235, 235, 235);
  doc.ellipse(210, -15, 140, 60, "F");

  if (companyDetails.company_logo) {
    try {
      const logoUrl = `${constantApi.imageUrl}/logos/${companyDetails.company_logo}`;
      const logoBase64 = await toBase64(logoUrl);
      doc.addImage(logoBase64, "PNG", 12, 12, 25, 20);
    } catch (err) {
      console.warn("⚠️ Failed to load company logo:", err);
    }
  } else {
    // No company logo, use default imported logo
    const defaultLogoBase64 = await toBase64(logo);
    doc.addImage(defaultLogoBase64, "PNG", 12, 12, 25, 20);
  }

  // ========================================================
  // 🔹 COMPANY DETAILS (RIGHT SIDE)
  // ========================================================
  let startX = 150;
  let startY = 15;
  const lineHeight = 6;

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`${companyDetails?.company_name || "Company Name"}`, startX, startY);

  // Normal text for details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // Location
  const locationText = doc.splitTextToSize(
    `${locationDetails?.location_name || "Location Name"}`,
    48
  );
  doc.text(locationText, startX, startY + lineHeight);

  let currentY =
    startY + lineHeight + (locationText.length - 1) * lineHeight + lineHeight;

  // Company Address details
  doc.text(`Address: ${companyAddress?.address_name || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Phone: ${companyAddress?.contact_no || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Email: ${companyAddress?.email || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`Tax No: ${locationDetails?.ctaxnumber || "-"}`, startX, currentY);
  currentY += lineHeight;
  doc.text(`License: ${locationDetails?.clicense || "-"}`, startX, currentY);

  // ========================================================
  // 🔹 VENDOR DETAILS (LEFT SIDE)
  // ========================================================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let custStartY = 50;

  doc.text(
    `Company: ${pdfData?.vendor_details?.company_name || ""}`,
    15,
    custStartY
  );
  doc.text(
    `Tax Number: ${pdfData?.vendor_details?.import_license_no || ""}`,
    15,
    custStartY + 6
  );
  doc.text(
    `Vendor: ${pdfData?.vendor_details?.firstname || ""}`,
    15,
    custStartY + 12
  );
  doc.text(
    `Mobile No: ${pdfData?.vendor_details?.VendorMobileNumber || ""}`,
    15,
    custStartY + 18
  );
  doc.text(
    `Email: ${pdfData?.vendor_details?.VendorEmail || ""}`,
    15,
    custStartY + 24
  );

  // ========================================================
  // 🔹 TITLE + DATES
  // ========================================================
  doc.setFontSize(14);
  doc.setTextColor(23, 162, 184);
  doc.setFont("helvetica", "bold");
  doc.text(`GRN Order ${pdfData.grn_number}`, 140, 57);

  doc.setDrawColor(180);
  doc.roundedRect(140, 60, 60, 16, 2, 2);
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("GRN Date", 144, 66);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 144, 69);
  doc.text("Due Date", 170, 66);
  doc.text(moment(pdfData.created_at).format("DD/MM/YYYY"), 170, 69);

  // ========================================================
  // 🔹 ITEMS TABLE
  // ========================================================
  doc.autoTable({
    startY: 80,
    head: [
      [
        "Sr No",
        "Code",
        "Description",
        "Qty",
        "Unit Price",
        "Total",
        "Discount",
        "Sub Total",
        "GST Amount",
        "Grand Amount",
      ],
    ],
    body: items.map((item, index) => {
      const qty = parseFloat(item.item_qty || 0);
      const unitPrice = parseFloat(item.item_gross || 0);
      // const unitPrice = parseFloat(item.item_price || 0);
      const total = qty * unitPrice;
      let discount = 0;
      if (item.discounttype === "Percentage") {
        discount = (total * parseFloat(item.item_discount_amount || 0)) / 100;
      } else {
        discount = parseFloat(item.item_discount_amount || 0);
      }
      // const discount = parseFloat(item.item_discount_amount || 0);
      const netAmount = parseFloat(item.item_net || 0);
      // const netAmount = total - discount;

      const gstAmount = parseFloat(item.vatAmount || item.taxa_ble || 0);
      const includeGst = parseFloat(
        item.includeVatAmount || item.item_grand_total || 0
      );

      return [
        index + 1,
        item.itemLocationModel?.item_code || "-",
        item.itemLocationModel?.itemdesc ||
          item.itemLocationModel?.item_name ||
          "",
        qty.toFixed(2),
        unitPrice.toFixed(2),
        total.toFixed(2),
        discount.toFixed(2),
        netAmount.toFixed(2),
        gstAmount.toFixed(2),
        includeGst.toFixed(2),
      ];
    }),
  });

  // ========================================================
  // 🔹 FOOTER + TOTALS
  // ========================================================
  const afterTableY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text("Payment terms: Immediate Payment", 12, afterTableY);

  const boxY = afterTableY + 10;
  doc.setDrawColor(180);
  doc.rect(120, boxY, 80, 35);
  doc.setFontSize(9);
  doc.setTextColor(0);

  doc.text("Total (Qty x Price)", 122, boxY + 6);
  doc.text(`${totalQtyPriceVal}`, 185, boxY + 6, { align: "right" });
  doc.text("Total Discount", 122, boxY + 12);
  doc.text(`${totalDiscountVal}`, 185, boxY + 12, { align: "right" });
  doc.text("Subtotal", 122, boxY + 18);
  doc.text(`${totalTaxableVal}`, 185, boxY + 18, { align: "right" });
  doc.text("GST", 122, boxY + 24);
  doc.text(`${(grandTotalVal - totalTaxableVal).toFixed(2)}`, 185, boxY + 24, {
    align: "right",
  });

  doc.setFillColor(23, 162, 184);
  doc.setTextColor(255);
  doc.rect(120, boxY + 26, 80, 9, "F");
  doc.text("Grand Total", 122, boxY + 33);
  doc.text(`${grandTotalVal}`, 185, boxY + 33, { align: "right" });

  // ========================================================
  // 🔹 SIGNATURE + FOOTER
  // ========================================================
  doc.setDrawColor(0);
  doc.rect(160, 260, 40, 20);
  doc.text("Signature", 165, 275);

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`${customer?.email || ""}`, 12, 290);
  doc.text("Page 1 / 1", 200, 290, { align: "right" });

  // ========================================================
  // 🔹 SAVE PDF
  // ========================================================
  doc.save(`GRNOrder_${pdfData.grn_number}.pdf`);
};
