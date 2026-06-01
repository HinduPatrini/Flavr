import React from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const GoogleButton = () => {
  const handleGoogleLogin = () => {
    // Redirect browser to the backend Google OAuth flow
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-semibold shadow-sm hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors duration-200"
    >
      <FcGoogle className="w-5 h-5" />
      <span>Continue with Google</span>
    </motion.button>
  );
};

export default GoogleButton;
