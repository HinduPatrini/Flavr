import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// Async Thunks
export const fetchFeatured = createAsyncThunk(
  "recipes/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/recipes/featured");
      // Spoonacular /recipes/random returns { recipes: [...] }
      return response.data.recipes || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch featured recipes");
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch recipe details");
    }
  }
);

export const fetchSimilarRecipes = createAsyncThunk(
  "recipes/fetchSimilarRecipes",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/recipes/${id}/similar`);
      return response.data; // returns array of similar recipes
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch similar recipes");
    }
  }
);

export const fetchSavedRecipes = createAsyncThunk(
  "recipes/fetchSavedRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/recipes/saved");
      // Controller returns { recipes: [...] }
      return response.data.recipes || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch saved recipes");
    }
  }
);

export const fetchRecentlyViewed = createAsyncThunk(
  "recipes/fetchRecentlyViewed",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/recipes/viewed");
      // Controller returns { recipes: [...] }
      return response.data.recipes || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch recently viewed recipes");
    }
  }
);

export const saveRecipeThunk = createAsyncThunk(
  "recipes/saveRecipeThunk",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.post(`/recipes/save/${id}`);
      return { id, savedRecipes: response.data.savedRecipes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to save recipe");
    }
  }
);

export const unsaveRecipeThunk = createAsyncThunk(
  "recipes/unsaveRecipeThunk",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/recipes/save/${id}`);
      return { id, savedRecipes: response.data.savedRecipes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to unsave recipe");
    }
  }
);

export const addToRecentlyViewedThunk = createAsyncThunk(
  "recipes/addToRecentlyViewedThunk",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.post(`/recipes/viewed/${id}`);
      return response.data.recentlyViewed;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add recently viewed");
    }
  }
);

export const searchRecipesThunk = createAsyncThunk(
  "recipes/searchRecipesThunk",
  async ({ query, diet, cuisine, type, sort, page }, { rejectWithValue }) => {
    try {
      const response = await API.get("/recipes/search", {
        params: { query, diet, cuisine, type, sort, page },
      });
      // Spoonacular search returns { results: [], totalResults: ... }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search recipes");
    }
  }
);

export const fetchByIngredients = createAsyncThunk(
  "recipes/fetchByIngredients",
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await API.get("/recipes/by-ingredients", {
        params: { ingredients },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch recipes by ingredients");
    }
  }
);

const initialState = {
  featured: [],
  currentRecipe: null,
  similarRecipes: [],
  savedRecipes: [],
  recentlyViewed: [],
  searchResults: { results: [], totalResults: 0 },
  suggestions: [],
  isLoading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
      state.similarRecipes = [];
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // featured
      .addCase(fetchFeatured.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeatured.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // single recipe
      .addCase(fetchRecipeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // similar recipes
      .addCase(fetchSimilarRecipes.fulfilled, (state, action) => {
        state.similarRecipes = action.payload;
      })
      // saved recipes
      .addCase(fetchSavedRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedRecipes = action.payload;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // recently viewed details
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      })
      // save recipe
      .addCase(saveRecipeThunk.fulfilled, (state, action) => {
        const { id } = action.payload;
        // If we have detailed info loaded in currentRecipe, we can check if it matches
        if (state.currentRecipe && String(state.currentRecipe.id) === String(id)) {
          // Can toggle standard flag or we can manage globally
        }
      })
      // unsave recipe
      .addCase(unsaveRecipeThunk.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.savedRecipes = state.savedRecipes.filter(
          (recipe) => String(recipe.id) !== String(id)
        );
      })
      // search
      .addCase(searchRecipesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchRecipesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchRecipesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentRecipe, setSuggestions } = recipeSlice.actions;
export default recipeSlice.reducer;
