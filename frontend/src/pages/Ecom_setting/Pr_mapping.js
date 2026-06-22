import React, { useEffect, useState } from "react";
import axios from "axios";
import { axios_post } from "../../axios";
import constantApi from "constantApi";

export default function Pr_mapping() {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [mainCompanies, setMainCompanies] = useState([]);
  const [subCompanies, setSubCompanies] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [openSubs, setOpenSubs] = useState({});
  const [selectedCompany, setSelectedCompany] = useState("");

  const [settingsList, setSettingsList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // ============================
  // FETCH SAVED SETTINGS
  // ============================
  const fetchSavedSettings = async () => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/filter_by_comp_loc/list`
      );

      if (res?.data?.status && res?.data?.data?.length > 0) {
        setSettingsList(res.data.data);
        setIsEditMode(true);
      }
    } catch (err) {
      console.error("fetchSavedSettings failed:", err);
    }
  };

  // ============================
  // FETCH COMPANIES
  // ============================
  const fetchCompanyList = async () => {
    const res = await axios_post(true, "company/com_list");

    if (res?.status) {
      const all = res.data;
      setCompanies(all);
      setAllCompanies(all);

      const mains = all.filter((c) => c.is_main_comp === "yes");
      setMainCompanies(mains);
    }
  };

  // ============================
  // FETCH ALL LOCATIONS
  // ============================
  const fetchAllLocations = async () => {
    const res = await axios_post(true, "location/loc_list");
    if (res?.status) setAllLocations(res.data);
  };

  useEffect(() => {
    fetchCompanyList();
    fetchAllLocations();
    fetchSavedSettings();
  }, []);

  // ============================
  // UPDATE SUB COMPANIES
  // ============================
  useEffect(() => {
    if (!selectedCompany) return setSubCompanies([]);

    const subs = companies.filter(
      (c) => c.main_company_id === Number(selectedCompany)
    );
    setSubCompanies(subs);
  }, [selectedCompany, companies]);

  // ============================
  // HELPERS
  // ============================
  const removeSpecificLocation = (subId, locId) => {
    setSettingsList((prev) =>
      prev.filter(
        (p) => !(p.sub_company_id === subId && p.location_id === Number(locId))
      )
    );
  };

  const isSubCompanyFullySelected = (subId, subLocs) => {
    return subLocs.every((loc) =>
      settingsList.some(
        (s) => s.sub_company_id === subId && s.location_id === Number(loc.id)
      )
    );
  };

  const isLocationSelected = (subId, locId) =>
    settingsList.some(
      (s) => s.sub_company_id === subId && s.location_id === Number(locId)
    );

  // ============================
  // SAVE SETTINGS
  // ============================
  const [priceLists, setPriceLists] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  // ---------------- FETCH ACTIVE PRICELISTS ------------------
  const fetchPriceMasterList = async () => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/price_list_master/list`
      );
      const active = res.data.data.filter((i) => i.status === "active");
      console.log("active pr is ----------", active);

      setPriceLists(active);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchPriceMasterList();
  }, []);

  const saveOrUpdateSettings = async () => {
    if (settingsList.length === 0) return alert("No settings added");

    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/pr_apply_settings/create`,

        {
          pr_code: selectedCode,
          settings: settingsList,
        }
      );

      if (res.data.status) {
        alert(
          isEditMode
            ? "Settings updated successfully"
            : "Settings saved successfully"
        );
        setIsEditMode(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save settings");
    }
  };

  const saveOrUpdateSettings1 = async () => {
    // if (settingsList.length === 0) return alert("No settings added");
    console.log("settingsList---------", settingsList);
    console.log("selectedCode---------", selectedCode);
  };

  const getCompanyName = (id) => {
    const comp = allCompanies.find((c) => Number(c.id) === Number(id));
    return comp?.compdesc || "-";
  };

  const getLocationName = (id) => {
    const loc = allLocations.find((l) => Number(l.id) === Number(id));
    return loc?.locname || loc?.locdesclong || "-";
  };

  const removeSettingRow = (index) => {
    setSettingsList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow text-xs">
      <h2 className="text-lg font-semibold mb-4">Company Location Settings</h2>

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

      {/* MAIN COMPANY */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Main Company</label>
        <select
          className="w-full border px-2 py-1 rounded"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">Select Main Company</option>
          {mainCompanies.map((m) => (
            <option key={m.id} value={m.id}>
              {m.compdesc}
            </option>
          ))}
        </select>
      </div>

      {/* SUB COMPANIES */}
      {subCompanies.length > 0 && (
        <div className="border rounded p-3">
          <h3 className="font-semibold mb-2">Select Sub Company & Locations</h3>

          {subCompanies.map((sub) => {
            const subId = sub.id;

            const subLocs = allLocations.filter(
              (l) => Number(l.compdesc) === Number(subId)
            );

            const allSelected = isSubCompanyFullySelected(subId, subLocs);

            return (
              <div key={subId} className="mb-4 border-b pb-2">
                {/* SUB COMPANY CHECKBOX */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => {
                      if (allSelected) {
                        // remove all its locations
                        setSettingsList((prev) =>
                          prev.filter((p) => p.sub_company_id !== subId)
                        );
                      } else {
                        // Add ALL locations for this sub-company
                        const newRows = subLocs.map((loc) => ({
                          main_company_id: Number(selectedCompany),
                          sub_company_id: subId,
                          location_id: Number(loc.id),
                        }));

                        setSettingsList((prev) => [
                          ...prev.filter((p) => p.sub_company_id !== subId),
                          ...newRows,
                        ]);
                      }
                    }}
                  />

                  <span
                    className="font-medium cursor-pointer text-blue-600"
                    onClick={() =>
                      setOpenSubs((prev) => ({
                        ...prev,
                        [subId]: !prev[subId],
                      }))
                    }
                  >
                    {sub.compdesc}
                  </span>
                </div>

                {/* LOCATION LIST */}
                {openSubs[subId] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {subLocs.length === 0 ? (
                      <p className="text-red-600 text-xs">
                        No locations available for this sub-company
                      </p>
                    ) : (
                      subLocs.map((loc) => {
                        const selected = isLocationSelected(subId, loc.id);

                        return (
                          <div key={loc.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                if (selected) {
                                  removeSpecificLocation(subId, loc.id);
                                } else {
                                  setSettingsList((prev) => [
                                    ...prev,
                                    {
                                      main_company_id: Number(selectedCompany),
                                      sub_company_id: subId,
                                      location_id: Number(loc.id),
                                    },
                                  ]);
                                }
                              }}
                            />
                            <span>{loc.locname}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DISPLAY CURRENT SETTINGS */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Selected Settings</h3>

        {settingsList.length === 0 ? (
          <p>No settings added yet.</p>
        ) : (
          <table className="w-full text-xs border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Main Company</th>
                <th className="border px-2 py-1">Sub Company</th>
                <th className="border px-2 py-1">Location</th>
                <th className="border px-2 py-1 w-8"></th> {/* for X button */}
              </tr>
            </thead>
            <tbody>
              {settingsList.map((s, i) => (
                <tr key={i} className="relative">
                  <td className="border px-2 py-1">
                    {getCompanyName(s.main_company_id)}
                  </td>
                  <td className="border px-2 py-1">
                    {getCompanyName(s.sub_company_id)}
                  </td>
                  <td className="border px-2 py-1">
                    {getLocationName(s.location_id)}
                  </td>
                  <td className="border px-2 py-1 w-8 text-center">
                    <button
                      onClick={() => removeSettingRow(i)}
                      className="text-red-600 font-bold hover:text-red-800"
                      title="Remove"
                      type="button"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={saveOrUpdateSettings}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        {isEditMode ? "Update Settings" : "Save Settings"}
      </button>
    </div>
  );
}
