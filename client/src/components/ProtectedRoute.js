import React from 'react'
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
