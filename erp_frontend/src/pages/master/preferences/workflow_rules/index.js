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
import { Autocomplete, TextField } from "@mui/material";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import IconButton from "@mui/material/IconButton";
// import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const workflow = [
  { label: "Customer", value: "Customer" },
  { label: "Item", value: "Item" },
  { label: "Salesman", value: "Salesman" },
  { label: "Journey Plan", value: "Journey Plan" },
  { label: "Order", value: "Order" },
  { label: "Deliviery", value: "Deliviery" },
  { label: "Invoice", value: "Invoice" },
  { label: "Collection", value: "Collection" },
  { label: "Credit Note", value: "Credit Note" },
  { label: "Load Request", value: "Load Request" },
  { label: "Salesman Unload", value: "Salesman Unload" },
  { label: "Goods Receipt Notes", value: "Goods Receipt Notes" },
];

const rows = [
  {
    id: 1,
    name: "",
    type: "",
    status: "",
    action: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

function Workflow_Rules() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const response = axios
      .get("work-flow/list")
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
    { field: "work_flow_rule_name", headerName: "NAME", width: 200 },
    {
      field: "work_flow_rule_module",
      headerName: "MODULE",
      width: 200,
      renderCell: (params) => params?.value?.name + " ",
    },
    { field: "description", headerName: "DESCRIPTION", width: 200 },
    {
      field: "action",
      headerName: "",
      width: 200,
      renderCell: (params) => (
        <MDButton variant="text" color="info" component={Link} to="/master/route/edit">
          <Icon fontSize="small">edit</Icon>
        </MDButton>
      ),
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
                      Workflow Rules
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/workflow">
                      <MDButton variant="gradient" color="light">
                        &#x2b;&nbsp;New
                      </MDButton>
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <Grid item xs={6} pt={2} pl={85}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={workflow}
                  // style={{ height: 45 }}
                  sx={{ width: 300 }}
                  required
                  renderInput={(params) => <TextField {...params} />}
                ></Autocomplete>
              </Grid>
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

export default Workflow_Rules;
