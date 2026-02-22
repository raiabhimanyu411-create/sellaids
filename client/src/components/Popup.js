// src/components/Popup.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom"; // ← Link add kiya
import { Eye, EyeOff, X } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import useCartStore from "../stores/useCartStore";
import { useCartActions } from "../stores/useCartActions";
import toast from "react-hot-toast";
import popupImage from "../assets/images/popup-banner.webp";

const Popup = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Zustand
  const { isAuthenticated, login } = useUserStore();
  const { fetchCart } = useCartStore();
  const { pendingAdd, clearPending } = useCartActions();

  const navigate = useNavigate();
  const location = useLocation();

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register State
  const [regForm, setRegForm] = useState({
    name: "", mobile: "", email: "", password: "",
    address_line: "", city: "", state: "", pincode: ""
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  // POPUP SHOW LOGIC
  useEffect(() => {
    if (isAuthenticated) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setFade(true), 100);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const handleClose = () => {
    setFade(false);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  // LOGIN
  const validateLogin = () => {
    setLoginError("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!loginEmail || !emailRegex.test(loginEmail)) {
      setLoginError("Valid email required");
      return false;
    }
    if (loginPassword.length < 6) {
      setLoginError("Password must be 6+ chars");
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async () => {
    if (!validateLogin()) return;
    setLoginLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/auth/login`,
        { email: loginEmail, password: loginPassword },
        { withCredentials: true }
      );

      if (res.data.success) {
        login(res.data.data);
        toast.success("Login Successful!");
        handleClose();
        navigate("/");
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // REGISTER (same as before)
  const handleRegChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      setRegForm({ ...regForm, [name]: value.replace(/\D/g, "").slice(0, 10) });
    } else if (name === "pincode") {
      setRegForm({ ...regForm, [name]: value.replace(/\D/g, "").slice(0, 6) });
    } else {
      setRegForm({ ...regForm, [name]: value });
    }
  };

  const handleRegisterSubmit = async () => {
    if (!regForm.name || !regForm.mobile || !regForm.email || !regForm.password) {
      setRegError("Fill all required fields");
      return;
    }
    if (regForm.mobile.length !== 10) {
      setRegError("Valid 10-digit mobile");
      return;
    }

    setRegLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/auth/register`,
        {
          name: regForm.name,
          phone: regForm.mobile,
          email: regForm.email,
          password: regForm.password,
          address_line: regForm.address_line,
          city: regForm.city,
          state: regForm.state,
          pincode: regForm.pincode,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Registered! Logging in...");
        login(res.data.data);
        setLoginEmail(regForm.email);
        setLoginPassword(regForm.password);
        setIsLogin(true);
        await fetchCart();
        navigate("/user");
        handleClose();
      }
    } catch (err) {
      setRegError(err.response?.data?.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  if (!visible || isAuthenticated) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black/60 z-[9999] transition-opacity duration-300 p-4 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className="bg-white flex max-w-4xl w-full max-h-[70vh] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Image */}
        <div className="hidden md:block w-1/2">
          <img src={popupImage} alt="Offer" className="h-full w-full object-cover" />
        </div>

        {/* Right Form */}
        <div className="relative w-full md:w-1/2 p-6 overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg z-10"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-center font-bold text-lg transition-colors ${
                isLogin ? "border-b-4 border-orange-500 text-orange-500" : "text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-center font-bold text-lg transition-colors ${
                !isLogin ? "border-b-4 border-orange-500 text-orange-500" : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLogin ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                autoComplete="email"
              />
              
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* YEHI ADDED HAI - BAKI SAB SAME */}
              <p className="text-right mt-2 mb-4">
                <Link
                  to="/UserAuth/UserForgot"
                  className="text-red-500 text-sm hover:text-orange-600"
                  onClick={handleClose}
                >
                  Forgot Password?
                </Link>
              </p>

              <button
                onClick={handleLoginSubmit}
                disabled={loginLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg disabled:opacity-60"
              >
                {loginLoading ? "Logging in..." : "LOGIN"}
              </button>
            </div>
          ) : (
            /* REGISTER FORM - BILKUL WAHI JAISE PEHLE THA */
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Create Account</h2>
              {regError && <p className="text-red-500 text-sm">{regError}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Name" value={regForm.name} onChange={handleRegChange} className="border border-gray-300 rounded-lg px-4 py-3" />
                <input type="text" name="mobile" placeholder="Mobile" value={regForm.mobile} onChange={handleRegChange} maxLength={10} className="border border-gray-300 rounded-lg px-4 py-3" />
                <input type="email" name="email" placeholder="Email" value={regForm.email} onChange={handleRegChange} className="border border-gray-300 rounded-lg px-4 py-3" />
                <div className="relative">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={regForm.password}
                    onChange={handleRegChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <input type="text" name="address_line" placeholder="Address" value={regForm.address_line} onChange={handleRegChange} className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3" />
                <input type="text" name="city" placeholder="City" value={regForm.city} onChange={handleRegChange} className="border border-gray-300 rounded-lg px-4 py-3" />
                <input type="text" name="state" placeholder="State" value={regForm.state} onChange={handleRegChange} className="border border-gray-300 rounded-lg px-4 py-3" />
                <input type="text" name="pincode" placeholder="Pincode" value={regForm.pincode} onChange={handleRegChange} maxLength={6} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <button
                onClick={handleRegisterSubmit}
                disabled={regLoading}
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-lg disabled:opacity-60"
              >
                {regLoading ? "Registering..." : "REGISTER"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;