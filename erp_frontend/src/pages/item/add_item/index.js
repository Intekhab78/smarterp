import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import * as XLSX from "xlsx";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Swal from "sweetalert2";

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
import { axios_get, axios_post, axios_post_image } from "../../../axios";
import { ToastMassage } from "../../../toast";
import axios from "axios";
import constantApi from "constantApi";

function Add_Item() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [autocompleteuomValue, setAutocompleteuomValue] = useState(null);
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
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [itemsize, setItemSize] = useState([]);
  const [itemdepat, setItemDepart] = useState([]);
  const [itemfamily, setItemFamliy] = useState([]);
  const [itemSubfamily, setItemSubFamliy] = useState([]);
  const [itemBrand, setItemBrand] = useState([]);
  const [itemSupplier, setItemSupplier] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [Tax1, setTax1] = useState([]);
  let user_data = JSON.parse(localStorage.getItem("user_data"));
  const [image, setImage] = useState(null); // Store image file

  const [formData, setFormData] = useState({
    organisation_id: 1,
    itemcatname: "",
    barcode: "",
    itemdesc: "",
    itemdesclong: "",
    itemdesc3: "",
    itemdesc4: "",
    itemupc: "",
    stock: "",
    itemref: "",
    stylecode: "",
    batch_no: 0,
    colorname: "",
    sizename: "",
    departname: "",
    familyname: "",
    subfamliy: "",
    brandname: "",
    company_id: "",
    location_id: "",
    hsncode: "",
    itemcost: "",
    itemprice: 0,
    itemlanprice: 0,
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
    company_id: "",
    location_id: "",
    note2: "",
    note3: "",
    itmdt1: "",
    itmdt2: "",
    status: "1",
    addedby: `${user_data.firstname} ${user_data.lastname}`,

    createddt: new Date().toLocaleString(),
  });
  const [images, setImages] = useState({
    main_image: null,
    left_image: null,
    right_image: null,
    front_image: null,
    back_image: null,
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
    fetchcompanyList();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await axios_get(true, "item_category/dropdown-list");
      setItemCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
  const fetchSubFamily = async (familyId) => {
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
      // const response = await axios_post(true, "supplier/list");
      const response = await axios_post(true, "vendor/list");
      console.log("respsne data -------------", response.data?.records);

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
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response) {
      if (response?.status) {
        const mainCompanies = response.data.filter(
          (company) => company.is_main_comp === "yes",
        );
        setCompines(mainCompanies);
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
    // if (type == "itemcatname") {
    //   setAutocompleteItemValue(newValue);
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     itemcatname: newValue == null ? "" : newValue?.id,
    //   }));
    // }
    // if (type == "itemcatname") {
    //   setAutocompleteItemValue(newValue);
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     itemcatname: newValue == null ? "" : newValue?.id,
    //   }));
    // }
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
      setSelectedDepartment(newValue ? newValue.id : "");
      // ✅ LOG selected department
      if (newValue) {
        console.log("Department ID:", newValue.id);
        console.log("Department Name:", newValue.itemdeptname);
      }
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

    if (type === "itmwpurunit") {
      setFormData((prev) => ({
        ...prev,
        itmwpurunit: newValue, // 👈 store object
        itmwpurunit_id: newValue ? newValue.id : "",
      }));
    }

    if (type === "itmwsalesunit") {
      setFormData((prev) => ({
        ...prev,
        itmwsalesunit: newValue, // 👈 store object
        itmwsalesunit_id: newValue ? newValue.id : "",
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
    // if (!formData.itmstkmgmt) {
    //   errors.itmstkmgmt = "Stock management is required";
    // }
    // if (!formData.itemlanprice) {
    //   errors.itemlanprice = "Landed cost is required";
    // }
    // if (!formData.itemprice) {
    //   errors.itemprice = "Price is required";
    // }
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
    if (!formData.sizename) {
      errors.sizename = "Size is required";
    }
    if (!formData.colorname) {
      errors.colorname = "Color is required";
    }
    // if (!formData.stylecode) {
    //   errors.stylecode = "Style code is required";
    // }
    // if (!formData.batch_no) {
    //   errors.batch_no = "batch_no is required";
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
    // if (!formData.itmtax2code) {
    //   errors.itmtax2code = "Tax 2 is required";
    // }
    // if (!formData.itmtax3code) {
    //   errors.itmtax3code = "Tax 3 is required";
    // }
    if (!formData.suppliername) {
      errors.suppliername = "Supplier is required";
    }

    if (!formData.company_id) errors.company_id = "Company id is required";
    if (!formData.location_id) errors.location_id = "Location id is required";
    // if (!formData.itmcostingmet) {
    //   errors.itmcostingmet = "Costing method is required";
    // }
    // if (!formData.stock) {
    //   errors.stock = "stock is required";
    // }

    if (!formData.status) {
      errors.status = "status  is required";
    }

    return errors;
  };

  const handleImageChange = (e) => {
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setisSubmit(false);
    console.log("FormData before submit:", formData);
    console.log("Validation errors:", validation(formData));

    let errors = validation(formData);
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
      return;
    }

    setFormError({});

    // Prepare FormData
    const form = new FormData();
    for (let key in formData) {
      let value = formData[key];

      // Convert string "null" to actual null
      if (value === "null") {
        value = null;
      }

      // Optional tax fields: already converting empty string
      if ((key === "itmtax2code" || key === "itmtax3code") && !value) {
        value = null;
      }

      form.append(key, value);
    }

    if (image) {
      form.append("item_image", image);
    }

    console.log("hanlde submit in items ", form);

    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/item/store`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status) {
        setisSubmit(false);
        ToastMassage(response.data.message, "success");
        navigate("/item");
      } else {
        setisSubmit(false);
        ToastMassage(response.data.message, "error");
      }
    } catch (err) {
      setisSubmit(false);

      // ✅ Show backend error instead of generic message
      if (err.response && err.response.data) {
        ToastMassage(err.response.data.message, "error");
      } else {
        ToastMassage("Something went wrong!", "error");
      }

      console.error(err);
    }
  };

  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log("Parsed Excel Data:", jsonData); // ✅ Debug
      setExcelData(jsonData); // ✅ Must set this
    };

    reader.readAsArrayBuffer(file); // ✅ Must use ArrayBuffer for .xlsx
  };

  const handleBulkSubmit = async () => {
    if (excelData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No File Uploaded",
        text: "Please upload a valid Excel file first!",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/item/store-bulk`,
        excelData,
        { headers: { "Content-Type": "application/json" } },
      );

      const { status, inserted, skipped, downloadUrl, message } = response.data;

      if (status) {
        if (skipped > 0 && downloadUrl) {
          ToastMassage(
            `Uploaded with ${inserted} inserted and ${skipped} skipped items.`,
            "warning",
          );

          // ✅ SweetAlert popup for skipped items
          Swal.fire({
            title: "Skipped Items Found!",
            text: `Total ${skipped} items were skipped. Would you like to download the skipped file?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, download it!",
            cancelButtonText: "No, skip it",
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(`${constantApi.imageUrl}${downloadUrl}`, "_blank");
              Swal.fire({
                icon: "success",
                title: "Download Started!",
                text: "Your skipped items file is being downloaded.",
                timer: 2000,
                showConfirmButton: false,
              });
              // ✅ Navigate to /item after download
              setTimeout(() => {
                // window.location.href = "/item";
                navigate("/item");
              }, 2000);
            }
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Upload Successful!",
            text: "All items uploaded successfully 🎉",
            timer: 2000,
            showConfirmButton: false,
          });

          setTimeout(() => {
            // window.location.href = "/item";
            navigate("/item");
          }, 2000);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed!",
          text: message || "Something went wrong during upload.",
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "Upload failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit1 = async () => {
    if (excelData.length === 0) {
      alert("Please upload a valid Excel file first.");
      return;
    }
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/item/store-bulk`,
        excelData,
        { headers: { "Content-Type": "application/json" } },
      );

      // ✅ FIX: use "status" instead of "success"
      if (response.data.status && response.data.inserted > 0) {
        ToastMassage("Bulk items uploaded successfully", "success");
      } else if (response.data.status && response.data.inserted === 0) {
        const skippedNames = response.data.skippedItems
          .map((item) => `${item.item_name}: ${item.reason}`)
          .join(", ");

        ToastMassage(
          `All items were skipped. Nothing was uploaded. Reason(s): ${skippedNames}`,
          "warning",
        );
      } else {
        ToastMassage("Some error occurred during upload", "error");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      ToastMassage("Upload failed", "error");
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
    navigate("/item");
  };

  const [isChecked, setIsChecked] = useState(true);

  const dateField = (
    <Grid item xs={12} sm={4}>
      <MDBox pb={2}>
        <InputLabel sx={{ mb: 1 }}>
          {selectedDepartment == 25 ? "Publication Date" : "Date 2"}
        </InputLabel>

        <MDInput
          type="date"
          variant="outlined"
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
          <MDTypography color="error" sx={{ fontSize: "14px", mt: "10px" }}>
            {formError.note2}
          </MDTypography>
        )}
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
          <MDTypography color="error" sx={{ fontSize: "14px", mt: "10px" }}>
            {formError.note2}
          </MDTypography>
        )}
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
          <MDTypography color="error" sx={{ fontSize: "14px", mt: "10px" }}>
            {formError.note1}
          </MDTypography>
        )}
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
                        Add Item
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

                {loading && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <p className="text-lg font-medium text-gray-700">
                        Uploading, please wait...
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  {/* Toggle Checkbox */}
                  <label className="flex items-center text-sm text-gray-700 mb-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mr-2"
                    />
                    Upload Bulk Items
                  </label>

                  {/* Conditional Content */}
                  {isChecked ? (
                    <div className="bg-white p-4 shadow rounded">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Upload File
                      </h3>
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="text-sm text-gray-600"
                      />
                      <button
                        onClick={handleBulkSubmit}
                        className="mt-3 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 me-4"
                      >
                        Upload Bulk Items
                      </button>
                      <a
                        href="/bulkstore.xlsx"
                        download="bulkstore.xlsx"
                        className="mt-3 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 inline-block ms-8"
                      >
                        Sample Data
                      </a>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      {" "}
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
                                <InputLabel sx={{ mb: 1 }}>
                                  Item Type
                                </InputLabel>
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
                                <InputLabel sx={{ mb: 1 }}>Company</InputLabel>
                                <Select
                                  name="company_id"
                                  value={formData.company_id}
                                  onChange={handleChange}
                                  sx={{ width: 250, height: 45 }}
                                >
                                  {compines?.map((company) => (
                                    <MenuItem
                                      key={company.id}
                                      value={company.id}
                                    >
                                      {company.compdesc}
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
                                  disabled={!formData.company_id}
                                >
                                  {locations?.map((location) => (
                                    <MenuItem
                                      key={location.id}
                                      value={location.id}
                                    >
                                      {location.locname}
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
                                <InputLabel sx={{ mb: 1 }}>
                                  Department
                                </InputLabel>
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
                                <InputLabel sx={{ mb: 1 }}>
                                  Sub Family
                                </InputLabel>
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
                                <InputLabel sx={{ mb: 1 }}>
                                  Item Name{" "}
                                </InputLabel>
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
                                {/* <InputLabel sx={{ mb: 1 }}>
                                  Long Description
                                </InputLabel> */}
                                <InputLabel sx={{ mb: 1 }}>
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
                                {/* <InputLabel sx={{ mb: 1 }}>
                                  Description 3
                                </InputLabel> */}
                                <InputLabel sx={{ mb: 1 }}>
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
                                {/* <InputLabel sx={{ mb: 1 }}>
                                  Description 4
                                </InputLabel> */}
                                <InputLabel sx={{ mb: 1 }}>
                                  {selectedDepartment == 25
                                    ? "Language"
                                    : "Description 4"}
                                </InputLabel>
                                <MDInput
                                  type="varchar"
                                  name="itemdesc4"
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
                                <InputLabel sx={{ mb: 1 }}>
                                  Item Reference
                                </InputLabel>
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

                            {/* <Grid item xs={12} sm={4}>
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>Batch No</InputLabel>
                                <MDInput
                                  type="varchar"
                                  name="batch_no"
                                  variant="outlined"
                                  className="small-input"
                                  value={formData.batch_no}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      batch_no: e.target.value,
                                    })
                                  }
                                />
                                {formError.batch_no && (
                                  <MDTypography
                                    color="error"
                                    sx={{ fontSize: "14px", mt: "10px" }}
                                  >
                                    {formError.batch_no}
                                  </MDTypography>
                                )}
                              </MDBox>
                            </Grid> */}

                            <Grid item xs={12} sm={4}>
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>
                                  Style Code
                                </InputLabel>
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
                                {formError.sizename && (
                                  <MDTypography
                                    color="error"
                                    sx={{ fontSize: "14px", mt: "10px" }}
                                  >
                                    {formError.sizename}
                                  </MDTypography>
                                )}
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
                                  getOptionLabel={(option) =>
                                    option.brandname || ""
                                  }
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
                            {/* <Grid item xs={12} sm={4}>
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>Stock</InputLabel>
                                <MDInput
                                  type="text"
                                  variant="outlined"
                                  className="small-input"
                                  name="stock"
                                  value={formData.stock}
                                  onChange={handleChange}
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
                            </Grid> */}
                            {/*                             
                            <Grid item xs={12} sm={4}>
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>
                                  Purchase Cost
                                </InputLabel>
                                <MDInput
                                  type="number"
                                  name="itemprice"
                                  variant="outlined"
                                  className="small-input"
                                  value={formData.itemprice}
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
                            </Grid> */}
                            {/* <Grid item xs={12} sm={4}>
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>
                                  Landed Cost
                                </InputLabel>
                                <MDInput
                                  type="numeric"
                                  variant="outlined"
                                  className="small-input"
                                  name="itemlanprice"
                                  value={formData.itemlanprice}
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
                            </Grid> */}

                            <Grid item xs={12} sm={4}>
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>
                                  Item Cost
                                </InputLabel>
                                <MDInput
                                  type="number"
                                  name="itemcost"
                                  variant="outlined"
                                  className="small-input"
                                  value={formData.itemcost}
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
                                    setFormData({
                                      ...formData,
                                      itmstkmgmt: newValue,
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
                                {formError.itmstkmgmt && (
                                  <MDTypography
                                    color="error"
                                    sx={{ fontSize: "14px", mt: "10px" }}
                                  >
                                    {formError.itmstkmgmt}
                                  </MDTypography>
                                )}
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
                                getOptionLabel={(option) => option.name || ""}
                                renderOption={(props, option) => (
                                  <li {...props}>{option?.name}</li>
                                )}
                                value={autocompleteuomValue}
                                onChange={(event, newValue) =>
                                  handleAutocompleteChange(
                                    event,
                                    newValue,
                                    "itmuom",
                                  )
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value?.id
                                }
                                className="small-autocomplete"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="small-input"
                                  />
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
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>Weight</InputLabel>
                                <MDInput
                                  type="numeric"
                                  variant="outlined"
                                  step="0.0001"
                                  className="small-input"
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
                              <InputLabel sx={{ mb: 1 }}>
                                Purchase Unit
                              </InputLabel>
                              <Autocomplete
                                disablePortal
                                id="purchase-unit-combo-box"
                                options={uoms}
                                getOptionLabel={(option) => option.name || ""}
                                renderOption={(props, option) => (
                                  <li {...props}>{option?.name}</li>
                                )}
                                value={formData.itmwpurunit || null}
                                onChange={(event, newValue) =>
                                  handleAutocompleteChange(
                                    event,
                                    newValue,
                                    "itmwpurunit",
                                  )
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value?.id
                                }
                                className="small-autocomplete"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="small-input"
                                  />
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

                            {/* Sales Unit */}
                            <Grid item xs={12} sm={4}>
                              <InputLabel sx={{ mb: 1 }}>Sales Unit</InputLabel>
                              <Autocomplete
                                disablePortal
                                id="sales-unit-combo-box"
                                options={uoms}
                                getOptionLabel={(option) => option.name || ""}
                                renderOption={(props, option) => (
                                  <li {...props}>{option?.name}</li>
                                )}
                                value={formData.itmwsalesunit || null}
                                onChange={(event, newValue) =>
                                  handleAutocompleteChange(
                                    event,
                                    newValue,
                                    "itmwsalesunit",
                                  )
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value?.id
                                }
                                className="small-autocomplete"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="small-input"
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>Tax 1</InputLabel>
                                <Autocomplete
                                  disablePortal
                                  id="uom-combo-box"
                                  options={Tax1}
                                  getOptionLabel={(option) =>
                                    option?.taxpor1 || ""
                                  }
                                  renderOption={(props, option) => (
                                    // <li {...props}>
                                    //   {option?.taxpor1} - {option?.taxpor1desc}
                                    // </li>
                                    <li {...props}>{option?.taxpor1desc}</li>
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
                                    <TextField
                                      {...params}
                                      className="small-input"
                                    />
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
                                  getOptionLabel={(option) =>
                                    option?.taxpor2 || ""
                                  }
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
                                    <TextField
                                      {...params}
                                      className="small-input"
                                    />
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
                                  getOptionLabel={(option) =>
                                    option?.taxpor3 || ""
                                  }
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
                                    <TextField
                                      {...params}
                                      className="small-input"
                                    />
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
                                <InputLabel sx={{ mb: 1 }}>
                                  Costing method
                                </InputLabel>
                                <Autocomplete
                                  options={[
                                    "FIFO - First in first out",
                                    "LIFO - last in first out",
                                    "Standard - standard",
                                    "Average - average",
                                    " ",
                                  ]}
                                  value={formData.itmcostingmet}
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
                                <InputLabel sx={{ mb: 1 }}>
                                  Supplier Name
                                </InputLabel>
                                <Autocomplete
                                  disablePortal
                                  id="uom-combo-box"
                                  className="small-autocomplete"
                                  options={itemSupplier}
                                  getOptionLabel={(option) =>
                                    option.firstname || ""
                                  }
                                  renderOption={(props, option) => (
                                    <li {...props}>
                                      {option?.vendor_code} {"-"}{" "}
                                      {option?.firstname}
                                    </li>
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

                            {selectedDepartment != 25 && dateField}

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
                                <InputLabel sx={{ mb: 1 }}>
                                  Created Date
                                </InputLabel>
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
                            </Grid>

                            {/* image sections */}

                            <Grid item xs={12} sm={4}>
                              <MDBox pb={2}>
                                <InputLabel sx={{ mb: 1 }}>
                                  Upload Image
                                </InputLabel>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setImage(e.target.files[0])}
                                  style={{ width: "100%" }}
                                />
                              </MDBox>
                            </Grid>

                            {/* <Grid item xs={12} sm={4}>
                        <input
                          type="file"
                          name="main_image"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <input
                          type="file"
                          name="left_image"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <input
                          type="file"
                          name="right_image"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <input
                          type="file"
                          name="front_image"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <input
                          type="file"
                          name="back_image"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Grid> */}

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
                            {/* <Grid item xs={12}> */}
                            <Grid
                              container
                              spacing={2}
                              justifyContent="right"
                              sx={{ mt: 1, mb: 2 }}
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
                    </div>
                  )}
                </div>
              </Card>
            </form>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Add_Item;
