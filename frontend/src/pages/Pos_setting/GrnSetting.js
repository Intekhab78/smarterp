import React, { useState } from "react";
import { getCompanyAndLocationId } from "../../utils/comp_loc_id"; // ✅ adjust path
import axios from "axios";
import constantApi from "constantApi";

function GrnSetting() {
  const [autoBatch, setAutoBatch] = useState(false);

  const handleSave = async () => {
    const { cashier_comp_id, cashier_loc_id } = getCompanyAndLocationId();

    if (!cashier_comp_id || !cashier_loc_id) {
      console.error("Company ID or Location ID missing!");
      return;
    }
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/grn_setting/create`,
        {
          Is_auto_gen_batch_no: autoBatch ? 1 : 0,
          company_id: cashier_comp_id,
          location_id: cashier_loc_id,
        }
      );

      console.log("Saved:", response.data); // full response
      alert(response.data.message); // ✅ show success message
    } catch (err) {
      console.error("Error saving setting:", err);
      alert("Failed to save setting");
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 p-6 bg-white rounded-2xl shadow-md w-96">
      <label className="flex items-center text-sm text-gray-600 cursor-pointer select-none">
        Auto generate batch number ?
        <input
          type="checkbox"
          className="ml-2 w-4 h-4 accent-blue-600"
          checked={autoBatch}
          onChange={(e) => setAutoBatch(e.target.checked)}
        />
      </label>

      <button
        onClick={handleSave}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Save
      </button>
    </div>
  );
}

export default GrnSetting;
