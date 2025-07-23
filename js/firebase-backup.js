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
function getAppInitials(name = '', email = '', photoURL = null) { // <<< ADD photoURL parameter
    // If a photoURL is provided, we might not need initials, but for a fallback, good to have.
    // This function is primarily for initial display in avatar, not for setting src directly.
    if (name && name.trim().length > 0) {
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts[0]?.length > 0) {
            return parts[0].substring(0, 2).toUpperCase();
        }
    }
    if (email && email.includes('@')) {
        return email[0].toUpperCase();
    }
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
    if (!dbInstance) {
        console.error("trackView Error: Firestore instance (appDb) is not available.");
        return;
    }
    if (!userId || !contentId) {
        console.error(`trackView Error: Missing required parameters. UserID: ${userId}, ContentID: ${contentId}`);
        return;
    }

    console.log(`[trackView] Attempting to track view for content '${contentId}' by user '${userId}'`);

    try {
        const viewDocRef = dbInstance.collection('users').doc(userId).collection('views').doc(String(contentId));

        await viewDocRef.set({
            contentId: String(contentId),
            lastWatched: firebase.firestore.FieldValue.serverTimestamp(),
            count: firebase.firestore.FieldValue.increment(1)
        }, { merge: true });

        console.log(`[trackView] Successfully tracked view for content '${contentId}'`);

    } catch (error) {
        console.error(`[trackView] Firestore Error: Failed to track view for content '${contentId}':`, error);
    }
}

// --- Main Initialization Logic for app.html ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("[Firebase Script] DOMContentLoaded event fired. Initializing Firebase...");

    try {
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

        appAuth = firebase.auth();
        appDb = firebase.firestore();
        console.log("[Firebase Init] Auth and Firestore services obtained.");

        const appUserInfoArea = document.getElementById('app-user-info-area');
        const appUserAvatar = document.getElementById('app-user-avatar');
        const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
        const appUserAvatarImage = document.getElementById('app-user-avatar-image');
        const appUserDisplayName = document.getElementById('app-user-display-name');
        const appLoginPrompt = document.getElementById('app-login-prompt');

        const userProfileDropdownToggle = document.getElementById('userProfileDropdown');
        const dropdownUserMenu = document.getElementById('app-user-dropdown-menu');
        const dropdownUserName = document.getElementById('dropdown-user-name');
        const dropdownUserEmail = document.getElementById('dropdown-user-email');
        const appLogoutButtonDropdown = document.getElementById('app-logout-button-dropdown');
        const dropdownUserAvatarLarge = document.getElementById('dropdown-user-avatar-large');
        const dropdownUserAvatarInitialsLarge = document.getElementById('dropdown-user-avatar-initials-large');
        const dropdownUserAvatarImageLarge = document.getElementById('dropdown-user-avatar-image-large');

        const criticalElements = [
            appUserInfoArea, appUserAvatar, appUserAvatarInitials, appUserAvatarImage, appUserDisplayName,
            appLoginPrompt, userProfileDropdownToggle, dropdownUserMenu, dropdownUserName, dropdownUserEmail,
            appLogoutButtonDropdown, dropdownUserAvatarLarge, dropdownUserAvatarInitialsLarge, dropdownUserAvatarImageLarge
        ];

        const missingElements = criticalElements.filter(el => !el);
        if (missingElements.length > 0) {
            console.error("[Firebase Script] CRITICAL ERROR: One or more navbar UI elements for auth display are missing! IDs not found:", missingElements.map(el => el ? 'Exists' : 'Missing -> Check HTML ID').join(', '));
            if(appLoginPrompt) appLoginPrompt.innerHTML = `<span class="text-danger small">UI Error</span>`;
            return;
        }

        console.log("[Firebase Script] Setting up Auth State Change listener...");
        appAuth.onAuthStateChanged(async user => { // <<< Make async to await Firestore calls
            console.log(`[Auth State] Changed. User is ${user ? `LOGGED IN (UID: ${user.uid}, Email: ${user.email})` : 'LOGGED OUT'}.`);

            // ----- Notify the main App script (from script.js) -----
            if (typeof App !== 'undefined' && typeof App.handleAuthReady === 'function') {
                console.log("[Auth State] Notifying App.handleAuthReady...");
                // Pass user object (or null) and Firestore instance
                // We'll load user-specific data *before* calling handleAuthReady
            } else {
                console.warn("[Auth State] App object or App.handleAuthReady function not found. Main app may not initialize correctly with auth state.");
            }

            if (user) {
                // --- USER IS LOGGED IN ---
                console.log("[Auth State] Updating UI for logged-in user...");
                appUserInfoArea.classList.remove('d-none');
                appLoginPrompt.classList.add('d-none');

                const displayName = user.displayName || user.email.split('@')[0];
                appUserDisplayName.textContent = escapeHtmlSimple(displayName);
                userProfileDropdownToggle.title = `User Menu for ${escapeHtmlSimple(displayName)}`;

                const photoURL = user.photoURL;
                // Pass photoURL to getAppInitials, though its primary use is for actual image source
                const initials = getAppInitials(user.displayName, user.email, photoURL); // <<< Pass photoURL

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

                await Favorites.load();

                // --- NEW: Load user's notification subscriptions on login (before App.handleAuthReady) ---
                if (typeof State !== 'undefined' && typeof appDb !== 'undefined') {
                    try {
                        const subscriptionsSnapshot = await appDb.collection("users").doc(user.uid).collection("notificationSubscriptions").get();
                        // Assuming State.activeNotificationSubscriptions is part of your main App's State object
                        // Ensure State is globally accessible or passed in correctly.
                        State.activeNotificationSubscriptions = subscriptionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        console.log("Loaded active notification subscriptions:", State.activeNotificationSubscriptions.length);
                    } catch (error) {
                        console.error("Error loading initial notification subscriptions:", error);
                        if (typeof State !== 'undefined') State.activeNotificationSubscriptions = []; // Clear on error
                    }
                } else {
                    console.warn("State object or appDb not found. Cannot load initial notification subscriptions.");
                }

                // Notify App script (App.handleAuthReady) AFTER loading user-specific data
                if (typeof App !== 'undefined' && typeof App.handleAuthReady === 'function') {
                    App.handleAuthReady(user, appDb);
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

                // --- Clear notification subscriptions on logout ---
                if (typeof State !== 'undefined') State.activeNotificationSubscriptions = []; // <<< NEW

                const currentPagePath = window.location.pathname;
                const isAppPage = currentPagePath.includes('app.html') || currentPagePath.includes('app.html') || currentPagePath.includes('sm4movies.html'); // <<< Check for your main app page
                const isIndexPage = currentPagePath.endsWith('/') || currentPagePath.endsWith('index.html');

                // V V V ADD THIS LINE V V V
                Favorites.clear(); // Clear the local favorites cache on logout
                // ^ ^ ^ ADD THIS LINE ^ ^ ^
                if (isAppPage && !isIndexPage) {
                    console.warn("[Auth State] User is logged out on app page. Redirecting to landing page (index.html)...");
                    window.location.replace('index.html');
                } else {
                    console.log("[Auth State] User is logged out. Redirection not needed or already on landing page.");
                }

                // Notify App script (App.handleAuthReady) for logged out state
                if (typeof App !== 'undefined' && typeof App.handleAuthReady === 'function') {
                    App.handleAuthReady(null, appDb);
                }
            }
        }); // End onAuthStateChanged

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
