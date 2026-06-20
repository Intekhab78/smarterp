import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";

const PrintBarcode = () => {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    if (loading) return;

    setLoading(true);

    const payload = {
      //   item_name: "Test Product By Ashish",
      item_name: "Tarjuma Quran Majeed Ma Mukhtasir Hawasi Nivia",
      price: "149.00",
      itemupc: "8901234567890",
    };

    try {
      const res = await fetch(
        `${constantApi.baseUrl}/item_location_master/print/barcode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      console.log("res form the printer is ------------", res);

      // 🔴 Handle non-200 HTTP status
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Printing failed");
      }

      const data = await res.json();

      if (data.success) {
        alert("✅ Barcode printed successfully");
      } else {
        alert(`❌ ${data.message || "Print failed"}`);
      }
    } catch (err) {
      if (err.message === "Failed to fetch") {
        alert("❌ Print server not reachable. Please check the printer PC.");
      } else {
        alert(`❌ ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div style={{ padding: "20px" }}>
        <button
          onClick={handlePrint}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Printing..." : "Print Barcode"}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default PrintBarcode;
