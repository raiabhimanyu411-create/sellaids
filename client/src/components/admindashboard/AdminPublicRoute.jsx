import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../../stores/useAdminStore";
import { useVendorStore } from "../../stores/useVendorStore";
import { useUserStore } from "../../stores/useUserStore";

const AdminPublicRoute = () => {
  const { isAuthenticated: isAdminAuth } = useAdminStore();
  const { isAuthenticated: isVendorAuth } = useVendorStore();
  const { isAuthenticated: isUserAuth } = useUserStore();

  // ✅ Agar already login hai to /admin bhej do
  if (isVendorAuth) return <Navigate to="/vendor" replace />;
  if (isUserAuth) return <Navigate to="/user" replace />;
  if (isAdminAuth) return <Navigate to="/admin" replace />;
  return <Outlet />;
};

export default AdminPublicRoute;
