import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Clock, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuthGate from "../../hooks/useAuthGate";
import { saveRecipeThunk, unsaveRecipeThunk } from "../../store/recipeSlice";
import { updateUserProfile } from "../../store/authSlice";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { gateAction } = useAuthGate();

  // Handle String ID comparisons correctly
  const recipeIdStr = String(recipe.id);
  const isSaved = user?.savedRecipes?.includes(recipeIdStr) || false;

  const handleCardClick = gateAction(() => {
    navigate(`/recipe/${recipe.id}`);
  });

  const handleSaveToggle = gateAction((e) => {
    e.stopPropagation(); // Stop navigation trigger
    if (isSaved) {
      dispatch(unsaveRecipeThunk(recipe.id))
        .unwrap()
        .then((res) => {
          // Sync auth state
          dispatch(updateUserProfile({ savedRecipes: res.savedRecipes }));
          toast.success("Removed from saved recipes");
        })
        .catch(() => {
          toast.error("Failed to remove recipe");
        });
    } else {
      dispatch(saveRecipeThunk(recipe.id))
        .unwrap()
        .then((res) => {
          // Sync auth state
          dispatch(updateUserProfile({ savedRecipes: res.savedRecipes }));
          toast.success("Saved to favorites!");
        })
        .catch(() => {
          toast.error("Failed to save recipe");
        });
    }
  });

  // Calculate clean display values
  const cookTime = recipe.readyInMinutes || recipe.cookingMinutes || 30;
  const servings = recipe.servings || 4;

  // Diet badge selection (e.g. Vegetarian, Gluten Free, Vegan)
  let dietBadge = "";
  if (recipe.vegetarian) dietBadge = "Vegetarian";
  else if (recipe.vegan) dietBadge = "Vegan";
  else if (recipe.glutenFree) dietBadge = "Gluten-Free";
  else if (recipe.dairyFree) dietBadge = "Dairy-Free";
  else if (recipe.veryHealthy) dietBadge = "Healthy";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-orange-100 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-md hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-500/20 transition-all flex flex-col justify-between h-[360px]"
    >
      {/* Recipe Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=640"}
          alt={recipe.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Backdrop overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Diet Badge */}
        {dietBadge && (
          <span className="absolute left-3 top-3 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white bg-emerald-600/90 dark:bg-emerald-600 rounded-full shadow-sm">
            {dietBadge}
          </span>
        )}

        {/* Favorite Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleSaveToggle}
          className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/95 dark:bg-stone-900/95 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-stone-950 transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isSaved
                ? "fill-orange-500 text-orange-500 scale-110"
                : "text-stone-400 dark:text-stone-500 hover:text-orange-500"
            }`}
          />
        </motion.button>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Diet and Source details */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-450 dark:text-stone-500 uppercase tracking-widest mb-1.5">
            <span>{recipe.cuisine || (recipe.cuisines && recipe.cuisines[0]) || "General"}</span>
            <span>•</span>
            <span className="truncate">{recipe.sourceName || "Flavr"}</span>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-stone-850 dark:text-stone-150 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
            {recipe.title}
          </h3>
        </div>

        {/* Metrics Row */}
        <div className="flex items-center gap-4 border-t border-stone-100 dark:border-stone-850 pt-4 mt-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{cookTime} min</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <Users className="w-4 h-4 text-orange-500" />
            <span>{servings} serv</span>
          </div>

          {recipe.healthScore !== undefined && (
            <div className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              Score: {recipe.healthScore}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
