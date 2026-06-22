import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ExportMainItems({
  selectedMainCompanyItem,
  setshowMainItemsListPopup,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ For search

  const companyName =
    selectedMainCompanyItem.length > 0
      ? selectedMainCompanyItem[0].company?.compdesc || "—"
      : "";

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id)); // ✅ Select only filtered
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const exportSelectedToExcel = () => {
    const dataToExport = selectedMainCompanyItem
      .filter((item) => selectedIds.includes(item.id))
      .map((item) => ({
        itemupc: item.itemupc,
        "Item Name": item.item_name,
        Cost_Price: item.itemcost,
        Landed_Price: item.itemlanprice,
        Price: item.itemprice,
        Stock: item.remaining_stock,
      }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(new Blob([excelBuffer]), "SelectedItems.xlsx");
  };

  // ✅ Filter items by item_name or itemupc
  const filteredItems = selectedMainCompanyItem.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemupc?.toString().includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-12">
      <div className="bg-white rounded-xl shadow-md w-full max-w-4xl ms-60 flex flex-col max-h-[80vh]">
        {/* 🔹 Header (Fixed) */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">{companyName} - (Items)</h2>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by Name or UPC"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded text-sm px-2 py-0.5 h-7 w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />

            <button
              onClick={() => setSearchQuery("")}
              className="bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded h-7"
            >
              Clear
            </button>
          </div>

          <button
            onClick={() => setshowMainItemsListPopup(false)}
            className="text-red-500 font-bold text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 🔹 Scrollable Content */}
        <div
          className="overflow-y-auto px-4"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          <table className="border-collapse w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Item UPC</th>
                <th>Item Name</th>

                <th>Total Stock</th>
                <th>Avl Stock</th>
                <th>Item Category</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td>{item.itemupc}</td>
                  <td className="text-start ms-8">{item.item_name}</td>
                  <td>{item.stock}</td>
                  <td>{item.remaining_stock}</td>
                  <td>{item.itemcategory?.itemcatname || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔹 Footer (Fixed) */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={exportSelectedToExcel}
            disabled={selectedIds.length === 0}
            className="bg-green-600 text-white px-2 py-1 rounded text-sm disabled:bg-gray-300"
          >
            Export Selected to Excel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportMainItems;
