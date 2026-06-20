import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart as clearReduxCart } from "../redux/cartSlice";
import api from "../api";

const PayUOrderHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSubmitted = useRef(false);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("Processing your payment...");

  const extractInvoiceNumber = (data) => {
    const candidates = [
      data?.invoice?.invoice_number,
      data?.data?.invoice?.invoice_number,
      data?.Order?.invoice?.invoice_number,
      data?.order?.invoice?.invoice_number,
      data?.invoice_number,
      data?.data?.invoice_number,
      data?.Order?.invoice_number,
      data?.order?.invoice_number,
    ];
    return candidates.find((v) => v);
  };

  const extractOrderNumber = (data) => {
    const candidates = [
      data?.order_number,
      data?.data?.order_number,
      data?.Order?.order_number,
      data?.order?.order_number,
      data?.Order?.next_order_number,
      data?.order?.next_order_number,
    ];
    return candidates.find((v) => v);
  };

  const extractOrderId = (data) => {
    const candidates = [
      data?.order_id,
      data?.data?.order_id,
      data?.Order?.id,
      data?.order?.id,
      data?.data?.Order?.id,
      data?.data?.order?.id,
      data?.id,
    ];
    return candidates.find((v) => v);
  };

  const normalizePayUInfo = (payuInfo) => ({
    mihpayid: payuInfo?.mihpayid || null,
    mode: payuInfo?.mode || null,
    status: payuInfo?.status || null,
    unmappedstatus: payuInfo?.unmappedstatus || null,
    key: payuInfo?.key || null,
    txnid: payuInfo?.txnid || null,
    amount: payuInfo?.amount || null,
    cardCategory: payuInfo?.cardCategory || null,
    discount: payuInfo?.discount || null,
    net_amount_debit: payuInfo?.net_amount_debit || null,
    addedon: payuInfo?.addedon || null,
    productinfo: payuInfo?.productinfo || null,
    firstname: payuInfo?.firstname || null,
    email: payuInfo?.email || null,
    phone: payuInfo?.phone || null,
    hash: payuInfo?.hash || null,
    field1: payuInfo?.field1 || null,
    field2: payuInfo?.field2 || null,
    field3: payuInfo?.field3 || null,
    field4: payuInfo?.field4 || null,
    field5: payuInfo?.field5 || null,
    field6: payuInfo?.field6 || null,
    field7: payuInfo?.field7 || null,
    field8: payuInfo?.field8 || null,
    field9: payuInfo?.field9 || null,
    payment_source: payuInfo?.payment_source || null,
    PG_TYPE: payuInfo?.PG_TYPE || null,
    bank_ref_num: payuInfo?.bank_ref_num || null,
    bankcode: payuInfo?.bankcode || null,
    error: payuInfo?.error || null,
    error_Message: payuInfo?.error_Message || null,
    cardnum: payuInfo?.cardnum || null,
  });

  useEffect(() => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const queryParams = new URLSearchParams(location.search);
    const txnid = queryParams.get("txnid");

    if (!txnid) {
      navigate("/scan");
      return;
    }

    const processOrder = async () => {
      try {
        const pendingRes = await api.get(`/order/ecommerce/pending/${txnid}`);
        if (!pendingRes.data.success) {
          setMessage("Order data not found. Redirecting...");
          return setTimeout(() => navigate("/scan"), 2500);
        }
        const pendingOrder = pendingRes.data.data.payload;
        /* ----------------------------------
           2️⃣ Fetch PayU payment details
        -----------------------------------*/
        const payuRes = await api.get(`/payment/payu-details/${txnid}`);
        if (!payuRes.data.success) {
          setMessage("Payment info not found. Redirecting...");
          return setTimeout(() => navigate("/scan"), 2500);
        }
        const payuInfo = normalizePayUInfo(payuRes.data.data);
        /* ----------------------------------
           3️⃣ Merge PayU info into order
        -----------------------------------*/
        const payloadWithPayu = {
          ...pendingOrder,
          payment_details: {
            ...pendingOrder.payment_details,
            status: "PAID",
            payu: payuInfo,
          },
        };

        /* ----------------------------------
           4️⃣ Create FINAL order
        -----------------------------------*/
        const orderRes = await api.post(
          "/order/ecommerce/order-add",
          payloadWithPayu,
        );

        if (!orderRes.data.status) {
          setMessage("Failed to create order. Redirecting...");
          return setTimeout(() => navigate("/scan"), 2500);
        }

        /* ----------------------------------
           5️⃣ Success cleanup
        -----------------------------------*/
        const receiptDraft = JSON.parse(localStorage.getItem("pos_receipt") || "null");
        const orderData =
          orderRes.data?.data || orderRes.data?.Order || orderRes.data?.order || orderRes.data || {};
        const pendingItems = pendingOrder?.items || [];
        const itemsSource =
          Array.isArray(orderData.items) && orderData.items.length
            ? orderData.items
            : receiptDraft?.items?.length
              ? receiptDraft.items
              : pendingItems;
        const receiptItems = itemsSource.map((item) => {
          const quantity = Number(item.quantity || item.qty || item.item_qty || 1);
          const price = Number(
            item.price ||
            item.item_price ||
            item.itemPriceWithTax ||
            item.item_grand_total ||
            0,
          );
          const total =
            Number(item.total) ||
            Number(item.item_grand_total) ||
            price * quantity;
          return {
            ...item,
            name:
              item.name ||
              item.item_name ||
              item.itemLocationModel?.item_name ||
              item.item?.item_name ||
              item.item_id,
            quantity,
            price,
            total,
          };
        });
        const receipt = {
          ...orderData,
          id:
            orderData.id ||
            orderData.order_id ||
            orderRes.data?.id ||
            orderRes.data?.order_id ||
            pendingOrder?.id ||
            pendingOrder?.order_number ||
            "—",
          store_name:
            receiptDraft?.store_name ||
            orderData.store_name ||
            "IslamicBookZone",
          company_id:
            orderData.company_id ||
            pendingOrder?.company_id ||
            receiptDraft?.company_id ||
            null,
          location_id:
            orderData.location_id ||
            pendingOrder?.location_id ||
            receiptDraft?.location_id ||
            null,
          customer:
            receiptDraft?.customer ||
            orderData.customer ||
            {
              name: "Walk-in Customer",
              email: "walkin@store.com",
              phone: "9999999999",
            },
          payment_terms:
            orderData.payment_terms ||
            pendingOrder?.payment_terms ||
            receiptDraft?.payment_terms ||
            "payu",
          total: Number(
            orderData.total || receiptDraft?.total || pendingOrder?.total || 0,
          ),
          tax_total: Number(
            orderData.tax_total ||
            receiptDraft?.tax_total ||
            pendingOrder?.tax_total ||
            0,
          ),
          cgst: Number(
            orderData.cgst ||
            receiptDraft?.cgst ||
            pendingOrder?.cgst ||
            0,
          ),
          sgst: Number(
            orderData.sgst ||
            receiptDraft?.sgst ||
            pendingOrder?.sgst ||
            0,
          ),
          items: receiptItems,
        };

        localStorage.setItem("SuccessOrder", JSON.stringify(receipt));
        localStorage.removeItem("pos_receipt");
        dispatch(clearReduxCart());
        // navigate(`/accounts`, {
        //   state: { activeTab: "orders" },
        // });

        Swal.fire({
          icon: "success",
          title: "Order Successful!",
          text: "Thank you for your purchase.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        }).then(() => {
          const invoiceNumber = extractInvoiceNumber(orderRes.data);
          const orderNumber = extractOrderNumber(orderRes.data);
          const orderId = extractOrderId(orderRes.data);
          const query = new URLSearchParams();
          if (orderNumber) query.set("order_number", orderNumber);
          if (invoiceNumber) query.set("invoice_number", invoiceNumber);
          if (orderId) query.set("order_id", orderId);

          navigate(
            `/order-review${query.toString() ? `?${query.toString()}` : ""}`,
            { replace: true },
          );
        });
      } catch (error) {
        console.error("PayU order handler error:", error);
        setMessage("Something went wrong. Redirecting...");
        setTimeout(() => navigate("/scan"), 2500);
      }
    };

    processOrder();
  }, [location.search, navigate, dispatch]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default PayUOrderHandler;
