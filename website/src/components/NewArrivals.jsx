import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../CartContext/CartContext";
import constantApi from "../constantApi";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

export default function NewArrivals({ products = [] }) {
  const baseUrl = `${constantApi.imageUrl}/itemsImage/`;
  const { addToCart, cart } = useCart();
  // const [products, setProducts] = useState([]);


  const [subFamilies, setSubFamilies] = useState([]);
  const [perPage] = useState(20);
  const [page, setPage] = useState(1);

  const [currentPageByCategory, setCurrentPageByCategory] = useState({});
  // const [perPage] = useState(10);
  const [globalSearch, setGlobalSearch] = useState("");
  const [sidebarFilters, setSidebarFilters] = useState({
    priceMin: "",
    priceMax: "",
    stock: "all",
    author: "",
    brand: "",
  });
  const [sortByByCategory, setSortByByCategory] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!navigator.onLine) {
          console.warn("Offline - skipping categories fetch");
          return;
        }


        const res = await axios.post(
          `${constantApi.baseUrl}/item_department/filtered_list_by_key`,
          { website_key: "e_com" },
          { timeout: 5000 }
        );

        const data = Array.isArray(res.data.data) ? res.data.data : [];

        setCategories(data);

        // ✅ PRINT IN CONSOLE
        // console.log("✅ Categories fetched:", data);

      } catch (error) {
        console.warn("Categories load failed:", error.message);
        setCategories([]);
      } finally {
      }
    };

    fetchCategories();
  }, []);

  const cleanText = (val) => {
    if (!val) return "";
    const t = String(val).trim();
    if (!t || t.toLowerCase() === "null") return "";
    return t;
  };

  const categoryMap = useMemo(() => {
    const map = {};

    categories.forEach((c) => {
      const name = cleanText(c.itemdeptname);
      const long = cleanText(c.itemdeptlong);

      const finalName = name || long || `Category-${c.id}`;

      map[Number(c.id)] = finalName;
    });

    return map;
  }, [categories]);


  useEffect(() => {
  }, [categoryMap]);

  // ----------------------------
  // FETCH SUBFAMILIES
  // ----------------------------
  const fetchSubFamilies = async () => {
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/sub_family_master/list`
      );
      setSubFamilies(res.data?.data || []);
    } catch (err) {
      console.error("Error loading subfamilies", err);
    }
  };

  useEffect(() => {
    fetchSubFamilies();
  }, []);

  // ----------------------------
  // CATEGORY NAME
  // ----------------------------

  const getCategoryName = (product) => {
    const deptId = Number(product.departname);

    return categoryMap[deptId] || ` `;
  };
  // ----------------------------
  // STEP 0: FILTER INVALID PRODUCTS (OLD LOGIC)
  // ----------------------------
  const getBestDiscount = (priceItems, tax = 0) => {
    if (!Array.isArray(priceItems) || priceItems.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validPrices = priceItems
      .filter((item) => {
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
      })
      .map((item) => {
        const base = parseFloat(item.list_price);
        return Math.round(base + (base * tax) / 100); // ✅ ROUND HERE
      });

    if (validPrices.length === 0) return null;

    return Math.min(...validPrices);
  };


  const validProducts = useMemo(() => {
    return products.filter((p) => {
      const stock = Number(p.remaining_stock ?? p.stock ?? 0);
      if (stock <= 0) return false;

      if (!p.item_image) return false;

      let price = parseFloat(p.itemprice) || 0;
      const discount = getBestDiscount(p.price_list_items);
      if (discount && discount < price) price = discount;

      if (price === 0) return false;

      return true;
    });
  }, [products, getBestDiscount]);
  // ----------------------------
  // STEP 1: GROUP ALL PRODUCTS BY CATEGORY
  // ----------------------------
  const baseGroupedProducts = useMemo(() => {
    if (!validProducts.length) return {};

    return validProducts.reduce((acc, product) => {
      const category = getCategoryName(product);
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});
  }, [validProducts, categoryMap]);

  // ----------------------------
  // STOCK BADGE
  // ----------------------------
  const getStockBadge = (stock) => {
    if (stock <= 0) return { label: `${stock}`, color: "bg-red-600" };
    if (stock <= 5) return { label: `${stock}`, color: "bg-orange-500" };
    return { label: `${stock}`, color: "bg-green-600" };
  };


  // ----------------------------
  // GROUP PRODUCTS BY CATEGORY
  // ----------------------------
  // const groupedProducts = useMemo(() => {
  //   if (!products.length) return {};
  //   return products.reduce((acc, p) => {
  //     const cat = getCategoryName(p);
  //     if (!acc[cat]) acc[cat] = [];
  //     acc[cat].push(p);
  //     return acc;
  //   }, {});
  // }, [products, subFamilies, categoryMap]);
  // ----------------------------
  // BUILD FINAL DISPLAY BLOCKS
  // - Max 5 items per category
  // - Skip category if < 5 items
  // - Max 20 items total
  // ----------------------------
  // const displayBlocks = useMemo(() => {
  //   const blocks = [];
  //   let totalItems = 0;

  //   for (const [category, items] of Object.entries(groupedProducts)) {
  //     if (items.length < 5) continue;

  //     const takeCount = items.length >= 10 ? 10 : 5;

  //     // ✅ If category cannot fully fit, skip it instead of breaking
  //     if (totalItems + takeCount > perPage) {
  //       continue;   // <-- IMPORTANT CHANGE
  //     }

  //     const sliced = items.slice(0, takeCount);

  //     blocks.push({
  //       category,
  //       items: sliced,
  //     });

  //     totalItems += sliced.length;
  //   }

  //   return blocks;
  // }, [groupedProducts, perPage]);
  // console.log(
  //   Object.entries(groupedProducts).map(
  //     ([cat, items]) => `${cat}: ${items.length}`
  //   )
  // );

  // Only keep categories having 5 or more products
  // ----------------------------
  // STEP 2: KEEP ONLY CATEGORIES WITH ≥ 5 ITEMS
  // ----------------------------
  const validGroupedProducts = useMemo(() => {
    const result = {};
    Object.entries(baseGroupedProducts).forEach(([category, items]) => {
      if (items.length >= 5) {
        result[category] = items;
      }
    });
    return result;
  }, [baseGroupedProducts]);
  // ----------------------------
  // STEP 3: FLATTEN PRODUCTS INTO ONE ARRAY
  // ----------------------------
  const allProductsFlat = useMemo(() => {
    return Object.values(validGroupedProducts).flat();
  }, [validGroupedProducts]);

  // ----------------------------
  // STEP 4: CALCULATE TOTAL PAGES
  // ----------------------------
  const MIN_ITEMS_FOR_NEXT_PAGE = 5;

  const fullPages = Math.floor(allProductsFlat.length / perPage);
  const remainingItems = allProductsFlat.length % perPage;

  const totalPages =
    remainingItems >= MIN_ITEMS_FOR_NEXT_PAGE
      ? fullPages + 1
      : fullPages;

  // ----------------------------
  // STEP 5: PAGINATE PRODUCTS
  // ----------------------------
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return allProductsFlat.slice(start, end);
  }, [allProductsFlat, page, perPage]);

  // ----------------------------
  // STEP 6: GROUP PAGINATED PRODUCTS FOR DISPLAY
  // ----------------------------
  const groupedProducts = useMemo(() => {
    if (!paginatedProducts.length) return {};

    return paginatedProducts.reduce((acc, product) => {
      const category = getCategoryName(product);
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});
  }, [paginatedProducts, categoryMap]);
  const displayBlocks = useMemo(() => {
    const blocks = [];
    let totalItems = 0;

    for (const [category, items] of Object.entries(groupedProducts)) {
      if (items.length < 5) continue;

      const takeCount = items.length >= 10 ? 10 : 5;

      if (totalItems + takeCount > perPage) continue;

      blocks.push({
        category,
        items: items.slice(0, takeCount),
      });

      totalItems += takeCount;
    }

    return blocks;
  }, [groupedProducts, perPage]);
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [page, totalPages]);
  // useEffect(() => {
  //   console.log("Total products:", allProductsFlat.length);
  //   console.log("Page:", page);
  //   console.log("Paginated:", paginatedProducts.length);
  //   console.log("Blocks:", displayBlocks);
  // }, [page, allProductsFlat, paginatedProducts, displayBlocks]);
  // useEffect(() => {
  //   // console.log("📦 PRODUCTS BY CATEGORY");

  //   Object.entries(baseGroupedProducts).forEach(([category, items]) => {
  //     console.group(`🗂️ ${category} (${items.length})`);

  //     items.forEach((p, index) => {
  //       console.log(
  //         `${index + 1}.`,
  //         p.item_name,
  //         "| Stock:", p.remaining_stock ?? p.stock,
  //         "| Price:", p.itemprice
  //       );
  //     });

  //     console.groupEnd();
  //   });
  // }, [baseGroupedProducts]);


  // ----------------------------
  // HELPER: GET BEST ACTIVE DISCOUNT
  // - Accepts priceItems array
  // - Uses each item's own `status`
  // - Checks start/end either on item (start_date/end_date) OR on nested priceList
  // - Picks lowest list_price among valid items
  // ----------------------------



  // ----------------------------
  // DISPLAY PRODUCTS WITH FILTERING, SORTING & PAGINATION
  // ----------------------------
  const getDisplayProductsForCategory = (category) => {
    const list = groupedProducts[category] || [];
    const search = globalSearch.trim().toLowerCase();
    const priceMin = parseFloat(sidebarFilters.priceMin || 0) || 0;
    const priceMax =
      parseFloat(sidebarFilters.priceMax || Infinity) || Infinity;
    const stockFilter = sidebarFilters.stock;
    const authorFilter = sidebarFilters.author.trim().toLowerCase();
    const brandFilter = sidebarFilters.brand.trim().toLowerCase();

    let filtered = list.filter((p) => {
      const stock = Number(p.remaining_stock ?? p.stock ?? 0);

      // STOCK DROPDOWN FILTER
      if (stockFilter === "out" && stock !== 0) return false;
      if (stockFilter === "in" && stock <= 0) return false;
      if (stockFilter === "low" && stock > 5) return false;

      let price = parseFloat(p.itemprice) || 0;
      const discount = getBestDiscount(p.price_list_items);
      if (discount && discount < price) price = discount;

      // PRICE RANGE FILTER
      if (price < priceMin || price > priceMax) return false;

      // AUTHOR FILTER
      if (authorFilter) {
        const hay = (p.author || p.itemdesclong || "").toLowerCase();
        if (!hay.includes(authorFilter)) return false;
      }

      // BRAND FILTER
      if (brandFilter) {
        const brand = p.brandname || p.brand?.name || p.company?.compdesc || "";
        if (!String(brand).toLowerCase().includes(brandFilter)) return false;
      }

      // GLOBAL SEARCH
      if (search) {
        const hay = `${p.item_name || ""} ${p.itemdesc || ""} ${p.author || ""} ${p.brandname || ""}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }

      return true;
    });

    // -------------------------
    // SORT: AVAILABLE PRODUCTS FIRST
    // -------------------------
    filtered.sort((a, b) => {
      const stockA = Number(a.remaining_stock ?? a.stock ?? 0);
      const stockB = Number(b.remaining_stock ?? b.stock ?? 0);

      if (stockA === 0 && stockB > 0) return 1;   // a unavailable → push after b
      if (stockA > 0 && stockB === 0) return -1;  // a available → keep before b
      return 0; // both same availability
    });

    // SORTING
    const sortKey = sortByByCategory[category] || "";
    filtered = [...filtered];
    switch (sortKey) {
      case "alpha-asc":
        filtered.sort((a, b) =>
          (a.item_name || "").localeCompare(b.item_name || "")
        );
        break;
      case "alpha-desc":
        filtered.sort((a, b) =>
          (b.item_name || "").localeCompare(a.item_name || "")
        );
        break;
      case "price-asc":
        filtered.sort(
          (a, b) =>
            (getBestDiscount(a.price_list_items) ||
              parseFloat(a.itemprice) ||
              0) -
            (getBestDiscount(b.price_list_items) ||
              parseFloat(b.itemprice) ||
              0)
        );
        break;
      case "price-desc":
        filtered.sort(
          (a, b) =>
            (getBestDiscount(b.price_list_items) ||
              parseFloat(b.itemprice) ||
              0) -
            (getBestDiscount(a.price_list_items) ||
              parseFloat(a.itemprice) ||
              0)
        );
        break;
    }

    // PAGINATION
    const page = currentPageByCategory[category] || 1;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
      allCount: filtered.length,
      pages: Math.max(1, Math.ceil(filtered.length / perPage)),
      page,
      items: filtered.slice(start, end),
    };
  };

  const setPageForCategory = (category, page) => {
    setCurrentPageByCategory((prev) => ({ ...prev, [category]: page }));
  };

  useEffect(() => {
    setCurrentPageByCategory({});
  }, [globalSearch, sidebarFilters, sortByByCategory, products]);

  // ----------------------------
  // ADD TO CART
  // ----------------------------
  const roundPrice = (price) => Math.round(Number(price) || 0);
  const getCartQuantity = (productId) => {
    const item = cart.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product) => {
    const stock = Number(product.remaining_stock ?? product.stock ?? 0);
    const cartQty = getCartQuantity(product.id);

    // 🚫 STOCK LIMIT REACHED
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

    let price = parseFloat(product?.itemprice) || 0;
    let itemPriceWithTax = parseFloat(product?.itemprice) || 0;
    let tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

    // Base price including tax
    let basePrice = parseFloat((price + (price * tax) / 100).toFixed(2));

    // Get the best discount
    const discount = getBestDiscount(
      product.price_list_items,
      tax
    );

    const priceToAdd =
      discount && discount < basePrice ? discount : basePrice;

    const productForCart = {
      ...product,
      itemprice: itemPriceWithTax,
      offerPrice: discount,
      itemPriceWithTax: priceToAdd,
    };

    // 🔥 IMPORTANT
    const added = addToCart(productForCart);
    if (!added) return; // 🚫 STOP HERE if failed

    console.log(
      "AddToCart: product id:",
      product.id,
      "finalPrice:",
      priceToAdd,
      "initialPrice:",
      itemPriceWithTax
    );

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

  useEffect(() => {
    // console.log("New Arrivals props:", products);
  }, [products]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="w-full px-16 pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-3">
        Top New Arrivals
      </h2>

      <div className="flex gap-6">
        {/* SIDEBAR */}
        <aside className="w-64 hidden lg:block">
          <div className="bg-white border rounded-xl p-4 shadow-sm sticky top-4">
            <h4 className="font-semibold mb-3 ">Filters</h4>

            <label className="block text-sm mb-1">Price min</label>
            <input
              type="number"
              value={sidebarFilters.priceMin}
              onChange={(e) =>
                setSidebarFilters((s) => ({ ...s, priceMin: e.target.value }))
              }
              className="w-full border rounded px-2 py-1 mb-2 text-sm"
            />

            <label className="block text-sm mb-1">Price max</label>
            <input
              type="number"
              value={sidebarFilters.priceMax}
              onChange={(e) =>
                setSidebarFilters((s) => ({ ...s, priceMax: e.target.value }))
              }
              className="w-full border rounded px-2 py-1 mb-2 text-sm"
            />

            <label className="block text-sm mb-1">Stock</label>
            <select
              value={sidebarFilters.stock}
              onChange={(e) =>
                setSidebarFilters((s) => ({ ...s, stock: e.target.value }))
              }
              className="w-full border rounded px-2 py-1 mb-2 text-sm"
            >
              <option value="all">All</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock (≤5)</option>
              <option value="out">Out of Stock</option>
            </select>

            <label className="block text-sm mb-1">Author</label>
            <input
              type="text"
              value={sidebarFilters.author}
              onChange={(e) =>
                setSidebarFilters((s) => ({ ...s, author: e.target.value }))
              }
              className="w-full border rounded px-2 py-1 mb-2 text-sm"
            />

            <label className="block text-sm mb-1">Brand / Company</label>
            <input
              type="text"
              value={sidebarFilters.brand}
              onChange={(e) =>
                setSidebarFilters((s) => ({ ...s, brand: e.target.value }))
              }
              className="w-full border rounded px-2 py-1 mb-3 text-sm"
            />

            <button
              onClick={() =>
                setSidebarFilters({
                  priceMin: "",
                  priceMax: "",
                  stock: "all",
                  author: "",
                  brand: "",
                })
              }
              className="w-full py-2 rounded bg-gray-100 text-sm"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">

          {/* CATEGORY SECTIONS */}
          <div className="space-y-12">
            {/* CATEGORY BLOCKS */}
            <div className="space-y-12">
              {displayBlocks.map((block) => (
                <section key={block.category}>

                  {/* CATEGORY TITLE */}
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    {block.category}
                  </h3>

                  {/* PRODUCTS GRID */}
                  <div className="
  grid
  gap-4
  [grid-template-columns:repeat(5,minmax(210px,1fr))]
  max-xl:grid-cols-[repeat(auto-fit,minmax(210px,1fr))]
">
                    {block.items
                      .filter(Boolean)
                      .map((product) => {
                        const stock = Number(product?.remaining_stock ?? product?.stock ?? 0);
                        const badge = getStockBadge(stock);
                        const cartQty = getCartQuantity(product.id);
                        const isStockLimitReached = cartQty >= stock;
                        const isDisabled = stock === 0 || isStockLimitReached;

                        let price = parseFloat(product?.itemprice) || 0;
                        let tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

                        const displayPrice = Math.round(price + (price * tax) / 100);

                        const discountedPrice = getBestDiscount(product.price_list_items, tax);


                        const hasValidDiscount =
                          typeof discountedPrice === "number" &&
                          discountedPrice > 0 &&
                          discountedPrice < displayPrice;

                        return (
                          <motion.div
                            key={product.id}
                            className="relative bg-white shadow-md rounded-2xl border h-[350px] flex flex-col overflow-hidden group"
                          >
                            {/* STOCK BADGE */}
                            <span
                              className={`absolute top-2 left-1 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-semibold text-white ${badge.color} z-20`}
                            >
                              {badge.label}
                            </span>

                            {/* IMAGE */}
                            <div className="flex flex-col flex-grow overflow-hidden">
                              <Link to={`/items/${product.id}`}>
                                <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden bg-white rounded-t-2xl">
                                  {product.item_image ? (
                                    <img
                                      src={`${baseUrl}${product.item_image}`}
                                      alt={product.item_name}
                                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="text-gray-400 text-sm">No image</div>
                                  )}
                                </div>
                              </Link>

                              {/* TITLE */}
                              <Link to={`/items/${product.id}`}>
                                <p className="text-gray-900 text-xs font-medium text-center px-2 h-[36px] overflow-hidden">
                                  {product.item_name}
                                </p>
                              </Link>

                              {/* PRICE */}
                              <div className="text-center mt-1 mb-2 h-[45px] flex flex-col items-center justify-center">
                                {hasValidDiscount ? (
                                  <>
                                    <span className="text-lg font-bold text-green-600">
                                      ₹{discountedPrice}
                                    </span>
                                    <span className="text-sm text-red-500 line-through">
                                      ₹{displayPrice}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-green-600">
                                    ₹{displayPrice}
                                  </span>
                                )}
                              </div>

                            </div>

                            {/* BUTTON */}
                            <button
                              disabled={isDisabled}
                              onClick={() => handleAddToCart(product)}
                              className={`block w-full py-2 text-center rounded-b-2xl transition font-medium ${isDisabled
                                ? "!bg-gray-300 !text-gray-600 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-transparent hover:text-primary border border-primary"
                                }`}
                            >
                              {stock === 0
                                ? ""
                                : isStockLimitReached
                                  ? "Out of Stock"
                                  : "Add to Cart"}
                            </button>
                          </motion.div>
                        );
                      })}
                  </div>

                </section>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 border rounded disabled:opacity-40"
                >
                  Prev
                </button>

                <span className="px-4 py-2 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 border rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
