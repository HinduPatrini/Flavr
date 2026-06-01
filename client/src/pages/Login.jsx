import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, clearAuthError } from "../store/authSlice";
import GoogleButton from "../components/auth/GoogleButton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  // Clear errors when navigating away
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setShake(true);
      toast.error(error);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Navigate on successful login
  useEffect(() => {
    if (token) {
      toast.success("Successfully logged in!");
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setShake(true);
      toast.error("Please fill in all fields");
      setTimeout(() => setShake(false), 500);
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]"
    >
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-800 p-8 rounded-3xl shadow-xl space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo.png" alt="Flavr Logo" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-black text-orange-500">Flavr</span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-850 dark:text-white">
            Welcome back!
          </h2>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Log in to manage recipes &amp; meal plans
          </p>
        </div>

        {/* Google SSO */}
        <GoogleButton />

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-800" />
          </div>
          <span className="relative bg-white dark:bg-stone-900 px-3 text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500">
            or
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 focus-visible:ring-orange-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 focus-visible:ring-orange-500 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-500 dark:text-stone-500 dark:hover:text-orange-400 transition-colors"
              >
                <motion.div
                  key={showPassword ? "eye-off" : "eye"}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </motion.div>
              </button>
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 leading-tight pt-0.5">
              Use the password you created when signing up on Flavr.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 shadow-md shadow-orange-500/10 active:scale-95 transition-transform flex items-center justify-center"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Switch Link */}
        <div className="text-center text-sm font-semibold">
          <span className="text-stone-500 dark:text-stone-400">New to Flavr? </span>
          <Link to="/register" className="text-orange-500 hover:underline font-extrabold">
            Sign up for free
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
