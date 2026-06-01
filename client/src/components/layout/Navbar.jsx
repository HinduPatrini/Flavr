import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Sun, Moon, User, LogOut, Heart, Calendar, ShoppingBag, BrainCircuit, ShieldAlert, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toggleDarkMode, toggleSidebar, setAuthModal } from "../../store/uiSlice";
import { logout } from "../../store/authSlice";
import SearchBar from "../shared/SearchBar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthGate from "../../hooks/useAuthGate";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useSelector((state) => state.ui);
  const { user, token } = useSelector((state) => state.auth);
  const { gateAction } = useAuthGate();
  const location = useLocation();
  const isNotHome = location.pathname !== "/";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleProfileClick = gateAction(() => {
    navigate("/profile");
  });

  const handleSavedClick = gateAction(() => {
    navigate("/saved");
  });

  const handlePlannerClick = gateAction(() => {
    navigate("/meal-planner");
  });

  const handleShoppingClick = gateAction(() => {
    navigate("/shopping-list");
  });

  const handleAiClick = gateAction(() => {
    navigate("/ai-generator");
  });

  return (
    <motion.header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-orange-50/90 dark:bg-stone-900/90 shadow-md backdrop-blur-md py-2.5"
          : "bg-orange-50 dark:bg-stone-900 py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Hamburger / Desktop Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="md:hidden p-2 -ml-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-orange-100/50 dark:hover:bg-stone-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 select-none">
            <img src="/logo.png" alt="Flavr Logo" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-black text-orange-500 tracking-tight">
              Flavr
            </span>
          </Link>

          {/* Conditional Home link for non-home pages (Desktop only) */}
          {isNotHome && (
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:bg-orange-50/50 dark:hover:bg-stone-800/40 hover:text-orange-500 transition-all select-none border border-transparent hover:border-orange-100 dark:hover:border-stone-850"
            >
              <Home className="w-4 h-4 text-orange-500" />
              <span>Home</span>
            </Link>
          )}
        </div>

        {/* Middle Section: Search Bar & AI Generator (Desktop only) */}
        <div className="hidden md:flex flex-1 items-center gap-3 max-w-xl">
          <div className="flex-1">
            <SearchBar placeholder="Search recipes, cuisines, or ingredients..." />
          </div>
          <button
            onClick={handleAiClick}
            className="flex items-center gap-2.5 h-11 px-4 rounded-2xl border border-orange-500 bg-white dark:bg-stone-900 text-stone-750 dark:text-stone-250 shadow-sm hover:border-orange-650 hover:bg-orange-50/30 dark:hover:bg-stone-800/30 transition-all select-none whitespace-nowrap group shrink-0"
            title="AI Recipe Generator"
          >
            <img src="/ai_chef_icon.png" alt="AI Chef Logo" className="h-6 w-6 object-contain rounded-lg group-hover:rotate-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black text-orange-500 tracking-tight">AI Chef</span>
          </button>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Dark Mode Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-300 shadow-sm hover:bg-stone-50 dark:hover:bg-stone-900 transition-all"
            title="Toggle theme"
          >
            <motion.div
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-orange-500 fill-orange-500/20" />
              ) : (
                <Moon className="w-5 h-5 text-stone-600 fill-stone-600/10" />
              )}
            </motion.div>
          </motion.button>

          {/* User Account Section */}
          {token && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                  <Avatar className="w-10 h-10 ring-2 ring-orange-500/10 hover:ring-orange-500 transition-all border border-stone-200 dark:border-stone-800 shadow-sm">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-orange-500 text-white font-black">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl p-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl"
              >
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200">
                      {user.name}
                    </span>
                    <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 truncate">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-stone-100 dark:bg-stone-800" />
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="rounded-xl px-3 py-2 font-semibold text-stone-600 dark:text-stone-300 focus:bg-orange-50 dark:focus:bg-stone-800 focus:text-orange-600 dark:focus:text-orange-500 gap-2 cursor-pointer transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSavedClick}
                  className="rounded-xl px-3 py-2 font-semibold text-stone-600 dark:text-stone-300 focus:bg-orange-50 dark:focus:bg-stone-800 focus:text-orange-600 dark:focus:text-orange-500 gap-2 cursor-pointer transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span>Saved Recipes</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handlePlannerClick}
                  className="rounded-xl px-3 py-2 font-semibold text-stone-600 dark:text-stone-300 focus:bg-orange-50 dark:focus:bg-stone-800 focus:text-orange-600 dark:focus:text-orange-500 gap-2 cursor-pointer transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Meal Planner</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleShoppingClick}
                  className="rounded-xl px-3 py-2 font-semibold text-stone-600 dark:text-stone-300 focus:bg-orange-50 dark:focus:bg-stone-800 focus:text-orange-600 dark:focus:text-orange-500 gap-2 cursor-pointer transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shopping List</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleAiClick}
                  className="rounded-xl px-3 py-2 font-semibold text-stone-600 dark:text-stone-300 focus:bg-orange-50 dark:focus:bg-stone-800 focus:text-orange-600 dark:focus:text-orange-500 gap-2 cursor-pointer transition-colors"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>AI Generator</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-stone-100 dark:bg-stone-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-2 font-semibold text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 focus:text-red-700 dark:focus:text-red-400 gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => dispatch(setAuthModal(true))}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 px-5 shadow-md shadow-orange-500/10 active:scale-95 transition-transform"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
