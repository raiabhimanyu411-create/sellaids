import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

const UserPublicRoute = () => {
  const { isAuthenticated, loading } = useUserStore();

  if (loading) return null;

  return isAuthenticated ? <Navigate to="/user" replace /> : <Outlet />;
};

export default UserPublicRoute;