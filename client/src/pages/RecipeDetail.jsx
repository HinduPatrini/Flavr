import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Clock, Users, Flame, Heart, Calendar, Plus, ShoppingCart, MessageSquare, Check, ArrowLeft, Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { fetchRecipeById, saveRecipeThunk, unsaveRecipeThunk, addToRecentlyViewedThunk, clearCurrentRecipe } from "../store/recipeSlice";
import { fetchReviews, addReviewThunk, deleteReviewThunk, clearReviews } from "../store/reviewSlice";
import { updateMealPlanThunk } from "../store/mealPlanSlice";
import { addShoppingItems } from "../store/shoppingSlice";
import { updateUserProfile } from "../store/authSlice";
import { setAuthModal } from "../store/uiSlice";
import useAuthGate from "../hooks/useAuthGate";
import { RecipeDetailSkeleton } from "../components/recipe/RecipeSkeleton";
import StarRating from "../components/shared/StarRating";
import SimilarRecipes from "../components/recipe/SimilarRecipes";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkAuth, gateAction } = useAuthGate();

  const { user, token } = useSelector((state) => state.auth);
  const { currentRecipe, isLoading, error } = useSelector((state) => state.recipes);
  const { reviews, avgRating } = useSelector((state) => state.reviews);

  // Meal plan Dialog state
  const [mealPlanOpen, setMealPlanOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedMealType, setSelectedMealType] = useState("breakfast");

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Ingredients checked local state
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // 1. Auth Gate Check for Direct Access / Refresh
  useEffect(() => {
    if (!token) {
      dispatch(setAuthModal(true));
    }
  }, [token, dispatch]);

  // 2. Fetch Data
  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
      dispatch(fetchReviews(id));
    }
    return () => {
      dispatch(clearCurrentRecipe());
      dispatch(clearReviews());
    };
  }, [id, dispatch]);

  // 3. Record Viewed History & Handle Redirect on Auth Modal Close
  useEffect(() => {
    if (currentRecipe && token && user) {
      dispatch(addToRecentlyViewedThunk(currentRecipe.id))
        .unwrap()
        .then((viewed) => {
          dispatch(updateUserProfile({ recentlyViewed: viewed }));
        })
        .catch((err) => console.error("Failed to log recently viewed:", err));
    }
  }, [currentRecipe, token, user, dispatch]);

  // If unauthorized, show blurred page with notice instead of exposing content
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] filter blur-[3px] pointer-events-none select-none">
        <h2 className="text-xl font-bold">Please login to view details</h2>
      </div>
    );
  }

  if (isLoading && !currentRecipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RecipeDetailSkeleton />
      </div>
    );
  }

  if (error || !currentRecipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-flex w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full items-center justify-center">
          <ArrowLeft className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-850 dark:text-stone-150">
          Recipe not found
        </h2>
        <p className="text-sm text-stone-450 dark:text-stone-500 max-w-sm mx-auto">
          {error || "We encountered an error loading this recipe. Please return to search."}
        </p>
        <Button onClick={() => navigate(-1)} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold">
          Go Back
        </Button>
      </div>
    );
  }

  const recipeIdStr = String(currentRecipe.id);
  const isSaved = user?.savedRecipes?.includes(recipeIdStr) || false;

  const handleSaveToggle = () => {
    if (isSaved) {
      dispatch(unsaveRecipeThunk(currentRecipe.id))
        .unwrap()
        .then((res) => {
          dispatch(updateUserProfile({ savedRecipes: res.savedRecipes }));
          toast.success("Removed from saved recipes");
        });
    } else {
      dispatch(saveRecipeThunk(currentRecipe.id))
        .unwrap()
        .then((res) => {
          dispatch(updateUserProfile({ savedRecipes: res.savedRecipes }));
          toast.success("Saved to favorites!");
        });
    }
  };

  // Add all ingredients to shopping list
  const handleAddToShoppingList = () => {
    const items = currentRecipe.extendedIngredients.map((ing) => ({
      name: ing.name,
      amount: String(ing.amount),
      unit: ing.unit || "",
      checked: false,
      recipeName: currentRecipe.title,
    }));

    dispatch(addShoppingItems(items))
      .unwrap()
      .then(() => {
        toast.success("Added all ingredients to shopping list!");
      })
      .catch(() => {
        toast.error("Failed to update shopping list");
      });
  };

  // Add recipe to selected weekly meal plan slot
  const handleAddToMealPlan = () => {
    dispatch(
      updateMealPlanThunk({
        day: selectedDay,
        mealType: selectedMealType,
        recipeId: recipeIdStr,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(`Added to ${selectedDay}'s ${selectedMealType}!`);
        setMealPlanOpen(false);
      })
      .catch(() => {
        toast.error("Failed to add to meal plan");
      });
  };

  // Submit review form
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please add a comment");
      return;
    }

    setSubmittingReview(true);
    dispatch(addReviewThunk({ recipeId: recipeIdStr, rating, comment }))
      .unwrap()
      .then(() => {
        toast.success("Review submitted!");
        setComment("");
        setRating(5);
      })
      .catch((err) => {
        toast.error(err || "Failed to submit review");
      })
      .finally(() => {
        setSubmittingReview(false);
      });
  };

  const handleReviewDelete = (reviewId) => {
    dispatch(deleteReviewThunk(reviewId))
      .unwrap()
      .then(() => {
        toast.success("Review deleted");
      })
      .catch(() => {
        toast.error("Failed to delete review");
      });
  };

  // Nutrients parsing
  const nutrients = currentRecipe.nutrition?.nutrients || [];
  const findNutrient = (name) => nutrients.find((n) => n.name === name);
  const calories = findNutrient("Calories");
  const fat = findNutrient("Fat");
  const carbs = findNutrient("Carbohydrates");
  const protein = findNutrient("Protein");

  // Determine difficulty
  let difficulty = "Medium";
  if (currentRecipe.readyInMinutes < 20) difficulty = "Easy";
  else if (currentRecipe.readyInMinutes > 60) difficulty = "Hard";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 space-y-10 pb-20"
    >
      {/* 1. Large Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl h-80 md:h-[450px] shadow-xl">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          src={currentRecipe.image}
          alt={currentRecipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
        {/* Save button & Back Button overlaid on Image */}
        <div className="absolute top-6 left-6 right-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white text-stone-750 dark:bg-stone-900/90 dark:text-stone-200 border-none shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Button
            onClick={handleSaveToggle}
            className={`w-10 h-10 p-0 rounded-full shadow-md transition-colors ${
              isSaved
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-white/90 hover:bg-white text-stone-750 dark:bg-stone-900/90 dark:text-stone-200"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-white text-white" : ""}`} />
          </Button>
        </div>

        {/* Recipe Title & Badges overlaid on bottom */}
        <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 text-white space-y-3">
          <div className="flex flex-wrap gap-2">
            {currentRecipe.cuisines?.slice(0, 2).map((c) => (
              <span key={c} className="px-3 py-1 bg-orange-500/80 rounded-full text-xs font-black uppercase tracking-wider">
                {c}
              </span>
            ))}
            {currentRecipe.vegetarian && (
              <span className="px-3 py-1 bg-emerald-600/80 rounded-full text-xs font-black uppercase tracking-wider">
                Veg
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black drop-shadow-md leading-tight max-w-4xl">
            {currentRecipe.title}
          </h1>
        </div>
      </section>

      {/* 2. Recipe Detail Information & Badges Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Columns: Badges, Ingredients, Steps */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Quick Stats Badges */}
          <div className="grid grid-cols-3 gap-4 border-y border-stone-200 dark:border-stone-850 py-5 select-none">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-50/50 dark:bg-stone-900/30">
              <Clock className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-xs font-bold text-stone-450 dark:text-stone-500 uppercase tracking-wider">Prep Time</span>
              <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200">{currentRecipe.readyInMinutes} Min</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-50/50 dark:bg-stone-900/30">
              <Users className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-xs font-bold text-stone-450 dark:text-stone-500 uppercase tracking-wider">Servings</span>
              <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200">{currentRecipe.servings} People</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-50/50 dark:bg-stone-900/30">
              <Flame className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-xs font-bold text-stone-450 dark:text-stone-500 uppercase tracking-wider">Difficulty</span>
              <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200">{difficulty}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 py-1">
            <Button
              onClick={() => setMealPlanOpen(true)}
              className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white gap-2 h-11 px-5 shadow-md shadow-orange-500/10"
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Meal Planner</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleAddToShoppingList}
              className="rounded-xl font-bold border-orange-100 dark:border-stone-850 hover:bg-orange-50/50 text-stone-600 dark:text-stone-300 gap-2 h-11 px-5 bg-white dark:bg-stone-900"
            >
              <ShoppingCart className="w-4 h-4 text-orange-500" />
              <span>Add Ingredients to Shopping List</span>
            </Button>
          </div>

          {/* Ingredients Checklist */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-stone-850 dark:text-white flex items-center gap-2">
              <span>Ingredients</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-850 text-stone-500">
                {currentRecipe.extendedIngredients?.length || 0} items
              </span>
            </h3>
            
            <div className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-800 p-6 rounded-3xl space-y-0">
              {currentRecipe.extendedIngredients?.map((ing, i) => {
                const isChecked = !!checkedIngredients[i];
                return (
                  <motion.label
                    initial={{ opacity: 0, x: -5 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    key={`${ing.id}-${i}`}
                    className="flex items-center gap-4 py-3 border-b border-stone-100 dark:border-stone-800 last:border-b-0 cursor-pointer select-none group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => setCheckedIngredients({ ...checkedIngredients, [i]: !isChecked })}
                      className="w-5 h-5 rounded-md accent-orange-500 shrink-0"
                    />
                    <div className="flex-1 flex items-baseline gap-1.5">
                      <span className={`text-sm font-bold ${
                        isChecked
                          ? "text-stone-400 dark:text-stone-500 line-through"
                          : "text-orange-500 dark:text-orange-400"
                      }`}>
                        {ing.amount} {ing.unit}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isChecked
                          ? "text-stone-400 dark:text-stone-500 line-through"
                          : "text-stone-800 dark:text-stone-100 group-hover:text-orange-500"
                      }`}>
                        {ing.name}
                      </span>
                      {ing.original && ing.original !== `${ing.amount} ${ing.unit} ${ing.name}` && (
                        <span className="text-xs text-stone-400 dark:text-stone-500 ml-1 hidden sm:inline">
                          — {ing.original}
                        </span>
                      )}
                    </div>
                  </motion.label>
                );
              })}
            </div>
          </div>

          {/* Cooking Steps / Instructions */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-stone-850 dark:text-white">
              Step-by-Step Instructions
            </h3>

            <div className="space-y-4">
              {currentRecipe.analyzedInstructions?.[0]?.steps?.length > 0 ? (
                currentRecipe.analyzedInstructions[0].steps.map((step, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    key={step.number}
                    className="flex gap-4 p-5 rounded-2xl border border-stone-100 dark:border-stone-850 bg-white dark:bg-stone-900"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-extrabold text-sm">
                      {step.number}
                    </span>
                    <p className="text-sm font-semibold text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
                      {step.step}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div
                  className="p-6 rounded-2xl border border-stone-150 dark:border-stone-850 bg-white dark:bg-stone-900 text-sm font-semibold text-stone-600 dark:text-stone-300"
                  dangerouslySetInnerHTML={{ __html: currentRecipe.instructions || "Enjoy this custom chef dish!" }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Nutrition Facts, Reviews */}
        <div className="space-y-8">
          
          {/* Nutrition Facts */}
          <div className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-base font-black text-stone-850 dark:text-white">
              Nutrition Facts
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-stone-100 dark:border-stone-850 p-3 rounded-2xl flex flex-col justify-center items-center">
                <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase">Calories</span>
                <span className="text-lg font-black text-orange-500">{calories ? Math.round(calories.amount) : 320} kcal</span>
              </div>
              <div className="border border-stone-100 dark:border-stone-850 p-3 rounded-2xl flex flex-col justify-center items-center">
                <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase">Carbs</span>
                <span className="text-lg font-black text-orange-500">{carbs ? Math.round(carbs.amount) : 40}g</span>
              </div>
              <div className="border border-stone-100 dark:border-stone-850 p-3 rounded-2xl flex flex-col justify-center items-center">
                <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase">Fat</span>
                <span className="text-lg font-black text-orange-500">{fat ? Math.round(fat.amount) : 12}g</span>
              </div>
              <div className="border border-stone-100 dark:border-stone-850 p-3 rounded-2xl flex flex-col justify-center items-center">
                <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase">Protein</span>
                <span className="text-lg font-black text-orange-500">{protein ? Math.round(protein.amount) : 15}g</span>
              </div>
            </div>
            
            <p className="text-[10px] font-bold text-center text-stone-400 dark:text-stone-500">
              * Nutrition information computed per single serving.
            </p>
          </div>

          {/* User Reviews */}
          <div className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-stone-850 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-orange-500" />
                <span>Reviews ({reviews.length})</span>
              </h4>
              
              {reviews.length > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span className="text-sm font-black text-stone-800 dark:text-white">{avgRating}</span>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 border-b border-stone-100 dark:border-stone-850 pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Rate this recipe:</span>
                <StarRating rating={rating} onChange={setRating} interactive={true} size={20} />
              </div>
              
              <textarea
                placeholder="Share your thoughts about this dish..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-orange-50/20 dark:bg-stone-950 text-sm font-semibold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500 resize-none"
              />

              <Button
                type="submit"
                disabled={submittingReview}
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 shadow-sm"
              >
                Submit Review
              </Button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {reviews.length === 0 ? (
                <p className="text-sm font-semibold text-stone-400 dark:text-stone-500 text-center py-4">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <AnimatePresence>
                  {reviews.map((rev) => {
                    const isAuthor = user && rev.user && String(rev.user._id || rev.user) === String(user._id);
                    return (
                      <motion.div
                        key={rev._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 border-b border-stone-50 dark:border-stone-850 last:border-b-0 pb-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-7 h-7">
                              <AvatarImage src={rev.user?.avatar} alt={rev.user?.name} />
                              <AvatarFallback className="bg-orange-100 text-orange-600 font-extrabold text-[10px]">
                                {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-black text-stone-800 dark:text-stone-200">
                              {rev.user?.name || "Flavr Gourmet"}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <StarRating rating={rev.rating} size={11} />
                            
                            {isAuthor && (
                              <button
                                onClick={() => handleReviewDelete(rev._id)}
                                className="text-stone-400 hover:text-red-500 p-0.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 leading-relaxed pl-9">
                          {rev.comment}
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Similar Recipes Row */}
      <section className="border-t border-stone-200 dark:border-stone-850 pt-10">
        <SimilarRecipes recipeId={currentRecipe.id} />
      </section>

      {/* 4. Add to Meal Planner Dialog */}
      <Dialog open={mealPlanOpen} onOpenChange={setMealPlanOpen}>
        <DialogContent className="rounded-3xl max-w-sm bg-orange-55 dark:bg-stone-900 border-stone-200 dark:border-stone-850 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-stone-850 dark:text-white">
              Add to Weekly Planner
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Select Day
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-100 text-sm font-semibold"
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Meal Course Slot
              </label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-100 text-sm font-semibold"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setMealPlanOpen(false)}
              className="rounded-xl font-bold border-orange-100 dark:border-stone-800 hover:bg-orange-50/50 text-stone-600 dark:text-stone-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToMealPlan}
              className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white"
            >
              Confirm Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RecipeDetail;
