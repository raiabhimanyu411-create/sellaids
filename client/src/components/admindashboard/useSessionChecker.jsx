import { useEffect } from "react";
import { useAdminStore } from "../../stores/useAdminStore";

export const useSessionChecker = () => {
  const { isAuthenticated, checkSession } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      checkSession(); // backend से check करेगा
    }, 1000); // हर 20 सेकंड पर check

    return () => clearInterval(interval);
  }, [isAuthenticated]);
};