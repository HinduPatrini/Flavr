import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

export const fetchMealPlan = createAsyncThunk(
  "mealPlan/fetchMealPlan",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await API.get("/mealplan");
      const plan = response.data;

      // Extract all unique recipe IDs from the meal plan to resolve details in bulk
      const recipeIds = [];
      if (plan && plan.week) {
        plan.week.forEach((entry) => {
          if (entry.meals) {
            Object.values(entry.meals).forEach((id) => {
              if (id && !recipeIds.includes(id)) {
                recipeIds.push(id);
              }
            });
          }
        });
      }

      if (recipeIds.length > 0) {
        dispatch(resolvePlanRecipes(recipeIds));
      }

      return plan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch meal plan"
      );
    }
  }
);

export const updateMealPlanThunk = createAsyncThunk(
  "mealPlan/updateMealPlanThunk",
  async ({ day, mealType, recipeId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await API.put("/mealplan", { day, mealType, recipeId });

      if (recipeId) {
        dispatch(resolvePlanRecipes([recipeId]));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update meal plan"
      );
    }
  }
);

export const clearMealPlanThunk = createAsyncThunk(
  "mealPlan/clearMealPlanThunk",
  async (_, { rejectWithValue }) => {
    try {
      await API.delete("/mealplan");
      return {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear meal plan"
      );
    }
  }
);

// Helper thunk: fetch recipe details for IDs used in the planner
export const resolvePlanRecipes = createAsyncThunk(
  "mealPlan/resolvePlanRecipes",
  async (ids, { rejectWithValue }) => {
    try {
      const fetchPromises = ids
        .filter((id) => id && id.trim() !== "")
        .map((id) => API.get(`/recipes/${id}`).then((res) => res.data));
      const resolved = await Promise.allSettled(fetchPromises);
      return resolved
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
    } catch (error) {
      return rejectWithValue("Failed to resolve recipe details");
    }
  }
);

const initialState = {
  plan: { week: [] },
  resolvedRecipes: {},
  isLoading: false,
  error: null,
};

const mealPlanSlice = createSlice({
  name: "mealPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plan = action.payload || { week: [] };
      })
      .addCase(fetchMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateMealPlanThunk.fulfilled, (state, action) => {
        state.plan = action.payload;
      })
      .addCase(clearMealPlanThunk.fulfilled, (state) => {
        state.plan = { week: [] };
        state.resolvedRecipes = {};
      })
      .addCase(resolvePlanRecipes.fulfilled, (state, action) => {
        action.payload.forEach((recipe) => {
          if (recipe && recipe.id) {
            state.resolvedRecipes[String(recipe.id)] = recipe;
          }
        });
      });
  },
});

export default mealPlanSlice.reducer;
