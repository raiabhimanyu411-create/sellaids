import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../../stores/useAdminStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AdminProtectedRoute = () => {
  const { isAuthenticated } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access admin panel");
    }
  }, [isAuthenticated]);

  // ✅ Agar login hai to child routes render karo
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export default AdminProtectedRoute;