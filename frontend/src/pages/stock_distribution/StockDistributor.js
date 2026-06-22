import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import UserDetails from "./UserDetails";
import ItemList from "./ItemList";
import { axios_get, axios_post } from "../../axios";
import constantApi from "constantApi";
import { ToastMassage } from "toast";

const StockDistributor = () => {
  const [compines, setCompines] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const [locations, setlocations] = useState([]);
  const [warehouses, setWarehouse] = useState([]);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [distributions, setDistributions] = useState([
    { location: "", warehouse: "", qty: "" },
  ]);
  const [loading, setLoading] = useState(false);

  // 🔄 Handle Item Change
  const handleItemChange = (e) => {
    const itemId = e.target.value;
    setSelectedItemId(itemId);

    const item = items.find((i) => i.id === parseInt(itemId));
    setTotalStock(item ? item.stock : 0);

    setDistributions([{ location: "", warehouse: "", qty: "" }]);
  };

  // ➕ Add Distribution Row
  const handleAddDistribution = () => {
    setDistributions([
      ...distributions,
      { location: "", warehouse: "", qty: "" },
    ]);
  };

  // 📝 Update Field in Distribution
  const handleChange = (index, field, value) => {
    const updated = [...distributions];
    updated[index][field] = value;
    setDistributions(updated);
  };

  // 🧠 Structure Data for API
  const transformDistributions = (rawDistributions) => {
    const result = {};
    rawDistributions.forEach((entry) => {
      const locId = entry.location;
      const whId = entry.warehouse;
      const qty = Number(entry.qty || 0);

      if (!result[locId]) {
        result[locId] = {
          locationId: locId,
          locationQty: 0,
          warehouses: [],
        };
      }

      if (whId) {
        result[locId].warehouses.push({ warehouseId: whId, qty });
      } else {
        result[locId].locationQty += qty;
      }
    });

    return Object.values(result);
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item); // Now state is in parent
  };

  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");

    if (response?.status) {
      setCompines(response.data);
    }
  };
  const fetchlocationList = async () => {
    const response = await axios_post(true, "location/com_loc_list");

    if (response?.status) {
      setlocations(response.data); // Don't filter here anymore
    }
  };
  const fetchwarehouseList = async () => {
    const response = await axios_post(true, "warehouse_master/list");
    if (response?.status) {
      setWarehouse(response.data.records); // Don't filter here anymore
    }
  };

  useEffect(() => {
    fetchcompanyList();
    fetchlocationList();
    fetchwarehouseList();
  }, []);

  // 🚀 Handle Submit to API
  const totalDistributed = distributions.reduce(
    (sum, d) => sum + Number(d.qty || 0),
    0
  );
  const remaining = selectedItem?.stock - totalDistributed;

  const structuredData = transformDistributions(distributions);
  const handleSubmit = async () => {
    // const remainingQty = (selectedItem?.stock || 0) - totalDistributed;
    // const exceedsStock = totalDistributed > (selectedItem?.stock || 0);

    const payload = {
      itemId: selectedItem?.id,
      totalStock: selectedItem?.stock || 0,
      distributedStock: structuredData,
      remaining,
      companyId: selectedCompany,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        `${constantApi.baseUrl}/stock_distribution/store`,
        payload
      );

      if (res?.data?.status || res?.status === 200) {
        ToastMassage("Stock distributed successfully", "success");

        // ✅ Reset the form state
        setSelectedItem(null);
        setSelectedCompany("");
        setDistributions([{ location: "", warehouse: "", qty: "" }]);
      } else {
        ToastMassage("Something went wrong", "error");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      ToastMassage("Failed to distribute stock", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDistribution = (indexToRemove) => {
    const updated = distributions.filter((_, i) => i !== indexToRemove);
    setDistributions(updated);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* <UserDetails /> */}
      <ItemList onItemClick={handleItemClick} />

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Stock Distribution
        </h2>

        {/* 🔽 Select Item */}
        {selectedItem ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Selected Item
            </label>
            <div className="p-2 border rounded-md text-sm bg-gray-50">
              <strong>{selectedItem.item_name}</strong>
            </div>
          </div>
        ) : (
          <div className="text-sm text-red-500 mb-4">
            Please select an item from the list above to continue.
          </div>
        )}

        {/* 🧮 Show total stock */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Total Stock
          </label>
          {/* <input
            type="number"
            className="w-full border rounded-md p-2 text-sm"
            // value={selectedItem.stock}
            readOnly
          /> */}

          <input
            type="number"
            className="w-full border rounded-md p-2 text-sm"
            value={selectedItem?.stock || 0}
            readOnly
          />
        </div>

        {/* 🔽 Select Company */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Company
          </label>
          <select
            className="w-full border rounded-md p-2 text-sm"
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              // Reset distribution when company changes
              setDistributions([{ location: "", warehouse: "", qty: "" }]);
            }}
          >
            <option value="">-- Select a Company --</option>
            {compines &&
              compines.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.compdesc}
                </option>
              ))}
          </select>
        </div>
        {/* 🔁 Distribution fields */}
        {distributions.map((dist, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-4 mb-4 items-end relative"
          >
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Location
              </label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={dist.location}
                onChange={(e) =>
                  handleChange(index, "location", e.target.value)
                }
              >
                <option value="">Select Location</option>
                {locations
                  .filter((loc) => loc.compdesc === selectedCompany)
                  .map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.locname}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Warehouse
              </label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={dist.warehouse}
                onChange={(e) =>
                  handleChange(index, "warehouse", e.target.value)
                }
              >
                <option value="">None</option>
                {warehouses
                  .filter(
                    (wh) => String(wh.location_id) === String(dist.location)
                  )
                  .map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.whdesc}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm text-gray-600 block mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2 text-sm"
                  value={dist.qty}
                  onChange={(e) => handleChange(index, "qty", e.target.value)}
                  placeholder="Qty"
                />
              </div>

              {/* ❌ Remove Button */}
              {distributions.length > 1 && (
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 mt-6"
                  onClick={() => handleRemoveDistribution(index)}
                >
                  ❌
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            onClick={handleAddDistribution}
          >
            + Add More
          </button>

          <div className="text-sm text-gray-700">
            Distributed:{" "}
            <strong>
              {distributions.reduce((sum, d) => sum + Number(d.qty || 0), 0)}
            </strong>{" "}
            | Remaining:{" "}
            <strong>
              {(selectedItem?.stock || 0) -
                distributions.reduce((sum, d) => sum + Number(d.qty || 0), 0)}
            </strong>
          </div>
        </div>

        <button
          className={`w-full py-2 rounded-md text-sm ${
            remaining < 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          onClick={handleSubmit}
          disabled={!selectedItem || loading || remaining < 0}
        >
          {loading ? "Submitting..." : "Submit Distribution"}
        </button>

        {/* ❗ Warning Message */}
        {remaining < 0 && (
          <p className="text-sm text-red-600 mt-2">
            Quantity exceeds available stock. Please adjust.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StockDistributor;
