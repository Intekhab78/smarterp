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
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import IconButton from "@mui/material/IconButton";
// import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// const columns = [
//   { field: "id", headerName: "ID", width: 90 },
//   { field: "bank_code", headerName: "BANK CODE", width: 150 },
//   { field: "bank_name", headerName: "BANK NAME", width: 150 },
//   { field: "account_number", headerName: "ACCOUNT NUMBER", width: 200 },
//   {
//     field: "bank_address",
//     headerName: "BANK ADDRESS",
//     width: 200,
//   },
//   {
//     field: "status",
//     headerName: "Status",
//     width: 150,
//   },
// ];

// const rows = [
//   {
//     id: 1,
//     bank_code: "BAN001",
//     bank_name: "Test Bank",
//     account_number: "51234882",
//     bank_address: "Dubai",
//     status: "Active",

//     //   <MDBox ml={-1}>
//     //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
//     //   </MDBox>
//     // ),
//   },
// ];

function Templates() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <TabContext value={value}>
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
                  <MDBox sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                      <Tab label="Invoice" value="1" />
                      <Tab label="Customer" value="2" />
                      <Tab label="Delivery" value="3" />
                      <Tab label="Credit Note" value="4" />
                    </TabList>
                  </MDBox>
                </MDBox>
                <TabPanel value="1">Item One</TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
                <TabPanel value="4">Item four</TabPanel>
              </TabContext>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Templates;
