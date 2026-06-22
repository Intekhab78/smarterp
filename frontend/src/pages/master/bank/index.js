import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../../axios";
import DeleteIcon from "@mui/icons-material/Delete";

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import IconButton from "@mui/material/IconButton";
// import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import "./style.css";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Typography from "@mui/material/Typography";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            color: (theme) => theme.palette.transfernt[100],
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
    bank_code: "BAN001",
    bank_name: "Test Bank",
    account_number: "51234882",
    bank_address: "Dubai",
    status: "Active",
    actions: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

function Bank() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [bankData, setbankData] = useState({});
  const [formData, setFormData] = useState({
    module: "BankInformation",
    action: "",
    ids: "",
  });

  const handleClickOpen = (bankData) => {
    setbankData(bankData);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setActionpen(false);
    setInactiveopen(false);
  };
  const handleClickactionOpen = () => {
    setActionpen(true);
  };
  const handleClickinactiveOpen = () => {
    setInactiveopen(true);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const opened = Boolean(anchorEl);

  const handleClickaction = (event) => {
    setAnchorEl(event.currentTarget);
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

  const handleClosed = () => {
    setAnchorEl(null);
  };
   const handleDelete = async () => {
    const { id } = orderData;
    setIsDeleting(true)

    const { uuid } = bankData;
    setOpen(false);
    await axios
      .get("bank-information/delete/" + uuid)
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
      .get("bank-information/list")
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
    // { field: "id", headerName: "ID", width: 90 },
    { field: "bank_code", headerName: "BANK CODE", width: 160 },
    { field: "bank_name", headerName: "BANK NAME", width: 160 },
    { field: "account_number", headerName: "ACCOUNT NUMBER", width: 170 },
    {
      field: "bank_address",
      headerName: "BANK ADDRESS",
      width: 170,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (params.row.status === 1 ? "Active" : "Inactive"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <MDButton
          variant="text"
          color="info"
          component={Link}
          to={`/master/bank/edit/${params.row.uuid}`}
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
            <MDButton variant="text" color="info" onClick={(e) => handleClickOpen(params.row)}>
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
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Icon className="icon-round" fontSize="larger">
          error
        </Icon>

        <DialogContent className="dialog-content">
          <Typography gutterBottom style={{ fontSize: "20" }}>
            Are you sure want to delete this record {bankData.bank_name}??
          </Typography>
        </DialogContent>
        <DialogActions className="Dialog-Actions">
          <Button autoFocus onClick={handleClose}>
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
                      <Icon fontSize="small">account_balance</Icon>
                      Bank
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={30}>
                    <MDTypography component={Link} to="/master/bank">
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
                </Grid>

                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={opened}
                  onClose={handleClosed}
                  onClick={handleClosed}
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
                  onClose={handleClose}
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
                    <Button autoFocus onClick={handleClose}>
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
                  onClose={handleClose}
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
                    <Button autoFocus onClick={handleClose}>
                      No, mistake!
                    </Button>
                    <Button autoFocus onClick={(e) => handleActiveModalSubmit("inactive")}>
                      Yes, mark as inactive !
                    </Button>
                  </DialogActions>
                </Dialog>
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

export default Bank;
