import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../constantApi";
import { useCart } from "../CartContext/CartContext";
import SecondNavbar from "../components/secondNavbar";
import Item from "../components/Items";
import SubFamily from "../Pages/subFamily";
import ProductSpecs from "../Pages/ProductSpecs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ProductGallery from "../components/ProductGallery";

// ---------- PRICE HELPERS ----------

// ✅ GLOBAL SAFE VALUE CHECKER
const isValidValue = (val) => {
  if (val === null || val === undefined) return false;

  const clean = String(val)
    .replace(/<[^>]*>/g, "")   // remove html tags
    .replace(/&nbsp;/gi, "")  // remove html spaces
    .trim()
    .toLowerCase();

  // ❌ invalid values
  if (
    clean === "" ||
    clean === "null" ||
    clean === "none" ||
    clean === "undefined" ||
    clean === "nan" ||
    Number(clean) === 0       // ✅ catches "0", "0.0", "0.00", 0
  ) {
    return false;
  }

  return true;
};



// const decodeHtml = (html) => {
//   const txt = document.createElement("textarea");
//   txt.innerHTML = html;
//   return txt.value;
// };

// Best active discount
// ---------- PRICE ENGINE (SINGLE SOURCE OF TRUTH) ----------
const formatDescription = (text = "") => {
  if (!text) return "";

  // if backend already sends html tags, return as is
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text;
  }

  // otherwise convert each line into <p>
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => `<p>${line}</p>`)
    .join("");
};

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

    const price = Number(item.list_price);
    return Number.isFinite(price) && price > 0;
  });

  if (validItems.length === 0) return null;

  return Math.min(...validItems.map(i => Number(i.list_price)));
};

const getPriceWithTax = (price, tax) =>
  Math.round(Number(price) + (Number(price) * Number(tax)) / 100);

