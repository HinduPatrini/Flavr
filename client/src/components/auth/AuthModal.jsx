import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { setAuthModal } from "../../store/uiSlice";
import { loginUser, registerUser, clearAuthError } from "../../store/authSlice";
import GoogleButton from "./GoogleButton";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AuthModal = () => {
  const dispatch = useDispatch();
  const { showAuthModal } = useSelector((state) => state.ui);
  const { isLoading, error, token } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Clear errors when toggling modes
  useEffect(() => {
    dispatch(clearAuthError());
    setShowPassword(false);
  }, [isLogin, dispatch]);

  // Shake modal on auth error
  useEffect(() => {
    if (error) {
      setShake(true);
      toast.error(error);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Close modal and show success checkmark on successful login/token assignment
  useEffect(() => {
    if (token && showAuthModal) {
      setIsSuccess(true);
      const timer = setTimeout(() => {
        setIsSuccess(false);
        dispatch(setAuthModal(false));
        // Reset state
        setName("");
        setEmail("");
        setPassword("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [token, showAuthModal, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setShake(true);
      toast.error("Please fill in all fields");
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (password.length < 6) {
      setShake(true);
      toast.error("Password must be at least 6 characters");
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ name, email, password }));
    }
  };

  const handleClose = () => {
    if (!isSuccess) {
      dispatch(setAuthModal(false));
      dispatch(clearAuthError());
    }
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              x: shake ? [-10, 10, -10, 10, -5, 5, 0] : 0
            }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              scale: { type: "spring", stiffness: 300, damping: 25 },
              x: { duration: 0.4, ease: "linear" },
              default: { duration: 0.3 }
            }}
            className="relative z-10 w-[90%] max-w-md overflow-hidden rounded-2xl bg-orange-50 dark:bg-stone-900 border border-orange-100 dark:border-stone-800 p-8 shadow-2xl"
          >
            {/* Success Checkmark Screen */}
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white mb-4"
                >
                  <Check className="w-8 h-8 stroke-[3]" />
                </motion.div>
                <h3 className="text-xl font-bold text-stone-850 dark:text-white">
                  {isLogin ? "Welcome Back!" : "Account Created!"}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
                  Signing in...
                </p>
              </motion.div>
            ) : (
              <>
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 rounded-full p-1 text-stone-400 dark:text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/logo.png" alt="Flavr Logo" className="h-12 w-12 object-contain" />
                    <span className="text-2xl font-black text-orange-500">Flavr</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-stone-800 dark:text-white">
                    Sign in to continue
                  </h2>
                </div>

                {/* Google Sign In */}
                <GoogleButton />

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200 dark:border-stone-800" />
                  </div>
                  <span className="relative bg-orange-50 dark:bg-stone-900 px-3 text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    or
                  </span>
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        Name
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 focus-visible:ring-orange-500"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Email address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 focus-visible:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
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
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 shadow-md shadow-orange-500/10 active:scale-95 transition-transform duration-100 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </span>
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                {/* Toggle Mode Link */}
                <div className="mt-6 text-center text-sm">
                  <span className="text-stone-500 dark:text-stone-400">
                    {isLogin ? "New to Flavr? " : "Already have an account? "}
                  </span>
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-bold text-orange-500 hover:underline"
                  >
                    {isLogin ? "Sign up for free" : "Log in"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
