import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";

export default function PayUPayment() {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    amount: "",
  });

  const [txnid, setTxnid] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(null); // { key, hash }

  // Generate a unique txnid
  const generateTxnid = () => {
    return "txn" + Math.floor(Math.random() * 1000000000);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit to get hash and key from backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.firstname || !formData.email || !formData.amount) {
      setError("Please fill all fields");
      return;
    }

    const txnid = generateTxnid();
    setTxnid(txnid);
    setLoading(true);

    try {
      const res = await fetch(`${constantApi.baseUrl}/payment/generate-hash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnid,
          amount: formData.amount,
          productinfo: "Test Product",
          firstname: formData.firstname,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPaymentData(data);
        // After getting hash, submit the payment form programmatically
        setTimeout(() => {
          document.getElementById("payuForm").submit();
        }, 500);
      } else {
        setError(data.error || "Failed to generate payment hash");
      }
    } catch (err) {
      setError("Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow-sm text-sm font-sans">
        <h2 className="text-lg font-semibold mb-4">PayU Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="firstname">
              Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="amount">
              Amount (INR)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Enter amount"
              required
              min="1"
            />
          </div>

          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm font-medium"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        {/* Hidden form to submit to PayU */}
        {paymentData && (
          <form
            id="payuForm"
            method="POST"
            // action="https://sandboxsecure.payu.in/_payment"
            action="https://test.payu.in/_payment
"
            className="hidden"
          >
            <input type="hidden" name="key" value={paymentData.key} />
            <input type="hidden" name="hash" value={paymentData.hash} />
            <input type="hidden" name="txnid" value={txnid} />
            <input type="hidden" name="amount" value={formData.amount} />
            <input type="hidden" name="firstname" value={formData.firstname} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="phone" value="9999999999" />
            <input type="hidden" name="productinfo" value="Test Product" />
            <input
              type="hidden"
              name="surl"
              value="http://localhost:5610/api/payment/payu-success"
            />
            <input
              type="hidden"
              name="furl"
              value="http://localhost:5610/api/payment/payu-failure"
            />
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
