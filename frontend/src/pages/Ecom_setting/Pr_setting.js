import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";

const Pr_setting = () => {
  const [priceLists, setPriceLists] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [excelData, setExcelData] = useState([]);

  // ---------------- FETCH ACTIVE PRICELISTS ------------------
  const fetchPriceMasterList = async () => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/price_list_master/list`,
      );
      const active = res.data.data.filter((i) => i.status === "active");
      setPriceLists(active);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchPriceMasterList();
  }, []);

  // ---------------- READ EXCEL FILE ------------------
  const handleExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setExcelData(data);
    };

    reader.readAsBinaryString(file);
  };

  // ---------------- SUBMIT ------------------
  const handleSubmit = async () => {
    if (!selectedCode) return alert("Please select Price List Code");

    if (excelData.length === 0) return alert("Please upload Excel file");

    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/pr_item_details/bilk-create`,
        {
          price_list_code: selectedCode,
          excelData,
        },
      );

      // SUCCESS RESPONSE
      alert("Uploaded Successfully");
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.message;

        // If duplicates found
        if (error.response.data.duplicates) {
          const dups = error.response.data.duplicates
            .map((d) => `Item UPC: ${d.item_upc}, Item Name: ${d.item_name}`)
            .join("\n");

          return alert(`${msg}\n\n${dups}`);
        }

        return alert(msg);
      }

      alert("Upload failed");
      console.error(error);
    }
  };

  const handleSampleDownload = () => {
    const link = document.createElement("a");
    link.href = "/pr_items.xlsx"; // path from public folder
    link.download = "pr_items.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className=" bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-5 text-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Upload Price List Items
        </h2>

        {/* PRICE LIST DROPDOWN */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 text-xs font-medium">
            Price List Code
          </label>
          <select
            className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-400"
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
          >
            <option value="">Select Code</option>
            {priceLists.map((pl) => (
              <option key={pl.id} value={pl.price_list_code}>
                {pl.price_list_code}
              </option>
            ))}
          </select>
        </div>

        {/* EXCEL INPUT */}
        <div className="mb-4">
          <label className="block mb-1 text-xs text-gray-700 font-medium">
            Upload Excel File
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            className="w-full p-2 border rounded-md text-xs"
            onChange={handleExcel}
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md transition"
          >
            Upload
          </button>
          <button
            onClick={handleSampleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md transition"
          >
            Sample
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pr_setting;
