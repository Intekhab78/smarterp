import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import IconButton from "@mui/material/IconButton";
// import MDBadge from "components/MDBadge";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "bank_code", headerName: "BANK CODE", width: 150 },
  { field: "bank_name", headerName: "BANK NAME", width: 150 },
  { field: "account_number", headerName: "ACCOUNT NUMBER", width: 200 },
  {
    field: "bank_address",
    headerName: "BANK ADDRESS",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
  },
];

const rows = [
  {
    id: 1,
    bank_code: "BAN001",
    bank_name: "Test Bank",
    account_number: "51234882",
    bank_address: "Dubai",
    status: "Active",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

function Portal() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
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
                      {/* <Icon fontSize="small">account_balance</Icon> */}
                      Portal
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3} pl={2}>
                <MDTypography variant="h5" fontWeight="small" color="black" mt={1}>
                  Client Portal
                </MDTypography>
                <MDBox>
                  <hr></hr>
                </MDBox>
                <MDBox pb={2} pt={2} pl={4}>
                  <MDInput
                    type="text"
                    label="Portal Name:"
                    variant="outlined"
                    sx={{ width: 400 }}
                  />
                  <MDButton variant="gradient" color="info">
                    Edit
                  </MDButton>
                </MDBox>
                <MDBox pb={2} pl={4}>
                  <MDInput type="text" label="Portal URL:" variant="outlined" sx={{ width: 400 }} />
                  <MDButton fontSize="large">
                    <Icon fontSize="large">content_copy</Icon>
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Portal;
