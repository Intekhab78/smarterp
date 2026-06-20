import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRadioGroup } from "@mui/material/RadioGroup";
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
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import routes from "routes";

const load_type = [{ label: "", value: "" }];

const salesman = [
  { label: "Delivery Load", value: "Delivery Load" },
  { label: "Van Load", value: "Van Load" },
];

const route = [
  { label: "FRESH11", value: "FRESH11" },
  { label: "ROUTE TEST21", value: "ROUTE TEST21" },
  { label: "FRESh12", value: "FRESh12" },
  { label: "Abu dhabi (1)", value: "Abu dhabi (1)" },
  { label: "Dubai (1)", value: "Dubai (1)" },
];

const item = [
  { label: "20 APP CHARCOAL PINZA MARGHARITA", value: "20 APP CHARCOAL PINZA MARGHARITA" },
  { label: "20-051 FFF FS CHICKEN TIKKA TOPPING", value: "20-051 FFF FS CHICKEN TIKKA TOPPING" },
  { label: "55500000 Test Item", value: "55500000 Test Item" },
  { label: "55555500001 Test Item 1", value: "55555500001 Test Item 1" },
];

const uom = [
  { label: "CA", value: "CA" },
  { label: "TB", value: "TB" },
  { label: "BC", value: "BC" },
  { label: "CD", value: "CD" },
  { label: "PK", value: "PK" },
  { label: "EA", value: "EA" },
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

//radiobutton
const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme, checked }) => ({
    ".MuiFormControlLabel-label":
      checked &&
      {
        //   color: theme.palette.primary.main,
      },
  })
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();
  let checked = false;
  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }
  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};

function Add_load_Request() {
  const [rows, setRows] = useState([]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        item_name: "",
        uom: "",
        quantity: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const [selectedValue, setSelectedValue] = useState("");
  const [selectDestination, setselectDestination] = useState("");
  const [destiRoute, setdestiRoute] = useState([]);
  const [selectsource, setselectsource] = useState("");
  const [sourceRoute, setsourceRoute] = useState([]);
  const [selectitem, setselectitem] = useState("");
  const [listItem, setlistItem] = useState([]);
  const [selectuom, setselectuom] = useState("");
  const [listUom, setlistUom] = useState([]);
  const [valuefrom, setValuefrom] = useState(moment().format("YYYY-MM-DD"));
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    load_number: "",
    route_id: "",
    salesman_id: "",
    load_date: "",
    load_type: "",
    status: 0,
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

  const onChangeDate = (e) => {
    const newDate = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    setValuefrom(newDate);
    console.log(newDate);
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
    if (!values.load_number) {
      error.load_number = "Field is required";
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
        formData.salesman_id = selectDestination.value;
        formData.route_id = selectsource.value;
        formData.load_date = valuefrom;
        const response = await axios.post("loadrequest/add", formData);
        navigate("/load-request");
        toast.success("Data add Successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const SelectedDestination = async () => {
    try {
      const response = await axios.post("salesman/list");
      const { data } = response;
      let category = [];
      data.data.map((data) => {
        let Object = {
          label: data.user.firstname + " " + data.user.lastname + "-" + data.salesman_code,
          value: data.id,
        };
        category.push(Object);
      });
      setdestiRoute(category);
    } catch (error) {
      console.error(error);
    }
  };

  const SelectedRoute = async () => {
    try {
      const response = await axios.post("route/list");
      const { data } = response;
      let type = [];
      data.data.map((data) => {
        let Object = {
          label: data.route_name,
          value: data.id,
        };
        type.push(Object);
      });
      setsourceRoute(type);
    } catch (error) {
      console.error(error);
    }
  };

  const SelectedItem = async () => {
    try {
      const payload = {
        page: 7,
        page_size: 20,
      };
      const response = await axios.post("item/list", payload);
      const { data } = response;
      let type = [];
      data.data.map((data) => {
        let Object = {
          label: data.item_name,
          value: data.id,
        };
        type.push(Object);
      });
      setlistItem(type);
    } catch (error) {
      console.error(error);
    }
  };

  const SelectedUom = async () => {
    try {
      const response = await axios.get("item-uom/list");
      const { data } = response;
      let type = [];
      data.data.map((data) => {
        let Object = {
          label: data.name,
          value: data.id,
        };
        type.push(Object);
      });
      setlistUom(type);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    SelectedDestination();
    SelectedRoute();
    SelectedItem();
    SelectedUom();
  }, []);

  const columns = [
    { field: "id", headerName: "#", width: 100 },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 300,
      renderCell: (params) => (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={listItem}
          value={selectitem}
          onChange={(event, newValue) => setselectitem(newValue)}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Item" variant="standard" />}
        ></Autocomplete>
      ),
    },
    {
      field: "uom",
      headerName: "UOM",
      width: 200,
      renderCell: (params) => (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={listUom}
          value={selectuom}
          onChange={(event, newValue) => setselectuom(newValue)}
          sx={{ width: 190 }}
          renderInput={(params) => <TextField {...params} label="uom" variant="standard" />}
        ></Autocomplete>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          label="Quantity"
          variant="standard"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color="info"
          iconOnly
          onClick={() => handleRemoveRow(params.rowIndex)}
        >
          <Icon fontSize="small">clear</Icon>
        </MDButton>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
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
                  {/* <Icon fontSize="small">crisis_alert</Icon> */}
                  Add Load Request
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={sourceRoute}
                          style={{ height: 45 }}
                          sx={{ width: 300 }}
                          value={selectsource}
                          onChange={(event, newValue) => setselectsource(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Route:"
                              error={!!formError}
                              helperText={selectsource ? "" : "Field is required"}
                            />
                          )}
                        ></Autocomplete>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="text"
                          label="Salesman Load Number:"
                          variant="outlined"
                          name="load_number"
                          value={formData.load_number}
                          onChange={handleChange}
                          helperText={formError.load_number}
                          sx={{ width: 300 }}
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
                            Salesman Load
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Salesman Load number are set an auto generate mode to save your
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
                                label="Continue auto-generating Salesman Load"
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
                      <MDBox pb={2}>
                        <MDInput
                          type="date"
                          label="Load Date:"
                          variant="outlined"
                          value={valuefrom}
                          onChange={onChangeDate}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={destiRoute}
                          style={{ height: 45 }}
                          sx={{ width: 300 }}
                          value={selectDestination}
                          onChange={(event, newValue) => setselectDestination(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Salesman:"
                              error={!!formError}
                              helperText={selectDestination ? "" : "Field is required"}
                            />
                          )}
                        ></Autocomplete>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12}>
                      <DataGrid
            localeText={{noRowsLabel: "No records", }} rows={rows} columns={columns} disableRowSelectionOnClick />
                      <MDButton variant="contained" color="secondary" onClick={handleAddRow}>
                        Add Row
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/load-request">
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

export default Add_load_Request;
