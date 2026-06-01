import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

const initialState = {
  showAuthModal: false,
  isDarkMode: getInitialTheme(),
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAuthModal: (state, action) => {
      state.showAuthModal = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      const theme = state.isDarkMode ? "dark" : "light";
      localStorage.setItem("theme", theme);
      if (state.isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      const theme = action.payload ? "dark" : "light";
      localStorage.setItem("theme", theme);
      if (action.payload) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const {
  setAuthModal,
  toggleDarkMode,
  setDarkMode,
  setSidebarOpen,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
