import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { axios_post } from "../../axios";

export default function EcomHomeSectionManager() {
  const [sections, setSections] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [allCompanies, setAllCompanies] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [locations, setLocations] = useState([]);

  const [activeCompany, setActiveCompany] = useState("");
  const [activeLocation, setActiveLocation] = useState("");
  const [activeWebsite, setActiveWebsite] = useState("");

  /* ================= MASTER DATA ================= */

  const fetchCompanies = async () => {
    const res = await axios_post(true, "company/com_list");
    if (res?.status) setAllCompanies(res.data);
  };

  const fetchAllLocations = async () => {
    const res = await axios_post(true, "location/loc_list", {});
    if (res?.status) setAllLocations(res.data);
  };

  const fetchLocations = async (companyId) => {
    if (!companyId) return;
    const res = await axios_post(true, "location/loc_list", {
      company_id: companyId,
    });
    if (res?.status) setLocations(res.data);
  };

  /* ================= DATA ================= */

  const fetchSections = async () => {
    const res = await axios.get(
      `${constantApi.baseUrl}/ecom-home-section/list`
    );
    setSections(res.data.data || []);
  };

  useEffect(() => {
    fetchSections();
    fetchCompanies();
    fetchAllLocations();
  }, []);

  /* ================= FILTER ================= */

  const filteredSections = sections.filter((s) => {
    if (activeCompany && Number(s.company_id) !== Number(activeCompany))
      return false;
    if (activeLocation && Number(s.location_id) !== Number(activeLocation))
      return false;
    if (activeWebsite && s.website_ref !== activeWebsite) return false;
    return true;
  });

  /* ================= FORM ================= */

  const initialForm = {
    title: "",
    slug: "",
    section_type: "new",
    limit_count: 8,
    sort_order: 1,
    company_id: "",
    location_id: "",
    website_ref: "",
    status: "active",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      await axios.put(
        `${constantApi.baseUrl}/ecom-home-section/update/${editing.id}`,
        form
      );
    } else {
      await axios.post(`${constantApi.baseUrl}/ecom-home-section/create`, form);
    }

    setOpenForm(false);
    setEditing(null);
    setForm(initialForm);
    fetchSections();
  };

  const editSection = (data) => {
    setEditing(data);
    setForm(data);
    fetchLocations(data.company_id);
    setOpenForm(true);
  };

  const toggleStatus = async (id, status) => {
    await axios.put(`${constantApi.baseUrl}/ecom-home-section/status/${id}`, {
      status: status === "active" ? "inactive" : "active",
    });
    fetchSections();
  };

  const getCompanyName = (id) =>
    allCompanies.find((c) => Number(c.id) === Number(id))?.compdesc || "-";

  const getLocationName = (id) =>
    allLocations.find((l) => Number(l.id) === Number(id))?.locname || "-";

  const SECTION_TYPES = [
    { value: "new", label: "New Arrivals" },
    { value: "recommended", label: "Recommended" },
    { value: "best_seller", label: "Best Sellers" },
    { value: "manual", label: "Manual" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto text-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Home Sections</h1>
        <button
          onClick={() => {
            setForm(initialForm);
            setEditing(null);
            setOpenForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Add Section
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={activeCompany}
          onChange={(e) => setActiveCompany(e.target.value)}
          className="input w-56"
        >
          <option value="">All Companies</option>
          {allCompanies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.compdesc}
            </option>
          ))}
        </select>

        <select
          value={activeLocation}
          onChange={(e) => setActiveLocation(e.target.value)}
          className="input w-56"
        >
          <option value="">All Locations</option>
          {allLocations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.locname}
            </option>
          ))}
        </select>

        <input
          placeholder="Website Ref"
          value={activeWebsite}
          onChange={(e) => setActiveWebsite(e.target.value)}
          className="input w-48"
        />
      </div>

      {/* LIST */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Title</th>
              <th>Type</th>
              <th>Company</th>
              <th>Location</th>
              <th>Website</th>
              <th>Order</th>
              <th>Status</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSections.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-medium">{s.title}</td>
                <td>{s.section_type}</td>
                <td>{getCompanyName(s.company_id)}</td>
                <td>{getLocationName(s.location_id)}</td>
                <td>{s.website_ref || "-"}</td>
                <td>{s.sort_order}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      s.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="text-right pr-4 space-x-3">
                  <button
                    onClick={() => editSection(s)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(s.id, s.status)}
                    className="text-gray-600"
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {openForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-xl p-6">
            <h2 className="text-base font-semibold mb-4">
              {editing ? "Edit Section" : "Create Section"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="title"
                  placeholder="Section Title"
                  value={form.title}
                  onChange={handleChange}
                  className="input col-span-2"
                />

                <select
                  name="section_type"
                  value={form.section_type}
                  onChange={handleChange}
                  className="input"
                >
                  {SECTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>

                <input
                  name="limit_count"
                  type="number"
                  placeholder="Items Count"
                  value={form.limit_count}
                  onChange={handleChange}
                  className="input"
                />

                <select
                  name="company_id"
                  value={form.company_id}
                  onChange={(e) => {
                    handleChange(e);
                    fetchLocations(e.target.value);
                  }}
                  className="input"
                >
                  <option value="">Select Company</option>
                  {allCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.compdesc}
                    </option>
                  ))}
                </select>

                <select
                  name="location_id"
                  value={form.location_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.locname}
                    </option>
                  ))}
                </select>

                <input
                  name="website_ref"
                  placeholder="Website Ref"
                  value={form.website_ref}
                  onChange={handleChange}
                  className="input"
                />

                <input
                  name="sort_order"
                  type="number"
                  placeholder="Sort Order"
                  value={form.sort_order}
                  onChange={handleChange}
                  className="input"
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
