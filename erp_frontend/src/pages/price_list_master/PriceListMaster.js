import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { axios_post } from "../../axios";
import { FaTrash, FaEye } from "react-icons/fa";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const PriceListMaster = () => {
  const navigate = useNavigate();
  const [editItemId, setEditItemId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  // const [expandedRow, setExpandedRow] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  // const toggleRow = (id) => {
  //   setExpandedRow(expandedRow === id ? null : id);
  // };

  const toggleRow = (id) => {
    setExpandedRows(
      (prev) =>
        prev.includes(id)
          ? prev.filter((rowId) => rowId !== id) // hide if already open
          : [...prev, id], // open without closing others
    );
  };

  // ---------------- FETCH PRICE LIST ------------------
  const fetchPriceMasterList = async () => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/price_list_master/list`,
      );

      if (res.data?.data) {
        const filtered = res.data.data.filter(
          (item) =>
            item.status === "active" || (item.items && item.items.length > 0),
        );
        setPriceLists(filtered);
      }
    } catch (error) {
      console.error("Error loading price lists:", error);
    }
  };

  useEffect(() => {
    fetchPriceMasterList();
  }, []);

  // ---------------- FETCH COMPANIES ------------------
  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response?.status) {
      setCompanies(response.data);
    }
  };

  // ---------------- FETCH ALL LOCATIONS ------------------
  const fetchAllLocations = async () => {
    const response = await axios_post(true, "location/loc_list", {});
    if (response?.status) {
      setLocations(response.data);
    }
  };

  useEffect(() => {
    fetchCompanyList();
    fetchAllLocations();
  }, []);

  // ---------------- HELPERS: NAME GETTERS ------------------

  const getCompanyName = (id) => {
    const comp = companies.find((c) => c.id === id);
    return comp ? comp.compdesc : id;
  };

  const getLocationName = (id) => {
    const loc = locations.find((l) => l.id === id);
    return loc ? loc.locname : id;
  };

  // ---------------- DELETE ------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this price list?"))
      return;

    try {
      await axios.delete(
        `${constantApi.baseUrl}/price_list_master/delete/${id}`,
      );
      alert("Price list deleted!");
      fetchPriceMasterList();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting record");
    }
  };

  const handleView = (id) => navigate(`/price_list_master_view/${id}`);
  const handleEdit = (id) => navigate(`/price_list_master_edit/${id}`);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto bg-white shadow-lg p-6 mt-10 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
            Price List Master
          </h2>

          <button
            onClick={() => navigate("/add_price_list_master")}
            className="px-3 py-1 rounded-lg bg-black text-white"
          >
            + Add New
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase tracking-wide text-xs">
                <th className="py-3 px-4 text-left border-b">Code</th>
                <th className="py-3 px-4 text-left border-b">Name</th>
                <th className="py-3 px-4 text-left border-b">Start Date</th>
                <th className="py-3 px-4 text-left border-b">End Date</th>
                <th className="py-3 px-4 text-left border-b">Status</th>
                <th className="py-3 px-4 text-center border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {priceLists.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-400 italic"
                  >
                    No price lists found
                  </td>
                </tr>
              ) : (
                priceLists.map((pl) => (
                  <React.Fragment key={pl.id}>
                    {/* MAIN ROW */}
                    <tr
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRow(pl.id)}
                    >
                      <td className="py-3 px-4">{pl.price_list_code}</td>
                      <td className="py-3 px-4">{pl.price_list_name}</td>
                      <td className="py-3 px-4">{pl.start_date}</td>
                      <td className="py-3 px-4">{pl.end_date || "-"}</td>
                      <td
                        className={`py-3 px-4 capitalize ${
                          pl.status === "inactive"
                            ? "text-red-600 font-semibold"
                            : ""
                        }`}
                      >
                        {pl.status}
                      </td>

                      <td className="py-3 px-4 text-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(pl.id);
                          }}
                          className="text-blue-500 hover:text-blue-700 text-lg"
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(pl.id);
                          }}
                          className="text-green-500 hover:text-green-700 text-lg"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(pl.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED ROW */}
                    {/* {expandedRow === pl.id && ( */}
                    {expandedRows.includes(pl.id) && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan="8" className="p-4">
                          <h3 className="text-lg font-semibold mb-3 text-gray-700">
                            Item Details ({pl.items?.length || 0})
                          </h3>

                          {pl.items && pl.items.length > 0 ? (
                            <table className="min-w-full border text-sm">
                              <thead className="bg-gray-200">
                                <tr>
                                  <th className="border px-3 py-2">Item ID</th>
                                  <th className="border px-3 py-2">UPC</th>
                                  <th className="border px-3 py-2">Name</th>
                                  <th className="border px-3 py-2">Cost</th>
                                  <th className="border px-3 py-2">
                                    Lan Price
                                  </th>
                                  <th className="border px-3 py-2">Price</th>
                                  <th className="border px-3 py-2">
                                    List Price
                                  </th>
                                  <th className="border px-3 py-2">Company</th>
                                  <th className="border px-3 py-2">Location</th>
                                  <th className="border px-3 py-2">Action</th>
                                </tr>
                              </thead>

                              <tbody>
                                {pl.items.map((item) => (
                                  <tr key={item.id} className="bg-white">
                                    <td className="border px-3 py-2">
                                      {item.item_id}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {item.item_upc}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {item.item_name}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {item.itemcost}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {item.itemlanprice}
                                    </td>
                                    <td className="border px-3 py-2">
                                      {item.itemprice}
                                    </td>
                                    {/* <td className="border px-3 py-2">
                                      {item.list_price}
                                    </td> */}
                                    <td className="border px-3 py-2">
                                      {editItemId === item.id ? (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="number"
                                            value={editPrice}
                                            className="w-24 border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                            onChange={(e) =>
                                              setEditPrice(e.target.value)
                                            }
                                          />

                                          {/* SAVE */}
                                          <button
                                            className="text-green-600 hover:text-green-800"
                                            onClick={async () => {
                                              if (
                                                !editPrice ||
                                                editPrice <= 0
                                              ) {
                                                alert("Invalid list price");
                                                return;
                                              }

                                              try {
                                                await axios.put(
                                                  `${constantApi.baseUrl}/pr_item_details/update/${item.id}`,
                                                  {
                                                    list_price:
                                                      Number(editPrice),
                                                  },
                                                );

                                                alert(
                                                  "List price updated successfully ✅",
                                                );
                                                setEditItemId(null);
                                                fetchPriceMasterList();
                                              } catch (error) {
                                                alert(
                                                  "Failed to update list price ❌",
                                                );
                                              }
                                            }}
                                          >
                                            <FaSave />
                                          </button>

                                          {/* CANCEL */}
                                          <button
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={() => setEditItemId(null)}
                                          >
                                            <FaTimes />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            {item.list_price}
                                          </span>

                                          {/* EDIT */}
                                          <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => {
                                              setEditItemId(item.id);
                                              setEditPrice(item.list_price);
                                            }}
                                          >
                                            <FaEdit />
                                          </button>
                                        </div>
                                      )}
                                    </td>

                                    {/* COMPANY NAME */}
                                    <td className="border px-3 py-2">
                                      {getCompanyName(item.comp)}
                                    </td>

                                    {/* LOCATION NAME */}
                                    <td className="border px-3 py-2">
                                      {getLocationName(item.loc)}
                                    </td>

                                    {/* DELETE ITEM */}
                                    <td className="border px-3 py-2 text-center">
                                      <button
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete Item"
                                        onClick={async () => {
                                          const confirmDelete = window.confirm(
                                            "Are you sure you want to delete this item?",
                                          );

                                          if (!confirmDelete) return;

                                          try {
                                            await axios.delete(
                                              `${constantApi.baseUrl}/pr_item_details/delete/${item.id}`,
                                            );

                                            alert(
                                              "Item deleted successfully ✅",
                                            );
                                            fetchPriceMasterList(); // refresh list
                                          } catch (error) {
                                            alert("Failed to delete item ❌");
                                          }
                                        }}
                                      >
                                        <FaTrash />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-gray-500 italic">
                              No items found.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PriceListMaster;
