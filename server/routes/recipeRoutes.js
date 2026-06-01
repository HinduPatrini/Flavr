const express = require("express");
const router = express.Router();
const {
  searchRecipes,
  getFeaturedRecipes,
  getSearchSuggestions,
  searchByIngredients,
  getSavedRecipes,
  getRecipeById,
  getSimilarRecipes,
  saveRecipe,
  unsaveRecipe,
  addRecentlyViewed,
  getRecentlyViewed,
} = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/search",         searchRecipes);
router.get("/featured",       getFeaturedRecipes);
router.get("/suggestions",    getSearchSuggestions);
router.get("/by-ingredients", searchByIngredients);

// Protected
router.get("/saved",          protect, getSavedRecipes);
router.get("/viewed",         protect, getRecentlyViewed);
router.post("/save/:id",      protect, saveRecipe);
router.delete("/save/:id",    protect, unsaveRecipe);
router.post("/viewed/:id",    protect, addRecentlyViewed);

// Public (auth gate on frontend)
router.get("/:id",            getRecipeById);
router.get("/:id/similar",    getSimilarRecipes);

module.exports = router;