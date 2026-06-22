import { Link } from "react-router-dom";
import { useState } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import PropTypes from "prop-types";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const listing_customer = [
  { label: "Customer CTest", value: "Customer CTest" },
  { label: "Test", value: "Test" },
  {
    label: "BIGMART EASY PICK SUPERMARKET-ANC-PARENT",
    value: "BIGMART EASY PICK SUPERMARKET-ANC-PARENT",
  },
  { label: "SELECT MARKET LLC-PARENT", value: "SELECT MARKET LLC-PARENT" },
];

const customer_lob = [{ label: "", value: "" }];

const rebate_type = [
  { label: "Value", value: "Value" },
  { label: "Percentage", value: "Percentage" },
];

function Add_Rebate() {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={9}>
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
                  Rebate
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={9}>
                      <FormLabel>Rebate Type:</FormLabel>
                      <RadioGroup
                        row
                        defaultValue={"cash"}
                        value={selectedValue}
                        onChange={handleChanged}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel value="cash" control={<Radio />} label="Cash Rebate" />
                        <FormControlLabel
                          value="discount"
                          control={<Radio />}
                          label="Additional Discount Rebate"
                        />
                        <FormControlLabel
                          value="target"
                          control={<Radio />}
                          label="Target Rebate"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="text"
                          label="Agreement Id"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput type="text" label="Name" variant="outlined" sx={{ width: 300 }} />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={listing_customer}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        required
                        renderInput={(params) => <TextField {...params} label="Customer" />}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={customer_lob}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        required
                        renderInput={(params) => <TextField {...params} label="Customer Lob" />}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="date"
                          label="From Date"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="date"
                          label="To Date"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    {selectedValue === "discount" && (
                      <>
                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                          <Grid item xs={6}>
                            <MDTypography>
                              <Checkbox {...label} />
                              Include Promotion Sales?
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDBox pb={2}>
                              <MDInput
                                type="text"
                                label="Apply On"
                                variant="outlined"
                                sx={{ width: 300 }}
                              />
                            </MDBox>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={6} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={rebate_type}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        required
                        renderInput={(params) => <TextField {...params} label="Rebate Type" />}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput type="text" label="Value" variant="outlined" sx={{ width: 300 }} />
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/rebate">
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

export default Add_Rebate;
