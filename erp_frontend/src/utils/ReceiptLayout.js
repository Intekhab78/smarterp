import constantApi from "constantApi";
import React, { forwardRef } from "react";
import Barcode from "react-barcode";
import { useReceipt } from "../context/ReceiptContext";

const ReceiptLayout = forwardRef(
  (
    {
      companyName,
      locationName,
      CreateInvoiceNumber,
      cashierName,
      dispalyName,
    },
    ref,
  ) => {
    const { receipt, receiptRef } = useReceipt();

    if (!receipt) return null;

    const {
      mode,
      items: receiptItems = [],
      totals: receiptData = {}, // ✅ READ FROM totals, NOT data
      taxSummaryRows = [], // 👈 ADD THIS
      payments = [],
    } = receipt;

    console.log("Receipt payments inside layout:", payments);

    // console.log("receiptItems", receiptItems);
    // console.log("receiptData", receiptData);
    // console.log("taxSummaryRows", taxSummaryRows);

    const round = (n) => Number(Number(n || 0).toFixed(2));

    const grossTotal = round(receiptData.totalBeforeDiscount || 0);
    const itemLevelDiscount = round(
      receiptData.itemDiscount ?? receiptData.totalDiscount ?? 0,
    );
    const globalDiscount = round(
      receiptData.globalDiscount ?? receiptData.discountAmount ?? 0,
    );
    const itemsWithCalc = receiptItems || [];
    // ==================
    // TOTALS (OUTSIDE MAP)
    // ==================
    const netTotalAfterAllDiscount = round(
      receiptData.netTotal ?? receiptData.totalNet ?? 0,
    );

    const taxAmount = round(receiptData.taxAmount ?? receiptData.totalVat ?? 0);

    const grandTotal = round(receiptData.grandTotal || 0);

    const itemsSold = (itemsWithCalc || []).reduce(
      (a, b) => a + Math.abs(Number(b.qty) || 0),
      0,
    );

    // const changePayment = payments.find(
    //   (p) => (p.method || "").toLowerCase() === "change returned",
    // );

    // const changeReturned = round(changePayment?.amount || 0);

    const changeReturned = round(
      payments
        .filter(
          (p) => (p.method || "").trim().toLowerCase() === "change returned",
        )
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    );

    return (
      <div>
        <div className="receipt receipt-offscreen" ref={receiptRef}>
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              marginBottom: "8px",
            }}
          >
            {companyName?.clogo && (
              <img
                src={`${constantApi.imageUrl}/logos/${companyName.clogo}`}
                alt="logo"
                style={{
                  width: "40px",
                  height: "40px",
                  position: "absolute",
                  left: "0",
                  top: "0",
                }}
              />
            )}

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: "700" }}>
                {companyName?.compdesc}
              </p>

              {companyName?.company_address?.[0] && (
                <>
                  <p>
                    25 B-1, Rehman Complex, Jamia Nagar Block C, Joga Bai
                    Extension, Okhla, New Delhi - 110025
                  </p>
                  <p>Contact: {companyName.company_address[0].contact_no}</p>
                  <p>Email: {companyName.company_address[0].email}</p>
                  {companyName?.ctaxnumber && (
                    <p>GSTIN No: {companyName.ctaxnumber}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <hr />
          <p className="center">
            <strong>
              {mode === "Return"
                ? "RETURN INVOICE"
                : mode === "Exchange"
                  ? "EXCHANGE INVOICE"
                  : "TAX INVOICE"}
            </strong>
          </p>

          {/* <p>INV No - {CreateInvoiceNumber}</p> */}
          <p>INV No - {receipt.invoiceNumber || CreateInvoiceNumber}</p>

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
          <p>Cashier: {cashierName}</p>

          <hr />

          {/* CUSTOMER */}
          {Object.keys(dispalyName || {}).length > 0 ? (
            <div>
              {(dispalyName.first_name || dispalyName.last_name) && (
                <p>
                  <span>Customer:</span> {dispalyName.first_name}{" "}
                  {dispalyName.last_name}
                </p>
              )}
              {dispalyName.phone && (
                <p>
                  <span>Phone:</span> {dispalyName.phone}
                </p>
              )}
              {dispalyName.email && (
                <p>
                  <span>Email:</span> {dispalyName.email}
                </p>
              )}
              {dispalyName.address && (
                <p>
                  <span>Address:</span> {dispalyName.address}
                </p>
              )}
              {dispalyName.gst_number && (
                <p>
                  <span>GSTIN No:</span> {dispalyName.gst_number}
                </p>
              )}
            </div>
          ) : (
            <p>
              <span>Customer:</span> Walking Customer
            </p>
          )}

          <hr />

          {/* ITEMS TABLE */}
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item/UPC</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Disc.</th>
                <th>Total</th>
              </tr>
              <tr>
                <td
                  colSpan={5}
                  style={{
                    borderBottom: "1px solid #000",
                    width: "100%",
                    padding: 0,
                    height: "4px",
                  }}
                />
              </tr>
            </thead>

            <tbody className="mt-4">
              {(itemsWithCalc || []).map((item, index) => {
                const price = Number(item.price) || 0;
                const qty = Number(item.qty) || 0;

                const itemGross = round(price * qty);
                const itemDiscount = round(Number(item.discountTotalItem) || 0);
                const itemGlobalDisc = round(
                  Number(item.globalDiscountItem) || 0,
                );

                const taxableValue = round(
                  itemGross - itemDiscount - itemGlobalDisc,
                );

                const taxRate = Number(item.item_tax || 0);
                const taxAmountItem = round((taxableValue * taxRate) / 100);
                const combinedDiscount = round(itemDiscount + itemGlobalDisc);

                const itemFinalTotal = round(
                  item.total_with_exclusive_tax || 0,
                );

                return (
                  <tr key={index}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <span>{item.itemName}</span>
                        {item.itemupc && (
                          <span style={{ fontSize: "10px" }}>
                            UPC: {item.itemupc}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{price.toFixed(2)}</td>
                    <td>{qty}</td>
                    <td>{combinedDiscount.toFixed(2)}</td>{" "}
                    {/* ✅ BOTH DISCOUNTS */}
                    <td>{itemFinalTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr />
          <p>Items Sold: {itemsSold}</p>
          <hr />

          {/* TOTALS */}
          <div className="total-line">
            <span>Total</span>
            <span>{grossTotal.toFixed(2)}</span>
          </div>

          <div className="total-line">
            <span>Item Discount</span>
            <span>{itemLevelDiscount.toFixed(2)}</span>
          </div>

          <div className="total-line">
            <span>Global Discount</span>
            <span>{globalDiscount.toFixed(2)}</span>
          </div>

          <div className="total-line">
            <span>Net Total (After All Discounts)</span>
            <span>{netTotalAfterAllDiscount.toFixed(2)}</span>
          </div>

          <div className="total-line">
            <span>Tax</span>
            <span>{taxAmount.toFixed(2)}</span>
          </div>

          <hr />

          <div className="total-line">
            <span>Grand Total</span>
            <span>
              <strong>₹ {grandTotal.toFixed(2)}</strong>
            </span>
          </div>

          <hr />
          {/* <div className="total-line">
            <span>Amount Payable :</span>
            <span>
              <strong>₹ {grandTotal.toFixed(2)}</strong>
            </span>
          </div> */}
          <div className="total-line">
            <span>
              {mode === "Return" ? "Amount Returnable :" : "Amount Payable :"}
            </span>
            <span>
              <strong>₹ {Math.abs(grandTotal).toFixed(2)}</strong>
            </span>
          </div>

          <hr />

          <p className="center">
            <strong>Tender Details</strong>
          </p>
          {/* {Array.isArray(payments) &&
            payments.map((p, i) => ( */}
          {Array.isArray(payments) &&
            payments
              // .filter(
              //   (p) => (p.method || "").toLowerCase() !== "change returned",
              // )
              .filter(
                (p) =>
                  (p.method || "").trim().toLowerCase() !== "change returned",
              )

              .map((p, i) => (
                <div key={i} className="total-line">
                  {/* <span>{(p.method || "").toUpperCase()}</span> */}
                  <span>
                    {(p.method || "").toUpperCase()}
                    {p.cardType ? ` (${p.cardType.toUpperCase()})` : ""}
                  </span>

                  {/* <span>₹ {Number(p.amount || 0).toFixed(2)}</span> */}
                  <span>₹ {Math.abs(Number(p.amount || 0)).toFixed(2)}</span>
                </div>
              ))}

          <div className="total-line">
            <span>Change Returned :</span>
            <span>₹ {changeReturned.toFixed(2)}</span>
          </div>

          <hr />

          <p className="center">
            <strong>Tax Summary</strong>
          </p>

          <table
            style={{
              width: "100%",
              fontSize: "10px",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th>Taxable</th>
                <th>CGST %</th>
                <th>Amt</th>
                <th>SGST %</th>
                <th>Amt</th>
              </tr>
            </thead>
            <tbody>
              {taxSummaryRows.length === 0 ? (
                <tr>
                  <td colSpan="5">0.00</td>
                </tr>
              ) : (
                taxSummaryRows.map(([rate, row], i) => (
                  <tr key={i}>
                    <td>{row.taxable.toFixed(2)}</td>

                    <td>{rate ? `${(rate / 2).toFixed(2)}%` : ""}</td>
                    <td>{row.cgstAmt.toFixed(2)}</td>

                    <td>{rate ? `${(rate / 2).toFixed(2)}%` : ""}</td>
                    <td>{row.sgstAmt.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <hr />
          <p className="center text-center">Thank you for shopping!</p>
          <hr />
          <p className="center text-center">
            <strong> Terms & Conditions:</strong>
          </p>
          <h3 className="center text-center">
            OUR TRADING HOURS ARE 10:00AM TO 10:00PM
          </h3>
          <p className="center text-center font-thin">
            Goods once sold will not be taken back or exchanged. Please check
            items at the time of billing.
          </p>

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
  },
);

export default ReceiptLayout;
