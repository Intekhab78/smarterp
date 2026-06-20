import React, { createContext, useContext, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 🔥 YOU FORGOT THIS
const ReceiptContext = createContext();

export const ReceiptProvider = ({ children }) => {
  const [receipt, setReceipt] = useState(null);
  const receiptRef = useRef(null);

  const generateReceipt = async () => {
    const input = receiptRef.current;
    if (!input) return;

    input.style.visibility = "visible";

    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pxToMm = (px) => (px * 25.4) / 96;
    const pdfWidth = 72;

    const imgWidthMm = pxToMm(canvas.width);
    const imgHeightMm = pxToMm(canvas.height);
    const scale = pdfWidth / imgWidthMm;
    const pdfHeight = imgHeightMm * scale;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.autoPrint();

    const blobUrl = pdf.output("bloburl");
    window.open(blobUrl, "_blank");

    input.style.visibility = "hidden";
  };

  return (
    <ReceiptContext.Provider
      value={{ receipt, setReceipt, receiptRef, generateReceipt }}
    >
      {children}
    </ReceiptContext.Provider>
  );
};

// 🔥 YOU ALSO FORGOT THIS
export const useReceipt = () => useContext(ReceiptContext);
