import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// Async Thunks
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/reviews/${recipeId}`);
      return response.data; // Expected response shape: { reviews: [], avgRating: "4.5" }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

export const addReviewThunk = createAsyncThunk(
  "reviews/addReviewThunk",
  async ({ recipeId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/reviews/${recipeId}`, { rating, comment });
      return response.data; // Returns populated review object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

export const deleteReviewThunk = createAsyncThunk(
  "reviews/deleteReviewThunk",
  async (reviewId, { rejectWithValue }) => {
    try {
      await API.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

const initialState = {
  reviews: [],
  avgRating: "0.0",
  isLoading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.avgRating = "0.0";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.reviews || [];
        state.avgRating = action.payload.avgRating || "0.0";
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Review
      .addCase(addReviewThunk.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
        // Re-calculate local average rating
        const totalRating = state.reviews.reduce((sum, r) => sum + r.rating, 0);
        state.avgRating = (totalRating / state.reviews.length).toFixed(1);
      })
      .addCase(addReviewThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Review
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
        const totalRating = state.reviews.reduce((sum, r) => sum + r.rating, 0);
        state.avgRating = state.reviews.length > 0 
          ? (totalRating / state.reviews.length).toFixed(1)
          : "0.0";
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
