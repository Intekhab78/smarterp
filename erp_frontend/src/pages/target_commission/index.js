import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const rows = [
  {
    id: 1,
    name: "",
    start_date: "",
    end_date: "",
    status: "",
    action: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

export default function Target_Commission() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [itemgroupData, setitemgroupData] = useState({});
  const [formData, setFormData] = useState({
    module: "SalesTarget",
    action: "",
    ids: "",
  });

  const handleClickOpen = (itemgroupData) => {
    setitemgroupData(itemgroupData);
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

  useEffect(() => {
    const response = axios
      .post("salestarget/list")
      .then((response) => {
        var { data } = response?.data;
        setData(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "TargetName", headerName: "NAME", width: 200 },
    { field: "StartDate", headerName: "START DATE", width: 200 },
    { field: "EndDate", headerName: "END DATE", width: 200 },
    {
      field: "status",
      headerName: "STATUS",
      width: 200,
      renderCell: (params) => (params.row.status === 1 ? "Achieved" : ""),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <MDButton variant="text" color="info" component={Link} to="/target/edit">
          <Icon fontSize="small">edit</Icon>
        </MDButton>
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
                  <Grid item xs={3} mr={40}>
                    <MDTypography variant="h6" color="white">
                      <Icon fontSize="small">crisis_alert</Icon>
                      Target Commission
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={35}>
                    <MDTypography component={Link} to="/master/target-comission">
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
