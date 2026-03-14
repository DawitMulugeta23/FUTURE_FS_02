// src/hooks/useHoverSpeak.js
import { useEffect, useRef } from 'react';
import { useVoice } from '../context/VoiceContext';

export const useHoverSpeak = (description, options = {}) => {
    const { voiceMode, speak, isListening } = useVoice();
    const elementRef = useRef(null);
    const timeoutRef = useRef(null);
    
    const {
        delay = 500, // Delay before speaking (ms)
        priority = 'normal', // 'high', 'normal', 'low'
        category = 'general', // 'navigation', 'action', 'information'
        onlyOnce = false, // Speak only once per session
        ignoreIfListening = true // Don't speak if user is speaking
    } = options;

    useEffect(() => {
        const element = elementRef.current;
        if (!element || !voiceMode) return;

        const spokenItems = new Set();
        
        const handleMouseEnter = () => {
            if (ignoreIfListening && isListening) return;
            if (onlyOnce && spokenItems.has(description)) return;
            
            // Clear any pending timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            // Delay speaking to avoid rapid-fire on quick hovers
            timeoutRef.current = setTimeout(() => {
                speak(description, { priority, category });
                if (onlyOnce) {
                    spokenItems.add(description);
                }
            }, delay);
        };

        const handleMouseLeave = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [voiceMode, description, delay, priority, category, onlyOnce, ignoreIfListening, isListening, speak]);

    return elementRef;
};