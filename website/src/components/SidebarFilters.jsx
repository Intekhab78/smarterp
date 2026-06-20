import React, { useEffect, useState } from "react";
import axios from "axios";
import PriceSlider from "../Pages/pricesSlider";
import constantApi from "../constantApi";
import { IoMdReturnRight } from "react-icons/io";
import { FiXCircle } from "react-icons/fi";

const SkeletonItem = () => (
  <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
);

const SidebarFilters = ({
  categories,

  availableSubFamilyIds,
  setCurrentPage,   // ✅ ADD

  brands,
  sizes,
  family,
  setFamily,
  subFamily,
  setSubFamily,
  setCategories,
  // setBrands,

  selectedCategory,
  setSelectedCategory,
  selectedFamily,
  setSelectedFamily,
  selectedSubFamily,
  setSelectedSubFamily,

  selectedBrands,
  setSelectedBrands,

  selectedSize,
  setSelectedSize,

  priceRange,
  setPriceRange,
  priceLimits,
  isOpen, // New
  onClose, // New
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartment = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${constantApi.baseUrl}/item_department/filtered_list_by_key`,
        { website_key: "e_com" }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchBrandsByCategory = async (categoryId) => {
  //   try {
  //     setIsLoading(true);
  //     const res = await axios.post(
  //       `${constantApi.baseUrl}/item_location_master/filtered_list`,
  //       { departname: categoryId }
  //     );
  //     const items = res.data.data || [];
  //     const brandIds = new Set(
  //       items.map((item) => Number(item.brand_id)).filter(Boolean)
  //     );
  //     setBrands((prev) => prev.filter((b) => brandIds.has(Number(b.id))));
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    // fetchDepartment();
    fetchCategories(); // ✅ normalized

    setSelectedCategory(null);
    setSelectedFamily(null);
    setSelectedSubFamily(null);
    setFamily([]);
    setSubFamily([]);
  }, []);

  const handleDeptClick = async (dept) => {
    setSelectedCategory(dept);
    setSelectedFamily(null);
    setSelectedSubFamily(null);
    setSubFamily([]);
    // fetchBrandsByCategory(dept.id);
    setCurrentPage(1);   // 🔥 ADD

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${constantApi.baseUrl}/family_master/filtered_list_by_key`,
        { website_key: "e_com" }
      );

      const filteredFamilies = res.data.data.filter(
        (fam) => fam.itemdeptname === String(dept.id)
      );

      const uniqueFamilies = filteredFamilies.filter(
        (v, i, a) =>
          a.findIndex((t) => t.itemfamname === v.itemfamname) === i
      );

      const familiesWithSubFamilies = [];

      for (const fam of uniqueFamilies) {
        const subRes = await axios.post(
          `${constantApi.baseUrl}/sub_family_master/by_id_list`,
          { id: fam.id }
        );

        const availableSubs = (subRes.data.data || []).filter((sub) =>
          availableSubFamilyIds.has(Number(sub.id))
        );

        if (availableSubs.length > 0) {
          familiesWithSubFamilies.push(fam);
        }
      }

      setFamily(familiesWithSubFamilies);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await axios.post(`${constantApi.baseUrl}/item_department/filtered_list_by_key`, { website_key: "e_com" });
      const normalizedCategories = res.data.data.map(cat => ({
        id: cat.id,
        name: cat.itemdeptname?.trim() || cat.departname?.trim() || "Unnamed",
      }));
      setCategories(normalizedCategories);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFamilyClick = (fam) => {
    setSelectedFamily(fam);
    setSelectedSubFamily(null);
    setCurrentPage(1);   // 🔥 ADD

    setIsLoading(true);
    axios
      .post(`${constantApi.baseUrl}/sub_family_master/by_id_list`, { id: fam.id })
      .then((res) => setSubFamily(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleClearAll = () => {
    setSelectedCategory(null);
    setSelectedFamily(null);
    setSelectedSubFamily(null);
    setFamily([]);
    setSubFamily([]);
    setSelectedBrands([]);
    setSelectedSize(null);
    setPriceRange(null);

    // setPriceRange(priceLimits);
    // setPriceRange([priceLimits[0], priceLimits[1]]); // clamp to min/max
    setCurrentPage(1);   // 🔥 IMPORTANT

  };

  const filterContent = (
    <>
      <div className="mb-4 flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium text-gray-700">

        {/* CATEGORY */}
        {selectedCategory && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedFamily(null);
              setSelectedSubFamily(null);
              setFamily([]);
              setSubFamily([]);
              setCurrentPage(1);
            }}
            className="hover:text-red-600 font-semibold transition"
          >
            {selectedCategory.name}
          </button>
        )}

        {/* FAMILY */}
        {selectedFamily && (
          <>
            <span className="font-semibold text-gray-400">›</span>
            <button
              onClick={() => {
                setSelectedFamily(null);
                setSelectedSubFamily(null);
                setSubFamily([]);
                setCurrentPage(1);
              }}
              className="hover:text-red-600 font-semibold transition"
            >
              {selectedFamily.name}
            </button>
          </>
        )}

        {/* SUB FAMILY */}
        {selectedSubFamily && (
          <>
            <span className="text-gray-400">›</span>
            <span className="font-semibold text-red-600">
              {selectedSubFamily.name}
            </span>
          </>
        )}

        {/* CLEAR ALL */}
        {(selectedCategory || selectedFamily || selectedSubFamily) && (
          <button
            onClick={handleClearAll}
            className="ml-auto text-gray-400 hover:text-red-600 transition"
            title="Clear filters"
          >
            <FiXCircle size={18} />
          </button>
        )}
      </div>


      {isLoading && (
        <div className="space-y-3">
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </div>
      )}

      {!isLoading && (
        <>
          {/* ================= CATEGORIES ================= */}
          {!selectedCategory && (
            <section className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Categories
              </h3>

              <ul className="space-y-1.5">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => handleDeptClick(cat)}
                    className="cursor-pointer font-bold px-2 py-1 rounded-md text-sm text-gray-700
                         hover:bg-gray-100 hover:text-red-600 transition"
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ================= FAMILY ================= */}
          {selectedCategory && !selectedFamily && family.length > 0 && (
            <section className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {selectedCategory.name}
              </h3>

              <ul className="pl-3 border-l border-gray-200 space-y-1.5">
                {family.map((fam) => (
                  <li
                    key={fam.id}
                    onClick={() =>
                      handleFamilyClick({ id: fam.id, name: fam.itemfamname?.trim() })
                    }
                    className="cursor-pointer flex items-center gap-1.5 px-2 py-1.5 rounded-md
                         text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                  >
                    <IoMdReturnRight className="text-xs" />
                    {fam.itemfamname?.trim()}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ================= SUB FAMILY ================= */}
          {selectedCategory && selectedFamily && subFamily.length > 0 && (
            <section className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {selectedCategory.name}
              </h3>

              <ul className="pl-3 border-l border-gray-200 space-y-1.5">
                <li className="flex items-center gap-1.5 text-sm text-green-600 font-semibold">
                  <IoMdReturnRight className="text-xs" />
                  {selectedFamily.name}
                </li>

                <ul className="pl-4 border-l border-gray-200 space-y-1.5">
                  {subFamily
                    .filter((sub) => availableSubFamilyIds.has(Number(sub.id)))
                    .map((sub) => (
                      <li
                        key={sub.id}
                        onClick={() => setSelectedSubFamily(sub)}
                        className={`cursor-pointer flex items-center gap-1.5 px-2 py-1.5 rounded-md
                    text-sm transition
                    ${selectedSubFamily?.id === sub.id
                            ? "bg-red-50 text-red-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
                          }`}
                      >
                        <IoMdReturnRight className="text-xs" />
                        {sub.itemsfamname?.trim() || sub.name}
                      </li>
                    ))}
                </ul>
              </ul>
            </section>
          )}

          {/* ================= BRANDS ================= */}
          <section className="border-t pt-3 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Brands
            </h3>

            <div className="space-y-2">
              {brands
                .filter(
                  (brand) =>
                    brand.brandname &&
                    brand.brandname.trim().toLowerCase() !== "local"
                )
                .map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-red-600"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedBrands([...selectedBrands, brand.id])
                          : setSelectedBrands(
                            selectedBrands.filter((id) => id !== brand.id)
                          )
                      }
                    />
                    <span className="truncate text-sm font-semibold">{brand.brandname}</span>
                  </label>
                ))}
            </div>
          </section>

          {/* ================= PRICE SLIDER ================= */}
          {priceLimits[0] < priceLimits[1] && (
            <section className="border-t pt-3 text-sm font-semibold mb-4">
              <PriceSlider
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                min={priceLimits[0]}
                max={priceLimits[1]}
              />
            </section>
          )}

          {/* ================= SIZE ================= */}
          {/* ================= SIZE ================= */}
          {Array.isArray(sizes) &&
            sizes
              .filter(
                (s) =>
                  s &&
                  s.itemsizename &&
                  typeof s.itemsizename === "string" &&
                  s.itemsizename.trim().toLowerCase() !== "none" &&
                  s.itemsizename.trim() !== "" &&
                  !Number.isNaN(Number(s.id))
              ).length > 0 && (
              <section className="border-t pt-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-2">
                  {sizes
                    .filter(
                      (s) =>
                        s &&
                        s.itemsizename &&
                        typeof s.itemsizename === "string" &&
                        s.itemsizename.trim().toLowerCase() !== "none" &&
                        s.itemsizename.trim() !== "" &&
                        !Number.isNaN(Number(s.id))
                    )
                    .map((size) => {
                      const isActive = Number(selectedSize) === Number(size.id);
                      return (
                        <label
                          key={size.id}
                          className={`px-3 py-1.5 rounded-md border cursor-pointer text-sm transition
                  ${isActive
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-bold text-sm"
                            }`}
                        >
                          <input
                            type="radio"
                            name="size"
                            className="hidden"
                            checked={isActive}
                            onChange={() => setSelectedSize(Number(size.id))}
                          />
                          {size.itemsizename}
                        </label>
                      );
                    })}

                  {selectedSize && (
                    <button
                      onClick={() => setSelectedSize(null)}
                      className="text-sm text-gray-500 underline hover:text-red-600 ml-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </section>
            )}

        </>
      )}

    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <div className={`md:hidden relative z-50 ${isOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
        />
        <aside className={`
           fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out px-4 py-4 overflow-y-auto
           ${isOpen ? "translate-x-0" : "-translate-x-full"}
         `}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-red-500 transition">
              <FiXCircle size={24} />
            </button>
          </div>
          {filterContent}
        </aside>
      </div>

      {/* Desktop Sidebar - Always Visible */}
      <aside className="hidden md:block col-span-1 border border-gray-200 rounded-2xl p-4 bg-white self-start sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
        {filterContent}
      </aside>
    </>
  );
};

export default SidebarFilters;
