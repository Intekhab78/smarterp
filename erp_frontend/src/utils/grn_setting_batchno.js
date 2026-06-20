import axios from "axios";
import constantApi from "constantApi";
import { getCompanyAndLocationId } from "./comp_loc_id";

// Fetch GRN settings filtered by company_id & location_id
export const fetchAllGrnSettings = async () => {
  try {
    const response = await axios.get(`${constantApi.baseUrl}/grn_setting/list`);
    console.log("Response from GRN settings utils:", response.data);

    if (response.data.success) {
      const { cashier_comp_id, cashier_loc_id } = getCompanyAndLocationId();

      // Filter data by company_id & location_id
      const filteredData = response.data.data.filter(
        (item) =>
          item.company_id === cashier_comp_id &&
          item.location_id === cashier_loc_id
      );

      return filteredData;
    } else {
      console.error("Failed to fetch GRN settings:", response.data.message);
      return [];
    }
  } catch (err) {
    console.error("Error fetching GRN settings:", err);
    return [];
  }
};
