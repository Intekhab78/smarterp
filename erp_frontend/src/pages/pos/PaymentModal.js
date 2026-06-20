import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

const PaymentModal = ({
  paymentModal,
  paymentModalSource,
  mode,
  sums,
  finalTotalWithVat,
  paidAmount,
  exchangeTotals,
  setPayments,
  methodType,
  setMethodType,
  paymentAmount,
  setPaymentAmount,
  voucherNumber,
  setVoucherNumber,
  selectedCurrency,
  setSelectedCurrency,
  selectedCardType,
  setSelectedCardType,
  authCode,
  setAuthCode,
  payments,
  getPaymentAmountByMethod,
  handleAddPayment,
  handleRemovePayment,
  handleReturn,
  handleSave,
  handleExchange,
  handlePaymentClose,
  isSubmit,
  isSubmitDisabled,
  allPaymentsWithReturns,
  filteredPayments,
}) => {
  if (!paymentModal) return null;

  const total = sums?.total ?? 0;
  console.log("payments is ------", payments);

  // Refund calculation
  const refundedSoFar = payments
    .filter((p) => p.isRefund)
    .reduce((sum, p) => sum + Math.abs(Number(p.amount || 0)), 0);

  // const remainingRefund = Math.max(0, total - refundedSoFar);
  const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  const remainingRefund = round2(
    Math.max(0, round2(total) - round2(refundedSoFar)),
  );

  // Exchange calculation
  const totalExchangeAmount = exchangeTotals?.netTotal ?? 0;
  const paidExchangeSoFar = payments
    .filter((p) => p.mode === "Exchange")
    .reduce((sum, p) => sum + Math.abs(Number(p.amount || 0)), 0);

  const [remainingExchange, setRemainingExchange] = useState(0);

  useEffect(() => {
    if (exchangeTotals) {
      if (exchangeTotals.netTotal > 0) {
        setRemainingExchange(totalExchangeAmount - paidExchangeSoFar);
      } else {
        setRemainingExchange(totalExchangeAmount + paidExchangeSoFar);
      }
    } else {
      setRemainingExchange(0);
    }
  }, [exchangeTotals, totalExchangeAmount, paidExchangeSoFar]);

  const resetAllPaymentDetails = () => {
    setMethodType("");
    setPaymentAmount("");
    setVoucherNumber("");
    setSelectedCurrency("");
    setSelectedCardType("");
    setAuthCode("");
    setPayments([]); // ⬅️ Clear previously added payments
  };

  const removePayment = (index) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };

  // Exchange payable amount (only if customer needs to pay)
  // Exchange payable (only if customer needs to pay)
  const exchangePayable =
    exchangeTotals?.netTotal > 0 ? Number(exchangeTotals.netTotal) : 0;

  const totalExchangePaid = Number(paidExchangeSoFar);

  // Remaining amount (never negative)
  const remainingExchangeAmount =
    exchangePayable > 0 ? Math.max(0, exchangePayable - totalExchangePaid) : 0;

  // Change amount
  const exchangeChange =
    totalExchangePaid > exchangePayable
      ? totalExchangePaid - exchangePayable
      : 0;

  // Enable button when remaining becomes 0
  const isExchangeCompleted =
    exchangePayable > 0 ? remainingExchangeAmount <= 0.001 : true; // refund case auto allow

  const saleMethods = [
    { value: "gift_card", label: "Gift Card" },
    { value: "cash", label: "Cash" },
    { value: "credit_card", label: "Credit Card" },
    { value: "foreign_currency", label: "Foreign Currency" },
    { value: "gift_voucher", label: "Gift Voucher" },
    { value: "coupon", label: "Coupon" },
    { value: "online", label: "Online" },
    { value: "on_credit", label: "On Credit" },
  ];

  const returnMethods = [
    { value: "cash", label: "Cash" },
    { value: "credit_card", label: "Credit Card" },
    { value: "on_credit", label: "On Credit" },
  ];

  const availableMethods = mode === "Return" ? returnMethods : saleMethods;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-md text-center space-y-4 text-xs">
        <h2 className="text-sm font-semibold text-gray-800">Confirm Payment</h2>

        {/* Total & Remaining */}
        <div className="text-left text-xs space-y-1 border-t pt-2">
          {mode === "Return" ? (
            <div className="flex justify-between">
              <p className="text-gray-700 font-semibold">
                Total: {total.toFixed(2)}
              </p>
              <p className="text-gray-700 font-semibold">
                Remaining Refund: {remainingRefund.toFixed(2)}
              </p>
            </div>
          ) : mode === "Exchange" && exchangeTotals ? (
            <div>
              <div className="flex justify-between">
                <p className="text-gray-700 font-semibold">
                  Return Total:{" "}
                  {(
                    (exchangeTotals?.returnTotal ?? 0) +
                    (exchangeTotals?.returnVat ?? 0)
                  ).toFixed(2)}
                </p>
                <p className="text-gray-700 font-semibold">
                  Total Sale:{" "}
                  {(
                    (exchangeTotals?.addTotal ?? 0) +
                    (exchangeTotals?.addVat ?? 0)
                  ).toFixed(2)}
                </p>
              </div>

              {/* Refund / Pay logic */}
              <div className="flex justify-between">
                {exchangeTotals?.netTotal < 0 ? (
                  <p className="font-semibold text-green-600">
                    Refund to Customer:{" "}
                    {Math.abs(exchangeTotals.netTotal).toFixed(2)}
                  </p>
                ) : exchangeTotals?.netTotal > 0 ? (
                  <div className="flex justify-between items-center gap-4">
                    <p className="font-semibold text-red-600">
                      Customer Pays: {exchangePayable.toFixed(2)}
                    </p>

                    <p className="text-gray-600 font-semibold">
                      Remaining: {remainingExchangeAmount.toFixed(2)}
                    </p>

                    {exchangeChange > 0 && (
                      <p className="text-green-600 font-semibold">
                        Change: {exchangeChange.toFixed(2)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-semibold text-gray-600">No Balance</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <p className="text-gray-700 font-semibold">
                Total: {(finalTotalWithVat ?? 0).toFixed(2)}
              </p>
              <p className="text-gray-700 font-semibold">
                Paid: {(paidAmount ?? 0).toFixed(2)}
              </p>
              <p className="text-gray-700 font-semibold">
                Remaining:{" "}
                {((finalTotalWithVat ?? 0) - (paidAmount ?? 0)).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Payment Method Inputs */}
        <div className="text-left space-y-3 text-xs">
          <label className="block font-medium text-gray-600">
            Payment Method
          </label>
          <div className="flex items-center gap-4">
            <select
              value={methodType}
              onChange={(e) => setMethodType(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs"
            >
              <option value="">Choose method</option>

              {availableMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Enter Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {["gift_card", "gift_voucher", "coupon"].includes(methodType) && (
            <input
              type="text"
              placeholder={`Enter ${methodType.replace("_", " ")} ${
                methodType === "coupon" ? "Code" : "Number"
              }`}
              value={voucherNumber}
              onChange={(e) => setVoucherNumber(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs"
            />
          )}

          {methodType === "foreign_currency" && (
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            >
              <option value="">Select Currency</option>
              <option value="USD">Dollar (USD)</option>
              <option value="AED">AED</option>
              <option value="INR">INR</option>
            </select>
          )}

          {methodType === "credit_card" && (
            <div className="flex items-center gap-4">
              <select
                value={selectedCardType}
                onChange={(e) => setSelectedCardType(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="">Select Card Type</option>
                <option value="visa">Visa</option>
                <option value="mastercard">MasterCard</option>
                <option value="amex">American Express</option>
              </select>

              {selectedCardType && (
                <input
                  type="text"
                  placeholder="Enter Auth Code"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-lg text-xs"
                />
              )}
            </div>
          )}

          <button
            // onClick={() =>
            //   mode === "Return"
            //     ? getPaymentAmountByMethod(methodType, paymentAmount, mode)
            //     : handleAddPayment()
            // }
            onClick={() => {
              if (mode === "Return") {
                // const amount = Number(paymentAmount || 0);
                const amount = round2(Number(paymentAmount || 0));
                const remaining = round2(remainingRefund);

                if (amount <= 0) {
                  alert("Enter valid refund amount");
                  return;
                }

                if (amount > remaining) {
                  alert(
                    "Refund amount cannot be greater than remaining refund",
                  );
                  return;
                }

                getPaymentAmountByMethod(methodType, amount, mode);
              } else {
                handleAddPayment();
              }
            }}
            className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
          >
            {mode === "Return" ? "Return Payment" : "Add Payment"}
          </button>
        </div>

        <hr className="border-gray-300 my-2" />

        {/* Payment Breakdown */}
        <div className="text-left pt-2 text-xs space-y-1">
          <h3 className="font-semibold text-gray-700">Payment Breakdown:</h3>

          {/* Original Payments */}
          {payments
            .filter((p) => p.mode !== "Return" && p.mode !== "Exchange")
            .map((p, index) => (
              <div
                key={`original-${index}`}
                className="flex items-center justify-between text-gray-800 py-1"
              >
                {/* Left Side: Method + details */}
                <span className="flex-1">
                  {p.method}
                  {p.cardType && ` (${p.cardType})`}
                  {p.authCode && ` - ${p.authCode}`}
                  {p.code && ` - (${p.code})`}
                </span>

                {/* Right Side: Amount + X button */}
                <div className="flex items-center space-x-3">
                  <span className="text-right w-20">{p.amount}</span>

                  {/* <button
                    onClick={() => removePayment(index)}
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button> */}

                  {mode !== "Exchange" && (
                    <button
                      onClick={() => removePayment(index)}
                      className="text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

          {/* Return / Exchange Payments */}
          {(mode === "Return" || mode === "Exchange") && (
            <>
              <hr className="border-gray-300 my-2" />
              <div className="flex justify-between font-semibold text-gray-700 pt-2 mt-2">
                <span>
                  {mode === "Return"
                    ? "Refund Breakdown:"
                    : "Exchange Breakdown:"}
                </span>
              </div>

              {payments
                .filter((p) =>
                  mode === "Return" ? p.isRefund : p.mode === "Exchange",
                )
                .map((p) => {
                  const realIndex = payments.indexOf(p);
                  return (
                    <div
                      key={`payment-${realIndex}`}
                      className="flex justify-between items-center text-gray-800"
                    >
                      <span>
                        {p.method}
                        {p.cardType && ` (${p.cardType})`}
                        {p.authCode && ` - ${p.authCode}`}
                        {p.code && ` - (${p.code})`}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{Math.abs(p.amount)}</span>
                        <button
                          onClick={() => handleRemovePayment(realIndex)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}

              <hr className="border-gray-300 my-2" />
              <div className="flex justify-between font-semibold text-gray-700 pt-2 mt-2">
                <span>{mode === "Return" ? "Total:" : "Exchange Total:"}</span>
                {mode === "Return" ? (
                  <span>
                    {payments
                      .filter((p) =>
                        mode === "Return" ? p.isRefund : p.isExchange,
                      )
                      .reduce(
                        (sum, p) => sum + Math.abs(Number(p.amount || 0)),
                        0,
                      )}
                  </span>
                ) : (
                  <span>{paidExchangeSoFar}</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {(mode === "Return" ||
          paymentModalSource === "payment" ||
          mode === "Exchange") && (
          <div className="flex justify-center gap-2 pt-2 text-xs">
            <button
              onClick={() => {
                if (mode === "Return") handleReturn();
                else if (mode === "Exchange") handleExchange();
                else handleSave();
                resetAllPaymentDetails();
              }}
              disabled={
                mode === "Return"
                  ? round2(Math.abs(remainingRefund)) > 0
                  : mode === "Exchange"
                    ? !isExchangeCompleted
                    : isSubmitDisabled
              }
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow disabled:opacity-60"
            >
              {isSubmit ? (
                <CircularProgress
                  color="inherit"
                  size={18}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-9px",
                    marginLeft: "-9px",
                  }}
                />
              ) : mode === "Return" ? (
                "Refund"
              ) : mode === "Exchange" ? (
                "Exchange Save"
              ) : (
                "Save"
              )}
            </button>

            <button
              onClick={() => {
                resetAllPaymentDetails();
                handlePaymentClose();
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
