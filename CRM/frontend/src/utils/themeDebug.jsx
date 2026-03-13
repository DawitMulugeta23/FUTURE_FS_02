// src/utils/themeDebug.js
export const checkTheme = () => {
    console.log('=== THEME DEBUG INFO ===');
    console.log('localStorage theme:', localStorage.getItem('theme'));
    console.log('HTML classes:', document.documentElement.classList.toString());
    console.log('HTML data-theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Body classes:', document.body.classList.toString());
    console.log('Computed body bg:', window.getComputedStyle(document.body).backgroundColor);
    console.log('Is dark mode?', document.documentElement.classList.contains('dark'));
    console.log('=======================');
};

// Call this in browser console: checkTheme()