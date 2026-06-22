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

const channel_name = [
  { label: "RT", value: "RT" },
  { label: "TRD", value: "TRD" },
  { label: "FS", value: "FS" },
  { label: "MRD", value: "MRD" },
];

const document_type = [
  { label: "Sales Return", value: "Sales Return" },
  { label: "Expiry", value: "Expiry" },
  { label: "Quality Return", value: "Quality Return" },
];

function Add_JDE_Config() {
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
                  Add JDE Configuration
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid item xs={6} pb={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={channel_name}
                      // style={{ height: 45 }}
                      sx={{ width: 300 }}
                      required
                      renderInput={(params) => <TextField {...params} label="Channel Name" />}
                    ></Autocomplete>
                  </Grid>
                  <Grid item xs={6} pb={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={document_type}
                      // style={{ height: 45 }}
                      sx={{ width: 300 }}
                      required
                      renderInput={(params) => <TextField {...params} label="Document Type" />}
                    ></Autocomplete>
                  </Grid>
                  <Grid item xs={6}>
                    <MDBox pb={2}>
                      <MDInput
                        type="number"
                        label="Version"
                        variant="outlined"
                        required
                        sx={{ width: 300 }}
                      />
                    </MDBox>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/jd-version-config">
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

export default Add_JDE_Config;
