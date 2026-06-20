import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
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

function Add_VanToVan_Transfer() {
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

  const handleRemoveRow = (id) => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
  };

  // const handleRemoveRow = (index) => {
  //   const newRows = [...rows];
  //   newRows.splice(index, 1);
  //   setRows(newRows);
  // };

  const [selectedValue, setSelectedValue] = useState("");
  const [selectDestination, setselectDestination] = useState("");
  const [destiRoute, setdestiRoute] = useState([]);
  const [selectsource, setselectsource] = useState("");
  const [sourceRoute, setsourceRoute] = useState([]);
  const [selectitem, setselectitem] = useState("");
  const [listItem, setlistItem] = useState([]);
  const [selectuom, setselectuom] = useState("");
  const [listUom, setlistUom] = useState([]);
  const [formError, setFormError] = useState({});
  const [valuefrom, setValuefrom] = useState(moment().format("YYYY-MM-DD"));
  const [selectedItems, setSelectedItems] = useState(Array.from({ length: rows.length }, () => ""));
  const [selecteduom, setSelecteduom] = useState(Array.from({ length: rows.length }, () => ""));
  const [formData, setFormData] = useState({
    source_route_id: "",
    destination_route_id: "",
    code: "",
    date: "",
    status: 1,
    van_to_van_transfer_details: "",
    vantovantransfer_id: "",
    item_id: "",
    item_uom_id: "",
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
    return error;
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   let errordisplay = validation(formData);
 

  //   if (Object.keys(errordisplay).length > 0) {
  //     setFormError(errordisplay);
  //   } else {
  //     try {
  //       formData.destination_route_id = selectDestination.value;
  //       formData.source_route_id = selectsource.value;
  //       formData.date = valuefrom;
  //       const response = await axios.post("van-to-van-transfer/add", formData);
  //       navigate("/van-to-van-transfer");
  //       toast.success("Data add Successfully");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errordisplay = validation(formData);

    if (Object.keys(errordisplay).length > 0) {
      setFormError(errordisplay);
    } else {
      try {
        const dataToSend = rows.map((row, index) => ({
          item_id: selectedItems[index].value,
          item_uom_id: selecteduom[index].value,
          quantity: row.quantity,
        }));

        const response = await axios.post("van-to-van-transfer/add", {
          ...formData,
          destination_route_id: selectDestination.value,
          source_route_id: selectsource.value,
          date: valuefrom,
          items: dataToSend,
        });

        navigate("/van-to-van-transfer");
        toast.success("Data add Successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const SelectedDestination = async () => {
    try {
      const response = await axios.post("route/list");
      const { data } = response;
      let category = [];
      data.data.map((data) => {
        let Object = {
          label: data.route_name,
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

  const handleItemChange = (rowIndex, newValue) => {
    const updatedItems = [...selectedItems];
    updatedItems[rowIndex] = newValue;
    setSelectedItems(updatedItems);
  };

  const handleuomChange = (rowIndex, newValue) => {
    const updatedItems = [...selecteduom];
    updatedItems[rowIndex] = newValue;
    setSelecteduom(updatedItems);
  };

  const columns = [
    { field: "id", headerName: "#", width: 100 },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 300,
      renderCell: (params) => (
        <Autocomplete
          disablePortal
          id={`${params.row.id}`}
          sx={{ width: 250 }}
          options={listItem}
          value={selectedItems[params.row.id - 1]}
          onChange={(event, newValue) => handleItemChange(params.row.id - 1, newValue)}
          // value={selectitem}
          // onChange={(event, newValue) => setselectitem(newValue)}
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
          id={`${params.row.id}`}
          options={listUom}
          value={selecteduom[params.row.id - 1]}
          onChange={(event, newValue) => handleuomChange(params.row.id - 1, newValue)}
          // value={selectuom}
          // onChange={(event, newValue) => setselectuom(newValue)}
          sx={{ width: 190 }}
          renderInput={(params) => <TextField {...params} label="uom" variant="standard" />}
        ></Autocomplete>
      ),
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          label="Quantity"
          variant="standard"
          name="quantity"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color="info"
          iconOnly
          onClick={() => handleRemoveRow(params.row.id)}
          // onClick={() => handleRemoveRow(params.rowIndex)}
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
                  <Icon fontSize="small">local_shipping</Icon>
                  Add Van To Van Transfer
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
                          sx={{ width: 300 }}
                          value={selectsource}
                          onChange={(event, newValue) => setselectsource(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Source Van:"
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
                          label="Code"
                          variant="outlined"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          helperText={formError.code}
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
                            Van to Van Code
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Van to Van Code number are set an auto generate mode to save your
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
                                label="Continue auto-generating Van to Van Code"
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
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={destiRoute}
                          sx={{ width: 300 }}
                          value={selectDestination}
                          onChange={(event, newValue) => setselectDestination(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Destination Van:"
                              error={!!formError}
                              helperText={selectDestination ? "" : "Field is required"}
                            />
                          )}
                        ></Autocomplete>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="date"
                          label="Date"
                          variant="outlined"
                          value={valuefrom}
                          onChange={onChangeDate}
                          sx={{ width: 300 }}
                        />
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
                  <MDTypography component={Link} to="/van-to-van-transfer">
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

export default Add_VanToVan_Transfer;
