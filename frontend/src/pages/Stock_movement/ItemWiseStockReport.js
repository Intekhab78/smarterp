import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";
import { axios_post } from "../../axios";

const ItemWiseStockReport = () => {
  const [itemList, setItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [itemLoading, setItemLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  /* ================= ITEM LIST ================= */
  const fetchItemList = async () => {
    setItemLoading(true);
    try {
      const res = await axios_post(true, "item_location_master/list");

      const options = res.data.map((item) => ({
        value: item.id,
        item_id: item.item_id,
        label: `${item.item_code} - ${item.item_name}`,
        item_name: item.item_name,
      }));

      setItemList(options);
    } catch (error) {
      console.error(error);
    } finally {
      setItemLoading(false);
    }
  };

  /* ================= REPORT ================= */
  const fetchReport = async (itemId) => {
    setReportLoading(true);
    setReportData([]);

    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/stock_movement/itemprocessdetails/${itemId}`,
      );

      // const sorted = res.data.data.sort(
      //   (a, b) => new Date(b.created_at) - new Date(a.created_at)
      // );

      const sorted = res.data.data
        .sort((a, b) => {
          const t =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

          if (t !== 0) return t;

          return a.id - b.id; // 👈 critical
        })
        .reverse(); // 🔁 latest first

      setReportData(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    fetchItemList();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-6 bg-gray-50 min-h-screen text-sm">
        <div className="bg-white rounded-xl shadow-md ">
          {/* ===== Gradient Header ===== */}
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-500">
            <h2 className="text-white text-lg font-semibold">
              Item Wise Stock Movement
            </h2>

            {selectedItem && (
              <div className="mt-1">
                <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {selectedItem.item_name}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 space-y-5">
            {/* ===== Item Dropdown ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Select Item
                </label>

                <Select
                  options={itemList}
                  isLoading={itemLoading}
                  isClearable
                  isSearchable
                  placeholder={
                    itemLoading ? "Loading items..." : "Search item..."
                  }
                  onChange={(option) => {
                    setSelectedItem(option);
                    if (option) fetchReport(option.value);
                  }}
                  className="text-sm"
                />
              </div>
            </div>

            {/* ===== Loader ===== */}
            {reportLoading && (
              <div className="py-12 text-center text-gray-500 text-sm">
                Fetching stock movement...
              </div>
            )}

            {/* ===== Table ===== */}
            {/* ===== Table ===== */}
            {!reportLoading && selectedItem && (
              <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                {/* Scroll Container */}
                <div className="max-h-[420px] overflow-y-auto">
                  <table className="min-w-full border-collapse">
                    {/* ===== Fixed Header ===== */}
                    <thead className="bg-indigo-50 text-xs text-indigo-700 sticky top-0 ">
                      <tr>
                        <th className="px-3 py-2 text-left border-b">Date</th>
                        <th className="px-3 py-2 text-left border-b">
                          Transaction No
                        </th>
                        <th className="px-3 py-2 text-left border-b">Batch</th>
                        <th className="px-3 py-2 text-left border-b">Type</th>
                        <th className="px-3 py-2 text-right border-b">Qty</th>
                        {/* <th className="px-3 py-2 text-left border-b">UOM</th> */}
                        <th className="px-3 py-2 text-left border-b">
                          Description
                        </th>
                        <th className="px-3 py-2 text-right border-b">
                          Qty On Hand
                        </th>
                      </tr>
                    </thead>

                    {/* ===== Scrollable Body ===== */}
                    <tbody className="text-xs text-gray-700">
                      {reportData.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-3 py-2">
                            {row.created_at
                              ? new Date(row.created_at).toLocaleDateString()
                              : "-"}
                          </td>

                          <td className="px-3 py-2 font-medium">
                            {row.transaction_no}
                          </td>
                          <td className="px-3 py-2 font-medium">{row.batch}</td>

                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                row.type === "IN"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {row.type}
                            </span>
                          </td>

                          <td className="px-3 py-2 text-right">{row.qty}</td>
                          {/* <td className="px-3 py-2">{row.uom_name || "-"}</td> */}
                          <td className="px-3 py-2 text-gray-600">
                            {row.stock_desc}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold">
                            {row.qty_on_hand_new}
                          </td>
                        </tr>
                      ))}

                      {reportData.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="py-10 text-center text-gray-500"
                          >
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!selectedItem && (
              <div className="text-center text-gray-500 py-12 text-sm">
                🔍 Select an item to view stock movement
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ItemWiseStockReport;
