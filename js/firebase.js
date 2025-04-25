// --- firebase.js ---

// --- Firebase Configuration (MUST match index.html & app2.html) ---
// IMPORTANT: Replace placeholders with your actual Firebase project configuration!
const firebaseConfigApp = {
    apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4", // ***** REPLACE *****
    authDomain: "sm4movies.firebaseapp.com",           // ***** REPLACE *****
    projectId: "sm4movies",                      // ***** REPLACE *****
    storageBucket: "sm4movies.appspot.com",       // ***** REPLACE *****
    messagingSenderId: "277353836953",           // ***** REPLACE *****
    appId: "1:277353836953:web:85e02783526c7cb58de308", // ***** REPLACE *****
};

// --- Global Variables for Firebase Services ---
// These will be assigned values once Firebase is initialized.
let firebaseApp;
let appAuth; // Firebase Authentication instance
let appDb; // Firebase Firestore instance

// --- Helper function for generating user initials ---
function getAppInitials(name = '', email = '') {
    if (name && name.trim().length > 0) {
        const parts = name.trim().split(' ').filter(Boolean); // Split by space, remove empty parts
        if (parts.length > 1) {
            // Use first letter of first and last parts
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts[0]?.length > 0) {
            // Use first 1 or 2 letters of the single part
            return parts[0].substring(0, 2).toUpperCase();
        }
    }
    // Fallback to email if name didn't work
    if (email && email.includes('@')) {
        return email[0].toUpperCase();
    }
    // Final fallback
    return '??';
}

