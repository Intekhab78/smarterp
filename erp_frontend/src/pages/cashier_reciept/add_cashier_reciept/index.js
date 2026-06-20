import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState } from "react";

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDBadge from "components/MDBadge";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const route = [
  { label: "FRESH11", value: "FRESH11" },
  { label: "ROUTE TEST21", value: "ROUTE TEST21" },
  { label: "FRESh12", value: "FRESh12" },
];

const bank = [
  { label: "Test Bank 02", value: "Test Bank 02" },
  { label: "Test Bank", value: "Test Bank" },
];

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "receipt_no", headerName: "Receipt No", width: 200 },
  { field: "receipt_date", headerName: "Receipt Date", width: 200 },
  { field: "type", headerName: "Type", width: 100 },
  { field: "customer_code", headerName: "Customer Code", width: 200 },
  { field: "customer_name", headerName: "Customer Name", width: 200 },
  { field: "invoice_no", headerName: "Invoice No.", width: 200 },
  { field: "inv_amt", headerName: "Inv. Amt", width: 150 },
  { field: "paid", headerName: "Paid", width: 150 },
  { field: "balance", headerName: "Balance", width: 150 },
  { field: "stamp", headerName: "Stamp", width: 150 },
];

const rows = [
  {
    id: 1,
    receipt_no: "",
    receipt_date: "",
    type: "",
    customer_code: "",
    customer_name: "",
    invoice_no: "",
    inv_amt: "",
    paid: "",
    balance: "",
    stamp: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

const tableData = [
  {
    cash: 0.0,
    credit: 0.0,
    discrepancy: 0.0,
    total: 0.0,
  },
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

export default function Add_Cashier_Reciept() {
  const [selectedValue, setSelectedValue] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

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
                  <Grid item xs={3} mr={40}>
                    <MDTypography variant="h6" color="white">
                      {/* <Icon fontSize="small">sticky_note_2</Icon> */}
                      Add Cashier Receipt
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={4} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={route}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        required
                        renderInput={(params) => <TextField {...params} label="Route " />}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={4}>
                      <MDBox>
                        <MDInput type="date" label="DATE" variant="outlined" sx={{ width: 300 }} />
                      </MDBox>
                    </Grid>
                    <Grid item xs={3}>
                      <MDButton variant="gradient" color="info">
                        Populate
                      </MDButton>
                    </Grid>
                  </Grid>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={4}>
                      <TableContainer sx={{ maxHeight: "300px" }} component={Paper}>
                        <Table stickyHeader aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Cash</TableCell>
                              <TableCell>Credit</TableCell>
                              <TableCell>Discrepancy</TableCell>
                              <TableCell>Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tableData.map((row) => (
                              <TableRow
                                key={row.cash}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                              >
                                <TableCell>{row.cash}</TableCell>
                                <TableCell>{row.credit}</TableCell>
                                <TableCell>{row.discrepancy}</TableCell>
                                <TableCell>{row.total}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                  <MDBox pt={3} pb={2}>
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
                  </MDBox>
                  <MDBox pb={2}>
                    <hr></hr>
                  </MDBox>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="number"
                          label="Total Amount"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="number"
                          label="Received Amount"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="number"
                          label="Variance"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput type="date" label="Date" variant="outlined" sx={{ width: 300 }} />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="text"
                          label="Slip No"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={bank}
                          // style={{ height: 45 }}
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} label="Bank" />}
                        ></Autocomplete>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="text"
                          label="Cashier Receipt No"
                          variant="outlined"
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
                            Cashier Receipt Code
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                              Your Cashier Receipt Code number are set an auto generate mode to save
                              your time. Are you sure about changing this setting?
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
                                label="Continue auto-generating Cashier Receipt Code"
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
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/cashier-reciept">
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
