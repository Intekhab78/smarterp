import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { ShoppingCart } from "lucide-react";

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
import { axios_get, axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import "../../formStyle.css";

const payment_term = [
  { label: "Cash", value: "1" },
  { label: "BILL TO BILL PAYMENT AR", value: "2" },
  { label: "Net 90 Days", value: "3" },
  { label: "NET 30 DAYS", value: "4" },
  { label: "Net 60 Days", value: "5" },
  { label: "Cash on Delivery", value: "6" },
  { label: "Net 45 Days", value: "7" },
];

function Add_Orders() {
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
  const [formData, setFormData] = useState({
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    order_number: "",
    delivery_date: "",
    payment_terms: "",
    location_id: "",
    company_id: "",
    due_date: "",
    status: "Open",
    order_type: "Normal",
    type: "sales order",
    any_comment: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    OrderNuberRange();
    fetchcompanyList();
  }, []);

  // const ItemList = async () => {
  //   const response = await axios_get(true, "item/dropdown-list");
  //   if (response) {
  //     if (response.status) {
  //       setItem(response.data);
  //     } else {
  //       ToastMassage(response.message, "error");
  //     }
  //   }
  // };

  const user_data = JSON.parse(localStorage.getItem("user_data"));
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
          itm.location_id === formData.location_id
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
          order_number: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const handleAutocompleteChange = (event, newValue, type) => {
    // console.log('newValue',newValue)
    if (type == "customer") {
      setAutocompleteValue(newValue);
      setSelectedCustomer(newValue);
      console.log("new value s ------", newValue);

      setFormData((prevData) => ({
        ...prevData,
        customer_id: newValue == null ? "" : newValue?.customer_code,
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
        quantity: (0.0).toFixed(2),
        skim: "None",
        price: (0.0).toFixed(2),
        excise: (0.0).toFixed(2),
        discounttype: "Percentage",
        discount: (0.0).toFixed(2),
        net: (0.0).toFixed(2),
        vat: 0,
        ptr_di: "",
        taxa_ble: "",
        cgst: "",
        cgst_amount: "",
        sgst: "",
        sgst_amount: "",
        igst: "",
        igst_amount: "",
        total: (0.0).toFixed(2),
        actions: "",
        newValue: "",
        uom_list: [],
        originalPrice: 0.0,
        originalDiscount: 0.0,
        originalNet: 0.0,
        originalVat: 0,
        originalTotal: 0.0,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const ItemSelect = (newValue, params) => {
    const updatedRows = rows.map((row) =>
      row.id === params.id
        ? {
            ...row,
            item_id: newValue?.id,
            item_code: newValue?.item_code,
            item_name: newValue?.item_name,
            uom: newValue?.item_main_prices?.[0].item_uom?.id,
            item_uom: newValue?.item_main_prices?.[0].item_uom?.name,
            quantity: (1.0).toFixed(2),
            uom_list: newValue?.item_main_prices,
            newValue: newValue,
            price: parseFloat(newValue?.itemprice).toFixed(2),
            vat: parseFloat(newValue?.tax_master_1?.taxcal),
            taxa_ble: (
              (parseFloat(newValue?.itemprice) *
                1 *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
              100
            ).toFixed(2),
            total: (
              parseFloat(newValue?.itemprice) +
              (parseFloat(newValue?.itemprice) *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
                100
            ).toFixed(2),
            // total: newValue?.itemprice,
            net: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
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

  const [grandTotal, setGrandTotal] = useState(0);

  // Helper function to recalculate grand total
  const calculateGrandTotal = (updatedRows) => {
    const grandTotal = updatedRows.reduce(
      (acc, row) => acc + parseFloat(row.total || 0),
      0
    );
    setGrandTotal(parseFloat(grandTotal.toFixed(2))); // make sure you have setGrandTotal defined in your state
  };

  // Main function
  const itemquantityChange = (eventOrQuantity, params) => {
    const { name, value } = eventOrQuantity?.target || {
      name: null,
      value: null,
    };

    if (!name || value === undefined) {
      return;
    }

    let itemPrice = parseFloat(params.price);

    if (name === "quantity") {
      const totalquantity = value;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(params.discount);
      const typeDiscount = params.discounttype;
      let itemNet;

      if (typeDiscount === "Percentage") {
        itemNet = itemss - (itemss * itemDiscount) / 100;
      } else {
        itemNet = itemss - itemDiscount;
      }

      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      const itemTotal = parseFloat(itemNet);
      const taxa_ble = (itemNet * (parseFloat(params.vat) / 100)).toFixed(2);

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: totalquantity,
              price: itemPrice,
              discount: itemDiscount,
              net: itemNet.toFixed(2),
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              taxa_ble: taxa_ble,
            }
          : row
      );

      setRows(updatedRows);
      calculateGrandTotal(updatedRows); // ✅ Recalculate Grand Total
    } else if (name === "price") {
      itemPrice = value;
      const totalquantity = params.quantity;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(params.discount);
      const typeDiscount = params.discounttype;
      let itemNet;

      if (typeDiscount === "Percentage") {
        itemNet = itemss - (itemss * itemDiscount) / 100;
      } else {
        itemNet = itemss - itemDiscount;
      }

      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      const itemTotal = parseFloat(itemNet);
      const taxa_ble = (itemNet * (parseFloat(params.vat) / 100)).toFixed(2);

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: totalquantity,
              vat: parseFloat(params.vat),
              // vat: 5,
              taxa_ble: taxa_ble,
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              price: itemPrice,
              discount: itemDiscount,
              net: itemNet.toFixed(2),
            }
          : row
      );

      setRows(updatedRows);
      calculateGrandTotal(updatedRows); // ✅ Recalculate Grand Total
    } else if (name === "discount") {
      const totalquantity = params.quantity;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(value);
      const typeDiscount = params.discounttype;
      let itemNet;

      if (typeDiscount === "Percentage") {
        itemNet = itemss - (itemss * itemDiscount) / 100;
      } else {
        itemNet = itemss - itemDiscount;
      }

      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      const itemTotal = parseFloat(itemNet);
      const taxa_ble = (itemNet * (parseFloat(params.vat) / 100)).toFixed(2);

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: parseFloat(totalquantity).toFixed(2),
              vat: parseFloat(row?.vat),
              taxa_ble: taxa_ble,
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              price: parseFloat(itemPrice).toFixed(2),
              discount: itemDiscount,
              net: itemNet.toFixed(2),
            }
          : row
      );

      setRows(updatedRows);
      calculateGrandTotal(updatedRows); // ✅ Recalculate Grand Total
    } else if (name === "discounttype") {
      const totalquantity = params.quantity;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(params.discount);
      const typeDiscount = value;
      let itemNet;

      if (typeDiscount === "Percentage") {
        itemNet = itemss - (itemss * itemDiscount) / 100;
      } else {
        itemNet = itemss - itemDiscount;
      }

      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      const itemTotal = parseFloat(itemNet);
      const taxa_ble = (itemNet * (parseFloat(params.vat) / 100)).toFixed(2);

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              discounttype: typeDiscount,
              quantity: parseFloat(totalquantity).toFixed(2),
              vat: parseFloat(row?.vat),
              taxa_ble: taxa_ble,
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              price: parseFloat(itemPrice).toFixed(2),
              discount: itemDiscount,
              net: itemNet.toFixed(2),
            }
          : row
      );

      setRows(updatedRows);
      calculateGrandTotal(updatedRows); // ✅ Recalculate Grand Total
    }
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
                    price: parseFloat(row.newValue?.itemprice).toFixed(2),
                    vat: parseFloat(row.newValue?.tax_master_1?.taxcal),
                    taxa_ble: (
                      (parseFloat(row.newValue?.itemprice) *
                        1 *
                        parseFloat(row.newValue?.tax_master_1?.taxcal)) /
                      100
                    ).toFixed(2),
                    total: (
                      parseFloat(row.newValue?.itemprice) +
                      (parseFloat(row.newValue?.itemprice) *
                        parseFloat(row.newValue?.tax_master_1?.taxcal)) /
                        100
                    ).toFixed(2),
                    net: (parseFloat(row.newValue?.itemprice) * 1).toFixed(2),
                  }),
            }
          : row
      )
    );
  };

  const validation = (formData) => {
    let errors = {};

    if (!formData.customer_id) {
      errors.customer = "Customer is required";
    }
    // if (!formData.status) {
    //     errors.status = "Status is required";
    // }

    if (!formData.order_number) {
      errors.order_number = "Order Number is required";
    }
    if (!formData.order_type) {
      errors.order_type = "Type is required";
    }

    if (!formData.salesman_id) {
      errors.salesman = "Salesman is required";
    }

    if (!formData.delivery_date) {
      errors.delivery_date = "Delivery Date is required";
    }

    if (!formData.payment_terms) {
      errors.payment_term = "Payment Terms are required";
    }

    if (!formData.due_date) {
      errors.due_date = "Due Date is required";
    }
    if (!formData.customer_lpo) {
      errors.customer_lpo = "Customer lpo is required";
    }

    return errors;
  };

  const handleSubmit1 = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    let invalidRow = rows.some(
      (row) =>
        row.skim === "None" &&
        (!row.quantity || !row.price || row.quantity <= 0 || row.price <= 0)
    );
    if (invalidRow) {
      setisSubmit(false);
      // setFormError({ general: "Quantity and Price cannot be null or zero." });
      ToastMassage("Quantity and Price cannot be null or zero.", "error");
      return;
    }
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      if (rows.length == 0) {
        setisSubmit(false);
        setFormError({});
        setItemError("Please select item");
        ToastMassage("Please select item", "error");
        // console.log("formData", formData);
      } else {
        setFormError({});
        let finalPramas = {
          ...formData,
          discount: sums.discount,
          net: sums.net,
          excise: sums.excise,
          vat: sums.vat,
          total: sums.total,
          items: rows,
        };
        console.log("final params is ---------------", finalPramas);

        const response = await axios_post(true, "order/add", finalPramas);
        if (response) {
          setisSubmit(false);
          if (response.status) {
            ToastMassage(response.message, "success");
            navigate("/order");
          } else {
            ToastMassage(response.message, "error");
          }
        }
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent double submit
    if (isSubmit) return;

    // ---------- VALIDATION FIRST ----------
    let errors = validation(formData);

    let invalidRow = rows.some(
      (row) =>
        row.skim === "None" &&
        (!row.quantity || !row.price || row.quantity <= 0 || row.price <= 0)
    );

    if (invalidRow) {
      ToastMassage("Quantity and Price cannot be null or zero.", "error");
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    if (rows.length === 0) {
      setItemError("Please select item");
      ToastMassage("Please select item", "error");
      return;
    }

    // ---------- START LOADER ----------
    setisSubmit(true);

    try {
      setFormError({});
      setItemError("");

      const finalParams = {
        ...formData,
        discount: sums.discount,
        net: sums.net,
        excise: sums.excise,
        vat: sums.vat,
        total: sums.total,
        items: rows,
      };

      const response = await axios_post(true, "order/add", finalParams);

      if (response?.status) {
        ToastMassage(response.message, "success");
        navigate("/order");
      } else {
        ToastMassage(response?.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);
      ToastMassage("Server error. Please try again.", "error");
    } finally {
      // ---------- ALWAYS STOP LOADER ----------
      setisSubmit(false);
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
    console.log("items form the add order is -------", items);

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
    navigate("/order");
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
                    <ShoppingCart className="w-6 h-6 animate-bounce" />
                    <h2 className="text-xl font-semibold tracking-wide drop-shadow-sm">
                      Add Order
                    </h2>
                  </div>

                  {/* Right Section */}
                  <Link
                    to="/order"
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
                      <MDBox pt={4} pb={3} px={3}>
                        {/* ===== 🧾 Vendor Information ===== */}
                        <div className="bg-gray-10 rounded-2xl shadow-md p-6 mb-6 hover:shadow-lg transition-all duration-300">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                            🧾 Customer Information
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                            {/* Order Number */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Order Number
                              </InputLabel>
                              <MDInput
                                type="text"
                                variant="outlined"
                                name="order_number"
                                value={formData.order_number}
                                onChange={handleChange}
                                disabled
                                className="small-input w-full"
                              />
                              {formError.order_number && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.order_number}
                                </MDTypography>
                              )}
                            </div>
                            {/* Company */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Company
                              </InputLabel>
                              <Select
                                name="company_id"
                                value={formData.company_id}
                                onChange={handleChange}
                                sx={{ width: "100%", height: 45 }}
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

                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Location
                              </InputLabel>
                              <Select
                                name="location_id"
                                value={formData.location_id}
                                onChange={handleChange}
                                sx={{ width: "100%", height: 45 }}
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
                            </div>
                            {/* Vendor */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300 relative">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Customer
                              </InputLabel>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={Customers}
                                getOptionLabel={(option) =>
                                  option.customer_code || ""
                                }
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {option.customer_code}-{option?.first_name}
                                  </li>
                                )}
                                value={autocompleteValue}
                                onChange={(event, newValue) =>
                                  handleAutocompleteChange(
                                    event,
                                    newValue,
                                    "customer"
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="small-input"
                                    placeholder="Select Customer"
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

                              {/* Vendor details section (independent scroll area) */}
                              {selectedCustomer && (
                                <div className="mt-3 bg-blue-50 p-3 rounded-lg overflow-y-auto max-h-32 border border-blue-100">
                                  <MDTypography fontSize="small">
                                    TAX No: {selectedCustomer.gst_number}
                                  </MDTypography>
                                  <MDTypography fontSize="small">
                                    Address: {selectedCustomer?.billing_address}
                                  </MDTypography>
                                  {/* <MDTypography fontSize="small">
                                    Contact Person:{" "}
                                    {selectedCustomer?.first_name}{" "}
                                    {selectedCustomer?.last_name}
                                  </MDTypography> */}
                                  <MDTypography fontSize="small">
                                    Contact: {selectedCustomer.phone}
                                  </MDTypography>
                                  <MDTypography fontSize="small">
                                    Email: {selectedCustomer.email}
                                  </MDTypography>
                                </div>
                              )}
                            </div>

                            {/* Delivery Date */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Delivery Date
                              </InputLabel>
                              <MDInput
                                type="date"
                                variant="outlined"
                                value={formData.delivery_date}
                                className="small-input w-full"
                                inputProps={{
                                  min: new Date().toISOString().split("T")[0],
                                }}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    delivery_date: e.target.value,
                                  })
                                }
                              />
                              {formError.delivery_date && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.delivery_date}
                                </MDTypography>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ===== 📦 Order Info ===== */}
                        <div className="bg-gray-10 rounded-2xl shadow-md p-6 mb-6 hover:shadow-lg transition-all duration-300">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                            📦 Order Information
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Employee */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Employee
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
                                    "salesman"
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="small-input"
                                    placeholder="Select Employee"
                                  />
                                )}
                              />
                              {formError.salesman && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.salesman}
                                </MDTypography>
                              )}
                            </div>

                            {/* Payment Terms */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
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
                                    "payment_term"
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="small-input"
                                    placeholder="Select Payment Term"
                                  />
                                )}
                              />
                              {formError.payment_term && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.payment_term}
                                </MDTypography>
                              )}
                            </div>

                            {/* Vendor LPO */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Customer LPO
                              </InputLabel>
                              <MDInput
                                type="text"
                                variant="outlined"
                                name="customer_lpo"
                                value={formData.customer_lpo}
                                onChange={handleChange}
                                className="small-input w-full"
                              />
                              {formError.customer_lpo && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.customer_lpo}
                                </MDTypography>
                              )}
                            </div>
                            {/* Due Date */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Due Date
                              </InputLabel>
                              <MDInput
                                type="date"
                                variant="outlined"
                                value={formData.due_date}
                                className="small-input w-full"
                                inputProps={{
                                  min: new Date().toISOString().split("T")[0],
                                }}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    due_date: e.target.value,
                                  })
                                }
                              />
                              {formError.due_date && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.due_date}
                                </MDTypography>
                              )}
                            </div>

                            {/* Order Type */}
                            <div className="bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                              <InputLabel className="text-gray-700 font-semibold mb-2 block">
                                Order Type
                              </InputLabel>
                              <Autocomplete
                                options={["Normal", "Consignment"]}
                                value={formData.order_type}
                                onChange={(event, newValue) =>
                                  setFormData({
                                    ...formData,
                                    order_type: newValue,
                                  })
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="small-input"
                                    placeholder="Select Order Type"
                                  />
                                )}
                              />
                              {formError.order_type && (
                                <MDTypography
                                  color="error"
                                  sx={{ fontSize: "14px", mt: "10px" }}
                                >
                                  {formError.order_type}
                                </MDTypography>
                              )}
                            </div>
                          </div>
                        </div>
                      </MDBox>

                      <Grid item xs={12} pb={6}>
                        {/* Table Section */}
                        <Box className="overflow-x-auto mb-4 rounded-xl shadow-sm border border-gray-200">
                          <TableContainer>
                            <Table className="min-w-[800px] text-sm">
                              <TableHead className="bg-gray-100">
                                <TableRow>
                                  {[
                                    "ITEM CODE",
                                    "ITEM NAME",
                                    // "UOM",
                                    "Scheme",
                                    "Quantity",

                                    "Price",
                                    "Total",
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
                                      className="text-sm  text-gray-700 whitespace-nowrap py-2 px-3"
                                      sx={{
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
                                {rows.map((row, rowIndex) => (
                                  <TableRow
                                    key={rowIndex}
                                    className="hover:bg-gray-50 transition duration-150"
                                  >
                                    {/* ITEM CODE */}
                                    <TableCell
                                      sx={{ minWidth: 250 }}
                                      className="text-sm py-2 px-3"
                                    >
                                      <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={filteredItems}
                                        getOptionLabel={(option) =>
                                          // option.item_code || ""
                                          // `${option.item_code} ${option.item_name}` ||
                                          // ""
                                          option?.item_code && option?.item_name
                                            ? `${option.item_code} ${option.item_name}`
                                            : ""
                                        }
                                        renderOption={(props, option) => (
                                          <li {...props}>
                                            {option.item_code}-
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
                                            variant="outlined"
                                            size="small"
                                          />
                                        )}
                                      />
                                    </TableCell>

                                    {/* ITEM NAME */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="text"
                                        value={row.item_name}
                                        disabled
                                        variant="outlined"
                                        className="text-sm"
                                        sx={{ minWidth: 250 }}
                                      />
                                    </TableCell>

                                    {/* UOM */}
                                    {/* <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="text"
                                        value={row.item_uom}
                                        disabled
                                        variant="outlined"
                                        className="text-sm"
                                      />
                                    </TableCell> */}
                                    {/* Scheme */}
                                    <TableCell className="text-sm py-2 px-3">
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
                                        className="w-full"
                                      >
                                        <MenuItem value="None">None</MenuItem>
                                        <MenuItem value="Free">Free</MenuItem>
                                      </Select>
                                    </TableCell>

                                    {/* Quantity */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.quantity}
                                        name="quantity"
                                        onChange={(event) => {
                                          const value = parseFloat(
                                            event.target.value
                                          );
                                          if (
                                            value >= 1 ||
                                            event.target.value === ""
                                          ) {
                                            itemquantityChange(event, row);
                                          }
                                        }}
                                        onBlur={(event) => {
                                          const value = parseFloat(
                                            event.target.value
                                          );
                                          if (value < 1) {
                                            itemquantityChange(
                                              {
                                                target: {
                                                  name: "price",
                                                  value: 1,
                                                },
                                              },
                                              row
                                            );
                                          }
                                        }}
                                      />
                                    </TableCell>

                                    {/* Price */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        name="price"
                                        value={row.price}
                                        onChange={(event) => {
                                          const value = parseFloat(
                                            event.target.value
                                          );
                                          if (
                                            value >= 1 ||
                                            event.target.value === ""
                                          ) {
                                            itemquantityChange(event, row);
                                          }
                                        }}
                                      />
                                    </TableCell>
                                    {/* total */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        name="price"
                                        value={parseFloat(
                                          row.price * row.quantity
                                        )}
                                        onChange={(event) => {
                                          const value = parseFloat(
                                            event.target.value
                                          );
                                          if (
                                            value >= 1 ||
                                            event.target.value === ""
                                          ) {
                                            itemquantityChange(event, row);
                                          }
                                        }}
                                      />
                                    </TableCell>

                                    {/* Discount Type */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <Select
                                        value={row.discounttype}
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
                                        name="discounttype"
                                        onChange={(event) =>
                                          itemquantityChange(event, row)
                                        }
                                        size="small"
                                        className="w-full"
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
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        name="discount"
                                        value={row.discount}
                                        onChange={(event) =>
                                          itemquantityChange(event, row)
                                        }
                                      />
                                    </TableCell>

                                    {/* Net */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.net}
                                        disabled
                                      />
                                    </TableCell>

                                    {/* Tax% */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.vat}
                                        disabled
                                      />
                                    </TableCell>

                                    {/* Tax Amt */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.taxa_ble}
                                        disabled
                                      />
                                    </TableCell>

                                    {/* Total */}
                                    <TableCell className="text-sm py-2 px-3">
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.total}
                                        disabled
                                      />
                                    </TableCell>

                                    {/* Action */}
                                    <TableCell className="text-sm py-2 px-3 text-center">
                                      <MDButton
                                        variant="outlined"
                                        color="error"
                                        iconOnly
                                        onClick={() =>
                                          handleRemoveRow(rowIndex)
                                        }
                                        className="hover:bg-red-50"
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

                        {/* Add Row Button */}
                        <MDButton
                          variant="contained"
                          color="secondary"
                          onClick={handleAddRow}
                          className="mt-2 shadow-sm"
                        >
                          Add Row
                        </MDButton>
                      </Grid>

                      {/* Vendor Note + Totals */}
                      {/* Vendor Note + Totals */}
                      <Grid
                        item
                        xs={12}
                        className="mt-6 border-t border-gray-200 pt-4"
                      >
                        <Grid container spacing={2}>
                          {/* LEFT SIDE - Customer Note */}
                          <Grid item xs={7}>
                            <InputLabel className="text-sm font-medium text-gray-800 mb-1">
                              Customer Note
                            </InputLabel>

                            <textarea
                              name="any_comment"
                              className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                              value={formData.any_comment || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  any_comment: e.target.value,
                                })
                              }
                              placeholder="Enter any additional notes here..."
                            ></textarea>
                          </Grid>

                          {/* RIGHT SIDE - Totals Box */}
                          <Grid item xs={5}>
                            <div className=" text-sm text-white border border-gray-700 rounded-xl shadow-sm px-6 py-4">
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
                                      <MDTypography className="text-sm text-gray-300">
                                        {label}
                                      </MDTypography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <MDTypography className="text-sm font-semibold text-white">
                                        {parseFloat(value).toFixed(2)}
                                      </MDTypography>
                                    </Grid>
                                  </React.Fragment>
                                ))}
                              </Grid>
                            </div>

                            {/* Buttons */}
                            {/* <div className="flex justify-center gap-4 mt-4">
                              <MDButton
                                variant="gradient"
                                disabled={isSubmit}
                                color="info"
                                type="submit"
                                className="px-6"
                              >
                                {isSubmit ? (
                                  <CircularProgress color="white" size={24} />
                                ) : (
                                  "Save"
                                )}
                              </MDButton>

                              <MDButton
                                variant="gradient"
                                disabled={isSubmit}
                                color="secondary"
                                onClick={handleBack}
                                className="px-6"
                              >
                                Cancel
                              </MDButton>
                            </div> */}

                            <div className="flex justify-center gap-4 mt-4">
                              <MDButton
                                variant="gradient"
                                color="info"
                                type="submit"
                                disabled={isSubmit}
                                className="px-6 min-w-[120px]"
                              >
                                {isSubmit ? (
                                  <CircularProgress color="inherit" size={22} />
                                ) : (
                                  "Save"
                                )}
                              </MDButton>

                              <MDButton
                                variant="gradient"
                                color="secondary"
                                disabled={isSubmit}
                                onClick={handleBack}
                                className="px-6"
                              >
                                Cancel
                              </MDButton>
                            </div>
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

export default Add_Orders;
