import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { fetchSavedRecipes, unsaveRecipeThunk } from "../store/recipeSlice";
import { updateUserProfile } from "../store/authSlice";
import RecipeCard from "../components/recipe/RecipeCard";
import { RecipeGridSkeleton } from "../components/recipe/RecipeSkeleton";
import { Button } from "../components/ui/button";

const SavedRecipes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { savedRecipes, isLoading, error } = useSelector((state) => state.recipes);

  // Load saved recipes on mount if authenticated
  useEffect(() => {
    if (token) {
      dispatch(fetchSavedRecipes());
    }
  }, [dispatch, token]);

  const handleUnsave = (id, e) => {
    e.stopPropagation();
    dispatch(unsaveRecipeThunk(id))
      .unwrap()
      .then((res) => {
        dispatch(updateUserProfile({ savedRecipes: res.savedRecipes }));
        toast.success("Removed from saved recipes");
      })
      .catch(() => {
        toast.error("Failed to remove recipe");
      });
  };

  // If not authenticated, render a blurred screen (AuthModal is handled globally)
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] filter blur-[3px] pointer-events-none select-none">
        <h2 className="text-xl font-bold">Please login to view saved recipes</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="container mx-auto px-4 py-8 space-y-8 min-h-screen pb-20"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-orange-50/40 dark:bg-stone-900/40 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-stone-850 dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-orange-500 fill-orange-500" />
            <span>Saved Recipes</span>
          </h1>
          <p className="text-xs font-bold text-stone-450 dark:text-stone-500 mt-1 uppercase tracking-wider">
            Your collection of curated gourmet favorites
          </p>
        </div>
        <Button
          onClick={() => navigate("/search")}
          className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-sm active:scale-95 transition-transform"
        >
          <Search className="w-4 h-4" />
          <span>Browse More Recipes</span>
        </Button>
      </div>

      {/* Grid / Layout States */}
      {isLoading && savedRecipes.length === 0 ? (
        <RecipeGridSkeleton count={4} />
      ) : error ? (
        <div className="text-center py-16 bg-red-50 dark:bg-red-950/15 rounded-3xl border border-red-100 dark:border-red-950/30">
          <p className="text-red-650 dark:text-red-400 font-semibold">{error}</p>
        </div>
      ) : savedRecipes.length === 0 ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl text-center px-6 shadow-sm"
        >
          {/* Empty illustration with bouncing motion */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-16 bg-orange-50 dark:bg-stone-955 rounded-full flex items-center justify-center text-orange-500 mb-6"
          >
            <Heart className="w-8 h-8 fill-orange-500/20" />
          </motion.div>
          <h3 className="text-xl font-extrabold text-stone-850 dark:text-stone-150">
            No saved recipes yet
          </h3>
          <p className="text-sm text-stone-450 dark:text-stone-500 mt-2 max-w-xs mx-auto">
            You haven't favorited any recipes yet. Tap the heart icon on any recipe card to start building your cookbook.
          </p>
          <Button
            onClick={() => navigate("/search")}
            className="mt-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 shadow-md shadow-orange-500/10 active:scale-95 transition-transform"
          >
            Browse Recipes
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-bold text-stone-450 dark:text-stone-500 uppercase tracking-widest px-1">
            Displaying {savedRecipes.length} saved recipes
          </p>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-1"
            layout
          >
            <AnimatePresence mode="popLayout">
              {savedRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: 15 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="relative group"
                >
                  <RecipeCard recipe={recipe} />

                  {/* Quick Unsave hover button overlay */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[9px] font-black uppercase tracking-wider select-none">
                      Saved
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SavedRecipes;
