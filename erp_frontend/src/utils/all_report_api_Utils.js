import { axios_post } from "../axios";
import { ToastMassage } from "../toast";

export const getInvoiceDetails = async () => {
  try {
    const response = await axios_post(true, "invoice/list");
    if (response?.status) {
      return response?.data || [];
    } else {
      ToastMassage(
        response?.message || "Failed to fetch invoice details",
        "error"
      );
      return [];
    }
  } catch (error) {
    ToastMassage(
      "Something went wrong while fetching invoice details",
      "error"
    );
    console.error("Error fetching invoice details:", error);
    return [];
  }
};

export const getPurchaseDetails = async (filters) => {
  try {
    const response = await axios_post(true, "grn/list", filters); // <--- SEND FILTERS

    if (response?.status) {
      return response?.data || [];
    } else {
      ToastMassage(
        response?.message || "Failed to fetch purchase_order details",
        "error"
      );
      return [];
    }
  } catch (error) {
    ToastMassage(
      "Something went wrong while fetching purchase_order details",
      "error"
    );
    console.error("Error fetching purchase_order details:", error);
    return [];
  }
};
