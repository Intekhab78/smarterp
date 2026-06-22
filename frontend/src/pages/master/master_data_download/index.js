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
import MDButton from "components/MDButton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const columns = [
  { field: "id", headerName: "No.", width: 200 },
  { field: "name", headerName: "Name", width: 250 },
  { field: "description", headerName: "Description", width: 250 },
  {
    field: "action",
    headerName: "Action",
    width: 250,
    renderCell: (params) => (
      <MDButton
        variant="text"
        color="info"
        // component={Link}
        // to="/master/tax/edit"
        // onClick={() => handleRemoveRow(params.rowIndex)}
      >
        <Icon fontSize="small">download</Icon>
      </MDButton>
    ),
  },
];

const rows = [
  {
    id: 1,
    name: "",
    description: "",
    actions: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

function Master_Data_Download() {
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
                  <Grid item xs={4} mr={40}>
                    <MDTypography variant="h6" color="white">
                      {/* <Icon fontSize="small">account_balance</Icon> */}
                      Master Data Download
                    </MDTypography>
                  </Grid>
                  {/* <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/tax">
                      <MDButton variant="gradient" color="light">
                        &#x2b;&nbsp;New
                      </MDButton>
                    </MDTypography>
                  </Grid> */}
                </Grid>
              </MDBox>
              <MDBox pt={3}>
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
                  //   checkboxSelection
                  disableRowSelectionOnClick
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Master_Data_Download;
