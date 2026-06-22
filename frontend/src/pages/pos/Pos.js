import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { axios_get, axios_post } from "../../axios";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import cartImage from "../../assets/images/cart/cart.png";
import Grid from "@mui/material/Grid";
import jsPDF from "jspdf";
import "./receipt.css";
import Barcode from "react-barcode";

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

import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import MDButton from "components/MDButton";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PercentIcon from "@mui/icons-material/Percent";
import { ToastMassage } from "toast";
import axios from "axios";
import constantApi from "constantApi";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef } from "react";
import html2canvas from "html2canvas";

const Pos = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [opened, setOpen] = React.useState(false);
  const receiptRef = useRef();

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
  const [autocompleteSalesmanValue, setAutocompleteSalesmanValue] =
    useState("");
  const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
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
  const [paymentModal, setPaymentModal] = useState(false);
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
  const [discountPercent, setDiscountPercent] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [department, setDepartment] = useState([]);
  const [family, setFamily] = useState([]);
  const [subFamily, setSubFamily] = useState([]);
  const [brand, setBrand] = useState([]);
  const [subtotalItem, setSubtotalItem] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [newData, setNewData] = useState(0);
  const navigate = useNavigate();

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

  const [doc_discount, setDoc_discount] = useState();
  const recalculateTotals = (items) => {
    let discount = 0;
    let subtotal = items.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0
    );

    let newSubtotal = subtotal;
    setDoc_discount((newSubtotal * discountPercent) / 100);
    console.log("doc_discountdoc_discount", doc_discount);

    if (discountType === "amount") {
      discount = discountValue;
      newSubtotal -= discount;
    } else if (discountType === "percentage") {
      discount = (newSubtotal * discountValue) / 100;
      newSubtotal -= discount;
    }

    newSubtotal = Math.max(newSubtotal, 0);

    setSubtotal(subtotal);
    setDiscountAmount(discount);
    setFinalTotal(newSubtotal);
  };

  useEffect(() => {
    recalculateTotals(selectedItem);
  }, [selectedItem, discountType, discountValue]);

  const handleEditPriceClickItem = (index) => {
    setSelectedIndex(index);
    setOpenEditPriceItem(true);
  };
  const handleCloseEditPriceItem = () => {
    setSelectedIndex(null);
    setOpenEditPriceItem(false);
  };

  const generateInvoice = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const nano = Math.floor(Math.random() * 90 + 10); // simulate 2 digits of nanoseconds
    return `POS/${year}${month}${date}/${hours}${minutes}${seconds}${nano}`;
  };

  // Use in your component:
  const [generateInvoiceNumber, setGenerateInvoiceNumber1] = useState(
    generateInvoice()
  );

  const [formData, setFormData] = useState({
    id: "",
    customer_id: "",
    bank_name: "1",
    type: "",
    mobile_no: "",
    first_name: "",
    last_name: "",
    address: "",
    mobile_no_search: "",
  });

  const [formData2, setFormData2] = useState({
    customer_id: "",
    bank_name: "1",
    salesman_id: "",
    type: "",
  });
  // console.log("formdata2---------------", formData2);

  const [formData4, setFormData4] = useState({
    id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    invoice_number: "",
    delivery_date: "",
    company_id: "",
    location_id: "",
    payment_terms: "",
    due_date: "",
    status: "",
    invoice_type: "",
  });

  // this is for payment section

  const [formData5, setFormData5] = useState({
    id: "",
    Payment_Method: "",
    invoice_number: generateInvoiceNumber,
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    status: "",
  });

  // console.log("formData5", formData5);

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

  const handlePaymentOpen = () => {
    if (!formData2.customer_id) {
      setFormData2((prev) => ({ ...prev, customer_id: 801309 }));
    }
    setPaymentModal(true);
    setPaymentModalSource("payment");
  };

  const handleReturnPayment = () => {
    if (!formData2.customer_id) {
      setFormData2((prev) => ({ ...prev, customer_id: 801309 }));
    }
    setPaymentModal(true);
    setPaymentModalSource("return");
  };

  const handlePaymentClose = async () => {
    setPaymentModal(false);
    setFormErrors({
      first_name: "",
      last_name: "",
      mobile_no: "",
      address: "",
    });
  };

  const handleMobileChange = async (event) => {
    const value = event.target.value;
    setFormData((prevData) => ({ ...prevData, mobile_no: value }));
    if (value.length === 10) {
      await fetchCustomerData(value);
    }
  };
  const handleMobileSearch = async (event) => {
    const value = event.target.value;
    setFormData((prevData) => ({ ...prevData, mobile_no_search: value }));
    if (value.length === 10) {
      await fetchCustomerDataSearch(value);
    }
  };

  const [showProfile, setShowProfile] = useState(false);
  const fetchCustomerDataSearch = async (mobile) => {
    try {
      const response = await axios_post(true, "customer/details_by_mobile", {
        mobile,
      });
      if (response?.status === true) {
        setShowProfile(!showProfile);
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
        salesman_id: newValue == null ? "" : newValue?.user_id,
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
    // if (!formData2.customer_id) {
    //   errors.customer_id = "Customer is required";
    //   ToastMassage("Customer is required.", "error");
    // }
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
        role_id: 2,
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
            role_id: 2,
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
  // console.log("companies ------", compines);
  let user_data = JSON.parse(localStorage.getItem("user_data"));
  // console.log("user_data====================", user_data);

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

  const [formData3, setFormData3] = useState({
    department_id: "",
    family_id: "",
  });
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState();

  const handleDepartmentChange = (e) => {
    const { name, value } = e.target;

    setFormData3((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "department_id" && { family_id: "" }),
    }));

    if (name === "department_id") {
      setSelectedFamilyId(null); // ✅ Clear the previously selected family
      fetchFamilyListByDepartment(value);
    }
  };
  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    setSelectedFamilyId(value);
    setFormData3((prevData) => ({
      ...prevData,
      [name]: value, // updates family_id
    }));
  };

  const fetchFamilyListByDepartment = async (departmentId) => {
    setSelectedDepartmentId(departmentId);
    try {
      const response = await axios_post(true, "family_master/list");
      if (response?.status) {
        const filteredData = response.data.filter(
          (item) => item.itemdeptname === departmentId
        );
        setFamily(filteredData);
      } else {
        ToastMassage(response.message || "Failed to fetch families", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      ToastMassage("Something went wrong", "error");
    }
  };

  const fetchdepartmentList = async () => {
    const response = await axios_post(true, "item_department/list");
    if (response) {
      if (response.status) {
        setDepartment(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchfamilyList = async () => {
    const response = await axios_post(true, "family_master/list");
    if (response) {
      if (response.status) {
        setFamily(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchSubfamilyList = async (company_id) => {
    const response = await axios_post(true, "sub_family_master/list", {
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
  useEffect(() => {
    BankList();
    customerList();
    fetchcompanyList();
    fetchfamilyList();
    fetchSubfamilyList();
    fetchdepartmentList();
  }, []);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filteredItemData = TableData.map((item, index) => {
      if (activeTab === index) {
        const filteredItems = item.item_master?.filter((masterItem) => {
          const matchSearch = masterItem.item_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          const matchDepartment = selectedDepartmentId
            ? masterItem.departname == selectedDepartmentId
            : true;

          const matchFamily = selectedFamilyId
            ? masterItem.familyname == selectedFamilyId
            : true;

          return matchSearch && matchDepartment && matchFamily;
        });
        return { index, filteredItems };
      }
      return null;
    }).filter(Boolean);

    setFilteredData(filteredItemData);
  }, [
    selectedDepartmentId,
    selectedFamilyId, // ✅ add this
    searchQuery,
    activeTab,
    TableData,
  ]);

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

  // search by bar code
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

  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  // const handleBoxClick = (item) => {
  //   const existingItemIndex = selectedItem.findIndex(
  //     (selected) => selected.id === item.id
  //   );

  //   let updatedItems = [];

  //   if (existingItemIndex > -1) {
  //     updatedItems = [...selectedItem];
  //     updatedItems[existingItemIndex].qty += 1;
  //   } else {
  //     updatedItems = [
  //       ...selectedItem,
  //       {
  //         itemName: item.item_name,
  //         qty: 1,
  //         price: item.itemprice,
  //         finalTotalItem: item.itemprice,
  //         id: item.id,
  //         discountTypeItem: "amount",
  //         discountValueItem: 0,
  //         salesman_item_id: item.salesman_item_id,
  //       },
  //     ];
  //   }
  //   // Update state and recalculate totals
  //   setSelectedItem(updatedItems);
  //   recalculateTotals(updatedItems);
  // };

  const handleBoxClick = (item) => {
    const existingItemIndex = selectedItem.findIndex(
      (selected) => selected.id === item.id
    );

    let updatedItems = [...selectedItem];

    if (existingItemIndex > -1) {
      const existing = updatedItems[existingItemIndex];
      existing.qty += 1;
      const totalLinePrice = existing.price * existing.qty;
      if (existing.discountTypeItem === "amount") {
        existing.discountTotalItem = Number(existing.discountValueItem);
      } else if (existing.discountTypeItem === "percentage") {
        existing.discountTotalItem =
          (totalLinePrice * existing.discountValueItem) / 100;
      }

      existing.finalTotalItem =
        (totalLinePrice - existing.discountTotalItem) / existing.qty;

      console.log(" existing.finalTotalItem-------", existing.finalTotalItem);

      updatedItems[existingItemIndex] = { ...existing };
    } else {
      const newItem = {
        itemName: item.item_name,
        qty: 1,
        price: item.itemprice,
        id: item.id,
        discountTypeItem: "amount", // default
        discountValueItem: 0,
        discountTotalItem: 0,
        finalTotalItem: item.itemprice,
        salesman_item_id: item.salesman_item_id,
      };
      updatedItems.push(newItem);
    }

    setSelectedItem(updatedItems);
    recalculateTotals(updatedItems);
  };

  const handleEditItem = (id) => {
    console.log("hello Ashihs", id);
  };

  const handleRemoveSelectedItem = (idToRemove) => {
    const updatedItems = selectedItem.filter((item) => item.id !== idToRemove);
    setSelectedItem(updatedItems);

    // ✅ Recalculate subtotal from remaining items
    const updatedSubtotal = updatedItems.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0
    );
    setSubtotal(updatedSubtotal);
    setDiscountAmount(0);
    if (!isDiscountApplied) {
      setFinalTotal(updatedSubtotal);
    } else {
      setFinalTotal(updatedSubtotal);
    }
  };

  const calculateFinalAmounts = (items, discountType, discountValue) => {
    const subtotal = items.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0
    );
    let discount = 0;
    let finalTotal = subtotal;

    if (discountType === "amount") {
      console.log("discountValue", discountValue);

      discount = discountValue;
      finalTotal -= discount;
    } else if (discountType === "percentage") {
      discount = (subtotal * discountValue) / 100;
      finalTotal -= discount;
    }

    finalTotal = Math.max(finalTotal, 0);
    // console.log("discount is --------", finalTotal);
    return {
      subtotal,
      finalTotal,
      discount,
    };
  };

  // 2️⃣ EVERY TIME QTY CHANGES
  //  this is perfect

  const recalcPerUnit = (items) =>
    items.map((it) => {
      if (!it.discountTotalItem) return it;

      let discountPerUnit = 0;
      if (it.discountTypeItem === "amount") {
        discountPerUnit = it.discountTotalItem / it.qty;
      } else if (it.discountTypeItem === "percentage") {
        // FIX: apply total percentage discount only once, then spread per unit
        discountPerUnit = it.discountTotalItem / it.qty;
      }
      return {
        ...it,
        finalTotalItem: it.price - discountPerUnit,
      };
    });

  const incrementQty = (id) => {
    const items = selectedItem.map((it) =>
      it.id === id ? { ...it, qty: it.qty + 1 } : it
    );
    const updatedItems = recalcPerUnit(items); // 👈 new line
    const { subtotal, finalTotal, discount } = calculateFinalAmounts(
      updatedItems,
      discountType,
      discountValue
    );

    setSelectedItem(updatedItems);
    setSubtotal(subtotal);
    setDiscountAmount(discount);
    setFinalTotal(finalTotal);
  };

  const decrementQty = (id) => {
    const items = selectedItem.map((it) =>
      it.id === id && it.qty > 1 ? { ...it, qty: it.qty - 1 } : it
    );

    const updatedItems = recalcPerUnit(items); // 👈 new line

    const { subtotal, finalTotal, discount } = calculateFinalAmounts(
      updatedItems,
      discountType,
      discountValue
    );

    setSelectedItem(updatedItems);
    setSubtotal(subtotal);
    setDiscountAmount(discount);
    setFinalTotal(finalTotal);
  };

  const applyDiscountItem = (index) => {
    const updated = [...selectedItem];
    const item = updated[index];

    if (item.discountTypeItem === "amount") {
      // Flat total discount
      item.discountTotalItem = Number(item.discountValueItem); // e.g. ₹200
    } else if (item.discountTypeItem === "percentage") {
      // Apply percentage on total line price (price * qty)
      const totalLinePrice = item.price * item.qty;
      item.discountTotalItem = (totalLinePrice * item.discountValueItem) / 100;
    }

    // Calculate final total per unit
    // item.finalTotalItem =
    //   (item.price * item.qty - item.discountTotalItem) / item.qty;

    // <p className="text-gray-500 ml-4 text-xs">
    //                           {Number(
    //                             (item.finalTotalItem *
    //                               item.qty *
    //                               discountPercent) /
    //                               100
    //                           ).toFixed(2)}
    //                           {/* {discountAmount} */}
    //                         </p>

    if (discountPercent > 0) {
      item.finalTotalItem =
        (item.price * item.qty - item.discountTotalItem - doc_discount) /
        item.qty;
      console.log("hello Ashihs item.finalTotalItem ", item.finalTotalItem);
    } else {
      item.finalTotalItem =
        (item.price * item.qty - item.discountTotalItem) / item.qty;
    }

    // console.log("hello Ashihs item.finalTotalItem ",item.finalTotalItem );

    updated[index] = { ...item };
    setSelectedItem(updated);
    handleCloseModalItem();
    handleCloseItem();
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
    //     const discountPercent = ((discount / subtotal) * 100).toFixed(2);
    // console.log(`Discount of ₹${discount} is ${discountPercent}% of ₹${subtotal}`);
    setDiscountPercent(((discount / subtotal) * 100).toFixed(2));
    newSubtotal = Math.max(newSubtotal, 0);
    setDiscountAmount(discount);
    setFinalTotal(newSubtotal);
    setSubtotal(newSubtotal);
    handleCloseModal();
    handleCloseItem();
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

  const [openDialog, setOpenDialog] = useState(false);

  // const handleBack = () => {
  //   window.location.reload();
  // };

  const handleBack = () => {
    setOpenDialog(true);
  };

  const handleHold = async () => {
    setOpenDialog(false);
    setisSubmit(true);
    setPaymentModal(false);
    const subtotal = calculateSubtotal();
    let errors = validation(formData2);
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      const updatedSelectedItems = selectedItem.map((item) => ({
        ...item,
        finalTotalItem: item.finalTotalItem * item.qty,
      }));
      let finalPramas = {
        ...formData2,
        subtotal: parseFloat(subtotal),
        discountAmount: discountAmount,
        total: finalTotal,
        selectedItems: updatedSelectedItems,
        discountType: discountType,
        ...formData5,
        PaymentDetails: updatedPaymentMethods,
        paidAmount: paidAmount,
      };

      console.log("final prams from handle hold ", finalPramas);

      const response = await axios_post(
        true,
        "invoice_log/insert",
        finalPramas
      );

      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
        } else {
          ToastMassage(response.message, "error");
        }
      }
    }
  };

  const handleDiscard = () => {
    // Discard logic (maybe reload the page)
    window.location.reload();
  };

  const handleCancel = () => {
    setOpenDialog(false); // Just close the dialog
    window.location.reload();
  };

  function calculateTotalWithDiscounts(selectedItem) {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    selectedItem.forEach((item) => {
      const originalPrice = parseFloat(item.price) || 0;
      const discountedPrice =
        item.finalTotalItem !== undefined
          ? parseFloat(item.finalTotalItem)
          : originalPrice;

      const qty = item.qty || 1;

      totalBeforeDiscount += originalPrice * qty;
      totalAfterDiscount += discountedPrice * qty;
    });

    const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

    return {
      totalBeforeDiscount: totalBeforeDiscount.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalAfterDiscount: totalAfterDiscount.toFixed(2),
    };
  }
  const { totalBeforeDiscount, totalDiscount, totalAfterDiscount } =
    calculateTotalWithDiscounts(selectedItem);

  function calculateTotal(selectedItem) {
    return selectedItem
      .reduce((total, item) => {
        const itemTotal =
          item.finalTotalItem !== undefined
            ? item.qty * parseFloat(item.finalTotalItem)
            : item.qty * parseFloat(item.price);
        return total + itemTotal;
      }, 0)
      .toFixed(2);
  }

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

  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState("");
  const [activeReturnDisplay, setActiveReturnDisplay] = useState(false);
  const [fetchItems, setFetchItems] = useState(false);
  const [fetchPaymentMethod, setFetchPaymentMethod] = useState(false);
  const [editablePayments, setEditablePayments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [methodType, setMethodType] = useState("");
  const [methodDetails, setMethodDetails] = useState({});
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedCardType, setSelectedCardType] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [itemTotal, setItemTotal] = useState([]);
  const [PaymentMethods, setPaymentMethods] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [paymentModalSource, setPaymentModalSource] = useState("");
  const [finalParams, setFinalParams] = useState([]);
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);

  // const totalAmount = grandTotal > 0 ? grandTotal : calculatedTotal;
  const totalAmount = finalTotal;
  const finalTotalWithVat = finalTotal + (finalTotal * 5) / 100;

  const paidAmount = payments
    .filter((p) => p.method !== "exchange") // ⛔ exclude exchange
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const exchange = paidAmount - finalTotalWithVat;
  // console.log("exchange", exchange);
  // console.log("totalAmount", totalAmount);
  // console.log("paidAmount", paidAmount);

  const isSubmitDisabled = paidAmount < finalTotalWithVat;

  const handleAddPayment = () => {
    if (methodType && paymentAmount) {
      const newPayment = {
        method: methodType,
        amount: parseFloat(paymentAmount),
        ...(methodType === "credit_card" && selectedCardType
          ? { cardType: selectedCardType, authCode: authCode }
          : {}),
      };
      setPayments([...payments, newPayment]);
      setPaymentMethods((prev) => [...prev, newPayment]);
      setMethodDetails({});
      setMethodType("");
      setPaymentAmount("");
      setSelectedCardType("");
      setAuthCode("");
    }
  };

  const filteredPayments = payments.filter((p) => p.method !== "exchange");

  const allPaymentsWithReturns = [
    ...filteredPayments,
    ...(exchange > 0
      ? [{ method: "exchange", amount: parseFloat(exchange.toFixed(2)) }]
      : []),
    ...(totalReturnAmount > 0
      ? [
          {
            method: "return",
            amount: -parseFloat(totalReturnAmount.toFixed(2)),
          },
        ]
      : []),
  ];

  // console.log("Getting total for method:", allPaymentsWithReturns);

  const getPaymentAmountByMethod = (method) => {
    // console.log("Getting total for method:", method);

    const filteredPayments = payments.filter((payment) => {
      // console.log("Checking payment:", payment);
      return payment.method === method;
    });

    // console.log("Filtered payments:", filteredPayments);

    const totalAmount = filteredPayments.reduce((total, payment) => {
      // console.log(`Adding ${payment.amount} to total ${total}`);
      return total + payment.amount;
    }, 0);

    // console.log(`Total amount for method '${method}':`, totalAmount);
    return totalAmount;
  };

  const updatedPaymentMethods = [
    ...PaymentMethods,
    ...(exchange > 0
      ? [{ method: "exchange", amount: parseFloat(exchange.toFixed(2)) }]
      : []),
  ];

  const handleRemovePayment = (indexToRemove) => {
    const updatedPayments = payments.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedPaymentMethods = PaymentMethods.filter(
      (_, index) => index !== indexToRemove
    );
    setPayments(updatedPayments);
    setPaymentMethods(updatedPaymentMethods);
  };

  const handleChange1 = (key, value) => {
    setMethodDetails({ ...methodDetails, [key]: value });
  };

  useEffect(() => {
    if (fetchPaymentMethod) {
      setEditablePayments(fetchPaymentMethod); // store to editable array
    }
  }, [fetchPaymentMethod]);

  const handleEditChange = (index, field, value) => {
    const updated = [...editablePayments];
    updated[index][field] = value;
    setEditablePayments(updated);
  };

  const fetchInvoiceDetails = async () => {
    try {
      setActiveReturnDisplay(true);
      const response = await axios.post(
        `${constantApi.baseUrl}/invoice/details`,
        {
          invoice_number: invoiceNumber,
        }
      );
      console.log("response form the invoice/details", response);
      setFetchPaymentMethod(response.data.data.payment_method_details);
      setGrandTotal(parseFloat(response.data.data.grand_total));

      if (response.status) {
        const orderData = response.data.data;
        setFormData2({
          customer_id: orderData.customer_id,
          bank_name: "1",
          salesman_id: orderData.salesman_id,
          type: "Return", // or any field you use for type
        });
        setFormData5({
          id: "",
          Payment_Method: "",
          payment_terms: orderData.payment_terms,
          invoice_number: orderData.invoice_number,
          delivery_date: orderData.invoice_date,
          due_date: orderData.invoice_due_date,
          status: orderData.status,
          invoice_type: orderData.invoice_type?.toString() || "",
        });
        setFormData4({
          ...formData4,
          id: orderData.id,
          customer_id: orderData.customer_id,
          customer_lob: orderData.customer_lob,
          salesman_id: orderData.salesman_id,
          customer_lpo: orderData.customer_lpo,
          invoice_number: orderData.invoice_number,
          delivery_date: orderData.invoice_date,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
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

          let item_uom = element.itemModel.item_main_prices;
          const filteredObject = item_uom.find(
            (item) => item.item_uom_id === element.item_uom_id
          );
          let obje = {
            id: index + 1,
            invoice_details_id: element.id,
            item_id: element.item_id,
            item_code: element.itemModel.item_code,
            item_name: element.itemModel.item_name,
            uom: element?.item_uom_id,
            item_uom: element.itemModel.item_main_prices[0].item_uom.name,
            quantity: element.item_qty,
            price: element.is_free == 1 ? 0.0 : element.item_gross,
            item_grand_total: element.item_grand_total,
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
                : parseFloat(element.itemModel?.item_tax),
            taxa_ble:
              element?.is_free == 1
                ? 0.0
                : (
                    (parseFloat(element?.item_net) *
                      1 *
                      parseFloat(element?.itemModel?.item_tax)) /
                    100
                  ).toFixed(2),
            total:
              element.is_free == 1
                ? 0.0
                : (
                    parseFloat(element?.item_net) +
                    (parseFloat(element?.item_net) *
                      parseFloat(element?.itemModel?.item_tax)) /
                      100
                  ).toFixed(2),
            // total: element.is_free == 1 ? 0.00 : element.item_grand_total,
            actions: "",
            newValue: element.itemModel,
            newValue_uom: filteredObject
              ? filteredObject
              : element.itemModel.item_main_prices[0],
            uom_list: element.itemModel.item_main_prices,
            skim: element?.is_free == 1 ? "Free" : "None",
            discounttype: element?.discounttype,
          };
          invoice_details.push(obje);
        }
        setRows(invoice_details);
        console.log("invoice details ", invoice_details);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const decrementFetchQty = (id) => {
    // ✅ Calculate old total before update
    const previousTotal = rows.reduce((acc, item) => {
      const itemTotal =
        item.item_grand_total !== undefined
          ? parseFloat(item.item_grand_total)
          : item.quantity * parseFloat(item.price);
      return acc + itemTotal;
    }, 0);

    const updatedItems = rows.map((item) => {
      if (item.id === id && item.quantity > 0) {
        const newQty = item.quantity - 1;

        const newNet = item.rate * newQty;
        const newTax = (newNet * item.vat) / 100;
        const newTotal = newNet + newTax;

        return {
          ...item,
          item_qty: newQty.toFixed(2),
          quantity: newQty,
          net: newNet.toFixed(2),
          taxa_ble: newTax.toFixed(2),
          total: newTotal.toFixed(2), // optional if used elsewhere
          item_grand_total: newTotal.toFixed(2), // ✅ update this field
        };
      }
      return item;
    });

    setRows(updatedItems);
    setNewData(updatedItems);

    // ✅ Calculate new total after update
    const updatedTotal = updatedItems.reduce((acc, item) => {
      const itemTotal =
        item.item_grand_total !== undefined
          ? parseFloat(item.item_grand_total)
          : item.quantity * parseFloat(item.price);
      return acc + itemTotal;
    }, 0);

    const reducedAmount = previousTotal - updatedTotal;
    // ✅ Accumulate total reduction
    setTotalReturnAmount((prev) => prev + reducedAmount);

    // console.log("Reduced Amount (this click):", reducedAmount.toFixed(2));
    // console.log(
    //   "Total Return Amount:",
    //   (totalReturnAmount + reducedAmount).toFixed(2)
    // );

    setGrandTotal(parseFloat(updatedTotal.toFixed(2)));
  };

  useEffect(() => {
    const updatedTotal = rows.reduce((acc, item) => {
      const itemTotal = item.item_grand_total
        ? parseFloat(item.item_grand_total)
        : item.quantity * parseFloat(item.price);
      return acc + itemTotal;
    }, 0);

    const grandTotalAfterDiscount =
      discountType === "amount"
        ? updatedTotal - Number(discountAmount)
        : updatedTotal;

    setGrandTotal(parseFloat(updatedTotal.toFixed(2)));
  }, [rows, discountAmount, discountType]);

  useEffect(() => {
    if (fetchPaymentMethod) {
      const mappedPayments = fetchPaymentMethod.map((p) => ({
        method: p.payment_mode,
        amount: parseFloat(p.amount),
        cardType: p.card_type || "",
        authCode: p.auth_code || "",
      }));
      setPayments(mappedPayments);
      setPaymentMethods(mappedPayments);
    }
    console.log("fetchPaymentMethod:", fetchPaymentMethod);
  }, [fetchPaymentMethod]);

  const handleReturn = async (event) => {
    setisSubmit(true);
    let errors = validation(formData4);
    if (Object.keys(errors)?.length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      if (rows?.length == 0) {
        setisSubmit(false);
        setFormError({});
        ToastMassage("Please select item", "error");
      } else {
        setisSubmit(false);
        setFormError({});
        let finalPramas = {
          ...formData2,
          ...formData5,
          discount: sums.discount,
          net: sums.net,
          excise: sums.excise,
          vat: sums.vat,
          total: sums.total,
          payment_terms: 2,
          selectedItems: newData,
          PaymentDetails: updatedPaymentMethods,
        };
        console.log("invoice/update finalPramas ", finalPramas);
        // console.log("newData ", newData);
        // console.log("formData2 ", formData2);

        // const response = await axios_post(
        //   true,
        //   "invoice/invoice_insert",
        //   finalPramas
        // );
        // // const response = await axios_post(true, "invoice/update", finalPramas);
        // if (response) {
        //   if (response.status) {
        //     ToastMassage(response.message, "success");
        //     navigate("/invoice");
        //   } else {
        //     ToastMassage(response.message, "error");
        //   }
        // }
      }
    }
  };

  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        sums.excise += parseFloat(item.excise) || 0.0;
        sums.discount += parseFloat(item.discount) || 0.0;
        sums.net += parseFloat(item.net) || 0.0;
        sums.vat += parseFloat(item.taxa_ble) || 0.0;
        sums.total += parseFloat(item.total) || 0.0;
        return sums;
      },
      { excise: 0.0, discount: 0.0, net: 0.0, vat: 0.0, total: 0.0 }
    );
  };

  const sums = calculateSums(rows);
  const updatedSelectedItems = selectedItem.map((item) => ({
    ...item,
    finalTotalItem: parseFloat(item.finalTotalItem) * parseInt(item.qty),
  }));

  const handleSave = async (event) => {
    ganrateReceipt();
    setisSubmit(true);
    setPaymentModal(false);
    const subtotal = calculateSubtotal();
    let errors = validation(formData2);
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      const updatedSelectedItems = selectedItem.map((item) => ({
        ...item,
        finalTotalItem: item.finalTotalItem * item.qty,
      }));
      let finalPramas = {
        ...formData2,
        subtotal: parseFloat(subtotal),
        discountAmount: discountAmount,
        total: finalTotal,
        selectedItems: updatedSelectedItems,
        discountType: discountType,
        discountPercent: discountPercent,
        ...formData5,
        PaymentDetails: updatedPaymentMethods,
        paidAmount: paidAmount,
      };

      console.log("final prams is ", finalPramas);

      const response = await axios_post(
        true,
        "invoice/invoice_insert",
        finalPramas
      );

      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          // window.location.reload();
          // navigate("/order");
        } else {
          ToastMassage(response.message, "error");
        }
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submitter = event.nativeEvent.submitter;
    const action = submitter?.value;
    if (action === "return") {
      await handleReturn();
    } else if (action === "save") {
      await handleSave();
    }
  };

  const [showUserInfo, setShowUserInfo] = useState(false);
  const handleProfileClick = () => {
    setShowUserInfo((prev) => !prev);
  };

  const [showInput, setShowInput] = useState(false);

  const ganrateReceipt = async (id) => {
    let user_data = JSON.parse(localStorage.getItem("user_data"));

    const input = receiptRef.current;
    input.style.visibility = "visible";
    setTimeout(() => {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 80;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [imgWidth, imgHeight],
        });
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("receipt.pdf");
        input.style.visibility = "hidden";
      });
    }, 300);
    // 300ms delay to allow rendering
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="bg-white">
        <div className=" flex justify-between items-center gap-4 pt-4 mx-4">
          <div className=" flex justify-between items-center gap-4">
            <div className="flex  gap-2 items-center">
              <div>
                {/* <label className="block text-gray-600 text-sm">Search</label> */}
                <input
                  type="number"
                  maxLength={10}
                  value={formData.mobile_no_search}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) handleMobileSearch(e);
                  }}
                  placeholder="Search by Mobile Number"
                  className="w-40 px-2 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                />
              </div>
              <button
                onClick={handleModalOpen}
                className="px-3 py-1 text-sm  bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Add
              </button>
            </div>
            <div className="flex justify-between items-center gap-4">
              {/* Salesman */}

              <div>
                <select
                  name="salesman_id"
                  value={formData2.salesman_id} // Use actual ID here
                  onChange={(e) => {
                    const selected = salesman.find(
                      (item) => item.id === parseInt(e.target.value)
                    );
                    handleAutocompleteChange(e, selected, "salesman_id");
                  }}
                  className="w-[120px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                >
                  <option value="">Salesman</option>
                  {salesman.map((s, i) => (
                    <option key={i} value={s.id}>
                      {s.salesman_code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company */}
              {/* <div>
                <select
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                  className="w-[150px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                >
                  <option value="">Company</option>
                  {compines?.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.compdesc}
                    </option>
                  ))}
                </select>
                {formError.company_id && (
                  <p className="text-red-600 text-xs mt-1">
                    {formError.company_id}
                  </p>
                )}
              </div> */}

              {/* Location */}
              {/* <div>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  className="w-[150px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                >
                  <option value="">Location</option>
                  {locations?.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.locname}
                    </option>
                  ))}
                </select>
                {formError.location_id && (
                  <p className="text-red-600 text-xs mt-1">
                    {formError.location_id}
                  </p>
                )}
              </div> */}
            </div>
          </div>
          <div className="flex justify-end items-center ">
            <div className="flex justify-end items-center gap-4 mx-4 text-sm">
              <div className="flex items-center space-x-2">
                {!showInput ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xs"
                    onClick={() => setShowInput(true)}
                  >
                    Return
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter Invoice Number"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    />
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      onClick={fetchInvoiceDetails}
                    >
                      Search
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              {/* User Profile Icon */}
              {showProfile ? (
                <div onClick={handleProfileClick} className="cursor-pointer">
                  <CgProfile />
                </div>
              ) : (
                ""
              )}

              {/* Display Name (if exists) */}
              {showUserInfo && Object.keys(dispalyName).length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-40 z-40 bg-white shadow-lg p-4 rounded-md">
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">ID:</span>{" "}
                    {dispalyName.user_id}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Name:</span>{" "}
                    {dispalyName.firstname} {dispalyName.lastname}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* header ends here */}

        <form method="POST" action="#" onSubmit={handleSubmit}>
          <div className="p-4 space-y-2">
            <div className=" flex items-center justify-center bg-gray-100 relative">
              {/* Horizontal Line */}
              <div className="absolute w-full h-px bg-black  left-0 transform -translate-y-1/2"></div>
            </div>

            {/* Item Search */}

            <div class="flex w-full max-h-[500px] overflow-y-auto scrollbar-hide p-2">
              <div className="w-[34%] sm:w-7/12 px-1">
                <div className=" text-left flex justify-between items-center gap-8">
                  <input
                    type="text"
                    placeholder="Search by Item Name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-[100px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Search by Barcode"
                    onBlur={handleSearchTypeChange}
                    className="w-[100px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                  />
                </div>

                <div>
                  {/* <div className="overflow-x-auto whitespace-nowrap my-3">
                      <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        className="flex gap-2 text-sm"
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                      >
                        {TableData.map((item, index) => (
                          <Tab
                            key={index}
                            label={item.itemcatname}
                            value={index}
                            className="min-w-fit mx-2 text-sm"
                          />
                        ))}
                      </Tabs>
                    </div> */}

                  {/* //filter data by family name ans sub familyname */}
                  <div className="flex justify-between items-center gap-4">
                    <div className="my-3">
                      <select
                        value={activeTab}
                        onChange={(e) =>
                          handleTabChange(null, Number(e.target.value))
                        }
                        className="w-[100px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                      >
                        {TableData.map((item, index) => (
                          <option key={index} value={index}>
                            {item.itemcatname}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* this is department list that is fine use latter */}

                    {/* <div>
                      <select
                        name="department_id"
                        value={formData3.department_id}
                        onChange={handleDepartmentChange}
                        className="w-[150px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                      >
                        <option value="">Department</option>
                        {department?.map((dep) => (
                          <option key={dep.id} value={dep.id}>
                            {dep.itemdeptname}
                          </option>
                        ))}
                      </select>
                      {formError.department_id && (
                        <p className="text-red-600 text-xs mt-1">
                          {formError.department_id}
                        </p>
                      )}
                    </div> */}

                    <div className="flex flex-wrap gap-2">
                      {/* <p className="text-xs font-semibold">Department:</p> */}
                      {department?.map((dep) => (
                        <button
                          key={dep.id}
                          type="button"
                          className={`px-3 py-1 text-xs rounded border ${
                            formData3.department_id === dep.id
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-green-300 text-gray-700 border-gray-300"
                          } hover:bg-blue-500 hover:text-white transition`}
                          onClick={() =>
                            handleDepartmentChange({
                              target: { name: "department_id", value: dep.id },
                            })
                          }
                        >
                          {dep.itemdeptname}
                        </button>
                      ))}
                      {formError.department_id && (
                        <p className="text-red-600 text-xs w-full">
                          {formError.department_id}
                        </p>
                      )}
                    </div>

                    {/* this is family list that is fine use latter */}

                    {/* <div>
                      <select
                        name="family_id"
                        value={formData3.family_id}
                        onChange={handleFamilyChange}
                        className="w-[150px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                      >
                        <option value="">Family</option>
                        {family?.map((fam) => (
                          <option key={fam.id} value={fam.id}>
                            {fam.itemfamname}
                          </option>
                        ))}
                      </select>
                      {formError.family_id && (
                        <p className="text-red-600 text-xs mt-1">
                          {formError.family_id}
                        </p>
                      )}
                    </div> */}
                  </div>

                  {filteredData.map(({ index, filteredItems }) => (
                    <div key={index}>
                      <div className="text-sm">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((masterItem, masterIndex) => (
                            <div
                              key={masterIndex}
                              onClick={() => handleBoxClick(masterItem)}
                              className="border border-gray-300 p-3 rounded-md cursor-pointer hover:bg-gray-50 flex flex-col items-center text-center my-2"
                            >
                              <div className="flex items-center gap-4 w-full">
                                <div className="flex justify-between items-center w-full">
                                  <h4 className="text-sm font-medium">
                                    {masterItem.item_name}
                                  </h4>
                                  <p className="text-gray-600 text-sm">
                                    {masterItem.itemprice}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center text-gray-500 py-4">
                            <h4>No items available</h4>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="w-px h-screen bg-black"></div> */}
              <div className="h-screen w-[2%] flex items-center justify-center  -mt-20">
                <div className="h-[80%] w-px bg-black"></div>
              </div>

              <div class="w-[64%]">
                {/* Cart Section */}
                {activeReturnDisplay ? (
                  <div className="">
                    {rows?.length > 0 &&
                      rows?.map((item, index) => (
                        <div
                          key={index}
                          className="border text-sm border-gray-300 p-2 rounded-lg flex justify-between items-center mb-2"
                        >
                          {/* Name - 40% */}
                          <div className="w-[35%]">
                            <p className=" text-xs">{item.item_name}</p>
                          </div>

                          {/* Qty - fixed width (80px) */}
                          <div className="w-[80px] flex flex-row items-center justify-between space-x-.5">
                            <IconButton
                              onClick={() => decrementFetchQty(item.id)}
                              disabled={item.quantity <= 0}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>

                            <p>{item.quantity}</p>
                            <IconButton
                              disabled
                              // onClick={() => incrementFetchQty(item.id)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </div>

                          {/* Item Price - 15% */}
                          <div className="w-[15%]">
                            {" "}
                            {item.price && (
                              <p className=" text-gray-500 ml-4 text-xs">
                                Price: {item.price}
                              </p>
                            )}
                          </div>

                          {/* Discount Price - 15% */}
                          {/* <div className="w-[20%]">
                            {" "}
                            {item.price && (
                              <p className=" text-gray-500 ml-4 text-xs">
                                Disc Price: {item.price.toFixed(2)}
                              </p>
                            )}
                          </div> */}

                          <div className="w-[20%]">
                            {item.price !== undefined &&
                              item.price !== null && (
                                <p className="text-gray-500 ml-4 text-xs">
                                  Disc Price: {Number(item.price).toFixed(2)}
                                </p>
                              )}
                          </div>

                          {/* Price - 15% */}
                          <div className="w-[10%]">
                            {" "}
                            {item.price && (
                              <p className=" text-gray-500 ml-4 text-xs">
                                {/* ₹ {item.finalTotalItem * item.qty} */}
                                {/* Total: {item.total * item.quantity} */}
                                Total: {item.item_grand_total}
                              </p>
                            )}
                          </div>

                          {/* Total Price - 20% */}
                          <div className="w-[10%]">
                            <div className="ml-4">
                              <div className="flex">
                                {/* <IconButton
                                  onClick={(event) =>
                                    handleClickItem(event, index)
                                  }
                                >
                                  <Icon fontSize="small">more_vert</Icon>
                                </IconButton> */}
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

                                    {/* Edit Price Dialog */}
                                    <Dialog
                                      open={openEditPriceItem}
                                      onClose={handleCloseEditPriceItem}
                                    >
                                      <DialogTitle>Edit Price</DialogTitle>
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
                                          className="mt-4"
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
                                          onClick={() => applyPriceItem(index)}
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
                                      <DialogTitle>Select Salesman</DialogTitle>

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
                                          isOptionEqualToValue={(
                                            option,
                                            value
                                          ) => option.id === value.id}
                                          value={autocompletesalesmanValueItem}
                                          onChange={(event, newValue) =>
                                            handleAutocompleteChangeItem(
                                              event,
                                              newValue,
                                              "salesman_item_id"
                                            )
                                          }
                                          className="h-12"
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              placeholder="salesman"
                                              variant="outlined"
                                              className="text-sm"
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
                                      className="ml-2"
                                    >
                                      <Icon fontSize="small">delete</Icon>{" "}
                                      Remove
                                    </MenuItem>
                                    <Dialog
                                      open={openModalItem}
                                      onClose={handleCloseModalItem}
                                    >
                                      <DialogTitle>
                                        Apply Discount on Item
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
                                              <span className="text-xl mr-2">
                                                AMT
                                              </span>
                                            }
                                            value="amount"
                                          />
                                          <Tab
                                            label={
                                              <PercentIcon className="mr-2" />
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
                                          className="mt-4"
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
                                          color="primary"
                                        >
                                          Apply
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </Menu>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    {/* this is total part that is not use in return */}

                    {/* {rows?.length > 0 && (
                      <div className="p-4 text-right border-t border-gray-300">
                        <p className="text-sm font-bold">
                          Total:{" "}
                          {rows
                            .reduce((total, item) => {
                              const itemTotal =
                                item.total !== undefined
                                  ? item.quantity * parseFloat(item.total)
                                  : item.quantity * parseFloat(item.price);
                              return total + itemTotal;
                            }, 0)
                            .toFixed(2)}
                        </p>
                        {discountType === "amount" ? (
                          <p className="text-sm font-bold text-gray-500">
                            Discount: {discountAmount}
                          </p>
                        ) : (
                          <p className="text-sm font-bold text-gray-500">
                            Discount: {discountAmount}
                          </p>
                        )}

                        {Number(discountAmount) > 0 &&
                          Number(finalTotal) !== 0 && (
                            <p className="text-sm font-bold">
                              Grand Total: {finalTotal}
                            </p>
                          )}
                      </div>
                    )} */}

                    {rows?.length > 0 && (
                      <div className="p-4 text-right border-t border-gray-300">
                        <p className="text-sm font-bold">
                          Total:{" "}
                          {rows
                            .reduce((total, item) => {
                              const itemTotal = item.item_grand_total
                                ? parseFloat(item.item_grand_total)
                                : item.quantity * parseFloat(item.price);
                              return total + itemTotal;
                            }, 0)
                            .toFixed(2)}
                        </p>
                        {discountType === "amount" ? (
                          <p className="text-sm font-bold text-gray-500">
                            Discount: {discountAmount}
                          </p>
                        ) : (
                          <p className="text-sm font-bold text-gray-500">
                            Discount: {discountAmount}
                          </p>
                        )}
                        {Number(discountAmount) > 0 &&
                          Number(finalTotal) !== 0 && (
                            <p className="text-sm font-bold">
                              Grand Total: {finalTotal}
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="">
                    <div className="border text-xs font-semibold border-gray-300 p-2 rounded-lg flex justify-between items-center mb-2 bg-gray-100">
                      <div className="w-[35%]">Item Name</div>
                      <div className="w-[80px] ">Qty</div>
                      <div className="w-[15%] ml-4">Price</div>
                      <div className="w-[20%] ml-4">Disc Price</div>
                      <div className="w-[10%] ml-4">It.Total Disc.</div>
                      <div className="w-[10%] ml-4">Doc Disc</div>
                      <div className="w-[10%] ml-4">Total</div>
                      <div className="w-[10%] ml-4">Actions</div>
                    </div>

                    {selectedItem?.length > 0 ? (
                      selectedItem?.map((item, index) => (
                        <div
                          key={index}
                          className="border text-sm border-gray-300 p-2 rounded-lg flex justify-between items-center mb-2"
                        >
                          {/* Name - 40% */}
                          <div className="w-[35%]">
                            <p className=" text-xs">{item.itemName}</p>
                          </div>

                          {/* Qty - fixed width (80px) */}
                          <div className="w-[80px] flex flex-row items-center justify-between  text-left">
                            <IconButton
                              onClick={() => decrementQty(item.id)}
                              disabled={item.qty <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>

                            <p>{item.qty}</p>
                            <IconButton onClick={() => incrementQty(item.id)}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </div>

                          {/* Item Price - 15% */}
                          <div className="w-[15%]">
                            {" "}
                            {item.finalTotalItem && (
                              <p className=" text-gray-500 ml-4 text-xs">
                                {item.price}
                              </p>
                            )}
                          </div>

                          {/* Discount Price - 15% */}
                          <div className="w-[20%]">
                            {item.finalTotalItem && (
                              <p className="text-gray-500 ml-4 text-xs">
                                {Number(item.finalTotalItem).toFixed(2)}
                              </p>
                            )}
                          </div>
                          {/* Discount Price - 15% */}
                          {/* <div className="w-[20%]">
                            {item.finalTotalItem && (
                              <p className="text-gray-500 ml-4 text-xs">
                                {(
                                  Number(item.finalTotalItem) -
                                  Number(
                                    (item.finalTotalItem *
                                      item.qty *
                                      discountPercent) /
                                      100 /
                                      item.qty
                                  )
                                ).toFixed(2)}
                              </p>
                            )}
                          </div> */}
                          {/* Discount Price - 15% */}
                          {/* <div className="w-[20%]">
                            {item.finalTotalItem && (
                              <p className="text-gray-500 ml-4 text-xs">
                                {Number(item.finalTotalItem).toFixed(2)}
                              </p>
                             
                            )}
                          </div> */}

                          {/* item Total Discount */}
                          <div className="w-[20%]">
                            {item.finalTotalItem && (
                              <p className="text-gray-500 ml-4 text-xs">
                                {Number(
                                  (item.price - item.finalTotalItem) * item.qty
                                ).toFixed(2)}
                                {/* {discountAmount} */}
                              </p>
                            )}
                          </div>

                          {/* Doc Discount */}
                          <div className="w-[20%]">
                            {item.finalTotalItem && (
                              <p className="text-gray-500 ml-4 text-xs">
                                {Number(
                                  (item.finalTotalItem *
                                    item.qty *
                                    discountPercent) /
                                    100
                                ).toFixed(2)}
                                {/* {discountAmount} */}
                                &&
                                {Number(
                                  (item.finalTotalItem *
                                    item.qty *
                                    discountPercent) /
                                    100 /
                                    item.qty
                                ).toFixed(2)}
                              </p>
                            )}
                          </div>
                          {/* Total - 15% */}
                          <div className="w-[10%]">
                            {" "}
                            {item.finalTotalItem && (
                              // <p className=" text-gray-500 ml-4 text-xs">
                              //   {item.finalTotalItem * item.qty}
                              // </p>
                              <p className=" text-gray-500 ml-4 text-xs">
                                {item.finalTotalItem * item.qty -
                                  (item.finalTotalItem *
                                    item.qty *
                                    discountPercent) /
                                    100}
                              </p>
                            )}
                          </div>
                          {/* Total - 15% */}
                          {/* <div className="w-[10%]">
                            {" "}
                            {item.finalTotalItem && (
                              <p className=" text-gray-500 ml-4 text-xs">
                                {item.finalTotalItem * item.qty}
                              </p>
                            )}
                          </div> */}

                          {/*More - 20% */}
                          <div className="w-[10%]">
                            <div className="ml-4">
                              <div className="flex">
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

                                    {/* Edit Price Dialog */}
                                    <Dialog
                                      open={openEditPriceItem}
                                      onClose={handleCloseEditPriceItem}
                                    >
                                      <DialogTitle>Edit Price</DialogTitle>
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
                                          className="mt-4"
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
                                          onClick={() => applyPriceItem(index)}
                                          color="primary"
                                        >
                                          Apply
                                        </Button>
                                      </DialogActions>
                                    </Dialog>

                                    {/* Salesman Dialog */}

                                    <Dialog
                                      open={openSalesmanItem}
                                      onClose={handleCloseSalesmanItem}
                                    >
                                      <DialogTitle>Select Salesman</DialogTitle>

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
                                          // 🔥 This tells Autocomplete how to match selected item with options
                                          isOptionEqualToValue={(
                                            option,
                                            value
                                          ) => option.id === value.id}
                                          // Value and handler
                                          value={autocompletesalesmanValueItem}
                                          onChange={(event, newValue) =>
                                            handleAutocompleteChangeItem(
                                              event,
                                              newValue,
                                              "salesman_item_id"
                                            )
                                          }
                                          // Styling
                                          className="h-12"
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              placeholder="salesman"
                                              variant="outlined"
                                              className="text-sm"
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
                                      className="ml-2"
                                    >
                                      <Icon fontSize="small">delete</Icon>{" "}
                                      Remove
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => handleEditItem(item.id)}
                                      className="ml-2"
                                    >
                                      <Icon fontSize="small">delete</Icon>Edit
                                      Items
                                    </MenuItem>

                                    {/* Discount Modal on items */}
                                    <Dialog
                                      open={openModalItem}
                                      onClose={handleCloseModalItem}
                                    >
                                      <DialogTitle>
                                        Apply Discount on Item
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
                                              <span className="text-xl mr-2">
                                                AMT
                                              </span>
                                            }
                                            value="amount"
                                          />
                                          <Tab
                                            label={
                                              <PercentIcon className="mr-2" />
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
                                          className="mt-4"
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
                                          color="primary"
                                        >
                                          Apply
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </Menu>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Delete Button */}
                          {/* <IconButton
                            onClick={() => handleRemoveSelectedItem(item.id)}
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton> */}
                          {/* <p>   {Number(
                              item.price  -
                               item.finalTotalItem * item.qty
                               ).toFixed(2)}</p> */}
                        </div>
                      ))
                    ) : (
                      <div className="p-5 text-center items-center text-gray-500">
                        <img src={cartImage} className="h-24 w-24" />
                      </div>
                    )}
                    {selectedItem?.length > 0 && (
                      <div className="p-4 text-right border-t border-gray-300">
                        {/* <p className="text-sm font-bold">
                          Total: {calculateTotal(selectedItem)}
                        </p> */}

                        <p className="text-sm font-bold">
                          Total Before Discount: {totalBeforeDiscount}
                        </p>

                        <p className="text-sm font-bold text-red-600">
                          Items Total Discount: {totalDiscount}
                        </p>

                        <p className="text-sm font-bold text-green-700">
                          Total After Discount: {totalAfterDiscount}
                        </p>

                        {discountType === "amount" ? (
                          <p className="text-sm font-bold text-gray-500">
                            Discount: {discountAmount}
                          </p>
                        ) : (
                          <p className="text-sm font-bold text-gray-500">
                            Discount : {discountAmount}
                          </p>
                        )}
                        <p className="text-sm font-bold text-gray-500">
                          Discount Percent : {discountPercent} %
                        </p>

                        {/* {Number(discountAmount) > 0 &&
                          Number(finalTotal) !== 0 && (
                            <p className="text-sm font-bold">
                              Grand Total: {finalTotal}
                            </p>
                          )} */}
                        <p className="text-sm font-bold">
                          Grand Total: {finalTotal}
                        </p>
                        <p className="text-sm font-bold">
                          Vat 5%: {(finalTotal * 5) / 100}
                        </p>
                        <p className="text-sm font-bold">
                          Final Total: {finalTotalWithVat}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4 mb-6">
                <div className="flex justify-end mt-2 mb-4">
                  <div className="ml-6 flex space-x-4">
                    {/* More Options Button */}

                    {/* Menu Dropdown */}
                    <Menu
                      anchorEl={anchorEl}
                      id="action-menu"
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={handleDiscountClick}>
                        <Icon fontSize="small">%</Icon> Discount
                      </MenuItem>

                      {/* Discount Modal  */}
                      <Dialog open={openModal1} onClose={handleCloseModal}>
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
                              label={<span className="text-2xl mr-2">AMT</span>}
                              value="amount"
                            />
                            <Tab
                              label={<PercentIcon className="mr-2" />}
                              value="percentage"
                            />
                          </Tabs>
                          <TextField
                            type="number"
                            fullWidth
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            className="mt-4"
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseModal} color="secondary">
                            Cancel
                          </Button>
                          <Button
                            onClick={applyDiscount}
                            disabled={!discountValue || discountValue <= 0}
                            color="primary"
                          >
                            Apply
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Menu>
                  </div>
                </div>

                {/* Discount Modal On whole Amount */}
                <Dialog open={openModal1} onClose={handleCloseModal}>
                  <DialogTitle>Apply Discount</DialogTitle>
                  <DialogContent>
                    <Tabs
                      value={discountType}
                      onChange={(e, newValue) => setDiscountType(newValue)}
                      centered
                    >
                      <Tab
                        label={<span className="text-xl mr-2">AMT</span>}
                        value="amount"
                      />
                      <Tab
                        label={<PercentIcon className="mr-2" />}
                        value="percentage"
                      />
                    </Tabs>

                    <TextField
                      type="number"
                      fullWidth
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      sx={{ mt: 2 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                      Cancel
                    </Button>
                    <Button
                      onClick={applyDiscount}
                      disabled={!discountValue || discountValue <= 0}
                      color="primary"
                    >
                      Apply
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>

            <div className=" flex items-center justify-center bg-gray-100 relative">
              {/* Horizontal Line */}
              <div className="absolute w-full h-px bg-black  left-0 transform -translate-y-1/2"></div>
            </div>

            {/* <div className="fixed bottom-4 right-4 flex items-center gap-8  mt-8 bg-red-800"> */}
            <div className="fixed bottom-0 left-0 w-full bg-gray-200 px-4 py-3 flex justify-end space-x-4">
              {activeReturnDisplay ? (
                <button
                  type="button"
                  onClick={handleReturnPayment}
                  className="px-6 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Return
                </button>
              ) : (
                <>
                  <IconButton onClick={handleClick}>
                    <Icon fontSize="small">more_vert</Icon>
                  </IconButton>
                  <button
                    type="button"
                    onClick={handlePaymentOpen}
                    className="px-6 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
                  >
                    Payment
                  </button>
                  {/* Cancel Button */}
                </>
              )}
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>

            {/* //test data */}

            {paymentModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-md text-center space-y-4 text-xs">
                  <h2 className="text-sm font-semibold text-gray-800">
                    Confirm Payment
                  </h2>

                  <div className="text-left text-xs space-y-1 border-t pt-2">
                    <div className="flex justify-between">
                      {paymentModalSource === "return" ? (
                        <p className="text-gray-700 font-semibold">
                          Total----: {totalAmount.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-gray-700 font-semibold">
                          {/* Total: {totalAmount.toFixed(2)} */}
                          Total: {finalTotalWithVat.toFixed(2)}
                        </p>
                      )}
                      {paymentModalSource === "payment" && (
                        <p className="text-gray-700 font-semibold">
                          Paid: {paidAmount.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      {exchange > 0 ? (
                        <p className="text-gray-700 font-semibold">
                          Remaining:
                          {(finalTotalWithVat - paidAmount + exchange).toFixed(
                            2
                          )}
                        </p>
                      ) : (
                        <p className="text-gray-700 font-semibold">
                          Remaining:
                          {(finalTotalWithVat - paidAmount).toFixed(2)}
                        </p>
                      )}

                      {paymentModalSource === "return" ? (
                        <>
                          {exchange > 0 && (
                            <div className="flex justify-between font-semibold text-green-600">
                              {/* <span>Return to customer:</span>
                              <span>{exchange.toFixed(2)}</span> */}
                              <div>
                                <strong>Total Refund:</strong> ₹
                                {totalReturnAmount.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {exchange > 0 && (
                            <div className="flex justify-between font-semibold text-green-600">
                              <span>Exchange:</span>
                              <span>{exchange.toFixed(2)}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-left space-y-3 text-xs">
                    <label className="block font-medium text-gray-600">
                      Payment Method
                    </label>
                    <div className=" flex items-center gap-4 ">
                      <div className="w-full">
                        {" "}
                        <select
                          value={methodType}
                          onChange={(e) => setMethodType(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                          <option value="">Choose method</option>
                          <option value="gift_card">Gift Card</option>
                          <option value="cash">Cash</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="foreign_currency">
                            Foreign Currency
                          </option>
                          <option value="gift_voucher">Gift Voucher</option>
                          <option value="coupon">Coupon</option>
                          <option value="online">Online</option>
                          <option value="on_credit">On Credit</option>
                        </select>
                      </div>
                      <div className="w-full">
                        <input
                          type="number"
                          placeholder="Enter Amount"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {methodType === "credit_card" && (
                      <>
                        <div className=" flex items-center gap-4 ">
                          <div className="w-full">
                            <select
                              value={selectedCardType}
                              onChange={(e) =>
                                setSelectedCardType(e.target.value)
                              }
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            >
                              <option value="">Select Card Type</option>
                              <option value="visa">Visa</option>
                              <option value="mastercard">MasterCard</option>
                              <option value="amex">American Express</option>
                            </select>
                          </div>
                          <div className="w-full">
                            {selectedCardType && (
                              <input
                                type="text"
                                placeholder="Enter Auth Code"
                                className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-lg text-xs"
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                              />
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {paymentModalSource === "return" ? (
                      <>
                        <button
                          onClick={getPaymentAmountByMethod}
                          className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Return Payment
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleAddPayment}
                        className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Add Payment
                      </button>
                    )}
                  </div>

                  <div className="text-left border-t pt-2 text-xs space-y-1">
                    <h3 className="font-semibold text-gray-700">
                      Payment Breakdown:
                    </h3>

                    {/* {fetchPaymentMethod.map((p, index) => ( */}
                    {payments.map((p, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-gray-800"
                      >
                        <span>
                          {p.method} {p.cardType ? `(${p.cardType})` : ""}
                        </span>
                        <div className="flex items-center gap-2">
                          <span>₹{p.amount}</span>
                          <button
                            onClick={() => handleRemovePayment(index)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {paymentModalSource === "return" && (
                    <div className="flex justify-center gap-2 pt-2 text-xs">
                      <button
                        onClick={handleReturn}
                        disabled={isSubmitDisabled}
                        className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow disabled:opacity-60"
                      >
                        {isSubmit ? (
                          <CircularProgress
                            color="inherit"
                            size={18}
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              marginTop: "-9px",
                              marginLeft: "-9px",
                            }}
                          />
                        ) : (
                          "Refund"
                        )}
                      </button>
                      <button
                        onClick={handlePaymentClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded"
                      >
                        Close
                      </button>
                    </div>
                  )}

                  {paymentModalSource === "payment" && (
                    <div className="flex justify-center gap-2 pt-2 text-xs">
                      <button
                        onClick={handleSave}
                        disabled={isSubmitDisabled}
                        className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow disabled:opacity-60"
                      >
                        {isSubmit ? (
                          <CircularProgress
                            color="inherit"
                            size={18}
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              marginTop: "-9px",
                              marginLeft: "-9px",
                            }}
                          />
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        onClick={handlePaymentClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {openModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto text-sm">
                  {/* Mobile No */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">
                      Mobile No.
                    </label>
                    <input
                      type="number"
                      value={formData.mobile_no}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          handleMobileChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.mobile_no && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.mobile_no}
                      </p>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.first_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.first_name}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.last_name}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={submitCustomerData}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Submit
                    </button>

                    {/* Save Button */}

                    <button
                      onClick={handleModalClose}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {openDialog && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
                  <p>
                    You've punched the item. If you're trying to leave or cancel
                    this screen, please choose one of the options below.
                  </p>
                  <p className="mt-3 font-bold">Select below action:</p>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={handleHold}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Hold
                    </button>
                    <button
                      onClick={handleDiscard}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* this is for generate invoice receipt */}
      <div>
        <div className="receipt receipt-offscreen" ref={receiptRef}>
          {/* <p className="center">TRN# 100065267500003</p> */}
          <p className="center">Kannur Tea</p>
          <p className="center">Ground Floor</p>
          <p className="center">TIME SQUARE CENTRE</p>
          <p className="center">customercare@adventurehq.ae</p>

          <p className="center">
            <strong>TAX INVOICE</strong>
          </p>
          <p className="center">{generateInvoiceNumber}</p>
          <hr />

          {/* <p>Cashier: 249</p> */}
          <p>Cashier: {formData2.salesman_id}</p>

          {/* <p>Date: {new Date().toLocaleDateString()}</p> */}
          {/* <p>Date: {new Date().toLocaleString()}</p> */}
          <p>
            Date :{" "}
            {new Date().toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })}
          </p>

          {Object.keys(dispalyName).length > 0 && (
            <div>
              {/* {console.log("dispalyName", dispalyName)} */}
              <p>
                <span>Customer:</span> {dispalyName.firstname}{" "}
                {dispalyName.lastname}
              </p>
              <p>
                <span>Phone:</span> {dispalyName.mobile}
              </p>
            </div>
          )}
          <hr />

          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Disc.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedItem?.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.itemName}
                    {/* <br />
                    Size: {item.size}
                    <br />
                    Color: {item.color} */}
                  </td>
                  <td>{item.price}</td>
                  <td>{item.qty}</td>

                  <td>
                    {(
                      item.price * item.qty -
                      item.finalTotalItem * item.qty
                    ).toFixed(2)}
                  </td>
                  <td>{(item.finalTotalItem * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          <p>
            Number of Items Sold: {selectedItem?.reduce((a, b) => a + b.qty, 0)}
          </p>
          <hr />

          <div className="total-line">
            <span>Total Before Discount:</span>
            <span>
              <strong>AED {totalBeforeDiscount}</strong>
            </span>
          </div>
          <div className="total-line">
            <span>Total Discount:</span>
            <span>
              <strong>AED {totalDiscount}</strong>
            </span>
          </div>

          <hr />

          <div className="total-line">
            <span>Subtotal:</span>
            <span>
              <strong>AED {totalAfterDiscount}</strong>
            </span>
          </div>
          <div className="total-line">
            <span>Receipt Discount:</span>
            <span>
              <strong>AED {discountAmount}</strong>
            </span>
          </div>
          <hr />

          <div className="total-line">
            <span>Grand Total:</span>
            <span>
              <strong>AED {finalTotal}</strong>
            </span>
          </div>
          <hr />

          <div className="total-line">
            <span>VAT 5%:</span>
            <span>
              <strong>AED {((finalTotal * 5) / 100).toFixed(2)}</strong>
            </span>
          </div>

          <div className="total-line">
            <span>Total Tender:</span>
            <span>
              <strong>AED {finalTotalWithVat.toFixed(2)}</strong>
            </span>
          </div>
          <hr />

          <p className="center text-center">Thank you for shopping!</p>
          <hr />
          <p className="center text-center">
            <strong> Terms & Conditions:</strong>
          </p>
          <h3 className="center text-center">
            OUR TRADING HOURS ARE 10:00AM TO 10:00PM
          </h3>
          <p className="center text-center font-thin">
            Exchange within 15 days of purchase with proof of a Receipt. Sale
            items cannot be credited or refunded. For hygienic reasons swimwear
            and under garment items cannot be exchanged or refunded. No Refund
            will be made if you change your mind after the purchase. Refunds or
            exchanges will be made if the product purchased is defective or
            counterfeit. Free Items cannot be exchanged/Refund/Credited.
          </p>

          <div className="barcode flex flex-col items-center justify-center text-center">
            <Barcode
              value={generateInvoiceNumber}
              width={1}
              height={40}
              fontSize={12}
            />
            {/* <p className="mt-1 text-xs">{generateInvoiceNumber}</p> */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pos;
