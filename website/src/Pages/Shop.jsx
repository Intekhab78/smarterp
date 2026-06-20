import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { BiSort } from "react-icons/bi";
import constantApi from "../constantApi";
import axios from "axios";
import { useCart } from "../CartContext/CartContext";
import { Link } from "react-router-dom";
import Select from "react-select";
import { motion } from "framer-motion";
import SecondNavbar from "../components/secondNavbar";
import PriceSlider from "../Pages/pricesSlider";
import SubFamily from "../Pages/subFamily";
import SidebarFilters from "../components/SidebarFilters";
import Swal from "sweetalert2";

const getBestDiscount = (priceItems) => {
  if (!Array.isArray(priceItems) || priceItems.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validItems = priceItems.filter((item) => {
    if (!item) return false;

    if (item.status !== "active") return false;
    if (!item.priceList || item.priceList.status !== "active") return false;

    const start = item.priceList.start_date
      ? new Date(item.priceList.start_date)
      : null;
    const end = item.priceList.end_date
      ? new Date(item.priceList.end_date)
      : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    if (start && today < start) return false;
    if (end && today > end) return false;

    const price = parseFloat(item.list_price);
    return Number.isFinite(price) && price > 0;
  });

  if (validItems.length === 0) return null;

  return Math.min(...validItems.map(i => parseFloat(i.list_price)));
};
const getPriceWithTax = (price, tax) =>
  Math.round(price + (price * tax) / 100);

const getProductPrices = (product) => {
  const price = parseFloat(product.itemprice) || 0;
  const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

  const originalPrice = getPriceWithTax(price, tax);

  let discountBase = getBestDiscount(product.price_list_items);
  let discountPrice = null;

  if (discountBase !== null) {
    discountPrice = getPriceWithTax(discountBase, tax);
  }

  const hasValidDiscount =
    discountPrice !== null && discountPrice < originalPrice;

  return {
    originalPrice,
    discountPrice,
    finalPrice: hasValidDiscount ? discountPrice : originalPrice,
    hasValidDiscount,
  };
};

function Shop() {
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]); // <-- NEW
  const [priceLimits, setPriceLimits] = useState([0, 0]);
  const [priceRange, setPriceRange] = useState(null);

  const [sizes, setSizes] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  const [family, setFamily] = useState([]);
  const [subFamily, setSubFamily] = useState([]);
  const [baseProducts, setBaseProducts] = useState([]); // 🔥 NEW

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 NEW SEARCH STATE
  const [loading, setLoading] = useState(false);
  const baseUrl = `${constantApi.imageUrl}/itemsImage/`;
  const { addToCart, cart } = useCart();

  // Track selected category/family/subfamily from SidebarFilters
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedSubFamily, setSelectedSubFamily] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [sortKey, setSortKey] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredProducts = products
    .filter((p) =>
      (p.item_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((p) => {
      const { finalPrice } = getProductPrices(p);
      return finalPrice > 0;
    });



  let sortedProducts = [...filteredProducts];
  if (sortKey === "alpha-asc")
    sortedProducts.sort((a, b) => a.item_name.localeCompare(b.item_name));
  if (sortKey === "alpha-desc")
    sortedProducts.sort((a, b) => b.item_name.localeCompare(a.item_name));
  if (sortKey === "price-asc")
    sortedProducts.sort(
      (a, b) =>
        getProductPrices(a).finalPrice -
        getProductPrices(b).finalPrice
    );

  if (sortKey === "price-desc")
    sortedProducts.sort(
      (a, b) =>
        getProductPrices(b).finalPrice -
        getProductPrices(a).finalPrice
    );



  // useEffect(() => {
  //   fetchData();
  // }, [filterCategories]);

  // On mount, reset family and subFamily to empty
  useEffect(() => {
    setFamily([]);
    setSubFamily([]);
  }, []);

  // 🔥 SubFamilies that actually have products
  const availableSubFamilyIds = new Set(
    baseProducts.map(p => Number(p.subfamliy)).filter(Boolean)
  );


  // const fetchData = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await axios.post(
  //       `${constantApi.baseUrl}/item_location_master/filter_list_by_stock_price` +
  //       `?company_id=21&location_id=20&page=${currentPage}&limit=${limit}`
  //     );

  //     let apiProducts = res.data.data || [];

  //     // 🚫 hide invalid products
  //     apiProducts = apiProducts.filter(p => {
  //       const stock = Number(p.remaining_stock ?? p.stock ?? 0);
  //       return stock > 0 && p.item_image;
  //     });

  //     // ✅ FIX 1: SET TOTAL ITEMS (pagination)
  //     setTotalItems(res.data.total || apiProducts.length);

  //     // 🔥 SAVE BASE PRODUCTS (UNFILTERED)
  //     setBaseProducts(apiProducts);

  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchData = async () => {
    try {
      setLoading(true);

      const company_id = 21;   // or from user/companyData if you have
      const location_id = 20;

      const res = await axios.post(
        `${constantApi.baseUrl}/item_location_master/filter_list_by_stock_price`,
        null,
        {
          params: {
            company_id: company_id,
            location_id: location_id,
            department: selectedCategory?.id || "",   // 👈 category filter
            search: searchTerm || "",                  // 👈 search
            page: currentPage,
            limit: limit,
          },
        }
      );
      console.log("shop==========", res.data)
      let apiProducts = res.data.data || [];

      // 🚫 hide invalid products (same as before)
      apiProducts = apiProducts.filter((p) => {
        const stock = Number(p.remaining_stock ?? p.stock ?? 0);
        return stock > 0 && p.item_image;
      });

      // ✅ pagination total
      setTotalItems(res.data.total || 0);

      // 🔥 keep baseProducts for sidebar filtering
      setBaseProducts(apiProducts);

    } catch (err) {
      console.error("Shop API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!baseProducts.length) {
      setProducts([]);
      return;
    }

    let filtered = baseProducts;

    // CATEGORY
    if (selectedCategory?.id) {
      filtered = filtered.filter(
        p => Number(p.departname) === Number(selectedCategory.id)
      );
    }

    // FAMILY
    if (selectedFamily?.id) {
      filtered = filtered.filter(
        p => Number(p.familyname) === Number(selectedFamily.id)
      );
    }

    // SUB FAMILY
    if (selectedSubFamily?.id) {
      filtered = filtered.filter(
        p => Number(p.subfamliy) === Number(selectedSubFamily.id)
      );
    }

    // BRAND
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p =>
        selectedBrands.includes(Number(p.brandname))
      );
    }

    // SIZE
    if (selectedSize != null) {
      filtered = filtered.filter(
        p => Number(p.size_master?.id) === Number(selectedSize)
      );
    }

    // PRICE
    if (priceRange && priceRange.length === 2) {
      const [min, max] = priceRange;
      filtered = filtered.filter(p => {
        const { finalPrice } = getProductPrices(p);
        return finalPrice >= min && finalPrice <= max;
      });
    }

    setProducts(filtered);
  }, [
    baseProducts,
    selectedCategory,
    selectedFamily,
    selectedSubFamily,
    selectedBrands,
    selectedSize,
    priceRange
  ]);

  const finalProducts = [...products]
    // 🔍 search
    .filter((p) =>
      p.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // ✅ valid price & stock
    .filter((p) => {
      const { finalPrice } = getProductPrices(p);
      const stock = Number(p.remaining_stock ?? p.stock ?? 0);
      return finalPrice > 0 && stock > 0;
    })
    // 🔁 SORTING
    .sort((a, b) => {
      // Stock priority first
      const stockA = Number(a.remaining_stock ?? a.stock ?? 0);
      const stockB = Number(b.remaining_stock ?? b.stock ?? 0);
      if (stockA > 0 && stockB === 0) return -1;
      if (stockA === 0 && stockB > 0) return 1;

      // Price sorting
      if (sortKey === "price-asc") {
        return getProductPrices(a).finalPrice - getProductPrices(b).finalPrice;
      }
      if (sortKey === "price-desc") {
        return getProductPrices(b).finalPrice - getProductPrices(a).finalPrice;
      }

      // Alphabetical
      if (sortKey === "alpha-asc") {
        return a.item_name.localeCompare(b.item_name);
      }
      if (sortKey === "alpha-desc") {
        return b.item_name.localeCompare(a.item_name);
      }

      return 0;
    });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.post(`${constantApi.baseUrl}/brand/list`);
        setAllBrands(res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBrands();
  }, []);
  const getFilteredBrands = (products, allBrands) => {
    const brandIdsInProducts = [
      ...new Set(
        products
          .map(p => Number(p.brandname))
          .filter(Boolean)
      )
    ];

    return allBrands.filter(brand =>
      brandIdsInProducts.includes(brand.id)
    );
  };

  useEffect(() => {
    const filtered = getFilteredBrands(baseProducts, allBrands);
    setFilteredBrands(filtered);
  }, [baseProducts, allBrands]);
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/size_master/list`
        );
        setSizes(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSizes();
  }, []);

  useEffect(() => {
    if (!baseProducts.length) return;

    const sizeIds = [
      ...new Set(
        baseProducts
          .map(p => p.size_master?.id)
          .filter(Boolean)
      )
    ];

    console.log("Available Size IDs:", sizeIds);

    setAvailableSizes(sizeIds);
  }, [baseProducts]);



  const handleCategoryChange = (selectedOptions) => {
    setFilterCategories(selectedOptions.map((option) => option.value));
  };



  const getStockBadge = (stock) => {
    if (stock === 0) return { label: `0`, color: "bg-red-600" };
    if (stock <= 5) return { label: `${stock} left`, color: "bg-orange-500" };
    return { label: `${stock}`, color: "bg-green-600" };
  };
  const getCartQuantity = (productId) => {
    const item = cart.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };
  useEffect(() => {
    if (!baseProducts.length) return;

    const prices = baseProducts
      .map(p => getProductPrices(p).finalPrice)
      .filter(p => p > 0);

    if (!prices.length) return;

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    setPriceLimits([min, max]);

    // only set once
    setPriceRange(prev => prev ?? [min, max]);
  }, [baseProducts]);

  const handleAddToCart = (product) => {
    const stock = Number(product.remaining_stock ?? product.stock ?? 0);
    const cartQty = getCartQuantity(product.id);

    if (cartQty >= stock) {
      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
        icon: "warning",
        title: "Stock limit reached",
      });
      return;

    }

    const {
      originalPrice,
      discountPrice,
      finalPrice,
    } = getProductPrices(product);

    const added = addToCart({
      ...product,
      offerPrice: discountPrice,
      itemPriceWithTax: finalPrice,
      quantity: 1,
    });
    console.log("jjjjjaaui----------------", product)

    if (!added) return;

    Swal.fire({
      html: `
    <div class="flex items-center space-x-3">
      <div class="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" 
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" 
                d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p class="text-white font-bold text-base">Added to Cart 🛒</p>
        <p class="text-white/80 text-xs mt-1"> </p>
      </div>
    </div>
  `,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: true,
      background: "rgba(0, 0, 0, 0.75)",
      color: "#fff",
      width: "320px",
      padding: "12px 16px",
      customClass: {
        popup:
          "rounded-xl shadow-2xl backdrop-blur-md animate__animated animate__slideInRight",
      },
    });
  };

  // PAGINATION
  const productsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;
  // 🔍 SEARCH FILTER (WORKS WITH CATEGORY FILTERS)
  const filteredSearchProducts = products
    .filter((product) =>
      product.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      const { finalPrice } = getProductPrices(product);
      const stock = Number(product.remaining_stock ?? product.stock ?? 0);
      return finalPrice > 0 && stock > 0;
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = finalProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // const totalPages = Math.ceil(finalProducts.length / productsPerPage);


  const totalPages = Math.ceil(totalItems / limit);
  const showPagination = products.length > 0 && totalPages > 1;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  const sortedByStock = filteredSearchProducts.sort((a, b) => {
    const stockA = Number(a.stock || a.remaining_stock || 0);
    const stockB = Number(b.stock || b.remaining_stock || 0);

    // If stock > 0, it should come first
    if (stockA > 0 && stockB === 0) return -1;
    if (stockA === 0 && stockB > 0) return 1;

    // Otherwise keep original order
    return 0;
  });
  const filteredSizes = sizes.filter(size =>
    availableSizes.includes(size.id)
  );


  const roundPrice = (price) => Math.round(Number(price) || 0);
  useEffect(() => {
    fetchData();
  }, [currentPage, selectedCategory, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedFamily,
    selectedSubFamily,
    selectedBrands,
    selectedSize,
    priceRange,
    searchTerm
  ]);


  return (
    <>
      {/* Sticky Second Navbar */}
      <div className="sticky -mt-4 z-30 bg-white shadow">
        <SecondNavbar />
      </div>

      <div className="w-full px-4 gap-0.5 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-9 pt-16 pb-16 w-full md:w-[97%] items-start">
          {/* <div className="grid md:grid-cols-4 grid-cols-2 gap-9 pt-16 pb-16 w-[97%] items-start"> */}
          {/* Sidebar */}
          {/* Sidebar */}
          <SidebarFilters
            categories={categories}

            filterCategories={filterCategories}
            handleCategoryChange={handleCategoryChange}
            // setBrands={setBrands}
            setCurrentPage={setCurrentPage}   // ✅ ADD THIS

            allBrands={allBrands}   // 👈 ADD THIS
            brands={filteredBrands}
            setBrands={setFilteredBrands}
            sizes={filteredSizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}            // sizes={sizes}
            setFamily={setFamily}
            family={family}
            setSubFamily={setSubFamily}
            subFamily={subFamily}
            setCategories={setCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedFamily={selectedFamily}
            setSelectedFamily={setSelectedFamily}
            selectedSubFamily={selectedSubFamily}
            setSelectedSubFamily={setSelectedSubFamily}
            selectedBrands={selectedBrands}      // NEW
            setSelectedBrands={setSelectedBrands} // NEW
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availableSubFamilyIds={availableSubFamilyIds}

            priceLimits={priceLimits}   // 🔥 ADD THIS
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* PRODUCTS */}
          {/* <div className="md:col-span-3 col-span-1"> */}
          <div className="col-span-3">
            {/* Search + Sort + Mobile Filter Button */}
            <div className="flex items-center gap-2 mb-4 px-2 w-full">
              {/* Mobile Filter Toggle */}
              <button
                className="md:hidden flex-none p-2 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <FiFilter size={20} />
              </button>

              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-auto min-w-0 border border-gray-300 rounded-lg py-1.5 px-3 md:px-4 shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />

              {/* Mobile Sort (Custom Dropdown) */}
              <div className="relative md:hidden">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="p-2 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center"
                >
                  <BiSort size={20} />
                </button>

                {/* Dropdown Menu */}
                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-40 py-1 overflow-hidden">
                      {[
                        { label: "Sort", value: "" },
                        { label: "A → Z", value: "alpha-asc" },
                        { label: "Z → A", value: "alpha-desc" },
                        { label: "Price: Low → High", value: "price-asc" },
                        { label: "Price: High → Low", value: "price-desc" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortKey(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors
                            ${sortKey === option.value
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                            }
                            ${!option.value ? "border-b border-gray-100 text-gray-400 font-normal" : ""}
                          `}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Desktop Sort (Standard) */}
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="hidden md:block md:w-auto border border-gray-300 rounded-lg py-1.5 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">Sort By</option>
                <option value="alpha-asc">A → Z</option>
                <option value="alpha-desc">Z → A</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            {/* Loading / Empty State */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-96 text-gray-500 text-lg font-semibold">
                No products found matching your criteria.
              </div>
            ) : (
              <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
                {finalProducts.map((product, index) => {
                  const stock = Number(product.remaining_stock ?? product.stock ?? 0);
                  const badge = getStockBadge(stock);
                  const cartQty = getCartQuantity(product.id);
                  const isStockLimitReached = cartQty >= stock;
                  const isDisabled = stock === 0 || isStockLimitReached;

                  const {
                    originalPrice,
                    discountPrice,
                    hasValidDiscount,
                  } = getProductPrices(product);

                  return (
                    <div key={index} className="relative bg-white shadow-md rounded-2xl border flex flex-col overflow-hidden">
                      <span
                        className={`absolute top-2 left-1 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-semibold text-white ${badge.color} z-20`}
                      >
                        {badge.label}
                      </span>

                      <Link to={`/items/${product.id}`}>
                        <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden bg-white rounded-t-2xl mb-4">
                          {product.item_image ? (
                            <img src={`${baseUrl}${product.item_image}`} alt={product.item_name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <div className="text-gray-400 text-sm">No image</div>
                          )}
                        </div>
                      </Link>

                      <Link to={`/items/${product.id}`}>
                        <p className="text-gray-900 text-xs font-medium text-center px-2 h-[36px] overflow-hidden">{product.item_name}</p>
                      </Link>

                      <div className="text-center mt-2 mb-4 h-[45px] flex flex-col items-center justify-center">
                        <div className="text-center mt-2 mb-4 h-[45px] flex flex-col items-center justify-center">
                          <div className="text-center mt-2 mb-4 h-[45px] flex flex-col items-center justify-center">
                            {hasValidDiscount ? (
                              <>
                                <span className="text-sm font-bold text-green-600">
                                  ₹{discountPrice}
                                </span>
                                <span className="text-xs text-red-500 line-through">
                                  ₹{originalPrice}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-green-600">
                                ₹{originalPrice}
                              </span>
                            )}
                          </div>

                        </div>


                      </div>
                      <button
                        disabled={isDisabled}
                        onClick={() => handleAddToCart(product)}
                        className={`block w-full py-2 text-center rounded-b-2xl transition font-medium ${isDisabled
                          ? "!bg-gray-300 !text-gray-600 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-transparent hover:text-primary border border-primary"
                          }`}
                      >
                        {stock === 0
                          ? "Unavailable"
                          : isStockLimitReached
                            ? "Out of Stock"
                            : "Add to Cart"}
                      </button>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {showPagination && (
              <div className="flex justify-center items-center gap-6 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md border text-sm ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  ← Prev
                </button>

                <span className="text-gray-600 text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md border text-sm ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Next →
                </button>
              </div>
            )}




          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
