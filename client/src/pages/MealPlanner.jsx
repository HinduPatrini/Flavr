import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trash2, Plus, Search, Loader2, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import { fetchMealPlan, updateMealPlanThunk, clearMealPlanThunk } from "../store/mealPlanSlice";
import API from "../api/axios";
import useDebounce from "../hooks/useDebounce";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../components/ui/dialog";

const MealPlanner = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { plan, resolvedRecipes, isLoading } = useSelector((state) => state.mealPlan);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = [
    { key: "breakfast", label: "Breakfast 🍳" },
    { key: "lunch", label: "Lunch 🥗" },
    { key: "dinner", label: "Dinner 🍲" },
  ];

  // Search dialog state
  const [activeSlot, setActiveSlot] = useState(null); // { day, mealType }
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);

  // Fetch plan on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchMealPlan());
    }
  }, [dispatch, token]);

  // Fetch search results for dialog search
  useEffect(() => {
    const searchRecipes = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      try {
        const response = await API.get("/recipes/search", {
          params: { query: debouncedQuery, page: 1 },
        });
        setSearchResults(response.data.results || []);
      } catch (err) {
        console.error("Failed to search recipes for planner:", err);
      } finally {
        setSearching(false);
      }
    };
    searchRecipes();
  }, [debouncedQuery]);

  const handleOpenSlot = (day, mealType) => {
    setActiveSlot({ day, mealType });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleAddRecipe = (recipeId) => {
    if (!activeSlot) return;
    dispatch(
      updateMealPlanThunk({
        day: activeSlot.day,
        mealType: activeSlot.mealType,
        recipeId: String(recipeId),
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Meal updated!");
        setActiveSlot(null);
      })
      .catch(() => {
        toast.error("Failed to update meal plan");
      });
  };

  const handleRemoveRecipe = (day, mealType) => {
    dispatch(
      updateMealPlanThunk({
        day,
        mealType,
        recipeId: "", // Send empty string to clear the slot
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Meal removed");
      })
      .catch(() => {
        toast.error("Failed to remove meal");
      });
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear the entire weekly meal plan?")) {
      dispatch(clearMealPlanThunk())
        .unwrap()
        .then(() => {
          toast.success("Meal plan cleared!");
        })
        .catch(() => {
          toast.error("Failed to clear meal plan");
        });
    }
  };

  // Find recipe ID on plan data
  const getRecipeIdForSlot = (day, mealType) => {
    const dayEntry = plan?.week?.find((d) => d.day === day);
    return dayEntry?.meals?.[mealType] || "";
  };

  // If not authenticated, render a blurred screen (AuthModal handled globally)
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] filter blur-[3px] pointer-events-none select-none">
        <h2 className="text-xl font-bold">Please login to view your meal planner</h2>
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
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-orange-50/40 dark:bg-stone-900/40 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-stone-850 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-orange-500" />
            <span>Weekly Meal Planner</span>
          </h1>
          <p className="text-xs font-bold text-stone-450 dark:text-stone-500 mt-1 uppercase tracking-wider">
            Schedule your breakfasts, lunches, and dinners
          </p>
        </div>

        <Button
          onClick={handleClearAll}
          variant="outline"
          className="rounded-xl font-bold border-red-200 dark:border-red-950/20 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/10 dark:text-red-400 bg-white dark:bg-stone-900"
        >
          Clear Weekly Plan
        </Button>
      </div>

      {/* Calendar Grid Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-7 gap-6"
      >
        {days.map((day) => (
          <div
            key={day}
            className="flex flex-col bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-2xl overflow-hidden shadow-sm h-full min-h-[400px]"
          >
            {/* Day Title Header */}
            <div className="p-4 border-b border-orange-100 dark:border-stone-850 bg-orange-100/10 dark:bg-stone-900/40 text-center">
              <span className="font-extrabold text-sm text-stone-850 dark:text-white uppercase tracking-wider">
                {day}
              </span>
            </div>

            {/* Meal slots for the day */}
            <div className="p-3 flex-1 flex flex-col justify-between gap-3">
              {mealTypes.map((meal) => {
                const recipeId = getRecipeIdForSlot(day, meal.key);
                const recipe = recipeId ? resolvedRecipes[recipeId] : null;

                return (
                  <div key={meal.key} className="flex-1 flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1 block">
                      {meal.label}
                    </span>

                    <AnimatePresence mode="wait">
                      {recipe ? (
                        /* Filled Slot Card */
                        <motion.div
                          key={recipe.id}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ type: "spring", stiffness: 200, damping: 18 }}
                          className="relative flex flex-col bg-orange-50/50 dark:bg-stone-950/60 rounded-xl overflow-hidden border border-orange-100/60 dark:border-stone-850 shadow-sm group p-2.5 h-[115px] justify-between"
                        >
                          <div className="flex gap-2 items-start">
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-10 h-10 object-cover rounded-lg bg-stone-100 dark:bg-stone-800"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/recipe/${recipe.id}`}
                                className="text-xs font-extrabold text-stone-850 dark:text-stone-200 line-clamp-2 leading-snug hover:text-orange-500"
                              >
                                {recipe.title}
                              </Link>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-orange-100/30 dark:border-stone-850/40">
                            <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500">
                              {recipe.readyInMinutes} min
                            </span>
                            
                            <button
                              onClick={() => handleRemoveRecipe(day, meal.key)}
                              className="text-stone-400 hover:text-red-500 transition-colors"
                              title="Remove recipe"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        /* Empty Slot Button */
                        <motion.button
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => handleOpenSlot(day, meal.key)}
                          className="w-full h-[115px] border-2 border-dashed border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-900 rounded-xl flex flex-col items-center justify-center gap-1.5 text-stone-400 hover:text-orange-500 dark:text-stone-600 dark:hover:text-orange-400 bg-white dark:bg-stone-950 transition-all select-none group"
                        >
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            Add Meal
                          </span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search and Add Recipe Dialog */}
      <Dialog open={activeSlot !== null} onOpenChange={() => setActiveSlot(null)}>
        <DialogContent className="rounded-3xl max-w-md bg-orange-55 dark:bg-stone-900 border-stone-200 dark:border-stone-850 p-6">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-850">
            <h3 className="text-base font-black text-stone-850 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-orange-500 fill-orange-500/10" />
              <span>
                Schedule {activeSlot ? `${activeSlot.day} ${activeSlot.mealType}` : "Meal"}
              </span>
            </h3>
            <DialogClose asChild>
              <button className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </DialogClose>
          </DialogHeader>

          {/* Search Query Area */}
          <div className="space-y-4 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipe to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
            </div>

            {/* Scrollable list of matches */}
            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2">
              {searching ? (
                <div className="flex justify-center items-center py-12 gap-2 text-stone-555">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  <span className="text-xs font-semibold">Searching recipes...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-xs font-semibold text-stone-450 dark:text-stone-500 text-center py-12">
                  {searchQuery ? "No matching recipes found" : "Type above to search meals"}
                </p>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-2 rounded-xl border border-stone-100 dark:border-stone-800 hover:bg-orange-50/40 dark:hover:bg-stone-850/40 justify-between items-center transition-colors"
                  >
                    <div className="flex gap-2.5 items-center min-w-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg bg-stone-150"
                      />
                      <span className="text-xs font-extrabold text-stone-700 dark:text-stone-250 truncate block">
                        {item.title}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleAddRecipe(item.id)}
                      className="rounded-xl h-8 px-4 font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MealPlanner;
