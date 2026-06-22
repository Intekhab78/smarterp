import { useState, useEffect, useMemo } from "react";
import "./index.css";
import "../src/assets/custome.css";
import { ReceiptProvider } from "./context/ReceiptContext";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import rtlPlugin from "stylis-plugin-rtl";
import { ToastContainer } from "react-toastify";
import createCache from "@emotion/cache";

import theme from "assets/theme";
import themeDark from "assets/theme-dark";

import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

import { routes } from "routes";
import { useMaterialUIController } from "context";

import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import SignIn from "./layouts/authentication/sign-in";
import ProtectedRoute from "pages/ProtectedRoute";
import constantApi from "constantApi";
import ReceiptLayout from "utils/ReceiptLayout";

export default function App() {
  const [controller] = useMaterialUIController();
  const {
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  /* ================================
     RTL
  ================================ */
  useMemo(() => {
    createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
  }, []);

  /* ================================
     AUTH + PERMISSIONS LOAD
  ================================ */
  useEffect(() => {
    document.body.setAttribute("dir", direction);

    const token = localStorage.getItem("token");
    const role_id = Number(localStorage.getItem("role_id"));
    const isAuthPage = location.pathname.startsWith("/auth");

    if (!token) {
      setIsLoading(false);
      if (!isAuthPage) navigate("/auth/login", { replace: true });
      return;
    }

    if (token && isAuthPage) {
      setIsLoading(false);
      navigate("/dashboard", { replace: true });
      return;
    }

    let storedPermissions = [];
    try {
      const permsStr = localStorage.getItem("permissions");
      if (permsStr) {
        storedPermissions = JSON.parse(permsStr);
        if (!Array.isArray(storedPermissions)) storedPermissions = [];
      }
    } catch {
      storedPermissions = [];
    }

    if (!storedPermissions.length && role_id !== 1) {
      fetch(`${constantApi.baseUrl}/role_permission/permissions/${role_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const activePermissions = (data.permissions || [])
            .filter((p) => p.status === "active")
            .map((p) => p.route_key?.toLowerCase())
            .filter(Boolean);

          localStorage.setItem(
            "permissions",
            JSON.stringify(activePermissions),
          );
          setPermissions(activePermissions); // set React state here
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    } else {
      setPermissions(storedPermissions); // set from localStorage if present
      setIsLoading(false);
    }
  }, [direction, navigate, location.pathname]);

  /* ================================
     RBAC ROUTE FILTER (SAFE)
  ================================ */

  const filterRoutesByPermission = (routes, permissions) => {
    const role_id = Number(localStorage.getItem("role_id"));

    // Admin bypass
    if (role_id === 1) return routes;

    const hasPermission = (key) =>
      permissions.some((p) => p.toLowerCase() === key.toLowerCase());

    const filteredRoutes = routes
      .map((route) => {
        if (!route.key) return null;

        if (Array.isArray(route.collapse)) {
          const allowedChildren = route.collapse.filter(
            (child) => child.key && hasPermission(child.key),
          );

          if (!allowedChildren.length) return null;

          return { ...route, collapse: allowedChildren };
        }

        return hasPermission(route.key) ? route : null;
      })
      .filter(Boolean);

    return filteredRoutes;
  };

  // const allowedRoutes = filterRoutesByPermission(routes);
  const allowedRoutes = filterRoutesByPermission(routes, permissions);

  /* ================================
     LOADER
  ================================ */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // this ofr the no side bar

  const noSidebarRoutes = ["/adds"];
  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  return (
    <ReceiptProvider>
      <ReceiptLayout /> {/* 🔥 THIS IS REQUIRED */}
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        <ToastContainer position="top-right" autoClose={3000} />

        {/* ================================
          SIDENAV
      ================================ */}
        {/* {layout === "dashboard" && (
        <Sidenav
          color={sidenavColor}
          brand={
            (transparentSidenav && !darkMode) || whiteSidenav
              ? brandDark
              : brandWhite
          }
          brandName="JTSERP"
          routes={allowedRoutes}
        />
      )} */}

        {/* //////////////////////////////////////////////////////////////// */}
        {/* above layout code is coorect below use for the avoid sidebar and navbar for video */}

        {layout === "dashboard" && !hideSidebar && (
          <Sidenav
            color={sidenavColor}
            brand={
              (transparentSidenav && !darkMode) || whiteSidenav
                ? // ? brandDark
                  // : brandWhite
                  brandWhite
                : brandDark
            }
            brandName="JTSERP"
            routes={allowedRoutes}
          />
        )}
        {/* ////////////////////////////////////////////////////////////// */}
        {layout === "vr" && <Configurator />}

        {/* ================================
          ROUTES
      ================================ */}
        <Routes>
          <Route path="/auth/login" element={<SignIn />} />

          {allowedRoutes.map((route) => {
            if (!route.key) return null;

            if (route.collapse) {
              return route.collapse.map((child) => (
                <Route
                  key={child.key}
                  path={child.route}
                  element={
                    <ProtectedRoute permission={child.key}>
                      {child.component}
                    </ProtectedRoute>
                  }
                />
              ));
            }

            if (route.route) {
              return (
                <Route
                  key={route.key}
                  path={route.route}
                  element={
                    <ProtectedRoute permission={route.key}>
                      {route.component}
                    </ProtectedRoute>
                  }
                />
              );
            }

            return null;
          })}

          {/* ================================
            FALLBACK
        ================================ */}
          <Route
            path="*"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
        </Routes>
      </ThemeProvider>
    </ReceiptProvider>
  );
}
