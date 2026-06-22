import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
// Material Dashboard 2 React context
import { useMaterialUIController, setLayout } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const usertype = parseInt(localStorage.getItem("role_id")); // ⭐ get role

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    // when we want side nav bar
    <MDBox
      className="custome-layout"
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? "4.5rem" : "14.125rem",
          paddingTop: 0,
          paddingRight: 0,
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </MDBox>

    // when we do not want side navbar
    // <MDBox
    //   className="custome-layout"
    //   sx={({ breakpoints, transitions }) => ({
    //     p: usertype === 2 || usertype === 5 ? 0 : 3,
    //     position: "relative",

    //     [breakpoints.up("xl")]: {
    //       marginLeft:
    //         usertype === 2 || usertype === 5
    //           ? "0rem"
    //           : miniSidenav
    //           ? "4.5rem"
    //           : "14.125rem",

    //       paddingTop: usertype === 2 || usertype === 5 ? 0 : undefined,
    //       paddingRight: usertype === 2 || usertype === 5 ? 0 : undefined,

    //       transition: transitions.create(["margin-left", "margin-right"], {
    //         easing: transitions.easing.easeInOut,
    //         duration: transitions.duration.standard,
    //       }),
    //     },
    //   })}
    // >
    //   {children}
    // </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
