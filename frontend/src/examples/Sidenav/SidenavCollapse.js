import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

function SidenavCollapse({
  icon,
  name,
  route,
  collapse,
  active,
  openItem,
  setOpenItem,
  forceOpen = false,
}) {
  const location = useLocation();
  const [controller] = useMaterialUIController();
  const {
    miniSidenav,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    sidenavColor,
  } = controller;

  // const isOpen = forceOpen || openItem === name;
  const isOpen = openItem === name;

  const toggleCollapse = () => {
    setOpenItem(isOpen ? null : name);
  };

  // DROPDOWN (PARENT)
  if (collapse) {
    return (
      <>
        <ListItem component="li">
          <MDBox
            onClick={toggleCollapse}
            sx={(theme) =>
              collapseItem(theme, {
                active: isOpen,
                transparentSidenav,
                whiteSidenav,
                darkMode,
                sidenavColor,
              })
            }
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <MDBox display="flex" alignItems="center">
              <ListItemIcon
                sx={(theme) =>
                  collapseIconBox(theme, {
                    transparentSidenav,
                    whiteSidenav,
                    darkMode,
                    active: isOpen,
                  })
                }
              >
                <Icon sx={(theme) => collapseIcon(theme, { active: isOpen })}>
                  {icon}
                </Icon>
              </ListItemIcon>

              <ListItemText
                primary={name}
                sx={(theme) => ({
                  ...collapseText(theme, {
                    miniSidenav,
                    transparentSidenav,
                    whiteSidenav,
                    active: isOpen,
                  }),
                  color: "#000",
                })}
              />
            </MDBox>

            {/* <Icon sx={{ color: "#000" }}> */}
            {/* <Icon sx={{ fontSize: "20px", color: "#000" }}>
              {isOpen ? "expand_more" : "chevron_right"}
            </Icon> */}
            <Icon
              sx={{
                fontSize: "20px",
                color: "#000 !important",
              }}
            >
              {isOpen ? "expand_more" : "chevron_right"}
            </Icon>
          </MDBox>
        </ListItem>

        {/* CHILDREN */}
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {collapse.map((item) => {
              const childActive = location.pathname === item.route;

              return (
                <ListItem
                  key={item.key}
                  component="li"
                  sx={{
                    padding: 0,
                  }}
                >
                  <NavLink
                    to={item.route}
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    <MDBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "6px 16px 6px 56px", // ✅ compact height
                        borderRadius: "6px",
                        margin: "2px 16px",
                        backgroundColor: childActive
                          ? "rgba(0,0,0,0.08)"
                          : "transparent",
                        cursor: "pointer",

                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.name}
                        sx={{
                          margin: 0,
                          "& span": {
                            fontSize: "0.875rem",
                            fontWeight: childActive ? 600 : 400,
                            color: "#000",
                          },
                        }}
                      />
                    </MDBox>
                  </NavLink>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  // SINGLE ITEM
  return (
    <ListItem component="li">
      <NavLink to={route} style={{ textDecoration: "none", width: "100%" }}>
        <MDBox
          sx={(theme) =>
            collapseItem(theme, {
              active,
              transparentSidenav,
              whiteSidenav,
              darkMode,
              sidenavColor,
            })
          }
        >
          <ListItemIcon
            sx={(theme) =>
              collapseIconBox(theme, {
                transparentSidenav,
                whiteSidenav,
                darkMode,
                active,
              })
            }
          >
            <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={(theme) => ({
              ...collapseText(theme, {
                miniSidenav,
                transparentSidenav,
                whiteSidenav,
                active,
              }),
              color: "#000",
            })}
          />
        </MDBox>
      </NavLink>
    </ListItem>
  );
}

SidenavCollapse.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string.isRequired,
  route: PropTypes.string,
  collapse: PropTypes.array,
  active: PropTypes.bool,
  openItem: PropTypes.string,
  setOpenItem: PropTypes.func,
  forceOpen: PropTypes.bool,
};

export default SidenavCollapse;
