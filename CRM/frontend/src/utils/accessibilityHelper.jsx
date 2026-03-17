// src/utils/accessibilityHelper.js
export const initializeForBlindUser = () => {
  // Auto-enable voice mode
  localStorage.setItem("voiceMode", "true");
  localStorage.setItem("screenReaderMode", "true");

  // Set optimal settings for blind users
  localStorage.setItem("voiceSpeed", "1.0");
  localStorage.setItem("voicePitch", "1.0");
  localStorage.setItem("voiceFeedback", "true");
  localStorage.setItem("readFocusChanges", "true");
  localStorage.setItem("readPageChanges", "true");
  localStorage.setItem("readAlerts", "true");

  // Set high contrast for better visibility
  localStorage.setItem("highContrast", "true");

  // Set larger font
  localStorage.setItem("fontSize", "large");

  // Disable animations
  localStorage.setItem("reduceMotion", "true");

  console.log("Accessibility settings initialized for blind user");
};

// Add query parameter to auto-enable for demo
// Usage: http://localhost:3000/login?accessibility=blind
export const checkAndEnableForBlind = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("accessibility") === "blind") {
    initializeForBlindUser();
    return true;
  }
  return false;
};