const getProductPrices = (product) => {
  const basePrice = Number(product?.itemprice) || 0;
  const tax = Number(product?.tax_master_1?.taxcal) || 0;

  const originalPrice = getPriceWithTax(basePrice, tax);

  const discountBase = getBestDiscount(product?.price_list_items);
  const discountPrice =
    discountBase !== null
      ? getPriceWithTax(discountBase, tax)
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

const ProductDetails = () => {
  const { addToCart, cart } = useCart();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const BASE_URL = constantApi.baseUrl;
  const [loading, setLoading] = useState(true);
  // const [mainImage, setMainImage] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subFamilies, setSubFamilies] = useState([]);
  const departmentId = Number(product?.departname);
  const familyId = Number(product?.familyname);
  const subFamilyId = Number(product?.subfamliy);
  const [uomList, setUomList] = useState([]);

  // =====================
  // RELATED PRODUCTS LOGIC
  // =====================

  const [allProducts, setAllProducts] = useState([]);
  const [related, setRelated] = useState([]);


  //   function applyTax(price, tax) {
  //   price = parseFloat(price) || 0;
  //   tax = parseFloat(tax) || 0;

  //   const final = price + (price * tax) / 100;
  //   return parseFloat(final.toFixed(2)); // Avoid ₹750.008 issue

  // }
  const toTitleCase = (str = "") =>
    str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`${BASE_URL}/item_location_master/filtered_list`)
      .then((res) => {
        const data = res.data.data;
        setAllProducts(data);

        const selected = data.find(
          (item) => String(item.id) === String(params.id)
        );
        console.log("FULL PRODUCT OBJECT:", selected);
        console.log("FULL PRODUCT:", product);

        setProduct(selected);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching product:", error));

  }, [params.id]);
  const getCartQuantity = (productId) => {
    const item = cart.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    // 🔹 Departments
    axios
      .post(`${constantApi.baseUrl}/item_department/filtered_list_by_key`, {
        website_key: "e_com",
      })
      .then((res) => {
        const list = res.data.data.map((d) => ({
          id: Number(d.id),
          name: d.itemdeptname?.trim() || d.departname?.trim(),
        }));
        setDepartments(list);
      })
      .catch(console.error);

    // 🔹 Families
    axios
      .post(`${constantApi.baseUrl}/family_master/filtered_list_by_key`, {
        website_key: "e_com",
      })
      .then((res) => {
        const list = res.data.data.map((f) => ({
          id: Number(f.id),
          name: f.itemfamname?.trim(),
        }));
        setFamilies(list);
      })
      .catch(console.error);
  }, []);
  useEffect(() => {
    if (!product?.familyname) return;

    axios
      .post(`${constantApi.baseUrl}/sub_family_master/by_id_list`, {
        id: product.familyname,
      })
      .then((res) => {
        const list = (res.data.data || []).map((s) => ({
          id: Number(s.id),
          name: s.itemsfamname?.trim() || s.name,
        }));
        setSubFamilies(list);
      })
      .catch(console.error);
  }, [product]);
  const departmentName =
    departments.find((d) => d.id === Number(product?.departname))?.name || "";

  const familyName =
    families.find((f) => f.id === Number(product?.familyname))?.name || "";

  const subFamilyName =
    subFamilies.find((s) => s.id === Number(product?.subfamliy))?.name || "";

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
      discountPrice,
      finalPrice,
    } = getProductPrices(product);

    const added = addToCart({
      ...product,
      offerPrice: discountPrice,
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
  useEffect(() => {
    if (!product || allProducts.length === 0) return;

    const relatedProducts = allProducts
      .filter(
        (item) =>
          item.id !== product.id &&
          String(item.subfamliy) === String(product.subfamliy)
      )
      .slice(0, 8);

    setRelated(relatedProducts);
  }, [product, allProducts]);

  useEffect(() => {
    if (!product || allProducts.length === 0) return;

    const relatedProducts = allProducts
      .filter(
        (item) =>
          item.id !== product.id &&                       // ❌ exclude current product
          String(item.familyname) === String(product.familyname) && // same family
          Number(item.remaining_stock || 0) > 0          // ✅ MUST HAVE STOCK
      )
      .slice(0, 8);

    setRelated(relatedProducts);
  }, [product, allProducts]);

  console.log("All Products:", allProducts);
  console.log("Current Product:", product);
  console.log("Related:", related);

  const getActivePrice = (priceListItems = []) => {
    if (!Array.isArray(priceListItems)) return null;

    const today = new Date();

    const activePrices = priceListItems.filter((item) => {
      if (!item || item.status !== "active") return false;
      if (!item.list_price) return false;

      const start = item.priceList?.start_date
        ? new Date(item.priceList.start_date)
        : null;

      const end = item.priceList?.end_date
        ? new Date(item.priceList.end_date)
        : null;

      if (start && today < start) return false;
      if (end && today > end) return false;

      return true;
    });

    if (activePrices.length === 0) return null;

    const best = activePrices.reduce((a, b) =>
      Number(b.list_price) < Number(a.list_price) ? b : a
    );

    return {
      itemprice: best.itemprice,
      list_price: best.list_price,
    };
  };
  useEffect(() => {
    axios
      .post(`${constantApi.baseUrl}/item_uom/list`)
      .then((res) => {
        if (res.data?.status) {
          setUomList(res.data.data || []);
        }
      })
      .catch((err) => console.error("Error fetching UOM:", err));
  }, []);

  const getSalesUomName = (salesUnitId) => {
    if (!salesUnitId || uomList.length === 0) return "";

    const found = uomList.find(
      (u) => Number(u.id) === Number(salesUnitId)
    );

    return found?.uomname || "";
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
          <div
            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      </div>
    );
  }

  const baseUrl = `${constantApi.imageUrl}/itemsImage/`;
  // ✅ SAFE: product is guaranteed now
  const remainingStock = Number(product.remaining_stock || 0);
  const cartQty = getCartQuantity(product.id);

  const isOutOfStock = remainingStock === 0;
  const isStockLimitReached = cartQty >= remainingStock;
  const isDisabled = isOutOfStock || isStockLimitReached;


  return (
    <>
      <div className="sticky -mt-4 z-30 bg-white shadow">
        <SecondNavbar />
      </div>

      {/* ✅ BREADCRUMB TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex justify-start items-center text-sm gap-1">

          {/* DEPARTMENT */}
          {departmentName && (
            <span
              onClick={() => navigate(`/shop?department=${departmentId}`)}
              className="font-bold cursor-pointer hover:text-blue-600 hover:underline"
            >
              {toTitleCase(departmentName)}
            </span>
          )}

          {(familyName || subFamilyName) && <span className="text-lg">›</span>}

          {/* FAMILY */}
          {familyName && (
            <>
              <span
                onClick={() =>
                  navigate(`/shop?department=${departmentId}&family=${familyId}`)
                }
                className="font-semibold cursor-pointer hover:text-blue-600 hover:underline"
              >
                {toTitleCase(familyName)}
              </span>

              {subFamilyName && <span className="text-lg">›</span>}
            </>
          )}

          {/* SUB FAMILY */}
          {subFamilyName && (
            <span
              onClick={() =>
                navigate(
                  `/shop?department=${departmentId}${familyId ? `&family=${familyId}` : ""
                  }&subfamily=${subFamilyId}`
                )
              }
              className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 hover:underline"
            >
              {toTitleCase(subFamilyName)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-6 mx-auto -mt-3">

        {/* ================= LEFT : PRODUCT IMAGE ================= */}
        {/* ================= LEFT : PRODUCT IMAGE ================= */}
        <div className="flex flex-col items-start lg:w-auto mt-6">

          {/* PRODUCT GALLERY */}
          <ProductGallery product={product} baseUrl={baseUrl} />

        </div>


        {/* ================= CENTER : DESCRIPTION ================= */}
        <div className="
      w-full
      lg:w-[800px]
      pt-4 lg:pt-6
      px-2 lg:pl-10
      lg:h-[512px]
      lg:overflow-y-auto
    ">

          <div className="border-b-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug hover:text-red-500 transition mb-3">
              {product.item_name}
            </h2>

            {/* itemdesclong */}
            {isValidValue(product.note2) && (
              <p className="text-sm font-semibold text-amber-900 leading-relaxed mb-2">
                {product.note2}
              </p>
            )}
          </div>

          {isValidValue(product?.item_description) && (
            <div className="space-y-4 mt-3">
              <div
                className="
        text-sm text-gray-800
        [&_p]:mb-2
        [&_p]:leading-relaxed
        [&_*]:text-left
      "
                dangerouslySetInnerHTML={{
                  __html: formatDescription(product.item_description),
                }}
              />
              <div className="border-b" />
            </div>
          )}


          <div className="-mt-8">
            <ProductSpecs product={product} />
          </div>
        </div>


        {/* ================= RIGHT : PRODUCT DETAILS ================= */}
        <div className="
    
      lg:w-[320px]
      pl-0 lg:pl-7
      lg:h-[512px]
      lg:overflow-y-auto
      text-sm text-gray-800 space-y-3
      pt-4
    ">

          {/* Short Description */}
          {isValidValue(product.itemdesc) && (
            <p className="text-gray-800 font font-semibold mb-1 text-sm leading-relaxed">
              {product.itemdesc}
            </p>
          )}
          {product.itemupc && (
            <p className="font-semibold py-4">UPC :
              <span className="text-sm sm:text-base font-semibold ml-2 text-amber-900">
                {product.itemupc}
              </span></p>
          )}
          {/* Stock + Meta */}
          <div className="space-y-1.5">
            <span
              className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium
          ${isOutOfStock
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-green-100 text-green-700 border border-green-200"
                }`}
            >
              {isOutOfStock ? "Out of Stock" : `In Stock (${remainingStock})`}
            </span>

            {/* {isValidValue(product?.brand?.brandname) && (
              <p className="text-xs text-gray-700">
                <span className="font-medium">Brand:</span>{" "}
                {product.brand.brandname}
              </p>
            )} */}
            {isValidValue(product?.brand?.brandname) &&
              product.brand.brandname.trim().toLowerCase() !== "local" && (
                <p className="text-xs text-gray-800">
                  <span className="font-medium">Brand:</span>{" "}
                  {product.brand.brandname}
                </p>
              )}


            {isValidValue(product?.family_master?.itemfamname) && (
              <p className="text-xs text-gray-700">
                <span className="font-medium">Category:</span>{" "}
                {product.family_master.itemfamname}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            {(() => {
              const { originalPrice, finalPrice, hasValidDiscount } =
                getProductPrices(product);

              return (
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold ">
                    Price
                  </span>

                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{finalPrice}
                    </span>

                    {hasValidDiscount && (
                      <span className="text-2xl font-semibold text-red-500 line-through mb-0.5">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                </div>

              );
            })()}
          </div>

          {/* Size */}
          {isValidValue(product?.size_master?.itemsizename) && (
            <span className="inline-block border rounded px-2 py-0.5 text-xs text-gray-700">
              {product.size_master.itemsizename}
            </span>
          )}

          {/* Specs Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                {isValidValue(product?.item_color?.itemcolname) && (
                  <tr className="border-b">
                    <th className="px-3 py-2 font-medium text-gray-600 bg-gray-50">
                      Color
                    </th>
                    <td className="px-3 py-2 text-gray-800">
                      {product.item_color.itemcolname}
                    </td>
                  </tr>
                )}

                {isValidValue(product?.itmwweight) && (
                  <tr>
                    <th className="px-3 py-2 font-medium text-black bg-gray-50">
                      {product?.item_uom?.uomname === "PCS" ? "Quantity" : "Weight"}
                    </th>
                    <td className="px-3 py-2 bg-fuchsia-200 text-black">
                      {product.itmwweight}{" "}
                      {getSalesUomName(product.itmwsalesunit)}
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

          {/* Add to Cart */}
          <button
            disabled={isDisabled}
            onClick={() => handleAddToCart(product)}
            className={`w-full mt-2 py-2 rounded-lg text-sm font-medium border transition
        ${isDisabled
                ? "!bg-gray-200 text-gray-500 cursor-not-allowed"
                : "!bg-red-500 text-white border-red-500 hover:bg-white hover:text-red-500"
              }`}
          >
            {isOutOfStock
              ? "Unavailable"
              : isStockLimitReached
                ? "Out of Stock"
                : "Add to Cart"}
          </button>
        </div>

      </div>

      <div className=" mt-5"></div>
      <div className="border border-t-2 mb-6"></div>

      {/* related products  */}
      <div className=" pb-16 px-4">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Related Products
        </h2>

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {related.length === 0 && <p>No related products found.</p>}

          {related.map((item) => {
            // ✅ FUNCTIONALITY FIX (shared logic)
            const stock = Number(item.remaining_stock || 0);
            const cartQty = getCartQuantity(item.id);

            const isOutOfStock = stock === 0;
            const isStockLimitReached = stock > 0 && cartQty >= stock;
            const isDisabled = isOutOfStock || isStockLimitReached;

            return (
              <div
                key={item.id}
                className="relative bg-white shadow-md rounded-2xl border w-full h-[410px] flex flex-col overflow-hidden group"
              >
                <div className="relative w-full h-[260px] flex items-center justify-center overflow-hidden bg-white rounded-t-2xl mb-4">
                  <img
                    src={`${baseUrl}${item.item_image}`}
                    alt={item.item_name}
                    className="h-full w-full max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105 mb-1"
                  />

                  {/* Stock Badge (UNCHANGED UI) */}
                  <div
                    className={`absolute top-2 left-2 w-7 h-7 flex items-center justify-center rounded-full
            ${stock === 0
                        ? "bg-red-600 text-white"
                        : "bg-green-600 text-white"
                      } text-sm font-semibold`}
                  >
                    {stock}
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => navigate(`/items/${item.id}`)}
                      className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                      title="View Product"
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </div>
                </div>

                {/* TEXT CONTENT (UNCHANGED) */}
                <div className="pt-4 pb-3 px-4">
                  <h4 className="text-gray-900 text-l font-medium mt-2 leading-tight text-center line-clamp-2 px-2">
                    {item.item_name}
                  </h4>
                  <div className="flex items-baseline justify-center gap-2 mt-2 mb-4">
                    {(() => {
                      const {
                        originalPrice,
                        finalPrice,
                        hasValidDiscount,
                      } = getProductPrices(item);

                      return (
                        <>
                          <p className="text-red-500 text-lg font-bold">
                            ₹{finalPrice}
                          </p>

                          {hasValidDiscount && (
                            <p className="text-sm text-gray-400 line-through">
                              ₹{originalPrice}
                            </p>
                          )}
                        </>
                      );
                    })()}


                  </div>
                  <div className="flex items-center">
                    <div className="flex gap-1 text-sm text-yellow-400">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="text-xs text-gray-500 ml-3"></div>
                  </div>
                </div>

                {/* ADD TO CART BUTTON (UNCHANGED UI) */}
                <button
                  disabled={isDisabled}
                  onClick={() => handleAddToCart(item)}
                  className={`block w-full py-2 text-center rounded-b-2xl transition font-medium ${isDisabled
                    ? "!bg-gray-300 !text-gray-600 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-transparent hover:text-primary border border-primary"
                    }`}
                >
                  {isOutOfStock
                    ? "Unavailable"
                    : isStockLimitReached
                      ? "Out of Stock"
                      : "Add to Cart"}
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
};

export default ProductDetails;
