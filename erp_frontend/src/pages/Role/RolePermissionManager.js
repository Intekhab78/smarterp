import React, { useEffect, useState } from "react";
import axios from "axios";
import { flattenRoutes } from "../../utils/flattenRoutes";
import { routes } from "../../routes";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";

export default function RolePermissionManager() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);

  /* ============================
     FLATTEN ROUTES
  ============================ */
  useEffect(() => {
    setAllRoutes(flattenRoutes(routes));
  }, []);

  /* ============================
     FETCH ROLES
  ============================ */
  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/role_master/list`)
      .then((res) => setRoles(res.data.data || []))
      .catch(console.error);
  }, []);

  /* ============================
     FETCH PERMISSIONS
  ============================ */

  /* ============================
   FETCH PERMISSIONS
============================ */
  useEffect(() => {
    if (!selectedRole) return;

    console.log("🟡 Selected Role ID:", selectedRole);

    axios
      .get(`${constantApi.baseUrl}/role_permission/permissions/${selectedRole}`)
      .then(({ data }) => {
        console.log("🟢 API permissions response:", data.permissions);

        // const perms =
        //   data.permissions?.map((key) => ({
        //     route_key: key,
        //     status: "active", // ⚠️ forcing active
        //   })) || [];

        const perms =
          data.permissions?.map((p) => ({
            route_key: p.route_key,
            status: p.status,
          })) || [];

        setPermissions(perms);

        console.log("🔵 Permissions mapped in frontend:", perms);

        setPermissions(perms);
      })
      .catch((err) => {
        console.error("🔴 Error fetching permissions:", err);
        setPermissions([]);
      });
  }, [selectedRole]);

  /* ============================
   CHECK PERMISSION ACTIVE
============================ */
  const isPermissionActive = (routeKey) => {
    const result = permissions.some(
      (p) => p.route_key === routeKey && p.status === "active"
    );

    console.log(
      `🔍 Checking route: ${routeKey} =>`,
      result ? "CHECKED" : "UNCHECKED"
    );

    return result;
  };

  /* ============================
   TOGGLE PERMISSION
============================ */
  const togglePermission = (routeKey) => {
    console.log("🟣 Toggle clicked for:", routeKey);

    setPermissions((prev) => {
      console.log("🟠 Previous permissions:", prev);

      const exists = prev.find((p) => p.route_key === routeKey);

      if (exists) {
        const updated = prev.map((p) =>
          p.route_key === routeKey
            ? {
                ...p,
                status: p.status === "active" ? "inactive" : "active",
              }
            : p
        );

        console.log("🟢 Updated permissions:", updated);
        return updated;
      }

      const added = [...prev, { route_key: routeKey, status: "active" }];
      console.log("🟢 Added new permission:", added);

      return added;
    });
  };

  /* ============================
     SAVE PERMISSIONS
  ============================ */
  const savePermissions = () => {
    axios
      .post(`${constantApi.baseUrl}/role_permission/permissions`, {
        role_id: selectedRole,
        permissions,
      })
      .then(() => alert("Permissions saved successfully"))
      .catch(() => alert("Failed to save permissions"));
  };

  /* ============================
     UI
  ============================ */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="mb-5">
          <h1 className="text-lg font-semibold text-gray-800">
            Role Permission Management
          </h1>
          <p className="text-xs text-gray-500">
            Assign application access based on user roles
          </p>
        </div>

        {/* ROLE SELECT CARD */}
        <div className="bg-white border rounded-lg p-4 mb-5 shadow-sm">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Select Role
          </label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

        {/* PERMISSIONS CARD */}
        {selectedRole && (
          <div className="bg-white border rounded-lg shadow-sm">
            {/* CARD HEADER */}
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">
                Permissions
              </h2>
              <span className="text-xs text-gray-500">
                {permissions.filter((p) => p.status === "active").length} active
              </span>
            </div>

            {/* PERMISSION LIST */}
            <div className="p-4 max-h-[420px] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allRoutes.map(({ key, name }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={isPermissionActive(key)}
                      onChange={() => togglePermission(key)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="leading-tight">{name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-4 py-3 border-t flex justify-end bg-gray-50">
              <button
                onClick={savePermissions}
                className="text-sm bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
