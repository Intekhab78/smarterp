import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
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
import axios from "../../../../../axios";
// import axios from "axios";
// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const supervisor = [
  { label: "Zuhair Iqbal", value: "Zuhair Iqbal" },
  { label: "Shadab Khan", value: "Shadab Khan" },
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

function AddRoute() {
  const [selectedCategory, setselectedCategory] = useState("");
  const [selecteddepot, setselecteddepot] = useState("");
  const [selectedsup, setselectedsup] = useState("");
  const [selectedware, setselectedware] = useState("");
  const [selectedvan, setselectedvan] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [formError, setFormError] = useState({});
  const [areaList, setareaList] = useState([]);
  const [depotList, setdepotList] = useState([]);
  const [vanList, setvanList] = useState([]);
  const [warehouseList, setwarehouseList] = useState([]);
  const [supList, setsupList] = useState([]);
  const [formData, setFormData] = useState({
    area_id: "",
    category_code: "",
    depot_id: "",
    route_code: "",
    route_name: "",
    supervisor_id: "",
    warehouse_id: "",
    van_id: "",
    status: 1,
  });
  const navigate = useNavigate();
  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const SelectArea = async () => {
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

  const Selectdepot = async () => {
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
  const Selectvan = async () => {
    try {
      const response = await axios.get("van/list");
      const { data } = response;
      let van = [];
      data.data.map((data) => {
        let Object = {
          label: data.plate_number + " - " + data.van_code,
          value: data.id,
        };

        van.push(Object);
      });
      setvanList(van);
    } catch (error) {
      console.error(error);
    }
  };
  const Selectwarehouse = async () => {
    try {
      const response = await axios.get("warehouse/list");
      const { data } = response;
      let ware = [];
      data.data.map((data) => {
        let Object = {
          label: data.name,
          value: data.id,
        };
        ware.push(Object);
      });
      setwarehouseList(ware);
    } catch (error) {
      console.error(error);
    }
  };
  const Selectsup = async () => {
    try {
      const response = await axios.post("supervise-list");
      const { data } = response;
      let sup = [];
      data.data.map((data) => {
        let Object = {
          label: data.firstname,
          value: data.id,
        };
        sup.push(Object);
      });
      setsupList(sup);
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
  const validation = (values) => {
    let error = {};
    if (!values.route_name) {
      error.route_name = "route name is required";
    }
    return error;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let errordisplay = validation(formData);
    console.log(errordisplay);

    try {
      formData.area_id = selectedCategory.value;
      formData.depot_id = selecteddepot.value;
      formData.van_id = selectedvan.value;
      formData.warehouse_id = selectedware.value;
      formData.supervisor_id = selectedsup.value;
      const response = await axios.post("route/add", formData);
      console.log(response);
      navigate("/route");
      toast.success("Data add Successfully");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    SelectArea();
    Selectdepot();
    Selectvan();
    Selectwarehouse();
    Selectsup();
  }, []);

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
                  Add Route
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Route Code:"
                          name="route_code"
                          variant="outlined"
                          onChange={handleChange}
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
                            Route Code
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Route Code number are set an auto generate mode to save your
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
                                label="Continue auto-generating Route Code"
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
                          label="Route Name:"
                          name="route_name"
                          variant="outlined"
                          onChange={handleChange}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={areaList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedCategory}
                        onChange={(event, newValue) => setselectedCategory(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Area:"
                            error={!!formError}
                            helperText={selectedCategory ? "" : "Area is required"}
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
                        value={selecteddepot}
                        onChange={(event, newValue) => setselecteddepot(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Depot Name:"
                            error={!!formError}
                            helperText={selecteddepot ? "" : "Depot is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={vanList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedvan}
                        onChange={(event, newValue) => setselectedvan(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Vehicle:"
                            error={!!formError}
                            helperText={selectedvan ? "" : "Vehicle is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={warehouseList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedware}
                        onChange={(event, newValue) => setselectedware(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Warehouse:"
                            error={!!formError}
                            helperText={selectedware ? "" : "Warehouse is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={supList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedsup}
                        onChange={(event, newValue) => setselectedsup(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Supervisor:"
                            error={!!formError}
                            helperText={selectedsup ? "" : "Supervisor is required"}
                          />
                        )}
                      ></Autocomplete>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/route">
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

export default AddRoute;