// --- Helper for simple HTML escaping (prevent basic XSS in text content) ---
function escapeHtmlSimple(unsafe) {
    if (typeof unsafe !== 'string') return unsafe; // Only escape strings
    return unsafe
        .replace(/&/g, "&") // Must be first
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, '"')
        .replace(/`/g, "`")
        .replace(/'/g, "'");
}

// --- User-Specific View Tracking Function ---
/**
 * Records or increments a view count for a specific content item
 * within a user's 'views' subcollection in Firestore.
 * @param {object} dbInstance - The initialized Firestore instance (appDb).
 * @param {string} userId - The UID of the logged-in user.
 * @param {string} contentId - A unique identifier for the content (e.g., "movie-12345").
 */
async function trackView(dbInstance, userId, contentId) {
    // 1. Validate Inputs
    if (!dbInstance) {
        console.error("trackView Error: Firestore instance (appDb) is not available.");
        return; // Stop execution if DB is missing
    }
    if (!userId || !contentId) {
        console.error(`trackView Error: Missing required parameters. UserID: ${userId}, ContentID: ${contentId}`);
        return; // Stop execution if critical IDs are missing
    }

    console.log(`[trackView] Attempting to track view for content '${contentId}' by user '${userId}'`);

    try {
        // 2. Get Reference to the specific document in the user's subcollection
        const viewDocRef = dbInstance.collection('users').doc(userId).collection('views').doc(String(contentId));

        // 3. Use set with merge: true and FieldValue.increment
        // - Creates the document if it doesn't exist.
        // - Updates it if it does exist.
        // - Atomically increments the 'count' field.
        await viewDocRef.set({
            contentId: String(contentId), // Ensure contentId is stored as a string
            lastWatched: firebase.firestore.FieldValue.serverTimestamp(), // Use server timestamp
            count: firebase.firestore.FieldValue.increment(1) // Increment count by 1
        }, { merge: true }); // Crucial for incrementing existing docs

        console.log(`[trackView] Successfully tracked view for content '${contentId}'`);

    } catch (error) {
        console.error(`[trackView] Firestore Error: Failed to track view for content '${contentId}':`, error);
        // Decide if you want to notify the user or just log
        // Utils.showToast("Error saving viewing progress.", "warning");
    }
}

// --- Main Initialization Logic for app2.html ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Firebase Script] DOMContentLoaded event fired. Initializing Firebase...");

    try {
        // 1. Initialize Firebase App (check if already initialized)
        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfigApp);
            console.log("[Firebase Init] Firebase App initialized successfully.");
        } else {
            firebaseApp = firebase.app(); // Use existing app instance
            console.log("[Firebase Init] Using existing Firebase App instance.");
        }

        // 2. Get Auth and Firestore Service Instances
        appAuth = firebase.auth();
        appDb = firebase.firestore(); // Get Firestore instance for tracking etc.
        console.log("[Firebase Init] Auth and Firestore services obtained.");

        // 3. Get References to Navbar UI Elements (Add checks for existence)
        const appUserInfoArea = document.getElementById('app-user-info-area');
        const appUserAvatar = document.getElementById('app-user-avatar');
        const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
        const appUserAvatarImage = document.getElementById('app-user-avatar-image');
        const appUserDisplayName = document.getElementById('app-user-display-name');
        const appLogoutButton = document.getElementById('app-logout-button');
        const appLoginPrompt = document.getElementById('app-login-prompt');

        // Validate that critical UI elements exist
        if (!appUserInfoArea || !appLoginPrompt || !appLogoutButton || !appUserAvatar || !appUserDisplayName || !appUserAvatarImage || !appUserAvatarInitials) {
            console.error("[Firebase Script] CRITICAL ERROR: One or more navbar UI elements for auth display are missing in app2.html! Cannot proceed with UI updates.");
            // Display a fallback message if possible
            if(appLoginPrompt) appLoginPrompt.innerHTML = `<span class="text-danger small">UI Error</span>`;
            return; // Stop initialization if UI is broken
        }

        // 4. Listen for Authentication State Changes
        console.log("[Firebase Script] Setting up Auth State Change listener...");
        appAuth.onAuthStateChanged(user => {
            console.log(`[Auth State] Changed. User is ${user ? `LOGGED IN (UID: ${user.uid})` : 'LOGGED OUT'}.`);

            // ----- Notify the main App script -----
            // Check if the App object and its handler exist in the global scope (loaded from app2.html)
            if (typeof App !== 'undefined' && typeof App.handleAuthReady === 'function') {
                console.log("[Auth State] Notifying App.handleAuthReady...");
                App.handleAuthReady(user, appDb); // Pass user object (or null) and Firestore instance
            } else {
                console.warn("[Auth State] App object or App.handleAuthReady function not found. Main app may not initialize correctly.");
                // If App is not ready, things might break later. Consider delaying UI updates slightly?
            }
             // ----- End Notify -----


             // ----- Update Navbar UI -----
             if (user) {
                 // --- USER IS LOGGED IN ---
                 console.log("[Auth State] Updating UI for logged-in user...");
                 appUserInfoArea.classList.remove('d-none');
                 appLoginPrompt.classList.add('d-none');
                 appLogoutButton.classList.remove('d-none'); // Make sure logout is visible

                 // Display Name
                 const displayName = user.displayName || user.email; // Use email as fallback
                 appUserDisplayName.textContent = escapeHtmlSimple(displayName);
                 appUserDisplayName.title = `Logged in as: ${escapeHtmlSimple(user.email)}`; // Tooltip

                 // Avatar (Image or Initials)
                 const photoURL = user.photoURL;
                 if (photoURL) {
                     appUserAvatarImage.src = photoURL;
                     appUserAvatarImage.alt = `${displayName}'s profile picture`; // Use display name in alt text
                     appUserAvatarImage.classList.remove('d-none');
                     appUserAvatarInitials.classList.add('d-none');
                     appUserAvatarInitials.textContent = ''; // Clear initials text
                 } else {
                     const initials = getAppInitials(user.displayName, user.email);
                     appUserAvatarInitials.textContent = initials;
                     appUserAvatarInitials.classList.remove('d-none');
                     appUserAvatarImage.classList.add('d-none');
                     appUserAvatarImage.src = ''; // Clear image src
                     appUserAvatarImage.alt = '';
                 }

                 // Logout Button Listener (Attach only once)
                 if (!appLogoutButton.hasAttribute('data-listener-attached')) {
                     console.log("[Auth State] Attaching logout listener.");
                     appLogoutButton.addEventListener('click', () => {
                         console.log("[Logout] Logout button clicked. Signing out...");
                         appAuth.signOut().catch(error => {
                             console.error("[Logout] Error signing out:", error);
                             alert("Logout failed. Please try again."); // Simple user feedback
                         });
                     });
                     appLogoutButton.setAttribute('data-listener-attached', 'true'); // Mark as attached
                 }

             } else {
                 // --- USER IS LOGGED OUT ---
                 console.log("[Auth State] Updating UI for logged-out user...");
                 appUserInfoArea.classList.add('d-none');
                 appLoginPrompt.classList.remove('d-none');
                 appLogoutButton.classList.add('d-none'); // Hide logout button

                 // Reset display
                 appUserDisplayName.textContent = 'Guest';
                 appUserDisplayName.title = 'Not logged in';
                 appUserAvatarInitials.textContent = '??'; // Guest initials
                 appUserAvatarInitials.classList.remove('d-none');
                 appUserAvatarImage.classList.add('d-none');
                 appUserAvatarImage.src = '';
                 appUserAvatarImage.alt = '';

                 // Redirect if necessary (only if currently on the app page)
                 const isAppPage = window.location.pathname.includes('app'); // Adjust if your app page has a different name
                 const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'); // Adjust landing page name if needed

                 if (isAppPage && !isIndexPage) {
                     console.warn("[Auth State] User is logged out on app page. Redirecting to landing page (index.html)...");
                     window.location.replace('index.html'); // Redirect to your landing page
                 } else {
                     console.log("[Auth State] User is logged out, but already on landing page or redirection not needed.");
                 }
             }
             // ----- End Navbar UI Update -----

        }); // End onAuthStateChanged

    } catch (e) {
        console.error("[Firebase Script] CRITICAL ERROR during Firebase initialization:", e);
        // Display a prominent error message to the user
        const body = document.querySelector('body');
        if (body) {
            // Clear body and show error, or append an error banner
            // Example: Append a banner
            const errorBanner = document.createElement('div');
            errorBanner.style.cssText = 'background-color: red; border-radius: 8px; color: white; padding: 10px; text-align: center; position: fixed; top: 6rem; left: 0; width: 40%; font-size: 12px; z-index: 9999;';
            errorBanner.textContent = 'Application Error: Essential services failed to load. Please refresh the page or contact support.';
            body.prepend(errorBanner);
        }
         // Attempt to hide sensitive areas if possible
         const userInfoArea = document.getElementById('app-user-info-area');
         const loginPrompt = document.getElementById('app-login-prompt');
         if(userInfoArea) userInfoArea.classList.add('d-none');
         if(loginPrompt) loginPrompt.innerHTML = '<span class="text-danger">Error</span>';

         // Prevent further app execution if desired
         // throw e;
    }
}); // End DOMContentLoaded
