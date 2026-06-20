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
    role_name: "",
    description: "",
    action: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

function Roles() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // var token = localStorage.getItem("token");
    // const config = {
    //   headers: {
    //     "Content-type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // };
    const response = axios
      .get("org-roles/list")
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
    { field: "name", headerName: "ROLE NAME", width: 300 },
    { field: "description", headerName: "DESCRIPTION", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <MDBox>
          <MDButton variant="text" color="info" component={Link} to="/master/reason/edit">
            <Icon fontSize="small">edit</Icon>
          </MDButton>
          <MDButton variant="text" color="info">
            <Icon fontSize="small">delete</Icon>
          </MDButton>
        </MDBox>
      ),
    },
  ];

  return (
    <MDBox pt={6} pb={3}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
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
  );
}

export default Roles;
