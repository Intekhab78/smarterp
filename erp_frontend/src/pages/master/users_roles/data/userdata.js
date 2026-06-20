/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import user from "assets/images/user.jpg";
import { Icon } from "@mui/material";

export default function userdata() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "user details", accessor: "user_details", width: "45%", align: "left" },
      { Header: "role", accessor: "role", align: "left" },
      { Header: "", accessor: "action", align: "center" },
    ],

    rows: [
      {
        user_details: <Author image={user} name="WH test (Active)" email="wh@gmail.com" />,
        role: <Job title="Warehouse" />,
        action: (
          <MDBox>
            <Icon fontSize="small">settings</Icon>
          </MDBox>
        ),
      },
      {
        user_details: <Author image={user} name="Shadab Khan (Active)" email="shadab@gmail.com" />,
        role: <Job title="Supervisor" />,
        action: (
          <MDBox>
            <Icon fontSize="small">settings</Icon>
          </MDBox>
        ),
      },
      {
        user_details: <Author image={user} name="Zuhair Iqbal (Active)" email="zuhair@gmail.com" />,
        role: <Job title="Supervisor" />,
        action: (
          <MDBox>
            <Icon fontSize="small">settings</Icon>
          </MDBox>
        ),
      },
      {
        user_details: <Author image={user} name="Admiral Food (Active)" email="info@admiral.com" />,
        role: <Job title="org-admin" />,
        action: (
          <MDBox>
            <Icon fontSize="small">settings</Icon>
          </MDBox>
        ),
      },
    ],
  };
}
