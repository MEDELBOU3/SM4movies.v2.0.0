/**
 * Firebase Initialization & Auth Handling for app.html (v1.3 - Focused)
 *
 * Initializes Firebase App, Auth, and Firestore ONCE for app.html.
 * Manages login state persistence and UI updates.
 * Exports Firestore instance ('appDb') and Auth ('appAuth') for use by other app scripts.
 */

// --- Firebase Configuration ---
// IMPORTANT: MUST match the configuration used on your landing page.
const firebaseConfigApp = {
    apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4", // ***** REPLACE *****
    authDomain: "sm4movies.firebaseapp.com",           // ***** REPLACE *****
    projectId: "sm4movies",                      // ***** REPLACE *****
    storageBucket: "sm4movies.appspot.com",       // ***** REPLACE *****
    messagingSenderId: "277353836953",           // ***** REPLACE *****
    appId: "1:277353836953:web:85e02783526c7cb58de308", // ***** REPLACE *****
};

// --- Declare Service Variables in Module Scope ---
let appAuth = null;
let appDb = null; // Firestore instance for view tracking etc.
let initPromise = null; // To ensure init only runs once
let initComplete = false;

// --- Utility Functions (Keep necessary ones here) ---
function getAppInitials(name = '', email = '') {
    if (name && name.trim().length > 0) {
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        if (parts[0]?.length > 0) return parts[0].substring(0, 2).toUpperCase();
    }
    if (email && email.includes('@')) return email[0].toUpperCase();
    return '??';
}

