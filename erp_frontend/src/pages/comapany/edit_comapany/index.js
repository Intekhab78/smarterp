import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Checkbox,
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
import "../../formStyle.css";
import moment from "moment";

const payment_term = [
  { label: "Cash", value: "1" },
  { label: "BILL TO BILL PAYMENT AR", value: "2" },
  { label: "Net 90 Days", value: "3" },
  { label: "NET 30 DAYS", value: "4" },
  { label: "Net 60 Days", value: "5" },
  { label: "Cash on Delivery", value: "6" },
  { label: "Net 45 Days", value: "7" },
];

function edit_company() {
  const navigate = useNavigate();
  const params = useParams();
  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [rows, setRows] = useState([]);
  const [Bankrows, setBankrows] = useState([]);
  const [Warehouserows, setWarehouserows] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSalesmanValue, setAutocompleteSalesmanValue] =
    useState("");
  const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
  const [item, setItem] = useState([]);
  const [countries, setCountries] = useState([]);
  const [addcountries, setAddCountries] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [city, setCity] = useState([]);
  const [emirates, setEmirates] = useState([]);
  const [warehouse, setwarehouse] = useState([]);
  const [Acccurrency, setAcccurrency] = useState([]);

  const [Customers, setCustomerList] = useState([]);
  const [Salesmans, setSalesmanList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  let user_data = JSON.parse(localStorage.getItem("user_data"));

  const [formData, setFormData] = useState({
    id: params.id,
    compdesc: "",
    compcode: "",
    compdesc: "",
    itemdesclong: "",
    ccountry: "",
    ccurrency: "",
    clicense: "",
    ctaxnumber: "",
    cfinyear: "",
    cacurrency: "",
    cacurrency: "",
    clogo: "",
    clogo_display: "",
    note1: "",
    note2: "",
    note3: "",
    status: "1",
    itmcatdt1: "",
    itmcatdt2: "",
    addedby: `${user_data.firstname} ${user_data.lastname}`,
    createddt: new Date().toLocaleString(),
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          clogo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    OrderNuberRange();
    fetchcountryList();
    fetchCurrencyList();
    fetchWarehouseList();
    fetchOrderDetails();
    // fetchEmiratesList();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "company/details", {
        id: params.id,
      });
      if (response.status) {
        const orderData = response.data;
        setFormData({
          ...formData,
          id: orderData.id,
          cacurrency: orderData.cacurrency,
          ccountry: orderData.ccountry,
          // clogo: orderData.clogo,
          clogo_display: orderData.clogo === null ? "" : orderData.clogo,
          ccurrency: orderData.ccurrency,
          cfinyear: moment(orderData.cfinyear).format("YYYY-MM-DD"),
          clicense: orderData.clicense,
          compdesc: orderData.compdesc,
          ctaxnumber: orderData.ctaxnumber,
          itmcatdt1: moment(orderData.itmcatdt1).format("YYYY-MM-DD"),
          compcode: orderData.compcode,
          itmcatdt2: moment(orderData.itmcatdt2).format("YYYY-MM-DD"),
          itemdesclong: orderData.itemdesclong,
          compdesc: orderData.compdesc,
          note1: orderData.note1,
          note2: orderData.note2,
          note3: orderData.note3,
          status: orderData.status === 1 ? "1" : "0",
        });
        //Location
        let company_address = [];
        for (let index = 0; index < orderData.company_address.length; index++) {
          const element = orderData.company_address[index];

          const response = await axios_post(true, "state/list", {
            country_id: element?.country_id,
          });
          let stateList = [];
          if (response) {
            if (response.status) {
              stateList = response.data;
            }
          }

          let CityList = [];
          const responseCity = await axios_post(true, "city/list", {
            country_id: element?.country_id,
            state_id: element?.emirates_id,
          });
          if (responseCity) {
            if (responseCity.status) {
              CityList = responseCity.data;
            }
          }

          let obje = {
            id: index + 1,
            address: element.address,
            address_name: element.address_name,
            contact_name: element.contact_name,
            contact_no: element?.contact_no,
            country_id: element?.country_id,
            emirates_id: element?.emirates_id,
            emirates_array: stateList,
            city_array: CityList,
            city_id: element?.city_id,
            default_address: element.default_address,
            email: element.email,
            fax_no: element.fax_no,
            landline_no: element.landline_no,
            other_email_2: element.other_email_2,
            other_email_3: element.other_email_3,
            other_number_2: element.other_number_2,
            other_number_3: element?.other_number_3,
            postal_code: element.postal_code,
            toll_free_number: element.toll_free_number,
          };
          company_address.push(obje);
        }
        setRows(company_address);

        //bank
        let company_bank = [];
        for (let index = 0; index < orderData.company_bank.length; index++) {
          const element = orderData.company_bank[index];

          let obje = {
            id: index + 1,
            // bank_address_name: element.address_name,
            bank_address: element.address,
            bank_beneficiary_name: element.beneficiary_name,
            bank_postal_code: element.postal_code,
            bank_country_id: element?.country_id,
            bank_currency_id: element?.currency_id,
            bank_paying_bank: element?.paying_bank,
            bank_branch_name: element?.branch_name,
            bank_iban_no: element?.iban_no,
            bank_contact_no: element?.contact_no,
            bank_email: element.email,
            bank_contact_name: element.contact_name,
            bank_fax_no: element.fax_no,
            bank_landline_no: element.landline_no,
            bank_toll_free_number: element.toll_free_number,
            bank_other_email_2: element.other_email_2,
            bank_other_email_3: element.other_email_3,
            bank_other_number_2: element.other_number_2,
            bank_other_number_3: element?.other_number_3,
            bank_default_address: element?.default_bank,
          };
          company_bank.push(obje);
        }
        setBankrows(company_bank);

        //warehouse
        let location = [];
        for (let index = 0; index < orderData.location.length; index++) {
          const element = orderData.location[index];

          let obje = {
            id: index + 1,
            location_branch_name: element.locname,
            location_address: element.locdesclong,
            location_currency_id: element.ccurrency,
          };
          location.push(obje);
        }
        setWarehouserows(location);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const fetchCurrencyList = async () => {
    const response = await axios_post(true, "currency/list");
    if (response) {
      if (response.status) {
        setCurrency(response.data);
        setAcccurrency(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchWarehouseList = async () => {
    const response = await axios_post(true, "warehouse_master/ware_list");
    if (response) {
      if (response.status) {
        setwarehouse(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const ItemList = async () => {
    const response = await axios_post(true, "item/list");
    if (response) {
      if (response.status) {
        setItem(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const CustomerList = async () => {
    const response = await axios_post(true, "customer/list");
    if (response) {
      if (response.status) {
        setCustomerList(response.data.records);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const SalesmanList = async () => {
    const response = await axios_post(true, "salesman/list");
    if (response) {
      if (response.status) {
        setSalesmanList(response.data.records);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const OrderNuberRange = async () => {
    let params = {
      function_for: "company",
    };
    const response = await axios_post(
      true,
      "code_setting/get-next-comming-code",
      params
    );
    if (response) {
      if (response.status) {
        setFormData((prevData) => ({
          ...prevData,
          compcode: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchEmiratesList = async (countryId, params) => {
    const response = await axios_post(true, "state/list", {
      country_id: countryId,
    });
    if (response) {
      if (response.status) {
        // setEmirates(response.data);
        const updatedRows = rows.map((row) =>
          row.id === params.id
            ? {
                ...row,
                country_id: countryId,
                emirates_array: response.data,
              }
            : row
        );
        setRows(updatedRows);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        address_name: "",
        address: "",
        postal_code: "",
        country_id: "",
        emirates_id: "",
        contact_no: "",
        email: "",
        contact_name: "",
        fax_no: "",
        landline_no: "",
        toll_free_number: "",
        other_number_2: "",
        other_number_3: "",
        other_email_2: "",
        other_email_3: "",
        default_address: 0,
        emirates_array: [],
      },
    ]);
  };
  const handleAddBankRow = () => {
    setBankrows([
      ...Bankrows,
      {
        id: Bankrows.length + 1,
        // bank_address_name: "",
        bank_address: "",
        bank_postal_code: "",
        bank_country_id: "",
        bank_currency_id: "",
        bank_paying_bank: "",
        bank_beneficiary_name: "",
        bank_branch_name: "",
        bank_iban_no: "",
        bank_contact_no: "",
        bank_email: "",
        bank_contact_name: "",
        bank_fax_no: "",
        bank_landline_no: "",
        bank_toll_free_number: "",
        bank_other_number_2: "",
        bank_other_number_3: "",
        bank_other_email_2: "",
        bank_other_email_3: "",
        bank_default_address: 0,
      },
    ]);
  };
  const handleAddWarehouseRow = () => {
    setWarehouserows([
      ...Warehouserows,
      {
        id: Warehouserows.length + 1,
        location_branch_name: "",
        location_address: "",
        location_currency_id: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const handleRemoveRowBank = (index) => {
    const newRows = [...Bankrows];
    newRows.splice(index, 1);
    setBankrows(newRows);
  };
  const handleRemoveRowWarehouse = (index) => {
    const newRows = [...Warehouserows];
    newRows.splice(index, 1);
    setWarehouserows(newRows);
  };

  const itemquantityChange = async (eventOrQuantity, params, type = "") => {
    const { name, checked, value } = eventOrQuantity.target;
    if (!name || (value === undefined && checked === undefined)) {
      return;
    }
    if (type === "default_address") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              default_address: checked ? 1 : 0,
            }
          : row
      );
      setRows(updatedRows);
    } else if (type == "") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              [name]: value,
            }
          : row
      );
      setRows(updatedRows);
    } else if (type == "country_id") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              country_id: value,
            }
          : row
      );
      setRows(updatedRows);

      await fetchEmiratesList(value, params);
    } else if (type == "city_id") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              city_id: value,
            }
          : row
      );
      setRows(updatedRows);
    } else if (type == "emirates_id") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              emirates_id: value,
            }
          : row
      );
      setRows(updatedRows);
      await fetchcountryaddList(params.country_id, value, params);
    }
  };

  const fetchcountryaddList = async (countryId, emiratesId, params) => {
    const response = await axios_post(true, "city/list", {
      country_id: countryId,
      state_id: emiratesId,
    });
    if (response) {
      if (response.status) {
        // setAddCountries(response.data);
        const updatedRows = rows.map((row) =>
          row.id === params.id
            ? {
                ...row,
                country_id: countryId,
                emirates_id: emiratesId,
                city_array: response.data,
              }
            : row
        );
        setRows(updatedRows);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchcountryList = async () => {
    const response = await axios_get(true, "country/list-dropdown");
    if (response) {
      if (response.status) {
        setCountries(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const itemquantityBankChange = (eventOrQuantity, params, type = "") => {
    const { name, checked, value } = eventOrQuantity.target;
    if (!name || (value === undefined && checked === undefined)) {
      return;
    }
    if (type === "bank_default_address") {
      const updatedRows = Bankrows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              bank_default_address: checked ? 1 : 0,
            }
          : row
      );
      setBankrows(updatedRows);
    } else if (type == "") {
      const updatedRows = Bankrows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              [name]: value,
            }
          : row
      );
      setBankrows(updatedRows);
    } else if (type == "bank_country_id") {
      const updatedRows = Bankrows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              bank_country_id: value,
            }
          : row
      );
      setBankrows(updatedRows);
    } else if (type == "bank_currency_id") {
      const updatedRows = Bankrows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              bank_currency_id: value,
            }
          : row
      );
      setBankrows(updatedRows);
    }
  };
  const itemquantityWarehouseChange = (eventOrQuantity, params, type = "") => {
    const { name, checked, value } = eventOrQuantity.target;
    if (!name || (value === undefined && checked === undefined)) {
      return;
    }
    if (type == "") {
      const updatedRows = Warehouserows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              [name]: value,
            }
          : row
      );
      setWarehouserows(updatedRows);
    } else if (type == "location_currency_id") {
      const updatedRows = Warehouserows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              location_currency_id: value,
            }
          : row
      );
      setWarehouserows(updatedRows);
    }
  };
  const validation = (formData) => {
    let errors = {};

    // if (!formData.status) {
    //     errors.status = "Status is required";
    // }
    if (!formData.compdesc) {
      errors.compdesc = "Description is required";
    }

    if (!formData.ccountry) {
      errors.ccountry = "Country is required";
    }

    if (!formData.ccurrency) {
      errors.ccurrency = "Currency is required";
    }

    if (!formData.cfinyear) {
      errors.cfinyear = "Financial year is required";
    }

    if (!formData.cacurrency) {
      errors.cacurrency = "Accounting currency is required";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    let invalidRow = rows.some((row) => !row.address_name);
    if (invalidRow) {
      setisSubmit(false);
      // setFormError({ general: "Quantity and Price cannot be null or zero." });
      ToastMassage("Please select Address", "error");
      return;
    }
    // if (invalidRow) {
    // setisSubmit(false);
    // setFormError({ general: "Quantity and Price cannot be null or zero." });
    // ToastMassage('Quantity and Price cannot be null or zero.', 'error');
    // return;
    // }
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      if (rows.length == 0) {
        setisSubmit(false);
        setFormError({});
        setItemError("Please select Address");
        ToastMassage("Please select Address", "error");
      } else {
        setFormError({});

        let finalPramas = {
          ...formData,
          address: rows,
          banks: Bankrows,
          locations: Warehouserows,
        };
        const response = await axios_post(true, "company/update", finalPramas);
        if (response) {
          setisSubmit(false);
          if (response.status) {
            ToastMassage(response.message, "success");
            navigate("/company");
          } else {
            ToastMassage(response.message, "error");
          }
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBack = () => {
    navigate("/company");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" pt={6} pb={3}>
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
                        Edit Company
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/company">
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
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Company Code</InputLabel>
                          <MDInput
                            type="text"
                            // label="Order Number"
                            variant="outlined"
                            name="compcode"
                            value={formData.compcode}
                            onChange={handleChange}
                            disabled={true}
                            // sx={{ width: 300 }}
                            className="small-input"
                          />
                          {formError.compcode && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.compcode}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="compdesc"
                            value={formData.compdesc}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 60 }}
                          />
                          {formError.compdesc && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.compdesc}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Long Description
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="itemdesclong"
                            value={formData.itemdesclong}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 60 }}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Country</InputLabel>
                          <Select
                            name="ccountry"
                            value={formData.ccountry}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            // className="small-input"
                          >
                            {countries?.map((country) => (
                              <MenuItem key={country.id} value={country?.id}>
                                {country?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.ccountry && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.ccountry}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Currency</InputLabel>
                          <Select
                            name="ccurrency"
                            value={formData.ccurrency}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            // className="small-input"
                          >
                            {currency?.map((country) => (
                              <MenuItem key={country.id} value={country?.id}>
                                {country?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.ccurrency && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.ccurrency}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>License No</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="clicense"
                            value={formData.clicense}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 60 }}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Company Tax No</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="ctaxnumber"
                            value={formData.ctaxnumber}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 60 }}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Financial year</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            sx={{ width: 300 }}
                            value={formData.cfinyear}
                            className="small-input"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cfinyear: e.target.value,
                              })
                            }
                          />
                          {formError.cfinyear && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.cfinyear}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Accounting currency
                          </InputLabel>
                          <Select
                            name="cacurrency"
                            value={formData.cacurrency}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            // className="small-input"
                          >
                            {Acccurrency?.map((country) => (
                              <MenuItem key={country.id} value={country?.id}>
                                {country?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.cacurrency && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.cacurrency}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Logo</InputLabel>
                          <input
                            type="file"
                            name="clogo"
                            variant="outlined"
                            className="small-input"
                            onChange={(e) => handleFileChange(e)}
                          />
                          {formData.clogo_display && (
                            <img src={formData.clogo_display} alt=""></img>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                      <Grid item xs={12} sm={4}>
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
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 1</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmcatdt1"
                            value={formData.itmcatdt1}
                            onChange={handleChange}
                            className="small-input"
                            // disabled
                          />
                          {formError.itmcatdt1 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmcatdt1}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 2</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmcatdt2"
                            value={formData.itmcatdt2}
                            onChange={handleChange}
                            className="small-input"
                            // disabled
                          />
                          {formError.itmcatdt2 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmcatdt2}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
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
                      <Grid item xs={12} pb={6}>
                        <Box sx={{ overflowX: "auto", marginBottom: "1rem" }}>
                          <TableContainer>
                            <Table
                              sx={{ minWidth: 800, width: "100%" }}
                              aria-label="responsive table"
                            >
                              <TableHead>
                                <TableRow>
                                  {[
                                    "Address Name",
                                    "Address",
                                    "Postal Code",
                                    "Country",
                                    "Emirates",
                                    "City",
                                    "Contact No",
                                    "Email",
                                    "Contact name",
                                    // 'CGST', 'CGST Amount', 'SGST', 'SGST Amount', 'IGST', 'IGST Amount'
                                    "Fax no",
                                    "Landline no",
                                    "Toll Free num",
                                    " other Number2 ",
                                    "Other Number 3",
                                    " Other Email 2",
                                    " Other Email 3",
                                    "Default address",
                                    "Action",
                                  ].map((header) => (
                                    <TableCell
                                      key={header}
                                      sx={{
                                        fontSize: "12px",
                                        minWidth:
                                          header === "Action" ? 80 : 150,
                                      }}
                                    >
                                      {header}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rows &&
                                  rows?.length > 0 &&
                                  rows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                      {/* <TableCell sx={{ fontSize: '12px', minWidth: 200 }}>
                                                                            <Autocomplete
                                                                                disablePortal
                                                                                id="combo-box-demo"
                                                                                options={item}
                                                                                getOptionLabel={(option) => option.item_code || ''}
                                                                                renderOption={(props, option) => (
                                                                                    <li {...props}>{option.item_code}-{option.item_name}</li>
                                                                                )}
                                                                                style={{ height: 51 }}
                                                                                sx={{
                                                                                    width: '100%',
                                                                                    height: 20,
                                                                                    fontSize: '12px'
                                                                                }}
                                                                                value={row.newValue}
                                                                                onChange={(event, newValue) => ItemSelect(newValue, row)}
                                                                                renderInput={(params) => (
                                                                                    <TextField {...params} placeholder="Item code" variant="outlined" sx={{ fontSize: '12px' }} />
                                                                                )}
                                                                            />
                                                                        </TableCell> */}
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 200 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.address_name}
                                          sx={{ fontSize: "12px" }}
                                          name="address_name"
                                          onChange={(event) =>
                                            itemquantityChange(event, row, "")
                                          }
                                        />
                                      </TableCell>

                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 200 }}
                                      >
                                        <MDInput
                                          type="text"
                                          value={row.address}
                                          sx={{ fontSize: "12px" }}
                                          variant="outlined"
                                          name="address"
                                          onChange={(event) =>
                                            itemquantityChange(event, row, "")
                                          }
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.postal_code}
                                          name="postal_code"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                          sx={{ fontSize: "12px" }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <Select
                                          name="country_id"
                                          value={row.country_id}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(
                                              event,
                                              row,
                                              "country_id"
                                            );
                                            // }
                                          }}
                                          sx={{ width: "100%", height: "43px" }}
                                          // className="small-input"
                                        >
                                          {countries?.map((country) => (
                                            <MenuItem
                                              key={country.id}
                                              value={country?.id}
                                            >
                                              {country?.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <Select
                                          name="emirates_id"
                                          value={row.emirates_id}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(
                                              event,
                                              row,
                                              "emirates_id"
                                            );
                                            // }
                                          }}
                                          sx={{ width: "100%", height: "43px" }}
                                          // className="small-input"
                                        >
                                          {row?.emirates_array?.map(
                                            (country) => (
                                              <MenuItem
                                                key={country.id}
                                                value={country?.id}
                                              >
                                                {country?.name}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <Select
                                          name="city_id"
                                          value={row.city_id}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(
                                              event,
                                              row,
                                              "city_id"
                                            );
                                            // }
                                          }}
                                          sx={{ width: "100%", height: "43px" }}
                                          // className="small-input"
                                        >
                                          {row?.city_array?.map((country) => (
                                            <MenuItem
                                              key={country.id}
                                              value={country?.id}
                                            >
                                              {country?.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </TableCell>

                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          name="contact_no"
                                          value={row.contact_no}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                          sx={{ fontSize: "12px" }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.email}
                                          name="email"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          name="contact_name"
                                          value={row.contact_name}
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.fax_no}
                                          name="fax_no"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.landline_no}
                                          name="landline_no"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.toll_free_number}
                                          name="toll_free_number"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.other_number_2}
                                          name="other_number_2"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.other_number_3}
                                          sx={{ fontSize: "12px" }}
                                          name="other_number_3"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.other_email_2}
                                          sx={{ fontSize: "12px" }}
                                          name="other_email_2"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.other_email_3}
                                          sx={{ fontSize: "12px" }}
                                          name="other_email_3"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityChange(event, row, "");
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <Checkbox
                                          checked={Boolean(row.default_address)}
                                          sx={{ fontSize: "12px" }}
                                          name="default_address"
                                          onChange={(event) =>
                                            itemquantityChange(
                                              event,
                                              row,
                                              "default_address"
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 80 }}
                                      >
                                        <MDButton
                                          variant="outlined"
                                          color="info"
                                          iconOnly
                                          onClick={() =>
                                            handleRemoveRow(rowIndex)
                                          }
                                          sx={{ fontSize: "12px" }}
                                        >
                                          <Icon fontSize="small">clear</Icon>
                                        </MDButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                        <MDButton
                          variant="contained"
                          color="secondary"
                          onClick={handleAddRow}
                        >
                          Add Addrees Row
                        </MDButton>
                      </Grid>
                      <Grid item xs={12} pb={6}>
                        <Box sx={{ overflowX: "auto", marginBottom: "1rem" }}>
                          <TableContainer>
                            <Table
                              sx={{ minWidth: 800, width: "100%" }}
                              aria-label="responsive table"
                            >
                              <TableHead>
                                <TableRow>
                                  {[
                                    "Address",
                                    "Postal Code",
                                    "Country",
                                    "Currency",
                                    "Paying Bank",
                                    "Beneficiary Name",
                                    "Branch Name",
                                    "BAN No",
                                    "contact No",
                                    "Email",
                                    "Contact Name",
                                    "Fax no",
                                    "Landline no",
                                    "Toll Free num",
                                    " other Number2 ",
                                    "Other Number 3",
                                    " Other Email 2",
                                    " Other Email 3",
                                    "Default address",
                                    "Action",
                                  ].map((header) => (
                                    <TableCell
                                      key={header}
                                      sx={{
                                        fontSize: "12px",
                                        minWidth:
                                          header === "Action" ? 80 : 150,
                                      }}
                                    >
                                      {header}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Bankrows &&
                                  Bankrows?.length > 0 &&
                                  Bankrows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                      {/* <TableCell sx={{ fontSize: '12px', minWidth: 200 }}>
                                                                            <MDInput
                                                                                type="text"
                                                                                variant="outlined"
                                                                                value={row.bank_address_name}
                                                                                sx={{ fontSize: '12px' }}
                                                                                name='bank_address_name'
                                                                                onChange={(event) => itemquantityBankChange(event, row, '')}
                                                                            />
                                                                        </TableCell> */}

                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 200 }}
                                      >
                                        <MDInput
                                          type="text"
                                          value={row.bank_address}
                                          sx={{ fontSize: "12px" }}
                                          variant="outlined"
                                          name="bank_address"
                                          onChange={(event) =>
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.bank_postal_code}
                                          name="bank_postal_code"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                          sx={{ fontSize: "12px" }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <Select
                                          name="bank_country_id"
                                          value={row.bank_country_id}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              "bank_country_id"
                                            );
                                            // }
                                          }}
                                          sx={{ width: "100%", height: "43px" }}
                                          // className="small-input"
                                        >
                                          {countries?.map((country) => (
                                            <MenuItem
                                              key={country.id}
                                              value={country?.id}
                                            >
                                              {country?.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <Select
                                          name="bank_currency_id"
                                          value={row.bank_currency_id}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              "bank_currency_id"
                                            );
                                            // }
                                          }}
                                          sx={{ width: "100%", height: "43px" }}
                                          // className="small-input"
                                        >
                                          {currency?.map((country) => (
                                            <MenuItem
                                              key={country.id}
                                              value={country?.id}
                                            >
                                              {country?.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.bank_paying_bank}
                                          name="bank_paying_bank"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                          sx={{ fontSize: "12px" }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          name="bank_beneficiary_name"
                                          value={row.bank_beneficiary_name}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                          sx={{ fontSize: "12px" }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          name="bank_branch_name"
                                          value={row.bank_branch_name}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                          sx={{ fontSize: "12px" }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          name="bank_iban_no"
                                          value={row.bank_iban_no}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                          sx={{ fontSize: "12px" }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          name="bank_contact_no"
                                          value={row.bank_contact_no}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                          sx={{ fontSize: "12px" }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.bank_email}
                                          name="bank_email"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          name="bank_contact_name"
                                          value={row.bank_contact_name}
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.bank_fax_no}
                                          name="bank_fax_no"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="s"
                                          variant="outlined"
                                          value={row.bank_landline_no}
                                          name="bank_landline_no"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.bank_toll_free_number}
                                          name="bank_toll_free_number"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.bank_other_number_2}
                                          name="bank_other_number_2"
                                          sx={{ fontSize: "12px" }}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="number"
                                          variant="outlined"
                                          value={row.bank_other_number_3}
                                          sx={{ fontSize: "12px" }}
                                          name="bank_other_number_3"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.bank_other_email_2}
                                          sx={{ fontSize: "12px" }}
                                          name="bank_other_email_2"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.bank_other_email_3}
                                          sx={{ fontSize: "12px" }}
                                          name="bank_other_email_3"
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              ""
                                            );
                                            // }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 100 }}
                                      >
                                        <Checkbox
                                          checked={Boolean(
                                            row.bank_default_address
                                          )}
                                          sx={{ fontSize: "12px" }}
                                          name="bank_default_address"
                                          onChange={(event) =>
                                            itemquantityBankChange(
                                              event,
                                              row,
                                              "bank_default_address"
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 80 }}
                                      >
                                        <MDButton
                                          variant="outlined"
                                          color="info"
                                          iconOnly
                                          onClick={() =>
                                            handleRemoveRowBank(rowIndex)
                                          }
                                          sx={{ fontSize: "12px" }}
                                        >
                                          <Icon fontSize="small">clear</Icon>
                                        </MDButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                        <MDButton
                          variant="contained"
                          color="secondary"
                          onClick={handleAddBankRow}
                        >
                          Add Bank Row
                        </MDButton>
                      </Grid>
                      {/* <Grid item xs={12} pb={6}>
                                                <Box sx={{ overflowX: 'auto', marginBottom: "1rem" }}>
                                                    <TableContainer>
                                                        <Table sx={{ minWidth: 800, width: '100%' }} aria-label="responsive table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    {['Branch Name', 'Address', 'Currency', 'Action'].map((header) => (
                                                                        <TableCell key={header} sx={{ fontSize: '12px', minWidth: header === 'Action' ? 80 : 150 }}>
                                                                            {header}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {Warehouserows && Warehouserows?.length > 0 && Warehouserows.map((row, rowIndex) => (
                                                                    <TableRow key={rowIndex}>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 200 }}>
                                                                            <MDInput
                                                                                type="text"
                                                                                variant="outlined"
                                                                                value={row.location_branch_name}
                                                                                sx={{ fontSize: '12px' }}
                                                                                name='location_branch_name'
                                                                                onChange={(event) => itemquantityWarehouseChange(event, row, '')}
                                                                            />
                                                                        </TableCell>

                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 200 }}>
                                                                            <MDInput
                                                                                type="text"
                                                                                variant="outlined"
                                                                                value={row.location_address}
                                                                                sx={{ fontSize: '12px' }}
                                                                                name='location_address'
                                                                                onChange={(event) => itemquantityWarehouseChange(event, row, '')}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 200 }}>
                                                                            <Select
                                                                                name="location_currency_id"
                                                                                value={row.location_currency_id}
                                                                                onChange={(event) => {
                                                                                    // const value = parseFloat(event.target.value);
                                                                                    // if (value >= 1 || event.target.value === "") {
                                                                                    itemquantityWarehouseChange(event, row, 'location_currency_id');
                                                                                    // }
                                                                                }}
                                                                                sx={{ width: '100%', height: '43px' }}
                                                                            // className="small-input"
                                                                            >
                                                                                {currency?.map((country) => (
                                                                                    <MenuItem key={country.id} value={country?.id}>
                                                                                        {country?.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 80 }}>
                                                                            <MDButton
                                                                                variant="outlined"
                                                                                color="info"
                                                                                iconOnly
                                                                                onClick={() => handleRemoveRowWarehouse(rowIndex)}
                                                                                sx={{ fontSize: '12px' }}
                                                                            >
                                                                                <Icon fontSize="small">clear</Icon>
                                                                            </MDButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Box>
                                                <MDButton variant="contained" color="secondary" onClick={handleAddWarehouseRow}>
                                                    Add Location Row
                                                </MDButton>
                                            </Grid> */}
                      <Grid item xs={12} pb={6}>
                        <Box sx={{ overflowX: "auto", marginBottom: "1rem" }}>
                          <TableContainer>
                            <Table
                              sx={{ minWidth: 800, width: "100%" }}
                              aria-label="responsive table"
                            >
                              <TableHead>
                                <TableRow>
                                  {["Branch Name", "Address", "Currency"].map(
                                    (header) => (
                                      <TableCell
                                        key={header}
                                        sx={{
                                          fontSize: "12px",
                                          minWidth:
                                            header === "Action" ? 80 : 150,
                                        }}
                                      >
                                        {header}
                                      </TableCell>
                                    )
                                  )}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Warehouserows &&
                                  Warehouserows?.length > 0 &&
                                  Warehouserows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 200 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.location_branch_name}
                                          sx={{ fontSize: "12px" }}
                                          name="location_branch_name"
                                          disabled
                                          onChange={(event) =>
                                            itemquantityWarehouseChange(
                                              event,
                                              row,
                                              ""
                                            )
                                          }
                                        />
                                      </TableCell>

                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 200 }}
                                      >
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          value={row.location_address}
                                          sx={{ fontSize: "12px" }}
                                          name="location_address"
                                          disabled
                                          onChange={(event) =>
                                            itemquantityWarehouseChange(
                                              event,
                                              row,
                                              ""
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 200 }}
                                      >
                                        <Select
                                          name="location_currency_id"
                                          value={row.location_currency_id}
                                          onChange={(event) => {
                                            // const value = parseFloat(event.target.value);
                                            // if (value >= 1 || event.target.value === "") {
                                            itemquantityWarehouseChange(
                                              event,
                                              row,
                                              "location_currency_id"
                                            );
                                            // }
                                          }}
                                          sx={{ width: "100%", height: "43px" }}
                                          disabled
                                          // className="small-input"
                                        >
                                          {currency?.map((country) => (
                                            <MenuItem
                                              key={country.id}
                                              value={country?.id}
                                            >
                                              {country?.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </TableCell>
                                      {/* <TableCell sx={{ fontSize: '12px', minWidth: 80 }}>
                                                                            <MDButton
                                                                                variant="outlined"
                                                                                color="info"
                                                                                iconOnly
                                                                                onClick={() => handleRemoveRowWarehouse(rowIndex)}
                                                                                sx={{ fontSize: '12px' }}
                                                                            >
                                                                                <Icon fontSize="small">clear</Icon>
                                                                            </MDButton>
                                                                        </TableCell> */}
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                        <MDButton
                          variant="contained"
                          color="secondary"
                          disabled
                          onClick={handleAddWarehouseRow}
                        >
                          Add Location Row
                        </MDButton>
                      </Grid>
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
                              fullWidth
                              sx={{ marginLeft: "15px" }}
                              onClick={handleBack}
                            >
                              Cancel
                            </MDButton>
                          </MDBox>
                        </Grid>
                      </Grid>
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

export default edit_company;
