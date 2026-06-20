import React, { useEffect } from "react";
import Loader from "../../utils/Loader";

const ItemList = ({
  filteredData = [],
  isExpanded,
  handleBoxClick,
  getSizeName,
  getColorName,
  constantApi,
  itemLoading, // ✅ only item loader
  currentPage,
  setCurrentPage,
  itemLocationList,
  scrollPositionRef,
  TableData,
  loaderRef,
}) => {
  return (
    <>
      {/* ================= GRID ================= */}
      <div
        className={`grid mt-4 transition-all duration-300 ${
          isExpanded
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
        }`}
      >
        {/* ✅ DATA */}
        {!itemLoading &&
          filteredData.length > 0 &&
          filteredData.map((masterItem, masterIndex) => {
            const imageUrl = masterItem?.item_image
              ? `${constantApi.imageUrl}/itemsImage/${masterItem.item_image}`
              : null;

            return (
              <div
                key={masterIndex}
                onClick={
                  masterItem.remaining_stock < 1
                    ? undefined
                    : () => handleBoxClick(masterItem)
                }
                className={`border border-gray-300 rounded-lg cursor-pointer hover:shadow-lg transition bg-white flex flex-col justify-between
            ${isExpanded ? "w-45 h-48" : "w-45 h-60"}
            ${
              masterItem.remaining_stock < 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
              >
                {/* Image */}
                <div className="relative w-full h-32 rounded-t-lg bg-gray-100 overflow-hidden">
                  <h4 className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {masterItem.remaining_stock}
                  </h4>

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={masterItem.item_name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="px-2 py-1 flex flex-col gap-1">
                  {masterItem.itemupc && (
                    <div className="text-xs text-gray-500">
                      Barcode: {masterItem.itemupc}
                    </div>
                  )}

                  <h4 className="text-sm font-semibold text-gray-800">
                    {masterItem.item_name}
                  </h4>

                  <div className="flex justify-between text-xs text-gray-600">
                    {masterItem?.sizename &&
                      getSizeName(masterItem.sizename) !== "None" && (
                        <span>
                          <b>Size:</b> {getSizeName(masterItem.sizename)}
                        </span>
                      )}

                    {masterItem?.colorname &&
                      getColorName(masterItem.colorname) !== "None" && (
                        <span>
                          <b>Color:</b> {getColorName(masterItem.colorname)}
                        </span>
                      )}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-blue-500 text-white text-sm font-bold py-1 rounded-b-lg text-center">
                  {masterItem.itemprice}
                </div>
              </div>
            );
          })}

        {/* ✅ GRID LOADER (optional spinner while fetching next page) */}
        {itemLoading && (
          <div className="col-span-full">
            <Loader text="Fetching items..." />
          </div>
        )}

        {/* ✅ EMPTY STATE */}
        {!itemLoading && filteredData.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-6">
            No items available
          </div>
        )}
      </div>

      {/* ================= INTERSECTION OBSERVER TARGET ================= */}
      {/* 🔥 IMPORTANT: OUTSIDE GRID */}
      <div ref={loaderRef} className="h-10"></div>
    </>
  );
};

export default ItemList;
