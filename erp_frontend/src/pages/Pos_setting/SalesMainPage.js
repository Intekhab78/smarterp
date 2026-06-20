import React, { useState } from "react";
import SalesSetting from "./SalesSetting";
import AddPriceListMaster from "pages/price_list_master/AddPriceListMaster";

function SalesMainPage() {
  const [activeComponent, setActiveComponent] = useState("priceList");

  return (
    <div className="p-6">
      <div className="mb-4 space-x-4">
        <button
          onClick={() => setActiveComponent("negativeStock")}
          className={`px-2 py-1 rounded text-sm ${
            activeComponent === "negativeStock"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Negative Stock
        </button>

        <button
          onClick={() => setActiveComponent("priceList")}
          className={`px-2 py-1 rounded text-sm ${
            activeComponent === "priceList"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Price List
        </button>
      </div>

      <div>
        {activeComponent === "negativeStock" && <SalesSetting />}
        {activeComponent === "priceList" && <AddPriceListMaster />}
      </div>
    </div>
  );
}

export default SalesMainPage;
