import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { CgProfile } from "react-icons/cg";
import { TbListDetails } from "react-icons/tb";
import { GiMoneyStack } from "react-icons/gi";

import { ToastMassage } from "toast";
import { axios_get, axios_post } from "../../axios";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import constantApi from "constantApi";

function CloseReport() {
  const location = useLocation();
  const entry = location.state?.entry;

  const flatDetails = entry?.details?.[0] || {};

  const [loading, setLoading] = useState(true);
  const [floatData, setFloatData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [cashierDetails, setCashierDetails] = useState({});
  const [compines, setCompines] = useState([]);
  const [userCompany, setUserCompany] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [grandTotalSum, setGrandTotalSum] = useState(0);
  const [cashTotal, setCashTotal] = useState(0);
  const [paymentTotals, setPaymentTotals] = useState({});

  const [initialDenominations, setInitialDenominations] = useState({});
  const [remainingCollectedAmount, setRemainingCollectedAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(true);
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [registerMode, setRegisterMode] = useState("daywise"); // default fallback

  const navigate = useNavigate();

  const fetchFloatData = async () => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/register_float/list`
      );
      if (response.data.status) {
        setFloatData(response.data.data);
      }
    } catch (err) {
      ToastMassage("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const [collectionData, setCollectionData] = useState([]);

  const fetchCollectionDetails = async () => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/collection_details/list`
      );

      console.log("response----", response.data);

      if (response.data.status) {
        setCollectionData(response.data.data);
      } else {
        ToastMassage("❌ No collection data found", "error");
      }
    } catch (error) {
      console.error("❌ Error fetching collection details:", error);
      ToastMassage("❌ Failed to fetch collection details", "error");
    }
  };

  useEffect(() => {
    fetchFloatData();
    fetchCollectionDetails();
  }, []);

  const filterByRegisterId = (data, id) =>
    Array.isArray(data)
      ? data.filter((item) => item.register_tbl_hdr_id === id)
      : [];

  const filteredCollection = filterByRegisterId(collectionData, entry.id);
  //   console.log("Filtered:", filteredCollection);

  //  total payment method wise
  useEffect(() => {
    const totals = {};

    filteredCollection.forEach((item) => {
      const mode = item.payment_mode?.toLowerCase();
      const amount = parseFloat(item.grand_total || 0);

      if (totals[mode]) {
        totals[mode] += amount;
      } else {
        totals[mode] = amount;
      }
    });

    setPaymentTotals(totals);
    setCashTotal(totals["cash"] || 0); // ✅ Cash total derived from paymentTotals
  }, [filteredCollection]);

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user_data"));
    setCashierDetails(user_data);
  }, []);

  useEffect(() => {
    const fetchcompanyList = async () => {
      const response = await axios_post(true, "company/com_list");
      if (response?.status) {
        setCompines(response.data);
      }
    };
    fetchcompanyList();
  }, []);

  useEffect(() => {
    if (cashierDetails?.company_id && compines.length > 0) {
      const matched = compines.find(
        (company) => String(company.id) === String(cashierDetails.company_id)
      );
      setUserCompany(matched);
    }
  }, [cashierDetails, compines]);

  // ✅ UPDATED useEffect to handle missing invoice data
  useEffect(() => {
    const loadEntryDetails = async () => {
      if (!entry) return;

      const detail = entry.details?.[0] || {};
      setSelectedEntry({ hdr: entry, details: detail });

      const initDenoms = {};
      Object.entries(detail).forEach(([key, val]) => {
        if (key.startsWith("denomination_")) {
          initDenoms[key] = Number(val || 0);
        }
      });
      setInitialDenominations(initDenoms);

      if (entry.invoices?.length > 0) {
        setInvoices(entry.invoices);
        const totalInvoices = entry.invoices.reduce((sum, inv) => {
          return sum + parseFloat(inv.grand_total || 0);
        }, 0);
        setGrandTotalSum(totalInvoices);
      } else if (entry.id) {
        const fetchedInvoices = await fetchandFilterInvoiceDetailsById(
          entry.id
        );
        setInvoices(fetchedInvoices);
        const totalInvoices = fetchedInvoices.reduce((sum, inv) => {
          return sum + parseFloat(inv.grand_total || 0);
        }, 0);
        setGrandTotalSum(totalInvoices);
      }
    };

    loadEntryDetails();
  }, [entry]);

  useEffect(
    () => {
      if (!selectedEntry) return;

      const collected = Object.entries(selectedEntry?.details || {})
        .filter(([key]) => key.startsWith("denomination_"))
        .reduce((acc, [key, newVal]) => {
          const denom = parseFloat(
            key.replace("denomination_", "").replace("_", ".")
          );
          const initial = initialDenominations[key] || 0;
          const diff = Math.max(0, newVal - initial);
          return acc + denom * diff;
        }, 0);

      setRemainingCollectedAmount((cashTotal - collected).toFixed(2));
    },
    [selectedEntry, cashTotal, initialDenominations]
    //   [selectedEntry, grandTotalSum, initialDenominations]
  );

  const denominationTotal = useMemo(() => {
    if (!selectedEntry?.details) return 0;

    return Object.entries(selectedEntry.details)
      .filter(([key]) => key.startsWith("denomination_"))
      .reduce((acc, [key, val]) => {
        const denom = parseFloat(
          key.replace("denomination_", "").replace("_", ".")
        );
        return acc + denom * Number(val || 0);
      }, 0);
  }, [selectedEntry]);

  // for manage cahsier sir and day wise

  useEffect(() => {
    const fetchRegisterMode = async () => {
      try {
        const response = await axios.get(
          `${constantApi.baseUrl}/register_float/registerSettingList`
        );
        if (response?.data?.status) {
          setRegisterMode(response.data.mode); // daywise or cashierwise
        }
      } catch (err) {
        console.warn("Failed to fetch register mode", err);
      }
    };

    fetchRegisterMode();
  }, []);

  const handleFinalClose = async () => {
    if (!selectedEntry || !cashierDetails) return;

    // ❌ Restrict based on cashierwise mode
    if (
      registerMode === "cashierwise" &&
      selectedEntry?.hdr?.open_by !== cashierDetails.firstname
    ) {
      ToastMassage(
        "❌ You are not allowed to close this register. Only the opening cashier can close it.",
        "error"
      );
      return;
    }

    try {
      const updatedDenominations = Object.entries(selectedEntry.details)
        .filter(([key]) => key.startsWith("denomination_"))
        .reduce((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {});

      const total = Object.entries(updatedDenominations).reduce(
        (sum, [key, value]) => {
          const denom = parseFloat(
            key.replace("denomination_", "").replace("_", ".")
          );
          return sum + denom * Number(value || 0);
        },
        0
      );

      const overShort = Number(remainingCollectedAmount).toFixed(2);

      // Show reason popup if not 0 and reason not provided
      if (Math.abs(overShort) !== 0 && !reason.trim()) {
        setShowReasonPopup(true);
        return;
      }

      const payload = {
        register_id: selectedEntry?.hdr?.id || null,
        currency: selectedEntry?.details?.currency || "N/A",
        currency_country: selectedEntry?.details?.currency_country || "N/A",
        total: Number(total.toFixed(2)),
        cashier: cashierDetails,
        denominations: updatedDenominations,
        over_short: Number(overShort),
        reason: reason.trim(),
      };

      const response = await axios.put(
        `${constantApi.baseUrl}/register_float/close/${selectedEntry.id}`,
        payload
      );

      if (response.data.status) {
        ToastMassage("Closed successfully", "success");
        navigate("/registerreport");
      } else {
        ToastMassage("Close failed", "error");
      }
    } catch (err) {
      ToastMassage("Error closing float", "error");
    } finally {
      setShowConfirm(false);
    }
  };

  const fetchandFilterInvoiceDetailsById = async (registerId) => {
    console.log("registerId", registerId);
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/invoice/by_register_id`,
        {
          register_tbl_hdr_id: registerId,
        }
      );

      if (response.data.status) {
        return response.data.data.records;
      } else {
        console.warn("⚠️ No invoice data found for Register ID:", registerId);
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching invoice data by register ID:", error);
      return [];
    }
  };

  const [showCashierDetails, setShowCashierDetails] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [showPaymentMethodDetails, setShowPaymentMethodDetails] =
    useState(false);

  // Show only Cashier
  const handleCashier = () => {
    setShowCashierDetails(true);
    setShowInvoiceDetails(false);
    setShowPaymentMethodDetails(false);
  };

  // Show only Invoice
  const handleInvoice = () => {
    setShowInvoiceDetails(true);
    setShowCashierDetails(false);
    setShowPaymentMethodDetails(false);
  };

  // Show only Payment Method
  const handlePaymentMethod = () => {
    setShowPaymentMethodDetails(true);
    setShowCashierDetails(false);
    setShowInvoiceDetails(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Register Entry Overview
          </h2>

          <div className="flex justify-end items-center gap-12 my-4">
            <div
              onClick={handleCashier}
              className="cursor-pointer inline-block text-xl text-gray-700"
              title="Cashier"
            >
              <CgProfile />
            </div>

            <div
              onClick={handleInvoice}
              className="cursor-pointer inline-block text-xl text-gray-700"
              title="Invoice Details"
            >
              <TbListDetails />
            </div>

            <div
              onClick={handlePaymentMethod}
              className="cursor-pointer inline-block text-xl text-gray-700"
              title="Payment Method"
            >
              <GiMoneyStack />
            </div>
          </div>

          {entry ? (
            <>
              {showCashierDetails && (
                <div>
                  {" "}
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Cashier Register Details
                  </h2>
                  <table className="table-auto border-collapse border border-gray-300 w-full text-xs mb-6">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Currency</th>
                        <th className="border px-2 py-1">Date</th>
                        <th className="border px-2 py-1">Time</th>
                        <th className="border px-2 py-1">Open By</th>
                        <th className="border px-2 py-1">Float Amount</th>
                        <th className="border px-2 py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800">
                      <tr>
                        <td className="border px-2 py-1">{entry.id}</td>
                        <td className="border px-2 py-1">{entry.currency}</td>
                        <td className="border px-2 py-1">{entry.date}</td>
                        <td className="border px-2 py-1">{entry.time}</td>
                        <td className="border px-2 py-1">{entry.open_by}</td>
                        <td className="border px-2 py-1">
                          ₹ {entry.float_amount}
                        </td>
                        <td className="border px-2 py-1 capitalize">
                          {entry.status}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {showInvoiceDetails && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Invoice List
                  </h2>
                  <table className="w-full text-xs mb-6 border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Invoice No</th>
                        <th className="border px-2 py-1">Type</th>
                        <th className="border px-2 py-1">Register ID</th>
                        <th className="border px-2 py-1">Gross</th>
                        <th className="border px-2 py-1">5% of Gross</th>
                        <th className="border px-2 py-1">Grand Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1">
                            {inv.invoice_number || "N/A"}
                          </td>
                          <td className="border px-2 py-1">
                            {inv.invoice_type || "N/A"}
                          </td>
                          <td className="border px-2 py-1">
                            {inv.register_tbl_hdr_id || "-"}
                          </td>
                          <td className="border px-2 py-1">
                            {inv.total_gross || "0.00"}
                          </td>
                          <td className="border px-2 py-1">
                            {(
                              (parseFloat(inv.total_gross) || 0) * 0.05
                            ).toFixed(2)}
                          </td>
                          <td className="border px-2 py-1">
                            {inv.grand_total || "0.00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* filtered cash data */}

              {showPaymentMethodDetails && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Payment Method Details
                  </h2>
                  <table className="min-w-full text-sm border border-gray-300 mt-4">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-2 text-left">
                          Invoice ID
                        </th>
                        <th className="border px-3 py-2 text-left">
                          Payment Mode
                        </th>
                        <th className="border px-3 py-2 text-left">
                          Grand Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCollection.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border px-3 py-1">
                            {item.invoice_id}
                          </td>
                          <td className="border px-3 py-1 capitalize">
                            {item.payment_mode}
                          </td>
                          <td className="border px-3 py-1">
                            ₹{item.grand_total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* total payment method wise */}

              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">
                  Payment Method Totals:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(paymentTotals).map(([method, total]) => (
                    <div
                      key={method}
                      className="bg-green-200 border rounded shadow-sm p-3 flex justify-between text-sm"
                    >
                      <span className="capitalize">
                        {method.replace("_", " ")} Total
                      </span>
                      <span className="font-medium">₹{total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other sections remain unchanged (denomination input, total display etc.) */}
              {/* Denominations - Editable */}
              <div className="grid grid-cols-4 gap-4 text-xs bg-gray-50 p-2 rounded">
                {Object.entries(selectedEntry?.details || {})
                  .filter(([key]) => key.startsWith("denomination_"))
                  .map(([denomination, value]) => {
                    const label = denomination
                      .replace("denomination_", "")
                      .replace("_", ".");

                    return (
                      <div
                        key={denomination}
                        className="flex items-center gap-2"
                      >
                        <label className="w-8 font-medium">{label}:</label>
                        <input
                          type="number"
                          min="0"
                          value={value}
                          onChange={(e) => {
                            const newValue = +e.target.value;
                            setSelectedEntry((prev) => ({
                              ...prev,
                              details: {
                                ...prev.details,
                                [denomination]: newValue,
                              },
                            }));
                          }}
                          className="flex-1 border rounded px-2 py-1 w-12"
                        />
                      </div>
                    );
                  })}
              </div>

              {/* Totals Section */}
              <div className="col-span-3 mt-4 text-sm font-semibold space-y-2">
                <div className="flex justify-between px-4">
                  <span>Total (Denominations):</span>
                  <span>
                    {Number(denominationTotal).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between px-4">
                  <span>Cash Total (from Payments):</span>
                  <span>{Number(cashTotal).toLocaleString("en-IN")}</span>
                </div>
                {/* <div className="flex justify-between px-4">
                  <span>Invoice Grand Total:</span>
                  <span>{Number(grandTotalSum).toLocaleString("en-IN")}</span>
                </div> */}

                <div className="flex justify-between px-4">
                  <span>Remaining Collected Amount:</span>
                  <span>{remainingCollectedAmount}</span>
                </div>

                <div className="flex justify-between px-4">
                  {Number(remainingCollectedAmount) === 0 && (
                    <span>✅ Totals Match</span>
                  )}
                </div>
              </div>

              {/* Confirm Close Button */}
              <div className="mt-4 text-right">
                {showConfirm && (
                  <button
                    onClick={handleFinalClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                  >
                    Confirm Final Close
                  </button>
                )}
              </div>

              {showReasonPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded shadow-md w-96">
                    <h3 className="text-sm font-semibold mb-2 text-gray-800">
                      Enter Reason for Over/Short Amount
                    </h3>
                    <textarea
                      className="w-full border px-2 py-1 rounded text-sm"
                      rows="3"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        className="text-sm px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                        onClick={() => setShowReasonPopup(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          handleFinalClose(); // Reuse the same function
                          setShowReasonPopup(false);
                        }}
                        disabled={!reason.trim()}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">No entry data available.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CloseReport;
