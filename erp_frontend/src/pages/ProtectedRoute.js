import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ permission, children }) => {
  let permissions = [];

  try {
    const permsStr = localStorage.getItem("permissions");
    if (permsStr) {
      permissions = JSON.parse(permsStr);
      if (!Array.isArray(permissions)) permissions = [];
    }
  } catch {
    permissions = [];
  }

  const role_id = Number(localStorage.getItem("role_id"));
  if (role_id === 1) {
    return children;
  }

  const hasPermission = permissions.some(
    (p) => p.toLowerCase() === permission.toLowerCase()
  );

  if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ permission, children }) => {
//   const role_id = Number(localStorage.getItem("role_id"));
//   const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

//   // Admin → full access
//   if (role_id === 1) {
//     return children;
//   }

//   if (!permissions.includes(permission)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
