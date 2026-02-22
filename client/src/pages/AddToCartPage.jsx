// src/pages/AddToCartPage.jsx
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import ATCSection from '../components/CartSection/ATCSection';

const AddToCartPage = () => {
  const { isAuthenticated } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/UserAuth/UserLogin" state={{ from: '/user/checkout' }} />;
  }

  return <ATCSection />;
};

export default AddToCartPage;