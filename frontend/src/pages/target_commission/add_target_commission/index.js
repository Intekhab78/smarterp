import { Link } from "react-router-dom";
import { useState } from "react";
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
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const target_entity = [
  { label: "Route", value: "Route" },
  { label: "Salesman", value: "Salesman" },
  { label: "Region", value: "Region" },
];

const target_owner = [
  { label: "Abdul Razik", value: "Abdul Razik" },
  { label: "Test Salesman", value: "Test Salesman" },
];

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

function Add_Target_Commission() {
  const [rows, setRows] = useState([]);

  const handleAddRow = () => {
    setRows([...rows, { id: "", name: "", email: "", profile: "" }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "profile", headerName: "Profile", width: 200 },
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
                <MDTypography variant="h6" color="white">
                  <Icon fontSize="small">crisis_alert</Icon>
                  Add Target Commission
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={9}>
                      <MDBox pb={2}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={target_entity}
                          style={{ height: 45 }}
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} label="Target Entity" />}
                        ></Autocomplete>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="text"
                          label="Target Name"
                          variant="outlined"
                          required
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography sx={{ fontSize: 16 }}>Apply On</MDTypography>
                      <RadioGroup row name="use-radio-group" defaultValue="item">
                        <MyFormControlLabel value="item" label="Item" control={<Radio />} />
                        <MyFormControlLabel value="header" label="Header" control={<Radio />} />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={target_owner}
                          style={{ height: 45 }}
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} label="Target Owner" />}
                        ></Autocomplete>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography sx={{ fontSize: 16 }}>Target Type</MDTypography>
                      <RadioGroup row name="use-radio-group" defaultValue="quantity">
                        <MyFormControlLabel value="quantity" label="Quantity" control={<Radio />} />
                        <MyFormControlLabel value="value" label="Value" control={<Radio />} />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="date"
                          label="Start Date"
                          variant="outlined"
                          required
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography sx={{ fontSize: 16 }}>Target Variance</MDTypography>
                      <RadioGroup row name="use-radio-group" defaultValue="fixed">
                        <MyFormControlLabel value="fixed" label="Fixed" control={<Radio />} />
                        <MyFormControlLabel value="slab" label="Slab" control={<Radio />} />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="date"
                          label="End Date"
                          variant="outlined"
                          required
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography sx={{ fontSize: 16 }}>Commission Type</MDTypography>
                      <RadioGroup row name="use-radio-group" defaultValue="fixed">
                        <MyFormControlLabel value="fixed" label="Fixed" control={<Radio />} />
                        <MyFormControlLabel
                          value="percentage"
                          label="Percentage"
                          control={<Radio />}
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography sx={{ fontSize: 16 }}>Brand Wise</MDTypography>
                      <RadioGroup row name="use-radio-group" defaultValue="no">
                        <MyFormControlLabel value="yes" label="Yes" control={<Radio />} />
                        <MyFormControlLabel value="no" label="No" control={<Radio />} />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography sx={{ fontSize: 16 }}>Category Wise</MDTypography>
                      <RadioGroup row name="use-radio-group" defaultValue="no">
                        <MyFormControlLabel value="yes" label="Yes" control={<Radio />} />
                        <MyFormControlLabel value="no" label="No" control={<Radio />} />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12}>
                      <DataGrid
            localeText={{noRowsLabel: "No records", }} rows={rows} columns={columns} />
                      <MDButton variant="contained" color="secondary" onClick={handleAddRow}>
                        Add Row
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/target-comission">
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

export default Add_Target_Commission;
