import constantApi from "constantApi";
import { useState } from "react";

const courierCompanies = [
  "India Post",
  "FedEx",
  "DHL",
  "UPS",
  "USPS",
  "Royal Mail",
  "Blue Dart",

  "Aramex",
  "Amazon Logistics",
  "Delhivery",
];

export default function TrackingDetailsPopup({
  orderId,
  onClose,
  onSave,
  getStatusIdByName,
}) {
  const [courierCompany, setCourierCompany] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentDate, setShipmentDate] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courierCompany || !trackingNumber) {
      alert("Please fill required fields.");
      return;
    }

    setLoading(true);
    try {
      // Get numeric status id for "Out for Delivery"
      const statusIdForOutForDelivery = getStatusIdByName("Out for Delivery");

      const res = await fetch(
        `${constantApi.baseUrl}/order/ecommerce/update-order-status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            status: statusIdForOutForDelivery,
            tracking_info: {
              courier_company: courierCompany,
              tracking_number: trackingNumber,
              shipment_date: shipmentDate || null,
              estimated_delivery: estimatedDelivery || null,
              tracking_url: trackingUrl,
              remarks,
            },
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save tracking info");
      }

      onSave();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6">
        <h2 className="text-lg font-semibold mb-5 text-gray-800">
          Add Tracking Details
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-sm text-gray-700"
        >
          <div className=" grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">
                Courier Company *
              </label>
              <select
                value={courierCompany}
                onChange={(e) => setCourierCompany(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value="" disabled>
                  Select Courier Company
                </option>
                {courierCompanies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Tracking Number *
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Shipment Date</label>
              <input
                type="date"
                value={shipmentDate}
                onChange={(e) => setShipmentDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Estimated Delivery
              </label>
              <input
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Tracking URL</label>
            <input
              type="url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={3}
              placeholder="Optional notes"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
