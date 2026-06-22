import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";

const items = [
  { id: 1, name: "Item A", price: 100, upc: "123456789012" },
  { id: 2, name: "Item B", price: 200, upc: "987654321098" },
];

function Test() {
  const [loading, setLoading] = useState(false);

  const handleDirectPrint = async (item) => {
    try {
      setLoading(true);
      // const res = await fetch("http://localhost:5610/api/test",
      const res = await fetch(`${constantApi.baseUrl}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      const data = await res.json();
      alert(data.message || "Sent to printer!");
    } catch (err) {
      console.error("Print error:", err);
      alert("Failed to send to printer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="App">
        <h2>Items</h2>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              margin: "20px",
              border: "1px solid #ddd",
              padding: "10px",
            }}
          >
            <h4>
              {item.name} - ₹{item.price}
            </h4>

            {/* Show barcode preview from backend */}
            <img
              // src={`http://localhost:5610/api/test/${item.upc}`}
              src={`${constantApi.baseUrl}/test/${item.upc}`}
              alt="barcode"
              style={{ marginBottom: "10px" }}
            />

            {/* ✅ Direct Print Button */}
            <button onClick={() => handleDirectPrint(item)} disabled={loading}>
              {loading ? "Printing..." : "🖨 Direct Print"}
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Test;
