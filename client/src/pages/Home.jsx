import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Globe, Home as HomeIcon, Search, Calendar, ShoppingBag, BrainCircuit, Heart } from "lucide-react";
import { fetchFeatured, searchRecipesThunk } from "../store/recipeSlice";
import { setAuthModal } from "../store/uiSlice";
import RecipeGrid from "../components/recipe/RecipeGrid";
import { RecipeGridSkeleton } from "../components/recipe/RecipeSkeleton";
import CategoryPills from "../components/shared/CategoryPills";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featured, isLoading, error } = useSelector((state) => state.recipes);
  const { token } = useSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [displayRecipes, setDisplayRecipes] = useState([]);

  // Fetch initial random featured recipes
  useEffect(() => {
    dispatch(fetchFeatured());
  }, [dispatch]);

  // Synchronize random featured recipes to state when loaded
  useEffect(() => {
    if (featured && selectedCategory === "" && selectedCuisine === "") {
      setDisplayRecipes(featured.slice(0, 8));
    }
  }, [featured, selectedCategory, selectedCuisine]);

  // Dynamically load recipes if categories or cuisines are selected
  useEffect(() => {
    if (selectedCategory !== "" || selectedCuisine !== "") {
      // Query backend search API for the selected category/cuisine
      dispatch(
        searchRecipesThunk({
          query: "",
          diet: selectedCategory === "vegetarian" || selectedCategory === "vegan" || selectedCategory === "nonveg" ? selectedCategory : "",
          cuisine: selectedCuisine,
          type: selectedCategory !== "vegetarian" && selectedCategory !== "vegan" && selectedCategory !== "nonveg" ? selectedCategory : "",
          page: 1,
        })
      )
        .unwrap()
        .then((data) => {
          setDisplayRecipes((data.results || []).slice(0, 8));
        })
        .catch((err) => {
          console.error("Failed to load category recipes:", err);
        });
    }
  }, [selectedCategory, selectedCuisine, dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisine(cuisine === selectedCuisine ? "" : cuisine);
  };

  // Hero title text animation variants
  const titleWords = "Find Recipes That Match Your Vibe".split(" ");
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const titleWord = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cuisines = [
    { value: "indian", label: "Indian 🇮🇳" },
    { value: "italian", label: "Italian 🇮🇹" },
    { value: "chinese", label: "Chinese 🇨🇳" },
    { value: "mexican", label: "Mexican 🇲🇽" },
    { value: "american", label: "American 🇺🇸" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-12 pb-16"
    >
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white py-16 md:py-24 px-6 md:px-12 shadow-xl mx-4 my-2">
        {/* Subtle background graphics */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Animated Header */}
          <motion.h1
            variants={titleContainer}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-sm flex flex-wrap justify-center gap-x-3 gap-y-1"
          >
            {titleWords.map((word, i) => (
              <motion.span key={i} variants={titleWord} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-base md:text-lg font-medium text-orange-100 max-w-xl mx-auto"
          >
            Explore over 5,000+ hand-picked gourmet recipes, customize your weekly meals, and craft magic using our AI chef generator.
          </motion.p>

          {/* Quick Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="flex flex-wrap justify-center items-center gap-3 pt-6 border-t border-white/15 max-w-2xl mx-auto"
          >
            {[
              { label: "Home", path: "/", icon: HomeIcon, auth: false },
              { label: "Search", path: "/search", icon: Search, auth: false },
              { label: "Favourites", path: "/saved", icon: Heart, auth: true },
              { label: "Meal Planner", path: "/meal-planner", icon: Calendar, auth: true },
              { label: "Shopping List", path: "/shopping-list", icon: ShoppingBag, auth: true },
              { label: "Ask AI", path: "/ai-generator", icon: BrainCircuit, auth: true },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.auth && !token) {
                      dispatch(setAuthModal(true));
                    } else {
                      navigate(link.path);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 hover:bg-white hover:text-orange-600 hover:border-transparent transition-all font-black text-xs uppercase tracking-wider text-white shadow-sm select-none active:scale-95 duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="container mx-auto px-4 space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
          <h2 className="text-xl md:text-2xl font-black text-stone-850 dark:text-white">
            Trending Categories
          </h2>
        </div>
        <CategoryPills selected={selectedCategory} onChange={handleCategoryChange} />
      </section>

      {/* Cuisine Filter row */}
      <section className="container mx-auto px-4 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl md:text-2xl font-black text-stone-850 dark:text-white">
            Explore Cuisines
          </h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {cuisines.map((c) => {
            const isSelected = selectedCuisine === c.value;
            return (
              <Button
                key={c.value}
                onClick={() => handleCuisineChange(c.value)}
                variant={isSelected ? "default" : "outline"}
                className={`rounded-xl font-bold text-xs uppercase ${
                  isSelected
                    ? "bg-orange-500 hover:bg-orange-600 text-white border-transparent"
                    : "border-orange-100 dark:border-stone-850 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-orange-50/50 dark:hover:bg-stone-850"
                }`}
              >
                {c.label}
              </Button>
            );
          })}
        </div>
      </section>

      {/* Featured Recipe Grid */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-black text-stone-850 dark:text-white">
            {selectedCategory || selectedCuisine
              ? "Recommended Recipes"
              : "Featured Recipes"}
          </h2>
          <Button
            onClick={() => navigate("/search")}
            variant="link"
            className="font-bold text-orange-500 flex items-center gap-1 p-0 hover:no-underline hover:text-orange-600"
          >
            <span>See All Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
          <RecipeGridSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-950/20">
            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          </div>
        ) : displayRecipes.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-850">
            <p className="text-stone-500 dark:text-stone-400 font-semibold">No recipes found matching this criteria.</p>
          </div>
        ) : (
          <RecipeGrid recipes={displayRecipes} />
        )}
      </section>
    </motion.div>
  );
};

export default Home;
