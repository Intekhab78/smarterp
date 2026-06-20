import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import constantApi from "../constantApi";

// Create Context
const CartContext = createContext();

/* -------------------- */
/* Normalize Cart Item  */
/* -------------------- */
const normalizeCartItem1 = (item) => {
  console.log("items is --------===========", item);

  const priceListItem = item?.price_list_items?.[0];

  const isOfferValid =
    priceListItem?.status === "active" && priceListItem?.list_price;

  return {
    id: item.id || item.item_id,
    name: item.item_name,
    image: item.item_image,

    // ✅ UI PRICE (NO TAX)
    price: isOfferValid
      ? Number(priceListItem.list_price)
      : Number(item.itemprice || 0),

    // ✅ BILLING PRICE (WITH TAX)
    itemPriceWithTax: Number(item.itemPriceWithTax || 0),

    tax: Number(item?.tax_master_1?.taxcal || 0),
    quantity: 1,

    remaining_stock: Number(item.remaining_stock ?? item.stock ?? 0),
    itemdesclong: item.itemdesclong ?? null,
    itemdesc3: item.itemdesc3 ?? null,
    brand: item.brand?.brandname || null,
    color: item.item_color?.itemcolname || null,
    size: item.size_master?.itemsizename || null,
  };
};

const normalizeCartItem = (item) => {
  const priceListItem = item?.price_list_items?.[0];
  const tax = Number(item?.tax_master_1?.taxcal || 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let isOfferValid = false;
  let offerPrice = null;

  if (priceListItem?.status === "active" && priceListItem?.list_price) {
    const startDate = priceListItem.start_date
      ? new Date(priceListItem.start_date)
      : priceListItem.priceList?.start_date
        ? new Date(priceListItem.priceList.start_date)
        : null;

    const endDate = priceListItem.end_date
      ? new Date(priceListItem.end_date)
      : priceListItem.priceList?.end_date
        ? new Date(priceListItem.priceList.end_date)
        : null;

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    if ((!startDate || today >= startDate) && (!endDate || today <= endDate)) {
      isOfferValid = true;
      offerPrice = parseFloat(priceListItem.list_price);
    }
  }

  // Base price
  const basePrice = parseFloat(item.itemprice || 0);

  // Price including tax
  const finalPriceWithTax = isOfferValid
    ? parseFloat((offerPrice + (offerPrice * tax) / 100).toFixed(2))
    : parseFloat((basePrice + (basePrice * tax) / 100).toFixed(2));

  return {
    id: item.id || item.item_id,
    name: item.item_name,
    image: item.item_image,
    // ✅ ADD THESE TWO LINES
    company_id: item.company_id,
    location_id: item.location_id,

    // ✅ UI price
    price: isOfferValid ? offerPrice : basePrice,

    // ✅ Final billing price
    itemPriceWithTax: finalPriceWithTax,

    tax: tax,
    quantity: 1,

    remaining_stock: Number(item.remaining_stock ?? item.stock ?? 0),
    itemdesclong: item.itemdesclong ?? null,
    itemdesc3: item.itemdesc3 ?? null,

    brand: item.brand?.brandname || null,
    color: item.item_color?.itemcolname || null,
    size: item.size_master?.itemsizename || null,
  };
};

/* -------------------- */
/* Cart Provider        */
/* -------------------- */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  /* -------------------- */
  /* Fetch Backend Cart   */
  /* -------------------- */
  const fetchUserCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${constantApi.baseUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const backendItems = (res.data.items || res.data || []).map((item) => ({
        id: item.id || item.item_id,
        name: item.item_name,
        image: item.item_image,
        price: Number(item.itemprice) || 0,
        offerPrice: item.offerPrice,
        itemPriceWithTax: Number(item.itemPriceWithTax) || 0,
        tax: Number(item?.tax_master_1?.taxcal) || 0,
        quantity: item.quantity || 1,

        // ✅ FIX HERE TOO
        remaining_stock: Number(item.remaining_stock ?? item.stock ?? 0),
        itemdesclong: item.itemdesclong ?? null,
        itemdesc3: item.itemdesc3 ?? null,

        brand: item.brand?.brandname || null,
        color: item.item_color?.itemcolname || null,
        size: item.size_master?.itemsizename || null,
      }));

      setCart(backendItems);
    } catch (err) {
      console.log("Cart fetch failed:", err);
    }
  };

  /* -------------------- */
  /* Persist Cart        */
  /* -------------------- */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* -------------------- */
  /* Add To Cart         */
  /* -------------------- */
  const addToCart = (item) => {
    const normalizedItem = normalizeCartItem(item);

    // 🚫 OUT OF STOCK
    if (normalizedItem.remaining_stock <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Out of Stock",
        text: "This item is currently unavailable",
        timer: 1500,
        showConfirmButton: false,
      });
      return false;
    }

    const existingItem = cart.find(
      (cartItem) => cartItem.id === normalizedItem.id
    );
    const showStockAlert = (item) => {
      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 1600,
        showConfirmButton: false,
        background: "#000",
        color: "#fff",
        html: `
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold">!</div>
        <div>
          <p class="text-red-500 font-semibold text-sm">Stock Limit Reached</p>
          <p class="text-white/80 text-xs mt-0.5">
            Only ${item.remaining_stock ?? 0} item(s) available
          </p>
        </div>
      </div>
    `,
      });
    };

    if (existingItem) {
      // 🚫 STOCK LIMIT
      if (existingItem.quantity >= existingItem.remaining_stock) {
        showStockAlert(existingItem);
        return false;
      }

      setCart(
        cart.map((cartItem) =>
          cartItem.id === normalizedItem.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, normalizedItem]);
    }

    return true;
  };

  /* -------------------- */
  /* Update Quantity     */
  /* -------------------- */
  const updateQuantity = (id, action) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== id) return item;

        let newQty = item.quantity;

        if (action === "inc") {
          if (item.quantity >= item.remaining_stock) {
            Swal.fire({
              toast: true,
              position: "top-end",
              timer: 1600,
              showConfirmButton: false,
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              html: `
    <div class="flex items-center space-x-2">
      <div class="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold">
        !
      </div>
      <div>
        <p class="text-white font-semibold text-sm">
          Stock Limit Reached
        </p>
        <p class="text-white/80 text-xs mt-0.5">
          Only ${item.remaining_stock} item(s) available
        </p>
      </div>
    </div>
  `,
            });

            return item;
          }
          newQty += 1;
        }

        if (action === "dec") {
          newQty = Math.max(1, newQty - 1);
        }

        if (typeof action === "number") {
          newQty = Math.min(
            Math.max(1, Math.floor(action)),
            item.remaining_stock
          );
        }

        return { ...item, quantity: newQty };
      })
    );
  };

  /* -------------------- */
  /* Remove Item         */
  /* -------------------- */
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };
  /* -------------------- */
  /* Cart Count          */
  /* -------------------- */
  const getCartItemCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartItemCount,
        fetchUserCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* -------------------- */
/* Custom Hook          */
/* -------------------- */
export const useCart = () => useContext(CartContext);
