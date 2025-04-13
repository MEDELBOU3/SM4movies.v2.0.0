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
