import React, { forwardRef } from "react";

const KitchenReceipt = forwardRef(
  (
    {
      companyName,
      locationName,
      CreateInvoiceNumber,
      formData2,
      dispalyName,
      receiptItems,
    },
    ref
  ) => {
    return (
      <div className="receipt receipt-offscreen" ref={ref}>
        {/* Header */}
        <p className="center">{companyName || "Kannur Tea"}</p>
        <p className="center">{locationName || "Ground Floor"}</p>
        <p className="center">TIME SQUARE CENTRE</p>
        <p className="center">customercare@adventurehq.ae</p>

        <p className="center">
          <strong>KITCHEN ORDER</strong>
        </p>
        <p className="center">{CreateInvoiceNumber}</p>
        <hr />

        <p>Cashier: {formData2?.salesman_id || "168143"}</p>
        <p>
          Date:{" "}
          {new Date().toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          })}
        </p>

        {/* Customer Info */}
        {Object.keys(dispalyName || {}).length > 0 ? (
          <div>
            <p>
              <span>Customer:</span> {dispalyName.firstname}{" "}
              {dispalyName.lastname}
            </p>
            <p>
              <span>Phone:</span> {dispalyName.mobile}
            </p>
          </div>
        ) : (
          <div>
            <p>
              <span>Customer:</span> Walking Customer
            </p>
          </div>
        )}
        <hr />

        {/* Item List */}
        <div className="w-full">
          <div className="flex justify-between font-bold border-b border-gray-300 py-1 text-sm">
            <span>Item</span>
            <span>Qty</span>
          </div>

          {receiptItems?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-dashed border-gray-300 py-1 text-sm"
            >
              <span className="w-3/4 break-words">{item.itemName}</span>
              <span className="w-1/4 text-right">{item.qty}</span>
            </div>
          ))}
        </div>

        <hr />
        <p>
          Number of Items to prepare:{" "}
          {receiptItems?.reduce((a, b) => a + b.qty, 0)}
        </p>
        <hr />
      </div>
    );
  }
);

export default KitchenReceipt;
