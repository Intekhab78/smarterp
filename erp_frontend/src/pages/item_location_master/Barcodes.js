import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useEffect } from "react";
import Barcode from "react-barcode";

const BarcodeLabel = () => {
  const barcodeValue = "1234567890";

  return (
    <DashboardLayout>
      <style>
        {`
          /* FORCE PAGE SIZE */
          @page {
            size: 2in 1in;
            margin: 0;
          }

          @media print {
            html, body {
              width: 2in;
              height: 1in;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }

            .print-btn {
              display: none;
            }
          }

          body {
            margin: 0;
          }

          .label {
            width: 2in;
            height: 1in;
            display: flex;
            align-items: center;
            justify-content: center;
            page-break-after: avoid;
            page-break-before: avoid;
          }
        `}
      </style>

      <div className="label">
        <Barcode
          value={barcodeValue}
          format="CODE128"
          width={1.2}
          height={40}
          displayValue={true}
          fontSize={10}
        />
      </div>

      <button className="print-btn" onClick={() => window.print()}>
        Print
      </button>
    </DashboardLayout>
  );
};

export default BarcodeLabel;
