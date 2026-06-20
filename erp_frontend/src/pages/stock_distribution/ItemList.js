import React, { useState, useEffect } from "react";
import { axios_post } from "../../axios";
import { ToastMassage } from "toast";
import constantApi from "constantApi";

const ItemList = ({ onItemClick }) => {
  const [TableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBarcodeQuery, setSearchBarcodeQuery] = useState("");
  const [activeTab, setActiveTab] = useState(3);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [family, setFamily] = useState([]);
  const [department, setDepartment] = useState([]);
  const [locations, setlocations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formError, setFormError] = useState({});

  // search by item code
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // search by bar code
  const handleSearchBarcodeChange = (e) => {
    setSearchBarcodeQuery(e.target.value);
    console.log("search bar code is--", e.target.value);
  };

  const customerList = async () => {
    const response = await axios_post(true, "item_category/cat_item_list");
    if (response) {
      if (response.status) {
        setTableData(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchdepartmentList = async () => {
    const response = await axios_post(true, "item_department/list");
    if (response) {
      if (response.status) {
        setDepartment(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchfamilyList = async () => {
    const response = await axios_post(true, "family_master/list");
    if (response) {
      if (response.status) {
        setFamily(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchSubfamilyList = async (company_id) => {
    const response = await axios_post(true, "sub_family_master/list", {
      company_id: company_id,
    });
    if (response) {
      if (response.status) {
        setlocations(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchFamilyListByDepartment = async (departmentId) => {
    setSelectedDepartmentId(departmentId);
    try {
      const response = await axios_post(true, "family_master/list");
      if (response?.status) {
        const filteredData = response.data.filter(
          (item) => item.itemdeptname === departmentId
        );
        setFamily(filteredData);
      } else {
        ToastMassage(response.message || "Failed to fetch families", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      ToastMassage("Something went wrong", "error");
    }
  };

  useEffect(() => {
    customerList();
    fetchdepartmentList();
    fetchfamilyList();
    fetchSubfamilyList();
  }, []);

  useEffect(() => {
    const filteredItemData = TableData.map((item, index) => {
      if (activeTab === index) {
        const filteredItems = item.item_master?.filter((masterItem) => {
          const matchSearch = masterItem.item_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          const matchDepartment = selectedDepartmentId
            ? masterItem.departname == selectedDepartmentId
            : true;

          const matchFamily = selectedFamilyId
            ? masterItem.familyname == selectedFamilyId
            : true;

          const matchBarcode = searchBarcodeQuery
            ? masterItem.item_barcode
                ?.toLowerCase()
                .includes(searchBarcodeQuery.toLowerCase())
            : true;

          return matchSearch && matchBarcode && matchDepartment && matchFamily;
        });

        return { index, filteredItems };
      }
      return null;
    }).filter(Boolean);

    setFilteredData(filteredItemData);
  }, [
    selectedDepartmentId,
    selectedFamilyId,
    searchQuery,
    searchBarcodeQuery,
    activeTab,
    TableData,
  ]);

  //   const handleBoxClick = (item) => {
  //     // Your custom logic here (not provided in original)
  //     console.log("Box clicked:", item);
  //   };

  const handleBoxClick = (item) => {
    if (onItemClick) {
      onItemClick(item); // Pass clicked item to parent
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const tabType = TableData[newValue]?.itemcatname || "Default";
    // Assuming setFormData2 is available in full context
    // setFormData2((prevData) => ({
    //   ...prevData,
    //   type: tabType,
    // }));
  };
  const [formData3, setFormData3] = useState({
    department_id: "",
    family_id: "",
  });
  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    setSelectedFamilyId(value);
    setFormData3((prevData) => ({
      ...prevData,
      [name]: value, // updates family_id
    }));
  };

  return (
    <div>
      <div className=" text-left flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by Item Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-auto h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
        />
        <input
          type="text"
          placeholder="Search by Barcode"
          // onBlur={handleSearchTypeChange} this function is sue for image
          value={searchBarcodeQuery}
          onChange={handleSearchBarcodeChange}
          className="w-auto h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
        />
      </div>
      {/* this is family list that is fine use latter */}

      {/* <div>
        <select
          name="family_id"
          value={formData3.family_id}
          onChange={handleFamilyChange}
          className="w-[150px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
        >
          <option value="">Family</option>
          {family?.map((fam) => (
            <option key={fam.id} value={fam.id}>
              {fam.itemfamname}
            </option>
          ))}
        </select>
        {formError.family_id && (
          <p className="text-red-600 text-xs mt-1">{formError.family_id}</p>
        )}
      </div> */}

      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-2 mt-2">
        {filteredData.map(({ index, filteredItems }) =>
          filteredItems.length > 0 ? (
            filteredItems.map((masterItem, masterIndex) => {
              const imageUrl = masterItem?.item_image
                ? `${constantApi.imageUrl}/itemsImage/${masterItem?.item_image}`
                : null;

              return (
                <div
                  key={`${index}-${masterIndex}`}
                  onClick={() => handleBoxClick(masterItem)}
                  className="border border-gray-300 p-1 rounded-md cursor-pointer hover:shadow-md transition flex flex-col items-center text-center bg-white"
                >
                  <div className="w-24 h-16 mb-2 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={masterItem.item_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </div>

                  <div className="w-16">
                    <h4 className="text-xs font-medium truncate">
                      {masterItem.item_name}
                    </h4>
                    <p className="text-white text-sm mt-1 bg-blue-400 p-1 rounded">
                      {masterItem.itemprice}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              key={`empty-${index}`}
              className="col-span-full text-center text-gray-500 py-4"
            >
              <h4>No items available</h4>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ItemList;
