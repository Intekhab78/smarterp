import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
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

const customer_lob = [{ label: "ANARCO TRADING LLC", value: "ANARCO TRADING LLC" }];

const payment_mode = [
  { label: "Cash", value: "Cash" },
  { label: "Cheque", value: "Cheque" },
];

const customer = [
  { label: "TAJ MAHAL GROCERY - B2B", value: "TAJ MAHAL GROCERY - B2B" },
  { label: "AL SAFA SUPERMARKET - B2B", value: "AL SAFA SUPERMARKET - B2B" },
];

const route = [
  { label: "FRESH11", value: "FRESH11" },
  { label: "ROUTE TEST21", value: "ROUTE TEST21" },
  { label: "FRESh12", value: "FRESh12" },
  { label: "Abu dhabi (1)", value: "Abu dhabi (1)" },
  { label: "Dubai (1)", value: "Dubai (1)" },
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

function Add_Collections() {
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [showInputs, setShowInputs] = useState(false);

  useEffect(() => {
    if (autocompleteValue !== null) {
      setShowInputs(true);
    } else {
      setShowInputs(false);
    }
  }, [autocompleteValue]);

  const handleAutocompleteChange = (event, newValue) => {
    setAutocompleteValue(newValue);
  };

  const [selectedOption, setSelectedOption] = useState([]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // const [rows, setRows] = useState([]);

  // const handleAddRow = () => {
  //   setRows([...rows, { id: "", name: "", email: "", profile: "" }]);
  // };

  // const handleRemoveRow = (index) => {
  //   const newRows = [...rows];
  //   newRows.splice(index, 1);
  //   setRows(newRows);
  // };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "customer_code", headerName: "CUSTOMER CODE", width: 200 },
    { field: "customer_name", headerName: "CUSTOMER NAME", width: 200 },
    { field: "invoice_date", headerName: "INVOICE DATE", width: 200 },
    { field: "invoice_number", headerName: "INVOICE NUMBER", width: 200 },
    { field: "type", headerName: "TYPE", width: 200 },
    { field: "total_amount", headerName: "TOTAL AMOUNT", width: 200 },
    { field: "pending_amount", headerName: "PENDING AMOUNT", width: 200 },
    { field: "paid_amount", headerName: "PAID AMOUNT", width: 200 },
    {
      field: "actions",
      headerName: "ACTION",
      width: 200,
      // renderCell: (params) => (
      //   <MDButton
      //     variant="outlined"
      //     color="info"
      //     iconOnly
      //     onClick={() => handleRemoveRow(params.rowIndex)}
      //   >
      //     <Icon fontSize="small">clear</Icon>
      //   </MDButton>
      // ),
    },
  ];

  const rows = [
    {
      id: 1,
      customer_code: "",
      customer_name: "",
      invoice_date: "",
      invoice_number: "",
      type: "",
      total_amount: "",
      pending_amount: "",
      paid_amount: "",
      actions: "",
    },
  ];

  const [selectedValue, setSelectedValue] = useState("");

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
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
                {/* <MDTypography variant="h6" color="white">
                  <Icon fontSize="small">crisis_alert</Icon>
                  New Collection
                </MDTypography> */}
                <Grid container spacing={1}>
                  <Grid item xs={2} mr={40}>
                    <MDTypography variant="h6" color="white">
                      New Collections
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/collection">
                      <MDButton variant="gradient" color="light">
                        Back
                      </MDButton>
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={customer}
                        style={{ height: 45 }}
                        sx={{ width: 650 }}
                        value={autocompleteValue}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => <TextField {...params} label="Customer" />}
                      ></Autocomplete>
                      {showInputs && (
                        <>
                          <Grid
                            container
                            rowSpacing={2}
                            pt={3}
                            columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                          >
                            <Grid item xs={9}>
                              <MDBox pb={2}>
                                <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={customer_lob}
                                  style={{ height: 45 }}
                                  sx={{ width: 300 }}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Customer Lob:" />
                                  )}
                                ></Autocomplete>
                              </MDBox>
                            </Grid>
                            <Grid item xs={6} pb={2}>
                              <InputLabel>Payment Mode</InputLabel>
                              <Select
                                style={{ height: 45 }}
                                sx={{ width: 300 }}
                                variant="outlined"
                                // input={<OutlinedInput label="Payment Mode" />}
                                value={selectedOption}
                                onChange={handleSelectChange}
                              >
                                <MenuItem value="Cash">Cash</MenuItem>
                                <MenuItem value="Cheque">Cheque</MenuItem>
                              </Select>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="text"
                                  label="Collection Number"
                                  variant="outlined"
                                  required
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
                                  <BootstrapDialogTitle
                                    id="customized-dialog-title"
                                    onClose={handleClose}
                                  >
                                    Collection Code
                                  </BootstrapDialogTitle>
                                  <DialogContent dividers>
                                    <MDTypography style={{ fontSize: 17 }} gutterBottom>
                                      Your Collection Code number are set an auto generate mode to
                                      save your time. Are you sure about changing this setting?
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
                                        label="Continue auto-generating Collection Code"
                                      />
                                      {selectedValue === "auto" && (
                                        <>
                                          <Grid
                                            container
                                            rowSpacing={2}
                                            columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                                          >
                                            <Grid item xs={4}>
                                              <TextField
                                                label="Prefix"
                                                required
                                                sx={{ width: 150 }}
                                              />
                                            </Grid>
                                            <Grid item xs={4}>
                                              <TextField
                                                label="Next Number"
                                                required
                                                sx={{ width: 150 }}
                                              />
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
                                    <MDButton
                                      variant="text"
                                      color="info"
                                      autoFocus
                                      onClick={handleClose}
                                    >
                                      Save
                                    </MDButton>
                                    <MDButton
                                      variant="text"
                                      color="info"
                                      autoFocus
                                      onClick={handleClose}
                                    >
                                      Cancel
                                    </MDButton>
                                  </DialogActions>
                                </BootstrapDialog>
                              </MDBox>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="number"
                                  label="Amount Received"
                                  variant="outlined"
                                  required
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="date"
                                  label="Collection Date"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="number"
                                  label="ocated Amount"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={6} pb={2}>
                              <MDTypography fontWeight="regular">Payment Priority</MDTypography>
                              <RadioGroup row name="use-radio-group" defaultValue="fifo">
                                <MyFormControlLabel value="fifo" label="FIFO" control={<Radio />} />
                                <MyFormControlLabel value="lifo" label="LIFO" control={<Radio />} />
                                <MyFormControlLabel
                                  value="manual"
                                  label="Manual"
                                  control={<Radio />}
                                />
                              </RadioGroup>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="number"
                                  label="Cleared Amount"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="number"
                                  label="Rebate"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="number"
                                  label="Shelf Amount"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="number"
                                  label="Rebate VAT"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            {selectedOption.includes("Cheque") && (
                              <>
                                <Grid item xs={12}>
                                  <MDBox pb={2}>
                                    <hr></hr>
                                  </MDBox>
                                </Grid>
                                <Grid
                                  container
                                  rowSpacing={3}
                                  columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                                >
                                  <Grid item xs={4} pb={2}>
                                    <MDInput
                                      type="text"
                                      label="Cheque Number"
                                      variant="outlined"
                                      sx={{ width: 300 }}
                                    />
                                  </Grid>
                                  <Grid item xs={4} pb={2}>
                                    <MDInput
                                      type="text"
                                      label="Bank Name"
                                      variant="outlined"
                                      sx={{ width: 300 }}
                                    />
                                  </Grid>
                                  <Grid item xs={4} pb={2}>
                                    <MDInput
                                      type="date"
                                      label="Cheque Date"
                                      variant="outlined"
                                      sx={{ width: 300 }}
                                    />
                                  </Grid>
                                </Grid>
                              </>
                            )}
                            <Grid item xs={12}>
                              <MDBox pb={2}>
                                <hr></hr>
                              </MDBox>
                            </Grid>
                            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                              <Grid item xs={4} pb={2}>
                                <MDBox>
                                  <MDInput
                                    type="date"
                                    label="Invoices From Date"
                                    variant="outlined"
                                    sx={{ width: 300 }}
                                  />
                                </MDBox>
                              </Grid>
                              <Grid item xs={4}>
                                <MDBox>
                                  <MDInput
                                    type="date"
                                    label="to Date"
                                    variant="outlined"
                                    sx={{ width: 300 }}
                                  />
                                </MDBox>
                              </Grid>
                              <Grid item xs={3}>
                                <MDButton variant="gradient" color="info">
                                  Apply
                                </MDButton>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <DataGrid
            localeText={{noRowsLabel: "No records", }}
                                rows={rows}
                                columns={columns}
                                initialState={{
                                  pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                  },
                                }}
                                pageSizeOptions={[5, 10, 20]}
                              />
                              {/* <DataGrid
            localeText={{noRowsLabel: "No records", }} rows={rows} columns={columns} /> */}
                              {/* <MDButton
                                variant="contained"
                                color="secondary"
                                onClick={handleAddRow}
                              >
                                Add Row
                              </MDButton> */}
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Add_Collections;
