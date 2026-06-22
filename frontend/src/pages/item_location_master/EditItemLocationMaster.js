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
import axios from "axios";
import constantApi from "constantApi";

import { ToastMassage } from "../../toast";
import moment from "moment";

function EditItemLocationMaster() {
  const navigate = useNavigate();
  const params = useParams();
  const [formError, setFormError] = useState({});
  const [autocompleteuomValue, setAutocompleteuomValue] = useState("");
  const [autocompleteItmwpurunitValue, setAutocompleteItmwpurunitValue] =
    useState("");
  const [autocompleteItmwsalesunitValue, setAutocompleteItmwsalesunitValue] =
    useState("");
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
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [Tax1, setTax1] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  let user_data = JSON.parse(localStorage.getItem("user_data"));
  const [formData, setFormData] = useState({
    itemcatname: "",
    barcode: "",
    company_id: "",
    location_id: "",
    itemdesc: "",
    itemdesclong: "",
    item_description: "",
    stock: "",
    distributed_stock: "",
    remaining_stock: "",
    itemdesc3: "",
    itemdesc4: "",
    itemupc: "",
    itemref: "",
    stylecode: "",
    colorname: "",
    sizename: "",
    departname: "",
    familyname: "",
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
    fetchcompanyList();
    fetchCategories();
    fetchColors();
    fetchSize();
    fetchcompanyList();
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
    console.log("response form uom is --------", response.data);

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

    if (type === "itmwpurunit") {
      setAutocompleteItmwpurunitValue(newValue);

      setFormData((prev) => ({
        ...prev,
        itmwpurunit: newValue ? newValue.id : "", // ✅ AUTO SAVE
      }));
    }
    if (type === "itmwsalesunit") {
      setAutocompleteItmwsalesunitValue(newValue);

      setFormData((prev) => ({
        ...prev,
        itmwsalesunit: newValue ? newValue.id : "", // ✅ AUTO SAVE
      }));
    }

    if (type == "itemcatname") {
      setAutocompleteItemValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        itemcatname: newValue == null ? "" : newValue?.id,
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
      // ✅ UI controller
      setSelectedDepartment(newValue ? newValue.id : "");
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
      if (newValue && formError.brandname) {
        setFormError((prevError) => ({
          ...prevError,
          brandname: "",
        }));
      }
    }
    if (type == "suppliername") {
      setautocompletedSupplierValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        suppliername: newValue == null ? "" : newValue?.id,
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
    // if (!formData.addedby) errors.addedby = "Added By is required";
    // if (!formData.code) {
    //   errors.code = "Code  is required";
    // }
    // if (!formData.tax) {
    //   errors.tax = "Tax  is required";
    // }
    if (!formData.itmuom) {
      errors.itmuom = "Unit of measurement is required";
    }
    // if (!formData.stock) {
    //   errors.stock = "stock is required";
    // }
    // if (!formData.itmstkmgmt) {
    //   errors.itmstkmgmt = "Stock management is required";
    // }
    // if (!formData.itemlanprice) {
    //   errors.itemlanprice = "Landed cost is required";
    // }
    if (!formData.itemprice) {
      errors.itemprice = "Price is required";
    }
    // if (!formData.itmcostingmet) {
    //   errors.itmcostingmet = "Costing method is required";
    // }
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
    // if (!formData.stylecode) {
    //   errors.stylecode = "Style code is required";
    // }
    // if (!formData.itemref) {
    //   errors.itemref = "Item reference is required";
    // }
    if (!formData.itemupc) {
      errors.itemupc = "UPC is required";
    }
    // if (!formData.itemdesc4) {
    //   errors.itemdesc4 = "Description 4 is required";
    // }
    // if (!formData.itemdesc3) {
    //   errors.itemdesc3 = "Description 3 is required";
    // }
    // if (!formData.itemdesclong) {
    //   errors.itemdesclong = "Long description is required";
    // }
    if (!formData.itemdesc) {
      errors.itemdesc = "Description is required";
    }
    if (!formData.itemcatname) {
      errors.itemcatname = "Item category is required";
    }
    if (!formData.itmtax1code) {
      errors.itmtax1code = "Tax 1 is required";
    }
    // if (!formData.itmcostingmet) {
    //   errors.itmcostingmet = "Costing method is required";
    // }
    if (!formData.status) {
      errors.status = "status  is required";
    }
    return errors;
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "item_location_master/details", {
        uuid: params.id,
      });
      console.log("params.id ", params.id);
      console.log(" fetchOrderDetails --- item edit", response.data);
      if (response.status) {
        const orderData = response.data;
        setFormData({
          ...formData,
          sno: "",
          barcode: orderData?.barcode,
          item_image: orderData?.item_image,

          itemcatname: orderData?.itemcatname,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          colorname: orderData?.colorname,
          itemdesc: orderData?.itemdesc || orderData?.item_name,
          itemdesclong: orderData?.itemdesclong,
          itemdesc3: orderData?.itemdesc3,
          itemdesc4: orderData?.itemdesc4,
          item_description: orderData?.item_description,

          itemupc: orderData?.itemupc,
          itemref: orderData?.itemref,
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
          distributed_stock: orderData.distributed_stock,
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
        setSelectedDepartment(orderData.departname);

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
  }, []);

  useEffect(() => {
    if (uoms.length === 0) return;

    // Main UOM
    if (formData.itmuom) {
      const selectedUom = uoms.find((uom) => uom.id === formData.itmuom);
      setAutocompleteuomValue(selectedUom || null);
    } else {
      setAutocompleteuomValue(null);
    }

    // Purchase Unit
    if (formData.itmwpurunit) {
      const selectedPurUom = uoms.find(
        (uom) => uom.id === formData.itmwpurunit,
      );
      setAutocompleteItmwpurunitValue(selectedPurUom || null);
    } else {
      setAutocompleteItmwpurunitValue(null);
    }

    // Sales Unit
    if (formData.itmwsalesunit) {
      const selectedSalesUom = uoms.find(
        (uom) => uom.id === formData.itmwsalesunit,
      );
      setAutocompleteItmwsalesunitValue(selectedSalesUom || null);
    } else {
      setAutocompleteItmwsalesunitValue(null);
    }
  }, [uoms, formData.itmuom, formData.itmwpurunit, formData.itmwsalesunit]);

  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);

    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      console.log("from data is from edit items page ", formData);

      // const response = await axios_post(true, "item/update", formData);
      const form = new FormData();
      for (let key in formData) {
        form.append(key, formData[key]);
      }

      if (image) {
        form.append("item_image", image); // Make sure this key matches multer
      }

      const response = await axios.post(
        `${constantApi.baseUrl}/item_location_master/update`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

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

  const dateField = (
    <Grid item xs={12} sm={4}>
      <MDBox pb={2}>
        <InputLabel sx={{ mb: 1 }}>
          {selectedDepartment == 25 ? "Publication Date" : "Date 2"}
        </InputLabel>
        <MDInput
          type="date"
          name="itmdt2"
          value={formData.itmdt2}
          onChange={handleChange}
          className="small-input"
        />
        {formError.itmdt2 && (
          <MDTypography color="error" sx={{ fontSize: "14px", mt: "10px" }}>
            {formError.itmdt2}
          </MDTypography>
        )}
      </MDBox>
    </Grid>
  );

  const note2Field = (
    <Grid item xs={12} sm={4}>
      <MDBox pb={2}>
        <InputLabel sx={{ mb: 1 }}>
          {selectedDepartment == 25 ? "Short Description" : "Note2"}
        </InputLabel>
        <MDInput
          type="varchar"
          name="note2"
          value={formData.note2}
          onChange={(e) => setFormData({ ...formData, note2: e.target.value })}
          className="small-input"
        />
      </MDBox>
    </Grid>
  );

  const note1Field = (
    <Grid item xs={12} sm={4}>
      <MDBox pb={2}>
        <InputLabel sx={{ mb: 1 }}>
          {selectedDepartment == 25 ? "Pages" : "Note1"}
        </InputLabel>
        <MDInput
          type="varchar"
          name="note1"
          value={formData.note1}
          onChange={(e) => setFormData({ ...formData, note1: e.target.value })}
          className="small-input"
        />
      </MDBox>
    </Grid>
  );
  const note3Field = (
    <Grid item xs={12} sm={4}>
      <MDBox pb={2}>
        <InputLabel sx={{ mb: 1 }}>
          {selectedDepartment == 25 ? "Dimension" : "Note3"}
        </InputLabel>
        <MDInput
          type="varchar"
          name="note3"
          value={formData.note3}
          onChange={(e) => setFormData({ ...formData, note3: e.target.value })}
          className="small-input"
        />
      </MDBox>
    </Grid>
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
                        Edit Item Loc Mst
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
                      {/* <Grid item xs={12} sm={4}>
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
                      </Grid> */}

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Item Category</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            className="small-autocomplete"
                            options={itemCategories}
                            getOptionLabel={(option) =>
                              option.itemcatname || ""
                            }
                            renderOption={(props, option) => (
                              <li {...props}>{option?.itemcatname}</li>
                            )}
                            value={autocompleteItemValue}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "itemcatname",
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                          />
                          {formError.itemcatname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemcatname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Company </InputLabel>
                          <Select
                            name="company_id"
                            value={formData.company_id}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            // className="small-input"
                          >
                            {compines?.map((company) => (
                              <MenuItem key={company.id} value={company?.id}>
                                {company?.compdesc}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.company_id && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.company_id}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Location</InputLabel>
                          <Select
                            name="location_id"
                            value={formData.location_id}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            // className="small-input"
                          >
                            {locations?.map((location) => (
                              <MenuItem key={location.id} value={location?.id}>
                                {location?.locname}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.location_id && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.location_id}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Department</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            className="small-autocomplete"
                            options={itemdepat}
                            getOptionLabel={(option) =>
                              option.itemdeptname || ""
                            }
                            renderOption={(props, option) => (
                              <li {...props}>{option?.itemdeptname}</li>
                            )}
                            value={autocompletedepartValue}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "departname",
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                          />
                          {formError.departname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.departname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Family</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            className="small-autocomplete"
                            options={itemfamily}
                            getOptionLabel={(option) =>
                              option.itemfamname || ""
                            }
                            renderOption={(props, option) => (
                              <li {...props}>{option?.itemfamname}</li>
                            )}
                            value={autocompletedfamilyValue}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "familyname",
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                          />
                          {formError.familyname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.familyname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Sub Family</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            className="small-autocomplete"
                            options={itemSubfamily}
                            getOptionLabel={(option) =>
                              option.itemsfamname || ""
                            }
                            renderOption={(props, option) => (
                              <li {...props}>{option?.itemsfamname}</li>
                            )}
                            value={autocompletedSubfamilyValue}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "subfamliy",
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                          />
                          {formError.subfamliy && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.subfamliy}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Item Name </InputLabel>
                          <MDInput
                            type="varchar"
                            name="itemdesc"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemdesc}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemdesc: e.target.value,
                              })
                            }
                          />
                          {formError.itemdesc && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemdesc}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      {selectedDepartment == 25 && note2Field}
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            {/* Long Description */}
                            {selectedDepartment == 25
                              ? "Author"
                              : "Long Description"}
                          </InputLabel>
                          <MDInput
                            type="varchar"
                            name="itemdesclong"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemdesclong}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemdesclong: e.target.value,
                              })
                            }
                          />
                          {formError.itemdesclong && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemdesclong}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            {/* Description 3 */}
                            {selectedDepartment == 25
                              ? "Publisher"
                              : "Description 3"}
                          </InputLabel>
                          <MDInput
                            type="varchar"
                            name="itemdesc3"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemdesc3}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemdesc3: e.target.value,
                              })
                            }
                          />
                          {formError.itemdesc3 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemdesc3}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      {selectedDepartment == 25 && dateField}
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            {/* Description 4 */}
                            {selectedDepartment == 25
                              ? "Language"
                              : "Description 4"}
                          </InputLabel>
                          <MDInput
                            type="varchar"
                            name="itemdesc4 4"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemdesc4}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemdesc4: e.target.value,
                              })
                            }
                          />
                          {formError.itemdesc4 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemdesc4}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      {selectedDepartment == 25 && note1Field}
                      {selectedDepartment == 25 && note3Field}

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>UPC</InputLabel>
                          <MDInput
                            type="number"
                            name="itemupc"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemupc}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemupc: e.target.value,
                              })
                            }
                          />
                          {formError.itemupc && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemupc}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Item Reference</InputLabel>
                          <MDInput
                            type="varchar"
                            name="itemref"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemref}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemref: e.target.value,
                              })
                            }
                          />
                          {formError.itemref && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemref}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Style Code</InputLabel>
                          <MDInput
                            type="varchar"
                            name="stylecode"
                            variant="outlined"
                            className="small-input"
                            value={formData.stylecode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                stylecode: e.target.value,
                              })
                            }
                          />
                          {formError.stylecode && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.stylecode}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Color</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            className="small-autocomplete"
                            options={itemcolor}
                            getOptionLabel={(option) =>
                              option.itemcolname || ""
                            }
                            renderOption={(props, option) => (
                              <li {...props}>{option?.itemcolname}</li>
                            )}
                            value={autocompletecolorValue}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "colorname",
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                          />
                          {formError.colorname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.colorname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Size</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            className="small-autocomplete"
                            options={itemsize}
                            getOptionLabel={(option) =>
                              option.itemsizename || ""
                            }
                            renderOption={(props, option) => (
                              <li {...props}>{option?.itemsizename}</li>
                            )}
                            value={autocompletesizeValue}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "sizename",
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                          />
                          {/* {formError.sizename && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.sizename}</MDTypography>} */}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Brand </InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            className="small-autocomplete"
                            options={itemBrand}
                            getOptionLabel={(option) => option.brandname || ""}
                            renderOption={(props, option) => (
                              <li {...props}>{option?.brandname}</li>
                            )}
                            value={autocompletedBrandValue}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "brandname",
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                          />
                          {formError.brandname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.brandname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>HSN Code</InputLabel>
                          <MDInput
                            type="varchar"
                            name="hsncode"
                            variant="outlined"
                            className="small-input"
                            value={formData.hsncode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                hsncode: e.target.value,
                              })
                            }
                          />
                          {formError.hsncode && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.hsncode}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      {/*<Grid item xs={12} sm={4}>
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
                      </Grid> */}
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Total Stock</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            className="small-input"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            // disabled={true}
                          />
                          {formError.stock && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.stock}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Trn Stock</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            className="small-input"
                            name="distributed_stock"
                            value={formData.distributed_stock}
                            onChange={handleChange}
                            // disabled={true}
                          />
                          {formError.distributed_stock && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.distributed_stock}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Avl Stock</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            className="small-input"
                            name="remaining_stock"
                            value={formData.remaining_stock}
                            onChange={handleChange}
                            // disabled={true}
                          />
                          {formError.remaining_stock && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.remaining_stock}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Cost</InputLabel>
                          <MDInput
                            type="number"
                            name="itemcost"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemcost}
                            // disabled={true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemcost: e.target.value,
                              })
                            }
                          />
                          {formError.itemcost && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemcost}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Landed Cost</InputLabel>
                          <MDInput
                            type="numeric"
                            variant="outlined"
                            className="small-input"
                            name="itemlanprice"
                            value={formData.itemlanprice}
                            // disabled={true}
                            onChange={handleChange}
                          />
                          {formError.itemlanprice && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemlanprice}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Price</InputLabel>
                          <MDInput
                            type="number"
                            name="itemprice"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemprice}
                            // disabled={true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemprice: e.target.value,
                              })
                            }
                          />
                          {formError.itemprice && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemprice}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Min Stock Level
                          </InputLabel>
                          <MDInput
                            type="Int"
                            variant="outlined"
                            className="small-input"
                            name="minstklvl"
                            value={formData.minstklvl}
                            onChange={handleChange}
                          />
                          {formError.minstklvl && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.minstklvl}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Max stock level
                          </InputLabel>
                          <MDInput
                            type="Int"
                            variant="outlined"
                            className="small-input"
                            name="maxstklvl"
                            value={formData.maxstklvl}
                            onChange={handleChange}
                          />
                          {formError.maxstklvl && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.maxstklvl}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Stock Management
                          </InputLabel>
                          <Autocomplete
                            options={["Managed", " Not Managed"]}
                            value={formData.itmstkmgmt}
                            onChange={(event, newValue) =>
                              setFormData({ ...formData, itmstkmgmt: newValue })
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                            // sx={{ width: 300 }}
                            className="small-autocomplete"
                          />
                          {/* {formError.itmstkmgmt && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmstkmgmt}
                            </MDTypography>
                          )} */}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }}>
                          Unit of Measurement{" "}
                        </InputLabel>
                        <Autocomplete
                          disablePortal
                          id="uom-combo-box"
                          options={uoms}
                          value={autocompleteuomValue}
                          getOptionLabel={(option) => option?.uomname || ""}
                          isOptionEqualToValue={(option, value) =>
                            Number(option.id) === Number(value.id)
                          }
                          renderOption={(props, option) => (
                            <li {...props}>{option?.uomname}</li>
                          )}
                          onChange={(event, newValue) =>
                            handleAutocompleteChange(event, newValue, "itmuom")
                          }
                          className="small-autocomplete"
                          renderInput={(params) => (
                            <TextField {...params} className="small-input" />
                          )}
                        />

                        {formError.itmuom && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formError.itmuom}
                          </MDTypography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }}>Purchase Unit </InputLabel>

                        <Autocomplete
                          disablePortal
                          id="uom-combo-box"
                          options={uoms}
                          value={autocompleteItmwpurunitValue}
                          getOptionLabel={(option) => option?.uomname || ""}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onChange={(event, newValue) =>
                            handleAutocompleteChange(
                              event,
                              newValue,
                              "itmwpurunit",
                            )
                          }
                          className="small-autocomplete"
                          renderInput={(params) => (
                            <TextField {...params} className="small-input" />
                          )}
                        />

                        {formError.itmwpurunit && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formError.itmwpurunit}
                          </MDTypography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }}>Sales Unit </InputLabel>

                        <Autocomplete
                          disablePortal
                          id="uom-combo-box"
                          options={uoms}
                          value={autocompleteItmwsalesunitValue}
                          getOptionLabel={(option) => option?.uomname || ""}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onChange={(event, newValue) =>
                            handleAutocompleteChange(
                              event,
                              newValue,
                              "itmwsalesunit",
                            )
                          }
                          className="small-autocomplete"
                          renderInput={(params) => (
                            <TextField {...params} className="small-input" />
                          )}
                        />

                        {formError.itmwsalesunit && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formError.itmwsalesunit}
                          </MDTypography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Weight</InputLabel>
                          <MDInput
                            // type="numeric"
                            type="number"
                            variant="outlined"
                            className="small-input"
                            step="0.0001"
                            name="itmwweight"
                            value={formData.itmwweight}
                            onChange={handleChange}
                          />
                          {formError.itmwweight && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmwweight}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax 1</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            options={Tax1}
                            // getOptionLabel={(option) => option?.taxpor1 || ""}
                            getOptionLabel={(option) =>
                              // option
                              //   ? `${option.taxpor1} - ${option.taxpor1desc}`
                              //   : ""
                              option ? `${option.taxpor1desc}` : ""
                            }
                            renderOption={(props, option) => (
                              <li {...props}>
                                {option?.taxpor1} - {option?.taxpor1desc}
                              </li>
                            )}
                            value={autocompletedTax1Value}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "itmtax1code",
                              )
                            }
                            className="small-autocomplete"
                            renderInput={(params) => (
                              <TextField {...params} className="small-input" />
                            )}
                          />
                          {formError.itmtax1code && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmtax1code}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax 2</InputLabel>
                          <Autocomplete
                            disablePortal
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
                      </Grid> */}
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Costing method</InputLabel>
                          <Autocomplete
                            options={[
                              "FIFO - First in first out",
                              // "LIFO - last in first out",
                              // "Standard - standard",
                              // "Average - average",
                              " ",
                            ]}
                            // value={formData.itmcostingmet}
                            value={
                              formData.itmcostingmet === "0.00"
                                ? "FIFO - First in first out"
                                : null
                            }
                            onChange={(event, newValue) =>
                              setFormData({
                                ...formData,
                                itmcostingmet: newValue,
                              })
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                            // sx={{ width: 300 }}
                            className="small-autocomplete"
                          />
                          {formError.itmcostingmet && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmcostingmet}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Supplier Name</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="uom-combo-box"
                            className="small-autocomplete"
                            options={itemSupplier}
                            getOptionLabel={(option) => option.firstname || ""}
                            renderOption={(props, option) => (
                              <li {...props}>{option?.firstname}</li>
                            )}
                            value={autocompletedSupplierValue}
                            onChange={(event, newValue) =>
                              handleAutocompleteChange(
                                event,
                                newValue,
                                "suppliername",
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                className="small-input"
                              />
                            )}
                          />
                          {formError.suppliername && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.suppliername}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Expiry</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmexpiry"
                            onChange={handleChange}
                            value={formData.itmexpiry}
                            className="small-input"
                            // disabled
                          />
                          {formError.itmexpiry && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmexpiry}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note1</InputLabel>
                          <MDInput
                            type="varchar"
                            name="note1"
                            variant="outlined"
                            className="small-input"
                            value={formData.note1}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note1: e.target.value,
                              })
                            }
                          />
                          {formError.note1 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.note1}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note2</InputLabel>
                          <MDInput
                            type="varchar"
                            name="note2"
                            variant="outlined"
                            className="small-input"
                            value={formData.note2}
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
                      */}
                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note3</InputLabel>
                          <MDInput
                            type="varchar"
                            name="note3"
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
                      </Grid> */}

                      {selectedDepartment != 25 && note1Field}

                      {selectedDepartment != 25 && note2Field}
                      {selectedDepartment != 25 && note3Field}
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 1</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmdt1"
                            value={formData.itmdt1}
                            onChange={handleChange}
                            className="small-input"
                            // disabled
                          />
                          {formError.itmdt1 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmdt1}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      {selectedDepartment != 25 && dateField}

                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 2</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmdt2"
                            value={formData.itmdt2}
                            onChange={handleChange}
                            className="small-input"
                            // disabled
                          />
                          {formError.itmdt2 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmdt2}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid> */}

                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Upload Image</InputLabel>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            required
                            style={{ width: "100%" }}
                          />
                        </MDBox>
                      </Grid> */}

                      {/* <Grid item xs={12} sm={4}>
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
                      </Grid> */}
                      {/* <Grid item xs={12} sm={4}>
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
                      </Grid> */}
                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Part No.</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            className="small-input"
                            name="partNumber"
                            value={formData.partNumber}
                            onChange={handleChange}
                          />
                          {formError.partNumber && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.partNumber}</MDTypography>}
                        </MDBox>
                      </Grid> */}
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Added By</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="addedby"
                            value={formData.addedby}
                            onChange={(e) => handleChange(e)}
                            className="small-input"
                            inputProps={{ maxLength: 40 }}
                            disabled
                          />
                          {formError.addedby && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.addedby}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Created Date</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="createddt"
                            value={formData.createddt}
                            className="small-input"
                            disabled
                          />
                          {formError.createddt && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.createddt}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                          <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                          >
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>
                          </Select>
                          {formError.status && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.status}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      {/* <Grid item xs={12} sm={4}>
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
                      </Grid> */}

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Image</InputLabel>
                          {formData.item_image ? (
                            <img
                              src={`${constantApi.imageUrl}/itemsImage/${formData.item_image}`}
                              alt={formData.itemdesc || "Item Image"}
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "contain",
                                border: "2px solid #ccc", // adds border
                                borderRadius: "8px", // rounded corners
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // adds shadow
                                padding: "4px", // optional padding inside border
                              }}
                            />
                          ) : (
                            <span>No image available</span>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Edit Image</InputLabel>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            // ✅ Remove "required" so it's optional
                            style={{ width: "100%" }}
                          />
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Item Description Detail
                          </InputLabel>

                          <ReactQuill
                            theme="snow"
                            value={formData.item_description}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                item_description: value,
                              }))
                            }
                            style={{ height: "200px", width: "100%" }}
                          />
                        </MDBox>
                      </Grid>

                      {/* <Grid item xs={12}> */}
                      <Grid
                        container
                        spacing={2}
                        justifyContent="right"
                        sx={{ mt: 4, mb: 2 }}
                      >
                        <Grid item xs={2} ml={3}>
                          <MDBox sx={{ display: "flex" }}>
                            <MDButton
                              variant="gradient"
                              disabled={isSubmit}
                              color="info"
                              type="submit"
                              fullWidth
                            >
                              {isSubmit ? (
                                <CircularProgress
                                  color="white"
                                  size={24}
                                  sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                  }}
                                />
                              ) : (
                                "Save"
                              )}
                            </MDButton>
                            <MDButton
                              variant="gradient"
                              disabled={isSubmit}
                              color="secondary"
                              type="submit"
                              fullWidth
                              sx={{ marginLeft: "15px" }}
                              onClick={handleBack}
                            >
                              cancel
                            </MDButton>
                          </MDBox>
                          <MDBox></MDBox>
                        </Grid>
                      </Grid>
                      {/* </Grid> */}
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

export default EditItemLocationMaster;
