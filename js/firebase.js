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

// --- Main Initialization Logic for app.html ---
// --- Main Initialization Logic for app2.html (firebase.js) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Firebase Script] DOMContentLoaded event fired. Initializing Firebase...");

    try {
        // 1. Initialize Firebase App (check if already initialized)
        if (typeof firebaseConfigApp === 'undefined') {
            console.error("[Firebase Script] CRITICAL ERROR: firebaseConfigApp is not defined! Cannot initialize Firebase.");
            const loginPromptFallback = document.getElementById('app-login-prompt');
            if (loginPromptFallback) loginPromptFallback.innerHTML = `<span class="text-danger small">App Config Error</span>`;
            return;
        }

        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfigApp);
            console.log("[Firebase Init] Firebase App initialized successfully.");
        } else {
            firebaseApp = firebase.app();
            console.log("[Firebase Init] Using existing Firebase App instance.");
        }

        // 2. Get Auth and Firestore Service Instances
        appAuth = firebase.auth();
        appDb = firebase.firestore();
        console.log("[Firebase Init] Auth and Firestore services obtained.");

        // 3. Get References to Navbar UI Elements
        const appUserInfoArea = document.getElementById('app-user-info-area');
        const appUserAvatar = document.getElementById('app-user-avatar');
        const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
        const appUserAvatarImage = document.getElementById('app-user-avatar-image');
        // const appUserDisplayName = document.getElementById('app-user-display-name'); // This ID is no longer used in the navbar toggle display
        const appLoginPrompt = document.getElementById('app-login-prompt');

        const userProfileDropdownToggle = document.getElementById('userProfileDropdown');
        const dropdownUserMenu = document.getElementById('app-user-dropdown-menu');
        const dropdownUserName = document.getElementById('dropdown-user-name'); // Name INSIDE the dropdown
        const dropdownUserEmail = document.getElementById('dropdown-user-email');
        const appLogoutButtonDropdown = document.getElementById('app-logout-button-dropdown');
        const dropdownUserAvatarLarge = document.getElementById('dropdown-user-avatar-large');
        const dropdownUserAvatarInitialsLarge = document.getElementById('dropdown-user-avatar-initials-large');
        const dropdownUserAvatarImageLarge = document.getElementById('dropdown-user-avatar-image-large');

        // Validate that critical UI elements exist
        const criticalElements = [
            appUserInfoArea, appUserAvatar, appUserAvatarInitials, appUserAvatarImage,
            appLoginPrompt, userProfileDropdownToggle, dropdownUserMenu, dropdownUserName, dropdownUserEmail,
            appLogoutButtonDropdown, dropdownUserAvatarLarge, dropdownUserAvatarInitialsLarge, dropdownUserAvatarImageLarge
        ];

        // Check for missing elements - if appUserDisplayName was truly removed from HTML, this check is fine.
        // If you still have an element with id="app-user-display-name" elsewhere (not in toggle), this will still look for it.
        const missingElementIds = [];
        const elementIdsToName = { // For clearer error logging
            'app-user-info-area': appUserInfoArea, 'app-user-avatar': appUserAvatar,
            'app-user-avatar-initials': appUserAvatarInitials, 'app-user-avatar-image': appUserAvatarImage,
            'app-login-prompt': appLoginPrompt, 'userProfileDropdown': userProfileDropdownToggle,
            'app-user-dropdown-menu': dropdownUserMenu, 'dropdown-user-name': dropdownUserName,
            'dropdown-user-email': dropdownUserEmail, 'app-logout-button-dropdown': appLogoutButtonDropdown,
            'dropdown-user-avatar-large': dropdownUserAvatarLarge,
            'dropdown-user-avatar-initials-large': dropdownUserAvatarInitialsLarge,
            'dropdown-user-avatar-image-large': dropdownUserAvatarImageLarge
        };

        for (const id in elementIdsToName) {
            if (!elementIdsToName[id]) {
                missingElementIds.push(id);
            }
        }

        if (missingElementIds.length > 0) {
            console.error(`[Firebase Script] CRITICAL ERROR: Navbar UI elements for auth display are missing in app2.html! IDs not found: ${missingElementIds.join(', ')}`);
            if(appLoginPrompt) appLoginPrompt.innerHTML = `<span class="text-danger small">UI Error</span>`;
            return;
        }

        // 4. Listen for Authentication State Changes
        console.log("[Firebase Script] Setting up Auth State Change listener...");
        appAuth.onAuthStateChanged(user => {
            console.log(`[Auth State] Changed. User is ${user ? `LOGGED IN (UID: ${user.uid}, Email: ${user.email})` : 'LOGGED OUT'}.`);

            if (typeof App !== 'undefined' && typeof App.handleAuthReady === 'function') {
                console.log("[Auth State] Notifying App.handleAuthReady...");
                App.handleAuthReady(user, appDb);
            } else {
                console.warn("[Auth State] App object or App.handleAuthReady function not found during auth state change.");
            }

             if (user) {
                 // --- USER IS LOGGED IN ---
                 console.log("[Auth State] Updating UI for logged-in user (avatar only in toggle)...");
                 appUserInfoArea.classList.remove('d-none');
                 appLoginPrompt.classList.add('d-none');

                 const displayNameForTitle = user.displayName || user.email.split('@')[0]; // For tooltip
                 userProfileDropdownToggle.title = `User Menu for ${escapeHtmlSimple(displayNameForTitle)}`;

                 const photoURL = user.photoURL;
                 const initials = getAppInitials(user.displayName, user.email);

                 // Populate Navbar Avatar (the small one in the toggle)
                 if (photoURL) {
                     appUserAvatarImage.src = photoURL;
                     appUserAvatarImage.alt = `${displayNameForTitle}'s profile picture`;
                     appUserAvatarImage.classList.remove('d-none');
                     appUserAvatarInitials.classList.add('d-none');
                     appUserAvatarInitials.textContent = '';
                 } else {
                     appUserAvatarInitials.textContent = initials;
                     appUserAvatarInitials.classList.remove('d-none');
                     appUserAvatarImage.classList.add('d-none');
                     appUserAvatarImage.src = '';
                     appUserAvatarImage.alt = '';
                 }

                 // Populate Dropdown Menu Content (Name is here)
                 dropdownUserName.textContent = escapeHtmlSimple(user.displayName || 'User Profile'); // Use a generic if name not set
                 dropdownUserEmail.textContent = escapeHtmlSimple(user.email);

                 // Populate Large Avatar in Dropdown
                 if (photoURL) {
                     dropdownUserAvatarImageLarge.src = photoURL;
                     dropdownUserAvatarImageLarge.alt = `${displayNameForTitle}'s profile picture`;
                     dropdownUserAvatarImageLarge.classList.remove('d-none');
                     dropdownUserAvatarInitialsLarge.classList.add('d-none');
                     dropdownUserAvatarInitialsLarge.textContent = '';
                 } else {
                     dropdownUserAvatarInitialsLarge.textContent = initials;
                     dropdownUserAvatarInitialsLarge.classList.remove('d-none');
                     dropdownUserAvatarImageLarge.classList.add('d-none');
                     dropdownUserAvatarImageLarge.src = '';
                     dropdownUserAvatarImageLarge.alt = '';
                 }

                 // Logout Button Listener (for the one in the dropdown)
                 if (!appLogoutButtonDropdown.hasAttribute('data-listener-attached')) {
                     console.log("[Auth State] Attaching logout listener to dropdown button.");
                     appLogoutButtonDropdown.addEventListener('click', () => {
                         console.log("[Logout] Dropdown logout button clicked. Signing out...");
                         appAuth.signOut().catch(error => {
                             console.error("[Logout] Error signing out:", error);
                             if (typeof Utils !== 'undefined' && Utils.showToast) {
                                 Utils.showToast("Logout failed. Please try again.", "danger");
                             } else {
                                 alert("Logout failed. Please try again.");
                             }
                         });
                     });
                     appLogoutButtonDropdown.setAttribute('data-listener-attached', 'true');
                 }

             } else {
                 // --- USER IS LOGGED OUT ---
                 console.log("[Auth State] Updating UI for logged-out user...");
                 appUserInfoArea.classList.add('d-none');
                 appLoginPrompt.classList.remove('d-none');

                 dropdownUserName.textContent = 'Guest';
                 dropdownUserEmail.textContent = 'Not logged in';
                 dropdownUserAvatarInitialsLarge.textContent = '??';
                 dropdownUserAvatarInitialsLarge.classList.remove('d-none');
                 dropdownUserAvatarImageLarge.classList.add('d-none');
                 dropdownUserAvatarImageLarge.src = '';

                 const currentPagePath = window.location.pathname;
                 const isAppPage = currentPagePath.includes('app.html') || currentPagePath.includes('app2.html');
                 const isIndexPage = currentPagePath.endsWith('/') || currentPagePath.endsWith('index.html');

                 if (isAppPage && !isIndexPage) {
                     console.warn("[Auth State] User is logged out on app page. Redirecting to landing page (index.html)...");
                     window.location.replace('index.html');
                 } else {
                     console.log("[Auth State] User is logged out. Redirection not needed or already on landing page.");
                 }
             }
        });

    } catch (e) {
        console.error("[Firebase Script] CRITICAL ERROR during Firebase initialization process:", e);
        const body = document.querySelector('body');
        if (body) {
            const errorBanner = document.createElement('div');
            errorBanner.style.cssText = 'background-color: #dc3545; border-radius: 0.25rem; color: white; padding: 10px 15px; text-align: center; position: fixed; top: 5rem; left: 50%; transform: translateX(-50%); font-size: 0.9rem; z-index: 10000; box-shadow: 0 4px 8px rgba(0,0,0,0.2);';
            errorBanner.textContent = 'Application Error: Core services failed. Please refresh or try again later.';
            body.prepend(errorBanner);
            setTimeout(() => errorBanner.remove(), 7000);
        }
        const userInfoArea = document.getElementById('app-user-info-area');
        const loginPrompt = document.getElementById('app-login-prompt');
        if(userInfoArea) userInfoArea.classList.add('d-none');
        if(loginPrompt) loginPrompt.innerHTML = '<span class="text-danger small">Init Error</span>';
    }
}); 
/*
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Firebase Script] DOMContentLoaded event fired. Initializing Firebase...");

    try {
        // 1. Initialize Firebase App (check if already initialized)
        // Ensure firebaseConfigApp is defined above this script or globally
        if (typeof firebaseConfigApp === 'undefined') {
            console.error("[Firebase Script] CRITICAL ERROR: firebaseConfigApp is not defined! Cannot initialize Firebase.");
            // Display a user-facing error if possible
            const loginPromptFallback = document.getElementById('app-login-prompt');
            if (loginPromptFallback) loginPromptFallback.innerHTML = `<span class="text-danger small">App Config Error</span>`;
            return; // Stop initialization
        }

        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfigApp);
            console.log("[Firebase Init] Firebase App initialized successfully.");
        } else {
            firebaseApp = firebase.app(); // Use existing app instance
            console.log("[Firebase Init] Using existing Firebase App instance.");
        }

        // 2. Get Auth and Firestore Service Instances
        appAuth = firebase.auth();
        appDb = firebase.firestore();
        console.log("[Firebase Init] Auth and Firestore services obtained.");

        // 3. Get References to Navbar UI Elements
        const appUserInfoArea = document.getElementById('app-user-info-area');
        const appUserAvatar = document.getElementById('app-user-avatar'); // Main avatar in toggle
        const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
        const appUserAvatarImage = document.getElementById('app-user-avatar-image');
        const appUserDisplayName = document.getElementById('app-user-display-name'); // Name next to avatar in toggle
        const appLoginPrompt = document.getElementById('app-login-prompt');

        // Dropdown Menu Elements
        const userProfileDropdownToggle = document.getElementById('userProfileDropdown'); // The <a> tag that toggles
        const dropdownUserMenu = document.getElementById('app-user-dropdown-menu'); // The <ul> dropdown
        const dropdownUserName = document.getElementById('dropdown-user-name');
        const dropdownUserEmail = document.getElementById('dropdown-user-email');
        const appLogoutButtonDropdown = document.getElementById('app-logout-button-dropdown');
        const dropdownUserAvatarLarge = document.getElementById('dropdown-user-avatar-large');
        const dropdownUserAvatarInitialsLarge = document.getElementById('dropdown-user-avatar-initials-large');
        const dropdownUserAvatarImageLarge = document.getElementById('dropdown-user-avatar-image-large');

        // Validate that critical UI elements exist
        const criticalElements = [
            appUserInfoArea, appUserAvatar, appUserAvatarInitials, appUserAvatarImage, appUserDisplayName,
            appLoginPrompt, userProfileDropdownToggle, dropdownUserMenu, dropdownUserName, dropdownUserEmail,
            appLogoutButtonDropdown, dropdownUserAvatarLarge, dropdownUserAvatarInitialsLarge, dropdownUserAvatarImageLarge
        ];

        const missingElements = criticalElements.filter(el => !el);
        if (missingElements.length > 0) {
            console.error("[Firebase Script] CRITICAL ERROR: One or more navbar UI elements for auth display are missing in app2.html! IDs not found:", missingElements.map(el => el ? 'Exists' : 'Missing -> Check HTML ID').join(', '));
            if(appLoginPrompt) appLoginPrompt.innerHTML = `<span class="text-danger small">UI Error</span>`;
            // You might want to log which specific IDs are missing if criticalElements[i] was checked against a list of strings
            return; // Stop initialization if UI is critically broken
        }

        // 4. Listen for Authentication State Changes
        console.log("[Firebase Script] Setting up Auth State Change listener...");
        appAuth.onAuthStateChanged(user => {
            console.log(`[Auth State] Changed. User is ${user ? `LOGGED IN (UID: ${user.uid}, Email: ${user.email})` : 'LOGGED OUT'}.`);

            // ----- Notify the main App script (from script.js) -----
            if (typeof App !== 'undefined' && typeof App.handleAuthReady === 'function') {
                console.log("[Auth State] Notifying App.handleAuthReady...");
                App.handleAuthReady(user, appDb); // Pass user object (or null) and Firestore instance
            } else {
                console.warn("[Auth State] App object or App.handleAuthReady function not found. Main app may not initialize correctly with auth state.");
            }

             // ----- Update Navbar UI based on Auth State -----
             if (user) {
                 // --- USER IS LOGGED IN ---
                 console.log("[Auth State] Updating UI for logged-in user...");
                 appUserInfoArea.classList.remove('d-none');
                 appLoginPrompt.classList.add('d-none');

                 // Display Name (for the toggle in the navbar)
                 const displayName = user.displayName || user.email.split('@')[0];
                 appUserDisplayName.textContent = escapeHtmlSimple(displayName);
                 userProfileDropdownToggle.title = `User Menu for ${escapeHtmlSimple(displayName)}`; // Update toggle title

                 const photoURL = user.photoURL;
                 const initials = getAppInitials(user.displayName, user.email);

                 // Populate Navbar Avatar (the small one in the toggle)
                 if (photoURL) {
                     appUserAvatarImage.src = photoURL;
                     appUserAvatarImage.alt = `${displayName}'s profile picture`;
                     appUserAvatarImage.classList.remove('d-none');
                     appUserAvatarInitials.classList.add('d-none');
                     appUserAvatarInitials.textContent = '';
                 } else {
                     appUserAvatarInitials.textContent = initials;
                     appUserAvatarInitials.classList.remove('d-none');
                     appUserAvatarImage.classList.add('d-none');
                     appUserAvatarImage.src = '';
                     appUserAvatarImage.alt = '';
                 }

                 // Populate Dropdown Menu Content
                 dropdownUserName.textContent = escapeHtmlSimple(user.displayName || 'Not Set');
                 dropdownUserEmail.textContent = escapeHtmlSimple(user.email);

                 // Populate Large Avatar in Dropdown
                 if (photoURL) {
                     dropdownUserAvatarImageLarge.src = photoURL;
                     dropdownUserAvatarImageLarge.alt = `${displayName}'s profile picture`;
                     dropdownUserAvatarImageLarge.classList.remove('d-none');
                     dropdownUserAvatarInitialsLarge.classList.add('d-none');
                     dropdownUserAvatarInitialsLarge.textContent = '';
                 } else {
                     dropdownUserAvatarInitialsLarge.textContent = initials;
                     dropdownUserAvatarInitialsLarge.classList.remove('d-none');
                     dropdownUserAvatarImageLarge.classList.add('d-none');
                     dropdownUserAvatarImageLarge.src = '';
                     dropdownUserAvatarImageLarge.alt = '';
                 }

                 // Logout Button Listener (for the one in the dropdown)
                 if (!appLogoutButtonDropdown.hasAttribute('data-listener-attached')) {
                     console.log("[Auth State] Attaching logout listener to dropdown button.");
                     appLogoutButtonDropdown.addEventListener('click', () => {
                         console.log("[Logout] Dropdown logout button clicked. Signing out...");
                         appAuth.signOut().catch(error => {
                             console.error("[Logout] Error signing out:", error);
                             // Use the Utils.showToast if available and initialized, otherwise alert
                             if (typeof Utils !== 'undefined' && Utils.showToast) {
                                 Utils.showToast("Logout failed. Please try again.", "danger");
                             } else {
                                 alert("Logout failed. Please try again.");
                             }
                         });
                     });
                     appLogoutButtonDropdown.setAttribute('data-listener-attached', 'true');
                 }

             } else {
                 // --- USER IS LOGGED OUT ---
                 console.log("[Auth State] Updating UI for logged-out user...");
                 appUserInfoArea.classList.add('d-none');
                 appLoginPrompt.classList.remove('d-none');

                 // Reset dropdown content (optional, as it will be hidden)
                 dropdownUserName.textContent = 'Guest';
                 dropdownUserEmail.textContent = 'Not logged in';
                 dropdownUserAvatarInitialsLarge.textContent = '??';
                 dropdownUserAvatarInitialsLarge.classList.remove('d-none');
                 dropdownUserAvatarImageLarge.classList.add('d-none');
                 dropdownUserAvatarImageLarge.src = '';


                 const currentPagePath = window.location.pathname;
                 const isAppPage = currentPagePath.includes('app.html') || currentPagePath.includes('app2.html'); // Be more specific
                 const isIndexPage = currentPagePath.endsWith('/') || currentPagePath.endsWith('index.html');

                 // Redirect to index.html if logged out and currently on an app page (not index.html itself)
                 if (isAppPage && !isIndexPage) {
                     console.warn("[Auth State] User is logged out on app page. Redirecting to landing page (index.html)...");
                     window.location.replace('index.html'); // Or the correct path to your landing page
                 } else {
                     console.log("[Auth State] User is logged out. Redirection not needed or already on landing page.");
                 }
             }
             // ----- End Navbar UI Update -----
        }); // End onAuthStateChanged

    } catch (e) {
        console.error("[Firebase Script] CRITICAL ERROR during Firebase initialization process:", e);
        const body = document.querySelector('body');
        if (body) {
            const errorBanner = document.createElement('div');
            errorBanner.style.cssText = 'background-color: #dc3545; border-radius: 0.25rem; color: white; padding: 10px 15px; text-align: center; position: fixed; top: 5rem; left: 50%; transform: translateX(-50%); font-size: 0.9rem; z-index: 10000; box-shadow: 0 4px 8px rgba(0,0,0,0.2);';
            errorBanner.textContent = 'Application Error: Core services failed. Please refresh or try again later.';
            body.prepend(errorBanner); // Prepend to ensure visibility
            setTimeout(() => errorBanner.remove(), 7000); // Auto-remove after 7 seconds
        }
        // Attempt to hide sensitive areas if possible, though they might not even be rendered.
        const userInfoArea = document.getElementById('app-user-info-area');
        const loginPrompt = document.getElementById('app-login-prompt');
        if(userInfoArea) userInfoArea.classList.add('d-none');
        if(loginPrompt) loginPrompt.innerHTML = '<span class="text-danger small">Init Error</span>';
    }
}); 
*/


/*
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
*/
