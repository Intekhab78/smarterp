import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import api from "../api";
import { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "../constantApi";
// import { loadRazorpayScript } from "../components/Payments/loadRazorpay";
import { startPayUPayment } from "../components/Payments/payU";
// import useHideTawk from "../hooks/useHideTawk";
import POSPageFooter from "../components/POSPageFooter";

export default function Payment() {
    // useHideTawk();

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    /* ---------------- POS CONFIG ---------------- */
    const posData =
        location.state || JSON.parse(localStorage.getItem("posData")) || {};

    const {
        company_id,
        location_id,
        pos_mode = true,
        currency = "INR",
    } = posData;

    const [loading, setLoading] = useState(false);
    // const [paymentMethod, setPaymentMethod] = useState("cash");
    const [sessionReady, setSessionReady] = useState(false);

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

    useEffect(() => {
        const autoLoginWalkin = async () => {
            try {
                await axios.post(
                    `${constantApi.baseUrl}/customer/customer_login`,
                    {
                        login_id: "walkin@store.com",
                        password: "123456",
                    },
                    { withCredentials: true }
                );

                console.log("Walk-in auto login success");
                setSessionReady(true);
            } catch (err) {
                console.error("Auto login failed", err.response?.data || err);
            }
        };

        autoLoginWalkin();
    }, []);
    /* ---------------- SAVE CONFIG ---------------- */
    useEffect(() => {
        if (location.state) {
            localStorage.setItem("posData", JSON.stringify(location.state));
        }
    }, [location.state]);

    /* ---------------- PROTECT EMPTY CART ---------------- */
    useEffect(() => {
        if (!cart.length) navigate("/scan");
    }, [cart, navigate]);

    /* ---------------- WALKIN CUSTOMER ---------------- */
    const WALKIN = {
        id: "WALKIN",
        code: "WALKIN",
        name: "Walk-in Customer",
        email: "walkin@store.com",
        phone: "9999999999",
    };

    const DEFAULT_ADDRESS = {
        full_name: WALKIN.name,
        phone_number: WALKIN.phone,
        address_line1: "POS Store",
        address_line2: "",
        city: "Local",
        state: "Local",
        country: "India",
        pincode: "000000",
    };

    /* ---------------- TOTAL ---------------- */
    const total = cart.reduce(
        (sum, item) =>
            sum + Number(item.price || 0) * Number(item.qty || item.quantity || 1),
        0
    );
    const totalQty = cart.reduce(
        (sum, item) => sum + Number(item.qty || item.quantity || 1),
        0
    );
    /* ---------------- BUILD ORDER (MATCH CART) ---------------- */
    const buildPOSPayload = (razorpayInfo = null, payuInfo = null) => ({
        customer_id: WALKIN.id,
        customer_code: WALKIN.code,
        customer_lpo: "",

        company_id,
        location_id,

        order_type: pos_mode ? "POS" : "ONLINE",
        website: "POS",
        transaction_type: "Payment",

        payment_terms: "payu",
        discount: 0,
        vat: 0,

        net: total,
        taxable_total: total,
        total: total,

        payment_details: {
            method: "payu",
            amount: total,
            currency: "INR",
            status: "PAID",

            payu: payuInfo || true,
        },

        shipping_address: DEFAULT_ADDRESS,
        billing_address: DEFAULT_ADDRESS,

        any_comment: "",

        items: cart.map((item) => {
            const qty = Number(item.qty || item.quantity || 1);

            return {
                item_id: item.id,
                quantity: qty,
                price: item.price,
                total: item.price * qty,
            };
        }),
    });

    /* ---------------- CREATE ORDER ---------------- */
    const submitPOSOrder = async (razorpayInfo = null, payuInfo = null) => {
        try {
            const payload = buildPOSPayload(razorpayInfo, payuInfo);

            const res = await api.post(
                "/order/ecommerce/order-add",
                payload,
                {
                    withCredentials: true

                }
            );
            console.log("Order response:", payload);
            if (res.data.status) {
                localStorage.setItem("SuccessOrder", JSON.stringify(res.data));

                dispatch(clearCart());
                localStorage.removeItem("posData");

                const orderNumber = extractOrderNumber(res.data);
                const invoiceNumber = extractInvoiceNumber(res.data);
                const orderId = extractOrderId(res.data);
                const query = new URLSearchParams();
                if (orderNumber) query.set("order_number", orderNumber);
                if (invoiceNumber) query.set("invoice_number", invoiceNumber);
                if (orderId) query.set("order_id", orderId);

                navigate(
                    `/order-review${query.toString() ? `?${query.toString()}` : ""}`,
                    { replace: true }
                );
            } else {
                alert(res.data.message || "Order failed");
            }
        } catch (err) {
            console.error(err);
            alert("Order failed");
        }
    };


    /* ---------------- PAYU ---------------- */
    const startPayUPOS = async () => {
        try {
            const receiptItems = cart.map((item) => {
                const qty = Number(item.qty || item.quantity || 1);
                const price = Number(item.price || 0);
                const lineTotal = price * qty;
                const taxPercent = Number(item.tax_percent || item.tax || 0);
                const taxAmount =
                    taxPercent > 0
                        ? (lineTotal * taxPercent) / (100 + taxPercent)
                        : 0;
                return {
                    item_id: item.id,
                    name: item.name,
                    quantity: qty,
                    price,
                    total: lineTotal,
                    tax_percent: taxPercent,
                    tax_amount: Number(taxAmount.toFixed(2)),
                };
            });

            const subtotal = receiptItems.reduce(
                (sum, item) => sum + (item.total - item.tax_amount),
                0
            );
            const taxTotal = receiptItems.reduce(
                (sum, item) => sum + item.tax_amount,
                0
            );

            const receiptDraft = {
                created_at: new Date().toISOString(),
                payment_terms: "payu",
                total: total,
                store_name: "IslamicBookZone",
                company_id,
                location_id,
                customer: {
                    name: WALKIN.name,
                    email: WALKIN.email,
                    phone: WALKIN.phone,
                },
                tax_total: Number(taxTotal.toFixed(2)),
                cgst: Number((taxTotal / 2).toFixed(2)),
                sgst: Number((taxTotal / 2).toFixed(2)),
                sub_total: Number(subtotal.toFixed(2)),
                items: receiptItems,
            };
            localStorage.setItem("pos_receipt", JSON.stringify(receiptDraft));

            const payload = buildPOSPayload();
            console.log("Order response:", payload);

            const res = await api.post(
                "/order/ecommerce/pending/create",
                { payload },
                { withCredentials: true }
            );

            const txnid = res.data.txnid;
            localStorage.setItem("payu_flow", "pos");

            startPayUPayment({
                amount: Math.round(total),
                firstname: WALKIN.name,
                email: WALKIN.email,
                phone: WALKIN.phone,
                txnid,
                source: "pos",
            });
        } catch (err) {
            console.error("PayU error:", err);
            alert("PayU failed");
        }
    };

    /* ---------------- HANDLE PAYMENT ---------------- */


    const handlePayment = async () => {
        if (loading) return;

        if (!sessionReady) {
            alert("Initializing POS... please wait");
            return;
        }

        if (!cart.length) return alert("Cart empty");

        try {
            setLoading(true);
            await startPayUPOS();
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className=" bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col pb-15">

            {/* HEADER */}
            <div className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-700 text-xl font-bold"
                >
                    ←
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                    Secure Payment
                </h2>
                <div />
            </div>

            <div className="flex-1 p-5 space-y-5">

                {/* TOTAL CARD */}
                {/* TOTAL CARD */}
                <div className="bg-gradient-to-r !from-indigo-600 !to-purple-600 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <p className="opacity-80">Total Amount</p>

                    <h1 className="text-4xl font-bold mt-1">₹{total}</h1>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center gap-3 text-sm">
                        <span className="!bg-white/20 px-3 py-1 rounded-full">
                            🛒 {totalQty} items
                        </span>
                    </div>

                    {/* glow */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 !bg-white opacity-10 rounded-full blur-2xl" />
                </div>
                {/* TRUST BADGE */}
                <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        🔒
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">
                            Secure Checkout
                        </p>
                        <p className="text-sm text-gray-500">
                            Powered by PayU Payment Gateway
                        </p>
                    </div>
                </div>

                {/* ITEM LIST */}
                <div className="bg-white rounded-2xl shadow-lg p-4">
                    <h3 className="font-semibold mb-3 text-gray-700">
                        Order Summary
                    </h3>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Qty: {item.qty || item.quantity}
                                    </p>
                                </div>

                                <span className="font-semibold text-indigo-600">
                                    ₹{item.price * (item.qty || item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER PAYMENT BUTTON */}
            <div className="p-20 bg-white shadow-inner">
                <button
                    onClick={handlePayment}
                    disabled={loading || !sessionReady}
                    className="w-full !bg-gradient-to-r !from-green-600 !to-green-800 !text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                >
                    {loading ? "Redirecting to PayU..." : `Pay ₹${total}`}
                </button>
            </div>
            <POSPageFooter />
        </div>
    );
}
