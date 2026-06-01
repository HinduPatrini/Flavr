const axios = require("axios");
const User = require("../models/User");
const NodeCache = require("node-cache");
const mockRecipes = require("../config/mockRecipes");

const cache = new NodeCache({ stdTTL: 600 });

// Helper to filter local mock recipes
const filterMockRecipes = (query, diet, cuisine, type) => {
  let list = [...mockRecipes];
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
    );
  }
  if (diet) {
    const d = diet.toLowerCase();
    if (d === "vegetarian") list = list.filter((r) => r.vegetarian);
    if (d === "vegan") list = list.filter((r) => r.vegan);
    if (d === "nonveg") list = list.filter((r) => !r.vegetarian);
  }
  if (cuisine) {
    const c = cuisine.toLowerCase();
    list = list.filter((r) =>
      r.cuisines.some((x) => x.toLowerCase() === c)
    );
  }
  if (type) {
    const t = type.toLowerCase();
    list = list.filter((r) =>
      r.dishTypes.some((x) => x.toLowerCase() === t)
    );
  }
  return list;
};

// GET /api/recipes/search?query=pasta&diet=vegetarian&cuisine=italian&type=lunch&page=1
const searchRecipes = async (req, res) => {
  const { query, diet, cuisine, type, sort, page } = req.query;
  try {
    const offset = (parseInt(page) - 1) * 12 || 0;
    const cacheKey = `search_${query}_${diet}_${cuisine}_${type}_${sort}_${offset}`;

    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    // Non-veg workaround — exclude vegetarian and vegan
    const excludeTags = diet === "nonveg" ? "vegetarian,vegan" : "";

    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        params: {
          query: query || "",
          diet: diet === "nonveg" ? "" : diet || "",
          excludeTags: excludeTags,
          cuisine: cuisine || "",
          type: type || "",
          sort: sort || "popularity",
          number: 12,
          offset,
          addRecipeInformation: true,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Spoonacular complexSearch failed. Serving fallback mock data.");
    const filtered = filterMockRecipes(query, diet, cuisine, type);
    res.json({
      results: filtered,
      offset: 0,
      number: 12,
      totalResults: filtered.length,
    });
  }
};

// GET /api/recipes/featured
const getFeaturedRecipes = async (req, res) => {
  try {
    const cacheKey = "featured";

    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const response = await axios.get(
      "https://api.spoonacular.com/recipes/random",
      {
        params: {
          number: 8,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Spoonacular featured random failed. Serving fallback mock data.");
    res.json({ recipes: mockRecipes });
  }
};

// GET /api/recipes/suggestions?query=pa
const getSearchSuggestions = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/autocomplete",
      {
        params: {
          query,
          number: 5,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Spoonacular autocomplete failed. Serving fallback mock data.");
    const suggestions = mockRecipes
      .filter((r) => r.title.toLowerCase().includes((query || "").toLowerCase()))
      .slice(0, 5)
      .map((r) => ({ id: r.id, title: r.title }));
    res.json(suggestions);
  }
};

// GET /api/recipes/by-ingredients?ingredients=egg,milk,flour
const searchByIngredients = async (req, res) => {
  const { ingredients } = req.query;
  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          ingredients,
          number: 12,
          ranking: 1,
          ignorePantry: true,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Spoonacular findByIngredients failed. Serving fallback mock data.");
    res.json(mockRecipes);
  }
};

// GET /api/recipes/saved  (protected)
const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.savedRecipes.length === 0) {
      return res.json({ recipes: [] });
    }

    // Check if user has mock recipes saved
    const mockSavedIds = user.savedRecipes.filter(id => parseInt(id) >= 999000);
    const spoonSavedIds = user.savedRecipes.filter(id => parseInt(id) < 999000);

    let spoonRecipes = [];
    if (spoonSavedIds.length > 0) {
      try {
        const response = await axios.get(
          "https://api.spoonacular.com/recipes/informationBulk",
          {
            params: {
              ids: spoonSavedIds.join(","),
              apiKey: process.env.SPOONACULAR_API_KEY,
            },
          }
        );
        spoonRecipes = response.data || [];
      } catch (err) {
        console.error("Spoonacular saved recipes bulk fetch failed. Merging available local info.");
        // If Spoonacular fails, we try to grab what we can from mock recipes
        spoonRecipes = spoonSavedIds
          .map(id => mockRecipes.find(r => String(r.id) === String(id)))
          .filter(Boolean);
      }
    }

    const localRecipes = mockSavedIds
      .map(id => mockRecipes.find(r => String(r.id) === String(id)))
      .filter(Boolean);

    res.json({ recipes: [...localRecipes, ...spoonRecipes] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/recipes/viewed  (protected)
const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.recentlyViewed.length === 0) {
      return res.json({ recipes: [] });
    }

    const mockViewedIds = user.recentlyViewed.filter(id => parseInt(id) >= 999000);
    const spoonViewedIds = user.recentlyViewed.filter(id => parseInt(id) < 999000);

    let spoonRecipes = [];
    if (spoonViewedIds.length > 0) {
      try {
        const response = await axios.get(
          "https://api.spoonacular.com/recipes/informationBulk",
          {
            params: {
              ids: spoonViewedIds.join(","),
              apiKey: process.env.SPOONACULAR_API_KEY,
            },
          }
        );
        spoonRecipes = response.data || [];
      } catch (err) {
        console.error("Spoonacular viewed recipes bulk fetch failed. Merging local info.");
        spoonRecipes = spoonViewedIds
          .map(id => mockRecipes.find(r => String(r.id) === String(id)))
          .filter(Boolean);
      }
    }

    const localRecipes = mockViewedIds
      .map(id => mockRecipes.find(r => String(r.id) === String(id)))
      .filter(Boolean);

    res.json({ recipes: [...localRecipes, ...spoonRecipes] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/recipes/:id
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    // If it's a mock recipe ID, return immediately
    const localRecipe = mockRecipes.find((r) => String(r.id) === String(id));
    if (localRecipe) {
      return res.json(localRecipe);
    }

    const cacheKey = `recipe_${id}`;
    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          includeNutrition: true,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Spoonacular getRecipeById failed. Serving fallback mock recipe.");
    // Try to find a fallback match, or return the first mock recipe as generic details
    const fallbackRecipe = mockRecipes.find((r) => String(r.id) === String(id)) || mockRecipes[0];
    res.json(fallbackRecipe);
  }
};

// GET /api/recipes/:id/similar
const getSimilarRecipes = async (req, res) => {
  const { id } = req.params;
  try {
    // If it's a mock recipe, return other mock recipes directly
    if (parseInt(id) >= 999000) {
      const list = mockRecipes
        .filter((r) => String(r.id) !== String(id))
        .slice(0, 6)
        .map((r) => ({
          id: r.id,
          title: r.title,
          readyInMinutes: r.readyInMinutes,
          servings: r.servings,
        }));
      return res.json(list);
    }

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/similar`,
      {
        params: {
          number: 6,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Spoonacular getSimilarRecipes failed. Serving fallback mock similar recipes.");
    const list = mockRecipes
      .filter((r) => String(r.id) !== String(id))
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        title: r.title,
        readyInMinutes: r.readyInMinutes,
        servings: r.servings,
      }));
    res.json(list);
  }
};

// POST /api/recipes/save/:id  (protected)
const saveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.id;

    if (user.savedRecipes.includes(recipeId))
      return res.status(400).json({ message: "Recipe already saved" });

    user.savedRecipes.push(recipeId);
    await user.save();

    res.json({ message: "Recipe saved", savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/recipes/save/:id  (protected)
const unsaveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedRecipes = user.savedRecipes.filter(
      (id) => String(id) !== String(req.params.id)
    );
    await user.save();

    res.json({ message: "Recipe removed", savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/recipes/viewed/:id  (protected)
const addRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.id;

    user.recentlyViewed = user.recentlyViewed.filter((id) => String(id) !== String(recipeId));
    user.recentlyViewed.unshift(recipeId);
    user.recentlyViewed = user.recentlyViewed.slice(0, 10);

    await user.save();
    res.json({ recentlyViewed: user.recentlyViewed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};