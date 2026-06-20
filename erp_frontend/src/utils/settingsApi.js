import axios from "axios";
import constantApi from "constantApi";

// ===============================
// GET SETTINGS
// ===============================
export const getSystemSettings = async (companyId, locationId) => {
  console.log("companyId, locationId", companyId, locationId);

  try {
    const res = await axios.get(
      `${constantApi.baseUrl}/system_setting/get_setting/${companyId}/${locationId}`
    );
    console.log("response data --------", res.data);

    return res.data;
  } catch (err) {
    console.error("Error fetching settings:", err);
    return { success: false, data: null };
  }
};

// ===============================
// UPDATE SETTINGS
// ===============================
export const updateSystemSetting = async (
  companyId,
  locationId,
  key,
  value
) => {
  try {
    const res = await axios.post(
      `${constantApi.baseUrl}/system_setting/update_setting/${companyId}/${locationId}`,
      { key, value }
    );
    return res.data;
  } catch (err) {
    console.error("Error updating settings:", err);
    return { success: false };
  }
};

// ===============================
// DELETE (RESET) SETTINGS
// ===============================
export const deleteSystemSettings = async (companyId, locationId) => {
  try {
    const res = await axios.delete(
      `${constantApi.baseUrl}/system_setting/delete_setting/${companyId}/${locationId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error deleting settings:", err);
    return { success: false };
  }
};
