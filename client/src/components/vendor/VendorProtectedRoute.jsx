import { Navigate, Outlet } from "react-router-dom";
import { useVendorStore } from "../../stores/useVendorStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const VendorProtectedRoute = () => {
  const { isAuthenticated } = useVendorStore();

  useEffect(() => {
    if (!isAuthenticated) {
      // Delay slightly to avoid flicker / multiple calls
      const timeout = setTimeout(() => {
        toast.error("Please login to access vendor panel");
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated]);


// ✅ Render child routes if authenticated, otherwise navigate to login
  // ✅ If logged in → render child routes
  // ❌ Otherwise → redirect to vendor login
  return isAuthenticated ? <Outlet /> : <Navigate to="/vendor/login" replace />;
};

export default VendorProtectedRoute;
