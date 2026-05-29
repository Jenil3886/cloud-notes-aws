import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import Loader from "../components/common/Loader";

const Register = () => {
  const { registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const success = await registerUser(formData.name, formData.email, formData.password);
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      // Errors are handled inside the Context using Toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel p-8 sm:p-10 rounded-2xl shadow-xl relative border border-white/5 backdrop-blur-md">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="text-center space-y-2 mb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
        <p className="text-slate-400 text-sm">Sign up to sync your secure cloud notes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <User size={16} />
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium transition-all ${
                errors.name ? "border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20" : ""
              }`}
            />
          </div>
          {errors.name && <p className="text-rose-400 text-xs font-medium pl-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Mail size={16} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium transition-all ${
                errors.email ? "border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20" : ""
              }`}
            />
          </div>
          {errors.email && <p className="text-rose-400 text-xs font-medium pl-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Lock size={16} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm glass-input font-medium transition-all ${
                errors.password ? "border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-rose-400 text-xs font-medium pl-1">{errors.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Lock size={16} />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm glass-input font-medium transition-all ${
                errors.confirmPassword ? "border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-rose-400 text-xs font-medium pl-1">{errors.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-md shadow-purple-900/30 hover:shadow-lg hover:shadow-purple-900/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pt-3 mt-2"
        >
          {loading ? (
            <Loader size="sm" className="text-white" />
          ) : (
            <>
              <UserPlus size={16} />
              Register
            </>
          )}
        </button>
      </form>

      {/* Redirect footer */}
      <div className="text-center mt-5 pt-5 border-t border-white/5">
        <p className="text-slate-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
