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
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    status: "Open",
    Invoice_type: "Normal",
  });

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/invoice/details`,
        {
          id: params.id,
        }
      );

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
        });
        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }
        let AutocompleteValueCustomer = {
          id: orderData?.customer?.id,
          customer_code: orderData?.customer?.customerInfo?.customer_code,
          user_id: orderData?.customer?.customerInfo?.user_id,
          users: {
            firstname: orderData?.customer?.firstname,
            lastname: orderData?.customer?.lastname,
            email: orderData?.customer?.email,
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
          console.log(
            "element is  from invoice ---------------------",
            element
          );

          let item_uom = element.itemLocationModel.item_main_prices;
          const filteredObject = item_uom.find(
            (item) => item.item_uom_id === element.item_uom_id
          );
          console.log("filteredObject", filteredObject);
          console.log("item_uom", item_uom);
          let obje1 = {
            id: index + 1,
            item_id: element.item_id,
            item_code: element.itemLocationModel?.item_code,
            item_name: element.itemLocationModel?.item_name,
            uom: element.item_uom_id,
            item_uom:
              element.itemLocationModel.item_main_prices[0].item_uom.name,
            quantity: element.item_qty,
            ship_quantity: element.item_ship_quantity,
            price: element.item_gross,
            excise: element.item_excise,
            discount: element.item_discount_amount,
            net: element.item_net,
            vat: element.item_vat,
            total: element.item_grand_total,
            actions: "",
            newValue: element.itemLocationModel,
            newValue_uom: filteredObject
              ? filteredObject
              : element.itemLocationModel.item_main_prices[0],
            uom_list: element.itemLocationModel.item_main_prices,
          };
          let obje = {
            id: index + 1,
            invoice_details_id: element.id,
            item_id: element.item_id,
            item_code: element.itemLocationModel.item_code,
            item_name: element.itemLocationModel.item_name,
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
            // vat: element.item_vat,
            vat:
              element?.is_free == 1
                ? 0
                : parseFloat(element.itemLocationModel?.tax_master_1?.taxcal),
            taxa_ble:
              element?.is_free == 1
                ? 0.0
                : (
                    (parseFloat(element?.item_net) *
                      1 *
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
            // total: element.is_free == 1 ? 0.00 : element.item_grand_total,
            actions: "",
            newValue: element.itemLocationModel,
            newValue_uom: filteredObject
              ? filteredObject
              : element.itemLocationModel.item_main_prices[0],
            uom_list: element.itemLocationModel.item_main_prices,
            skim: element?.is_free == 1 ? "Free" : "None",
            discounttype: element?.discounttype,
          };
          invoice_details.push(obje);
        }
        setRows(invoice_details);
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
    if (type == "customer") {
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
        quantity: (0.0).toFixed(2),
        skim: "None",
        discounttype: "Percentage",
        price: (0.0).toFixed(2),
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
          itemss - ((parseFloat(itemss) * itemDiscount) / 100).toFixed(2);
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
              total: parseFloat(itemTotal),
              price: parseFloat(itemPrice),
              discount: parseFloat(itemDiscount),
              net: parseFloat(itemNet),
              total: (itemTotal + parseFloat(taxa_ble)).toFixed(2),
              taxa_ble: taxa_ble,
            }
          : row
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
          itemss - ((parseFloat(itemss) * itemDiscount) / 100).toFixed(2);
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
              // total: parseFloat(itemTotal).toFixed(2),
              price: itemPrice,
              discount: parseFloat(itemDiscount).toFixed(2),
              net: parseFloat(itemNet).toFixed(2),
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "rate") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              rate: parseFloat(value),
            }
          : row
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
          itemss - ((parseFloat(itemss) * itemDiscount) / 100).toFixed(2);
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
          : row
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
    }
  };

  const validation = (formData) => {
    let errors = {};

    if (!formData.customer_id) {
      errors.customer = "Customer is required";
    }
    // if (!formData.addedby) errors.addedby = "Added by is required";
    if (!formData.company_id) errors.company_id = "Company id is required";
    if (!formData.status) {
      errors.status = "Status is required";
    }

    if (!formData.invoice_number) {
      errors.invoice_number = "Invoice Number is required";
    }
    if (!formData.Invoice_type) {
      errors.Invoice_type = "Type is required";
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

  const calculateSums = (items) => {
    console.log("items is -------------", items);

    return items.reduce(
      (sums, item) => {
        sums.excise += parseInt(item.excise) || 0.0;
        sums.discount += parseInt(item.discount) || 0.0;
        sums.net += parseInt(item.item_grand_total) || 0.0;
        sums.vat += parseFloat(item?.taxa_ble) || 0.0;
        sums.total += parseFloat(item.item_grand_total) || 0.0;
        return sums;
      },
      { excise: 0.0, discount: 0.0, net: 0.0, vat: 0.0, total: 0.0 }
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
                  <Grid xs={12} container spacing={0}>
                    <Grid item xs={6} mr={0}>
                      <MDTypography variant="h6" color="white">
                        <Icon fontSize="small">shopping_cart</Icon>
                        Edit Invoice...
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/invoice">
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
                      xs={12}
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      <Grid item xs={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Customer</InputLabel>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={Customers}
                            getOptionLabel={(option) =>
                              option.customer_code +
                                "-" +
                                option?.users?.firstname || ""
                            }
                            renderOption={(props, option) => (
                              <li {...props}>
                                {option.customer_code}-
                                {option?.users?.firstname}{" "}
                                {option?.users?.lastname}
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
                            style={{ height: "45px" }}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} />}
                            disabled={true}
                          ></Autocomplete>
                          {formError.customer && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.customer}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Invoice Number</InputLabel>
                          <MDInput
                            type="text"
                            // label="Invoice Number"
                            variant="outlined"
                            name="invoice_number"
                            value={formData.invoice_number}
                            onChange={handleChange}
                            disabled={true}
                            sx={{ width: 300 }}
                          />
                          {formError.invoice_number && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.invoice_number}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Company </InputLabel>
                          <Select
                            name="company_id"
                            value={formData.company_id}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            // className="small-input"
                          >
                            {compines?.map((company) => (
                              <MenuItem key={company.id} value={company?.id}>
                                {company?.compdesc}
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
                            // className="small-input"
                          >
                            {locations?.map((location) => (
                              <MenuItem key={location.id} value={location?.id}>
                                {location?.locname}
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

                      <Grid item xs={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Delivery Date</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            sx={{ width: 300 }}
                            value={formData.delivery_date}
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
                        </MDBox>
                      </Grid>
                      <Grid item xs={4} pb={2}>
                        <InputLabel sx={{ mb: 1 }}>Salesman</InputLabel>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={Salesmans}
                          getOptionLabel={(option) =>
                            option.salesman_code +
                              "-" +
                              option?.users?.firstname || ""
                          }
                          renderOption={(props, option) => (
                            <li {...props}>
                              {option.salesman_code}-{option?.users?.firstname}
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
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} />}
                          disabled={true}
                        ></Autocomplete>
                        {formError.salesman && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formError.salesman}
                          </MDTypography>
                        )}
                      </Grid>
                      <Grid item xs={4} pb={2}>
                        <InputLabel sx={{ mb: 1 }}>Payment Terms</InputLabel>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={payment_term}
                          value={autocompletePaymentValue}
                          onChange={(event, newValue) =>
                            handleAutocompleteChange(
                              event,
                              newValue,
                              "payment_term"
                            )
                          }
                          // style={{ height: 45 }}
                          sx={{ width: 300 }}
                          // disabled={true}
                          renderInput={(params) => <TextField {...params} />}
                        ></Autocomplete>
                        {formError.payment_term && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formError.payment_term}
                          </MDTypography>
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Customer LPO</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            sx={{ width: 300 }}
                            name="customer_lpo"
                            value={formData.customer_lpo}
                            onChange={handleChange}
                            // disabled={true}
                          />
                          {formError.customer_lpo && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.customer_lpo}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
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
                              <TextField {...params} variant="outlined" />
                            )}
                            sx={{ width: 300 }}
                            // disabled={true}
                          />
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
                      <Grid item xs={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Due Date</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            sx={{ width: 300 }}
                            value={formData.due_date}
                            disabled={true}
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
                              F
                            >
                              {formError.due_date}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Invoice Type</InputLabel>
                          <Autocomplete
                            options={["Normal", "Consignment"]}
                            value={formData.Invoice_type}
                            onChange={(event, newValue) =>
                              setFormData({
                                ...formData,
                                Invoice_type: newValue,
                              })
                            }
                            renderInput={(params) => (
                              <TextField {...params} variant="outlined" />
                            )}
                            sx={{ width: 300 }}
                            // disabled={true}
                          />
                          {formError.Invoice_type && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.Invoice_type}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} pb={6}>
                        <Box sx={{ overflowX: "auto" }}>
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
                                    "UOM",
                                    "Quantity",
                                    "Scheme",
                                    "Price",
                                    "Rate",
                                    "Disount Type",
                                    "Discount",
                                    "Net",
                                    "Tax%",
                                    ,
                                    // 'PTRDIS'
                                    "Tax Amt",
                                    "Total",
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
                                {rows.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 250 }}
                                    >
                                      <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={item}
                                        getOptionLabel={(option) =>
                                          // option.item_code || ""
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
                                        style={{ height: 51 }}
                                        sx={{
                                          width: "100%",
                                          height: 20,
                                          fontSize: "12px",
                                        }}
                                        value={row.newValue}
                                        onChange={(event, newValue) =>
                                          ItemSelect(newValue, row)
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder="Item code"
                                            variant="outlined"
                                            sx={{ fontSize: "12px" }}
                                          />
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 200 }}
                                    >
                                      <MDInput
                                        type="text"
                                        variant="outlined"
                                        value={row.item_name}
                                        disabled={true}
                                        sx={{ fontSize: "12px" }}
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 200 }}
                                    >
                                      <MDInput
                                        type="text"
                                        value={row.item_uom}
                                        sx={{ fontSize: "12px" }}
                                        disabled={true}
                                        variant="outlined"
                                        // disablePortal
                                        // id="combo-box-demo"
                                        // options={row?.uom_list}
                                        // getOptionLabel={(option) => option.item_uom?.name || ''}
                                        // renderOption={(props, option) => (
                                        //     <li {...props}>{option.item_uom?.name}</li>
                                        // )}
                                        // style={{ height: 51 }}
                                        // sx={{
                                        //     width: '100%',
                                        //     height: 20,
                                        //     fontSize: '12px'
                                        // }}
                                        // value={row.newValue_uom}
                                        // onChange={(event, newValue) => ItemSelectUom(newValue, row)}
                                        // renderInput={(params) => (
                                        //     <TextField {...params} placeholder="Item Uom" variant="outlined" sx={{ fontSize: '12px' }} />
                                        // )}
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.quantity}
                                        name="quantity"
                                        // onChange={(value) => itemquantityChange(value, row)}
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
                                        sx={{ fontSize: "12px" }}
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <Select
                                        value={row.skim || "None"}
                                        onChange={(event) =>
                                          handleSkimChange(
                                            event.target.value,
                                            rowIndex
                                          )
                                        }
                                        sx={{
                                          fontSize: "12px",
                                          width: "100%",
                                          height: "43px",
                                        }}
                                      >
                                        <MenuItem value="None">None</MenuItem>
                                        <MenuItem value="Free">Free</MenuItem>
                                      </Select>
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        name="price"
                                        value={row.price}
                                        // onChange={(value) => itemquantityChange(value, row)}
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
                                        sx={{ fontSize: "12px" }}
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        name="rate"
                                        value={row.rate}
                                        // onChange={(value) => itemquantityChange(value, row)}
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
                                                  name: "rate",
                                                  value: 1,
                                                },
                                              },
                                              row
                                            );
                                          }
                                        }}
                                        sx={{ fontSize: "12px" }}
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
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        name="discount"
                                        value={row.discount}
                                        // onChange={(value) => itemquantityChange(value, row)}
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
                                        sx={{ fontSize: "12px" }}
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.net}
                                        disabled={true}
                                        sx={{ fontSize: "12px" }}
                                      />
                                    </TableCell>

                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.vat}
                                        disabled={true}
                                        sx={{ fontSize: "12px" }}
                                      />
                                    </TableCell>

                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.taxa_ble}
                                        disabled={true}
                                        sx={{ fontSize: "12px" }}
                                      />
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        value={row.item_grand_total}
                                        disabled={true}
                                        sx={{ fontSize: "12px" }}
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
                          Add Row
                        </MDButton>
                        {/* <MDButton variant="contained" color="secondary" onClick={handleAddRow}>
                                                    Add Bulk Item
                                                </MDButton> */}
                      </Grid>
                      <Grid item xs={12}>
                        <hr></hr>
                      </Grid>
                      <Grid item xs={7}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Customer Note</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            sx={{ width: 300 }}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={5}>
                        <MDBox mx={2} px={6} py={2} pt={2} bgColor="light">
                          <Grid
                            container
                            // rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                          >
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 16 }}
                                variant="caption"
                                color="text"
                                fontWeight="regular"
                              >
                                Discount
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 17 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                INR {parseFloat(sums.discount).toFixed(2)}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 16 }}
                                variant="caption"
                                color="text"
                                fontWeight="regular"
                              >
                                Net Total
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 17 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                INR {parseFloat(sums.net).toFixed(2)}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 16 }}
                                variant="caption"
                                color="text"
                                fontWeight="regular"
                              >
                                Excise
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 17 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                INR {parseFloat(sums.excise).toFixed(2)}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 16 }}
                                variant="caption"
                                color="text"
                                fontWeight="regular"
                              >
                                Tax
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 17 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                INR {parseFloat(sums.vat).toFixed(2)}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6} pb={1} pt={2}>
                              <MDTypography
                                style={{ fontSize: 18 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                Total
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6} pb={1} pt={2}>
                              <MDTypography
                                style={{ fontSize: 18 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                INR {parseFloat(sums.total).toFixed(2)}
                              </MDTypography>
                            </Grid>
                          </Grid>
                        </MDBox>
                        <Grid
                          container
                          spacing={2}
                          justifyContent="center"
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

export default Edit_Invoice;
