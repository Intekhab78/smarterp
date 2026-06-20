import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import constantApi from "../constantApi";
import axios from "axios";


const OrderSuccess = () => {
  const navigate = useNavigate();
  const [emailReady, setEmailReady] = useState(false);

  const [savedOrder, setSavedOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);



  useEffect(() => {
    emailjs.init("y1ZeA1DdZgghv5hq5");
    setEmailReady(true);
  }, []);


  // 🔹 Build product list HTML for email
  const buildOrderItemsHTML = (items = []) => {
    return items
      .map((row) => {
        const item = row.itemLocationModel || {};

        const imageUrl = `${constantApi.imageUrl}/itemsImage/${item.item_image}`;
        const name = item.item_name || "Item";
        const qty = Number(row.item_qty || 1);
        const price = Number(row.item_grand_total || 0);

        return `
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:8px; width:70px">
            <img src="${imageUrl}" width="60" height="60"
              style="border-radius:6px; object-fit:cover; display:block;" />
          </td>
          <td style="padding:8px; font-size:14px">
            <strong>${name}</strong><br/>
            <span style="color:#666">Qty: ${qty}</span>
          </td>
          <td style="padding:8px; text-align:right; font-weight:600">
₹${Math.round(price)}
          </td>
        </tr>
      `;
      })
      .join("");
  };

  const calculateEmailTotal = (items = []) => {
    return items.reduce((sum, row) => {
      const price = Number(row.item_grand_total || 0);
      return sum + price;
    }, 0);
  };

  const sendOrderEmail = async (orderNumber) => {
    const customer = JSON.parse(localStorage.getItem("customerDetails"));
    const customerEmail = customer?.email;

    if (!customerEmail || !customer?.customer_code) return;

    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/order/ecommerce_orders/by-customer`,
        {
          customer_id: customer.customer_code,
          company_id: 21,
          location_id: 20,
        }
      );

      console.log("ORDERS API FULL RESPONSE 👉", res.data);

      // ✅ FIXED HERE
      const orders = res.data?.data?.orders || [];

      console.log("ORDERS ARRAY 👉", orders.length);

      const fullOrder = orders.find(o => o.order_number === orderNumber);

      if (!fullOrder) {
        console.error("❌ Order not found in customer orders");
        return;
      }

      const orderItems = fullOrder?.order_details || [];

      console.log("EMAIL ITEMS 👉", orderItems);

      const itemsHTML = buildOrderItemsHTML(orderItems);
      const emailTotal = calculateEmailTotal(orderItems);

      const templateParams = {
        email: customerEmail,
        order_number: orderNumber,
        shipping: 0,
        tax: 0,
        total: Math.round(emailTotal),
        order_items_html: itemsHTML,
      };

      await emailjs.send("service_fkqd74p", "template_3wnwa6u", templateParams);
      console.log("✅ Order email sent");

    } catch (err) {
      console.error("❌ Email send failed", err.response?.data || err);
    }
  };

  // ✔ Load saved order from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("SuccessOrder"));
    console.log("SuccessOrder-----------------------", stored);

    if (stored && emailReady) {
      setSavedOrder(stored);
      localStorage.setItem("lastOrder", JSON.stringify(stored));

      const id = stored?.Order?.id;
      const num = stored?.order_number;

      if (id) {
        setOrderId(id);
        localStorage.setItem("lastOrderId", id);
      }

      if (num) {
        setOrderNumber(num);
      }

      sendOrderEmail(num);

    }
  }, [emailReady]);   // ✅ IMPORTANT


  // ❌ If no order found
  if (!orderNumber) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Order Not Found</h2>
        <p className="text-gray-500 mt-2">
          We could not retrieve your order. Please try again.
        </p>
      </div>
    );
  }

  // ✔ Redirect to order details page
  const goToOrderDetails = () => {
    navigate(`/accounts`, {
      state: { activeTab: "orders", order: savedOrder },
    });
  };


  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful!
        </h1>

        <p className="text-gray-700 mt-3">Thank you for your order</p>

        <div className="mt-5 bg-gray-100 p-4 rounded">
          <p className="text-lg">
            <strong>Order ID:</strong> {orderNumber}
          </p>
        </div>

        <button
          className="mt-6 w-full px-4 py-2 !bg-blue-600 text-white rounded hover:!bg-blue-700"
          onClick={goToOrderDetails}
        >
          View Order Details
        </button>
      </div>

      <style>{`
        .confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 0;
          pointer-events: none;
          z-index: 9999;
          animation: drop 2s ease-in-out forwards;
          background-image: radial-gradient(#ff7eb3 4px, transparent 4px),
            radial-gradient(#ffbb54 4px, transparent 4px),
            radial-gradient(#8bff76 4px, transparent 4px),
            radial-gradient(#77e6ff 4px, transparent 4px);
          background-size: 20px 20px;
        }
        @keyframes drop {
          0% { height: 0; opacity: 1; }
          100% { height: 200vh; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
