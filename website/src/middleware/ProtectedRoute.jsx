import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../CartContext/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // ⏳ wait for auth check
  if (loading) {
    return null; // or <Spinner />
  }

  // 🚫 not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ logged in
  return <Outlet />;
};

export default ProtectedRoute;
