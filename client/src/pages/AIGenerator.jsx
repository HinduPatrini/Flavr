import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Sparkles, Plus, X, Clock, Users, ArrowRight, Save, Heart, Eye, Trash2, MessageSquare, Star } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { Button } from "../components/ui/button";
import StarRating from "../components/shared/StarRating";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

const AIGenerator = () => {
  const { token, user } = useSelector((state) => state.auth);

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState(["egg", "milk", "flour"]);
  const [recipe, setRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedAiRecipes, setSavedAiRecipes] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Load saved AI recipes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedAiRecipes");
    if (saved) {
      try {
        setSavedAiRecipes(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved AI recipes:", err);
      }
    }
  }, []);

  // Sync reviews when the active recipe changes
  useEffect(() => {
    if (recipe) {
      const allReviews = localStorage.getItem("aiRecipeReviews");
      if (allReviews) {
        try {
          const parsed = JSON.parse(allReviews);
          setReviews(parsed[recipe.name] || []);
        } catch (err) {
          console.error("Failed to parse AI reviews:", err);
          setReviews([]);
        }
      } else {
        setReviews([]);
      }
    } else {
      setReviews([]);
    }
  }, [recipe]);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    const val = ingredientInput.trim().toLowerCase();
    if (!val) return;
    if (ingredients.includes(val)) {
      toast.error("Ingredient already added!");
      return;
    }
    setIngredients([...ingredients, val]);
    setIngredientInput("");
  };

  const handleRemoveIngredient = (ingToRemove) => {
    setIngredients(ingredients.filter((ing) => ing !== ingToRemove));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    setIsGenerating(true);
    setRecipe(null);
    try {
      const response = await API.post("/ai/generate", { ingredients });
      if (response.data?.recipe) {
        setRecipe(response.data.recipe);
        toast.success("Recipe generated successfully!");
      } else {
        toast.error("Failed to parse recipe response");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate recipe");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = () => {
    if (!recipe) return;
    
    // Check if already saved
    const exists = savedAiRecipes.some((r) => r.name === recipe.name);
    if (exists) {
      toast.error("Recipe already saved!");
      return;
    }

    const updated = [recipe, ...savedAiRecipes];
    setSavedAiRecipes(updated);
    localStorage.setItem("savedAiRecipes", JSON.stringify(updated));
    toast.success("Saved to your AI recipe list!");
  };

  const handleRemoveSavedRecipe = (name) => {
    const updated = savedAiRecipes.filter((r) => r.name !== name);
    setSavedAiRecipes(updated);
    localStorage.setItem("savedAiRecipes", JSON.stringify(updated));
    toast.success("Recipe removed");
  };

  // Add review submission handler
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      userName: user?.name || "Flavr Chef",
      userAvatar: user?.avatar || "",
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const allReviews = localStorage.getItem("aiRecipeReviews") || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(allReviews);
    } catch (err) {
      parsed = {};
    }

    const updatedList = [newReview, ...(parsed[recipe.name] || [])];
    parsed[recipe.name] = updatedList;

    localStorage.setItem("aiRecipeReviews", JSON.stringify(parsed));
    setReviews(updatedList);
    setComment("");
    setRating(5);
    toast.success("Review submitted!");
  };

  // Delete review handler
  const handleReviewDelete = (reviewId) => {
    const allReviews = localStorage.getItem("aiRecipeReviews") || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(allReviews);
    } catch (err) {
      parsed = {};
    }

    const updatedList = (parsed[recipe.name] || []).filter((r) => r.id !== reviewId);
    parsed[recipe.name] = updatedList;

    localStorage.setItem("aiRecipeReviews", JSON.stringify(parsed));
    setReviews(updatedList);
    toast.success("Review deleted");
  };

  // If not authenticated, render blurred placeholder (handled globally)
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] filter blur-[3px] pointer-events-none select-none">
        <h2 className="text-xl font-bold">Please login to access the AI Generator</h2>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

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
            <BrainCircuit className="w-6 h-6 text-orange-500" />
            <span>AI Recipe Generator</span>
          </h1>
          <p className="text-xs font-bold text-stone-450 dark:text-stone-500 mt-1 uppercase tracking-wider">
            Let Chef Flavr's AI cook up a masterpiece using what's in your pantry
          </p>
        </div>

        {savedAiRecipes.length > 0 && (
          <Button
            onClick={() => setShowSavedList(!showSavedList)}
            variant="outline"
            className="rounded-xl font-bold border-orange-100 dark:border-stone-850 hover:bg-orange-50/50 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900"
          >
            {showSavedList ? "Back to Generator" : `View Saved AI Recipes (${savedAiRecipes.length})`}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Ingredients Input Section (Always visible, disabled during generation) */}
        {!showSavedList && (
          <div className="lg:col-span-1 bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-black text-stone-850 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-orange-500 fill-orange-500/10" />
                <span>Enter Ingredients</span>
              </h3>
              <p className="text-xs font-semibold text-stone-450 dark:text-stone-500">
                Type an item (e.g. Tomato, Salmon) and press Add or Enter.
              </p>
            </div>

            <form onSubmit={handleAddIngredient} className="relative flex gap-2">
              <input
                type="text"
                disabled={isGenerating}
                placeholder="e.g. Garlic, Cream, Chicken"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-stone-300 dark:border-stone-800 bg-orange-50/10 text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={isGenerating}
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 w-12 flex items-center justify-center p-0 shadow-sm disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </form>

            {/* Tag List Container */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Pantry Ingredients list:
              </label>

              <div className="flex flex-wrap gap-2 py-2">
                <AnimatePresence>
                  {ingredients.map((ing) => (
                    <motion.span
                      key={ing}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100/60 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-bold"
                    >
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ing)}
                        className="rounded-full hover:bg-orange-200/50 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <Button
              onClick={handleGenerateRecipe}
              disabled={isGenerating || ingredients.length === 0}
              className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 shadow-md shadow-orange-500/10"
            >
              <span>Generate Recipe</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Button>
          </div>
        )}

        {/* Right Columns: Display generated recipe or loading indicators or saved list */}
        <div className="lg:col-span-2">
          
          {/* Saved AI Recipes List */}
          {showSavedList ? (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-stone-850 dark:text-white">
                Saved AI Recipes
              </h3>
              
              <div className="space-y-4">
                {savedAiRecipes.map((r, i) => (
                  <div
                    key={r.name + i}
                    className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl p-6 shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-lg font-black text-stone-800 dark:text-white">
                          {r.name}
                        </h4>
                        <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-1 max-w-lg leading-relaxed">
                          {r.description}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveSavedRecipe(r.name)}
                        className="text-stone-400 hover:text-red-500 p-1 rounded-full transition-colors"
                        title="Delete AI recipe"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="flex gap-4 text-xs font-bold text-stone-450 dark:text-stone-500 uppercase tracking-wide">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-orange-500" />
                        Prep: {r.preparationTime || "10m"} | Cook: {r.cookingTime || "20m"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-orange-500" />
                        Servings: {r.servings || "4"}
                      </span>
                    </div>

                    {/* Expand/Preview Recipe */}
                    <div className="pt-2">
                      <Button
                        variant="link"
                        onClick={() => {
                          setRecipe(r);
                          setShowSavedList(false);
                        }}
                        className="p-0 font-extrabold text-orange-500 hover:no-underline text-xs flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Load Recipe in Previewer</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Loading Generator screen */}
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl text-center px-6 h-[400px]">
                  {/* Typing dot animations */}
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map((dot) => (
                      <motion.span
                        key={dot}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: dot * 0.15 }}
                        className="w-4.5 h-4.5 bg-orange-500 rounded-full"
                      />
                    ))}
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-850 dark:text-stone-150">
                    Chef Flavr is thinking...
                  </h3>
                  <p className="text-sm text-stone-450 dark:text-stone-500 mt-2 max-w-xs leading-relaxed">
                    Crafting a custom recipe with your ingredients. This may take up to 10 seconds.
                  </p>
                </div>
              )}

              {/* No recipe generated placeholder */}
              {!isGenerating && !recipe && (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl text-center px-6 h-[400px]">
                  <div className="w-16 h-16 bg-orange-50 dark:bg-stone-955 rounded-full flex items-center justify-center text-orange-500 mb-6">
                    <BrainCircuit className="w-8 h-8 text-orange-500 fill-orange-500/10" />
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-850 dark:text-stone-150">
                    No recipe generated yet
                  </h3>
                  <p className="text-sm text-stone-450 dark:text-stone-500 mt-2 max-w-xs">
                    Input your ingredients in the panel and click Generate. Our AI will analyze them and suggest a detailed, tasty recipe.
                  </p>
                </div>
              )}

              {/* Card flips in once generated */}
              {recipe && (
                <motion.div
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="bg-white dark:bg-stone-900 border border-orange-100 dark:border-stone-850 rounded-3xl p-8 shadow-md space-y-6"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-stone-850 dark:text-white leading-tight">
                        {recipe.name}
                      </h3>
                      <p className="text-sm font-semibold text-stone-500 dark:text-stone-450 mt-1 max-w-xl leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>

                    <Button
                      onClick={handleSaveRecipe}
                      className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-sm shrink-0"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Recipe</span>
                    </Button>
                  </div>

                  {/* badges info */}
                  <div className="grid grid-cols-3 gap-4 border-y border-stone-100 dark:border-stone-850 py-4">
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">Prep Time</span>
                      <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200">{recipe.preparationTime || "10 Min"}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">Cooking Time</span>
                      <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200">{recipe.cookingTime || "25 Min"}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">Servings</span>
                      <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200">{recipe.servings || "4"} People</span>
                    </div>
                  </div>

                  {/* ingredients list */}
                  <div className="space-y-3">
                    <h4 className="text-base font-black text-stone-850 dark:text-white">Ingredients</h4>
                    <ul className="space-y-2 list-disc pl-5">
                      {recipe.ingredients?.map((item, i) => (
                        <li key={i} className="text-sm font-semibold text-stone-650 dark:text-stone-300">
                          {typeof item === "string" ? item : `${item.quantity || item.amount || ""} ${item.unit || ""} ${item.name || ""}`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* directions list */}
                  <div className="space-y-3">
                    <h4 className="text-base font-black text-stone-850 dark:text-white">Directions</h4>
                    <ol className="space-y-3 list-decimal pl-5">
                      {recipe.steps?.map((step, i) => (
                        <li key={i} className="text-sm font-semibold text-stone-650 dark:text-stone-300 leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Review Section for AI Recipes */}
                  <div className="border-t border-stone-100 dark:border-stone-850 pt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-black text-stone-850 dark:text-white flex items-center gap-2">
                        <MessageSquare className="w-4.5 h-4.5 text-orange-500" />
                        <span>Recipe Reviews &amp; Notes ({reviews.length})</span>
                      </h4>
                      {reviews.length > 0 && (
                        <div className="flex items-center gap-1 bg-orange-50 dark:bg-stone-855 px-2.5 py-1 rounded-xl text-orange-600 dark:text-orange-400 font-extrabold text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{avgRating} Avg</span>
                        </div>
                      )}
                    </div>

                    {/* Add Review Form */}
                    <form onSubmit={handleReviewSubmit} className="space-y-4 bg-orange-50/20 dark:bg-stone-950/20 p-5 rounded-2xl border border-orange-100/50 dark:border-stone-850/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Your Rating:</span>
                        <StarRating rating={rating} onChange={setRating} interactive={true} size={20} />
                      </div>
                      
                      <textarea
                        placeholder="Add cooking notes, variations, or rate your experience with this AI chef recipe..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm font-semibold text-stone-700 dark:text-stone-250 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500 resize-none shadow-inner"
                      />

                      <Button
                        type="submit"
                        className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 shadow-sm"
                      >
                        Submit Review / Note
                      </Button>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {reviews.length === 0 ? (
                        <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 text-center py-4">
                          No reviews yet. Be the first to leave a review or note!
                        </p>
                      ) : (
                        <AnimatePresence>
                          {reviews.map((rev) => (
                            <motion.div
                              key={rev.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="space-y-2 border-b border-stone-50 dark:border-stone-850/60 last:border-b-0 pb-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-7 h-7">
                                    <AvatarImage src={rev.userAvatar} alt={rev.userName} />
                                    <AvatarFallback className="bg-orange-100 text-orange-600 font-extrabold text-[10px]">
                                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                                    {rev.userName}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <StarRating rating={rev.rating} size={11} />
                                  <button
                                    onClick={() => handleReviewDelete(rev.id)}
                                    className="text-stone-400 hover:text-red-500 p-0.5 transition-colors ml-1"
                                    title="Delete Note"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 leading-relaxed pl-9">
                                {rev.comment}
                              </p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AIGenerator;
