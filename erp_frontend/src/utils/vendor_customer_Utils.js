import { axios_post } from "../axios";
import { ToastMassage } from "../toast";

export const getCustomerDetails = async () => {
  try {
    const response = await axios_post(true, "customer/list");
    if (response?.status) {
      return response?.data?.records || [];
    } else {
      ToastMassage(
        response?.message || "Failed to fetch customer details",
        "error"
      );
      return [];
    }
  } catch (error) {
    ToastMassage(
      "Something went wrong while fetching customer details",
      "error"
    );
    console.error("Error fetching customer details:", error);
    return [];
  }
};
export const getVendorDetails = async () => {
  try {
    const response = await axios_post(true, "vendor/list");
    if (response?.status) {
      return response?.data?.records || [];
    } else {
      ToastMassage(
        response?.message || "Failed to fetch vendor details",
        "error"
      );
      return [];
    }
  } catch (error) {
    ToastMassage("Something went wrong while fetching vendor details", "error");
    console.error("Error fetching vendor details:", error);
    return [];
  }
};
