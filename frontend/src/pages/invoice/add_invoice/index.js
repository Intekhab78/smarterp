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
import { axios_get, axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import {
  getSystemSettings,
  updateSystemSetting,
} from "../../../utils/settingsApi";

const payment_term = [
  { label: "Cash", value: "1" },
  { label: "BILL TO BILL PAYMENT AR", value: "2" },
  { label: "Net 90 Days", value: "3" },
  { label: "NET 30 DAYS", value: "4" },
  { label: "Net 60 Days", value: "5" },
  { label: "Cash on Delivery", value: "6" },
  { label: "Net 45 Days", value: "7" },
];

function Add_Invoice() {
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
  const [isNegStockAllowed, setIsNegStockAllowed] = useState(0);

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    invoice_number: "",
    delivery_date: "",
    company_id: "",
    location_id: "",
    payment_terms: "",
    due_date: "",
    status: "",
    invoice_type: "Normal",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    OrderNuberRange();
    fetchcompanyList();
  }, []);

  /////////////////////////////for the negative stock
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formData.company_id || !formData.location_id) return;

    const fetchData = async () => {
      setLoading(true);

      const res = await getSystemSettings(
        formData.company_id,
        formData.location_id
      );

      if (res.success) {
        console.log("Settings Loaded:", res.data);
        setIsNegStockAllowed(res.data.allow_negative_stock);
        setSettings(res.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [formData.company_id, formData.location_id]);
  ///////////////////////////////////////////////////////////////////////////

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
      // Convert both sides to number
      const companyId = Number(formData.company_id);
      const locationId = Number(formData.location_id);
      const filtered = item.filter(
        (itm) =>
          Number(itm.company_id) === companyId &&
          Number(itm.location_id) === locationId
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]); // clear if not selected
    }
  }, [formData.company_id, formData.location_id, item]);

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

  // console.log("Customers===========", Customers);

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
    console.log("fetch company list ", response.data);

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
      function_for: "order",
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
          invoice_number: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const handleAutocompleteChange = (event, newValue, type) => {
    if (type == "vendor") {
      setAutocompleteValue(newValue);
      setSelectedCustomer(newValue);
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
        remaining_stock: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  console.log("rows is -------------", rows);

  const ItemSelect = (newValue, params) => {
    console.log("new value is ", newValue);

    const updatedRows = rows.map((row, index) =>
      row.id === params.id
        ? {
            ...row,
            item_id: newValue?.id,
            item_code: newValue?.item_code,
            item_name: newValue?.item_name,
            // receiving_site: newValue?.batch_no,
            receiving_site: newValue?.batch_no ?? null,
            remaining_stock: newValue?.remaining_stock ?? null,

            expiry_delivery_date: newValue?.exp_date,
            hsn_code: newValue?.short_code,
            uom: newValue?.item_main_prices?.[0].item_uom?.id,
            item_uom: newValue?.item_main_prices?.[0].item_uom?.name,
            quantity: 1,
            price: parseFloat(newValue?.itemprice).toFixed(2),
            ptr_di: parseInt(newValue?.itemprice),
            vat: parseFloat(newValue?.tax_master_1?.taxcal),
            taxa_ble: (
              (parseFloat(newValue?.itemprice) *
                1 *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
              // parseFloat(newValue?.item_tax)) /
              100
            ).toFixed(2),
            // total: (
            //   parseFloat(newValue?.itemprice) +
            //   (parseFloat(newValue?.itemprice) *
            //     parseFloat(newValue?.item_tax)) /
            //     100
            // ).toFixed(2),
            // total: newValue?.itemprice,

            total: (
              parseFloat(newValue?.itemprice) +
              (parseFloat(newValue?.itemprice) *
                parseFloat(newValue?.tax_master_1?.taxcal || 0)) /
                100
            ).toFixed(2),

            net: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            newValue: newValue,
            uom_list: newValue?.item_main_prices,
          }
        : row
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
        : row
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

      // 🔍 Extract values safely from params
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
        name === "discounttype" ? value : params.discounttype || "Flat";
      const vat = parseFloat(params.vat) || 0;

      // Handle other special fields directly
      if (
        [
          "purchase_cost_per_unit",
          "landed_cost_per_unit",
          "hsn_code",
          "receiving_site",
          "expiry_delivery_date",
        ].includes(name)
      ) {
        // updatedRow[name] = value;
        // return updatedRow;
        updatedRow[name] = value === "" ? null : value;
        return updatedRow;
      }

      const gross = price * quantity;

      if (discount > gross) {
        ToastMassage("Discount cannot be more than the price.");
        return row;
      }

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
        total: parseFloat(total.toFixed(2)), // ✅ GRAND TOTAL updated properly
      };
      console.log("Updated row:", updatedRow); // 🔍 Debug output

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

    if (!formData.invoice_number) {
      errors.invoice_number = "Invoice Number is required";
    }
    if (!formData.invoice_type) {
      errors.invoice_type = "Type is required";
    }

    if (!formData.salesman_id) {
      errors.salesman = "Salesman is required";
    }

    // if (!formData.delivery_date) {
    //   errors.delivery_date = "Delivery Date is required";
    // }
    if (!formData.company_id) errors.company_id = "Company id is required";
    if (!formData.location_id) errors.location_id = "Location id is required";

    if (!formData.payment_terms) {
      errors.payment_term = "Payment Terms are required";
    }

    // if (!formData.due_date) {
    //   errors.due_date = "Due Date is required";
    // }
    // if (!formData.customer_lpo) {
    //   errors.customer_lpo = "Customer lpo is required";
    // }

    return errors;
  };

  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    let invalidRow = rows.some(
      (row) =>
        !row.quantity || !row.price || row.quantity <= 0 || row.price <= 0
    );

    if (isNegStockAllowed != 1) {
      let insufficientRow = rows.find(
        (row) => row.quantity > row.remaining_stock
      );

      if (insufficientRow) {
        setisSubmit(false);
        ToastMassage(
          `Item ${insufficientRow.item_name} Not enough stock to generate the invoice`,
          "error"
        );
        return;
      }
    }

    // proceed with submission if allowed or no insufficient stock

    if (invalidRow) {
      setisSubmit(false);
      ToastMassage("Quantity and Price cannot be null or zero.", "error");
      return;
    }

    // Validate form fields
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
      return;
    }

    // Validate items
    if (rows.length === 0) {
      setisSubmit(false);
      setFormError({});
      setItemError("Please select item");
      ToastMassage("Please select item", "error");
      return;
    }

    setisSubmit(false);
    setFormError({});

    let finalPramas = {
      ...formData,
      discount: sums.discount,
      net: sums.net,
      excise: sums.excise,
      vat: sums.vat,
      total: sums.total,
      isNegStockAllowed: isNegStockAllowed,
      items: rows,
    };

    try {
      const response = await axios_post(
        true,
        "invoice/add_direct_invoice",
        finalPramas
      );

      if (response?.status) {
        ToastMassage(
          response?.message || "Invoice created successfully!",
          "success"
        );
        navigate("/invoice");
      } else {
        const backendError =
          response?.data ||
          response?.error?.additional_info ||
          response?.error?.message ||
          response?.message ||
          "Something went wrong!";

        ToastMassage(backendError, "error");
      }
    } catch (err) {
      const backendErr =
        err?.response?.data?.data ||
        err?.response?.data?.error?.additional_info ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong!";

      ToastMassage(backendErr, "error");
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

  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        const price = parseFloat(item.price) || 0.0;
        const quantity = parseFloat(item.quantity) || 1.0;
        const discountValue = parseFloat(item.discount) || 0.0;
        const discountType = item.discounttype || "Percentage"; // 👈 added this
        const excise = parseFloat(item.excise) || 0.0;
        const vat = parseFloat(item.taxa_ble) || 0.0;

        const gross = price * quantity;

        // ✅ calculate discount correctly
        let discountAmount = 0.0;
        if (discountType === "Percentage") {
          discountAmount = (gross * discountValue) / 100;
        } else if (discountType === "Amount") {
          discountAmount = discountValue;
          // discountAmount = discountValue * quantity;
        }

        const net = gross - discountAmount;

        sums.excise += excise;
        sums.discount += discountAmount; // ✅ now adds correct amount
        sums.net += net;
        sums.vat += vat;
        sums.total += net + vat + excise;
        sums.initialTotal += gross;

        return sums;
      },
      {
        initialTotal: 0.0,
        excise: 0.0,
        discount: 0.0,
        net: 0.0,
        vat: 0.0,
        total: 0.0,
      }
    );
  };
  const sums = calculateSums(rows);

  const handleBack = () => {
    navigate("/invoice");
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
                : (() => {
                    const price = parseFloat(row.newValue?.itemprice) || 0;
                    const tax = parseFloat(row.newValue?.item_tax) || 0;
                    const taxable = (price * 1 * tax) / 100;
                    const total = price + taxable;
                    // console.log("toatl value is ", total);
                    // console.log("price value is ", price);

                    return {
                      price: price,
                      vat: tax,
                      taxa_ble: taxable,
                      total: total,
                      net: price * 1,
                    };
                  })()),
            }
          : row
      )
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
                <div className="mx-2 mt-[-12px] py-3 px-6 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-xl shadow-lg flex items-center justify-between">
                  {/* Left Section */}
                  <div className="flex items-center space-x-3 text-white">
                    <Icon
                      fontSize="small"
                      className="text-white animate-bounce"
                    >
                      shopping_cart
                    </Icon>
                    <h2 className="text-xl font-semibold tracking-wide drop-shadow-sm">
                      Add Invoice
                    </h2>
                  </div>

                  {/* Right Section */}
                  <Link
                    to="/invoice"
                    className="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-300 flex items-center space-x-1"
                  >
                    <Icon fontSize="small" className="text-blue-600">
                      arrow_back
                    </Icon>
                    <span>Back</span>
                  </Link>
                </div>

                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      <div className="flex justify-center w-full py-8">
                        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
                          {/* =============================== 🧾 Invoice Information =============================== */}
                          <div className="bg-gray-100 rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                              Invoice Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* 1️⃣ Invoice Number */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Invoice Number
                                </label>
                                <input
                                  type="text"
                                  name="invoice_number"
                                  value={formData.invoice_number}
                                  onChange={handleChange}
                                  disabled
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm bg-gray-100 cursor-not-allowed"
                                />
                                {formError.invoice_number && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.invoice_number}
                                  </p>
                                )}
                              </div>

                              {/* 3️⃣ Company */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Company
                                </label>
                                <select
                                  name="company_id"
                                  value={formData.company_id}
                                  onChange={handleChange}
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                >
                                  <option value="">Select Company</option>
                                  {compines?.map((company) => (
                                    <option
                                      key={company.id}
                                      value={company?.id}
                                    >
                                      {company?.compdesc}
                                    </option>
                                  ))}
                                </select>
                                {formError.company_id && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.company_id}
                                  </p>
                                )}
                              </div>

                              {/* 4️⃣ Location */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Location
                                </label>
                                <select
                                  name="location_id"
                                  value={formData.location_id}
                                  onChange={handleChange}
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                >
                                  <option value="">Select Location</option>
                                  {locations?.map((location) => (
                                    <option
                                      key={location.id}
                                      value={location?.id}
                                    >
                                      {location?.locname}
                                    </option>
                                  ))}
                                </select>
                                {formError.location_id && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.location_id}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* =============================== 📍 Location & Sales =============================== */}
                          <div className="bg-gray-100 rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                              Customer & Sales
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* 2️⃣ Customer */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Customer
                                </label>
                                <input
                                  type="text"
                                  value={
                                    autocompleteValue
                                      ? `${autocompleteValue.customer_code} - ${autocompleteValue.first_name} ${autocompleteValue.last_name}`
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const selected = Customers.find(
                                      (c) =>
                                        `${c.customer_code} - ${c.first_name} ${c.last_name}` ===
                                        e.target.value
                                    );
                                    handleAutocompleteChange(
                                      null,
                                      selected || null,
                                      "vendor"
                                    );

                                    if (selected) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        customer_id: selected.id,
                                      }));
                                    }
                                  }}
                                  placeholder="Select Customer"
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                  list="customer-options"
                                />
                                <datalist id="customer-options">
                                  {Customers?.map((c) => (
                                    <option
                                      key={c.customer_code}
                                      value={`${c.customer_code} - ${c.first_name} ${c.last_name}`}
                                    />
                                  ))}
                                </datalist>
                                {formError.customer && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.customer}
                                  </p>
                                )}
                              </div>

                              {/* 5️⃣ Salesman */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Salesman
                                </label>
                                <input
                                  type="text"
                                  value={
                                    autocompleteSalesmanValue
                                      ? `${autocompleteSalesmanValue.salesman_code}-${autocompleteSalesmanValue?.users?.firstname}`
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const selected = Salesmans.find(
                                      (s) =>
                                        `${s.salesman_code}-${s?.users?.firstname}` ===
                                        e.target.value
                                    );
                                    setAutocompleteSalesmanValue(
                                      selected || null
                                    );

                                    if (selected) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        salesman_id: selected.user_id,
                                      }));
                                    }
                                  }}
                                  placeholder="Select Salesman"
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                  list="salesman-options"
                                />
                                <datalist id="salesman-options">
                                  {Salesmans?.map((s) => (
                                    <option
                                      key={s.salesman_code}
                                      value={`${s.salesman_code}-${s?.users?.firstname}`}
                                    />
                                  ))}
                                </datalist>
                                {formError.salesman && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.salesman}
                                  </p>
                                )}
                              </div>

                              {/* 6️⃣ Delivery Date */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Delivery Date
                                </label>
                                <input
                                  type="date"
                                  value={formData.delivery_date}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      delivery_date: e.target.value,
                                    })
                                  }
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                />
                                {/* {formError.delivery_date && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.delivery_date}
                                  </p>
                                )} */}
                              </div>
                            </div>
                          </div>

                          {/* =============================== 💰 Payment & Invoice =============================== */}
                          <div className="bg-gray-100 rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                              Payment & Invoice
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* 7️⃣ Payment Terms */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Payment Terms
                                </label>
                                <input
                                  type="text"
                                  value={autocompletePaymentValue?.label || ""}
                                  onChange={(e) => {
                                    const selected = payment_term.find(
                                      (p) => p.label === e.target.value
                                    );
                                    setAutocompletePaymentValue(
                                      selected || null
                                    );

                                    if (selected) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        payment_terms: selected.value,
                                      }));
                                    }
                                  }}
                                  placeholder="Select Payment Term"
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                  list="payment-options"
                                />
                                <datalist id="payment-options">
                                  {payment_term?.map((p) => (
                                    <option key={p.value} value={p.label} />
                                  ))}
                                </datalist>
                                {formError.payment_term && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.payment_term}
                                  </p>
                                )}
                              </div>

                              {/* 8️⃣ Customer Document No */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Customer Document No
                                </label>
                                <input
                                  type="text"
                                  name="customer_lpo"
                                  value={formData.customer_lpo}
                                  onChange={handleChange}
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                />
                                {/* {formError.customer_lpo && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.customer_lpo}
                                  </p>
                                )} */}
                              </div>

                              {/* 9️⃣ Due Date */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Due Date
                                </label>
                                <input
                                  type="date"
                                  value={formData.due_date}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      due_date: e.target.value,
                                    })
                                  }
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                />
                                {/* {formError.due_date && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.due_date}
                                  </p>
                                )} */}
                              </div>

                              {/* 🔟 Invoice Type */}
                              <div>
                                <label className="block text-gray-600 text-sm mb-1 font-medium">
                                  Invoice Type
                                </label>
                                <input
                                  type="text"
                                  value={formData.invoice_type || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      invoice_type: e.target.value,
                                    })
                                  }
                                  placeholder="Select Invoice Type"
                                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 text-sm"
                                  list="invoice-type-options"
                                />
                                <datalist id="invoice-type-options">
                                  {["Normal", "Consignment"].map((type) => (
                                    <option key={type} value={type} />
                                  ))}
                                </datalist>
                                {formError.invoice_type && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {formError.invoice_type}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Grid item xs={12} pb={6}>
                        {/* ============================ 🧾 ITEM DETAILS TABLE CARD ============================ */}
                        <Box
                          sx={{
                            background: "#fff",
                            borderRadius: "16px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            overflowX: "auto",
                            p: 3,
                            mb: 4,
                          }}
                        >
                          <TableContainer>
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#f0f7ff" }}>
                                  {[
                                    "ITEM CODE",
                                    "ITEM NAME",
                                    "UOM",
                                    "Quantity",
                                    "Scheme",
                                    "Price",
                                    "Discount Type",
                                    "Discount",
                                    "Net",
                                    "Tax%",
                                    "Tax Amt",
                                    "Total",
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
                                        backgroundColor: "#eaf2ff",
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
                                      "&:hover": { backgroundColor: "#f9fafb" },
                                    }}
                                  >
                                    {/* ITEM CODE */}
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 250 }}
                                    >
                                      <Autocomplete
                                        disablePortal
                                        options={filteredItems}
                                        getOptionLabel={(option) =>
                                          // option.item_code || ""
                                          option?.item_code && option?.item_name
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

                                    {/* ITEM NAME */}
                                    <TableCell>
                                      <MDInput
                                        value={row.item_name}
                                        disabled
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    {/* UOM */}
                                    <TableCell>
                                      <MDInput
                                        value={row.item_uom}
                                        disabled
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    {/* Quantity */}
                                    <TableCell>
                                      <MDInput
                                        type="number"
                                        name="quantity"
                                        value={row.quantity}
                                        onChange={(e) =>
                                          itemquantityChange(e, row)
                                        }
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    {/* Scheme */}
                                    <TableCell>
                                      <Select
                                        value={row.skim || "None"}
                                        sx={{
                                          height: "40px",
                                          "& .MuiSelect-select": {
                                            padding: "8px 14px",
                                          },
                                          "& .MuiOutlinedInput-notchedOutline":
                                            {
                                              borderColor: "#c4c4c4",
                                            },
                                          "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                              borderColor: "#000",
                                            },
                                        }}
                                        onChange={(event) =>
                                          handleSkimChange(
                                            event.target.value,
                                            rowIndex
                                          )
                                        }
                                        size="small"
                                        fullWidth
                                      >
                                        <MenuItem value="None">None</MenuItem>
                                        <MenuItem value="Free">Free</MenuItem>
                                      </Select>
                                    </TableCell>

                                    {/* Price */}
                                    <TableCell>
                                      <MDInput
                                        type="number"
                                        name="price"
                                        value={row.price}
                                        onChange={(e) =>
                                          itemquantityChange(e, row)
                                        }
                                        variant="outlined"
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <Select
                                        value={row.discounttype}
                                        name="discounttype"
                                        onChange={(event) =>
                                          itemquantityChange(event, row)
                                        }
                                        sx={{
                                          fontSize: "12px",
                                          width: "100%",
                                          height: "43px",
                                        }}
                                      >
                                        <MenuItem value="Percentage">
                                          Percentage
                                        </MenuItem>
                                        <MenuItem value="Amount">
                                          Amount
                                        </MenuItem>
                                      </Select>
                                    </TableCell>

                                    {/* Discount */}
                                    <TableCell>
                                      <MDInput
                                        type="number"
                                        name="discount"
                                        value={row.discount}
                                        onChange={(e) =>
                                          itemquantityChange(e, row)
                                        }
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    {/* Net */}
                                    <TableCell>
                                      <MDInput
                                        value={row.net}
                                        disabled
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    {/* Tax% */}
                                    <TableCell>
                                      <MDInput
                                        value={row.vat}
                                        disabled
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    {/* Tax Amt */}
                                    <TableCell>
                                      <MDInput
                                        value={row.taxa_ble}
                                        disabled
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    {/* Total */}
                                    <TableCell>
                                      <MDInput
                                        value={row.total}
                                        disabled
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    {/* Action */}
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

                          {/* ➕ Add Row Button */}
                          <Box sx={{ textAlign: "right", mt: 2 }}>
                            <MDButton
                              variant="contained"
                              color="secondary"
                              onClick={handleAddRow}
                            >
                              Add Row
                            </MDButton>
                          </Box>
                        </Box>

                        {/* ============================ 📝 NOTE & TOTAL SUMMARY CARD ============================ */}
                        <Grid container spacing={3}>
                          {/* Vendor Note */}
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{
                                backgroundColor: "#f3f4f6", // bg-gray-100
                                borderRadius: "16px", // rounded-2xl
                                border: "1px solid #f3f4f6", // border-gray-100
                                boxShadow:
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)", // shadow-md
                                p: 3, // p-6 → 24px (spacing * 8)
                                transition: "all 0.3s ease", // transition-all duration-300
                                "&:hover": {
                                  boxShadow:
                                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)", // hover:shadow-lg
                                },
                              }}
                            >
                              <InputLabel
                                sx={{ fontSize: 15, fontWeight: 600, mb: 1 }}
                              >
                                Customer Note
                              </InputLabel>
                              <MDInput
                                variant="outlined"
                                sx={{ width: "100%" }}
                              />
                            </Box>
                          </Grid>

                          {/* Totals Section */}
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{
                                backgroundColor: "#444",
                                color: "#fff",
                                borderRadius: "12px",
                                p: 3,
                                boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                              }}
                            >
                              <Grid container spacing={1}>
                                {[
                                  ["Total", sums.initialTotal],
                                  ["Discount", sums.discount],
                                  ["Net Total", sums.net],
                                  ["Tax", sums.vat],
                                  ["Grand Total", sums.total],
                                ].map(([label, value]) => (
                                  <React.Fragment key={label}>
                                    <Grid item xs={6}>
                                      <Typography
                                        sx={{ fontSize: 14, opacity: 0.9 }}
                                      >
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
                                  </React.Fragment>
                                ))}
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* ============================ 🔘 ACTION BUTTONS ============================ */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
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

export default Add_Invoice;
