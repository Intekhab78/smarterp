import React, { useEffect, useState } from "react";
import axios from "axios";
import { axios_post } from "../../axios";
import constantApi from "constantApi";

export default function CompanyLocationItemSetting() {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [mainCompanies, setMainCompanies] = useState([]);
  const [subCompanies, setSubCompanies] = useState([]);

  const [locations, setLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSubCompany, setSelectedSubCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [settingsList, setSettingsList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCompanyLoaded, setIsCompanyLoaded] = useState(false);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  // ---------------------------------------------------------
  // FETCH SAVED SETTINGS
  // ---------------------------------------------------------
  const fetchSavedSettings = async () => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/filter_by_comp_loc/list`
      );
      console.log("fetchSavedSettings", response.data);

      if (response?.data?.status && response?.data?.data?.length > 0) {
        setSettingsList(response.data.data);
        setIsEditMode(true);
      }
    } catch (error) {
      console.error("Failed to fetch saved settings", error);
    }
  };

  // ---------------------------------------------------------
  // FETCH ALL COMPANIES
  // ---------------------------------------------------------
  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/com_list");

    if (response?.status) {
      const all = response.data;
      setCompanies(all);
      setAllCompanies(all);

      const mains = all.filter((c) => c.is_main_comp === "yes");
      setMainCompanies(mains);

      setIsCompanyLoaded(true);
    }
  };

  // ---------------------------------------------------------
  // FETCH ALL LOCATIONS
  // ---------------------------------------------------------
  const fetchAllLocations = async () => {
    const response = await axios_post(true, "location/loc_list", {});

    if (response?.status) {
      setAllLocations(response.data);
      setIsLocationLoaded(true);
    }
  };

  useEffect(() => {
    fetchCompanyList();
    fetchAllLocations();
    fetchSavedSettings();
  }, []);

  // ---------------------------------------------------------
  // SUB COMPANIES WHEN MAIN COMPANY CHANGES
  // ---------------------------------------------------------
  useEffect(() => {
    if (!selectedCompany) {
      setSubCompanies([]);
      setSelectedSubCompany("");
      setLocations([]);
      setSelectedLocation("");
      return;
    }

    const subs = companies.filter(
      (c) => c.main_company_id === Number(selectedCompany)
    );

    setSubCompanies(subs);
    setSelectedSubCompany("");
    setLocations([]);
    setSelectedLocation("");
  }, [selectedCompany, companies]);

  // ---------------------------------------------------------
  // FETCH LOCATIONS OF SELECTED COMPANY
  // ---------------------------------------------------------
  const fetchLocationList = async (companyId) => {
    if (!companyId) return;

    const response = await axios_post(true, "location/loc_list", {
      company_id: companyId,
    });

    if (response?.status) setLocations(response.data);
  };

  useEffect(() => {
    if (selectedSubCompany) fetchLocationList(selectedSubCompany);
    else if (selectedCompany) fetchLocationList(selectedCompany);
  }, [selectedSubCompany, selectedCompany]);

  // ---------------------------------------------------------
  // ADD SETTING
  // ---------------------------------------------------------
  const addSetting = () => {
    if (!selectedCompany) {
      alert("Please select Main Company");
      return;
    }

    const exists = settingsList.some(
      (item) =>
        item.main_company_id === Number(selectedCompany) &&
        item.sub_company_id ===
          (selectedSubCompany ? Number(selectedSubCompany) : null) &&
        item.location_id ===
          (selectedLocation ? Number(selectedLocation) : null)
    );

    if (exists) {
      alert("This setting already exists");
      return;
    }

    setSettingsList((prev) => [
      ...prev,
      {
        main_company_id: Number(selectedCompany),
        sub_company_id: selectedSubCompany ? Number(selectedSubCompany) : null,
        location_id: selectedLocation ? Number(selectedLocation) : null,
      },
    ]);
  };

  const removeSetting = (index) => {
    setSettingsList((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------------------------------------
  // SAVE SETTINGS
  // ---------------------------------------------------------
  const saveOrUpdateSettings = async () => {
    if (settingsList.length === 0) return alert("No settings to save");

    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/filter_by_comp_loc/save`,
        {
          settings: settingsList,
          created_by: "admin",
        }
      );

      if (response.data.status) {
        alert(
          isEditMode
            ? "Settings updated successfully"
            : "Settings saved successfully"
        );
        setIsEditMode(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  // ---------------------------------------------------------
  // SAFE MAPPING FUNCTIONS
  // ---------------------------------------------------------
  const getCompanyName = (id) => {
    const comp = allCompanies.find((c) => Number(c.id) === Number(id));
    return comp?.compdesc || "-";
  };

  const getLocationName = (id) => {
    const loc = allLocations.find((l) => Number(l.id) === Number(id));
    return loc?.locname || loc?.locdesclong || loc?.loccode || "-";
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow text-xs">
      <h2 className="text-lg font-semibold ">Company Location Settings</h2>
      <p>Companies linked with ecom portal</p>
      {/* ------------------ DROPDOWNS ------------------ */}
      <div className="flex flex-wrap gap-3 my-4">
        {/* MAIN COMPANY */}
        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 font-medium">Main Company</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select Main Company</option>
            {mainCompanies.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.compdesc}
              </option>
            ))}
          </select>
        </div>

        {/* SUB COMPANY */}
        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 font-medium">Sub Company</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedSubCompany}
            onChange={(e) => setSelectedSubCompany(e.target.value)}
            disabled={!subCompanies.length}
          >
            <option value="">All Sub Companies</option>
            {subCompanies.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.compdesc}
              </option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 font-medium">Location</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={!locations.length}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.locname || loc.locdesclong || loc.loccode}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={addSetting}
        className="mb-4 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Setting
      </button>

      {/* ------------------ TABLE ------------------ */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Selected Settings:</h3>

        {settingsList.length === 0 ? (
          <p className="text-gray-500">No settings added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 border">Main Company</th>
                  <th className="px-2 py-1 border">Sub Company</th>
                  <th className="px-2 py-1 border">Location</th>
                  <th className="px-2 py-1 border text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {settingsList.map((s, idx) => {
                  const mainComp = getCompanyName(s.main_company_id);
                  const subComp = s.sub_company_id
                    ? getCompanyName(s.sub_company_id)
                    : "All";

                  const location = s.location_id
                    ? getLocationName(s.location_id)
                    : "All";

                  return (
                    <tr key={idx} className="hover:bg-gray-50 border-b">
                      <td className="px-2 py-1 border">{mainComp}</td>
                      <td className="px-2 py-1 border">{subComp}</td>
                      <td className="px-2 py-1 border">{location}</td>
                      <td className="px-2 py-1 border text-center">
                        <button
                          onClick={() => removeSetting(idx)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button
        onClick={saveOrUpdateSettings}
        className="mt-4 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {isEditMode ? "Update Settings" : "Save All Settings"}
      </button>
    </div>
  );
}
