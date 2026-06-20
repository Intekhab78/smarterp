import jsPDF from "jspdf";
import logo from "../assets/images/logo1.png"; // manual logo
const numberToWords = (num) => {
    const a = [
        "", "One", "Two", "Three", "Four", "Five", "Six",
        "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
        "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"
    ];

    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const inWords = (n) => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
        if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + (n % 100 ? inWords(n % 100) : "");
        if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand " + (n % 1000 ? inWords(n % 1000) : "");
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh " + (n % 100000 ? inWords(n % 100000) : "");
        return "";
    };

    return inWords(Math.floor(num)).trim() + " Rupees Only";
};

export const generateInvoicePDF = (invoiceData, companyData) => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 20;
    let y = 16;

    /* ================= HEADER ================= */
    /* ================= HEADER ================= */

    /* ================= HEADER (MATCH IMAGE) ================= */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(companyData?.name || "Maktaba Shah Walilullah", marginX, y);

    /* LOGO RIGHT */
    const logoW = 22;
    const logoH = 22;
    const logoX = pageWidth - marginX - logoW;
    const logoY = y - 3;

    try {
        doc.addImage(logo, "PNG", logoX, logoY, logoW, logoH);
    } catch (e) { }

    // -------- ADDRESS BLOCK --------
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const maxTextWidth = pageWidth - marginX - logoW - 12;

    /* ✅ FORCE 2-LINE ADDRESS */
    let addr = companyData?.address || "";
    let parts = addr.split(",").map(s => s.trim());

    let line1 = "";
    let line2 = "";

    /* balance text into 2 lines */
    parts.forEach((p) => {
        if ((line1 + p).length < (addr.length / 2)) {
            line1 += (line1 ? ", " : "") + p;
        } else {
            line2 += (line2 ? ", " : "") + p;
        }
    });

    const addressLines = [line1, line2].filter(Boolean);

    /* OTHER INFO */
    const infoLines = [
        companyData?.location && `Location: ${companyData.location}`, // ✅ ADD
        companyData?.phone && `Phone: ${companyData.phone}`,
        companyData?.email && `Email: ${companyData.email}`,
        companyData?.gst && `GSTIN: ${companyData.gst}`,
    ].filter(Boolean);

    const finalLines = [...addressLines, ...infoLines];

    doc.text(finalLines, marginX, y, { lineHeightFactor: 1.35 });

    /* ALIGN WITH LOGO */
    const textBottom = y + finalLines.length * 4.2;
    const logoBottom = logoY + logoH;
    y = Math.max(textBottom, logoBottom) + 2;

    /* DIVIDER (LIKE IMAGE) */
    doc.setDrawColor(200);
    doc.setLineWidth(0.4);
    doc.line(marginX, y, pageWidth - marginX, y);

    /* GAP AFTER HEADER */
    y += 5;

    /* ================= INVOICE + CUSTOMER INFO ================= */
    /* ================= TOP INFO ROW ================= */

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const topInfoY = y;

    /* LEFT */
    doc.text("Invoice No:", marginX, topInfoY);
    doc.setFont("helvetica", "bold");
    doc.text(`#${invoiceData.number}`, marginX + 30, topInfoY);

    doc.setFont("helvetica", "normal");
    doc.text("Invoice Date:", marginX, topInfoY + 5);
    doc.text(invoiceData.date, marginX + 30, topInfoY + 5);

    /* RIGHT */
    const rightInfoX = pageWidth - marginX - 50;

    doc.text("Order No:", rightInfoX, topInfoY);
    doc.setFont("helvetica", "bold");
    doc.text(invoiceData.orderNo, rightInfoX + 28, topInfoY);

    doc.setFont("helvetica", "normal");
    doc.text("Order Date:", rightInfoX, topInfoY + 5);
    doc.text(invoiceData.date, rightInfoX + 28, topInfoY + 5);

    /* DIVIDER */
    y = topInfoY + 10;
    doc.setDrawColor(220);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 6;

    /* ================= CUSTOMER + SHIPPING ================= */
    /* ================= CUSTOMER & SHIPPING ================= */

    const blockY = y;
    const gap = 10;
    const blockW = (pageWidth - marginX * 2 - gap) / 2;

    /* TITLES */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Customer Details", marginX, blockY);
    doc.text("Shipping Address", marginX + blockW + gap, blockY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    /* CUSTOMER */
    let cy = blockY + 6;
    const cLabelX = marginX;
    const cValueX = marginX + 28;

    const cust = invoiceData.customer || {};

    [
        ["Name", cust.name],
        ["Phone", cust.phone],
        ["Email", cust.email],
        ["Address", cust.address],
    ].forEach(([l, v]) => {
        doc.text(l, cLabelX, cy);
        doc.text(v || "-", cValueX, cy, { maxWidth: blockW - 32 });
        cy += 5;
    });

    /* SHIPPING */
    let sy = blockY + 6;
    const sLabelX = marginX + blockW + gap;
    const sValueX = sLabelX + 28;

    const ship = invoiceData.shipping || {};

    [
        ["Name", ship.name],
        ["Phone", ship.phone],
        ["Address", ship.address],
    ].forEach(([l, v]) => {
        doc.text(l, sLabelX, sy);
        doc.text(v || "-", sValueX, sy, { maxWidth: blockW - 32 });
        sy += 5;
    });

    /* MOVE Y BELOW BOTH */
    y = Math.max(cy, sy) + 4;

    /* DIVIDER */
    doc.setDrawColor(220);
    doc.line(marginX, y, pageWidth - marginX, y);

    /* ================= TABLE ================= */
    /* ================= TABLE ================= */
    /* ================= TABLE ================= */
    y += 4;

    const tableLeft = marginX;
    const tableRight = pageWidth - marginX;
    const tableWidth = tableRight - tableLeft;

    /* ================= COLUMN WIDTHS ================= */
    /* ================= COLUMN WIDTHS (SAFE) ================= */
    const wSr = tableWidth * 0.05;
    const wItem = tableWidth * 0.30;
    const wPrice = tableWidth * 0.09;
    const wQty = tableWidth * 0.06;
    const wAmount = tableWidth * 0.10;
    const wDisc = tableWidth * 0.08;
    const wAfterDisc = tableWidth * 0.11; // Taxable
    const wGST = tableWidth * 0.10;
    const wNet = tableWidth * 0.11;

    /* ================= COLUMN POSITIONS ================= */
    const col = {
        sr: tableLeft,
        item: tableLeft + wSr,
        price: tableLeft + wSr + wItem,
        qty: tableLeft + wSr + wItem + wPrice,
        amount: tableLeft + wSr + wItem + wPrice + wQty,
        disc: tableLeft + wSr + wItem + wPrice + wQty + wAmount,
        afterDisc:
            tableLeft + wSr + wItem + wPrice + wQty + wAmount + wDisc,
        gst:
            tableLeft +
            wSr +
            wItem +
            wPrice +
            wQty +
            wAmount +
            wDisc +
            wAfterDisc,
        net:
            tableLeft +
            wSr +
            wItem +
            wPrice +
            wQty +
            wAmount +
            wDisc +
            wAfterDisc +
            wGST,
        right: tableRight,
    };


    const rowH = 8;

    /* ================= TABLE HEADER ================= */
    const drawTableHeader = () => {
        doc.setFillColor(248, 248, 248);
        doc.rect(tableLeft, y, tableWidth, rowH, "F");
        doc.rect(tableLeft, y, tableWidth, rowH);

        Object.values(col).forEach((x) => {
            if (x !== tableLeft && x !== tableRight) {
                doc.line(x, y, x, y + rowH);
            }
        });

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");

        doc.text("Sr", col.sr + wSr / 2, y + 5.5, { align: "center" });
        doc.text("Item / UPC", col.item + wItem / 2, y + 5.5, { align: "center" });
        doc.text("Price", col.price + wPrice / 2, y + 5.5, { align: "center" });
        doc.text("Qty", col.qty + wQty / 2, y + 5.5, { align: "center" });
        doc.text("Amount", col.amount + wAmount / 2, y + 5.5, { align: "center" });
        doc.text("Disc", col.disc + wDisc / 2, y + 5.5, { align: "center" });

        /* ✅ NEW HEADER */
        doc.text(
            "Total",
            col.afterDisc + wAfterDisc / 2,
            y + 5.5,
            { align: "center" }
        );

        doc.text("GST", col.gst + wGST / 2, y + 5.5, { align: "center" });
        doc.text(
            "Net Amt",
            col.net + (col.right - col.net) / 2,
            y + 5.5,
            { align: "center" }
        );

        doc.setFont("helvetica", "normal");
        y += rowH;
    };

    /* ---------- FIRST HEADER ---------- */
    drawTableHeader();

    /* ================= TOTALS ================= */
    let totalQty = 0,
        totalAmount = 0,
        totalTax = 0,
        totalDiscount = 0,
        totalAfterDisc = 0,
        grandTotal = 0;

    /* ================= ROWS ================= */
    (invoiceData?.items || []).forEach((item, index) => {
        const itemText = `${item.name || ""}\nUPC: ${item.upc || "-"}`;
        const itemLines = doc.splitTextToSize(itemText, wItem - 4);

        const rowHeight = Math.max(rowH, itemLines.length * 5);

        if (y + rowHeight > pageHeight - 90) {
            doc.addPage();
            y = 30;
            drawTableHeader();
        }

        doc.rect(tableLeft, y, tableWidth, rowHeight);

        Object.values(col).forEach((x) => {
            if (x !== tableLeft && x !== tableRight) {
                doc.line(x, y, x, y + rowHeight);
            }
        });

        const price = Number(item.price || 0);
        const qty = Number(item.qty || 1);
        const amount = price * qty;
        const discount = Number(item.discount || 0);
        const taxable = amount - discount; // ✅ after discount
        const tax = Number(item.tax || 0);
        const gstPercent = taxable > 0 ? (tax / taxable) * 100 : 0;
        const net = Number(item.total || taxable + tax);

        doc.text(String(index + 1), col.sr + wSr / 2, y + rowHeight / 2 + 2, { align: "center" });
        doc.text(itemLines, col.item + 2, y + 5);

        doc.text(price.toFixed(2), col.price + wPrice - 3, y + rowHeight / 2 + 2, { align: "right" });
        doc.text(String(qty), col.qty + wQty / 2, y + rowHeight / 2 + 2, { align: "center" });
        doc.text(amount.toFixed(2), col.amount + wAmount - 3, y + rowHeight / 2 + 2, { align: "right" });
        doc.text(discount.toFixed(2), col.disc + wDisc - 3, y + rowHeight / 2 + 2, { align: "right" });

        /* ✅ TAXABLE */
        doc.text(
            taxable.toFixed(2),
            col.afterDisc + wAfterDisc - 3,
            y + rowHeight / 2 + 2,
            { align: "right" }
        );

        doc.text(`${gstPercent.toFixed(0)}%`, col.gst + wGST / 2, y + 4, { align: "center" });
        doc.text(tax.toFixed(2), col.gst + wGST / 2, y + rowHeight - 2, { align: "center" });

        doc.text(net.toFixed(2), col.right - 3, y + rowHeight / 2 + 2, { align: "right" });

        totalQty += qty;
        totalAmount += amount;
        totalDiscount += discount;
        totalAfterDisc += taxable;
        totalTax += tax;
        grandTotal += net;

        y += rowHeight;
    });

    /* ================= TOTAL ROW ================= */

    const gapH = 4;
    doc.rect(tableLeft, y, tableWidth, gapH);
    y += gapH;

    doc.setLineWidth(0.5);
    doc.line(tableLeft, y, tableRight, y);
    doc.setLineWidth(0.2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.line(tableLeft, y, tableLeft, y + rowH);
    doc.line(tableRight, y, tableRight, y + rowH);
    doc.line(tableLeft, y + rowH, tableRight, y + rowH);

    doc.text("TOTAL", col.item + 2, y + rowH / 2 + 2);
    doc.text(String(totalQty), col.qty + wQty / 2, y + rowH / 2 + 2, { align: "center" });

    doc.text(totalAmount.toFixed(2), col.amount + wAmount - 3, y + rowH / 2 + 2, { align: "right" });
    doc.text(totalDiscount.toFixed(2), col.disc + wDisc - 3, y + rowH / 2 + 2, { align: "right" });

    /* ✅ TOTAL AFTER DISCOUNT */
    doc.text(
        totalAfterDisc.toFixed(2),
        col.afterDisc + wAfterDisc - 3,
        y + rowH / 2 + 2,
        { align: "right" }
    );

    doc.text(totalTax.toFixed(2), col.gst + wGST - 3, y + rowH / 2 + 2, { align: "right" });
    doc.text(grandTotal.toFixed(2), col.right - 3, y + rowH / 2 + 2, { align: "right" });

    doc.setFont("helvetica", "normal");
    y += rowH;

    /* ================= TOTAL BOX ================= */
    /* ================= COMPACT TOTAL BOX ================= */

    /* ❌ REMOVE EXTRA GAP */
    y += 4;

    /* smaller width */
    const boxW = 70;
    const boxX = pageWidth - marginX - boxW;

    /* ===== TOTALS ===== */
    const subTotal = totalAmount;
    const discount = totalDiscount;
    const totalAfterDiscount = subTotal - discount;
    const totalGST = totalTax;

    const sgst = totalGST / 2;
    const cgst = totalGST / 2;

    const calculatedTotal = totalAfterDiscount + totalGST;
    const invoiceTotal = Math.round(calculatedTotal);
    const roundOff = invoiceTotal - calculatedTotal;

    /* ===== ROWS ===== */
    const rows = [
        ["Sub Total", subTotal],
        ["Discount", discount],
        ["After Discount", totalAfterDiscount],
        ["SGST", sgst],
        ["CGST", cgst],
        ["Total(Round Off)", invoiceTotal],
    ];

    /* very tight row height */
    const rowH2 = 5;
    const boxH = rows.length * rowH2 + 3;

    /* page break check */
    if (y + boxH > pageHeight - 30) {
        doc.addPage();
        y = 35;
    }

    doc.setDrawColor(180);
    doc.rect(boxX, y, boxW, boxH);

    let ty = y + 6;

    rows.forEach(([label, value]) => {
        const isFinal = label === "Invoice Total";

        doc.setFont("helvetica", isFinal ? "bold" : "normal");
        doc.setFontSize(isFinal ? 8.5 : 7.5);

        doc.text(label, boxX + 3, ty);

        const displayValue =
            label === "Invoice Total"
                ? `Rs. ${invoiceTotal.toFixed(0)}`
                : Number(value).toFixed(2);

        doc.text(displayValue, boxX + boxW - 3, ty, { align: "right" });

        ty += rowH2;
    });

    /* reset */
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    /* ===== AMOUNT IN WORDS ===== */

    const amountInWords = numberToWords(invoiceTotal);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Amount (in words):", marginX, y + boxH + 8);

    doc.setFont("helvetica", "normal");

    const wordsLines = doc.splitTextToSize(
        amountInWords,
        pageWidth - marginX * 2
    );

    doc.text(wordsLines, marginX, y + boxH + 14);

    y = y + boxH + 6 + wordsLines.length * 5;
    /* ===== PAYMENT DETAILS ===== */

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Payment Mode:", marginX, y);

    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.paymentMode || "-", marginX + 30, y);
    /* ================= SIGNATURE ================= */
    /* ===== RIGHT : SIGNATURE ===== */
    y -= 6;
    doc.setFontSize(9);
    doc.text("Digitally Authorised", pageWidth - marginX, y, { align: "right" });

    /* ================= FOOTER ================= */

    doc.setTextColor(160);
    doc.text(
        "Thank you for your purchase!",
        pageWidth / 2,
        pageHeight - 18,
        { align: "center" }
    );
    doc.setTextColor(0);
    /* ===== BOTTOM LEFT NOTE ===== */
    const bottomNoteY = pageHeight - 42;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);

    /* ---- NOTE LABEL ---- */
    doc.text("Note :", marginX, bottomNoteY);

    /* ---- NOTE CONTENT (INDENTED) ---- */
    const noteText = [
        "GST are applicable as per government regulations.",
        "We look forward to serving you again.",
    ];

    const indentX = marginX + 10; // ⬅ space after "Note :"

    doc.text(noteText, indentX, bottomNoteY + 6, {
        maxWidth: pageWidth / 2 - indentX,
        lineHeightFactor: 1.4,
    });

    doc.setTextColor(0);


    /* ================= SAVE ================= */

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
};
