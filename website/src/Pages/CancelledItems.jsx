import { useLocation, useParams, Link } from "react-router-dom";
import constantApi from "../constantApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

const normalizeStatus = (status = "") =>
    status.toLowerCase().replace(/_/g, " ").trim();

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

const CancelledItems = () => {
    const { order_number } = useParams();
    const { state } = useLocation();
    const order = state?.order;
    const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;
    const navigate = useNavigate();

    if (!order) {
        return (
            <p className="text-center text-gray-500 mt-10">Order not found</p>
        );
    }

    const isOrderCancelled =
        normalizeStatus(order.current_stage) === "cancelled";

    const cancelledItems = isOrderCancelled
        ? order.order_details || []
        : (order.order_details || []).filter(
            (item) => normalizeStatus(item.order_status) === "cancelled"
        );


    if (cancelledItems.length === 0) {
        return (
            <p className="text-center text-gray-500 mt-10">
                No cancelled items found
            </p>
        );
    }
    const getItemImage = (item) => {
        const img =
            item?.itemLocationModel?.item_image ||
            item?.item_image ||
            item?.image ||
            "";

        return img
            ? `${imageBaseUrl}${img.replace(/^\/+/, "")}`
            : "/placeholder.png";

    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                {/* Back Button - Left */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-white gap-1 px-3 py-1 !bg-gray-600 rounded hover:bg-gray-300 transition"
                >
                    <ArrowLeft size={16} />

                </button>

                {/* Close Button - Right */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1 text-white px-3 py-1 !bg-red-600 rounded hover:bg-gray-300 transition"
                >
                    <X size={16} />

                </button>
            </div>
            <div className="mb-6 border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                    Cancelled Items
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Order #{order_number} • {cancelledItems.length} item(s) cancelled
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cancelledItems.map((item) => {
                    const cancelledDate =
                        item.cancelled_at || item.order_status_date || item.updated_at;

                    // Calculate price
                    const rawPrice =
                        item.item_grand_total || item.item_total_net || item.total_net || 0;

                    const price = Math.round(Number(rawPrice) || 0);

                    return (
                        <div
                            key={item.id}
                            className="flex gap-3 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <img
                                src={getItemImage(item)}
                                alt={item.itemLocationModel?.item_name || item.item_name}
                                className="w-20 h-20 object-cover rounded-lg border"
                            />


                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm truncate">
                                    {item.itemLocationModel?.item_name || item.item_name}
                                </p>

                                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                    <p>Qty: {item.item_qty}</p>
                                    {item.color && <p>Color: {item.color}</p>}
                                    {item.size && <p>Size: {item.size}</p>}
                                    <p>Price: ₹{price}</p>
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                    <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                        Cancelled
                                    </span>
                                    <span className="text-[10px] text-gray-500">
                                        on {formatDate(cancelledDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* <div className="mt-8">
                <Link
                    to="/orders"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                    ← Back to Orders
                </Link>
            </div> */}
        </div>
    );
};

export default CancelledItems;
