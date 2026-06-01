import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-stone-950 border-t border-orange-100 dark:border-stone-850 py-12 pb-24 md:pb-12 transition-colors">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 select-none">
              <img src="/logo.png" alt="Flavr Logo" className="h-12 w-12 object-contain" />
              <span className="text-2xl font-black text-orange-500 tracking-tight">
                Flavr
              </span>
            </Link>
            <p className="text-sm font-semibold text-stone-500 dark:text-stone-400 max-w-sm leading-relaxed">
              Discover delicious recipes, plan your weekly meals, auto-generate shopping lists, and experiment with AI recipe generation. Cooking made fun and simple.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                >
                  Search Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-generator"
                  className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                >
                  AI Recipe Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Features
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/meal-planner"
                  className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                >
                  Meal Planner
                </Link>
              </li>
              <li>
                <Link
                  to="/shopping-list"
                  className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                >
                  Shopping List
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                >
                  User Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-250 dark:border-stone-850 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-stone-400 dark:text-stone-500">
            &copy; {new Date().getFullYear()} Flavr Inc. All rights reserved.
          </p>
          <p className="text-xs font-bold text-stone-400 dark:text-stone-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
