import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import * as React from "react";

// react-router-dom components
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { axios_get, axios_post } from "../../axios";

// @mui material components
import CloseIcon from "@mui/icons-material/Close";
import PercentIcon from "@mui/icons-material/Percent";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  InputLabel,
  Modal,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { ToastMassage } from "toast";

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function pos() {
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);

  const [opened, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElItem, setAnchorElItem] = React.useState(null);
  const open = Boolean(anchorEl);
  const openItem = Boolean(anchorElItem);
  const [Customers, setCustomerList] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteBankValue, setAutocompleteBankValue] = useState("");
  const [autocompletesalesmanValue, setautocompletesalesmanValue] =
    useState("");
  const [autocompletesalesmanValueItem, setautocompletesalesmanValueItem] =
    useState("");
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formError, setFormError] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setisSubmit] = useState(false);
  const [Bank, setBank] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [searchData, setsearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedItem, setSelectedItem] = useState([]);
  const [rows, setRows] = useState([]);
  const [salesman, setsalesman] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [disable, setdisable] = useState(false);
  const [dispalyName, setdispalyName] = useState({});
  const [discountType, setDiscountType] = useState("amount");
  const [discountTypeItem, setDiscountTypeItem] = useState("amount");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountValueItem, setDiscountValueItem] = useState(0);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModalItem, setOpenModalItem] = useState(false);
  const [openSalesmanItem, setOpenSalesmanItem] = useState(false);
  const [openEditPriceItem, setOpenEditPriceItem] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [subtotalItem, setSubtotalItem] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const handleDiscountClick = () => {
    setOpenModal1(true);
  };
  const handleCloseModal = () => {
    setOpenModal1(false);
  };

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedOpenMenuIndex, setSlectedOpenMenuIndex] = useState(null);

  const handleDiscountClickItem = (index) => {
    setSelectedIndex(index);
    setOpenModalItem(true);
  };
  const handleCloseModalItem = () => {
    setSelectedIndex(null);
    setOpenModalItem(false);
  };
  const handleSalesmanClickItem = (index) => {
    setSelectedIndex(index);
    setOpenSalesmanItem(true);
  };
  const handleCloseSalesmanItem = () => {
    setSelectedIndex(null);
    setOpenSalesmanItem(false);
  };
  const handleEditPriceClickItem = (index) => {
    setSelectedIndex(index);
    setOpenEditPriceItem(true);
  };
  const handleCloseEditPriceItem = () => {
    setSelectedIndex(null);
    setOpenEditPriceItem(false);
  };
  const [formData2, setFormData2] = useState({
    customer_id: "",
    bank_name: "",
    salesman_id: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    customer_id: "",
    bank_name: "",
    type: "",
    mobile_no: "",
    first_name: "",
    last_name: "",
    address: "",
    mobile_no_search: "",
  });
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = async () => {
    setOpenModal(false);
    setFormErrors({
      first_name: "",
      last_name: "",
      mobile_no: "",
      address: "",
    });
  };

  const handleMobileChange = async (event) => {
    const value = event.target.value;
    // const re = /^[0-9\b]+$/;
    // if (re.test(value)) {
    setFormData((prevData) => ({ ...prevData, mobile_no: value }));
    if (value.length === 10) {
      await fetchCustomerData(value);
    }
    // }
  };
  const handleMobileSearch = async (event) => {
    const value = event.target.value;
    // const re = /^[0-9\b]+$/;
    // if (re.test(value)) {
    setFormData((prevData) => ({ ...prevData, mobile_no_search: value }));
    if (value.length === 10) {
      await fetchCustomerDataSearch(value);
    }
    // }
  };
  const fetchCustomerDataSearch = async (mobile) => {
    try {
      const response = await axios_post(true, "customer/details_by_mobile", {
        mobile,
      });
      if (response?.status === true) {
        setdispalyName(response.data);
        setFormData2((prevData) => ({
          ...prevData,
          customer_id: response.data.user_id || "",
        }));
      } else {
        ToastMassage(response?.message, "error");
        setdispalyName("");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      ToastMassage("Error fetching customer data", "error");
    }
  };

  const fetchCustomerData = async (mobile) => {
    try {
      const response = await axios_post(true, "customer/details_by_mobile", {
        mobile,
      });
      if (response.status) {
        setFormData((prevData) => ({
          ...prevData,
          first_name: response.data.firstname || "",
          last_name: response.data.lastname || "",
          address: response.data.cusadd3 || "",
          customer_id: response.data.user_id || "",
        }));
        setdisable(true);
        setFormData2((prevData) => ({
          ...prevData,
          customer_id: response.data.user_id || "",
        }));
        // setdispalyName(response.data)
      } else {
        setdisable(false);
        setFormData((prevData) => ({
          ...prevData,
          first_name: "",
          last_name: "",
          address: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      ToastMassage("Error fetching customer data", "error");
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

  const salesmanList = async () => {
    const response = await axios_post(true, "salesman/list");
    if (response) {
      if (response.status) {
        setsalesman(response.data.records);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const handleAutocompleteChange = (event, newValue, type) => {
    if (type === "bank_name") {
      setAutocompleteBankValue(newValue);
      setFormData2((prevData) => ({
        ...prevData,
        bank_name: newValue == null ? "" : newValue?.id,
      }));
    }
    if (type === "salesman_id") {
      setautocompletesalesmanValue(newValue);
      setFormData2((prevData) => ({
        ...prevData,
        salesman_id: newValue == null ? "" : newValue?.id,
      }));
    }
  };
  const handleAutocompleteChangeItem = (event, newValue, type) => {
    if (type === "salesman_item_id") {
      setautocompletesalesmanValueItem(newValue == null ? "" : newValue?.id);
    }
  };

  useEffect(() => {
    salesmanList();
    CustomerList();
  }, []);

  const validation = (formData2) => {
    let errors = {};
    if (!formData2.customer_id) {
      errors.customer_id = "Customer is required";
      ToastMassage("Customer is required.", "error");
    }
    // if (!formData.type) {
    //     errors.type = "Type is required";
    // }
    return errors;
  };
  const validations = (formData) => {
    let errors = {};
    if (!formData.mobile_no) {
      errors.mobile_no = "Mobile no is required";
    }
    if (!formData.first_name) {
      errors.first_name = "First name is required";
    }
    if (!formData.last_name) {
      errors.last_name = "Last name is required";
    }
    if (!formData.address) {
      errors.address = "Adress is required";
    }
    return errors;
  };

  const submitCustomerData = async () => {
    let errors = validations(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setOpenModal(false);
      setFormData({
        first_name: "",
        mobile_no: "",
        last_name: "",
        address: "",
        mobile_no_search: "",
      });
      if (disable === false) {
        try {
          const response = await axios_post(true, "customer/store_by_mobile", {
            mobile_no: formData.mobile_no,
            first_name: formData.first_name,
            last_name: formData.last_name,
            address: formData.address,
            customer_id: formData.user_id,
            mobile_no_search: formData.mobile_no_search,
          });

          if (response.status === true) {
            ToastMassage(response.message, "success");
            const responsess = await axios_post(
              true,
              "customer/details_by_mobile",
              {
                mobile: formData.mobile_no,
              }
            );
            if (responsess?.status === true) {
              setdispalyName(responsess.data);
              setFormData2((prevData) => ({
                ...prevData,
                customer_id: responsess.data.user_id || "",
              }));
            }
          } else {
            ToastMassage(response.message, "error");
          }
        } catch (error) {
          console.error("Error submitting customer data:", error);
        }
      } else {
        const responsess = await axios_post(
          true,
          "customer/details_by_mobile",
          {
            mobile: formData.mobile_no,
          }
        );
        if (responsess?.status === true) {
          console.log("responsess", responsess);
          setdispalyName(responsess.data);
          setFormData2((prevData) => ({
            ...prevData,
            customer_id: responsess.data.user_id || "",
          }));
        }
      }
    }
  };

  const [anchor, setAnchor] = useState(null);
  useEffect(() => {
    BankList();
    customerList();
    fetchcompanyList();
  }, []);

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
  const customerList = async () => {
    const response = await axios_post(true, "item_category/cat_item_list");
    if (response) {
      if (response.status) {
        setTableData(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const tabType = TableData[newValue]?.itemcatname || "Default";
    setFormData2((prevData) => ({
      ...prevData,
      type: tabType,
    }));
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = async (event) => {
    const searchValue = event.target.value;
    if (searchValue.trim()) {
      const response = await axios_post(true, "item/itemcode_details", {
        item_code: searchValue,
      });
      if (response.data) {
        const item = response.data;
        const existingItemIndex = selectedItem?.findIndex(
          (selected) => selected.id === item.id
        );
        if (existingItemIndex > -1) {
          const updatedItems = [...selectedItem];
          updatedItems[existingItemIndex].qty += 1;
          setSelectedItem(updatedItems);
        } else {
          setSelectedItem([
            ...selectedItem,
            {
              itemName: item.item_name,
              qty: 1,
              price: item.itemprice,
              finalTotalItem: item.itemprice,
              id: item.id,
            },
          ]);
        }
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const handleBoxClick = (item) => {
    const existingItemIndex = selectedItem?.findIndex(
      (selected) => selected.id === item.id
    );
    if (existingItemIndex > -1) {
      const updatedItems = [...selectedItem];
      updatedItems[existingItemIndex].qty += 1;
      setSelectedItem(updatedItems);
    } else {
      setSelectedItem([
        ...selectedItem,
        {
          itemName: item.item_name,
          qty: 1,
          price: item.itemprice,
          finalTotalItem: item.itemprice,
          id: item.id,
          discountTypeItem: "amount",
          discountValueItem: 0,
          salesman_item_id: item.salesman_item_id,
        },
      ]);
    }
  };

  const handleRemoveSelectedItem = (idToRemove) => {
    setSelectedItem((prevItems) =>
      prevItems.filter((item) => item.id !== idToRemove)
    );
    setDiscountAmount(0);
    setFinalTotal(0);
  };

  const incrementQty = (id) => {
    const updatedItems = selectedItem.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    let discount = 0;
    const subtotal = updatedItems.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0
    );
    let newSubtotal = subtotal;
    if (discountType === "amount") {
      discount = discountValue;
      newSubtotal = newSubtotal - discount;
    } else if (discountType === "percentage") {
      discount = (newSubtotal * discountValue) / 100;
      newSubtotal = newSubtotal - discount;
    }
    newSubtotal = Math.max(newSubtotal, 0);
    setDiscountAmount(discount);
    setFinalTotal(newSubtotal);
    setSubtotal(newSubtotal);
    setSelectedItem(updatedItems);
  };

  const decrementQty = (id) => {
    const updatedItems = selectedItem.map((item) =>
      item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
    );
    let discount = 0;
    const subtotal = updatedItems.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0
    );
    let newSubtotal = subtotal;
    if (discountType === "amount") {
      discount = discountValue;
      newSubtotal = newSubtotal - discount;
    } else if (discountType === "percentage") {
      discount = (newSubtotal * discountValue) / 100;
      newSubtotal = newSubtotal - discount;
    }
    newSubtotal = Math.max(newSubtotal, 0);
    setDiscountAmount(discount);
    setFinalTotal(newSubtotal);
    setSubtotal(newSubtotal);
    setSelectedItem(updatedItems);
  };

  const applyDiscount = () => {
    let discount = 0;
    const subtotal = selectedItem.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0
    );
    let newSubtotal = subtotal;
    if (discountType === "amount") {
      discount = discountValue;
      newSubtotal = newSubtotal - discount;
    } else if (discountType === "percentage") {
      discount = (newSubtotal * discountValue) / 100;
      newSubtotal = newSubtotal - discount;
    }
    newSubtotal = Math.max(newSubtotal, 0);
    setDiscountAmount(discount);
    setFinalTotal(newSubtotal);
    setSubtotal(newSubtotal);
    handleCloseModal();
  };

  const applyDiscountItem = (SelectIndex) => {
    let discount = 0;
    const subtotal =
      selectedItem[SelectIndex].qty * selectedItem[SelectIndex].price;
    let newSubtotal = subtotal;

    if (selectedItem[SelectIndex].discountTypeItem === "amount") {
      discount = selectedItem[SelectIndex].discountValueItem;
      newSubtotal = newSubtotal - discount;
    } else if (selectedItem[SelectIndex].discountTypeItem === "percentage") {
      discount =
        (newSubtotal * selectedItem[SelectIndex].discountValueItem) / 100;
      newSubtotal = newSubtotal - discount;
    }
    newSubtotal = Math.max(newSubtotal, 0);
    const updatedItems = [...selectedItem];
    updatedItems[SelectIndex] = {
      ...updatedItems[SelectIndex],
      finalTotalItem: newSubtotal,
    };

    setSelectedItem(updatedItems);
    handleCloseModalItem();

    // setDiscountAmount(discount);
    // setFinalTotal(newSubtotal);
    setSubtotal(newSubtotal);

    // let discount = 0;
    // const subtotal = selectedItem.reduce((total, item) => total + (item.qty * item.price), 0);
    // let newSubtotal = subtotal;
    // if (discountType === 'amount') {
    //     discount = discountValue;
    //     newSubtotal = newSubtotal - discount;
    // } else if (discountType === 'percentage') {
    //     discount = (newSubtotal * discountValue) / 100;
    //     newSubtotal = newSubtotal - discount;
    // }
    // newSubtotal = Math.max(newSubtotal, 0);
  };
  const applySalesmanItem = (SelectIndex) => {
    const updatedItems = [...selectedItem];
    updatedItems[SelectIndex] = {
      ...updatedItems[SelectIndex],
      salesman_item_id: autocompletesalesmanValueItem,
    };
    setSelectedItem(updatedItems);
    handleCloseSalesmanItem();
  };

  const calculateDiscountItem = (value, type, index) => {
    let updatedItems = [...selectedItem];
    if (type === "type") {
      updatedItems[index].discountTypeItem = value;
    } else if (type === "value") {
      updatedItems[index].discountValueItem = value;
    }
    setSelectedItem(updatedItems);
  };

  const handleEditPriceItem = (value, type, index) => {
    const updatedItems = [...selectedItem];
    const updatedItem = { ...updatedItems[index] };
    updatedItem.finalTotalItem = parseFloat(value) || 0;
    updatedItems[index] = updatedItem;
    setSelectedItem(updatedItems);
  };

  const applyPriceItem = (SelectIndex) => {
    const updatedItems = [...selectedItem];
    updatedItems[SelectIndex] = {
      ...updatedItems[SelectIndex],
      salesman_item_id: autocompletesalesmanValueItem,
    };
    setSelectedItem(updatedItems);
    handleCloseEditPriceItem();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseItem = () => {
    setAnchorElItem(null);
  };
  const handleClickItem = (event, index) => {
    setSlectedOpenMenuIndex(index);
    setAnchorElItem(event.currentTarget);
  };
  const handleBack = () => {
    window.location.reload();
  };
  const calculateSubtotal = () => {
    return selectedItem
      .reduce((total, item) => {
        const itemTotal =
          item.finalTotalItem !== undefined
            ? item.qty * parseFloat(item.finalTotalItem)
            : item.qty * parseFloat(item.price);
        return total + itemTotal;
      }, 0)
      .toFixed(2);
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
  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    const subtotal = calculateSubtotal();
    let errors = validation(formData2);
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      let finalPramas = {
        ...formData2,
        subtotal: parseFloat(subtotal),
        discountAmount: discountAmount,
        total: finalTotal,
        selectedItems: selectedItem,
        discountType: discountType,
      };
      const response = await axios_post(
        true,
        "invoice/invoice_insert",
        finalPramas
      );
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          window.location.reload();
          // navigate("/order");
        } else {
          ToastMassage(response.message, "error");
        }
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                <Grid container xs={12} spacing={1}>
                  <Grid item xs={6} sx={{ textAlign: "left !important" }}>
                    <InputLabel sx={{ mb: 1 }}>Search Customer</InputLabel>
                    <MDInput
                      type="number"
                      variant="outlined"
                      value={formData.mobile_no_search}
                      className="small-input"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          handleMobileSearch(e);
                        }
                      }}
                      inputProps={{ maxLength: 10 }}
                    />
                    <MDButton
                      variant="contained"
                      color="secondary"
                      onClick={handleModalOpen}
                    >
                      Add Customer
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
              <form method="POST" action="#" onSubmit={handleSubmit}>
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
                      {Object.keys(dispalyName).length > 0 && (
                        <Grid item xs={12} sm={4}>
                          <MDBox mt={2}>
                            <MDTypography fontSize="small">
                              Name: {dispalyName?.firstname}{" "}
                              {dispalyName?.lastname}
                            </MDTypography>
                            <MDTypography fontSize="small">
                              Mobile No{dispalyName?.mobile}
                            </MDTypography>
                            <MDTypography fontSize="small">
                              Address: {dispalyName?.cusadd3}
                            </MDTypography>
                          </MDBox>
                        </Grid>
                      )}
                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }}>Salesman</InputLabel>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={salesman}
                          name="salesman_id"
                          getOptionLabel={(option) =>
                            option.salesman_code || ""
                          }
                          renderOption={(props, option) => (
                            <li {...props}>{option.salesman_code}</li>
                          )}
                          style={{ height: 51 }}
                          className="small-autocomplete"
                          value={autocompletesalesmanValue}
                          onChange={(event, newValue) =>
                            handleAutocompleteChange(
                              event,
                              newValue,
                              "salesman_id"
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="salesman"
                              variant="outlined"
                              sx={{ fontSize: "12px" }}
                            />
                          )}
                        />
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
                          <InputLabel sx={{ mb: 1 }}>location</InputLabel>
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
                    </Grid>
                  </MDBox>
                  <Divider
                    sx={{
                      marginTop: "20px",
                      marginBottom: "0px !important",
                      backgroundColor: "black !important",
                    }}
                  />
                  <Grid container>
                    <Grid item xs={7}>
                      <MDBox sx={{ my: 5, textAlign: "left !important" }}>
                        <MDInput
                          type="text"
                          variant="outlined"
                          value={searchQuery}
                          className="small-input"
                          placeholder="Search by Item Name"
                          onChange={handleSearchChange}
                        />
                        <MDInput
                          sx={{ paddingLeft: "10px" }}
                          type="text"
                          variant="outlined"
                          className="small-input"
                          placeholder="Search By Barcode"
                          onBlur={handleSearchTypeChange}
                        />
                      </MDBox>
                      <MDBox>
                        <Divider
                          sx={{
                            marginTop: "20px",
                            marginBottom: "0px !important",
                            backgroundColor: "black !important",
                          }}
                        />
                        <Grid container>
                          <Grid item xs={7}>
                            <MDBox
                              sx={{ my: 5, textAlign: "left !important" }}
                            ></MDBox>
                            <MDBox></MDBox>
                          </Grid>
                        </Grid>
                        <TabContext value={activeTab}>
                          <Box
                            sx={{
                              borderBottom: 1,
                              borderColor: "divider",
                              overflowX: "scroll",
                              whiteSpace: "nowrap",
                              display: "-webkit-box;",
                              scrollbarWidth: "inherit",
                            }}
                          >
                            <TabList
                              onChange={handleTabChange}
                              sx={{
                                display: "flex",
                                gap: "8px",
                              }}
                              centered={false}
                            >
                              {TableData.map((item, index) => (
                                <Tab
                                  key={index}
                                  label={item.itemcatname}
                                  value={index}
                                  sx={{
                                    margin: "0 8px",
                                    minWidth: "auto",
                                  }}
                                />
                              ))}
                            </TabList>
                          </Box>
                          {TableData.map((item, index) => (
                            <TabPanel key={index} value={index}>
                              <Box sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                  {item.item_master &&
                                  item.item_master.length > 0 ? (
                                    item.item_master
                                      .filter((masterItem) => {
                                        return masterItem.item_name
                                          .toLowerCase()
                                          .includes(searchQuery.toLowerCase());
                                      })
                                      .map((masterItem, masterIndex) => (
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          key={masterIndex}
                                        >
                                          <Box
                                            sx={{
                                              border: "1px solid #ddd",
                                              padding: "10px",
                                              borderRadius: "8px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleBoxClick(masterItem)
                                            }
                                          >
                                            <h4>{masterItem.item_name}</h4>
                                            <p>{masterItem.itemprice}</p>
                                          </Box>
                                        </Grid>
                                      ))
                                  ) : (
                                    <Grid item xs={12}>
                                      <Box
                                        sx={{
                                          padding: "20px",
                                          textAlign: "center",
                                          color: "gray",
                                        }}
                                      >
                                        <h4 style={{ fontSize: "14px" }}>
                                          No items available
                                        </h4>
                                      </Box>
                                    </Grid>
                                  )}
                                </Grid>
                              </Box>
                            </TabPanel>
                          ))}
                        </TabContext>
                      </MDBox>
                    </Grid>
                    <div>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          height: "100vh",
                          backgroundColor: "black !important",
                        }}
                      />
                    </div>
                    <Grid
                      item
                      xs={4}
                      sx={{ my: 5, textAlign: "left !important" }}
                    >
                      {selectedItem?.length > 0 ? (
                        selectedItem?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              border: "1px solid #ddd",
                              padding: "10px",
                              borderRadius: "8px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {item.itemName}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <IconButton
                                onClick={() => decrementQty(item.id)}
                                disabled={item.qty <= 1}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography variant="h6">{item.qty}</Typography>
                              <IconButton onClick={() => incrementQty(item.id)}>
                                <AddIcon />
                              </IconButton>
                              {item.finalTotalItem && (
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "gray",
                                    ml: 2,
                                  }}
                                >
                                  Total: {item.finalTotalItem}
                                </Typography>
                              )}
                              <Grid item xs={2} ml={3}>
                                <MDBox sx={{ display: "flex" }}>
                                  <IconButton
                                    onClick={(event) =>
                                      handleClickItem(event, index)
                                    }
                                  >
                                    <Icon fontSize="small">more_vert</Icon>
                                  </IconButton>
                                  {selectedOpenMenuIndex == index && (
                                    <Menu
                                      anchorEl={anchorElItem}
                                      id="action-menu"
                                      open={openItem}
                                      onClose={handleCloseItem}
                                      PaperProps={{
                                        elevation: 0,
                                        sx: {
                                          overflow: "visible",
                                          filter:
                                            "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                          mt: 1.5,
                                          "& .MuiAvatar-root": {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                          },
                                          "&:before": {
                                            content: '""',
                                            display: "block",
                                            position: "absolute",
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: "background.paper",
                                            transform:
                                              "translateY(-50%) rotate(45deg)",
                                            zIndex: 0,
                                          },
                                        },
                                      }}
                                      transformOrigin={{
                                        horizontal: "right",
                                        vertical: "top",
                                      }}
                                      anchorOrigin={{
                                        horizontal: "right",
                                        vertical: "bottom",
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() =>
                                          handleDiscountClickItem(index)
                                        }
                                      >
                                        <Icon fontSize="small">%</Icon> Discount
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleSalesmanClickItem(index)
                                        }
                                      >
                                        <Icon fontSize="small">user</Icon>{" "}
                                        Salesman
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleEditPriceClickItem(index)
                                        }
                                      >
                                        <Icon fontSize="small">edit</Icon> Price
                                      </MenuItem>
                                      <Dialog
                                        open={openEditPriceItem}
                                        onClose={handleCloseEditPriceItem}
                                      >
                                        <DialogTitle>Edit Price </DialogTitle>
                                        <DialogContent>
                                          <TextField
                                            type="number"
                                            fullWidth
                                            value={item.finalTotalItem}
                                            onChange={(e) =>
                                              handleEditPriceItem(
                                                e.target.value,
                                                "value",
                                                index,
                                                item
                                              )
                                            }
                                            sx={{ mt: 2 }}
                                          />
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            onClick={handleCloseEditPriceItem}
                                            color="secondary"
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={() =>
                                              applyPriceItem(index)
                                            }
                                            // disabled={ !discountValueItem || discountValueItem <= 0 || !item.discountTypeItem
                                            // }
                                            color="primary"
                                          >
                                            Apply
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                      <Dialog
                                        open={openSalesmanItem}
                                        onClose={handleCloseSalesmanItem}
                                      >
                                        <DialogTitle>
                                          Select Salesman{" "}
                                        </DialogTitle>
                                        <DialogContent>
                                          <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={salesman}
                                            name="salesman_item_id"
                                            getOptionLabel={(option) =>
                                              option.salesman_code || ""
                                            }
                                            renderOption={(props, option) => (
                                              <li {...props}>
                                                {option.salesman_code}
                                              </li>
                                            )}
                                            style={{ height: 51 }}
                                            className="small-autocomplete"
                                            value={
                                              autocompletesalesmanValueItem
                                            }
                                            onChange={(event, newValue) =>
                                              handleAutocompleteChangeItem(
                                                event,
                                                newValue,
                                                "salesman_item_id"
                                              )
                                            }
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                placeholder="salesman"
                                                variant="outlined"
                                                sx={{ fontSize: "12px" }}
                                              />
                                            )}
                                          />
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            onClick={handleCloseSalesmanItem}
                                            color="secondary"
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={() =>
                                              applySalesmanItem(index)
                                            }
                                            // disabled={ !discountValueItem || discountValueItem <= 0 || !item.discountTypeItem
                                            // }
                                            color="primary"
                                          >
                                            Submit
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                      <MenuItem
                                        onClick={() =>
                                          handleRemoveSelectedItem(item.id)
                                        }
                                        sx={{ marginLeft: 1 }}
                                      >
                                        <Icon fontSize="small">delete</Icon>{" "}
                                        Remove
                                      </MenuItem>
                                      <Dialog
                                        open={openModalItem}
                                        onClose={handleCloseModalItem}
                                      >
                                        <DialogTitle>
                                          Apply Discount on Item{" "}
                                        </DialogTitle>
                                        <DialogContent>
                                          <Tabs
                                            value={item.discountTypeItem}
                                            onChange={(e, newValue) =>
                                              calculateDiscountItem(
                                                newValue,
                                                "type",
                                                index,
                                                item
                                              )
                                            }
                                            centered
                                          >
                                            <Tab
                                              label={
                                                <>
                                                  <span
                                                    style={{
                                                      fontSize: "1.5rem",
                                                      marginRight: "8px",
                                                    }}
                                                  >
                                                    AMT
                                                  </span>
                                                </>
                                              }
                                              value="amount"
                                            />
                                            <Tab
                                              label={
                                                <>
                                                  <PercentIcon
                                                    sx={{ marginRight: 1 }}
                                                  />
                                                </>
                                              }
                                              value="percentage"
                                            />
                                          </Tabs>
                                          <TextField
                                            type="number"
                                            fullWidth
                                            value={item.discountValueItem}
                                            onChange={(e) =>
                                              calculateDiscountItem(
                                                e.target.value,
                                                "value",
                                                index,
                                                item
                                              )
                                            }
                                            sx={{ mt: 2 }}
                                          />
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            onClick={handleCloseModalItem}
                                            color="secondary"
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={() =>
                                              applyDiscountItem(index)
                                            }
                                            // disabled={ !discountValueItem || discountValueItem <= 0 || !item.discountTypeItem
                                            // }
                                            color="primary"
                                          >
                                            Apply
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </Menu>
                                  )}
                                </MDBox>
                              </Grid>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Box
                          sx={{
                            padding: "20px",
                            textAlign: "center",
                            color: "gray",
                          }}
                        >
                          <Typography variant="h6">No Records found</Typography>
                        </Box>
                      )}
                      {selectedItem?.length > 0 && (
                        <Box
                          sx={{
                            padding: "10px",
                            textAlign: "right",
                            borderTop: "1px solid #ddd",
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Subtotal:{" "}
                            {selectedItem
                              .reduce((total, item) => {
                                const itemTotal =
                                  item.finalTotalItem !== undefined
                                    ? item.qty * parseFloat(item.finalTotalItem)
                                    : item.qty * parseFloat(item.price);
                                return total + itemTotal;
                              }, 0)
                              .toFixed(2)}
                          </Typography>
                          {discountType === "amount" ? (
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "gray" }}
                            >
                              Amount: ₹{discountAmount}
                            </Typography>
                          ) : (
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "gray" }}
                            >
                              Discount: {discountAmount}
                            </Typography>
                          )}
                          {discountAmount ? (
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold" }}
                            >
                              Total: {finalTotal}
                            </Typography>
                          ) : (
                            ""
                          )}
                        </Box>
                      )}
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      justifyContent="end"
                      sx={{ mt: 1, mb: 2 }}
                    >
                      <Grid item xs={2} ml={3}>
                        <MDBox sx={{ display: "flex" }}>
                          <IconButton onClick={handleClick}>
                            <Icon fontSize="small">more_vert</Icon>
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            id="action-menu"
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                              elevation: 0,
                              sx: {
                                overflow: "visible",
                                filter:
                                  "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                mt: 1.5,
                                "& .MuiAvatar-root": {
                                  width: 32,
                                  height: 32,
                                  ml: -0.5,
                                  mr: 1,
                                },
                                "&:before": {
                                  content: '""',
                                  display: "block",
                                  position: "absolute",
                                  top: 0,
                                  right: 14,
                                  width: 10,
                                  height: 10,
                                  bgcolor: "background.paper",
                                  transform: "translateY(-50%) rotate(45deg)",
                                  zIndex: 0,
                                },
                              },
                            }}
                            transformOrigin={{
                              horizontal: "right",
                              vertical: "top",
                            }}
                            anchorOrigin={{
                              horizontal: "right",
                              vertical: "bottom",
                            }}
                          >
                            <MenuItem onClick={handleDiscountClick}>
                              <Icon fontSize="small">%</Icon> Discount
                            </MenuItem>
                            <Dialog
                              open={openModal1}
                              onClose={handleCloseModal}
                            >
                              <DialogTitle>Apply Discount</DialogTitle>
                              <DialogContent>
                                <Tabs
                                  value={discountType}
                                  onChange={(e, newValue) =>
                                    setDiscountType(newValue)
                                  }
                                  centered
                                >
                                  <Tab
                                    label={
                                      <>
                                        <span
                                          style={{
                                            fontSize: "1.5rem",
                                            marginRight: "8px",
                                          }}
                                        >
                                          AMT
                                        </span>
                                      </>
                                    }
                                    value="amount"
                                  />
                                  <Tab
                                    label={
                                      <>
                                        <PercentIcon sx={{ marginRight: 1 }} />
                                      </>
                                    }
                                    value="percentage"
                                  />
                                </Tabs>
                                <TextField
                                  type="number"
                                  fullWidth
                                  value={discountValue}
                                  onChange={(e) =>
                                    setDiscountValue(e.target.value)
                                  }
                                  sx={{ mt: 2 }}
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={handleCloseModal}
                                  color="secondary"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={applyDiscount}
                                  disabled={
                                    !discountValue || discountValue <= 0
                                  }
                                  color="primary"
                                >
                                  Apply
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Menu>
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
                            onClick={handleBack}
                            color="secondary"
                            type="button"
                            fullWidth
                            sx={{ marginLeft: "15px" }}
                          >
                            cancel
                          </MDButton>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </Grid>
                </MDBox>
                <Modal open={openModal} onClose={handleModalClose}>
                  <div
                    style={{
                      padding: "20px",
                      maxWidth: "300px",
                      margin: "100px auto",
                      backgroundColor: "white",
                      borderRadius: "8px",
                    }}
                  >
                    <Grid item xs={12} sm={20}>
                      <MDBox pb={2}>
                        <InputLabel sx={{ mb: 1 }}>Mobile No.</InputLabel>
                        <MDInput
                          type="number"
                          variant="outlined"
                          value={formData.mobile_no}
                          className="small-input"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                              handleMobileChange(e);
                            }
                          }}
                          inputProps={{ maxLength: 10 }}
                        />

                        {formErrors.mobile_no && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formErrors.mobile_no}
                          </MDTypography>
                        )}
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <MDBox pb={2}>
                        <InputLabel sx={{ mb: 1 }}>First Name</InputLabel>
                        <MDInput
                          type="text"
                          variant="outlined"
                          value={formData.first_name}
                          className="small-input"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_name: e.target.value,
                            })
                          }
                          // disabled={disable}
                        />
                        {formErrors.first_name && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formErrors.first_name}
                          </MDTypography>
                        )}
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <MDBox pb={2}>
                        <InputLabel sx={{ mb: 1 }}>Last Name</InputLabel>
                        <MDInput
                          type="text"
                          variant="outlined"
                          value={formData.last_name}
                          className="small-input"
                          // disabled={disable}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              last_name: e.target.value,
                            })
                          }
                        />
                        {formErrors.last_name && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formErrors.last_name}
                          </MDTypography>
                        )}
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <MDBox pb={2}>
                        <InputLabel sx={{ mb: 1 }}>Address</InputLabel>
                        <MDInput
                          type="text"
                          variant="outlined"
                          value={formData.address}
                          className="small-input"
                          // disabled={disable}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                        {formErrors.address && (
                          <MDTypography
                            color="error"
                            sx={{ fontSize: "14px", mt: "10px" }}
                          >
                            {formErrors.address}
                          </MDTypography>
                        )}
                      </MDBox>
                    </Grid>
                    <MDButton
                      variant="contained"
                      color="info"
                      onClick={submitCustomerData}
                    >
                      Submit
                    </MDButton>
                    <MDButton
                      variant="contained"
                      color="secondary"
                      type="button"
                      onClick={handleModalClose}
                      sx={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </MDButton>
                  </div>
                </Modal>
              </form>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
