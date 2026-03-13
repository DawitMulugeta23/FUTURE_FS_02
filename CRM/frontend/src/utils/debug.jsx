// src/utils/debug.js
export const checkTheme = () => {
    console.log('Current theme from localStorage:', localStorage.getItem('theme'));
    console.log('HTML classes:', document.documentElement.classList.toString());
    console.log('HTML style colorScheme:', document.documentElement.style.colorScheme);
    console.log('Body background color:', window.getComputedStyle(document.body).backgroundColor);
    console.log('Is dark mode active?', document.documentElement.classList.contains('dark'));
};

// Call this in browser console: checkTheme()