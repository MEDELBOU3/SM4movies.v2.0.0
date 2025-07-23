// --- firebase.js ---

// --- Firebase Configuration (MUST match your project) ---
const firebaseConfigApp = {
    apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4",
    authDomain: "sm4movies.firebaseapp.com",
    projectId: "sm4movies",
    storageBucket: "sm4movies.appspot.com",
    messagingSenderId: "277353836953",
    appId: "1:277353836953:web:85e02783526c7cb58de308",
};

// --- Global Variables for Firebase Services ---
let firebaseApp;
let appAuth; // Firebase Authentication instance
let appDb;   // Firebase Firestore instance

// <<< FIX: This flag ensures the main app only initializes ONCE.
let isAppInitialized = false;

// --- Helper function for generating user initials ---
function getAppInitials(name = '', email = '', photoURL = null) {
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

// --- Helper for simple HTML escaping ---
function escapeHtmlSimple(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, "")
        .replace(/'/g, "'");
}

// --- User-Specific View Tracking Function ---
async function trackView(dbInstance, userId, contentId) {
    if (!dbInstance || !userId || !contentId) {
        console.error(`trackView Error: Missing required parameters. UserID: ${userId}, ContentID: ${contentId}`);
        return;
    }
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

// --- Main Initialization Logic ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("[Firebase Script] DOMContentLoaded event fired. Initializing Firebase...");

    try {
        if (typeof firebaseConfigApp === 'undefined') {
            throw new Error("firebaseConfigApp is not defined!");
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

        // --- Setup Auth State Listener ---
        // This listener is now the central controller for the app's startup and UI updates.
        appAuth.onAuthStateChanged(async user => {
            console.log(`[Auth State] Changed. User is ${user ? `LOGGED IN (UID: ${user.uid})` : 'LOGGED OUT'}.`);

            // <<< FIX: The main application is initialized here, ONCE, after the first auth check.
            if (!isAppInitialized) {
                console.log("[Auth State] First auth check complete. Initializing main application...");
                if (typeof App !== 'undefined' && typeof App.init === 'function') {
                    App.init(); // This starts the main app logic (Router, etc.)
                    isAppInitialized = true;
                } else {
                    console.error("CRITICAL: Main App object not found. App.init() cannot be called.");
                    // Display a severe error if the main script didn't load.
                    document.body.innerHTML = "<h1>Application failed to load. Please refresh the page.</h1>";
                    return;
                }
            }

            // --- The rest of this function handles UI UPDATES on every auth change ---
            const appUserInfoArea = document.getElementById('app-user-info-area');
            const appLoginPrompt = document.getElementById('app-login-prompt');
            // ... (get other DOM elements)
            
            if (user) {
                // --- USER IS LOGGED IN ---
                if (appUserInfoArea) appUserInfoArea.classList.remove('d-none');
                if (appLoginPrompt) appLoginPrompt.classList.add('d-none');

                // Update UI elements with user data
                updateNavbarUI(user);

                // <<< FIX: Load user-specific data AFTER confirming login.
                if (typeof Favorites !== 'undefined') await Favorites.load();
                if (typeof ContinueWatching !== 'undefined') await ContinueWatching.load();
                if (typeof App !== 'undefined') await App.loadUserSubscriptions(user.uid); // For notifications

            } else {
                // --- USER IS LOGGED OUT ---
                if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
                if (appLoginPrompt) appLoginPrompt.classList.remove('d-none');

                // <<< FIX: Clear any cached user data.
                if (typeof Favorites !== 'undefined') Favorites.clear();
                if (typeof ContinueWatching !== 'undefined') ContinueWatching.clear();
                if (typeof State !== 'undefined') State.activeNotificationSubscriptions = [];

                // Redirect if not on the main landing page
                const currentPagePath = window.location.pathname;
                const isIndexPage = currentPagePath.endsWith('/') || currentPagePath.endsWith('index.html');
                if (!isIndexPage) {
                    console.warn("[Auth State] User is logged out. Redirecting to landing page...");
                    window.location.replace('index.html');
                }
            }
        });

    } catch (e) {
        console.error("[Firebase Script] CRITICAL ERROR during Firebase initialization process:", e);
        document.body.innerHTML = `<h1>Error initializing application services. Please try again later. Details: ${e.message}</h1>`;
    }
});

/**
 * Helper function to update all navbar UI elements related to the user.
 * @param {object} user - The Firebase user object.
 */
function updateNavbarUI(user) {
    // Select all elements safely.
    const elements = {
        displayName: document.getElementById('app-user-display-name'),
        dropdownToggle: document.getElementById('userProfileDropdown'),
        avatarImage: document.getElementById('app-user-avatar-image'),
        avatarInitials: document.getElementById('app-user-avatar-initials'),
        dropdownName: document.getElementById('dropdown-user-name'),
        dropdownEmail: document.getElementById('dropdown-user-email'),
        dropdownAvatarImage: document.getElementById('dropdown-user-avatar-image-large'),
        dropdownAvatarInitials: document.getElementById('dropdown-user-avatar-initials-large'),
        logoutButton: document.getElementById('app-logout-button-dropdown')
    };

    const displayName = user.displayName || user.email.split('@')[0];
    const photoURL = user.photoURL;
    const initials = getAppInitials(user.displayName, user.email, photoURL);

    if (elements.displayName) elements.displayName.textContent = escapeHtmlSimple(displayName);
    if (elements.dropdownToggle) elements.dropdownToggle.title = `User Menu for ${escapeHtmlSimple(displayName)}`;
    if (elements.dropdownName) elements.dropdownName.textContent = escapeHtmlSimple(user.displayName || 'Display Name Not Set');
    if (elements.dropdownEmail) elements.dropdownEmail.textContent = escapeHtmlSimple(user.email);

    // Update both small and large avatars
    [
        { img: elements.avatarImage, initials: elements.avatarInitials },
        { img: elements.dropdownAvatarImage, initials: elements.dropdownAvatarInitials }
    ].forEach(avatar => {
        if (photoURL) {
            if (avatar.img) {
                avatar.img.src = photoURL;
                avatar.img.alt = `${displayName}'s profile picture`;
                avatar.img.classList.remove('d-none');
            }
            if (avatar.initials) avatar.initials.classList.add('d-none');
        } else {
            if (avatar.initials) {
                avatar.initials.textContent = initials;
                avatar.initials.classList.remove('d-none');
            }
            if (avatar.img) avatar.img.classList.add('d-none');
        }
    });

    // Attach logout listener once
    if (elements.logoutButton && !elements.logoutButton.hasAttribute('data-listener-attached')) {
        elements.logoutButton.addEventListener('click', () => {
            appAuth.signOut().catch(error => {
                console.error("[Logout] Error signing out:", error);
                if (typeof Utils !== 'undefined' && Utils.showToast) {
                    Utils.showToast("Logout failed. Please try again.", "danger");
                }
            });
        });
        elements.logoutButton.setAttribute('data-listener-attached', 'true');
    }
}
