import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { axios_post } from "../../axios";
import { ToastMassage } from "../../toast";

const PAGE_LIMIT = 20;

export default function EcomHomeSectionItemManager() {
  /* ================= STATE ================= */
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sections, setSections] = useState([]);
  const [department, setDepartment] = useState([]);

  const [products, setProducts] = useState([]);
  const [sectionItems, setSectionItems] = useState([]);

  const [activeCompany, setActiveCompany] = useState("");
  const [activeLocation, setActiveLocation] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("");

  const [search, setSearch] = useState("");
  const [uiMessage, setUiMessage] = useState(null);
  const [uiError, setUiError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(totalItems / PAGE_LIMIT);

  /* ================= HELPERS ================= */
  const resetMessages = () => {
    setUiError(null);
    setUiMessage(null);
  };

  /* ================= FETCH ================= */
  const fetchCompanies = async () => {
    const res = await axios_post(true, "company/com_list");
    if (res?.status) {
      setCompanies(res.data.filter((c) => c.is_main_comp !== "yes"));
    }
  };

  const fetchLocations = async (companyId) => {
    if (!companyId) return;
    const res = await axios_post(true, "location/loc_list", {
      company_id: companyId,
    });
    if (res?.status) setLocations(res.data);
  };

  const fetchSections = async () => {
    const res = await axios.get(
      `${constantApi.baseUrl}/ecom-home-section/list`,
      { params: { company_id: activeCompany, location_id: activeLocation } }
    );
    setSections(res.data.data || []);
  };

  const fetchDepartments = async () => {
    const res = await axios.post(
      `${constantApi.baseUrl}/item_department/list/${activeCompany}/${activeLocation}`
    );
    setDepartment(res.data.data || []);
  };

  const fetchProducts1 = async () => {
    setLoading(true); // start loading

    const res = await axios.post(
      `${constantApi.baseUrl}/item_location_master/filter_list_by_stock_price`,
      null,
      {
        params: {
          company_id: activeCompany,
          location_id: activeLocation,
          page: currentPage,
          limit: PAGE_LIMIT,
        },
      }
    );

    setProducts(res.data.data || []);
    setTotalItems(res.data.total || 0);
  };

  const fetchProducts = async () => {
    setLoading(true); // start loading
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/item_location_master/filter_list_by_stock_price`,
        null,
        {
          params: {
            company_id: activeCompany,
            location_id: activeLocation,
            page: currentPage,
            limit: PAGE_LIMIT,
          },
        }
      );

      setProducts(res.data.data || []);
      setTotalItems(res.data.total || 0);
    } catch (error) {
      setUiError("Failed to fetch products");
      ToastMassage("Failed to fetch products", "error");
    } finally {
      setLoading(false); // end loading
    }
  };

  const fetchSectionItems = async (sectionId) => {
    if (!sectionId) return;
    const res = await axios.get(
      `${constantApi.baseUrl}/ecom-home-section-item/list`,
      { params: { ecom_home_section_id: sectionId } }
    );
    setSectionItems(res.data.data || []);
  };

  /* ================= ADD PRODUCT ================= */
  const addProductToSection = async (product) => {
    if (!activeSection) return;

    try {
      resetMessages();

      const res = await axios.post(
        `${constantApi.baseUrl}/ecom-home-section-item/create`,
        {
          ecom_home_section_id: activeSection,
          item_id: product.id,
        }
      );

      if (res?.data?.success) {
        setUiMessage(res.data.message);
        ToastMassage(res.data.message, "success");
        fetchSectionItems(activeSection);
      } else {
        setUiError(res?.data?.message || "Failed to add product");
        ToastMassage(res?.data?.message || "Failed to add product", "error");
      }
    } catch (error) {
      setUiError("Something went wrong");
      ToastMassage("Something went wrong", "error");
    }
  };

  /* ================= REMOVE PRODUCT ================= */
  /* ================= REMOVE PRODUCT ================= */
  const removeProductFromSection = async (sectionItemId) => {
    if (!sectionItemId) return;

    try {
      resetMessages();

      const res = await axios.delete(
        `${constantApi.baseUrl}/ecom-home-section-item/delete/${sectionItemId}`
      );

      console.log("condhdhd", res);

      if (res?.data?.success) {
        setUiMessage(res.data.message);
        ToastMassage(res.data.message, "success");
        fetchSectionItems(activeSection);
      } else {
        setUiError(res?.data?.message || "Failed to remove product");
        ToastMassage(res?.data?.message || "Failed to remove product", "error");
      }
    } catch (error) {
      setUiError("Something went wrong while removing product");
      ToastMassage("Something went wrong while removing product", "error");
    }
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!activeCompany) return;

    resetMessages();
    setActiveLocation("");
    setActiveSection("");
    setActiveDepartment("");
    setCurrentPage(1);

    fetchLocations(activeCompany);
  }, [activeCompany]);

  useEffect(() => {
    if (!activeCompany || !activeLocation) return;

    resetMessages();
    setActiveSection("");
    setCurrentPage(1);

    fetchSections();
    fetchDepartments();
    fetchProducts();
  }, [activeCompany, activeLocation]);

  useEffect(() => {
    if (!activeCompany || !activeLocation) return;
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    resetMessages();
    if (!activeSection) {
      setSectionItems([]);
      return;
    }
    fetchSectionItems(activeSection);
  }, [activeSection]);

  /* ================= DERIVED DATA ================= */

  // Create a set of item_ids already added to the section to filter out from "Available Products"
  const sectionItemIds = useMemo(() => {
    return new Set(
      sectionItems
        .filter((i) => i.item && i.item.item_id)
        .map((i) => i.item.item_id)
    );
  }, [sectionItems]);

  // Filter products based on search, department, and hide added items
  const filteredProducts = products.filter((p) => {
    if (sectionItemIds.has(p.item_id)) return false;

    if (activeDepartment && Number(p.departname) !== Number(activeDepartment)) {
      // console.log("Filtered out by department");
      return false;
    }

    if (search && !p.itemdesc?.toLowerCase().includes(search.toLowerCase()))
      return false;

    return true;
  });

  /* ================= PAGINATION ================= */
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen text-sm">
      <h1 className="text-2xl font-semibold mb-1">
        Homepage Section Product Mapping
      </h1>
      <p className="text-xs text-slate-500 mb-6">
        Manage homepage products by company, location & section
      </p>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={activeCompany}
          onChange={(e) => setActiveCompany(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.compdesc}
            </option>
          ))}
        </select>

        <select
          value={activeLocation}
          onChange={(e) => setActiveLocation(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.locname}
            </option>
          ))}
        </select>

        <select
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Home Section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* DEPARTMENT */}
      <div className="flex gap-2 overflow-x-auto mb-4">
        {department.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDepartment(d.id)}
            className={`px-4 py-2 rounded-full border text-xs ${
              activeDepartment === d.id
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {d.itemdeptname}
          </button>
        ))}
      </div>

      {/* ALERTS */}
      {uiError && <div className="mb-4 text-red-600">{uiError}</div>}
      {uiMessage && <div className="mb-4 text-green-600">{uiMessage}</div>}

      {activeSection && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AVAILABLE PRODUCTS */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold mb-3">Available Products</h3>

            <input
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-10 text-gray-500">
                  Loading products...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No products available
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center border rounded px-3 py-2"
                  >
                    <span className="truncate">{p.itemdesc}</span>
                    <button
                      onClick={() => addProductToSection(p)}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded"
                    >
                      + Add
                    </button>
                  </div>
                ))
              )}
            </div>

            <Pagination />
          </div>

          {/* SECTION PRODUCTS */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold mb-3">Section Products</h3>

            {sectionItems.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                No products added
              </p>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {sectionItems.map((i) => (
                  <div
                    key={i.id}
                    className="flex justify-between items-center border rounded px-3 py-2 truncate"
                  >
                    <span>
                      {i.item?.item_name ||
                        i.item?.itemdesc ||
                        "Unknown Product"}
                    </span>

                    <button
                      onClick={() => removeProductFromSection(i.id)}
                      className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
