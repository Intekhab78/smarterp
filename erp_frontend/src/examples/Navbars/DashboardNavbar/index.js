import { useState, useEffect, useMemo } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import MDTypography from "components/MDTypography";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import MegaMenu from "../../../adminPages/MegaMenu";
import { axios_get, axios_post } from "../../../axios";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import constantApi from "constantApi";
import axios from "axios";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();

  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
    direction,
  } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [openFullScreenModal, setOpenFullScreenModal] = useState(false);
  const [usertype, setusertype] = useState(0);
  const navigate = useNavigate();
  const route = useLocation().pathname.split("/").slice(1);
  const [data, setData] = useState([]);
  const [compines, setCompines] = useState([]);
  const [locations, setlocations] = useState([]);

  const user_data = JSON.parse(localStorage.getItem("user_data"));
  const isAdmin = Number(user_data?.usertype) === 1;
  // console.log("user data is -----------", user_data);
  const [posFilter, setPosFilter] = useState({
    company_id: null,
    location_id: null,
  });
  // localStorage.setItem(
  //   "pos_filter",
  //   JSON.stringify({
  //     company_id: user_data.company_id,
  //     location_id: user_data.location_id,
  //   })
  // );

  useEffect(() => {
    const savedFilter = JSON.parse(localStorage.getItem("pos_filter"));
    if (savedFilter) {
      setPosFilter(savedFilter);

      if (savedFilter.company_id) {
        setSelectedCompany(savedFilter.company_id);
        fetchlocationList(savedFilter.company_id);
      }

      if (savedFilter.location_id) {
        setSelectedLocation(savedFilter.location_id);
      }
    } else {
      // fallback (first time login)
      const defaultFilter = {
        company_id: user_data.company_id,
        location_id: user_data.location_id,
      };

      setPosFilter(defaultFilter);
      setSelectedCompany(defaultFilter.company_id);
      setSelectedLocation(defaultFilter.location_id);

      localStorage.setItem("pos_filter", JSON.stringify(defaultFilter));
      fetchlocationList(defaultFilter.company_id);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("pos_filter");

    if (!saved && user_data) {
      const initialFilter = {
        company_id: user_data.company_id,
        location_id: user_data.location_id,
      };

      console.log("initialFilter------------------", initialFilter);

      localStorage.setItem("pos_filter", JSON.stringify(initialFilter));
      setPosFilter(initialFilter);
      setSelectedCompany(initialFilter.company_id);
      setSelectedLocation(initialFilter.location_id);
      fetchlocationList(initialFilter.company_id);
    }
  }, []);

  const fetchcompanyList = async () => {
    try {
      const response = await axios.post(`${constantApi.baseUrl}/company/list`);
      if (response.data?.status) {
        const records = response.data?.data?.records || [];
        if (isAdmin) {
          setCompines(records);
        } else {
          setCompines(
            records.filter(
              (c) => Number(c.id) === Number(user_data?.company_id)
            )
          );
        }
      }
    } catch (error) {
      console.error("Company list fetch error:", error);
      setCompines([]); // safety fallback
    }
  };

  const fetchlocationList = async (companyId) => {
    const response = await axios_post(true, "location/com_loc_list", {
      company_id: companyId,
    });

    if (response?.status) {
      let filteredLocations = response.data.filter(
        (loc) => Number(loc.compdesc) === Number(companyId)
      );

      // Admin → see all matched locations
      if (isAdmin) {
        setlocations(filteredLocations);
      }
      // Normal user → only their assigned location
      else {
        setlocations(
          filteredLocations.filter(
            (loc) => Number(loc.id) === Number(user_data.location_id)
          )
        );
      }
    }
  };

  // const handleCompanyChange = (event) => {
  //   const companyId = event.target.value;

  //   const updatedFilter = {
  //     company_id: companyId,
  //     location_id: null, // reset location
  //   };

  //   setSelectedCompany(companyId);
  //   setSelectedLocation("");
  //   setPosFilter(updatedFilter);

  //   localStorage.setItem("pos_filter", JSON.stringify(updatedFilter));
  //   window.dispatchEvent(new Event("posFilterChanged"));

  //   fetchlocationList(companyId);
  // };

  // const handleLocationChange = (event) => {
  //   const locationId = event.target.value;

  //   const updatedFilter = {
  //     ...posFilter,
  //     location_id: locationId,
  //   };

  //   setSelectedLocation(locationId);
  //   setPosFilter(updatedFilter);

  //   localStorage.setItem("pos_filter", JSON.stringify(updatedFilter));
  //   window.dispatchEvent(new Event("posFilterChanged"));
  // };

  const handleCompanyChange = (event) => {
    const companyId = event.target.value;

    const updatedFilter = {
      company_id: companyId,
      location_id: null,
    };

    console.log("Company changed →", updatedFilter);

    setSelectedCompany(companyId);
    setSelectedLocation("");
    setPosFilter(updatedFilter);

    localStorage.setItem("pos_filter", JSON.stringify(updatedFilter));
    window.dispatchEvent(new Event("posFilterChanged"));

    fetchlocationList(companyId);
  };

  const handleLocationChange = (event) => {
    const locationId = event.target.value;

    const updatedFilter = {
      ...posFilter,
      location_id: locationId,
    };

    console.log("Location changed →", updatedFilter);

    setSelectedLocation(locationId);
    setPosFilter(updatedFilter);

    localStorage.setItem("pos_filter", JSON.stringify(updatedFilter));
    window.dispatchEvent(new Event("posFilterChanged"));
  };

  useEffect(() => {
    const handler = () => {
      const updated = JSON.parse(localStorage.getItem("pos_filter"));
      console.log("pos_filter changed:", updated);
    };

    window.addEventListener("posFilterChanged", handler);
    return () => window.removeEventListener("posFilterChanged", handler);
  }, []);

  useEffect(() => {
    fetchcompanyList();
    // fetchlocationList();
    if (user_data?.company_id) {
      fetchlocationList(user_data.company_id);
    }

    if (fixedNavbar) setNavbarType("fixed");
    else setNavbarType("static");

    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handle = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    });

    if (result.isConfirmed) {
      // localStorage.clear();
      // navigate("/auth/login");

      // ✅ Remove only auth-related data
      localStorage.removeItem("token");
      localStorage.removeItem("role_id");
      localStorage.removeItem("permissions");
      localStorage.removeItem("user_data");

      // ✅ FORCE hard reload (important)
      window.location.replace("/auth/login");
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
    let tokenGet = localStorage.getItem("token");
    if (!tokenGet) return navigate("/auth/login");
    let usertype = localStorage.getItem("usertype");
    setusertype(usertype);
  }, [direction]);

  const handleClickMenu = () => {
    setOpenFullScreenModal(true);
  };

  const handleCloseFullScreenModal = () => {
    setOpenFullScreenModal(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredRows = useMemo(() => {
    return data.filter((row) => {
      const itemCodeMatch = row.route;
      return itemCodeMatch?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pos_filter"));

    if (saved?.company_id) {
      setSelectedCompany(saved.company_id);
      fetchlocationList(saved.company_id);
    }

    if (saved?.location_id) {
      setSelectedLocation(saved.location_id);
    }
  }, []);

  useEffect(() => {
    const savedFilter = JSON.parse(localStorage.getItem("pos_filter"));
    if (savedFilter) {
      if (savedFilter.company_id) {
        setSelectedCompany(savedFilter.company_id);
        fetchlocationList(savedFilter.company_id); // load relevant locations
      }

      if (savedFilter.location_id) {
        setSelectedLocation(savedFilter.location_id);
      }
    }
  }, [compines.length]); // run after companies are loaded

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <MDBox px={2} py={1}>
        <FormControl fullWidth size="small" style={{ marginTop: 2 }}>
          <InputLabel>Select Company</InputLabel>
          <Select
            value={selectedCompany}
            label="Select Company"
            onChange={handleCompanyChange}
          >
            {compines.map((comp) => (
              <MenuItem key={comp.id} value={comp.id}>
                {comp.compdesc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 1 }} />

        <FormControl fullWidth size="small" style={{ marginTop: 4 }}>
          <InputLabel>Select Location</InputLabel>
          <Select
            value={selectedLocation}
            label="Select Location"
            onChange={handleLocationChange}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {loc.locname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 1 }} />
      </MDBox>

      <Link to="/change-password" style={{ textDecoration: "none" }}>
        <NotificationItem
          icon={<Icon>password</Icon>}
          title="Password Change"
        />
      </Link>
    </Menu>
  );

  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  const [empId, setEmpId] = useState(null);

  useEffect(() => {
    const role_id = Number(localStorage.getItem("role_id"));
    if (role_id) {
      console.log("Employee ID from localStorage:", role_id);

      setEmpId(role_id);
    }
  }, []);

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <IconButton
            size="small"
            disableRipple
            color="inherit"
            onClick={handleMiniSidenav}
          >
            <Icon sx={iconsStyle} fontSize="medium">
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton>

          {empId === 1 && (
            <Button size="small" color="inherit" onClick={handleClickMenu}>
              Menu
            </Button>
          )}
          {/* {empId != 2 ||
            (empId != 5 && (
              <Button size="small" color="inherit" onClick={handleClickMenu}>
                Menu
              </Button>
            ))} */}
        </MDBox>

        {!isMini && (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? "white" : "inherit"}>
              {user_data && (
                <>
                  <IconButton sx={navbarIconButton} size="small" disableRipple>
                    {user_data.firstname} {user_data.lastname}
                  </IconButton>
                </>
              )}

              <IconButton
                sx={navbarIconButton}
                size="small"
                disableRipple
                onClick={handle}
              >
                <Icon sx={iconsStyle}>logout</Icon>
              </IconButton>

              <IconButton
                sx={navbarIconButton}
                onClick={handleOpenMenu}
                size="small"
                disableRipple
              >
                <Icon sx={iconsStyle}>account_circle</Icon>
              </IconButton>
              {renderMenu()}

              <Dialog
                style={{ padding: "50px 50px" }}
                fullScreen
                open={openFullScreenModal}
                onClose={handleCloseFullScreenModal}
              >
                <MegaMenu />
                <DialogActions>
                  <MDButton
                    onClick={handleCloseFullScreenModal}
                    variant="gradient"
                    color="secondary"
                  >
                    Close
                  </MDButton>
                </DialogActions>
              </Dialog>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
