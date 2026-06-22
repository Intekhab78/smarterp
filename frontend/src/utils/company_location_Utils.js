import { axios_post } from "../axios";
import { ToastMassage } from "../toast";

export const getCompanyDetails = async () => {
  try {
    const response = await axios_post(true, "company/list");
    if (response?.status) {
      return response?.data?.records || [];
    } else {
      ToastMassage(
        response?.message || "Failed to fetch company details",
        "error"
      );
      return [];
    }
  } catch (error) {
    ToastMassage(
      "Something went wrong while fetching company details",
      "error"
    );
    console.error("Error fetching company details:", error);
    return [];
  }
};
export const getLocationDetails = async () => {
  try {
    const response = await axios_post(true, "location/list");
    if (response?.status) {
      return response?.data?.records || [];
    } else {
      ToastMassage(
        response?.message || "Failed to fetch location details",
        "error"
      );
      return [];
    }
  } catch (error) {
    ToastMassage(
      "Something went wrong while fetching location details",
      "error"
    );
    console.error("Error fetching location details:", error);
    return [];
  }
};
