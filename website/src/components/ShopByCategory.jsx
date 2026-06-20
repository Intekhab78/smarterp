import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import { BiSort } from "react-icons/bi";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import constantApi from "../constantApi";
import { useCart } from "../CartContext/CartContext";
import SecondNavbar from "../components/secondNavbar";
import SidebarFilters from "../components/SidebarFilters";

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
const getFinalPrice = (product) => {
  const price = parseFloat(product.itemprice) || 0;
  const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

  // original price with tax
  const originalPrice = price + (price * tax) / 100;

  // best discount (without tax)
  let discount = getBestDiscount(product.price_list_items);

  // apply tax on discount
  if (discount !== null) {
    discount = discount + (discount * tax) / 100;
  }

  const final =
    discount !== null && discount < originalPrice
      ? discount
      : originalPrice;

  return Math.round(final);
};

function ShopByCategory() {
  const params = useParams();
  const { addToCart, cart } = useCart();
  const [priceLimits, setPriceLimits] = useState([0, 0]);
  const [priceRange, setPriceRange] = useState(null);

  // ---------------- STATE ----------------
  const [categories, setCategories] = useState([]);
  const [baseProducts, setBaseProducts] = useState([]); // 🔥 sidebar source

  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [family, setFamily] = useState([]);
  const [subFamily, setSubFamily] = useState([]);
  // const [products, setProducts] = useState([]);
  const [products, setProducts] = useState([]);
  // const [totalItems, setTotalItems] = useState(0); // ✅ add this

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedSubFamily, setSelectedSubFamily] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // const productsPerPage = 20;
  const baseUrl = `${constantApi.imageUrl}/itemsImage/`;


  // useEffect(() => {
  //   if (!params.id) return;

  //   if (categories.length === 0) {
  //     // Fetch the category by ID directly
  //     axios.post(`${constantApi.baseUrl}/item_department/get_by_id`, { id: params.id })
  //       .then(res => {
  //         if (res.data?.data) {
  //           setSelectedCategory({
  //             id: res.data.data.id,
  //             name: res.data.data.itemdeptname?.trim(),
  //           });
  //         }
  //       });
  //   } else {
  //     const matchedCategory = categories.find(
  //       (cat) => String(cat.id) === String(params.id)
  //     );
  //     if (matchedCategory) {
  //       setSelectedCategory({
  //         id: matchedCategory.id,
  //         name: matchedCategory.itemdeptname?.trim(),
  //       });
  //     }
  //   }
  // }, [params.id, categories]);


  const fetchCategories = async () => {
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/item_department/filtered_list_by_key`,
        { website_key: "e_com" }
      );

      const normalized = (res.data.data || []).map(cat => ({
        ...cat,
        name: cat.itemdeptname?.trim(),   // ✅ normalize here
      }));

      setCategories(normalized);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (params.id && categories.length > 0) {
  //     const matchedCategory = categories.find(
  //       (cat) => String(cat.id) === String(params.id)
  //     );

  //     if (matchedCategory) {
  //       setSelectedCategory(matchedCategory);   // ❌ DELETE THIS
  //     }

  //   }
  // }, [params.id, categories]);
  useEffect(() => {
    if (params.id && categories.length > 0) {
      const matchedCategory = categories.find(
        (cat) => String(cat.id) === String(params.id)
      );

      if (matchedCategory) {
        setSelectedCategory(prev =>
          prev?.id === matchedCategory.id ? prev : matchedCategory
        );
      }
    }
  }, [params.id, categories]);

  const fetchBrands = async () => {
    try {
      const res = await axios.post(`${constantApi.baseUrl}/brand/list`);
      setBrands(res.data.data || []);
      setFilteredBrands(res.data.data || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await axios.post(`${constantApi.baseUrl}/size_master/list`);
      setSizes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching sizes:", err);
    }
  };
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    const filtered = sizes.filter(size =>
      baseProducts.some(p => p?.size_master?.id === size.id)
    );
    setAvailableSizes(filtered);
  }, [sizes, baseProducts]);



  // const fetchProducts = useCallback(async () => {
  //   if (!selectedCategory?.id) return;

  //   setLoading(true);
  //   setErrorMessage("");

  //   try {
  //     const res = await axios.post(
  //       `${constantApi.baseUrl}/item_location_master/filter_list_by_stock_price` +
  //       `?company_id=21&location_id=20&page=${currentPage}&limit=${limit}`
  //     );



  //     const rawProducts = res.data.data || [];
  //     setProducts(rawProducts); // only current page items
  //     setBaseProducts(rawProducts); // optional, if you need sidebar filters

  //     // Set total items for pagination
  //     setTotalItems(res.data.total || rawProducts.length);

  //     const base = rawProducts.filter(p => {
  //       const stock = Number(p.remaining_stock ?? p.stock ?? 0);
  //       return (
  //         stock > 0 &&
  //         p.item_image &&
  //         String(p.departname) === String(selectedCategory.id)
  //       );
  //     });

  //     setBaseProducts(base);

  //     let filtered = base;

  //     if (selectedFamily?.id)
  //       filtered = filtered.filter(p => Number(p.familyname) === Number(selectedFamily.id));

  //     if (selectedSubFamily?.id)
  //       filtered = filtered.filter(p => Number(p.subfamliy) === Number(selectedSubFamily.id));

  //     if (selectedBrands.length)
  //       filtered = filtered.filter(p => selectedBrands.includes(Number(p.brandname)));

  //     if (selectedSize != null)
  //       filtered = filtered.filter(p => Number(p.size_master?.id) === Number(selectedSize));

  //     if (searchQuery.trim()) {
  //       const q = searchQuery.toLowerCase();
  //       filtered = filtered.filter(p => p.item_name?.toLowerCase().includes(q));
  //     }

  //     if (priceRange) {
  //       filtered = filtered.filter(p => {
  //         const price = getFinalPrice(p);
  //         return price >= priceRange[0] && price <= priceRange[1];
  //       });
  //     }

  //     setProducts(filtered);
  //     // setTotalItems(res.data.total || filtered.length);

  //     if (!filtered.length) setErrorMessage("No items available.");
  //   } catch (err) {
  //     console.error(err);
  //     setErrorMessage("Failed to load products.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [
  //   selectedCategory,
  //   selectedFamily,
  //   selectedSubFamily,
  //   selectedBrands,
  //   selectedSize,
  //   searchQuery,
  //   priceRange,
  //   currentPage        // ✅ ADD THIS

  // ]);
  const fetchProducts = useCallback(async () => {
    if (!selectedCategory?.id) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/item_location_master/filter_list_by_stock_price`,
        null,
        {
          params: {
            company_id: 21,
            location_id: 20,
            department: selectedCategory.id,   // ✅ category from URL / sidebar
            search: searchQuery || "",          // ✅ search from input
            page: currentPage,
            limit: limit,
          },
        }
      );

      let apiProducts = res.data.data || [];

      // 🚫 hide invalid products (same logic)
      apiProducts = apiProducts.filter((p) => {
        const stock = Number(p.remaining_stock ?? p.stock ?? 0);
        return stock > 0 && p.item_image;
      });

      // ✅ pagination total from API
      setTotalItems(res.data.total || 0);

      // 🔥 sidebar source
      setBaseProducts(apiProducts);

    } catch (err) {
      console.error("ShopByCategory API error:", err);
      setErrorMessage("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, currentPage]);
  useEffect(() => {
    if (!baseProducts.length) {
      setProducts([]);
      return;
    }

    let filtered = baseProducts;

    if (selectedFamily?.id)
      filtered = filtered.filter(
        (p) => Number(p.familyname) === Number(selectedFamily.id)
      );

    if (selectedSubFamily?.id)
      filtered = filtered.filter(
        (p) => Number(p.subfamliy) === Number(selectedSubFamily.id)
      );

    if (selectedBrands.length)
      filtered = filtered.filter((p) =>
        selectedBrands.includes(Number(p.brandname))
      );

    if (selectedSize != null)
      filtered = filtered.filter(
        (p) => Number(p.size_master?.id) === Number(selectedSize)
      );

    if (priceRange) {
      filtered = filtered.filter((p) => {
        const price = getFinalPrice(p);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    setProducts(filtered);

    if (!filtered.length) setErrorMessage("No items available.");
    else setErrorMessage("");

  }, [
    baseProducts,
    selectedFamily,
    selectedSubFamily,
    selectedBrands,
    selectedSize,
    priceRange
  ]);

  // useEffect(() => {
  //   fetchProducts();
  // }, [fetchProducts]);
  useEffect(() => {
    if (selectedCategory?.id) {
      fetchProducts();
    }
  }, [selectedCategory, fetchProducts]);


  useEffect(() => {
    if (!baseProducts.length) return;

    const prices = baseProducts
      .map(p => getFinalPrice(p))
      .filter(p => p > 0);

    if (!prices.length) return;

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    setPriceLimits([min, max]);
    setPriceRange([min, max]);
  }, [baseProducts]);   // ✅ ONLY baseProducts

  const availableSizeIds = new Set(
    baseProducts.map(p => Number(p?.size_master?.id)).filter(Boolean)
  );

  const availableSubFamilyIds = new Set(
    baseProducts.map(p => Number(p.subfamliy)).filter(Boolean)
  );

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchSizes();
  }, []);


  useEffect(() => {
    if (!selectedCategory) {
      setFilteredBrands([]);
      return;
    }

    const brandIds = [
      ...new Set(baseProducts.map(p => Number(p.brandname)).filter(Boolean))
    ];

    setFilteredBrands(brands.filter(b => brandIds.includes(b.id)));
  }, [baseProducts, brands, selectedCategory]);

  // ---------------- HELPERS ----------------
  // const getDisplayPrice = (product) => {
  //   const price = parseFloat(product.itemprice) || 0;
  //   const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;
  //   const basePrice = price + (price * tax) / 100;

  //   if (product?.price_list_items?.length > 0) {
  //     const priceItem = product.price_list_items.find(p => p.status === "active" && p.list_price);
  //     if (priceItem && parseFloat(priceItem.list_price) < basePrice) {
  //       return parseFloat(priceItem.list_price);
  //     }
  //   }
  //   return parseFloat(basePrice.toFixed(2));
  // };

  // const roundPrice = (price) => Math.round(Number(price) || 0);
  const getCartQuantity = (productId) => {
    const item = cart.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };


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

    const price = parseFloat(product.itemprice) || 0;
    const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

    const originalPrice = Math.round(price + (price * tax) / 100);

    let discount = getBestDiscount(product.price_list_items);
    if (discount !== null) {
      discount = Math.round(discount + (discount * tax) / 100);
    }

    const finalPrice =
      discount !== null && discount < originalPrice
        ? discount
        : originalPrice;

    const added = addToCart({
      ...product,
      offerPrice: discount,
      itemPriceWithTax: finalPrice,
      quantity: 1,
    });

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


  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // useEffect(() => {
  //   fetchProducts();
  // }, [currentPage]);


  // Filter out unavailable products first
  // Filter out unavailable products first
  const availableProducts = products.filter((p) => {
    const stock = Number(p.remaining_stock ?? p.stock ?? 0);
    const hasImage =
      p.item_image &&
      p.item_image !== "" &&
      p.item_image !== "null";

    return stock > 0 && hasImage;
  });

  // Sort products
  const sortedProducts = [...availableProducts].sort((a, b) => {
    if (sortKey === "alpha-asc") return a.item_name.localeCompare(b.item_name);
    if (sortKey === "alpha-desc") return b.item_name.localeCompare(a.item_name);
    if (sortKey === "price-asc") return getFinalPrice(a) - getFinalPrice(b);
    if (sortKey === "price-desc") return getFinalPrice(b) - getFinalPrice(a);
    return 0;
  });
  const currentProducts = sortedProducts;

  // Pagination (AFTER sorting)
  // const indexOfLast = currentPage * productsPerPage;
  // const indexOfFirst = indexOfLast - productsPerPage;

  // const currentProducts = sortedProducts.slice(
  //   indexOfFirst,
  //   indexOfLast
  // );

  // Total pages
  // const totalPages = Math.ceil(sortedProducts.length / productsPerPage);


  const getStockBadge = (stock) => {
    if (stock === 0) return { label: "0", color: "bg-red-600" };
    if (stock <= 5) return { label: `${stock} left`, color: "bg-orange-500" };
    return { label: `${stock}`, color: "bg-green-600" };
  };

  // Reset page to 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedFamily,
    selectedSubFamily,
    selectedBrands,
    selectedSize,
    searchQuery,
    sortKey
  ]);

  // ---------------- RENDER ----------------
  return (
    <>
      <div className="sticky -mt-4 bg-white shadow z-30">
        <SecondNavbar />
      </div>

      <div className="w-full px-4 pt-16">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-9 pb-16 w-[97%] items-start">
          {/* Sidebar */}
          <SidebarFilters
            categories={categories}
            setCategories={setCategories} // ✅ exists
            brands={filteredBrands}
            setBrands={setFilteredBrands}
            // sizes={sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            sizes={availableSizes}           // ✅ only show available sizes
            setCurrentPage={setCurrentPage}

            availableSizeIds={availableSizeIds}
            family={family}
            setFamily={setFamily}
            subFamily={subFamily}
            setSubFamily={setSubFamily}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedFamily={selectedFamily}
            setSelectedFamily={setSelectedFamily}
            selectedSubFamily={selectedSubFamily}
            setSelectedSubFamily={setSelectedSubFamily}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availableSubFamilyIds={availableSubFamilyIds}
            priceLimits={priceLimits}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Products */}
          <div className="col-span-3">
            {/* Search & Sort */}
            <div className="flex items-center gap-2 mb-4 w-full">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-auto min-w-0 border border-gray-300 rounded-lg py-1.5 px-3 md:px-4 shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
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

              {/* Desktop Sort */}
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="hidden md:block border border-gray-300 rounded-lg py-1.5 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">Sort By</option>
                <option value="alpha-asc">A → Z</option>
                <option value="alpha-desc">Z → A</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            {/* Loading/Error */}
            {loading ? (
              <div className="flex justify-center items-center h-96 col-span-3">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            ) : errorMessage ? (
              <div className="text-center text-red-600 text-lg font-semibold py-10 col-span-3">
                {errorMessage}
              </div>
            ) : null}

            {/* Products Grid */}
            {!loading && !errorMessage && (
              <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
                {currentProducts.map(product => {
                  const stock = Number(product.remaining_stock ?? product.stock ?? 0);
                  const cartQty = getCartQuantity(product.id);
                  const isStockLimitReached = cartQty >= stock;
                  const isDisabled = stock === 0 || isStockLimitReached;
                  const badge = getStockBadge(stock);
                  // const displayPrice = getDisplayPrice(product);

                  // const originalPrice = parseFloat(product.itemprice) + ((parseFloat(product?.tax_master_1?.taxcal) || 0) * parseFloat(product.itemprice)) / 100;
                  // const discountedPrice = product?.price_list_items?.length > 0 ? parseFloat(product.price_list_items[0].list_price) : null;


                  const price = parseFloat(product.itemprice) || 0;
                  const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

                  // Original price with tax
                  const originalPrice = Math.round(price + (price * tax) / 100);

                  // Discount base price (NO tax yet)
                  let discount = getBestDiscount(product.price_list_items);

                  // Add tax to discount
                  if (discount !== null) {
                    discount = Math.round(discount + (discount * tax) / 100);
                  }

                  // Show discount only if cheaper
                  const showDiscount =
                    discount !== null &&
                    discount < originalPrice;

                  // Final display price
                  const displayPrice = showDiscount ? discount : originalPrice;


                  return (
                    <motion.div key={product.id} className="bg-white shadow rounded-2xl overflow-hidden group flex flex-col">
                      <Link to={`/items/${product.id}`}>
                        <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden bg-white rounded-t-2xl">
                          {/* Stock Badge */}
                          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${badge.color} z-20`}>
                            {badge.label}
                          </div>

                          {product.item_image
                            ? <img src={`${baseUrl}${product.item_image}`} alt={product.item_name} className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                            : <div className="text-gray-400 text-sm">No image</div>
                          }
                        </div>
                      </Link>

                      <div className="flex-1 px-4 pb-2 flex flex-col">
                        <Link
                          to={`/items/${product.id}`}
                          className="text-gray-900 text-xs font-medium text-center mt-1 px-2 h-[36px] overflow-hidden"
                          title={product.item_name}
                        >
                          {product.item_name}
                        </Link>

                        <div className="flex flex-col items-center space-y-1 h-[45px] justify-center">
                          {showDiscount ? (
                            <>
                              <span className="text-sm font-bold text-green-600">
                                ₹ {displayPrice}
                              </span>
                              <span className="text-xs text-red-500 line-through">
                                ₹ {originalPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-green-600">
                              ₹ {originalPrice}
                            </span>
                          )}
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

                    </motion.div>
                  );
                })}
              </div>
            )}
            {/* Pagination */}
            {currentProducts.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-gray-100"}`}
                >
                  ← Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-gray-100"}`}
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

export default ShopByCategory;
