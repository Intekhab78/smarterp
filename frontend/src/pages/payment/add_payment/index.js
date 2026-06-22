import { Link, useLocation, useNavigate } from "react-router-dom";
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
import "../../../../src/pages/formStyle.css";
import axios from "axios";
import constantApi from "constantApi";

function add_payment() {
  const navigate = useNavigate();

  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [rows, setRows] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [item, setItem] = useState([]);
  const [Bank, setBank] = useState([]);
  const [Customers, setCustomerList] = useState([]);
  const [payment_type, setpayment_type] = useState([]);
  const [Salesmans, setSalesmanList] = useState([]);
  const [itemSupplier, setItemSupplier] = useState([]);
  const [selectTrans, setselectTrans] = useState("");
  const [autocompletedBankValue, setautocompletedBankValue] = useState("");

  let user_data = JSON.parse(localStorage.getItem("user_data"));
  let user_data_id = JSON.parse(localStorage.getItem("user_id"));

  const [isSubmit, setisSubmit] = useState(false);
  const [formData, setFormData] = useState({
    payment_no: "",
    payment_type: "",
    date: "",
    transaction_no: "",
    approved_by: "",
    cash: "",
    bankname: "",
    voucher: "",
    credit_card: "",
    pay_account_no: "",
    pay_branch_location: "",
    total_payment_amount: "",
    note1: "",
    note2: "",
    note3: "",
    itmtaxdt1: "",
    itmtaxdt2: "",
    status: "1",
    addedby: `${user_data.firstname} ${user_data.lastname}`,
    createddt: new Date().toLocaleString(),
  });

  const [fetchInvoiceId, setFetchInvoiceId] = useState();
  const location = useLocation();
  const { id } = location.state || {};

  // Set invoice ID once when component mounts
  useEffect(() => {
    setFetchInvoiceId(id);
    console.log("Received Invoice ID:", id);
  }, [id]);

  // Fetch order details whenever fetchInvoiceId changes
  useEffect(() => {
    if (fetchInvoiceId) {
      fetchOrderDetails();
    }
  }, [fetchInvoiceId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/invoice/details`,
        { id: fetchInvoiceId }
      );

      console.log("View details from invoice is -----", response.data.data);

      if (response.status === 200) {
        const orderData = response.data.data;

        // 1. Set invoice_number in formData
        setFormData((prev) => ({
          ...prev,
          invoice_number: orderData.invoice_number,
          invoice_type: orderData.invoice_type,
          transaction_no: orderData.invoice_number, // <-- set Transaction No
        }));

        // 2. Also set selectTrans if using for Autocomplete display
        setselectTrans({
          transaction_no: orderData.invoice_number,
          id: orderData.id, // optional, in case needed
          grand_total: orderData.grand_total,
        });

        setRows(orderData.invoice_details || []);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    CustomerList();
    SalesmanList();
    fetchSupplier();
    OrderNuberRange();
    payment_modeList();
  }, []);

  const fetchSupplier = async () => {
    try {
      const response = await axios_post(true, "supplier/list");
      setItemSupplier(response.data?.records);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const ItemList = async (id, type) => {
    try {
      const payload = {
        id,
        type,
      };

      const response = await axios_post(
        true,
        "payment_type/list_by_type",
        payload
      );
      if (response) {
        if (response.status) {
          setItem(response.data);
        } else {
          ToastMassage(response.message, "error");
        }
      }
    } catch (error) {
      console.error("Error fetching items:", error);
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
  const BankList = async () => {
    const response = await axios_post(true, "bank/list");
    if (response) {
      if (response.status) {
        setBank(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  //   const payment_modeList = async () => {
  //     const response = await axios_post(true, "payment_type/list");
  //     if (response) {
  //       if (response.status) {
  //         setpayment_type(response.data);
  //       } else {
  //         ToastMassage(response.message, "error");
  //       }
  //     }
  //   };

  const payment_modeList = async () => {
    const response = await axios_post(true, "payment_type/list");
    if (response) {
      if (response.status) {
        setpayment_type(response.data);

        // Set default selection to "Payable"
        const defaultPayable = response.data.find(
          (item) => item.name === "Receivable"
        );
        if (defaultPayable) {
          setAutocompleteValue(defaultPayable);
          setFormData((prev) => ({
            ...prev,
            payment_type: defaultPayable.id,
          }));
        }
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
    setFormData((prevData) => ({
      ...prevData,
      [type]: newValue?.id,
    }));
    // console.log('newValue',newValue)
    if (type == "payment_type") {
      setAutocompleteValue(newValue);
      ItemList(newValue?.id, newValue?.name);
    } else if (type == "bankname") {
      setautocompletedBankValue(newValue);
    }
  };

  const handleAddRow = () => {
    if (!selectTrans) {
      ToastMassage("Please Select Transction No", "error");
      return;
    } else {
      const total_all_amount = rows.reduce(
        (total, obj) => parseFloat(obj.amount) + total,
        0
      );
      if (parseFloat(selectTrans.grand_total) <= total_all_amount) {
        ToastMassage("Insufficient Amount", "error");
        return;
      } else {
        setRows([
          ...rows,
          {
            id: rows.length + 1,
            payment_mode: "cash_type",
            type: "",
            amount: 0,
            newValue: "",
          },
        ]);
      }
    }
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const ItemSelect = (newValue) => {
    setselectTrans(newValue);
    setFormData((prevData) => ({
      ...prevData,
      transaction_no: newValue != "" ? newValue.id : "",
      total_payment_amount: newValue != "" ? newValue.grand_total : "",
      balance_amount: newValue != "" ? newValue.grand_total : "",
    }));
  };

  // useEffect(() => {
  //     if (formData.payment_mode === "check_type") {
  //         BankList();
  //     }
  // }, [formData.payment_mode]);

  const validation = (formData) => {
    let errors = {};
    if (!formData.date) {
      errors.date = "Date is required";
    }

    if (formData.payment_type == "") {
      errors.payment_type = "Payment is required";
    }
    if (selectTrans == "") {
      errors.transaction_no = "Transaction no  is required";
    }
    // if (!formData.approved_by) {
    //     errors.approved_by = "Approved By is required";
    // }
    if (!formData.pay_account_no) {
      errors.pay_account_no = "Pay account no is required";
    }
    // if (formData.payment_mode === 'cash_type' && !formData.cash) {
    //     errors.cash = "cash is required";
    // }
    // if (formData.payment_mode === 'check_type' && !formData.bankname) {
    //     errors.bankname = "Bank name is required";
    // }
    // if (formData.payment_mode === 'voucher' && !formData.voucher) {
    //     errors.voucher = "Voucher is required";
    // }
    // if (formData.payment_mode === 'credit-card' && !formData.credit_card) {
    //     errors.credit_card = "Credit card is required";
    // }

    return errors;
  };

  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    let invalidRow = rows.some((row) => !row.amount);
    if (invalidRow) {
      setisSubmit(false);
      // setFormError({ general: "Quantity and Price cannot be null or zero." });
      ToastMassage("Amount cannot be null or zero.", "error");
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
          addedby: user_data_id,
          items: rows,
        };
        const response = await axios_post(true, "collection/add", finalPramas);
        if (response) {
          setisSubmit(false);
          if (response.status) {
            ToastMassage(response.message, "success");
            navigate("/payment");
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
    }));
  };
  const itemquantityChange = (itemAmount, params) => {
    // const { name, value } = itemAmount?.target || { name: null, value: null };

    // if (!name || value === undefined) {
    //     return;
    // }
    const itemDiscount = parseFloat(params.grand_total);
    if (itemAmount > itemDiscount) {
      ToastMassage("Amount can not be more than Invoice Amount.");
      return;
    }
    let itemInvoiceAmount = parseFloat(itemAmount);
    // if (name === 'item_amount') {
    const updatedRows = rows.map((row) =>
      row.id === params.id
        ? {
            ...row,
            item_amount: itemInvoiceAmount,
            // quantity: totalquantity,
            // price: itemPrice,
            // discount: itemDiscount,
            // net: itemNet,
            total: itemInvoiceAmount,
            // taxa_ble: taxa_ble,
          }
        : row
    );
    setRows(updatedRows);
    // }
    setRows(updatedRows);
  };

  // const calculateSums = (items) => {
  //     return items.reduce((sums, item) => {
  //         sums.total += parseFloat(item.total) || 0.00;
  //         return sums;
  //     }, { total: 0.00 });
  // };
  // const sums = calculateSums(rows);
  const handleBack = () => {
    navigate("/payment");
  };
  const handleReset = () => {
    window.location.reload();
  };
  const OrderNuberRange = async () => {
    let params = {
      function_for: "order",
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
          payment_no: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const handelChangeRow = async (e, newValue, types, currentRow) => {
    const { name, value } = e.target;
    if (types == "payment_mode") {
      const updatedRows = rows.map((row) =>
        row.id === currentRow.id
          ? {
              ...row,
              [name]: value,
            }
          : row
      );
      setRows(updatedRows);
      if (value == "check_type") {
        BankList();
      }
    } else if (types == "type") {
      if (newValue != "") {
        const updatedRows = rows.map((row) =>
          row.id === currentRow.id
            ? {
                ...row,
                type: newValue?.id,
                newValue: newValue,
              }
            : row
        );
        setRows(updatedRows);
      } else {
        const updatedRows = rows.map((row) =>
          row.id === currentRow.id
            ? {
                ...row,
                type: value,
                newValue: "",
              }
            : row
        );
        setRows(updatedRows);
      }
    } else if (types == "amount") {
      const updatedRows = rows.map((row) =>
        row.id === currentRow.id
          ? {
              ...row,
              [name]: value,
            }
          : row
      );
      const total_all_amount = updatedRows.reduce(
        (total, obj) => parseFloat(obj.amount) + total,
        0
      );
      if (parseFloat(selectTrans.grand_total) < total_all_amount) {
        ToastMassage("Insufficient Amount", "error");
        return;
      } else {
        setRows(updatedRows);
      }
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
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                ></MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }} l>
                          Payment No
                        </InputLabel>
                        <MDInput
                          type="text"
                          // label="Order Number"
                          variant="outlined"
                          name="payment_no"
                          value={formData.payment_no}
                          onChange={handleChange}
                          disabled={true}
                          // sx={{ width: 300 }}
                          className="small-input"
                        />
                        {formError.payment_no && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formError.payment_no}
                          </MDTypography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }} l>
                          Payment Type
                        </InputLabel>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={payment_type}
                          getOptionLabel={(option) => option.name || ""}
                          renderOption={(props, option) => (
                            <li {...props}>{option.name}</li>
                          )}
                          value={autocompleteValue}
                          onChange={(event, newValue) =>
                            handleAutocompleteChange(
                              event,
                              newValue,
                              "payment_type"
                            )
                          }
                          // sx={{ height: 20 }}
                          // sx={{ width: 300 }}
                          className="small-autocomplete"
                          renderInput={(params) => (
                            <TextField {...params} className="small-input" />
                          )}
                        ></Autocomplete>
                        {formError.payment_type && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formError.payment_type}
                          </MDTypography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Accounting Date
                          </InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="small-input"
                            // disabled
                          />
                          {formError.date && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.date}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }} l>
                          Transaction No
                        </InputLabel>
                        <Autocomplete
                          id="combo-box-demo"
                          options={item}
                          getOptionLabel={(option) =>
                            option.transaction_no || ""
                          }
                          renderOption={(props, option) => (
                            <li {...props}>{option.transaction_no}</li>
                          )}
                          style={{ height: 51 }}
                          sx={{
                            width: "100%",
                            height: 20,
                            fontSize: "12px",
                          }}
                          className="small-input"
                          value={selectTrans}
                          onChange={(event, newValue) => ItemSelect(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Transaction No"
                              variant="outlined"
                              sx={{ fontSize: "12px" }}
                            />
                          )}
                        />
                        {formError.transaction_no && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formError.transaction_no}
                          </MDTypography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }} l>
                          Approved By
                        </InputLabel>
                        <Autocomplete
                          id="combo-box-demo"
                          options={item}
                          getOptionLabel={(option) =>
                            formData.type === "supplier"
                              ? option.grn_number || ""
                              : option.invoice_number || ""
                          }
                          renderOption={(props, option) => (
                            <li {...props}>
                              {formData.type === "supplier"
                                ? option.grn_number
                                : option.invoice_number}
                            </li>
                          )}
                          style={{ height: 51 }}
                          className="small-input"
                          sx={{
                            width: "100%",
                            height: 20,
                            fontSize: "12px",
                          }}
                          // value={row.newValue}
                          // onChange={(event, newValue) => ItemSelect(newValue, row)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Approved By"
                              variant="outlined"
                              sx={{ fontSize: "12px" }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Pay Account No{" "}
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="pay_account_no"
                            value={formData.pay_account_no}
                            onChange={handleChange}
                            className="small-input"
                            // disabled
                          />
                          {formError.pay_account_no && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.pay_account_no}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Pay Branch/ Location{" "}
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="pay_branch_location"
                            value={formData.pay_branch_location}
                            onChange={handleChange}
                            className="small-input"
                            // disabled
                          />
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Total Payment Amount
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="total_payment_amount"
                            value={selectTrans?.grand_total}
                            onChange={handleChange}
                            className="small-input"
                            disabled
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Balance Amount</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="balance_amount"
                            value={selectTrans?.grand_total}
                            onChange={handleChange}
                            className="small-input"
                            disabled
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="note1"
                            value={formData.note1}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 50 }}
                          />
                        </MDBox>
                      </Grid>
                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note 2</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="note2"
                            value={formData.note2}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 50 }}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note 3</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="note3"
                            value={formData.note3}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 50 }}
                          />
                        </MDBox>
                      </Grid> */}
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Date</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmtaxdt1"
                            value={formData.itmtaxdt1}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itmtaxdt1: e.target.value,
                              })
                            }
                            // sx={{ width: 300 }}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>
                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Date 2</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmtaxdt2"
                            value={formData.itmtaxdt2}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itmtaxdt2: e.target.value,
                              })
                            }
                            // sx={{ width: 300 }}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid> */}
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Added By</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="addedby"
                            value={formData.addedby}
                            onChange={(e) => handleChange(e)}
                            className="small-input"
                            inputProps={{ maxLength: 40 }}
                            disabled
                          />
                          {formError.addedby && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.addedby}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Created Date</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="createddt"
                            value={formData.createddt}
                            className="small-input"
                            disabled
                          />
                          {formError.createddt && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.createddt}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                          <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                          >
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>
                          </Select>
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
                    </Grid>

                    <Grid item xs={12} pb={6}>
                      <Box sx={{ overflowX: "auto", marginBottom: "1rem" }}>
                        <TableContainer>
                          <Table
                            sx={{ minWidth: 800, width: "100%" }}
                            aria-label="responsive table"
                          >
                            <TableHead>
                              <TableRow>
                                {[
                                  "Payment Mode",
                                  "Type",
                                  "Amount",
                                  "Action",
                                ].map((header) => (
                                  <TableCell
                                    key={header}
                                    sx={{
                                      fontSize: "12px",
                                      minWidth: header === "Action" ? 80 : 150,
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
                                    sx={{ fontSize: "12px", minWidth: 200 }}
                                  >
                                    <Select
                                      value={row.payment_mode}
                                      name="payment_mode"
                                      onChange={(e) =>
                                        handelChangeRow(
                                          e,
                                          "",
                                          "payment_mode",
                                          row
                                        )
                                      }
                                      // className="small-input"
                                      sx={{ width: 250, height: 50 }}
                                    >
                                      <MenuItem value="cash_type">
                                        Cash
                                      </MenuItem>
                                      <MenuItem value="check_type">
                                        Bank
                                      </MenuItem>
                                      <MenuItem value="voucher">
                                        Voucher
                                      </MenuItem>
                                      <MenuItem value="credit-card">
                                        Credit Card
                                      </MenuItem>
                                    </Select>
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontSize: "12px", minWidth: 200 }}
                                  >
                                    {row.payment_mode === "cash_type" && (
                                      <Grid item xs={12} sm={4}>
                                        <MDBox pb={2}>
                                          <MDInput
                                            type="text"
                                            variant="outlined"
                                            name="type"
                                            value={row.type}
                                            onChange={(e) =>
                                              handelChangeRow(
                                                e,
                                                "",
                                                "type",
                                                row
                                              )
                                            }
                                            className="small-input"
                                          />
                                        </MDBox>
                                      </Grid>
                                    )}

                                    {row.payment_mode === "check_type" && (
                                      <MDBox pb={2}>
                                        <Autocomplete
                                          id="bank-select"
                                          options={Bank}
                                          name="type"
                                          getOptionLabel={(option) =>
                                            option.short_name || ""
                                          }
                                          renderOption={(props, option) => (
                                            <li {...props}>
                                              {option.short_name}
                                            </li>
                                          )}
                                          onChange={(event, newValue) =>
                                            handelChangeRow(
                                              event,
                                              newValue,
                                              "type",
                                              row
                                            )
                                          }
                                          style={{ height: 51 }}
                                          className="small-input"
                                          sx={{
                                            width: "100%",
                                            height: 20,
                                            fontSize: "12px",
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              placeholder="Select Bank"
                                              variant="outlined"
                                              sx={{ fontSize: "12px" }}
                                            />
                                          )}
                                          value={row.newValue}
                                        />
                                      </MDBox>
                                    )}

                                    {row.payment_mode === "voucher" && (
                                      <MDBox pb={2}>
                                        <MDInput
                                          type="text"
                                          variant="outlined"
                                          name="type"
                                          value={row.type}
                                          onChange={(e) =>
                                            handelChangeRow(e, "", "type", row)
                                          }
                                          className="small-input"
                                        />
                                      </MDBox>
                                    )}

                                    {row.payment_mode === "credit-card" && (
                                      <>
                                        <Select
                                          value={row.type}
                                          name="type"
                                          onChange={(e) =>
                                            handelChangeRow(e, "", "type", row)
                                          }
                                          // className="small-input"
                                          sx={{ width: 250, height: 50 }}
                                        >
                                          <MenuItem value="master-card">
                                            Master Card
                                          </MenuItem>
                                          <MenuItem value="visa">Visa</MenuItem>
                                          <MenuItem value="mestro">
                                            Mestro
                                          </MenuItem>
                                          <MenuItem value="citi-bank">
                                            Citi Bank
                                          </MenuItem>
                                          <MenuItem value="american-express">
                                            American Express
                                          </MenuItem>
                                          <MenuItem value="sbi">SBI </MenuItem>
                                          <MenuItem value="icici">
                                            ICICI
                                          </MenuItem>
                                          <MenuItem value="axis">Axis</MenuItem>
                                          <MenuItem value="hdfc">HDFC</MenuItem>
                                          <MenuItem value="rbl">RBL</MenuItem>
                                          <MenuItem value="hsbc">HSBC</MenuItem>
                                          <MenuItem value="yes-bank">
                                            YES Bank
                                          </MenuItem>
                                        </Select>
                                        {formError.credit_card && (
                                          <MDTypography
                                            color="error"
                                            sx={{
                                              fontSize: "14px",
                                              mt: "10px",
                                            }}
                                          >
                                            {formError.credit_card}
                                          </MDTypography>
                                        )}
                                      </>
                                    )}
                                  </TableCell>

                                  <TableCell
                                    sx={{ fontSize: "12px", minWidth: 200 }}
                                  >
                                    <MDInput
                                      type="number"
                                      name="amount"
                                      value={row.amount}
                                      sx={{ fontSize: "12px" }}
                                      variant="outlined"
                                      onChange={(e) =>
                                        handelChangeRow(e, "", "amount", row)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontSize: "12px", minWidth: 80 }}
                                  >
                                    <MDButton
                                      variant="outlined"
                                      color="info"
                                      iconOnly
                                      onClick={() => handleRemoveRow(rowIndex)}
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

                    <Grid
                      pt={5}
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      <Grid xs={9}></Grid>
                      <Grid xs={3}>
                        <MDBox sx={{ display: "flex" }}>
                          <MDButton
                            sm
                            variant="gradient"
                            disabled={isSubmit}
                            color="info"
                            type="submit"
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
                            sm
                            variant="gradient"
                            disabled={isSubmit}
                            color="secondary"
                            type="submit"
                            sx={{ marginLeft: "15px" }}
                            onClick={handleBack}
                          >
                            cancel
                          </MDButton>
                        </MDBox>
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

export default add_payment;
