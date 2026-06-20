export const TRACKING_STEPS = [
    { key: "placed", label: "Order Placed" },
    { key: "confirmed", label: "Order Confirmed" },
    { key: "ready_to_ship", label: "Ready to Ship" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
];

export const STATUS_TO_KEY = {
    placed: "placed",
    "order placed": "placed",

    confirmed: "confirmed",
    "order confirmed": "confirmed",

    ready_to_ship: "ready_to_ship",
    "ready to ship": "ready_to_ship",

    out_for_delivery: "out_for_delivery",
    "out for delivery": "out_for_delivery",

    delivered: "delivered",
};

