import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import axios from "../../../../../axios";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

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

function EditCountry() {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { id } = useParams();

  const initialVlaues = {
    name: "",
    country_code: "",
    dial_code: "",
    currency: "",
    currency_code: "",
    currency_symbol: "",
    status: 1,
    uuid: "",
    id: "",
  };

  const [selectValue, setSelectValue] = useState(initialVlaues);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectValue({
      ...selectValue,
      [name]: value,
    });
  };
  const getCountryDetails = async () => {
    const response = await axios
      .get("country/edit/" + id)
      .then((response) => {
        const { data } = response?.data;
        setSelectValue({ ...data });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    getCountryDetails();
  }, []);

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    await axios
      .post("country/edit/" + id, selectValue)
      .then((response) => {
        const { data } = response?.data;
        setSelectValue({ ...data });
        navigate("/country");
        toast.success("Data edit Successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={9}>
            <Card component="form" role="form" onSubmit={(e) => handleSubmit(e, id)}>
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
                  Edit Country
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Country Code"
                          variant="outlined"
                          disabled
                          value={selectValue?.country_code}
                          sx={{ width: 250 }}
                        />
                        {!selectValue.country_code && (
                          <div style={{ color: "red", fontSize: 12 }}>Field is required.</div>
                        )}
                        {/* <MDButton onClick={handleClickOpen}>
                          <Icon fontSize="small">settings</Icon>
                        </MDButton>
                        <BootstrapDialog
                          onClose={handleClose}
                          aria-labelledby="customized-dialog-title"
                          open={open}
                        >
                          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Country Code
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Country Code number are set an auto generate mode to save your
                              time. Are you sure about changing this setting?
                            </MDTypography>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              value={selectedValue}
                              onChange={handleChanged}
                              defaultValue="add"
                              name="radio-buttons-group"
                            >
                              <FormControlLabel
                                value="auto"
                                control={<Radio />}
                                label="Continue auto-generating Country Code"
                              />
                              {selectedValue === "auto" && (
                                <>
                                  <Grid
                                    container
                                    rowSpacing={2}
                                    columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                                  >
                                    <Grid item xs={4}>
                                      <TextField label="Prefix" required sx={{ width: 150 }} />
                                    </Grid>
                                    <Grid item xs={4}>
                                      <TextField label="Next Number" required sx={{ width: 150 }} />
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              <FormControlLabel
                                value="add"
                                control={<Radio />}
                                label="I will add them manually each time"
                              />
                            </RadioGroup>
                          </DialogContent>
                          <DialogActions>
                            <MDButton variant="text" color="info" autoFocus onClick={handleClose}>
                              Save
                            </MDButton>
                            <MDButton variant="text" color="info" autoFocus onClick={handleClose}>
                              Cancel
                            </MDButton>
                          </DialogActions>
                        </BootstrapDialog> */}
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Name"
                          variant="outlined"
                          name="name"
                          value={selectValue?.name}
                          onChange={handleChange}
                          sx={{ width: 300 }}
                        />
                        {!selectValue.name && (
                          <div style={{ color: "red", fontSize: 14 }}>Name is required.</div>
                        )}
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Dial Code"
                          variant="outlined"
                          name="dial_code"
                          value={selectValue?.dial_code}
                          onChange={handleChange}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Currency"
                          variant="outlined"
                          name="currency"
                          value={selectValue?.currency}
                          onChange={handleChange}
                          sx={{ width: 300 }}
                        />
                        {!selectValue.currency && (
                          <div style={{ color: "red", fontSize: 14 }}>Field is required.</div>
                        )}
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Currency Code"
                          variant="outlined"
                          name="currency_code"
                          value={selectValue?.currency_code}
                          onChange={handleChange}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Currency Symbol"
                          variant="outlined"
                          name="currency_symbol"
                          value={selectValue?.currency_symbol}
                          onChange={handleChange}
                          sx={{ width: 300 }}
                        />
                        {!selectValue.currency_symbol && (
                          <div style={{ color: "red", fontSize: 14 }}>Field is required.</div>
                        )}
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/country">
                    <MDButton variant="gradient" color="info" fullWidth>
                      Cancel
                    </MDButton>
                  </MDTypography>
                </Grid>
                <Grid item xs={2} ml={3}>
                  <MDBox>
                    <MDButton variant="gradient" color="info" type="submit" fullWidth>
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

export default EditCountry;
