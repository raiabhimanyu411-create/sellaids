import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useVendorStore } from '../../stores/useVendorStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Zustand action to set vendor data
  const { setVendorData } = useVendorStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/vendor/auth/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
        
      );
      const { success, data } = response.data
      if (success) {
        setVendorData(data)
        setEmail('');
        setPassword('');
        // localStorage.setItem('token', token);
        // localStorage.setItem('vendorInfo', JSON.stringify(vendor));
        // localStorage.setItem('vendorId', vendor.id);
        toast.success('Vendor login Successful');
      navigate("/vendor", { replace: true });
      } else {
        toast.error('Login Failed');
      }

      // const { token, vendor } = response.data;

      // // ✅ Save to Zustand store
      // setVendorData(vendor, token);

      // ✅ Save to localStorage for persistence

      // navigate('/vendor/my-products');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Vendor Login
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <p className="text-right mt-2">
            <a
              href="/vendor/forgot-password"
              className="text-red-500 text-sm hover:text-orange-600"
            >
              Forgot Password?
            </a>
          </p>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{' '}
          <Link to="/vendor/register" className="text-red-500 font-medium hover:text-orange-600">
            Register here
          </Link>
        </p>
        <div className="mt-4 text-center">
                  <Link to="/" className="text-blue-500 hover:underline">
                    Back to website
                  </Link>
                </div>
      </div>
    </div>
  );
};

export default Login;
