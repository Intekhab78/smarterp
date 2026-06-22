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
import Menu from "@mui/material/Menu";
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

const customer = [
  { label: "TAJ MAHAL GROCERY - B2B", value: "TAJ MAHAL GROCERY - B2B" },
  { label: "AL SAFA SUPERMARKET - B2B", value: "AL SAFA SUPERMARKET - B2B" },
];

const invoice = [{ label: "", value: "" }];

const delivery_type = [
  { label: "Bill To Bill", value: "Bill To Bill" },
  { label: "Depot", value: "Depot" },
  { label: "Credit", value: "Credit" },
  { label: "Cash", value: "Cash" },
];

const payment_term = [
  { label: "Cash", value: "Cash" },
  { label: "BILL TO BILL PAYMENT AR", value: "BILL TO BILL PAYMENT AR" },
  { label: "Net 90 Days", value: "Net 90 Days" },
  { label: "NET 30 DAYS", value: "NET 30 DAYS" },
  { label: "Net 60 Days", value: "Net 60 Days" },
  { label: "Cash on Delivery", value: "Cash on Delivery" },
  { label: "Net 45 Days", value: "Net 45 Days" },
];

const salesman = [
  { label: "Dony Cherian", value: "Dony Cherian" },
  { label: "Abdul Razik", value: "Abdul Razik" },
  { label: "Test Salesman 1", value: "Test Salesman 1" },
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

function Edit_Delivery() {
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

  const [rows, setRows] = useState([]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        item_code: "",
        item_name: "",
        uom: "",
        quantity: "",
        price: "",
        excise: "",
        discount: "",
        net: "",
        vat: "",
        total: "",
        actions: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const columns = [
    { field: "id", headerName: "#", width: 100 },
    {
      field: "item_code",
      headerName: "ITEM CODE",
      width: 200,
      renderCell: (params) => (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={item}
          // style={{ height: 45 }}
          sx={{ width: 190 }}
          renderInput={(params) => <TextField {...params} label="Item" variant="standard" />}
        ></Autocomplete>
      ),
    },
    {
      field: "item_name",
      headerName: "ITEM NAME",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="text"
          // label="Item name"
          variant="standard"
          // sx={{ width: 200 }}
        />
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
          options={uom}
          // style={{ height: 45 }}
          sx={{ width: 190 }}
          renderInput={(params) => <TextField {...params} label="uom" variant="standard" />}
        ></Autocomplete>
      ),
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
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
      field: "price",
      headerName: "PRICE",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="standard"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "excise",
      headerName: "EXCISE",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="standard"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "discount",
      headerName: "DISCOUNT",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="standard"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "net",
      headerName: "NET",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="standard"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "vat",
      headerName: "VAT",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="standard"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "total",
      headerName: "TOTAL",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          // label="price"
          variant="standard"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "ACTION",
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const opened = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosed = () => {
    setAnchorEl(null);
  };

  const [hidden, setHidden] = useState("");

  const handleHiddenChange = (event) => {
    setHidden(event.target.value);
  };

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
                <Grid container spacing={1}>
                  <Grid item xs={2} mr={40}>
                    <MDTypography variant="h6" color="white">
                      <Icon fontSize="small">local_shipping</Icon>
                      Edit Delivery
                    </MDTypography>
                  </Grid>
                  <Grid item xs={2} ml={40}>
                    <MDBox>
                      <MDButton
                        aria-haspopup="true"
                        onClick={handleClick}
                        variant="gradient"
                        color="light"
                      >
                        More
                      </MDButton>
                    </MDBox>
                  </Grid>
                </Grid>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={opened}
                  onClose={handleClosed}
                  onClick={handleClosed}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleClosed}>Generate Invoice</MenuItem>
                  <MenuItem component={Link} to="/delivery">
                    Go to Deliveries
                  </MenuItem>
                </Menu>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={delivery_type}
                        style={{ height: 45 }}
                        sx={{ width: 650 }}
                        value={autocompleteValue}
                        onChange={handleAutocompleteChange}
                        renderInput={(params) => <TextField {...params} label="Delivery Type" />}
                      ></Autocomplete>
                      {showInputs && (
                        <>
                          <Grid
                            container
                            rowSpacing={2}
                            pt={3}
                            columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                          >
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={customer}
                                  style={{ height: 45 }}
                                  sx={{ width: 300 }}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Customer" />
                                  )}
                                ></Autocomplete>
                              </MDBox>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="text"
                                  label="Delivery Number"
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
                                    Delivery Code
                                  </BootstrapDialogTitle>
                                  <DialogContent dividers>
                                    <MDTypography style={{ fontSize: 17 }} gutterBottom>
                                      Your Delivery Code number are set an auto generate mode to
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
                                        label="Continue auto-generating Delivery Code"
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
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="date"
                                  label="Delivery Date"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={6} pb={2}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={salesman}
                                // style={{ height: 45 }}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Salesman" />}
                              ></Autocomplete>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="time"
                                  label="Delivery Time"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={6} pb={2}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={payment_term}
                                // style={{ height: 45 }}
                                sx={{ width: 300 }}
                                renderInput={(params) => (
                                  <TextField {...params} label="Payment Terms" />
                                )}
                              ></Autocomplete>
                            </Grid>
                            <Grid item xs={6}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="date"
                                  label="Due Date"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={12} pb={6}>
                              <DataGrid
            localeText={{noRowsLabel: "No records", }} rows={rows} columns={columns} disableRowSelectionOnClick />
                              <MDButton
                                variant="contained"
                                color="secondary"
                                onClick={handleAddRow}
                              >
                                Add Row
                              </MDButton>
                              <MDButton
                                variant="contained"
                                color="secondary"
                                onClick={handleAddRow}
                              >
                                Add Bulk Item
                              </MDButton>
                            </Grid>
                            <Grid item xs={12}>
                              <hr></hr>
                            </Grid>
                            <Grid item xs={7}>
                              <MDBox pb={2}>
                                <MDInput
                                  type="text"
                                  label="Customer Note"
                                  variant="outlined"
                                  sx={{ width: 300 }}
                                />
                              </MDBox>
                            </Grid>
                            <Grid item xs={5}>
                              <MDBox mx={2} px={6} py={2} pt={2} bgColor="light">
                                <Grid
                                  container
                                  // rowSpacing={1}
                                  columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                                >
                                  <Grid item xs={6} pt={1}>
                                    <MDTypography
                                      style={{ fontSize: 16 }}
                                      variant="caption"
                                      color="text"
                                      fontWeight="regular"
                                    >
                                      Gross Total
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6} pt={1}>
                                    <MDTypography
                                      style={{ fontSize: 17 }}
                                      variant="caption"
                                      color="dark"
                                      fontWeight="medium"
                                    >
                                      AED0.00
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 16 }}
                                      variant="caption"
                                      color="text"
                                      fontWeight="regular"
                                    >
                                      Discount
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 17 }}
                                      variant="caption"
                                      color="dark"
                                      fontWeight="medium"
                                    >
                                      AED0.00
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 16 }}
                                      variant="caption"
                                      color="text"
                                      fontWeight="regular"
                                    >
                                      Net Total
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 17 }}
                                      variant="caption"
                                      color="dark"
                                      fontWeight="medium"
                                    >
                                      AED0.00
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 16 }}
                                      variant="caption"
                                      color="text"
                                      fontWeight="regular"
                                    >
                                      Excise
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 17 }}
                                      variant="caption"
                                      color="dark"
                                      fontWeight="medium"
                                    >
                                      AED0.00
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 16 }}
                                      variant="caption"
                                      color="text"
                                      fontWeight="regular"
                                    >
                                      Vat
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 17 }}
                                      variant="caption"
                                      color="dark"
                                      fontWeight="medium"
                                    >
                                      AED0.00
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 16 }}
                                      variant="caption"
                                      color="text"
                                      fontWeight="regular"
                                    >
                                      Total
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MDTypography
                                      style={{ fontSize: 17 }}
                                      variant="caption"
                                      color="dark"
                                      fontWeight="medium"
                                    >
                                      AED0.00
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6} pb={1} pt={2}>
                                    <MDTypography
                                      style={{ fontSize: 18 }}
                                      variant="caption"
                                      color="dark"
                                      fontWeight="medium"
                                    >
                                      Total
                                    </MDTypography>
                                  </Grid>
                                  <Grid item xs={6} pb={1} pt={2}>
                                    <MDTypography
                                      style={{ fontSize: 18 }}
                                      variant="caption"
                                      color="dark"
                                      fontWeight="medium"
                                    >
                                      AED0.00
                                    </MDTypography>
                                  </Grid>
                                </Grid>
                              </MDBox>
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

export default Edit_Delivery;
