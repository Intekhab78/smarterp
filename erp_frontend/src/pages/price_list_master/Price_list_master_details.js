import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function Price_list_master_detail() {
  const [comp, setComp] = useState("");
  const [loc, setLoc] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Parse Excel file to JSON array
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setItems(jsonData);
      setMessage("");
    };
    reader.readAsArrayBuffer(file);
  };

  // Send data to backend
  const handleSubmit = async () => {
    if (!comp || !loc) {
      setMessage("Please enter company and location");
      return;
    }
    if (!items.length) {
      setMessage("Please upload an Excel file first");
      return;
    }

    setLoading(true);
    try {
      // Your API endpoint here
      const response = await axios.post("/api/price-list-items/bulk-create", {
        comp,
        loc,
        items,
      });

      setMessage(response.data.message || "Items uploaded successfully");
      setItems([]);
      setComp("");
      setLoc("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to upload items, try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
        <h1 className="text-2xl font-bold mb-6">Price List Upload</h1>

        <div className="mb-4">
          <label className="block font-medium mb-1">Company (comp):</label>
          <input
            type="text"
            value={comp}
            onChange={(e) => setComp(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter company code"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Location (loc):</label>
          <input
            type="text"
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter location code"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Select Excel file:</label>
          <input
            type="file"
            accept=".xls,.xlsx,.csv"
            onChange={handleFileUpload}
            className="border p-2 rounded"
          />
        </div>

        {items.length > 0 && (
          <div className="mb-6 overflow-x-auto max-h-64 border rounded p-4 bg-gray-50">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1">
                    price_list_code
                  </th>
                  <th className="border border-gray-300 px-2 py-1">item_id</th>
                  <th className="border border-gray-300 px-2 py-1">item_upc</th>
                  <th className="border border-gray-300 px-2 py-1">
                    item_name
                  </th>
                  <th className="border border-gray-300 px-2 py-1">itemcost</th>
                  <th className="border border-gray-300 px-2 py-1">
                    itemlanprice
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    itemprice
                  </th>
                  <th className="border border-gray-300 px-2 py-1">
                    list_price
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-300 px-2 py-1">
                      {item.price_list_code}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {item.item_id}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {item.item_upc}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {item.item_name}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {item.itemcost}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {item.itemlanprice}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {item.itemprice}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {item.list_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {message && (
          <p
            className={`mb-4 text-center ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload Items"}
        </button>
      </div>
    </DashboardLayout>
  );
}
