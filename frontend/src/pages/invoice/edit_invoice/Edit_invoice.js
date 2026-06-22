import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

function Edit_invoice() {
  const navigate = useNavigate();
  const params = useParams();
  const fetchedRef = useRef(false); // <-- add this

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
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    status: "Open",
    invoice_type: "",
    current_stage_comment: "",
    order_number: "",
  });

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/invoice/details`,
        { id: params.id }
      );
      console.log("fetchOrderDetails--------------", response.data.data);

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
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          delivery_date: orderData.invoice_date,
          payment_terms: orderData.payment_terms,
          due_date: orderData.invoice_due_date,
          status: orderData.status,
          invoice_type: orderData.invoice_type,
          current_stage_comment: orderData.current_stage_comment,
          order_number: orderData?.orderModel?.order_number,
        });

        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }

        const AutocompleteValueCustomer = {
          id: orderData?.vendor_details?.id,
          vendor_code: orderData?.vendor_details?.vendor_code,
          user_id: orderData?.vendor_details?.id,
          users: {
            firstname: orderData?.vendor_details?.firstname,
            lastname: orderData?.vendor_details?.lastname,
            email: orderData?.vendor_details?.email,
          },
        };
        setAutocompleteValue(AutocompleteValueCustomer);

        const AutocompleteValueSalesman = {
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

        const AutocompletePayment = {
          label: orderData?.payment_terms?.name,
          value: orderData?.payment_terms?.id,
        };
        setAutocompletePaymentValue(AutocompletePayment);

        // Items
        const invoice_details = orderData?.invoice_details?.map(
          (element, index) => {
            console.log("element is --------------", element);

            const item_uom_list = element.itemLocationModel.item_main_prices;
            const filteredUOM = item_uom_list.find(
              (item) => item.item_uom_id === element.item_uom_id
            );

            const quantity = parseFloat(element.item_qty) || 0;
            const pricePerUnit = element.is_free
              ? 0.0
              : parseFloat(element.item_price) || 0.0;
            // const discountPerUnit = element.is_free
            //   ? 0.0
            //   : (parseFloat(element.item_discount_amount) || 0.0) / quantity;
            // const net = quantity * (pricePerUnit - discountPerUnit);
            let discountAmount = 0;

            if (!element.is_free) {
              if (element.discounttype === "Percentage") {
                const percent = parseFloat(element.item_discount_amount) || 0;
                discountAmount = (pricePerUnit * quantity * percent) / 100; // PERCENTAGE LOGIC
              } else {
                discountAmount = parseFloat(element.item_discount_amount) || 0; // AMOUNT LOGIC
              }
            }

            const net = pricePerUnit * quantity - discountAmount;

            const taxRate = element.is_free
              ? 0.0
              : parseFloat(
                  element?.itemLocationModel?.tax_master_1?.taxcal || 0.0
                );

            const taxa_ble = parseFloat(((net * taxRate) / 100).toFixed(2));
            const total = parseFloat((net + taxa_ble).toFixed(2));

            return {
              id: index + 1,
              order_details_id: parseFloat(element.id),
              item_id: parseFloat(element.item_id),
              item_code: element.itemLocationModel.item_code,
              item_name: element.itemLocationModel.item_name,
              uom: parseFloat(element?.item_uom_id),
              item_uom:
                element.itemLocationModel.item_main_prices[0].item_uom.name,

              quantity: quantity,
              price: pricePerUnit,
              excise: element.is_free
                ? 0.0
                : parseFloat(element.item_excise) || 0.0,
              // discount: discountPerUnit * quantity,
              // discount: discountAmount,
              discount:
                element.discounttype === "Percentage"
                  ? parseFloat(element.item_discount_amount) || 0 // show % (10)
                  : discountAmount, // show amount (50)

              discountAmountCalc: discountAmount, // 80 for % case

              net: net,
              vat: taxRate,
              taxa_ble: taxa_ble,
              total: total,

              actions: "",
              newValue: element.itemLocationModel,
              newValue_uom:
                filteredUOM || element.itemLocationModel.item_main_prices[0],
              uom_list: item_uom_list,
              skim: element.is_free ? "Free" : "None",
              discounttype: element.discounttype,
            };
          }
        );

        setRows(invoice_details);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return; // skip the 2nd Strict-Mode run
    fetchedRef.current = true;
    ItemList();
    CustomerList();
    fetchcompanyList();
    SalesmanList();
    fetchOrderDetails();
  }, []);
  // Confirm rows state is updated
  useEffect(() => {
    console.log("✅ rows updated:", rows);
  }, [rows]);

  console.log("Customers data is ----", Customers);

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

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        item_id: "",
        item_code: "",
        item_name: "",
        uom: "",
        quantity: 1,
        skim: "None",
        discounttype: "Percentage",
        price: 0,
        rate: (0.0).toFixed(2),
        excise: (0.0).toFixed(2),
        discount: (0.0).toFixed(2),
        net: (0.0).toFixed(2),
        item_grand_total: (0.0).toFixed(2),
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
    console.log("newvalue", newValue);

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
            price: parseFloat(newValue?.itemprice).toFixed(2),
            rate: parseFloat(newValue?.itemprice).toFixed(2),
            // total: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            net: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            vat: parseFloat(newValue?.item_tax),
            taxa_ble: (
              (parseFloat(newValue?.itemprice) *
                1 *
                parseFloat(newValue?.item_tax)) /
              100
            ).toFixed(2),
            // item_grand_total: (
            //   parseFloat(newValue?.itemprice || 0) +
            //   (parseFloat(newValue?.itemprice || 0) *
            //     parseFloat(newValue?.item_tax || 0)) /
            //     100 -
            //   parseFloat(newValue?.discount || 0)
            // ).toFixed(2),
            item_grand_total: (
              parseFloat(newValue?.itemprice || 0) +
              (parseFloat(newValue?.itemprice || 0) *
                parseFloat(newValue?.item_tax || 0)) /
                100 -
              parseFloat(newValue?.discount || 0)
            ).toFixed(2),
            total: (
              parseFloat(newValue?.itemprice) +
              (parseFloat(newValue?.itemprice) *
                parseFloat(newValue?.item_tax)) /
                100
            ).toFixed(2),
            newValue: newValue,
            uom_list: newValue?.item_main_prices,
          }
        : row
    );
    console.log("updated rows", updatedRows);

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

  const itemquantityChange = (event, params) => {
    const { name, value } = event.target;

    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== params.id) return row;

        // update the field directly
        const updatedRow = { ...row, [name]: value };

        // extract fields safely
        const quantity = parseFloat(updatedRow.quantity) || 1;
        const price = parseFloat(updatedRow.price) || 0;
        const discountInput = parseFloat(updatedRow.discount) || 0; // user input
        const vatRate = parseFloat(updatedRow.vat) || 0;

        // subtotal
        const gross = price * quantity;

        // calculate discount based on type
        let discountValue = 0;
        let perUnitDiscount = 0;

        if (updatedRow.discounttype === "Percentage") {
          discountValue = (gross * discountInput) / 100;
          perUnitDiscount = discountInput;
        } else if (updatedRow.discounttype === "Amount") {
          discountValue = discountInput;
          perUnitDiscount = discountInput / quantity;
        }

        // prevent invalid discounts
        if (discountValue > gross) {
          ToastMassage("Discount cannot be more than price.");
          return row;
        }

        // net calculations
        const net = gross - discountValue;
        const taxa_ble = ((net * vatRate) / 100).toFixed(2);
        const total = (net + parseFloat(taxa_ble)).toFixed(2);

        return {
          ...updatedRow,
          computedDiscount: discountValue.toFixed(2), // keep computed discount separately
          perUnitDiscountItem: perUnitDiscount.toFixed(2),
          net: net.toFixed(2),
          taxa_ble,
          total,
        };
      })
    );
  };

  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        const itemPrice = parseFloat(item?.price) || 0;
        const qty = parseFloat(item?.quantity) || 0;
        const discountValue = parseFloat(item?.discount) || 0;
        const discountType = item?.discounttype; // may be "Percentage", "Amount", or null
        const itemTotalBeforeDiscount = itemPrice * qty;

        let discountAmount = 0;

        // 🧮 Correct calculation
        if (discountType === "Percentage") {
          discountAmount = (itemTotalBeforeDiscount * discountValue) / 100;
        } else if (discountType === "Amount") {
          discountAmount = discountValue;
        } else {
          // If no discount type specified, assume it's a flat discount amount
          discountAmount = discountValue;
        }

        const netAmount = itemTotalBeforeDiscount - discountAmount;
        const vatAmount = parseFloat(item?.taxa_ble) || 0;
        const exciseAmount = parseFloat(item?.excise) || 0;
        const totalAmount = netAmount + vatAmount + exciseAmount;

        sums.initialTotal += itemTotalBeforeDiscount;
        sums.discount += discountAmount;
        sums.net += netAmount;
        sums.vat += vatAmount;
        sums.excise += exciseAmount;
        sums.total += totalAmount;

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
  console.log("sums is ", sums);

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
                : {
                    price: parseFloat(row.newValue?.itemprice).toFixed(2),
                    vat: parseFloat(row.newValue?.item_tax),
                    taxa_ble: (
                      (parseFloat(row.newValue?.itemprice) *
                        1 *
                        parseFloat(row.newValue?.item_tax)) /
                      100
                    ).toFixed(2),
                    total: (
                      parseFloat(row.newValue?.itemprice) +
                      (parseFloat(row.newValue?.itemprice) *
                        parseFloat(row.newValue?.item_tax)) /
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
    // if (!formData.addedby) errors.addedby = "Added by is required";
    if (!formData.company_id) errors.company_id = "Company id is required";
    // if (!formData.status) {
    //   errors.status = "Status is required";
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
  console.log("row is -----------------", rows);

  const handleSubmit = async (event) => {
    setisSubmit(true);

    event.preventDefault();
    let errors = validation(formData);
    let invalidRow = rows.some(
      (row) =>
        row.skim === "None" &&
        (!row.quantity ||
          row.price == null ||
          row.quantity < 1 ||
          row.price < 0)
      // (!row.quantity || !row.price || row.quantity <1 || row.price <= 0)
    );
    if (invalidRow) {
      setisSubmit(false);
      // setFormError({ general: "Quantity and Price cannot be null or zero." });
      ToastMassage("Quantity and Price cannot be null or zero.", "error");
      console.log("Invalid row found");
      return;
    }
    if (Object.keys(errors)?.length > 0) {
      setisSubmit(false);
      setFormError(errors);
      console.log("Validation errors: ", errors);
    } else {
      if (rows?.length == 0) {
        setisSubmit(false);
        setFormError({});
        setItemError("Please select item");
        ToastMassage("Please select item", "error");
        console.log("No items in rows");
        // console.log("formData", formData);
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
        console.log("invoice/update finalPramas ", finalPramas);

        const response = await axios_post(true, "invoice/update", finalPramas);
        if (response) {
          if (response.status) {
            ToastMassage(response.message, "success");
            navigate("/invoice");
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
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <form onSubmit={handleSubmit} method="POST" action="#">
              <Card>
                <div className="mx-2 -mt-3 py-3 px-2 rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-blue-500 flex items-center justify-between">
                  {/* === Left Section: Title === */}
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-white text-lg">
                      shopping_cart
                    </span>
                    <h2 className="text-white text-lg font-semibold">
                      Edit Invoice.
                    </h2>
                  </div>

                  {/* === Right Section: Back Button === */}
                  <Link to="/invoice">
                    <button
                      type="button"
                      className="bg-white text-gray-700 font-medium py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition text-sm"
                    >
                      Back
                    </button>
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
                      <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-5xl mx-auto">
                        {/* === Header Bar (Invoice Number) === */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg px-5 py-2 mb-5 shadow-sm">
                          <h2 className="text-sm font-medium tracking-wide">
                            Invoice Number
                          </h2>
                          <span className="text-base font-semibold">
                            {formData.invoice_number || "—"}
                          </span>
                        </div>

                        {/* === Row 1: Company, Location === */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Company */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Company
                            </label>
                            <select
                              name="company_id"
                              value={formData.company_id}
                              onChange={handleChange}
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                              <option value="">Select Company</option>
                              {compines?.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.compdesc}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Location */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Location
                            </label>
                            <select
                              name="location_id"
                              value={formData.location_id}
                              onChange={handleChange}
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                              <option value="">Select Location</option>
                              {locations?.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                  {loc.locname}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* === Row 2: Customer, Vendor LPO, Delivery Date === */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {/* Customer */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Customer
                            </label>
                            <select
                              name="customer_id"
                              value={formData.customer_id}
                              onChange={handleChange}
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                              <option value="">Select Customer</option>
                              {Customers?.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.customer_code} {c.first_name} {c.last_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Vendor LPO */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Customer Document No
                            </label>
                            <input
                              type="text"
                              name="customer_lpo"
                              value={formData.customer_lpo}
                              onChange={handleChange}
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                          </div>

                          {/* Delivery Date */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
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
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* === Row 3: Salesman, Due Date, Invoice Type === */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {/* ✅ Fixed Salesman Field */}
                          {/* Salesman */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Salesman
                            </label>
                            <Autocomplete
                              disablePortal
                              id="salesman"
                              options={Salesmans}
                              getOptionLabel={(option) =>
                                option.salesman_code +
                                  "-" +
                                  option?.users?.firstname || ""
                              }
                              value={autocompleteSalesmanValue}
                              onChange={(event, newValue) =>
                                handleAutocompleteChange(
                                  event,
                                  newValue,
                                  "salesman"
                                )
                              }
                              sx={{
                                width: "100%",
                                "& .MuiInputBase-root": {
                                  height: 38,
                                  fontSize: 13,
                                  borderRadius: "8px",
                                },
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              disabled
                            />
                          </div>

                          {/* Due Date */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Due Date
                            </label>
                            <input
                              type="date"
                              value={formData.due_date}
                              disabled
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  due_date: e.target.value,
                                })
                              }
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                          </div>

                          {/* Invoice Type */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Invoice Type
                            </label>
                            <select
                              value={formData.invoice_type}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  invoice_type: e.target.value,
                                })
                              }
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                              <option value="">Select Type</option>
                              <option value="Normal">Normal</option>
                              <option value="Consignment">Consignment</option>
                            </select>
                          </div>
                        </div>

                        {/* === Row 4: Payment Terms, Status === */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Payment Terms */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Payment Terms
                            </label>
                            <select
                              name="payment_term"
                              value={formData.payment_term}
                              onChange={handleChange}
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                              <option value="">Select Term</option>
                              {payment_term?.map((p) => (
                                <option
                                  key={p.id || p.value}
                                  value={p.id || p.value}
                                >
                                  {p.term_name || p.label || String(p)}
                                </option>
                              ))}
                            </select>
                          </div>

                          {formData.invoice_type === "Order" && (
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                Order No
                              </label>

                              <input
                                type="text"
                                value={formData.order_number || ""}
                                readOnly // prevent editing
                                className="w-full border rounded text-sm h-9  bg-gray-100 cursor-not-allowed"
                              />
                            </div>
                          )}

                          {/* Status */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Status
                            </label>
                            <select
                              value={formData.status}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  status: e.target.value,
                                })
                              }
                              className="w-full h-9 text-sm border border-gray-300 rounded-md px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                              <option value="">Select Status</option>
                              <option value="Open">Open</option>
                              <option value="Close">Close</option>
                              <option value="Partial receive">
                                Partial receive
                              </option>
                              <option value="Cancel">Cancel</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* === Items Table Section === */}

                      <div className="bg-white rounded-2xl shadow-md p-6 mt-6 w-full max-w-7xl mx-auto">
                        {/* === Table Wrapper (scrolls together: header + rows) === */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          {/* === Scrollable Table === */}
                          <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                            <table className="w-full min-w-[1000px] border-collapse text-[13px]">
                              {/* === Header === */}
                              <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 uppercase">
                                <tr>
                                  {[
                                    "ITEM CODE",
                                    "ITEM NAME",
                                    "UOM",
                                    "Qty",
                                    "Scheme",
                                    "Price",
                                    "Rate",
                                    "Disc. Type",
                                    "Disc.",
                                    "Net",
                                    "Tax%",
                                    "Tax Amt",
                                    "Total",
                                    "Action",
                                  ].map((header) => (
                                    <th
                                      key={header}
                                      className="border border-gray-200 px-2.5 py-2 text-[12px] font-semibold text-left whitespace-nowrap"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              {/* === Body === */}
                              <tbody>
                                {rows.map((row, rowIndex) => (
                                  <tr
                                    key={rowIndex}
                                    className="even:bg-gray-50 hover:bg-indigo-50 transition-colors"
                                  >
                                    {/* ITEM CODE */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[250px]">
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
                                          <li
                                            {...props}
                                            className="text-[13px]"
                                          >
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
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                              ...params.InputProps,
                                              sx: {
                                                height: 32,
                                                fontSize: 13,
                                                borderRadius: "6px",

                                                "& fieldset": {
                                                  border: "none",
                                                },
                                              },
                                            }}
                                          />
                                        )}
                                      />
                                    </td>

                                    {/* ITEM NAME */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[220px]">
                                      <MDInput
                                        type="text"
                                        value={row.item_name}
                                        disabled
                                        variant="standard"
                                        sx={{
                                          width: "100%",
                                          fontSize: 13,

                                          borderRadius: "6px",
                                          px: 1,
                                          "& .MuiInputBase-root:before": {
                                            borderBottom: "none",
                                          },
                                          "& .MuiInputBase-root:after": {
                                            borderBottom: "none",
                                          },
                                          "& input": { py: 0.6 },
                                        }}
                                      />
                                    </td>

                                    {/* UOM */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[70px]">
                                      <MDInput
                                        type="text"
                                        value={row.item_uom}
                                        disabled
                                        variant="standard"
                                        sx={{
                                          width: "100%",
                                          fontSize: 13,

                                          borderRadius: "6px",
                                          px: 1,
                                          "& .MuiInputBase-root:before": {
                                            borderBottom: "none",
                                          },
                                          "& .MuiInputBase-root:after": {
                                            borderBottom: "none",
                                          },
                                          "& input": { py: 0.6 },
                                        }}
                                      />
                                    </td>

                                    {/* Quantity */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[80px]">
                                      <MDInput
                                        type="number"
                                        name="quantity"
                                        value={row.quantity}
                                        onChange={(e) =>
                                          itemquantityChange(e, row)
                                        }
                                        variant="standard"
                                        sx={{
                                          width: "100%",
                                          fontSize: 13,

                                          borderRadius: "6px",
                                          px: 1,
                                          "& .MuiInputBase-root:before": {
                                            borderBottom: "none",
                                          },
                                          "& .MuiInputBase-root:after": {
                                            borderBottom: "none",
                                          },
                                          "& input": { py: 0.6 },
                                        }}
                                      />
                                    </td>

                                    {/* Scheme */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[90px]">
                                      <select
                                        value={row.skim || "None"}
                                        onChange={(e) =>
                                          handleSkimChange(
                                            e.target.value,
                                            rowIndex
                                          )
                                        }
                                        className="border-none bg-gray-50 rounded-md text-[13px] w-full h-[32px] focus:ring-2 focus:ring-indigo-400"
                                      >
                                        <option value="None">None</option>
                                        <option value="Free">Free</option>
                                      </select>
                                    </td>

                                    {/* Price */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[90px]">
                                      <MDInput
                                        type="number"
                                        name="price"
                                        value={row.price}
                                        onChange={(e) =>
                                          itemquantityChange(e, row)
                                        }
                                        variant="standard"
                                        sx={{
                                          width: "100%",
                                          fontSize: 13,

                                          borderRadius: "6px",
                                          px: 1,
                                          "& .MuiInputBase-root:before": {
                                            borderBottom: "none",
                                          },
                                          "& .MuiInputBase-root:after": {
                                            borderBottom: "none",
                                          },
                                          "& input": { py: 0.6 },
                                        }}
                                      />
                                    </td>

                                    {/* Rate */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[90px]">
                                      <MDInput
                                        type="number"
                                        name="rate"
                                        value={row.rate}
                                        onChange={(e) =>
                                          itemquantityChange(e, row)
                                        }
                                        variant="standard"
                                        sx={{
                                          width: "100%",
                                          fontSize: 13,

                                          borderRadius: "6px",
                                          px: 1,
                                          "& .MuiInputBase-root:before": {
                                            borderBottom: "none",
                                          },
                                          "& .MuiInputBase-root:after": {
                                            borderBottom: "none",
                                          },
                                          "& input": { py: 0.6 },
                                        }}
                                      />
                                    </td>

                                    {/* Discount Type */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[100px]">
                                      <select
                                        value={row.discounttype}
                                        name="discounttype"
                                        onChange={(e) =>
                                          itemquantityChange(e, row)
                                        }
                                        className="border-none bg-gray-50 rounded-md text-[13px] w-full h-[32px] focus:ring-2 focus:ring-indigo-400"
                                      >
                                        <option value="Percentage">
                                          Percentage
                                        </option>
                                        <option value="Amount">Amount</option>
                                      </select>
                                    </td>

                                    {/* Discount */}
                                    <td className="border border-gray-200 px-2 py-1 min-w-[90px]">
                                      <MDInput
                                        type="number"
                                        name="discount"
                                        value={row.discount}
                                        onChange={(e) =>
                                          itemquantityChange(e, row)
                                        }
                                        variant="standard"
                                        sx={{
                                          width: "100%",
                                          fontSize: 13,

                                          borderRadius: "6px",
                                          px: 1,
                                          "& .MuiInputBase-root:before": {
                                            borderBottom: "none",
                                          },
                                          "& .MuiInputBase-root:after": {
                                            borderBottom: "none",
                                          },
                                          "& input": { py: 0.6 },
                                        }}
                                      />
                                    </td>

                                    {/* Net, Tax, Total */}
                                    {["net", "vat", "taxa_ble", "total"].map(
                                      (key, i) => (
                                        <td
                                          key={i}
                                          className="border border-gray-200 px-2 py-1 min-w-[80px]"
                                        >
                                          <MDInput
                                            type="number"
                                            value={row[key]}
                                            disabled
                                            variant="standard"
                                            sx={{
                                              width: "100%",
                                              fontSize: 13,

                                              borderRadius: "6px",
                                              px: 1,
                                              "& .MuiInputBase-root:before": {
                                                borderBottom: "none",
                                              },
                                              "& .MuiInputBase-root:after": {
                                                borderBottom: "none",
                                              },
                                              "& input": { py: 0.6 },
                                            }}
                                          />
                                        </td>
                                      )
                                    )}

                                    {/* Action */}
                                    <td className="border border-gray-200 px-2 py-1 text-center min-w-[60px]">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveRow(rowIndex)
                                        }
                                        className="text-red-500 hover:text-red-700 transition"
                                      >
                                        <Icon fontSize="small">clear</Icon>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* === Add Row Button === */}
                        <div className="flex justify-start mt-4">
                          <button
                            onClick={handleAddRow}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                          >
                            + Add Row
                          </button>
                        </div>

                        <hr className="my-6" />

                        {/* === Totals & Notes Section === */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-6">
                          {/* === Notes Section === */}
                          <div className="flex flex-col">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Customer Note
                            </label>
                            <textarea
                              className="flex-grow w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Enter any additional notes here..."
                              value={formData.current_stage_comment || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  current_stage_comment: e.target.value,
                                }))
                              }
                            />
                          </div>

                          {/* === Totals Section === */}
                          <div className="bg-black text-white rounded-xl p-5 shadow-md flex flex-col justify-between w-full max-w-sm ml-auto">
                            <div className="space-y-2">
                              {[
                                ["Total", sums.initialTotal],
                                ["Discount", sums.discount],
                                ["Net Total", sums.net],
                                ["Tax", sums.vat],
                                ["Grand Total", sums.total],
                              ].map(([label, value], index) => (
                                <div
                                  key={label}
                                  className={`flex justify-between items-center text-sm ${
                                    index === 4
                                      ? "border-t border-gray-600 pt-2 mt-2"
                                      : ""
                                  }`}
                                >
                                  <span className="font-medium">{label}</span>
                                  <span className="font-semibold">
                                    {parseFloat(value).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* === Action Buttons === */}
                        <div className="flex justify-center mt-8 space-x-4">
                          <button
                            type="button"
                            disabled={isSubmit}
                            onClick={handleBack}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-md shadow-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md shadow-sm relative"
                          >
                            {isSubmit ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              />
                            ) : (
                              "Save"
                            )}
                          </button>
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

export default Edit_invoice;
