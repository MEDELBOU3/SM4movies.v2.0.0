// --- Firebase Configuration (MUST match index.html) ---
const firebaseConfigApp = {
  apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4", // ***** REPLACE *****
  authDomain: "sm4movies.firebaseapp.com",           // ***** REPLACE *****
  projectId: "sm4movies",                      // ***** REPLACE *****
  storageBucket: "sm4movies.appspot.com",       // ***** REPLACE *****
  messagingSenderId: "277353836953",           // ***** REPLACE *****
  appId: "1:277353836953:web:85e02783526c7cb58de308", // ***** REPLACE *****
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

// --- Global Variables for Services ---
let appAuth;
let appDb; // Firestore instance for view tracking etc.

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
       .replace(/&/g, "&") // Use &
       .replace(/</g, "<")  // Use <
       .replace(/>/g, ">")  // Use >
       .replace(/"/g, " ") // Use "
       .replace(/'/g, "'"); // Use '
}

// --- View Tracking Function Definition ---
async function trackView(dbInstance, userId, contentId) {
  // Check if Firestore is available and parameters are valid
  if (!dbInstance) {
      console.error("trackView Error: Firestore instance (appDb) is not available.");
      return;
  }
  if (!userId || !contentId) {
      console.error("trackView Error: Missing userId or contentId.");
      return;
  }
  console.log(`Attempting to track view for content ${contentId} by user ${userId}`);
  try {
      const viewDocRef = dbInstance.collection('users').doc(userId).collection('views').doc(String(contentId));
      await viewDocRef.set({
          contentId: String(contentId),
          lastWatched: firebase.firestore.FieldValue.serverTimestamp(),
          count: firebase.firestore.FieldValue.increment(1)
      }, { merge: true });
      console.log(`Successfully tracked view for content ${contentId}`);
  } catch (error) {
      console.error(`Firestore Error: Failed to track view for content ${contentId}:`, error);
  }
}

// --- Main app.html initialization logic ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("app.html: DOM Ready. Starting Firebase Auth check.");
  try {
      // Initialize Firebase App
      if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfigApp);
          console.log("app.html: Firebase App Initialized.");
      } else {
          firebase.app();
          console.log("app.html: Using existing Firebase App instance.");
      }
      // Get service instances
      appAuth = firebase.auth();
      appDb = firebase.firestore(); // Get Firestore for use by trackView etc.
      console.log("app.html: Firebase Auth and Firestore services obtained.");

      // Get UI Element References
      const appUserInfoArea = document.getElementById('app-user-info-area');
      const appUserAvatar = document.getElementById('app-user-avatar');
      // ... other UI element gets ...
      const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
      const appUserAvatarImage = document.getElementById('app-user-avatar-image');
      const appUserDisplayName = document.getElementById('app-user-display-name');
      const appLogoutButton = document.getElementById('app-logout-button');
      const appLoginPrompt = document.getElementById('app-login-prompt');


      if (!appUserInfoArea || !appLoginPrompt || !appLogoutButton /* Add others if critical */) {
          console.error("app.html: CRITICAL UI elements missing! Auth UI cannot function.");
          return; // Stop if core UI missing
      }

      // Listen for Authentication State Changes
      appAuth.onAuthStateChanged(user => {
          console.log(`app.html: Auth state changed. User ${user ? 'is logged in' : 'is NOT logged in'}.`);
          if (user) {
              // --- USER IS LOGGED IN ---
              if (appUserInfoArea) appUserInfoArea.classList.remove('d-none');
              if (appLoginPrompt) appLoginPrompt.classList.add('d-none');

              if (appUserDisplayName) {
                  const displayName = user.displayName || user.email;
                  appUserDisplayName.textContent = escapeHtmlSimple(displayName);
                  appUserDisplayName.title = `Logged in as: ${escapeHtmlSimple(user.email)}`;
              }

              // Update Avatar
              if (appUserAvatar && appUserAvatarImage && appUserAvatarInitials) {
                  const photoURL = user.photoURL;
                  if (photoURL) { /* ... display image ... */
                       appUserAvatarImage.src = photoURL;
                       appUserAvatarImage.alt = `${user.displayName || user.email}'s profile`;
                       appUserAvatarImage.classList.remove('d-none');
                       appUserAvatarInitials.classList.add('d-none');
                       appUserAvatarInitials.textContent = '';
                  } else { /* ... display initials ... */
                       const initials = getAppInitials(user.displayName, user.email);
                       appUserAvatarInitials.textContent = initials;
                       appUserAvatarInitials.classList.remove('d-none');
                       appUserAvatarImage.classList.add('d-none');
                       appUserAvatarImage.src = '';
                       appUserAvatarImage.alt = '';
                  }
              }

              // Setup Logout Button
              if (appLogoutButton && !appLogoutButton.hasAttribute('data-listener-attached')) {
                  appLogoutButton.classList.remove('d-none');
                  appLogoutButton.addEventListener('click', () => { /* ... sign out logic ... */
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
                  appLogoutButton.classList.remove('d-none');
              }

              // --- CALL VIEW TRACKING FROM ELSEWHERE WHEN NEEDED ---
              // Example - if you have a global function that runs when a movie loads:
              // globalMovieLoadHandler = (movieId) => {
              //     if (appAuth && appAuth.currentUser && appDb) {
              //         trackView(appDb, appAuth.currentUser.uid, movieId);
              //     }
              // };
              // globalMovieLoadHandler(currentMovieId);

          } else {
              // --- USER IS LOGGED OUT ---
              // ... handle logged out UI / redirect ...
               console.log("app.html: User not logged in. Handling redirect or guest UI.");
               if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
               if (appLogoutButton) appLogoutButton.classList.add('d-none');
               if (appLoginPrompt) appLoginPrompt.classList.remove('d-none');
               if (appUserDisplayName) appUserDisplayName.textContent = 'Guest';
               if (appUserAvatarInitials) appUserAvatarInitials.textContent = '?'; // Reset initials

                // --- Redirect if necessary ---
                // Use replace to avoid back button issues
                // Check if already on index to prevent loop (adjust path if landing isn't index.html)
                if (!window.location.pathname.endsWith('/') && !window.location.pathname.includes('index.html')) {
                     console.warn("Redirecting to index.html as user is not logged in.");
                    window.location.replace('index.html');
                }
          }
      }); // End onAuthStateChanged

  } catch (e) { // Catch errors during initialization
      console.error("app.html: Critical error during Firebase setup:", e);
       alert("App initialization failed. Please refresh.");
      // Show an error state
       if (appLoginPrompt) appLoginPrompt.textContent = 'Error loading app.';
      if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
  }
}); // End DOMContentLoaded
