import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import axios from "../../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const places = [
  { label: "UNITED ARAB EMIRATES", value: "UNITED ARAB EMIRATES0" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "Qatar", value: "Qatar" },
];

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

function AddRegion() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [formError, setFormError] = useState({});
  const [countryList, setcountryList] = useState([]);
  const [formData, setFormData] = useState({
    region_code: "",
    region_name: "",
    country_id: "",
    region_status: 1,
  });
  const navigate = useNavigate();

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const SelectedCountry = async () => {
    try {
      const response = await axios.get("country/list");
      const { data } = response;
      let country = [];
      data.data.map((data) => {
        let Object = {
          label: data.name,
          value: data.id,
        };
        country.push(Object);
      });
      setcountryList(country);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const validation = (values) => {
    let error = {};
    if (!values.region_code) {
      error.region_code = "Region code is required";
    }
    if (!values.region_name) {
      error.region_name = "Region name is required";
    }
    return error;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errordisplay = validation(formData);
    console.log(errordisplay);

    if (Object.keys(errordisplay).length > 0) {
      setFormError(errordisplay);
    } else {
      try {
        formData.country_id = selectedCountry.value;
        const response = await axios.post("region/add", formData);
        navigate("/region");
        toast.success("Data add Successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    SelectedCountry();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={9}>
            <Card component="form" role="form" onSubmit={handleSubmit}>
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
                  Add Region
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Region Code"
                          variant="outlined"
                          name="region_code"
                          value={formData.region_code}
                          onChange={handleChange}
                          helperText={formError.region_code}
                          sx={{ width: 250 }}
                        />
                        <MDButton onClick={handleClickOpen}>
                          <Icon fontSize="small">settings</Icon>
                        </MDButton>
                        <BootstrapDialog
                          onClose={handleClose}
                          aria-labelledby="customized-dialog-title"
                          open={open}
                        >
                          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Region Code
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Region Code number are set an auto generate mode to save your
                              time. Are you sure about changing this setting?
                            </MDTypography>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue="add"
                              value={selectedValue}
                              onChange={handleChanged}
                              name="radio-buttons-group"
                            >
                              <FormControlLabel
                                value="auto"
                                control={<Radio />}
                                label="Continue auto-generating Region Code"
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
                        </BootstrapDialog>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Region Name"
                          variant="outlined"
                          name="region_name"
                          value={formData.region_name}
                          onChange={handleChange}
                          helperText={formError.region_name}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={countryList}
                        value={selectedCountry}
                        onChange={(event, newValue) => setSelectedCountry(newValue)}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country"
                            error={!!formError}
                            helperText={selectedCountry ? "" : "Country is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/region">
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

export default AddRegion;
