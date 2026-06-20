import { Link } from "react-router-dom";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const customer_expense = [
  { label: "Customer CTest", value: "Customer CTest" },
  { label: "HOOK GENERAL TRADING LLC - COD", value: "HOOK GENERAL TRADING LLC - COD" },
  { label: "Test", value: "Test" },
];

const expenses_category = [{ label: "", value: "" }];

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

function Add_Expense() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={9}>
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
                <MDTypography variant="h6" color="white">
                  Add Expense
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox pb={2}>
                    <MDInput
                      type="date"
                      label="Date"
                      variant="outlined"
                      required
                      sx={{ width: 400 }}
                    />
                  </MDBox>
                  <MDBox pb={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={expenses_category}
                      //   style={{ height: 45 }}
                      sx={{ width: 450 }}
                      renderInput={(params) => <TextField {...params} label="Expense Category" />}
                    ></Autocomplete>
                  </MDBox>
                  <MDBox pb={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={customer_expense}
                      //   style={{ height: 45 }}
                      sx={{ width: 450 }}
                      renderInput={(params) => <TextField {...params} label="Customer" />}
                    ></Autocomplete>
                  </MDBox>
                  <MDBox pb={2}>
                    <MDInput
                      type="text"
                      label="Amount"
                      variant="outlined"
                      required
                      sx={{ width: 450 }}
                    />
                  </MDBox>
                  <MDBox pb={2}>
                    <MDInput
                      type="text"
                      label="Reference"
                      variant="outlined"
                      required
                      sx={{ width: 450 }}
                    />
                  </MDBox>
                  <MDBox pb={2}>
                    <MDInput
                      type="textarea"
                      label="Note"
                      variant="outlined"
                      required
                      sx={{ width: 450 }}
                    />
                  </MDBox>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/expense">
                    <MDButton variant="gradient" color="info" fullWidth>
                      Cancel
                    </MDButton>
                  </MDTypography>
                </Grid>
                <Grid item xs={2} ml={3}>
                  <MDBox>
                    <MDButton variant="gradient" color="info" fullWidth>
                      Save
                    </MDButton>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Add_Expense;
