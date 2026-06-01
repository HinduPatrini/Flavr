import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Heart, Calendar } from "lucide-react";
import useAuthGate from "../../hooks/useAuthGate";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { gateAction } = useAuthGate();

  const navItems = [
    { label: "Home", path: "/", icon: Home, auth: false },
    { label: "Search", path: "/search", icon: Search, auth: false },
    { label: "Saved", path: "/saved", icon: Heart, auth: true },
    { label: "Planner", path: "/meal-planner", icon: Calendar, auth: true },
  ];

  const handleNavClick = (path, requiresAuth) => {
    const action = () => {
      navigate(path);
    };

    if (requiresAuth) {
      gateAction(action)();
    } else {
      action();
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-t border-stone-200 dark:border-stone-850 py-2 px-6 flex justify-between items-center shadow-lg pb-safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.label}
            onClick={() => handleNavClick(item.path, item.auth)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl relative"
          >
            <Icon
              className={`w-5.5 h-5.5 transition-colors duration-250 ${
                isActive
                  ? "text-orange-500 stroke-[2.5]"
                  : "text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            />
            <span
              className={`text-[10px] font-bold tracking-tight transition-colors duration-250 ${
                isActive ? "text-orange-500 font-extrabold" : "text-stone-400 dark:text-stone-500"
              }`}
            >
              {item.label}
            </span>

            {/* Active underline pill */}
            {isActive && (
              <span className="absolute -top-2 w-5 h-1 bg-orange-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
