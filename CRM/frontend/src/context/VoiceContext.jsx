// src/context/VoiceContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTheme } from '../store/slices/uiSlice';

// Create context
const VoiceContext = createContext();

// Custom hook to use voice context
export const useVoice = () => {
    const context = useContext(VoiceContext);
    if (!context) {
        throw new Error('useVoice must be used within a VoiceProvider');
    }
    return context;
};

export const VoiceProvider = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [voiceMode, setVoiceMode] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(true);
    const [recognition, setRecognition] = useState(null);
    const [synthesis, setSynthesis] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [wakeWordDetected, setWakeWordDetected] = useState(false);
    const [voiceSettings, setVoiceSettings] = useState({
        wakeWord: 'hey crm',
        language: 'en-US',
        speed: 1.0,
        pitch: 1.0,
        volume: 1.0,
        autoListen: true,
        voiceFeedback: true,
        continuousListening: false
    });

    // Initialize speech recognition and synthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize speech synthesis
            if (window.speechSynthesis) {
                setSynthesis(window.speechSynthesis);
            }

            // Initialize speech recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = voiceSettings.continuousListening;
                recognitionInstance.interimResults = true;
                recognitionInstance.lang = voiceSettings.language;

                recognitionInstance.onresult = (event) => {
                    const currentTranscript = Array.from(event.results)
                        .map(result => result[0].transcript)
                        .join(' ');
                    
                    setTranscript(currentTranscript);
                    
                    if (voiceMode) {
                        processVoiceCommand(currentTranscript.toLowerCase());
                    } else if (currentTranscript.toLowerCase().includes(voiceSettings.wakeWord.toLowerCase())) {
                        activateVoiceMode();
                    }
                };

                recognitionInstance.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                    setVoiceSupported(false);
                };

                recognitionInstance.onend = () => {
                    if (voiceMode && voiceSettings.autoListen) {
                        recognitionInstance.start();
                    } else {
                        setIsListening(false);
                    }
                };

                setRecognition(recognitionInstance);
            } else {
                setVoiceSupported(false);
            }
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
            if (synthesis) {
                synthesis.cancel();
            }
        };
    }, []);

    // Speak text
    const speak = useCallback((text, callback) => {
        if (!voiceSettings.voiceFeedback || !synthesis) return;

        // Cancel any ongoing speech
        synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voiceSettings.language;
        utterance.rate = voiceSettings.speed;
        utterance.pitch = voiceSettings.pitch;
        utterance.volume = voiceSettings.volume;

        utterance.onend = () => {
            if (callback) callback();
        };

        synthesis.speak(utterance);
    }, [synthesis, voiceSettings]);

    // Activate voice mode
    const activateVoiceMode = useCallback(() => {
        setVoiceMode(true);
        setWakeWordDetected(true);
        speak('Voice mode activated. How can I help you?');
        toast.success('Voice mode activated!', { icon: '🎤' });
        
        setTimeout(() => setWakeWordDetected(false), 3000);
    }, [speak]);

    // Deactivate voice mode
    const deactivateVoiceMode = useCallback(() => {
        setVoiceMode(false);
        stopListening();
        speak('Voice mode deactivated.');
        toast.success('Voice mode deactivated');
    }, [speak]);

    // Start listening
    const startListening = useCallback(() => {
        if (!voiceSupported) {
            toast.error('Voice recognition not supported');
            return;
        }

        if (recognition) {
            try {
                recognition.start();
                setIsListening(true);
                if (!voiceMode) {
                    speak('Listening for wake word: ' + voiceSettings.wakeWord);
                }
            } catch (error) {
                console.error('Failed to start recognition:', error);
            }
        }
    }, [recognition, voiceSupported, voiceMode, voiceSettings.wakeWord, speak]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition]);

    // Toggle voice mode
    const toggleVoiceMode = useCallback(() => {
        if (voiceMode) {
            deactivateVoiceMode();
        } else {
            startListening();
        }
    }, [voiceMode, deactivateVoiceMode, startListening]);

    // Process voice commands
    const processVoiceCommand = useCallback((command) => {
        console.log('Processing command:', command);

        // Navigation commands
        if (command.includes('go to dashboard') || command.includes('open dashboard')) {
            navigate('/dashboard');
            speak('Navigating to dashboard');
        }
        else if (command.includes('go to leads') || command.includes('open leads')) {
            navigate('/leads');
            speak('Opening leads page');
        }
        else if (command.includes('go to analytics') || command.includes('open analytics')) {
            navigate('/analytics');
            speak('Opening analytics dashboard');
        }
        else if (command.includes('go to settings') || command.includes('open settings')) {
            navigate('/settings');
            speak('Opening settings');
        }
        
        // Theme commands
        else if (command.includes('dark mode')) {
            dispatch(setTheme('dark'));
            speak('Switching to dark mode');
        }
        else if (command.includes('light mode')) {
            dispatch(setTheme('light'));
            speak('Switching to light mode');
        }
        
        // Voice mode commands
        else if (command.includes('stop listening') || command.includes('deactivate')) {
            deactivateVoiceMode();
        }
        else if (command.includes('help')) {
            speak('Available commands: go to dashboard, go to leads, go to analytics, go to settings, dark mode, light mode, create lead, search leads, and help');
        }
        
        // Lead commands
        else if (command.includes('create lead') || command.includes('add lead')) {
            const addButton = document.querySelector('[data-testid="add-lead-button"]');
            if (addButton) {
                addButton.click();
                speak('Opening lead creation form');
            } else {
                navigate('/leads');
                setTimeout(() => {
                    const btn = document.querySelector('[data-testid="add-lead-button"]');
                    if (btn) btn.click();
                }, 1000);
                speak('Navigating to leads page to create new lead');
            }
        }
        else if (command.includes('search for')) {
            const searchTerm = command.replace('search for', '').trim();
            if (searchTerm) {
                navigate(`/leads?search=${encodeURIComponent(searchTerm)}`);
                speak(`Searching for ${searchTerm}`);
            }
        }
        
        // Profile commands
        else if (command.includes('my profile') || command.includes('show profile')) {
            navigate('/settings?tab=profile');
            speak('Opening your profile');
        }
        
        // Logout command
        else if (command.includes('logout') || command.includes('sign out')) {
            if (window.confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
                speak('Logging out');
            }
        }
    }, [navigate, dispatch, speak, deactivateVoiceMode]);

    // Update voice settings
    const updateVoiceSettings = useCallback((newSettings) => {
        setVoiceSettings(prev => ({ ...prev, ...newSettings }));
        
        if (recognition && newSettings.language) {
            recognition.lang = newSettings.language;
        }
        
        if (newSettings.continuousListening !== undefined && recognition) {
            recognition.continuous = newSettings.continuousListening;
        }
        
        speak('Voice settings updated');
    }, [recognition, speak]);

    const value = {
        voiceMode,
        isListening,
        voiceSupported,
        transcript,
        wakeWordDetected,
        voiceSettings,
        toggleVoiceMode,
        startListening,
        stopListening,
        speak,
        updateVoiceSettings,
        processVoiceCommand
    };

    return (
        <VoiceContext.Provider value={value}>
            {children}
        </VoiceContext.Provider>
    );
};