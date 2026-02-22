// src/pages/CheckoutPage.jsx
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import CheckoutSection from '../components/CartSection/CheckoutSection';

const CheckoutPage = () => {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/UserAuth/UserLogin" state={{ from: '/checkout' }} />;
  }

  return <CheckoutSection />;
};

export default CheckoutPage;