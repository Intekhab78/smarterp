import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";

const DEFAULT_RULES = [
  { field_name: "images", allow_null: true, status: true },
  { field_name: "itemprice", allow_null: false, status: true },
  { field_name: "remaining_stock", allow_null: false, status: true },
];

export default function ItemVisibilityPermission() {
  // -------------------- STATE --------------------
  const [allCompanies, setAllCompanies] = useState([]);
  const [mainCompanies, setMainCompanies] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const [allLocations, setAllLocations] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedOrganisation, setSelectedOrganisation] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // RULES state & flags
  const [rules, setRules] = useState([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [noRulesFound, setNoRulesFound] = useState(false);

  // -------------------- FETCH COMPANIES --------------------
  const fetchCompanyList = async () => {
    try {
      const res = await axios.post(`${constantApi.baseUrl}/company/com_list`);
      console.log("Companies:", res.data);

      if (res?.data?.status) {
        setAllCompanies(res.data.data);
        setMainCompanies(res.data.data.filter((c) => c.is_main_comp === "yes"));
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // -------------------- FETCH LOCATIONS --------------------
  const fetchLocations = async () => {
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/location/loc_list`,
        {}
      );
      console.log("Locations:", res.data);

      if (res?.data?.status) {
        setAllLocations(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchCompanyList();
    fetchLocations();
  }, []);

  // -------------------- ORG → COMPANY --------------------
  useEffect(() => {
    if (!selectedOrganisation) {
      setCompanyList([]);
      setSelectedCompany("");
      setSelectedLocation("");
      setRules([]);
      setNoRulesFound(false);
      return;
    }

    const companies = allCompanies.filter(
      (c) => c.main_company_id === Number(selectedOrganisation)
    );

    setCompanyList(companies);
    setSelectedCompany("");
    setSelectedLocation("");
    setRules([]);
    setNoRulesFound(false);
  }, [selectedOrganisation, allCompanies]);

  // -------------------- COMPANY → LOCATION --------------------
  useEffect(() => {
    if (!selectedCompany) {
      setLocations([]);
      setSelectedLocation("");
      setRules([]);
      setNoRulesFound(false);
      return;
    }

    const filteredLocations = allLocations.filter(
      (loc) => String(loc.compdesc) === String(selectedCompany)
    );

    setLocations(filteredLocations);
    setSelectedLocation("");
    setRules([]);
    setNoRulesFound(false);
  }, [selectedCompany, allLocations]);

  // -------------------- FETCH SAVED RULES --------------------
  const fetchVisibilityRules = async (
    organisation_id,
    company_id,
    location_id
  ) => {
    setLoadingRules(true);
    setNoRulesFound(false);
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/item_visibility/list`,
        {
          params: {
            organisation_id,
            company_id,
            location_id,
          },
        }
      );

      console.log("FETCH RULES 👉", res.data);

      if (
        res.data?.message === "Item visibility rules fetched successfully" &&
        res.data.data?.length
      ) {
        setRules(
          res.data.data.map((rule) => ({
            field_name: rule.field_name,
            allow_null: Boolean(rule.allow_null),
            status: Boolean(rule.status),
          }))
        );
        setNoRulesFound(false);
      } else {
        setRules([]);
        setNoRulesFound(true);
      }
    } catch (error) {
      console.error("Fetch rules error:", error);
      setRules([]);
      setNoRulesFound(true);
    }
    setLoadingRules(false);
  };

  // -------------------- FETCH RULES ON SELECT --------------------
  useEffect(() => {
    if (selectedOrganisation && selectedCompany && selectedLocation) {
      fetchVisibilityRules(
        Number(selectedOrganisation),
        Number(selectedCompany),
        Number(selectedLocation)
      );
    } else {
      setRules([]);
      setNoRulesFound(false);
    }
  }, [selectedOrganisation, selectedCompany, selectedLocation]);

  // -------------------- RULE TOGGLE --------------------
  const toggleValue = (index, key) => {
    const updated = [...rules];
    updated[index][key] = !updated[index][key];
    setRules(updated);
  };

  // -------------------- SUBMIT --------------------
  const handleSubmit = async () => {
    if (!selectedOrganisation || !selectedCompany || !selectedLocation) {
      alert("Please select organisation, company and location");
      return;
    }

    const payload = {
      organisation_id: Number(selectedOrganisation),
      company_id: Number(selectedCompany),
      location_id: Number(selectedLocation),
      rules,
    };

    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/item_visibility/save`,
        payload
      );

      console.log("SAVE RESPONSE 👉", res);

      if (res?.status === 200) {
        alert("Permissions saved successfully ✅");
      } else {
        alert(res?.data?.message || "Failed to save permissions");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong while saving");
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="p-6 max-w-4xl mx-auto text-xs">
      <h2 className="font-semibold mb-4">Item Visibility Permissions</h2>

      {/* SELECTORS */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* ORGANISATION */}
        <div>
          <label className="block mb-1 text-gray-600">Organisation</label>
          <select
            value={selectedOrganisation}
            onChange={(e) => setSelectedOrganisation(e.target.value)}
            className="w-full border rounded px-2 py-1 text-xs"
          >
            <option value="">Select organisation</option>
            {mainCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.compdesc}
              </option>
            ))}
          </select>
        </div>

        {/* COMPANY */}
        <div>
          <label className="block mb-1 text-gray-600">Company</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full border rounded px-2 py-1 text-xs"
            disabled={!selectedOrganisation}
          >
            <option value="">Select company</option>
            {companyList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.compdesc}
              </option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div>
          <label className="block mb-1 text-gray-600">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full border rounded px-2 py-1 text-xs"
            disabled={!selectedCompany}
          >
            <option value="">Select location</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.locname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RULE TABLE */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2">Field</th>
              <th className="text-center px-3 py-2">Allow Null</th>
              <th className="text-center px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loadingRules ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading rules...
                </td>
              </tr>
            ) : noRulesFound ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-4 text-red-600 font-semibold"
                >
                  No rules found for selected Company and Location.
                </td>
              </tr>
            ) : rules.length ? (
              rules.map((rule, index) => (
                <tr key={index} className="border-t">
                  <td className="px-3 py-2">{rule.field_name}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => toggleValue(index, "allow_null")}
                      className={`px-2 py-1 rounded text-[10px] ${
                        rule.allow_null
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rule.allow_null ? "YES" : "NO"}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => toggleValue(index, "status")}
                      className={`px-2 py-1 rounded text-[10px] ${
                        rule.status
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {rule.status ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  {/* No rules or no selection yet */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SAVE */}
      <div className="mt-4 text-right">
        <button
          onClick={handleSubmit}
          disabled={
            !selectedOrganisation || !selectedCompany || !selectedLocation
          }
          className="px-4 py-2 text-xs rounded bg-black text-white disabled:opacity-50"
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
}
