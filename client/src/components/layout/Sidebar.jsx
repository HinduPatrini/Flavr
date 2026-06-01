import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Search, Heart, Calendar, ShoppingBag, BrainCircuit, User, LogOut } from "lucide-react";
import { setSidebarOpen, setAuthModal } from "../../store/uiSlice";
import { logout } from "../../store/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthGate from "../../hooks/useAuthGate";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { user, token } = useSelector((state) => state.auth);
  const { gateAction } = useAuthGate();

  const handleClose = () => {
    dispatch(setSidebarOpen(false));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setSidebarOpen(false));
    navigate("/");
  };

  const handleLinkClick = (path, requiresAuth = false) => {
    const action = () => {
      navigate(path);
      handleClose();
    };

    if (requiresAuth) {
      gateAction(action)();
    } else {
      action();
    }
  };

  const menuItems = [
    { label: "Home", path: "/", icon: Home, auth: false },
    { label: "Search", path: "/search", icon: Search, auth: false },
    { label: "Saved Recipes", path: "/saved", icon: Heart, auth: true },
    { label: "Meal Planner", path: "/meal-planner", icon: Calendar, auth: true },
    { label: "Shopping List", path: "/shopping-list", icon: ShoppingBag, auth: true },
    { label: "AI Generator", path: "/ai-generator", icon: BrainCircuit, auth: true },
  ];

  // Framer-motion variants
  const sidebarVariants = {
    closed: { x: "-100%" },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Sidebar Drawer */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute left-0 top-0 bottom-0 w-80 bg-orange-50 dark:bg-stone-900 border-r border-orange-100 dark:border-stone-850 shadow-2xl flex flex-col justify-between"
          >
            {/* Top Section */}
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-orange-100 dark:border-stone-850">
                <Link to="/" onClick={handleClose} className="flex items-center gap-2 select-none">
                  <img src="/logo.png" alt="Flavr Logo" className="h-10 w-10 object-contain" />
                  <span className="text-2xl font-black text-orange-500 tracking-tight">
                    Flavr
                  </span>
                </Link>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-orange-100/50 dark:hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Menu */}
              <div className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.label}
                      variants={itemVariants}
                      onClick={() => handleLinkClick(item.path, item.auth)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                          : "text-stone-600 dark:text-stone-300 hover:bg-orange-100/30 dark:hover:bg-stone-800/50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-stone-400 dark:text-stone-500"}`} />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section: Account Info & Logout */}
            <div className="p-4 border-t border-orange-100 dark:border-stone-850 bg-orange-100/20 dark:bg-stone-900/40">
              {token && user ? (
                <div className="space-y-4">
                  {/* Account Card */}
                  <motion.div
                    variants={itemVariants}
                    onClick={() => handleLinkClick("/profile", true)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-100/40 dark:hover:bg-stone-800/40 cursor-pointer transition-colors"
                  >
                    <Avatar className="w-11 h-11 border border-stone-200 dark:border-stone-750">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-orange-500 text-white font-extrabold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-stone-800 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs font-semibold text-stone-450 dark:text-stone-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </motion.div>

                  {/* Red Logout Button */}
                  <motion.button
                    variants={itemVariants}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-extrabold text-sm bg-white dark:bg-stone-950 hover:bg-red-50 dark:hover:bg-red-950/15 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  variants={itemVariants}
                  onClick={() => {
                    handleClose();
                    dispatch(setSidebarOpen(false));
                    // Wait a moment for sidebar animation, then trigger modal
                    setTimeout(() => {
                      dispatch(logout()); // Clean up state
                      dispatch(setAuthModal(true));
                    }, 200);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-extrabold text-sm shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
