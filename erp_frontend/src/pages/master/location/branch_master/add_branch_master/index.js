import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "../../../../../axios";
import { useNavigate } from "react-router-dom";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const area = [
  { label: "Dubai", value: "Dubai" },
  { label: "Jabel Ali", value: "Jabel Ali" },
  { label: "Abu Dhabi", value: "Abu Dhabi" },
];
const region = [{ label: "RN", value: "RN" }];

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

function AddBranch() {
  const [selectedCategory, setselectedCategory] = useState("");
  const [selectArea, setselectArea] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [formError, setFormError] = useState({});
  const [regionList, setregionList] = useState([]);
  const navigate = useNavigate();
  const [areaList, setareaList] = useState([]);
  const [formData, setFormData] = useState({
    depot_code: "",
    depot_name: "",
    depot_manager: "",
    depot_manager_contact: "",
    region_id: "",
    area_id: "",
    status: 1,
  });
  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };
  const SelectedCategory = async () => {
    try {
      const response = await axios.get("region/list");
      const { data } = response;
      let region = [];
      data.data.map((data) => {
        let Object = {
          label: data.region_name,
          value: data.id,
        };
        region.push(Object);
      });
      setregionList(region);
    } catch (error) {
      console.error(error);
    }
  };
  const Selectedarea = async () => {
    try {
      const response = await axios.get("area/list");
      const { data } = response;
      let area = [];
      data.data.map((data) => {
        let Object = {
          label: data.area_name,
          value: data.id,
        };
        area.push(Object);
      });
      setareaList(area);
    } catch (error) {
      console.error(error);
    }
  };
  const [open, setOpen] = useState(false);

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
    if (!values.depot_code) {
      error.depot_code = "Depot code is required";
    }
    if (!values.depot_name) {
      error.depot_name = "Depot name is required";
    }
    if (!values.depot_manager) {
      error.depot_manager = "Depot manager is required";
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
        formData.region_id = selectedCategory.value;
        formData.area_id = selectArea.value;
        const response = await axios.post("depot/add", formData);
        navigate("/depot");
        toast.success("Data add Successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    SelectedCategory();
    Selectedarea();
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
                  Add Branch/Depot
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          error
                          type="text"
                          label="Depot code"
                          name="depot_code"
                          variant="outlined"
                          sx={{ width: 250 }}
                          value={formData.depot_code}
                          onChange={handleChange}
                          helperText={formError.depot_code}
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
                            Depot Code
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Depot Code number are set an auto generate mode to save your
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
                                label="Continue auto-generating Depot Code"
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
                          label="Depot Name"
                          name="depot_name"
                          variant="outlined"
                          sx={{ width: 300 }}
                          value={formData.depot_name}
                          onChange={handleChange}
                          helperText={formError.depot_name}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          error
                          type="text"
                          label="Depot Manager"
                          name="depot_manager"
                          variant="outlined"
                          sx={{ width: 300 }}
                          value={formData.depot_manager}
                          onChange={handleChange}
                          helperText={formError.depot_manager}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Manager Contact"
                          name="depot_manager_contact"
                          variant="outlined"
                          sx={{ width: 300 }}
                          value={formData.depot_manager_contact}
                          onChange={handleChange}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={regionList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedCategory}
                        onChange={(event, newValue) => setselectedCategory(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Region:"
                            error={!!formError}
                            helperText={selectedCategory ? "" : "region is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={areaList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectArea}
                        onChange={(event, newValue) => setselectArea(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Area:"
                            error={!!formError}
                            helperText={selectArea ? "" : "Area is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/depot">
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

export default AddBranch;
