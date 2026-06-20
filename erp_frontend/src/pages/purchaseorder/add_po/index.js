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
  createFilterOptions,
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

const payment_term = [
  { label: "Cash", value: "1" },
  { label: "BILL TO BILL PAYMENT AR", value: "2" },
  { label: "Net 90 Days", value: "3" },
  { label: "NET 30 DAYS", value: "4" },
  { label: "Net 60 Days", value: "5" },
  { label: "Cash on Delivery", value: "6" },
  { label: "Net 45 Days", value: "7" },
];

function Add_Po() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [rows, setRows] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSalesmanValue, setAutocompleteSalesmanValue] =
    useState("");
  const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
  const [item, setItem] = useState([]);
  const [itemColor, setItemColor] = useState([]);
  const [Customers, setCustomerList] = useState([]);
  const [Salesmans, setSalesmanList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    salesman_id: "",
    customer_lpo: "",
    order_number: "",
    delivery_date: "",
    payment_terms: "",
    location_id: "",
    company_id: "",
    vendor_note: "",
    status: "Open",
    type: "purchase order",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    OrderNuberRange();
    fetchlocationList();
    fetchcompanyList();
    ItemColor();
  }, []);

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

    console.log("fetchlocationList-------------", response.data);

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

    console.log("response is from item_location_master", response.data);

    if (response) {
      if (response.status) {
        setItem(response.data); // store full data
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const ItemColor = async () => {
    const response = await axios_post(true, "item_color/list");

    // console.log("response is from color", response.data);

    if (response) {
      if (response.status) {
        setItemColor(response.data); // store full data
        // alert("hiiii");
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  useEffect(() => {
    console.log(
      "formData.company_id && formData.location_id",
      formData.company_id,
      formData.location_id
    );

    if (formData.company_id && formData.location_id) {
      console.log("items is -------------", item);

      const filtered = item.filter(
        (itm) =>
          itm.company_id === formData.company_id &&
          itm.location_id === formData.location_id
      );
      setFilteredItems(filtered);
      console.log("filtered items is ------------", filtered);
    } else {
      setFilteredItems([]); // clear if not selected
    }
  }, [formData.company_id, formData.location_id, item]);

  const CustomerList = async () => {
    const response = await axios_post(true, "vendor/list");
    console.log("vndor list---", response.data.records);

    if (response) {
      if (response.status) {
        setCustomerList(response.data.records);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  // Custom filter to search by company_name and firstname
  const filterOptions = createFilterOptions({
    stringify: (option) =>
      `${option.company_name} ${option.firstname} ${option.vendor_code}`,
  });

  let user_data = JSON.parse(localStorage.getItem("user_data"));

  const SalesmanList = async () => {
    const response = await axios_post(
      true,
      "salesman/list",
      user_data.usertype === 3 ? { id: user_data.id } : {}
    );
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
      function_for: "purchase_order",
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
    if (type == "customer") {
      setAutocompleteValue(newValue);
      setSelectedCustomer(newValue);
      console.log("new value s ------", newValue);

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
        quantity: (0.0).toFixed(2),
        skim: "None",
        discounttype: "Percentage",

        sunit: "",
        hsn_code: "",
        receiving_site: "",
        expiry_delivery_date: "",
        currency: "INR",
        itemtype: "Finished Goods",
        landed_cost_per_unit: "",
        purchase_cost_per_unit: "",

        price: (0.0).toFixed(2),
        excise: (0.0).toFixed(2),
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
    console.log("newValue-------------", newValue);
    const updelivery_datedRows = rows.map((row) =>
      row.id === params.id
        ? {
            ...row,
            item_id: newValue?.id,
            item_code: newValue?.item_code,
            receiving_site: newValue?.batch_no,
            expiry_delivery_date: newValue?.exp_date,
            hsn_code: newValue?.short_code,
            item_name: newValue?.item_name,
            uom: newValue?.item_uom?.id,
            item_uom: newValue?.item_uom?.uomname,
            // uom: newValue?.item_main_prices?.[0].item_uom?.id,
            // item_uom: newValue?.item_main_prices?.[0].item_uom?.name,
            quantity: (1.0).toFixed(2),
            uom_list: newValue?.item_main_prices,
            newValue: newValue,
            price: parseFloat(newValue?.itemcost).toFixed(2),
            vat: parseFloat(newValue?.tax_master_1?.taxcal),
            taxa_ble: (
              (parseFloat(newValue?.itemcost) *
                1 *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
              100
            ).toFixed(2),
            // total: (parseFloat(newValue?.itemcost) +
            //     (parseFloat(newValue?.itemcost) *
            //         parseFloat(newValue?.item_tax) / 100)).toFixed(2),
            total: (
              parseFloat(newValue?.itemcost) +
              (parseFloat(newValue?.itemcost) *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
                100
            ).toFixed(2),
            // total: newValue?.itemcost,

            net: parseFloat(parseFloat(newValue?.itemcost) * 1).toFixed(2),
          }
        : row
    );
    setRows(updelivery_datedRows);
  };

  const ItemSelectUom = (newValue, params) => {
    const updelivery_datedRows = rows.map((row) =>
      row.id === params.id
        ? {
            ...row,
            uom: newValue?.item_uom?.id,
            newValue_uom: newValue,
          }
        : row
    );
    setRows(updelivery_datedRows);
  };

  const itemquantityChange = (eventOrQuantity, params) => {
    const { name, value } = eventOrQuantity?.target || {
      name: null,
      value: null,
    };

    console.log("name  is ---------------", name);
    console.log("value is ---------------", value);

    if (!name || value === undefined) {
      return;
    }

    let itemPrice = parseFloat(params.price);

    if (name === "quantity") {
      const totalquantity = value;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(params.discount);
      const typeDiscount = params.discounttype;
      // console.log("typeDiscount", typeDiscount);
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemss) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      const itemTotal = parseFloat(itemNet);
      const taxa_ble = (itemNet * (parseFloat(params.vat) / 100)).toFixed(2);

      const updelivery_datedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: totalquantity,
              price: itemPrice,
              discount: itemDiscount,
              net: parseFloat(itemNet),
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              taxa_ble: taxa_ble,
            }
          : row
      );
      setRows(updelivery_datedRows);
    } else if (name === "price") {
      itemPrice = value;
      const totalquantity = params.quantity;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(params.discount);
      const typeDiscount = params.discounttype;
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemss) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
      const itemTotal = parseFloat(itemNet);
      const taxa_ble = (itemNet * (parseFloat(params.vat) / 100)).toFixed(2);

      const updelivery_datedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: totalquantity,
              vat: parseFloat(params.vat),
              taxa_ble: taxa_ble,
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              price: itemPrice,
              discount: itemDiscount,
              net: itemNet,
            }
          : row
      );
      setRows(updelivery_datedRows);
    } else if (name === "discount") {
      const totalquantity = params.quantity;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = value;
      const typeDiscount = params.discounttype;
      // console.log("typeDiscount", typeDiscount);
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemss) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
      const itemTotal = parseFloat(itemNet);
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
      const taxa_ble = (itemNet * (parseFloat(params.vat) / 100)).toFixed(2);

      const updelivery_datedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: parseFloat(totalquantity).toFixed(2),
              vat: parseFloat(row?.vat),
              taxa_ble: taxa_ble,
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              price: parseFloat(itemPrice).toFixed(2),
              discount: itemDiscount,
              net: parseFloat(itemNet).toFixed(2),
            }
          : row
      );
      setRows(updelivery_datedRows);
    } else if (name === "discounttype") {
      const totalquantity = params.quantity;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(params.discount);
      const typeDiscount = value;
      // console.log("typeDiscount", typeDiscount);
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemss) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
      // console.log("itemNet", itemNet);
      const itemTotal = parseFloat(itemNet);
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
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
              net: parseFloat(itemNet).toFixed(2),
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "purchase_cost_per_unit") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              purchase_cost_per_unit: value,
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "landed_cost_per_unit") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              landed_cost_per_unit: parseFloat(value),
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "hsn_code") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              hsn_code: value,
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "receiving_site") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              receiving_site: value,
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "expiry_delivery_date") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              expiry_delivery_date: value,
            }
          : row
      );
      setRows(updatedRows);
    }
  };

  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        const itemTax = parseFloat(item?.newValue?.tax_master_1?.taxcal) || 0;
        const quantity = parseFloat(item.quantity) || 1.0;
        const price = parseFloat(item.price) || 0.0;
        const gross = price * quantity;

        const discountValue = parseFloat(item.discount) || 0.0;
        const discountType = item.discounttype || "Percentage"; // fallback if undefined

        let discountAmount = 0;

        if (discountType === "Percentage") {
          discountAmount = (gross * discountValue) / 100;
        } else {
          // discountType assumed "Amount"
          discountAmount = discountValue;
        }

        const netTotal = gross - discountAmount;
        const taxAmount = (netTotal * itemTax) / 100;
        const total = netTotal + taxAmount;

        sums.initialTotal += gross;
        sums.discount += discountAmount;
        sums.net += netTotal;
        sums.vat += taxAmount;
        sums.total += total;

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
  console.log("sums is ------------", sums);

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
          : row
      )
    );
  };
  const handleItemTypeChange = (value, rowIndex, name) => {
    if (name === "itemtype") {
      setRows((prevRows) =>
        prevRows.map((row, index) =>
          index === rowIndex
            ? {
                ...row,
                itemtype: value,
              }
            : row
        )
      );
    } else if (name === "currency") {
      setRows((prevRows) =>
        prevRows.map((row, index) =>
          index === rowIndex
            ? {
                ...row,
                currency: value,
              }
            : row
        )
      );
    }
  };

  const validation = (formData) => {
    let errors = {};

    if (!formData.customer_id) {
      errors.customer = "Supplier is required";
    }
    // if (!formData.status) {
    //     errors.status = "Status is required";
    // }

    if (!formData.order_number) {
      errors.order_number = "PO Number is required";
    }

    if (!formData.salesman_id) {
      errors.salesman = "Employee is required";
    }

    if (!formData.delivery_date) {
      errors.delivery_date = "Date is required";
    }

    if (!formData.payment_terms) {
      errors.payment_term = "Payment Terms are required";
    }
    if (!formData.customer_lpo) {
      errors.customer_lpo = "Supplier lpo is required";
    }

    return errors;
  };

  const options = filteredItems.map((item) => ({
    value: item.item_code,
    label: `${item.item_code} - ${item.item_name} | Color: [${item?.item_color?.itemcolname}] | Size: [${item?.size_master?.itemsizename}] - ${item.item_description}`,
  }));

  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    let invalidRow = rows.some(
      (row) =>
        row.skim === "None" &&
        (!row.quantity || !row.price || row.quantity <= 0 || row.price <= 0)
    );
    // console.log("rows", rows);

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

        console.log("params is ------------", finalPramas);

        const response = await axios_post(
          true,
          "purchase_order/store",
          finalPramas
        );
        if (response) {
          setisSubmit(false);
          if (response.status) {
            ToastMassage(response.message, "success");
            navigate("/purchaseorder");
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
      ...(name === "company_id" && { location_id: "" }),
    }));

    if (name === "company_id") {
      fetchlocationList(value);
    }
  };
  const handleBack = () => {
    navigate("/purchaseorder");
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
                      Add Purchase Order
                    </h2>
                  </div>

                  {/* Right Section */}
                  <Link
                    to="/purchaseorder"
                    className="bg-white text-blue-700 font-medium px-4 py-1.5 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-300 flex items-center space-x-1"
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          py: 3,
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: "1400px",
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                            p: 3,
                          }}
                        >
                          {/* ===== PO Number ===== */}
                          <div className="w-full bg-gray-400 text-black rounded-lg px-4 h-12 flex justify-between items-center mb-3 shadow-md">
                            <span className="font-medium text-sm">
                              PO Number
                            </span>
                            <span className="font-semibold text-sm">
                              {formData?.order_number || "-"}
                            </span>
                          </div>

                          {/* ===== Company | Location | Date ===== */}
                          <div className="flex flex-col md:flex-row gap-4 mb-4">
                            {/* Company */}
                            <div className="w-full md:w-1/3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                              </label>
                              <Select
                                fullWidth
                                name="company_id"
                                value={formData.company_id}
                                onChange={handleChange}
                                size="small"
                                sx={{ height: "42px" }}
                              >
                                {compines?.map((c) => (
                                  <MenuItem key={c.id} value={c.id}>
                                    {c.compdesc}
                                  </MenuItem>
                                ))}
                              </Select>
                            </div>

                            {/* Location */}
                            <div className="w-full md:w-1/3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                              </label>
                              <Select
                                fullWidth
                                name="location_id"
                                value={formData.location_id}
                                onChange={handleChange}
                                disabled={!formData.company_id}
                                size="small"
                                sx={{ height: "42px" }}
                              >
                                {locations?.map((l) => (
                                  <MenuItem key={l.id} value={l.id}>
                                    {l.locname}
                                  </MenuItem>
                                ))}
                              </Select>
                            </div>

                            {/* Date */}
                            <div className="w-full md:w-1/3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                              </label>
                              <MDInput
                                fullWidth
                                type="date"
                                value={formData.delivery_date}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    delivery_date: e.target.value,
                                  })
                                }
                                // sx={{
                                //   "& .MuiInputBase-input": {

                                //   },
                                // }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8">
                            {/* Vendor Dropdown */}
                            <div>
                              <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Vendor
                                </label>
                                <Autocomplete
                                  disablePortal
                                  options={Customers} // your vendor list state
                                  getOptionLabel={(option) =>
                                    option.vendor_code
                                      ? `${option.vendor_code} - ${option.company_name}`
                                      : ""
                                  }
                                  filterOptions={filterOptions} // custom search
                                  renderOption={(props, option) => (
                                    <li {...props}>
                                      {option.vendor_code} -{" "}
                                      {option.company_name} ({option.firstname})
                                    </li>
                                  )}
                                  value={autocompleteValue} // current selected vendor
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
                                      placeholder="Select Vendor"
                                      size="small"
                                      sx={{
                                        "& .MuiInputBase-root": {
                                          height: "42px",
                                          fontSize: "14px",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </div>
                            </div>

                            {/* Employee Dropdown (unchanged) */}
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                User
                              </label>
                              <Autocomplete
                                disablePortal
                                options={Salesmans}
                                getOptionLabel={(option) =>
                                  option.salesman_code
                                    ? `${option.salesman_code} - ${option.users?.firstname}`
                                    : ""
                                }
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {option.salesman_code} -{" "}
                                    {option.users?.firstname}
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
                                    placeholder="Select User"
                                    size="small"
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "42px",
                                        fontSize: "14px",
                                      },
                                    }}
                                  />
                                )}
                              />
                            </div>
                          </div>

                          {/* ===== Vendor + Vendor Details Side by Side ===== */}
                          <div className="w-full mt-4">
                            {selectedCustomer ? (
                              <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Company Details */}
                                  <div>
                                    <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                                      <i className="fas fa-building text-blue-500"></i>
                                      Company Details
                                    </h2>
                                    <div className="space-y-2 text-sm text-gray-800">
                                      <p>
                                        <strong className="text-blue-800">
                                          Company Name:
                                        </strong>{" "}
                                        {selectedCustomer.company_name}
                                      </p>
                                      <p>
                                        <strong className="text-blue-800">
                                          TAX No:
                                        </strong>{" "}
                                        {selectedCustomer.import_license_no}
                                      </p>
                                      <p>
                                        <strong className="text-blue-800">
                                          Address:
                                        </strong>{" "}
                                        {selectedCustomer.address1}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Contact Person Details */}
                                  <div>
                                    <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                                      <i className="fas fa-user text-blue-500"></i>
                                      Contact Person Details
                                    </h2>
                                    <div className="space-y-2 text-sm text-gray-800">
                                      <p>
                                        <strong className="text-blue-800">
                                          Name:
                                        </strong>{" "}
                                        {selectedCustomer.firstname}{" "}
                                        {selectedCustomer.lastname}
                                      </p>
                                      <p>
                                        <strong className="text-blue-800">
                                          Phone:
                                        </strong>{" "}
                                        {selectedCustomer.VendorMobileNumber}
                                      </p>
                                      <p>
                                        <strong className="text-blue-800">
                                          Email:
                                        </strong>{" "}
                                        {selectedCustomer.VendorEmail || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-100 border border-dashed border-gray-300 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                                <i className="fas fa-user-slash text-gray-400 text-2xl mb-2"></i>
                                No vendor selected
                              </div>
                            )}
                          </div>

                          {/* ===== Employee | Payment Terms | Vendor Document No ===== */}
                          <div className="grid grid-cols-2 gap-8 mt-4">
                            {/* Payment Terms */}
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Terms
                              </label>
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
                                    placeholder="Select Payment Term"
                                    size="small"
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "42px",
                                        fontSize: "14px",
                                      },
                                    }}
                                  />
                                )}
                              />
                            </div>

                            {/* Vendor Document No */}
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendor Document No
                              </label>
                              <MDInput
                                type="text"
                                variant="outlined"
                                name="customer_lpo"
                                value={formData.customer_lpo}
                                onChange={handleChange}
                                fullWidth
                                // sx={{
                                //   "& .MuiInputBase-input": {
                                //     height: "42px",
                                //     fontSize: "14px",
                                //   },
                                // }}
                              />
                            </div>
                          </div>
                        </Box>
                      </Box>

                      <div className="w-full pb-6">
                        {/* === Table Section === */}
                        <div className="overflow-x-auto max-h-[60vh] rounded-xl border border-gray-200 bg-white shadow-md mb-4">
                          <table className="min-w-[1200px] w-full text-sm border-collapse">
                            {/* === Header === */}
                            <thead className="bg-blue-50 sticky top-0 z-10">
                              <tr className="text-left text-gray-700 font-semibold">
                                {[
                                  "ITEM CODE",
                                  "ITEM NAME",
                                  "UOM",
                                  "Scheme",
                                  "Quantity",
                                  "Price",
                                  "Total",
                                  "Discount Type",
                                  "Discount",
                                  "Net",
                                  "Tax%",
                                  "Tax Amt",
                                  "Row Grand Total",
                                  "Action",
                                ].map((header) => (
                                  <th
                                    key={header}
                                    className="px-3 py-2 border-b border-gray-200 min-w-[130px]"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            {/* === Body === */}
                            <tbody>
                              {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                  {/* === ITEM CODE === */}
                                  <td
                                    style={{
                                      minWidth: "300px",
                                      maxWidth: "350px",
                                      width: "320px",
                                    }}
                                    className="px-3 py-2 border-b"
                                  >
                                    <input
                                      list="itemCodes"
                                      placeholder="Item code"
                                      value={row.item_code || ""}
                                      onChange={(e) => {
                                        const code = e.target.value;
                                        const matchedItem = filteredItems.find(
                                          (item) => item.item_code === code
                                        );
                                        ItemSelect(
                                          matchedItem || { item_code: code },
                                          row
                                        );
                                      }}
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sky-400 focus:outline-none text-sm"
                                      style={{ minWidth: "300px" }} // input width inline style
                                    />
                                    <datalist id="itemCodes">
                                      {filteredItems.map((item) => (
                                        <option
                                          key={item.item_code}
                                          value={item.item_code}
                                        >
                                          {item.item_code} - {item.item_name} |
                                          Color: [
                                          {item?.item_color?.itemcolname}] |
                                          Size: [
                                          {item?.size_master?.itemsizename}] -{" "}
                                          {item.item_description}
                                        </option>
                                      ))}
                                    </datalist>
                                  </td>

                                  {/* === ITEM NAME (Wider Cell) === */}
                                  <td className="px-3 py-2 border-b w-[300px]">
                                    <input
                                      type="text"
                                      value={row.item_name}
                                      disabled
                                      className="w-[150] bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-gray-700 text-sm "
                                    />
                                  </td>

                                  {/* === UOM === */}
                                  {/* === UOM === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="text"
                                      value={row?.item_uom || ""}
                                      readOnly
                                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                    />
                                  </td>

                                  {/* === Scheme === */}
                                  <td className="px-3 py-2 border-b">
                                    <select
                                      value={row.skim || "None"}
                                      onChange={(e) =>
                                        handleSkimChange(
                                          e.target.value,
                                          rowIndex
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                                    >
                                      <option value="None">None</option>
                                      <option value="Free">Free</option>
                                    </select>
                                  </td>

                                  {/* === Quantity === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="number"
                                      name="quantity"
                                      value={row.quantity}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sky-400 focus:outline-none text-sm"
                                    />
                                  </td>

                                  {/* === Price === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="number"
                                      name="price"
                                      value={row.price}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sky-400 focus:outline-none text-sm"
                                    />
                                  </td>
                                  {/* === Total === */}
                                  {/* === Total === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="number"
                                      name="total"
                                      value={(
                                        (parseFloat(row.quantity) || 0) *
                                        (parseFloat(row.price) || 0)
                                      ).toFixed(2)}
                                      readOnly
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1 bg-gray-100 text-sm"
                                    />
                                  </td>
                                  {/* === Discount Type === */}
                                  <td className="px-3 py-2 border-b">
                                    <select
                                      name="discounttype"
                                      value={row.discounttype}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                                    >
                                      <option value="Percentage">
                                        Percentage
                                      </option>
                                      <option value="Amount">Amount</option>
                                    </select>
                                  </td>

                                  {/* === Discount === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="number"
                                      name="discount"
                                      value={row.discount}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sky-400 focus:outline-none text-sm"
                                    />
                                  </td>

                                  {/* === Net === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="text"
                                      value={row.net}
                                      disabled
                                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                    />
                                  </td>

                                  {/* === Tax% === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="text"
                                      value={row.vat}
                                      disabled
                                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                    />
                                  </td>

                                  {/* === Tax Amt === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="text"
                                      value={row.taxa_ble}
                                      disabled
                                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                    />
                                  </td>

                                  {/* === Grand Total === */}
                                  <td className="px-3 py-2 border-b">
                                    <input
                                      type="text"
                                      value={row.total}
                                      disabled
                                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                    />
                                  </td>

                                  {/* === Action === */}
                                  <td className="px-3 py-2 border-b text-center">
                                    <button
                                      onClick={() => handleRemoveRow(rowIndex)}
                                      className="text-red-600 border border-red-400 rounded-lg px-2 py-1 hover:bg-red-50"
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* === Add Row Button === */}
                        <button
                          type="button"
                          onClick={handleAddRow}
                          className="px-2 py-1 bg-black hover:bg-sky-700 text-white rounded-lg font-medium text-sm"
                        >
                          + Add Row
                        </button>
                      </div>

                      {/* Vendor Note & Totals Section */}
                      <div className="w-full mt-1 flex flex-col md:flex-row gap-6">
                        {/* === Vendor Note Section === */}
                        <div className="flex-1 bg-white rounded-xl shadow-md p-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Vendor Notes
                          </label>
                          <textarea
                            className="w-full h-28 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm resize-none"
                            placeholder="Enter vendor note..."
                            value={formData?.vendor_note || ""}
                            onChange={handleChange}
                            name="vendor_note"
                          />
                        </div>

                        {/* === Totals Section === */}
                        <div className="flex-1 bg-gray-900 text-white rounded-xl p-5 shadow-lg">
                          <div className="grid grid-cols-2 gap-y-3 text-sm">
                            <div>Total</div>
                            <div className="text-right font-semibold">
                              INR {parseFloat(sums.initialTotal).toFixed(2)}
                            </div>

                            <div>Discount</div>
                            <div className="text-right font-semibold">
                              INR {parseFloat(sums.discount).toFixed(2)}
                            </div>

                            <div>Net Total</div>
                            <div className="text-right font-semibold">
                              INR {parseFloat(sums.net).toFixed(2)}
                            </div>

                            <div>Tax</div>
                            <div className="text-right font-semibold">
                              INR {parseFloat(sums.vat).toFixed(2)}
                            </div>

                            <div className="pt-2 text-lg font-semibold">
                              Grand Total
                            </div>
                            <div className="pt-2 text-right text-lg font-bold">
                              INR {parseFloat(sums.total).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* === Buttons === */}
                      <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={isSubmit}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-3 py-2 rounded-lg shadow-md transition disabled:opacity-60 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmit}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-lg shadow-md transition disabled:opacity-60 text-sm"
                        >
                          {isSubmit ? "Saving..." : "Save"}
                        </button>
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

export default Add_Po;
