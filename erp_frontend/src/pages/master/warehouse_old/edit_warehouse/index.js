import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";
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
import axios from "../../../../axios";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
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

const warehouse = [
  { label: "Jabel Ali", value: "Jabel Ali" },
  { label: "Main Warehouse", value: "Main Warehouse" },
];

const depot = [
  { label: "Jabel Ali", value: "Jabel Ali" },
  { label: "Main Warehouse", value: "Main Warehouse" },
];

function EditWarehouse() {
  const { id } = useParams();
  const initialVlaues = {
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
    uuid: "",
    id: "",
  };
  const [selectedValue, setSelectedValue] = useState(initialVlaues);
  const [selectedCategory, setselectedCategory] = useState("");
  const [selectwarehouse, setselectwarehouse] = useState("");
  const [formError, setFormError] = useState({});
  const [depotList, setdepotList] = useState([]);
  const [warehouseList, setwarehouseList] = useState([]);

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleHiddenChange = (event) => {
    setHidden(event.target.checked);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedValue({
      ...selectedValue,
      [name]: value,
    });
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
  const getWarehouseDetails = async () => {
    const response = await axios
      .get("warehouse/edit/" + id)
      .then((response) => {
        const { data } = response?.data;
        setSelectedValue({ ...data });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    getWarehouseDetails();
    Selectwarehouse();
    Selectedepot();
  }, []);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    selectedValue.depot_id = selectedCategory.value;
    selectedValue.parent_warehouse_id = selectwarehouse.value;
    await axios
      .post("warehouse/edit/" + id, selectedValue)
      .then((response) => {
        navigate("/warehouse");
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
                  Edit Warehouse
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="text"
                          disabled
                          label="Warehouse Code:"
                          variant="outlined"
                          name="code"
                          sx={{ width: 250 }}
                          value={selectedValue?.code}
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
                          type="text"
                          label="Warehouse Name:"
                          variant="outlined"
                          name="name"
                          sx={{ width: 300 }}
                          value={selectedValue?.name}
                          onChange={handleChange}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Warehouse Manager:"
                          variant="outlined"
                          name="manager"
                          sx={{ width: 300 }}
                          value={selectedValue?.manager}
                          onChange={handleChange}
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
                        hidden={hidden}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedValue?.selectwarehouse}
                        onChange={(event, newValue) => setselectwarehouse(newValue)}
                        renderInput={(params) => (
                          <TextField {...params} label="Primary Warehouse:" />
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
                        value={selectedValue?.selectedCategory}
                        onChange={(event, newValue) => setselectedCategory(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Depot:" />}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Location:"
                          variant="outlined"
                          name="address"
                          sx={{ width: 300 }}
                          value={selectedValue?.address}
                          onChange={handleChange}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Latitude:"
                          variant="outlined"
                          name="lat"
                          sx={{ width: 300 }}
                          value={selectedValue?.lat}
                          onChange={handleChange}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Longitude:"
                          variant="outlined"
                          name="lang"
                          sx={{ width: 300 }}
                          value={selectedValue?.lang}
                          onChange={handleChange}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Radius:"
                          variant="outlined"
                          name="radius"
                          sx={{ width: 300 }}
                          value={selectedValue?.radius}
                          onChange={handleChange}
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
                    <MDButton type="submit" variant="gradient" color="info" fullWidth>
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

export default EditWarehouse;
