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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "route_code", headerName: "ROUTE CODE", width: 130 },
  { field: "route_name", headerName: "ROUTE NAME", width: 200 },
  { field: "target_value", headerName: "TARGET VALUE", width: 200 },
  { field: "start_date", headerName: "START DATE", width: 200 },
  { field: "end_date", headerName: "END DATE", width: 150 },
  { field: "status", headerName: "STATUS", width: 150 },
];

const rows = [
  {
    id: 1,
    route_code: "",
    route_name: "",
    target_value: "",
    start_date: "",
    end_date: "",
    status: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

export default function Sales_Target() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
                  <Grid item xs={3} mr={40}>
                    <MDTypography variant="h6" color="white">
                      <Icon fontSize="small">crisis_alert</Icon>
                      Sales Target
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={35}>
                    <MDTypography component={Link} to="#">
                      <MDButton variant="gradient" color="light">
                        &#x2b;New
                      </MDButton>
                    </MDTypography>
                  </Grid>
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
                  checkboxSelection
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
