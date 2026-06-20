import constantApi from "constantApi";
import React, { forwardRef } from "react";
import Barcode from "react-barcode"; // make sure you have this installed

const Receipt = forwardRef(
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
    // console.log("dispalyName is --------------", dispalyName);
    // console.log("formData2 is --------------", formData2);
    // console.log("companyName is --------------", companyName);
    // console.log("locationName is --------------", locationName);
    // console.log("CreateInvoiceNumber is --------------", CreateInvoiceNumber);

    return (
      <div>
        <div className="receipt receipt-offscreen" ref={ref}>
          {/* Header with Logo + Company Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              marginBottom: "8px",
            }}
          >
            {/* LEFT SMALL LOGO */}
            {companyName?.clogo && (
              <img
                src={`${constantApi.imageUrl}/logos/${companyName.clogo}`}
                alt="logo"
                style={{
                  width: "40px", // smaller logo
                  height: "40px",
                  position: "absolute",
                  left: "0",
                  top: "0",
                }}
              />
            )}

            {/* CENTER TEXT */}
            <div style={{ textAlign: "center" }}>
              <p>{companyName?.compdesc}</p>
              {/* <p>{locationName?.location_address[0]?.address}</p>
              <p>
                {locationName?.location_address[0]?.email}{" "}
                {locationName?.location_address[0]?.contact_no}
              </p> */}
              {/* <p>{locationName?.location?.locname}</p> */}
              {/* <p>
                {locationName?.location_address[0]?.email}{" "}
                {locationName?.location_address[0]?.contact_no}
              </p> */}
              {locationName && (
                <>
                  <p>{locationName?.location?.locname}</p>
                  <p>License No - {locationName?.location?.clicense}</p>
                  <p>Tax No - {locationName?.location?.ctaxnumber}</p>
                </>
              )}
              {/* {locationName && (
                <>
                  <p>{locationName.locname}</p>
                  <p>License No - {locationName.clicense}</p>
                  <p>Tax No - {locationName.ctaxnumber}</p>
                </>
              )} */}
            </div>
          </div>
          <p className="center">
            <strong>TAX INVOICE</strong>
          </p>
          <p className="center">
            <strong>{mode}</strong>
          </p>
          <p className="center">INV No - {CreateInvoiceNumber}</p>
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
              <p>
                <span>Tax No:</span> {dispalyName.gst_number}
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
              {/* FULL WIDTH LINE */}
              <tr>
                <td
                  colSpan="5"
                  style={{
                    borderBottom: "1px solid #000",
                    width: "100%",
                    padding: 0,
                    height: "4px", // ← gap ABOVE the line
                  }}
                ></td>
              </tr>
              {/* spacer */}
            </thead>
            {mode === "Return" ? (
              <tbody className="mt-4">
                {receiptItems?.map((item, index) => {
                  const price = parseFloat(item.price) || 0;
                  const qty = parseFloat(item.item_qty || item.quantity) || 0;
                  const discount = parseFloat(item.discount) || 0;
                  const lineTotal = price * qty - discount;

                  return (
                    <tr key={index}>
                      <td>{item.item_name}</td>
                      <td>{Number(price).toFixed(2)}</td>
                      <td>{qty}</td>
                      <td>{Number(discount).toFixed(2)}</td>
                      <td>{Number(lineTotal).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody className="mt-4">
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
            )}
          </table>

          <hr />
          <p>
            Items Sold:{" "}
            {mode === "Return"
              ? receiptItems?.reduce((a, b) => a + b.quantity, 0)
              : receiptItems?.reduce((a, b) => a + b.qty, 0)}
          </p>

          <hr />

          {/* ✅ Totals */}
          <div className="total-line">
            <span>Item Total:</span>
            <span>
              <strong>{receiptData.totalBeforeDiscount}</strong>
            </span>
          </div>
          <div className="total-line">
            <span>Item Discount:</span>
            <span>
              <strong>{receiptData.totalDiscount}</strong>
            </span>
          </div>

          <hr />

          <div className="total-line">
            <span>Subtotal:</span>
            <span>
              <strong>{receiptData.totalAfterDiscount}</strong>
            </span>
          </div>
          <div className="total-line">
            <span>Global Discount:</span>
            <span>
              <strong>{receiptData.discountAmount}</strong>
            </span>
          </div>
          <hr />

          <div className="total-line">
            <span>Net Total:</span>
            <span>
              <strong>{receiptData.finalTotal}</strong>
              {/* <strong>AED {receiptData.Total}</strong> */}
            </span>
          </div>
          <hr />

          <div className="total-line">
            <span>VAT :</span>
            <span>
              <strong>
                {" "}
                {mode === "Return"
                  ? Number(receiptData.totalVat ?? 0).toFixed(2)
                  : (
                      Number(receiptData.finalTotalWithVat ?? 0) -
                      Number(receiptData.finalTotal ?? 0)
                    ).toFixed(2)}
              </strong>
            </span>
          </div>

          {/* <div className="total-line">
            <span>Total Tender:</span>
            <span>
              <strong>AED {receiptData.finalTotal.toFixed(2)}</strong>
            </span>
          </div> */}
          <div className="total-line">
            {/* <span>Total Tender:</span> */}
            <span>Grand Total:</span>
            <span>
              <strong>
                {" "}
                {mode === "Return"
                  ? receiptData?.finalTotal
                    ? Number(receiptData.finalTotal).toFixed(2)
                    : "0.00"
                  : receiptData?.finalTotalWithVat
                  ? Number(receiptData.finalTotalWithVat).toFixed(2)
                  : "0.00"}
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

          {mode != "Return" && (
            <div className="flex justify-between items-center text-gray-800">
              {exchange > 0 && <span>Exchange:</span>}
              <div className="flex items-center gap-2">
                <span>{exchange > 0 && exchange.toFixed(2)}</span>
              </div>
            </div>
          )}

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

export default Receipt;
