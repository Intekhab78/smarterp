import { Link, useNavigate } from "react-router-dom";
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
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
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
import axios, { axios_get, axios_post } from "../../../axios";

import { ToastMassage } from "../../../toast";
import { fetchAllGrnSettings } from "../../../utils/grn_setting_batchno";

const payment_term = [
  { label: "Cash", value: "1" },
  { label: "BILL TO BILL PAYMENT AR", value: "2" },
  { label: "Net 90 Days", value: "3" },
  { label: "NET 30 DAYS", value: "4" },
  { label: "Net 60 Days", value: "5" },
  { label: "Cash on Delivery", value: "6" },
  { label: "Net 45 Days", value: "7" },
];

function AddGrn() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [rows, setRows] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSalesmanValue, setAutocompleteSalesmanValue] =
    useState("");
  const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
  const [item, setItem] = useState([]);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [Customers, setCustomerList] = useState([]);
  const [Salesmans, setSalesmanList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    grn_number: "",
    delivery_date: "",
    company_id: "",
    location_id: "",
    payment_terms: "",
    due_date: "",
    vendor_invoice_no: "",
    vendor_invoice_date: "",
    delivery_note: "",
    status: "Open",
    order_type: "Normal",
    current_stage_comment: "",
  });

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    OrderNuberRange();
    fetchcompanyList();
  }, []);

  const [grnSetting, setGrnSetting] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchAllGrnSettings(); // returns an array
      if (data.length > 0) {
        setGrnSetting(data[0]); // take the first matching setting
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (grnSetting) {
      console.log("Is_auto_gen_batch_no:", grnSetting.Is_auto_gen_batch_no);
    }
  }, [grnSetting]);

  const [filteredItems, setFilteredItems] = useState([]);

  const ItemList = async () => {
    const response = await axios_post(true, "item_location_master/list");

    console.log("response is from item_location_master", response);

    if (response) {
      if (response.status) {
        setItem(response.data); // store full data
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  useEffect(() => {
    if (formData.company_id && formData.location_id) {
      const filtered = item.filter(
        (itm) =>
          itm.company_id === formData.company_id &&
          itm.location_id === formData.location_id,
      );
      setFilteredItems(filtered);

      // console.log("filtered items is ---------------", filtered);
    } else {
      setFilteredItems([]); // clear if not selected
    }
  }, [formData.company_id, formData.location_id, item]);

  const CustomerList = async () => {
    const response = await axios_post(true, "vendor/list");
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

  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");

    if (response) {
      if (response.status) {
        let companies = response.data;

        // If any company has is_main_comp = "yes", keep only those
        const mainCompanies = companies.filter((c) => c.is_main_comp != "yes");

        if (mainCompanies.length > 0) {
          setCompines(mainCompanies);
        } else {
          setCompines(companies);
        }
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

  const OrderNuberRange = async () => {
    let params = {
      function_for: "goodreceiptnote",
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
          grn_number: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const handleAutocompleteChange = (event, newValue, type) => {
    if (type == "customer") {
      setAutocompleteValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        customer_id: newValue == null ? "" : newValue?.id,
      }));
    } else if (type == "salesman") {
      setAutocompleteSalesmanValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        salesman_id: newValue == null ? "" : newValue?.user_id,
      }));
    } else if (type == "payment_term") {
      setAutocompletePaymentValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        payment_terms: newValue == null ? "" : newValue?.value,
      }));
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        item_id: "",
        item_code: "",
        item_name: "",
        uom: "",
        quantity: 0,
        skim: "None",
        discounttype: "Percentage",
        price: 0,
        excise: 0,
        discount: 0,
        net: 0,
        vat: 0,
        ptr_di: "",
        taxa_ble: "",
        cgst: "",
        cgst_amount: "",
        sgst: "",
        sgst_amount: "",
        igst: "",
        igst_amount: "",
        total: 0,
        actions: "",
        newValue: "",
        uom_list: [],
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  let user_data = JSON.parse(localStorage.getItem("user_data"));

  const ItemSelect = (newValue, params) => {
    console.log("new value is ", newValue);

    const updatedRows = rows.map((row, index) =>
      row.id === params.id
        ? {
            ...row,
            item_id: newValue?.id,
            item_code: newValue?.item_code,
            item_name: newValue?.item_name,
            receiving_site: newValue?.batch_no ?? null,
            expiry_delivery_date: newValue?.exp_date,
            hsn_code: newValue?.short_code,
            uom: newValue?.item_uom?.id,
            item_uom: newValue?.item_uom?.uomname,
            // uom: newValue?.item_main_prices?.[0].item_uom?.id,
            // item_uom: newValue?.item_main_prices?.[0].item_uom?.name,
            quantity: 1,
            price: parseFloat(newValue?.itemcost).toFixed(2),
            ptr_di: parseInt(newValue?.itemcost),
            vat: parseFloat(newValue?.tax_master_1?.taxcal),
            taxa_ble: (
              (parseFloat(newValue?.itemcost) *
                1 *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
              // parseFloat(newValue?.item_tax)) /
              100
            ).toFixed(2),

            total: (
              parseFloat(newValue?.itemcost) +
              (parseFloat(newValue?.itemcost) *
                parseFloat(newValue?.tax_master_1?.taxcal || 0)) /
                100
            ).toFixed(2),

            net: (parseFloat(newValue?.itemcost) * 1).toFixed(2),
            newValue: newValue,
            uom_list: newValue?.item_main_prices,
          }
        : row,
    );
    setRows(updatedRows);
  };

  const ItemSelectUom = (newValue, params) => {
    const updatedRows = rows.map((row) =>
      row.id === params.id
        ? {
            ...row,
            uom: newValue?.item_uom?.id,
            newValue_uom: newValue,
          }
        : row,
    );
    setRows(updatedRows);
  };

  const calculateRowValues = (price, quantity, discountPercent, vatPercent) => {
    const gross = price * quantity;
    const discount = (gross * discountPercent) / 100;
    const net = gross - discount;
    const taxa_ble = (net * vatPercent) / 100;
    const total = net + taxa_ble;

    return {
      price: parseFloat(price).toFixed(2),
      quantity: parseFloat(quantity).toFixed(2),
      discount: parseFloat(discountPercent).toFixed(2),
      vat: parseFloat(vatPercent).toFixed(2),
      net: net.toFixed(2),
      taxa_ble: taxa_ble.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const itemquantityChange = (eventOrQuantity, params) => {
    const { name, value } = eventOrQuantity?.target || {
      name: null,
      value: null,
    };

    if (!name || value === undefined) return;

    const updatedRows = rows.map((row) => {
      if (row.id !== params.id) return row;

      let updatedRow = { ...row };

      // If discount type changed, update it first
      if (name === "discounttype") {
        updatedRow.discounttype = value;
      }

      const quantity =
        name === "quantity"
          ? parseFloat(value)
          : parseFloat(params.quantity) || 0;
      const price =
        name === "price" ? parseFloat(value) : parseFloat(params.price) || 0;
      const discount =
        name === "discount"
          ? parseFloat(value)
          : parseFloat(params.discount) || 0;
      const discountType =
        name === "discounttype" ? value : updatedRow.discounttype || "Amount"; // ✅ updatedRow ensures latest type
      const vat = parseFloat(params.vat) || 0;

      // Special field check
      if (
        [
          "purchase_cost_per_unit",
          "landed_cost_per_unit",
          "hsn_code",
          "receiving_site",
          "expiry_delivery_date",
        ].includes(name)
      ) {
        updatedRow[name] = value === "" ? null : value;
        return updatedRow;
      }

      const gross = price * quantity;

      if (discount > gross) {
        ToastMassage("Discount cannot be more than the price.");
        return row;
      }

      // ✅ Corrected calculation
      let net;
      if (discountType === "Percentage") {
        net = gross - (gross * discount) / 100;
      } else {
        net = gross - discount;
      }

      const taxable = (net * vat) / 100;
      const total = net + taxable;

      updatedRow = {
        ...updatedRow,
        quantity: parseFloat(quantity.toFixed(2)),
        price: parseFloat(price.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        discounttype: discountType,
        vat: parseFloat(vat.toFixed(2)),
        net: parseFloat(net.toFixed(2)),
        taxa_ble: parseFloat(taxable.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      };

      // console.log("✅ Updated Row", updatedRow);
      return updatedRow;
    });

    setRows(updatedRows);
  };

  const validation = (formData) => {
    let errors = {};

    if (!formData.customer_id) {
      errors.customer = "Customer is required";
    }
    // if (!formData.status) {
    //     errors.status = "Status is required";
    // }

    if (!formData.grn_number) {
      errors.grn_number = "Grn Number is required";
    }
    if (!formData.invoice_type) {
      errors.invoice_type = "Type is required";
    }

    if (!formData.salesman_id) {
      errors.salesman = "Salesman is required";
    }

    if (!formData.delivery_date) {
      errors.delivery_date = "Delivery Date is required";
    }
    if (!formData.company_id) errors.company_id = "Company id is required";
    if (!formData.location_id) errors.location_id = "Location id is required";

    if (!formData.payment_terms) {
      errors.payment_term = "Payment Terms are required";
    }

    if (!formData.due_date) {
      errors.due_date = "Due Date is required";
    }
    if (!formData.customer_lpo) {
      errors.customer_lpo = "Customer lpo is required";
    }
    if (!formData.vendor_invoice_no) {
      errors.vendor_invoice_no = "Vendor invoice number is required";
    }

    return errors;
  };

  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        const price = parseFloat(item.price) || 0.0;
        const quantity = parseFloat(item.quantity) || 1.0;
        const discount = parseFloat(item.discount) || 0.0;
        const excise = parseFloat(item.excise) || 0.0;
        const vat = parseFloat(item.taxa_ble) || 0.0;
        const discountType = item.discounttype || "Amount"; // default if not provided

        const gross = price * quantity;

        // ✅ Handle percentage or flat discount
        let discountValue =
          discountType === "Percentage" ? (gross * discount) / 100 : discount;

        const net = gross - discountValue;

        sums.initialTotal += gross;
        sums.discount += discountValue;
        sums.excise += excise;
        sums.vat += vat;
        sums.net += net;
        sums.total += net + vat + excise;

        return sums;
      },
      {
        initialTotal: 0.0,
        excise: 0.0,
        discount: 0.0,
        net: 0.0,
        vat: 0.0,
        total: 0.0,
      },
    );
  };

  const sums = calculateSums(rows);
  // console.log("sums is ---------", sums);

  const handleSubmit1 = async (event) => {
    event.preventDefault();

    let finalPramas = {
      ...formData,
      discount: sums.discount,
      net: sums.net,
      excise: sums.excise,
      vat: sums.vat,
      total: sums.total,
      items: rows,
    };
    // console.log("finalPramas", finalPramas);

    const response = await axios_post(true, "grn/add", finalPramas);

    // console.log("status or respons is", response);
    if (response) {
      if (response.status) {
        ToastMassage(response.message, "success");
        navigate("/grn");
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmit) return; // 🛑 prevent double click

    setisSubmit(true); // 🔒 disable button immediately

    let finalPramas = {
      ...formData,
      discount: sums.discount,
      net: sums.net,
      excise: sums.excise,
      vat: sums.vat,
      total: sums.total,
      items: rows,
    };

    try {
      const response = await axios_post(true, "grn/add", finalPramas);

      if (response?.status) {
        ToastMassage(response.message, "success");
        navigate("/grn");
      } else {
        ToastMassage(response?.message || "Something went wrong", "error");
        setisSubmit(false); // 🔓 re-enable on error
      }
    } catch (error) {
      ToastMassage("Server error", "error");
      setisSubmit(false); // 🔓 re-enable if API fails
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // 🔄 If company or location changes, reload items
      if (name === "company_id") {
        fetchlocationList(value); // already in your code
        updatedData.location_id = ""; // reset location when company changes
      }
      if (updatedData.company_id && updatedData.location_id) {
        ItemList(updatedData.company_id, updatedData.location_id);
      }

      return updatedData;
    });
  };

  const handleBack = () => {
    navigate("/grn");
  };
  const handleSkimChange = (value, rowIndex) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              skim: value,
              ...(value === "Free"
                ? {
                    price: 0,
                    discount: 0,
                    net: 0,
                    vat: 0,
                    total: 0,
                    taxa_ble: 0,
                  }
                : {
                    price: parseFloat(row.newValue?.itemcost).toFixed(2),
                    vat: parseFloat(row.newValue?.tax_master_1?.taxcal),
                    taxa_ble: (
                      (parseFloat(row.newValue?.itemcost) *
                        1 *
                        parseFloat(row.newValue?.tax_master_1?.taxcal)) /
                      100
                    ).toFixed(2),
                    total: (
                      parseFloat(row.newValue?.itemcost) +
                      (parseFloat(row.newValue?.itemcost) *
                        parseFloat(row.newValue?.tax_master_1?.taxcal)) /
                        100
                    ).toFixed(2),
                    net: (parseFloat(row.newValue?.itemcost) * 1).toFixed(2),
                  }),
            }
          : row,
      ),
    );
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
                  py={1.5}
                  px={4}
                  sx={{
                    background:
                      "linear-gradient(to right, #38bdf8, #2563eb, #4f46e5)", // from-sky-500 via-blue-600 to-indigo-600
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Left Section */}
                  <div className="flex items-center space-x-3 text-white">
                    <Icon
                      fontSize="small"
                      className="animate-bounce text-white"
                    >
                      shopping_cart
                    </Icon>
                    <h2 className="text-lg font-semibold tracking-wide drop-shadow-sm">
                      Add GRN
                    </h2>
                  </div>

                  {/* Right Section */}
                  <Link
                    to="/grn"
                    className="bg-white text-blue-700 font-medium px-4 py-1.5 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-300 flex items-center space-x-1"
                  >
                    <Icon fontSize="small" className="text-blue-600">
                      arrow_back
                    </Icon>
                    <span>Back</span>
                  </Link>
                </MDBox>

                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      <MDBox pt={4} pb={3} px={3}>
                        {/* =============================== 📋 GRN Details =============================== */}
                        <div className="bg-gray-100 rounded-2xl shadow-md p-6 mb-6 hover:shadow-lg transition-all duration-300">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                            📋 GRN Details
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* GRN Number */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                GRN Number
                              </InputLabel>
                              <MDInput
                                type="text"
                                variant="outlined"
                                name="grn_number"
                                value={formData.grn_number}
                                onChange={handleChange}
                                disabled
                                className="small-input w-full"
                              />
                              {formError.grn_number && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.grn_number}
                                </MDTypography>
                              )}
                            </div>

                            {/* Company */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Company
                              </InputLabel>
                              <Select
                                name="company_id"
                                value={formData.company_id}
                                onChange={handleChange}
                                className="w-full h-11 border rounded-md px-2"
                              >
                                {compines?.map((company) => (
                                  <MenuItem key={company.id} value={company.id}>
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
                            </div>

                            {/* Location */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Location
                              </InputLabel>
                              <Select
                                name="location_id"
                                value={formData.location_id}
                                onChange={handleChange}
                                className="w-full h-11 border rounded-md px-2"
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
                            </div>
                          </div>
                        </div>

                        {/* =============================== 📦 Vendor & Dates =============================== */}
                        <div className="bg-gray-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                            📅 Vendor & Delivery
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Vendor */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Vendor
                              </InputLabel>
                              <Autocomplete
                                disablePortal
                                options={Customers}
                                getOptionLabel={(option) =>
                                  option.vendor_code || ""
                                }
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {option.vendor_code}-{option?.company_name}
                                  </li>
                                )}
                                value={autocompleteValue}
                                onChange={(event, newValue) =>
                                  handleAutocompleteChange(
                                    event,
                                    newValue,
                                    "customer",
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Vendor"
                                    className="small-input"
                                  />
                                )}
                              />
                              {formError.customer && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.customer}
                                </MDTypography>
                              )}

                              {selectedCustomer && (
                                <div className="mt-3 text-sm text-gray-600 space-y-1">
                                  <p>
                                    <b>TAX No:</b>{" "}
                                    {selectedCustomer.import_license_no}
                                  </p>
                                  <p>
                                    <b>Address:</b> {selectedCustomer.address1}
                                  </p>
                                  <p>
                                    <b>Contact:</b> {selectedCustomer.firstname}{" "}
                                    {selectedCustomer.lastname}
                                  </p>
                                  <p>
                                    <b>Phone:</b> {selectedCustomer.mobile}
                                  </p>
                                  <p>
                                    <b>Email:</b> {selectedCustomer.email}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Vendor Doc No */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Vendor Document No
                              </InputLabel>
                              <MDInput
                                type="text"
                                name="customer_lpo"
                                value={formData.customer_lpo}
                                onChange={handleChange}
                                className="small-input w-full"
                              />
                            </div>

                            {/* GRN Type */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                GRN Type
                              </InputLabel>
                              <Autocomplete
                                options={["Normal", "Consignment"]}
                                value={formData.grn_type}
                                onChange={(event, newValue) =>
                                  setFormData({
                                    ...formData,
                                    grn_type: newValue,
                                  })
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select GRN Type"
                                    className="small-input"
                                  />
                                )}
                              />
                            </div>

                            {/* Vendor Invoice No */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Vendor Invoice No
                              </InputLabel>
                              <MDInput
                                type="text"
                                name="vendor_invoice_no"
                                value={formData.vendor_invoice_no}
                                onChange={handleChange}
                                className="small-input w-full"
                              />
                            </div>

                            {/* Vendor Invoice Date */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Vendor Invoice Date
                              </InputLabel>
                              <MDInput
                                type="date"
                                value={formData.vendor_invoice_date}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    vendor_invoice_date: e.target.value,
                                  })
                                }
                                className="small-input w-full"
                              />
                            </div>
                            {/* User */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                User
                              </InputLabel>
                              <Autocomplete
                                disablePortal
                                options={Salesmans}
                                getOptionLabel={(option) =>
                                  option.salesman_code || ""
                                }
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {option.salesman_code}-
                                    {option?.users?.firstname}
                                  </li>
                                )}
                                value={autocompleteSalesmanValue}
                                onChange={(event, newValue) =>
                                  handleAutocompleteChange(
                                    event,
                                    newValue,
                                    "salesman",
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select User"
                                    className="small-input"
                                  />
                                )}
                              />
                            </div>

                            {/* Delivery Note */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Delivery Note No.
                              </InputLabel>
                              <MDInput
                                type="text"
                                name="delivery_note"
                                value={formData.delivery_note}
                                onChange={handleChange}
                                className="small-input w-full"
                              />
                            </div>
                            {/* Delivery Date */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Delivery Date
                              </InputLabel>
                              <MDInput
                                type="date"
                                value={formData.delivery_date}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    delivery_date: e.target.value,
                                  })
                                }
                                className="small-input w-full"
                              />
                            </div>

                            {/* Due Date */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Due Date
                              </InputLabel>
                              <MDInput
                                type="date"
                                value={formData.due_date}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    due_date: e.target.value,
                                  })
                                }
                                className="small-input w-full"
                              />
                            </div>
                            {/* Payment Terms */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Payment Terms
                              </InputLabel>
                              <Autocomplete
                                disablePortal
                                options={payment_term}
                                value={autocompletePaymentValue}
                                onChange={(event, newValue) =>
                                  handleAutocompleteChange(
                                    event,
                                    newValue,
                                    "payment_term",
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Term"
                                    className="small-input"
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </MDBox>

                      <Grid item xs={12} pb={6}>
                        {/* ---------- Table Card ---------- */}
                        <Card
                          sx={{
                            borderRadius: 3,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            border: "1px solid #e0e0e0",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: "#f5f9ff",
                              borderBottom: "1px solid #dbeafe",
                              p: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              sx={{ color: "#1e3a8a", fontSize: 16 }}
                            >
                              Item Details
                            </Typography>
                          </Box>

                          <Box sx={{ overflowX: "auto", p: 2 }}>
                            <TableContainer>
                              <Table sx={{ minWidth: 900 }}>
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: "#eaf2ff" }}>
                                    {[
                                      "ITEM CODE",
                                      "ITEM NAME",
                                      "UOM",
                                      "Scheme",
                                      // "HSN Code",
                                      ...(grnSetting &&
                                      grnSetting.Is_auto_gen_batch_no === false
                                        ? ["Batch No."]
                                        : []),
                                      "Expiry Date",
                                      // "Item Type",
                                      // "Currency",
                                      "Quantity",
                                      "Price",
                                      "Total",

                                      "Discount Type",
                                      "Discount",
                                      "Net",
                                      "Tax%",
                                      "Tax Amt",
                                      // "Landed cost per unit",
                                      "Grand Total",
                                      "Action",
                                    ].map((header) => (
                                      <TableCell
                                        key={header}
                                        sx={{
                                          fontSize: "13px",
                                          fontWeight: 600,
                                          color: "#334155",
                                          minWidth:
                                            header === "Action" ? 80 : 150,
                                          textTransform: "uppercase",
                                        }}
                                      >
                                        {header}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {rows.map((row, rowIndex) => (
                                    <TableRow
                                      key={rowIndex}
                                      sx={{
                                        "&:hover": {
                                          backgroundColor: "#f9fafb",
                                        },
                                      }}
                                    >
                                      {/* keep all your existing inputs exactly as before */}
                                      <TableCell
                                        sx={{ fontSize: "12px", minWidth: 250 }}
                                      >
                                        <Autocomplete
                                          disablePortal
                                          options={filteredItems}
                                          getOptionLabel={(option) =>
                                            // option.item_code  || ""
                                            // `${option.item_code} ${option.item_name}` ||
                                            // ""
                                            option?.item_code &&
                                            option?.item_name
                                              ? `${option.item_code} ${option.item_name}`
                                              : ""
                                          }
                                          renderOption={(props, option) => (
                                            <li {...props}>
                                              {option.item_code} -{" "}
                                              {option.item_name}
                                            </li>
                                          )}
                                          value={row.newValue}
                                          onChange={(event, newValue) =>
                                            ItemSelect(newValue, row)
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              placeholder="Item code"
                                              size="small"
                                              variant="outlined"
                                            />
                                          )}
                                        />
                                      </TableCell>

                                      {/* <TableCell>
                                        <MDInput
                                          value={row.item_name}
                                          disabled
                                          variant="outlined"
                                          sx={{ width: 300 }} // or '100%', '20rem', etc.
                                        />
                                      </TableCell> */}
                                      <TableCell>
                                        <Tooltip
                                          title={row.item_name}
                                          arrow
                                          placement="top"
                                        >
                                          <span>
                                            <MDInput
                                              value={row.item_name}
                                              disabled
                                              variant="outlined"
                                              sx={{ width: 300 }}
                                              // fullWidth
                                            />
                                          </span>
                                        </Tooltip>
                                      </TableCell>

                                      <TableCell>
                                        <MDInput
                                          value={row.item_uom}
                                          disabled
                                          variant="outlined"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Select
                                          value={row.skim || "None"}
                                          onChange={(e) =>
                                            handleSkimChange(
                                              e.target.value,
                                              rowIndex,
                                            )
                                          }
                                          size="small"
                                          fullWidth
                                        >
                                          <MenuItem value="None">None</MenuItem>
                                          <MenuItem value="Free">Free</MenuItem>
                                        </Select>
                                      </TableCell>

                                      {/* <TableCell>
                                        <MDInput
                                          type="text"
                                          name="hsn_code"
                                          value={row.hsn_code}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell> */}

                                      {grnSetting &&
                                        grnSetting.Is_auto_gen_batch_no ===
                                          false && (
                                          <TableCell>
                                            <MDInput
                                              type="text"
                                              name="receiving_site"
                                              value={row.receiving_site}
                                              onChange={(e) =>
                                                itemquantityChange(e, row)
                                              }
                                              variant="outlined"
                                              size="small"
                                            />
                                          </TableCell>
                                        )}

                                      <TableCell>
                                        <MDInput
                                          type="date"
                                          name="expiry_delivery_date"
                                          value={row.expiry_delivery_date}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell>
                                      {/* 
                                      <TableCell>
                                        <Select
                                          value={
                                            row.itemtype || "Finished Goods"
                                          }
                                          onChange={(e) =>
                                            handleItemTypeChange(
                                              e.target.value,
                                              rowIndex,
                                              "itemtype"
                                            )
                                          }
                                          size="small"
                                          fullWidth
                                        >
                                          <MenuItem value="Finished Goods">
                                            FG
                                          </MenuItem>
                                          <MenuItem value="RM">RM</MenuItem>
                                          <MenuItem value="EXP">EXP</MenuItem>
                                          <MenuItem value="PKG">PKG</MenuItem>
                                        </Select>
                                      </TableCell> */}

                                      {/* <TableCell>
                                        <Select
                                          value={row.currency || "INR"}
                                          onChange={(e) =>
                                            handleItemTypeChange(
                                              e.target.value,
                                              rowIndex,
                                              "currency"
                                            )
                                          }
                                          size="small"
                                          fullWidth
                                        >
                                          <MenuItem value="INR">INR</MenuItem>
                                        </Select>
                                      </TableCell> */}

                                      <TableCell>
                                        <MDInput
                                          type="number"
                                          name="quantity"
                                          value={row.quantity}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <MDInput
                                          type="number"
                                          name="price"
                                          value={row.price}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <MDInput
                                          value={row.price * row.quantity || ""}
                                          variant="outlined"
                                          disabled
                                          size="small"
                                          sx={{ backgroundColor: "#f9fafb" }}
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <Select
                                          value={row.discounttype}
                                          name="discounttype"
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          size="small"
                                          fullWidth
                                        >
                                          <MenuItem value="Percentage">
                                            Percentage
                                          </MenuItem>
                                          <MenuItem value="Amount">
                                            Amount
                                          </MenuItem>
                                        </Select>
                                      </TableCell>

                                      <TableCell>
                                        <MDInput
                                          type="number"
                                          name="discount"
                                          value={row.discount}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <MDInput
                                          value={row.net}
                                          disabled
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <MDInput
                                          value={row.vat}
                                          disabled
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell>

                                      <TableCell>
                                        <MDInput
                                          value={row.taxa_ble}
                                          disabled
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell>

                                      {/* <TableCell>
                                        <MDInput
                                          name="landed_cost_per_unit"
                                          value={row.landed_cost_per_unit}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell> */}

                                      <TableCell>
                                        <MDInput
                                          value={row.total}
                                          disabled
                                          variant="outlined"
                                          size="small"
                                        />
                                      </TableCell>

                                      <TableCell align="center">
                                        <MDButton
                                          variant="outlined"
                                          color="error"
                                          iconOnly
                                          onClick={() =>
                                            handleRemoveRow(rowIndex)
                                          }
                                          sx={{
                                            minWidth: "36px",
                                            height: "36px",
                                          }}
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

                          {/* ---------- Add Row Button ---------- */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              p: 2,
                            }}
                          >
                            <MDButton
                              variant="contained"
                              color="secondary"
                              onClick={handleAddRow}
                            >
                              + Add Row
                            </MDButton>
                          </Box>
                        </Card>

                        {/* ---------- Vendor Note & Total ---------- */}
                        <Grid container spacing={2} mt={3}>
                          {/* Vendor Note */}
                          {/* <Grid item xs={7}>
                            <Card
                              sx={{
                                p: 3,
                                borderRadius: 3,
                                boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                              }}
                            >
                              <Typography
                                fontWeight={600}
                                sx={{ mb: 1, fontSize: 14 }}
                              >
                                Vendor Note
                              </Typography>
                              <MDInput variant="outlined" sx={{ width: 300 }} />
                            </Card>
                          </Grid> */}
                          {/* === Vendor Note Section === */}
                          <div className="flex-1 bg-white rounded-xl shadow-md p-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Vendor Notes
                            </label>
                            <textarea
                              className="w-full h-28 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm resize-none"
                              placeholder="Enter vendor note..."
                              value={formData?.current_stage_comment || ""}
                              onChange={handleChange}
                              name="current_stage_comment"
                            />
                          </div>

                          {/* Totals Section */}
                          <Grid item xs={5}>
                            <Card
                              sx={{
                                backgroundColor: "#1e293b",
                                color: "#fff",
                                borderRadius: 3,
                                boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                                p: 3,
                              }}
                            >
                              {[
                                ["Total", sums.initialTotal],
                                ["Discount", sums.discount],
                                ["Net Total", sums.net],
                                ["Tax", sums.vat],
                                ["Grand Total", sums.total],
                              ].map(([label, value]) => (
                                <Grid container key={label} mb={1}>
                                  <Grid item xs={6}>
                                    <Typography sx={{ fontSize: 14 }}>
                                      {label}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      sx={{ fontSize: 15, fontWeight: 600 }}
                                    >
                                      INR {parseFloat(value).toFixed(2)}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              ))}

                              {/* Buttons */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  mt: 3,
                                  gap: 2,
                                }}
                              >
                                <MDButton
                                  variant="gradient"
                                  color="info"
                                  type="submit"
                                  disabled={isSubmit}
                                >
                                  {isSubmit ? (
                                    <CircularProgress color="white" size={22} />
                                  ) : (
                                    "Save"
                                  )}
                                </MDButton>
                                <MDButton
                                  variant="gradient"
                                  color="secondary"
                                  onClick={handleBack}
                                  disabled={isSubmit}
                                >
                                  Cancel
                                </MDButton>
                              </Box>
                            </Card>
                          </Grid>
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

export default AddGrn;
