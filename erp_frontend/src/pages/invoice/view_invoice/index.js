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
import axios from "axios";
import constantApi from "constantApi";

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

function Edit_Invoice() {
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

  const [formData, setFormData] = useState({
    id: "",
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    company_id: "",
    location_id: "",
    invoice_number: "",
    exchange_number: "",
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    status: "Open",
    invoice_type: "",
  });

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/invoice/details`,
        {
          id: params.id,
        },
      );

      console.log("view details form invoice is -----", response.data.data);

      if (response.status) {
        const orderData = response.data.data;

        setFormData({
          ...formData,
          id: orderData.id,
          customer_id: orderData.customer_id,
          customer_lob: orderData.customer_lob,
          salesman_id: orderData.salesman_id,
          customer_lpo: orderData.customer_lpo,
          invoice_number: orderData.invoice_number,
          exchange_number: orderData.exchange_number,
          order_number: orderData?.orderModel?.order_number,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          delivery_date: orderData.invoice_date,
          payment_terms: orderData.payment_terms,
          due_date: orderData.invoice_due_date,
          status: orderData.status,
          invoice_type: orderData.invoice_type,
          current_stage_comment: orderData.current_stage_comment,
        });
        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }
        let AutocompleteValueCustomer = {
          id: orderData?.customer_details?.id,
          customer_code: orderData?.customer_details?.customer_code,
          user_id: orderData?.customer_details?.id,
          users: {
            first_name: orderData?.customer_details?.first_name,
            last_name: orderData?.customer_details?.last_name,
            email: orderData?.customer_details?.email,
          },
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
        let invoice_details = [];
        for (
          let index = 0;
          index < orderData?.invoice_details?.length;
          index++
        ) {
          const element = orderData.invoice_details[index];

          let item_uom = element.itemLocationModel.item_main_prices;
          const filteredObject = item_uom.find(
            (item) => item.item_uom_id === element.item_uom_id,
          );
          const oneDecimal = (value) =>
            Number((parseFloat(value) || 0).toFixed(2));

          const isFree = element.is_free == 1;
          const isExchange = element.is_free == 3;
          const sign = isExchange ? -1 : 1;

          let obje = {
            id: parseFloat(index + 1),
            order_details_id: parseFloat(element.id),
            item_id: parseFloat(element.item_id),
            item_code: element.itemLocationModel.item_code,
            item_name: element.itemLocationModel.item_name,
            uom: parseFloat(element?.item_uom_id),
            item_uom:
              element.itemLocationModel.item_main_prices[0].item_uom.name,

            // quantity: parseFloat(element.item_qty) || 0.0,
            // price:
            //   element.is_free == 1
            //     ? 0.0
            //     : parseFloat(element.item_gross) || 0.0,
            // excise:
            //   element.is_free == 1
            //     ? 0.0
            //     : parseFloat(element.item_excise) || 0.0,
            // discount:
            //   element.is_free == 1
            //     ? 0.0
            //     : parseFloat(element.item_discount_amount) || 0.0,
            // doc_discount:
            //   element.is_free == 1
            //     ? 0.0
            //     : parseFloat(element.doc_discount) || 0.0,
            // net:
            //   element.is_free == 1 ? 0.0 : parseFloat(element.item_net) || 0.0,

            // vat:
            //   element.is_free == 1
            //     ? 0.0
            //     : parseFloat(
            //         element?.itemLocationModel?.tax_master_1?.taxcal,
            //       ) || 0.0,

            // taxa_ble:
            //   element.is_free == 1
            //     ? 0.0
            //     : parseFloat(
            //         (
            //           (parseFloat(element?.item_net) *
            //             parseFloat(
            //               element?.itemLocationModel?.tax_master_1?.taxcal,
            //             )) /
            //           100
            //         ).toFixed(2),
            //       ) || 0.0,

            // total:
            //   element?.is_free === 1
            //     ? 0.0
            //     : parseFloat(
            //         (
            //           parseFloat(element?.item_net || 0) +
            //           (parseFloat(element?.item_net || 0) *
            //             parseFloat(
            //               element?.itemLocationModel?.tax_master_1?.taxcal ?? 0,
            //             )) /
            //             100
            //         ).toFixed(2),
            //       ),

            // quantity: isFree ? 0 : sign * (parseFloat(element.item_qty) || 0),

            // price: isFree ? 0 : sign * (parseFloat(element.item_gross) || 0),

            // excise: isFree ? 0 : sign * (parseFloat(element.item_excise) || 0),

            quantity: isFree
              ? 0
              : sign * Number((parseFloat(element.item_qty) || 0).toFixed(2)),

            price: isFree
              ? 0
              : sign * Number((parseFloat(element.item_gross) || 0).toFixed(2)),

            excise: isFree
              ? 0
              : sign *
                Number((parseFloat(element.item_excise) || 0).toFixed(2)),

            discount: isFree
              ? 0
              : sign * oneDecimal(element.item_discount_amount),

            doc_discount: isFree ? 0 : sign * oneDecimal(element.doc_discount),

            net: isFree ? 0 : sign * oneDecimal(element.item_net),

            vat: isFree
              ? 0
              : oneDecimal(element?.itemLocationModel?.tax_master_1?.taxcal),

            taxa_ble: isFree
              ? 0
              : sign *
                oneDecimal(
                  (parseFloat(element?.item_net || 0) *
                    parseFloat(
                      element?.itemLocationModel?.tax_master_1?.taxcal || 0,
                    )) /
                    100,
                ),

            total: isFree
              ? 0
              : sign *
                oneDecimal(
                  parseFloat(element?.item_net || 0) +
                    (parseFloat(element?.item_net || 0) *
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal || 0,
                      )) /
                      100,
                ),

            actions: "",
            newValue: element.itemLocationModel,
            newValue_uom: filteredObject
              ? filteredObject
              : element.itemLocationModel.item_main_prices[0],
            uom_list: element.itemLocationModel.item_main_prices,
            skim: element.is_free == 1 ? "Free" : "None",
            discounttype: element.discounttype,
          };
          invoice_details.push(obje);
        }
        setRows(invoice_details);
        console.log("invoice_details-------------", invoice_details);
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
        console.log("companies is ---------", response.data);
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
  const handleAutocompleteChange = (event, newValue, type) => {
    if (type == "vendor") {
      setAutocompleteValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        customer_id: newValue == null ? "" : newValue?.user_id,
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

  // console.log("rows is form view grn", rows);
  const validation = (formData) => {
    let errors = {};

    if (!formData.customer_id) {
      errors.customer = "Customer is required";
    }
    if (!formData.status) {
      errors.status = "Status is required";
    }

    if (!formData.invoice_number) {
      errors.invoice_number = "Invoice Number is required";
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

    if (!formData.payment_terms) {
      errors.payment_term = "Payment Terms are required";
    }
    if (!formData.addedby) errors.addedby = "Added by is required";

    if (!formData.due_date) {
      errors.due_date = "Due Date is required";
    }
    if (!formData.customer_lpo) {
      errors.customer_lpo = "Customer lpo is required";
    }

    return errors;
  };

  const calculateSums = (items) => {
    console.log("items is ---------", items);

    return items.reduce(
      (sums, item) => {
        const itemPrice = parseFloat(item?.price) || 0;
        const qty = parseFloat(item?.quantity) || 0;
        const discountValue = parseFloat(item?.discount) || 0;
        const doc_discount = parseFloat(item?.doc_discount) || 0;
        // const discountType = item?.discounttype; // keep null as is
        const discountType =
          item?.discount_type || item?.discounttype || "Percentage";
        // const itemTotalBeforeDiscount = itemPrice * qty;
        const itemTotalBeforeDiscount =
          parseFloat(item.price || 0) *
          Math.abs(parseFloat(item.quantity || 0));

        let discountAmount = 0;
        // 🧮 Handle discount based on type
        if (discountType === "Percentage") {
          discountAmount = (itemTotalBeforeDiscount * discountValue) / 100;
        } else {
          // ✅ treat null or "Amount" as flat amount
          discountAmount = discountValue;
        }
        sums.initialTotal += itemTotalBeforeDiscount;
        sums.discount += discountAmount;
        sums.doc_discount += doc_discount;
        sums.excise += parseFloat(item.excise) || 0;
        sums.net += parseFloat(item.net) || 0;
        sums.vat += parseFloat(item?.taxa_ble) || 0;
        sums.total += parseFloat(item.total) || 0;

        return sums;
      },
      {
        initialTotal: 0.0,
        excise: 0.0,
        discount: 0.0,
        doc_discount: 0.0,
        net: 0.0,
        vat: 0.0,
        total: 0.0,
      },
    );
  };

  const sums = calculateSums(rows);

  console.log("sums is---------------", sums);

  const handleBack = () => {
    navigate("/invoice");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <form action="#">
              <Card>
                {/* === Header Section === */}
                <div className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl shadow-md px-6 py-4 flex flex-col md:flex-row items-center justify-between mb-6">
                  {/* Left: Title with Icon */}
                  <div className="flex items-center gap-2 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.09.835L5.64 7.5m0 0h13.22l1.425 5.7a.75.75 0 01-.73.9H6.36m-.72-6.6L4.5 15.75M6 18.75a.75.75 0 100 1.5.75.75 0 000-1.5zm12 0a.75.75 0 100 1.5.75.75 0 000-1.5z"
                      />
                    </svg>
                    <h2 className="text-lg font-semibold tracking-wide">
                      View Invoice
                    </h2>
                  </div>

                  {/* Right: Back Button */}
                  <Link
                    to="/invoice"
                    className="mt-3 md:mt-0 inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                  >
                    Back
                  </Link>
                </div>

                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      xs={12}
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      {/* === Invoice Number (Full Width) === */}
                      {/* === Invoice Header === */}
                      <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl px-3 py-2 mb-4 flex justify-between items-center shadow-md">
                        <h2 className="text-sm font-medium tracking-wide">
                          Invoice Number
                        </h2>
                        <p className="text-lg font-semibold">
                          {formData.invoice_number || "—"}
                        </p>
                        {/* <h2 className="text-sm font-medium tracking-wide">
                          Ref Invoice Number
                        </h2>
                        <p className="text-lg font-semibold">
                          {formData.exchange_number || "—"}
                        </p> */}
                      </div>

                      {/* === Two Info Cards Side-by-Side === */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* === Card 1: Customer & Company Info === */}
                        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                          <h3 className="text-gray-700 font-semibold mb-4 border-b pb-2 text-sm uppercase tracking-wide">
                            Customer & Company Details
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {/* Company */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Company
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {compines?.find(
                                  (c) => c.id === formData.company_id,
                                )?.compdesc || "N/A"}
                              </p>
                            </div>

                            {/* Location */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Location
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {locations?.find(
                                  (l) => l.id === formData.location_id,
                                )?.locname || "N/A"}
                              </p>
                            </div>
                            {/* Customer */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Customer
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {autocompleteValue
                                  ? `${
                                      autocompleteValue.customer_code || ""
                                    } - ${
                                      autocompleteValue.users?.first_name || ""
                                    } ${
                                      autocompleteValue.users?.last_name || ""
                                    }`
                                  : "N/A"}
                              </p>
                            </div>
                            {/* Salesman */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Salesman
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {autocompleteSalesmanValue
                                  ? `${
                                      autocompleteSalesmanValue.salesman_code ||
                                      ""
                                    } - ${
                                      autocompleteSalesmanValue.users
                                        ?.firstname || ""
                                    }`
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* === Card 2: Invoice Details === */}
                        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                          <h3 className="text-gray-700 font-semibold mb-4 border-b pb-2 text-sm uppercase tracking-wide">
                            Invoice Details
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {/* Delivery Date */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Delivery Date
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {formData.delivery_date || "N/A"}
                              </p>
                            </div>
                            {/* Due Date */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Due Date
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {formData.due_date || "N/A"}
                              </p>
                            </div>

                            {/* Payment Term */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Payment Term
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {autocompletePaymentValue?.label ||
                                  autocompletePaymentValue?.value ||
                                  "N/A"}
                              </p>
                            </div>

                            {/* Vendor LPO */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Customer LPO
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {formData.customer_lpo || "N/A"}
                              </p>
                            </div>

                            {/* Invoice Type */}
                            <div>
                              <p className="text-gray-500 font-medium">
                                Invoice Type
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {formData.invoice_type || "N/A"}
                              </p>
                            </div>
                            {/* Ref Invoice Number */}
                            {formData.exchange_number && (
                              <div>
                                <p className="text-gray-500 font-medium">
                                  Ref Invoice Number
                                </p>
                                <p className="text-gray-900 font-semibold">
                                  {formData.exchange_number || "N/A"}
                                </p>
                              </div>
                            )}

                            {formData.invoice_type == "Order" && (
                              <div>
                                <p className="text-gray-500 font-medium">
                                  Order No
                                </p>
                                <p className="text-gray-900 font-semibold">
                                  {formData.order_number || "N/A"}
                                </p>
                              </div>
                            )}

                            {/* Status */}
                            {/* <div>
                              <p className="text-gray-500 font-medium">
                                Status
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {formData.status || "N/A"}
                              </p>
                            </div> */}
                          </div>
                        </div>
                      </div>

                      <div className="w-full p-6 rounded-xl shadow-md ">
                        {/* === Table Section === */}
                        <div className="overflow-x-auto mt-[10px]">
                          <table className="min-w-[800px] w-full border border-gray-200 text-sm">
                            <thead className="bg-gray-200 text-gray-700">
                              <tr>
                                {[
                                  "ITEM CODE",
                                  "ITEM NAME",
                                  "UOM",
                                  // "Sunit",
                                  // "Item Type",
                                  // "Currency",
                                  "Scheme",
                                  "Quantity",
                                  "Price",
                                  "Total",
                                  "Discount Type",
                                  "Discount",
                                  "Global Disc",
                                  "Net",
                                  "Tax%",
                                  "Tax Amt",
                                  "Row Total",
                                ].map((header) => (
                                  <th
                                    key={header}
                                    className="px-2 py-2 text-left text-xs font-semibold border-b border-gray-300 whitespace-nowrap"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row, index) => (
                                <tr
                                  key={index}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.item_code || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800 min-w-[220px]">
                                    {row.item_name || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.item_uom || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.skim || "-"}
                                  </td>
                                  {/* <td className="px-2 py-2 border text-gray-800">
                                    {row.Sunit || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.itemtype || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.currency || "-"}
                                  </td> */}
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.quantity || "-"}
                                  </td>

                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.price || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {/* {parseFloat(row.price * row.quantity) ||
                                      "-"} */}
                                    {row.price && row.quantity
                                      ? (
                                          row.price * Math.abs(row.quantity)
                                        ).toFixed(2)
                                      : "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.discounttype || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.discount || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row?.doc_discount || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.net || "-"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.vat || "0"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.taxa_ble || "0"}
                                  </td>
                                  <td className="px-2 py-2 border text-gray-800">
                                    {row.total || "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <hr className="my-6 border-gray-300" />

                        {/* === Notes + Totals Row === */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                          {/* Vendor Note */}
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Customer Note
                            </label>
                            <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-800 text-sm shadow-inner min-h-[90px] whitespace-pre-wrap">
                              {formData?.current_stage_comment?.trim()
                                ? formData.current_stage_comment
                                : "-"}
                            </div>
                          </div>

                          {/* Totals Section */}
                          <div className="bg-black text-white rounded-xl p-4 w-full md:w-1/2 shadow-lg">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div>Total</div>
                              <div className="text-right font-semibold">
                                {parseFloat(sums.initialTotal).toFixed(2)}
                              </div>

                              <div>Item Discount</div>
                              <div className="text-right font-semibold">
                                {parseFloat(sums.discount).toFixed(2)}
                              </div>
                              <div>Global Discount</div>
                              <div className="text-right font-semibold">
                                {parseFloat(sums.doc_discount).toFixed(2)}
                              </div>

                              <div>Net Total</div>
                              <div className="text-right font-semibold">
                                {parseFloat(sums.net).toFixed(2)}
                              </div>

                              <div>Tax</div>
                              <div className="text-right font-semibold">
                                {parseFloat(sums.vat).toFixed(2)}
                              </div>

                              <div className="pt-2 text-lg font-semibold">
                                Grand Total
                              </div>
                              <div className="pt-2 text-right text-lg font-bold">
                                {parseFloat(sums.total).toFixed(2)}
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

export default Edit_Invoice;
