import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { ToastMassage } from "toast";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
function FloatDetails() {
  const [floatData, setFloatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFloatData = async () => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/register_float/list`
      );
      console.log("response from the fetchFloatData ", response);

      if (response.data.status) {
        const data = response.data.data;

        // Check if any entry has status "open"
        const hasOpen = data.find(
          (entry) => entry.status.toLowerCase() === "open"
        );
        if (hasOpen) {
          localStorage.setItem("register_id", openEntry.id);
          ToastMassage("There is a float entry with status: OPEN", "error");
        } else {
          localStorage.removeItem("register_id");
        }
        setFloatData(data);
      } else {
        ToastMassage(" Data not found", "error");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      ToastMassage(" Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloatData();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div>
        <h2>Float Entries</h2>
        {floatData.map((entry, index) => (
          <div
            key={entry.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>Float Header #{entry.id}</h3>
            <p>
              <strong>Open By:</strong> {entry.open_by}
            </p>
            <p>
              <strong>Currency:</strong> {entry.currency}
            </p>
            <p>
              <strong>Float Amount:</strong> {entry.float_amount}
            </p>
            <p>
              <strong>Status:</strong> {entry.status}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(entry.created_at).toLocaleString()}
            </p>

            <h4>Float Details</h4>
            {entry.details && entry.details.length > 0 ? (
              <ul>
                {entry.details.map((detail, idx) => (
                  <li key={idx}>
                    INR {detail.currency} | ₹500 x {detail.denomination_500} |
                    ₹100 x {detail.denomination_100} | Total: ₹{detail.total}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No details found</p>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default FloatDetails;
