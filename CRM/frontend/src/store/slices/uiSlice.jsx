// src/store/slices/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  } catch (error) {
    return "light";
  }
};

const getInitialFontSize = () => {
  try {
    return localStorage.getItem("fontSize") || "medium";
  } catch (error) {
    return "medium";
  }
};

const applyFontSize = (fontSize) => {
  try {
    const root = document.documentElement;

    // Remove existing font size classes
    root.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large",
    );

    // Add new font size class
    root.classList.add(`font-size-${fontSize}`);

    // Apply CSS variables for font sizes
    if (fontSize === "small") {
      root.style.setProperty("--font-size-base", "14px");
      root.style.setProperty("--font-size-sm", "12px");
      root.style.setProperty("--font-size-lg", "16px");
      root.style.setProperty("--font-size-xl", "18px");
      root.style.setProperty("--font-size-2xl", "20px");
      root.style.setProperty("--font-size-3xl", "24px");
    } else if (fontSize === "medium") {
      root.style.setProperty("--font-size-base", "16px");
      root.style.setProperty("--font-size-sm", "14px");
      root.style.setProperty("--font-size-lg", "18px");
      root.style.setProperty("--font-size-xl", "20px");
      root.style.setProperty("--font-size-2xl", "24px");
      root.style.setProperty("--font-size-3xl", "30px");
    } else if (fontSize === "large") {
      root.style.setProperty("--font-size-base", "18px");
      root.style.setProperty("--font-size-sm", "16px");
      root.style.setProperty("--font-size-lg", "20px");
      root.style.setProperty("--font-size-xl", "22px");
      root.style.setProperty("--font-size-2xl", "28px");
      root.style.setProperty("--font-size-3xl", "36px");
    }

    // Apply to body
    document.body.style.fontSize = `var(--font-size-base)`;

    localStorage.setItem("fontSize", fontSize);
    console.log("Font size applied:", fontSize);
  } catch (error) {
    console.error("Error applying font size:", error);
  }
};

const applyTheme = (theme) => {
  try {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.error("Error applying theme:", error);
  }
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: getInitialTheme(),
    fontSize: getInitialFontSize(),
    sidebarOpen: true,
    modalOpen: false,
  },
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;
      applyTheme(newTheme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      applyTheme(action.payload);
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      applyFontSize(action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
  },
});

// Apply initial settings on load
applyTheme(getInitialTheme());
applyFontSize(getInitialFontSize());

export const {
  toggleTheme,
  setTheme,
  setFontSize,
  toggleSidebar,
  setModalOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
