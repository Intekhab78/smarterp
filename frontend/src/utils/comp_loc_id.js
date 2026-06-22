// src/utils/comp_loc_id.js

export const getCompanyAndLocationId = () => {
  try {
    const data = JSON.parse(localStorage.getItem("pos_filter"));
    console.log("getCompanyAndLocationId-----------", data);

    if (!data) return { company_id: null, location_id: null };

    return {
      cashier_comp_id: data.company_id || null,
      cashier_loc_id: data.location_id || null,
    };
  } catch (error) {
    console.error("Error reading pos_filter from localStorage:", error);
    return { cashier_comp_id: null, cashier_loc_id: null };
  }
};
