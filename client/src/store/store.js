import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import recipeReducer from "./recipeSlice";
import uiReducer from "./uiSlice";
import mealPlanReducer from "./mealPlanSlice";
import shoppingReducer from "./shoppingSlice";
import reviewReducer from "./reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
    ui: uiReducer,
    mealPlan: mealPlanReducer,
    shopping: shoppingReducer,
    reviews: reviewReducer,
  },
});

export default store;
