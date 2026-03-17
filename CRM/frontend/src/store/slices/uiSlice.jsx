// src/store/slices/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  } catch (error) {
    console.error("Error getting initial theme:", error);
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

const getInitialHighContrast = () => {
  try {
    return localStorage.getItem("highContrast") === "true";
  } catch (error) {
    return false;
  }
};

const getInitialReduceMotion = () => {
  try {
    return localStorage.getItem("reduceMotion") === "true";
  } catch (error) {
    return false;
  }
};

const applyTheme = (theme) => {
  try {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    console.log("Theme applied:", theme);
  } catch (error) {
    console.error("Error applying theme:", error);
  }
};

const applyFontSize = (fontSize) => {
  try {
    const root = document.documentElement;
    // Remove existing font size classes
    root.classList.remove("text-sm", "text-base", "text-lg", "text-xl");

    // Add new font size class
    switch (fontSize) {
      case "small":
        root.classList.add("text-sm");
        document.body.style.fontSize = "14px";
        break;
      case "medium":
        root.classList.add("text-base");
        document.body.style.fontSize = "16px";
        break;
      case "large":
        root.classList.add("text-lg");
        document.body.style.fontSize = "18px";
        break;
      default:
        root.classList.add("text-base");
        document.body.style.fontSize = "16px";
    }
    localStorage.setItem("fontSize", fontSize);
    console.log("Font size applied:", fontSize);
  } catch (error) {
    console.error("Error applying font size:", error);
  }
};

const applyHighContrast = (enabled) => {
  try {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("high-contrast");
      // Increase contrast for dark mode
      if (root.classList.contains("dark")) {
        root.style.setProperty("--bg-primary", "#000000");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--border-color", "#ffff00");
      } else {
        root.style.setProperty("--bg-primary", "#ffffff");
        root.style.setProperty("--text-primary", "#000000");
        root.style.setProperty("--border-color", "#0000ff");
      }
    } else {
      root.classList.remove("high-contrast");
      root.style.removeProperty("--bg-primary");
      root.style.removeProperty("--text-primary");
      root.style.removeProperty("--border-color");
    }
    localStorage.setItem("highContrast", enabled);
    console.log("High contrast applied:", enabled);
  } catch (error) {
    console.error("Error applying high contrast:", error);
  }
};

const applyReduceMotion = (enabled) => {
  try {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("reduce-motion");
      // Add CSS to disable animations
      const style = document.createElement("style");
      style.id = "reduce-motion-styles";
      style.textContent = `
                * {
                    animation-duration: 0.001s !important;
                    transition-duration: 0.001s !important;
                }
            `;
      document.head.appendChild(style);
    } else {
      root.classList.remove("reduce-motion");
      const style = document.getElementById("reduce-motion-styles");
      if (style) {
        style.remove();
      }
    }
    localStorage.setItem("reduceMotion", enabled);
    console.log("Reduce motion applied:", enabled);
  } catch (error) {
    console.error("Error applying reduce motion:", error);
  }
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: getInitialTheme(),
    fontSize: getInitialFontSize(),
    highContrast: getInitialHighContrast(),
    reduceMotion: getInitialReduceMotion(),
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
    setHighContrast: (state, action) => {
      state.highContrast = action.payload;
      applyHighContrast(action.payload);
    },
    setReduceMotion: (state, action) => {
      state.reduceMotion = action.payload;
      applyReduceMotion(action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
  },
});

// Apply initial settings
setTimeout(() => {
  applyFontSize(getInitialFontSize());
  applyHighContrast(getInitialHighContrast());
  applyReduceMotion(getInitialReduceMotion());
}, 100);

export const {
  toggleTheme,
  setTheme,
  setFontSize,
  setHighContrast,
  setReduceMotion,
  toggleSidebar,
  setModalOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
