import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useUserStore } from "./stores/useUserStore";

// ===================== EAGER IMPORTS (Layouts & Core) =====================
// These are needed immediately, so no lazy loading
import Layout from "./Layout";
import VendorDashboardLayout from "./Layout/VendorDashboardLayout";
import DashboardLayout from "./components/DashboardLayout";

// Protected/Public Route Guards (needed early)
import VendorPublicRoute from "./components/vendor/VendorPublicRoute";
import VendorProtectedRoute from "./components/vendor/VendorProtectedRoute";
import UserPublicRoute from "./components/UserAuth/UserPublicRoute";
import UserProtectedRoute from "./components/UserAuth/UserProtectedRoute";
import AdminPublicRoute from "./components/admindashboard/AdminPublicRoute";
import AdminProtectedRoute from "./components/admindashboard/AdminProtectedRoute";
import AdminLayout from "./components/admindashboard/Layout";

// ===================== LAZY LOADED COMPONENTS =====================

// Public Pages
const About = lazy(() => import("./pages/About"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SellWithUs = lazy(() => import("./pages/SellWithUs"));
const Contact = lazy(() => import("./pages/Contact"));
const TrustedPlatformPage = lazy(() => import("./pages/TrustedPlatform"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const RefundReturnPolicy = lazy(() => import("./pages/RefundReturnPolicy"));
const WeDontSell = lazy(() => import("./pages/WeDontSell"));
const WhoCanSell = lazy(() => import("./pages/WhoCanSell"));
const AdviceSellers = lazy(() => import("./pages/AdviceSellers"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Luxury = lazy(() => import("./pages/Luxury"));
const SeoPage = lazy(() => import("./pages/SeoPage"));

// Product Details
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const AdminProductDetails = lazy(() => import("./pages/Admin/ProductDetails"));

// Aids
const Kidsaids = lazy(() => import("./components/aids/Kidsaids"));

// Checkout Pages
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutLayout = lazy(() => import("./pages/checkout/CheckoutLayout"));

// Vendor Auth
const Login = lazy(() => import("./components/vendor/Login"));
const Register = lazy(() => import("./components/vendor/MultiStepRegister"));
const VendorForgot = lazy(() => import("./components/vendor/VendorForgot"));
const VendorReset = lazy(() => import("./components/vendor/VendorReset"));

// User Auth
const UserLogin = lazy(() => import("./components/UserAuth/UserLogin"));
const UserRegister = lazy(() => import("./components/UserAuth/UserRegister"));
const ForgotPassword = lazy(() => import("./components/UserAuth/UserForgot"));
const ResetPassword = lazy(() => import("./components/UserAuth/UserReset"));
const UserLogout = lazy(() => import("./components/UserAuth/UserLogout"));

// Vendor Dashboard (Heavy Components - Priority for lazy loading)
const DashboardHomeVendor = lazy(() => import("./pages/vendor/DashboardHome"));
const AddProduct = lazy(() => import("./pages/vendor/AddProduct"));
const BulkOrder = lazy(() => import("./pages/vendor/BulkOrder"));
const AllProducts = lazy(() => import("./pages/vendor/AllProducts"));
const OrdersVendor = lazy(() => import("./pages/vendor/Orders"));
const Earnings = lazy(() => import("./pages/vendor/Earnings"));
const ProfileVendor = lazy(() => import("./pages/vendor/Profile"));
const VendorView = lazy(() => import("./pages/vendor/VendorView"));

// User Dashboard
const Orders = lazy(() => import("./pages/dashboard/Orders"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Addresses = lazy(() => import("./pages/dashboard/Addresses"));
const Payments = lazy(() => import("./pages/dashboard/Payments"));
const Wishlist = lazy(() => import("./pages/dashboard/Wishlist"));
const Support = lazy(() => import("./pages/dashboard/Support"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const RaiseTicket = lazy(() => import("./pages/dashboard/RaiseTicket"));

// Admin (Heavy Components - High priority for lazy loading)
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/Admin/Users"));
const AdminVendors = lazy(() => import("./pages/Admin/Vendors"));
const AdminProducts = lazy(() => import("./pages/Admin/Products"));
const AdminOrders = lazy(() => import("./pages/Admin/Orders"));
const AdminPayments = lazy(() => import("./pages/Admin/Payments"));
const Profilesetting = lazy(() => import("./pages/Admin/Profilesetting"));
const AdminSecurity = lazy(() => import("./pages/Admin/Security"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminForgotPassword = lazy(() => import("./pages/Admin/AdminForgotPassword"));
const AdminResetPassword = lazy(() => import("./pages/Admin/AdminResetPassword"));
const AdminVendorDetails = lazy(() => import("./pages/Admin/AdminVendorDetails"));
const AdminOrderDetails = lazy(() => import("./pages/Admin/AdminOrderDetails"));
const PaymentCommissionDashboard = lazy(() => import("./pages/Admin/PaymentCommissionDashboard"));

// Category Pages
const Category = lazy(() => import("./pages/category/Category"));
const AffordableLuxury = lazy(() => import("./components/AffordableLuxury"));
const Shop = lazy(() => import("./pages/category/Shop"));

// ===================== LOADING FALLBACK COMPONENT =====================
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f5f5f5'
  }}>
    <div style={{
      textAlign: 'center'
    }}>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <p style={{ color: '#666', fontSize: '16px' }}>Loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

const App = () => {
  const hydrate = useUserStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(); // ← Cookie se token load karega
  }, [hydrate]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ===================== PUBLIC ROUTES ===================== */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/landingpage" element={<Layout><LandingPage /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/sellwithus" element={<Layout><SellWithUs /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/trusted-platform" element={<Layout><TrustedPlatformPage /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/affordable-luxury" element={<Layout><AffordableLuxury /></Layout>} />
        <Route path="/shipping-policy" element={<Layout><ShippingPolicy /></Layout>} />
        <Route path="/terms-conditions" element={<Layout><TermsConditions /></Layout>} />
        <Route path="/refund-return-policy" element={<Layout><RefundReturnPolicy /></Layout>} />
        <Route path="/we-dont-sell" element={<Layout><WeDontSell /></Layout>} />
        <Route path="/who-can-sell" element={<Layout><WhoCanSell /></Layout>} />
        <Route path="/advice-sellers" element={<Layout><AdviceSellers /></Layout>} />
        <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
        <Route path="/Fashionaids" element={<Layout><Luxury /></Layout>} />
        <Route path="/Designeraids" element={<Layout><Luxury /></Layout>} />
        <Route path="/kidsaids" element={<Layout><Kidsaids /></Layout>} />
        <Route path="/product-category/*" element={<Layout><Category /></Layout>} />
        <Route path="/seo" element={<Layout><SeoPage /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />

        {/* Product Details - User */}
        <Route path="/product-details/:productId" element={<Layout><ProductDetails /></Layout>} />

        {/* ===================== USER AUTH ===================== */}
        <Route element={<UserPublicRoute />}>
          <Route path="/UserAuth/UserLogin" element={<UserLogin />} />
          <Route path="/UserAuth/register" element={<UserRegister />} />
          <Route path="/UserAuth/UserForgot" element={<ForgotPassword />} />
          <Route path="/UserAuth/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route path="/UserAuth/UserLogout" element={<UserLogout />} />
        
        {/* ===================== User Dashboard Routes ===================== */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/user" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="user-payments" element={<Payments />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Navigate to="/add-to-cart" replace />} />
            <Route path="checkout" element={<CheckoutLayout />}>
              <Route index element={<CheckoutPage />} />
            </Route>
            <Route path="support" element={<Support />} />
            <Route path="raise-ticket" element={<RaiseTicket />} />
          </Route>
        </Route>

        {/* ===================== VENDOR AUTH ===================== */}
        <Route element={<VendorPublicRoute />}>
          <Route path="/vendor/login" element={<Login />} />
          <Route path="/vendor/register" element={<Register />} />
          <Route path="/vendor/forgot-password" element={<VendorForgot />} />
          <Route path="/vendor/reset-password/:token" element={<VendorReset />} />
        </Route>

        {/* ===================== VENDOR DASHBOARD ===================== */}
        <Route element={<VendorProtectedRoute />}>
          <Route path="/vendor" element={<VendorDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHomeVendor />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="BulkOrder" element={<BulkOrder />} />
            <Route path="all-products" element={<AllProducts />} />
            {/* <Route path="edit-product/:id" element={<EditProduct />} /> */}
            <Route path="orders" element={<OrdersVendor />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile" element={<ProfileVendor />} />
            <Route path="view-product/:productId" element={<VendorView />} />
          </Route>
        </Route>

        {/* ===================== ADMIN LOGIN ===================== */}
        <Route element={<AdminPublicRoute />}>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />
        </Route>

        {/* ===================== ADMIN DASHBOARD ===================== */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="vendors/:vendorId" element={<AdminVendorDetails />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:productId" element={<AdminProductDetails />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderId" element={<AdminOrderDetails />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="commission" element={<PaymentCommissionDashboard />} />
            <Route path="profile-settings" element={<Profilesetting />} />
            <Route path="security" element={<AdminSecurity />} />
          </Route>
        </Route>

        {/* ===================== 404 ===================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
