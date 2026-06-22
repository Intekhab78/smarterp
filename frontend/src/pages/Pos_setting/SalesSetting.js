import React, { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { axios_post } from "../../axios";

export default function SalesSetting() {
  const [allowNegativeStock, setAllowNegativeStock] = useState(false);
  const [loading, setLoading] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // ======================================================
  // FETCH COMPANIES
  // ======================================================
  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    console.log("FETCH COMPANIES:", response);

    if (response?.status) {
      const allCompanies = response.data;

      // filter: remove main company
      const filtered = allCompanies.filter((c) => c.is_main_comp !== "yes");

      setCompanies(filtered.length ? filtered : allCompanies);
    }
  };

  // ======================================================
  // FETCH LOCATIONS BASED ON COMPANY
  // ======================================================
  const fetchLocationList = async (companyId) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id: companyId,
    });

    console.log("FETCH LOCATIONS:", response);

    if (response?.status) {
      setLocations(response.data);
    } else {
      setLocations([]);
    }
  };

  // Load companies on page load
  useEffect(() => {
    fetchCompanyList();
  }, []);

  // On company change fetch location
  useEffect(() => {
    if (!selectedCompany) return;

    fetchLocationList(selectedCompany); // send ONLY company id

    setSelectedLocation("");
    setAllowNegativeStock(false);
  }, [selectedCompany]);

  // ======================================================
  // LOAD SETTINGS ONLY WHEN BOTH SELECTED
  // ======================================================
  useEffect(() => {
    if (!selectedCompany || !selectedLocation) return;

    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/get_setting/system-settings/${selectedCompany}/${selectedLocation}`
        );

        const data = res.data.data || {};

        if (data.allow_negative_stock !== undefined) {
          setAllowNegativeStock(data.allow_negative_stock === "1");
        }
      } catch (error) {
        console.log("Error loading settings:", error);
      }
    };

    fetchSettings();
  }, [selectedCompany, selectedLocation]);

  // ======================================================
  // SAVE SETTINGS
  // ======================================================
  const handleSave = async () => {
    if (!selectedCompany || !selectedLocation) {
      alert("Please select Company and Location first!");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${constantApi.baseUrl}/system_setting/update_setting/${selectedCompany}/${selectedLocation}`,
        {
          key: "allow_negative_stock",
          value: allowNegativeStock ? "1" : "0",
        }
      );

      alert("Settings saved successfully!");
    } catch (error) {
      console.log("Error saving settings:", error);
    }

    setLoading(false);
  };

  // ======================================================
  // UI
  // ======================================================

  useEffect(() => {
    if (!selectedCompany || !selectedLocation) return;

    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/system_setting/get_setting/${selectedCompany}/${selectedLocation}`
        );

        const data = res.data.data || {};

        console.log("Fetched Settings:", data);

        if (data.allow_negative_stock !== undefined) {
          setAllowNegativeStock(data.allow_negative_stock == 1);
        }
      } catch (error) {
        console.log("Error loading settings:", error);
      }
    };

    fetchSettings();
  }, [selectedCompany, selectedLocation]);

  return (
    <div className="p-6 md:p-10 max-w-xl">
      {/* COMPANY + LOCATION IN ONE ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* COMPANY */}
        <div>
          <label className="text-sm font-medium">Company</label>
          <select
            className="w-full border px-2 py-1.5 text-sm rounded mt-1"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.compdesc}
              </option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div>
          <label className="text-sm font-medium">Location</label>
          <select
            className="w-full border px-2 py-1.5 text-sm rounded mt-1"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={!selectedCompany}
          >
            <option value="">Select</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.locname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SETTINGS CARD */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-medium">Allow Negative Stock</h2>
            <p className="text-xs text-gray-500">
              Allow stock to go below zero.
            </p>
          </div>

          {/* TOGGLE SWITCH */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={allowNegativeStock}
              onChange={() => setAllowNegativeStock(!allowNegativeStock)}
              disabled={!selectedCompany || !selectedLocation}
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5 duration-300"></span>
          </label>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={loading || !selectedCompany || !selectedLocation}
          className="bg-blue-600 text-white px-5 py-1.5 rounded-lg shadow hover:bg-blue-700 text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
