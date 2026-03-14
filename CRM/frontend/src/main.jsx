// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import { store } from "./store/store";

// Ensure document is available
if (typeof document !== "undefined") {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
    );
  } else {
    console.error("Root element not found");
  }
}
