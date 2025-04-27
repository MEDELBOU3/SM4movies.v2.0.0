      /**
       * AuraStream Landing Page Script v9.2 (Fully Developed & Integrated)
       * Includes: Intro Video, Enhanced 3D BG/Gallery, API Key Validation, Feature Player, Full Error Handling.
       */
  
      // --- Main Application Object ---
      const AuraStreamApp = {
  
  // --- Configuration ---
  config: {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        //  CRITICAL: REPLACE WITH YOUR VALID TMDB API KEY! GET ONE FROM themoviedb.org (Free)
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        TMDB_API_KEY: '431fb541e27bceeb9db2f4cab69b54e1', // <<<--- PUT YOUR REAL, ACTIVE KEY HERE
        TMDB_BASE_URL: 'https://api.themoviedb.org/3',
        IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
        POSTER_SIZE: 'w500',
        PROFILE_SIZE: 'w185',
        BACKDROP_SIZE: 'w1280',
        HERO_BACKDROP_SIZE: 'original',
        YOUTUBE_EMBED_URL: 'https://www.youtube.com/embed/', // Base URL for YouTube embeds
        CONTENT_SHELVES: [
            { id: 'trending-movie', title: 'Trending Movies', endpoint: '/trending/movie/week', containerSelector: '#trending-movies-scroll', type: 'movie', params: {}, ariaControls: 'trending-movies-scroll' },
            { id: 'popular-tv', title: 'Popular TV Shows', endpoint: '/tv/popular', containerSelector: '#popular-tv-scroll', type: 'tv', params: {}, ariaControls: 'popular-tv-scroll'},
            { id: 'toprated-movie', title: 'Top Rated Movies', endpoint: '/movie/top_rated', containerSelector: '#toprated-movies-scroll', type: 'movie', params: { region: 'US' }, ariaControls: 'toprated-movies-scroll' },
            // { id: 'community-picks', title: 'Community Picks', endpoint: '/discover/movie', containerSelector: '#shelf-community-picks .horizontal-scroll-container', type: 'movie', params: { sort_by: 'vote_average.desc', 'vote_count.gte': 500 }, ariaControls: 'community-picks-scroll' } // Community picks removed as section was removed
        ],
        HERO_UPDATE_INTERVAL: 90000, // Slightly longer interval
        AOS_CONFIG: { duration: 700, once: true, offset: 80, easing: 'ease-out-cubic' },
        SCROLL_DEBOUNCE: 150,
        RESIZE_DEBOUNCE: 250,
        LOADING_SCREEN_FADE_DURATION: 700,
        THREE_PARTICLE_COUNT: 6500,
        THREE_GALAXY_RADIUS: 600,
        THREE_PARTICLE_SIZE: 0.8,
        THREE_PARTICLE_OPACITY: 0.7,
        THREE_ANIMATED_OBJ_OPACITY: 0.1, // Opacity for the wireframe object
        GALLERY_AUTO_ROTATE_DELAY: 12000, // Longer delay before auto-rotate starts
        GALLERY_AUTO_ROTATE_INTERVAL: 6000, // Slower auto-rotate speed
        GALLERY_PERSPECTIVE: 1200,
        GALLERY_CARD_WIDTH: 340, // Width of 3D gallery cards
        GALLERY_CARD_HEIGHT: 220, // Height of 3D gallery cards
        GALLERY_TRANSLATE_Z_BASE: 290, // How far back non-active cards are
        GALLERY_TRANSLATE_Z_ACTIVE: 340, // How far forward active card is
        GALLERY_SCALE_ACTIVE: 1.1, // How much active card scales up
        INTRO_VIDEO_TIMEOUT_MS: 0, // Set to 0 to disable timeout, > 0 for timeout in ms
        AUTH_REDIRECT_URL: 'app.html', // Target page after successful login/signup
        DEBUG_MODE: true, // Set to false for production to reduce console noise
        // --- Firebase Configuration ---
         firebaseConfig: {
            apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4", // Example - REPLACE with yours
            authDomain: "sm4movies.firebaseapp.com", // Example - REPLACE with yours
            projectId: "sm4movies", // Example - REPLACE with yours
            storageBucket: "sm4movies.appspot.com", // Example - REPLACE with yours (Ensure correct format if using Storage)
            messagingSenderId: "277353836953", // Example - REPLACE with yours
            appId: "1:277353836953:web:85e02783526c7cb58de308", // Example - REPLACE with yours
            // measurementId: "G-XXXXXXXXXX" // Optional: Add if using Analytics
        }
    },


  // --- Application State ---


  state: {
        heroMovie: null, featuredTrailerMovieId: null, movieVideosCache: new Map(), shelfScrollData: new Map(),
        isMobileMenuOpen: false, threeAnimationId: null, librariesLoaded: { three: false, bootstrap: false, aos: false },
        galleryAutoRotateTimeout: null, galleryAutoRotateInterval: null, isGalleryDragging: false,
        introHidden: false, domReady: false, initializationComplete: false, apiKeyValid: false,
        isLoggedIn: false, 
        currentUser: null, 
        firebaseApp: null,
        firebaseAuth: null, 
        firebaseStorage: null, 
        firebaseFirestore: null,
        authListenerUnsubscribe: null
   },
  // --- DOM Element Cache ---
  elements: {},

  // --- Utility Functions ---

  utils: {
        log: function(message, ...optionalParams) { if (AuraStreamApp.config.DEBUG_MODE) console.log(`[AuraStream] ${message}`, ...optionalParams); },
        error: function(message, ...optionalParams) { console.error(`[AuraStream Error] ${message}`, ...optionalParams); },
        warn: function(message, ...optionalParams) { console.warn(`[AuraStream Warn] ${message}`, ...optionalParams); },
        escapeHtml: (unsafe) => { if (unsafe === null || typeof unsafe === 'undefined') return ''; return String(unsafe).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "").replace(/'/g, "'"); },
        debounce: (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(this, args); }, delay); }; },
        fetchTMDB: async (endpoint, params = {}) => { /* ... Same robust fetch logic as v8.5 ... */
            const config = AuraStreamApp.config; const utils = AuraStreamApp.utils;
            if (!AuraStreamApp.state.apiKeyValid) { utils.error("API Key is invalid. Fetch aborted."); return null; }
            const defaultParams = { api_key: config.TMDB_API_KEY, language: 'en-US' };
            const urlParams = new URLSearchParams({ ...defaultParams, ...params });
            for (const [key, value] of urlParams.entries()) { if (value === null || value === '' || value === 'undefined') urlParams.delete(key); }
            const url = `${config.TMDB_BASE_URL}${endpoint}?${urlParams.toString()}`; // utils.log(`Fetching TMDB: ${endpoint}`);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    let errorData = { status_message: `HTTP error! Status: ${response.status}` }; try { errorData = await response.json(); } catch (e) { utils.warn(`Could not parse JSON error for ${endpoint}`); }
                    utils.error(`TMDB API Error ${response.status} for ${endpoint}:`, errorData); if (response.status === 401) { utils.error("API Error 401: Unauthorized."); AuraStreamApp.state.apiKeyValid = false; AuraStreamApp.modules?.loadingScreen?.showError("Invalid API Key"); } return null;
                }
                const data = await response.json(); // utils.log(`Fetch Success: ${endpoint}`);
                return data;
            } catch (error) { utils.error(`TMDB Fetch Network Error (${endpoint}):`, error); AuraStreamApp.modules?.loadingScreen?.showError("Network Error"); return null; }
         },
        getLoadingTextHTML: (text = "Loading...") => `<div class="loading-shelf-text w-100 d-flex align-items-center justify-content-center py-4" role="status"><div class="loading-spinner me-2"></div> ${AuraStreamApp.utils.escapeHtml(text)}</div>`,
        getErrorTextHTML: (text = "Could not load content.") => `<div class="error-shelf-text w-100 d-flex align-items-center justify-content-center py-4 text-danger" role="alert"><i class="bi bi-exclamation-triangle-fill me-2"></i> ${AuraStreamApp.utils.escapeHtml(text)}</div>`,
        getSkeletonCardHTML: () => ` <div class="movie-card skeleton-placeholder" aria-hidden="true"> <div class="card-image-wrapper skeleton-item"></div> <div class="card-content"> <div class="skeleton-item title mb-2"></div> <div class="skeleton-item meta"></div> </div> <style> .skeleton-item { background: linear-gradient(110deg, rgba(var(--border-color),0.4) 8%, rgba(var(--border-color),0.6) 18%, rgba(var(--border-color),0.4) 33%); background-size: 200% 100%; border-radius: var(--radius-sm); animation: 1.8s pulse-skeleton linear infinite; } .skeleton-placeholder .title { height: 1rem; width: 85%; } .skeleton-placeholder .meta { height: 0.7rem; width: 55%; } @keyframes pulse-skeleton { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } } </style> </div>`,
        getSkeletonShelfHTML: (count = 6) => { let h = ''; for (let i = 0; i < count; i++) h += AuraStreamApp.utils.getSkeletonCardHTML(); return h; },
        formatDate: (d) => { if (!d) return 'N/A'; try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); } catch (e) { return 'Invalid Date'; } },
        getYear: (d) => { if (!d) return ''; try { return new Date(d).getFullYear(); } catch (e) { return ''; } },
        fetchMovieVideos: async function(movieId) { /* ... unchanged ... */ const utils=AuraStreamApp.utils;if(AuraStreamApp.state.movieVideosCache.has(movieId))return AuraStreamApp.state.movieVideosCache.get(movieId);if(!movieId)return[];utils.log(`Fetching videos for ID: ${movieId}`);const data=await utils.fetchTMDB(`/movie/${movieId}/videos`);if(!data){AuraStreamApp.state.movieVideosCache.set(movieId,[]);return[]}const videos=data?.results?.filter(v=>v.site==='YouTube')||[];AuraStreamApp.state.movieVideosCache.set(movieId,videos);return videos},
        getBestTrailer: (vids) => { /* ... unchanged ... */ if(!vids||vids.length===0)return null;const t=vids.find(v=>v.type==='Trailer'&&v.official);if(t)return t;const ot=vids.find(v=>v.type==='Teaser'&&v.official);if(ot)return ot;const at=vids.find(v=>v.type==='Trailer');if(at)return at;const ayt=vids.find(v=>v.type==='Teaser');if(ayt)return ayt;const c=vids.find(v=>v.type==='Clip'||v.type==='Featurette');if(c)return c;return vids[0]||null },
        setCopyrightYear: () => { try { const el = AuraStreamApp.elements.copyYear; if(el) el.textContent = new Date().getFullYear(); else AuraStreamApp.utils.warn("Copyright year element not found."); } catch(e) { AuraStreamApp.utils.error("Error setting copyright year:", e); } },
        getCssVariable: (v, f) => { try { let val = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return val || f; } catch (e) { return f; } },
        getInitials: (name = '', email = '') => {
            if (name && name.trim().length > 0) {
              const parts = name.trim().split(' ');
            if (parts.length > 1) {
              return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else if (parts[0].length > 0) {
              return parts[0].substring(0, 2).toUpperCase();
            }
            }
            if (email && email.includes('@')) {
               return email[0].toUpperCase();
            }
            return '??'; // Fallback
        }
    },


  // --- API Key Validation ---
  validateApiKey: function() { // Runs early to set state.apiKeyValid
        const utils = this.utils;
        const key = this.config.TMDB_API_KEY;
        let isValid = true;
        utils.log("Validating TMDB API Key Structure...");

        if (!key || key === 'YOUR_TMDB_API_KEY' || key.length < 30) { // Combined checks
            utils.error("TMDB API Key FAIL: Key is missing, placeholder, or too short.");
            isValid = false;
        }

        this.state.apiKeyValid = isValid; // Set state

        if (!isValid) {
             utils.error(">>> ACTION REQUIRED: Set a valid TMDB API key in config. <<<");
        } else {
             utils.log("TMDB API Key structure appears OK.");
        }
     },


  // --- Display Data Loading Errors ---
  displayDataLoadingErrors: function(message = "Cannot load data: Check API Key or Network.") { // Updated default message
     /* ... (Same display logic as v9.2, populates errors in sections) ... */
     const utils = this.utils; utils.warn(`Displaying data loading errors: ${message}`); const errorHtml = utils.getErrorTextHTML(message);
    this.modules.hero.handleInitialLoadFailure(message);
    this.config.CONTENT_SHELVES.forEach(shelf => { try { const container = document.querySelector(shelf.containerSelector); if (container) { container.innerHTML = errorHtml; const wrapper = container.closest('.horizontal-scroll-wrapper'); wrapper?.querySelectorAll('.h-scroll-btn').forEach(btn => btn.classList.add('disabled')); } else utils.warn(`Shelf container not found: ${shelf.containerSelector}`); } catch (e) { utils.error(`Error display shelf ${shelf.id}:`, e); } });
    try { if (this.elements.trailerFeatureSection) this.modules.trailerFeature.displayError(message); } catch (e) { utils.error("Error display trailer:", e); }
    try { if (document.getElementById('analytics-dashboard')) this.modules.analyticsDashboard.displayError(message); } catch (e) { utils.error("Error display analytics:", e); }
  },

