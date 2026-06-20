import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";
import { axios_post } from "../../axios";

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [mainCompanies, setMainCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [activeWebsite, setActiveWebsite] = useState("");

  const fetchCompanies = async () => {
    const res = await axios_post(true, "company/com_list");
    if (res?.status) {
      setAllCompanies(res.data);
      setMainCompanies(res.data.filter((c) => c.is_main_comp === "yes"));
    }
  };
  const fetchLocations = async (companyId) => {
    if (!companyId) return;
    const res = await axios_post(true, "location/loc_list", {
      company_id: companyId,
    });
    console.log("res is ---------from location ---------", res.data);

    if (res?.status) setLocations(res.data);
  };

  const fetchAllLocations = async () => {
    const res = await axios_post(true, "location/loc_list", {});
    if (res?.status) {
      setAllLocations(res.data);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchCompanies();
    fetchAllLocations(); // ✅ IMPORTANT
  }, []);

  const initialForm = {
    banner_cat: "HOME",
    banner_title: "",
    banner_sub_title: "",
    company: "",
    location: "",
    website: "",
    banner_position: "TOP",
    note_1: "",
    note_2: "",
    status: 1,
    banner_image: null,
  };

  const [form, setForm] = useState(initialForm);

  /* ================= FETCH ================= */
  const fetchBanners = async () => {
    const res = await axios.get(`${constantApi.baseUrl}/ecomBanner/list`);
    setBanners(res.data.data);
  };

  const filteredBanners = banners.filter((b) => {
    if (activeCompany && Number(b.company) !== Number(activeCompany))
      return false;

    if (activeLocation && Number(b.location) !== Number(activeLocation))
      return false;

    if (activeWebsite && b.website !== activeWebsite) return false;

    return true;
  });

  const websiteOptions = [
    ...new Set(
      banners.map((b) => b.website).filter((w) => w && w.trim() !== "")
    ),
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== "") fd.append(k, v);
    });

    try {
      if (editing) {
        await axios.put(
          `${constantApi.baseUrl}/ecomBanner/update/${editing.id}`,
          fd
        );
      } else {
        await axios.post(`${constantApi.baseUrl}/ecomBanner/create`, fd);
      }

      setOpenForm(false);
      setEditing(null);
      setForm(initialForm);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  /* ================= EDIT ================= */
  const editBanner = (banner) => {
    setEditing(banner);
    setForm({ ...banner, banner_image: null });
    setOpenForm(true);
  };

  /* ================= DELETE ================= */
  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    await axios.delete(`${constantApi.baseUrl}/ecomBanner/delete/${id}`);
    fetchBanners();
  };

  /* ================= STATUS ================= */
  const toggleStatus = async (id) => {
    await axios.patch(`${constantApi.baseUrl}/ecomBanner/${id}/status`);
    fetchBanners();
  };

  const getCompanyName = (id) => {
    const c = allCompanies.find((x) => Number(x.id) === Number(id));
    console.log("c is ---------", c);

    return c?.compdesc || "-";
  };

  const getLocationName = (id) => {
    const l = allLocations.find((x) => Number(x.id) === Number(id));
    console.log("ln is ---------", l);

    return l?.locname || l?.locdesclong || "-";
  };

  const BANNER_CATEGORIES = [
    { value: "HOME", label: "Home Page" },
    { value: "PRODUCT", label: "Product Page" },
    { value: "CATEGORY", label: "Category Page" },
    { value: "OFFER", label: "Offers / Deals" },
    { value: "BRAND", label: "Brand Page" },
    { value: "CART", label: "Cart Page" },
    { value: "CHECKOUT", label: "Checkout Page" },
    { value: "SEARCH", label: "Search Results" },
    { value: "LOGIN", label: "Login / Signup" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-6 max-w-7xl mx-auto text-sm">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Banner Management</h1>
          <button
            onClick={() => {
              setForm(initialForm);
              setEditing(null);
              setOpenForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Add Banner
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* WEBSITE FILTER */}
          <select
            value={activeWebsite}
            onChange={(e) => setActiveWebsite(e.target.value)}
            className="input w-64"
          >
            <option value="">All Websites</option>
            {websiteOptions.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>

          {/* RESET */}
          <button
            onClick={() => {
              setActiveCompany(null);
              setActiveLocation(null);
              setActiveWebsite("");
            }}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Reset Filters
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBanners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border hover:shadow transition"
            >
              {/* <img
                src={`${constantApi.imageUrl}/Website_Banner/${b.banner_image}`}
                className="h-40 w-full object-cover rounded-t-xl"
              /> */}
              <img
                src={`${constantApi.imageUrl}/Website_Banner/${b.banner_image}`}
                className="h-40 w-full object-cover rounded-t-xl"
                onError={(e) => (e.currentTarget.src = "/no-image.png")}
              />

              <div className="p-4 space-y-1">
                <h3 className="font-medium">{b.banner_title}</h3>
                <p className="text-xs text-gray-500">{b.banner_sub_title}</p>
                <p className="text-xs text-gray-500">
                  {getCompanyName(b.company)} • {getLocationName(b.location)}
                </p>

                <div className="flex justify-between items-center pt-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      b.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {b.status ? "Active" : "Inactive"}
                  </span>

                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={() => editBanner(b)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(b.id)}
                      className="text-gray-600"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => deleteBanner(b.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {openForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-xl p-6">
              <h2 className="text-base font-semibold mb-4">
                {editing ? "Edit Banner" : "Create Banner"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="banner_title"
                    placeholder="Title"
                    value={form.banner_title}
                    onChange={handleChange}
                    className="input"
                  />
                  <input
                    name="banner_sub_title"
                    placeholder="Sub title"
                    value={form.banner_sub_title}
                    onChange={handleChange}
                    className="input"
                  />
                  <select
                    name="company"
                    value={form.company}
                    onChange={(e) => {
                      handleChange(e);
                      fetchLocations(e.target.value);
                    }}
                    className="input"
                  >
                    <option value="">Select Company</option>
                    {mainCompanies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.compdesc}
                      </option>
                    ))}
                  </select>

                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="input"
                    disabled={!locations.length}
                  >
                    <option value="">Select Location</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.locname || l.locdesclong}
                      </option>
                    ))}
                  </select>

                  <input
                    name="website"
                    placeholder="Website URL"
                    value={form.website}
                    onChange={handleChange}
                    className="input md:col-span-2"
                  />
                  <input
                    name="note_1"
                    placeholder="Note 1"
                    value={form.note_1}
                    onChange={handleChange}
                    className="input"
                  />
                  <input
                    name="note_2"
                    placeholder="Note 2"
                    value={form.note_2}
                    onChange={handleChange}
                    className="input"
                  />

                  <select
                    name="banner_cat"
                    value={form.banner_cat}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select Banner Category</option>

                    {BANNER_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>

                  <select
                    name="banner_position"
                    value={form.banner_position}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="TOP">Top</option>
                    <option value="MIDDLE">Middle</option>
                    <option value="BOTTOM">Bottom</option>
                  </select>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>

                  <input
                    type="file"
                    name="banner_image"
                    onChange={handleChange}
                    className="text-xs"
                  />
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
    </DashboardLayout>
  );
}
