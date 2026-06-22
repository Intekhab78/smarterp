import React, { useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function ZebraBarcodePrinter() {
  const items = [
    { id: "ITEM-1001", name: "Item One" },
    { id: "ITEM-1002", name: "Item Two" },
    { id: "ITEM-1003", name: "Item Three" },
    { id: "ITEM-1004", name: "Item Four" },
    { id: "ITEM-1005", name: "Item Five" },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  // Handle checkbox selection
  const handleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Generate ZPL for selected items
  // Generate ZPL for selected items in one block (stacked vertically)
  const generateZPL = () => {
    let y = 50; // vertical start position
    let zpl = "^XA";

    selectedItems.forEach((itemId) => {
      const item = items.find((i) => i.id === itemId);

      zpl += `
      ^FO50,${y}
      ^BY2
      ^BCN,100,Y,N,N
      ^FD${item.id}^FS
      ^FO50,${y + 110}
      ^A0N,30,30
      ^FD${item.name}^FS
    `;

      // Move down for next label
      y += 200;
    });

    zpl += "^XZ";
    return zpl;
  };

  const handlePrintToZebra = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to print.");
      return;
    }

    const zplData = generateZPL();

    fetch("https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "image/png",
      },
      body: zplData,
    })
      .then((res) => res.blob())
      .then((blob) => {
        const imgURL = URL.createObjectURL(blob);
        window.open(imgURL); // single preview with all barcodes stacked
      })
      .catch((err) => console.error("Error previewing:", err));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={{ padding: "20px" }}>
        <h2>Zebra Barcode Printing</h2>
        <button
          onClick={handlePrintToZebra}
          style={{ padding: "8px 16px", marginBottom: "20px" }}
        >
          Print to Zebra
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "20px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <input
                type="checkbox"
                onChange={() => handleSelect(item.id)}
                checked={selectedItems.includes(item.id)}
                style={{ marginBottom: "10px" }}
              />
              <h4>{item.name}</h4>
              <div style={{ fontSize: "12px", color: "#555" }}>{item.id}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
