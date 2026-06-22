import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../axios";
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
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

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

const rows = [
  {
    id: 1,
    date: "",
    trip: "",
    salesman: "",
    salesman_code: "",
    load_no: "",
    load_type: "",
    route_name: "",
    route_code: "",
    approval: "",
    status: "",
    erp_status: "",
    action: "",
    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

export default function Load_Request() {
  const [selectedValue, setSelectedValue] = useState("");
  const [data, setData] = useState([]);
  const [dialogbox, setdialogbox] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [countryData, setcountryData] = useState({});
  const [formData, setFormData] = useState({
    module: "LoadRequest",
    action: "",
    ids: "",
  });
  const handleClickOpened = (countryData) => {
    setcountryData(countryData);
    setdialogbox(true);
  };
  const handleClosing = () => {
    setdialogbox(false);
    setActionpen(false);
    setInactiveopen(false);
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

   const handleDelete = async () => {
    const { id } = orderData;
    setIsDeleting(true)

    const { uuid } = countryData;
    setdialogbox(false);
    await axios
      .get("loadrequest/delete/" + uuid)
      .then((response) => {
        getdetails();
        toast.success("Data delete successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getdetails = () => {
    const response = axios
      .post("loadrequest/list")
      .then((response) => {
        const { data } = response?.data;
        setData(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    getdetails();
  }, []);

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    {
      field: "created_at",
      headerName: "DATE",
      width: 200,
      // valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY hh:mm A"),
      renderCell: (params) => moment(params?.value).format("DD MMM YYYY hh:mm A"),
    },
    { field: "trip_id", headerName: "TRIP", width: 130 },
    {
      field: "salesman",
      headerName: "SALESMAN",
      width: 130,
      renderCell: (params) => params?.value?.firstname + " " + params?.value?.lastname + " ",
    },
    {
      field: "salesman_code",
      headerName: "SALESMAN CODE",
      width: 130,
      renderCell: (params) => params?.row?.salesman?.salesman_info?.salesman_code + " ",
    },
    { field: "load_number", headerName: "LOAD NO.", width: 130 },
    { field: "load_type", headerName: "LOAD TYPE", width: 130 },
    {
      field: "route_name",
      headerName: "ROUTE NAME",
      width: 130,
      renderCell: (params) => params?.row?.route?.route_name + " ",
    },
    {
      field: "route_code",
      headerName: "ROUTE CODE",
      width: 130,
      renderCell: (params) => params?.row?.route?.route_code + " ",
    },
    { field: "current_stage", headerName: "APPROVAL", width: 130 },
    { field: "approval_status", headerName: "STATUS", width: 130 },
    {
      field: "erp_status",
      headerName: "ERP STATUS",
      width: 130,
      renderCell: (params) => {
        const erpStatus = params.row.erp_status;

        if (erpStatus === "Pass") {
          return "Posted";
        } else if (erpStatus === "Fail") {
          return "Failed";
        } else {
          return "Not Posted";
        }
      },
      // renderCell: (params) => (params.row.erp_status === null ? "Not Posted" : ""),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <MDButton
          variant="text"
          color="info"
          component={Link}
          to="/load-request/edit"
          // onClick={() => handleRemoveRow(params.rowIndex)}
        >
          <Icon fontSize="small">edit</Icon>
        </MDButton>
      ),
    },
    {
      width: 100,
      renderCell: (params) => (
        <>
          <MDBox>
            <MDButton variant="text" color="info" onClick={(e) => handleClickOpened(params.row)}>
              <Icon fontSize="small">delete</Icon>
            </MDButton>
          </MDBox>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Dialog
        className="dialogbox"
        open={dialogbox}
        onClose={handleClosing}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Icon className="icon-round" fontSize="larger">
          error
        </Icon>
        <DialogContent className="dialog-content">
          <Typography gutterBottom style={{ fontSize: "20" }}>
            Are you sure want to delete this record {countryData.load_type}??
          </Typography>
        </DialogContent>
        <DialogActions className="Dialog-Actions">
          <Button autoFocus onClick={handleClosing}>
            Cancel
          </Button>
          <Button autoFocus onClick={handledelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <MDBox pt={6} pb={3}>
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
                      {/* <Icon fontSize="small">shopping_bag</Icon> */}
                      Load Request
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/load-request/add">
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
                    <MenuItem onClick={handleClickactionOpen}>Mark as Active</MenuItem>
                    <MenuItem onClick={handleClickinactiveOpen}>Mark as Inactive</MenuItem>
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
                      <Button autoFocus onClick={(e) => handleActiveModalSubmit("active")}>
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
                      <Button autoFocus onClick={(e) => handleActiveModalSubmit("inactive")}>
                        Yes, mark as inactive !
                      </Button>
                    </DialogActions>
                  </Dialog>
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
                  <MenuItem onClick={handleClose}>Import Load Request</MenuItem>
                  <MenuItem onClick={handleClickOpen}>Export Load Request</MenuItem>
                  <BootstrapDialog
                    onClose={handleClosed}
                    aria-labelledby="customized-dialog-title"
                    open={opened}
                  >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClosed}>
                      Export Load Request
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                      <MDTypography style={{ fontSize: 17 }} gutterBottom>
                        Load Request Display can export data from Load Request in CSV or XLS format.
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
                          label=" Load Request"
                        />
                        <FormControlLabel
                          value="add"
                          control={<Radio />}
                          label="Specific Load Request"
                        />
                        {selectedValue === "add" && (
                          <>
                            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                              <Grid item xs={4}>
                                <TextField type="date" label="From" sx={{ width: 150 }} />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField type="date" label="To" sx={{ width: 150 }} />
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
                        <FormLabel id="demo-radio-buttons-group-label">Export As :</FormLabel>
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
                      <MDButton variant="text" color="info" autoFocus onClick={handleClosed}>
                        Export
                      </MDButton>
                      <MDButton variant="text" color="info" autoFocus onClick={handleClosed}>
                        Cancel
                      </MDButton>
                    </DialogActions>
                  </BootstrapDialog>
                </Menu>
              </MDBox>
              <MDBox pt={3}>
                <DataGrid
            localeText={{noRowsLabel: "No records", }}
                  rows={data}
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
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
