import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { axios_get, axios_post, axios_post_image } from "../../../axios";
import { ToastMassage } from "../../../toast";
import moment from "moment";
import constantApi from "constantApi";

function Edit_Item() {
  const navigate = useNavigate();
  const params = useParams();
  const [formError, setFormError] = useState({});
  const [autocompleteuomValue, setAutocompleteuomValue] = useState("");
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [autocompleteItemValue, setAutocompleteItemValue] = useState("");
  const [autocompletecolorValue, setautocompleteColorValue] = useState("");
  const [autocompletesizeValue, setautocompleteSizeValue] = useState("");
  const [autocompletedepartValue, setautocompleteDepartValue] = useState("");
  const [autocompletedfamilyValue, setautocompleteFamilyValue] = useState("");
  const [autocompletedSubfamilyValue, setautocompletedSubfamilyValue] =
    useState("");
  const [autocompletedBrandValue, setautocompletedBrandValue] = useState("");
  const [autocompletedSupplierValue, setautocompletedSupplierValue] =
    useState("");
  const [autocompletedTax1Value, setautocompleteTax1Value] = useState("");
  const [autocompletedTax2Value, setautocompleteTax2Value] = useState("");
  const [autocompletedTax3Value, setautocompleteTax3Value] = useState("");

  const [uoms, setuomList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  const [itemCategories, setItemCategories] = useState([]);
  const [itemcolor, setItemColor] = useState([]);
  const [itemsize, setItemSize] = useState([]);
  const [itemdepat, setItemDepart] = useState([]);
  const [itemfamily, setItemFamliy] = useState([]);
  const [itemSubfamily, setItemSubFamliy] = useState([]);
  const [itemBrand, setItemBrand] = useState([]);
  const [itemSupplier, setItemSupplier] = useState([]);
  const [Tax1, setTax1] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");

  let user_data = JSON.parse(localStorage.getItem("user_data"));
  const [formData, setFormData] = useState({
    itemcatname: "",
    barcode: "",
    itemdesc: "",
    itemdesclong: "",
    stock: "",
    remaining_stock: "",
    itemdesc3: "",
    itemdesc4: "",
    item_description: "",
    itemupc: "",
    itemref: "",
    stylecode: "",
    colorname: "",
    sizename: "",
    departname: "",
    familyname: "",
    company_id: "",
    location_id: "",
    subfamliy: "",
    brandname: "",
    hsncode: "",
    itemcost: "",
    itemprice: "",
    itemlanprice: "",
    minstklvl: "",
    maxstklvl: "",
    itmstkmgmt: "",
    itmuom: "",
    itmwweight: "",
    itmwpurunit: "",
    itmwsalesunit: "",
    itmtax1code: "",
    itmtax2code: "",
    itmtax3code: "",
    itmcostingmet: "",
    suppliername: "",
    itmexpiry: "",
    note1: "",
    note2: "",
    note3: "",
    itmdt1: "",
    itmdt2: "",
    status: "1",
    addedby: `${user_data.firstname} ${user_data.lastname}`,
    createddt: new Date().toLocaleString(),
    id: params.id,
  });
  useEffect(() => {
    uomList();
    fetchCategories();
    fetchColors();
    fetchSize();
    fetchDepart();
    // fetchFamily();
    // fetchSubFamily();
    fetchBrand();
    fetchSupplier();
    fetchTax1();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axios_get(true, "item_category/dropdown-list");
      setItemCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response) {
      if (response.status) {
        setCompines(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchlocationList = async (company_id) => {
    const response = await axios_post(true, "location/loc_list", {
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
  const fetchColors = async () => {
    try {
      const response = await axios_get(true, "item_color/dropdown-list");
      setItemColor(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchSize = async () => {
    try {
      const response = await axios_get(true, "size_master/dropdown-list");
      setItemSize(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchDepart = async () => {
    try {
      const response = await axios_get(true, "item_department/dropdown-list");
      setItemDepart(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchFamily = async (departId) => {
    try {
      const response = await axios_post(true, "family_master/by_id_list", {
        id: departId,
      });
      setItemFamliy(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchSubFamily = async () => {
    try {
      const response = await axios_post(true, "sub_family_master/by_id_list", {
        id: familyId,
      });
      setItemSubFamliy(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchBrand = async () => {
    try {
      const response = await axios_get(true, "brand/dropdown-list");
      setItemBrand(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchSupplier = async () => {
    try {
      const response = await axios_post(true, "vendor/list");
      setItemSupplier(response.data?.records);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchTax1 = async () => {
    try {
      const response = await axios_get(true, "tax_master/dropdown-list");
      setTax1(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const uomList = async () => {
    const response = await axios_get(true, "item_uom/dropdown-list");
    if (response) {
      if (response.status) {
        setuomList(response.data);
        console.log("response fomr uoms ----------", response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const getUomNameById = (id) => uoms.find((u) => u.id === id)?.name || "";

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "item/details", {
        id: params.id,
      });
      console.log(" fetchOrderDetails --- item view", response.data);

      if (response.status) {
        const orderData = response.data;
        console.log(
          "Item Image URL in state:",
          `${constantApi.imageUrl}/itemsImage/${orderData.item_image}`,
        );

        setFormData({
          ...formData,
          sno: "",
          barcode: orderData?.barcode,
          item_image: orderData?.item_image,
          itemcatname: orderData?.itemcatname,
          colorname: orderData?.colorname,
          itemdesc: orderData?.itemdesc || orderData?.item_name,
          itemdesclong: orderData?.itemdesclong,
          itemdesc3: orderData?.itemdesc3,
          itemdesc4: orderData?.itemdesc4,
          item_description: orderData?.item_description,
          itemupc: orderData?.itemupc,
          itemref: orderData?.itemref,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          stylecode: orderData?.stylecode,
          sizename: orderData?.sizename,
          departname: orderData?.departname,
          familyname: orderData?.familyname,
          subfamliy: orderData?.subfamliy,
          brandname: orderData?.brandname,
          hsncode: orderData?.hsncode,
          itemcost: orderData?.itemcost,
          itemprice: orderData?.itemprice,
          itemlanprice: orderData?.itemlanprice,
          minstklvl: orderData?.minstklvl,
          maxstklvl: orderData?.maxstklvl,
          itmstkmgmt: orderData?.itmstkmgmt,
          itmuom: orderData?.itmuom,
          itmwweight: orderData?.itmwweight,
          itmwpurunit: orderData?.itmwpurunit,
          itmwsalesunit: orderData?.itmwsalesunit,
          itmtax1code: orderData?.itmtax1code,
          itmtax2code: orderData?.itmtax2code,
          itmtax3code: orderData?.itmtax3code,
          itmcostingmet: orderData?.itmcostingmet,
          suppliername: orderData?.vendor,
          // suppliername: orderData?.suppliername,
          itmexpiry: orderData?.itmexpiry,
          note1: orderData?.note1,
          note2: orderData?.note2,
          note3: orderData?.note3,
          // itmdt1: orderData?.itmdt1,
          // itmdt2: orderData?.itmdt2,
          itmdt1: orderData?.itmdt1 ? orderData.itmdt1.split("T")[0] : "",
          itmdt2: orderData?.itmdt2 ? orderData.itmdt2.split("T")[0] : "",

          status: orderData.status === 0 ? "0" : "1",
          code: orderData.item_code,
          name: orderData.item_name,
          stock: orderData.stock,
          remaining_stock: orderData.remaining_stock,
          partNumber: orderData.partNumber,
          tax: orderData.item_tax,
          price: orderData.item_vat_percentage,
          // uom: orderData?.item_main_prices?.[0]?.item_uom?.id,
          // item_uom: orderData?.item_main_prices?.[0]?.item_uom?.name,
        });

        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }
        // setAutocompleteuomValue(orderData?.item_main_prices?.[0]?.item_uom);
        let itemcategoryfetch = {
          itemcatname: orderData.itemcategory?.itemcatname,
          id: orderData.itemcatname,
        };
        setAutocompleteItemValue(itemcategoryfetch);

        // let itemcampanyfetch = {
        //     "itemcatname": orderData.itemcategory?.itemcatname,
        //     "id": orderData.itemcatname,
        // }
        // setAutocompleteItemValue(itemcampanyfetch);

        // let itemcategoryfetch = {
        //     "itemcatname": orderData.itemcategory?.itemcatname,
        //     "id": orderData.itemcatname,
        // }
        setAutocompleteItemValue(itemcategoryfetch);
        let itemcolorfetch = {
          itemcolname: orderData.item_color?.itemcolname,
          id: orderData.colorname,
        };
        setautocompleteColorValue(itemcolorfetch);

        let itemsizefetch = {
          itemsizename: orderData?.size_master?.itemsizename,
          id: orderData.sizename,
        };
        setautocompleteSizeValue(itemsizefetch);

        let itemdepartfetch = {
          itemdeptname: orderData?.item_department?.itemdeptname,
          id: orderData.departname,
        };
        setautocompleteDepartValue(itemdepartfetch);
        // ✅ IMPORTANT (this drives UI logic)
        setSelectedDepartmentId(orderData.departname);
        setSelectedDepartmentName(orderData?.item_department?.itemdeptname);

        let itemfamilyfetch = {
          itemfamname: orderData?.family_master?.itemfamname,
          id: orderData.familyname,
        };
        setautocompleteFamilyValue(itemfamilyfetch);

        let itemsubfamilyfetch = {
          itemsfamname: orderData?.sub_family_master?.itemsfamname,
          id: orderData.subfamliy,
        };
        setautocompletedSubfamilyValue(itemsubfamilyfetch);

        let itembrandfetch = {
          brandname: orderData?.brand?.brandname,
          id: orderData.brandname,
        };
        setautocompletedBrandValue(itembrandfetch);

        let itemtax1fetch = {
          taxpor1: orderData?.tax_master_1?.taxpor1,
          taxpor1desc: orderData?.tax_master_1?.taxpor1desc,

          id: orderData.itmtax1code,
        };
        setautocompleteTax1Value(itemtax1fetch);

        let itemtax2fetch = {
          taxpor2: orderData?.tax_master_2?.taxpor2,
          id: orderData.itmtax2code,
        };
        setautocompleteTax2Value(itemtax2fetch);

        let itemtax3fetch = {
          taxpor3: orderData?.tax_master_3?.taxpor3,
          id: orderData.itmtax3code,
        };
        setautocompleteTax3Value(itemtax3fetch);

        let itemsupplierfetch = {
          // users: {
          firstname: orderData?.vendor?.firstname,
          id: orderData.vendor,
          // },
        };
        setautocompletedSupplierValue(itemsupplierfetch);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchcompanyList();
  }, []);

  useEffect(() => {
    if (uoms.length > 0 && formData.itmuom) {
      const selectedUom = uoms.find((uom) => uom.id === formData.itmuom);

      setAutocompleteuomValue(selectedUom || null);
    }
  }, [uoms, formData.itmuom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "company_id" && { location_id: "" }),
    }));
    if (name === "company_id") {
      fetchlocationList(value);
    }
  };

  const handleBack = () => {
    navigate("/item");
  };

  const date2ViewField = (
    <div className="w-full sm:w-1/4 px-2 pb-2">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {selectedDepartmentId == 25 ? "Publication Date" : "Date 2"}
      </label>
      <input
        type="date"
        value={formData.itmdt2}
        disabled
        className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
      />
    </div>
  );

  const note2ViewField = (
    <div className="w-full sm:w-1/4 px-2 pb-2">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {selectedDepartmentId == 25 ? "Short Description" : "Note2"}
      </label>
      <input
        type="text"
        value={formData.note2}
        disabled
        className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
      />
    </div>
  );

  const note1ViewField = (
    <div className="w-full sm:w-1/4 px-2 pb-2">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {selectedDepartmentId == 25 ? "Pages" : "Note1"}
      </label>
      <input
        type="text"
        value={formData.note1}
        disabled
        className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
      />
    </div>
  );
  const note3ViewField = (
    <div className="w-full sm:w-1/4 px-2 pb-2">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {selectedDepartmentId == 25 ? "Dimension" : "Note3"}
      </label>
      <input
        type="text"
        value={formData.note3}
        disabled
        className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
      />
    </div>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <form>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <Grid container xs={12} spacing={0}>
                    <Grid item xs={6} mr={0}>
                      <MDTypography variant="h6" color="white">
                        <Icon fontSize="small">shopping_cart</Icon>
                        View Item
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/item">
                        <MDButton variant="gradient" color="light">
                          Back
                        </MDButton>
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      {/* Item Category */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Item Category
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompleteItemValue?.itemcatname || ""}
                        >
                          {autocompleteItemValue?.itemcatname || "No selection"}
                        </div>
                      </div>

                      {/* Company */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="company_id"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Company
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={
                            compines.find((c) => c.id === formData.company_id)
                              ?.compdesc || "No selection"
                          }
                        >
                          {compines.find((c) => c.id === formData.company_id)
                            ?.compdesc || "No selection"}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="location_id"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={
                            locations.find((l) => l.id === formData.location_id)
                              ?.locname || "No selection"
                          }
                        >
                          {locations.find((l) => l.id === formData.location_id)
                            ?.locname || "No selection"}
                        </div>
                      </div>

                      {/* Department */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompletedepartValue?.itemdeptname || ""}
                        >
                          {autocompletedepartValue?.itemdeptname ||
                            "No selection"}
                        </div>
                      </div>

                      {/* Family */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Family
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompletedfamilyValue?.itemfamname || ""}
                        >
                          {autocompletedfamilyValue?.itemfamname ||
                            "No selection"}
                        </div>
                      </div>

                      {/* Sub Family */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Sub Family
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={
                            autocompletedSubfamilyValue?.itemsfamname || ""
                          }
                        >
                          {autocompletedSubfamilyValue?.itemsfamname ||
                            "No selection"}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Item Name
                        </label>
                        <input
                          type="text"
                          name="itemdesc"
                          value={formData.itemdesc}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {selectedDepartmentId == 25 && note2ViewField}

                      {/* Long Description */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {selectedDepartmentId == 25
                            ? "Author"
                            : "Long Description"}
                        </label>
                        <input
                          type="text"
                          name="itemdesclong"
                          value={formData.itemdesclong}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Description 3 */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {selectedDepartmentId == 25
                            ? "Publisher"
                            : "Description 3"}
                        </label>
                        <input
                          type="text"
                          name="itemdesc3"
                          value={formData.itemdesc3}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {selectedDepartmentId == 25 && date2ViewField}

                      {/* Description 4 */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {selectedDepartmentId == 25
                            ? "Language"
                            : "Description 4"}
                        </label>
                        <input
                          type="text"
                          name="itemdesc4"
                          value={formData.itemdesc4}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {selectedDepartmentId == 25 && note1ViewField}
                      {selectedDepartmentId == 25 && note3ViewField}

                      {/* UPC */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          UPC
                        </label>
                        <input
                          type="number"
                          name="itemupc"
                          value={formData.itemupc}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Item Reference */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Item Reference
                        </label>
                        <input
                          type="text"
                          name="itemref"
                          value={formData.itemref}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Style Code */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Style Code
                        </label>
                        <input
                          type="text"
                          name="stylecode"
                          value={formData.stylecode}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Color */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Color
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompletecolorValue?.itemcolname || ""}
                        >
                          {autocompletecolorValue?.itemcolname ||
                            "No selection"}
                        </div>
                      </div>

                      {/* Size */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Size
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompletesizeValue?.itemsizename || ""}
                        >
                          {autocompletesizeValue?.itemsizename ||
                            "No selection"}
                        </div>
                      </div>

                      {/* Brand */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Brand
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompletedBrandValue?.brandname || ""}
                        >
                          {autocompletedBrandValue?.brandname || "No selection"}
                        </div>
                      </div>

                      {/* HSN Code */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          HSN Code
                        </label>
                        <input
                          type="text"
                          name="hsncode"
                          value={formData.hsncode}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Total Stock */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Total Stock
                        </label>
                        <input
                          type="text"
                          name="stock"
                          value={formData.stock}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Avl Stock */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Avl Stock
                        </label>
                        <input
                          type="text"
                          name="remaining_stock"
                          value={formData.remaining_stock}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Cost */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Cost
                        </label>
                        <input
                          type="number"
                          name="itemcost"
                          value={formData.itemcost}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Price */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          name="itemprice"
                          value={formData.itemprice}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Landed Cost */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Landed Cost
                        </label>
                        <input
                          type="text"
                          name="itemlanprice"
                          value={formData.itemlanprice}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Min Stock Level */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Min Stock Level
                        </label>
                        <input
                          type="number"
                          name="minstklvl"
                          value={formData.minstklvl}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Max Stock Level */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Max Stock Level
                        </label>
                        <input
                          type="number"
                          name="maxstklvl"
                          value={formData.maxstklvl}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Stock Management (readonly autocomplete) */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Stock Management
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={formData.itmstkmgmt || ""}
                        >
                          {formData.itmstkmgmt || "No selection"}
                        </div>
                      </div>

                      {/* Unit of Measurement (readonly autocomplete) */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Unit of Measurement
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompleteuomValue?.uomname || ""}
                        >
                          {autocompleteuomValue?.uomname || "No selection"}
                        </div>
                      </div>

                      {/* Purchase Unit */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Purchase Unit
                        </label>
                        <input
                          type="text"
                          value={getUomNameById(formData.itmwpurunit)}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Sales Unit */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Sales Unit
                        </label>
                        <input
                          type="text"
                          value={getUomNameById(formData.itmwsalesunit)}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Weight */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Weight
                        </label>
                        <input
                          type="number"
                          name="itmwweight"
                          value={formData.itmwweight}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Tax 1 */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Tax 1
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={
                            autocompletedTax1Value
                              ? `${autocompletedTax1Value.taxpor1} - ${autocompletedTax1Value.taxname}`
                              : ""
                          }
                        >
                          {autocompletedTax1Value
                            ? `${autocompletedTax1Value.taxpor1desc}`
                            : "No selection"}
                        </div>
                      </div>

                      {/* Costing method */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Costing method
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={formData.itmcostingmet || ""}
                        >
                          {/* {formData.itmcostingmet || "No selection"} */}
                          {formData.itmcostingmet === "0.00"
                            ? "FIFO - First in first out"
                            : null}
                        </div>
                      </div>

                      {/* Supplier Name */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Supplier Name
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompletedSupplierValue?.firstname || ""}
                        >
                          {autocompletedSupplierValue?.firstname ||
                            "No selection"}
                        </div>
                      </div>

                      {/* Expiry */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Expiry
                        </label>
                        <input
                          type="date"
                          name="itmexpiry"
                          value={formData.itmexpiry}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Note1 */}
                      {selectedDepartmentId != 25 && note1ViewField}

                      {/* Note2 */}
                      {selectedDepartmentId != 25 && note2ViewField}
                      {selectedDepartmentId != 25 && note3ViewField}

                      {/* Note3 */}
                      {/* <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Note3
                        </label>
                        <input
                          type="text"
                          name="note3"
                          value={formData.note3}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div> */}

                      {/* Date 1 */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Date 1
                        </label>
                        <input
                          type="date"
                          name="itmdt1"
                          value={formData.itmdt1}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Date 2 */}
                      {selectedDepartmentId != 25 && date2ViewField}

                      {/* Added By */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Added By
                        </label>
                        <input
                          type="text"
                          name="addedby"
                          value={formData.addedby}
                          maxLength={40}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Created Date */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Created Date
                        </label>
                        <input
                          type="text"
                          name="createddt"
                          value={formData.createddt}
                          disabled
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Status (readonly select) */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={
                            formData.status === "1"
                              ? "Active"
                              : formData.status === "0"
                                ? "Inactive"
                                : "No selection"
                          }
                        >
                          {formData.status === "1"
                            ? "Active"
                            : formData.status === "0"
                              ? "Inactive"
                              : "No selection"}
                        </div>
                      </div>

                      {/* Image */}
                      <div className="w-full sm:w-1/3 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Image
                        </label>
                        {formData.item_image ? (
                          <img
                            src={`${constantApi.imageUrl}/itemsImage/${formData.item_image}`}
                            alt={formData.itemdesc || "Item Image"}
                            className="w-48 h-48 object-contain border border-gray-300 rounded-md shadow-md p-1"
                          />
                        ) : (
                          <span className="text-gray-500">
                            No image available
                          </span>
                        )}
                      </div>

                      {/* Item Description Details - ReactQuill */}
                      <div className="w-full px-2 pb-10">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Item Description Details
                        </label>
                        <ReactQuill
                          theme="snow"
                          value={formData.item_description}
                          style={{
                            height: "200px",
                            width: "100%",
                            marginBottom: "100px",
                          }}
                        />
                      </div>
                    </Grid>
                  </MDBox>
                </MDBox>
              </Card>
            </form>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Edit_Item;

{
  /* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax 2</InputLabel>
                          <Autocomplete
                            disablePortal
                            disabled={true}
                            id="uom-combo-box"
                            options={Tax1}
                            getOptionLabel={(option) => option?.taxpor2 || ""}
                            renderOption={(props, option) => (
                              <li {...props}>
                                {option?.taxpor2} - {option?.taxpor2desc}
                              </li>
                            )}
                            value={autocompletedTax2Value}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "itmtax2code"
                              )
                            }
                            className="small-autocomplete"
                            renderInput={(params) => (
                              <TextField {...params} className="small-input" />
                            )}
                          />
                          {formError.itmtax2code && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmtax2code}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax 3</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            disabled={true}
                            options={Tax1}
                            getOptionLabel={(option) => option?.taxpor3 || ""}
                            renderOption={(props, option) => (
                              <li {...props}>
                                {option?.taxpor3} - {option?.taxpor3desc}
                              </li>
                            )}
                            value={autocompletedTax3Value}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "itmtax3code"
                              )
                            }
                            className="small-autocomplete"
                            renderInput={(params) => (
                              <TextField {...params} className="small-input" />
                            )}
                          />
                          {formError.itmtax3code && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmtax3code}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid> */
}

{
  /* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Item Description Details.
                          </InputLabel>

                          <MDInput
                            multiline
                            rows={8} // increase rows as needed
                            variant="outlined"
                            className="small-input"
                            name="item_description"
                            value={formData.item_description}
                            
                            sx={{ width: "100%" }}
                          />
                        </MDBox>
                      </Grid> */
}

{
  /* <Grid item xs={12}> */
}
{
  /* <Grid container spacing={2} justifyContent="right" sx={{ mt: 1, mb: 2 }}>
                        <Grid item xs={2} ml={3}>
                          <MDBox sx={{ display: 'flex' }}>
                            <MDButton variant="gradient" disabled={isSubmit} color="info" type="submit" fullWidth>
                              {isSubmit ?
                                <CircularProgress color="white" size={24}
                                  sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                  }} />
                                : 'Save'
                              }
                            </MDButton>
                            <MDButton variant="gradient" disabled={isSubmit} color="secondary" type="submit" fullWidth sx={{ marginLeft: '15px' }} onClick={handleBack}>
                              cancel
                            </MDButton>
                          </MDBox>
                          <MDBox>

                          </MDBox>
                        </Grid>
                      </Grid> */
}
{
  /* </Grid> */
}

{
  /* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Barcode</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            className="small-input"
                            name="barcode"
                            value={formData.barcode}
                            
                          />
                          {formError.barcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.barcode}</MDTypography>}
                        </MDBox>
                      </Grid> */
}
{
  /* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Cost</InputLabel>
                          <MDInput
                            type="numeric"
                            variant="outlined"
                            className="small-input"
                            name="itemcost"
                            value={formData.itemcost}
                            
                          />
                          {formError.itemcost && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itemcost}</MDTypography>}

                        </MDBox>
                      </Grid> */
}
{
  /* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Part No.</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            className="small-input"
                            name="partNumber"
                            value={formData.partNumber}
                            
                          />
                          {formError.partNumber && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.partNumber}</MDTypography>}
                        </MDBox>
                      </Grid> */
}

{
  /* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Code</InputLabel>
                          <MDInput
                            type="text"
                            // label="Order Number"
                            variant="outlined"
                            name="code"
                            value={formData.code}
                            
                            sx={{ width: 300 }}
                            className="small-input"
                            disabled
                          />
                          {formError.code && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.code}</MDTypography>}
                        </MDBox>
                      </Grid> */
}

{
  /*<Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax%</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            sx={{ width: 300 }}
                            name="tax"
                            value={formData.tax}
                            
                          />
                          {formError.tax && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.tax}</MDTypography>}

                        </MDBox>
                      </Grid> */
}
