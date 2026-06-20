// ExchangeOrder.jsx
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import constantApi from "../constantApi";
import { ArrowLeft, X, Info } from "lucide-react";
import axios from "axios";
const roundPrice = (val) => Math.round(Number(val) || 0);

const exchangeReasons = [
    "Size Issue",
    "Color Issue",
    "Damaged Item",
    "Wrong Item Received",
    "Other Reason",
];

/**
 * Item eligibility:
 * - Delivered
 * - Within 7 days of delivery
 */
const canExchangeItem = (item, order) => {
    if (order.status !== "Delivered") return false;

    const deliveredDate = new Date(order.updated_at || order.order_date);
    const diffDays = (new Date() - deliveredDate) / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
};

export default function ExchangeOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;

    const order = state?.order;
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});

    if (!order) {
        return (
            <p className="text-center mt-10 text-gray-500 text-sm">
                Order not found
            </p>
        );
    }

    const toggleItem = (itemId) => {
        setSelectedItems((prev) => {
            if (prev[itemId]?.selected) {
                const copy = { ...prev };
                delete copy[itemId];
                return copy;
            }
            return {
                ...prev,
                [itemId]: { selected: true, reason: "", message: "" },
            };
        });
    };

    const updateSelection = (itemId, data) => {
        setSelectedItems((prev) => ({
            ...prev,
            [itemId]: { ...(prev[itemId] || {}), ...data },
        }));
    };

    /* ---------- TOTALS ---------- */
    const totalQuantity = Object.keys(selectedItems).reduce((acc, id) => {
        const item = order.order_details.find((i) => i.id === Number(id));
        return item ? acc + Number(item.item_qty || 1) : acc;
    }, 0);

    const totalAmount = Object.keys(selectedItems).reduce((acc, id) => {
        const item = order.order_details.find((i) => i.id === Number(id));
        if (!item) return acc;
        return acc + roundPrice(item.item_grand_total || item.price || 0);
    }, 0);


    /* ---------- SUBMIT ---------- */
    const handleExchange1 = async () => {
        const selectedIds = Object.keys(selectedItems);

        if (!selectedIds.length) {
            Swal.fire("Select Items", "Please select at least one item", "warning");
            return;
        }

        const valid = selectedIds.every((id) => {
            const sel = selectedItems[id];
            if (!sel?.reason) return false;
            if (sel.reason === "Other Reason" && !sel.message) return false;
            return true;
        });

        if (!valid) {
            Swal.fire(
                "Incomplete Selection",
                "Please select valid reason/message",
                "warning"
            );
            return;
        }

        const exchangeItems = selectedIds.map((itemId) => {
            const item = order.order_details.find((b) => b.id === Number(itemId));
            const sel = selectedItems[itemId];

            return {
                order_item_id: item.id,
                name: item.itemLocationModel?.item_name || item.name || "Unknown",
                quantity: Number(item.item_qty || 1),
                price: roundPrice(item.item_grand_total || item.price || 0),
                reason: sel.reason,
                message: sel.message,
                initiated_by: order.customer_details?.first_name || "Unknown",
            };
        });

        try {
            setLoading(true);
            await axios.post(
                `${constantApi.baseUrl}/order/ecommerce/order-exchange`,
                {
                    order_id: order.id,
                    order_number: order.order_number,
                    items: exchangeItems,
                    total_quantity: totalQuantity,
                    total_amount: totalAmount, // send integer
                }
            );

            Swal.fire("Success", "Exchange submitted", "success");

            navigate("/accounts", {
                state: { activeTab: "orders", orderId: order.id },
            });
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Failed to submit exchange",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };
    const handleExchange = async () => {
        const selectedIds = Object.keys(selectedItems);

        if (!selectedIds.length) {
            Swal.fire("Select Items", "Please select at least one item", "warning");
            return;
        }

        const valid = selectedIds.every((id) => {
            const sel = selectedItems[id];
            if (!sel?.reason) return false;
            if (sel.reason === "Other Reason" && !sel.message) return false;
            return true;
        });

        if (!valid) {
            Swal.fire(
                "Incomplete Selection",
                "Please select valid reason/message",
                "warning"
            );
            return;
        }

        const exchangeItems = selectedIds.map((itemId) => {
            const item = order.order_details.find((b) => b.id === Number(itemId));
            const sel = selectedItems[itemId];

            return {
                order_item_id: item.id,
                name: item.itemLocationModel?.item_name || item.name || "Unknown",
                quantity: Number(item.item_qty || 1),
                price: Number(item.item_grand_total || item.price || 0),
                reason: sel.reason,
                message: sel.message,
                initiated_by: order.customer_details?.first_name || "Unknown",
            };
        });

        // ✅ BUILD FINAL DATA
        const payload = {
            order_id: order.id,
            order_number: order.order_number,
            items: exchangeItems,
            total_quantity: totalQuantity,
            total_amount: totalAmount.toFixed(2),
        };

        // 🔥 PRINT AFTER SUBMIT CLICK
        console.log("📦 Exchange Submit Data:", payload);
        console.log("📦 Items Only:", exchangeItems);

        try {
            setLoading(true);

            // await axios.post(
            //   `${constantApi.baseUrl}/order/ecommerce/order-exchange`,
            //   payload
            // );

            Swal.fire("Success", "Exchange submitted", "success");

            navigate("/accounts", {
                state: { activeTab: "orders", orderId: order.id },
            });
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Failed to submit exchange",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };
    const eligibleItems = order.order_details.filter((item) =>
        canExchangeItem(item, order)
    );
    const selectedIds = Object.keys(selectedItems).map(Number);

    const isAllSelected =
        eligibleItems.length > 0 &&
        eligibleItems.every((item) => selectedItems[item.id]?.selected);

    const toggleSelectAll = () => {
        if (isAllSelected) {
            // clear all
            setSelectedItems({});
        } else {
            // select all eligible
            const all = {};
            eligibleItems.forEach((item) => {
                all[item.id] = {
                    selected: true,
                    reason: "",
                    message: "",
                };
            });
            setSelectedItems(all);
        }
    };

    const clearSelected = () => {
        if (!selectedIds.length) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "info",
                title: "Please select items first",
                showConfirmButton: false,
                timer: 1800,
            });
            return;
        }

        setSelectedItems({});
    };

    return (
        <div className="min-h-screen py-3 px-2">
            <div className="max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-3 py-1 !bg-gray-700 !text-white rounded-md"
                    >
                        <ArrowLeft size={14} />
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="px-3 py-1 !bg-red-600 !text-white rounded-md"
                    >
                        <X size={14} />
                    </button>
                </div>

                <h1 className="text-lg font-semibold mb-3">Exchange Order</h1>

                {/* ORDER INFO */}
                <div className="bg-white rounded-lg shadow-sm p-2 mb-3 text-[11px]">
                    <div className="flex justify-between text-gray-500">
                        <p>Order #{order.order_number || id}</p>
                        <p>{new Date(order.order_date).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="flex justify-between mt-0.5 text-gray-700">
                        <span>{order.customer_details?.first_name}</span>
                        <span className="font-semibold">
                            ₹{roundPrice(order.grand_total || 0)}
                        </span>
                    </div>
                </div>
                {/* SELECT ALL BAR */}
                <div className="flex justify-between items-center mb-2 bg-white p-2 rounded-md border text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                            className="accent-yellow-600"
                        />
                        <span className="font-medium text-gray-700">
                            Select All Eligible ({eligibleItems.length})
                        </span>
                    </label>

                    <button
                        onClick={clearSelected}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                        <X size={12} />
                        Clear
                    </button>
                </div>

                {/* ITEMS */}
                <div className="flex flex-wrap -mx-2">
                    {order.order_details.map((item) => {
                        const eligible = canExchangeItem(item, order);
                        const active = selectedItems[item.id]?.selected;

                        return (
                            <div
                                key={item.id}
                                className={`w-1/2 px-2 mb-4 rounded-lg p-2 border gap-1 ${eligible
                                    ? active
                                        ? "border-yellow-500 bg-yellow-50"
                                        : "border-gray-200"
                                    : "border-gray-300 bg-gray-100 opacity-60"
                                    }`}
                            >
                                {/* ITEM ROW */}
                                <div className="flex gap-2 items-start">
                                    <input
                                        type="checkbox"
                                        checked={!!active}
                                        disabled={!eligible}
                                        onChange={() => toggleItem(item.id)}
                                        className="mt-1"
                                    />

                                    <img
                                        src={
                                            item.itemLocationModel?.item_image
                                                ? `${imageBaseUrl}${item.itemLocationModel.item_image.replace(
                                                    /^\/+/,
                                                    ""
                                                )}`
                                                : "/placeholder.png"
                                        }
                                        className="w-12 h-12 rounded-md border object-cover"
                                    />

                                    <div className="flex-1 text-[11px] leading-tight">
                                        <p className="font-medium">
                                            {item.itemLocationModel?.item_name || item.name}
                                        </p>
                                        <p>Qty: {item.item_qty || 1}</p>
                                        <p className="font-semibold">
                                            ₹{roundPrice(item.item_grand_total || item.price || 0)}
                                        </p>
                                    </div>
                                </div>

                                {!eligible && (
                                    <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                                        <Info size={12} /> Not eligible for exchange
                                    </p>
                                )}

                                {/* REASON CHECKBOXES */}
                                {eligible && active && (
                                    <div className="mt-2 space-y-1 text-[11px]">
                                        {exchangeReasons.map((r) => (
                                            <label key={r} className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name={`reason-${item.id}`}
                                                    value={r}
                                                    checked={selectedItems[item.id]?.reason === r}
                                                    onChange={() =>
                                                        updateSelection(item.id, {
                                                            reason: r,
                                                            message: "",
                                                        })
                                                    }
                                                    className="w-3 h-3"
                                                />
                                                <span>{r}</span>
                                            </label>
                                        ))}

                                        {selectedItems[item.id]?.reason === "Other Reason" && (
                                            <textarea
                                                rows={2}
                                                placeholder="Describe reason"
                                                value={selectedItems[item.id]?.message || ""}
                                                onChange={(e) =>
                                                    updateSelection(item.id, { message: e.target.value })
                                                }
                                                className="w-full border rounded-md px-1 py-0.5 resize-none !text-[11px]"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>


                {/* SUMMARY */}
                <div className="flex justify-between items-center mt-3 text-[11px]">
                    <div>
                        <p>Total Qty: {totalQuantity}</p>
                        <p>Total Amount: ₹{totalAmount}</p>
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleExchange}
                        className="px-4 py-2 !bg-yellow-600 text-white rounded-md text-xs"
                    >
                        {loading ? "Processing..." : "Submit Exchange"}
                    </button>
                </div>
            </div>
        </div>
    );
}
