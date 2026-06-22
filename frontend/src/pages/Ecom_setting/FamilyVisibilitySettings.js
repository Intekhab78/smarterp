import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";

export default function FamilyVisibilitySettings() {
  const [mainCompanies, setMainCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [families, setFamilies] = useState([]);

  const [selectedMainCompany, setSelectedMainCompany] = useState(null);
  const [selectedSubCompany, setSelectedSubCompany] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [websiteKey, setWebsiteKey] = useState("");

  // { [familyId]: boolean }
  const [selectedFamilies, setSelectedFamilies] = useState({});

  /* =======================
     Fetch Companies
  ======================= */
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await axios.post(`${constantApi.baseUrl}/company/com_list`);
        if (res.data?.status) {
          setAllCompanies(res.data.data);
          setMainCompanies(
            res.data.data.filter((c) => c.is_main_comp === "yes")
          );
        }
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    }
    fetchCompanies();
  }, []);

  /* =======================
     Fetch Locations
  ======================= */
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/location/loc_list`
        );
        if (res.data?.status) {
          setAllLocations(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching locations", err);
      }
    }
    fetchLocations();
  }, []);

  /* =======================
     Fetch Families
  ======================= */
  useEffect(() => {
    async function fetchFamilies() {
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/family_master/list`
        );
        console.log("response is ----------", res.data);

        if (res.data?.status) {
          setFamilies(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching families", err);
      }
    }
    fetchFamilies();
  }, []);

  /* =======================
     Derived Data
  ======================= */
  const subCompanies = allCompanies.filter(
    (c) => c.main_company_id === (selectedMainCompany?.id || -1)
  );

  const locations = allLocations.filter(
    (loc) => loc.compdesc === String(selectedSubCompany?.id)
  );

  const filteredFamilies = families.filter(
    (fam) =>
      fam.company_id === selectedSubCompany?.id &&
      fam.location_id === selectedLocation?.id
  );

  /* =======================
     Handlers
  ======================= */
  const toggleFamily = (familyId) => {
    setSelectedFamilies((prev) => ({
      ...prev,
      [familyId]: !prev[familyId],
    }));
  };

  const saveMappings = async () => {
    if (!selectedSubCompany?.id || !selectedLocation?.id || !websiteKey) {
      alert("Please select sub company, location and website key");
      return;
    }

    const selectedFamilyIds = Object.entries(selectedFamilies)
      .filter(([_, checked]) => checked)
      .map(([id]) => Number(id));

    try {
      const payload = {
        company_id: selectedSubCompany.id,
        location_id: selectedLocation.id,
        website_key: websiteKey,
        family_ids: selectedFamilyIds,
      };

      const res = await axios.post(
        `${constantApi.baseUrl}/family_mapping/save_bulk`,
        payload
      );

      if (res.data?.status) {
        alert("Family visibility saved successfully!");
      } else {
        alert("Failed to save family visibility");
      }
    } catch (err) {
      console.error("Save error", err);
      alert("Something went wrong");
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="p-4 max-w-4xl mx-auto text-xs">
      {/* Main Company */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Main Company</label>
        <div className="flex gap-2 flex-wrap">
          {mainCompanies.map((comp) => (
            <button
              key={comp.id}
              className={`px-3 py-1 border rounded ${
                selectedMainCompany?.id === comp.id
                  ? "bg-blue-600 text-white"
                  : ""
              }`}
              onClick={() => {
                setSelectedMainCompany(comp);
                setSelectedSubCompany(null);
                setSelectedLocation(null);
                setSelectedFamilies({});
                setWebsiteKey("");
              }}
            >
              {comp.compdesc}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Company */}
      {selectedMainCompany && (
        <div className="mb-4">
          <label className="font-semibold block mb-1">Sub Company</label>
          <div className="flex gap-2 flex-wrap">
            {subCompanies.map((comp) => (
              <button
                key={comp.id}
                className={`px-3 py-1 border rounded ${
                  selectedSubCompany?.id === comp.id
                    ? "bg-green-600 text-white"
                    : ""
                }`}
                onClick={() => {
                  setSelectedSubCompany(comp);
                  setSelectedLocation(null);
                  setSelectedFamilies({});
                  setWebsiteKey("");
                }}
              >
                {comp.compdesc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      {selectedSubCompany && (
        <div className="mb-4 max-w-xs">
          <label className="font-semibold block mb-1">Location</label>
          <select
            className="border px-2 py-1 rounded w-full"
            value={selectedLocation?.id || ""}
            onChange={(e) => {
              const loc = locations.find(
                (l) => l.id === Number(e.target.value)
              );
              setSelectedLocation(loc);
              setSelectedFamilies({});
              setWebsiteKey("");
            }}
          >
            <option value="">-- Select Location --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.locname}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Website Key */}
      {selectedLocation && (
        <div className="mb-4 max-w-xs">
          <label className="font-semibold block mb-1">Website Key</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={websiteKey}
            onChange={(e) => setWebsiteKey(e.target.value.trim())}
            placeholder="e.g. ecom"
          />
        </div>
      )}

      {/* Families */}
      {selectedLocation && websiteKey && (
        <div>
          <h3 className="font-semibold mb-2">Family Visibility</h3>
          <div className="border rounded p-2 max-h-72 overflow-y-auto">
            {filteredFamilies.length === 0 ? (
              <p className="italic text-gray-500">No families found</p>
            ) : (
              filteredFamilies.map((fam) => (
                <label key={fam.id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={!!selectedFamilies[fam.id]}
                    onChange={() => toggleFamily(fam.id)}
                  />
                  <span>{fam.itemfamname}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {/* Save */}
      {selectedLocation && websiteKey && (
        <div className="mt-4">
          <button
            onClick={saveMappings}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
