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
import { MdOutlineEmail } from "react-icons/md";
import { CiMobile3 } from "react-icons/ci";
import { IoMdMore } from "react-icons/io";

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
import CashierQueueStatus from "./CashierQueueStatus";
import { getCompanyAndLocationId } from "../../utils/comp_loc_id"; // adjust path if needed
import Setting from "pages/setting";
import ReturnItemList from "./ReturnItemList";
import AddedItemList from "./AddedItemList";
import ItemList from "./ItemList";
import Receipt from "./Receipt1";
import KitchenReceipt from "./KitchenReceipt";
import CustomerModal from "./CustomerModal";
import PaymentModal from "./PaymentModal";
import AddNewItem from "./AddNewItem";

const Pos1 = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [opened, setOpen] = React.useState(false);
  const receiptRef = useRef();
  const kitchenReceiptRef = useRef();
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
  const [searchBarcodeQuery, setSearchBarcodeQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState([]);
  const [rows, setRows] = useState([]);
  const [salesman, setsalesman] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState(3);
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
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [CreateInvoiceNumber, setCreateInvoiceNumber] = useState("");
  const [originalPayments, setOriginalPayments] = useState([]); // 👈 For display only
  const [refundPayments, setRefundPayments] = useState([]); // 👈 For DB insert (Refund only)
  const [itemLoading, setItemLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [addNewItem, setAddNewItem] = useState(false);

  const [companyData, setCompanyData] = useState({
    cashier_comp_id: null,
    cashier_loc_id: null,
  });

  useEffect(() => {
    const { cashier_comp_id, cashier_loc_id } = getCompanyAndLocationId();
    setCompanyData({ cashier_comp_id, cashier_loc_id });
    console.log(cashier_comp_id, cashier_loc_id);
    console.log("====================================");
  }, []);

  // tax Setting
  const [taxSettings, setTaxSettings] = useState([]);
  const fetchTaxSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${constantApi.baseUrl}/taxSettingsRoute/tax-list`,
      );

      if (response.data.success) {
        const allSettings = response.data.data;

        // Filter to get the active tax (status = 1)
        const activeSetting = allSettings.find((t) => t.status === 1);
        setTaxSettings(activeSetting);
      } else {
        ToastMassage(response.data.message || "Failed to fetch", "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      ToastMassage("Something went wrong while fetching tax settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxSettings();
  }, []);

  const navigate = useNavigate();

  // In your POS component

  const handleDiscountClick = () => {
    setOpenModal1(true);
    setAnchorEl(null); // 👈 this closes the dropdown menu
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
    console.log("ashihs index is ", index);
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

  const fetchInvoiceNumber = async () => {
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/invoice/invoice_number`,
      );

      if (res.data.success) {
        setCreateInvoiceNumber(res.data.invoice_number);
      }
    } catch (err) {
      console.error("Error getting invoice number", err);
    }
  };

  // Call this when component loads or on button click
  useEffect(() => {
    fetchInvoiceNumber();
  }, []);

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
    customer_id: "801322",
    bank_name: "1",
    salesman_id: "168143",
    type: "",
  });

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
    invoice_number: invoiceNumber,
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    status: "",
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

  const [paymentModalSource, setPaymentModalSource] = useState("");

  const handlePaymentOpen = () => {
    if (!formData2.customer_id) {
      setFormData2((prev) => ({ ...prev, customer_id: 801322 }));
    }
    setPaymentModal(true);
    setPaymentModalSource("payment");
  };

  const handleReturnPayment = () => {
    if (!formData2.customer_id) {
      setFormData2((prev) => ({ ...prev, customer_id: 801322 }));
    }
    setPaymentModal(true);
    setPaymentModalSource("return");
  };
  const handleExchangePayment = () => {
    if (!formData2.customer_id) {
      setFormData2((prev) => ({
        ...prev,
        customer_id: 801322,
        type: "Exchange",
      }));
    }
    setPaymentModal(true);
    setPaymentModalSource("exchange");
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
      console.log("user  id is ", newValue);

      setFormData2((prevData) => ({
        ...prevData,
        salesman_id: newValue == null ? "" : newValue?.user_id,
      }));
    }
  };
  // Keep the full salesman object in state
  const handleAutocompleteChangeItem = (event, newValue, type) => {
    console.log("sales man item value is ----", newValue);

    if (type === "salesman_item_id") {
      setautocompletesalesmanValueItem(newValue); // ✅ store the object
    }
  };

  const applySalesmanItem = (SelectIndex) => {
    const updatedItems = [...selectedItem];
    updatedItems[SelectIndex] = {
      ...updatedItems[SelectIndex],
      salesman_item_id: autocompletesalesmanValueItem
        ? autocompletesalesmanValueItem.user_id // ✅ save user_id to item
        : "",
    };
    setSelectedItem(updatedItems);
    handleCloseSalesmanItem();
  };

  useEffect(() => {
    salesmanList();
    CustomerList();
  }, []);

  const validation = (formData2) => {
    let errors = {};
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

  const OrderNumberRange = async () => {
    let params = { function_for: "customer" };
    const response = await axios_post(
      true,
      "code_setting/get-next-comming-code",
      params,
    );
    if (response) {
      if (response.status) {
        setFormData((prevData) => ({
          ...prevData,
          customer_code: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  useEffect(() => {
    OrderNumberRange();
  }, []);
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

      console.log("formdata is -----------", formData);

      if (disable === false) {
        try {
          const response = await axios_post(true, "customer/store_by_mobile", {
            formData,
          });

          if (response.status === true) {
            ToastMassage(response.message, "success");
            const responsess = await axios_post(
              true,
              "customer/details_by_mobile",
              {
                mobile: formData.mobile_no,
              },
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
          },
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
  let user_data = JSON.parse(localStorage.getItem("user_data"));

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

  const [companyName, setCompanyName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [company, setCompany] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (companyData.cashier_comp_id && compines.length > 0) {
      const comp = compines.find(
        (c) => c.id === Number(companyData.cashier_comp_id),
      );
      if (comp) setCompany(comp); // store whole company object
    }

    if (companyData.cashier_loc_id && locations.length > 0) {
      const loc = locations.find(
        (l) => l.id === Number(companyData.cashier_loc_id),
      );
      if (loc) setLocation(loc); // store whole location object
    }
  }, [compines, locations]);

  const [formData3, setFormData3] = useState({
    department_id: "",
    family_id: "",
  });

  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState();
  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    setFormData3((prev) => ({
      ...prev,
      department_id: value,
      family_id: "",
    }));

    setSelectedDepartmentId(value); // ✅ triggers API
    setSelectedFamilyId(null);
    fetchFamilyListByDepartment(value);
    setCurrentPage(1);
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
          (item) => item.itemdeptname === departmentId,
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

  const [itemCatMaster, setItemCatMaster] = useState([]);
  const fetchCategoryList = async () => {
    const response = await axios_post(true, "item_category/list");

    if (response) {
      if (response.status) {
        setItemCatMaster(response.data);
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

  const fetchdepartmentList = async () => {
    if (!companyData?.cashier_comp_id || !companyData?.cashier_loc_id) {
      return; // 🚫 stop if ids not ready
    }
    const response = await axios_post(
      true,
      `item_department/list/${companyData.cashier_comp_id}/${companyData.cashier_loc_id}`,
    );

    console.log("response is that from department", response);

    if (response?.status) {
      setDepartment(response.data || []);
    } else {
      ToastMassage(response.message, "error");
    }
  };

  useEffect(() => {
    if (companyData?.cashier_comp_id && companyData?.cashier_loc_id) {
      fetchdepartmentList();
    }
  }, [companyData]);

  const itemLocationList = async () => {
    try {
      setItemLoading(true);

      const response = await axios.post(
        `${constantApi.baseUrl}/item_location_master/filter_list_by_stock_price`,
        null,
        {
          params: {
            company_id: companyData.cashier_comp_id,
            location_id: companyData.cashier_loc_id,
            department: selectedDepartmentId || "",
            search: searchQuery || searchBarcodeQuery || "", // ✅ ADD THIS
            page: currentPage,
            limit: 20,
          },
        },
      );

      if (response.data?.status) {
        setTableData(response.data.data);
        console.log("filtered data is ", response.data.data);
      } else {
        ToastMassage(response.data?.message, "error");
        setTableData([]);
      }
    } catch (error) {
      console.error(error);
      ToastMassage("Failed to fetch items", "error");
      setTableData([]);
    } finally {
      setItemLoading(false);
    }
  };

  const itemLocationList2 = async () => {
    if (!hasMore || itemLoading) return;

    try {
      setItemLoading(true);

      const response = await axios.post(
        `${constantApi.baseUrl}/item_location_master/filter_list_by_stock_price`,
        null,
        {
          params: {
            company_id: companyData.cashier_comp_id,
            location_id: companyData.cashier_loc_id,
            department: selectedDepartmentId || "",
            page: currentPage,
            limit: 20,
          },
        },
      );

      if (response.data?.status) {
        const newItems = response.data.data || [];

        setTableData((prev) =>
          currentPage === 1 ? newItems : [...prev, ...newItems],
        );

        // 🔚 stop when no more data
        if (newItems.length < 20) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setItemLoading(false);
    }
  };

  useEffect(() => {
    const loadCompanyLocation = () => {
      const { cashier_comp_id, cashier_loc_id } = getCompanyAndLocationId();

      console.log("Location changed →", {
        company_id: cashier_comp_id,
        location_id: cashier_loc_id,
      });

      setCompanyData({
        cashier_comp_id,
        cashier_loc_id,
      });
    };

    loadCompanyLocation();

    window.addEventListener("posFilterChanged", loadCompanyLocation);

    return () => {
      window.removeEventListener("posFilterChanged", loadCompanyLocation);
    };
  }, []);

  useEffect(() => {
    if (companyData.cashier_comp_id && companyData.cashier_loc_id) {
      // ✅ reset department selection
      setSelectedDepartmentId(null);
      setFormData3((prev) => ({
        ...prev,
        department_id: "",
        family_id: "",
      }));
      setSelectedFamilyId(null);
      setCurrentPage(1);
    }
  }, [companyData.cashier_comp_id, companyData.cashier_loc_id]);

  useEffect(() => {
    if (companyData.cashier_comp_id && companyData.cashier_loc_id) {
      itemLocationList();
    }
  }, [
    companyData.cashier_comp_id,
    companyData.cashier_loc_id,
    selectedDepartmentId,
    searchQuery,
    searchBarcodeQuery,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setTableData([]);
  }, [
    selectedDepartmentId,
    companyData.cashier_comp_id,
    companyData.cashier_loc_id,
  ]);

  const [sizeMaster, setSizeMaster] = useState([]);
  const [colorMaster, setColorMaster] = useState([]);
  const sizeMasterList = async () => {
    const response = await axios_post(true, "size_master/list");

    if (response) {
      if (response.status) {
        setSizeMaster(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const colorMasterList = async () => {
    const response = await axios_post(true, "item_color/list");

    if (response) {
      if (response.status) {
        setColorMaster(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  useEffect(() => {
    BankList();
    fetchcompanyList();
    fetchlocationList();
    fetchfamilyList();
    fetchSubfamilyList();
    fetchCategoryList();
    sizeMasterList();
    colorMasterList();
  }, []);

  // ✅ Utility function to get actual size name
  const getSizeName = (sizeId) => {
    const found = sizeMaster.find((s) => String(s.id) === String(sizeId));
    return found ? found.itemsizename : sizeId; // fallback to ID if not found
  };

  const getColorName = (colorId) => {
    const found = colorMaster.find((s) => String(s.id) === String(colorId));
    return found ? found.itemcolname : colorId; // fallback to ID if not found
  };

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filteredItems = TableData.filter((masterItem) => {
      const matchSearch = searchQuery
        ? masterItem.item_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;
      const matchFamily = selectedFamilyId
        ? String(masterItem.familyname) === String(selectedFamilyId)
        : true;

      const matchBarcode = searchBarcodeQuery
        ? masterItem.itemupc
            ?.toLowerCase()
            .includes(searchBarcodeQuery.toLowerCase())
        : true;
      return matchSearch && matchBarcode && matchFamily;
    });

    // ✅ Since now it's flat data, no need for map({ index, filteredItems })
    setFilteredData(filteredItems);
    console.log(
      "filteredItems is  from the item location master -----",
      filteredItems,
    );
  }, [
    selectedDepartmentId,
    selectedFamilyId,
    searchQuery,
    searchBarcodeQuery,
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

  // search by item code
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // ✅ VERY IMPORTANT
  };

  // search by bar code
  const handleSearchBarcodeChange = (e) => {
    setSearchBarcodeQuery(e.target.value);
    setCurrentPage(1); // ✅ VERY IMPORTANT
  };

  // search by bar code with image
  const handleSearchTypeChange = async (event) => {
    const searchValue = event.target.value;
    if (searchValue.trim()) {
      const response = await axios_post(true, "item/itemcode_details", {
        item_code: searchValue,
      });

      if (response.data) {
        const item = response.data;
        const existingItemIndex = selectedItem?.findIndex(
          (selected) => selected.id === item.id,
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
              item_tax: item.item_tax,
            },
          ]);
        }
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  const handleEditItem = (id) => {
    console.log("hello Ashihs", id);
  };

  const handleRemoveSelectedItem = (idToRemove) => {
    setSlectedOpenMenuIndex(null);
    const updatedItems = selectedItem.filter((item) => item.id !== idToRemove);
    setSelectedItem(updatedItems);
    // ✅ Recalculate subtotal from remaining items
    const updatedSubtotal = updatedItems.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0,
    );
    setSubtotal(updatedSubtotal);
    setDiscountAmount(0);
    if (!isDiscountApplied) {
      setFinalTotal(updatedSubtotal);
    } else {
      setFinalTotal(updatedSubtotal);
    }
  };

  const recalculateTotals = (items) => {
    let discount = 0;
    let subtotal = items.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0,
    );
    let newSubtotal = subtotal;
    if (discountType === "amount") {
      discount = discountValue;
      newSubtotal -= discount;
    } else if (discountType === "Percentage") {
      discount = (newSubtotal * discountValue) / 100;
      newSubtotal -= discount;
    }

    newSubtotal = Math.max(newSubtotal, 0);

    setSubtotal(subtotal);
    setDiscountAmount(discount);
    setFinalTotal(newSubtotal);

    const updatedPercent =
      discountType === "amount" && subtotal > 0
        ? (Number(discountValue) / subtotal) * 100
        : discountType === "Percentage"
          ? Number(discountValue)
          : 0;

    setDiscountPercent(Number(updatedPercent.toFixed(3)));
  };

  const calculateFinalAmounts = (items, discountType, discountValue) => {
    const subtotal = items.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0,
    );
    let discount = 0;
    let finalTotal = subtotal;

    if (discountType === "amount") {
      discount = discountValue;
      finalTotal -= discount;
    } else if (discountType === "Percentage") {
      discount = (subtotal * discountValue) / 100;
      finalTotal -= discount;
    }

    finalTotal = Math.max(finalTotal, 0);
    return {
      subtotal,
      finalTotal,
      discount,
    };
  };

  const [view, setView] = useState("left"); // 'left' | 'right' | 'both'

  // handle Enter key press

  const handleBarcodeKeyDown = (e) => {
    if (e.key === "Enter") {
      const matchedItem = TableData.find(
        (row) =>
          (row.itemupc?.toString() || "") === searchBarcodeQuery.toString() ||
          (row.item_barcode?.toString() || "") ===
            searchBarcodeQuery.toString(),
      );

      if (matchedItem) {
        handleBoxClick(matchedItem);
        setSearchBarcodeQuery("");
      } else {
        alert("No item found with this barcode");
      }
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const [totalVat, setTotalVat] = useState(0);
  // ✅ Calculate total VAT whenever selectedItem changes
  useEffect(() => {
    if (selectedItem?.length > 0) {
      const vatSum = selectedItem.reduce(
        (acc, item) => acc + (Number(item.vatAmount) || 0),
        0,
      );
      setTotalVat(vatSum.toFixed(2));
    } else {
      setTotalVat(0);
    }
  }, [selectedItem]);

  const handleBoxClick = (item) => {
    console.log("items is ", item);
    setIsExpanded(true);
    setView("both");

    const existingItemIndex = selectedItem.findIndex(
      (selected) => selected.id === item.id,
    );

    let updatedItems = [...selectedItem];

    if (existingItemIndex > -1) {
      const existing = updatedItems[existingItemIndex];
      const remaining_stock = Number(existing.remaining_stock);
      // 🚨 STOCK LIMIT CHECK
      if (existing.qty >= remaining_stock) {
        ToastMassage("Quantity cannot be more than available stock!", "error");
        // alert("Quantity cannot be more than available stock!");
        return;
      }

      existing.qty += 1;
      const price = Number(existing.price);
      const tax = Number(existing.item_tax) || 0;
      const totalLinePrice = price * existing.qty;

      // Discount
      if (existing.discountTypeItem === "amount") {
        existing.discountTotalItem =
          Number(existing.discountValueItem) * existing.qty;
      } else if (existing.discountTypeItem === "Percentage") {
        existing.discountTotalItem =
          (totalLinePrice * existing.discountValueItem) / 100;
      }

      // Net price after discount
      const netPrice = totalLinePrice - existing.discountTotalItem;

      // Calculate VAT separately
      existing.vatAmount = (netPrice * tax) / 100;

      existing.finalTotalItem = netPrice / existing.qty;
      existing.total_with_exclusive_tax = netPrice;
      existing.total_with_inclusive_tax = netPrice + existing.vatAmount;

      updatedItems[existingItemIndex] = { ...existing };
    } else {
      const price = Number(item.itemprice);
      // const tax = Number(item.item_tax) || 0;
      const tax = Number(item.tax_master_1?.taxcal) || 0;

      const newItem = {
        itemName: item.item_name,
        qty: 1,
        price,
        id: item.id,
        discountTypeItem: "amount",
        discountValueItem: 0,
        discountTotalItem: 0,
        finalTotalItem: price,
        salesman_item_id: item.salesman_item_id,
        item_tax: tax,
        vatAmount: (price * tax) / 100, // store VAT separately
        total_with_exclusive_tax: price,
        total_with_inclusive_tax: price + (price * tax) / 100,
        remaining_stock: item.remaining_stock,
      };

      updatedItems.push(newItem);
      // console.log("vat amount is ----------", newItem.vatAmount);
    }

    setSelectedItem(updatedItems);
    // calculate total VAT from all items
    const vatSum = updatedItems.reduce(
      (sum, item) => sum + (item.vatAmount || 0),
      0,
    );
    setTotalVat(vatSum);
    recalculateTotals(updatedItems);
  };

  const recalcPerUnit = (items) => {
    const subBeforeDoc = items.reduce((t, it) => t + it.price * it.qty, 0);
    const docPercent = subBeforeDoc > 0 ? discountAmount / subBeforeDoc : 0;

    return items.map((it) => {
      const updated = { ...it };
      const lineTotal = updated.price * updated.qty;

      // Item-level discount
      if (updated.discountTypeItem === "amount") {
        updated.discountTotalItem =
          Number(updated.discountValueItem) * updated.qty;
      } else if (updated.discountTypeItem === "Percentage") {
        updated.discountTotalItem =
          (lineTotal * updated.discountValueItem) / 100;
      }

      // Net after item discount
      const afterItemDiscount = lineTotal - updated.discountTotalItem;

      // Apply document-level discount if needed
      const afterDocDiscount = afterItemDiscount * (1 - docPercent);

      // Final per unit (without VAT, just discount impact)
      updated.finalTotalItem = afterItemDiscount / updated.qty;

      // VAT calculation
      const tax = Number(updated.item_tax) || 0;
      updated.vatAmount = (afterItemDiscount * tax) / 100;
      updated.total_with_exclusive_tax = afterItemDiscount;
      updated.total_with_inclusive_tax = afterItemDiscount + updated.vatAmount;

      return updated;
    });
  };

  const incrementQty = (id) => {
    let isLimitReached = false;
    const items = selectedItem.map((it) => {
      console.log("it is------------", it);

      // it.id === id ? { ...it, qty: it.qty + 1 } : it
      if (it.id === id) {
        if (it.qty >= it.remaining_stock) {
          isLimitReached = true;
          return it; // ❌ do not increment
        }
        return { ...it, qty: it.qty + 1 };
      }
      return it;
    });

    // 🚨 show alert and STOP
    if (isLimitReached) {
      // alert("Quantity cannot be more than available stock!");
      ToastMassage("Quantity cannot be more than available stock!", "error");

      return;
    }
    const updatedItems = recalcPerUnit(items);

    // update totals
    const { subtotal, finalTotal, discount } = calculateFinalAmounts(
      updatedItems,
      discountType,
      discountValue,
    );

    setSelectedItem(updatedItems);
    setSubtotal(subtotal);
    setDiscountAmount(discount);
    setFinalTotal(finalTotal);

    // ✅ recalc VAT total
    const vatSum = updatedItems.reduce(
      (sum, item) => sum + (item.vatAmount || 0),
      0,
    );
    setTotalVat(vatSum);
  };

  const decrementQty = (id) => {
    const items = selectedItem.map((it) =>
      it.id === id && it.qty > 1 ? { ...it, qty: it.qty - 1 } : it,
    );
    const updatedItems = recalcPerUnit(items);

    const { subtotal, finalTotal, discount } = calculateFinalAmounts(
      updatedItems,
      discountType,
      discountValue,
    );

    setSelectedItem(updatedItems);
    setSubtotal(subtotal);
    setDiscountAmount(discount);
    setFinalTotal(finalTotal);

    // ✅ recalc VAT total
    const vatSum = updatedItems.reduce(
      (sum, item) => sum + (item.vatAmount || 0),
      0,
    );
    setTotalVat(vatSum);
  };

  const calculateExchangeTotals = () => {
    // Return side
    const returnTotal = rows.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0);

    const returnVat = rows.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      const vatRate = Number(item.vat) || 0;
      return sum + (price * qty * vatRate) / 100;
    }, 0);

    // Added side
    // const addTotal = selectedItem.reduce((sum, item) => {
    //   const price = Number(item.price) || 0;
    //   const qty = Number(item.qty) || 0;
    //   return sum + price * qty;
    // }, 0);

    // const addVat = selectedItem.reduce((sum, item) => {
    //   return sum + (Number(item.vatAmount) || 0);
    // }, 0);

    // Added side
    const addTotal = selectedItem.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;

      // Prefer discounted final total if available
      const effectiveUnitPrice = item.finalTotalItem
        ? Number(item.finalTotalItem)
        : Number(item.price) || 0;

      return sum + effectiveUnitPrice * qty;
    }, 0);

    const addVat = selectedItem.reduce((sum, item) => {
      return sum + (Number(item.vatAmount) || 0);
    }, 0);

    // Differences
    const netItems = addTotal - returnTotal;
    const netVat = addVat - returnVat;
    const netTotal = netItems + netVat;

    return {
      returnTotal,
      addTotal,
      returnVat,
      addVat,
      netItems,
      netVat,
      netTotal,
    };
  };

  const applyDiscountItem = (index) => {
    // console.log("👉 applyDiscountItem called for index:", index);
    // console.log("Current selectedItem before update:", selectedItem);

    const updatedItems = selectedItem.map((it, i) => {
      if (i !== index) return { ...it };

      const updated = { ...it };
      const lineTotal = updated.price * updated.qty;
      // ✅ Calculate item discount
      if (updated.discountTypeItem === "amount") {
        updated.discountTotalItem = Number(updated.discountValueItem) || 0;
      } else if (updated.discountTypeItem === "Percentage") {
        updated.discountTotalItem =
          (lineTotal * Number(updated.discountValueItem || 0)) / 100;
      } else {
        updated.discountTotalItem = 0;
      }

      // ✅ Final unit price after discount
      updated.finalTotalItem =
        (lineTotal - updated.discountTotalItem) / updated.qty;

      // ✅ Recalculate VAT based on discounted total
      const netLine = updated.finalTotalItem * updated.qty;
      const tax = Number(updated.item_tax) || 0;
      updated.vatAmount = (netLine * tax) / 100;
      updated.total_with_exclusive_tax = netLine;
      updated.total_with_inclusive_tax = netLine + updated.vatAmount;

      return updated;
    });

    console.log("👉 updatedItems after discount:", updatedItems);

    setSelectedItem(updatedItems);

    // 🔄 Recalculate subtotal after all items updated
    const newSubtotal = updatedItems.reduce(
      (t, it) => t + it.finalTotalItem * it.qty,
      0,
    );
    const newVat = updatedItems.reduce(
      (sum, it) => sum + (it.vatAmount || 0),
      0,
    );

    // console.log("👉 New subtotal after item discount:", newSubtotal);
    // console.log("👉 New total VAT after item discount:", newVat);

    setSubtotal(newSubtotal);
    setFinalTotal(newSubtotal);
    setTotalVat(newVat.toFixed(2));

    handleCloseModalItem();
    handleCloseItem();
  };

  const applyDiscount1 = () => {
    let discount = 0;

    // Step 1: Original subtotal
    const subtotal = selectedItem.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0,
    );

    let newSubtotal = subtotal;

    // Step 2: Apply discount
    if (discountType === "amount") {
      discount = Number(discountValue) || 0;
      newSubtotal = subtotal - discount;
    } else if (discountType === "Percentage") {
      discount = (subtotal * (Number(discountValue) || 0)) / 100;
      newSubtotal = subtotal - discount;
    }

    newSubtotal = Math.max(newSubtotal, 0); // avoid negative
    setDiscountPercent(Number(((discount / subtotal) * 100).toFixed(3)));
    setDiscountAmount(discount);

    // Step 3: Distribute discount across items proportionally
    const updatedItems = selectedItem.map((item) => {
      const lineTotal = item.finalTotalItem * item.qty;
      const share = lineTotal / subtotal; // proportional share of subtotal
      const itemDiscount = discount * share;
      const discountedLine = lineTotal - itemDiscount;

      const tax = Number(item.item_tax) || 0;
      const vatAmount = (discountedLine * tax) / 100;

      return {
        ...item,
        discountedLine,
        vatAmount,
        total_with_exclusive_tax: discountedLine,
        total_with_inclusive_tax: discountedLine + vatAmount,
      };
    });

    // Step 4: Recalculate VAT & totals
    const newVat = updatedItems.reduce(
      (sum, it) => sum + (it.vatAmount || 0),
      0,
    );

    setSelectedItem(updatedItems);
    setSubtotal(newSubtotal);
    setFinalTotal(newSubtotal + newVat); // ✅ include VAT on discounted total
    setTotalVat(newVat.toFixed(2));

    handleCloseModal();
    handleCloseItem();
  };

  const recalcWithGlobalDiscount = (items, discountType, discountValue) => {
    const subtotal = items.reduce(
      (total, item) => total + item.qty * item.finalTotalItem,
      0,
    );

    let discount = 0;
    let newSubtotal = subtotal;

    if (discountType === "amount") {
      discount = Number(discountValue) || 0;
      newSubtotal = subtotal - discount;
    } else if (discountType === "Percentage") {
      discount = (subtotal * (Number(discountValue) || 0)) / 100;
      newSubtotal = subtotal - discount;
    }

    newSubtotal = Math.max(newSubtotal, 0);

    // Proportional distribution across items
    const updatedItems = items.map((item) => {
      const lineTotal = item.finalTotalItem * item.qty;
      const share = subtotal > 0 ? lineTotal / subtotal : 0;
      const itemDiscount = discount * share;
      const discountedLine = lineTotal - itemDiscount;

      const tax = Number(item.item_tax) || 0;
      const vatAmount = (discountedLine * tax) / 100;

      return {
        ...item,
        discountedLine,
        vatAmount,
        total_with_exclusive_tax: discountedLine,
        total_with_inclusive_tax: discountedLine + vatAmount,
      };
    });

    const newVat = updatedItems.reduce(
      (sum, it) => sum + (it.vatAmount || 0),
      0,
    );

    return {
      updatedItems,
      subtotal: newSubtotal,
      discount,
      vat: newVat,
      finalTotal: newSubtotal + newVat,
    };
  };

  useEffect(() => {
    if (selectedItem.length > 0) {
      // const { updatedItems, subtotal, discount, vat, finalTotal } =
      const { subtotal, discount, vat, finalTotal } = recalcWithGlobalDiscount(
        selectedItem,
        discountType,
        discountValue,
      );

      // setSelectedItem(updatedItems);
      setSubtotal(subtotal);
      setDiscountAmount(discount);
      setFinalTotal(finalTotal);
      setTotalVat(vat.toFixed(2));
    } else {
      setSubtotal(0);
      setFinalTotal(0);
      setDiscountAmount(0);
      setTotalVat(0);
    }
  }, [selectedItem, discountType, discountValue]);

  const applyDiscount = () => {
    setDiscountType(discountType); // already tracked
    setDiscountValue(discountValue); // triggers useEffect
    handleCloseModal();
    handleCloseItem();
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

  useEffect(() => {
    recalculateTotals(selectedItem);
    // applyDiscountItem()
  }, [selectedItem, discountType, discountValue]);

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

      const response = await axios_post(
        true,
        "invoice_log/insert",
        finalPramas,
      );

      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          setSelectedItem([]);
          setView("left"); // your existing logic
          setIsExpanded(false); // reset grid to 6 items
        } else {
          ToastMassage(response.message, "error");
        }
      }
    }
  };

  const handleDiscard = () => {
    // window.location.reload();
    setOpenDialog(false); // Just close the dialog
    setSelectedItem([]);
    setView("left"); // your existing logic
    setIsExpanded(false); // reset grid to 6 items
  };

  const handleCancel = () => {
    setOpenDialog(false); // Just close the dialog
    // window.location.reload();
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
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState("");
  const [activeReturnDisplay, setActiveReturnDisplay] = useState(false);
  const [fetchItems, setFetchItems] = useState(false);
  const [fetchPaymentMethod, setFetchPaymentMethod] = useState(false);
  const [editablePayments, setEditablePayments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [methodType, setMethodType] = useState("cash");
  const [methodDetails, setMethodDetails] = useState({});
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedCardType, setSelectedCardType] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [itemTotal, setItemTotal] = useState([]);
  const [PaymentMethods, setPaymentMethods] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [finalParams, setFinalParams] = useState([]);
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);

  // const totalAmount = grandTotal > 0 ? grandTotal : calculatedTotal;
  const totalAmount = finalTotal;
  const finalTotalWithVat = Number(finalTotal) + Number(totalVat);

  const paidAmount = payments
    .filter((p) => p.method !== "exchange") // ⛔ exclude exchange
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const exchange = paidAmount - finalTotalWithVat;
  const isSubmitDisabled = paidAmount < finalTotalWithVat;

  const handleAddPayment = () => {
    if (methodType && paymentAmount) {
      const newPayment = {
        mode: mode ? mode : "payment",
        method: methodType,
        amount: parseFloat(paymentAmount),

        // Credit card fields
        ...(methodType === "credit_card" && selectedCardType
          ? { cardType: selectedCardType, authCode: authCode }
          : {}),

        // Voucher / Gift Card / Coupon field
        ...(["gift_card", "gift_voucher", "coupon"].includes(methodType) &&
        voucherNumber
          ? { code: voucherNumber }
          : {}),

        // Foreign Currency field
        ...(methodType === "foreign_currency" && selectedCurrency
          ? { currency: selectedCurrency }
          : {}),
      };

      setPayments([...payments, newPayment]);
      setPaymentMethods((prev) => [...prev, newPayment]);

      // Reset all inputs
      setMethodDetails({});
      setMethodType("");
      setPaymentAmount("");
      setSelectedCardType("");
      setAuthCode("");
      setVoucherNumber("");
      setSelectedCurrency("");
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

  const [returnPayments, setReturnPayments] = useState([]);
  const [removedPrice, setRemovedPrice] = useState(0);
  const [isRefund, setIsRefund] = useState(null);

  const getPaymentAmountByMethod = (method, paymentAmount, mode) => {
    if (!method || !paymentAmount) {
      console.warn("Method or payment amount missing");
      return;
    }

    const parsedAmount = parseFloat(paymentAmount);

    const newPayment = {
      method: method,
      amount: parsedAmount,
      ...(method === "credit_card" && selectedCardType
        ? { cardType: selectedCardType, authCode: authCode }
        : {}),
      ...(["gift_card", "gift_voucher", "coupon"].includes(method) &&
      voucherNumber
        ? { code: voucherNumber }
        : {}),
      ...(method === "foreign_currency" && selectedCurrency
        ? { currency: selectedCurrency }
        : {}),
    };

    const returnPayment = {
      ...newPayment,
      amount: -Math.abs(parsedAmount),
      mode: mode,
      ...(mode === "Return" ? { isRefund: true } : { isExchange: true }),
    };

    setReturnPayments((prev) => [...prev, returnPayment]);
    setPayments((prev) => [...prev, returnPayment]);
    setPaymentMethods((prev) => [...prev, newPayment]);
    setTotalReturnAmount((prev) => prev + parsedAmount);
  };

  const updatedPaymentMethods = [
    ...PaymentMethods,
    // ...(exchange > 0
    //   ? [{ method: "exchange", amount: parseFloat(exchange.toFixed(2)) }]
    //   : []),
  ];

  const handleRemovePayment = (indexToRemove) => {
    const updatedPayments = payments.filter(
      (_, index) => index !== indexToRemove,
    );
    const updatedPaymentMethods = PaymentMethods.filter(
      (_, index) => index !== indexToRemove,
    );
    setPayments(updatedPayments);
    setPaymentMethods(updatedPaymentMethods);

    // ✅ Recalculate totalReturnFund based on remaining payments
    const newReturnFund = updatedPayments
      .filter((p) => p.isRefund)
      .reduce((total, p) => total + Math.abs(p.amount), 0);

    setTotalReturnFund(newReturnFund);
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

  const [mode, setMode] = useState(""); // "Return" or "Exchange"
  const [showModePopup, setShowModePopup] = useState(false);

  const fetchInvoiceDetails = async () => {
    try {
      setActiveReturnDisplay(true);
      // ✅ Clean the invoice number before sending
      const cleanedInvoiceNumber = invoiceNumber?.trim()?.replace(/\s+/g, "");
      const response = await axios.post(
        `${constantApi.baseUrl}/invoice/details`,
        {
          invoice_number: cleanedInvoiceNumber,
        },
      );
      console.log("invoice details ----is ---", response.data);
      setFetchPaymentMethod(response.data.data.payment_method_details);
      setGrandTotal(parseFloat(response.data.data.grand_total));

      if (response.status) {
        setView("right");
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

          let item_uom = element.itemLocationModel.item_main_prices;
          const filteredObject = item_uom.find(
            (item) => item.item_uom_id === element.item_uom_id,
          );
          // const qty = parseFloat(element.ret_bal_qty || element.item_qty || 1);
          // const netTotal = parseFloat(element.item_net || 0);
          // const rate =
          //   element.is_free == 1
          //     ? 0
          //     : qty > 0
          //     ? parseFloat((netTotal / qty).toFixed(2))
          //     : 0;

          // console.log("rate is ----------------", rate);

          let obje = {
            id: index + 1,
            invoice_details_id: element.id,
            item_id: element.item_id,
            item_code: element.itemLocationModel.item_code,
            item_name: element.itemLocationModel.item_name,
            uom: element?.item_uom_id,
            item_uom:
              element.itemLocationModel?.item_main_prices?.[0]?.item_uom
                ?.name || "PCS",
            quantity: element.ret_bal_qty,
            excise: element.is_free == 1 ? 0.0 : element.item_excise,
            discount: element.is_free == 1 ? 0.0 : element.item_discount_amount,
            net: element.is_free == 1 ? 0.0 : element.item_net,
            // quantity: element.item_qty,
            price: element.is_free == 1 ? 0.0 : element.item_gross,
            item_grand_total: element.item_grand_total,
            perItem_Total: element.perItem_Total,

            rate: element.rate,

            // rate:
            //   element.is_free == 1
            //     ? 0.0
            //     : element.rate === null
            //     ? element.item_gross
            //     : element.rate,

            // vat: element.item_vat,
            vat:
              element?.is_free == 1
                ? 0
                : parseFloat(element.itemLocationModel?.tax_master_1?.taxcal),
            // : parseFloat(element.itemLocationModel?.item_tax),
            taxa_ble:
              element?.is_free == 1
                ? 0.0
                : (
                    (parseFloat(element?.item_net) *
                      1 *
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal,
                      )) /
                    // parseFloat(element?.itemLocationModel?.item_tax)) /
                    100
                  ).toFixed(2),
            total:
              element.is_free == 1
                ? 0.0
                : (
                    parseFloat(element?.item_net) +
                    (parseFloat(element?.item_net) *
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal,
                      )) /
                      100
                  ).toFixed(2),
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
        // setRemovedPrice(0);
        // ✅ Calculate totalReturnFund based on fetched invoice data
        const initialTotal = invoice_details.reduce((acc, item) => {
          const itemTotal =
            item.item_grand_total !== undefined
              ? parseFloat(item.item_grand_total)
              : parseFloat(item.quantity) * parseFloat(item.price);
          return acc + itemTotal;
        }, 0);

        setTotalReturnFund(parseFloat(initialTotal.toFixed(2)));
        setNewData(invoice_details); // 👈 Add this line

        // setTotalReturnFund(0);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);

      // Handle 403 or other HTTP errors
      if (error.response && error.response.status === 403) {
        ToastMassage(error.response.data.message, "error");
      } else if (error.response) {
        ToastMassage(
          error.response.data.message || "An error occurred",
          "error",
        );
      } else {
        ToastMassage("Network or server error occurred", "error");
      }
    }
  };

  const handleClear = () => {
    window.location.reload(); // Correct way to reload the page
    setOpenDialog(false); // Just close the dialog
    setSelectedItem([]);
    setView("left"); // your existing logic
    setIsExpanded(false); // reset grid to 6 items
    setActiveReturnDisplay(false);
  };

  const [totalReturnFund, setTotalReturnFund] = useState(0);

  const decrementFetchQty1 = (id) => {
    setRows((prevRows) => {
      let totalRemoved = 0;

      const updatedItems = prevRows.map((item) => {
        if (item.id === id && parseFloat(item.quantity) > 0) {
          const currentQty = parseFloat(item.quantity);
          const newQty = currentQty - 1;
          const perUnitNet = parseFloat(item.net); // Net per unit
          const perUnitVAT = (perUnitNet * item.vat) / 100;
          const perUnitTotal = perUnitNet + perUnitVAT;
          totalRemoved += perUnitTotal;

          const newNetTotal = perUnitNet * newQty;
          const newTax = (newNetTotal * item.vat) / 100;
          const newGrand = newNetTotal + newTax;

          return {
            ...item,
            quantity: newQty,
            item_qty: newQty.toFixed(2),
            net: parseFloat(perUnitNet.toFixed(2)), // ✅ keep number
            taxa_ble: parseFloat(newTax.toFixed(2)), // ✅ keep number
            total: parseFloat(newGrand.toFixed(2)), // ✅ keep number
            item_grand_total: parseFloat(newGrand.toFixed(2)), // ✅ keep number
          };
        }
        return item;
      });

      // ✅ Add removed price to existing total
      setRemovedPrice((prev) => parseFloat((prev + totalRemoved).toFixed(2)));

      const updatedTotal = updatedItems.reduce((acc, item) => {
        const itemTotal =
          item.item_grand_total !== undefined
            ? parseFloat(item.item_grand_total)
            : parseFloat(item.quantity) * parseFloat(item.price);
        return acc + itemTotal;
      }, 0);

      setGrandTotal(parseFloat(updatedTotal.toFixed(2)));
      setTotalReturnFund(parseFloat(updatedTotal.toFixed(2))); // ✅ Added this line
      setNewData(updatedItems);

      return updatedItems;
    });
  };

  const decrementFetchQty = (id) => {
    setRows((prevRows) => {
      const updatedItems = prevRows.map((item) => {
        if (item.id === id && parseFloat(item.quantity) > 0) {
          const currentQty = parseFloat(item.quantity);
          const newQty = currentQty - 1;

          // ✅ unit values (DO NOT change)
          const rate = parseFloat(item.rate) || 0; // per-unit after discount
          const vatPercent = parseFloat(item.vat) || 0;

          // ✅ derived totals
          const newNet = rate * newQty;
          const newTax = (newNet * vatPercent) / 100;
          const newGrand = newNet + newTax;

          return {
            ...item,
            quantity: newQty,
            net: parseFloat(newNet.toFixed(2)),
            taxa_ble: parseFloat(newTax.toFixed(2)),
            total: parseFloat(newGrand.toFixed(2)),
            item_grand_total: parseFloat(newGrand.toFixed(2)),
          };
        }
        return item;
      });

      const updatedTotal = updatedItems.reduce(
        (acc, item) => acc + (parseFloat(item.item_grand_total) || 0),
        0,
      );

      setGrandTotal(parseFloat(updatedTotal.toFixed(2)));
      setTotalReturnFund(parseFloat(updatedTotal.toFixed(2)));
      setNewData(updatedItems);

      return updatedItems;
    });
  };

  useEffect(() => {
    const updatedTotal = rows.reduce((acc, item) => {
      const itemTotal = item.item_grand_total
        ? parseFloat(item.item_grand_total)
        : item.quantity * parseFloat(item.price);
      return acc + itemTotal;
    }, 0);

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
        const filteredPayments = payments.filter((p) => {
          return !(
            p.amount > 0 &&
            returnPayments.some(
              (r) => r.amount === -p.amount && r.method === p.method,
            )
          );
        });

        // ✅ Combine final payment details
        const finalPaymentDetails = [...filteredPayments, ...returnPayments];

        let finalPramas = {
          ...formData2,
          ...formData5,
          discount: sums.discount,
          net: sums.net,
          excise: sums.excise,
          vat: sums.vat,
          total: sums.net,
          total_gross: sums.total_gross,
          total_discount_amount: sums.discountAmount,
          total_qty: sums.quantity,
          payment_terms: 2,
          selectedItems: newData,
          PaymentDetails: finalPaymentDetails,
          invoice_number: CreateInvoiceNumber,
          // updatePrevInvoice: invoiceNumber,
          updatePrevInvoice: invoiceNumber.trim(),

          // 🔹 Add Company and Location here
          cashier_comp_id: companyData.cashier_comp_id,
          cashier_loc_id: companyData.cashier_loc_id,
        };
        console.log("handle reutrn data during submit ", finalPramas);

        const response = await axios_post(
          true,
          "invoice/invoice_insert",
          finalPramas,
        );

        if (response) {
          if (response.status) {
            // ToastMassage(response.message, "success");
            ToastMassage(
              `${response.message} (Invoice No: ${CreateInvoiceNumber})`,
              "success",
            );

            const selectedItemsCopy = [...newData];
            setReceiptItems(selectedItemsCopy);

            // ✅ Set receipt data for rendering
            setReceiptData({
              Total: sums.net,
              finalTotal: sums.total_gross + sums.vat,
              discountAmount: sums.discountAmount,
              payments: finalPaymentDetails,
              totalBeforeDiscount: sums.net + sums.discountAmount,
              totalDiscount: sums.discountAmount,
              totalAfterDiscount: sums.net,
              totalVat: sums.vat,
            });

            // ✅ Generate receipt PDF
            ganrateReceipt(selectedItemsCopy);

            // navigate("/invoice");
          } else {
            ToastMassage(response.message, "error");
          }
        }
      }
    }
  };

  const calculateSums1 = (items) =>
    items.reduce(
      (sums, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        const netUnit = parseFloat(item.net) || 0;
        // old totals
        sums.excise += parseFloat(item.excise) || 0;
        sums.discountPercent += parseFloat(item.discount) || 0; // 10 % + 20 % = 30 %
        // new money-off total
        sums.discountAmount += (price - netUnit) * qty; // ₹ saved
        // rest stays unchanged
        sums.net += netUnit * qty;
        sums.vat += (netUnit * qty * item.vat) / 100;
        sums.total += netUnit * qty * (1 + item.vat / 100);
        sums.total_gross += price * qty;
        sums.quantity += qty;
        return sums;
      },
      {
        excise: 0,
        discountPercent: 0,
        discountAmount: 0,
        net: 0,
        vat: 0,
        total: 0,
        total_gross: 0,
        quantity: 0,
      },
    );

  const calculateSums = (items) =>
    items.reduce(
      (sums, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0; // original price
        const rate = parseFloat(item.rate) || 0; // discounted unit price
        const vat = parseFloat(item.vat) || 0;

        const net = rate * qty;
        const vatAmount = (net * vat) / 100;
        const total = net + vatAmount;

        sums.excise += parseFloat(item.excise) || 0;
        sums.discountAmount += (price - rate) * qty;
        sums.net += net;
        sums.vat += vatAmount;
        sums.total += total;
        sums.total_gross += price * qty;
        sums.quantity += qty;

        return sums;
      },
      {
        excise: 0,
        discountPercent: 0,
        discountAmount: 0,
        net: 0,
        vat: 0,
        total: 0,
        total_gross: 0,
        quantity: 0,
      },
    );

  const sums = calculateSums(rows);
  console.log("rows for the sums is ---", rows);
  console.log("sums for the sums is ---", sums);

  const [receiptItems, setReceiptItems] = useState([]);
  const [receiptData, setReceiptData] = useState({});
  const [registerID, setRegisterID] = useState({});

  const fetchOpenRegisterID = async () => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/register_float/list`,
      );
      if (response.data.status) {
        const data = response.data.data;
        const openEntry = data.find(
          (entry) => entry.status.toLowerCase() === "open",
        );
        if (openEntry) {
          // console.log("Open Register ID:", openEntry.id);
          // ToastMassage("There is a float entry with status: OPEN", "error");
          setRegisterID(openEntry.id);
        } else {
          ToastMassage("There is no float entry with status: OPEN", "error");
        }
      } else {
        ToastMassage("Float Details data not found", "error");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      ToastMassage("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenRegisterID();
  }, []);

  const handleSave = async (event) => {
    setisSubmit(true);
    setPaymentModal(false);

    const subtotal = calculateSubtotal();
    let errors = validation(formData2);

    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});

      // Update selected items with final total
      const updatedSelectedItems = selectedItem.map((item) => ({
        ...item,
        finalTotalItem: item.finalTotalItem * item.qty,
      }));

      // Clone fresh payments to avoid stale data
      const freshPaymentMethods = [...payments];

      // Build final invoice data
      let finalPramas = {
        ...formData2,
        subtotal: parseFloat(subtotal),
        discountAmount: discountAmount,
        total: finalTotal,
        selectedItems: updatedSelectedItems,
        discountType: discountType,
        discountPercent: discountPercent,
        ...formData5,
        PaymentDetails: freshPaymentMethods,
        paidAmount: paidAmount,
        invoice_number: CreateInvoiceNumber,
        registerID: registerID,
        // 🔹 Add Company and Location here
        cashier_comp_id: companyData.cashier_comp_id,
        cashier_loc_id: companyData.cashier_loc_id,
      };

      // console.log("final params is for handle save", finalPramas);

      const response = await axios_post(
        true,
        "invoice/invoice_insert",
        finalPramas,
      );

      if (response) {
        setisSubmit(false);

        if (response.status) {
          ToastMassage(
            `${response.message} (Invoice No: ${CreateInvoiceNumber})`,
            "success",
          );
          const selectedItemsCopy = [...selectedItem];
          setReceiptItems(selectedItemsCopy);
          setReceiptData({
            finalTotal,
            finalTotalWithVat,
            discountAmount,
            payments,
            totalBeforeDiscount,
            totalDiscount,
            totalAfterDiscount,
          });

          // ✅ Wait until receipt is generated
          await ganrateReceipt(selectedItemsCopy);
          // ✅ Only after printing, fetch next invoice number
          fetchInvoiceNumber();
          // ganrateKitchenReceipt(selectedItemsCopy);
          setSelectedItem([]);
          setFinalTotal(0);
          setMethodType("cash");
          setPayments([]); // 🔥 This prevents old PaymentDetails from sticking around
          setDiscountValue(0);
          setDiscountAmount(0);
          setDiscountType("amount");
          setDiscountPercent(0);
          // 🔹 Close payment modal
          setPaymentModal(false);
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

  const handleExchange = async () => {
    try {
      setisSubmit(true);
      setPaymentModal(false);

      // 🔹 Calculate subtotal for added items
      const subtotal = selectedItem.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.qty),
        0,
      );

      // 🔹 Prepare returned items (rows)
      const returnItems = rows.map((item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        const vatRate = Number(item.vat) || 0;

        const total = price * qty;
        const vat = (total * vatRate) / 100;

        return {
          item_id: item.item_id,
          item_name: item.name || item.item_name,
          qty,
          price,
          vatRate,
          total,
          vat,
          totalWithVat: total + vat,
        };
      });

      // 🔹 Prepare added items (selectedItem)
      const addedItems = selectedItem.map((item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 0;
        const vatRate = Number(item.item_tax) || 0;

        const lineTotal = price * qty;
        const discount = Number(item.discountTotalItem) || 0;
        const net = lineTotal - discount;
        const vat = Number(item.vatAmount) || (net * vatRate) / 100;

        return {
          id: item.id,
          itemName: item.itemName,
          qty,
          price,
          vatRate,
          discount,
          lineTotal,
          net,
          vat,
          totalWithVat: net + vat,
          discountTypeItem: item.discountTypeItem || "amount",
          discountValueItem: item.discountValueItem || 0,
          salesman_item_id: item.salesman_item_id || null,
        };
      });

      // 🔹 Summaries
      const returnSummary = {
        total: returnItems.reduce((sum, i) => sum + i.total, 0),
        vat: returnItems.reduce((sum, i) => sum + i.vat, 0),
        grandTotal: returnItems.reduce((sum, i) => sum + i.totalWithVat, 0),
      };

      const addedSummary = {
        total: addedItems.reduce((sum, i) => sum + i.net, 0),
        vat: addedItems.reduce((sum, i) => sum + i.vat, 0),
        grandTotal: addedItems.reduce((sum, i) => sum + i.totalWithVat, 0),
      };

      // 🔹 Build final parameters for API
      const finalParams = {
        ...formData2,
        type: "exchange", // ✅ force exchange type

        subtotal: parseFloat(subtotal),
        discountAmount,
        total: addedSummary.total, // total for added items
        total_gross: addedSummary.grandTotal,
        discountType,
        discountPercent,
        PaymentDetails: [...payments],
        paidAmount,
        invoice_number: CreateInvoiceNumber,
        // updatePrevInvoice: invoiceNumber,
        updatePrevInvoice: invoiceNumber?.trim(), // 👈 clean spaces

        registerID,
        cashier_comp_id: companyData.cashier_comp_id,
        cashier_loc_id: companyData.cashier_loc_id,
        selectedItem: addedItems,
        returnItems,
      };

      console.log("📤 Sending Exchange Data to API:", finalParams);

      // 🔹 Send to your Exchange controller
      const response = await axios_post(
        true,
        "invoice/exchange_invoice",
        finalParams,
      );

      setisSubmit(false);

      if (response?.status) {
        ToastMassage(
          `${response.message} (Invoice No: ${CreateInvoiceNumber})`,
          "success",
        );
        // Reset selections
        setSelectedItem([]);
        setPayments([]);
        setDiscountAmount(0);
        setDiscountType("amount");
        setDiscountPercent(0);
        setFinalTotal();
      } else {
        ToastMassage(response?.message || "Something went wrong", "error");
      }
    } catch (error) {
      setisSubmit(false);
      console.error("Exchange Save Error:", error);
      ToastMassage("Failed to save exchange", "error");
    }
  };

  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowMoreInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleProfileClick = () => {
    setShowUserInfo((prev) => !prev);
  };

  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowUserInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showInput, setShowInput] = useState(false);

  const ganrateReceipt = async (items) => {
    let user_data = JSON.parse(localStorage.getItem("user_data"));
    const input = receiptRef.current;

    input.style.visibility = "visible";

    return new Promise((resolve) => {
      setTimeout(() => {
        html2canvas(input, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          const pdfWidth = 72; // mm
          const pdfHeight = 210; // mm

          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [pdfWidth, pdfHeight],
          });

          const pxToMm = (px) => (px * 25.4) / 96;
          const imgOriginalWidthMm = pxToMm(canvas.width);
          const imgOriginalHeightMm = pxToMm(canvas.height);

          const scale = pdfWidth / imgOriginalWidthMm;
          const scaledHeight = imgOriginalHeightMm * scale;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, scaledHeight);

          pdf.save("receipt.pdf");
          input.style.visibility = "hidden";

          resolve(); // ✅ signal that receipt is done
        });
      }, 300);
    });
  };

  // const ganrateKitchenReceipt = async (items) => {
  //   const input = kitchenReceiptRef.current;
  //   input.style.visibility = "visible";
  //   setTimeout(() => {
  //     html2canvas(input, { scale: 2 }).then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");
  //       const imgWidth = 72;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       const pdf = new jsPDF({
  //         orientation: "portrait",
  //         unit: "mm",
  //         format: [imgWidth, imgHeight],
  //       });
  //       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //       pdf.save("kitchenReceipt.pdf");
  //       input.style.visibility = "hidden";
  //     });
  //   }, 300);
  // };

  const [showOrderStatus, setOrderStatus] = useState(false);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (posRef.current && !posRef.current.contains(event.target)) {
  //       if (Array.isArray(selectedItem) && selectedItem.length > 0) {
  //         event.preventDefault();
  //         event.stopPropagation();
  //         setOpenDialog(true);
  //       }
  //     }
  //   }

  //   function handleBeforeUnload(event) {
  //     if (Array.isArray(selectedItem) && selectedItem.length > 0) {
  //       event.preventDefault();
  //       event.returnValue = ""; // Required for Chrome to trigger confirmation
  //       setOpenDialog(true);
  //     }
  //   }

  //   document.addEventListener("click", handleClickOutside, true);
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, true);
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [selectedItem]);

  // const posRef = useRef(null);
  // const dialogRef = useRef(null);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (
  //       (posRef.current && posRef.current.contains(event.target)) ||
  //       (dialogRef.current && dialogRef.current.contains(event.target))
  //     ) {
  //       return; // ✅ ignore clicks inside POS or popup
  //     }

  //     if (Array.isArray(selectedItem) && selectedItem.length > 0) {
  //       event.preventDefault();
  //       event.stopPropagation();
  //       setOpenDialog(true);
  //     }
  //   }

  //   document.addEventListener("click", handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, true);
  //   };
  // }, [selectedItem]);

  const returnProps = {
    rows, // array of items to return
    decrementFetchQty,
    selectedOpenMenuIndex,
    anchorElItem,
    openItem,
    handleCloseItem,
    handleDiscountClickItem,
    handleSalesmanClickItem,
    handleEditPriceClickItem,
    openEditPriceItem,
    handleCloseEditPriceItem,
    handleEditPriceItem,
    applyPriceItem,
    openSalesmanItem,
    handleCloseSalesmanItem,
    salesman,
    autocompletesalesmanValueItem,
    handleAutocompleteChangeItem,
    applySalesmanItem,
    handleRemoveSelectedItem,
    openModalItem,
    handleCloseModalItem,
    calculateDiscountItem,
  };

  const addedProps = {
    // dialogRef,

    selectedItem, // array of items added to cart
    taxSettings,
    decrementQty,
    incrementQty,
    selectedOpenMenuIndex,
    handleClickItem,

    anchorElItem,
    openItem,
    handleCloseItem,
    handleDiscountClickItem,
    handleSalesmanClickItem,
    handleEditPriceClickItem,
    openEditPriceItem,
    handleCloseEditPriceItem,
    handleEditPriceItem,
    applyPriceItem,
    openSalesmanItem,
    handleCloseSalesmanItem,
    salesman,
    autocompletesalesmanValueItem,
    handleAutocompleteChangeItem,
    handleAutocompleteChangeItem,
    applySalesmanItem,
    handleRemoveSelectedItem,
    openModalItem,
    handleCloseModalItem,
    calculateDiscountItem,
    discountPercent,
    cartImage,
    openModal1,
    handleCloseModal,
    handleCloseEditPriceItem,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div
      // ref={posRef}
      // style={{
      //   width: "full",
      // }}
      >
        <div className="bg-white">
          <div className=" flex justify-between items-center gap-4 py-2 mx-2 px-2 bg-blue-300 rounded-t ">
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
                    className="w-28 px-2 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                  />
                </div>
                <div className="relative">
                  {Object.keys(dispalyName).length > 0 && (
                    // <div className="absolute top-full right-0 mt-2 w-52 z-40 bg-white shadow-lg p-4 rounded-md">
                    <p className="text-gray-700  bg-white p-2 rounded focus:ring-1 focus:ring-blue-400 text-xs">
                      {dispalyName.first_name} {dispalyName.last_name}
                    </p>
                    // </div>
                  )}
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
                  {/* <select
                    name="salesman_id"
                    value={formData2.salesman_id}
                    onChange={(e) => {
                      const selected = salesman.find(
                        (item) => item.id === parseInt(e.target.value)
                      );
                      handleAutocompleteChange(e, selected, "salesman_id");
                    }}
                    className="w-[140px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                  >
                    <option value="">Select Salesman</option>
                    {salesman.map((s, i) => (
                      <option key={i} value={s.id}>
                        {s.salesman_code} - {s.users?.firstname}
                      </option>
                    ))}
                  </select> */}
                  <select
                    name="salesman_id"
                    value={formData2.salesman_id || ""}
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value);
                      const selected = salesman.find(
                        (item) => item.user_id === selectedId,
                      );

                      setFormData2((prev) => ({
                        ...prev,
                        salesman_id: selectedId, // 👈 update selected id
                      }));

                      handleAutocompleteChange(e, selected, "salesman_id"); // if you still need this
                    }}
                    className="w-[140px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                  >
                    <option value="">Select Salesman</option>
                    {salesman.map((s, i) => (
                      <option key={i} value={s.user_id}>
                        {s.salesman_code} - {s.users?.firstname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className=" text-left flex justify-between items-center gap-4">
              <button
                className="bg-blue-500 p-1 rounded text-xs text-white"
                onClick={() => {
                  if (selectedItem?.length > 0) {
                    setOpenDialog(true);
                  } else {
                    setOrderStatus(true);
                  }
                }}
              >
                Order Status
              </button>
            </div>
            <div className="flex justify-end items-center ">
              <div className="flex justify-end items-center gap-4 mx-4 text-sm">
                <div className="flex items-center space-x-2">
                  {!showInput ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-xs"
                      onClick={() => {
                        if (selectedItem?.length > 0) {
                          setOpenDialog(true);
                        } else {
                          setShowInput(true);
                        }
                      }}
                    >
                      Return/Exchange
                    </button>
                  ) : (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter Invoice Number"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          className="border rounded px-2 py-1 text-xs pr-6" // 👈 add right padding for the cross
                        />

                        {/* Cross/Clear button inside input */}
                        {invoiceNumber && (
                          <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Search button */}
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs ml-2"
                        onClick={() => setShowModePopup(true)}
                      >
                        Search
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div
                className="cursor-pointer"
                // onClick={() => setShowMoreInfo(true)}
                onClick={() => setShowMoreInfo((prev) => !prev)}
              >
                <IoMdMore />
              </div>
              <div className="relative">
                {showMoreInfo && (
                  <div
                    ref={profileRef}
                    className="absolute top-full right-0 mt-4 w-52 h-40 z-40 bg-white shadow-lg p-4 rounded-md"
                  >
                    {/* <p className="text-gray-700 text-xs">
                      <span className="font-medium">ID:</span>{" "}
              
                    </p>
                    <p className="text-gray-700 text-xs">
                      <span className="font-medium">Name:</span>{" "}
             
                    </p>
                    <p className="text-gray-700 text-xs flex items-center gap-1">
                      <CiMobile3 className="text-base" />
     
                    </p>
                    <p className="text-gray-700 text-xs flex items-center gap-1">
                      <MdOutlineEmail className="text-base" />
  
                    </p> */}
                  </div>
                )}
              </div>

              {/* <div className="relative">
                {showProfile && (
                  <div onClick={handleProfileClick} className="cursor-pointer">
                    <CgProfile />
                  </div>
                )}

                {showUserInfo && Object.keys(dispalyName).length > 0 && (
                  <div
                    ref={profileRef}
                    className="absolute top-full right-0 mt-2 w-52 z-40 bg-white shadow-lg p-4 rounded-md"
                  >
                    <p className="text-gray-700 text-xs">
                      <span className="font-medium">ID:</span>{" "}
                      {dispalyName.user_id}
                    </p>
                    <p className="text-gray-700 text-xs">
                      <span className="font-medium">Name:</span>{" "}
                      {dispalyName.firstname} {dispalyName.lastname}
                    </p>
                    <p className="text-gray-700 text-xs flex items-center gap-1">
                      <CiMobile3 className="text-base" />
                      {dispalyName.mobile}
                    </p>
                    <p className="text-gray-700 text-xs flex items-center gap-1">
                      <MdOutlineEmail className="text-base" />
                      {dispalyName?.email}
                    </p>
                  </div>
                )}
              </div> */}
            </div>
          </div>

          {showModePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-auto text-center space-y-6 transform transition-all scale-100">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800">
                  Select an Action
                </h3>

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setMode("Return");
                      setPaymentModalSource("return");
                      setShowModePopup(false);
                      fetchInvoiceDetails("Return");
                    }}
                    className="px-5 py-2.5 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition"
                  >
                    Return
                  </button>

                  <button
                    onClick={() => {
                      setMode("Exchange");
                      setPaymentModalSource("exchange");
                      setShowModePopup(false);
                      fetchInvoiceDetails("Exchange");
                    }}
                    className="px-5 py-2.5 rounded-lg font-medium text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition"
                  >
                    Exchange
                  </button>
                </div>

                {/* Cancel */}
                <button
                  onClick={() => setShowModePopup(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Header section end here */}

          <div className="flex justify-between items-center gap-4 px-4 py-1 mx-2 bg-gray-300">
            <button
              onClick={() => {
                setView("left"); // your existing logic
                setIsExpanded(false); // reset grid to 6 items
              }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Show Items
            </button>

            <div className=" text-left flex justify-between items-center gap-4">
              <input
                type="text"
                placeholder="Search by Item Name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-auto h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
              />

              {/* {filteredData.length == 0 && <div>hello</div>} */}
              {filteredData.length === 0 && (
                <button
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded-sm"
                  onClick={() => setAddNewItem(true)}
                >
                  + Item
                </button>
              )}

              <input
                type="text"
                placeholder="Search by Barcode"
                // onBlur={handleSearchTypeChange} this function is sue for image
                value={searchBarcodeQuery}
                onChange={handleSearchBarcodeChange}
                onKeyDown={handleBarcodeKeyDown}
                className="w-auto h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md w-fit text-sm">
              <span className="font-semibold text-gray-700">Tax Type:</span>
              <span className="text-blue-600 capitalize">
                {taxSettings.tax_name}
              </span>
            </div>

            <button
              onClick={() => setView("right")}
              className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Show Cart
            </button>
          </div>

          <form method="POST" action="#" onSubmit={handleSubmit}>
            <div className="p-2 space-y-2">
              {/* Item Search */}
              <div className="relative w-full h-[90vh] overflow-hidden">
                <div
                  className={`absolute top-0 h-full overflow-y-auto transition-all duration-500 ease-in-out bg-white border-t border-l border-r border-black rounded-t-md extra-thin-scroll ${
                    view === "left"
                      ? "left-0 w-full"
                      : view === "both"
                        ? "left-0 w-1/2"
                        : "-left-full w-1/2"
                  }`}
                >
                  <div className="px-1 mb-12">
                    <div className="flex justify-between items-center gap-4">
                      {/* item category like FG PKG comment here you can uncomment if nedeed */}

                      {/* <div className="my-3">
                        <select
                          value={activeTab}
                          onChange={(e) =>
                            handleTabChange(null, Number(e.target.value))
                          }
                          className="w-[100px] h-[32px] px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 text-xs"
                        >
                          {itemCatMaster.map((item, index) => (
                            <option key={index} value={index}>
                              {item.itemcatname}
                            </option>
                          ))}
                        </select>
                      </div> */}

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

                        <button
                          type="button"
                          className={`px-3 py-1 text-xs rounded border ${
                            !formData3.department_id
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-gray-200 text-gray-700 border-gray-300"
                          }`}
                          onClick={() => {
                            setFormData3({ department_id: "", family_id: "" });
                            setSelectedDepartmentId(null);
                            setSelectedFamilyId(null);
                            setCurrentPage(1);
                          }}
                        >
                          All
                        </button>

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
                                target: {
                                  name: "department_id",
                                  value: dep.id,
                                },
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
                    </div>

                    <ItemList
                      filteredData={filteredData}
                      isExpanded={isExpanded}
                      handleBoxClick={handleBoxClick}
                      getSizeName={getSizeName}
                      getColorName={getColorName}
                      constantApi={constantApi}
                      loading={loading}
                      itemLoading={itemLoading}
                    />
                  </div>
                </div>

                {/* cart data for fetch invoice  */}
                <div
                  className={`absolute top-0 h-full overflow-y-auto transition-all duration-500 ease-in-out bg-gray-50 border-t border-r border-black rounded-t-md extra-thin-scroll ${
                    view === "right"
                      ? "left-0 w-full"
                      : view === "both"
                        ? "left-1/2 w-1/2"
                        : "left-full w-1/2"
                  }`}
                >
                  {/* Cart Items Section */}
                  <div className="px-1 space-y-3">
                    {mode === "Exchange" ? (
                      <>
                        <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
                          {mode === "Exchange"
                            ? "Items to Exchange"
                            : "Items to Return"}
                        </h3>
                        <ReturnItemList
                          rows={rows}
                          decrementFetchQty={(id) => {
                            setRows((prev) =>
                              prev.map((item) =>
                                item.id === id
                                  ? {
                                      ...item,
                                      quantity: Math.max(item.quantity - 1, 0),
                                    }
                                  : item,
                              ),
                            );
                          }}
                          {...returnProps}
                        />

                        <h3 className="text-sm font-semibold text-gray-700 border-b pb-1 mt-4">
                          Items to Add
                        </h3>
                        <AddedItemList {...addedProps} />
                      </>
                    ) : (
                      <>
                        {activeReturnDisplay ? (
                          <>
                            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
                              Returned Items
                            </h3>
                            <ReturnItemList
                              rows={rows}
                              decrementFetchQty={(id) => {
                                setRows((prev) =>
                                  prev.map((item) =>
                                    item.id === id
                                      ? {
                                          ...item,
                                          quantity: Math.max(
                                            item.quantity - 1,
                                            0,
                                          ),
                                        }
                                      : item,
                                  ),
                                );
                              }}
                              {...returnProps}
                            />
                          </>
                        ) : (
                          <>
                            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
                              Purchased Items
                            </h3>
                            <AddedItemList {...addedProps} />
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4 mb-6">
                  <div className="flex justify-end mt-2 mb-4">
                    <div className="ml-6 flex space-x-4">
                      {/* Menu discount from the bottom */}
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
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent Menu auto-close
                            handleDiscountClick();
                          }}
                        >
                          <Icon fontSize="small">%</Icon> Discount
                        </MenuItem>
                      </Menu>

                      {/* Discount Modal On whole Amount */}
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
                              label={<span className="text-xl mr-2">AMT</span>}
                              value="amount"
                            />
                            <Tab
                              label={<PercentIcon className="mr-2" />}
                              value="Percentage"
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
                            {/* <Button
                        onClick={applyDiscount}
                        disabled={discountValue < 0}
                        color="primary"
                      > */}
                            Apply
                          </Button>
                        </DialogActions>
                      </Dialog>

                      {/* Salesman Dialog */}

                      {/* <Dialog
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
                              <li {...props}>{option.salesman_code}</li>
                            )}
                            // 🔥 This tells Autocomplete how to match selected item with options
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
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
                            onClick={() => applySalesmanItem(index)}
                            color="primary"
                          >
                            Submit
                          </Button>
                        </DialogActions>
                      </Dialog> */}
                    </div>
                  </div>
                  {/* Per-item Discount Modal */}
                  <Dialog open={openModalItem} onClose={handleCloseModalItem}>
                    <DialogTitle>Apply Discount / Item</DialogTitle>
                    <DialogContent>
                      <Tabs
                        value={
                          selectedItem[selectedIndex]?.discountTypeItem ||
                          "amount"
                        }
                        onChange={(e, newValue) =>
                          calculateDiscountItem(newValue, "type", selectedIndex)
                        }
                        centered
                      >
                        <Tab label="AMT" value="amount" />
                        <Tab label={<PercentIcon />} value="Percentage" />
                      </Tabs>

                      <TextField
                        type="number"
                        fullWidth
                        value={
                          selectedItem[selectedIndex]?.discountValueItem || ""
                        }
                        onChange={(e) =>
                          calculateDiscountItem(
                            e.target.value,
                            "value",
                            selectedIndex,
                          )
                        }
                        sx={{ mt: 2 }}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseModalItem} color="secondary">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => applyDiscountItem(selectedIndex)}
                        disabled={discountValue < 0}
                        color="primary"
                      >
                        Apply
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>

              {/* Bottom of the POS Screen */}

              <div className="fixed bottom-0 left-30 w-full bg-gray-200 rounded-t-md px-4 py-2 flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={!selectedItem?.length > 0}
                  className={`px-6 py-2 text-sm rounded text-white
                            ${
                              !selectedItem?.length > 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-gray-600"
                            }`}
                >
                  Cancel
                </button>

                {activeReturnDisplay && rows?.length > 0 ? (
                  <div className="flex justify-between items-center gap-4">
                    {mode === "Exchange" ? (
                      <>
                        <button
                          type="button"
                          onClick={handleExchangePayment}
                          className="px-6 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
                        >
                          Exchange
                        </button>
                        {(() => {
                          const {
                            returnTotal,
                            addTotal,
                            netTotal,
                            addVat,
                            returnVat,
                            netVat,
                          } = calculateExchangeTotals();

                          return (
                            <>
                              <p className="text-xs font-bold">
                                Return Total: {returnTotal.toFixed(2)}
                              </p>
                              <p className="text-xs font-bold">
                                Added Total: {addTotal.toFixed(2)}
                              </p>

                              <p className="text-xs font-bold">
                                Return VAT: {returnVat.toFixed(2)}
                              </p>
                              <p className="text-xs font-bold">
                                Added VAT: {addVat.toFixed(2)}
                              </p>
                              <p className="text-xs font-bold">
                                Net VAT: {netVat.toFixed(2)}
                              </p>
                              <p className="text-sm font-bold text-white bg-blue-500 rounded p-1">
                                Net Total: {netTotal.toFixed(2)}
                              </p>
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleReturnPayment}
                          className="px-6 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
                        >
                          Return
                        </button>

                        <p className="text-xs font-bold">
                          Total: {Number(sums.net).toFixed(2)}
                        </p>

                        <p className="text-xs font-bold">
                          Discount: {Number(sums.discountAmount).toFixed(2)}
                        </p>

                        <p className="text-xs font-bold">
                          {/* Vat: {Number(totalVat).toFixed(2)} */}
                          Vat: {Number(sums.vat).toFixed(2)}
                        </p>

                        <p className="text-sm font-bold text-white bg-blue-500 rounded p-1">
                          Net Total: {Number(sums.total).toFixed(2)}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handlePaymentOpen}
                      disabled={!selectedItem?.length > 0}
                      className={`px-6 py-2 text-sm rounded text-white
        ${
          !selectedItem?.length > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-gray-600"
        }`}
                    >
                      Payment
                    </button>
                    <IconButton onClick={handleClick}>
                      <Icon fontSize="small">more_vert</Icon>
                    </IconButton>
                  </>
                )}

                {selectedItem?.length > 0 && !activeReturnDisplay && (
                  <div className="flex justify-between items-center gap-4">
                    <p className="text-xs font-bold">
                      Grand Total: {Number(finalTotal).toFixed(2)}
                    </p>

                    {discountType === "amount" ? (
                      <p className="text-xs font-bold text-gray-500">
                        Discount: {Number(discountAmount).toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-gray-500">
                        Discount : {discountAmount}
                      </p>
                    )}
                    <p className="text-xs font-bold text-gray-500">
                      Discount Percent : {discountPercent} %
                    </p>

                    <p className="text-xs font-bold">
                      {/* Vat 5%: {Number((finalTotal * 5) / 100).toFixed(2)} */}
                      Vat : {totalVat}
                    </p>
                    <p className="text-sm font-bold text-white bg-blue-500 rounded p-1">
                      Net Total: {Number(finalTotalWithVat).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {paymentModal && (
                <PaymentModal
                  paymentModal={paymentModal}
                  paymentModalSource={paymentModalSource}
                  mode={mode}
                  sums={sums}
                  setPayments={setPayments}
                  finalTotalWithVat={finalTotalWithVat}
                  paidAmount={paidAmount}
                  // exchangeTotals={calculateExchangeTotals()}
                  exchangeTotals={
                    paymentModalSource === "exchange"
                      ? calculateExchangeTotals()
                      : null
                  } // ✅ conditional
                  totalReturnFund={totalReturnFund}
                  methodType={methodType}
                  setMethodType={setMethodType}
                  paymentAmount={paymentAmount}
                  setPaymentAmount={setPaymentAmount}
                  voucherNumber={voucherNumber}
                  setVoucherNumber={setVoucherNumber}
                  selectedCurrency={selectedCurrency}
                  setSelectedCurrency={setSelectedCurrency}
                  selectedCardType={selectedCardType}
                  setSelectedCardType={setSelectedCardType}
                  authCode={authCode}
                  setAuthCode={setAuthCode}
                  payments={payments}
                  getPaymentAmountByMethod={getPaymentAmountByMethod}
                  handleAddPayment={handleAddPayment}
                  handleRemovePayment={handleRemovePayment}
                  handleReturn={handleReturn}
                  handleSave={handleSave}
                  handleExchange={handleExchange}
                  handlePaymentClose={handlePaymentClose}
                  isSubmit={isSubmit}
                  isSubmitDisabled={isSubmitDisabled}
                  allPaymentsWithReturns={allPaymentsWithReturns}
                  filteredPayments={filteredPayments}
                />
              )}

              {openModal && (
                <CustomerModal
                  openModal={openModal}
                  formData={formData}
                  setFormData={setFormData}
                  formErrors={formErrors}
                  handleMobileChange={handleMobileChange}
                  handleModalClose={handleModalClose}
                  submitCustomerData={submitCustomerData}
                />
              )}

              {openDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <div
                    // ref={dialogRef}
                    className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-fadeIn"
                  >
                    {/* Heading */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Are you sure?
                    </h2>

                    {/* Sub Text */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      You've punched the item. If you're trying to leave or
                      cancel this screen, please choose one of the options
                      below.
                    </p>

                    {/* Small Label */}
                    <p className="mt-4 text-sm font-medium text-gray-700">
                      Select below action:
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={handleHold}
                        className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:opacity-90 transition"
                      >
                        Hold
                      </button>
                      <button
                        onClick={handleDiscard}
                        className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:opacity-90 transition"
                      >
                        Discard
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 transition"
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
        <Receipt
          ref={receiptRef}
          companyName={company}
          locationName={location}
          CreateInvoiceNumber={CreateInvoiceNumber}
          formData2={formData2}
          dispalyName={dispalyName}
          receiptItems={receiptItems}
          receiptData={receiptData}
          exchange={exchange}
          totalVat={totalVat}
          mode={mode}
        />

        {/* <KitchenReceipt
  ref={kitchenReceiptRef}
  companyName={companyName}
  locationName={locationName}
  CreateInvoiceNumber={CreateInvoiceNumber}
  formData2={formData2}
  dispalyName={dispalyName}
  receiptItems={receiptItems}
/> */}

        {/* // this is for the change the status of order by cashier side */}
        {showOrderStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
              <button
                onClick={() => setOrderStatus(false)}
                className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              >
                &times;
              </button>
              <CashierQueueStatus onClose={() => setOrderStatus(false)} />
            </div>
          </div>
        )}
      </div>

      {addNewItem && (
        <AddNewItem open={addNewItem} onClose={() => setAddNewItem(false)} />
      )}
    </DashboardLayout>
  );
};

export default Pos1;
