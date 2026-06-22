import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "./logo.png"; // your hospital logo (light version preferred)

export default function BeautifulMedicalInvoice() {
  const invoiceData = {
    invoiceNo: "MED/0258/25",
    invoiceDate: "10/06/2025",
    dueDate: "10/15/2025",
    doctor: {
      name: "Dr. Arjun Mehta (MBBS, MD)",
      specialization: "Cardiology Specialist",
      hospital: "MaxCare Multispeciality Hospital",
      address: "45 Sunrise Ave, Delhi, India",
      email: "info@maxcarehospital.in",
      phone: "+91 98231 45678",
    },
    patient: {
      name: "Mr. Abdul Khan",
      age: "42",
      gender: "Male",
      address: "Plot 22, Corporate Tower, Mumbai",
      email: "abdul.khan@gmail.com",
      phone: "+91 91234 56780",
    },
    services: [
      { description: "Consultation Fees", qty: 1, price: 1200 },
      { description: "ECG Test", qty: 1, price: 600 },
      { description: "Blood Test", qty: 1, price: 800 },
      { description: "X-Ray", qty: 1, price: 1000 },
      { description: "Medication Charges", qty: 1, price: 1500 },
    ],
    payment: {
      mode: "UPI / Credit / Debit / Cash",
      terms: "Payment due within 7 days of invoice date.",
    },
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // === Function: Watermark on all pages ===
    const addWatermark = () => {
      doc.setGState(new doc.GState({ opacity: 0.08 }));
      doc.addImage(logo, "PNG", pageWidth / 2 - 45, pageHeight / 2 - 45, 90, 90);
      doc.setGState(new doc.GState({ opacity: 1 }));
    };

    // === Add watermark before each page render ===
    addWatermark();

    // === Header ===
    doc.setFillColor(230, 245, 255);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.addImage(logo, "PNG", 15, 8, 25, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(invoiceData.doctor.hospital, pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.doctor.address, pageWidth / 2, 21, { align: "center" });
    doc.text(`${invoiceData.doctor.email} | ${invoiceData.doctor.phone}`, pageWidth / 2, 27, { align: "center" });

    // === Title ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text("Medical Invoice", pageWidth / 2, 45, { align: "center" });

    // === Invoice Info ===
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoiceData.invoiceNo}`, 15, 55);
    doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, 15, 61);
    doc.text(`Due Date: ${invoiceData.dueDate}`, 15, 67);

    // === Boxes ===
    doc.setDrawColor(180, 200, 255);
    doc.setFillColor(248, 250, 255);
    doc.roundedRect(12, 75, 88, 40, 3, 3, "FD");
    doc.roundedRect(110, 75, 88, 40, 3, 3, "FD");

    // Doctor Box
    doc.setFont("helvetica", "bold");
    doc.text("Doctor Details", 15, 82);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.doctor.name, 15, 89);
    doc.text(invoiceData.doctor.specialization, 15, 95);
    doc.text(invoiceData.doctor.email, 15, 101);
    doc.text(invoiceData.doctor.phone, 15, 107);

    // Patient Box
    doc.setFont("helvetica", "bold");
    doc.text("Patient Details", 113, 82);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.patient.name, 113, 89);
    doc.text(`Age: ${invoiceData.patient.age}   Gender: ${invoiceData.patient.gender}`, 113, 95);
    doc.text(invoiceData.patient.address, 113, 101);
    doc.text(invoiceData.patient.phone, 113, 107);

    // === Services Table ===
    const tableColumn = ["Service Description", "Qty", "Price (₹)", "Total (₹)"];
    const tableRows = [];
    let totalAmount = 0;

    invoiceData.services.forEach((item) => {
      const total = item.qty * item.price;
      totalAmount += total;
      tableRows.push([item.description, item.qty, item.price, total]);
    });

    doc.autoTable({
      startY: 125,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      styles: { fontSize: 10, halign: "center", cellPadding: 3 },
      headStyles: { fillColor: [120, 180, 255], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 250, 255] },
    });

    // === Totals ===
    const finalY = doc.lastAutoTable.finalY + 10;
    const gst = totalAmount * 0.05;
    const grandTotal = totalAmount + gst;

    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 140, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(`₹ ${totalAmount.toLocaleString()}`, 190, finalY, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text("GST (5%):", 140, finalY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(`₹ ${gst.toFixed(2)}`, 190, finalY + 6, { align: "right" });

    doc.line(130, finalY + 10, 200, finalY + 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 140, finalY + 15);
    doc.text(`₹ ${grandTotal.toLocaleString()}`, 190, finalY + 15, { align: "right" });

    // === Payment Info ===
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Payment Mode: ${invoiceData.payment.mode}`, 15, finalY + 25);
    doc.text(`Note: ${invoiceData.payment.terms}`, 15, finalY + 31);

    // === Signature Area ===
    doc.line(150, 260, 200, 260);
    doc.text("Doctor’s Signature", 175, 265, { align: "center" });

    // === Footer ===
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Thank you for visiting MaxCare Hospital.", pageWidth / 2, 285, { align: "center" });
    doc.text("We wish you good health and happiness.", pageWidth / 2, 290, { align: "center" });

    doc.save("MaxCare_Medical_Invoice.pdf");
  };

  return (
    <div className="p-8 flex justify-center">
      <button
        onClick={generatePDF}
        className="px-6 py-3 bg-blue-600 text-white text-sm rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        💙 Download Beautiful Medical Invoice
      </button>
    </div>
  );
}
