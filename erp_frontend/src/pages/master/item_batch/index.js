import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../../axios";

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
    item_code: "",
    item_name: "",
    location: "",
    branch_plant: "",
    lot_serial_no: "",
    uom: "",
    qty: "",
    expiry_date: "",

    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

function Item_Batch() {
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
      .post("batch-list")
      .then((response) => {
        const { data } = response?.data;
        setData(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
    console.log(response);
  }, []);

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "item",
      headerName: "ITEM CODE",
      width: 150,
      renderCell: (params) => params?.value?.item_code + " ",
    },
    {
      field: "item_name",
      headerName: "ITEM NAME",
      width: 150,
      renderCell: (params) => params?.value?.item_name + " ",
    },
    { field: "location", headerName: "LOCATION", width: 150 },
    { field: "batch_mcu", headerName: "BRANCH PLANT", width: 150 },
    { field: "batch_number", headerName: "LOT SERIAL NO", width: 150 },
    { field: "uom_name", headerName: "UOM", width: 150 },
    { field: "current_in_stock", headerName: "QTY", width: 150 },
    { field: "expiry_date", headerName: "EXPIRY DATE", width: 150 },
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
                  <Grid item xs={4} mr={40}>
                    <MDTypography variant="h6" color="white">
                      {/* <Icon fontSize="small">account_balance</Icon> */}
                      Item Batch
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
                  rows={data}
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

export default Item_Batch;
