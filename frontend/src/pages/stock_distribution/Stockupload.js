import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import { axios_post, axios_get } from "../../axios";
import { ToastMassage } from "toast";
import ExportMainItems from "./ExportMainItems";
import CompanyStockPopup from "./CompanyStockPopup";

function Stockupload() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [itemLists, setItemLists] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showMainItemsListPopup, setshowMainItemsListPopup] = useState(false);
  const [showCompStockListPopup, setShowCompListPopup] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);

  const [mainCompanies, setMainCompanies] = useState([]);
  const [relayCompanies, setRelayCompanies] = useState([]);
  const [selectedMainCompany, setSelectedMainCompany] = useState("");
  const [selectedRelayCompany, setSelectedRelayCompany] = useState("");
  const [selectedMainCompanyItem, setSelectedMainCompanyItem] = useState("");

  const [selectedCompanyItems, setSelectedCompanyItems] = useState("");
  const [companyLevelStock, setCompanyLevelStock] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response?.status) {
      setMainCompanies(
        response.data.filter((comp) => comp.is_main_comp === "yes")
      );
      setRelayCompanies(
        response.data.filter((comp) => comp.is_main_comp !== "yes")
      );
    }
  };

  const fetchLocationList = async () => {
    const response = await axios_post(true, "location/com_loc_list");
    // console.log("response ", response.data);

    if (response?.status) {
      setLocations(response.data);
    }
  };

  const fetchItemList = async () => {
    const response = await axios_post(true, "item/list");
    if (response?.status) {
      setItemLists(response.data);
      setSelectedMainCompanyItem(
        response.data.filter((item) => item.company_id == selectedMainCompany)
      );
    }
  };

  const fetchCompanyItemList = async () => {
    const response = await axios_post(true, "item_location_master/list");

    if (response?.status) {
      // Convert selectedRelayCompany and selectedLocation to numbers
      const companyId = Number(selectedRelayCompany);
      const locationId = Number(selectedLocation);

      const filteredItems = response.data.filter((item) => {
        const companyMatch = companyId
          ? Number(item.company_id) === companyId
          : true;
        const locationMatch = locationId
          ? Number(item.location_id) === locationId
          : true;
        return companyMatch && locationMatch;
      });

      setSelectedCompanyItems(filteredItems);
    }
  };

  useEffect(() => {
    const fetchAndFilter = async () => {
      const response = await axios_post(true, "item_location_master/list");
      console.log("reponse data is ----", response.data);

      if (response?.status) {
        const companyId = Number(selectedRelayCompany);
        const locationId = Number(selectedLocation);

        const filtered = response.data.filter((item) => {
          const companyMatch = companyId
            ? Number(item.company_id) === companyId
            : true;
          const locationMatch = locationId
            ? Number(item.location_id) === locationId
            : true;
          return companyMatch && locationMatch;
        });

        setSelectedCompanyItems(filtered);
      }
    };

    fetchAndFilter();
  }, [selectedRelayCompany, selectedLocation]);

  useEffect(() => {
    fetchCompanyList();
    fetchLocationList();
    fetchItemList();
    fetchCompanyItemList();
  }, []);

  // console.log("selectedCompanyItems--------------------", selectedCompanyItems);

  const getStockData = () => {
    return selectedCompanyItems.map((item) => ({
      Itemupc: item.itemupc,
      Item_Name: item.item_name,
      Company_id: item.company_id,
      Location_id: item.location_id,
      // Item_barcode: item.item_barcode,
      Stock: item.stock,
      Price: item.itemprice,
      // Itemcatname: item?.itemcategory?.itemcatname,
    }));
  };

  const exportToExcel = () => {
    const data = getStockData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "StockData.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(parsedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!selectedRelayCompany || !selectedLocation) {
      ToastMassage("Company and Location are required", "error");
      return;
    }
    setIsUploading(true); // 🔥 START LOADER
    try {
      const response = await axios_post(
        true,
        "item_location_master/update-stock-excel",
        {
          company_id: selectedRelayCompany,
          location_id: selectedLocation,
          items: excelData,
        }
      );

      console.log("items is --------------------", excelData);

      // Check the response status
      if (response.status === false) {
        if (response.missingItems?.length) {
          const missing = response.missingItems.join(", ");
          ToastMassage(
            `Some items do not exist in item_master: ${missing}`,
            "error"
          );
        } else if (response.duplicateItems?.length) {
          const duplicates = response.duplicateItems.join(", ");
          ToastMassage(`Item already exists: ${duplicates}`, "error");
        } else {
          ToastMassage(response.message || "Error occurred", "error");
        }
        setUploadStatus(response.message);
      } else {
        setUploadStatus(response.message);
        ToastMassage("Stock updated successfully", "success");
        setShowUploadPopup(false);
        fetchItemList();
        fetchCompanyItemList();
      }
    } catch (error) {
      setUploadStatus("Upload failed.");
      ToastMassage(
        error?.response?.data?.message || "Stock update failed",
        "error"
      );
    } finally {
      setIsUploading(false); // 🔥 STOP LOADER
    }
  };

  ////////////
  const fetchCompanyLevelStock = async () => {
    const response = await axios_get(true, "companyLevelStock/list");
    console.log("response.fetchCompanyLevelStock", response.data);
    if (response?.status) {
      setCompanyLevelStock(response.data);
    }
  };

  useEffect(() => {
    fetchCompanyLevelStock();
  }, []);

  console.log("selectedLocation", selectedLocation);

  const [selectedItems, setSelectedItems] = useState(new Set());
  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      const updated = new Set(prev);
      if (updated.has(itemId)) {
        updated.delete(itemId);
      } else {
        updated.add(itemId);
      }
      return updated;
    });
  };
  const allSelected =
    selectedCompanyItems.length > 0 &&
    selectedItems.size === selectedCompanyItems.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      setSelectedItems(new Set());
    } else {
      // Select all item ids
      const allIds = selectedCompanyItems.map((item) => item.id);
      setSelectedItems(new Set(allIds));
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="mx-8 p-6 bg-white shadow-md rounded-xl mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Opening stock and cost update
          </h2>

          <button
            onClick={() => {
              const filtered = itemLists.filter(
                (item) => item.company_id == selectedMainCompany
              );
              setSelectedMainCompanyItem(filtered);
              setshowMainItemsListPopup(true);
            }}
            className="bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700"
          >
            Main Company Items List
          </button>

          <button
            onClick={() => {
              setShowCompListPopup(true);
            }}
            className="bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700"
          >
            Company Level Items Stock
          </button>

          {selectedCompanyItems.length > 0 ? (
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700"
            >
              Export to Excel
            </button>
          ) : (
            // ""
            <button
              disabled
              className="bg-gray-300 text-white px-2 py-1 text-sm rounded cursor-not-allowed"
            >
              Export to Excel
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Main Company */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Main Company
            </label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={selectedMainCompany}
              onChange={(e) => {
                setSelectedMainCompany(e.target.value);
                setSelectedRelayCompany("");
                setSelectedLocation("");
              }}
            >
              <option value="">-- Select Main Company --</option>
              {mainCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.compdesc}
                </option>
              ))}
            </select>
          </div>

          {/* Relay Company */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Relay Company
            </label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={selectedRelayCompany}
              onChange={(e) => {
                setSelectedRelayCompany(e.target.value);
                setSelectedLocation("");
              }}
              disabled={!selectedMainCompany}
            >
              <option value="">-- Select Relay Company --</option>
              {relayCompanies
                .filter(
                  (relay) =>
                    relay.main_company_id === Number(selectedMainCompany)
                )
                .map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.compdesc}
                  </option>
                ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Location
            </label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              disabled={!selectedRelayCompany}
            >
              <option value="">Select Location</option>
              {locations
                .filter(
                  (loc) => Number(loc.compdesc) === Number(selectedRelayCompany)
                )

                .map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locname}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {selectedRelayCompany && selectedLocation && (
          <div className="mt-6">
            <p className="text-md font-semibold mb-2">
              Company{" "}
              {relayCompanies.find((c) => c.id === Number(selectedRelayCompany))
                ?.compdesc || "Company"}
              {" , "}
              Location{" "}
              {locations.find((l) => l.id === Number(selectedLocation))
                ?.locname || "Location"}
              {" - "}
              Items
            </p>

            {/* ✅ Scrollable container */}
            <div className="max-h-[250px] overflow-y-auto border rounded-lg">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border px-2 py-1">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="border px-2 py-1">Item UPC</th>
                    <th className="border px-2 py-1">Item Name</th>
                    {/* <th className="border px-2 py-1">Company Name</th>
                    <th className="border px-2 py-1">Location Name</th> */}
                    <th className="border px-2 py-1">Total Stock</th>
                    <th className="border px-2 py-1">Trn Stock</th>
                    <th className="border px-2 py-1">Remaining Stock</th>
                    <th className="border px-2 py-1">Item Cost</th>
                    <th className="border px-2 py-1">Landed Price</th>
                    <th className="border px-2 py-1">Price</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {selectedCompanyItems.length > 0 ? (
                    selectedCompanyItems.map((item) => {
                      const companyName =
                        relayCompanies.find(
                          (c) => c.id === Number(item.company_id)
                        )?.compdesc || "—";
                      const locationName =
                        locations.find((l) => l.id === Number(item.location_id))
                          ?.locname || "—";

                      return (
                        <tr key={item.id}>
                          <td className="border px-2 py-1">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleSelectItem(item.id)}
                            />
                          </td>
                          <td className="border px-2 py-1">{item.itemupc}</td>
                          <td className="border px-2 py-1">{item.item_name}</td>
                          {/* <td className="border px-2 py-1">{companyName}</td>
                          <td className="border px-2 py-1">{locationName}</td> */}
                          <td className="border px-2 py-1">{item.stock}</td>
                          <td className="border px-2 py-1">
                            {item.distributed_stock}
                          </td>
                          <td className="border px-2 py-1">
                            {item.remaining_stock}
                          </td>
                          <td className="border px-2 py-1">{item.itemcost}</td>
                          <td className="border px-2 py-1">
                            {item.itemlanprice}
                          </td>
                          <td className="border px-2 py-1">{item.itemprice}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-2 text-gray-500 border"
                      >
                        No items found for selected company & location
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowUploadPopup(true)}
                className="bg-blue-600 text-white px-4 text-sm rounded hover:bg-blue-700"
              >
                Upload Stock
              </button>
              {/* <button
                onClick={() => setShowUploadPopup(true)}
                className="bg-blue-600 text-white px-4 text-sm rounded hover:bg-blue-700"
              >
                PR Price
              </button> */}

              <button
                onClick={() => {
                  const dataToExport = selectedCompanyItems
                    .filter((item) => selectedItems.has(item.id))
                    .map((item) => ({
                      item_id: item.id,
                      item_upc: item.itemupc,
                      item_name: item.item_name,
                      comp: item.company_id,
                      loc: item.location_id,
                      itemcost: item.itemcost,
                      itemlanprice: item.itemlanprice,
                      itemprice: item.itemprice,
                      item_pr_price: "",
                    }));

                  if (dataToExport.length === 0) {
                    alert("Please select at least one item to download.");
                    return;
                  }

                  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(
                    workbook,
                    worksheet,
                    "Selected Stock Data"
                  );
                  const excelBuffer = XLSX.write(workbook, {
                    bookType: "xlsx",
                    type: "array",
                  });
                  const dataBlob = new Blob([excelBuffer], {
                    type: "application/octet-stream",
                  });
                  saveAs(dataBlob, "SelectedStockData.xlsx");
                }}
                disabled={selectedItems.size === 0}
                className={`ms-2 px-2 py-1 text-sm rounded text-white ${
                  selectedItems.size === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Download For PR
              </button>

              <a
                href="/bulkstore_compwise.xlsx"
                download="bulkstore_compwise.xlsx"
                className="mt-3 ms-8 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
              >
                Sample Data
              </a>
            </div>
          </div>
        )}
      </div>

      {showUploadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Upload Updated Excel File
            </h2>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="mb-4"
            />
            <div className="flex justify-end">
              {/* <button
                className="bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700 mr-2"
                onClick={handleUpload}
              >
                Upload
              </button> */}
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-2 py-1 text-sm rounded text-white ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                className="bg-gray-400 text-white px-2 py-1 text-sm rounded hover:bg-gray-500"
                onClick={() => setShowUploadPopup(false)}
              >
                Cancel
              </button>
            </div>
            {uploadStatus && (
              <p className="mt-2 text-sm text-center">{uploadStatus}</p>
            )}
          </div>
        </div>
      )}
      {showMainItemsListPopup && (
        <ExportMainItems
          selectedMainCompanyItem={selectedMainCompanyItem}
          setshowMainItemsListPopup={setshowMainItemsListPopup}
        />
      )}
      {showCompStockListPopup && (
        <CompanyStockPopup
          companyLevelStock={companyLevelStock}
          setShowCompListPopup={setShowCompListPopup}
        />
      )}
    </DashboardLayout>
  );
}

export default Stockupload;
