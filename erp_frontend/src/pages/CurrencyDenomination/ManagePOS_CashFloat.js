import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { useNavigate } from "react-router-dom";
import { ToastMassage } from "toast";

function ManagePOS_CashFloat() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFloatData = async () => {
    try {
      const user_data = JSON.parse(localStorage.getItem("user_data"));
      const cashierId = user_data?.id;

      // Step 1: Get mode
      const settingRes = await axios.get(
        `${constantApi.baseUrl}/register_float/registerSettingList`
      );
      const mode = settingRes.data.mode; // 'daywise' or 'cashierwise'

      // Step 2: Get register list
      const floatRes = await axios.get(
        `${constantApi.baseUrl}/register_float/list`
      );
      const data = floatRes.data.data;

      if (mode === "daywise") {
        const hasOpen = data.some(
          (entry) => entry.status?.toLowerCase() === "open"
        );
        if (hasOpen) {
          navigate("/pos");
        } else {
          navigate("/master/cashfloat");
        }
      }

      if (mode === "cashierwise") {
        const hasOpenByThisCashier = data.some(
          (entry) =>
            entry.status?.toLowerCase() === "open" &&
            entry.open_by_id === cashierId
        );
        if (hasOpenByThisCashier) {
          navigate("/pos");
        } else {
          navigate("/master/cashfloat");
        }
      }
    } catch (err) {
      console.error("Error in fetchFloatData:", err);
      ToastMassage("Failed to fetch register data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloatData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManagePOS_CashFloat;
