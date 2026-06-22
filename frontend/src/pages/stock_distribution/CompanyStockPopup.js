import React from "react";

export default function CompanyStockPopup({
  companyLevelStock,
  setShowCompListPopup,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 mt-12">
      {/* <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl p-4 text-sm"> */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl ms-60 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Company Level Item Stock
            </h2>
          </div>
          <div>
            <button
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              onClick={() => setShowCompListPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Company</th>
                <th className="border px-3 py-2 text-left">Item Name</th>
                <th className="border px-3 py-2 text-left">Item UPC</th>
                <th className="border px-3 py-2 text-center">Total Stock</th>
                <th className="border px-3 py-2 text-center">Calculated At</th>
              </tr>
            </thead>
            <tbody>
              {companyLevelStock.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">
                    {stock.company?.compdesc}
                  </td>
                  <td className="border px-3 py-2">{stock.item?.item_name}</td>
                  <td className="border px-3 py-2">{stock.item?.itemupc}</td>
                  <td className="border px-3 py-2 text-center">
                    {stock.total_stock}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {new Date(stock.calculated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
