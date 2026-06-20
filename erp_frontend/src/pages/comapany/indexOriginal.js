import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios, { axios_post } from "../../axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
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
import {
  Autocomplete,
  DialogContentText,
  InputLabel,
  TextField,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { ToastMassage } from "toast";
import jsPDF from "jspdf";
import MDInput from "components/MDInput";
import { convertToWords } from "components/Number";

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

export default function comapany() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);

  let user_data = JSON.parse(localStorage.getItem("user_data"));
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
  const [formData, setFormData] = useState({
    module: "Order",
    action: "",
    ids: "",
  });

  const handleClickOpened = (orderData, invoice) => {
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
      newUUID.push(data?.uuid);
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

  const getdetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "company/list");
    if (response) {
      if (response.status) {
        const records = response?.data?.records;
        setData(response?.data?.records);
        console.log("compnay list is ", response?.data?.records);

        setLoading(false);
      } else {
        ToastMassage(response.message, "error");
        setLoading(false);
      }
    }
  };
  const handleEdit = (id, type, invoiceNumber, invoice) => {
    if (type === "edit") {
      navigate(`/master/company/edit/${id}`);
    } else if (type === "view") {
      navigate(`/master/company/view/${id}`);
    }
  };

  const invoiceget = localStorage.getItem("usertype");
  const handleGenerateInvoice = (id, type, invoiceNumber, invoice) => {
    if (type === "generate_invoice") {
      if (invoice === null) {
        navigate(`/company/generate_invoice/${id}`);
      } else {
        ToastMassage(
          "Invoice Generated, Can not be generate invoice, generate new Order."
        );
      }
    }
  };
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (invoiceNumber) => {
    const { id } = orderData;
    setIsDeleting(true);
    try {
      const response = await axios_post(true, "company/delete", {
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

  // Build a map id -> compdesc for quick lookups (main company name)
  const companyMap = useMemo(() => {
    const map = {};
    (data || []).forEach((c) => {
      if (c?.id) map[c.id] = c.compdesc || "";
    });
    return map;
  }, [data]);

  // helper to get main company name
  const getMainCompanyName = (row) => {
    if (!row) return "";
    const mainId = row.main_company_id;
    // sometimes main_company_id may be empty string; normalize to number if possible
    if (!mainId && mainId !== 0) return "";
    // if mainId is numeric or string numeric see in map
    return companyMap[mainId] || "";
  };

  const getLocationString = (row) => {
    const loc =
      row?.location && row.location.length > 0 ? row.location[0] : null;
    if (!loc) return "";
    const name = loc.locname || loc.locdesclong || "";
    const code = loc.loccode || "";
    return code ? `${name} (${code})` : name;
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

    // Main Company (resolve from main_company_id)
    {
      field: "main_company",
      headerName: "Main Company",
      width: 220,
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) => getMainCompanyName(params.row),
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ fontWeight: 500 }}>{params.value}</div>
          ) : (
            <div style={{ color: "#999", fontStyle: "italic" }}>—</div>
          )}
        </div>
      ),
    },

    // New: Company Name explicit (uses compdesc but wider)
    {
      field: "company_name",
      headerName: "Company Name",
      width: 260,
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) => params.row?.compdesc || "",
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* small logo if present */}
          {params.row?.clogo ? (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL || ""}/uploads/${
                params.row.clogo
              }`}
              alt="logo"
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                objectFit: "cover",
              }}
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : null}
          <div>
            <div style={{ fontWeight: 600 }}>{params.value}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {params.row?.compcode || ""}
            </div>
          </div>
        </div>
      ),
    },

    {
      field: "location_code",
      headerName: "Location (Code)",
      width: 220,
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) => getLocationString(params.row),
      renderCell: (params) => (
        <div style={{ fontSize: 14 }}>{params.value}</div>
      ),
    },
    {
      field: "ctaxnumber",
      headerName: "Tax No",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "clicense",
      headerName: "License no",
      width: 120,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) =>
        params?.row?.status === 1 ? "Active" : "Inactive",
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
                  handleEdit(
                    params.row.id,
                    "edit",
                    params.row.invoice?.invoice_number,
                    params.row.invoice
                  );
                }}
              >
                <Icon fontSize="small">edit</Icon> Edit
              </MenuItem>
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
                  handleClickOpened(params.row, params.row.invoice);
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

  const [searchTerm, setSearchTerm] = useState("");

  // Memoized function to filter rows based on search term (now includes main company and location)
  const filteredRows = useMemo(() => {
    const term = searchTerm?.toLowerCase?.() || "";
    if (!term) return data;
    return data.filter((row) => {
      const tax = row.ctaxnumber || "";
      const name = row.compdesc || "";
      const mainCompanyName = getMainCompanyName(row) || "";
      const locationString = getLocationString(row) || "";
      return (
        tax.toLowerCase().includes(term) ||
        name.toLowerCase().includes(term) ||
        mainCompanyName.toLowerCase().includes(term) ||
        locationString.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, data, companyMap]);

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
            Do you really want to delete this {orderData.order_number} Comapany?
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
                      Companies
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/company">
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
                        aria-haspopup="true"
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
                  <MenuItem onClick={handleClose}>Import </MenuItem>
                  <MenuItem onClick={handleClickOpen}>Export </MenuItem>
                  <BootstrapDialog
                    onClose={handleClosed}
                    aria-labelledby="customized-dialog-title"
                    open={opened}
                  >
                    <BootstrapDialogTitle
                      id="customized-dialog-title"
                      onClose={handleClosed}
                    >
                      Export Order
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                      <MDTypography style={{ fontSize: 17 }} gutterBottom>
                        Order Display can export data from Invoice in CSV or XLS
                        format.
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
                  variant="outlined"
                  name="order_number"
                  sx={{ width: 300 }}
                  margin="normal"
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </MDBox>
              <MDBox pt={3}>
                <DataGrid
                  autoHeight
                  loading={loading}
                  rows={searchTerm != "" ? filteredRows : data}
                  getRowId={(row) => row.id}
                  localeText={{
                    noRowsLabel: "No records",
                  }}
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
                          minWidth: "200px",
                        },
                        "& .MuiMenuItem-root .MuiTypography-root": {
                          fontSize: "14px",
                        },
                      },
                    },
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
