// --- Add near the top of your main <script> ---
const firebaseConfig = {
    apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4",
    authDomain: "sm4movies.firebaseapp.com",
    projectId: "sm4movies",
    storageBucket: "sm4movies.firebasestorage.app",
    messagingSenderId: "277353836953",
    appId: "1:277353836953:web:85e02783526c7cb58de308",
    measurementId: "G-690RSNJ2Q2"
  };


// Initialize Firebase
let firebaseApp;
let db;
try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore(); // Get Firestore instance
    console.log("Firebase Initialized Successfully.");
} catch(e) {
     console.error("Firebase initialization failed:", e);
     Utils.showToast("Essential service failed to load. Some features may be disabled.", "danger");
     // Disable features that rely on Firebase
}

// Helper function for initials (copy from landing page utils if needed)
 
    function getAppInitials(name = '', email = '') {
        if (name && name.trim().length > 0) {
            const parts = name.trim().split(' ');
            if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            if (parts[0]?.length > 0) return parts[0].substring(0, 2).toUpperCase();
        }
        if (email && email.includes('@')) return email[0].toUpperCase();
        return '??';
    }

    // --- 2. Initialize Firebase on app.html ---
    let appAuth; // Declare auth variable in accessible scope
    try {
        if (!firebase.apps.length) { // Avoid re-initializing if already done (e.g., shared layout)
            firebase.initializeApp(firebaseConfigApp);
            console.log("Firebase Initialized on app.html");
        } else {
            console.log("Using existing Firebase app instance on app.html");
        }
        appAuth = firebase.auth(); // Get Auth instance
    } catch (e) {
        console.error("CRITICAL: Failed to initialize Firebase on app.html", e);
        // Display error to user? Redirect?
        alert("Error connecting to authentication service. Please try refreshing.");
        // Optionally redirect if app cannot function without Firebase
        // window.location.href = 'index.html';
    }


    // --- 3. Get References to app.html UI Elements ---
    // IMPORTANT: Use UNIQUE IDs for elements in app.html's header/user area
    // to avoid conflicts with landing page elements if scripts somehow run together.
    const appUserInfoArea = document.getElementById('app-user-info-area'); // e.g., a user info area in app.html header
    const appUserAvatar = document.getElementById('app-user-avatar');       // Avatar container DIV in app.html
    const appUserAvatarInitials = document.getElementById('app-user-avatar-initials'); // SPAN for initials in app.html
    const appUserAvatarImage = document.getElementById('app-user-avatar-image'); // IMG tag in app.html
    const appUserDisplayName = document.getElementById('app-user-display-name'); // SPAN for name in app.html
    const appLogoutButton = document.getElementById('app-logout-button');       // Logout button in app.html header
    const appLoginPrompt = document.getElementById('app-login-prompt');     // e.g., a div/button shown if logged out

    // --- 4. Listen for Authentication State Changes ---
    if (appAuth) {
        appAuth.onAuthStateChanged(user => {
            console.log(`Auth state changed on app.html. User present: ${!!user}`);

            if (user) {
                // --- USER IS LOGGED IN ---
                console.log(`User Found: ${user.displayName} (${user.email})`);

                // Update UI Elements (ensure elements exist first)
                if (appUserInfoArea) appUserInfoArea.classList.remove('d-none');
                if (appLoginPrompt) appLoginPrompt.classList.add('d-none'); // Hide login prompt

                if (appUserDisplayName) {
                    const displayName = user.displayName || user.email;
                    appUserDisplayName.textContent = displayName;
                    appUserDisplayName.title = `Logged in as: ${user.email}`;
                }

                // Update Avatar
                if (appUserAvatar && appUserAvatarImage && appUserAvatarInitials) {
                    const photoURL = user.photoURL;
                    if (photoURL) {
                        // Display Image
                        appUserAvatarImage.src = photoURL;
                        appUserAvatarImage.alt = `${user.displayName || user.email}'s profile`;
                        appUserAvatarImage.classList.remove('d-none');
                        appUserAvatarInitials.classList.add('d-none');
                        appUserAvatarInitials.textContent = '';
                    } else {
                        // Display Initials
                        const initials = getAppInitials(user.displayName, user.email);
                        appUserAvatarInitials.textContent = initials;
                        appUserAvatarInitials.classList.remove('d-none');
                        appUserAvatarImage.classList.add('d-none');
                        appUserAvatarImage.src = '';
                        appUserAvatarImage.alt = '';
                    }
                }

                // Activate Logout Button
                if (appLogoutButton) {
                    appLogoutButton.classList.remove('d-none'); // Ensure button is visible
                    // Remove previous listener to prevent duplicates if state changes multiple times
                    const newLogoutButton = appLogoutButton.cloneNode(true); // Clone to remove listeners easily
                    appLogoutButton.parentNode.replaceChild(newLogoutButton, appLogoutButton);
                    // Add the listener to the new button
                    newLogoutButton.addEventListener('click', () => {
                        console.log("Logging out from app.html...");
                        appAuth.signOut().then(() => {
                            console.log("Firebase sign out successful.");
                            // Redirect back to the landing page after logout
                            window.location.href = 'index.html'; // Adjust if landing page has different name
                        }).catch(error => {
                            console.error("Error signing out:", error);
                            alert("Logout failed. Please try again.");
                        });
                    });
                     // Make sure the new variable references the active button in the DOM
                    // (Alternatively, use a flag to add listener only once)
                }

                // --- HERE: You would trigger loading the actual movie/app data ---
                 // Example: loadMovies(), initializePlayer(), etc.

            } else {
                // --- USER IS LOGGED OUT ---
                console.log("No user session found on app.html.");

                // Option 1: Show Logged Out UI within app.html (if parts are public)
                 if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
                 if (appLogoutButton) appLogoutButton.classList.add('d-none');
                 if (appLoginPrompt) appLoginPrompt.classList.remove('d-none'); // Show login prompt
                // Clear avatar/name if needed
                if (appUserDisplayName) appUserDisplayName.textContent = 'Guest';
                if (appUserAvatarImage) appUserAvatarImage.classList.add('d-none');
                if (appUserAvatarInitials) {
                     appUserAvatarInitials.textContent = '?';
                     appUserAvatarInitials.classList.remove('d-none');
                }

                // Option 2: Redirect to Landing/Login Page (More common for protected apps)
                 alert("You need to be logged in to access the app. Redirecting to login.");
                 // Use window.location.replace for cleaner history (prevents back button)
                 window.location.replace('index.html'); // Adjust filename if needed
            }
        });
    } else {
        console.error("Firebase Auth instance not available. Cannot listen for state changes.");
        // Display error? Redirect?
         alert("Authentication service failed to load. Please refresh.");
         if (appLoginPrompt) appLoginPrompt.textContent = "Error loading login status.";
    }



