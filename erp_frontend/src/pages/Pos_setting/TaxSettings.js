import { useEffect, useState } from "react";
import axios from "axios";
import { ToastMassage } from "../../toast";
import constantApi from "constantApi";

function TaxSettings({ onUpdate }) {
  const [taxOptions, setTaxOptions] = useState([]); // list from API
  const [selectedTaxUuid, setSelectedTaxUuid] = useState(""); // UUID of selected record
  const [taxType, setTaxType] = useState(""); // selected tax_name
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all tax settings for dropdown
  const fetchTaxSettingsList = async () => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/taxSettingsRoute/tax-list`
      );
      console.log("res data is ", res.data);

      if (res.data.success) {
        setTaxOptions(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedTaxUuid(res.data.data[0].uuid);
          setTaxType(res.data.data[0].tax_name);
        }
      } else {
        ToastMassage(res.data.message || "Failed to fetch settings", "error");
      }
    } catch (error) {
      ToastMassage("Error fetching tax settings", "error");
    }
  };

  useEffect(() => {
    fetchTaxSettingsList();
  }, []);

  // ✅ Update selected tax type

  const handleUpdate = async () => {
    if (!taxType) {
      ToastMassage("No tax type selected", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${constantApi.baseUrl}/taxSettingsRoute/tax_setting_status`,
        { tax_name: taxType }
      );

      if (res.data.success) {
        ToastMassage(res.data.message, "success");
        if (onUpdate) onUpdate();
      } else {
        ToastMassage(res.data.message || "Update failed", "error");
      }
    } catch (error) {
      ToastMassage("Error updating tax type", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="bg-white border rounded-lg p-4 w-80 shadow-sm">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Select Tax Setting
        </label>

        <select
          value={selectedTaxUuid}
          onChange={(e) => {
            const selected = taxOptions.find((t) => t.uuid === e.target.value);
            setSelectedTaxUuid(selected.uuid);
            setTaxType(selected.tax_name);
          }}
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {taxOptions.map((item) => (
            <option key={item.uuid} value={item.uuid}>
              {item.tax_name.charAt(0).toUpperCase() + item.tax_name.slice(1)}
            </option>
          ))}
        </select>

        {/* <label className="block text-sm font-medium text-gray-600 mb-1 mt-3">
          Tax Type
        </label>

        <select
          value={taxType}
          onChange={(e) => setTaxType(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="inclusive">Inclusive</option>
          <option value="exclusive">Exclusive</option>
        </select> */}

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full mt-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <p className="mt-3 text-xs text-gray-500">
          Selected:{" "}
          <span className="font-medium text-blue-600 capitalize">
            {taxType}
          </span>
        </p>
      </div>
    </div>
  );
}

export default TaxSettings;
