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
import { useParams } from "react-router-dom";

const payment_term = [
  { label: "Cash", value: "1" },
  { label: "BILL TO BILL PAYMENT AR", value: "2" },
  { label: "Net 90 Days", value: "3" },
  { label: "NET 30 DAYS", value: "4" },
  { label: "Net 60 Days", value: "5" },
  { label: "Cash on Delivery", value: "6" },
  { label: "Net 45 Days", value: "7" },
];
//radiobutton
const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  ".MuiFormControlLabel-label":
    checked &&
    {
      //   color: theme.palette.primary.main,
    },
}));

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();
  let checked = false;
  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }
  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};

function edit_grn() {
  const navigate = useNavigate();
  const params = useParams();

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
    id: "",
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    company_id: "",
    location_id: "",
    customer_lpo: "",
    WebGLRenderingContext_number: "",
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    vendor_invoice_no: "",
    vendor_invoice_date: "",
    delivery_note: "",
    status: "Open",
    grn_type: "Normal",
    current_stage_comment: "",
  });
  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "grn/details", {
        id: params.id,
      });
      if (response.status) {
        const orderData = response.data;
        console.log("order data is -------------", orderData);

        setFormData({
          ...formData,
          id: orderData.id,
          customer_id: orderData.customer_id,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          customer_lob: orderData.customer_lob,
          salesman_id: orderData.salesman_id,
          customer_lpo: orderData.customer_lpo,
          grn_number: orderData.grn_number,
          delivery_date: orderData.grn_date,
          payment_terms: orderData.payment_terms,
          due_date: orderData.grn_due_date,
          vendor_invoice_no: orderData.vendor_invoice_no,
          // vendor_invoice_date: orderData.vendor_invoice_date,
          vendor_invoice_date: orderData.vendor_invoice_date
            ? orderData.vendor_invoice_date.split("T")[0] // ✅ fix here
            : "",
          delivery_note: orderData.delivery_note,
          status: orderData.status,
          grn_type_type: orderData.grn_type,
          current_stage_comment: orderData.current_stage_comment,
        });
        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }

        let AutocompleteValueCustomer = {
          id: orderData?.vendor_details?.id,
          vendor_code: orderData?.vendor_details?.vendor_code,
          user_id: orderData?.vendor_details?.id,
          firstname: orderData?.vendor_details?.firstname,
          lastname: orderData?.vendor_details?.lastname,
          email: orderData?.vendor_details?.email,
        };
        setAutocompleteValue(AutocompleteValueCustomer);

        let AutocompleteValueSalesman = {
          id: orderData?.salesman?.id,
          salesman_code: orderData?.salesman?.salesmanInfo?.salesman_code,
          user_id: orderData?.salesman?.salesmanInfo?.user_id,
          users: {
            firstname: orderData?.salesman?.firstname,
            lastname: orderData?.salesman?.lastname,
            email: orderData?.salesman?.email,
          },
        };
        setAutocompleteSalesmanValue(AutocompleteValueSalesman);

        let AutocompletePayment = {
          label: orderData?.payment_terms?.name,
          value: orderData?.payment_terms?.id,
        };
        setAutocompletePaymentValue(AutocompletePayment);

        //items
        let grn_details = [];
        for (let index = 0; index < orderData?.grn_details?.length; index++) {
          const element = orderData.grn_details[index];

          let item_uom = element.itemLocationModel.item_main_prices;
          const filteredObject = item_uom.find(
            (item) => item.item_uom_id === element.item_uom_id
          );

          let obje = {
            id: index + 1,
            grn_details_id: element.id,
            item_id: element.item_id,
            item_code: element.itemLocationModel?.item_code,
            item_name: element.itemLocationModel?.item_name,
            uom: element?.item_uom_id,
            item_uom:
              element.itemLocationModel.item_main_prices[0].item_uom.name,
            quantity: element.item_qty,
            price: element.is_free == 1 ? 0.0 : element.item_gross,
            rate:
              element.is_free == 1
                ? 0.0
                : element.rate === null
                ? element.item_gross
                : element.rate,
            excise: element.is_free == 1 ? 0.0 : element.item_excise,
            discount: element.is_free == 1 ? 0.0 : element.item_discount_amount,
            net: element.is_free == 1 ? 0.0 : element.item_net,

            vat:
              element?.is_free == 1
                ? 0
                : parseFloat(element.itemLocationModel?.tax_master_1?.taxcal) ||
                  0.0,

            taxa_ble:
              element?.is_free == 1
                ? 0.0
                : (
                    (parseFloat(element?.item_net) *
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal || 0
                      )) /
                    100
                  ).toFixed(2),

            total:
              element.is_free == 1
                ? 0.0
                : (
                    parseFloat(element?.item_net) +
                    (parseFloat(element?.item_net) *
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal || 0
                      )) /
                      100
                  ).toFixed(2),

            actions: "",
            newValue: element.itemLocationModel,
            newValue_uom: filteredObject
              ? filteredObject
              : element.itemLocationModel.item_main_prices[0],
            uom_list: element.itemLocationModel.item_main_prices,
            skim: element?.is_free == 1 ? "Free" : "None",
          };
          grn_details.push(obje);
        }
        setRows(grn_details);
        console.log("grn details is -----------", grn_details);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    fetchcompanyList();
    fetchOrderDetails();
  }, []);

  const ItemList = async () => {
    const response = await axios_get(true, "item/dropdown-list");
    if (response) {
      if (response.status) {
        setItem(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
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

  const handleAutocompleteChange = (event, newValue, type) => {
    if (type == "vendor") {
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
        quantity: (0.0).toFixed(2),
        skim: "None",
        price: (0.0).toFixed(2),
        rate: (0.0).toFixed(2),
        excise: (0.0).toFixed(2),
        discount: (0.0).toFixed(2),
        net: (0.0).toFixed(2),
        vat: 0,
        taxa_ble: (0.0).toFixed(2),
        ptr_di: "",
        cgst: "",
        cgst_amount: "",
        sgst: "",
        sgst_amount: "",
        igst: "",
        igst_amount: "",
        total: (0.0).toFixed(2),
        actions: "",
        newValue: "",
        newValue_uom: "",
        uom_list: [],
        originalPrice: 0.0,
        originalDiscount: 0.0,
        originalNet: 0.0,
        originalVat: 0.0,
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
            uom: newValue?.item_main_prices?.[0]?.item_uom?.id,
            item_uom: newValue?.item_main_prices?.[0]?.item_uom?.name,
            quantity: (1.0).toFixed(2),
            price: parseFloat(newValue?.item_vat_percentage).toFixed(2),
            rate: parseFloat(newValue?.item_vat_percentage).toFixed(2),
            // total: (parseFloat(newValue?.item_vat_percentage) * 1).toFixed(2),
            net: (parseFloat(newValue?.item_vat_percentage) * 1).toFixed(2),
            vat: parseFloat(newValue?.tax_master_1?.taxcal),
            taxa_ble: (
              (parseFloat(newValue?.item_vat_percentage) *
                1 *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
              100
            ).toFixed(2),
            total: (
              parseFloat(newValue?.item_vat_percentage) +
              (parseFloat(newValue?.item_vat_percentage) *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
                100
            ).toFixed(2),
            newValue: newValue,
            uom_list: newValue?.item_main_prices,
          }
        : row
    );
    setRows(updatedRows);
  };

  const itemquantityChange = (eventOrQuantity, params) => {
    const { name, value } = eventOrQuantity?.target || {
      name: null,
      value: null,
    };
    if (!name || value === undefined) return;

    const itemPrice = parseFloat(params.price) || 0;
    const totalQuantity = parseFloat(params.quantity) || 0;
    const itemDiscount = parseFloat(params.discount) || 0;
    const itemDiscountType = params.discounttype || "Percentage";
    const itemTax = parseFloat(params.vat) || 0;

    const calculateRowTotals = (
      price,
      quantity,
      discount,
      discountType,
      vat
    ) => {
      const grossAmount = parseFloat(price) * parseFloat(quantity) || 0;

      let netAmount = 0;

      if (discountType === "Percentage") {
        const safeDiscount = Math.min(
          Math.max(parseFloat(discount) || 0, 0),
          100
        );
        netAmount =
          grossAmount -
          parseFloat(((grossAmount * safeDiscount) / 100).toFixed(2));
      } else {
        const safeDiscount = Math.min(parseFloat(discount) || 0, grossAmount);
        netAmount = grossAmount - safeDiscount;
      }

      if (netAmount < 0) netAmount = 0;

      const taxAmount = parseFloat(((netAmount * (vat || 0)) / 100).toFixed(2));
      const totalAmount = parseFloat((netAmount + taxAmount).toFixed(2));

      return {
        netAmount,
        taxAmount,
        totalAmount,
      };
    };

    let updatedRows = rows.map((row) => {
      if (row.id !== params.id) return row;

      let newPrice = itemPrice;
      let newQuantity = totalQuantity;
      let newDiscount = itemDiscount;
      let newDiscountType = itemDiscountType;

      switch (name) {
        case "quantity":
          newQuantity = parseFloat(value) || 0;
          break;
        case "price":
          newPrice = parseFloat(value) || 0;
          break;
        case "discount":
          newDiscount = parseFloat(value) || 0;
          break;
        case "discounttype":
          newDiscountType = value;
          break;
        default:
          break;
      }

      const rowTotals = calculateRowTotals(
        newPrice,
        newQuantity,
        newDiscount,
        newDiscountType,
        itemTax
      );

      if (!rowTotals) return row;

      return {
        ...row,
        price: newPrice,
        quantity: newQuantity,
        discount: newDiscount,
        discounttype: newDiscountType,
        net: rowTotals.netAmount,
        total: rowTotals.totalAmount,
        taxa_ble: rowTotals.taxAmount,
      };
    });

    setRows(updatedRows);
  };

  const validation = (formData) => {
    let errors = {};

    if (!formData.customer_id) {
      errors.customer = "Customer is required";
    }
    if (!formData.status) {
      errors.status = "Status is required";
    }

    if (!formData.grn_number) {
      errors.grn_number = "Grn Number is required";
    }
    if (!formData.grn_type) {
      errors.grn_type = "Type is required";
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
  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    // let invalidRow = rows.some(row => !row.quantity || !row.price || row.quantity <= 0 || row.price <= 0);
    let invalidRow = rows.some(
      (row) =>
        row.skim === "None" &&
        (!row.quantity || !row.price || row.quantity <= 0 || row.price <= 0)
    );
    if (invalidRow) {
      setisSubmit(false);
      ToastMassage("Quantity and Price cannot be null or zero.", "error");
      return;
    }
    if (Object.keys(errors)?.length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      if (rows?.length == 0) {
        setisSubmit(false);
        setFormError({});
        setItemError("Please select item");
        ToastMassage("Please select item", "error");
      } else {
        setisSubmit(false);
        setFormError({});

        let finalPramas = {
          ...formData,
          discount: sums.discount,
          net: sums.net,
          excise: sums.excise,
          vat: sums.vat,
          total: sums.total,
          items: rows,
          payment_terms: formData.payment_terms.id,
        };
        console.log("final params is ----------------", finalPramas);

        const response = await axios_post(true, "grn/update1", finalPramas);
        if (response) {
          if (response.status) {
            ToastMassage(response.message, "success");
            navigate("/grn");
          } else {
            ToastMassage(response.message, "error");
          }
        }

        // Submit your form data here
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

  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        // ensure numeric
        const net = parseFloat(item.net) || 0; // use row's net amount
        const tax = parseFloat(item.taxa_ble) || 0; // use row's tax
        const total = parseFloat(item.total) || 0; // row total
        const gross = parseFloat(item.price) * parseFloat(item.quantity) || 0;
        const discountAmount = gross - net; // derive discount

        sums.initialTotal += gross;
        sums.discount += discountAmount;
        sums.net += net;
        sums.vat += tax;
        sums.total += total;

        return sums;
      },
      {
        initialTotal: 0,
        discount: 0,
        net: 0,
        vat: 0,
        total: 0,
      }
    );
  };

  const sums = calculateSums(rows);
  console.log("sums is -----------", sums);
  console.log("row is -----------", rows);

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
                    price: parseFloat(
                      row.newValue?.item_vat_percentage
                    ).toFixed(2),
                    vat: parseFloat(row.newValue?.tax_master_1?.taxcal),
                    taxa_ble: (
                      (parseFloat(row.newValue?.item_vat_percentage) *
                        1 *
                        parseFloat(row.newValue?.tax_master_1?.taxcal)) /
                      100
                    ).toFixed(2),
                    total: (
                      parseFloat(row.newValue?.item_vat_percentage) +
                      (parseFloat(row.newValue?.item_vat_percentage) *
                        parseFloat(row.newValue?.tax_master_1?.taxcal)) /
                        100
                    ).toFixed(2),
                    net: (
                      parseFloat(row.newValue?.item_vat_percentage) * 1
                    ).toFixed(2),
                  }),
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
                <div className="mx-2 mt-[-12px] py-2 px-4 rounded-xl bg-[linear-gradient(135deg,#2196F3_0%,#21CBF3_100%)] shadow-[0_4px_20px_rgba(33,150,243,0.3)] flex items-center justify-between min-h-[68px]">
                  {/* === Left Section: Icon + Title === */}
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-white text-[26px]">
                      shopping_cart
                    </span>
                    <h2 className="text-white font-semibold text-lg tracking-wide">
                      Edit GRN
                    </h2>
                  </div>

                  {/* === Right Section: Back Button === */}
                  <a
                    href="/grn"
                    className="bg-white text-sm text-blue-600 font-semibold px-4 py-2 rounded-lg shadow-[0_2px_8px_rgba(255,255,255,0.3)] hover:bg-white hover:text-[#1976D2] transition-all duration-200"
                  >
                    Back
                  </a>
                </div>

                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      xs={12}
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      <div className=" w-full flex justify-center bg-gray-50 py-6">
                        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-8">
                          {/* === GRN Number & Status Row === */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* GRN Number */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                GRN Number
                              </label>
                              <input
                                type="text"
                                name="grn_number"
                                value={formData.grn_number}
                                onChange={handleChange}
                                disabled
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 bg-gray-100 text-gray-700 text-sm font-medium hover:border-gray-400 transition"
                              />
                              {formError.grn_number && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.grn_number}
                                </p>
                              )}
                            </div>

                            {/* Status */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Status
                              </label>
                              <Autocomplete
                                options={[
                                  "Open",
                                  "Close",
                                  "Partial receive",
                                  "Cancel",
                                ]}
                                value={formData.status}
                                onChange={(event, newValue) =>
                                  setFormData({ ...formData, status: newValue })
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                        fontSize: "0.875rem",
                                      },
                                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "#9ca3af", // Tailwind gray-400
                                        },
                                    }}
                                  />
                                )}
                                disabled
                              />
                              {formError.status && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.status}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* === Main Grid === */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Vendor */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Vendor
                              </label>
                              <Autocomplete
                                disablePortal
                                options={Customers}
                                getOptionLabel={(option) =>
                                  option
                                    ? `${option.vendor_code || ""} - ${
                                        option.firstname || ""
                                      } ${option.lastname || ""}`
                                    : ""
                                }
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {option.vendor_code} - {option.firstname}{" "}
                                    {option.lastname}
                                  </li>
                                )}
                                value={autocompleteValue}
                                onChange={(event, newValue) =>
                                  handleAutocompleteChange(
                                    event,
                                    newValue,
                                    "vendor"
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select Vendor"
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                        fontSize: "0.875rem",
                                      },
                                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "#9ca3af",
                                        },
                                    }}
                                  />
                                )}
                              />
                              {formError.customer && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.customer}
                                </p>
                              )}
                            </div>

                            {/* Company */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Company
                              </label>
                              <select
                                name="company_id"
                                value={formData.company_id}
                                onChange={handleChange}
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 transition"
                              >
                                {compines?.map((company) => (
                                  <option key={company.id} value={company.id}>
                                    {company.compdesc}
                                  </option>
                                ))}
                              </select>
                              {formError.company_id && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.company_id}
                                </p>
                              )}
                            </div>

                            {/* Location */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Location
                              </label>
                              <select
                                name="location_id"
                                value={formData.location_id}
                                onChange={handleChange}
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 transition"
                              >
                                {locations?.map((location) => (
                                  <option key={location.id} value={location.id}>
                                    {location.locname}
                                  </option>
                                ))}
                              </select>
                              {formError.location_id && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.location_id}
                                </p>
                              )}
                            </div>

                            {/* Employee */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Employee
                              </label>
                              <Autocomplete
                                disablePortal
                                options={Salesmans}
                                getOptionLabel={(option) =>
                                  option?.salesman_code +
                                  " - " +
                                  option?.users?.firstname
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
                                    size="small"
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                        fontSize: "0.875rem",
                                      },
                                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "#9ca3af",
                                        },
                                    }}
                                  />
                                )}
                              />
                              {formError.salesman && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.salesman}
                                </p>
                              )}
                            </div>

                            {/* Payment Terms */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
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
                                    size="small"
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                        fontSize: "0.875rem",
                                      },
                                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "#9ca3af",
                                        },
                                    }}
                                  />
                                )}
                              />
                              {formError.payment_term && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.payment_term}
                                </p>
                              )}
                            </div>

                            {/* Vendor Document No */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Vendor Document No
                              </label>
                              <input
                                type="text"
                                name="customer_lpo"
                                value={formData.customer_lpo}
                                onChange={handleChange}
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 transition"
                              />
                              {formError.customer_lpo && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.customer_lpo}
                                </p>
                              )}
                            </div>

                            {/* Delivery Date */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Delivery Date
                              </label>
                              <input
                                type="date"
                                value={formData.delivery_date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    delivery_date: e.target.value,
                                  })
                                }
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 transition"
                              />
                              {formError.delivery_date && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.delivery_date}
                                </p>
                              )}
                            </div>

                            {/* Due Date */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
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
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 transition"
                              />
                              {formError.due_date && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.due_date}
                                </p>
                              )}
                            </div>

                            {/* GRN Type */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                GRN Type
                              </label>
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
                                    size="small"
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                        fontSize: "0.875rem",
                                      },
                                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "#9ca3af",
                                        },
                                    }}
                                  />
                                )}
                              />
                              {formError.grn_type && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.grn_type}
                                </p>
                              )}
                            </div>

                            {/* Vendor Invoice No */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Vendor Invoice No
                              </label>
                              <input
                                type="text"
                                name="vendor_invoice_no"
                                value={formData.vendor_invoice_no}
                                onChange={handleChange}
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 transition"
                              />
                              {formError.vendor_invoice_no && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.vendor_invoice_no}
                                </p>
                              )}
                            </div>

                            {/* Vendor Invoice Date */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Vendor Invoice Date
                              </label>
                              <input
                                type="date"
                                value={formData.vendor_invoice_date}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    vendor_invoice_date: e.target.value,
                                  })
                                }
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 transition"
                              />
                              {formError.vendor_invoice_date && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.vendor_invoice_date}
                                </p>
                              )}
                            </div>

                            {/* Delivery Note No */}
                            <div>
                              <label className="block text-gray-700 mb-2 font-medium text-sm">
                                Delivery Note No
                              </label>
                              <input
                                type="text"
                                name="delivery_note"
                                value={formData.delivery_note}
                                onChange={handleChange}
                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm hover:border-gray-400 transition"
                              />
                              {formError.delivery_note && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formError.delivery_note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full">
                        {/* ================= TABLE SECTION ================= */}
                        {/* <div className="overflow-x-auto bg-white rounded-xl shadow p-4"> */}
                        <div className="overflow-x-auto bg-white rounded-xl shadow p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                          {/* <table className="min-w-full border border-gray-200 text-sm"> */}
                          <table className="min-w-[1400px] border border-gray-200 text-sm">
                            <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                              <tr>
                                {[
                                  "ITEM CODE",
                                  "ITEM NAME",
                                  "UOM",
                                  "Scheme",
                                  "Quantity",
                                  "Price",
                                  "Total",
                                  // "Rate",
                                  "Discount Type",
                                  "Discount",
                                  "Net",
                                  "Tax%",
                                  "Tax Amt",
                                  "Row Total",
                                  "Action",
                                ].map((header) => (
                                  <th
                                    key={header}
                                    className="py-2 px-3 text-left font-semibold border-b border-gray-200"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                  <td
                                    className="p-2 border-b border-gray-200"
                                    style={{ width: "250px" }}
                                  >
                                    <input
                                      type="text"
                                      value={row.item_code || ""}
                                      onChange={(e) =>
                                        ItemSelect(e.target.value, row)
                                      }
                                      className="w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-400"
                                    />
                                  </td>
                                  <td
                                    className="p-2 border-b border-gray-200"
                                    style={{ width: "250px" }}
                                  >
                                    <input
                                      type="text"
                                      disabled
                                      value={row.item_name || ""}
                                      className="w-full border rounded-md px-2 py-1 bg-gray-50 text-sm"
                                    />
                                  </td>
                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="text"
                                      disabled
                                      value={row.item_uom || ""}
                                      className="w-full border rounded-md px-2 py-1 bg-gray-50 text-sm"
                                    />
                                  </td>
                                  <td className="p-2 border-b border-gray-200">
                                    <select
                                      value={row.skim || "None"}
                                      onChange={(e) =>
                                        handleSkimChange(
                                          e.target.value,
                                          rowIndex
                                        )
                                      }
                                      className="w-full border rounded-md px-2 py-1 text-sm"
                                    >
                                      <option>None</option>
                                      <option>Free</option>
                                    </select>
                                  </td>
                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      name="quantity"
                                      value={row.quantity}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border rounded-md px-2 py-1 text-sm"
                                    />
                                  </td>

                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      name="price"
                                      value={row.price}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border rounded-md px-2 py-1 text-sm"
                                    />
                                  </td>
                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      name="price"
                                      value={parseFloat(
                                        row.price * row.quantity
                                      )}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border rounded-md px-2 py-1 text-sm"
                                    />
                                  </td>

                                  {/* <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      name="rate"
                                      value={row.rate}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border rounded-md px-2 py-1 text-sm"
                                    />
                                  </td> */}
                                  {/* <TableCell>
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
                                                                        </TableCell> */}
                                  <td className="p-2 border-b border-gray-200">
                                    <select
                                      name="discounttype"
                                      value={row.discounttype}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border rounded-md px-2 py-1 text-sm bg-white"
                                    >
                                      <option value="Percentage">
                                        Percentage
                                      </option>
                                      <option value="Amount">Amount</option>
                                    </select>
                                  </td>

                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      name="discount"
                                      value={row.discount}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border rounded-md px-2 py-1 text-sm"
                                    />
                                  </td>
                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      value={row.net}
                                      disabled
                                      className="w-full border rounded-md px-2 py-1 bg-gray-50 text-sm"
                                    />
                                  </td>
                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      value={row.vat}
                                      disabled
                                      className="w-full border rounded-md px-2 py-1 bg-gray-50 text-sm"
                                    />
                                  </td>
                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      value={row.taxa_ble}
                                      disabled
                                      className="w-full border rounded-md px-2 py-1 bg-gray-50 text-sm"
                                    />
                                  </td>
                                  <td className="p-2 border-b border-gray-200">
                                    <input
                                      type="number"
                                      value={row.total}
                                      disabled
                                      className="w-full border rounded-md px-2 py-1 bg-gray-50 text-sm"
                                    />
                                  </td>
                                  <td className="p-2 border-b border-gray-200 text-center">
                                    <button
                                      onClick={() => handleRemoveRow(rowIndex)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-end mt-3">
                          <button
                            type="button"
                            onClick={handleAddRow}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md"
                          >
                            + Add Row
                          </button>
                        </div>

                        {/* ================= NOTE & TOTAL SECTION ================= */}
                        <div className="w-full ">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            {/* === Customer Note Section === */}
                            {/* <div className="flex-1 bg-gray-50 rounded-xl p-5 shadow-sm flex flex-col">
                              <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                                Vendor Notes
                              </label>
                              <textarea
                                rows="5"
                                placeholder="Write vendor notes here..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              ></textarea>
                            </div> */}

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

                            {/* === Totals + Buttons Section === */}
                            <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm text-gray-700">
                                  <span>Total</span>
                                  <strong>
                                    {parseFloat(sums.initialTotal).toFixed(2)}
                                  </strong>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                  <span>Discount</span>
                                  <strong>
                                    {parseFloat(sums.discount).toFixed(2)}
                                  </strong>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                  <span>Net Total</span>
                                  <strong>
                                    {parseFloat(sums.net).toFixed(2)}
                                  </strong>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                  <span>Tax</span>
                                  <strong>
                                    {parseFloat(sums.vat).toFixed(2)}
                                  </strong>
                                </div>
                                <div className="flex justify-between text-base font-semibold border-t border-gray-300 pt-2 text-gray-800">
                                  <span>Grand Total</span>
                                  <span>
                                    {parseFloat(sums.total).toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="flex justify-end gap-3 mt-6">
                                <button
                                  onClick={handleBack}
                                  disabled={isSubmit}
                                  className="border border-gray-400 text-gray-700 hover:bg-gray-100 font-medium px-6  rounded-lg transition-all"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={isSubmit}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6  rounded-lg shadow-sm transition-all"
                                >
                                  {isSubmit ? "Saving..." : "Save"}
                                </button>
                              </div>
                            </div>
                          </div>
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

export default edit_grn;
