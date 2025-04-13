/**
 * Firebase Initialization & Auth Handling for app.html
 *
 * This script should be loaded ONLY in app.html.
 * It initializes Firebase using the shared config and listens for
 * the persistent authentication state set by the landing page.
 * It also initializes Firestore for use within app.html.
 */

(function() {
  'use strict';

  // --- 1. Firebase Configuration ---
  // IMPORTANT: MUST match the configuration used on your landing page.
  const firebaseConfig = {
      apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4", // ***** REPLACE *****
      authDomain: "sm4movies.firebaseapp.com",           // ***** REPLACE *****
      projectId: "sm4movies",                      // ***** REPLACE *****
      storageBucket: "sm4movies.appspot.com",       // ***** REPLACE *****
      messagingSenderId: "277353836953",           // ***** REPLACE *****
      appId: "1:277353836953:web:85e02783526c7cb58de308" // ***** REPLACE *****
      // measurementId: "G-XXXXXX" // Optional
  };

  // --- 2. Global Variables for Firebase Services ---
  let appAuth = null;
  let appDb = null;   // Firestore database instance

  // --- 3. Utility Function ---
  function getAppInitials(name = '', email = '') {
      if (name && name.trim().length > 0) {
          const parts = name.trim().split(' ').filter(Boolean);
          if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          if (parts[0]?.length > 0) return parts[0].substring(0, 2).toUpperCase();
      }
      if (email && email.includes('@')) return email[0].toUpperCase();
      return '??';
  }

  // --- 4. Main Logic Execution ---
  function initializeAppFirebase() {
      console.log("app.html: Initializing Firebase services...");

      // Initialize Firebase App safely
      try {
          if (!firebase.apps.length) {
              firebase.initializeApp(firebaseConfig);
              console.log("app.html: Firebase App Initialized.");
          } else {
              firebase.app(); // Get default app
              console.log("app.html: Using existing Firebase App instance.");
          }
      } catch (initError) {
          console.error("CRITICAL: app.html - Firebase App initialization failed!", initError);
          displayErrorState("Failed to connect to core services. Please refresh.");
          return; // Stop execution if app fails
      }

      // Get Firebase Service Instances
      try {
          appAuth = firebase.auth();
          appDb = firebase.firestore(); // Get Firestore instance
          // Add Storage here if app.html needs direct access: let appStorage = firebase.storage();
          console.log("app.html: Firebase Auth & Firestore services obtained.");
      } catch (serviceError) {
          console.error("CRITICAL: app.html - Failed to get Firebase services (Auth/Firestore)!", serviceError);
          displayErrorState("Failed to connect to authentication or data services.");
          return; // Stop if services fail
      }

      // Proceed only if Auth service is available
      if (appAuth) {
          setupAuthListener();
      } else {
          console.error("CRITICAL: app.html - Firebase Auth service unavailable after initialization!");
          displayErrorState("Authentication service unavailable.");
      }
  }

  // --- 5. Setup Auth Listener ---
  function setupAuthListener() {
      console.log("app.html: Setting up Auth State Listener...");

      // Get UI Element References (Do this *after* DOMContentLoaded)
      const appUserInfoArea = document.getElementById('app-user-info-area');
      const appUserAvatar = document.getElementById('app-user-avatar');
      const appUserAvatarInitials = document.getElementById('app-user-avatar-initials');
      const appUserAvatarImage = document.getElementById('app-user-avatar-image');
      const appUserDisplayName = document.getElementById('app-user-display-name');
      const appLogoutButton = document.getElementById('app-logout-button');
      const appLoginPrompt = document.getElementById('app-login-prompt');

      // Basic check for core elements
      if (!appUserInfoArea || !appLoginPrompt || !appLogoutButton || !appUserAvatar || !appUserAvatarInitials || !appUserAvatarImage || !appUserDisplayName) {
          console.error("app.html: Not all required UI elements found for auth display. Functionality may be broken.");
          // Depending on requirements, could stop here or allow partial functionality
      }


      appAuth.onAuthStateChanged(user => {
          console.log(`app.html: Auth state changed. User is ${user ? 'present' : 'null'}.`);

          if (user) {
              // --- USER IS LOGGED IN ---
              console.log(`app.html: Updating UI for user: ${user.displayName || user.email}`);
              if (appUserInfoArea) appUserInfoArea.classList.remove('d-none');
              if (appLoginPrompt) appLoginPrompt.classList.add('d-none');

              // Update Display Name
              if (appUserDisplayName) {
                  const displayName = user.displayName || user.email; // Fallback
                  appUserDisplayName.textContent = escapeHtmlSimple(displayName); // Use simple escape for safety
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

              // Setup Logout Button (only add listener once)
              if (appLogoutButton && !appLogoutButton.hasAttribute('data-listener-attached')) {
                  appLogoutButton.classList.remove('d-none');
                  appLogoutButton.addEventListener('click', handleLogout);
                  appLogoutButton.setAttribute('data-listener-attached', 'true');
              } else if (appLogoutButton) {
                   appLogoutButton.classList.remove('d-none'); // Still ensure it's visible
              }

              // --- Trigger App Content Loading ---
              // This is where you start loading movies, playlists, etc., using the 'user' and 'appDb' if needed.
               console.log("app.html: User authenticated. Triggering app data loading/initialization.");
               // example: initializeMainAppFeatures(user, appDb);

          } else {
              // --- USER IS LOGGED OUT ---
              console.log("app.html: No user session found. Handling logged out state.");

              // Option 1: Show logged out elements within app.html (if guest access allowed)
              /*
              if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
              if (appLogoutButton) appLogoutButton.classList.add('d-none');
              if (appLoginPrompt) appLoginPrompt.classList.remove('d-none');
              // Reset display elements if they exist
              if (appUserDisplayName) appUserDisplayName.textContent = 'Guest';
               if (appUserAvatar && appUserAvatarImage && appUserAvatarInitials) {
                  appUserAvatarInitials.textContent = '?';
                  appUserAvatarInitials.classList.remove('d-none');
                  appUserAvatarImage.classList.add('d-none');
               }
               */

              // Option 2: Force Redirect to Landing/Login Page (most common for protected apps)
               console.warn("app.html: User is not logged in. Redirecting to landing page.");
               // Check if we aren't already on index.html to prevent loops if landing page logic errors
               if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('index.html')) {
                   // alert("Please log in to access the app."); // Optional feedback
                    window.location.replace('index.html'); // Redirect (adjust filename if different)
               } else {
                    console.log("Already on landing page or root, preventing redirect loop.");
                    // Potentially show the login prompt on the landing page if already there
                    if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
                    if (appLogoutButton) appLogoutButton.classList.add('d-none');
                    if (appLoginPrompt) appLoginPrompt.classList.remove('d-none');
               }
          }
      });
  }

  // --- 6. Logout Handler ---
  function handleLogout() {
      if (!appAuth) {
          console.error("app.html: Cannot logout, Auth service unavailable.");
          return;
      }
      console.log("app.html: Logout button clicked. Signing out...");
      appAuth.signOut()
          .then(() => {
              console.log("app.html: Sign out successful. Redirecting (listener will handle UI/redirect).");
              // The onAuthStateChanged listener above will handle the redirect/UI update.
              // No explicit redirect here needed, unless immediate action preferred.
          })
          .catch(error => {
              console.error("app.html: Sign out failed:", error);
              alert("Logout failed. Please try again.");
          });
  }

  // --- 7. Helper to display major errors ---
  function displayErrorState(message) {
      const appLoginPrompt = document.getElementById('app-login-prompt');
      const appUserInfoArea = document.getElementById('app-user-info-area');
       const body = document.body; // Or a more specific container

      if(body) { // Append a visible error message
           const errorDiv = document.createElement('div');
           errorDiv.style.position = 'fixed';
           errorDiv.style.top = '10px';
           errorDiv.style.left = '10px';
           errorDiv.style.padding = '10px';
           errorDiv.style.backgroundColor = 'red';
           errorDiv.style.color = 'white';
           errorDiv.style.zIndex = '9999';
           errorDiv.textContent = `APP ERROR: ${message}`;
           body.appendChild(errorDiv);
      }
      // Hide normal UI potentially
       if (appLoginPrompt) appLoginPrompt.classList.add('d-none');
       if (appUserInfoArea) appUserInfoArea.classList.add('d-none');
  }

  // --- 8. Simple HTML Escaper (if not globally available) ---
   function escapeHtmlSimple(unsafe) {
       if (typeof unsafe !== 'string') return unsafe; // Only escape strings
       return unsafe
            .replace(/&/g, "&")
            .replace(/</g, "<")
            .replace(/>/g, ">")
            .replace(/"/g, "")
            .replace(/'/g, "'");
   }

  // --- Initialize when DOM is ready ---
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAppFirebase);
  } else {
      initializeAppFirebase(); // DOM already ready
  }

})(); // IIFE to avoid polluting global scope
