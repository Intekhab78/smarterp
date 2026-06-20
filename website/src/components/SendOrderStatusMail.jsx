import { useEffect, useRef } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import constantApi from "../constantApi";

const POLL_INTERVAL = 30000;

const MAIL_ALLOWED_STATUSES = ["confirmed", "ready to ship", "delivered"];

const OrderStatusMailWatcher = () => {
  const startedRef = useRef(false);

  /* -------- INIT EMAILJS -------- */
  useEffect(() => {
    emailjs.init("y1ZeA1DdZgghv5hq5");
  }, []);

  /* -------- FETCH STATUS + POLLING -------- */
  useEffect(() => {
    const checkOrdersAndSendMail = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem("customerDetails"));
        if (!customer?.customer_code) return;

        const res = await axios.post(
          `${constantApi.baseUrl}/order/ecommerce_orders/by-customer`,
          {
            customer_id: customer.customer_code,
            company_id: 21,
            location_id: 20,
          }
        );

        const orders = Array.isArray(res.data?.data)
          ? res.data.data
          : res.data?.data?.orders || [];

        orders.forEach((order) => {
          const mailKey = `last_mailed_status_${order.id}`;
          const currentStatus = Number(order.current_order_status);
          const lastMailed = Number(localStorage.getItem(mailKey));

          if (lastMailed !== currentStatus) {
            sendTrackingMail(order);
            localStorage.setItem(mailKey, currentStatus);
          }
        });
      } catch (err) {
        console.error("❌ Order polling failed", err);
      }
    };

    // run immediately
    checkOrdersAndSendMail();

    const interval = setInterval(checkOrdersAndSendMail, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  /* -------- SEND MAIL -------- */
  const sendTrackingMail = (order) => {
    const email = order?.customer_email;
    if (!email) return;

    const statusName = order?.current_order_status_name || "";
    const normalized = statusName.toLowerCase().replace(/[_-]/g, " ").trim();

    const isAllowed = MAIL_ALLOWED_STATUSES.some((s) => normalized.includes(s));
    if (!isAllowed) return;

    let headingMessage = "Order Update 📦";
    if (normalized.includes("confirm")) headingMessage = "Order Confirmed ✅";
    if (normalized.includes("ready") || normalized.includes("out"))
      headingMessage = "Order On The Way 🚚";
    if (normalized.includes("deliver")) headingMessage = "Order Delivered 🎉";

    const templateParams = {
      email,
      order_number: order.order_number,
      order_status_label: statusName,
      heading_message: headingMessage,
      ...buildTrackingColors(statusName),
    };

    emailjs
      .send("service_lf1r0wb", "template_n2w81ep", templateParams)
      .then(() => console.log("✅ Mail sent"))
      .catch((err) => console.error("❌ Mail failed", err));
  };

  /* -------- COLORS -------- */
  const buildTrackingColors = (statusName = "") => {
    const green = "#2e7d32";
    const gray = "#ccc";

    const normalized = statusName.toLowerCase();
    let step = 1;

    if (normalized.includes("confirm")) step = 2;
    else if (normalized.includes("ready")) step = 3;
    else if (normalized.includes("out")) step = 4;
    else if (normalized.includes("deliver")) step = 5;

    const obj = {};
    for (let i = 1; i <= 5; i++) {
      obj[`step${i}_bg`] = i <= step ? green : gray;
      obj[`step${i}_text`] = i <= step ? green : "#999";
      if (i < 5) obj[`line${i}`] = i < step ? green : gray;
    }
    return obj;
  };

  return null;
};

export default OrderStatusMailWatcher;
