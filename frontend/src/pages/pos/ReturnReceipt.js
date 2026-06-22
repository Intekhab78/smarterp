import React, { forwardRef } from "react";
import Barcode from "react-barcode"; // make sure you have this installed

const ReturnReceipt = forwardRef(
  (
    {
      companyName,
      locationName,
      CreateInvoiceNumber,
      formData2,
      dispalyName,
      receiptItems,
      receiptData,
      exchange,
      totalVat,
      mode,
    },
    ref
  ) => {
    console.log("receiptItems--------------", receiptItems);
    console.log("mode is --------------", mode);

    return (
      <div>
        <div className="receipt receipt-offscreen" ref={ref}>
          <p className="center">{companyName}</p>
          <p className="center">{locationName}</p>
          <p className="center">
            <strong>TAX INVOICE</strong>
          </p>
          <p className="center">
            <strong>{mode}</strong>
          </p>
          <p className="center">{CreateInvoiceNumber}</p>
          <hr />

          <p>Cashier: {formData2.salesman_id || "168143"}</p>
          <p>
            Date :{" "}
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

          {/* ✅ Customer Details */}
          {Object.keys(dispalyName).length > 0 ? (
            <div>
              <p>
                <span>Customer:</span> {dispalyName.first_name}{" "}
                {dispalyName.last_name}
              </p>
              <p>
                <span>Phone:</span> {dispalyName.phone}
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

          {/* ✅ Table */}
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Disc.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {receiptItems?.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_name}</td>
                  <td>{item.price}</td>
                  <td>{item.item_qty}</td>
                  <td>{item.discount}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tbody>
              {receiptItems?.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemName}</td>
                  <td>{item.price}</td>
                  <td>{item.qty}</td>
                  <td>
                    {(
                      item.price * item.qty -
                      item.finalTotalItem * item.qty
                    ).toFixed(2)}
                  </td>
                  <td>{(item.finalTotalItem * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          <p>
            Number of Items Sold:{" "}
            {receiptItems?.reduce((a, b) => a + b.quantity, 0)}
          </p>
          <hr />

          {/* ✅ Totals */}
          <div className="total-line">
            <span>Total Before Discount:</span>
            <span>
              <strong>AED {receiptData.totalBeforeDiscount}</strong>
            </span>
          </div>
          <div className="total-line">
            <span>Total Discount:</span>
            <span>
              <strong>AED {receiptData.totalDiscount}</strong>
            </span>
          </div>

          <hr />

          <div className="total-line">
            <span>Subtotal:</span>
            <span>
              <strong>AED {receiptData.totalAfterDiscount}</strong>
            </span>
          </div>
          <div className="total-line">
            <span>Receipt Discount:</span>
            <span>
              <strong>AED {receiptData.discountAmount}</strong>
            </span>
          </div>
          <hr />

          <div className="total-line">
            <span>Grand Total:</span>
            <span>
              <strong>AED {receiptData.finalTotal}</strong>
            </span>
          </div>
          <hr />

          <div className="total-line">
            <span>VAT :</span>
            <span>
              <strong>
                AED{" "}
                {mode === "Return"
                  ? receiptData.taxa_ble
                  : (receiptData.finalTotalWithVat ?? 0).toFixed(2) -
                    receiptData.finalTotal}{" "}
              </strong>
            </span>
          </div>

          <div className="total-line">
            <span>Total Tender:</span>
            <span>
              <strong>
                AED {(receiptData.finalTotalWithVat ?? 0).toFixed(2)}
              </strong>
            </span>
          </div>
          <hr />

          {/* ✅ Payments */}
          {receiptData.payments?.map((p, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-gray-800">
                <span>
                  {p.method}
                  {p.cardType ? ` (${p.cardType})` : ""}
                </span>
                <div className="flex items-center gap-2">
                  <span>{p.amount}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center text-gray-800">
            {exchange > 0 && <span>Exchange:</span>}
            <div className="flex items-center gap-2">
              <span>{exchange > 0 && exchange.toFixed(2)}</span>
            </div>
          </div>
          <hr />

          {/* ✅ Footer */}
          <p className="center text-center">Thank you for shopping!</p>
          <hr />
          <p className="center text-center">
            <strong> Terms & Conditions:</strong>
          </p>
          <h3 className="center text-center">
            OUR TRADING HOURS ARE 10:00AM TO 10:00PM
          </h3>
          <p className="center text-center font-thin">
            Exchange within 15 days of purchase with proof of a Receipt. Sale
            items cannot be credited or refunded. For hygienic reasons swimwear
            and under garment items cannot be exchanged or refunded. No Refund
            will be made if you change your mind after the purchase. Refunds or
            exchanges will be made if the product purchased is defective or
            counterfeit. Free Items cannot be exchanged/Refund/Credited.
          </p>

          {/* ✅ Barcode */}
          <div className="barcode flex flex-col items-center justify-center text-center">
            <Barcode
              value={CreateInvoiceNumber}
              width={1}
              height={40}
              fontSize={12}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default ReturnReceipt;
