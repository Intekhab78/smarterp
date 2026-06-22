import { Link } from "react-router-dom";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

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

function AddListing_Fee() {
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
                  Listing Fee
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
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
                    <Grid item xs={9}>
                      <MDBox pb={2}>
                        <MDInput
                          type="text"
                          label="Listing Fee Amount"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
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
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/listing-fee">
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

export default AddListing_Fee;
