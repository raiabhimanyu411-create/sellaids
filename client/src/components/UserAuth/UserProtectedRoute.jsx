// src/components/UserAuth/UserProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom"; // ← useLocation add kiya
import { useUserStore } from "../../stores/useUserStore";
import { useEffect, useState } from "react";

const UserProtectedRoute = () => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation(); // ← Yeh line add ki – current page ko yaad rakhega
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = useUserStore.getState().hydrate;
    hydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    // ← Yeh line update ki – current location ko state mein pass kar raha hai
    <Navigate to="/UserAuth/UserLogin" state={{ from: location }} replace />
  );
};

export default UserProtectedRoute;