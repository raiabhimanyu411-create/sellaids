import { Navigate, Outlet } from "react-router-dom";
import { useVendorStore } from "../../stores/useVendorStore";

const VendorPublicRoute = () => {
  const { isAuthenticated } = useVendorStore();

  // ✅ Agar already login hai to /vendor bhej do
  return isAuthenticated ? <Navigate to="/vendor" replace /> : <Outlet />;
};

export default VendorPublicRoute;