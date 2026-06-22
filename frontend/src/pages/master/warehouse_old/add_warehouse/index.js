import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import axios from "../../../../axios";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
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

function AddWarehouse() {
  const [selectedCategory, setselectedCategory] = useState("");
  const [selectwarehouse, setselectwarehouse] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [formError, setFormError] = useState({});
  const [depotList, setdepotList] = useState([]);
  const [warehouseList, setwarehouseList] = useState([]);
  const navigate = useNavigate();
  const [areaList, setareaList] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    manager: "",
    name: "",
    address: "",
    lat: "",
    lang: "",
    radius: "",
    depot_id: "",
    is_main: "",
    parent_warehouse_id: "",
    status: 1,
  });

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };
  const Selectedepot = async () => {
    try {
      const response = await axios.get("depot/list");
      const { data } = response;
      let depot = [];
      data.data.map((data) => {
        let Object = {
          label: data.depot_name,
          value: data.id,
        };
        depot.push(Object);
      });
      setdepotList(depot);
    } catch (error) {
      console.error(error);
    }
  };
  const Selectwarehouse = async () => {
    try {
      const response = await axios.get("warehouse/list");
      const { data } = response;
      let warehouse = [];
      data.data.map((data) => {
        let Object = {
          label: data.name,
          value: data.id,
        };
        warehouse.push(Object);
      });
      setwarehouseList(warehouse);
    } catch (error) {
      console.error(error);
    }
  };
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleHiddenChange = (event) => {
    setHidden(event.target.checked);
  };

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
    if (!values.code) {
      error.code = "code is required";
    }
    if (!values.name) {
      error.name = "name is required";
    }
    if (!values.manager) {
      error.manager = "manager is required";
    }
    if (!values.address) {
      error.address = "address is required";
    }
    if (!values.lat) {
      error.lat = "lat is required";
    }
    if (!values.lang) {
      error.lang = "lang is required";
    }
    if (!values.radius) {
      error.radius = "radius is required";
    }

    return error;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("dfghj");
    let errordisplay = validation(formData);
    console.log(errordisplay);

    if (Object.keys(errordisplay).length > 0) {
      setFormError(errordisplay);
    } else {
      try {
        formData.depot_id = selectedCategory.value;
        formData.parent_warehouse_id = selectwarehouse.value;
        const response = await axios.post("warehouse/add", formData);
        console.log(response);
        navigate("/warehouse");
        toast.success("Data add Successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    Selectedepot();
    Selectwarehouse();
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
                  Add Warehouse
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          error
                          type="text"
                          label="Warehouse Code:"
                          variant="outlined"
                          name="code"
                          sx={{ width: 250 }}
                          onChange={handleChange}
                          helperText={formError.code}
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
                            Warehouse Code
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Warehouse Code number are set an auto generate mode to save your
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
                                label="Continue auto-generating Warehouse Code"
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
                          error
                          type="text"
                          label="Warehouse Name:"
                          variant="outlined"
                          name="name"
                          onChange={handleChange}
                          sx={{ width: 300 }}
                          helperText={formError.name}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          error
                          type="text"
                          label="Warehouse Manager:"
                          variant="outlined"
                          name="manager"
                          sx={{ width: 300 }}
                          onChange={handleChange}
                          helperText={formError.manager}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        name="is_main"
                        // onClick={handleSetRememberMe}
                        sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                      >
                        &nbsp;&nbsp;Main Warehouse:
                      </MDTypography>
                      <Switch checked={hidden} onChange={handleHiddenChange} />
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={warehouseList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectwarehouse}
                        onChange={(event, newValue) => setselectwarehouse(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Primary Warehouse:"
                            error={!!formError}
                            helperText={selectwarehouse ? "" : "Primary Warehouse is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={depotList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedCategory}
                        onChange={(event, newValue) => setselectedCategory(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="depot:"
                            error={!!formError}
                            helperText={selectedCategory ? "" : "depot is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          error
                          type="text"
                          label="Location:"
                          variant="outlined"
                          name="address"
                          sx={{ width: 300 }}
                          onChange={handleChange}
                          helperText={formError.address}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          error
                          type="text"
                          label="Latitude:"
                          variant="outlined"
                          name="lat"
                          sx={{ width: 300 }}
                          onChange={handleChange}
                          helperText={formError.lat}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          error
                          type="text"
                          label="Longitude:"
                          name="lang"
                          variant="outlined"
                          sx={{ width: 300 }}
                          onChange={handleChange}
                          helperText={formError.lang}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          error
                          type="text"
                          label="Radius:"
                          name="radius"
                          variant="outlined"
                          sx={{ width: 300 }}
                          onChange={handleChange}
                          helperText={formError.radius}
                        />
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/warehouse">
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

export default AddWarehouse;