function escapeHtmlSimple(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, """).replace(/'/g, "'");
}

// --- Main Initialization Function (Run Once) ---
function initializeFirebaseIfNeeded() {
    // Prevent running multiple times
    if (initComplete) {
        console.log("Firebase already initialized for app.html.");
        return Promise.resolve({ appAuth, appDb }); // Return existing services
    }
    if (initPromise) {
        console.log("Firebase initialization already in progress for app.html.");
        return initPromise; // Return the ongoing promise
    }

    console.log("app.html: Starting Firebase Initialization...");

    initPromise = new Promise(async (resolve, reject) => {
        try {
            // 1. Check for Firebase Global Object
            if (typeof firebase === 'undefined' || typeof firebase.initializeApp !== 'function') {
                throw new Error("Firebase SDK not loaded.");
            }

            // 2. Initialize App (Safely)
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfigApp);
                console.log("app.html: Firebase App Initialized.");
            } else {
                firebase.app(); // Get default instance
                console.log("app.html: Using existing Firebase App instance.");
            }

            // 3. Get Service Instances
            if (typeof firebase.auth !== 'function') throw new Error("Firebase Auth SDK Error");
            appAuth = firebase.auth();

            if (typeof firebase.firestore !== 'function') throw new Error("Firebase Firestore SDK Error");
            appDb = firebase.firestore(); // <-- Sets appDb HERE

            console.log("app.html: Firebase Auth & Firestore services obtained successfully.");

            initComplete = true;
            resolve({ appAuth, appDb }); // Resolve promise with services

        } catch (error) {
            console.error("CRITICAL: app.html - Firebase Initialization failed:", error);
            displayErrorState(`Initialization Error: ${error.message}. Services unavailable.`);
            // Reset variables on failure
            appAuth = null;
            appDb = null;
            initComplete = false; // Ensure it can try again on refresh maybe?
            initPromise = null;   // Clear promise
            reject(error); // Reject the promise
        }
    });

    return initPromise;
}


// --- Setup Auth Listener (Requires appAuth to be ready) ---
function setupAuthListener(authInstance) {
    if (!authInstance) {
        console.error("app.html: Cannot setup auth listener - Auth service not available.");
        return;
    }
    console.log("app.html: Setting up Auth State Listener...");

    // Get UI Element References
    const appUserInfoArea = document.getElementById('app-user-info-area');
    const appUserAvatar = document.getElementById('app-user-avatar');
    const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
    const appUserAvatarImage = document.getElementById('app-user-avatar-image');
    const appUserDisplayName = document.getElementById('app-user-display-name');
    const appLogoutButton = document.getElementById('app-logout-button');
    const appLoginPrompt = document.getElementById('app-login-prompt');

    // Listen for Auth State Changes
    authInstance.onAuthStateChanged(user => {
        console.log(`app.html: Auth state changed. User ${user ? `detected (UID: ${user.uid})` : 'not detected'}.`);

        if (user) {
            // --- USER IS LOGGED IN ---
            if (appUserInfoArea) appUserInfoArea.classList.remove('d-none');
            if (appLoginPrompt) appLoginPrompt.classList.add('d-none');

            // Update Display Name & Avatar (ensure elements exist)
            if (appUserDisplayName) {
                appUserDisplayName.textContent = escapeHtmlSimple(user.displayName || user.email);
                appUserDisplayName.title = `Logged in as: ${escapeHtmlSimple(user.email)}`;
            }
            if (appUserAvatar && appUserAvatarImage && appUserAvatarInitials) {
                if (user.photoURL) { // Display Image
                    appUserAvatarImage.src = user.photoURL;
                    appUserAvatarImage.alt = `${user.displayName || user.email}'s profile`;
                    appUserAvatarImage.classList.remove('d-none');
                    appUserAvatarInitials.classList.add('d-none');
                } else { // Display Initials
                    appUserAvatarInitials.textContent = getAppInitials(user.displayName, user.email);
                    appUserAvatarInitials.classList.remove('d-none');
                    appUserAvatarImage.classList.add('d-none');
                }
            }

            // Setup Logout Button Listener (ensure elements exist & add once)
            if (appLogoutButton) {
                 appLogoutButton.classList.remove('d-none');
                if (!appLogoutButton.hasAttribute('data-listener-attached')) {
                    appLogoutButton.addEventListener('click', handleLogout);
                    appLogoutButton.setAttribute('data-listener-attached', 'true');
                }
            }

            // *** Tell the main App object that auth is ready and pass user/db ***
            if (window.App && typeof window.App.handleAuthReady === 'function') {
                console.log("app.html: Notifying main App about Auth Ready state.");
                 window.App.handleAuthReady(user, appDb); // Pass user and DB instance
            } else {
                 console.warn("app.html: window.App.handleAuthReady function not found. Cannot notify main app.");
                 // You might need to use custom events or other mechanisms if App isn't global
             }


        } else {
            // --- USER IS LOGGED OUT ---
             console.log("app.html: User not logged in. Handling redirect or guest UI.");
            if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
            if (appLogoutButton) appLogoutButton.classList.add('d-none');
            if (appLoginPrompt) appLoginPrompt.classList.remove('d-none');

            // --- Redirect Logic ---
             if (!window.location.pathname.endsWith('/') && !window.location.pathname.includes('index.html')) {
                 console.warn("app.html: User not logged in, redirecting to index.html");
                  // window.location.replace('index.html'); // <<< UNCOMMENT THIS LINE IF REDIRECT IS REQUIRED
             } else {
                console.log("app.html: User not logged in, but already on landing page/root.");
             }
        }
    }); // End onAuthStateChanged
    console.log("app.html: onAuthStateChanged listener attached.");
}

// --- Logout Handler ---
function handleLogout() {
    if (!appAuth) return;
    console.log("app.html: Handling logout request...");
    appAuth.signOut()
        .then(() => console.log("app.html: Sign out successful.")) // Listener handles UI/redirect
        .catch(error => console.error("app.html: Sign out error:", error));
}

// --- Error Display Function ---
function displayErrorState(message) {
    console.error("APP ERROR:", message);
    const prompt = document.getElementById('app-login-prompt');
     const userInfo = document.getElementById('app-user-info-area');
    if (prompt) {
        prompt.innerHTML = `<span class="text-danger p-2">Error: ${escapeHtmlSimple(message)}</span>`;
        prompt.classList.remove('d-none');
    } else { alert(`CRITICAL APP ERROR: ${message}`); }
    if (userInfo) userInfo.classList.add('d-none');
}

// --- Initiate Firebase connection when DOM is ready ---
// This assumes the script is loaded with defer or at the end of body
// Otherwise, wrap in DOMContentLoaded listener
console.log("app.html: Adding listener for DOM load or initializing Firebase directly if ready.");
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
         console.log("app.html: DOMContentLoaded event fired.");
         initializeFirebaseIfNeeded()
             .then(({ appAuth: authInstance }) => { // Destructure the auth instance from resolution
                 console.log("app.html: Firebase init successful after DOM load. Setting up listener.");
                 setupAuthListener(authInstance); // Setup listener AFTER successful init
             })
             .catch(err => {
                  console.error("app.html: Firebase init promise rejected after DOM load.");
                  // Error is displayed by displayErrorState inside initializeFirebaseIfNeeded
             });
     });
} else {
     console.log("app.html: DOM already loaded. Initializing Firebase immediately.");
     initializeFirebaseIfNeeded()
         .then(({ appAuth: authInstance }) => {
              console.log("app.html: Firebase init successful on ready DOM. Setting up listener.");
              setupAuthListener(authInstance);
         })
         .catch(err => {
             console.error("app.html: Firebase init promise rejected on ready DOM.");
         });
 }

console.log("app.html: firebase-app.js execution end.");

// --- Exporting instances for other scripts in app.html (Optional) ---
// This is one way, makes them globally accessible on window
// Note: They will be null until initialization completes.
// window.appServices = {
//    getAuth: () => appAuth,
//    getDb: () => appDb,
//    initializeApp: initializeFirebaseIfNeeded // Allow other scripts to ensure init runs
// };

// Example of how another script would use this:
// window.appServices.initializeApp().then(({ authInstance, dbInstance }) => {
//    // Use authInstance and dbInstance here or use window.appServices.getDb()
// });


// *** Your view tracking function needs to be DEFINED somewhere AND CALLED ***
// Define it here or in another included script
// It should access the `appDb` instance obtained during initialization.

// async function trackView(contentId) {
//    console.log(`Track view called for: ${contentId}`);
//    if (!appAuth || !appAuth.currentUser || !appDb) {
//       console.error("Cannot track view: Auth/DB not ready or user not logged in.");
//       return;
//    }
//    const userId = appAuth.currentUser.uid;
//    const safeContentId = String(contentId).replace(/\//g, '_');
//    const viewDocRef = appDb.collection('users').doc(userId).collection('views').doc(safeContentId);
//    try {
//       await viewDocRef.set({ /* ... your view data ... */ }, { merge: true });
//       console.log(`View tracked for ${safeContentId}`);
//    } catch(error) {
//       console.error(`Firestore Error tracking view ${safeContentId}:`, error);
//    }
// }

})(); // End IIFE
