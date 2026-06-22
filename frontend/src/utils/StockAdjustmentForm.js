import { useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const StockAdjustmentForm = ({ companyId, locationId, onSuccess }) => {
  const [itemUpc, setItemUpc] = useState("");
  const [itemData, setItemData] = useState(null);

  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [price, setPrice] = useState("");
  const [itemlanprice, setItemlanprice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // =========================
  // Search Item by UPC
  // =========================
  const handleSearch = async () => {
    if (!itemUpc) {
      setError("Enter Item UPC");
      return;
    }

    try {
      setError(null);
      setSearchLoading(true);

      const response = await axios.post(
        `${constantApi.baseUrl}/item_location_master/details`,
        {
          itemupc: itemUpc,
        },
      );

      if (response.data?.status) {
        const data = response.data.data;
        setItemData(data);
        // Auto-fill price from API
        setPrice(data.itemprice || "");
        setItemlanprice(data.itemlanprice || "");
        setMessage("Item found ✅");
      } else {
        setItemData(null);
        setError("Item not found");
      }
    } catch (err) {
      setItemData(null);
      setError("Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  // =========================
  // Submit Stock Adjustment
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);
    setError(null);

    if (!itemData) {
      setError("Search item first");
      return;
    }

    if (!quantity || !reason) {
      setError("Quantity and reason are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        item_id: itemData.id, // IMPORTANT
        itemupc: itemData.itemupc, // IMPORTANT
        quantity: Number(quantity),
        company_id: companyId,
        location_id: locationId,
        reason,
        expiry_date: expiryDate || null,
        itemlanprice: itemlanprice ? Number(itemlanprice) : null,
      };

      const response = await axios.post(
        `${constantApi.baseUrl}/batch/stock-adjustment`,
        payload,
      );

      if (response.data?.success) {
        setMessage("Stock adjusted successfully ✅");

        setQuantity("");
        setReason("");
        setExpiryDate("");
        setItemUpc("");
        setItemData(null);

        if (onSuccess) onSuccess();
      } else {
        setError(response.data?.message || "Something went wrong");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className=" bg-gray-100 p-4 text-sm flex flex-col">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <div className="border-b pb-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Stock Adjustment
            </h2>
            <p className="text-gray-400 text-xs">
              Search item by UPC and adjust inventory instantly
            </p>
          </div>

          {/* Alerts */}
          {message && (
            <div className="mb-3 p-2 rounded bg-green-100 text-green-700 border border-green-200">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-3 p-2 rounded bg-red-100 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search */}
            <div className="flex gap-3 m-4">
              <input
                type="text"
                placeholder="Scan or Enter Item UPC"
                className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={itemUpc}
                onChange={(e) => setItemUpc(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSearch}
                className={`px-6 py-2 rounded-xl text-white ${
                  searchLoading
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Item + Form Container */}
            {itemData && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Item Info Compact */}
                <div className="bg-gray-50 border rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-6 gap-4 text-xs">
                    <div>
                      <p className="text-gray-400">Name</p>
                      <p className="font-medium">{itemData.item_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Stock</p>
                      <p className="font-semibold text-indigo-600">
                        {itemData.remaining_stock}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p>{itemData.itemprice}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Dept</p>
                      <p>{itemData.item_department?.itemdeptname}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Sub Dept</p>
                      <p>{itemData.family_master?.itemfamname}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Child Sub Dept</p>
                      <p>{itemData.sub_family_master?.itemsfamname}</p>
                    </div>
                  </div>
                </div>

                {/* Adjustment Form */}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col flex-1 justify-between"
                >
                  {/* Top Inputs */}
                  <div className="grid grid-cols-3 gap-4 mx-2">
                    <div>
                      <label className="text-xs text-gray-500">Quantity</label>
                      <input
                        type="number"
                        className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">
                        Landed Price
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={itemlanprice}
                        onChange={(e) => setItemlanprice(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Reason - Full Width */}
                  <div className="m-4">
                    <label className="text-xs text-gray-500">
                      Stock Adjustment Reason
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explain why this stock is being adjusted..."
                    />
                  </div>

                  {/* Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-8 py-2 rounded-xl text-white ${
                        loading
                          ? "bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700 shadow-md"
                      }`}
                    >
                      {loading ? "Processing..." : "Adjust Stock"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StockAdjustmentForm;
