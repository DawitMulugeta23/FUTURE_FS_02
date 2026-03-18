// src/context/VoiceContext.jsx (completely fixed version)
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setFontSize,
  setHighContrast,
  setReduceMotion,
  setTheme,
} from "../store/slices/uiSlice";

const VoiceContext = createContext();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
};

export const VoiceProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ========== STATE DECLARATIONS ==========
  const [voiceMode, setVoiceMode] = useState(() => {
    return localStorage.getItem("voiceMode") === "true";
  });
  const [screenReaderMode, setScreenReaderMode] = useState(() => {
    return localStorage.getItem("screenReaderMode") === "true";
  });
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const [synthesis, setSynthesis] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [lastSpoken, setLastSpoken] = useState("");
  const [speechQueue, setSpeechQueue] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlyFocusedElement, setCurrentlyFocusedElement] = useState(null);

  // ========== REFS ==========
  const speakingRef = useRef(false);
  const queueRef = useRef([]);
  const currentUtteranceRef = useRef(null);
  const lastSpokenTimeRef = useRef(0);
  const focusListenerRef = useRef(null);

  // ========== VOICE SETTINGS ==========
  const [voiceSettings, setVoiceSettings] = useState({
    wakeWord: localStorage.getItem("wakeWord") || "hey crm",
    language: localStorage.getItem("voiceLanguage") || "en-US",
    speed: parseFloat(localStorage.getItem("voiceSpeed")) || 1.0,
    pitch: parseFloat(localStorage.getItem("voicePitch")) || 1.0,
    volume: parseFloat(localStorage.getItem("voiceVolume")) || 1.0,
    autoListen: localStorage.getItem("autoListen") === "true" || true,
    voiceFeedback: localStorage.getItem("voiceFeedback") === "true" || true,
    continuousListening:
      localStorage.getItem("continuousListening") === "true" || false,
    screenReaderMode:
      localStorage.getItem("screenReaderMode") === "true" || false,
    readFocusChanges:
      localStorage.getItem("readFocusChanges") === "true" || true,
    readPageChanges: localStorage.getItem("readPageChanges") === "true" || true,
    readAlerts: localStorage.getItem("readAlerts") === "true" || true,
    priorityLevels: {
      high: 1,
      normal: 2,
      low: 3,
    },
  });

  // ========== HELPER FUNCTIONS (NO DEPENDENCIES) ==========
  const getElementDescription = useCallback((element) => {
    if (!element) return null;

    // Check for data-voice-description attribute first
    if (element.dataset.voiceDescription) {
      return element.dataset.voiceDescription;
    }

    // Check for aria-label
    if (element.getAttribute("aria-label")) {
      return element.getAttribute("aria-label");
    }

    // Check for alt text on images
    if (element.tagName === "IMG" && element.alt) {
      return element.alt;
    }

    // Get text content for buttons and links
    if (element.tagName === "BUTTON" || element.tagName === "A") {
      const text = element.textContent || element.innerText;
      if (text && text.trim()) {
        return `${element.tagName === "BUTTON" ? "Button" : "Link"}: ${text.trim()}`;
      }
    }

    // Get placeholder for inputs
    if (element.tagName === "INPUT") {
      const type = element.type || "text";
      const placeholder = element.placeholder;
      if (placeholder) {
        return `${type} input field: ${placeholder}`;
      }
      return `${type} input field`;
    }

    // Get heading text
    if (element.tagName.match(/^H[1-6]$/)) {
      const text = element.textContent || element.innerText;
      if (text && text.trim()) {
        return `Heading ${element.tagName[1]}: ${text.trim()}`;
      }
    }

    // For any other element, get its text content
    const text = element.textContent || element.innerText;
    if (text && text.trim() && text.trim().length < 100) {
      return text.trim();
    }

    return null;
  }, []);

  // ========== CORE VOICE FUNCTIONS ==========
  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
      setIsListening(false);
    }
  }, [recognition]);

  const startListening = useCallback(() => {
    if (!voiceSupported) {
      toast.error("Voice recognition not supported");
      return;
    }

    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Failed to start recognition:", error);
      }
    }
  }, [recognition, voiceSupported]);

  // ========== SPEECH FUNCTIONS ==========
  const speak = useCallback(
    (text, options = {}) => {
      if (!voiceSettings.voiceFeedback || !synthesis) return;
      if (!text || text.trim() === "") return;

      const {
        priority = "normal",
        category = "general",
        onStart,
        onEnd,
        interrupt = false,
      } = options;

      // Don't repeat the same text too quickly (within 1 second)
      if (
        text === lastSpoken &&
        Date.now() - lastSpokenTimeRef.current < 1000
      ) {
        return;
      }

      const priorityLevel = voiceSettings.priorityLevels[priority] || 2;

      const newItem = {
        text,
        priority,
        priorityLevel,
        category,
        onStart,
        onEnd,
        timestamp: Date.now(),
      };

      // Insert into queue based on priority
      const newQueue = [...queueRef.current];
      const insertIndex = newQueue.findIndex(
        (item) => voiceSettings.priorityLevels[item.priority] > priorityLevel,
      );

      if (insertIndex === -1) {
        newQueue.push(newItem);
      } else {
        newQueue.splice(insertIndex, 0, newItem);
      }

      queueRef.current = newQueue;
      setSpeechQueue(newQueue);
      setLastSpoken(text);
      lastSpokenTimeRef.current = Date.now();

      // If interrupting, clear current speech
      if (interrupt && currentUtteranceRef.current) {
        synthesis.cancel();
      }
    },
    [synthesis, voiceSettings, lastSpoken],
  );

  // ========== ANNOUNCEMENT FUNCTIONS ==========
  const announcePageChange = useCallback(
    (pageName) => {
      if (voiceSettings.readPageChanges) {
        speak(`Navigated to ${pageName} page`, {
          priority: "high",
          category: "navigation",
        });
      }
    },
    [speak, voiceSettings.readPageChanges],
  );

  const announceAlert = useCallback(
    (message, type = "info") => {
      if (voiceSettings.readAlerts) {
        speak(`${type}: ${message}`, { priority: "high", category: "alert" });
      }
    },
    [speak, voiceSettings.readAlerts],
  );

  // ========== FOCUS TRACKING ==========
  const setupFocusTracking = useCallback(() => {
    if (focusListenerRef.current) {
      document.removeEventListener("focusin", focusListenerRef.current);
    }

    focusListenerRef.current = (e) => {
      const element = e.target;
      if (
        element !== currentlyFocusedElement &&
        voiceSettings.readFocusChanges
      ) {
        setCurrentlyFocusedElement(element);

        // Get element description
        const description = getElementDescription(element);
        if (description) {
          speak(description, { priority: "high", category: "focus" });
        }
      }
    };

    document.addEventListener("focusin", focusListenerRef.current);
  }, [
    voiceSettings.readFocusChanges,
    currentlyFocusedElement,
    speak,
    getElementDescription,
  ]);

  // ========== VOICE MODE CONTROL FUNCTIONS ==========
  const deactivateVoiceMode = useCallback(() => {
    setVoiceMode(false);
    setScreenReaderMode(false);
    localStorage.setItem("voiceMode", "false");
    localStorage.setItem("screenReaderMode", "false");

    setVoiceSettings((prev) => ({
      ...prev,
      screenReaderMode: false,
    }));

    stopListening();

    // Clear speech queue
    queueRef.current = [];
    setSpeechQueue([]);
    if (currentUtteranceRef.current) {
      synthesis?.cancel();
    }

    // Remove focus tracking
    if (focusListenerRef.current) {
      document.removeEventListener("focusin", focusListenerRef.current);
    }

    speak("Screen reader mode deactivated.", { priority: "high" });
    toast.success("Screen reader mode deactivated");
  }, [speak, synthesis, stopListening]);

  const activateVoiceMode = useCallback(() => {
    setVoiceMode(true);
    setScreenReaderMode(true);
    localStorage.setItem("voiceMode", "true");
    localStorage.setItem("screenReaderMode", "true");
    setWakeWordDetected(true);

    // Update settings
    setVoiceSettings((prev) => ({
      ...prev,
      screenReaderMode: true,
    }));

    speak(
      "Voice mode activated. Screen reader mode enabled. I will read everything as you navigate. Press tab to move between elements.",
      {
        priority: "high",
        category: "system",
      },
    );

    toast.success("Screen reader mode activated!", {
      icon: "🎤",
      duration: 3000,
    });

    setTimeout(() => setWakeWordDetected(false), 3000);

    // Start listening
    startListening();

    // Setup focus tracking
    setTimeout(() => {
      setupFocusTracking();
    }, 500);
  }, [speak, startListening, setupFocusTracking]);

  const toggleVoiceMode = useCallback(() => {
    if (voiceMode) {
      deactivateVoiceMode();
    } else {
      activateVoiceMode();
    }
  }, [voiceMode, activateVoiceMode, deactivateVoiceMode]);

  // ========== VOICE COMMAND PROCESSING ==========
  const processVoiceCommand = useCallback(
    (command) => {
      console.log("Processing command:", command);

      // Navigation commands
      if (
        command.includes("go to dashboard") ||
        command.includes("open dashboard")
      ) {
        navigate("/dashboard");
        announcePageChange("dashboard");
      } else if (
        command.includes("go to leads") ||
        command.includes("open leads")
      ) {
        navigate("/leads");
        announcePageChange("leads");
      } else if (
        command.includes("go to analytics") ||
        command.includes("open analytics")
      ) {
        navigate("/analytics");
        announcePageChange("analytics");
      } else if (
        command.includes("go to settings") ||
        command.includes("open settings")
      ) {
        navigate("/settings");
        announcePageChange("settings");
      } else if (
        command.includes("go to help") ||
        command.includes("open help")
      ) {
        navigate("/help");
        announcePageChange("help");
      }

      // Theme commands
      else if (command.includes("dark mode")) {
        dispatch(setTheme("dark"));
        speak("Switching to dark mode", { priority: "high" });
      } else if (command.includes("light mode")) {
        dispatch(setTheme("light"));
        speak("Switching to light mode", { priority: "high" });
      }

      // Font size commands
      else if (
        command.includes("increase font size") ||
        command.includes("larger text")
      ) {
        dispatch(setFontSize("large"));
        speak("Font size increased", { priority: "high" });
      } else if (
        command.includes("decrease font size") ||
        command.includes("smaller text")
      ) {
        dispatch(setFontSize("small"));
        speak("Font size decreased", { priority: "high" });
      } else if (
        command.includes("normal font size") ||
        command.includes("reset font size")
      ) {
        dispatch(setFontSize("medium"));
        speak("Font size reset to normal", { priority: "high" });
      }

      // High contrast commands
      else if (
        command.includes("high contrast on") ||
        command.includes("enable high contrast")
      ) {
        dispatch(setHighContrast(true));
        speak("High contrast mode enabled", { priority: "high" });
      } else if (
        command.includes("high contrast off") ||
        command.includes("disable high contrast")
      ) {
        dispatch(setHighContrast(false));
        speak("High contrast mode disabled", { priority: "high" });
      }

      // Reduce motion commands
      else if (
        command.includes("reduce motion on") ||
        command.includes("disable animations")
      ) {
        dispatch(setReduceMotion(true));
        speak("Reduced motion enabled", { priority: "high" });
      } else if (
        command.includes("reduce motion off") ||
        command.includes("enable animations")
      ) {
        dispatch(setReduceMotion(false));
        speak("Reduced motion disabled", { priority: "high" });
      }

      // Voice speed commands
      else if (command.includes("speak faster")) {
        const newSpeed = Math.min(voiceSettings.speed + 0.25, 2);
        updateVoiceSettings({ speed: newSpeed });
        speak(`Speaking speed increased to ${newSpeed}x`, { priority: "high" });
      } else if (command.includes("speak slower")) {
        const newSpeed = Math.max(voiceSettings.speed - 0.25, 0.5);
        updateVoiceSettings({ speed: newSpeed });
        speak(`Speaking speed decreased to ${newSpeed}x`, { priority: "high" });
      }

      // Voice mode commands
      else if (
        command.includes("stop listening") ||
        command.includes("deactivate")
      ) {
        deactivateVoiceMode();
      } else if (
        command.includes("what is this") ||
        command.includes("describe element")
      ) {
        if (currentlyFocusedElement) {
          const desc = getElementDescription(currentlyFocusedElement);
          if (desc) {
            speak(desc, { priority: "high" });
          } else {
            speak("No description available for this element", {
              priority: "high",
            });
          }
        } else {
          speak(
            "No element is currently focused. Press Tab to focus an element.",
            { priority: "high" },
          );
        }
      } else if (
        command.includes("read page") ||
        command.includes("read this page")
      ) {
        const main = document.querySelector("main");
        if (main) {
          const text = main.innerText || main.textContent;
          if (text) {
            speak(text.substring(0, 500), { priority: "high" });
          }
        }
      } else if (command.includes("help")) {
        speak(
          "Available commands: go to dashboard, go to leads, go to analytics, go to settings, dark mode, light mode, increase font size, decrease font size, high contrast on, high contrast off, reduce motion on, reduce motion off, speak faster, speak slower, read page, what is this, stop listening, and help. Press Tab to navigate between elements.",
          {
            priority: "high",
          },
        );
      }

      // Lead commands
      else if (
        command.includes("create lead") ||
        command.includes("add lead")
      ) {
        const addButton = document.querySelector(
          '[data-testid="add-lead-button"]',
        );
        if (addButton) {
          addButton.click();
          speak("Opening lead creation form", { priority: "high" });
        } else {
          navigate("/leads");
          setTimeout(() => {
            const btn = document.querySelector(
              '[data-testid="add-lead-button"]',
            );
            if (btn) btn.click();
          }, 1000);
          speak("Navigating to leads page to create new lead", {
            priority: "high",
          });
        }
      } else if (command.includes("search for")) {
        const searchTerm = command.replace("search for", "").trim();
        if (searchTerm) {
          navigate(`/leads?search=${encodeURIComponent(searchTerm)}`);
          speak(`Searching for ${searchTerm}`, { priority: "high" });
        }
      }

      // Profile commands
      else if (
        command.includes("my profile") ||
        command.includes("show profile")
      ) {
        navigate("/settings?tab=profile");
        speak("Opening your profile", { priority: "high" });
      }

      // Logout command
      else if (command.includes("logout") || command.includes("sign out")) {
        if (window.confirm("Are you sure you want to logout?")) {
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
          speak("Logging out", { priority: "high" });
        }
      }
    },
    [
      navigate,
      dispatch,
      speak,
      voiceSettings,
      currentlyFocusedElement,
      getElementDescription,
      announcePageChange,
      deactivateVoiceMode,
    ],
  );

  // ========== UPDATE VOICE SETTINGS ==========
  const updateVoiceSettings = useCallback(
    (newSettings) => {
      setVoiceSettings((prev) => {
        const updated = { ...prev, ...newSettings };

        // Save to localStorage
        Object.keys(newSettings).forEach((key) => {
          if (typeof newSettings[key] !== "object") {
            localStorage.setItem(key, newSettings[key]);
          }
        });

        return updated;
      });

      if (recognition && newSettings.language) {
        recognition.lang = newSettings.language;
      }

      if (newSettings.continuousListening !== undefined && recognition) {
        recognition.continuous = newSettings.continuousListening;
      }

      if (newSettings.screenReaderMode !== undefined) {
        setScreenReaderMode(newSettings.screenReaderMode);
        localStorage.setItem("screenReaderMode", newSettings.screenReaderMode);

        if (newSettings.screenReaderMode) {
          setupFocusTracking();
        } else if (focusListenerRef.current) {
          document.removeEventListener("focusin", focusListenerRef.current);
        }
      }

      speak("Voice settings updated", { priority: "low" });
    },
    [recognition, speak, setupFocusTracking],
  );

  // ========== INITIALIZATION EFFECT ==========
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize speech synthesis
      if (window.speechSynthesis) {
        setSynthesis(window.speechSynthesis);
      }

      // Initialize speech recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = voiceSettings.continuousListening;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = voiceSettings.language;

        recognitionInstance.onresult = (event) => {
          const currentTranscript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join(" ");

          setTranscript(currentTranscript);

          if (voiceMode) {
            processVoiceCommand(currentTranscript.toLowerCase());
          } else if (
            currentTranscript
              .toLowerCase()
              .includes(voiceSettings.wakeWord.toLowerCase())
          ) {
            activateVoiceMode();
          }
        };

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setVoiceSupported(false);
        };

        recognitionInstance.onend = () => {
          if (voiceMode && voiceSettings.autoListen) {
            try {
              recognitionInstance.start();
            } catch (error) {
              console.error("Failed to restart recognition:", error);
            }
          } else {
            setIsListening(false);
          }
        };

        setRecognition(recognitionInstance);

        // Auto-start if voice mode was enabled
        if (voiceMode) {
          setTimeout(() => {
            startListening();
          }, 1000);
        }
      } else {
        setVoiceSupported(false);
      }
    }

    // Set up focus tracking for screen reader mode
    if (voiceSettings.screenReaderMode) {
      setupFocusTracking();
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error("Error stopping recognition:", error);
        }
      }
      if (synthesis) {
        synthesis.cancel();
      }
      if (focusListenerRef.current) {
        document.removeEventListener("focusin", focusListenerRef.current);
      }
    };
  }, []); // Empty dependency array - only run once

  // ========== UPDATE RECOGNITION SETTINGS ==========
  useEffect(() => {
    if (recognition) {
      recognition.continuous = voiceSettings.continuousListening;
      recognition.lang = voiceSettings.language;
    }
  }, [recognition, voiceSettings.continuousListening, voiceSettings.language]);

  // ========== PROCESS SPEECH QUEUE ==========
  useEffect(() => {
    if (!synthesis) return;

    const processQueue = async () => {
      if (speakingRef.current || queueRef.current.length === 0) return;

      speakingRef.current = true;
      setIsSpeaking(true);

      const nextItem = queueRef.current.shift();
      setSpeechQueue([...queueRef.current]);

      const { text, priority, category, onStart, onEnd } = nextItem;

      // Cancel any ongoing speech
      if (currentUtteranceRef.current) {
        synthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceSettings.language;
      utterance.rate = voiceSettings.speed;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;

      // Get available voices and try to set a good one
      const voices = synthesis.getVoices();
      if (voices.length > 0) {
        // Prefer female voice for better clarity
        const preferredVoice = voices.find(
          (v) =>
            v.name.includes("Female") ||
            v.name.includes("Samantha") ||
            v.name.includes("Google UK Female"),
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => {
        setLastSpoken(text);
        lastSpokenTimeRef.current = Date.now();
        if (onStart) onStart();
      };

      utterance.onend = () => {
        speakingRef.current = false;
        setIsSpeaking(false);
        currentUtteranceRef.current = null;

        if (onEnd) onEnd();

        // Process next item in queue
        if (queueRef.current.length > 0) {
          processQueue();
        }
      };

      utterance.onerror = (error) => {
        console.error("Speech error:", error);
        speakingRef.current = false;
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };

      currentUtteranceRef.current = utterance;
      synthesis.speak(utterance);
    };

    processQueue();
  }, [speechQueue, synthesis, voiceSettings]);

  // ========== CONTEXT VALUE ==========
  const value = {
    voiceMode,
    screenReaderMode,
    isListening,
    voiceSupported,
    transcript,
    wakeWordDetected,
    voiceSettings,
    lastSpoken,
    isSpeaking,
    speechQueue,
    currentlyFocusedElement,
    toggleVoiceMode,
    startListening,
    stopListening,
    speak,
    announcePageChange,
    announceAlert,
    updateVoiceSettings,
    processVoiceCommand,
    getElementDescription,
  };

  return (
    <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
  );
};
