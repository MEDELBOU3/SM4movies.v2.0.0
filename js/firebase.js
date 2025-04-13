/**
 * Firebase Initialization & Auth Handling for app.html (v1.1)
 *
 * Initializes Firebase App, Auth, and Firestore.
 * Manages login state persistence and UI updates for app.html.
 * Provides the Firestore instance ('appDb') for other app functions.
 */

(function() {
    'use strict';

    // --- 1. Firebase Configuration ---
    // IMPORTANT: MUST match the configuration used on your landing page.
    const firebaseConfigApp = {
        apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4", // ***** REPLACE *****
        authDomain: "sm4movies.firebaseapp.com",           // ***** REPLACE *****
        projectId: "sm4movies",                      // ***** REPLACE *****
        storageBucket: "sm4movies.appspot.com",       // ***** REPLACE *****
        messagingSenderId: "277353836953",           // ***** REPLACE *****
        appId: "1:277353836953:web:85e02783526c7cb58de308", // ***** REPLACE *****
        // measurementId: "G-XXXXXX" // Optional
    };

    // --- 2. Global Variables for Firebase Services ---
    // These will be accessible within this IIFE after initialization.
    let appAuth = null;
    let appDb = null; // Firestore database instance for view counts etc.

    // --- 3. Utility Functions ---
    // Helper function for initials
    function getAppInitials(name = '', email = '') {
        if (name && name.trim().length > 0) {
            const parts = name.trim().split(' ').filter(Boolean);
            if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            if (parts[0]?.length > 0) return parts[0].substring(0, 2).toUpperCase();
        }
        if (email && email.includes('@')) return email[0].toUpperCase();
        return '??';
    }

    // Helper for simple HTML escaping
    function escapeHtmlSimple(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
             .replace(/&/g, "&")
             .replace(/</g, "<")
             .replace(/>/g, ">")
             .replace(/"/g, """)
             .replace(/'/g, "'");
    }

    // --- 4. View Tracking Function Definition ---
    // Define it here so it has access to `firebase.firestore.FieldValue` etc.
    // Ensure this structure matches your Firestore data model.
    async function trackView(dbInstance, userId, contentId) {
        if (!dbInstance) {
            console.error("trackView Error: Firestore instance (appDb) is not available.");
            return; // Cannot proceed without DB instance
        }
        if (!userId || !contentId) {
            console.error("trackView Error: Missing userId or contentId.");
            return; // Cannot proceed without required IDs
        }
        // Ensure contentId is suitable as a Firestore document ID (string, no slashes etc.)
        const validContentId = String(contentId).replace(/\//g, '_'); // Example sanitization

        console.log(`Attempting to track view for content ${validContentId} by user ${userId}`);

        try {
            // Example Path: 'users' collection -> user's document -> 'views' subcollection -> content's document
            const viewDocRef = dbInstance.collection('users').doc(userId).collection('views').doc(validContentId);

            // Use set with merge:true to create/update the document safely
            await viewDocRef.set({
                contentId: validContentId, // Optional: Store the ID within the document too
                lastWatched: firebase.firestore.FieldValue.serverTimestamp(), // Use server timestamp
                viewCount: firebase.firestore.FieldValue.increment(1) // Atomically increment count
            }, { merge: true });

            console.log(`Successfully tracked/updated view for content ${validContentId}`);

        } catch (error) {
            console.error(`Firestore Error: Failed to track view for content ${validContentId}:`, error);
            // Handle error appropriately - maybe retry logic or logging?
        }
    }

    // --- 5. Main Initialization and Auth Logic ---
    function initializeAppFirebase() {
        console.log("app.html: Initializing Firebase services...");

        try {
            // Initialize Firebase App safely
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfigApp);
                console.log("app.html: Firebase App Initialized.");
            } else {
                firebase.app(); // Get default instance if already exists
                console.log("app.html: Using existing Firebase App instance.");
            }

            // Get Firebase Service Instances (Auth and Firestore)
            appAuth = firebase.auth();
            appDb = firebase.firestore(); // ** CRITICAL: This makes 'db' available **

            if (!appAuth) throw new Error("Firebase Auth service unavailable.");
            if (!appDb) throw new Error("Firebase Firestore service unavailable."); // Make Firestore required?

            console.log("app.html: Firebase Auth & Firestore services obtained.");

            // --- If initialization successful, setup the listener ---
            setupAuthListener();

        } catch (error) { // Catch errors during Initialization or Service Retrieval
            console.error("app.html: CRITICAL - Firebase Initialization or Service retrieval failed:", error);
            displayErrorState("Failed to initialize core services. App may not function correctly.");
            // Stop further execution for this script?
        }
    }

    // --- 6. Setup Auth Listener ---
    function setupAuthListener() {
        if (!appAuth) {
            console.error("app.html: Cannot setup auth listener - Auth service not available.");
            return;
        }
        console.log("app.html: Setting up Auth State Listener...");

        // --- Get UI Element References ---
        const appUserInfoArea = document.getElementById('app-user-info-area');
        const appUserAvatar = document.getElementById('app-user-avatar');
        const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
        const appUserAvatarImage = document.getElementById('app-user-avatar-image');
        const appUserDisplayName = document.getElementById('app-user-display-name');
        const appLogoutButton = document.getElementById('app-logout-button');
        const appLoginPrompt = document.getElementById('app-login-prompt');

        if (!appUserInfoArea || !appLoginPrompt || !appLogoutButton || !appUserDisplayName) {
             console.warn("app.html: Some core UI elements for auth display might be missing.");
        }

        // --- Listen for Auth State Changes ---
        appAuth.onAuthStateChanged(user => {
            console.log(`app.html: Auth state changed. User ${user ? 'detected' : 'not detected'}.`);

            if (user) {
                // --- USER IS LOGGED IN ---
                if (appUserInfoArea) appUserInfoArea.classList.remove('d-none');
                if (appLoginPrompt) appLoginPrompt.classList.add('d-none');

                // Update Display Name
                if (appUserDisplayName) {
                    const displayName = user.displayName || user.email;
                    appUserDisplayName.textContent = escapeHtmlSimple(displayName);
                    appUserDisplayName.title = `Logged in as: ${escapeHtmlSimple(user.email)}`;
                }

                // Update Avatar
                if (appUserAvatar && appUserAvatarImage && appUserAvatarInitials) {
                    const photoURL = user.photoURL;
                    if (photoURL) {
                        appUserAvatarImage.src = photoURL;
                        appUserAvatarImage.alt = `${user.displayName || user.email}'s profile`;
                        appUserAvatarImage.classList.remove('d-none');
                        appUserAvatarInitials.classList.add('d-none');
                    } else {
                        const initials = getAppInitials(user.displayName, user.email);
                        appUserAvatarInitials.textContent = initials;
                        appUserAvatarInitials.classList.remove('d-none');
                        appUserAvatarImage.classList.add('d-none');
                    }
                }

                // Setup Logout Button
                if (appLogoutButton && !appLogoutButton.hasAttribute('data-listener-attached')) {
                    appLogoutButton.classList.remove('d-none');
                    appLogoutButton.addEventListener('click', handleLogout);
                    appLogoutButton.setAttribute('data-listener-attached', 'true');
                } else if(appLogoutButton){
                    appLogoutButton.classList.remove('d-none'); // Ensure visible anyway
                }


                // *** VIEW TRACKING LOGIC WOULD BE CALLED FROM *OTHER* PARTS OF app.html NOW ***
                // Those parts can use the `appDb` and `user` variable (or `appAuth.currentUser`).
                 console.log("app.html: User authenticated. App is ready for interaction and data tracking.");
                 // Example: Call a function defined elsewhere in your app.html specific JS
                 // if (typeof startLoadingAppContent === 'function') {
                 //    startLoadingAppContent(user, appDb);
                 // }

            } else {
                // --- USER IS LOGGED OUT ---
                console.log("app.html: User logged out or session expired.");
                if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
                if (appLogoutButton) {
                    appLogoutButton.classList.add('d-none');
                    // Optionally remove listener/attribute if needed, but hiding is usually enough
                     // appLogoutButton.removeAttribute('data-listener-attached');
                }
                if (appLoginPrompt) appLoginPrompt.classList.remove('d-none');

                // --- Redirect Logic ---
                 // Adjust 'index.html' if your landing page is different
                if (!window.location.pathname.endsWith('/') && !window.location.pathname.includes('index.html')) {
                    console.warn("app.html: User not logged in, redirecting to landing page.");
                     window.location.replace('index.html');
                } else {
                    console.log("app.html: User not logged in, but already on landing page/root.");
                }
            }
        }); // End onAuthStateChanged
    }

    // --- 7. Logout Handler ---
    function handleLogout() {
        if (!appAuth) return;
        console.log("app.html: Handling logout request...");
        appAuth.signOut()
            .then(() => console.log("app.html: Sign out successful. Redirect will handled by listener."))
            .catch(error => console.error("app.html: Sign out error:", error));
    }

    // --- 8. Helper to display major initialization errors ---
    function displayErrorState(message) {
         console.error("APP INIT ERROR:", message); // Log detailed error
        // You might want a more user-friendly display than the previous fixed div
        const prompt = document.getElementById('app-login-prompt');
         if (prompt) {
             prompt.innerHTML = `<span class="text-danger p-2">Error: ${escapeHtmlSimple(message)}</span>`;
             prompt.classList.remove('d-none'); // Make sure the prompt area is visible
         } else {
              // Fallback if prompt doesn't exist
             alert(`CRITICAL APP ERROR: ${message}`);
         }
        // Hide the user area if it was somehow visible
         const userInfo = document.getElementById('app-user-info-area');
         if(userInfo) userInfo.classList.add('d-none');
    }

    // --- Initialize when DOM is ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAppFirebase);
    } else {
        initializeAppFirebase(); // DOM already ready
    }

})(); // End IIFE
