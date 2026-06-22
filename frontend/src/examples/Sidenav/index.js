import { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";

// MUI components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// MD components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom Sidenav
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Context
import { useMaterialUIController, setMiniSidenav } from "context";

function Sidenav({ brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;

  const location = useLocation();
  const [openItem, setOpenItem] = useState(null);

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    setMiniSidenav(dispatch, window.innerWidth < 1200);
  }, [dispatch]);

  const renderRoutes = routes.map(
    ({ type, name, icon, key, route, href, collapse, title }) => {
      // AUTO OPEN parent when a child route is active
      const hasActiveChild =
        Array.isArray(collapse) &&
        collapse.some((c) => location.pathname === c.route);

      if (type === "collapse") {
        return href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse name={name} icon={icon} active={false} />
          </Link>
        ) : (
          <SidenavCollapse
            key={key}
            name={name}
            icon={icon}
            route={route}
            collapse={collapse}
            active={location.pathname === route}
            openItem={openItem}
            setOpenItem={setOpenItem}
            forceOpen={hasActiveChild}
          />
        );
      }

      if (type === "title") {
        return (
          <MDTypography
            key={key}
            color="dark"
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      }

      if (type === "divider") {
        return <Divider key={key} sx={{ backgroundColor: "#e0e0e0" }} />;
      }

      return null;
    },
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{
        miniSidenav,
        transparentSidenav: false,
        whiteSidenav: true,
        darkMode: false,

        // whiteSidenav: false, // ❌ turn OFF white
        // darkMode: true, // ✅ enable dark
      }}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "#fff",
          color: "#000",
          borderRight: "1px solid #e0e0e0",
        },
      }}
      // sx={{
      //   "& .MuiDrawer-paper": {
      //     backgroundColor: "#000000", // 🔥 FORCE BLACK
      //     color: "#ffffff",
      //   },
      // }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <Icon sx={{ color: "#000" }}>close</Icon>
        </MDBox>

        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && (
            <MDBox component="img" src={brand} alt="Brand" width="2rem" />
          )}
          <MDBox sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}>
            <MDTypography variant="button" fontWeight="medium" color="dark">
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      <Divider sx={{ backgroundColor: "#e0e0e0" }} />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

Sidenav.propTypes = {
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
