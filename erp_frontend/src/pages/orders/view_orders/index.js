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

function View_Orders() {
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
    payment_terms: "",
    location_id: "",
    company_id: "",
    due_date: "",
    status: "Open",
    order_type: "Normal",
  });
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
          console.log("elemt is -----------", element);

          let item_uom = element.itemLocationModel.item_main_prices;
          const filteredObject = item_uom.find(
            (item) => item.item_uom_id === element.item_uom_id
          );
          let obje = {
            id: index + 1,
            item_id: element.item_id,
            item_code: element.itemLocationModel?.item_code,
            item_name: element.itemLocationModel?.item_name,
            uom: element?.item_uom_id,
            item_uom:
              element.itemLocationModel.item_main_prices[0].item_uom.name,
            quantity: element?.item_qty,
            price: element.is_free == 1 ? 0.0 : element.item_gross,
            excise: element.is_free == 1 ? 0.0 : element.item_excise,
            discount: element.is_free == 1 ? 0.0 : element.item_discount_amount,
            net: element.is_free == 1 ? 0.0 : element.item_net,
            // vat:
            //   element.is_free == 1
            //     ? 0
            //     : parseFloat(element.itemLocationModel?.item_tax).toFixed(2),
            vat:
              element.is_free == 1
                ? 0
                : parseFloat(
                    element.itemLocationModel?.tax_master_1?.taxcal
                  ).toFixed(2),
            taxa_ble:
              element.is_free == 1
                ? 0.0
                : (
                    (parseFloat(element?.item_net) *
                      1 *
                      // parseFloat(element?.itemLocationModel?.item_tax)) /
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal
                      )) /
                    100
                  ).toFixed(2),
            total:
              element.is_free == 1
                ? 0.0
                : (
                    parseFloat(element?.item_net) +
                    (parseFloat(element?.item_net) *
                      // parseFloat(element?.itemLocationModel?.item_tax)) /
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal
                      )) /
                      100
                  ).toFixed(2),
            // total: element.is_free == 1 ? 0.0 : element.item_grand_total,
            // total: element.item_grand_total,
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
                    vat: parseFloat(row.newValue?.item_tax).toFixed(2),
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
        id: rows?.length + 1,
        item_id: "",
        item_code: "",
        item_name: "",
        uom: "",
        quantity: (0.0).toFixed(2),
        skim: "None", // Default to 'None'
        price: (0.0).toFixed(2),
        excise: (0.0).toFixed(2),
        discount: (0.0).toFixed(2),
        net: (0.0).toFixed(2),
        vat: (0.0).toFixed(2),
        taxa_ble: (0.0).toFixed(2),
        total: (0.0).toFixed(2),
        ptr_di: "",
        taxa_ble: "",
        cgst: "",
        cgst_amount: "",
        sgst: "",
        sgst_amount: "",
        igst: "",
        igst_amount: "",
        actions: "",
        newValue: "",
        newValue_uom: "",
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
            quantity: (1.0).toFixed(2),
            price: parseFloat(newValue?.itemprice).toFixed(2),
            // total: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            net: (parseFloat(newValue?.itemprice) * 1).toFixed(2),
            vat: parseFloat(newValue?.item_tax).toFixed(2),
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

  const itemquantityChange = (quantity, params) => {
    const { value, name } = quantity.target;
    let itemPrice = parseFloat(params.price);

    if (name === "quantity") {
      let totalquantity = value;
      let itemss = itemPrice * totalquantity;
      let itemDiscount = parseFloat(params.discount);
      let itemNet = ((parseFloat(itemPrice) * itemDiscount) / 100).toFixed(2);
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
      let itemTotal = parseFloat(itemNet);
      let taxa_ble = (
        (parseFloat(itemNet) * totalquantity * parseFloat(params.vat)) /
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
      let itemNet = ((parseFloat(itemPrice) * itemDiscount) / 100).toFixed(2);
      let itemTotal = parseFloat(itemNet);
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
      let taxa_ble = (
        (parseFloat(itemNet) * totalquantity * parseFloat(params.vat)) /
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
      let itemNet = ((parseFloat(itemPrice) * itemDiscount) / 100).toFixed(2);
      let itemTotal = parseFloat(itemNet);
      if (itemDiscount > itemss) {
        ToastMassage("Discount can not be more than price.");
        return;
      }
      let taxa_ble = (
        (parseFloat(itemNet) * totalquantity * parseFloat(params.vat)) /
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
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "item_code",
      headerName: "ITEM CODE",
      sortable: false,
      disableColumnMenu: true,
      width: 200,
      renderCell: (params) => (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={item}
          getOptionLabel={(option) => option.item_code || ""}
          renderOption={(props, option) => (
            <li {...props}>
              {option.item_code}-{option.item_name}
            </li>
          )}
          style={{ height: 35 }}
          sx={{
            width: 190,
            height: 20,
            "& .MuiAutocomplete-popper": {
              zIndex: 9999, // Adjust the value as needed
            },
          }}
          value={params.row.newValue}
          onChange={(event, newValue) => ItemSelect(newValue, params)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Item code" variant="outlined" />
          )}
        />
      ),
    },
    {
      field: "item_name",
      headerName: "ITEM NAME",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="text"
          // label="Item name"
          variant="outlined"
          value={params.row.item_name}
          disabled={true}
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "uom",
      headerName: "UOM",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="text"
          // label="uom"
          variant="outlined"
          value={params.row.uom}
          disabled={true}
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="Quantity"
          variant="outlined"
          value={params.row.quantity}
          name="quantity"
          onChange={(value) => itemquantityChange(value, params)}
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "price",
      headerName: "PRICE",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="outlined"
          name="price"
          value={params.row.price}
          // disabled={true}
          // sx={{ width: 200 }}
          onChange={(value) => itemquantityChange(value, params)}
        />
      ),
    },
    {
      field: "excise",
      headerName: "EXCISE",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="outlined"
          value={params.row.excise}
          disabled={true}
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "discount",
      headerName: "DISCOUNT",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="outlined"
          name="discount"
          value={params.row.discount}
          // disabled={true}
          // sx={{ width: 200 }}
          onChange={(value) => itemquantityChange(value, params)}
        />
      ),
    },
    {
      field: "net",
      headerName: "NET",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="outlined"
          value={params.row.net}
          disabled={true}
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "vat",
      headerName: "VAT",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="outlined"
          value={params.row.vat}
          disabled={true}
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "total",
      headerName: "TOTAL",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="outlined"
          value={params.row.total}
          disabled={true}
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "ACTION",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color="info"
          iconOnly
          onClick={() => handleRemoveRow(params.rowIndex)}
        >
          <Icon fontSize="small">clear</Icon>
        </MDButton>
      ),
    },
  ];
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
        const response = await axios_post(true, "order/update", finalPramas);
        if (response) {
          if (response.status) {
            ToastMassage(response.message, "success");
            navigate("/order");
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
    console.log("items is ------------", items);

    return items.reduce(
      (sums, item) => {
        const itemPrice = parseFloat(item?.price) || 0;
        const qty = parseFloat(item?.quantity) || 0;
        const discountValue = parseFloat(item?.discount) || 0;
        const discountType = item?.discounttype || "Percentage";
        const itemTotalBeforeDiscount = itemPrice * qty;

        let discountAmount = 0;

        // 🧮 Handle discount based on type
        if (discountType === "Percentage") {
          discountAmount = (itemTotalBeforeDiscount * discountValue) / 100;
        } else if (discountType === "Amount") {
          discountAmount = discountValue; // ✅ use flat amount directly
        }

        sums.initialTotal += itemTotalBeforeDiscount;
        sums.discount += discountAmount;
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
        net: 0.0,
        vat: 0.0,
        total: 0.0,
      }
    );
  };

  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        const itemPrice = parseFloat(item?.price) || 0;
        const qty = parseFloat(item?.quantity) || 0;
        const discountValue = parseFloat(item?.discount) || 0;
        const discountType = item?.discounttype || "Percentage";
        const vatPercent = parseFloat(item?.vat) || 0;
        const exciseValue = parseFloat(item?.excise) || 0;

        const itemTotalBeforeDiscount = itemPrice * qty;

        // ------------------------------
        //  Calculate Discount
        // ------------------------------
        let discountAmount = 0;
        if (discountType === "Percentage") {
          discountAmount = (itemTotalBeforeDiscount * discountValue) / 100;
        } else {
          discountAmount = discountValue;
        }

        // ------------------------------
        //  Net amount
        // ------------------------------
        const netAmount = itemTotalBeforeDiscount - discountAmount;

        // ------------------------------
        //  VAT calculation from vat%
        // ------------------------------
        const vatAmount = (netAmount * vatPercent) / 100;

        // ------------------------------
        //  Total per row
        // ------------------------------
        const grandTotal = netAmount + vatAmount + exciseValue;

        // ------------------------------
        //  ADD TO SUMS
        // ------------------------------
        sums.initialTotal += itemTotalBeforeDiscount;
        sums.discount += discountAmount;
        sums.excise += exciseValue;
        sums.net += netAmount;
        sums.vat += vatAmount;
        sums.total += grandTotal;

        return sums;
      },
      {
        initialTotal: 0,
        excise: 0,
        discount: 0,
        net: 0,
        vat: 0,
        total: 0,
      }
    );
  };

  const sums = calculateSums(rows);
  console.log("sums is --------------", sums);

  const handleBack = () => {
    navigate("/order");
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="py-8 bg-gray-50 flex justify-center">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-6">
          {/* === Header Section === */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg px-6 py-3 flex items-center justify-between mb-6 shadow-md">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <i className="fas fa-shopping-cart"></i> View Order
            </h2>
            <Link
              to="/order"
              className="bg-white text-blue-600 text-sm font-medium px-4 py-1.5 rounded-md shadow hover:bg-gray-100 transition"
            >
              Back
            </Link>
          </div>

          {/* === Form Data Display === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Customer
              </label>
              <p className="text-gray-800">
                {autocompleteValue
                  ? `${autocompleteValue.first_name || ""} ${
                      autocompleteValue.last_name || ""
                    }`
                  : "-"}
              </p>
            </div>

            {/* Order Number */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Order Number
              </label>
              <p className="text-gray-800">{formData.order_number || "-"}</p>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Delivery Date
              </label>
              <p className="text-gray-800">{formData.delivery_date || "-"}</p>
            </div>

            {/* Employee */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Employee
              </label>
              <p className="text-gray-800">
                {autocompleteSalesmanValue?.salesman_code
                  ? `${autocompleteSalesmanValue.salesman_code} - ${
                      autocompleteSalesmanValue.users?.firstname || ""
                    }`
                  : "-"}
              </p>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Payment Terms
              </label>
              <p className="text-gray-800">
                {autocompletePaymentValue?.label ||
                  formData.payment_term ||
                  "-"}
              </p>
            </div>

            {/* Vendor LPO */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Vendor LPO
              </label>
              <p className="text-gray-800">{formData.customer_lpo || "-"}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Status
              </label>
              <p className="text-gray-800">{formData.status || "-"}</p>
            </div>

            {/* Due Date */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Due Date
              </label>
              <p className="text-gray-800">{formData.due_date || "-"}</p>
            </div>

            {/* Order Type */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Order Type
              </label>
              <p className="text-gray-800">{formData.order_type || "-"}</p>
            </div>

            {/* Company */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Company
              </label>
              <p className="text-gray-800">
                {compines?.find((c) => c.id === formData.company_id)
                  ?.compdesc || "-"}
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Location
              </label>
              <p className="text-gray-800">
                {locations?.find((l) => l.id === formData.location_id)
                  ?.locname || "-"}
              </p>
            </div>
          </div>

          {/* === Table Section === */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
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
                    "Total",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 text-left text-gray-700 font-semibold text-xs border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-700">
                        {row.item_code}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {row.item_name}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {row.item_uom}
                      </td>
                      <td className="px-3 py-2 text-gray-700">{row.skim}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {row.quantity}
                      </td>

                      <td className="px-3 py-2 text-gray-700">{row.price}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {parseFloat(row.price * row.quantity)}
                      </td>

                      <td className="px-3 py-2 text-gray-700">
                        {row.discounttype}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {row.discount}
                      </td>
                      <td className="px-3 py-2 text-gray-700">{row.net}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {parseFloat(row.vat) || 0}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {parseFloat(row.taxa_ble) || 0}
                      </td>

                      <td className="px-3 py-2 text-gray-700">{row.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="text-center text-gray-500 py-4 italic"
                    >
                      No items available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* === Summary Section === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Customer Note
              </label>
              <p className="text-gray-800">{formData.any_comment || "-"}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total</span>
                <span className="font-medium text-gray-800">
                  {parseFloat(sums.initialTotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Discount</span>
                <span className="font-medium text-gray-800">
                  {parseFloat(sums.discount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Net Total</span>
                <span className="font-medium text-gray-800">
                  {parseFloat(sums.net || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Tax</span>
                <span className="font-medium text-gray-800">
                  {parseFloat(sums.vat || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t mt-2 pt-2">
                <span className="font-semibold text-gray-900 text-base">
                  Grand Total
                </span>
                <span className="font-semibold text-gray-900 text-base">
                  {parseFloat(sums.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default View_Orders;
