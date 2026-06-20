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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRadioGroup } from "@mui/material/RadioGroup";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import routes from "routes";
import { axios_get, axios_post, axios_post_image } from "../../axios";
import { ToastMassage } from "../../toast";
import moment from "moment";
import constantApi from "constantApi";

function ViewItemLocationMaster() {
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
    itemdesc3: "",
    itemdesc4: "",
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
    OrderNuberRange();
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
  // const fetchSupplier = async () => {
  //   try {
  //     const response = await axios_post(true, "vendor/list");
  //     setItemSupplier(response.data?.records);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  const fetchSupplier = async () => {
    try {
      // const response = await axios(true, "supplier/list");
      const response = await axios.post(`${constantApi.baseUrl}/vendor/list`);
      console.log("res vendor is -----------", response.data?.data?.records);
      setItemSupplier(response.data?.data?.records);
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
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const handleAutocompleteChange = async (event, newValue, type) => {
    if (type == "itmuom") {
      setAutocompleteuomValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        itmuom: newValue == null ? "" : newValue?.id,
      }));
    }

    if (type == "itemcatname") {
      setAutocompleteItemValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        itemcatname: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "colorname") {
      setautocompleteColorValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        colorname: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "sizename") {
      setautocompleteSizeValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        sizename: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "departname") {
      setautocompleteDepartValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        departname: newValue == null ? "" : newValue?.id,
      }));
      if (newValue?.id) {
        await fetchFamily(newValue.id);
      }
    }
    if (type == "familyname") {
      setautocompleteFamilyValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        familyname: newValue == null ? "" : newValue?.id,
      }));
      if (newValue?.id) {
        await fetchSubFamily(newValue.id);
      }
    }
    if (type == "subfamliy") {
      setautocompletedSubfamilyValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        subfamliy: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "brandname") {
      setautocompletedBrandValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        brandname: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "suppliername") {
      setautocompletedSupplierValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        suppliername: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "location_id") {
      setAutocompleteItemValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        location_id: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "company_id") {
      setAutocompleteItemValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        company_id: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "itmtax1code") {
      setautocompleteTax1Value(newValue);
      setFormData((prevData) => ({
        ...prevData,
        itmtax1code: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "itmtax2code") {
      setautocompleteTax2Value(newValue);
      setFormData((prevData) => ({
        ...prevData,
        itmtax2code: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type == "itmtax3code") {
      setautocompleteTax3Value(newValue);
      setFormData((prevData) => ({
        ...prevData,
        itmtax3code: newValue == null ? "" : newValue?.id,
      }));
    }
  };

  const OrderNuberRange = async () => {
    let params = {
      function_for: "item",
    };
    const response = await axios_post(
      true,
      "code_setting/get-next-comming-code",
      params,
    );
    if (response) {
      if (response.status) {
        setFormData((prevData) => ({
          ...prevData,
          code: response.data?.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const validation = (formData) => {
    let errors = {};
    if (!formData.createddt) errors.createddt = "Created Date is required";
    if (!formData.addedby) errors.addedby = "Added By is required";
    // if (!formData.code) {
    //   errors.code = "Code  is required";
    // }
    // if (!formData.tax) {
    //   errors.tax = "Tax  is required";
    // }
    if (!formData.itmuom) {
      errors.itmuom = "Unit of measurement is required";
    }

    if (!formData.stock) {
      errors.stock = "stock is required";
    }
    if (!formData.itmstkmgmt) {
      errors.itmstkmgmt = "Stock management is required";
    }
    if (!formData.itemlanprice) {
      errors.itemlanprice = "Landed cost is required";
    }
    if (!formData.itemprice) {
      errors.itemprice = "Price is required";
    }
    if (!formData.itmcostingmet) {
      errors.itmcostingmet = "Costing method is required";
    }
    if (!formData.brandname) {
      errors.brandname = "Brand is required";
    }
    if (!formData.subfamliy) {
      errors.subfamliy = "Sub family is required";
    }
    if (!formData.familyname) {
      errors.familyname = "Family is required";
    }
    if (!formData.departname) {
      errors.departname = "Department is required";
    }
    // if (!formData.sizename) {
    //   errors.sizename = "Size is required";
    // }
    if (!formData.colorname) {
      errors.colorname = "Color is required";
    }
    if (!formData.stylecode) {
      errors.stylecode = "Style codeis required";
    }
    if (!formData.itemref) {
      errors.itemref = "Item reference is required";
    }
    if (!formData.itemupc) {
      errors.itemupc = "UPC is required";
    }
    if (!formData.itemdesc4) {
      errors.itemdesc4 = "Description 4 is required";
    }
    if (!formData.itemdesc3) {
      errors.itemdesc3 = "Description 3 is required";
    }
    if (!formData.itemdesclong) {
      errors.itemdesclong = "Long description is required";
    }
    if (!formData.itemdesc) {
      errors.itemdesc = "Description is required";
    }
    if (!formData.itemcatname) {
      errors.itemcatname = "Item category is required";
    }
    if (!formData.itmtax1code) {
      errors.itmtax1code = "Tax 1 is required";
    }
    if (!formData.itmcostingmet) {
      errors.itmcostingmet = "Costing method is required";
    }
    if (!formData.status) {
      errors.status = "status  is required";
    }
    return errors;
  };

  const getUomNameById = (id) => uoms.find((u) => u.id === id)?.name || "";

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "item_location_master/details", {
        uuid: params.id,
      });

      console.log("params.id ", params.id);
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
          item_description: orderData?.item_description,
          itemdesc3: orderData?.itemdesc3,
          itemdesc4: orderData?.itemdesc4,
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
          suppliername: orderData?.suppliername,
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
          distributed_stock: orderData.distributed_stock,
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
  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);

    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      const response = await axios_post(true, "item/update", formData);
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          navigate("/itemlocationmaster");
        } else {
          ToastMassage(response.message, "error");
        }
      }
    }
  };

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
    navigate("/itemlocationmaster");
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
            <form onSubmit={handleSubmit} method="POST" action="#">
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
                        View Item Loc Mst
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/itemlocationmaster">
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
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Item Category
                        </label>
                        <div
                          className="border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-1  cursor-not-allowed select-none"
                          title={autocompleteItemValue?.itemcatname || ""}
                        >
                          {autocompleteItemValue?.itemcatname || "No selection"}
                        </div>
                        {formError.itemcatname && (
                          <p className="text-red-600 text-xs mt-2">
                            {formError.itemcatname}
                          </p>
                        )}
                      </div>

                      {/* Company */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="company_id"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Company
                        </label>
                        <select
                          id="company_id"
                          name="company_id"
                          disabled
                          value={formData.company_id}
                          onChange={handleChange}
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-500 cursor-not-allowed"
                        >
                          {compines?.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.compdesc}
                            </option>
                          ))}
                        </select>
                        {formError.company_id && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.company_id}
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="location_id"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <select
                          id="location_id"
                          name="location_id"
                          disabled
                          value={formData.location_id}
                          onChange={handleChange}
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md  text-gray-500 cursor-not-allowed"
                        >
                          {locations?.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.locname}
                            </option>
                          ))}
                        </select>
                        {formError.location_id && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.location_id}
                          </p>
                        )}
                      </div>

                      {/* Department */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="departname"
                        >
                          Department
                        </label>
                        <input
                          type="text"
                          id="departname"
                          name="departname"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={autocompletedepartValue?.itemdeptname || ""}
                          disabled={true}
                          readOnly
                        />
                        {formError.departname && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.departname}
                          </p>
                        )}
                      </div>

                      {/* Family */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="familyname"
                        >
                          Family
                        </label>
                        <input
                          type="text"
                          id="familyname"
                          name="familyname"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={autocompletedfamilyValue?.itemfamname || ""}
                          disabled={true}
                          readOnly
                        />
                        {formError.familyname && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.familyname}
                          </p>
                        )}
                      </div>

                      {/* Sub Family */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="subfamliy"
                        >
                          Sub Family
                        </label>
                        <input
                          type="text"
                          id="subfamliy"
                          name="subfamliy"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={
                            autocompletedSubfamilyValue?.itemsfamname || ""
                          }
                          disabled={true}
                          readOnly
                        />
                        {formError.subfamliy && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.subfamliy}
                          </p>
                        )}
                      </div>

                      {/* Container can be flex wrap or grid depending on your layout */}
                      {/* Description */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="itemdesc"
                        >
                          Item Name
                        </label>
                        <input
                          type="text"
                          id="itemdesc"
                          name="itemdesc"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={formData.itemdesc}
                          disabled={true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemdesc: e.target.value,
                            })
                          }
                        />
                        {formError.itemdesc && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemdesc}
                          </p>
                        )}
                      </div>

                      {selectedDepartmentId == 25 && note2ViewField}

                      {/* Long Description */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="itemdesclong"
                        >
                          {/* Long Description */}
                          {selectedDepartmentId == 25
                            ? "Author"
                            : "Long Description"}
                        </label>
                        <input
                          type="text"
                          id="itemdesclong"
                          name="itemdesclong"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm disabled:text-gray-500"
                          value={formData.itemdesclong}
                          disabled={true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemdesclong: e.target.value,
                            })
                          }
                        />
                        {formError.itemdesclong && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemdesclong}
                          </p>
                        )}
                      </div>

                      {/* Description 3 */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="itemdesc3"
                        >
                          {/* Description 3 */}
                          {selectedDepartmentId == 25
                            ? "Publisher"
                            : "Description 3"}
                        </label>
                        <input
                          type="text"
                          id="itemdesc3"
                          name="itemdesc3"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={formData.itemdesc3}
                          disabled={true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemdesc3: e.target.value,
                            })
                          }
                        />
                        {formError.itemdesc3 && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemdesc3}
                          </p>
                        )}
                      </div>

                      {selectedDepartmentId == 25 && date2ViewField}

                      {/* Description 4 */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="itemdesc4"
                        >
                          {/* Description 4 */}
                          {selectedDepartmentId == 25
                            ? "Language"
                            : "Description 4"}
                        </label>
                        <input
                          type="text"
                          id="itemdesc4"
                          name="itemdesc4"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={formData.itemdesc4}
                          disabled={true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemdesc4: e.target.value,
                            })
                          }
                        />
                        {formError.itemdesc4 && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemdesc4}
                          </p>
                        )}
                      </div>

                      {selectedDepartmentId == 25 && note1ViewField}
                      {selectedDepartmentId == 25 && note3ViewField}

                      {/* UPC */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="itemupc"
                        >
                          UPC
                        </label>
                        <input
                          type="number"
                          id="itemupc"
                          name="itemupc"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={formData.itemupc}
                          disabled={true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemupc: e.target.value,
                            })
                          }
                        />
                        {formError.itemupc && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemupc}
                          </p>
                        )}
                      </div>

                      {/* Item Reference */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="itemref"
                        >
                          Item Reference
                        </label>
                        <input
                          type="text"
                          id="itemref"
                          name="itemref"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={formData.itemref}
                          disabled={true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemref: e.target.value,
                            })
                          }
                        />
                        {formError.itemref && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemref}
                          </p>
                        )}
                      </div>

                      {/* Style Code */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="stylecode"
                        >
                          Style Code
                        </label>
                        <input
                          type="text"
                          id="stylecode"
                          name="stylecode"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={formData.stylecode}
                          disabled={true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stylecode: e.target.value,
                            })
                          }
                        />
                        {formError.stylecode && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.stylecode}
                          </p>
                        )}
                      </div>

                      {/* Color - replaced Autocomplete with disabled input showing selected value */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="colorname"
                        >
                          Color
                        </label>
                        <input
                          type="text"
                          id="colorname"
                          name="colorname"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={autocompletecolorValue?.itemcolname || ""}
                          disabled={true}
                          readOnly
                        />
                        {formError.colorname && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.colorname}
                          </p>
                        )}
                      </div>

                      {/* Size */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="sizename"
                        >
                          Size
                        </label>
                        <input
                          type="text"
                          id="sizename"
                          name="sizename"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={autocompletesizeValue?.itemsizename || ""}
                          disabled={true}
                          readOnly
                        />
                        {/* Optional error below if needed */}
                      </div>

                      {/* Brand */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="brandname"
                        >
                          Brand
                        </label>
                        <input
                          type="text"
                          id="brandname"
                          name="brandname"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={autocompletedBrandValue?.brandname || ""}
                          disabled={true}
                          readOnly
                        />
                        {formError.brandname && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.brandname}
                          </p>
                        )}
                      </div>

                      {/* HSN Code */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-700"
                          htmlFor="hsncode"
                        >
                          HSN Code
                        </label>
                        <input
                          type="text"
                          id="hsncode"
                          name="hsncode"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                          value={formData.hsncode}
                          disabled={true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hsncode: e.target.value,
                            })
                          }
                        />
                        {formError.hsncode && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.hsncode}
                          </p>
                        )}
                      </div>

                      {/* Total Stock */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="stock"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Total Stock
                        </label>
                        <input
                          type="text"
                          id="stock"
                          name="stock"
                          value={formData.stock}
                          disabled
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.stock && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.stock}
                          </p>
                        )}
                      </div>

                      {/* Trn Stock */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="distributed_stock"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Trn Stock
                        </label>
                        <input
                          type="text"
                          id="distributed_stock"
                          name="distributed_stock"
                          value={formData.distributed_stock}
                          disabled
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.distributed_stock && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.distributed_stock}
                          </p>
                        )}
                      </div>

                      {/* Avl Stock */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="remaining_stock"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Avl Stock
                        </label>
                        <input
                          type="text"
                          id="remaining_stock"
                          name="remaining_stock"
                          value={formData.remaining_stock}
                          disabled
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.remaining_stock && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.remaining_stock}
                          </p>
                        )}
                      </div>

                      {/* Cost */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itemcost"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Cost
                        </label>
                        <input
                          type="number"
                          id="itemcost"
                          name="itemcost"
                          value={formData.itemcost}
                          disabled
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemcost: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.itemcost && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemcost}
                          </p>
                        )}
                      </div>

                      {/* Landed Cost */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itemlanprice"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Landed Cost
                        </label>
                        <input
                          type="text"
                          id="itemlanprice"
                          name="itemlanprice"
                          value={formData.itemlanprice}
                          disabled
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.itemlanprice && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemlanprice}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itemprice"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          id="itemprice"
                          name="itemprice"
                          value={formData.itemprice}
                          disabled
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemprice: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.itemprice && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itemprice}
                          </p>
                        )}
                      </div>

                      {/* Min Stock Level */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="minstklvl"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Min Stock Level
                        </label>
                        <input
                          type="number"
                          id="minstklvl"
                          name="minstklvl"
                          value={formData.minstklvl}
                          disabled
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.minstklvl && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.minstklvl}
                          </p>
                        )}
                      </div>

                      {/* Max Stock Level */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="maxstklvl"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Max Stock Level
                        </label>
                        <input
                          type="number"
                          id="maxstklvl"
                          name="maxstklvl"
                          value={formData.maxstklvl}
                          disabled
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.maxstklvl && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.maxstklvl}
                          </p>
                        )}
                      </div>

                      {/* Stock Management (Autocomplete replaced by disabled input) */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itmstkmgmt"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Stock Management
                        </label>
                        <input
                          type="text"
                          id="itmstkmgmt"
                          name="itmstkmgmt"
                          value={formData.itmstkmgmt || ""}
                          disabled
                          readOnly
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  text-gray-500"
                        />
                        {formError.itmstkmgmt && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itmstkmgmt}
                          </p>
                        )}
                      </div>

                      {/* Unit of Measurement (Autocomplete replaced by disabled input) */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itmuom"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Unit of Measurement
                        </label>
                        <input
                          type="text"
                          id="itmuom"
                          name="itmuom"
                          value={autocompleteuomValue?.name || ""}
                          disabled
                          readOnly
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  text-gray-500"
                        />
                        {formError.itmuom && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itmuom}
                          </p>
                        )}
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
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
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
                          className="w-56 h-8 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Weight */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itmwweight"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Weight
                        </label>
                        <input
                          type="text"
                          id="itmwweight"
                          name="itmwweight"
                          value={formData.itmwweight}
                          disabled
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.itmwweight && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itmwweight}
                          </p>
                        )}
                      </div>

                      {/* Tax 1 (Autocomplete replaced by disabled input) */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itmtax1code"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Tax 1
                        </label>
                        <input
                          type="text"
                          id="itmtax1code"
                          name="itmtax1code"
                          value={
                            // autocompletedTax1Value
                            //   ? `${autocompletedTax1Value.taxpor1} - ${autocompletedTax1Value.taxpor1desc}`
                            //   : ""
                            autocompletedTax1Value
                              ? ` ${autocompletedTax1Value.taxpor1desc}`
                              : ""
                          }
                          disabled
                          readOnly
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  text-gray-500"
                        />
                        {formError.itmtax1code && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itmtax1code}
                          </p>
                        )}
                      </div>

                      {/* Costing Method */}
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
                        {formError.itmcostingmet && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itmcostingmet}
                          </p>
                        )}
                      </div>

                      {/* Supplier Name */}
                      {/* Supplier Name */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Supplier Name
                        </label>
                        <div
                          className="w-56 h-8 border border-gray-300 rounded-md bg-gray-100 text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={autocompletedSupplierValue?.firstname || ""}
                        >
                          {autocompletedSupplierValue?.firstname ||
                            "No selection"}
                        </div>
                      </div>

                      {/* Expiry Date */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itmexpiry"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Expiry
                        </label>
                        <input
                          type="date"
                          id="itmexpiry"
                          name="itmexpiry"
                          value={formData.itmexpiry}
                          onChange={handleChange}
                          disabled
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.itmexpiry && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itmexpiry}
                          </p>
                        )}
                      </div>
                      {/* Note1 */}
                      {selectedDepartmentId != 25 && note1ViewField}

                      {/* Note2 */}
                      {selectedDepartmentId != 25 && note2ViewField}
                      {selectedDepartmentId != 25 && note3ViewField}

                      {/* Note1 */}
                      {/* <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="note1"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Note1
                        </label>
                        <input
                          type="text"
                          id="note1"
                          name="note1"
                          value={formData.note1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              note1: e.target.value,
                            })
                          }
                          disabled
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.note1 && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.note1}
                          </p>
                        )}
                      </div> */}

                      {/* Date 1 */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itmdt1"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Date 1
                        </label>
                        <input
                          type="date"
                          id="itmdt1"
                          name="itmdt1"
                          value={formData.itmdt1}
                          onChange={handleChange}
                          disabled
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.itmdt1 && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itmdt1}
                          </p>
                        )}
                      </div>

                      {/* Date 2 */}
                      {/* <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="itmdt2"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Date 2
                        </label>
                        <input
                          type="date"
                          id="itmdt2"
                          name="itmdt2"
                          value={formData.itmdt2}
                          onChange={handleChange}
                          disabled
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.itmdt2 && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.itmdt2}
                          </p>
                        )}
                      </div> */}

                      {selectedDepartmentId != 25 && date2ViewField}

                      {/* Added By */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="addedby"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Added By
                        </label>
                        <input
                          type="text"
                          id="addedby"
                          name="addedby"
                          maxLength={40}
                          value={formData.addedby}
                          onChange={handleChange}
                          disabled
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.addedby && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.addedby}
                          </p>
                        )}
                      </div>

                      {/* Created Date */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="createddt"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Created Date
                        </label>
                        <input
                          type="text"
                          id="createddt"
                          name="createddt"
                          value={formData.createddt}
                          disabled
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm  disabled:text-gray-500"
                        />
                        {formError.createddt && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.createddt}
                          </p>
                        )}
                      </div>

                      {/* Status (Select) */}
                      {/* Status */}
                      <div className="w-full sm:w-1/4 px-2 pb-2">
                        <label
                          htmlFor="status"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <div
                          className="w-full h-[32px] border border-gray-300 rounded-md  text-gray-600 text-sm px-3 py-2 cursor-not-allowed select-none flex items-center"
                          title={
                            formData.status === "1"
                              ? "Active"
                              : formData.status === "0"
                                ? "Inactive"
                                : ""
                          }
                        >
                          {formData.status === "1"
                            ? "Active"
                            : formData.status === "0"
                              ? "Inactive"
                              : "No selection"}
                        </div>
                        {formError.status && (
                          <p className="text-red-600 text-xs mt-1">
                            {formError.status}
                          </p>
                        )}
                      </div>

                      {/* Image */}
                      <div className="w-full sm:w-1/4 px-2 pb-2 flex flex-col items-center">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Image
                        </label>
                        {formData.item_image ? (
                          <img
                            src={`${constantApi.imageUrl}/itemsImage/${formData.item_image}`}
                            alt={formData.itemdesc || "Item Image"}
                            className="w-48 h-48 object-contain border-2 border-gray-300 rounded-lg shadow-md p-1"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No image available
                          </span>
                        )}
                      </div>

                      {/* Item Description Details (ReactQuill) */}
                      <div className="w-full px-2 pb-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Item Description Details
                        </label>
                        <div className="border border-gray-300 rounded-md">
                          <ReactQuill
                            theme="snow"
                            value={formData.item_description}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                item_description: value,
                              }))
                            }
                            style={{
                              height: "200px",
                              width: "100%",
                              marginBottom: "100px",
                            }}
                          />
                        </div>
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

export default ViewItemLocationMaster;

{
  /* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note2</InputLabel>
                          <MDInput
                            type="varchar"
                            name="note2"
                            variant="outlined"
                            className="small-input"
                            value={formData.note2}
                            disabled={true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note2: e.target.value,
                              })
                            }
                          />
                          {formError.note2 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.note2}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note3</InputLabel>
                          <MDInput
                            type="varchar"
                            name="note3"
                            disabled={true}
                            variant="outlined"
                            className="small-input"
                            value={formData.note3}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note3: e.target.value,
                              })
                            }
                          />
                          {formError.note3 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.note3}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid> */
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                          />
                          {formError.itemcost && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itemcost}</MDTypography>}

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
                            onChange={handleChange}
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
                          <InputLabel sx={{ mb: 1 }}>Code</InputLabel>
                          <MDInput
                            type="text"
                            // label="Order Number"
                            variant="outlined"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
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
                            onChange={handleChange}
                          />
                          {formError.tax && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.tax}</MDTypography>}

                        </MDBox>
                      </Grid> */
}

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
