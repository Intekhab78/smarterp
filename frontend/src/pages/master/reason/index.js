import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../../axios";
import { styled } from "@mui/material/styles";
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
import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import IconButton from "@mui/material/IconButton";
// import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
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
    name: "",
    type: "",
    status: "",
    action: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

function Reason() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [reasonData, setreasonData] = useState({});

  const handleClickOpen = (reasonData) => {
    setreasonData(reasonData);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handlelist = async () => {
    try {
      const response = await axios.get("reason-type/list", {
        params: {
          page: 1,
          page_size: 10,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handlelist();
  }, []);

   const handleDelete = async () => {
    const { id } = orderData;
    setIsDeleting(true)

    const { uuid } = reasonData;
    setOpen(false);
    await axios
      .delete("reason-type/delete/" + uuid)
      .then((response) => {
        handlelist();
        toast.success("Data delete successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "NAME", width: 300 },
    { field: "type", headerName: "TYPE", width: 300 },
    {
      field: "status",
      headerName: "STATUS",
      width: 200,
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
          to={`/master/reason/edit/${params.row.uuid}`}
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
            Are you sure want to delete this record {reasonData.name}??
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
                      {/* <Icon fontSize="small">account_balance</Icon> */}
                      Reason
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/reason">
                      <MDButton variant="gradient" color="light">
                        &#x2b;&nbsp;New
                      </MDButton>
                    </MDTypography>
                  </Grid>
                </Grid>
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
                  // checkboxSelection
                  // disableRowSelectionOnClick
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Reason;
