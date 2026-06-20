import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../CartContext/CartContext";
import constantApi from "../constantApi";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function Products({
  products = [],
}) {
  const baseUrl = `${constantApi.imageUrl}/itemsImage/`;
  const { addToCart, cart } = useCart();
  // const { categoryId } = useParams();

  // const [products, setProducts] = useState([]);
  const [subFamilies, setSubFamilies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageByCategory, setCurrentPageByCategory] = useState({});
  const ITEMS_PER_ROW = 5;
  const ROWS_PER_PAGE = 2; // 2 rows = 10 items max
  const PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE;
  const [globalSearch, setGlobalSearch] = useState("");
  const [sidebarFilters, setSidebarFilters] = useState({
    priceMin: "",
    priceMax: "",
    stock: "all",
    author: "",
    brand: "",
  });
  const [sortByByCategory, setSortByByCategory] = useState({});
  // Calculate final prices including tax and discount
  const getProductPrices = (product) => {
    const basePrice = Number(product?.itemprice) || 0;
    const tax = Number(product?.tax_master_1?.taxcal) || 0;

    const originalPrice = Math.round(basePrice + (basePrice * tax) / 100);

    const discountBase = getBestDiscount(product?.price_list_items);
    const discountPrice =
      discountBase !== null
        ? Math.round(discountBase + (discountBase * tax) / 100)
        : null;

    const hasValidDiscount =
      discountPrice !== null && discountPrice < originalPrice;

    return {
      originalPrice,
      discountPrice,
      finalPrice: hasValidDiscount ? discountPrice : originalPrice,
      hasValidDiscount,
    };
  };



  // Store zero price items temporarily (useRef so it persists between renders but doesn't trigger render)
  const zeroPriceItemsRef = useRef([]);

  const getCartQuantity = (productId) => {
    if (!productId) return 0;
    const item = cart.find((c) => c?.id === productId);
    return item?.quantity || 0;
  };


  // const fetchData = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${constantApi.baseUrl}/item_location_master/filtered_list`
  //     );

  //     const allProducts = res.data?.data || [];
  //     // console.log("allProducts", allProducts);

  //     // Filter products where department name is "Book" OR department id is 25
  //     const filteredProducts = allProducts.filter((p) => p.departname == 25);

  //     // console.log("filteredProducts", filteredProducts);

  //     setProducts(filteredProducts);
  //   } catch (err) {
  //     console.error("Error fetching products", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [categoryId]);

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
  // GET CATEGORY NAME
  // ----------------------------
  // const getCategoryName = (product) => {
  //   const id = Number(product.subfamliy);
  //   if (!id) return "Uncategorized";
  //   const match = subFamilies.find((s) => Number(s.id) === id);
  //   return match ? match.itemsfamname : `SubFamily-${id}`;
  // };

  // ----------------------------
  // STOCK BADGE HELPER
  // ----------------------------
  const getStockBadge = (stock) => {
    if (stock === 0) return { label: ` ${stock}`, color: "bg-red-600" };
    if (stock <= 5) return { label: `${stock} `, color: "bg-orange-500" };
    return { label: ` ${stock}`, color: "bg-green-600" };
  };

  // ----------------------------
  // GET BEST DISCOUNT FROM PRICE LIST ITEMS
  // ----------------------------
  const getBestDiscount = (priceItems, tax = 0) => {
    if (!Array.isArray(priceItems) || priceItems.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today

    const validItems = priceItems.filter((item) => {
      if (!item || item.status !== "active") return false;
      if (!item.priceList || item.priceList.status !== "active") return false;

      // Prefer priceList dates, fallback to item dates
      const startDate = item.priceList.start_date
        ? new Date(item.priceList.start_date)
        : item.start_date
          ? new Date(item.start_date)
          : null;
      const endDate = item.priceList.end_date
        ? new Date(item.priceList.end_date)
        : item.end_date
          ? new Date(item.end_date)
          : null;

      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);

      if (startDate && today < startDate) return false;
      if (endDate && today > endDate) return false;

      const price = parseFloat(item.list_price);
      if (!Number.isFinite(price) || price <= 0) return false;

      return true;
    });

    if (validItems.length === 0) return null;

    const bestItem = validItems.reduce((prev, curr) => {
      return parseFloat(curr.list_price) < parseFloat(prev.list_price)
        ? curr
        : prev;
    });

    // Add tax if needed
    const finalPrice = parseFloat(bestItem.list_price);
    return tax > 0 ? parseFloat((finalPrice + (finalPrice * tax) / 100).toFixed(2)) : finalPrice;
  };


  // ----------------------------
  // GROUP PRODUCTS BY CATEGORY
  // ----------------------------
  // const groupedProducts = useMemo(() => {
  //   return products.reduce((acc, p) => {
  //     const cat = getCategoryName(p);
  //     if (!acc[cat]) acc[cat] = [];
  //     acc[cat].push(p);
  //     return acc;
  //   }, {});
  // }, [products, subFamilies]);

  // ----------------------------
  // FILTER, SORT & PAGINATE PRODUCTS
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

    // Clear zero price items before filtering
    zeroPriceItemsRef.current = [];
    let filtered = list.filter((p) => {
      const stock = Number(p.remaining_stock || 0);

      // ✅ STRICT IMAGE CHECK
      const hasImage =
        (Array.isArray(p.item_master_image) &&
          p.item_master_image.length > 0 &&
          (p.item_master_image[0]?.main_image ||
            p.item_master_image[0]?.item_image)) ||
        (typeof p.item_image === "string" && p.item_image.trim() !== "");

      // ✅ PRICE CHECK
      let price = parseFloat(p.itemprice) || 0;
      const discount = getBestDiscount(p.price_list_items);
      const finalPrice = discount && discount < price ? discount : price;

      // ❌ HIDE CONDITIONS
      if (stock === 0) return false;
      if (!hasImage) return false;
      if (finalPrice <= 0) {
        zeroPriceItemsRef.current.push(p);
        return false;
      }

      // 🔍 Sidebar stock filter
      switch (sidebarFilters.stock) {
        case "in":
          if (stock <= 5) return false;
          break;
        case "low":
          if (stock === 0 || stock > 5) return false;
          break;
        case "out":
          if (stock !== 0) return false;
          break;
        default:
          break;
      }

      // 💰 Price range filter
      const priceMin = parseFloat(sidebarFilters.priceMin || 0) || 0;
      const priceMax =
        parseFloat(sidebarFilters.priceMax || Infinity) || Infinity;
      if (finalPrice < priceMin || finalPrice > priceMax) return false;

      // 👤 Author filter
      const authorFilter = sidebarFilters.author.trim().toLowerCase();
      if (
        authorFilter &&
        !(p.author || "").toLowerCase().includes(authorFilter)
      )
        return false;

      // 🏷 Brand filter
      const brandFilter = sidebarFilters.brand.trim().toLowerCase();
      if (
        brandFilter &&
        !(p.brandname || "").toLowerCase().includes(brandFilter)
      )
        return false;

      return true;
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

  // ----------------------------
  // SET PAGE
  // ----------------------------
  const setPageForCategory = (category, page) => {
    setCurrentPageByCategory((prev) => ({ ...prev, [category]: page }));
  };

  // Reset pagination on filter/search/sort/products change
  useEffect(() => {
    setCurrentPageByCategory({});
  }, [globalSearch, sidebarFilters, sortByByCategory, products]);

  // ----------------------------
  // HANDLE ADD TO CART


  const handleAddToCart = (product) => {
    const stock = Number(
      product?.remaining_stock ??
      product?.stock ??
      0
    );
    const cartQty = getCartQuantity(product.id);

    if (cartQty >= stock) {
      Swal.fire({ toast: true, icon: "warning", title: "Stock limit reached", position: "top-end", timer: 1500, showConfirmButton: false });
      return;
    }

    // ✅ Unified price calculation
    const { originalPrice, discountPrice, finalPrice } = getProductPrices(product);

    addToCart({
      ...product,
      itemprice: product.itemprice,
      offerPrice: discountPrice,
      itemPriceWithTax: finalPrice,
    });

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
  const totalFullRows = Math.floor(products.length / ITEMS_PER_ROW);
  const totalPages = Math.floor(totalFullRows / ROWS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    if (totalPages === 0) return [];

    const safePage = Math.min(currentPage, totalPages);

    const start = (safePage - 1) * PER_PAGE;
    const end = start + PER_PAGE;

    return products
      .filter(
        (p) =>
          Number(p?.remaining_stock ?? p?.stock ?? 0) > 0 // ✅ HIDE STOCK = 0
      )
      .slice(start, end);
  }, [products, currentPage, totalPages]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="w-full px-12 pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        RECOMENDED FOR YOU
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


          <div className="
  grid
  gap-4
  [grid-template-columns:repeat(5,minmax(210px,1fr))]
  max-xl:grid-cols-[repeat(auto-fit,minmax(210px,1fr))]
">           {paginatedProducts
              .filter(Boolean)
              .map((product) => {

                const stock = Number(
                  product?.remaining_stock ??
                  product?.stock ??
                  0
                );
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
                              ₹{discountPrice}
                            </span>
                            <span className="text-sm text-red-500 line-through">
                              ₹{originalPrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-green-600">
                            ₹{originalPrice}
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
                        ? "Unavailable"
                        : isStockLimitReached
                          ? "Out of Stock"
                          : "Add to Cart"}
                    </button>
                  </motion.div>
                );
              })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="px-3 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
