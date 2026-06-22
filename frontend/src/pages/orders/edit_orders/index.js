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

const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  ".MuiFormControlLabel-label": checked && {},
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

function Edit_Orders() {
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
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    order_number: "",
    delivery_date: "",
    company_id: "",
    location_id: "",
    payment_terms: "",
    due_date: "",
    status: "Open",
    order_type: "Normal",
    type: "sales order",
    any_comment: "",
  });
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
          console.log("eleemtn is -------------", element);

          let item_uom = element.itemLocationModel?.item_main_prices;
          const filteredObject = item_uom?.find(
            (item) => item.item_uom_id === element.item_uom_id
          );

          let obje = {
            id: parseFloat(index + 1),
            order_details_id: parseFloat(element.id),
            item_id: parseFloat(element.item_id),
            item_code: element.itemLocationModel.item_code,
            item_name: element.itemLocationModel.item_name,
            uom: parseFloat(element?.item_uom_id),
            item_uom:
              element.itemLocationModel.item_main_prices[0].item_uom.name,

            quantity: parseFloat(element.item_qty) || 0.0,
            price:
              element.is_free == 1
                ? 0.0
                : parseFloat(element.item_gross) || 0.0,
            excise:
              element.is_free == 1
                ? 0.0
                : parseFloat(element.item_excise) || 0.0,
            discount:
              element.is_free == 1
                ? 0.0
                : parseFloat(element.item_discount_amount) || 0.0,
            net:
              element.is_free == 1 ? 0.0 : parseFloat(element.item_net) || 0.0,

            vat:
              element.is_free == 1
                ? 0.0
                : parseFloat(
                    // element?.itemLocationModel?.tax_master_item?.taxcal
                    element.itemLocationModel?.tax_master_1?.taxcal
                  ) || 0.0,

            taxa_ble:
              element.is_free == 1
                ? 0.0
                : parseFloat(
                    (
                      (parseFloat(element?.item_net) *
                        parseFloat(
                          // element?.itemLocationModel?.tax_master_item?.taxcal
                          element?.itemLocationModel?.tax_master_1?.taxcal
                        )) /
                      100
                    ).toFixed(2)
                  ) || 0.0,

            total:
              element?.is_free === 1
                ? 0.0
                : parseFloat(
                    (
                      parseFloat(element?.item_net || 0) +
                      (parseFloat(element?.item_net || 0) *
                        parseFloat(
                          element?.itemLocationModel?.tax_master_1?.taxcal ??
                            0
                        )) /
                        100
                    ).toFixed(2)
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
          order_details.push(obje);
        }
        setRows(order_details);
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
    // console.log('newValue',newValue)
    // if (type == "vendor") {
    //   setAutocompleteValue(newValue);
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     customer_id: newValue == null ? "" : newValue?.id,
    //   }));
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

  const itemquantityChange4 = (quantity, params) => {
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
              // total: parseFloat(itemTotal),
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
              price: itemPrice,
              discount: parseFloat(itemDiscount).toFixed(2),
              net: parseFloat(itemNet).toFixed(2),
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
      console.log("typeDiscount", typeDiscount);
      let itemNet;
      if (typeDiscount === "Percentage") {
        itemNet =
          itemss - ((parseFloat(itemss) * itemDiscount) / 100).toFixed(2);
      } else {
        itemNet = itemss - itemDiscount;
      }
      console.log("itemNet", itemNet);
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

  const itemquantityChange = (quantity, params) => {
    const { value, name } = quantity.target;
    let itemPrice = parseFloat(params.price);

    if (name === "quantity") {
      let totalquantity = parseFloat(value);
      let itemss = itemPrice * totalquantity;
      let itemDiscount = parseFloat(params.discount);
      const typeDiscount = params.discounttype;
      let itemNet;

      if (typeDiscount === "Percentage") {
        itemNet = itemss - (parseFloat(itemss) * itemDiscount) / 100;
      } else {
        itemNet = itemss - itemDiscount;
      }

      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      let itemTotal = parseFloat(itemNet);
      let taxa_ble = (parseFloat(itemNet) * parseFloat(params.vat)) / 100;

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: parseFloat(totalquantity),
              price: parseFloat(itemPrice),
              discount: parseFloat(itemDiscount),
              net: parseFloat(itemNet.toFixed(2)),
              taxa_ble: parseFloat(taxa_ble.toFixed(2)),
              total: parseFloat((itemTotal + taxa_ble).toFixed(2)),
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "price") {
      itemPrice = parseFloat(value);
      let totalquantity = parseFloat(params.quantity);
      let itemss = itemPrice * totalquantity;
      let itemDiscount = parseFloat(params.discount);
      const typeDiscount = params.discounttype;
      let itemNet;

      if (typeDiscount === "Percentage") {
        itemNet = itemss - (parseFloat(itemss) * itemDiscount) / 100;
      } else {
        itemNet = itemss - itemDiscount;
      }

      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      let itemTotal = parseFloat(itemNet);
      let taxa_ble = (parseFloat(itemNet) * parseFloat(params.vat)) / 100;

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              vat: parseFloat(params.vat),
              taxa_ble: parseFloat(taxa_ble.toFixed(2)),
              total: parseFloat((itemTotal + taxa_ble).toFixed(2)),
              quantity: parseFloat(totalquantity),
              price: parseFloat(itemPrice),
              discount: parseFloat(itemDiscount),
              net: parseFloat(itemNet.toFixed(2)),
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "discount") {
      let totalquantity = parseFloat(params.quantity);
      let itemss = itemPrice * totalquantity;
      let itemDiscount = parseFloat(value);
      const typeDiscount = params.discounttype;
      let itemNet;

      if (typeDiscount === "Percentage") {
        itemNet = itemss - (parseFloat(itemss) * itemDiscount) / 100;
      } else {
        itemNet = itemss - itemDiscount;
      }

      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      let itemTotal = parseFloat(itemNet);
      let taxa_ble = (parseFloat(itemNet) * parseFloat(params.vat)) / 100;

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              vat: parseFloat(row?.vat),
              taxa_ble: parseFloat(taxa_ble.toFixed(2)),
              total: parseFloat((itemTotal + taxa_ble).toFixed(2)),
              quantity: parseFloat(totalquantity),
              price: parseFloat(itemPrice),
              discount: parseFloat(itemDiscount),
              net: parseFloat(itemNet.toFixed(2)),
            }
          : row
      );
      setRows(updatedRows);
    } else if (name === "discounttype") {
      const totalquantity = parseFloat(params.quantity);
      const itemss = itemPrice * totalquantity;
      const itemDiscount = parseFloat(params.discount);
      const typeDiscount = value;
      let itemNet;

      if (typeDiscount === "Percentage") {
        itemNet = itemss - (parseFloat(itemss) * itemDiscount) / 100;
      } else {
        itemNet = itemss - itemDiscount;
      }

      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }

      const itemTotal = parseFloat(itemNet);
      const taxa_ble = itemNet * (parseFloat(params.vat) / 100);

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              discounttype: typeDiscount,
              quantity: parseFloat(totalquantity),
              vat: parseFloat(row?.vat),
              taxa_ble: parseFloat(taxa_ble.toFixed(2)),
              total: parseFloat((itemTotal + taxa_ble).toFixed(2)),
              price: parseFloat(itemPrice),
              discount: parseFloat(itemDiscount),
              net: parseFloat(itemNet.toFixed(2)),
            }
          : row
      );
      setRows(updatedRows);
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
        console.log("final submi fom the edit orders---------", finalPramas);

        const response = await axios_post(true, "order/update", finalPramas);
        if (response) {
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
        const itemPrice = parseFloat(item?.price) || 0;
        const qty = parseFloat(item?.quantity) || 0;
        const discountValue = parseFloat(item?.discount) || 0;
        const discountType = item?.discounttype || "Percentage";
        const itemTotalBeforeDiscount = itemPrice * qty;

        let discountAmount = 0;

        // 🧮 Correct calculation
        if (discountType === "Percentage") {
          discountAmount = (itemTotalBeforeDiscount * discountValue) / 100;
        } else if (discountType === "Amount") {
          // ✅ treat discountValue as *flat per item* amount
          discountAmount = discountValue; // <-- this line fixes your issue
          // discountAmount = discountValue * qty; // <-- this line fixes your issue
        }

        sums.initialTotal += itemTotalBeforeDiscount;
        sums.discount += discountAmount;
        sums.net += itemTotalBeforeDiscount - discountAmount;
        sums.excise += parseFloat(item.excise) || 0;
        sums.vat += parseFloat(item?.taxa_ble) || 0;
        // sums.total += itemTotalBeforeDiscount - discountAmount;
        sums.total +=
          itemTotalBeforeDiscount -
          discountAmount +
          (parseFloat(item?.taxa_ble) || 0) +
          (parseFloat(item?.excise) || 0);

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
  console.log("sums is -----------", sums);
  console.log("rows is -----------", rows);

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
                <MDBox
                  mx={2}
                  mt={-3}
                  py={2.2}
                  px={3}
                  borderRadius="lg"
                  sx={{
                    background:
                      "linear-gradient(135deg, #1976D2 0%, #21CBF3 100%)",
                    boxShadow: "0 4px 20px rgba(33, 150, 243, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: "68px",
                  }}
                >
                  <Grid container alignItems="center">
                    {/* ================= Left Section ================= */}
                    <Grid item xs={6}>
                      <MDTypography
                        variant="h6"
                        color="white"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontWeight: 600,
                          letterSpacing: "0.5px",
                          textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                        }}
                      >
                        <Icon sx={{ fontSize: "26px", color: "#fff" }}>
                          shopping_cart
                        </Icon>
                        Edit Order
                      </MDTypography>
                    </Grid>

                    {/* ================= Right Section ================= */}
                    <Grid
                      item
                      xs={6}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <MDTypography component={Link} to="/order">
                        <MDButton
                          variant="contained"
                          color="light"
                          sx={{
                            color: "#2196F3",
                            fontWeight: 600,
                            px: 3,
                            py: 0.8,
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(255, 255, 255, 0.3)",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              backgroundColor: "#fff",
                              color: "#1976D2",
                            },
                          }}
                        >
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
                      <Grid container spacing={3} sx={{ p: 2 }}>
                        {/* ==================== Card 1 - Vendor & Order Info ==================== */}
                        <Grid item xs={12}>
                          <MDBox
                            sx={{
                              background: "#f9fafc",
                              borderRadius: "14px",
                              p: 3,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                              borderLeft: "4px solid #1976d2",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                              },
                            }}
                          >
                            <MDTypography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "#1976d2",
                                mb: 3,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <i
                                className="fas fa-user"
                                style={{ fontSize: "18px" }}
                              ></i>
                              Customer & Order Information
                            </MDTypography>

                            <Grid container spacing={3}>
                              {/* Customer */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Customer
                                </InputLabel>
                                <Autocomplete
                                  disablePortal
                                  id="vendor-select"
                                  options={Customers}
                                  getOptionLabel={(option) =>
                                    option
                                      ? `${option.customer_code || ""} - ${
                                          option.first_name || ""
                                        } ${option.last_name || ""}`
                                      : ""
                                  }
                                  renderOption={(props, option) => (
                                    <li {...props}>
                                      {option.customer_code} -{" "}
                                      {option.first_name} {option.last_name}
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
                                      placeholder="Select Vendor"
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: "10px",
                                          backgroundColor: "#fff",
                                          "& fieldset": {
                                            borderColor: "#e0e0e0",
                                          },
                                          "&:hover fieldset": {
                                            borderColor: "#90caf9",
                                          },
                                          "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                          },
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </Grid>

                              {/* PO Number */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Order Number
                                </InputLabel>
                                <MDInput
                                  type="text"
                                  name="order_number"
                                  value={formData.order_number}
                                  onChange={handleChange}
                                  disabled
                                  fullWidth
                                  sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: "10px",
                                    "& fieldset": { borderColor: "#e0e0e0" },
                                    "&:hover fieldset": {
                                      borderColor: "#90caf9",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#1976d2",
                                    },
                                  }}
                                />
                              </Grid>

                              {/* Delivery Date */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Delivery Date
                                </InputLabel>
                                <MDInput
                                  type="date"
                                  value={formData.delivery_date}
                                  fullWidth
                                  sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: "10px",
                                    "& fieldset": { borderColor: "#e0e0e0" },
                                    "&:hover fieldset": {
                                      borderColor: "#90caf9",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#1976d2",
                                    },
                                  }}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      delivery_date: e.target.value,
                                    })
                                  }
                                />
                              </Grid>
                            </Grid>
                          </MDBox>
                        </Grid>

                        {/* ==================== Card 2 - Employee & Payment Details ==================== */}
                        <Grid item xs={12}>
                          <MDBox
                            sx={{
                              background: "#f9fafc",
                              borderRadius: "14px",
                              p: 3,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                              borderLeft: "4px solid #42a5f5",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                              },
                            }}
                          >
                            <MDTypography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "#1976d2",
                                mb: 3,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <i
                                className="fas fa-briefcase"
                                style={{ fontSize: "18px" }}
                              ></i>
                              Employee & Payment Details
                            </MDTypography>

                            <Grid container spacing={3}>
                              {/* Employee */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Employee
                                </InputLabel>
                                <Autocomplete
                                  disablePortal
                                  id="employee-select"
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
                                      "salesman"
                                    )
                                  }
                                  // disabled
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Employee"
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: "10px",
                                          backgroundColor: "#fff",
                                          "& fieldset": {
                                            borderColor: "#e0e0e0",
                                          },
                                          "&:hover fieldset": {
                                            borderColor: "#90caf9",
                                          },
                                          "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                          },
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </Grid>

                              {/* Payment Term */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Payment Term
                                </InputLabel>
                                <Autocomplete
                                  disablePortal
                                  id="payment-term"
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
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: "10px",
                                          backgroundColor: "#fff",
                                          "& fieldset": {
                                            borderColor: "#e0e0e0",
                                          },
                                          "&:hover fieldset": {
                                            borderColor: "#90caf9",
                                          },
                                          "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                          },
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </Grid>

                              {/* Supplier LPO */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Customer LPO
                                </InputLabel>
                                <MDInput
                                  type="text"
                                  name="customer_lpo"
                                  fullWidth
                                  value={formData.customer_lpo}
                                  onChange={handleChange}
                                  sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: "10px",
                                    "& fieldset": { borderColor: "#e0e0e0" },
                                    "&:hover fieldset": {
                                      borderColor: "#90caf9",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#1976d2",
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </MDBox>
                        </Grid>

                        {/* ==================== Card 3 - Additional Details ==================== */}
                        <Grid item xs={12}>
                          <MDBox
                            sx={{
                              background: "#f9fafc",
                              borderRadius: "14px",
                              p: 3,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                              borderLeft: "4px solid #64b5f6",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                              },
                            }}
                          >
                            <MDTypography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "#1976d2",
                                mb: 3,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <i
                                className="fas fa-cog"
                                style={{ fontSize: "18px" }}
                              ></i>
                              Additional Details
                            </MDTypography>

                            <Grid container spacing={3}>
                              {/* Status */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Status
                                </InputLabel>
                                <Autocomplete
                                  options={[
                                    "Open",
                                    "Close",
                                    "Partial receive",
                                    "Cancel",
                                  ]}
                                  value={formData.status}
                                  onChange={(event, newValue) =>
                                    setFormData({
                                      ...formData,
                                      status: newValue,
                                    })
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Status"
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: "10px",
                                          backgroundColor: "#fff",
                                          "& fieldset": {
                                            borderColor: "#e0e0e0",
                                          },
                                          "&:hover fieldset": {
                                            borderColor: "#90caf9",
                                          },
                                          "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                          },
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </Grid>

                              {/* Due Date */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Due Date
                                </InputLabel>
                                <MDInput
                                  type="date"
                                  value={formData.due_date}
                                  fullWidth
                                  sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: "10px",
                                    "& fieldset": { borderColor: "#e0e0e0" },
                                    "&:hover fieldset": {
                                      borderColor: "#90caf9",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#1976d2",
                                    },
                                  }}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      due_date: e.target.value,
                                    })
                                  }
                                />
                              </Grid>

                              {/* Order Type */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
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
                                      placeholder="Select Order Type"
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: "10px",
                                          backgroundColor: "#fff",
                                          "& fieldset": {
                                            borderColor: "#e0e0e0",
                                          },
                                          "&:hover fieldset": {
                                            borderColor: "#90caf9",
                                          },
                                          "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                          },
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </Grid>

                              {/* Company */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Company
                                </InputLabel>
                                <Select
                                  name="company_id"
                                  value={formData.company_id}
                                  onChange={handleChange}
                                  sx={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    backgroundColor: "#fff",
                                    "& fieldset": { borderColor: "#e0e0e0" },
                                    "&:hover fieldset": {
                                      borderColor: "#90caf9",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#1976d2",
                                    },
                                  }}
                                >
                                  {compines?.map((company) => (
                                    <MenuItem
                                      key={company.id}
                                      value={company.id}
                                    >
                                      {company.compdesc}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </Grid>

                              {/* Location */}
                              <Grid item xs={12} sm={4}>
                                <InputLabel
                                  sx={{ mb: 1, fontWeight: 500, color: "#555" }}
                                >
                                  Location
                                </InputLabel>
                                <Select
                                  name="location_id"
                                  value={formData.location_id}
                                  onChange={handleChange}
                                  disabled={!formData.company_id}
                                  sx={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    backgroundColor: "#fff",
                                    "& fieldset": { borderColor: "#e0e0e0" },
                                    "&:hover fieldset": {
                                      borderColor: "#90caf9",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#1976d2",
                                    },
                                  }}
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
                              </Grid>
                            </Grid>
                          </MDBox>
                        </Grid>
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
                                    "Scheme",
                                    "Quantity",

                                    "Price",
                                    "Total",
                                    "Disount Type",
                                    "Discount",
                                    "Net",
                                    "Tax%",
                                    ,
                                    // 'PTRDIS'
                                    "Tax Amt",
                                    "Row Total",
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

                                    {/* total */}
                                    <TableCell
                                      sx={{ fontSize: "12px", minWidth: 100 }}
                                    >
                                      <MDInput
                                        type="number"
                                        variant="outlined"
                                        name="price"
                                        value={
                                          parseFloat(row.price) *
                                            parseFloat(row.quantity) || 0
                                        }
                                        onChange={(event) => {
                                          const value = parseFloat(
                                            event.target.value
                                          );
                                          if (!isNaN(value) && value >= 1) {
                                            itemquantityChange(event, row);
                                          } else if (
                                            event.target.value === ""
                                          ) {
                                            itemquantityChange(event, row);
                                          }
                                        }}
                                        onBlur={(event) => {
                                          const value = parseFloat(
                                            event.target.value
                                          );
                                          if (isNaN(value) || value < 1) {
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
                                        value={row.total}
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
                      </Grid>
                      <Grid item xs={12}>
                        <hr></hr>
                      </Grid>
                      <Grid item xs={7}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Customer Note</InputLabel>
                          <MDInput
                            type="text"
                            name="any_comment"
                            variant="outlined"
                            sx={{ width: 300 }}
                            value={formData.any_comment || ""} // show existing value
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                any_comment: e.target.value,
                              })
                            } // update when user types
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
                                Total
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography
                                style={{ fontSize: 17 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                {parseFloat(sums.initialTotal).toFixed(2)}
                              </MDTypography>
                            </Grid>
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
                                {parseFloat(sums.discount).toFixed(2)}
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
                                {parseFloat(sums.net).toFixed(2)}
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
                                {parseFloat(sums.vat).toFixed(2)}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6} pb={1} pt={2}>
                              <MDTypography
                                style={{ fontSize: 18 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                Grand Total
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6} pb={1} pt={2}>
                              <MDTypography
                                style={{ fontSize: 18 }}
                                variant="caption"
                                color="dark"
                                fontWeight="medium"
                              >
                                {parseFloat(sums.total).toFixed(2)}
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

export default Edit_Orders;
