import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import constantApi from "../constantApi";
import { ArrowLeft, X } from "lucide-react"; // Add icons

import axios from "axios"; // make sure axios is imported

// const cancelReasons = [
//   "Ordered by mistake",
//   "Found a better price elsewhere",
//   "Delivery is taking too long",
//   "Need to change order details",
//   "Item no longer needed"
// ];

export default function BookReturn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;
  const [reasonMap, setReasonMap] = useState({});
  const [loadingReasonFor, setLoadingReasonFor] = useState(null);
  const [loadingReasons, setLoadingReasons] = useState(true);
  const [activeBookId, setActiveBookId] = useState(null);

  const order = state?.order;
  const [loading, setLoading] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookSelections, setBookSelections] = useState({});
  const [itemDeptMap, setItemDeptMap] = useState({});
  const roundPrice = (val) => Math.round(Number(val) || 0);



  useEffect(() => {
    const fetchReasons = async () => {
      try {
        setLoadingReasons(true);
        const res = await axios.get(
          `${constantApi.baseUrl}/order-action-reason-mapping/findAll`
        );

        const grouped = res.data.data.reduce((acc, item) => {
          // ✅ ONLY CANCEL TYPE (reason_type_id = 1)
          if (Number(item.reason_type_id) !== 1) return acc;

          const deptId = String(item.department_id);

          if (!acc[deptId]) acc[deptId] = [];

          acc[deptId].push({
            id: item.reason.id,
            text: item.reason.reason_text,
          });

          return acc;
        }, {});



        setReasonMap(grouped);
      } catch (err) {
        console.error("Failed to load reasons", err);
      } finally {
        setLoadingReasons(false);
      }
    };

    fetchReasons();
  }, []);

  const toggleBook = (bookId) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );

    // show loader when opening item
    setLoadingReasonFor(bookId);

    // auto-hide loader after reasons already loaded
    setTimeout(() => {
      setLoadingReasonFor(null);
    }, 500);

    if (selectedBooks.includes(bookId)) {
      setBookSelections((prev) => {
        const copy = { ...prev };
        delete copy[bookId];
        return copy;
      });
    }
  };

  const updateSelection = (bookId, data) => {
    setBookSelections((prev) => ({
      ...prev,
      [bookId]: { ...prev[bookId], ...data },
    }));
  };
  const handleReturn = async () => {
    if (!selectedBooks.length) {
      Swal.fire("Select Books", "Please select at least one book", "warning");
      return;
    }

    const valid = selectedBooks.every((id) => {
      const s = bookSelections[id];
      return Boolean(s?.reason);
    });

    if (!valid) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        customClass: { popup: "mini-toast" },
        html: `
            <div class="toast-box">
              <div class="toast-content">
                 <div class="toast-title text-red-500">Pleeas select a reason</div>
              </div>
            </div>
          `,
      });
      return;
    }

    const canceledItems = selectedBooks.map((bookId) => {
      const book = order.order_details.find((b) => b.id === bookId);
      const sel = bookSelections[bookId];

      return {
        order_item_id: book.id,
        name: book.itemLocationModel?.item_name || book.name || "Unknown",
        quantity: book.item_qty || book.quantity || 1,
        price: roundPrice(book.item_grand_total || book.price || 0),
        reason: sel.reason,
        cancel_status: "initiated",
        initiated_by: order.customer_details?.first_name || "Unknown",
        selected_details: { ...sel },
      };
    });


    const totalQuantity = canceledItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = canceledItems.reduce((acc, item) => acc + roundPrice(item.price), 0);

    const canceledDataByOrder = {
      order_number: order.order_number,
      order_id: order.id,
      items: canceledItems,
      total_quantity: totalQuantity,
      total_amount: totalAmount, // send integer
    };


    try {
      setLoading(true);

      // Call your API endpoint
      const response = await axios.post(
        `${constantApi.baseUrl}/order/ecommerce/order-cancel`,
        canceledDataByOrder
      );

      console.log("API Response:", response.data);

      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        customClass: { popup: "mini-toast" },
        html: `
      <div class="toast-box">
        <div class="toast-content">
           <div class="toast-title text-red-500">cancel success</div>
        </div>
      </div>
    `,
      });
      navigate("/accounts", {
        state: {
          activeTab: "orders",
          orderId: order.id,
          orderNumber: order.order_number,
          from: "cancel",
        },
      });
    } catch (error) {
      // console.error("Cancel API Error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to cancel order",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  if (!order) {
    return <p className="text-center mt-10 text-gray-500">Order not found</p>;
  }
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const selectableBooks = order.order_details.filter(
    (book) =>
      !["Cancelled", "Cancel Initiated", "Cancel Approved"].includes(
        book.order_status
      )
  );
  const isAllSelected =
    selectableBooks.length > 0 &&
    selectedBooks.length === selectableBooks.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // unselect all
      setSelectedBooks([]);
      setBookSelections({});
    } else {
      // select all
      const allIds = selectableBooks.map((b) => b.id);
      setSelectedBooks(allIds);
    }
  };

  const deleteSelected = () => {
    if (!selectedBooks.length) {
      // Optional: you can show a small notification/toast, or just return
      console.log("No items selected");
      return;
    }

    // Clear selected books immediately
    setSelectedBooks([]);
    setBookSelections({});
  };



  useEffect(() => {
    if (!order?.order_details?.length) return;

    const fetchItemDepartments = async () => {
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/item_location_master/filtered_list`,
          {}
        );

        const deptMap = {};

        res.data?.data?.forEach(loc => {
          const matchedOrderItem = order.order_details.find(
            od =>
              od.itemLocationModel?.item_name?.trim() ===
              loc.item_name?.trim()
          );

          if (matchedOrderItem && loc.departname) {
            deptMap[matchedOrderItem.id] = String(loc.departname);
          }
        });

        console.log("✅ FINAL ITEM → DEPT MAP:", deptMap);
        setItemDeptMap(deptMap);
      } catch (err) {
        console.error("❌ Failed to load item departments", err);
      }
    };

    fetchItemDepartments();
  }, [order]);
  const CircleLoader = () => (
    <div className="flex justify-center py-2">
      <div className="w-5 h-5 border-2 !border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className=" min-h-screen py-4 px-2">
      <div className="max-w-4xl mx-auto">

        {/* Top Buttons */}
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

        {/* Page Heading */}
        <h1 className="text-xl font-semibold mb-4">Cancel Order</h1>

        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-4 text-xs ">
          <div className="flex justify-between text-gray-500">
            <p>Order #{order.order_number || id}</p>
            <p>{formatDate(order.order_date)}</p>
          </div>

          <div className="flex justify-between mt-1 text-gray-700">
            <span>{order.customer_details?.first_name}</span>
            <span className="font-semibold">₹{roundPrice(order.grand_total)}</span>
          </div>
        </div>


        {/* Select All Row */}
        <div className="flex justify-between items-center mb-3 bg-white p-2 rounded-lg border text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="accent-red-600"
            />
            <span className="font-medium text-gray-700">
              Select All ({selectableBooks.length})
            </span>
          </label>

          <button
            onClick={deleteSelected}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
          >
            <X size={14} />
            Clear Selected
          </button>
        </div>

        {/* Books */}
        <div className="space-y-4">
          {selectableBooks.map((book) => {
            const departmentId = itemDeptMap[book.id];
            console.log("Item Dept Map:", itemDeptMap);
            console.log("Reason Map:", reasonMap);
            console.log("Book Dept:", departmentId);


            const active = selectedBooks.includes(book.id);
            const sel = bookSelections[book.id] || {};

            return (
              <div
                key={book.id}
                className={`rounded-xl p-3 bg-white border transition-all duration-200
                  ${active
                    ? "border-red-500 bg-red-50 shadow-md scale-[1.01]"
                    : "border-gray-200 hover:shadow-sm"
                  }`}
              >
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleBook(book.id)}
                    className="mt-1 accent-red-600"
                  />

                  <img
                    src={
                      book.itemLocationModel?.item_image
                        ? `${imageBaseUrl}${book.itemLocationModel.item_image.replace(
                          /^\/+/,
                          ""
                        )}`
                        : "/placeholder.png"
                    }
                    alt=""
                    className="w-16 h-16 rounded border object-cover"
                  />

                  <div className="flex-1 text-xs">
                    <p className="font-medium text-gray-900 truncate">
                      {book.itemLocationModel?.item_name || book.name}
                    </p>
                    <p className="text-gray-500 mt-0.5">
                      Qty: {book.item_qty || book.quantity}
                    </p>
                    <p className="font-semibold mt-0.5">
                      ₹{roundPrice(book.item_grand_total || book.price)}
                    </p>

                  </div>
                </div>

                {/* Details Card */}
                {active && (

                  <div className="mt-4 bg-white rounded-lg border-l-4 border-red-500 shadow-sm p-3 space-y-3 text-xs">
                    {/* Reason Pills */}
                    <div>
                      <p className="font-semibold mb-1">Choose a reason</p>

                      {/* Loader below title */}
                      {activeBookId === book.id && loadingReasons && <CircleLoader />}

                      {/* Reason pills */}
                      {!loadingReasons &&
                        departmentId &&
                        reasonMap[departmentId]?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {reasonMap[departmentId].map((r) => (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() =>
                                  updateSelection(book.id, {
                                    reason: r.text,
                                    reason_id: r.id,
                                    department_id: departmentId,
                                  })
                                }
                                className={`px-3 py-2 rounded-full border text-[8px]
              ${sel.reason === r.text
                                    ? "bg-red-600 text-white border-red-600"
                                    : "border-gray-300 text-gray-600 hover:border-red-400"
                                  }`}
                              >
                                {r.text}
                              </button>
                            ))}
                          </div>
                        )}

                      {/* No reasons message (ONLY after load) */}
                      {!loadingReasons &&
                        departmentId &&
                        reasonMap[departmentId]?.length === 0 && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            Reasons not available for this item
                          </p>
                        )}
                    </div>

                    {/* Message */}
                    <textarea
                      rows={3}
                      className="w-full border rounded-lg px-2 py-1 text-xs resize-none"
                      placeholder="Tell us more..."
                      value={sel.message || ""}
                      onChange={(e) =>
                        updateSelection(book.id, { message: e.target.value })
                      }
                    />
                  </div>

                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg text-xs !bg-gray-800 text-white"
          >
            Back
          </button>
          <button
            disabled={loading}
            onClick={handleReturn}
            className="px-6 py-2 rounded-lg !bg-gradient-to-r !from-red-600 !to-red-500 !text-white shadow hover:shadow-md text-xs"
          >
            {loading ? "Processing..." : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
