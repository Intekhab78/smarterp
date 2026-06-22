import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../../../axios";

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

const rows = [
  {
    id: 1,
    activity_name: "",
    valid_from: "",
    valid_to: "",
    action: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

function Activity_Profile() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const response = axios
      .get("salesman-activity-profile/list")
      .then((response) => {
        var { data } = response?.data;
        setData(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
    console.log(response);
  }, []);

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    { field: "activity_name", headerName: "ACTIVITY NAME", width: 200 },
    { field: "valid_from", headerName: "VALID FROM", width: 200 },
    { field: "valid_to", headerName: "VALID TO", width: 200 },
    {
      field: "action",
      headerName: "ACTION",
      width: 200,
    },
  ];

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
                      Activity Profile
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/add-activity-profile">
                      <MDButton variant="gradient" color="light">
                        &#x2b;&nbsp;New
                      </MDButton>
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                <DataGrid
            localeText={{noRowsLabel: "No records", }}
                  rows={data}
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

export default Activity_Profile;
