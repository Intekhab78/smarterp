import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { axios_post } from "../../axios";
import constantApi from "constantApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastMassage } from "toast";

export default function CashFloat() {
  const [currency, setCurrency] = useState("INR");
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);

  const [denomination, setDenomination] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [cashierDetails, setCashierDetails] = useState({});

  const getDenominationdetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "currencyDenomination/list");

    if (response?.status && Array.isArray(response.data)) {
      const records = response.data;

      const currencyMap = {};

      records.forEach((item) => {
        const activeDenoms = [];

        Object.entries(item).forEach(([key, value]) => {
          if (key.startsWith("denomination_") && value === 1) {
            let denomValue = key.replace("denomination_", "").replace("_", ".");
            denomValue = parseFloat(denomValue);
            activeDenoms.push(denomValue);
          }
        });

        activeDenoms.sort((a, b) => b - a);
        currencyMap[item.currency] = activeDenoms;
      });

      setCurrencyOptions(currencyMap);
      setDenomination(records);
    } else {
      ToastMassage(response.message || "Fetch failed", "error");
    }

    setLoading(false);
  };

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user_data"));
    setCashierDetails(user_data);
    console.log("user_data----------", user_data);

    getDenominationdetails();
  }, []);

  useEffect(() => {
    const init = {};
    (currencyOptions[currency] || []).forEach((d) => (init[d] = 0));
    setQuantities(init);
  }, [currency, currencyOptions]);

  useEffect(() => {
    let t = 0;
    for (let d in quantities) {
      t += d * quantities[d];
    }
    setTotal(t);
  }, [quantities]);

  const handleChange = (d, val) => {
    setQuantities({ ...quantities, [d]: +val });
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!cashierDetails?.id) {
      ToastMassage("Cashier not found", "error");
      return;
    }

    if (total === 0) {
      ToastMassage("❌ Total amount must be greater than 0", "error");
      return;
    }

    const data = {
      cashier: cashierDetails,
      currency,
      denominations: quantities,
      total,
    };

    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/register_float/store`,
        data
      );

      if (response?.data?.status) {
        ToastMassage("✅ Cash float saved successfully!", "success");
        navigate("/pos"); // Navigate after success
      } else {
        ToastMassage(
          "❌ Failed to save: " + (response?.data?.message || "Unknown error"),
          "error"
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      ToastMassage("❌ Server error while saving float", "error");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="w-full max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-center text-base font-semibold mb-3">
          💼 Start Cash Float
        </h2>

        {/* Cashier Info */}
        <div className="mb-4 bg-gray-50 p-2 rounded border text-xs">
          <div>
            <span className="font-medium">Name:</span>{" "}
            {cashierDetails.firstname} {cashierDetails.lastname}
          </div>
          <div>
            <span className="font-medium">Mobile:</span> {cashierDetails.mobile}
          </div>
          <div>
            <span className="font-medium">Email:</span> {cashierDetails.email}
          </div>
          <div>
            <span className="font-medium">ID:</span> {cashierDetails.id}
          </div>
        </div>

        {/* Currency Selector */}
        <div className="mb-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded text-xs w-full"
          >
            {Object.keys(currencyOptions).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Denominations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {(currencyOptions[currency] || []).map((d) => (
            <div
              key={d}
              className="grid grid-cols-3 items-center bg-gray-50 border rounded px-2 py-1"
            >
              <span className="text-left font-medium">
                {currency} {d}
              </span>
              <input
                type="number"
                min="0"
                value={quantities[d] || 0}
                onChange={(e) => handleChange(d, e.target.value)}
                className="w-full p-1 text-right border rounded text-xs"
              />
              <span className="text-right">
                {currency} {(d * (quantities[d] || 0)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total and Save */}
        <div className="text-right font-semibold text-sm mb-2">
          Total: {currency} {total.toFixed(2)}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-xs"
        >
          {/* Save Float */}
          Create float amount
        </button>
      </div>
    </DashboardLayout>
  );
}
