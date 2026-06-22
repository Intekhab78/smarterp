import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";

const API_BASE = "http://localhost:5610/api";

export default function DepartmentVisibilitySettings() {
  const [mainCompanies, setMainCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedMainCompany, setSelectedMainCompany] = useState(null);
  const [selectedSubCompany, setSelectedSubCompany] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [websiteKey, setWebsiteKey] = useState("");

  // Store permissions: { [departmentId]: boolean }
  const [selectedDepartments, setSelectedDepartments] = useState({});

  // Fetch companies
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
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    }
    fetchCompanies();
  }, []);

  // Fetch locations
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/location/loc_list`
        );
        if (res.data?.status) {
          setAllLocations(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations", error);
      }
    }
    fetchLocations();
  }, []);

  // Fetch all departments on mount
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/item_department/list`
        );
        if (res.data?.status) {
          setDepartments(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    }
    fetchDepartments();
  }, []);

  // Sub companies based on main company
  const subCompanies = allCompanies.filter(
    (c) => c.main_company_id === (selectedMainCompany?.id || -1)
  );

  // Locations for selected sub company
  const locations = allLocations.filter(
    (loc) => loc.compdesc === String(selectedSubCompany?.id)
  );

  // Filter departments by selected sub company and location
  const filteredDepartments = departments.filter(
    (dept) =>
      dept.company_id === selectedSubCompany?.id &&
      dept.location_id === selectedLocation?.id
  );

  // Toggle department selection
  const toggleDepartment = (deptId) => {
    setSelectedDepartments((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  // Save all selected departments in bulk
  const saveMappings = async () => {
    if (
      !selectedSubCompany?.id ||
      !selectedLocation?.id ||
      websiteKey.trim() === ""
    ) {
      alert("Please select sub company, location and enter website key");
      return;
    }

    const selectedDeptIds = Object.entries(selectedDepartments)
      .filter(([_, isSelected]) => isSelected)
      .map(([deptId]) => parseInt(deptId));

    try {
      const payload = {
        company_id: selectedSubCompany.id,
        location_id: selectedLocation.id,
        website_key: websiteKey,
        department_ids: selectedDeptIds,
      };

      const res = await axios.post(
        `${constantApi.baseUrl}/department_mapping/save_bulk`,
        payload
      );
      console.log("payload is -------------", payload);

      if (res.data?.status) {
        console.log("Saved department mappings:", selectedDeptIds);
        alert("Department visibility saved successfully!");
      } else {
        alert("Failed to save department visibility.");
      }
    } catch (error) {
      console.error("Error saving department mappings", error);
      alert("Error saving department visibility. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans text-xs">
      {/* Main Company */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Main Company:</label>
        <div className="flex gap-2 flex-wrap">
          {mainCompanies.map((comp) => (
            <button
              key={comp.id}
              className={`px-3 py-1 rounded border ${
                selectedMainCompany?.id === comp.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => {
                setSelectedMainCompany(comp);
                setSelectedSubCompany(null);
                setSelectedLocation(null);
                setSelectedDepartments({});
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
          <label className="block font-semibold mb-1">Sub Company:</label>
          <div className="flex gap-2 flex-wrap">
            {subCompanies.length > 0 ? (
              subCompanies.map((comp) => (
                <button
                  key={comp.id}
                  className={`px-3 py-1 rounded border ${
                    selectedSubCompany?.id === comp.id
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedSubCompany(comp);
                    setSelectedLocation(null);
                    setSelectedDepartments({});
                    setWebsiteKey("");
                  }}
                >
                  {comp.compdesc}
                </button>
              ))
            ) : (
              <p className="text-gray-500 italic">No sub companies found</p>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {selectedSubCompany && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Location:</label>
          <select
            className="border rounded px-2 py-1 w-full max-w-xs"
            value={selectedLocation?.id || ""}
            onChange={(e) => {
              const loc = locations.find((l) => l.id === +e.target.value);
              setSelectedLocation(loc);
              setSelectedDepartments({});
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
          <label className="block font-semibold mb-1">Website Key:</label>
          <input
            type="text"
            value={websiteKey}
            placeholder="e.g. ecom, charity"
            onChange={(e) => setWebsiteKey(e.target.value.trim())}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      )}

      {/* Departments filtered by company and location */}
      {selectedLocation && websiteKey && (
        <div>
          <h3 className="font-semibold mb-2">Departments Visibility</h3>
          <div className="max-h-72 overflow-y-auto border rounded p-2">
            {filteredDepartments.length === 0 ? (
              <p className="text-gray-500 italic">No departments found.</p>
            ) : (
              filteredDepartments.map((dept) => (
                <label
                  key={dept.id}
                  className="flex items-center gap-2 mb-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={!!selectedDepartments[dept.id]}
                    onChange={() => toggleDepartment(dept.id)}
                  />
                  <span>{dept.itemdeptname}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
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
