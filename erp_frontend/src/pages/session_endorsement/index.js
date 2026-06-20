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
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const route = [
  { label: "FRESH11", value: "FRESH11" },
  { label: "ROUTE TEST21", value: "ROUTE TEST21" },
  { label: "FRESh12", value: "FRESh12" },
];

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "route_code", headerName: "ROUTE CODE", width: 200 },
  { field: "route_name", headerName: "ROUTE NAME", width: 200 },
  { field: "user_code", headerName: "USER CODE", width: 130 },
  { field: "user_name", headerName: "USER NAME", width: 200 },
  { field: "date", headerName: "DATE", width: 150 },
  { field: "status", headerName: "STATUS", width: 150 },
];

const rows = [
  {
    id: 1,
    route_code: "",
    route_name: "",
    user_code: "",
    user_name: "",
    date: "",
    status: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

export default function Session_Endorsement() {
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
                      {/* <Icon fontSize="small">sticky_note_2</Icon> */}
                      SESSION ENDORSEMENT
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
                </MDBox>
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
