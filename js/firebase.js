// --- Firebase Configuration (MUST match index.html) ---
const firebaseConfigApp = {
    apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4", // ***** REPLACE *****
    authDomain: "sm4movies.firebaseapp.com",           // ***** REPLACE *****
    projectId: "sm4movies",                      // ***** REPLACE *****
    storageBucket: "sm4movies.appspot.com",       // ***** REPLACE *****
    messagingSenderId: "277353836953",           // ***** REPLACE *****
    appId: "1:277353836953:web:85e02783526c7cb58de308", // ***** REPLACE *****
};

// --- Global Variables for Services (needed elsewhere in app.html) ---
let appAuth;
let appDb; // You said this is important for view counts
// Add others like `appStorage` if needed in app.html

// --- Helper function for initials ---
function getAppInitials(name = '', email = '') {
    if (name && name.trim().length > 0) {
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        if (parts[0]?.length > 0) return parts[0].substring(0, 2).toUpperCase();
    }
    if (email && email.includes('@')) return email[0].toUpperCase();
    return '??';
}

// --- Helper for simple HTML escaping ---
function escapeHtmlSimple(unsafe) {
     if (typeof unsafe !== 'string') return unsafe;
     return unsafe
          .replace(/&/g, "&")
          .replace(/</g, "<")
          .replace(/>/g, ">")
          .replace(/"/g, """)
          .replace(/'/g, "'");
}


// --- Main app.html initialization logic ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("app.html: DOM Ready. Starting Firebase Auth check.");

    try {
        // Initialize Firebase App (Safely, checks if already initialized)
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfigApp);
            console.log("app.html: Firebase App Initialized.");
        } else {
            firebase.app();
            console.log("app.html: Using existing Firebase App instance.");
        }

        // Get service instances
        appAuth = firebase.auth();
        appDb = firebase.firestore(); // Important for your view tracking
        console.log("app.html: Firebase Auth and Firestore services obtained.");


        // --- Get UI Element References for app.html ---
        const appUserInfoArea = document.getElementById('app-user-info-area');
        const appUserAvatar = document.getElementById('app-user-avatar');
        const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
        const appUserAvatarImage = document.getElementById('app-user-avatar-image');
        const appUserDisplayName = document.getElementById('app-user-display-name');
        const appLogoutButton = document.getElementById('app-logout-button');
        const appLoginPrompt = document.getElementById('app-login-prompt');

        // Validate critical UI elements exist
        if (!appUserInfoArea || !appLoginPrompt || !appLogoutButton) {
             console.error("app.html: CRITICAL UI elements (login prompt/user area/logout button) not found!");
             // Optional: Prevent further app initialization if these are missing
             // return;
        }

        // --- Listen for Authentication State Changes ---
        appAuth.onAuthStateChanged(user => {
            console.log(`app.html: Auth state changed. User ${user ? 'is logged in' : 'is NOT logged in'}.`);

            if (user) {
                // --- USER IS LOGGED IN ---
                console.log(`app.html: Updating UI for user: ${user.displayName || user.email}`);

                if (appUserInfoArea) appUserInfoArea.classList.remove('d-none');
                if (appLoginPrompt) appLoginPrompt.classList.add('d-none'); // Hide login prompt

                if (appUserDisplayName) {
                    const displayName = user.displayName || user.email;
                    appUserDisplayName.textContent = escapeHtmlSimple(displayName);
                    appUserDisplayName.title = `Logged in as: ${escapeHtmlSimple(user.email)}`;
                }

                // Update Avatar (Ensure elements exist)
                if (appUserAvatar && appUserAvatarImage && appUserAvatarInitials) {
                    const photoURL = user.photoURL;
                    if (photoURL) {
                        appUserAvatarImage.src = photoURL;
                        appUserAvatarImage.alt = `${user.displayName || user.email}'s profile`;
                        appUserAvatarImage.classList.remove('d-none');
                        appUserAvatarInitials.classList.add('d-none');
                        appUserAvatarInitials.textContent = '';
                    } else {
                        const initials = getAppInitials(user.displayName, user.email);
                        appUserAvatarInitials.textContent = initials;
                        appUserAvatarInitials.classList.remove('d-none');
                        appUserAvatarImage.classList.add('d-none');
                        appUserAvatarImage.src = '';
                        appUserAvatarImage.alt = '';
                    }
                }

                // Setup Logout Button Listener (Only add once)
                if (appLogoutButton && !appLogoutButton.hasAttribute('data-listener-attached')) {
                    appLogoutButton.classList.remove('d-none');
                    appLogoutButton.addEventListener('click', () => {
                         console.log("app.html: Logout button clicked. Signing out...");
                         appAuth.signOut().then(() => {
                              console.log("app.html: Sign out successful.");
                         }).catch(error => {
                              console.error("app.html: Error signing out:", error);
                              alert("Logout failed.");
                         });
                    });
                    appLogoutButton.setAttribute('data-listener-attached', 'true');
                } else if (appLogoutButton) {
                    appLogoutButton.classList.remove('d-none'); // Ensure it's visible if elements found
                }

                // *** YOUR VIEW TRACKING LOGIC CAN NOW USE `appDb` AND `user` HERE ***
                // Example: Track views based on a loaded movie ID
                // if (appDb) {
                //    trackContentView(appDb, user.uid, currentlyViewedMovieId);
                // }
                // Call your app's main movie loading function if it hasn't run yet
                // loadMainAppContent(user, appDb); // Example
            } else {
                // --- USER IS LOGGED OUT ---
                console.log("app.html: User not logged in. Hiding user elements, showing login prompt.");
                 if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
                 if (appLogoutButton) appLogoutButton.classList.add('d-none'); // Ensure logout is hidden
                 if (appLoginPrompt) appLoginPrompt.classList.remove('d-none'); // Ensure login prompt is visible
                 // Optional: Clear elements' content if they exist
                 if (appUserDisplayName) appUserDisplayName.textContent = 'Guest';
                 if (appUserAvatar && appUserAvatarImage && appUserAvatarInitials) {
                     appUserAvatarInitials.textContent = '?';
                     appUserAvatarInitials.classList.remove('d-none'); // Show default '?'
                      appUserAvatarImage.classList.add('d-none');
                     appUserAvatarImage.src = '';
                 }

                 // Optional: Force Redirect for Protected Apps
                 // Uncomment this if app.html should not be viewable when not logged in
                  console.log("app.html: Redirecting to index.html (Landing/Login Page)...");
                 // window.location.replace('index.html'); // Adjust file name as needed

                 // Optional: Inform user
                  // alert("You need to be logged in to view this content.");

            }
        }); // End onAuthStateChanged
    } catch (e) { // Catch errors during Initialization or Listener setup
        console.error("app.html: Firebase Initialization/Auth listener failed:", e);
         alert("Authentication service failed to load. The app might not work correctly.");
        // Update UI to show error state
        if (appLoginPrompt) {
            appLoginPrompt.innerHTML = `<span class="text-danger">Auth Error: Failed to load authentication.</span>`;
             appLoginPrompt.classList.remove('d-none');
        }
        if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
    }
}); // End DOMContentLoaded
