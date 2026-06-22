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

function Generate_Invoice_po() {
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
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    company_id: "",
    location_id: "",
    order_number: "",
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    status: "Open",
    order_type: "Normal",
    current_stage_comment: "",
  });

  const [order, setOrderData] = useState();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "purchase_order/details", {
        id: params.id,
      });

      console.log("order details is --------------", response.data);

      if (response.status) {
        const orderData = response.data;
        setOrderData(response.data);

        // set form data
        setFormData({
          ...formData,
          customer_id: orderData.customer_id,
          id: orderData.id,
          customer_lob: orderData.customer_lob,
          salesman_id: orderData.salesman_id,
          customer_lpo: orderData.customer_lpo,
          order_number: orderData.order_number,
          delivery_date: orderData.delivery_date,
          payment_terms: orderData.payment_terms,
          due_date: orderData.due_date,
          status: orderData.status,
          order_type: orderData.order_type,
          company_id: orderData.company_id || "",
          location_id: orderData.location_id || "",
          vendor_comment: orderData.any_comment || "",
        });

        // autocomplete values...
        setAutocompleteValue({
          id: orderData?.vendor_details?.id,
          vendor_code: orderData?.vendor_details?.vendor_code,
          user_id: orderData?.vendor_details?.id,
          firstname: orderData?.vendor_details?.firstname,
          lastname: orderData?.vendor_details?.lastname,
          email: orderData?.vendor_details?.email,
        });

        setAutocompleteSalesmanValue({
          id: orderData?.salesman?.id,
          salesman_code: orderData?.salesman?.salesman_code || "",
          user_id: orderData?.salesman?.id,
          users: {
            firstname: orderData?.salesman?.firstname,
            lastname: orderData?.salesman?.lastname,
            email: orderData?.salesman?.email,
          },
        });

        setAutocompletePaymentValue({
          label: orderData.payment_terms?.name,
          value: orderData.payment_terms?.id,
        });

        console.log("orderData------------", orderData);

        const order_details = orderData.po_order_details
          .filter((element) => {
            console.log("element data is ---------", element); // always prints
            const qty = parseFloat(element.open_qty);
            console.log("element data is ---------", element);

            return !isNaN(qty) && qty > 0; // only numbers > 0
          })
          .map((element, index) => {
            const matchedItem = item.find((itm) => itm.id === element.item_id);
            console.log("matchedItem------------", matchedItem);
            return {
              id: index + 1,
              item_id: element.item_id,
              item_code: matchedItem?.item_code || element.item_code || "",
              item_name: matchedItem?.item_name || element.item_name || "",
              uom: element.item_uom_id,
              item_uom: element.item_uom_name || "",
              quantity: parseFloat(element.open_qty),
              // quantity: element.item_qty,
              expiry_delivery_date: element.expiry_delivery_date || "",
              purchase_cost_per_unit: element.purchase_cost_per_unit || "",
              hsn_code: element.hsn_code || "",
              receiving_site: element.receiving_site || "",
              itemtype: element.itemtype || "Finished Goods",
              landed_cost_per_unit: element.landed_cost_per_unit || "",
              price: element.item_price || 0,
              excise: element.item_excise || 0,
              discount: element.item_discount_amount || 0,
              net: element.item_net || 0,
              // vat: parseFloat(element.item_vat || 0),
              vat: parseFloat(element.itemLocationModel?.tax_master_1?.taxcal),
              taxa_ble: element.taxa_ble || 0,
              total: element.item_grand_total || 0,
              actions: "",
              discounttype: element.discounttype || "",

              newValue: matchedItem
                ? matchedItem
                : {
                    id: element.item_id,
                    item_code: element.item_code,
                    item_name: element.item_name,
                  },
            };
          });

        console.log("rows is -------------------", order_details);
        setRows(order_details);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("❌ fetchOrderDetails error:", error);
    }
  };
  useEffect(() => {
    if (item.length > 0) {
      fetchOrderDetails();
    }
  }, [item]);

  useEffect(() => {
    if (order && item.length > 0) {
      const enrichedRows = order.po_order_details.map((element, index) => {
        const matchedItem = item.find((itm) => itm.id === element.item_id);

        return {
          id: index + 1,
          item_id: element.item_id,
          item_code: matchedItem?.item_code || element.item_code || "",
          item_name: matchedItem?.item_name || element.item_name || "",
          uom: element.item_uom_id,
          item_uom: element.item_uom_name || "",
          quantity: parseFloat(element?.open_qty),
          initial_quantity: element.item_qty,
          expiry_delivery_date: element.expiry_delivery_date || "",
          purchase_cost_per_unit: element.purchase_cost_per_unit || "",
          hsn_code: element.hsn_code || "",
          receiving_site: element.receiving_site || "",
          itemtype: element.itemtype || "Finished Goods",
          landed_cost_per_unit: element.landed_cost_per_unit || "",
          price: element.item_price || 0,
          excise: element.item_excise || 0,
          discount: element.item_discount_amount || 0,
          net: element.item_net || 0,
          // vat: parseFloat(element.item_vat || 0),
          vat: parseFloat(element.itemLocationModel?.tax_master_1?.taxcal),

          taxa_ble: element.taxa_ble || 0,
          total: element.item_grand_total || 0,
          actions: "",
          discounttype: element.discounttype || "",
          newValue: matchedItem
            ? matchedItem
            : {
                id: element.item_id,
                item_code: element.item_code,
                item_name: element.item_name,
              },
        };
      });

      setRows(enrichedRows);
    }
  }, [order, item]);

  // run when either order OR item changes

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

  console.log("rows --------------------", rows);

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
          : row,
      ),
    );
  };
  const handleBack = () => {
    navigate("/purchaseorder");
  };

  const ItemList = async () => {
    const response = await axios_post(true, "item_location_master/list");
    if (response) {
      if (response.status) {
        setItem(response.data); // store full data
        console.log("item list is -------------", response.data);
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
    if (type == "vendor") {
      setAutocompleteValue(newValue);
      console.log("newValue-----------------", newValue);

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

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  let user_data = JSON.parse(localStorage.getItem("user_data"));

  const ItemSelect = (newValue, params) => {
    const updatedRows = rows.map((row) =>
      row.id === params.id
        ? {
            ...row,
            item_id: newValue?.id,
            item_code: newValue?.item_code,
            item_name: newValue?.item_name,
            receiving_site: newValue?.batch_no,
            expiry_delivery_date: newValue?.exp_date,
            hsn_code: newValue?.short_code,
            uom: newValue?.item_main_prices?.[0]?.item_uom?.id,
            item_uom: newValue?.item_main_prices?.[0]?.item_uom?.name,
            // quantity: (1.0).toFixed(2),
            quantity: parseFloat(newValue?.quantity || row.quantity || 0),

            price: parseFloat(newValue?.itemprice).toFixed(2),
            // total: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            net: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
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
          : row,
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
          : row,
      );
      setRows(updelivery_datedRows);
    } else if (name === "discount") {
      const totalquantity = params.quantity;
      const itemss = itemPrice * totalquantity;
      const itemDiscount = value;
      const typeDiscount = params.discounttype;
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
          : row,
      );
      setRows(updelivery_datedRows);
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
          : row,
      );
      setRows(updatedRows);
    } else if (name === "purchase_cost_per_unit") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              purchase_cost_per_unit: value,
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "landed_cost_per_unit") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              landed_cost_per_unit: parseFloat(value),
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "hsn_code") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              hsn_code: value,
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "receiving_site") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              receiving_site: value,
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "expiry_delivery_date") {
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              expiry_delivery_date: value,
            }
          : row,
      );
      setRows(updatedRows);
    }
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
            : row,
        ),
      );
    } else if (name === "currency") {
      setRows((prevRows) =>
        prevRows.map((row, index) =>
          index === rowIndex
            ? {
                ...row,
                currency: value,
              }
            : row,
        ),
      );
    }
    console.log("value", value);
    console.log("rowIndex", rowIndex);
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
  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    console.log("errors------------------------------", errors);
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
        console.log("finalPramas from the aad grn----", finalPramas);

        // const response = await axios_post(true, "grn/add", finalPramas);
        const response = await axios_post(
          true,
          "grn/manualinsert",
          finalPramas,
        );
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

  const calculateSums1 = (items) => {
    console.log("items is ----------------", items);

    return items.reduce(
      (sums, item) => {
        const excise = parseFloat(item.excise) || 0;
        const discount = parseFloat(item.discount) || 0;
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        const tax = parseFloat(item?.newValue?.tax_master_1?.taxcal) || 0;
        const discountType = item.discounttype || "Amount";

        const gross = price * quantity;
        const netAmount = gross;

        // ✅ Correct discount calculation
        let discountAmount =
          discountType === "Percentage" ? (gross * discount) / 100 : discount;

        // VAT based on tax percentage
        const vatAmount = ((netAmount - discountAmount) * tax) / 100;

        sums.initialTotal += gross;
        sums.excise += excise;
        sums.discount += discountAmount;
        sums.net += netAmount - discountAmount;
        sums.vat += vatAmount;

        // ✅ Total = (Net - Discount) + VAT + Excise
        sums.total += netAmount - discountAmount + vatAmount + excise;

        return sums;
      },
      { initialTotal: 0, excise: 0, discount: 0, net: 0, vat: 0, total: 0 },
    );
  };
  const calculateSums = (items) => {
    console.log("items is ----------------", items);

    return items.reduce(
      (sums, item) => {
        const excise = parseFloat(item.excise) || 0;
        const discount = parseFloat(item.discount) || 0;
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;

        // ✅ Correct tax source
        const tax = parseFloat(item.vat) || 0;

        const discountType = item.discounttype || "Amount";

        const gross = price * quantity;

        // ✅ Discount
        const discountAmount =
          discountType === "Percentage" ? (gross * discount) / 100 : discount;

        const netAmount = gross - discountAmount;

        // ✅ VAT based on correct net
        const vatAmount = (netAmount * tax) / 100;

        // ==== SUMS ====
        sums.initialTotal += gross;
        sums.excise += excise;
        sums.discount += discountAmount;
        sums.net += netAmount;
        sums.vat += vatAmount;

        // FINAL total row = net + vat + excise
        sums.total += netAmount + vatAmount + excise;

        return sums;
      },
      {
        initialTotal: 0,
        excise: 0,
        discount: 0,
        net: 0,
        vat: 0,
        total: 0,
      },
    );
  };

  const sums = calculateSums(rows);
  console.log("sums is ---------------", sums);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <form onSubmit={handleSubmit} method="POST" action="#">
              <Card>
                <div className="mx-2 -mt-3 py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg shadow-md flex items-center justify-between">
                  {/* === Left Section === */}
                  <div className="flex items-center space-x-2 text-white">
                    <span className="material-icons text-[20px]">
                      shopping_cart
                    </span>
                    <h2 className="text-lg font-semibold tracking-wide">
                      Generate GRN
                    </h2>
                  </div>

                  {/* === Right Section === */}
                  <a
                    href="/purchaseorder"
                    className="bg-white/90 text-blue-600 hover:bg-white font-medium px-4 py-1.5 rounded-md shadow-sm text-sm transition-all"
                  >
                    Back
                  </a>
                </div>

                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      {/* === Compact Card Wrapper === */}
                      <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-6xl mx-auto text-[13px]">
                        {/* === Order Number Header === */}
                        <div className="flex justify-between items-center mb-3 border-b p-1 bg-gray-200 text-black">
                          <label className="font-medium text-sm">
                            Order Number
                          </label>
                          <span className="font-semibold text-sm">
                            {formData.order_number || "-"}
                          </span>
                        </div>

                        {/* === Row 1: Company + Location === */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {/* Company */}
                          <div>
                            <label className="block text-gray-700 mb-0.5 font-medium text-sm">
                              Company
                            </label>
                            <select
                              name="company_id"
                              value={formData.company_id || ""}
                              onChange={handleChange}
                              disabled
                              className="w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-sm"
                            >
                              <option value="">Select Company</option>
                              {compines?.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.compdesc}
                                </option>
                              ))}
                            </select>
                            {formError.company_id && (
                              <p className="text-red-500 text-xs mt-0.5">
                                {formError.company_id}
                              </p>
                            )}
                          </div>

                          {/* Location */}
                          <div>
                            <label className="block text-gray-700 mb-0.5 font-medium text-sm">
                              Location
                            </label>
                            <select
                              name="location_id"
                              value={formData.location_id || ""}
                              onChange={handleChange}
                              disabled
                              className="w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-sm"
                            >
                              <option value="">Select Location</option>
                              {locations?.map((location) => (
                                <option key={location.id} value={location.id}>
                                  {location.locname}
                                </option>
                              ))}
                            </select>
                            {formError.location_id && (
                              <p className="text-red-500 text-xs mt-0.5">
                                {formError.location_id}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* === Row 2: Vendor + Date + Supplier LPO === */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          {/* Vendor */}
                          <div className="">
                            <div className="pb-2">
                              <label className="block text-gray-700 mb-1 font-medium">
                                Vendor
                              </label>

                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={Customers}
                                getOptionLabel={(option) =>
                                  option
                                    ? `${option.vendor_code || ""} - ${
                                        option.firstname || ""
                                      } ${option.lastname || ""}`
                                    : ""
                                }
                                disabled
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
                                    "vendor",
                                  )
                                }
                                className="w-full"
                                renderInput={(params) => (
                                  <div ref={params.InputProps.ref}>
                                    <input
                                      type="text"
                                      {...params.inputProps}
                                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                      placeholder="Select vendor..."
                                    />
                                  </div>
                                )}
                              />

                              {formError.customer && (
                                <p className="text-red-500 text-sm mt-2">
                                  {formError.customer}
                                </p>
                              )}

                              {selectedCustomer && (
                                <div className="mt-2 space-y-1 text-sm text-gray-700">
                                  <p>
                                    <span className="font-medium">TAX No:</span>{" "}
                                    {selectedCustomer.import_license_no || "-"}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Address:
                                    </span>{" "}
                                    {selectedCustomer?.address1 || "-"}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Contact Person:
                                    </span>{" "}
                                    {selectedCustomer?.firstname}{" "}
                                    {selectedCustomer?.lastname}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Contact Number:
                                    </span>{" "}
                                    {selectedCustomer.mobile || "-"}
                                  </p>
                                  <p>
                                    <span className="font-medium">Email:</span>{" "}
                                    {selectedCustomer.email || "-"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Date */}
                          <div>
                            <label className="block text-gray-700 mb-0.5 font-medium text-sm">
                              Date
                            </label>
                            <input
                              type="date"
                              value={formData.delivery_date || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  delivery_date: e.target.value,
                                })
                              }
                              disabled
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-sm"
                            />
                            {formError.delivery_date && (
                              <p className="text-red-500 text-xs mt-0.5">
                                {formError.delivery_date}
                              </p>
                            )}
                          </div>

                          {/* Supplier LPO */}
                          <div>
                            <label className="block text-gray-700 mb-0.5 font-medium text-sm">
                              Vendor Document No
                            </label>
                            <input
                              type="text"
                              name="customer_lpo"
                              value={formData.customer_lpo || ""}
                              onChange={handleChange}
                              disabled
                              className="w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-sm"
                            />
                            {formError.customer_lpo && (
                              <p className="text-red-500 text-xs mt-0.5">
                                {formError.customer_lpo}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* === Row 3: Employee + Payment Terms === */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Employee */}
                          <div>
                            <label className="block text-gray-700 mb-0.5 font-medium text-sm">
                              Employee
                            </label>
                            <input
                              type="text"
                              value={
                                autocompleteSalesmanValue
                                  ? `${
                                      autocompleteSalesmanValue.salesman_code ||
                                      ""
                                    } - ${
                                      autocompleteSalesmanValue.users
                                        ?.firstname || ""
                                    }`
                                  : "-"
                              }
                              disabled
                              className="w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-sm"
                            />
                            {formError.salesman && (
                              <p className="text-red-500 text-xs mt-0.5">
                                {formError.salesman}
                              </p>
                            )}
                          </div>

                          {/* Payment Terms */}

                          <div className="">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Payment Terms
                            </label>

                            <div className="relative">
                              <select
                                value={autocompletePaymentValue?.value || ""}
                                onChange={(e) => {
                                  const selected = payment_term.find(
                                    (term) => term.value === e.target.value,
                                  );
                                  handleAutocompleteChange(
                                    e,
                                    selected,
                                    "payment_term",
                                  );
                                }}
                                disabled={true}
                                className="w-full border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                              >
                                <option value="">Select Payment Term</option>
                                {payment_term.map((term, index) => (
                                  <option key={index} value={term.value}>
                                    {term.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {formError.payment_term && (
                              <p className="text-red-500 text-xs mt-1">
                                {formError.payment_term}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-0.5 font-medium text-sm">
                              Vendor Notes
                            </label>
                            <input
                              type="text"
                              name="vendor_comment"
                              value={formData.vendor_comment || ""}
                              onChange={handleChange}
                              disabled
                              className="w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-sm"
                            />
                            {formError.vendor_comment && (
                              <p className="text-red-500 text-xs mt-0.5">
                                {formError.vendor_comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* === Table Section === */}
                      <div className="w-full pb-6">
                        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                          <table className="min-w-[1300px] w-full text-[13px] border-collapse table-fixed">
                            {/* === Header === */}
                            <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10">
                              <tr className="text-center">
                                <th className="border-b font-medium w-[120px] px-2 py-2">
                                  ITEM CODE
                                </th>
                                <th className="border-b font-medium w-[300px] px-2 py-2">
                                  ITEM NAME
                                </th>
                                {/* <th className="border-b font-medium w-[100px] px-2 py-2">UOM</th> */}
                                {/* <th className="border-b font-medium w-[100px] px-2 py-2">HSN Code</th> */}

                                {grnSetting?.Is_auto_gen_batch_no === false && (
                                  <th className="border-b font-medium w-[100px] px-2 py-2">
                                    Batch No.
                                  </th>
                                )}

                                <th className="border-b font-medium w-[120px] px-2 py-2">
                                  Expiry Date
                                </th>
                                {/* <th className="border-b font-medium w-[100px] px-2 py-2">Item Type</th> */}
                                {/* <th className="border-b font-medium w-[90px] px-2 py-2">
                                  Currency
                                </th> */}
                                <th className="border-b font-medium w-[90px] px-2 py-2">
                                  Scheme
                                </th>
                                <th className="border-b font-medium w-[90px] px-2 py-2">
                                  Qty
                                </th>

                                <th className="border-b font-medium w-[100px] px-2 py-2">
                                  Price
                                </th>
                                <th className="border-b font-medium w-[100px] px-2 py-2">
                                  Total
                                </th>
                                <th className="border-b font-medium w-[120px] px-2 py-2">
                                  Discount Type
                                </th>
                                <th className="border-b font-medium w-[90px] px-2 py-2">
                                  Discount
                                </th>
                                <th className="border-b font-medium w-[100px] px-2 py-2">
                                  Net
                                </th>
                                <th className="border-b font-medium w-[90px] px-2 py-2">
                                  Tax%
                                </th>
                                <th className="border-b font-medium w-[100px] px-2 py-2">
                                  Tax Amt
                                </th>
                                <th className="border-b font-medium w-[100px] px-2 py-2">
                                  Total
                                </th>
                                <th className="border-b font-medium w-[70px] text-center px-2 py-2">
                                  Action
                                </th>
                              </tr>
                            </thead>

                            {/* === Body === */}
                            <tbody>
                              {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="even:bg-gray-50">
                                  {/* ITEM CODE */}
                                  <td className="border-b w-[120px] px-1 py-[2px]">
                                    <input
                                      type="text"
                                      placeholder="Item code"
                                      value={row.item_code || ""}
                                      onChange={(e) =>
                                        ItemSelect(e.target.value, row)
                                      }
                                      className="w-full border border-gray-300 rounded-none px-[4px] py-[2px] text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                                    />
                                  </td>

                                  {/* ITEM NAME */}
                                  <td className="border-b w-[200px] px-1 py-[2px]">
                                    <input
                                      type="text"
                                      value={row.item_name || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* UOM */}
                                  {/* <td className="border-b w-[100px] px-1 py-[2px]">
                                    <input
                                      type="text"
                                      value={row.item_uom || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td> */}

                                  {/* HSN Code */}
                                  {/* <td className="border-b w-[100px] px-1 py-[2px]">
                                    <input
                                      type="text"
                                      value={row.hsn_code || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td> */}

                                  {/* Batch No */}
                                  {grnSetting?.Is_auto_gen_batch_no ===
                                    false && (
                                    <td className="border-b w-[100px] px-1 py-[2px]">
                                      <input
                                        type="text"
                                        value={row.receiving_site || ""}
                                        disabled
                                        className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                      />
                                    </td>
                                  )}

                                  {/* Expiry Date */}
                                  <td className="border-b w-[120px] px-1 py-[2px]">
                                    <input
                                      type="date"
                                      value={row.expiry_delivery_date || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* Item Type */}
                                  {/* <td className="border-b w-[100px] px-1 py-[2px]">
            <input
              type="text"
              value={row.itemtype || "Finished Goods"}
              disabled
              className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
            />
          </td> */}

                                  {/* Currency */}
                                  {/* <td className="border-b w-[90px] px-1 py-[2px]">
                                    <input
                                      type="text"
                                      value={row.currency || "INR"}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td> */}

                                  {/* Scheme */}
                                  <td className="border-b w-[90px] px-1 py-[2px]">
                                    <input
                                      type="text"
                                      value={row.skim || "None"}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>
                                  {/* Qty */}
                                  <td className="border-b w-[90px] px-1 py-[2px]">
                                    <input
                                      type="number"
                                      name="quantity"
                                      value={row.quantity}
                                      onChange={(e) =>
                                        itemquantityChange(e, row)
                                      }
                                      className="w-full border border-gray-300 rounded-none px-[4px] py-[2px] text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                                    />
                                  </td>

                                  {/* Price */}
                                  <td className="border-b w-[100px] px-1 py-[2px]">
                                    <input
                                      type="number"
                                      value={row.price}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  <td className="border-b w-[100px] px-1 py-[2px]">
                                    <input
                                      type="number"
                                      value={(
                                        (parseFloat(row.quantity) || 0) *
                                        (parseFloat(row.price) || 0)
                                      ).toFixed(2)}
                                      readOnly
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* Discount Type */}
                                  <td className="border-b w-[120px] px-1 py-[2px]">
                                    <input
                                      type="text"
                                      value={row.discounttype || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* Discount */}
                                  <td className="border-b w-[90px] px-1 py-[2px]">
                                    <input
                                      type="number"
                                      value={row.discount || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* Net */}
                                  <td className="border-b w-[100px] px-1 py-[2px]">
                                    <input
                                      type="number"
                                      value={row.net || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* Tax% */}
                                  <td className="border-b w-[90px] px-1 py-[2px]">
                                    <input
                                      type="number"
                                      value={row.vat || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* Tax Amt */}
                                  <td className="border-b w-[100px] px-1 py-[2px]">
                                    <input
                                      type="number"
                                      value={row.taxa_ble || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* Total */}
                                  <td className="border-b w-[100px] px-1 py-[2px]">
                                    <input
                                      type="number"
                                      value={row.total || ""}
                                      disabled
                                      className="w-full bg-gray-100 border border-gray-200 rounded-none px-[4px] py-[2px] text-sm text-gray-700"
                                    />
                                  </td>

                                  {/* Action */}
                                  <td className="border-b text-center w-[70px] px-1 py-[2px]">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveRow(rowIndex)}
                                      className="px-2 py-[1px] text-red-500 hover:bg-red-50 rounded-sm text-xs font-medium"
                                    >
                                      ✕
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* === Divider === */}
                      <hr className="my-4" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full relative">
                        {/* === Customer Note === */}
                        <div className="w-full h-full">
                          <div className="relative h-full">
                            {/* <input
                              type="text"
                              value={formData.any_comment || ""}
                              placeholder="Remarks"
                              className="w-full h-full border border-gray-300 rounded-lg px-3 py-2  text-sm placeholder-gray-500 focus:outline-none"
                            /> */}
                            <input
                              type="text"
                              value={formData.current_stage_comment || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  current_stage_comment: e.target.value,
                                }))
                              }
                              placeholder="Remarks"
                              className="w-full h-full border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-500 focus:outline-none text-left"
                              style={{ verticalAlign: "top" }}
                            />
                          </div>
                        </div>

                        {/* === Totals Section === */}
                        <div className="w-full border border-gray-200 rounded-lg p-4 text-white bg-black shadow-sm text-sm flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Total</span>
                              <span className="font-medium">
                                {parseFloat(sums.initialTotal).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Discount</span>
                              <span className="font-medium">
                                {parseFloat(sums.discount).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Net Total</span>
                              <span className="font-medium">
                                {parseFloat(sums.net).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Tax</span>
                              <span className="font-medium">
                                {parseFloat(sums.vat).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t font-semibold text-[15px]">
                              <span>Grand Total</span>
                              <span>{parseFloat(sums.total).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* === Buttons (outside totals box but same alignment) === */}
                        <div className="col-span-2 flex justify-end gap-3 mt-4">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="bg-gray-300 text-gray-800 px-5 py-1.5 rounded-md text-sm hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmit}
                            className="bg-blue-600 text-white px-5 py-1.5 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isSubmit ? "Saving..." : "Save"}
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

export default Generate_Invoice_po;