// --- Initialization ---
init: function() {
    this.utils.log("AuraStream Landing (v9.5 - Force Fetch Test) Initializing..."); // Version marker
    if (this.state.domReady) return;

    document.addEventListener('DOMContentLoaded', () => {
        this.utils.log("DOM Loaded. Starting App Initialization."); this.state.domReady = true;
        try {
            this.utils.log("Phase 1: Critical Setup...");
            if (!this.initDomElements()) throw new Error("Essential DOM elements missing.");
            this.validateApiKey(); // Validate TMDB Key structure (sets state.apiKeyValid)
            this.checkLibraries();
            if (!this.initializeFirebase()) {
                // Firebase init failure might prevent auth-related UI updates,
                // but we might still try to load public data if TMDB key is okay.
                 this.utils.error("Firebase initialization failed, but attempting public data load.");
            }
            if (this.elements.loadingScreen) { this.utils.log("Hiding original loading screen."); this.elements.loadingScreen.style.display = 'none'; }

            this.utils.log("Phase 2: Synchronous UI Module Init...");
            this.initSyncModules(); // Includes introVideo.init, auth.init, etc.

            this.utils.log("Phase 3: Visual Enhancements Init...");
            this.initVisualLibraries(); // Init 3D BG, AOS

            // --- MODIFICATION: Force Async Operations (Bypass Auth Listener for initial load) ---
            if (this.state.apiKeyValid) {
                this.utils.warn(">>> FORCE FETCH TEST: Calling runAsyncInits directly after sync setup. <<<");
                this.runAsyncInits(); // <<<--- CALLING IT HERE
            } else {
                this.utils.error("API Key Invalid - Skipping Async Data Loading.");
                // Display error immediately if intro is already hidden (unlikely here)
                if (this.state.introHidden) {
                   this.displayDataLoadingErrors();
                } // Error display will primarily happen post-intro via its callback
            }
            // --- END MODIFICATION ---

            this.state.initializationComplete = true; // Mark sync init complete
            this.utils.log(`AuraStream Initial Sync Setup Complete. API Key Structurally Valid: ${this.state.apiKeyValid}`);
            // The onAuthStateChanged listener will still run later to handle actual login state UI.

        } catch (error) {
            this.utils.error("CRITICAL ERROR during Initialization:", error);
            try { document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Init Error</h1><p>Check console (F12).</p><pre>${error.message}</pre></div>`; } catch {}
        }
    });
}, 

// --- Firebase Initialization ---
initializeFirebase: function() {
    const utils = this.utils;
    const config = this.config.firebaseConfig;
    const state = this.state;
    const app = AuraStreamApp;

    utils.log("Initializing Firebase...");

    // 1. Check Config (apiKey, authDomain, projectId required)
    if (!config?.apiKey || !config?.authDomain || !config?.projectId || config.apiKey === "YOUR_API_KEY") {
        utils.error("Firebase configuration missing/incomplete or uses placeholders.");
        alert("CRITICAL: Firebase not configured. Auth features unavailable.");
        return false;
    }
     // Warn if storageBucket missing for uploads
    if (!config.storageBucket) {
        utils.warn("Firebase storageBucket missing. Profile picture uploads will fail.");
    }

    // 2. Check SDKs (App, Auth, Storage, Firestore needed for full features)
    if (typeof firebase === 'undefined' || !firebase.app || !firebase.auth || !firebase.storage || !firebase.firestore) {
        utils.error("Required Firebase SDKs (app, auth, storage, firestore compat) not loaded. Check HTML.");
        alert("CRITICAL: Firebase libraries failed to load. Required features unavailable.");
        return false;
    }

    try {
        // 3. Initialize Services (once)
        if (!state.firebaseApp) {
            state.firebaseApp = firebase.initializeApp(config);
            state.firebaseAuth = firebase.auth();
            try {
                state.firebaseStorage = firebase.storage(); // Initialize Storage
            } catch (storageError) {
                utils.error("Firebase Storage init failed:", storageError);
                state.firebaseStorage = null;
            }
            try {
                state.firebaseFirestore = firebase.firestore(); // Initialize Firestore
            } catch (firestoreError) {
                 utils.error("Firebase Firestore init failed:", firestoreError);
                 state.firebaseFirestore = null;
            }
            utils.log("Firebase App, Auth, Storage, Firestore initialized.");
        } else {
            utils.log("Firebase App already initialized.");
        }

        // 4. Auth State Listener (once)
        if (!state.authListenerUnsubscribe && state.firebaseAuth) {
            utils.log("Attaching Firebase onAuthStateChanged listener...");
            state.authListenerUnsubscribe = state.firebaseAuth.onAuthStateChanged(user => {
                utils.log(`Firebase onAuthStateChanged: User is ${user ? 'LOGGED IN' : 'LOGGED OUT'}`);
                let isInitialAuthCheck = !state.initializationComplete;

                // Update Auth State
                if (user) {
                     // Fetch potentially updated profile info each time state changes
                    state.isLoggedIn = true;
                    state.currentUser = { // Store relevant, latest data
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL // Get latest photoURL
                    };
                     utils.log(`Logged in User details:`, state.currentUser);
                } else {
                    state.isLoggedIn = false;
                    state.currentUser = null;
                }

                // Update UI (Header, etc.)
                app.modules.auth.updateAuthUI();

                // Trigger Async Data Load (Only on First Check after init)
                if (isInitialAuthCheck) {
                     utils.log("Processing initial auth check tasks...");
                    if (state.apiKeyValid) { // Check TMDB Key validity
                        utils.log("TMDB key valid -> Running async TMDB data fetches...");
                        app.runAsyncInits();
                    } else {
                        utils.warn("TMDB key invalid. Displaying errors post-intro if applicable.");
                        if (state.introHidden) app.displayDataLoadingErrors();
                    }
                    // Mark the *core* initialization (sync parts) as complete
                    state.initializationComplete = true;
                    utils.log("Initial Auth check complete. Main init sequence finished.");
                }

                // Post-Login/Signup Redirect (if login/signup just happened)
                if (user && !isInitialAuthCheck && app.elements.launchAppModal?.classList.contains('show')) {
                    utils.log("Post-load auth change detected via modal, redirecting...");
                    app.modules.modals.closeAuthModal();
                    setTimeout(() => { // Slight delay helpful sometimes
                       window.location.href = app.config.AUTH_REDIRECT_URL;
                    }, 100);
                    return; // Prevent further listener actions on this cycle due to redirect
                }

                // Hide Intro if needed
                if (!state.introHidden && app.modules?.introVideo?.hideOverlay) {
                     utils.log("Auth resolved before intro finished. Hiding intro.");
                    app.modules.introVideo.hideOverlay(true); // Force hide
                }

            }); // End of onAuthStateChanged listener
            utils.log("Firebase onAuthStateChanged listener attached.");
        } else if (state.authListenerUnsubscribe) {
             utils.log("Firebase onAuthStateChanged listener already attached.");
        }

        return true; // Firebase setup success

    } catch (error) {
        utils.error("CRITICAL Firebase initialization failed:", error);
        alert("Could not initialize Firebase core services. Login/signup unavailable.");
        app.modules?.auth?.updateAuthUI(); // Try to set UI to logged-out
        if (state.apiKeyValid) { // Display TMDB errors if key was ok but firebase failed
            app.displayDataLoadingErrors("Firebase Init Failed");
        }
        return false; // Failure
    }
},// End initializeFirebase

  // --- Library Checks ---
  checkLibraries: function() { this.state.librariesLoaded.three = typeof THREE !== 'undefined'; this.state.librariesLoaded.bootstrap = typeof bootstrap !== 'undefined'; this.state.librariesLoaded.aos = typeof AOS !== 'undefined'; this.utils.log("Libraries Checked:", this.state.librariesLoaded); },

  // --- DOM Element Caching ---
  initDomElements: function() {
    this.utils.log("Caching DOM Elements...");
    const els = {
        // Intro Elements
        introOverlay: document.getElementById('intro-overlay'), introVideo: document.getElementById('intro-video'), skipIntroButton: document.getElementById('skip-intro-button'),
        // Core & Other Sections
        loadingScreen: document.querySelector('.loading-screen'), threeCanvas: document.getElementById('three-bg-canvas'), navbar: document.querySelector('.landing-navbar'),
        mobileMenuToggle: document.getElementById('mobile-menu-toggler'), mobileMenuClose: document.getElementById('mobile-menu-close'), mobileMenu: document.getElementById('mobile-menu'), offcanvasOverlay: document.getElementById('offcanvas-overlay'),
        heroSection: document.getElementById('hero'), heroBgImage: document.getElementById('hero-bg-image'), heroTitle: document.getElementById('hero-title'), heroOverview: document.getElementById('hero-overview'), heroInfoContainer: document.getElementById('hero-info-container'), heroWatchTrailerBtn: document.getElementById('hero-watch-trailer-btn'), heroMoreInfoBtn: document.getElementById('hero-more-info-btn'),
        trailerFeatureSection: document.getElementById('trailer-feature'), trailerFeatureTitle: document.getElementById('trailer-feature-title'), trailerFeatureDesc: document.getElementById('trailer-feature-desc'), trailerFeatureThumbnail: document.getElementById('trailer-feature-thumbnail'), trailerFeaturePlayBtn: document.getElementById('trailer-feature-play-btn'), trailerFeatureMoreInfoBtn: document.getElementById('trailer-feature-more-info'),
        gallerySection: document.getElementById('gallery-section'), galleryStage: document.getElementById('galleryStage'), galleryCards: document.querySelectorAll('#gallery-section .gallery-card'), galleryDotsContainer: document.getElementById('galleryDots'), galleryDots: document.querySelectorAll('#gallery-section .dot'), galleryPrevBtn: document.getElementById('prevBtn'), galleryNextBtn: document.getElementById('nextBtn'), galleryFullscreenModal: document.getElementById('fullscreenModal'), galleryModalImageFs: document.getElementById('modalImageFs'), galleryModalCaptionFs: document.getElementById('modalCaptionFs'), galleryModalCloseFs: document.getElementById('modalClose'),
        kpiTotalTitles: document.getElementById('kpi-total-titles'), kpiActiveUsers: document.getElementById('kpi-active-users'), kpiAvgRating: document.getElementById('kpi-avg-rating'), kpiCommunityPosts: document.getElementById('kpi-community-posts'), topActorsList: document.getElementById('top-actors-list'),
        gaugeFillElement: document.getElementById('gauge-fill-element'), gaugeValueElement: document.getElementById('gauge-value-element'), networkBarChart: document.getElementById('network-bar-chart'),
        videoFeatureDemoPlayer: document.querySelector('.contained-video-player'), videoFeatureDemoVideo: document.getElementById('intro-video'), videoFeatureDemoPlayButton: document.querySelector('.video-play-button'),
        copyYear: document.getElementById('copy-year'),
        //Detail Modal Elements
        detailModal: document.getElementById('detailModal'),
        detailModalBody: document.getElementById('detail-modal-body'),
        detailLoadingSpinner: document.getElementById('detail-loading-spinner'),
        detailContentArea: document.getElementById('detail-content-area'),
        detailPoster: document.getElementById('detail-poster'),
        detailTitlePlaceholder: document.getElementById('detail-title-placeholder'), // Header title
        detailTitle: document.getElementById('detail-title'),           // Body title
        detailTagline: document.getElementById('detail-tagline'),
        detailRating: document.getElementById('detail-rating'),
        detailReleaseDate: document.getElementById('detail-release-date'),
        detailRuntimeSeasons: document.getElementById('detail-runtime-seasons'),
        detailGenres: document.getElementById('detail-genres'),
        detailOverview: document.getElementById('detail-overview'),
        detailTrailerButton: document.getElementById('detail-trailer-button'),
        detailCastContainer: document.getElementById('detail-cast-container'),
        detailRecommendationsContainer: document.getElementById('detail-recommendations-container'),
        detailProvidersContainer: document.getElementById('detail-providers-container'), 
        // Modals
        launchAppModal: document.getElementById('launchAppModal'), trailerModal: document.getElementById('trailer-modal'), trailerIframe: document.getElementById('trailer-iframe'),
        // Auth Related Elements
        loginForm: document.getElementById('login-form'), signupForm: document.getElementById('signup-form'),
        loginEmailInput: document.getElementById('login-email'), loginPasswordInput: document.getElementById('login-password'),
        signupEmailInput: document.getElementById('signup-email'), signupPasswordInput: document.getElementById('signup-password'),
        // signupConfirmPasswordInput: document.getElementById('signup-confirm-password'), // If using confirm
        googleLoginButton: document.getElementById('google-login-button'), googleSignupButton: document.getElementById('google-signup-button'),
        authErrorMessage: document.getElementById('auth-error-message'),
        loginSignupButton: document.getElementById('login-signup-button'), // Navbar login button
        userInfoArea: document.getElementById('user-info-area'),         // Navbar user area
        userIdentifier: document.getElementById('user-identifier'),     // Navbar user email span
        logoutButton: document.getElementById('logout-button'),
        signupNameInput: document.getElementById('signup-name'),
        signupAgeInput: document.getElementById('signup-age'),
        signupAvatarInput: document.getElementById('signup-avatar'),

        // Header User Display:
        userInfoArea: document.getElementById('user-info-area'),       // Existing, ensure it's cached
        userAvatar: document.getElementById('user-avatar'),                // Container DIV
        userAvatarInitials: document.getElementById('user-avatar-initials'), // SPAN for initials
        userAvatarImage: document.getElementById('user-avatar-image'),    // IMG tag
        userDisplayName: document.getElementById('user-display-name'),           // Navbar logout button
    };
    // Essential elements check
    const essentialKeys = ['introOverlay', 'introVideo', 'skipIntroButton', 'navbar', 'heroSection', 'launchAppModal', 'loginForm', 'signupForm', 'loginSignupButton', 'userInfoArea', 'logoutButton'];
    const missingElements = essentialKeys.filter(key => !els[key]);
    if (missingElements.length > 0) { this.utils.error(`Critical DOM elements missing: ${missingElements.join(', ')}.`); this.elements = {}; return false; }
    // Optional element warnings...
    this.elements = els; this.utils.log("DOM Elements Cached."); return true;
  },

   // --- Initialize Synchronous Modules ---
   initSyncModules: function() {
     const modulesToInit = [
        this.modules.introVideo,
        this.modules.auth, // <<<<<<<<<<<<<<< ADD AUTH MODULE INIT
        this.modules.navbar,
        this.modules.smoothScroll,
        this.modules.featureVideoPlayer,
        this.modules.conceptualLinks,
        this.modules.modals, // Initializes launchAppModal instance
        this.modules.faq,
        this.modules.gallery3D,
        this.modules.analyticsDashboard
     ];
     modulesToInit.forEach(module => { if (module?.init) { try { this.utils.log(`Init sync: ${module.name || 'Module'}`); module.init(); } catch (e) { this.utils.error(`Error init sync ${module.name || 'Module'}:`, e); } } });
     this.utils.setCopyrightYear();
 },

   // --- Initialize Visual Libraries ---
   initVisualLibraries: function() {
       if (this.state.librariesLoaded.three && this.elements.threeCanvas) { try { this.utils.log("Init Three.js..."); this.modules.threeBackground.init(); } catch (e) { this.utils.error("Three.js Init failed:", e); if(this.elements.threeCanvas) this.elements.threeCanvas.style.display = 'none'; } } else { this.utils.warn("Three.js disabled."); if(this.elements.threeCanvas) this.elements.threeCanvas.style.display = 'none'; }
       if (this.state.librariesLoaded.aos) { try { this.utils.log("Init AOS..."); AOS.init(this.config.AOS_CONFIG); } catch (e) { this.utils.error("AOS Init failed:", e); } } else { this.utils.warn("AOS disabled."); }
   },

  // --- Run Asynchronous Initializations ---
  runAsyncInits: async function() {
      this.utils.log("Starting Async Initializations...");
      try {
          const promises = [ this.modules.hero.loadBackgroundAndContent(true), this.modules.shelves.loadAllShelves(), this.modules.analyticsDashboard.loadAnalyticsData() ];
          const results = await Promise.allSettled(promises);
          this.utils.log("Async Inits settled."); results.forEach((r, i) => { if (r.status === 'rejected') this.utils.error(`Async init failed (Promise ${i}):`, r.reason); });
          this.modules.hero.startBackgroundUpdates();
      } catch (e) { this.utils.error("Error in runAsyncInits:", e); }
 },

  // --- Modules ---
  modules: {

      introVideo: { // Handles the intro video display and hiding
          init: function() {
              const els = AuraStreamApp.elements; const utils = AuraStreamApp.utils; utils.log("Init Intro Video...");
              if (!els.introOverlay || !els.introVideo || !els.skipIntroButton) { utils.error("Intro elements missing. Skipping."); this.hideOverlay(true); return; }
              els.introVideo.addEventListener('ended', () => this.hideOverlay());
              els.skipIntroButton.addEventListener('click', () => this.hideOverlay());
              const timeout = AuraStreamApp.config.INTRO_VIDEO_TIMEOUT_MS; if (timeout > 0) { setTimeout(() => { if (!AuraStreamApp.state.introHidden) { utils.warn(`Intro timeout.`); this.hideOverlay(); }}, timeout); }
              els.introVideo.play().catch(e => { utils.warn("Intro autoplay failed:", e.message); this.hideOverlay(true); });
          },
          hideOverlay: function(force = false) {
              if (AuraStreamApp.state.introHidden && !force) return; AuraStreamApp.state.introHidden = true;
              const els = AuraStreamApp.elements; const utils = AuraStreamApp.utils; utils.log("Hiding intro overlay...");
              if (els.introOverlay) els.introOverlay.classList.add('hidden'); if (els.introVideo) els.introVideo.pause();
              if (!AuraStreamApp.state.apiKeyValid) { utils.warn("API Key was invalid. Displaying errors post-intro."); AuraStreamApp.displayDataLoadingErrors(); }
              if (AuraStreamApp.state.librariesLoaded.aos) { setTimeout(() => { utils.log("Refreshing AOS post-intro."); try{ AOS.refresh(); } catch(e){ utils.error("AOS refresh failed", e); } }, AuraStreamApp.config.LOADING_SCREEN_FADE_DURATION + 100); }
          }
      },

      loadingScreen: { init: function() {}, hide: function() {}, showError: function() {} }, // No longer used visually

      threeBackground: { // Enhanced 3D Background
          scene: null, camera: null, renderer: null, particles: null, dust: null, animatedObjects: [], lights: {}, clock: null, mouse: new THREE.Vector2(), targetRotation: { x: 0, y: 0 }, targetCameraZ: 120, isInitialized: false, // Start Z closer
          init: function() {
              const els = AuraStreamApp.elements; const utils = AuraStreamApp.utils; if (this.isInitialized || !els.threeCanvas) return;
              utils.log("threeBackground: Initializing...");
              try {
                  this.clock = new THREE.Clock(); this.scene = new THREE.Scene(); this.scene.fog = new THREE.FogExp2(0x050609, 0.0016);
                  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2500); this.camera.position.z = this.targetCameraZ;
                  this.renderer = new THREE.WebGLRenderer({ canvas: els.threeCanvas, antialias: true, alpha: true });
                  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); this.renderer.setSize(window.innerWidth, window.innerHeight); this.renderer.setClearColor(0x000000, 0);
                  this.createEnhancedParticles(); this.createAnimatedObjects(); this.createLighting(); this.createEnvironment();
                  this.addEventListeners(); this.onWindowResize(); this.isInitialized = true; this.startAnimation(); utils.log("threeBackground: Initialized.");
              } catch (e) { utils.error("threeBackground: Init failed.", e); this.stopAnimation(); if (els.threeCanvas) els.threeCanvas.style.display = 'none'; }
          },
          createLighting: function() {
               this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.55); this.scene.add(this.lights.ambient); // Slightly brighter ambient
               this.lights.point1 = new THREE.PointLight(0xa855f7, 1.9, 1200, 1.7); this.lights.point1.position.set(-300, 200, 150); this.scene.add(this.lights.point1);
               this.lights.point2 = new THREE.PointLight(0x22d3ee, 1.6, 1000, 1.8); this.lights.point2.position.set(300, -150, 80); this.scene.add(this.lights.point2);
               this.lights.point3 = new THREE.PointLight(0xf472b6, 0.9, 800, 2); this.lights.point3.position.set(0, 0, 250); this.scene.add(this.lights.point3);
               this.lights.moving = new THREE.PointLight(0x4ade80, 1.5, 600, 2); this.lights.moving.position.set(100, 50, 100); this.scene.add(this.lights.moving);
          },
          createAnimatedObjects: function() {
              this.animatedObjects = []; // Clear previous
              const torusKnotGeometry = new THREE.TorusKnotGeometry(18, 6, 120, 14, 2, 3);
              const torusKnotMaterial = new THREE.MeshStandardMaterial({ color: 0x101218, metalness: 0.8, roughness: 0.25, wireframe: true, wireframeLinewidth: 0.6, transparent: true, opacity: AuraStreamApp.config.THREE_ANIMATED_OBJ_OPACITY });
              const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial); torusKnot.position.set(0, 0, -100); this.scene.add(torusKnot); this.animatedObjects.push({ mesh: torusKnot, rotationSpeed: {x: 0.06, y: 0.09, z: 0.03}, position: {x: 0, y: 0, z: -100}});
              const icoGeometry = new THREE.IcosahedronGeometry(12, 1);
              const icoMaterial = new THREE.MeshPhysicalMaterial({ color: 0x22d3ee, metalness: 0.6, roughness: 0.5, transmission: 0.5, thickness: 0.5, transparent: true, opacity: 0.65 }); // Slightly more opaque
              const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial); icosahedron.position.set(-80, 40, -50); this.scene.add(icosahedron); this.animatedObjects.push({ mesh: icosahedron, rotationSpeed: {x: 0.03, y: 0.05, z: 0.02}, position: {x: -80, y: 40, z: -50}, floatParams: { amplitude: 6, frequency: 0.15 }});
              const octGroup = new THREE.Group(); const octMaterials = [ new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.6, roughness: 0.4, transparent: true, opacity: 0.75 }), new THREE.MeshStandardMaterial({ color: 0x4ade80, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.55 }) ];
              for (let i = 0; i < 5; i++) { const size = 3 + Math.random() * 4; const octGeometry = new THREE.OctahedronGeometry(size, 0); const octMaterial = octMaterials[i % 2]; const octahedron = new THREE.Mesh(octGeometry, octMaterial); const radius = 12 + Math.random() * 6; const theta = Math.random() * Math.PI * 2; const phi = Math.random() * Math.PI; octahedron.position.x = radius * Math.sin(phi) * Math.cos(theta); octahedron.position.y = radius * Math.sin(phi) * Math.sin(theta); octahedron.position.z = radius * Math.cos(phi); octGroup.add(octahedron); }
              octGroup.position.set(70, -30, 0); this.scene.add(octGroup); this.animatedObjects.push({ mesh: octGroup, rotationSpeed: {x: 0.01, y: 0.02, z: 0.01}, position: {x: 70, y: -30, z: 0}, floatParams: { amplitude: 9, frequency: 0.1 }});
              const ringGroup = new THREE.Group(); for (let i = 0; i < 3; i++) { const radius = 9 + i * 5; const tubeRadius = 0.6 - i * 0.12; const ringGeometry = new THREE.TorusGeometry(radius, tubeRadius, 16, 100); const ringMaterial = new THREE.MeshStandardMaterial({ color: i === 0 ? 0xff6b6b : i === 1 ? 0x22d3ee : 0xa855f7, metalness: 0.75, roughness: 0.25, transparent: true, opacity: 0.55 - i * 0.1 }); const ring = new THREE.Mesh(ringGeometry, ringMaterial); ring.rotation.x = Math.PI / 2; ring.rotation.y = i * (Math.PI / 4); ringGroup.add(ring); }
              ringGroup.position.set(-30, -50, 20); this.scene.add(ringGroup); this.animatedObjects.push({ mesh: ringGroup, rotationSpeed: {x: 0.005, y: 0.01, z: 0.008}, position: {x: -30, y: -50, z: 20}, customAnimation: function(time) { this.mesh.children.forEach((ring, i) => { ring.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.2; ring.rotation.z = i * (Math.PI / 4) + time * (0.1 + i * 0.05); }); }});
          },
          createEnhancedParticles: function() {
              const config = AuraStreamApp.config; const particlesGeometry = new THREE.BufferGeometry(); const count = config.THREE_PARTICLE_COUNT;
              const positions = new Float32Array(count * 3); const colors = new Float32Array(count * 3); const sizes = new Float32Array(count);
              const colorInside = new THREE.Color(0xa855f7); const colorOutside = new THREE.Color(0x22d3ee); const colorAccent = new THREE.Color(0xff6b6b); const radius = config.THREE_GALAXY_RADIUS; const branches = 6;
              for (let i = 0; i < count; i++) {
                  const i3 = i * 3; const r = Math.pow(Math.random(), 2) * radius; const spinAngle = r * 4.0; const branchAngle = (i % branches) / branches * Math.PI * 2;
                  const scatterCoef = 0.3 * (1 - r / radius * 0.5); const randomX = Math.pow(Math.random(), 3.5) * (Math.random() < 0.5 ? 1 : -1) * scatterCoef * r; const randomY = Math.pow(Math.random(), 3.5) * (Math.random() < 0.5 ? 1 : -1) * scatterCoef * r; const randomZ = Math.pow(Math.random(), 3.5) * (Math.random() < 0.5 ? 1 : -1) * scatterCoef * r;
                  positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX; positions[i3 + 1] = randomY * 0.6; positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
                  let mixedColor = (i % 20 === 0) ? colorAccent.clone() : colorInside.clone().lerp(colorOutside, Math.pow(r / radius, 0.8));
                  colors[i3] = mixedColor.r; colors[i3 + 1] = mixedColor.g; colors[i3 + 2] = mixedColor.b;
                  sizes[i] = (Math.random() * 1.2 + 0.3) * config.THREE_PARTICLE_SIZE;
              }
              particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
              const vertexShader = `attribute float size; varying vec3 vColor; void main() { vColor = color; vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 ); gl_PointSize = size * ( 300.0 / -mvPosition.z ); gl_Position = projectionMatrix * mvPosition; }`;
              const fragmentShader = `varying vec3 vColor; void main() { float strength = distance(gl_PointCoord, vec2(0.5)); if (strength > 0.5) discard; float alpha = 1.0 - strength * 2.0; gl_FragColor = vec4( vColor, ${config.THREE_PARTICLE_OPACITY} * alpha ); }`;
              this.starsMaterial = new THREE.ShaderMaterial({ vertexShader, fragmentShader, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, vertexColors: true });
              this.particles = new THREE.Points(particlesGeometry, this.starsMaterial); this.scene.add(this.particles);
              this.createBackgroundStars();
          },
          createBackgroundStars: function() {
              const backgroundStarsGeometry = new THREE.BufferGeometry(); const count = 1500; const positions = new Float32Array(count * 3); const colors = new Float32Array(count * 3);
              const radius = 1000; for (let i = 0; i < count; i++) { const i3 = i * 3; const theta = Math.random() * Math.PI * 2; const phi = Math.acos((Math.random() * 2) - 1); const r = 400 + Math.random() * radius; positions[i3] = r * Math.sin(phi) * Math.cos(theta); positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta); positions[i3 + 2] = r * Math.cos(phi); const brightness = 0.4 + Math.random() * 0.4; colors[i3] = brightness; colors[i3 + 1] = brightness; colors[i3 + 2] = brightness; }
              backgroundStarsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); backgroundStarsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
              const bgStarsMaterial = new THREE.PointsMaterial({ size: 0.6, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true, opacity: 0.4 });
              const backgroundStars = new THREE.Points(backgroundStarsGeometry, bgStarsMaterial); backgroundStars.renderOrder = -1; this.scene.add(backgroundStars); this.animatedObjects.push({ mesh: backgroundStars, rotationSpeed: {x: 0.0001, y: 0.0002, z: 0.0001}});
          },
          createEnvironment: function() {
              const dustGeometry = new THREE.BufferGeometry(); const dustCount = 150; const dustPositions = new Float32Array(dustCount * 3);
              for (let i = 0; i < dustCount; i++) { const i3 = i * 3; dustPositions[i3] = (Math.random() - 0.5) * 400; dustPositions[i3 + 1] = (Math.random() - 0.5) * 400; dustPositions[i3 + 2] = (Math.random() - 0.5) * 400; }
              dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
              const dustTexture = this.createDustTexture();
              const dustMaterial = new THREE.PointsMaterial({ map: dustTexture, size: 9, sizeAttenuation: true, color: 0xaaaaaa, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }); // Slightly larger dust
              this.dust = new THREE.Points(dustGeometry, dustMaterial); this.scene.add(this.dust);
          },
          createDustTexture: function() { const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64; const context = canvas.getContext('2d'); const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32); gradient.addColorStop(0, 'rgba(255,255,255,0.5)'); gradient.addColorStop(0.2, 'rgba(255,255,255,0.3)'); gradient.addColorStop(0.6, 'rgba(255,255,255,0.1)'); gradient.addColorStop(1, 'rgba(255,255,255,0)'); context.fillStyle = gradient; context.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(canvas); },
          addEventListeners: function() { document.addEventListener('mousemove', (e) => this.onDocumentMouseMove(e), false); window.addEventListener('resize', AuraStreamApp.utils.debounce(() => this.onWindowResize(), 100), false); window.addEventListener('scroll', AuraStreamApp.utils.debounce(() => this.onWindowScroll(), 50), { passive: true }); },
          onDocumentMouseMove: function(event) { this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1; this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; },
          onWindowScroll: function() { const scrollY = window.scrollY; const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight); const scrollFactor = Math.min(scrollY / 1000, 1); this.targetCameraZ = 120 + scrollFactor * 80; },
          onWindowResize: function() { if (!this.renderer || !this.camera) return; this.camera.aspect = window.innerWidth / window.innerHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(window.innerWidth, window.innerHeight); this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); },
          animate: function() {
              if (!this.isInitialized) return; AuraStreamApp.state.threeAnimationId = requestAnimationFrame(() => this.animate()); const elapsedTime = this.clock.getElapsedTime();
              this.targetRotation.y = this.mouse.x * 0.1; this.targetRotation.x = this.mouse.y * 0.1;
              if (this.particles) { this.particles.rotation.y += (this.targetRotation.y - this.particles.rotation.y) * 0.02 + 0.0006; this.particles.rotation.x += (this.targetRotation.x - this.particles.rotation.x) * 0.02; }
              this.animatedObjects.forEach(obj => { if (obj.rotationSpeed) { obj.mesh.rotation.x += obj.rotationSpeed.x * 0.1; obj.mesh.rotation.y += obj.rotationSpeed.y * 0.1; obj.mesh.rotation.z += obj.rotationSpeed.z * 0.1; } if (obj.floatParams) { const floatY = Math.sin(elapsedTime * obj.floatParams.frequency) * obj.floatParams.amplitude; obj.mesh.position.y = obj.position.y + floatY; } if (obj.customAnimation) obj.customAnimation.call(obj, elapsedTime); });
              if (this.lights.moving) { this.lights.moving.position.x = Math.sin(elapsedTime * 0.35) * 180; this.lights.moving.position.z = Math.cos(elapsedTime * 0.25) * 180; this.lights.moving.position.y = Math.sin(elapsedTime * 0.55) * 100; }
              if (this.dust) { this.dust.rotation.x = elapsedTime * 0.008; this.dust.rotation.y = elapsedTime * 0.012; const dustScale = 1 + Math.sin(elapsedTime * 0.25) * 0.08; this.dust.scale.set(dustScale, dustScale, dustScale); }
              this.camera.position.x += (this.mouse.x * 15 - this.camera.position.x) * 0.015; this.camera.position.y += (-this.mouse.y * 15 - this.camera.position.y) * 0.015;
              this.camera.position.z += (this.targetCameraZ - this.camera.position.z) * 0.025;
              this.camera.lookAt(0, 0, 0); this.renderer.render(this.scene, this.camera);
          },
          startAnimation: function() { if (this.isInitialized && !AuraStreamApp.state.threeAnimationId) this.animate(); },
          stopAnimation: function() { if (AuraStreamApp.state.threeAnimationId) cancelAnimationFrame(AuraStreamApp.state.threeAnimationId); AuraStreamApp.state.threeAnimationId = null; }
      },

      navbar: { // Using robust version
          init: function() { const els = AuraStreamApp.elements; const utils = AuraStreamApp.utils; if (!els.navbar || !els.mobileMenuToggle || !els.mobileMenuClose || !els.mobileMenu || !els.offcanvasOverlay) { utils.warn("Navbar elements missing."); return; } utils.log("Navbar Initializing..."); window.addEventListener('scroll', utils.debounce(() => this.handleScroll(), 50), { passive: true }); this.handleScroll(); els.mobileMenuToggle.addEventListener('click', () => this.openMobileMenu()); els.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu()); els.offcanvasOverlay.addEventListener('click', () => this.closeMobileMenu()); els.mobileMenu.querySelectorAll('.nav-link').forEach(link => { link.addEventListener('click', () => this.closeMobileMenu()); }); this.setupActiveLinkHandling(); this.setupSearchListeners(); utils.log("Navbar Initialized."); },
          handleScroll: function() { const navbar = AuraStreamApp.elements.navbar; if (!navbar) return; window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled'); },
          openMobileMenu: function() { const els = AuraStreamApp.elements; if (!els.mobileMenu || !els.offcanvasOverlay) return; els.mobileMenu.classList.add('active'); els.offcanvasOverlay.classList.add('active'); document.body.classList.add('offcanvas-open'); AuraStreamApp.state.isMobileMenuOpen = true; },
          closeMobileMenu: function() { const els = AuraStreamApp.elements; if (!els.mobileMenu || !els.offcanvasOverlay) return; els.mobileMenu.classList.remove('active'); els.offcanvasOverlay.classList.remove('active'); document.body.classList.remove('offcanvas-open'); AuraStreamApp.state.isMobileMenuOpen = false; },
          setupActiveLinkHandling: function() { AuraStreamApp.utils.log("Navbar Active Link Handling setup (placeholder)."); /* Implement Intersection Observer or scrollspy logic */ },
          setupSearchListeners: function() { AuraStreamApp.utils.log("Navbar Search setup (placeholder)."); /* Add listeners and search logic */ }
      },

      smoothScroll: { init: function() { AuraStreamApp.utils.log("SmoothScroll Initialized."); /* Listener for links */ } },

      hero: { // Using robust version + handleInitialLoadFailure
          updateIntervalId: null,
          init: function() { AuraStreamApp.utils.log("Hero module init."); this.setupButtonListeners(); },
          loadBackgroundAndContent: async function(isInitial = true) { const utils = AuraStreamApp.utils; if (document.hidden && !isInitial) return; utils.log(`Hero: ${isInitial ? 'Initial Load' : 'Update'}...`); const els = AuraStreamApp.elements; try { const data = await utils.fetchTMDB('/movie/popular', { page: 1 }); if (!data?.results?.length) { utils.warn("Hero: Popular fetch failed/empty."); if (isInitial) this.handleInitialLoadFailure(); return; } const potential = data.results.filter(m => m.backdrop_path && m.overview && m.vote_average >= 6.0); if (potential.length > 0) { const movie = potential[Math.floor(Math.random() * potential.length)]; AuraStreamApp.state.heroMovie = movie; this.updateHeroBackground(movie.backdrop_path, isInitial); const [details, videos] = await Promise.all([ utils.fetchTMDB(`/movie/${movie.id}`), utils.fetchMovieVideos(movie.id) ]); if (details) this.updateHeroContent(details, videos || []); else { utils.warn(`Hero: Details fetch failed for ${movie.id}.`); this.updateHeroContent(movie, videos || []); if(isInitial) this.handleInitialLoadFailure();} if (AuraStreamApp.state.featuredTrailerMovieId !== movie.id && els.trailerFeatureSection) AuraStreamApp.modules.trailerFeature.loadContent(movie); } else { utils.warn("Hero: No suitable movies found."); if (isInitial) this.handleInitialLoadFailure(); } } catch (e) { utils.error("Error loading hero:", e); if (isInitial) this.handleInitialLoadFailure(); } utils.log(`Hero: ${isInitial ? 'Initial Load' : 'Update'} finished.`); },
          updateHeroBackground: function(path, isInitial) { const els = AuraStreamApp.elements; const utils = AuraStreamApp.utils; if (!els.heroBgImage || !els.heroSection) return; if (!path) { utils.warn("Hero: No backdrop."); if(isInitial) els.heroSection.classList.add('loaded'); els.heroBgImage.style.backgroundImage=''; els.heroBgImage.style.opacity=0; return; } const url = `${AuraStreamApp.config.IMAGE_BASE_URL}${AuraStreamApp.config.HERO_BACKDROP_SIZE}${path}`; const img = new Image(); img.onload=()=>{ if (!els.heroBgImage) return; if (els.heroBgImage.style.backgroundImage !== `url("${url}")`) { els.heroBgImage.style.opacity=0; setTimeout(() => { if (!els.heroBgImage) return; els.heroBgImage.style.backgroundImage=`url('${url}')`; els.heroBgImage.style.transition='opacity 1.8s ease-in-out'; els.heroBgImage.style.opacity=0.4; if(isInitial) els.heroSection.classList.add('loaded');}, 350); } else if (isInitial) { els.heroSection.classList.add('loaded'); els.heroBgImage.style.opacity=0.4;}}; img.onerror=()=>{ utils.warn('Hero img load fail:',url); if(isInitial) this.handleInitialLoadFailure();}; img.src=url;},
          updateHeroContent: function(movie, videos = []) {
    const els = AuraStreamApp.elements;
    const utils = AuraStreamApp.utils;
    const config = AuraStreamApp.config; // Access config if needed

    // --- Essential Element & Data Check ---
    if (!els.heroTitle || !els.heroOverview || !els.heroInfoContainer || !movie) {
        utils.warn("Cannot update hero content: Required elements or movie data missing.");
        // Optionally call handleInitialLoadFailure here as a fallback if elements exist but movie doesn't
        if(els.heroSection && !movie) this.handleInitialLoadFailure("Missing movie data for hero update.");
        return;
    }
    utils.log(`Updating hero content for: ${movie.title} (ID: ${movie.id})`);

    // --- Update Text Content ---
    els.heroTitle.textContent = utils.escapeHtml(movie.title || 'Featured Content');
    els.heroOverview.textContent = utils.escapeHtml(movie.overview || 'No description available.');

    // --- Update Movie Info (Genres, Rating, Date) ---
    // Safely access properties and provide defaults
    const genres = movie.genres?.map(g => utils.escapeHtml(g.name)).join(', ') || 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const releaseDate = movie.release_date ? utils.formatDate(movie.release_date) : 'N/A';

    els.heroInfoContainer.innerHTML = `
        <div class="hero-info-item">
            <i class="bi bi-calendar3"></i>
            <span>${releaseDate}</span>
        </div>
        <div class="hero-info-item">
            <i class="bi bi-star-fill"></i>
            <span>${rating}/10</span>
        </div>
        <div class="hero-info-item">
            <i class="bi bi-film"></i>
            <span>${genres}</span>
        </div>
    `;

    // --- Determine Best Trailer ---
    const bestTrailer = utils.getBestTrailer(videos);
    utils.log(`Hero update - Best Trailer found for ${movie?.id}:`, bestTrailer);

    // --- Update Watch Trailer Button State ---
    if (els.heroWatchTrailerBtn) {
        // Enable/disable based on whether a trailer was found
        els.heroWatchTrailerBtn.disabled = !bestTrailer;
        // Store the movie ID on the button for the click handler
        els.heroWatchTrailerBtn.dataset.movieId = movie?.id || ''; // Ensure ID is set, even if null initially
        utils.log(`Hero button disabled state set to: ${!bestTrailer}`);
    } else {
        utils.warn("Hero Watch Trailer button element not found during update.");
    }

    // --- Update More Info Button State ---
    if (els.heroMoreInfoBtn) {
        els.heroMoreInfoBtn.disabled = false; // Generally enable if movie data exists
        els.heroMoreInfoBtn.title = `More Info for ${utils.escapeHtml(movie.title || 'this content')} (Concept)`;
        els.heroMoreInfoBtn.dataset.movieId = movie?.id || ''; // Store ID
    } else {
         utils.warn("Hero More Info button element not found during update.");
    }

    utils.log(`Hero content updated successfully for ${movie.title}.`);
},
          handleInitialLoadFailure: function(errorMessage = "Could not load featured content.") { const els = AuraStreamApp.elements; const utils = AuraStreamApp.utils; utils.warn(`Hero Fallback: ${errorMessage}`); if (!els.heroSection) return; els.heroSection.classList.add('loaded'); if(els.heroTitle) els.heroTitle.textContent="AuraStream"; if(els.heroOverview) els.heroOverview.innerHTML=`<span class="text-danger"><i class="bi bi-exclamation-circle-fill me-2"></i>${utils.escapeHtml(errorMessage)}</span>`; if(els.heroInfoContainer) els.heroInfoContainer.innerHTML=''; if(els.heroWatchTrailerBtn) els.heroWatchTrailerBtn.disabled=true; if(els.heroMoreInfoBtn) els.heroMoreInfoBtn.disabled=true; if(els.heroBgImage) { els.heroBgImage.style.backgroundImage=`linear-gradient(to right, rgba(var(--bg-primary-rgb),0.95) 25%, rgba(var(--bg-primary-rgb),0.6) 60%, transparent 100%)`; els.heroBgImage.style.opacity=1;}},
          startBackgroundUpdates: function() { if (this.updateIntervalId) clearInterval(this.updateIntervalId); this.updateIntervalId = setInterval(() => this.loadBackgroundAndContent(false), AuraStreamApp.config.HERO_UPDATE_INTERVAL); AuraStreamApp.utils.log("Hero background updates started."); },
          setupButtonListeners: function() {
            const els = AuraStreamApp.elements;
            const utils = AuraStreamApp.utils;
            const app = AuraStreamApp; // Reference to the main app object

            // --- Hero Watch Trailer Button ---
            if (els.heroWatchTrailerBtn) {
                // Remove any potentially existing listener first to prevent duplicates
                // (More robust if this function could be called multiple times, though unlikely here)
                // els.heroWatchTrailerBtn.removeEventListener('click', this.handleHeroTrailerClick); // Need to define this handler separately or use an anonymous function carefully

                // We use a direct anonymous function here. Ensure 'this' context isn't needed or handle appropriately.
                els.heroWatchTrailerBtn.addEventListener('click', () => {
                    utils.log('HERO Play button clicked!');
                    const button = els.heroWatchTrailerBtn; // Explicitly reference the button

                    // --- IMPORTANT: Read movieId DIRECTLY from the button's dataset AT CLICK TIME ---
                    const movieId = button.dataset.movieId;
                    utils.log(`Hero button - Movie ID from dataset at click time: ${movieId}`);

                    // Check if we have a valid movie ID AND if the button is currently enabled
                    if (movieId && !button.disabled) {
                        utils.log(`Calling modals.openTrailer from HERO for ID: ${movieId}`);
                        // Call the function in the modals module to open the trailer
                        app.modules.modals.openTrailer(movieId); // Use app reference
                    } else {
                        utils.warn(`Hero button clicked, but conditions not met. MovieID: ${movieId}, Disabled: ${button.disabled}`);
                        if (!movieId && !button.disabled) {
                             alert("Hero movie information is still loading. Please wait a moment.");
                         } else if (button.disabled) {
                             alert("No trailer seems to be available for this movie.");
                         }
                    }
                });
                utils.log("Hero Watch Trailer button listener attached.");
            } else {
                utils.warn("Hero Watch Trailer button element not found in DOM. Listener not attached.");
            }

            // --- Hero More Info Button ---
            if (els.heroMoreInfoBtn) {
                 els.heroMoreInfoBtn.addEventListener('click', (e) => { // Pass event 'e'
                    const button = els.heroMoreInfoBtn; // Reference the button
                    const movieId = button.dataset.movieId; // Get ID at click time
                    utils.log(`Hero More Info button clicked. ID: ${movieId}, Disabled: ${button.disabled}`);

                    if (button.classList.contains('conceptual-link') && !button.disabled) {
                        app.modules.conceptualLinks.handleClick( // Use app reference
                            button,
                            `More Info for movie ID ${movieId}`,
                            e // Pass the event
                        );
                    } else {
                        utils.warn(`Hero More Info button clicked, but not conceptual or disabled.`);
                    }
                });
                utils.log("Hero More Info button listener attached.");
            } else {
                utils.warn("Hero More Info button element not found in DOM. Listener not attached.");
            }
        }  
        },

      shelves: { // Using robust version
          init: function() { AuraStreamApp.utils.log("Shelves init."); this.initResizeListener(); },
          renderCards: function(items, containerEl, type = 'movie') { 
            const utils = AuraStreamApp.utils; 
            if(!containerEl) { 
                utils.warn("renderCards: Container missing.");
                 return; 
            } 
            containerEl.innerHTML = '';
             const config = AuraStreamApp.config;
                if (!items?.length) { 
                    containerEl.innerHTML = utils.getErrorTextHTML(`No ${type === 'tv' ? 'shows' : 'movies'} found.`);
                    return; 
                } 
                const frag = document.createDocumentFragment();
                items.forEach((item, idx) => {
                    const itemType = item.media_type || type; 
                    if (itemType === 'person' || !item.id || (!item.poster_path && !item.profile_path))
                        return; const title = utils.escapeHtml(item.title || item.name || 'Untitled');
                        const posterPath = item.poster_path || item.profile_path;
                        const poster = posterPath ? `${config.IMAGE_BASE_URL}${config.POSTER_SIZE}${posterPath}`
                           : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                           const rating = item.vote_average?.toFixed(1); 
                           const year = utils.getYear(item.release_date || item.first_air_date); 
                           const link = document.createElement('a'); 
                           link.href = '#'; // Use # for non-navigation trigger
                           link.className = 'movie-card detail-modal-trigger';
                           link.title = `${title} (${year || itemType}) - Click for details`; // Update title
                           
                           link.dataset.aos = "fade-up"; 
                           link.dataset.aosDelay = `${Math.min(idx * 50, 300)}`; 
                           link.draggable = false; 
                           link.dataset.itemId = item.id; 
                           link.dataset.itemType = itemType; 
                           link.innerHTML = `
                                <div class="card-image-wrapper">
                                    <img src="${poster}" alt="${title} Poster" loading="lazy" draggable="false" onerror="this.onerror=null;
                                        this.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                                        this.parentElement.innerHTML = '
                                        <div class=\\'skeleton-placeholder d-flex align-items-center justify-content-center text-center p-2 flex-column h-100\\'><i class=\\'bi bi-image-alt fs-1 opacity-50\\'></i><small class=\\'mt-1 opacity-75\\'>No Poster</small></div>';"><div class="card-image-overlay"></div><div class="card-top-info">
                                            ${rating > 0.1 ? `<span class="card-badge rating"><i class="bi bi-star-fill"></i> ${rating}</span>` : ''}${year ? `<span class="card-badge year">${year}</span>` : ''}</div></div><div class="card-content"><h4 class="card-title">${title}</h4><div class="card-meta"><span><i class="bi ${itemType === 'tv' ? 'bi-tv' : 'bi-film'}"></i> ${itemType === 'tv' ? 'TV' : 'Movie'}</span></div></div>`; 
                                            /*link.addEventListener('click', (e) => { 
                                                if (link.classList.contains('conceptual-link')) {
                                                     e.preventDefault(); 
                                                     AuraStreamApp.modules.conceptualLinks.handleClick(link, `View details for ${title}`);
                                                } 
                                            });*/
                                            link.addEventListener('click', (e) => {
                                                e.preventDefault(); // Prevent '#' navigation
                                                const card = e.currentTarget; // Get the link element
                                                const itemId = card.dataset.itemId;
                                                const itemType = card.dataset.itemType;
                                                if (itemId && itemType) {
                                                    AuraStreamApp.utils.log(`Detail trigger clicked: ID=${itemId}, Type=${itemType}`);
                                                    AuraStreamApp.modules.modals.openDetailModal(itemId, itemType);
                                                } else {
                                                    AuraStreamApp.utils.error("Missing itemId or itemType on detail trigger.", card.dataset);
                                                }
                                            });
                                            if (itemType === 'movie') 
                                            link.addEventListener('mouseenter', () => 
                                                utils.fetchMovieVideos(item.id).catch(e =>
                                                    utils.warn("Prefetch videos failed:", e)), 
                                                    { once: true });
                                         
                                            frag.appendChild(link); });
                                            containerEl.appendChild(frag); 
                                            if (AuraStreamApp.state.librariesLoaded.aos) AOS.refresh(); 
          },
          setupHorizontalScroll: function(wrapperEl, cId) { if (!wrapperEl) return; const container = wrapperEl.querySelector('.horizontal-scroll-container'); const prevBtn = wrapperEl.querySelector('.h-scroll-btn.prev'); const nextBtn = wrapperEl.querySelector('.h-scroll-btn.next'); if (!container || !prevBtn || !nextBtn) { AuraStreamApp.utils.warn(`Scroll elements missing: ${cId}`); return; } const utils = AuraStreamApp.utils; const updateBtns = () => { requestAnimationFrame(() => { const { scrollLeft, scrollWidth, clientWidth } = container; const tolerance = 15; const isStart = scrollLeft <= tolerance; const isEnd = scrollLeft >= Math.ceil(scrollWidth - clientWidth) - tolerance; prevBtn.classList.toggle('disabled', isStart); prevBtn.setAttribute('aria-disabled', String(isStart)); nextBtn.classList.toggle('disabled', isEnd); nextBtn.setAttribute('aria-disabled', String(isEnd)); }); }; const scrollH = (dir) => { container.scrollBy({ left: dir * container.clientWidth * 0.75, behavior: 'smooth' }); setTimeout(updateBtns, 150); setTimeout(updateBtns, 450); }; const debouncedUpd = utils.debounce(updateBtns, AuraStreamApp.config.SCROLL_DEBOUNCE); container.addEventListener('scroll', debouncedUpd, { passive: true }); prevBtn.addEventListener('click', () => scrollH(-1)); nextBtn.addEventListener('click', () => scrollH(1)); setTimeout(updateBtns, 300); AuraStreamApp.state.shelfScrollData.set(cId, updateBtns); },
          loadShelf: async function(shelfConfig) { const utils = AuraStreamApp.utils; utils.log(`Loading shelf: ${shelfConfig.title}`); const container = document.querySelector(shelfConfig.containerSelector); const wrapper = container?.closest('.horizontal-scroll-wrapper'); if (!container || !wrapper) { utils.error(`Shelf elements missing: ${shelfConfig.containerSelector}`); return; } container.innerHTML = utils.getSkeletonShelfHTML(); try { const data = await utils.fetchTMDB(shelfConfig.endpoint, shelfConfig.params); if (data?.results) { utils.log(`Shelf ${shelfConfig.id}: Received ${data.results.length} items.`); this.renderCards(data.results, container, shelfConfig.type); if (shelfConfig.id === 'trending-movie' && data.results.length > 0 && !AuraStreamApp.state.featuredTrailerMovieId && AuraStreamApp.elements.trailerFeatureSection) AuraStreamApp.modules.trailerFeature.loadContent(data.results[0]); } else { container.innerHTML = utils.getErrorTextHTML(`Could not load ${shelfConfig.title}.`); utils.warn(`Shelf ${shelfConfig.id}: Failed load/no results.`); } } catch (error) { utils.error(`Error loadShelf ${shelfConfig.id}:`, error); container.innerHTML = utils.getErrorTextHTML(`Error loading ${shelfConfig.title}.`); } finally { this.setupHorizontalScroll(wrapper, shelfConfig.ariaControls); } },
          loadAllShelves: async function() { const utils = AuraStreamApp.utils; utils.log("Loading all shelves..."); const promises = AuraStreamApp.config.CONTENT_SHELVES.map(shelf => this.loadShelf(shelf)); await Promise.allSettled(promises); utils.log("All shelves loading attempts done."); },
          initResizeListener: function() { window.addEventListener('resize', AuraStreamApp.utils.debounce(() => { AuraStreamApp.state.shelfScrollData.forEach((updateFn, key) => { try { updateFn(); } catch(e){ AuraStreamApp.utils.warn(`Error updating scroll ${key}:`, e); }}); }, AuraStreamApp.config.RESIZE_DEBOUNCE)); }
      },

      trailerFeature: {
     currentMovie: null, // Holds the data for the currently featured movie

     init: function() {
    const utils = AuraStreamApp.utils;
    const els = AuraStreamApp.elements;
    const app = AuraStreamApp; // Get reference to the main app object

    utils.log("Initializing Trailer Feature module...");

    // --- Essential Element Checks ---
    // Critical: If the main section isn't found, the module can't function.
    if (!els.trailerFeatureSection) {
        utils.error("Trailer Feature section element (#trailer-feature) not found. Module disabled.");
        return; // Stop initialization
    }

    // Check for other important elements and issue warnings if missing, but don't stop init unless absolutely critical (like the play button maybe).
    if (!els.trailerFeaturePlayBtn) {
        utils.warn("Trailer feature play button (#trailer-feature-play-btn) element not found. Play functionality will be broken.");
        // Decide if you want to 'return;' here if the play button is absolutely essential.
    }
    if (!els.trailerFeatureMoreInfoBtn) {
        utils.warn("Trailer feature more info button (#trailer-feature-more-info) element not found.");
    }
    if (!els.trailerFeatureTitle) {
        utils.warn("Trailer feature title element (#trailer-feature-title) not found.");
    }
    if (!els.trailerFeatureDesc) {
        utils.warn("Trailer feature description element (#trailer-feature-desc) not found.");
    }
    if (!els.trailerFeatureThumbnail) {
        utils.warn("Trailer feature thumbnail element (#trailer-feature-thumbnail) not found.");
    }

    // --- Event Listeners ---

    // Play Button Click Listener
    if (els.trailerFeaturePlayBtn) {
        els.trailerFeaturePlayBtn.addEventListener('click', () => {
            utils.log('FEATURE Trailer Play Button CLICKED!');
            const button = els.trailerFeaturePlayBtn; // Reference the button for clarity

            // Get the movie ID directly from the `currentMovie` stored in this module's state.
            // This assumes `loadContent` correctly sets `this.currentMovie` before this listener is triggered by user interaction.
            const currentMovieId = this.currentMovie?.id; // Use optional chaining
            utils.log(`Feature trailer button - Attempting to use Movie ID: ${currentMovieId}`);

            // Check if we have a movie ID AND if the button is currently enabled
            if (currentMovieId && !button.disabled) {
                utils.log(`Calling modals.openTrailer with ID: ${currentMovieId}`);
                // Trigger the modal opening logic from the main app's modals module
                app.modules.modals.openTrailer(currentMovieId);
            } else {
                // Log or alert why the action didn't proceed
                utils.warn(`Feature Play button clicked, but conditions not met. Movie ID: ${currentMovieId}, Button Disabled: ${button.disabled}`);
                if (!currentMovieId && !button.disabled) {
                    alert("Featured trailer information is still loading or unavailable.");
                }
                // No need for an alert if button.disabled is true, as openTrailer handles the "no trailer found" case internally.
            }
        });
        utils.log("Feature Trailer Play button listener attached.");
    } else {
        // Log error if the button wasn't found during the earlier check.
        // The warning above already covers this, but an error log reinforces it if critical.
        utils.error("Feature Trailer Play Button element was not found, listener not attached.");
    }

    // More Info Button Click Listener (Conceptual Link)
    if (els.trailerFeatureMoreInfoBtn) {
        els.trailerFeatureMoreInfoBtn.addEventListener('click', (e) => { // Pass the event 'e'
            const button = els.trailerFeatureMoreInfoBtn; // Reference the button
            const currentMovie = this.currentMovie; // Get the current movie object

            utils.log(`Feature More Info button clicked. Current Movie ID: ${currentMovie?.id}, Button Disabled: ${button.disabled}`);

            // Check if it's a conceptual link, we have movie data, AND the button isn't disabled
            if (currentMovie?.id && button.classList.contains('conceptual-link') && !button.disabled) {
                utils.log(`Handling conceptual link for: ${currentMovie.title}`);
                // Use the conceptual links handler from the main app's module
                app.modules.conceptualLinks.handleClick(
                    button, // The button element
                    `View details for ${utils.escapeHtml(currentMovie.title)}`, // Message for the alert
                    e // Pass the event to allow preventDefault if needed
                );
            } else {
                utils.warn("More Info button clicked, but no movie data, not conceptual, or disabled.");
                // You might want different feedback depending on the reason (no data vs disabled vs not conceptual)
            }
        });
        utils.log("Feature Trailer More Info button listener attached.");
    } else {
        utils.warn("Feature Trailer More Info Button element was not found, listener not attached.");
    }

    // --- Set Initial Visual State ---
    // Call updateDisplay with null to show the default "Loading..." state.
    this.updateDisplay(null);

    utils.log("Trailer Feature module initialized successfully.");
   }, // End init

    // --- loadContent, updateDisplay, displayError methods remain the same as v9.2 ---
    loadContent: async function(movie) {
        const utils = AuraStreamApp.utils;
        if(!movie?.id) { utils.warn("TrailerFeature: Invalid movie data."); return; }
        // Prevent redundant loading if same movie is already featured
        if (movie.id === this.currentMovie?.id) {
            // utils.log(`TrailerFeature: Movie ${movie.id} already loaded.`);
            return;
        }
        utils.log(`TrailerFeature: Loading content for ${movie.title} (ID: ${movie.id})`);
        this.currentMovie = movie;
        AuraStreamApp.state.featuredTrailerMovieId = movie.id; // Keep track if needed elsewhere
        utils.log("Fetching videos for trailer feature...");
        const videos = await utils.fetchMovieVideos(movie.id);
        utils.log(`Videos fetched for ${movie.id}:`, videos ? videos.length : 'None');
        const bestTrailer = utils.getBestTrailer(videos || []);
        utils.log(`Best Trailer found by getBestTrailer for ${movie.id}:`, bestTrailer);
        this.updateDisplay(bestTrailer); // Update UI with fetched info
    },

    updateDisplay: function(bestTrailer = null) {
        const els = AuraStreamApp.elements;
        const movie = this.currentMovie;
        const utils = AuraStreamApp.utils;

        // Check essential display elements
        if (!els.trailerFeatureTitle || !els.trailerFeatureDesc || !els.trailerFeatureThumbnail || !els.trailerFeaturePlayBtn || !els.trailerFeatureMoreInfoBtn) {
            utils.warn("Trailer feature display elements missing during update.");
            // Optionally hide the whole section if critical elements are gone
            if(els.trailerFeatureSection) els.trailerFeatureSection.style.display = 'none';
            return;
        }

        if (!movie) {
            // --- Loading State ---
            els.trailerFeatureTitle.innerHTML = `<span class="trailer-loading-placeholder">Loading Featured Content...</span>`;
            els.trailerFeatureDesc.innerHTML = `<span class="trailer-loading-placeholder">Please wait...</span>`;
            els.trailerFeatureThumbnail.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Placeholder
            els.trailerFeatureThumbnail.alt = 'Loading thumbnail';
            els.trailerFeaturePlayBtn.disabled = true;  // Button disabled while loading
            els.trailerFeatureMoreInfoBtn.disabled = true;
            els.trailerFeatureMoreInfoBtn.classList.remove('conceptual-link'); // Ensure conceptual link class is removed if needed
            return;
        }

        // --- Content Loaded State ---
        els.trailerFeatureTitle.textContent = utils.escapeHtml(movie.title || 'Featured Content');
        els.trailerFeatureDesc.textContent = movie.overview
            ? (movie.overview.length > 200 ? utils.escapeHtml(movie.overview.substring(0, 197)) + '...' : utils.escapeHtml(movie.overview))
            : 'No description available.';

        // More Info Button
        els.trailerFeatureMoreInfoBtn.disabled = false;
        els.trailerFeatureMoreInfoBtn.classList.add('conceptual-link'); // Add conceptual class
        els.trailerFeatureMoreInfoBtn.title = `View Details for ${utils.escapeHtml(movie.title)} (Concept)`;
        els.trailerFeatureMoreInfoBtn.dataset.movieId = movie.id; // Store ID if needed by conceptual handler

        // Thumbnail
        if (movie.backdrop_path) {
            els.trailerFeatureThumbnail.src = `${AuraStreamApp.config.IMAGE_BASE_URL}${AuraStreamApp.config.BACKDROP_SIZE}${movie.backdrop_path}`;
            els.trailerFeatureThumbnail.alt = `${utils.escapeHtml(movie.title)} thumbnail`;
            els.trailerFeatureThumbnail.style.opacity = '1'; // Ensure visible
        } else {
            els.trailerFeatureThumbnail.alt = 'Thumbnail unavailable';
            els.trailerFeatureThumbnail.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            els.trailerFeatureThumbnail.style.opacity = '0.5'; // Dim if no image
        }

        // Play Button - Enable regardless of initial bestTrailer check
        els.trailerFeaturePlayBtn.disabled = false;
        els.trailerFeaturePlayBtn.dataset.movieId = movie.id; // Set movie ID for the click handler

        utils.log(`TrailerFeature display updated for ${movie.title}. Play button enabled.`);
    },

     displayError: function(message = "Cannot load trailer.") {
         const els = AuraStreamApp.elements; const utils = AuraStreamApp.utils;
         if (!els.trailerFeatureSection) return; utils.warn(`Displaying error in trailer: ${message}`);
         if(els.trailerFeatureTitle) els.trailerFeatureTitle.innerHTML = `<span class="text-danger small">${utils.escapeHtml(message)}</span>`;
         if(els.trailerFeatureDesc) els.trailerFeatureDesc.textContent = 'Please try again later or check your connection/API Key.';
         if(els.trailerFeatureThumbnail) { els.trailerFeatureThumbnail.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; els.trailerFeatureThumbnail.alt = 'Error loading content'; }
         if(els.trailerFeaturePlayBtn) els.trailerFeaturePlayBtn.disabled = true; // Disable button on error
         if(els.trailerFeatureMoreInfoBtn) { els.trailerFeatureMoreInfoBtn.disabled = true; els.trailerFeatureMoreInfoBtn.classList.remove('conceptual-link');}
         this.currentMovie = null; // Clear movie state on error
     }
 },

      featureVideoPlayer: { // For inline video in features section
          init: function() {
              const els = AuraStreamApp.elements; const utils = AuraStreamApp.utils;
              if (!els.videoFeatureDemoPlayer || !els.videoFeatureDemoVideo || !els.videoFeatureDemoPlayButton) { utils.warn("Feature video player elements missing."); return; }
              utils.log("Init Feature Video Player...");
              const player = els.videoFeatureDemoPlayer; const video = els.videoFeatureDemoVideo; const playButton = els.videoFeatureDemoPlayButton;
              const playVideo = () => { if (video.paused) video.play().then(()=>player.classList.add('playing')).catch(e=>utils.error("Error playing feature video:", e)); else video.pause(); };
              playButton.addEventListener('click', (e) => { e.stopPropagation(); playVideo(); });
              player.addEventListener('click', playVideo);
              video.addEventListener('ended', () => player.classList.remove('playing'));
              video.addEventListener('pause', () => { if(!video.ended) player.classList.remove('playing'); });
          }
      },

      modals: { // No major changes needed here, just ensure els are cached
        trailerModalInstance: null, 
        launchAppModalInstance: null,
        detailModalInstance: null,
        _detailScrollElements: { container: null, prevBtn: null, nextBtn: null },
        init: function() {
            const utils = AuraStreamApp.utils; 
            const els = AuraStreamApp.elements; 
            utils.log("Init Modals...");
            try {
                if (AuraStreamApp.state.librariesLoaded.bootstrap) {
                    // Trailer Modal
                    if (els.trailerModal) {
                        this.trailerModalInstance = new bootstrap.Modal(els.trailerModal);
                        // *** ADD THIS LOG ***
                        utils.log("Bootstrap trailer modal instance CREATED.", this.trailerModalInstance ? 'Success' : 'FAILED');
                        els.trailerModal.addEventListener('hidden.bs.modal', () => {
                            if (els.trailerIframe) els.trailerIframe.src = ''; // Clear src on hide
                            utils.log("Trailer modal hidden, iframe src cleared."); // Add log
                        });
                    } else utils.warn("Trailer modal element (#trailer-modal) missing.");

                    // Launch/Auth Modal
                    if (els.launchAppModal) {
                        this.launchAppModalInstance = new bootstrap.Modal(els.launchAppModal);
                        // *** ADD THIS LOG ***
                        utils.log("Bootstrap launch/auth modal instance CREATED.", this.launchAppModalInstance ? 'Success' : 'FAILED');
                        els.launchAppModal.addEventListener('show.bs.modal', () => AuraStreamApp.modules.auth.clearAuthError());
                        els.launchAppModal.addEventListener('hide.bs.modal', () => AuraStreamApp.modules.auth.clearAuthError());
                    } else utils.warn("Launch/Auth modal element (#launchAppModal) missing.");

                    // *** Initialize Detail Modal Instance ***
                    if (els.detailModal) {
                        this.detailModalInstance = new bootstrap.Modal(els.detailModal);
                        utils.log("Bootstrap detail modal instance CREATED.", this.detailModalInstance ? 'Success' : 'FAILED');

                        // Add listeners to clear content/stop video when hidden
                        els.detailModal.addEventListener('hidden.bs.modal', () => {
                           utils.log("Detail modal hidden.");
                           this.clearDetailModalContent(); // Call helper to reset
                           // If a trailer was playing *from this modal*, stop it.
                           // This might need coordination if using the main trailer modal.
                           // A simple approach: just clear the main trailer iframe src too.
                           if (els.trailerIframe) els.trailerIframe.src = '';
                        });
                        // Add listener to show loading state when shown (optional, handled in openDetailModal)
                        // els.detailModal.addEventListener('show.bs.modal', () => { ... });
                    } else utils.warn("Detail modal element (#detailModal) missing.");

                        utils.log("Modals Initialized (including Detail Modal).");
                } else utils.warn("Bootstrap JS not loaded, modals will not function.");
             } catch (e) { utils.error("Error initializing Bootstrap modal instances:", e); }
        },


        openTrailer: async function(movieId) { // Make the function async
            const utils = AuraStreamApp.utils;
            const els = AuraStreamApp.elements;
            const config = AuraStreamApp.config; // Need access to config

            if (!movieId) {
                utils.error("openTrailer called with no movieId.");
                // Optionally show user feedback like an alert or toast
                alert("Cannot open trailer: Movie ID is missing.");
                return;
            }

            if (!this.trailerModalInstance || !els.trailerIframe) {
                utils.error("Trailer modal instance or iframe element is missing.");
                alert("Cannot open trailer: Modal component error.");
                return;
            }

            utils.log(`Attempting to open trailer for Movie ID: ${movieId}`);
            // Optional: Indicate loading to the user, e.g., disable the button that was clicked
            // This requires passing the button element or finding it, which adds complexity.
            // For now, we'll proceed directly.

            try {
                // 1. Fetch the videos for the given movie ID
                const videos = await utils.fetchMovieVideos(movieId);

                if (!videos) {
                    utils.warn(`No video data returned for movie ID: ${movieId} (API error or fetch failed).`);
                    alert("Could not fetch video information for this movie.");
                    return;
                }

                // 2. Find the best trailer among the fetched videos
                const bestTrailer = utils.getBestTrailer(videos);

                if (bestTrailer && bestTrailer.key) {
                    // 3. Construct the correct YouTube embed URL using the video key
                    const trailerUrl = `${config.YOUTUBE_EMBED_URL}${bestTrailer.key}?autoplay=1&rel=0`; // Added autoplay=1 and rel=0
                    utils.log(`Found trailer key: ${bestTrailer.key}. Setting iframe src to: ${trailerUrl}`);

                    // 4. Set the iframe source
                    els.trailerIframe.src = trailerUrl;

                    // 5. Show the modal
                    this.trailerModalInstance.show();
                    utils.log(`Trailer modal shown for Movie ID: ${movieId}`);

                } else {
                    // 6. Handle case where no suitable trailer was found
                    utils.warn(`No suitable YouTube trailer found for movie ID: ${movieId}. Videos available:`, videos);
                    alert("Sorry, no trailer could be found for this movie.");
                    // Ensure the iframe source is cleared if the modal was previously opened
                    els.trailerIframe.src = '';
                }

            } catch (error) {
                // 7. Handle any errors during the process
                utils.error(`Error in openTrailer for movie ID ${movieId}:`, error);
                alert("An error occurred while trying to load the trailer.");
                 // Ensure the iframe source is cleared on error
                 els.trailerIframe.src = '';
            } finally {
                // Optional: Re-enable the button that was clicked if you disabled it earlier.
            }
        },

        openTrailerByKey: function(videoKey) {
        const utils = AuraStreamApp.utils;
        const els = AuraStreamApp.elements;
        const config = AuraStreamApp.config;

        if (!videoKey) {
            utils.error("openTrailerByKey called with no videoKey.");
            alert("Cannot open trailer: Video key missing.");
            return;
        }
        if (!this.trailerModalInstance || !els.trailerIframe) {
            utils.error("Trailer modal instance or iframe element is missing.");
            alert("Cannot open trailer: Modal component error.");
            return;
        }
        utils.log(`Opening trailer directly with key: ${videoKey}`);
        const trailerUrl = `${config.YOUTUBE_EMBED_URL}${videoKey}?autoplay=1&rel=0`;
        els.trailerIframe.src = trailerUrl;
        this.trailerModalInstance.show();
    },

    // Function to reset the detail modal content (called when hidden)
    clearDetailModalContent: function() {
        const els = AuraStreamApp.elements;
        if (!els.detailModalBody) return;

        // Hide content, show spinner (ready for next load)
        els.detailContentArea?.classList.add('d-none');
        els.detailLoadingSpinner?.classList.remove('d-none');

        // Clear dynamic content areas
        if (els.detailTitlePlaceholder) els.detailTitlePlaceholder.textContent = 'Loading Details...';
        if (els.detailPoster) { els.detailPoster.src = ''; els.detailPoster.alt = 'Poster'; }
        if (els.detailTitle) els.detailTitle.textContent = '';
        if (els.detailTagline) els.detailTagline.textContent = '';
        if (els.detailRating) els.detailRating.innerHTML = '<i class="bi bi-star-fill text-warning me-1"></i> N/A';
        if (els.detailReleaseDate) els.detailReleaseDate.innerHTML = '<i class="bi bi-calendar3 me-1"></i> N/A';
        if (els.detailRuntimeSeasons) els.detailRuntimeSeasons.innerHTML = '<i class="bi bi-clock-history me-1"></i> N/A';
        if (els.detailGenres) els.detailGenres.innerHTML = '';
        if (els.detailOverview) els.detailOverview.textContent = '';
        if (els.detailCastContainer) els.detailCastContainer.innerHTML = '';
        if (els.detailRecommendationsContainer) els.detailRecommendationsContainer.innerHTML = '<div class="loading-shelf-text"><div class="loading-spinner"></div> Loading recommendations...</div>'; // Reset recommendations too
        if (els.detailProvidersContainer) els.detailProvidersContainer.innerHTML = ''; // Clear providers
        if (els.detailTrailerButton) {
             els.detailTrailerButton.disabled = true;
             els.detailTrailerButton.onclick = null; // Remove previous listener
        }
        this._detailScrollElements = { container: null, prevBtn: null, nextBtn: null };
    },

    // --- NEW HELPER: Update Detail Scroll Buttons ---
    _updateDetailScrollButtons: function() {
        const els = this._detailScrollElements;
        if (!els.container || !els.prevBtn || !els.nextBtn) return; // Exit if elements not set

        requestAnimationFrame(() => { // Ensure layout calculations are ready
            const { scrollLeft, scrollWidth, clientWidth } = els.container;
            const tolerance = 10; // Allow some tolerance

            const isStart = scrollLeft <= tolerance;
            // Check if scrollWidth is significantly larger than clientWidth before enabling next
            const canScroll = scrollWidth > clientWidth + tolerance;
            const isEnd = canScroll ? (scrollLeft >= Math.ceil(scrollWidth - clientWidth) - tolerance) : true;

            els.prevBtn.classList.toggle('disabled', isStart);
            els.prevBtn.disabled = isStart; // Also set disabled property
            els.prevBtn.setAttribute('aria-disabled', String(isStart));

            els.nextBtn.classList.toggle('disabled', isEnd || !canScroll);
            els.nextBtn.disabled = isEnd || !canScroll; // Also set disabled property
            els.nextBtn.setAttribute('aria-disabled', String(isEnd || !canScroll));

            // AuraStreamApp.utils.log(`Detail scroll update: Start=${isStart}, End=${isEnd}, CanScroll=${canScroll}`);
        });
    },

    // --- NEW HELPER: Handle Detail Shelf Scroll ---
    _scrollDetailShelf: function(direction) {
        const els = this._detailScrollElements;
        if (!els.container) return;

        const scrollAmount = els.container.clientWidth * 0.8; // Scroll 80% of visible width
        els.container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });

        // Update buttons shortly after scroll starts
        // Use setTimeout because 'scroll' event might not fire immediately/reliably after scrollBy
        setTimeout(() => this._updateDetailScrollButtons(), 300);
        setTimeout(() => this._updateDetailScrollButtons(), 650); // Check again after smooth scroll likely ends
    },


    // --- NEW: Function to Open and Populate the Detail Modal ---
    openDetailModal: async function(itemId, itemType) {
        const utils = AuraStreamApp.utils;
        const els = AuraStreamApp.elements;
        const config = AuraStreamApp.config;
        const app = AuraStreamApp; // App reference
        const self = this;

        if (!itemId || !itemType) {
            utils.error("openDetailModal: Missing itemId or itemType.");
            return;
        }
        if (!this.detailModalInstance || !els.detailModalBody) {
            utils.error("Detail modal instance or body element missing.");
            return;
        }

        utils.log(`Opening detail modal for ID: ${itemId}, Type: ${itemType}`);

        // 1. Reset and Show Loading State
        this.clearDetailModalContent(); // Ensure it's clean before showing
        this.detailModalInstance.show(); // Show the modal structure with spinner

        // 2. Define API Endpoints
        const detailsEndpoint = `/${itemType}/${itemId}`;
        const creditsEndpoint = `/${itemType}/${itemId}/credits`;
        const videosEndpoint = `/${itemType}/${itemId}/videos`;
        const recommendationsEndpoint = `/${itemType}/${itemId}/recommendations`;
        // Watch Providers - Requires separate permission/handling - optional for now
        // const providersEndpoint = `/${itemType}/${itemId}/watch/providers`;

        // 3. Fetch Data Concurrently
        try {
            const [detailsRes, creditsRes, videosRes, recommendationsRes] = await Promise.allSettled([
                utils.fetchTMDB(detailsEndpoint),
                utils.fetchTMDB(creditsEndpoint),
                utils.fetchTMDB(videosEndpoint),
                utils.fetchTMDB(recommendationsEndpoint),
                // utils.fetchTMDB(providersEndpoint) // Optional
            ]);

            // --- Check Core Details First ---
            if (detailsRes.status !== 'fulfilled' || !detailsRes.value) {
                throw new Error(`Failed to fetch core details for ${itemType} ${itemId}.`);
            }
            const details = detailsRes.value;

            // --- Process and Populate ---
            // Hide spinner, show content area
            els.detailLoadingSpinner?.classList.add('d-none');
            els.detailContentArea?.classList.remove('d-none');

            // Titles
            const title = utils.escapeHtml(details.title || details.name || 'N/A');
            if (els.detailTitlePlaceholder) els.detailTitlePlaceholder.textContent = title;
            if (els.detailTitle) els.detailTitle.textContent = title;
            if (els.detailTagline) els.detailTagline.textContent = details.tagline ? utils.escapeHtml(details.tagline) : '';

            // Poster
            if (els.detailPoster) {
                els.detailPoster.src = details.poster_path
                    ? `${config.IMAGE_BASE_URL}${config.POSTER_SIZE}${details.poster_path}`
                    : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                els.detailPoster.alt = `${title} Poster`;
            }

            // Rating, Date, Runtime/Seasons
            if (els.detailRating) els.detailRating.innerHTML = `<i class="bi bi-star-fill text-warning me-1"></i> ${details.vote_average ? details.vote_average.toFixed(1) + '/10' : 'N/A'}`;
            if (els.detailReleaseDate) els.detailReleaseDate.innerHTML = `<i class="bi bi-calendar3 me-1"></i> ${utils.formatDate(details.release_date || details.first_air_date) || 'N/A'}`;
            if (els.detailRuntimeSeasons) {
                let runtimeText = 'N/A';
                if (itemType === 'movie' && details.runtime) {
                    runtimeText = `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`;
                } else if (itemType === 'tv') {
                    runtimeText = `${details.number_of_seasons || 'N/A'} Season(s)`;
                    if(details.number_of_episodes) runtimeText += ` / ${details.number_of_episodes} Ep.`;
                }
                els.detailRuntimeSeasons.innerHTML = `<i class="bi ${itemType === 'tv' ? 'bi-collection-play' : 'bi-clock-history'} me-1"></i> ${runtimeText}`;
            }

            // Genres
            if (els.detailGenres && details.genres?.length > 0) {
                els.detailGenres.innerHTML = details.genres
                    .map(g => `<span class="badge">${utils.escapeHtml(g.name)}</span>`)
                    .join('');
            } else if (els.detailGenres) {
                els.detailGenres.innerHTML = '<span class="text-muted small">Genres not available</span>';
            }

            // Overview
            if (els.detailOverview) els.detailOverview.textContent = details.overview || 'No overview available.';

            // Trailer Button
            let bestTrailerKey = null;
            if (videosRes.status === 'fulfilled' && videosRes.value?.results) {
                const bestTrailer = utils.getBestTrailer(videosRes.value.results);
                bestTrailerKey = bestTrailer?.key;
            }
            if (els.detailTrailerButton) {
                els.detailTrailerButton.disabled = !bestTrailerKey;
                if (bestTrailerKey) {
                    // Add listener using the specific key
                    els.detailTrailerButton.onclick = () => {
                        this.openTrailerByKey(bestTrailerKey);
                    };
                } else {
                     els.detailTrailerButton.onclick = null;
                }
            }

            // Cast
            if (els.detailCastContainer) {
                if (creditsRes.status === 'fulfilled' && creditsRes.value?.cast?.length > 0) {
                    this._populateCast(creditsRes.value.cast.slice(0, 8)); // Show top 8 cast
                } else {
                    els.detailCastContainer.innerHTML = '<p class="text-muted small">Cast information not available.</p>';
                }
            }

            // Recommendations
            if (els.detailRecommendationsContainer) {
                 if (recommendationsRes.status === 'fulfilled' && recommendationsRes.value?.results?.length > 0) {
                     // Render the recommendation cards FIRST
                     app.modules.shelves.renderCards(
                         recommendationsRes.value.results.slice(0, 25), // Show up to 12 recs
                         els.detailRecommendationsContainer,
                         itemType // Pass the original item type
                     );

                    // *** NOW Find and Setup Scroll Buttons for Recommendations ***
                    const scrollWrapper = els.detailRecommendationsContainer.closest('.simplified-shelf');
                    if (scrollWrapper) {
                        self._detailScrollElements.container = els.detailRecommendationsContainer;
                        self._detailScrollElements.prevBtn = scrollWrapper.querySelector('.detail-scroll-btn.prev');
                        self._detailScrollElements.nextBtn = scrollWrapper.querySelector('.detail-scroll-btn.next');

                        if (self._detailScrollElements.container && self._detailScrollElements.prevBtn && self._detailScrollElements.nextBtn) {
                            utils.log("Setting up detail recommendations scroll listeners...");

                            // Add scroll event listener (debounced)
                            const debouncedUpdate = utils.debounce(() => self._updateDetailScrollButtons(), 150);
                            self._detailScrollElements.container.addEventListener('scroll', debouncedUpdate, { passive: true });

                            // Add click listeners for buttons
                            self._detailScrollElements.prevBtn.onclick = () => self._scrollDetailShelf(-1);
                            self._detailScrollElements.nextBtn.onclick = () => self._scrollDetailShelf(1);

                            // Initial button state update (delay slightly for render)
                             setTimeout(() => self._updateDetailScrollButtons(), 100);

                        } else {
                             utils.warn("Could not find all necessary scroll elements for detail recommendations.");
                        }
                    } else {
                        utils.warn("Could not find '.simplified-shelf' wrapper for recommendations scroll setup.");
                    }

                 } else {
                     els.detailRecommendationsContainer.innerHTML = '<div class="error-shelf-text">No recommendations found.</div>';
                 }
            }

             // Watch Providers (Optional - Basic Example)
            // Uncomment and adapt if needed (requires API permission check)
            /*
            if (els.detailProvidersContainer && providersRes.status === 'fulfilled' && providersRes.value?.results?.US) { // Check specific region, e.g., US
                this._populateProviders(providersRes.value.results.US);
            } else if (els.detailProvidersContainer) {
                els.detailProvidersContainer.innerHTML = '<p class="text-muted small mt-2">Streaming info unavailable.</p>';
            }
            */


        }catch (error) {
            // --- Error Handling ---
             utils.error(`Error populating detail modal for ${itemType} ${itemId}:`, error);
             els.detailLoadingSpinner?.classList.add('d-none');
             els.detailContentArea?.classList.add('d-none');
             if (els.detailModalBody) {
                 els.detailModalBody.innerHTML = `<div class="alert alert-danger" role="alert">Could not load details. ${error.message}</div>`;
             }
             if (els.detailTitlePlaceholder) els.detailTitlePlaceholder.textContent = 'Error';
        }
    }, // End openDetailModal

    // --- Helper: Populate Cast ---
    _populateCast: function(cast) {
        const els = AuraStreamApp.elements;
        const utils = AuraStreamApp.utils;
        const config = AuraStreamApp.config;
        if (!els.detailCastContainer || !cast) return;

        els.detailCastContainer.innerHTML = cast.map(member => {
            const img = member.profile_path
                ? `${config.IMAGE_BASE_URL}${config.PROFILE_SIZE}${member.profile_path}`
                : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="%23a0aec0" class="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>'; // Placeholder SVG
            return `
                <div class="cast-member">
                    <img src="${img}" alt="${utils.escapeHtml(member.name)}" loading="lazy">
                    <span class="cast-name">${utils.escapeHtml(member.name)}</span>
                    <span class="cast-character">${utils.escapeHtml(member.character || '')}</span>
                </div>
            `;
        }).join('');
    },

     // --- Helper: Populate Recommendations ---
     _populateRecommendations: function(recommendations, originalItemType) {
         const els = AuraStreamApp.elements;
         const utils = AuraStreamApp.utils;
         if (!els.detailRecommendationsContainer || !recommendations) return;

         // Use the main shelf rendering function, but target the modal's container
         // Pass the originalItemType so it knows how to render movie/tv cards
         AuraStreamApp.modules.shelves.renderCards(recommendations, els.detailRecommendationsContainer, originalItemType);

         // Re-attach AOS if needed, though maybe skip for modal content?
         if (AuraStreamApp.state.librariesLoaded.aos) {
             // Delay refresh slightly to ensure elements are in DOM
             // setTimeout(() => AOS.refreshHard(), 100); // Use refreshHard if needed
         }
     },


        closeAuthModal: function() {
            if (this.launchAppModalInstance) {
                this.launchAppModalInstance.hide();
            }
        }
      },
      conceptualLinks: { // Using robust version
          init: function() { const utils = AuraStreamApp.utils; document.body.addEventListener('click', (e) => { const link = e.target.closest('.conceptual-link'); if (link && !link.disabled) this.handleClick(link, link.title || 'Conceptual', e); }); utils.log("ConceptualLinks Initialized."); },
          handleClick: function(link, msg = null, e = null) { if(e) e.preventDefault(); alert(msg || "This feature is conceptual."); AuraStreamApp.utils.log(`Conceptual link clicked: ${link.title || link.textContent.trim()}`); }
      },

      analyticsDashboard: { // Using robust version + displayError
          elements: {},
          init: function() { AuraStreamApp.utils.log("Analytics init."); this.cacheElements(); },
          cacheElements: function() { this.elements.kpiTotalTitles=AuraStreamApp.elements.kpiTotalTitles; this.elements.kpiActiveUsers=AuraStreamApp.elements.kpiActiveUsers; this.elements.kpiAvgRating=AuraStreamApp.elements.kpiAvgRating; this.elements.kpiCommunityPosts=AuraStreamApp.elements.kpiCommunityPosts; this.elements.topActorsList=AuraStreamApp.elements.topActorsList; this.elements.gaugeFillElement=AuraStreamApp.elements.gaugeFillElement; this.elements.gaugeValueElement=AuraStreamApp.elements.gaugeValueElement; this.elements.networkBarChart=AuraStreamApp.elements.networkBarChart; },
          loadAnalyticsData: async function() { const utils = AuraStreamApp.utils; utils.log("Loading analytics..."); const results = await Promise.allSettled([ this.updateKpis(), this.fetchAndRenderTopActors(), this.updateGauge(), this.updateNetworkChart() ]); utils.log("Analytics settled."); results.forEach((r, i) => { if (r.status === 'rejected') utils.error(`Analytics load failed (Promise ${i}):`, r.reason); }); },
          updateKpis: async function() { const utils = AuraStreamApp.utils; utils.log("Updating KPIs..."); try { if(this.elements.kpiTotalTitles) this.elements.kpiTotalTitles.textContent = "1.2M+"; if(this.elements.kpiActiveUsers) this.elements.kpiActiveUsers.textContent = "65k+"; if(this.elements.kpiAvgRating) this.elements.kpiAvgRating.innerHTML = '8.2 <i class="bi bi-star-fill text-warning"></i>'; if(this.elements.kpiCommunityPosts) this.elements.kpiCommunityPosts.textContent = "12k+"; } catch(e) { utils.error("Error update KPIs:", e); } },
          updateGauge: function() { const utils = AuraStreamApp.utils; utils.log("Updating Gauge..."); try { const val = Math.floor(Math.random() * 26) + 60; const turn = val / 100; if (this.elements.gaugeFillElement) setTimeout(() => {this.elements.gaugeFillElement.style.transform = `rotate(${turn}turn)`;}, 100); if (this.elements.gaugeValueElement) this.elements.gaugeValueElement.textContent = `${val}%`; } catch(e) { utils.error("Error update Gauge:", e); } },
          updateNetworkChart: function() { const utils = AuraStreamApp.utils; utils.log("Updating Network Chart..."); const data = [ {l:"Netflix",v:75,c:"var(--gradient-primary)"},{l:"HBO",v:70,c:"var(--gradient-secondary)"},{l:"Disney+",v:65,c:"linear-gradient(130deg, var(--secondary-accent), var(--tertiary-accent))"},{l:"Prime",v:60,c:"linear-gradient(130deg, var(--tertiary-accent), #ffc107)"},{l:"Apple+",v:45,c:"linear-gradient(130deg, #ffc107, #4caf50)"}]; try { if (this.elements.networkBarChart) { let html = ''; data.forEach((item, i) => { html += `<div class="bar-item" data-aos="fade-left" data-aos-delay="${i*50}"><div class="bar-label">${utils.escapeHtml(item.l)}</div><div class="bar" style="background: ${item.c}; width: 0%;" data-target-width="${item.v}%"></div></div>`; }); this.elements.networkBarChart.innerHTML = html; setTimeout(() => { this.elements.networkBarChart.querySelectorAll('.bar').forEach(bar => { bar.style.width = bar.dataset.targetWidth; }); }, 100); } } catch (e) { utils.error("Error update Network Chart:", e); } },
          fetchAndRenderTopActors: async function() { const utils = AuraStreamApp.utils; if (!this.elements.topActorsList) return; this.elements.topActorsList.innerHTML = utils.getLoadingTextHTML("Loading actors..."); try { const data = await utils.fetchTMDB('/person/popular', { page: 1 }); if (data?.results?.length) this.renderTopActors(data.results.slice(0, 6)); else { this.elements.topActorsList.innerHTML = utils.getErrorTextHTML("Could not load actors."); utils.warn("Fetch actors failed/empty."); } } catch (e) { utils.error("Error fetch actors:", e); this.elements.topActorsList.innerHTML = utils.getErrorTextHTML("Error loading actors."); } },
          renderTopActors: function(actors) { const utils = AuraStreamApp.utils; if (!this.elements.topActorsList || !actors?.length) return; const config = AuraStreamApp.config; let html = ''; actors.forEach((actor, i) => { const img = actor.profile_path ? `${config.IMAGE_BASE_URL}${config.PROFILE_SIZE}${actor.profile_path}` : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23a0aec0" class="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>'; html += `<div class="actor-item" data-aos="fade-up" data-aos-delay="${i*50}"><img src="${img}" alt="${utils.escapeHtml(actor.name)}" loading="lazy"><span class="actor-name">${utils.escapeHtml(actor.name)}</span><span class="actor-popularity"><i class="bi bi-graph-up"></i> ${actor.popularity?.toFixed(1) || '?'}</span></div>`; }); this.elements.topActorsList.innerHTML = html; utils.log("Actors rendered."); if (AuraStreamApp.state.librariesLoaded.aos) AOS.refresh(); },
          displayError: function(message = "Cannot load analytics.") { const utils = AuraStreamApp.utils; utils.warn(`Displaying error in analytics: ${message}`); const errorHtml = utils.getErrorTextHTML(message); if (this.elements.kpiTotalTitles) this.elements.kpiTotalTitles.textContent="N/A"; if (this.elements.kpiActiveUsers) this.elements.kpiActiveUsers.textContent="N/A"; if (this.elements.kpiAvgRating) this.elements.kpiAvgRating.innerHTML='<i class="bi bi-exclamation-triangle text-danger"></i>'; if (this.elements.kpiCommunityPosts) this.elements.kpiCommunityPosts.textContent="N/A"; if (this.elements.topActorsList) this.elements.topActorsList.innerHTML = errorHtml; if (this.elements.gaugeValueElement) this.elements.gaugeValueElement.textContent="N/A"; if (this.elements.gaugeFillElement) this.elements.gaugeFillElement.style.transform='rotate(0turn)'; if (this.elements.networkBarChart) this.elements.networkBarChart.innerHTML = errorHtml; }
      },

      faq: { init: function() { AuraStreamApp.utils.log("FAQ Initialized."); } },

      gallery3D: { // Improved version
          elements: {}, state: { currentIndex: 0, rotationY: 0, angleStep: 0, isDragging: false, startPosition: 0, currentTouchIdentifier: null },
          init: function() { const utils = AuraStreamApp.utils; utils.log("Init 3D Gallery..."); this.cacheElements(); if (!this.validateElements()) { utils.warn("3D Gallery invalid. Aborting."); if (this.elements.galleryContainer) this.elements.galleryContainer.style.display='none'; return; } this.state.angleStep = 360 / this.elements.cards.length; this.applyCardTransforms(); this.addEventListeners(); this.updateGallery(false); this.resetAutoRotate(); utils.log("3D Gallery Initialized."); },
          cacheElements: function() { this.elements.galleryContainer=AuraStreamApp.elements.gallerySection; this.elements.galleryStage=AuraStreamApp.elements.galleryStage; this.elements.cards=AuraStreamApp.elements.galleryCards; this.elements.dotsContainer=AuraStreamApp.elements.galleryDotsContainer; this.elements.dots=AuraStreamApp.elements.galleryDots; this.elements.prevBtn=AuraStreamApp.elements.galleryPrevBtn; this.elements.nextBtn=AuraStreamApp.elements.galleryNextBtn; this.elements.modal=AuraStreamApp.elements.galleryFullscreenModal; this.elements.modalImage=AuraStreamApp.elements.galleryModalImageFs; this.elements.modalCaption=AuraStreamApp.elements.galleryModalCaptionFs; this.elements.modalClose=AuraStreamApp.elements.galleryModalCloseFs; },
          validateElements: function() { const els = this.elements; const utils = AuraStreamApp.utils; const req = [els.galleryContainer, els.galleryStage, els.cards, els.dotsContainer, els.dots, els.prevBtn, els.nextBtn, els.modal, els.modalImage, els.modalCaption, els.modalClose]; if (req.some(el => !el)) { utils.error("Gallery validation failed: Missing elements."); return false; } if (els.cards.length === 0 || els.dots.length !== els.cards.length) { utils.error(`Gallery validation failed: Card/dot count mismatch (${els.cards.length}/${els.dots.length}).`); return false; } return true; },
          applyCardTransforms: function() { const config = AuraStreamApp.config; const baseZ = config.GALLERY_TRANSLATE_Z_BASE; this.elements.cards.forEach((card, index) => { const angle = index * this.state.angleStep; card.style.transform = `translate3d(-50%, -50%, 0) rotateY(${angle}deg) translateZ(${baseZ}px)`; card.dataset.index = index; card.style.width = `${config.GALLERY_CARD_WIDTH}px`; card.style.height = `${config.GALLERY_CARD_HEIGHT}px`; }); if(this.elements.galleryContainer) this.elements.galleryContainer.style.perspective = `${config.GALLERY_PERSPECTIVE}px`; },
          addEventListeners: function() { const els = this.elements; const self = this; const utils = AuraStreamApp.utils; try { els.prevBtn.addEventListener('click', () => { self.resetAutoRotate(); self.prevSlide(); }); els.nextBtn.addEventListener('click', () => { self.resetAutoRotate(); self.nextSlide(); }); els.dots.forEach(dot => dot.addEventListener('click', function() { self.resetAutoRotate(); const i = parseInt(this.dataset.index); if (!isNaN(i) && i !== self.state.currentIndex) { self.state.currentIndex = i; self.updateGallery(); } })); els.cards.forEach(card => { card.addEventListener('click', function() { self.resetAutoRotate(); const i = parseInt(this.dataset.index); if (isNaN(i)) return; if (this.classList.contains('active')) self.openModal(i); else { self.state.currentIndex = i; self.updateGallery(); } }); card.addEventListener('mousedown', self.dragStart.bind(self)); card.addEventListener('touchstart', self.dragStart.bind(self), { passive: true }); }); els.modalClose.addEventListener('click', self.closeModal.bind(self)); els.modal.addEventListener('click', (e) => { if (e.target === els.modal) self.closeModal(); }); document.addEventListener('mouseup', self.dragEnd.bind(self)); document.addEventListener('touchend', self.dragEnd.bind(self)); document.addEventListener('mousemove', self.drag.bind(self)); document.addEventListener('touchmove', self.drag.bind(self), { passive: false }); els.galleryStage.addEventListener('mouseleave', self.dragEnd.bind(self)); document.addEventListener('keydown', (e) => { if (els.modal.classList.contains('active')) { if (e.key === 'Escape') self.closeModal(); } else if (document.activeElement && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && els.galleryContainer?.contains(document.activeElement)) { if (e.key === 'ArrowLeft') { e.preventDefault(); self.resetAutoRotate(); self.prevSlide(); } if (e.key === 'ArrowRight') { e.preventDefault(); self.resetAutoRotate(); self.nextSlide(); } } }); ['mousedown','touchstart','keydown'].forEach(evt => els.galleryContainer?.addEventListener(evt, self.resetAutoRotate.bind(self), { capture: true })); } catch(e) { utils.error("Error gallery listeners:", e); } },
          updateGallery: function(transition = true) { try { const config = AuraStreamApp.config; const baseZ = config.GALLERY_TRANSLATE_Z_BASE; const activeZ = config.GALLERY_TRANSLATE_Z_ACTIVE; const activeScale = config.GALLERY_SCALE_ACTIVE; this.state.rotationY = -this.state.currentIndex * this.state.angleStep; if (!this.elements.galleryStage) return; this.elements.galleryStage.style.transition = transition ? `transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1.2)` : 'none'; this.elements.galleryStage.style.transform = `rotateY(${this.state.rotationY}deg)`; this.elements.cards.forEach((card, index) => { card.classList.toggle('active', index === this.state.currentIndex); const angle = index * this.state.angleStep; const isActive = index === this.state.currentIndex; const currentZ = isActive ? activeZ : baseZ; const currentScale = isActive ? activeScale : 1; card.style.transform = `translate3d(-50%, -50%, 0) rotateY(${angle}deg) translateZ(${currentZ}px) scale(${currentScale})`; }); this.elements.dots.forEach((dot, index) => dot.classList.toggle('active', index === this.state.currentIndex)); } catch (e) { AuraStreamApp.utils.error("Error update gallery:", e); } },
          nextSlide: function() { this.state.currentIndex = (this.state.currentIndex + 1) % this.elements.cards.length; this.updateGallery(); },
          prevSlide: function() { this.state.currentIndex = (this.state.currentIndex - 1 + this.elements.cards.length) % this.elements.cards.length; this.updateGallery(); },
          openModal: function(index) { const utils = AuraStreamApp.utils; try { const card = this.elements.cards[index]; if (!card || !this.elements.modalImage || !this.elements.modalCaption || !this.elements.modal) return; const imgEl = card.querySelector('.card-image'); const name = card.getAttribute('data-name') || `Image ${index + 1}`; if (imgEl?.src) { this.elements.modalImage.src = imgEl.src; this.elements.modalImage.alt = imgEl.alt || name; } else { this.elements.modalImage.src = ''; this.elements.modalImage.alt = 'N/A'; utils.warn(`Img src missing ${index}`); } this.elements.modalCaption.textContent = name; this.elements.modal.classList.add('active'); document.body.style.overflow = 'hidden'; } catch (e) { utils.error("Error open modal:", e); } },
          closeModal: function() { try { if (!this.elements.modal) return; this.elements.modal.classList.remove('active'); document.body.style.overflow = ''; } catch (e) { AuraStreamApp.utils.error("Error close modal:", e); } },
          dragStart: function(e) { const utils = AuraStreamApp.utils; try { if (e.target.closest('.nav-btn') || e.target.closest('.dot') || !this.elements.galleryStage) return; this.resetAutoRotate(); AuraStreamApp.state.isGalleryDragging = true; this.state.startPosition = this.getPositionX(e); if (this.state.startPosition === null) { AuraStreamApp.state.isGalleryDragging = false; return; } this.elements.galleryStage.style.transition = 'none'; this.elements.galleryStage.style.cursor = 'grabbing'; document.body.style.cursor = 'grabbing'; document.body.style.userSelect = 'none'; if (e.type === 'touchstart') this.state.currentTouchIdentifier = e.touches[0].identifier; } catch(e){ utils.error("Error dragStart:", e); AuraStreamApp.state.isGalleryDragging = false; }},
          drag: function(e) { if (!AuraStreamApp.state.isGalleryDragging || !this.elements.galleryStage) return; try { const currentPos = this.getPositionX(e); if (currentPos === null) return; if (e.type.includes('touch')) { e.preventDefault(); } const diff = currentPos - this.state.startPosition; const rotationDelta = diff * 0.2; this.elements.galleryStage.style.transform = `rotateY(${this.state.rotationY + rotationDelta}deg)`; } catch (e) { AuraStreamApp.utils.error("Error during drag:", e); AuraStreamApp.state.isGalleryDragging = false; this.dragEnd(); } },
          dragEnd: function(e) { if (!AuraStreamApp.state.isGalleryDragging || !this.elements.galleryStage) return; AuraStreamApp.state.isGalleryDragging = false; try { this.elements.galleryStage.style.cursor = 'grab'; document.body.style.cursor = ''; document.body.style.userSelect = ''; const endPos = this.getPositionX(e); const currentPos = (endPos !== undefined && endPos !== null) ? endPos : this.state.startPosition; const diff = currentPos - this.state.startPosition; const threshold = 50; if (diff > threshold) this.prevSlide(); else if (diff < -threshold) this.nextSlide(); else this.updateGallery(); this.state.currentTouchIdentifier = null; } catch (e) { AuraStreamApp.utils.error("Error dragEnd:", e); this.updateGallery(); } },
          getPositionX: function(e) { if (e.type.includes('mouse')) return e.pageX; if (e.type.includes('touch')) { const touch = (e.touches && e.touches.length > 0) ? Array.from(e.touches).find(t => t.identifier === this.state.currentTouchIdentifier) || e.touches[0] : (e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0] : null; return touch ? touch.clientX : null; } return null; },
          startAutoRotate: function() { this.stopAutoRotate(); AuraStreamApp.state.galleryAutoRotateInterval = setInterval(() => this.nextSlide(), AuraStreamApp.config.GALLERY_AUTO_ROTATE_INTERVAL); },
          stopAutoRotate: function() { clearInterval(AuraStreamApp.state.galleryAutoRotateInterval); clearTimeout(AuraStreamApp.state.galleryAutoRotateTimeout); AuraStreamApp.state.galleryAutoRotateInterval = null; AuraStreamApp.state.galleryAutoRotateTimeout = null; },
          resetAutoRotate: function() { this.stopAutoRotate(); AuraStreamApp.state.galleryAutoRotateTimeout = setTimeout(() => this.startAutoRotate(), AuraStreamApp.config.GALLERY_AUTO_ROTATE_DELAY); }
      },

      auth: {
        init: function() {
            const utils = AuraStreamApp.utils;
            const els = AuraStreamApp.elements;
            utils.log("Initializing Auth (Firebase) module listeners...");

            // NOTE: Actual initial login check is handled by onAuthStateChanged in initializeFirebase

            // Add form submit listeners
            if (els.loginForm) els.loginForm.addEventListener('submit', (e) => this.handleEmailLogin(e));
            else utils.warn("Login form not found.");

            if (els.signupForm) els.signupForm.addEventListener('submit', (e) => this.handleEmailSignup(e));
            else utils.warn("Signup form not found.");

            // Add Google button listeners
            if (els.googleLoginButton) els.googleLoginButton.addEventListener('click', () => this.handleGoogleAuth(false));
            else utils.warn("Google login button not found.");

            if (els.googleSignupButton) els.googleSignupButton.addEventListener('click', () => this.handleGoogleAuth(true));
            else utils.warn("Google signup button not found.");

            // Add Logout button listener
            if (els.logoutButton) els.logoutButton.addEventListener('click', () => this.handleLogout());
            else utils.warn("Logout button not found.");

            // Clear errors when switching tabs in modal
            document.querySelectorAll('#authTabs button[data-bs-toggle="tab"]').forEach(tabEl => {
                tabEl.addEventListener('shown.bs.tab', () => this.clearAuthError());
            });

            utils.log("Auth (Firebase) module listeners attached.");
        },

        // checkLoginStatus: function() {
        //     // This is now effectively handled by onAuthStateChanged listener setup during Firebase init
        //     AuraStreamApp.utils.log("Initial auth state checked via onAuthStateChanged.");
        // },

        handleEmailLogin: function(event) {
            event.preventDefault();
            const utils = AuraStreamApp.utils;
            const els = AuraStreamApp.elements;
            const auth = AuraStreamApp.state.firebaseAuth;
            utils.log("Handling Email Login attempt...");
            this.clearAuthError();

            const email = els.loginEmailInput?.value?.trim();
            const password = els.loginPasswordInput?.value;

            if (!auth) { this.showAuthError("Auth service not available."); return; }
            if (!email || !password) { this.showAuthError("Please enter email and password."); return; }

            utils.log(`Attempting Firebase sign in for ${email}...`);
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    utils.log(`Firebase Email Login SUCCESS: ${user.email}`);
                    // onAuthStateChanged will handle state update and UI update
                    // We just need to close modal and redirect here
                    AuraStreamApp.modules.modals.closeAuthModal();
                    window.location.href = AuraStreamApp.config.AUTH_REDIRECT_URL;
                })
                .catch((error) => {
                    utils.error("Firebase Email Login FAILED:", error);
                    this.showAuthError(this.mapFirebaseError(error));
                });
        },

        updateProfileAndStoreData: async function(user, name, age, avatarFile = null) {
             const utils = AuraStreamApp.utils;
             const state = AuraStreamApp.state;
             let photoURL = null; // Default photoURL

             utils.log(`AuthModule: Starting profile/data update for ${user.uid}`);

             // 1. Handle Avatar Upload (if file exists and storage available)
             if (avatarFile && state.firebaseStorage) {
                 utils.log(`AuthModule: Uploading avatar for ${user.uid}...`);
                 // Unique path: profile_images / USER_ID / timestamp_filename
                 const filePath = `profile_images/${user.uid}/${Date.now()}_${avatarFile.name}`;
                 const storageRef = state.firebaseStorage.ref(filePath);

                 try {
                     const snapshot = await storageRef.put(avatarFile); // Await upload
                     utils.log(`AuthModule: Avatar uploaded (${snapshot.bytesTransferred} bytes).`);
                     photoURL = await snapshot.ref.getDownloadURL(); // Await URL retrieval
                     utils.log(`AuthModule: Avatar download URL obtained: ${photoURL}`);
                 } catch (uploadError) {
                     utils.error(`AuthModule: Avatar upload failed:`, uploadError);
                     throw new Error(`Avatar upload failed: ${uploadError.message}`); // Signal failure
                 }
             } else {
                 utils.log(`AuthModule: No avatar file provided or Storage not available.`);
             }

             // 2. Update Firebase Auth Profile (DisplayName, PhotoURL)
             utils.log(`AuthModule: Updating Auth profile for ${user.uid} (Name: ${name}, URL: ${photoURL})`);
             try {
                  // Only update fields that are provided
                 const profileUpdates = {};
                 if (name) profileUpdates.displayName = name;
                 if (photoURL) profileUpdates.photoURL = photoURL; // Use URL from upload

                 if (Object.keys(profileUpdates).length > 0) {
                      await user.updateProfile(profileUpdates);
                      utils.log(`AuthModule: Auth profile updated successfully.`);
                      // Re-fetch the user to ensure local state gets updated IF NEEDED immediately
                      // await user.reload(); // Or rely on next onAuthStateChanged
                 } else {
                      utils.log(`AuthModule: No profile changes to update in Auth.`);
                 }
             } catch(authProfileError) {
                 utils.error(`AuthModule: Auth profile update failed:`, authProfileError);
                 throw new Error(`Auth profile update failed: ${authProfileError.message}`);
             }

             // 3. Store Age (and potentially other data) in Firestore (if available)
             if (age !== undefined && age !== null && state.firebaseFirestore) {
                  utils.log(`AuthModule: Storing age (${age}) in Firestore for ${user.uid}...`);
                  const userDocRef = state.firebaseFirestore.collection('users').doc(user.uid);
                  try {
                      await userDocRef.set({
                          email: user.email, // Useful for queries
                          name: name,       // Store name here too if desired
                          age: age,         // The age value
                          createdAt: firebase.firestore.FieldValue.serverTimestamp() // Record creation
                      }, { merge: true }); // Merge avoids overwriting existing doc fields accidentally
                      utils.log(`AuthModule: Age stored successfully in Firestore.`);
                  } catch(firestoreError) {
                      utils.error(`AuthModule: Firestore write failed:`, firestoreError);
                      throw new Error(`Failed to save age data: ${firestoreError.message}`);
                  }
             } else {
                  utils.log(`AuthModule: Age not provided or Firestore not available.`);
             }

             utils.log(`AuthModule: Profile and data update process completed for ${user.uid}.`);
             // Function completes successfully if no errors were thrown
         },



         handleEmailSignup: function(event) {
            event.preventDefault();
            const utils = AuraStreamApp.utils;
            const els = AuraStreamApp.elements;
            const auth = AuraStreamApp.state.firebaseAuth;
            const state = AuraStreamApp.state;
            utils.log("AuthModule: Handling Email Signup...");
            this.clearAuthError();

            // Get all values from the form
            const name = els.signupNameInput?.value?.trim();
            const ageInput = els.signupAgeInput?.value; // Get raw age input
            const email = els.signupEmailInput?.value?.trim();
            const password = els.signupPasswordInput?.value;
            const avatarFile = els.signupAvatarInput?.files[0]; // Get the File object

            // Basic Validation
            if (!auth) { this.showAuthError("Auth service not available."); return; }
            if (!state.firebaseFirestore) utils.warn("Firestore not available, age won't be saved.");
            if (!state.firebaseStorage && avatarFile) utils.warn("Storage not available, avatar won't be uploaded.");

            if (!name || !ageInput || !email || !password) {
                this.showAuthError("Please fill in Name, Age, Email, and Password.");
                return;
            }
            const age = parseInt(ageInput, 10); // Parse age to integer
            if (isNaN(age) || age < 1 || age > 120) {
                 this.showAuthError("Please enter a valid age (1-120).");
                 return;
            }
            if (!/\S+@\S+\.\S+/.test(email)) { this.showAuthError("Invalid email format."); return; }
            if (password.length < 6) { this.showAuthError("Password must be at least 6 characters."); return; }
            if (avatarFile && avatarFile.size > 5 * 1024 * 1024) { // 5MB limit example
                this.showAuthError("Profile picture file is too large (Max 5MB)."); return;
            }
            if (avatarFile && !['image/jpeg', 'image/png', 'image/gif'].includes(avatarFile.type)) {
                 this.showAuthError("Invalid image file type (use JPG, PNG, or GIF)."); return;
             }

            // Disable button, show processing message
            const signupButton = els.signupForm?.querySelector('button[type="submit"]');
            if(signupButton) signupButton.disabled = true;
            if(els.authErrorMessage) els.authErrorMessage.textContent = "Signing up...";
            els.authErrorMessage?.classList.remove('d-none');

            // 1. Create User Account
            auth.createUserWithEmailAndPassword(email, password)
                .then(async (userCredential) => { // Make callback async
                    const user = userCredential.user;
                    utils.log(`AuthModule: User account created: ${user.email}`);

                    // 2. Update Profile (name, avatar) & Store Data (age) using the helper
                    try {
                        utils.log(`AuthModule: Initiating profile/data storage for new user...`);
                        await this.updateProfileAndStoreData(user, name, age, avatarFile);
                        utils.log(`AuthModule: Profile updated and data stored successfully for ${user.email}.`);

                        // 3. Redirect on FULL success (User created AND profile updated)
                        // onAuthStateChanged will finalize UI & redirect from modal state
                         // Force trigger listener or wait? Rely on listener is safer.
                         utils.log(`AuthModule: Signup successful. Waiting for redirect via onAuthStateChanged.`);

                    } catch (profileError) {
                        // Profile update/storage failed AFTER user creation.
                        utils.error(`AuthModule: Profile update/storage failed post-signup for ${user.email}:`, profileError);
                        this.showAuthError(`Account created, but profile setup failed: ${profileError.message}. Redirecting...`);
                        // Log them in anyway, they can fix profile later. Redirect after delay.
                        setTimeout(() => {
                             AuraStreamApp.modules.modals?.closeAuthModal();
                             window.location.href = AuraStreamApp.config.AUTH_REDIRECT_URL;
                         }, 3500);
                    }

                })
                .catch((error) => { // User creation failed
                    utils.error("AuthModule: Email Signup FAILED (user creation):", error);
                    this.showAuthError(this.mapFirebaseError(error));
                    if(signupButton) signupButton.disabled = false; // Re-enable button
                });
        }, 

        handleGoogleAuth: function(isSignup = false) {
             const utils = AuraStreamApp.utils;
             const auth = AuraStreamApp.state.firebaseAuth;
             const action = isSignup ? "Signup" : "Login";
             utils.log(`AuthModule: Handling Google ${action}...`);
             this.clearAuthError();

             // Checks for auth, provider (as before)
             if (!auth || !firebase?.auth?.GoogleAuthProvider) {
                this.showAuthError("Google Auth setup error."); return;
             }

             const provider = new firebase.auth.GoogleAuthProvider();
             utils.log(`AuthModule: Initiating Google Sign-In with Popup...`);

             auth.signInWithPopup(provider)
                 .then(async (result) => { // Make success callback async
                     const user = result.user;
                     const isNewUser = result.additionalUserInfo?.isNewUser;
                     utils.log(`AuthModule: Google ${action} SUCCESS: ${user.email}. New User: ${isNewUser}`);

                      // --- Attempt to update profile if it's a new user OR crucial info is missing ---
                      // Use profile data directly from Google result
                      if (isNewUser || !user.displayName || !user.photoURL) {
                          utils.log(`AuthModule: New Google user or missing profile info detected. Updating profile...`);
                          try {
                              const googleName = result.additionalUserInfo?.profile?.name || user.displayName || user.email.split('@')[0]; // Best guess for name
                              const googlePhotoURL = result.additionalUserInfo?.profile?.picture || user.photoURL; // Best guess for photo

                              // Call helper WITHOUT age and WITHOUT a file upload
                              // It will use the user.updateProfile internally if googlePhotoURL exists
                               await this.updateProfileAndStoreData(
                                   user,
                                   googleName,
                                   undefined, // No Age from Google
                                   null,       // No File needed for upload
                                   googlePhotoURL // Pass the URL to potentially use
                                );
                                utils.log(`AuthModule: Google user profile updated attempt complete.`);
                               // Force reload user to get fresh data *now* instead of waiting for next state change? Optional.
                               await user.reload();
                               const refreshedUser = auth.currentUser; // Get latest
                               // Update local state immediately to reflect potential change
                               AuraStreamApp.state.currentUser = {
                                 uid: refreshedUser.uid, email: refreshedUser.email,
                                 displayName: refreshedUser.displayName, photoURL: refreshedUser.photoURL
                               };
                               // Immediately update header UI based on potentially new data
                               this.updateAuthUI();


                          } catch (profileError) {
                              utils.error(`AuthModule: Failed to update profile after Google signin:`, profileError);
                              // Non-critical - proceed with login even if profile update failed
                          }
                      } else {
                         utils.log(`AuthModule: Existing Google user with profile data found.`);
                         // Update local state just in case (redundant if relying purely on onAuthStateChanged)
                         AuraStreamApp.state.currentUser = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
                         this.updateAuthUI(); // Ensure header reflects this
                      }


                     // Redirect on success (onAuthStateChanged listener also handles this)
                     utils.log(`AuthModule: Google Signin successful. Waiting for redirect.`);
                     // Close modal immediately if open
                      AuraStreamApp.modules.modals?.closeAuthModal();


                 }).catch((error) => { // Google Signin failed
                      utils.error(`AuthModule: Google ${action} FAILED:`, error);
                      this.showAuthError(this.mapFirebaseError(error));
                 });
        },

        handleLogout: function() {
            const utils = AuraStreamApp.utils;
            const auth = AuraStreamApp.state.firebaseAuth;
            utils.log("Handling Logout...");

            if (!auth) { utils.error("Cannot logout: Auth service not available."); return; }

            auth.signOut()
                .then(() => {
                    utils.log("Firebase Logout SUCCESS.");
                    // onAuthStateChanged will handle state and UI updates.
                    // Redirect to home page if currently on msc.html
                     if (window.location.pathname.includes(AuraStreamApp.config.AUTH_REDIRECT_URL)) {
                        window.location.href = 'index.html'; // Or your main landing page file name
                    }
                })
                .catch((error) => {
                    utils.error("Firebase Logout FAILED:", error);
                    alert("Logout failed. Please try again."); // User feedback
                });
        },

        // setLoggedInState / setLoggedOutState are now effectively handled by the onAuthStateChanged listener

         updateAuthUI: function() {
            const utils = AuraStreamApp.utils;
            const els = AuraStreamApp.elements;
            const state = AuraStreamApp.state;
            // Run only if the essential elements were cached
            if (!els.loginSignupButton || !els.userInfoArea || !els.logoutButton || !els.userDisplayName || !els.userAvatar || !els.userAvatarImage || !els.userAvatarInitials) {
                // Log warning only once maybe? Or only in debug mode?
                // utils.warn("AuthModule: Cannot update header UI - elements missing.");
                return;
            }

            if (state.isLoggedIn && state.currentUser) {
                // --- Logged IN View ---
                els.loginSignupButton.classList.add('d-none');
                els.userInfoArea.classList.remove('d-none');

                // Set User Name
                // Use displayName if available, fallback to email
                const displayName = state.currentUser.displayName || state.currentUser.email;
                els.userDisplayName.textContent = utils.escapeHtml(displayName);
                els.userDisplayName.title = `Logged in as: ${utils.escapeHtml(state.currentUser.email)}`;

                // Set Avatar (Image or Initials)
                const photoURL = state.currentUser.photoURL;

                if (photoURL) {
                    // Display Profile Picture
                    els.userAvatarImage.src = photoURL;
                    els.userAvatarImage.alt = `${displayName}'s profile picture`;
                    els.userAvatarImage.classList.remove('d-none'); // Show the image
                    els.userAvatarInitials.classList.add('d-none');    // Hide initials
                    els.userAvatarInitials.textContent = '';         // Clear initials text
                    // utils.log(`AuthModule: Displaying avatar image for ${displayName}`);
                } else {
                    // Display Initials
                    const initials = utils.getInitials(state.currentUser.displayName, state.currentUser.email);
                    els.userAvatarInitials.textContent = initials;
                    els.userAvatarInitials.classList.remove('d-none'); // Show initials
                    els.userAvatarImage.classList.add('d-none');       // Hide image
                    els.userAvatarImage.src = '';                    // Clear image src
                    els.userAvatarImage.alt = '';
                    // utils.log(`AuthModule: Displaying initials '${initials}' for ${displayName}`);
                }

            } else {
                // --- Logged OUT View ---
                els.loginSignupButton.classList.remove('d-none');
                els.userInfoArea.classList.add('d-none');

                // Clear user-specific elements
                els.userDisplayName.textContent = '';
                els.userDisplayName.title = '';
                els.userAvatarInitials.textContent = '';
                els.userAvatarImage.src = '';
                els.userAvatarImage.alt = '';
                els.userAvatarInitials.classList.add('d-none');
                els.userAvatarImage.classList.add('d-none');
            }
        }, 

        showAuthError: function(message) {
            const els = AuraStreamApp.elements;
            if (els.authErrorMessage) {
                els.authErrorMessage.textContent = message;
                els.authErrorMessage.classList.remove('d-none');
            }
             AuraStreamApp.utils.error(`Auth Error Displayed: ${message}`);
        },

        clearAuthError: function() {
            const els = AuraStreamApp.elements;
            if (els.authErrorMessage) {
                els.authErrorMessage.textContent = '';
                els.authErrorMessage.classList.add('d-none');
            }
        },

        mapFirebaseError: function(error) {
            // Simple mapping for common errors
            switch (error.code) {
                case 'auth/invalid-email': return 'Invalid email format.';
                case 'auth/user-disabled': return 'This user account has been disabled.';
                case 'auth/user-not-found': return 'No user found with this email.';
                case 'auth/wrong-password': return 'Incorrect password.';
                case 'auth/email-already-in-use': return 'This email address is already registered.';
                case 'auth/weak-password': return 'Password is too weak (must be at least 6 characters).';
                case 'auth/operation-not-allowed': return 'Email/Password sign-in is not enabled.'; // Check Firebase console
                case 'auth/popup-closed-by-user': return 'Google Sign-In cancelled.';
                case 'auth/cancelled-popup-request': return 'Sign-in cancelled (multiple popups).';
                case 'auth/popup-blocked': return 'Popup blocked by browser. Please allow popups for this site.';
                default: return error.message || 'An unknown authentication error occurred.';
            }
        }
    } 


  } // End AuraStreamApp.modules
}; // End AuraStreamApp object


