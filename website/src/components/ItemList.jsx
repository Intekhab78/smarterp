import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../CartContext/CartContext";
import constantApi from "../constantApi";

// Helpers
const getBestDiscount = (priceItems) => {
  if (!Array.isArray(priceItems) || priceItems.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize date

  const validItems = priceItems.filter((item) => {
    if (!item) return false;

    // ✅ item + priceList must be active
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


const getBaseItemPrice = (product) => {
  const locPrice = parseFloat(product?.item_location_master_data?.[0]?.itemprice);
  if (!isNaN(locPrice) && locPrice > 0) return locPrice;

  const rootPrice = parseFloat(product?.itemprice);
  if (!isNaN(rootPrice) && rootPrice > 0) return rootPrice;

  return null;
};

function ItemList() {
  const baseUrl = `${constantApi.imageUrl}/itemsImage/`;
  const { addToCart, cart } = useCart();
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 32; // number of items per page
  const [currentPage, setCurrentPage] = useState(0); // current page index

  const { id } = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${constantApi.baseUrl}/item_location_master/filtered_list`);
      const allItems = res.data?.data || [];

      // Determine category type
      const categoryType = (() => {
        if (allItems.some(p => String(p.subfamliy) === String(categoryId))) return "subFamily";
        if (allItems.some(p => String(p.familyname) === String(categoryId))) return "family";
        return "department";
      })();

      // Filter items based on category type
      let filteredItems = allItems.filter((item) => {
        if (categoryType === "subFamily") return String(item.subfamliy) === String(categoryId);
        if (categoryType === "family") return String(item.familyname) === String(categoryId);
        return String(item.departname) === String(categoryId);
      });

      // Remove products with 0 price, 0 stock, or no image
      filteredItems = filteredItems.filter((product) => {
        const price = getBaseItemPrice(product);
        const stock = Number(product.remaining_stock || 0);
        const hasImage = product?.item_master_image?.length > 0 || product.item_image;
        return price > 0 && stock > 0 && hasImage;
      });

      setProducts(filteredItems);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to load products. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Product ID:", id);

    setCurrentPage(0); // reset page when category changes

  }, [categoryId]);
  const getCartQuantity = (productId) => {
    const item = cart.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart1 = (product) => {
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
    const basePrice = getBaseItemPrice(product);
    const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

    // 🚫 Price not available
    if (basePrice === null) {
      Swal.fire({
        icon: "warning",
        title: "Price unavailable",
        text: "This product cannot be added to cart right now.",
      });
      return;
    }

    // Price with tax
    let priceWithTax = basePrice + (basePrice * tax) / 100;
    priceWithTax = parseFloat(priceWithTax.toFixed(2));

    // Discount logic
    const discount = getBestDiscount(product?.price_list_items);
    const finalPrice =
      discount && discount < priceWithTax ? discount : priceWithTax;

    // ✅ Capture return value
    const added = addToCart({
      ...product,
      itemprice: priceWithTax,
      offerPrice: discount,

      itemPriceWithTax: finalPrice,
      quantity: 1,
    });

    // 🚫 Stop if addToCart failed
    if (!added) return;

    // ✅ Success toast
    Swal.fire({
      toast: true,
      position: "top-end",
      timer: 1600,
      showConfirmButton: false,
      background: "rgba(0,0,0,0.75)",
      color: "#fff",
      html: `
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
          ✔
        </div>
        <div>
          <p class="text-white font-bold text-base">Added to Cart 🛒</p>
          <p class="text-white/80 text-xs mt-1">
             
          </p>
        </div>
      </div>
    `,
    });
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

    const basePrice = getBaseItemPrice(product);
    const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

    if (basePrice === null) {
      Swal.fire({
        icon: "warning",
        title: "Price unavailable",
        text: "This product cannot be added to cart right now.",
      });
      return;
    }

    const priceWithTax = parseFloat(
      (basePrice + (basePrice * tax) / 100).toFixed(2)
    );

    let discount = getBestDiscount(product.price_list_items);

    if (discount !== null) {
      discount = parseFloat(
        (discount + (discount * tax) / 100).toFixed(2)
      );
    }

    const showDiscount =
      discount !== null && discount < priceWithTax;

    const finalPrice = showDiscount ? discount : priceWithTax;

    const added = addToCart({
      ...product,
      itemprice: priceWithTax,     // original price
      offerPrice: discount,        // offer price (if any)
      itemPriceWithTax: finalPrice, // ✅ correct final price
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



  const getStockBadge = (stock) => {
    if (stock === 0) return { label: "0", color: "bg-red-600" };
    if (stock <= 5) return { label: `${stock} left`, color: "bg-orange-500" };
    return { label: `${stock}`, color: "bg-green-600" };
  };

  // Related items: same sub-family only
  const relatedItems = products.filter(p => String(p.subfamliy) === String(categoryId));

  return (
    <div className="container pb-16">
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
          No products found.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
            {products
              .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) // <-- pagination
              .map((product) => {
                const stock = Number(product.remaining_stock || 0);
                const cartQty = getCartQuantity(product.id);
                const isStockLimitReached = cartQty >= stock;
                const isDisabled = stock === 0 || isStockLimitReached;
                const badge = getStockBadge(stock);

                const basePrice = getBaseItemPrice(product);
                const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

                const priceWithTax =
                  basePrice !== null
                    ? Math.round(basePrice + (basePrice * tax) / 100)
                    : null;

                let discount = getBestDiscount(product.price_list_items);

                // add tax to discount
                if (discount !== null) {
                  discount = Math.round(discount + (discount * tax) / 100);
                }

                const showDiscount =
                  priceWithTax !== null &&
                  discount !== null &&
                  discount < priceWithTax;

                const image = product?.item_master_image?.length > 0
                  ? `${baseUrl}${product.item_master_image[0].main_image || product.item_master_image[0].item_image}`
                  : product.item_image
                    ? `${baseUrl}${product.item_image}`
                    : "/no-image.png";

                return (
                  <div key={product.id} className="relative bg-white shadow-md rounded-2xl border flex flex-col overflow-hidden">
                    <span className={`absolute top-2 left-1 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-semibold text-white ${badge.color} z-20`}>
                      {badge.label}
                    </span>

                    <Link to={`/items/${product.id}`}>
                      <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden bg-white rounded-t-2xl mb-4">
                        <img src={image} alt={product.item_name} className="max-h-full max-w-full object-contain" />
                      </div>
                    </Link>

                    <Link to={`/items/${product.id}`}>
                      <p className="text-gray-900 text-xs font-medium text-center px-2 h-[36px] overflow-hidden">
                        {product.item_name}
                      </p>
                    </Link>

                    <div className="text-center mt-2 mb-4 h-[45px] flex flex-col items-center justify-center">
                      {priceWithTax === null ? (
                        <span className="text-xs text-gray-400">Price not available</span>
                      ) : showDiscount ? (
                        <>
                          <span className="text-sm font-bold text-green-600">₹{discount}</span>
                          <span className="text-xs text-red-500 line-through font-bold">₹{priceWithTax}</span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-green-600">₹{priceWithTax}</span>
                      )}
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
                          ? "Limit Reached"
                          : "Add to Cart"}
                    </button>

                  </div>
                );
              })}
          </div>
          {products.length > itemsPerPage && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                className="px-3 py-1 rounded border bg-white text-gray-700"
                disabled={currentPage === 0}
              >
                Prev
              </button>

              {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`px-3 py-1 rounded border ${currentPage === index ? "bg-primary text-white" : "bg-white text-gray-700"}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage) - 1))}
                className="px-3 py-1 rounded border bg-white text-gray-700"
                disabled={currentPage === Math.ceil(products.length / itemsPerPage) - 1}
              >
                Next
              </button>
            </div>
          )}



          {/* Related Items */}
          {relatedItems.length > 1 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-4">Related Items</h2>
              <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
                {relatedItems
                  .filter(p => p.id !== relatedItems[0].id) // exclude current item
                  .slice(0, 4) // <-- LIMIT TO 4 ITEMS
                  .map(product => {
                    const stock = Number(product.remaining_stock || 0);
                    const cartQty = getCartQuantity(product.id);
                    const isStockLimitReached = cartQty >= stock;
                    const isDisabled = stock === 0 || isStockLimitReached;
                    const badge = getStockBadge(stock);

                    // const basePrice = getBaseItemPrice(product);
                    // const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;
                    // const priceWithTax = basePrice !== null ? Math.round(basePrice + (basePrice * tax) / 100) : null;
                    // const discount = getBestDiscount(product.price_list_items + (product.price_list_items * tax) / 100);
                    // const showDiscount = priceWithTax !== null && discount !== null && discount < priceWithTax;

                    const basePrice = getBaseItemPrice(product);
                    const tax = parseFloat(product?.tax_master_1?.taxcal) || 0;

                    // Base price with tax
                    const priceWithTax =
                      basePrice !== null
                        ? Math.round(basePrice + (basePrice * tax) / 100)
                        : null;

                    // Get discount (base)
                    let discount = getBestDiscount(product.price_list_items);

                    // 👉 ADD TAX TO DISCOUNT
                    if (discount !== null) {
                      discount = Math.round(discount + (discount * tax) / 100);
                    }

                    // Compare tax-inclusive values
                    const showDiscount =
                      priceWithTax !== null &&
                      discount !== null &&
                      discount < priceWithTax;


                    const image = product?.item_master_image?.length > 0
                      ? `${baseUrl}${product.item_master_image[0].main_image || product.item_master_image[0].item_image}`
                      : product.item_image
                        ? `${baseUrl}${product.item_image}`
                        : "/no-image.png";

                    return (
                      <div key={product.id} className="relative bg-white shadow-md rounded-2xl border flex flex-col overflow-hidden">
                        <span className={`absolute top-2 left-1 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-semibold text-white ${badge.color} z-20`}>
                          {badge.label}
                        </span>

                        <Link to={`/items/${product.id}`}>
                          <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden bg-white rounded-t-2xl mb-4">
                            <img src={image} alt={product.item_name} className="max-h-full max-w-full object-contain" />
                          </div>
                        </Link>

                        <Link to={`/items/${product.id}`}>
                          <p className="text-gray-900 text-xs font-medium text-center px-2 h-[36px] overflow-hidden">
                            {product.item_name}
                          </p>
                        </Link>

                        <div className="text-center mt-2 mb-4 h-[45px] flex flex-col items-center justify-center">
                          {priceWithTax === null ? (
                            <span className="text-xs text-gray-400">Price not available</span>
                          ) : showDiscount ? (
                            <>
                              <span className="text-sm font-bold text-green-600">₹{discount}</span>
                              <span className="text-xs text-red-500 line-through font-bold">₹{priceWithTax}</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-green-600">₹{priceWithTax}</span>
                          )}
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
            </div>
          )}

        </>
      )}
    </div>
  );
}

export default ItemList;
