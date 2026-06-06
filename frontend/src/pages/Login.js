import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/auth/login', formData);
      const { token, user } = response.data;
      login(user, token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
        <FiArrowLeft />
        <span>Back</span>
      </Link>

      <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className={`text-center mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
