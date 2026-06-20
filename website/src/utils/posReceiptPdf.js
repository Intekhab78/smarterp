import jsPDF from "jspdf";

const safe = (val) => (val ? String(val) : "-");
const money = (val) => Number(val || 0).toFixed(2);

export const generatePosReceiptPDF = (order, companyData, options = {}) => {
  if (!order) return;

  const items = order?.items || [];
  const itemsSubtotal = items.reduce(
    (sum, it) =>
      sum +
      Number(it.price || 0) * Number(it.quantity || 0) -
      Number(it.discount || 0),
    0
  );
  const itemsTax = items.reduce(
    (sum, it) => sum + Number(it.tax_amount || 0),
    0
  );
  const itemsTotal = items.reduce(
    (sum, it) => sum + Number(it.total || 0),
    0
  );
  const itemsDiscount = items.reduce(
    (sum, it) => sum + Number(it.discount || 0),
    0
  );

  const subtotal = Number(order?.taxable_total || order?.sub_total || itemsSubtotal);
  const taxTotal = Number(order?.tax_total || itemsTax || Math.max(0, itemsTotal - itemsSubtotal));
  const discount = Number(order?.discount_total || itemsDiscount);
  const grandTotal = Number(
    order?.total || itemsTotal || subtotal + taxTotal - discount
  );
  const cgst = Number(order?.cgst ?? taxTotal / 2);
  const sgst = Number(order?.sgst ?? taxTotal / 2);

  const PAGE_WIDTH = 80;
  const left = 3;
  const right = PAGE_WIDTH - 3;
  const contentWidth = right - left;

  const xItem = left;
  const totalRight = right;
  const colGap = 2;
  const totalColWidth = 10;
  const discColWidth = 8;
  const qtyColWidth = 6;
  const priceColWidth = 9;
  const discRight = totalRight - totalColWidth - colGap;
  const qtyRight = discRight - discColWidth - colGap;
  const priceRight = qtyRight - qtyColWidth - colGap;
  const priceLeft = priceRight - priceColWidth;
  const itemWidth = Math.max(10, priceLeft - xItem - colGap);
  const maxItemLines = 4;

  const measureDoc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [PAGE_WIDTH, 200],
  });
  let measuredY = 4;
  const measureCenter = (size = 9.5) => {
    measuredY += size >= 9.5 ? 4.2 : 3.6;
  };
  const measureLine = () => {
    measuredY += 3;
  };
  const measureWrapped = (text, size = 8) => {
    measureDoc.setFont("courier", "normal");
    measureDoc.setFontSize(size);
    const lines = measureDoc.splitTextToSize(text, contentWidth);
    measuredY += lines.length * 4;
  };

  /* MEASURE HEADER */
  measureCenter(9.5);
  measureWrapped(safe(companyData?.company_address?.[0]?.address1 || companyData?.address || ""), 8);
  measureWrapped(`Contact: ${safe(companyData?.company_address?.[0]?.contact_no || companyData?.phone)}`, 8);
  measureWrapped(`Email: ${safe(companyData?.company_address?.[0]?.email || companyData?.email)}`, 8);
  measureWrapped(`GSTIN: ${safe(companyData?.ctaxnumber || companyData?.gst)}`, 8);
  measureLine();
  measureCenter(8.5);
  measureLine();
  measuredY += 4.2 * 3;
  measureLine();
  measuredY += 4.2;
  measureLine();

  /* MEASURE TABLE */
  measuredY += 3.8;
  measureLine();

  const itemLineHeight = 3.6;
  items.forEach((item) => {
    const name = safe(item?.name);
    const upcVal = item?.upc && item?.upc !== "-" ? item.upc : "";
    const upcLine = upcVal ? `UPC: ${safe(upcVal)}` : "";
    measureDoc.setFont("courier", "normal");
    measureDoc.setFontSize(7.2);
    let nameLines = measureDoc.splitTextToSize(name, itemWidth);
    if (nameLines.length > maxItemLines) {
      nameLines = nameLines.slice(0, maxItemLines);
    }
    const rowHeight =
      nameLines.length * itemLineHeight + (upcLine ? itemLineHeight : 0);
    measuredY += Math.max(rowHeight, 4.2);
  });
  measureLine();

  /* MEASURE TOTALS */
  measuredY += 3.8 * 3;
  measureLine();
  measuredY += 3.8;
  measureLine();
  measureCenter(8);
  measuredY += 3.6;
  measuredY += 4;
  measureLine();
  measureCenter(7);
  measureCenter(6.5);

  const height = Math.max(120, Math.ceil(measuredY + 4));

  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [PAGE_WIDTH, height],
  });

  const pageWidth = PAGE_WIDTH;

  let y = 4;

  const centerText = (text, size = 9.5, style = "bold") => {
    doc.setFont("courier", style);
    doc.setFontSize(size);
    doc.text(text, pageWidth / 2, y, { align: "center" });
    y += size >= 9.5 ? 4.2 : 3.6;
  };

  const line = () => {
    doc.setDrawColor(180);
    doc.setLineWidth(0.2);
    doc.line(left, y, right, y);
    y += 3;
  };

  const writeWrapped = (text, size = 8, style = "normal") => {
    doc.setFont("courier", style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, pageWidth / 2, y, { align: "center" });
    y += lines.length * 4;
  };

  /* HEADER */
  centerText(safe(companyData?.compdesc || companyData?.name || "IslamicBookZone"), 9.5, "bold");
  writeWrapped(safe(companyData?.company_address?.[0]?.address1 || companyData?.address || ""), 8);
  writeWrapped(`Contact: ${safe(companyData?.company_address?.[0]?.contact_no || companyData?.phone)}`, 8);
  writeWrapped(`Email: ${safe(companyData?.company_address?.[0]?.email || companyData?.email)}`, 8);
  writeWrapped(`GSTIN: ${safe(companyData?.ctaxnumber || companyData?.gst)}`, 8);

  line();
  centerText("TAX INVOICE", 8.5, "bold");
  line();

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text(`INV No : ${safe(order?.invoice_no || order?.invoice_number || order?.id)}`, left, y);
  y += 4.2;
  doc.text(
    `Date : ${order?.created_at ? new Date(order.created_at).toLocaleString() : "-"}`,
    left,
    y
  );
  y += 4.2;
  doc.text(`Cashier : ${safe(order?.cashier_name)}`, left, y);
  y += 4.2;

  line();
  doc.text(`Customer : ${safe(order?.customer?.name)}`, left, y);
  y += 4.2;
  line();

  /* TABLE HEADER */

  doc.setFont("courier", "bold");
  doc.setFontSize(7.5);
  doc.text("Item/UPC", xItem, y);
  doc.text("Price", priceRight, y, { align: "right" });
  doc.text("Qty", qtyRight, y, { align: "right" });
  doc.text("Disc", discRight, y, { align: "right" });
  doc.text("Total", totalRight, y, { align: "right" });
  y += 3.8;
  line();

  /* ITEMS */
  const wrapToWidth = (text, maxWidth, fontSize = 7.2, maxLines = maxItemLines) => {
    doc.setFont("courier", "normal");
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    if (lines.length <= maxLines) return lines;

    const ellipsis = "...";
    const clipped = lines.slice(0, maxLines);
    let last = clipped[maxLines - 1];
    while (last.length > 1 && doc.getTextWidth(last + ellipsis) > maxWidth) {
      last = last.slice(0, -1);
    }
    clipped[maxLines - 1] = last + ellipsis;
    return clipped;
  };

  doc.setFont("courier", "normal");
  doc.setFontSize(7.2);
  items.forEach((item) => {
    const name = safe(item?.name);
    const upcVal = item?.upc && item?.upc !== "-" ? item.upc : "";
    const upcLine = upcVal ? `UPC: ${safe(upcVal)}` : "";
    const nameLines = wrapToWidth(name, itemWidth, 7.2, maxItemLines);
    const lineHeight = 3.6;
    nameLines.forEach((lineText, index) => {
      doc.text(lineText, xItem, y + index * lineHeight);
    });

    if (upcLine) {
      doc.setFontSize(6.5);
      doc.text(upcLine, xItem, y + nameLines.length * lineHeight);
      doc.setFontSize(7.2);
    }

    doc.text(money(item?.price), priceRight, y, { align: "right" });
    doc.text(String(item?.quantity ?? "-"), qtyRight, y, { align: "right" });
    doc.text(money(item?.discount), discRight, y, { align: "right" });
    doc.text(money(item?.total), totalRight, y, { align: "right" });

    const rowHeight =
      nameLines.length * lineHeight + (upcLine ? lineHeight : 0);
    y += Math.max(rowHeight, 4.2);
  });

  line();

  /* TOTALS */
  const writeTotal = (label, value, bold = false) => {
    doc.setFont("courier", bold ? "bold" : "normal");
    doc.text(label, left, y);
    doc.text(money(value), right, y, { align: "right" });
    y += 3.8;
  };

  writeTotal("Subtotal", subtotal);
  writeTotal("Total Tax", taxTotal);
  writeTotal("Total Discount", discount);

  const gstPercent =
    subtotal > 0 ? ((taxTotal / subtotal) * 100).toFixed(2) : "0.00";
  const cgstPercent = (gstPercent / 2).toFixed(2);
  const sgstPercent = (gstPercent / 2).toFixed(2);

  line();
  writeTotal("Grand Total", grandTotal, true);
  line();

  /* TAX SUMMARY */
  centerText("Tax Summary", 8, "bold");
  doc.setFont("courier", "bold");
  doc.setFontSize(7);
  const taxGap = 2;
  const taxCols = [
    { label: "Taxable", width: 16, align: "left" },
    { label: "CGST%", width: 10, align: "right" },
    { label: "Amt", width: 8, align: "right" },
    { label: "SGST%", width: 10, align: "right" },
    { label: "Amt", width: 8, align: "right" },
  ];
  const taxTableWidth =
    taxCols.reduce((sum, col) => sum + col.width, 0) +
    taxGap * (taxCols.length - 1);
  const taxStartX = Math.max(left, (pageWidth - taxTableWidth) / 2);

  let tx = taxStartX;
  taxCols.forEach((col) => {
    const x = col.align === "right" ? tx + col.width : tx;
    doc.text(col.label, x, y, { align: col.align });
    tx += col.width + taxGap;
  });
  y += 3.6;

  doc.setFont("courier", "normal");
  const taxValues = [
    money(subtotal),
    `${cgstPercent}%`,
    money(cgst),
    `${sgstPercent}%`,
    money(sgst),
  ];
  tx = taxStartX;
  taxCols.forEach((col, idx) => {
    const x = col.align === "right" ? tx + col.width : tx;
    doc.text(taxValues[idx], x, y, { align: col.align });
    tx += col.width + taxGap;
  });
  y += 4;

  line();
  centerText("Thank you for shopping!", 7, "normal");
  centerText("Goods once sold will not be taken back.", 6.5, "normal");

  const action = options?.action || "open";
  const rawName =
    options?.fileName ||
    `receipt-${
      order?.invoice_no ||
      order?.invoice_number ||
      order?.order_number ||
      order?.id ||
      "pos"
    }.pdf`;
  const safeName = rawName
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-");

  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);
  const cleanup = () => {
    URL.revokeObjectURL(blobUrl);
  };

  if (action === "download") {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(cleanup, 1000);
    return;
  }

  if (action === "print") {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = blobUrl;
    iframe.onload = () => {
      const win = iframe.contentWindow;
      if (win) {
        const prevAfterPrint = win.onafterprint;
        if (typeof options?.onAfterPrint === "function") {
          win.onafterprint = () => {
            options.onAfterPrint();
            win.onafterprint = prevAfterPrint || null;
            iframe.remove();
            cleanup();
          };
        }
        win.focus();
        win.print();
      }
      setTimeout(() => {
        iframe.remove();
        cleanup();
      }, 5000);
    };
    document.body.appendChild(iframe);
    return;
  }

  window.open(blobUrl, "_blank");
  setTimeout(cleanup, 1000);
};






