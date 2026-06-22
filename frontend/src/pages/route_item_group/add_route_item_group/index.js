import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Icon from "@mui/material/Icon";
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
import { Autocomplete, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

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

function AddRoute_item_group() {
  const [selectedValue, setSelectedValue] = useState("");
  const [formError, setFormError] = useState({});
  const [routelist, setroutelist] = useState([]);
  const [itemList, setitemList] = useState([]);
  const [selectitem, setselectitem] = useState([]);
  const [selectedCategory, setselectedCategory] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    route_id: "",
    item_code: "",
    status: 1,
  });
  const navigate = useNavigate();
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
      error.code = "Code is required";
    }
    if (!values.name) {
      error.name = "Name is required";
    }
    return error;
  };

  const Selecteroutelist = async () => {
    try {
      const response = await axios.post("route/list");
      const { data } = response;
      let route = [];
      data.data.map((data) => {
        let Object = {
          label: data.route_name,
          value: data.id,
        };
        route.push(Object);
      });
      setroutelist(route);
    } catch (error) {
      console.error(error);
    }
  };
  const Selecteitemlist = async () => {
    const payload = {
      page: 1,
      page_size: 10,
    };
    try {
      const response = await axios.post("item/list", payload);
      const { data } = response;
      console.log("sdsd", data);

      let route = [];
      data.data.map((data) => {
        let Object = {
          label: data.item_code + "-" + data.item_name,
          value: data.id,
        };
        route.push(Object);
      });
      setitemList(route);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    Selecteroutelist();
    Selecteitemlist();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    let errordisplay = validation(formData);
    console.log(errordisplay);

    if (Object.keys(errordisplay).length > 0) {
      setFormError(errordisplay);
    } else {
      try {
        formData.route_id = selectedCategory.value;
        formData.item_code = selectitem;
        const response = await axios.post("route-item-grouping/add", formData);
        navigate("/route-item-group");
        toast.success("Data add Successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

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
                  Add Route Item Group
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <MDBox pb={2}>
                    <MDInput
                      type="text"
                      label="CODE"
                      variant="outlined"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      helperText={formError.code}
                      sx={{ width: 400 }}
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
                        Route Group Code
                      </BootstrapDialogTitle>
                      <DialogContent dividers>
                        <MDTypography style={{ fontSize: 17 }} gutterBottom>
                          Your Route Group Code number are set an auto generate mode to save your
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
                            label="Continue auto-generating Route Group Code"
                          />
                          {selectedValue === "auto" && (
                            <>
                              <Grid
                                container
                                rowSpacing={2}
                                columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                              >
                                <Grid item xs={4}>
                                  <TextField label="Prefix" sx={{ width: 150 }} />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextField label="Next Number" sx={{ width: 150 }} />
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
                  <MDBox pb={2}>
                    <MDInput
                      type="text"
                      label="NAME"
                      variant="outlined"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      helperText={formError.name}
                      sx={{ width: 450 }}
                    />
                  </MDBox>
                  <MDBox pb={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={routelist}
                      // style={{ height: 45 }}
                      value={selectedCategory}
                      onChange={(event, newValue) => setselectedCategory(newValue)}
                      sx={{ width: 450 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="ROUTE"
                          error={!!formError}
                          helperText={selectedCategory ? "" : "ROUTE is required"}
                        />
                      )}
                    ></Autocomplete>
                    {formData.name == "" && formData.code == "" && formData.route_id == "" ? (
                      ""
                    ) : (
                      <Grid item xs={6}>
                        <MDBox pb={2}>
                          <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={itemList}
                            value={selectitem}
                            disableCloseOnSelect
                            // getOptionLabel={(option) => option.label}
                            renderOption={(props, option, { selectitem }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8 }}
                                  checked={selectitem}
                                />
                                {option.label}
                              </li>
                            )}
                            style={{ width: 400 }}
                            onChange={(event, newValue) => setselectitem(newValue)}
                            renderInput={(params) => <TextField {...params} label="Item Code" />}
                          ></Autocomplete>
                        </MDBox>
                      </Grid>
                    )}
                  </MDBox>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/route-item-group">
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

export default AddRoute_item_group;