// --- Start the Main Application ---
AuraStreamApp.init();

document.addEventListener('DOMContentLoaded', () => {
const AUTH_STORAGE_KEY = 'auraUser'; // Must match the key from the landing page script
let currentUser = null;

try {
    const userData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (userData) {
        currentUser = JSON.parse(userData);
    }
} catch (e) {
    console.error("Error reading user data on msc.html:", e);
    localStorage.removeItem(AUTH_STORAGE_KEY); // Clear potentially bad data
}

const welcomeMessageElement = document.getElementById('welcome-message'); // Assuming you have an element with this ID
const logoutButtonMsc = document.getElementById('logout-button-msc'); // Assuming you have a logout button with this ID

if (currentUser && currentUser.email) {
    console.log(`User logged in on msc.html: ${currentUser.email}`);
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = `Welcome, ${currentUser.email}!`;
    }
    if (logoutButtonMsc) {
        logoutButtonMsc.style.display = 'inline-block'; // Show logout button
        logoutButtonMsc.addEventListener('click', () => {
            console.log("Logging out from msc.html...");
            localStorage.removeItem(AUTH_STORAGE_KEY);
            window.location.href = 'index.html'; // Redirect back to landing page
        });
    }
    // You can now use currentUser.email elsewhere on the page
} else {
    console.log("No user logged in on msc.html. Redirecting...");
    // Optional: Redirect back to login if no user found
    // alert("You need to be logged in to view this page.");
    // window.location.href = 'index.html'; // Or your landing page file name
     if (welcomeMessageElement) {
        welcomeMessageElement.textContent = `Welcome! (Not Logged In)`;
    }
     if (logoutButtonMsc) {
        logoutButtonMsc.style.display = 'none'; // Hide logout button
    }
}
});
