/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { Link } from "react-router-dom";
import * as React from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";

// Data
import userdata from "./data/userdata";
import Roles from "./roles";

function User_Roles() {
  const { columns, rows } = userdata();

  const [value, setValue] = React.useState("1");

  const handleTab = (event, newValue) => {
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
                    <TabList onChange={handleTab}>
                      <Tab label=" Users" value="1" />
                      <Tab label="Role" value="2" />
                    </TabList>
                  </MDBox>
                  <TabPanel value="1">
                    <Grid item xs={1} ml={40}>
                      <MDTypography component={Link} to="/master/users">
                        <MDButton variant="gradient" color="light">
                          Invite User
                        </MDButton>
                      </MDTypography>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="2">
                    <Grid item xs={1} ml={40}>
                      <MDTypography component={Link} to="/master/role">
                        <MDButton variant="gradient" color="light">
                          New Role
                        </MDButton>
                      </MDTypography>
                    </Grid>
                  </TabPanel>
                </MDBox>
                <TabPanel value="1">
                  <MDBox pt={3}>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </TabPanel>
                <TabPanel value="2">
                  <Roles />
                </TabPanel>
              </TabContext>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default User_Roles;
