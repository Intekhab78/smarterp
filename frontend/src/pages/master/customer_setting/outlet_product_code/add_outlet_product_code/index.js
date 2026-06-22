import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
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
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const items = [
  { label: "Dubai", value: "Dubai" },
  { label: "Jabel Ali", value: "Jabel Ali" },
  { label: "Abu Dhabi", value: "Abu Dhabi" },
];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const label = { inputProps: { "aria-label": "Checkbox demo" } };

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

function AddOutlet_product() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedItem, setselectedItem] = useState("");
  const [selectcustomer, setselectcustomer] = useState([]);
  const [formError, setFormError] = useState({});
  const [itemList, setitemList] = useState([]);
  const [customerList, setcustomerList] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    customer_id: "",
    item_id: "",
    status: 1,
  });

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const [customerName, setCustomerName] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const handleChanges = (event) => {
    const {
      target: { value },
    } = event;
    setCustomerName(typeof value === "string" ? value.split(",") : value);
  };
  console.log("sdfdsg", customerName);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const Selecteitem = async () => {
    try {
      const response = await axios.post("item/list");
      const { data } = response;
      let item = [];
      data.data.map((data) => {
        let Object = {
          label: data.item_code + "/" + data.item_name,
          value: data.id,
        };
        item.push(Object);
      });
      setitemList(item);
    } catch (error) {
      console.error(error);
    }
  };

  const Selectcustomer = async () => {
    try {
      const response = await axios.post("customer/list");
      const { data } = response;
      let customer = [];
      data.data.map((data) => {
        let Object = {
          label: data.user.firstname,
          value: data.id,
        };
        customer.push(Object);
      });
      setcustomerList(customer);
    } catch (error) {
      console.error(error);
    }
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
        formData.item_id = selectedItem.value;
        formData.lob = selectcustomer;
        const response = await axios.post("outlet-product/add", formData);
        console.log(response);
        navigate("/outlet-product-code");
        toast.success("Data add Successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    Selecteitem();
    Selectcustomer();
  }, []);

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
                  Add Outlet Product Code
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid item xs={6} pb={2}>
                    <MDBox>
                      <MDInput
                        error
                        type="text"
                        label="Code:"
                        variant="outlined"
                        name="code"
                        onChange={handleChange}
                        helperText={formError.code}
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
                          Outlet Code
                        </BootstrapDialogTitle>
                        <DialogContent dividers>
                          <MDTypography style={{ fontSize: 17 }} gutterBottom>
                            Your Outlet Code number are set an auto generate mode to save your time.
                            Are you sure about changing this setting?
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
                              label="Continue auto-generating Outlet Code"
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
                  <Grid item xs={6} pb={2}>
                    <MDBox>
                      <MDInput
                        error
                        type="text"
                        label="Name:"
                        variant="outlined"
                        name="name"
                        onChange={handleChange}
                        helperText={formError.name}
                        sx={{ width: 300 }}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={6} pb={6}>
                    <Autocomplete
                      multiple
                      id="checkboxes-tags-demo"
                      options={customerList}
                      value={selectcustomer}
                      disableCloseOnSelect
                      renderOption={(props, option, { selectcustomer }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selectcustomer}
                          />
                          {option.label}
                        </li>
                      )}
                      style={{ width: 300 }}
                      onChange={(event, newValue) => setselectcustomer(newValue)}
                      renderInput={(params) => <TextField {...params} label="Customers" />}
                    ></Autocomplete>
                  </Grid>
                  <MDBox pb={4}>
                    <hr></hr>
                  </MDBox>
                  <Grid item xs={6} pb={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={itemList}
                      // style={{ height: 45 }}
                      sx={{ width: 300 }}
                      value={selectedItem}
                      onChange={(event, newValue) => setselectedItem(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Item Code"
                          error={!!formError}
                          helperText={selectedItem ? "" : "Item is required"}
                        />
                      )}
                    ></Autocomplete>
                  </Grid>
                  <Grid item xs={6}>
                    <MDBox pb={2}>
                      <MDInput
                        type="text"
                        label="Outlet Item Code"
                        variant="outlined"
                        sx={{ width: 300 }}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={6} pr={6}>
                    <MDButton variant="gradient" color="light">
                      &#x2b;Add
                    </MDButton>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/outlet-product-code">
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

export default AddOutlet_product;
