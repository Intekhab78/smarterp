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

function Edit_Po() {
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
  const [Customers, setCustomerList] = useState([]);
  const [Salesmans, setSalesmanList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [orderData, setOrderData] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    order_number: "",
    delivery_date: "",
    payment_terms: "",
    any_comment: "",
    due_date: "",
    status: "Open",
    order_type: "Normal",
    type: "purchase order",
  });
  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "purchase_order/details", {
        id: params.id,
      });
      console.log("fetch order details from  purchase order", response.data);

      if (response.status) {
        const orderData = response.data;
        setOrderData(orderData); // ✅ store globally for other useEffects
        setFormData({
          ...formData,
          id: orderData.id,
          company_id: orderData.company_id || "",
          location_id: orderData.location_id || "",
          customer_id: orderData.customer_id,
          customer_lob: orderData.customer_lob,
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
        let AutocompleteValueCustomer = {
          id: orderData?.vendor_details?.id,
          vendor_code: orderData?.vendor_details?.vendor_code,
          company_name: orderData?.vendor_details?.company_name,
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
          label: orderData.payment_terms.name,
          value: orderData.payment_terms.id,
        };
        setAutocompletePaymentValue(AutocompletePayment);

        //items
        let order_details = [];
        for (
          let index = 0;
          index < orderData.po_order_details.length;
          index++
        ) {
          const element = orderData.po_order_details[index];
          let obje = {
            id: index + 1,
            purchaseorder_details_id: element.id,
            item_id: element.item_id,
            item_code: element.itemLocationModel.item_code,
            item_name: element.itemLocationModel.item_name,
            uom: element.itemLocationModel?.item_uom?.name,
            item_uom_id: element.itemLocationModel?.item_uom?.id,
            quantity: element.item_qty,
            expiry_delivery_date: element.expiry_delivery_date,
            purchase_cost_per_unit: element.purchase_cost_per_unit,
            hsn_code: element.hsn_code,
            receiving_site: element.receiving_site,
            itemtype: element.itemtype,
            landed_cost_per_unit: element.landed_cost_per_unit,
            price: element.item_gross,
            excise: element.item_excise,
            discount: element.item_discount_amount,
            net: element.item_net,
            // vat: element.item_vat,
            // vat: parseFloat(element.itemLocationModel?.item_tax),
            // taxa_ble: (
            //   (parseFloat(element?.itemcost) *
            //     1 *
            //     parseFloat(element?.itemLocationModel?.item_tax)) /
            //   100
            // ).toFixed(2),

            // total: (
            //   parseFloat(element?.itemcost) +
            //   (parseFloat(element?.itemcost) *
            //     parseFloat(element?.itemLocationModel?.item_tax)) /
            //     100
            // ).toFixed(2),
            // vat: parseFloat(element.itemLocationModel?.item_tax),
            vat: parseFloat(element.itemLocationModel?.tax_master_1?.taxcal),
            taxa_ble: parseFloat(element.taxa_ble).toFixed(2),

            total: parseFloat(element.item_grand_total).toFixed(2),

            //            vat: parseFloat(element.itemLocationModel?.tax_master_1?.taxcal),

            //           taxa_ble: (
            //             (parseFloat(element?.item_net) *
            //               1 *
            //               parseFloat(element?.itemLocationModel?.tax_master_1?.taxcal)) /
            //             100
            //           ).toFixed(2),

            // total: (
            //             parseFloat(element?.itemcost) +
            //             (parseFloat(element?.item_net) *
            //               parseFloat(element?.itemLocationModel?.tax_master_1?.taxcal)) /
            //               100
            //           ).toFixed(2),
            total: element.item_grand_total,
            actions: "",
            newValue: element.itemLocationModel,

            uom_list: element.itemLocationModel.item_main_prices,
            discounttype: element.discounttype,
          };
          order_details.push(obje);
        }
        console.log("order detaiks isn==============", order_details);

        setRows(order_details);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    if (orderData?.vendor_details && Customers?.length > 0) {
      const vendor = Customers.find(
        (v) => v.id === orderData.vendor_details.id,
      );

      if (vendor) {
        setAutocompleteValue(vendor);
        setSelectedCustomer(vendor);
      } else {
        setAutocompleteValue({
          id: orderData.vendor_details.id,
          vendor_code: orderData.vendor_details.vendor_code,
          company_name: orderData.vendor_details.company_name,
          firstname: orderData.vendor_details.firstname,
          lastname: orderData.vendor_details.lastname,
          email: orderData.vendor_details.email,
        });
        setSelectedCustomer(orderData.vendor_details);
      }
    }
  }, [orderData, Customers]);

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    fetchcompanyList();
    fetchOrderDetails();
  }, []);

  // const ItemList = async () => {
  //   const response = await axios_post(true, "item/list");
  //   if (response) {
  //     if (response.status) {
  //       setItem(response.data);
  //     } else {
  //       ToastMassage(response.message, "error");
  //     }
  //   }
  // };
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

  useEffect(() => {
    console.log(
      "formData.company_id && formData.location_id",
      formData.company_id,
      formData.location_id,
    );

    if (formData.company_id && formData.location_id) {
      const filtered = item.filter(
        (itm) =>
          itm.company_id === formData.company_id &&
          itm.location_id === formData.location_id,
      );
      setFilteredItems(filtered);
      console.log("filtered items is ------------", filtered);
    } else {
      setFilteredItems([]); // clear if not selected
    }
  }, [formData.company_id, formData.location_id, item]);

  // Once company_id is set (from order details), load related locations
  useEffect(() => {
    if (formData.company_id) {
      fetchlocationList(formData.company_id);
    }
  }, [formData.company_id]);

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

  const filterOptions = createFilterOptions({
    matchFrom: "any", // match anywhere in the string
    stringify: (option) =>
      `${option.vendor_code} ${option.company_name} ${option.firstname}`, // fields to search
  });
  let user_data = JSON.parse(localStorage.getItem("user_data"));
  const SalesmanList = async () => {
    const response = await axios_post(
      true,
      "salesman/list",
      user_data.usertype === 3 ? { id: user_data.id } : {},
    );
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
    if (type === "vendor") {
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
    console.log("newValue-----------", newValue);

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
            uom: newValue?.item_uom?.uomname,
            item_uom_id: newValue?.item_uom?.id,
            quantity: (1.0).toFixed(2),
            price: parseFloat(newValue?.itemcost).toFixed(2),
            // total: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            net: (parseFloat(newValue?.itemcost) * 1).toFixed(2),
            vat: parseFloat(newValue?.tax_master_1?.taxcal),
            taxa_ble: (
              (parseFloat(newValue?.itemcost) *
                1 *
                parseFloat(newValue?.tax_master_1?.taxcal)) /
              100
            ).toFixed(2),
            // total: (
            //   parseFloat(newValue?.itemprice) +
            //   (parseFloat(newValue?.itemprice) *
            //     parseFloat(newValue?.item_tax)) /
            //     100
            // ).toFixed(2),
            total: (
              parseFloat(newValue?.itemcost) +
              (parseFloat(newValue?.itemcost) *
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

  const itemquantityChange = (eventOrQuantity, params) => {
    const { name, value } = eventOrQuantity?.target || {
      name: null,
      value: null,
    };

    if (!name || value === undefined) {
      return;
    }

    let itemPrice = parseFloat(params.price) || 0;
    const totalquantity = parseFloat(params.quantity) || 0;
    const itemDiscount = parseFloat(params.discount) || 0;
    const typeDiscount = params.discounttype;
    const itemTax = parseFloat(params.vat) || 0;

    const calculateRowTotals = (
      price,
      quantity,
      discount,
      discountType,
      vat,
    ) => {
      const grossAmount = parseFloat(price) * parseFloat(quantity) || 0;

      let netAmount;
      if (discountType === "Percentage") {
        netAmount =
          grossAmount - parseFloat(((grossAmount * discount) / 100).toFixed(2));
      } else {
        netAmount = grossAmount - discount;
      }

      if (discount > grossAmount) {
        ToastMassage("Discount cannot be more than price.");
        return null;
      }

      const taxAmount = parseFloat(((netAmount * vat) / 100).toFixed(2));
      const totalAmount = parseFloat(netAmount) + taxAmount;

      return {
        netAmount: parseFloat(netAmount.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      };
    };

    let rowTotals;

    if (name === "quantity") {
      rowTotals = calculateRowTotals(
        itemPrice,
        value,
        itemDiscount,
        typeDiscount,
        itemTax,
      );
      if (!rowTotals) return;

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              quantity: parseFloat(value) || 0,
              price: itemPrice,
              discount: itemDiscount,
              net: rowTotals.netAmount,
              total: rowTotals.totalAmount,
              taxa_ble: rowTotals.taxAmount,
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "price") {
      rowTotals = calculateRowTotals(
        value,
        totalquantity,
        itemDiscount,
        typeDiscount,
        itemTax,
      );
      if (!rowTotals) return;

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              price: parseFloat(value) || 0,
              quantity: totalquantity,
              discount: itemDiscount,
              net: rowTotals.netAmount,
              total: rowTotals.totalAmount,
              taxa_ble: rowTotals.taxAmount,
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "discount") {
      rowTotals = calculateRowTotals(
        itemPrice,
        totalquantity,
        value,
        typeDiscount,
        itemTax,
      );
      if (!rowTotals) return;

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              discount: parseFloat(value) || 0,
              net: rowTotals.netAmount,
              total: rowTotals.totalAmount,
              taxa_ble: rowTotals.taxAmount,
              quantity: totalquantity,
              price: itemPrice,
            }
          : row,
      );
      setRows(updatedRows);
    } else if (name === "discounttype") {
      rowTotals = calculateRowTotals(
        itemPrice,
        totalquantity,
        itemDiscount,
        value,
        itemTax,
      );
      if (!rowTotals) return;

      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              discounttype: value,
              net: rowTotals.netAmount,
              total: rowTotals.totalAmount,
              taxa_ble: rowTotals.taxAmount,
              quantity: totalquantity,
              price: itemPrice,
              discount: itemDiscount,
            }
          : row,
      );
      setRows(updatedRows);
    } else {
      // handle other fields normally
      const updatedRows = rows.map((row) =>
        row.id === params.id
          ? {
              ...row,
              [name]:
                name === "landed_cost_per_unit" ||
                name === "purchase_cost_per_unit"
                  ? parseFloat(value)
                  : value,
            }
          : row,
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
          : row,
      ),
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
  };
  const validation = (formData) => {
    let errors = {};

    if (!formData.customer_id) {
      errors.customer = "Vendor is required";
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
      errors.customer_lpo = "Vendor lpo is required";
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
        const response = await axios_post(
          true,
          "purchase_order/update",
          finalPramas,
        );
        if (response) {
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

  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        // const itemTax = parseFloat(item?.vat) || 0; // use actual VAT field
        const itemTax = parseFloat(item?.newValue?.tax_master_1?.taxcal) || 0;
        const quantity = parseFloat(item.quantity) || 0; // default 0 to avoid NaN
        const price = parseFloat(item.price) || 0;

        const gross = price * quantity;

        const discountValue = parseFloat(item.discount) || 0;
        let discountAmount = 0;

        if (item.discounttype === "Percentage") {
          discountAmount = (gross * discountValue) / 100;
        } else {
          discountAmount = discountValue;
        }

        if (discountAmount > gross) discountAmount = gross;

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
  console.log("sums is -----------", sums);
  console.log("row is -----------", rows);

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
                {/* // header */}

                <MDBox
                  mx={2}
                  mt={-3}
                  py={2} // reduced from 3 → 2 for medium height
                  px={3}
                  borderRadius="xl"
                  sx={{
                    background:
                      "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
                    boxShadow: "0 4px 20px rgba(33, 150, 243, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: "68px", // ensures consistent medium height
                  }}
                >
                  {/* Left Section - Title & Icon */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Icon sx={{ color: "#fff", fontSize: "26px" }}>
                      shopping_cart
                    </Icon>
                    <MDTypography
                      variant="h6" // slightly smaller than h5 for a more compact header
                      color="white"
                      sx={{ fontWeight: 600, letterSpacing: "0.4px" }}
                    >
                      Edit Purchase Order
                    </MDTypography>
                  </Box>

                  {/* Right Section - Back Button */}
                  <MDTypography component={Link} to="/purchaseorder">
                    <MDButton
                      variant="contained"
                      color="light"
                      sx={{
                        color: "#2196F3",
                        fontWeight: 600,
                        px: 3,
                        py: 0.8, // tighter button height to match medium header
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          backgroundColor: "#fff",
                          color: "#1976D2",
                        },
                      }}
                    >
                      Back
                    </MDButton>
                  </MDTypography>
                </MDBox>

                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      {/* form design */}

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
                            p: 4,
                          }}
                        >
                          <div className="w-full bg-gray-400 text-black rounded-lg px-4 h-12 flex justify-between items-center mb-3 shadow-md">
                            <span className="font-medium text-sm">
                              PO Number
                            </span>
                            <span className="font-semibold text-sm">
                              {formData?.order_number || "-"}
                            </span>
                          </div>
                          {/* ===== Company | Location | Date ===== */}
                          <div className="flex flex-col md:flex-row gap-6 mb-6">
                            {/* Company */}
                            <div className="w-full md:w-1/3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                              </label>

                              <Select
                                fullWidth
                                name="company_id"
                                value={Number(formData.company_id) || ""}
                                onChange={handleChange}
                                size="small"
                                sx={{ height: "42px" }}
                              >
                                {compines?.map((c) => (
                                  <MenuItem key={c.id} value={Number(c.id)}>
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
                                value={Number(formData.location_id) || ""}
                                onChange={handleChange}
                                disabled={!formData.company_id}
                                size="small"
                                sx={{ height: "42px" }}
                              >
                                {locations?.map((l) => (
                                  <MenuItem key={l.id} value={Number(l.id)}>
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
                              />
                            </div>
                          </div>

                          {/* ===== Vendor | Employee ===== */}
                          <div className="flex flex-col md:flex-row gap-6 mb-6">
                            {/* Vendor */}
                            <div className="w-full md:w-1/2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendor
                              </label>

                              <Autocomplete
                                disablePortal
                                options={Customers}
                                getOptionLabel={(option) =>
                                  option
                                    ? `${option.vendor_code} - ${option.firstname}  - ${option.company_name} `
                                    : ""
                                }
                                filterOptions={filterOptions}
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {option.vendor_code} - {option.company_name}{" "}
                                    ({option.firstname})
                                  </li>
                                )}
                                value={autocompleteValue || null}
                                onChange={
                                  (event, newValue) =>
                                    handleAutocompleteChange(
                                      event,
                                      newValue,
                                      "vendor",
                                    ) // ✅ use "vendor"
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
                                        backgroundColor: "#fff",
                                      },
                                    }}
                                  />
                                )}
                              />
                            </div>

                            {/* Employee */}
                            <div className="w-full md:w-1/2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                User
                              </label>
                              <Autocomplete
                                disablePortal
                                options={Salesmans}
                                getOptionLabel={(option) =>
                                  option.salesman_code || ""
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
                                    "salesman",
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
                                        backgroundColor: "#fff",
                                      },
                                    }}
                                  />
                                )}
                              />
                            </div>
                          </div>

                          {/* ===== Vendor Details ===== */}
                          <div className="mb-6 w-full">
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
                                          Company Name :
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
                                      Contact Person
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
                                        {selectedCustomer.VendorEmail}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-100 border border-dashed border-gray-300 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                                <i className="fas fa-user-slash text-gray-400 text-2xl mb-2"></i>
                                Select a vendor to view details
                              </div>
                            )}
                          </div>

                          {/* ===== Payment Terms | Vendor Document No ===== */}
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Payment Terms */}
                            <div className="w-full md:w-1/2">
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
                                    "payment_term",
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Payment Term"
                                    size="small"
                                  />
                                )}
                              />
                            </div>

                            {/* Vendor Document No */}
                            <div className="w-full md:w-1/2">
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
                              />
                            </div>
                          </div>
                        </Box>
                      </Box>

                      {/* table design */}

                      <Grid item xs={12} pb={6}>
                        <Box
                          sx={{
                            backgroundColor: "#fff",
                            borderRadius: "16px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            p: 4,
                          }}
                        >
                          {/* ===================== TABLE CARD ===================== */}
                          <Card
                            sx={{
                              borderRadius: "16px",
                              overflow: "hidden",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                            }}
                          >
                            <TableContainer>
                              <Table
                                sx={{
                                  minWidth: 1600,
                                  borderCollapse: "separate",
                                  borderSpacing: "0 8px",
                                }}
                              >
                                <TableHead>
                                  <TableRow>
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
                                      "Net",
                                      "Tax%",
                                      "Tax Amt",
                                      // "Purchase Cost/Unit",
                                      // "Landed Cost/Unit",
                                      "Total",
                                      "Action",
                                    ].map((header) => (
                                      <TableCell
                                        key={header}
                                        align="center"
                                        sx={{
                                          backgroundColor: "#e5e7eb", // slightly darker gray
                                          color: "#1f2937", // stronger gray text
                                          fontWeight: "bold",
                                          fontSize: "14px",
                                          letterSpacing: "0.5px",
                                          textTransform: "uppercase",
                                          textAlign: "center",
                                          borderBottom:
                                            "2px solid rgba(229, 231, 235, 0.8)",
                                          py: 1.2,
                                          whiteSpace: "nowrap",
                                          transition: "all 0.2s ease-in-out",
                                          "&:hover": {
                                            backgroundColor: "#e2e8f0", // hover highlight
                                          },
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
                                      hover
                                      sx={{
                                        backgroundColor: "#fff",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                        "&:hover": {
                                          backgroundColor: "#f9fafb",
                                        },
                                      }}
                                    >
                                      {/* ITEM CODE */}
                                      <TableCell sx={{ minWidth: 250 }}>
                                        <Autocomplete
                                          disablePortal={false}
                                          options={filteredItems}
                                          getOptionLabel={(option) =>
                                            // option.item_code || ""
                                            option?.item_code &&
                                            option?.item_name
                                              ? `${option.item_code} ${option.item_name}`
                                              : ""
                                          }
                                          renderOption={(props, option) => (
                                            <li {...props}>
                                              {option.item_code} -{" "}
                                              {option.item_name}
                                            </li>
                                          )}
                                          value={row.newValue ?? null}
                                          onChange={(event, newValue) =>
                                            ItemSelect(newValue, row)
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              placeholder="Item Code"
                                              size="small"
                                              fullWidth
                                              variant="outlined"
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  borderRadius: "10px",
                                                  height: "44px",
                                                  fontSize: "13px",
                                                },
                                              }}
                                            />
                                          )}
                                          // ✅ This ensures dropdown renders on top of everything
                                          PopperProps={{
                                            disablePortal: false,
                                            modifiers: [
                                              {
                                                name: "zIndex",
                                                enabled: true,
                                                phase: "write",
                                                fn: ({ state }) => {
                                                  state.styles.popper.zIndex = 1300; // like MUI dialogs
                                                },
                                              },
                                            ],
                                          }}
                                        />
                                      </TableCell>

                                      {/* ITEM NAME */}
                                      <TableCell sx={{ minWidth: 300 }}>
                                        <TextField
                                          size="small"
                                          value={row.item_name ?? ""}
                                          disabled
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              backgroundColor: "#f9fafb",
                                              fontSize: "13px",
                                              minWidth: "300",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* UOM */}
                                      <TableCell sx={{ minWidth: 100 }}>
                                        <TextField
                                          size="small"
                                          value={row.uom ?? ""}
                                          disabled
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              backgroundColor: "#f9fafb",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* Sunit */}
                                      {/* <TableCell sx={{ minWidth: 100 }}>
                                        <TextField
                                          size="small"
                                          value={
                                            row.Sunit ?? row.item_uom ?? ""
                                          }
                                          disabled
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              backgroundColor: "#f9fafb",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell> */}

                                      {/* Item Type */}
                                      {/* <TableCell sx={{ minWidth: 150 }}>
                                        <Select
                                          value={
                                            row.itemtype ?? "Finished Goods"
                                          }
                                          onChange={(e) =>
                                            handleItemTypeChange(
                                              e.target.value,
                                              rowIndex,
                                              "itemtype"
                                            )
                                          }
                                          size="small"
                                          fullWidth
                                          sx={{
                                            borderRadius: "10px",
                                            height: "44px",
                                            fontSize: "13px",
                                          }}
                                        >
                                          <MenuItem value="Finished Goods">
                                            Finished Goods
                                          </MenuItem>
                                          <MenuItem value="Bad Return">
                                            Bad Return
                                          </MenuItem>
                                        </Select>
                                      </TableCell> */}

                                      {/* Currency */}
                                      {/* <TableCell sx={{ minWidth: 120 }}>
                                        <Select
                                          value={row.currency ?? "INR"}
                                          onChange={(e) =>
                                            handleItemTypeChange(
                                              e.target.value,
                                              rowIndex,
                                              "currency"
                                            )
                                          }
                                          size="small"
                                          fullWidth
                                          sx={{
                                            borderRadius: "10px",
                                            height: "44px",
                                            fontSize: "13px",
                                          }}
                                        >
                                          <MenuItem value="INR">INR</MenuItem>
                                        </Select>
                                      </TableCell> */}
                                      <TableCell sx={{ minWidth: 120 }}>
                                        <Select
                                          value={row.skim ?? "None"}
                                          onChange={(e) =>
                                            handleSkimChange(
                                              e.target.value,
                                              rowIndex,
                                            )
                                          }
                                          size="small"
                                          fullWidth
                                          sx={{
                                            borderRadius: "10px",
                                            height: "44px",
                                            fontSize: "13px",
                                          }}
                                        >
                                          <MenuItem value="None">None</MenuItem>
                                          <MenuItem value="Free">Free</MenuItem>
                                        </Select>
                                      </TableCell>
                                      {/* Quantity */}
                                      <TableCell sx={{ minWidth: 120 }}>
                                        <TextField
                                          type="number"
                                          name="quantity"
                                          size="small"
                                          value={row.quantity ?? ""}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* Scheme */}

                                      {/* Price */}
                                      <TableCell sx={{ minWidth: 120 }}>
                                        <TextField
                                          type="number"
                                          name="price"
                                          size="small"
                                          value={row.price ?? ""}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>
                                      {/* ===Row Total === */}
                                      <TableCell sx={{ minWidth: 120 }}>
                                        <TextField
                                          type="number"
                                          name="total"
                                          size="small"
                                          value={(
                                            (parseFloat(row.quantity) || 0) *
                                            (parseFloat(row.price) || 0)
                                          ).toFixed(2)}
                                          readOnly
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* Discount Type */}
                                      <TableCell sx={{ minWidth: 150 }}>
                                        <Select
                                          value={
                                            row.discounttype ?? "Percentage"
                                          }
                                          name="discounttype"
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          size="small"
                                          fullWidth
                                          sx={{
                                            borderRadius: "10px",
                                            height: "44px",
                                            fontSize: "13px",
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
                                      <TableCell sx={{ minWidth: 120 }}>
                                        <TextField
                                          type="number"
                                          name="discount"
                                          size="small"
                                          value={row.discount ?? ""}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* NET (readonly) */}
                                      <TableCell sx={{ minWidth: 130 }}>
                                        <TextField
                                          size="small"
                                          value={row.net ?? ""}
                                          disabled
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              backgroundColor: "#f9fafb",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* Tax% (readonly) */}
                                      <TableCell sx={{ minWidth: 120 }}>
                                        <TextField
                                          size="small"
                                          value={isNaN(row.vat) ? 0 : row.vat}
                                          disabled
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              backgroundColor: "#f9fafb",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* Tax Amt (readonly) */}
                                      {/* Tax Amt (readonly) */}
                                      <TableCell sx={{ minWidth: 120 }}>
                                        <TextField
                                          size="small"
                                          value={
                                            isNaN(row.taxa_ble)
                                              ? 0
                                              : row.taxa_ble
                                          }
                                          disabled
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              backgroundColor: "#f9fafb",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* Purchase Cost/Unit (editable) */}
                                      {/* <TableCell sx={{ minWidth: 160 }}>
                                        <TextField
                                          type="number"
                                          name="purchase_cost_per_unit"
                                          size="small"
                                          value={
                                            row.purchase_cost_per_unit ?? ""
                                          }
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              fontSize: "13px",
                                              backgroundColor: "#fff",
                                            },
                                          }}
                                        />
                                      </TableCell> */}

                                      {/* Landed Cost/Unit (editable) */}
                                      {/* <TableCell sx={{ minWidth: 160 }}>
                                        <TextField
                                          type="number"
                                          name="landed_cost_per_unit"
                                          size="small"
                                          value={row.landed_cost_per_unit ?? ""}
                                          onChange={(e) =>
                                            itemquantityChange(e, row)
                                          }
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              fontSize: "13px",
                                              backgroundColor: "#fff",
                                            },
                                          }}
                                        />
                                      </TableCell> */}

                                      {/* Total (readonly) */}
                                      <TableCell sx={{ minWidth: 150 }}>
                                        <TextField
                                          size="small"
                                          value={row.total ?? ""}
                                          disabled
                                          fullWidth
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: "10px",
                                              height: "44px",
                                              backgroundColor: "#f9fafb",
                                              fontSize: "13px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {/* Action */}
                                      <TableCell
                                        align="center"
                                        sx={{ minWidth: 100 }}
                                      >
                                        <MDButton
                                          variant="outlined"
                                          color="error"
                                          iconOnly
                                          onClick={() =>
                                            handleRemoveRow(rowIndex)
                                          }
                                          sx={{
                                            borderRadius: "10px",
                                            minWidth: "36px",
                                            height: "36px",
                                          }}
                                        >
                                          <Icon fontSize="small">delete</Icon>
                                        </MDButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Card>

                          {/* ===== ADD ROW BUTTON ===== */}
                          <Box sx={{ textAlign: "right", mt: 4 }}>
                            <MDButton
                              variant="contained"
                              color="secondary"
                              onClick={handleAddRow}
                              sx={{
                                borderRadius: "10px",
                                px: 3,
                                py: 1,
                                fontSize: "14px",
                                textTransform: "none",
                              }}
                            >
                              + Add Row
                            </MDButton>
                          </Box>

                          <div>
                            <p className="block text-gray-700 font-medium mb-2">
                              Vendor Notes
                            </p>
                          </div>
                          {/* Vendor Note & Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Vendor Note */}
                            <div className="md:col-span-7">
                              <textarea
                                name="any_comment"
                                value={formData.any_comment || ""}
                                onChange={handleChange}
                                placeholder="Enter note..."
                                className="w-full h-[180px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none bg-white"
                              />
                            </div>

                            {/* Summary */}
                            <div className="md:col-span-5 bg-gray-900 text-white rounded-lg p-4 shadow-md">
                              <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <p className="text-gray-400">Total</p>
                                <p className="font-medium">
                                  INR {parseFloat(sums.initialTotal).toFixed(2)}
                                </p>
                                <p className="text-gray-400">Discount</p>
                                <p className="font-medium">
                                  INR {parseFloat(sums.discount).toFixed(2)}
                                </p>
                                <p className="text-gray-400">Net Total</p>
                                <p className="font-medium">
                                  INR {parseFloat(sums.net).toFixed(2)}
                                </p>
                                <p className="text-gray-400">Tax</p>
                                <p className="font-medium">
                                  INR {parseFloat(sums.vat).toFixed(2)}
                                </p>
                                <p className="pt-2 font-semibold text-gray-200">
                                  Total
                                </p>
                                <p className="pt-2 font-semibold text-yellow-400">
                                  INR {parseFloat(sums.total).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex justify-center gap-3 mt-4">
                            <button
                              type="button"
                              onClick={handleBack}
                              disabled={isSubmit}
                              className={`rounded-lg px-3 py-1 border font-medium transition-all duration-200 ${
                                isSubmit
                                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                  : "border-gray-400 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmit}
                              className={`rounded-lg px-3 py-1 text-white font-medium transition-all duration-200 ${
                                isSubmit
                                  ? "bg-blue-300 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >
                              {isSubmit ? (
                                <span className="flex items-center justify-center gap-2">
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                  </svg>
                                  Saving...
                                </span>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>
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

export default Edit_Po;
