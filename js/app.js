// js/app.js
import { initDB } from './database.js';
import { initRouter } from './router.js';
import { initAuth } from './auth.js';
import { initDashboard } from './dashboard.js';

// Global application reactive state tracking
export const AppState = {
    user: null,         // Tracks active role: 'student' or 'parent'
    studentId: null,
    studentName: null,
    activeView: 'auth', // Tracks active panel view screen
    activeGame: null,    // Tracks the currently playing game directory key
};

/**
 * Core Application Bootstrapper
 * Orchestrates IndexedDB structural configuration before setting up UI modules
 */
async function bootstrapApp() {
    console.log("Initializing MindGym Core Framework...");
    try {
        // 1. Initialize IndexedDB storage and fire up auto-seeding routines
        await initDB();
        console.log("Database Driver initialized. Secure local storage active.");
        
        // 2. Initialize UI layout modules & click bindings
        initRouter();
        initAuth();
        initDashboard();
        
        console.log("MindGym Modules successfully hooked. Operational state ready.");
    } catch (error) {
        console.error("Critical core setup crash occurred during boot routines: ", error);
        
        // Visual fallback notification layout update if storage fails entirely
        const statusEl = document.getElementById('auth-status');
        if (statusEl) {
            statusEl.innerText = "Storage Initialization Failure!";
            statusEl.classList.replace('bg-slate-800', 'bg-red-950');
            statusEl.classList.replace('text-slate-400', 'text-red-400');
        }
    }
}

// Spark ignition once the HTML DOM elements settle into place
window.addEventListener('DOMContentLoaded', bootstrapApp);