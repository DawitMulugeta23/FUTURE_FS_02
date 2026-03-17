// src/components/Voice/AccessibleHoverSpeak.jsx
import { useEffect, useRef } from "react";
import { useVoice } from "../../context/VoiceContext";

const AccessibleHoverSpeak = ({
  children,
  description,
  role = "region",
  tabIndex = 0,
  className = "",
  ...props
}) => {
  const elementRef = useRef(null);
  const { voiceMode, screenReaderMode, speak, voiceSettings } = useVoice();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !voiceMode) return;

    // Set ARIA attributes for screen readers
    if (description) {
      element.setAttribute("aria-label", description);
      element.setAttribute("data-voice-description", description);
    }

    // Add role for better screen reader support
    if (role) {
      element.setAttribute("role", role);
    }

    // Make focusable for keyboard navigation
    if (tabIndex !== undefined) {
      element.setAttribute("tabindex", tabIndex);
    }

    // For screen reader mode, we don't need hover - focus will trigger speech
    if (screenReaderMode) {
      // The focus event will be handled by the VoiceContext
      return;
    }

    // For non-screen-reader mode, use hover
    const handleMouseEnter = () => {
      if (description && voiceSettings.voiceFeedback) {
        speak(description, { priority: "normal", category: "hover" });
      }
    };

    element.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [
    voiceMode,
    screenReaderMode,
    description,
    speak,
    voiceSettings.voiceFeedback,
    role,
    tabIndex,
  ]);

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

export default AccessibleHoverSpeak;
