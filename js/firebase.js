  // --- Firebase Configuration ---
  const firebaseConfigApp = {
    apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4",
    authDomain: "sm4movies.firebaseapp.com",
    projectId: "sm4movies",
    storageBucket: "sm4movies.appspot.com",
    messagingSenderId: "277353836953",
    appId: "1:277353836953:web:85e02783526c7cb58de308",
  };

  // --- Global Variables ---
  let appAuth;
  let appDb;

  // --- Initialize Firebase ---
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfigApp);
      console.log("Firebase App Initialized.");
    }
    appAuth = firebase.auth();
    appDb = firebase.firestore();
    console.log("Firebase Auth & Firestore ready.");
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }

  // --- Utility ---
  function getAppInitials(name = '', email = '') {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || '')).toUpperCase();
    }
    return email?.[0]?.toUpperCase() || '??';
  }

  function escapeHtmlSimple(unsafe) {
    return unsafe?.replace(/[&<>"']/g, (match) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[match])) || '';
  }

  // --- View Tracking Function ---
  async function trackView(db, userId, contentId) {
    if (!db || !userId || !contentId) {
      console.error("trackView: missing db/userId/contentId");
      return;
    }
    try {
      const viewRef = db.collection('users').doc(userId).collection('views').doc(String(contentId));
      await viewRef.set({
        contentId: String(contentId),
        lastWatched: firebase.firestore.FieldValue.serverTimestamp(),
        count: firebase.firestore.FieldValue.increment(1)
      }, { merge: true });
      console.log(`Tracked view for ${contentId}`);
    } catch (e) {
      console.error("Error tracking view:", e);
    }
  }

  // --- Main Logic ---
  document.addEventListener('DOMContentLoaded', () => {
    console.log("App loaded, checking auth...");

    const avatar = document.getElementById('app-user-avatar');
    const avatarInitials = document.getElementById('app-user-avatar-initials');
    const avatarImage = document.getElementById('app-user-avatar-image');
    const displayName = document.getElementById('app-user-display-name');
    const infoArea = document.getElementById('app-user-info-area');
    const loginPrompt = document.getElementById('app-login-prompt');
    const logoutBtn = document.getElementById('app-logout-button');

    appAuth.onAuthStateChanged((user) => {
      if (user) {
        infoArea?.classList.remove('d-none');
        loginPrompt?.classList.add('d-none');

        const name = user.displayName || user.email;
        displayName.textContent = escapeHtmlSimple(name);
        displayName.title = `Logged in as: ${user.email}`;

        if (user.photoURL) {
          avatarImage.src = user.photoURL;
          avatarImage.alt = `${name}'s profile`;
          avatarImage.classList.remove('d-none');
          avatarInitials.classList.add('d-none');
        } else {
          avatarInitials.textContent = getAppInitials(user.displayName, user.email);
          avatarInitials.classList.remove('d-none');
          avatarImage.classList.add('d-none');
        }

        // Logout
        if (!logoutBtn.hasAttribute('data-listener-attached')) {
          logoutBtn.classList.remove('d-none');
          logoutBtn.addEventListener('click', () => {
            appAuth.signOut().then(() => console.log("Logged out."));
          });
          logoutBtn.setAttribute('data-listener-attached', 'true');
        }

        // ✅ Call tracking function here (example movieId = 'movie123')
        const movieId = 'movie123'; // Replace with dynamic ID
        trackView(appDb, user.uid, movieId);

      } else {
        console.log("User not logged in.");
        infoArea?.classList.add('d-none');
        loginPrompt?.classList.remove('d-none');
        displayName.textContent = 'Guest';
        avatarInitials.textContent = '?';

        // Optional redirect
        if (!location.pathname.includes('index.html')) {
          window.location.replace('index.html');
        }
      }
    });
  });
