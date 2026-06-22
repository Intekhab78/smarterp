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

const van_category = [
  { label: "Trailer", value: "Trailer" },
  { label: "Loading Truck", value: "Loading Truck" },
];
const van_type = [{ label: "Truck", value: "Truck" }];

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

function AddVanMaster() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCategory, setselectedCategory] = useState("");
  const [selectType, setselectType] = useState("");
  const [vanTypes, setVanTypes] = useState([]);
  const [vanCategories, setVanCategories] = useState([]);
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    van_code: "",
    description: "",
    plate_number: "",
    capacity: "",
    odometer_reading: "",
    van_type_id: "",
    van_category_id: "",
    van_status: 1,
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
    if (!values.van_code) {
      error.van_code = "Van code is required";
    }
    if (!values.description) {
      error.description = "Van description is required";
    }
    if (!values.plate_number) {
      error.plate_number = "Plate number is required";
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
        formData.van_category_id = selectedCategory.value;
        formData.van_type_id = selectType.value;
        const response = await axios.post("van/add", formData);
        navigate("/van");
        toast.success("Data add Successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const SelectedCategory = async () => {
    try {
      const response = await axios.get("van-category/list");
      const { data } = response;
      let category = [];
      data.data.map((data) => {
        let Object = {
          label: data.name,
          value: data.id,
        };
        category.push(Object);
      });
      setVanCategories(category);
    } catch (error) {
      console.error(error);
    }
  };
  const SelectedType = async () => {
    try {
      const response = await axios.get("van-type/list");
      const { data } = response;
      let type = [];
      data.data.map((data) => {
        let Object = {
          label: data.name,
          value: data.id,
        };
        type.push(Object);
      });
      setVanTypes(type);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    SelectedCategory();
    SelectedType();
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
                  Add Van
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Van Code:"
                          variant="outlined"
                          name="van_code"
                          value={formData.van_code}
                          onChange={handleChange}
                          helperText={formError.van_code}
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
                            Van Code
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Van Code number are set an auto generate mode to save your time.
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
                                label="Continue auto-generating Van Code"
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
                          label="Van Description"
                          variant="outlined"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          helperText={formError.description}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Plate Number"
                          variant="outlined"
                          name="plate_number"
                          value={formData.plate_number}
                          onChange={handleChange}
                          helperText={formError.plate_number}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Capacity"
                          variant="outlined"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Fuel Reading"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={vanTypes}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectType}
                        onChange={(event, newValue) => setselectType(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Type:"
                            error={!!formError}
                            helperText={selectType ? "" : "Type is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={vanCategories}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedCategory}
                        onChange={(event, newValue) => setselectedCategory(newValue)}
                        // renderInput={(params) => (
                        //   <TextField
                        //     {...params}
                        //     label="Region:"
                        //     error={!!formError}
                        //     helperText={selectedCategory ? "" : "region is required"}
                        //   />
                        // )}
                        renderInput={(params) => <TextField {...params} label="Category:" />}
                      ></Autocomplete>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/van">
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

export default AddVanMaster;
