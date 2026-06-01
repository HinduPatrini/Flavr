import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// Async Thunks
export const fetchShoppingList = createAsyncThunk(
  "shopping/fetchShoppingList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/shopping");
      return response.data.items || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shopping list"
      );
    }
  }
);

export const addShoppingItems = createAsyncThunk(
  "shopping/addShoppingItems",
  async (items, { rejectWithValue }) => {
    try {
      const response = await API.post("/shopping/add", { items });
      return response.data.items || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add items to shopping list"
      );
    }
  }
);

export const toggleShoppingItem = createAsyncThunk(
  "shopping/toggleShoppingItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/shopping/check/${itemId}`);
      return response.data.items || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle shopping item"
      );
    }
  }
);

export const clearShoppingList = createAsyncThunk(
  "shopping/clearShoppingList",
  async (_, { rejectWithValue }) => {
    try {
      await API.delete("/shopping/clear");
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear shopping list"
      );
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    // Optimistic UI updates can go here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchShoppingList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShoppingList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchShoppingList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Items
      .addCase(addShoppingItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addShoppingItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(addShoppingItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Toggle Checked
      .addCase(toggleShoppingItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleShoppingItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Clear List
      .addCase(clearShoppingList.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default shoppingSlice.reducer;
