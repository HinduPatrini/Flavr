import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { ArrowUp } from "lucide-react";

// Slices & Hooks
import { loadUser } from "./store/authSlice";
import { setSidebarOpen } from "./store/uiSlice";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import BottomNav from "./components/layout/BottomNav";
import Footer from "./components/layout/Footer";
import AuthModal from "./components/auth/AuthModal";

// Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import RecipeDetail from "./pages/RecipeDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import SavedRecipes from "./pages/SavedRecipes";
import MealPlanner from "./pages/MealPlanner";
import ShoppingList from "./pages/ShoppingList";
import AIGenerator from "./pages/AIGenerator";
import Profile from "./pages/Profile";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.ui);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. Initial Authentication Check on mount
  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  // 2. Synchronize Dark Mode state with document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // 3. Close mobile sidebar on route changes
  useEffect(() => {
    dispatch(setSidebarOpen(false));
  }, [location, dispatch]);

  // 4. Scroll position watcher for "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Page Transition variants requested by user
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-orange-50 dark:bg-stone-950 transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar />

      {/* Slide-out Sidebar for mobile drawer */}
      <Sidebar />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Gated Routes (these pages handle their own blur/auth gate redirects) */}
              <Route path="/saved" element={<SavedRecipes />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/shopping-list" element={<ShoppingList />} />
              <Route path="/ai-generator" element={<AIGenerator />} />
              <Route path="/profile" element={<Profile />} />

              {/* Redirect any unknown route to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer component */}
      <Footer />

      {/* Mobile persistent bottom nav */}
      <BottomNav />

      {/* Centered Auth modal overlays page content globally if triggered */}
      <AuthModal />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollToTop}
            className="fixed bottom-20 md:bottom-8 right-6 z-30 p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg active:scale-95 transition-transform"
            title="Back to top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast Notification helper */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "font-semibold text-xs border border-orange-100 dark:border-stone-850 dark:bg-stone-900 dark:text-stone-100 rounded-xl shadow-md",
          duration: 3000,
        }}
      />
    </div>
  );
};

export default App;