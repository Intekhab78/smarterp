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

function Generate_Invoice() {
  const navigate = useNavigate();
  const params = useParams();
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [rows, setRows] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSalesmanValue, setAutocompleteSalesmanValue] =
    useState("");
  const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
  const [item, setItem] = useState([]);
  const [Customers, setCustomerList] = useState([]);
  const [Salesmans, setSalesmanList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  const [isNegStockAllowed, setIsNegStockAllowed] = useState(0);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    order_number: "",
    delivery_date: today,
    payment_terms: "",
    company_id: "",
    location_id: "",
    due_date: "",
    status: "Open",
    order_type: "Normal",
    any_comment: "",
  });

  const [order, setOrderData] = useState();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "order/details", {
        id: params.id,
      });

      console.log("fetchOrderDetails----------------", response.data);

      if (response.status) {
        const orderData = response.data;
        setFormData({
          ...formData,
          id: orderData.id,
          customer_id: orderData.customer_id,
          customer_lob: orderData.customer_lob,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          salesman_id: orderData.salesman_id,
          customer_lpo: orderData.customer_lpo,
          order_number: orderData.order_number,
          delivery_date: orderData.delivery_date,
          payment_terms: orderData.payment_terms,
          due_date: orderData.due_date,
          status: orderData.status,
          order_type: orderData.order_type,
          any_comment: orderData.any_comment,
          customer_address_id: orderData.customer_address_id,
        });
        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }
        let AutocompleteValueCustomer = {
          id: orderData?.customer_details?.id,
          customer_code: orderData?.customer_details?.customer_code,
          user_id: orderData?.customer_details?.id,
          first_name: orderData?.customer_details?.first_name,
          last_name: orderData?.customer_details?.last_name,
          email: orderData?.customer_details?.email,
        };

        console.log("AutocompleteValueCustomer-", AutocompleteValueCustomer);

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
          label: orderData.payment_terms.name,
          value: orderData.payment_terms.id,
        };
        setAutocompletePaymentValue(AutocompletePayment);

        //items
        let order_details = [];
        for (let index = 0; index < orderData.order_details.length; index++) {
          const element = orderData.order_details[index];

          // ❌ Skip item if open_qty < 1
          if ((parseFloat(element.open_qty) || 0) < 1) continue;

          let item_uom = element.itemLocationModel?.item_main_prices;
          const filteredObject = item_uom?.find(
            (item) => item.item_uom_id === element.item_uom_id,
          );

          // Base values
          let qty = parseFloat(element.open_qty) || 0;
          let price =
            element.is_free == 1 ? 0 : parseFloat(element.item_price) || 0;

          // Total before discount
          let itemTotal = qty * price;

          // Discount calculation
          let discount;
          if (element.discounttype === "Percentage") {
            discount =
              (itemTotal * parseFloat(element.item_discount_amount || 0)) / 100;
          } else {
            discount = parseFloat(element.item_discount_amount || 0);
          }

          let item_net = element.is_free == 1 ? 0 : itemTotal - discount;

          // VAT
          let vat_percentage =
            // parseFloat(element?.itemLocationModel?.tax_master_item?.taxcal) ||
            parseFloat(element?.itemLocationModel?.tax_master_1?.taxcal) || 0;

          let taxAmt = (item_net * vat_percentage) / 100;

          // Final total
          let final_total = item_net + taxAmt;

          let obje = {
            id: parseFloat(index + 1),
            order_details_id: parseFloat(element.id),
            item_id: parseFloat(element.item_id),
            item_code: element.itemLocationModel.item_code,
            item_name: element.itemLocationModel.item_name,
            remaining_stock: element.itemLocationModel?.remaining_stock,
            uom: parseFloat(element?.item_uom_id),
            item_uom:
              element.itemLocationModel.item_main_prices[0].item_uom.name,

            quantity: qty,
            avl_qty: qty, // ⭐ add this line
            price: price,
            // discount: discount.toFixed(2),
            discount:
              element.discounttype === "Percentage"
                ? parseFloat(element.item_discount_amount).toFixed(2) // send % value (10)
                : discount.toFixed(2), // send amount (50)

            // net: item_net.toFixed(2),
            vat: vat_percentage,
            // taxa_ble: taxAmt.toFixed(2),
            taxa_ble: Number(taxAmt),
            tax_amount: Number(taxAmt),
            total: Number(final_total),
            net: Number(item_net),

            // total: final_total.toFixed(2),

            actions: "",
            newValue: element.itemLocationModel,
            newValue_uom: filteredObject
              ? filteredObject
              : element.itemLocationModel.item_main_prices[0],
            uom_list: element.itemLocationModel.item_main_prices,
            skim: element.is_free == 1 ? "Free" : "None",
            discounttype: element.discounttype,
          };

          order_details.push(obje);
        }
        setRows(order_details);
        console.log("order details is ----------------", order_details);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
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

  useEffect(() => {
    if (formData.company_id) {
      fetchlocationList(formData.company_id);
    }
  }, [formData.company_id]);

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    fetchcompanyList();
    fetchOrderDetails();
  }, []);

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
          : row,
      ),
    );
  };

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
    // console.log('newValue',newValue)
    if (type == "customer") {
      setAutocompleteValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        customer_id: newValue ? newValue.id : "", // <-- use newValue.id here
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
            uom: newValue?.item_main_prices?.[0]?.item_uom?.id,
            item_uom: newValue?.item_main_prices?.[0]?.item_uom?.name,
            quantity: (1.0).toFixed(2),
            price: parseFloat(newValue?.itemprice).toFixed(2),
            // total: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            net: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            vat: parseFloat(newValue?.item_tax),
            taxa_ble: (
              (parseFloat(newValue?.itemprice) *
                1 *
                parseFloat(newValue?.item_tax)) /
              100
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

  const itemquantityChange = (quantity, params) => {
    const { value, name } = quantity.target;
    let itemPrice = parseFloat(params.price);

    if (name === "quantity") {
      let totalquantity = value;
      let itemss = itemPrice * totalquantity;
      let itemDiscount = parseFloat(params.discount);
      const typeDiscount = params.discounttype;
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemPrice) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
      let itemTotal = parseFloat(itemNet);
      let taxa_ble = (
        (parseFloat(itemNet) * parseFloat(params.vat)) /
        100
      ).toFixed(2);
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: totalquantity,
              // total: parseFloat(itemTotal),
              price: parseFloat(itemPrice),
              discount: parseFloat(itemDiscount),
              net: parseFloat(itemNet),
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              taxa_ble: taxa_ble,
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "price") {
      itemPrice = value;
      let totalquantity = params.quantity;
      let itemss = itemPrice * totalquantity;
      let itemDiscount = params.discount;
      const typeDiscount = params.discounttype;
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemPrice) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
      let itemTotal = parseFloat(itemNet);
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
      let taxa_ble = (
        (parseFloat(itemNet) * parseFloat(params.vat)) /
        100
      ).toFixed(2);

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              vat: parseFloat(params.vat),
              taxa_ble: taxa_ble,
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              quantity: parseFloat(totalquantity).toFixed(2),
              price: itemPrice,
              discount: parseFloat(itemDiscount).toFixed(2),
              net: parseFloat(itemNet).toFixed(2),
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "discount") {
      let totalquantity = parseFloat(params.quantity);
      let itemss = itemPrice * totalquantity;
      let itemDiscount = value;
      const typeDiscount = params.discounttype;
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemPrice) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
      let itemTotal = parseFloat(itemNet);
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
      let taxa_ble = (
        (parseFloat(itemNet) * parseFloat(params.vat)) /
        100
      ).toFixed(2);

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              vat: parseFloat(row?.vat),
              taxa_ble: taxa_ble,
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              quantity: parseFloat(totalquantity).toFixed(2),
              // total: parseFloat(itemTotal).toFixed(2),
              price: parseFloat(itemPrice).toFixed(2),
              discount: itemDiscount,
              net: parseFloat(itemNet).toFixed(2),
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "discounttype") {
      const totalquantity = params.quantity;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(params.discount);
      const typeDiscount = value;
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemPrice) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
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
          : row,
      );
      setRows(updatedRows);
    }
  };

  const validation = (formData) => {
    let errors = {};

    if (!formData.customer_id) {
      errors.customer = "Customer is required";
    }
    if (!formData.status) {
      errors.status = "Status is required";
    }

    if (!formData.order_number) {
      errors.order_number = "Order Number is required";
    }
    if (!formData.order_type) {
      errors.order_type = "Type is required";
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
    let invalidRow = rows.some(
      (row) =>
        row.skim === "None" &&
        (!row.quantity || !row.price || row.quantity <= 0 || row.price <= 0),
    );
    if (invalidRow) {
      setisSubmit(false);
      // setFormError({ general: "Quantity and Price cannot be null or zero." });
      ToastMassage("Quantity and Price cannot be null or zero.", "error");
      return;
    }
    // BLOCK SUBMIT IF ANY ITEM HAS open_qty <= 0 relates to if invocie ty greater than Order quantity
    const invalidItem = rows.find(
      (item) => parseFloat(item.quantity) > parseFloat(item.avl_qty),
    );

    console.log("items is ------------", invalidItem);
    if (invalidItem) {
      setisSubmit(false);
      ToastMassage(
        `${invalidItem.item_name} has only ${invalidItem.avl_qty} avl quantity in Sales Order.`,
        "error",
      );
      return;
    }
    // EXTRA CHECK — if any item has open_qty < 1 (0)
    console.log("rows is ---------------", rows);
    // const zeroOpenQtyItem = rows.find((item) => parseFloat(item.open_qty) < 1);
    // if (zeroOpenQtyItem) {
    //   setisSubmit(false);
    //   ToastMassage(
    //     `${zeroOpenQtyItem.item_name} cannot be added — avl quantity is 0.`,
    //     "error"
    //   );
    //   return;
    // }

    if (isNegStockAllowed === 0) {
      let insufficientRow = rows.find(
        (row) => row.quantity > row.remaining_stock,
      );

      if (insufficientRow) {
        setisSubmit(false);
        ToastMassage(
          `Item ${insufficientRow.item_name} Not enough stock to generate the invoice`,
          "error",
        );
        return;
      }
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
        console.log("finalPramas------", finalPramas);

        const response = await axios_post(true, "invoice/add", finalPramas);
        // console.log("response form geberate invoice-------add ", response);

        if (response) {
          if (response.status) {
            ToastMassage(response.message, "success");
            navigate("/invoice");
          } else {
            // ↓ Show real API error message
            const apiError =
              response.data ||
              response.error ||
              response.message ||
              "Something went wrong!";

            ToastMassage(apiError, "error");
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
      fetchLocationList(value);
    }
  };

  const handleInputChange = (rowIndex, field, value) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const row = { ...newRows[rowIndex], [field]: value };

      // Parse numeric values safely
      const price = parseFloat(row.price) || 0;
      const quantity = parseFloat(row.quantity) || 0;
      const discount = parseFloat(row.discount) || 0;
      const discountType = row.discounttype || ""; // note: your select uses "discount_type"
      const taxPercent = parseFloat(row.vat) || 0;

      // const taxPercent = parseFloat(row?.vat) || 0;
      // const tax_percent = parseFloat(row?.vat) || 0;
      // const taxPercent = parseFloat(row.tax_percent) || 0;

      const totalBeforeDiscount = price * quantity;

      // Calculate discount amount correctly based on type
      let discountAmount = 0;
      if (discountType.toLowerCase() === "percentage") {
        discountAmount = (totalBeforeDiscount * discount) / 100;
      } else if (discountType.toLowerCase() === "amount") {
        discountAmount = discount;
      }

      // Prevent discount from exceeding total
      if (discountAmount > totalBeforeDiscount) {
        // You can show a warning here or clamp discountAmount
        discountAmount = totalBeforeDiscount;
      }

      // Net amount after discount
      const net = totalBeforeDiscount - discountAmount;

      // Calculate tax amount based on net
      const taxAmount = (net * taxPercent) / 100;

      // Total amount including tax
      const total = net + taxAmount;

      // Update calculated fields
      newRows[rowIndex] = {
        ...row,
        discount: discount, // make sure discount stays as entered
        net: net.toFixed(2),
        tax_amount: taxAmount.toFixed(2),
        total: total.toFixed(2),
      };

      return newRows;
    });
  };

  console.log("rows is --------------", rows);

  const calculateSums1 = (items) => {
    console.log("items is ----------", items);

    return items.reduce(
      (sums, item) => {
        const itemPrice = parseFloat(item?.price) || 0;
        const qty = parseFloat(item?.quantity) || 0;
        const discountValue = parseFloat(item?.discount) || 0;

        // FIX: use correct key (discount_type)
        const discountType =
          item?.discounttype || item?.discounttype || "Percentage";

        const itemTotalBeforeDiscount = itemPrice * qty;

        let discountAmount = 0;

        if (discountType === "Percentage") {
          discountAmount = (itemTotalBeforeDiscount * discountValue) / 100;
        } else if (discountType === "Amount") {
          discountAmount = discountValue; // flat amount
        }

        const net = itemTotalBeforeDiscount - discountAmount;

        sums.initialTotal += itemTotalBeforeDiscount;
        sums.discount += discountAmount;
        sums.net += net;
        sums.excise += parseFloat(item.excise) || 0;
        sums.vat += parseFloat(item?.taxa_ble) || 0;
        sums.total += net;

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
  const calculateSums = (items) => {
    console.log("items is -------------", items);

    return items.reduce(
      (sums, item) => {
        const itemPrice = parseFloat(item?.price) || 0;
        const qty = parseFloat(item?.quantity) || 0;
        const discountValue = parseFloat(item?.discount) || 0;
        const discountType = item?.discounttype || "Percentage";

        const itemTotalBeforeDiscount = itemPrice * qty;

        let discountAmount = 0;
        if (discountType === "Percentage") {
          discountAmount = (itemTotalBeforeDiscount * discountValue) / 100;
        } else {
          discountAmount = discountValue;
        }

        const net = itemTotalBeforeDiscount - discountAmount;

        const exciseValue = parseFloat(item.excise) || 0;

        // ✅ Recalculate VAT fresh using item.vat (percent)
        const vatPercent = parseFloat(item.vat) || 0;
        const vatAmount = (net * vatPercent) / 100;

        sums.initialTotal += itemTotalBeforeDiscount;
        sums.discount += discountAmount;
        sums.net += net;
        sums.excise += exciseValue;
        sums.vat += vatAmount;

        // Final total uses freshly computed VAT
        sums.total += net + exciseValue + vatAmount;

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
  console.log("sums is -----------", sums);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* Tailwind-converted Invoice Generate UI — logic unchanged */}
      <div className="custome-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full">
              <form onSubmit={handleSubmit} method="POST" action="#">
                <div className="bg-white rounded-lg shadow">
                  {/* Header bar */}
                  <div className="bg-info-500 bg-blue-500 rounded-t-lg text-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-base">
                          shopping_cart
                        </span>
                        <h3 className="text-lg font-semibold">
                          Invoice Generate
                        </h3>
                      </div>

                      <div>
                        <Link to="/order">
                          <button
                            type="button"
                            className="bg-white text-blue-600 px-4 py-2 rounded-md text-base font-medium shadow-sm hover:bg-gray-100"
                          >
                            Back
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Row inputs grid */}
                      {/* === Order Number Section === */}
                      {/* === Order Header === */}
                      <div className="bg-gray-100 text-black font-medium text-sm flex items-center justify-between px-4 py-2 rounded-md mb-2">
                        <span>Order Number</span>
                        <span className="font-semibold">
                          {formData.order_number || "S1O10108"}
                        </span>
                      </div>

                      {/* === Form Card === */}
                      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 space-y-4">
                        {/* === Row 1: Company & Location === */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Company */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
                              Company
                            </label>
                            <Select
                              name="company_id"
                              value={formData.company_id}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-md text-sm"
                              sx={{
                                height: 32,
                                fontSize: "12px",
                                borderRadius: "6px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                              }}
                            >
                              {compines?.map((company) => (
                                <MenuItem
                                  key={company.id}
                                  value={company.id}
                                  sx={{ fontSize: "12px", py: 0.5 }}
                                >
                                  {company.compdesc}
                                </MenuItem>
                              ))}
                            </Select>
                            {formError.company_id && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.company_id}
                              </p>
                            )}
                          </div>

                          {/* Location */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
                              Location
                            </label>
                            <Select
                              name="location_id"
                              value={formData.location_id}
                              onChange={handleChange}
                              disabled={!formData.company_id}
                              className="w-full border border-gray-300 rounded-md text-sm"
                              sx={{
                                height: 32,
                                fontSize: "12px",
                                borderRadius: "6px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                              }}
                            >
                              {locations?.map((location) => (
                                <MenuItem
                                  key={location.id}
                                  value={location.id}
                                  sx={{ fontSize: "12px", py: 0.5 }}
                                >
                                  {location.locname}
                                </MenuItem>
                              ))}
                            </Select>
                            {formError.location_id && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.location_id}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* === Row 2: Delivery Date, Customer, Customer LPO === */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Delivery Date */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
                              {/* Delivery Date */}
                              Invoice Date
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
                              className="w-full border border-gray-300 rounded-md px-2 py-[6px] text-sm"
                            />
                            {/* {formError.delivery_date && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.delivery_date}
                              </p>
                            )} */}
                          </div>

                          {/* Customer */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
                              Customer
                            </label>
                            <Autocomplete
                              disablePortal
                              options={Customers}
                              getOptionLabel={(option) =>
                                option.customer_code +
                                  "-" +
                                  option?.users?.first_name || ""
                              }
                              renderOption={(props, option) => (
                                <li {...props}>
                                  {option.customer_code}-
                                  {option?.users?.first_name}{" "}
                                  {option?.users?.last_name}
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
                                  size="small"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 32,
                                      fontSize: "12px",
                                      borderRadius: "6px",
                                    },
                                  }}
                                />
                              )}
                              disabled
                            />
                            {formError.customer && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.customer}
                              </p>
                            )}
                          </div>

                          {/* Customer LPO */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
                              Customer LPO
                            </label>
                            <input
                              type="text"
                              name="customer_lpo"
                              value={formData.customer_lpo}
                              onChange={handleChange}
                              disabled
                              className="w-full border border-gray-300 rounded-md px-2 py-[6px] text-sm"
                            />
                            {formError.customer_lpo && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.customer_lpo}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* === Row 3: Employee, Order Type, Due Date === */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Employee */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
                              Employee
                            </label>
                            <Autocomplete
                              disablePortal
                              options={Salesmans}
                              getOptionLabel={(option) =>
                                option.salesman_code +
                                  "-" +
                                  option?.users?.firstname || ""
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
                                  size="small"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 32,
                                      fontSize: "12px",
                                      borderRadius: "6px",
                                    },
                                  }}
                                />
                              )}
                              // disabled
                            />
                            {formError.salesman && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.salesman}
                              </p>
                            )}
                          </div>

                          {/* Order Type */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
                              Order Type
                            </label>
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
                                  size="small"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 32,
                                      fontSize: "12px",
                                      borderRadius: "6px",
                                    },
                                  }}
                                />
                              )}
                              disabled
                            />
                            {formError.order_type && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.order_type}
                              </p>
                            )}
                          </div>

                          {/* Due Date */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
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
                              disabled
                              className="w-full border border-gray-300 rounded-md px-2 py-[6px] text-sm"
                            />
                            {formError.due_date && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.due_date}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* === Row 4: Payment Terms & Status === */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Payment Terms */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
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
                                  "payment_term",
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 32,
                                      fontSize: "12px",
                                      borderRadius: "6px",
                                    },
                                  }}
                                />
                              )}
                              disabled
                            />
                            {formError.payment_term && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.payment_term}
                              </p>
                            )}
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 ">
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
                                      height: 32,
                                      fontSize: "12px",
                                      borderRadius: "6px",
                                    },
                                  }}
                                />
                              )}
                              disabled
                            />
                            {formError.status && (
                              <p className="text-red-600 text-xs mt-1">
                                {formError.status}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items table */}
                      <div className="overflow-x-auto">
                        <TableContainer>
                          <Table
                            sx={{ minWidth: 800, width: "100%" }}
                            aria-label="responsive table"
                          >
                            <TableHead>
                              <TableRow>
                                {[
                                  "ITEM CODE",
                                  "ITEM NAME",

                                  "Scheme",
                                  "Price",
                                  "Quantity",
                                  "Total",
                                  "Discount Type",
                                  "Discount",
                                  "Net",
                                  "Tax%",
                                  "Tax Amt",
                                  "Row Total",
                                  "Action",
                                ].map((header) => (
                                  <TableCell
                                    key={header}
                                    sx={{
                                      fontSize: "12px",
                                      minWidth:
                                        header === "ITEM NAME"
                                          ? 350
                                          : header === "Action"
                                            ? 60
                                            : 90,
                                      padding: "6px 8px",
                                      fontWeight: 600,
                                      backgroundColor: "#f8fafc",
                                      textAlign: "center",
                                      whiteSpace: "nowrap", // ✅ Prevents line break
                                    }}
                                  >
                                    {header}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {rows.map((row, rowIndex) => (
                                <TableRow key={rowIndex} hover>
                                  {/* === ITEM CODE === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <Autocomplete
                                      disablePortal
                                      options={item}
                                      getOptionLabel={(option) =>
                                        option.item_code || ""
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
                                      disabled
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder="Item code"
                                          variant="outlined"
                                          size="small"
                                          sx={{
                                            "& .MuiInputBase-root": {
                                              height: "32px",
                                              fontSize: "12px",
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </TableCell>

                                  {/* === ITEM NAME === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="text"
                                      readOnly
                                      value={row.item_name || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "item_name",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Scheme === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="text"
                                      readOnly
                                      value={row.scheme || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "scheme",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Price === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="number"
                                      readOnly
                                      value={row.price || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "price",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Quantity === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="number"
                                      readOnly
                                      value={row.quantity || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "quantity",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>
                                  {/* === Total === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="number"
                                      readOnly
                                      value={
                                        parseFloat(row.price * row.quantity) ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "price",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Discount Type === */}
                                  {/* <TableCell sx={{ padding: "6px 8px" }}>
                                    <select
                                      // value={row.discount_type || ""}
                                      value={row.discounttype || ""}
                                      readOnly
                                      // onChange={(e) =>
                                      //   handleInputChange(
                                      //     rowIndex,
                                      //     "discount_type",
                                      //     e.target.value
                                      //   )
                                      // }
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "discounttype",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] bg-white outline-none"
                                    >
                                      <option value="Percentage">
                                        Percentage
                                      </option>
                                      <option value="Amount">Amount</option>
                                    </select>
                                  </TableCell> */}

                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <select
                                      value={row.discounttype || ""}
                                      disabled
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "discounttype",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] bg-white outline-none"
                                    >
                                      <option value="Percentage">
                                        Percentage
                                      </option>
                                      <option value="Amount">Amount</option>
                                    </select>
                                  </TableCell>

                                  {/* === Discount === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="number"
                                      readOnly
                                      value={row.discount || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "discount",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Net === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="number"
                                      value={row.net || ""}
                                      readOnly
                                      className="w-full border border-gray-200 bg-gray-100 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Tax% === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="number"
                                      disabled
                                      value={row.vat || "0"}
                                      onChange={(e) =>
                                        handleInputChange(
                                          rowIndex,
                                          "vat",
                                          e.target.value,
                                        )
                                      }
                                      // value={row.tax_percent || "0"}
                                      // onChange={(e) =>
                                      //   handleInputChange(
                                      //     rowIndex,
                                      //     "tax_percent",
                                      //     e.target.value
                                      //   )
                                      // }
                                      className="w-full border border-gray-300 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Tax Amount === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="number"
                                      value={row.tax_amount || "0"}
                                      readOnly
                                      className="w-full border border-gray-200 bg-gray-100 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Total === */}
                                  <TableCell sx={{ padding: "6px 8px" }}>
                                    <input
                                      type="number"
                                      value={row.total || ""}
                                      readOnly
                                      className="w-full border border-gray-200 bg-gray-100 rounded-md px-2 text-[12px] h-[32px] outline-none"
                                    />
                                  </TableCell>

                                  {/* === Action === */}
                                  <TableCell
                                    sx={{
                                      padding: "6px 8px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <button
                                      onClick={() => handleRemoveRow(rowIndex)}
                                      className="text-red-500 text-xs font-medium hover:text-red-600"
                                    >
                                      ✕
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>

                      {/* Divider */}
                      <div>
                        <hr />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch mt-4">
                        {/* === Customer Note === */}
                        <div className="flex flex-col h-full">
                          <div className="border border-gray-200 bg-gray-50 rounded-md p-3 flex flex-col justify-between h-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Customer Note
                            </label>
                            {/* <input
                              type="text"
                              value={formData.any_comment || ""} // show the value here
                              className="w-full flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white outline-none"
                            /> */}
                            <input
                              type="text"
                              value={formData.any_comment || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  any_comment: e.target.value,
                                }))
                              }
                              className="w-full flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white outline-none"
                            />
                          </div>
                        </div>

                        {/* === Totals Section === */}
                        <div className="flex flex-col h-full">
                          <div className="border border-gray-200 bg-black text-white p-4 rounded-md flex flex-col justify-between h-[200px]">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div>Total</div>
                              <div className="font-medium text-right">
                                {parseFloat(sums.initialTotal).toFixed(2)}
                              </div>
                              <div>Discount</div>
                              <div className="font-medium text-right">
                                {parseFloat(sums.discount).toFixed(2)}
                              </div>

                              <div>Net Total</div>
                              <div className="font-medium text-right">
                                {parseFloat(sums.net).toFixed(2)}
                              </div>

                              <div>Tax</div>
                              <div className="font-medium text-right">
                                {parseFloat(sums.vat).toFixed(2)}
                              </div>
                            </div>

                            <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between text-base font-semibold">
                              <span>Grand Total</span>
                              <span>{parseFloat(sums.total).toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Save Button */}
                          <div className="mt-4 flex justify-center">
                            <button
                              type="submit"
                              disabled={isSubmit}
                              className="px-6 py-2.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-base font-medium disabled:opacity-60 relative"
                            >
                              {isSubmit ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end space-y-6 */}
                  </div>
                  {/* end body p-6 */}
                </div>
                {/* end card */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Generate_Invoice;
