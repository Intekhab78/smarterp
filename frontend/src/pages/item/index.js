import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { axios_post } from "../../axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MDBadge from "components/MDBadge";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Autocomplete, DialogContentText, TextField } from "@mui/material";
import { Grid, CircularProgress } from "@mui/material";

import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { ToastMassage } from "toast";
import jsPDF from "jspdf";
import { useMemo } from "react";
import MDInput from "components/MDInput";
import AddButtonHeader from "components/AddButtonHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

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

export default function item() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const [opened, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClosed = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [data, setData] = useState([]);
  const [dialogbox, setdialogbox] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [orderData, setorderData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // DataGrid is 0-based
  const [pageSize, setPageSize] = useState(10);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // 0-based
    pageSize: 10, // default
  });

  const [totalRows, setTotalRows] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formData, setFormData] = useState({
    module: "Item",
    action: "",
    ids: "",
  });

  const handleClickOpened = (orderData) => {
    setorderData(orderData);
    setdialogbox(true);
  };
  const handleClosing = () => {
    setdialogbox(false);
    setActionpen(false);
    setInactiveopen(false);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleClickactionOpen = () => {
    setActionpen(true);
  };
  const handleClickinactiveOpen = () => {
    setInactiveopen(true);
  };

  const [anchor, setAnchor] = useState(null);
  const opening = Boolean(anchor);

  const handleClickaction = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleclosedd = () => {
    setAnchor(null);
  };

  const handleselection = (ids) => {
    var selectedrow = ids.map((id) => data.find((row) => row.id === id));
    let newUUID = [];
    selectedrow.map((data, keys) => {
      newUUID.push(data.uuid);
    });
    setSelectedUUID(newUUID);
  };

  const handleActiveModalSubmit = async (status) => {
    setActionpen(false);
    setdialogbox(false);
    setInactiveopen(false);

    formData.ids = SelectedUUID;
    formData.action = status;

    const response = await axios
      .post("global/bulk-action", formData)
      .then((response) => {
        getdetails();
        if (status == "active") {
          toast.success("Mark as Active Successfully");
        } else {
          toast.success("Mark as Inactive Successfully");
        }
        setInactiveopen(false);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [posFilter, setPosFilter] = useState({
    company_id: null,
    location_id: null,
  });
  // console.log("Selected company ID:", posFilter.company_id);
  // console.log("Selected location ID:", posFilter.location_id);
  useEffect(() => {
    // if (posFilter.company_id && posFilter.location_id) {
    // Make API call or filter data based on selected company & location
    // fetchData(posFilter.company_id, posFilter.location_id);
    console.log("Selected company ID:", posFilter.company_id);
    console.log("Selected location ID:", posFilter.location_id);
    // }
  }, [posFilter]);

  const getdetails = async (model = paginationModel) => {
    try {
      setLoading(true);

      const response = await axios_post(true, "item/pagination_list", {
        page: model.page + 1,
        limit: model.pageSize,
        // company_id: selectedCompanyId,
        // location_id: selectedCompanyId,
        // company_id: 15,
        // location_id: 16,
        search: debouncedSearch, // 🔥 SEND SEARCH
      });

      if (response?.status) {
        setData(
          response.data.records.map((item) => ({
            ...item,
            id: item.uuid,
          })),
        );

        setTotalRows(response.data.pagination.totalRecords);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdetails(paginationModel);
  }, [paginationModel]);

  useEffect(() => {
    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
  }, [debouncedSearch]);

  const handleBarCode = async () => {
    if (!SelectedUUID || SelectedUUID.length === 0) {
      alert("Please select at least one item to print.");
      return;
    }

    const itemsToPrint = data.filter((item) => SelectedUUID.includes(item.id));

    if (itemsToPrint.length === 0) {
      alert("No matching items found for printing.");
      return;
    }

    const truncateText = (text, maxLength = 20) => {
      if (!text) return "";
      return text.length > maxLength
        ? text.substring(0, maxLength - 3) + "..."
        : text;
    };

    setLoading(true); // start loader
    try {
      for (const item of itemsToPrint) {
        let zpl = "^XA";
        zpl += `
        ^FO0,20               
        ^FB250,1,0,C,0         
        ^A0N,18,18
        ^FD${truncateText(item.item_name, 20)}^FS     

        ^FO0,45         
        ^FB250,1,0,C,0         
        ^A0N,18,18
        ^FD${item.itemprice}^FS     

        ^FO30,75        
        ^BY2
        ^BCN,60,Y,N,N
        ^FD${item.itemupc}^FS
      `;
        zpl += "^XZ";

        await fetch(
          "https://api.labelary.com/v1/printers/8dpmm/labels/1.18x0.79/0/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "image/png",
            },
            body: zpl,
          },
        )
          .then((res) => res.blob())
          .then((blob) => {
            const imgURL = URL.createObjectURL(blob);
            window.open(imgURL);
          });
      }
    } catch (err) {
      console.error("Error previewing:", err);
    } finally {
      setLoading(false); // stop loader
    }
  };

  const handlePrintToZebra1 = (itemId = null) => {
    let itemsToPrint = [];

    if (itemId) {
      const item = data.find((i) => i.id === itemId);
      if (!item) {
        alert("Item not found");
        return;
      }
      itemsToPrint = [item];
    } else {
      if (selectedItems.length === 0) {
        alert("Please select at least one item to print.");
        return;
      }
      itemsToPrint = data.filter((i) => selectedItems.includes(i.id));
    }

    let y = 20; // start a little lower
    let zpl = "^XA";
    itemsToPrint.forEach((item) => {
      zpl += `
      ^FO0,${y}               
      ^FB300,1,0,C,0          // Center any text in full width
      ^A0N,18,18
      ^FD${""}^FS   

      ^FO30,${y + 25}         // Barcode shifted 50 dots for perfect center
      ^BY2
      ^BCN,60,Y,N,N
      ^FD${item.itemupc}^FS
    `;
      y += 120;
    });
    zpl += "^XZ";

    // ✅ label size 3×2 cm (1.18x0.79 inches)
    fetch("https://api.labelary.com/v1/printers/8dpmm/labels/1.18x0.79/0/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "image/png",
      },
      body: zpl,
    })
      .then((res) => res.blob())
      .then((blob) => {
        const imgURL = URL.createObjectURL(blob);
        window.open(imgURL);
      })
      .catch((err) => console.error("Error previewing:", err));
  };

  const handlePrintToZebra = (itemId = null) => {
    let itemsToPrint = [];

    if (itemId) {
      const item = data.find((i) => i.id === itemId);
      if (!item) {
        alert("Item not found");
        return;
      }
      itemsToPrint = [item];
    } else {
      if (selectedItems.length === 0) {
        alert("Please select at least one item to print.");
        return;
      }
      itemsToPrint = data.filter((i) => selectedItems.includes(i.id));
    }

    const truncateText = (text, maxLength = 20) => {
      if (!text) return "";
      return text.length > maxLength
        ? text.substring(0, maxLength - 3) + "..."
        : text;
    };

    let y = 20;
    let zpl = "^XA";
    itemsToPrint.forEach((item) => {
      zpl += `
      ^FO0,${y}               
      ^FB250,1,0,C,0         
      ^A0N,18,18
      ^FD${truncateText(item.item_name, 20)}^FS     

      ^FO0,${y + 25}         
      ^FB250,1,0,C,0         
      ^A0N,18,18
      ^FD${item.itemprice}^FS     

      ^FO30,${y + 55}        
      ^BY2
      ^BCN,60,Y,N,N
      ^FD${item.itemupc}^FS
    `;
      y += 150;
    });
    zpl += "^XZ";

    // ✅ Preview
    fetch("https://api.labelary.com/v1/printers/8dpmm/labels/1.18x0.79/0/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "image/png",
      },
      body: zpl,
    })
      .then((res) => res.blob())
      .then((blob) => {
        const imgURL = URL.createObjectURL(blob);
        window.open(imgURL);
      })
      .catch((err) => console.error("Error previewing:", err));
  };

  const handleEdit = (id, type) => {
    if (type === "edit") {
      navigate(`/item/edit/${id}`);
    } else if (type === "view") {
      navigate(`/item/view/${id}`);
    } else if (type === "barcode") {
      handlePrintToZebra(id);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    const { id } = orderData;
    setIsDeleting(true);
    try {
      const response = await axios_post(true, "item/delete", {
        id: id,
      });
      if (response.status === true) {
        getdetails();
        ToastMassage(response.message, "success");
        handleCloseDeleteModal();
        setorderData({});
        setdialogbox(false);
        setIsDeleting(false);
      } else {
        ToastMassage(response.message, "error");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    getdetails();
  }, []);

  const getMRPWithTax = (row) => {
    const price = Number(row?.itemprice || 0);
    const taxPercent = Number(row?.tax_master_1?.taxcal || 0);

    return Math.round(price + (price * taxPercent) / 100);
  };

  const columns = [
    {
      field: "created_at",
      headerName: "DATE",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) =>
        moment(params?.value).format("DD MMM YYYY hh:mm A"),
    },
    {
      field: "itemupc",
      headerName: "UPC",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "item_name",
      headerName: "NAME",
      width: 300,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.item_name,
    },
    // {
    //   field: "name",
    //   headerName: "UOM",
    //   width: 100,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     const itemMainPrices = params?.row?.item_main_prices;
    //     if (itemMainPrices && itemMainPrices.length > 0) {
    //       return itemMainPrices[0].item_uom?.name || "";
    //     }
    //     return "";
    //   },
    // },
    {
      field: "itemcost",
      headerName: "ITEM COST",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.itemcost,
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const mrpWithTax = getMRPWithTax(params.row);

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{mrpWithTax}</span>
            {/* <FaEdit
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => handleEditClick(params.row)}
            /> */}
          </div>
        );
      },
    },
    {
      field: "stock",
      headerName: "Total Stock",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.stock,
    },
    {
      field: "distributed_stock",
      headerName: "Trn Stock",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.distributed_stock,
    },
    {
      field: "remaining_stock",
      headerName: "Avl Stock",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <span style={{ color: "green", fontWeight: 600 }}>
          {params.row.remaining_stock}
        </span>
      ),
    },
    {
      field: "itemcatname",
      headerName: "Item Category",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.itemcategory?.itemcatname,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);

        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorEl(null);
        };
        return (
          <>
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
              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "edit");
                  console.log("id is", params.row.id);
                }}
              >
                <Icon fontSize="small">edit</Icon> Edit
              </MenuItem>

              {/* <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "barcode");
                  console.log("id is", params.row.id);
                }}
              >
                <Icon fontSize="small">edit</Icon> Generate barcode
              </MenuItem> */}

              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "view");
                }}
              >
                <Icon fontSize="small">visibility</Icon> View
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleClickOpened(params.row);
                }}
              >
                <Icon fontSize="small">delete</Icon> Delete
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // const filteredRows = useMemo(() => {
  //   return data.filter((row) => {
  //     const itemCodeMatch = row.item_code;
  //     const itemNameMatch = row.item_name;
  //     return (
  //       itemCodeMatch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       itemNameMatch?.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   });
  // }, [searchTerm]);

  const [importPopup, setImportPopup] = useState(false);
  const [file, setFile] = useState(null);

  const openImportPopup = () => {
    setImportPopup(true);
  };

  const handleImportClose = () => {
    setImportPopup(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBulkSubmit = async () => {
    if (excelData.length === 0) {
      alert("Please upload a valid Excel file first.");
      return;
    }
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/item/store-bulk`,
        excelData,
        { headers: { "Content-Type": "application/json" } },
      );

      // ✅ FIX: use "status" instead of "success"
      if (response.data.status && response.data.inserted > 0) {
        ToastMassage("Bulk items uploaded successfully", "success");
      } else if (response.data.status && response.data.inserted === 0) {
        const skippedNames = response.data.skippedItems
          .map((item) => `${item.item_name}: ${item.reason}`)
          .join(", ");

        ToastMassage(
          `All items were skipped. Nothing was uploaded. Reason(s): ${skippedNames}`,
          "warning",
        );
      } else {
        ToastMassage("Some error occurred during upload", "error");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      ToastMassage("Upload failed", "error");
    }
  };

  const importSuppliers = async () => {
    if (!file) {
      toast.error("Please select an Excel file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${constantApi.baseUrl}/supplier/import`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        const inserted = data.data.inserted || 0;
        const duplicates = data.data.duplicates || [];

        toast.success(`Imported ${inserted} suppliers`);
        if (duplicates.length > 0) {
          toast.info(`Duplicate emails skipped: ${duplicates.join(", ")}`);
        }
        setAnchorEl(null);
      } else {
        toast.error(data.message || "Import failed");
      }
    } catch (err) {
      toast.error("Import failed");
      console.error(err);
    }
  };

  const handleExportData = () => {
    if (!data || data.length === 0) return;

    const exportData = data.map((item) => ({
      code: item.item_code || "",
      item_name: item.item_name || "",
      uom: item.item_main_prices?.[0]?.item_uom?.name || "",
      company_id: item.company_id || "",
      location_id: item.location_id || "",
      price: item.item_vat_percentage || "",
      stock: item.stock || "",
      tax: item.item_tax || "",
      rate: item.rate || "",
      itemcatname: item.itemcatname || "",
      brandname: item.brandname || "",
      hsncode: item.hsncode || "",
      itemcost: item.itemcost || "",
      itemprice: item.itemprice || "",
      status: item.status === 1 ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "BulkItemsTemplate.xlsx");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Dialog
        open={dialogbox}
        onClose={handleClosing}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Do you really want to delete this {orderData.item_code} Item ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosing} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* <AddButtonHeader title="All Items" buttonText="New" buttonAction="/master/item" /> */}
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
                <Grid container spacing={1}>
                  <Grid item xs={2} mr={40}>
                    <MDTypography variant="h6" color="white">
                      <Icon fontSize="small">person</Icon>
                      Item
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/item">
                      <MDButton variant="gradient" color="light">
                        &#x2b;&nbsp;New
                      </MDButton>
                    </MDTypography>
                  </Grid>
                  {SelectedUUID == "" ? (
                    ""
                  ) : (
                    <>
                      <Grid item xs={1} ml={5}>
                        <MDBox>
                          <MDButton
                            className="Generate-Barcode"
                            aria-haspopup="true"
                            onClick={handleBarCode}
                            variant="gradient"
                            color="light"
                            disabled={loading} // disable button when loading
                          >
                            {loading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "Generate Barcode"
                            )}
                          </MDButton>
                        </MDBox>
                      </Grid>

                      <Grid item xs={1} ml={5}>
                        <MDBox>
                          <MDButton
                            className="bulk-button"
                            aria-haspopup="true"
                            onClick={handleClickaction}
                            variant="gradient"
                            color="light"
                          >
                            Bulk Actions
                          </MDButton>
                        </MDBox>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={1}>
                    <MDBox>
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        // aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        // aria-expanded={open ? 'true' : undefined}
                      >
                        <Icon fontSize="small">menu</Icon>
                      </IconButton>
                    </MDBox>
                  </Grid>
                </Grid>
                <Menu
                  anchorEl={anchor}
                  id="account-menu"
                  open={opening}
                  onClose={handleclosedd}
                  onClick={handleclosedd}
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
                  <MenuItem onClick={handleClickactionOpen}>
                    Mark as Active
                  </MenuItem>
                  <MenuItem onClick={handleClickinactiveOpen}>
                    Mark as Inactive
                  </MenuItem>
                </Menu>
                <Dialog
                  className="dialogbox"
                  open={actionopen}
                  onClose={handleClosing}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <Icon className="icon-round" fontSize="larger" color="error">
                    error
                  </Icon>
                  <DialogContent dividers className="dialog-content">
                    <Typography gutterBottom style={{ fontSize: "20" }}>
                      Are you sure want to mark as active selected Records
                    </Typography>
                  </DialogContent>
                  <DialogActions className="Dialog-Actions">
                    <Button autoFocus onClick={handleClosing}>
                      No, mistake!
                    </Button>
                    <Button
                      autoFocus
                      onClick={(e) => handleActiveModalSubmit("active")}
                    >
                      Yes, mark as active !
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  className="dialogbox"
                  open={inactiveopen}
                  onClose={handleClosing}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <Icon className="icon-round" fontSize="larger" color="error">
                    error
                  </Icon>
                  <DialogContent dividers className="dialog-content">
                    <Typography gutterBottom style={{ fontSize: "20" }}>
                      Are you sure want to mark as inactive selected Records
                    </Typography>
                  </DialogContent>
                  <DialogActions className="Dialog-Actions">
                    <Button autoFocus onClick={handleClosing}>
                      No, mistake!
                    </Button>
                    <Button
                      autoFocus
                      onClick={(e) => handleActiveModalSubmit("inactive")}
                    >
                      Yes, mark as inactive !
                    </Button>
                  </DialogActions>
                </Dialog>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  // onClick={handleClose}
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
                  <MenuItem onClick={openImportPopup}>Import</MenuItem>

                  <BootstrapDialog
                    onClose={handleImportClose}
                    aria-labelledby="customized-dialog-title"
                    open={importPopup} // use importPopup instead of opened
                  >
                    <BootstrapDialogTitle
                      id="customized-dialog-title"
                      onClose={handleImportClose}
                    >
                      Import Items
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                      <MDTypography style={{ fontSize: 17 }} gutterBottom>
                        Select an Excel (.xlsx) file to import Items data.
                      </MDTypography>

                      <MDBox mt={2}>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileChange}
                        />
                      </MDBox>
                    </DialogContent>

                    <DialogActions>
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleBulkSubmit}
                      >
                        Import
                      </MDButton>
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleImportClose}
                      >
                        Cancel
                      </MDButton>
                    </DialogActions>
                  </BootstrapDialog>

                  {/* this is directly export the data in excell */}
                  <MenuItem onClick={handleExportData}>Export</MenuItem>

                  {/* this below code is use for export the data in different format but its not working */}
                  {/* <MenuItem onClick={handleClickOpen}>Export</MenuItem> */}
                  <BootstrapDialog
                    onClose={handleClosed}
                    aria-labelledby="customized-dialog-title"
                    open={opened}
                  >
                    <BootstrapDialogTitle
                      id="customized-dialog-title"
                      onClose={handleClosed}
                    >
                      Export
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                      <MDTypography style={{ fontSize: 17 }} gutterBottom>
                        {/* Order Display can export data from Invoice in CSV or XLS format. */}
                      </MDTypography>
                      <MDBox>
                        <hr></hr>
                      </MDBox>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue=""
                        value={selectedValue}
                        onChange={handleChanged}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="auto"
                          control={<Radio />}
                          label=" Order"
                        />
                        <FormControlLabel
                          value="add"
                          control={<Radio />}
                          label="Specific Order"
                        />
                        {selectedValue === "add" && (
                          <>
                            <Grid
                              container
                              rowSpacing={2}
                              columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                            >
                              <Grid item xs={4}>
                                <TextField
                                  type="date"
                                  label="From"
                                  sx={{ width: 150 }}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  type="date"
                                  label="To"
                                  sx={{ width: 150 }}
                                />
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </RadioGroup>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue=""
                        name="radio-buttons-group"
                      >
                        <FormLabel id="demo-radio-buttons-group-label">
                          Export As :
                        </FormLabel>
                        <FormControlLabel
                          value="csv"
                          control={<Radio />}
                          label="CSV (Comma Separated Value)"
                        />
                        <FormControlLabel
                          value="xls"
                          control={<Radio />}
                          label="XLS (Microsoft Excel Compatible)"
                        />
                      </RadioGroup>
                    </DialogContent>
                    <DialogActions>
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleClosed}
                      >
                        Export
                      </MDButton>
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleClosed}
                      >
                        Cancel
                      </MDButton>
                    </DialogActions>
                  </BootstrapDialog>
                </Menu>
              </MDBox>
              <MDBox pr={1} sx={{ textAlign: "Right" }}>
                <MDInput
                  type="text"
                  // label="Order Number"
                  variant="outlined"
                  name="order_number"
                  sx={{ width: 300 }}
                  margin="normal"
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </MDBox>

              <MDBox pt={3}>
                {/* <DataGrid
                  localeText={{ noRowsLabel: "No records" }}
                  autoHeight
                  loading={loading}
                  rows={searchTerm != "" ? filteredRows : data}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 20]}
                  checkboxSelection
                  onRowSelectionModelChange={(ids) => handleselection(ids)}
                  disableRowSelectionOnClick
                  slotProps={{
                    columnMenu: {
                      sx: {
                        "& .MuiDataGrid-menuList": {
                          minWidth: "200px", // Set the minimum width for the menu list
                        },
                        "& .MuiMenuItem-root .MuiTypography-root": {
                          fontSize: "14px", // Apply the specific style to the MenuItem within DataGrid
                        },
                      },
                    },
                  }}
                /> */}
                <DataGrid
                  autoHeight
                  loading={loading}
                  rows={data}
                  columns={columns}
                  paginationMode="server"
                  rowCount={totalRows}
                  paginationModel={paginationModel}
                  onPaginationModelChange={(model) => setPaginationModel(model)}
                  pageSizeOptions={[10, 15, 20]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  localeText={{ noRowsLabel: "No records" }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
