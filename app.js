/**
 * AuraStream Landing Page Script v10.0 (Advanced CSS Effects)
 * - REMOVED Three.js module for a lightweight, performant CSS background.
 * - ADDED Interactive cursor spotlight module.
 * - ADDED Interactive phone demo player module.
 * - ADDED Animated number counters for the analytics dashboard.
 * - All other features, including Firebase auth, modals, and API fetching, are fully retained.
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
        YOUTUBE_EMBED_URL: 'https://www.youtube.com/embed/',
        CONTENT_SHELVES: [
            { id: 'trending-movie', title: 'Trending Movies', endpoint: '/trending/movie/week', containerSelector: '#trending-movies-scroll', type: 'movie' },
            { id: 'popular-tv', title: 'Popular TV Shows', endpoint: '/tv/popular', containerSelector: '#popular-tv-scroll', type: 'tv' },
            { id: 'toprated-movie', title: 'Top Rated Movies', endpoint: '/movie/top_rated', containerSelector: '#toprated-movies-scroll', type: 'movie' },
        ],
        HERO_UPDATE_INTERVAL: 90000,
        AOS_CONFIG: { duration: 700, once: true, offset: 80, easing: 'ease-out-cubic' },
        SCROLL_DEBOUNCE: 150,
        RESIZE_DEBOUNCE: 250,
        LOADING_SCREEN_FADE_DURATION: 700,
        GALLERY_AUTO_ROTATE_DELAY: 12000,
        GALLERY_AUTO_ROTATE_INTERVAL: 6000,
        AUTH_REDIRECT_URL: 'app.html',
        DEBUG_MODE: true,
        firebaseConfig: {
            apiKey: "AIzaSyDp2V0ULE-32AcIJ92a_e3mhMe6f6yZ_H4",
            authDomain: "sm4movies.firebaseapp.com",
            projectId: "sm4movies",
            storageBucket: "sm4movies.appspot.com",
            messagingSenderId: "277353836953",
            appId: "1:277353836953:web:85e02783526c7cb58de308"
        }
    },

    // --- Application State ---
    state: {
        heroMovie: null,
        featuredTrailerMovieId: null,
        movieVideosCache: new Map(),
        shelfScrollData: new Map(),
        isMobileMenuOpen: false,
        librariesLoaded: { bootstrap: false, aos: false },
        galleryAutoRotateTimeout: null,
        galleryAutoRotateInterval: null,
        isGalleryDragging: false,
        domReady: false,
        initializationComplete: false,
        apiKeyValid: false,
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
        escapeHtml: (unsafe) => { if (unsafe === null || typeof unsafe === 'undefined') return ''; return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); },
        debounce: (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(this, args); }, delay); }; },
        fetchTMDB: async (endpoint, params = {}) => {
            const config = AuraStreamApp.config; const utils = AuraStreamApp.utils;
            if (!AuraStreamApp.state.apiKeyValid) { utils.error("API Key is invalid. Fetch aborted."); return null; }
            const defaultParams = { api_key: config.TMDB_API_KEY, language: 'en-US' };
            const urlParams = new URLSearchParams({ ...defaultParams, ...params });
            const url = `${config.TMDB_BASE_URL}${endpoint}?${urlParams.toString()}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    let errorData = { status_message: `HTTP error! Status: ${response.status}` }; try { errorData = await response.json(); } catch (e) {}
                    utils.error(`TMDB API Error ${response.status} for ${endpoint}:`, errorData); if (response.status === 401) { AuraStreamApp.state.apiKeyValid = false; AuraStreamApp.modules.loadingScreen.showError("Invalid API Key"); } return null;
                }
                return await response.json();
            } catch (error) { utils.error(`TMDB Fetch Network Error (${endpoint}):`, error); AuraStreamApp.modules.loadingScreen.showError("Network Error"); return null; }
        },
        getLoadingTextHTML: (text = "Loading...") => `<div class="loading-shelf-text w-100 d-flex align-items-center justify-content-center py-4" role="status"><div class="loading-spinner me-2"></div> ${AuraStreamApp.utils.escapeHtml(text)}</div>`,
        getErrorTextHTML: (text = "Could not load content.") => `<div class="error-shelf-text w-100 d-flex align-items-center justify-content-center py-4 text-danger" role="alert"><i class="bi bi-exclamation-triangle-fill me-2"></i> ${AuraStreamApp.utils.escapeHtml(text)}</div>`,
        getSkeletonCardHTML: () => `<div class="movie-card skeleton-placeholder" aria-hidden="true"><div class="card-image-wrapper skeleton-item"></div><div class="card-content"><div class="skeleton-item title mb-2"></div><div class="skeleton-item meta"></div></div><style>.skeleton-item{background:linear-gradient(110deg,rgba(var(--border-color),.4) 8%,rgba(var(--border-color),.6) 18%,rgba(var(--border-color),.4) 33%);background-size:200% 100%;border-radius:var(--radius-sm);animation:1.8s pulse-skeleton linear infinite;}.skeleton-placeholder .title{height:1rem;width:85%;}.skeleton-placeholder .meta{height:.7rem;width:55%;}@keyframes pulse-skeleton{0%{background-position:100% 0}100%{background-position:-100% 0}}</style></div>`,
        getSkeletonShelfHTML: (count = 6) => { let h = ''; for (let i = 0; i < count; i++) h += AuraStreamApp.utils.getSkeletonCardHTML(); return h; },
        formatDate: (d) => { if (!d) return 'N/A'; try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); } catch (e) { return 'Invalid Date'; } },
        getYear: (d) => { if (!d) return ''; try { return new Date(d).getFullYear(); } catch (e) { return ''; } },
        fetchMovieVideos: async function(movieId) { const utils=AuraStreamApp.utils;if(AuraStreamApp.state.movieVideosCache.has(movieId))return AuraStreamApp.state.movieVideosCache.get(movieId);if(!movieId)return[];const data=await utils.fetchTMDB(`/movie/${movieId}/videos`);if(!data){AuraStreamApp.state.movieVideosCache.set(movieId,[]);return[]}const videos=data?.results?.filter(v=>v.site==='YouTube')||[];AuraStreamApp.state.movieVideosCache.set(movieId,videos);return videos},
        getBestTrailer: (vids) => { if(!vids||vids.length===0)return null;const t=vids.find(v=>v.type==='Trailer'&&v.official);if(t)return t;const ot=vids.find(v=>v.type==='Teaser'&&v.official);if(ot)return ot;const at=vids.find(v=>v.type==='Trailer');if(at)return at;const ayt=vids.find(v=>v.type==='Teaser');if(ayt)return ayt;return vids[0]||null },
        setCopyrightYear: () => { try { const el = AuraStreamApp.elements.copyYear; if(el) el.textContent = new Date().getFullYear(); } catch(e) { AuraStreamApp.utils.error("Error setting copyright year:", e); } },
        getInitials: (name = '', email = '') => { if (name && name.trim().length > 0) { const parts = name.trim().split(' '); if (parts.length > 1) { return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase(); } else if (parts[0].length > 0) { return parts[0].substring(0, 2).toUpperCase(); } } if (email && email.includes('@')) { return email[0].toUpperCase(); } return '??'; },
    },

    // --- API Key Validation ---
    validateApiKey: function() {
        const key = this.config.TMDB_API_KEY;
        this.state.apiKeyValid = (key && key !== 'YOUR_TMDB_API_KEY_HERE' && key.length >= 32);
        if (!this.state.apiKeyValid) {
            this.utils.error(">>> ACTION REQUIRED: Set a valid TMDB API key in config. <<<");
        } else {
            this.utils.log("TMDB API Key structure appears OK.");
        }
    },

    // --- Display Data Loading Errors ---
    displayDataLoadingErrors: function(message = "Cannot load data: Check API Key or Network.") {
        const utils = this.utils;
        const errorHtml = utils.getErrorTextHTML(message);
        this.modules.hero.handleInitialLoadFailure(message);
        this.config.CONTENT_SHELVES.forEach(shelf => {
            const container = document.querySelector(shelf.containerSelector);
            if (container) container.innerHTML = errorHtml;
        });
        this.modules.trailerFeature.displayError(message);
        this.modules.analyticsDashboard.displayError(message);
    },

    // --- Initialization ---
    /*init: function() {
        document.addEventListener('DOMContentLoaded', () => {
            if (this.state.domReady) return;
            this.utils.log("DOM Loaded. Starting App Initialization.");
            this.state.domReady = true;
            try {
                if (!this.initDomElements()) throw new Error("Essential DOM elements missing.");
                this.validateApiKey();
                this.checkLibraries();
                if (!this.initializeFirebase()) {
                    this.utils.error("Firebase initialization failed, but attempting public data load.");
                }

                this.initSyncModules();
                this.initVisualLibraries();

                // Async data loading is now triggered by the Firebase onAuthStateChanged listener.
                this.utils.log(`AuraStream Initial Sync Setup Complete. API Key Valid: ${this.state.apiKeyValid}`);

            } catch (error) {
                this.utils.error("CRITICAL ERROR during Initialization:", error);
                document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Init Error</h1><p>Check console (F12).</p><pre>${error.message}</pre></div>`;
            }
        });
    },*/

     init: function() {
        document.addEventListener('DOMContentLoaded', () => {
            if (this.state.domReady) return;
            this.utils.log("DOM Loaded. Starting App Initialization.");
            try {
                if (!this.initDomElements()) throw new Error("Essential DOM elements missing.");
                this.validateApiKey();
                this.checkLibraries();
                if (!this.initializeFirebase()) {
                    this.utils.error("Firebase initialization failed, but attempting public data load.");
                }

                this.initSyncModules();
                this.initVisualLibraries();

                // Async data loading is now triggered by the Firebase onAuthStateChanged listener.
                this.utils.log(`AuraStream Initial Sync Setup Complete. API Key Valid: ${this.state.apiKeyValid}`);

            } catch (error) {
                this.utils.error("CRITICAL ERROR during Initialization:", error);
                document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Init Error</h1><p>Check console (F12).</p><pre>${error.message}</pre></div>`;
            }
        });
    },

    initializeFirebase: function() {
        const { firebaseConfig } = this.config;
        const { state, utils, modules } = this;

        if (!firebaseConfig?.apiKey || !firebaseConfig?.authDomain || !firebaseConfig?.projectId) {
            utils.error("Firebase configuration missing or incomplete.");
            return false;
        }
        if (typeof firebase === 'undefined' || !firebase.app || !firebase.auth) {
            utils.error("Required Firebase SDKs not loaded.");
            return false;
        }

        try {
            if (!state.firebaseApp) {
                state.firebaseApp = firebase.initializeApp(firebaseConfig);
                state.firebaseAuth = firebase.auth();
                state.firebaseStorage = firebase.storage ? firebase.storage() : null;
                state.firebaseFirestore = firebase.firestore ? firebase.firestore() : null;
            }

            if (!state.authListenerUnsubscribe && state.firebaseAuth) {
                state.authListenerUnsubscribe = state.firebaseAuth.onAuthStateChanged(user => {
                    const isInitialAuthCheck = !state.initializationComplete;
                    utils.log(`Firebase onAuthStateChanged: User is ${user ? 'LOGGED IN' : 'LOGGED OUT'}. Initial Check: ${isInitialAuthCheck}`);

                    state.isLoggedIn = !!user;
                    state.currentUser = user ? { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL } : null;
                    
                    modules.auth.updateAuthUI();

                    if (isInitialAuthCheck) {
                        modules.loadingScreen.hide(); // Hide loading screen once auth is resolved
                        if (state.apiKeyValid) {
                            this.runAsyncInits();
                        } else {
                            this.displayDataLoadingErrors();
                        }
                        state.initializationComplete = true;
                    }
                });
            }
            return true;
        } catch (error) {
            utils.error("CRITICAL Firebase initialization failed:", error);
            return false;
        }
    },

    checkLibraries: function() {
        this.state.librariesLoaded.bootstrap = typeof bootstrap !== 'undefined';
        this.state.librariesLoaded.aos = typeof AOS !== 'undefined';
        this.utils.log("Libraries Checked:", this.state.librariesLoaded);
    },

    initDomElements: function() {
        this.utils.log("Caching DOM Elements...");
        this.elements = {
            loadingScreen: document.querySelector('.loading-screen'),
            spotlight: document.querySelector('.spotlight'),
            navbar: document.querySelector('.landing-navbar'),
            backToTopBtn: document.getElementById('back-to-top'),
            mobileMenuToggle: document.getElementById('mobile-menu-toggler'),
            mobileMenuClose: document.getElementById('mobile-menu-close'),
            mobileMenu: document.getElementById('mobile-menu'),
            offcanvasOverlay: document.getElementById('offcanvas-overlay'),
            heroSection: document.getElementById('hero'),
            heroBgImage: document.getElementById('hero-bg-image'),
            heroTitle: document.getElementById('hero-title'),
            heroOverview: document.getElementById('hero-overview'),
            heroInfoContainer: document.getElementById('hero-info-container'),
            heroWatchTrailerBtn: document.getElementById('hero-watch-trailer-btn'),
            heroMoreInfoBtn: document.getElementById('hero-more-info-btn'),
            expandingGallery: document.getElementById('expanding-gallery'),
            discoverTabs: document.querySelectorAll('.discover-tab'),
            discoverContentPanels: document.querySelectorAll('.discover-content'),
            panelTrending: document.getElementById('panel-trending'),
            panelUpcoming: document.getElementById('panel-upcoming'),
            gemFinderStrip: document.getElementById('gem-finder-strip'),
            gemFinderButton: document.getElementById('gem-finder-button'),
            gemFinderResult: document.getElementById('gem-finder-result'),
            phoneDemoPlayer: document.getElementById('interactive-demo'),
            youtubePlayer: document.getElementById('youtubePlayer'),
            aiCanvas: document.getElementById('ai-canvas'),
            aiHubContainer: document.getElementById('ai-hub-container'),
            universeExplorerSection: document.getElementById('universe-explorer'),
            universeBgImage: document.getElementById('universe-bg-image'),
            universeTitle: document.getElementById('universe-title'),
            universeOverview: document.getElementById('universe-overview'),
            universeTimelineContainer: document.getElementById('universe-timeline-container'),
            creatorsGrid: document.querySelector('.creators-grid'),
            playButtonOverlay: document.getElementById('play-button-demo'),
            trailerFeatureSection: document.getElementById('trailer-feature'),
            trailerFeatureTitle: document.getElementById('trailer-feature-title'),
            trailerFeatureDesc: document.getElementById('trailer-feature-desc'),
            trailerFeatureThumbnail: document.getElementById('trailer-feature-thumbnail'),
            trailerFeaturePlayBtn: document.getElementById('trailer-feature-play-btn'),
            trailerFeatureMoreInfoBtn: document.getElementById('trailer-feature-more-info'),
            galleryStage: document.getElementById('galleryStage'),
            galleryCards: document.querySelectorAll('#gallery-section .gallery-card'),
            galleryDotsContainer: document.getElementById('galleryDots'),
            galleryDots: document.querySelectorAll('#gallery-section .dot'),
            galleryPrevBtn: document.getElementById('prevBtn'),
            galleryNextBtn: document.getElementById('nextBtn'),
            galleryFullscreenModal: document.getElementById('fullscreenModal'),
            galleryModalImageFs: document.getElementById('modalImageFs'),
            galleryModalCaptionFs: document.getElementById('modalCaptionFs'),
            galleryModalCloseFs: document.getElementById('modalClose'),
            kpiCounters: document.querySelectorAll('.kpi-value[data-target]'),
            gaugeFillElement: document.getElementById('gauge-fill-element'),
            gaugeValueElement: document.getElementById('gauge-value-element'),
            networkBarChart: document.getElementById('network-bar-chart'),
            topActorsList: document.getElementById('top-actors-list'),
            copyYear: document.getElementById('copy-year'),
            launchAppModal: document.getElementById('launchAppModal'),
            trailerModal: document.getElementById('trailer-modal'),
            trailerIframe: document.getElementById('trailer-iframe'),
            loginForm: document.getElementById('login-form'),
            signupForm: document.getElementById('signup-form'),
            googleLoginButton: document.getElementById('google-login-button'),
            googleSignupButton: document.getElementById('google-signup-button'),
            authErrorMessage: document.getElementById('auth-error-message'),
            loginSignupButton: document.getElementById('login-signup-button'),
            userInfoArea: document.getElementById('user-info-area'),
            userAvatar: document.getElementById('user-avatar'),
            userAvatarInitials: document.getElementById('user-avatar-initials'),
            userAvatarImage: document.getElementById('user-avatar-image'),
            userDisplayName: document.getElementById('user-display-name'),
            logoutButton: document.getElementById('logout-button'),
            signupNameInput: document.getElementById('signup-name'),
            genreSpotlightSection: document.getElementById('genre-spotlight'),
            genreFilterButtons: document.querySelectorAll('.genre-filters .btn'),
            spotlightGridContainer: document.getElementById('spotlight-grid-container'),

            signupAgeInput: document.getElementById('signup-age'),
            signupAvatarInput: document.getElementById('signup-avatar'),
            loginEmailInput: document.getElementById('login-email'),
            loginPasswordInput: document.getElementById('login-password'),
            signupEmailInput: document.getElementById('signup-email'),
            signupPasswordInput: document.getElementById('signup-password'),
        };
        const essentialKeys = ['navbar', 'heroSection', 'launchAppModal', 'loginForm', 'signupForm'];
        const missing = essentialKeys.filter(key => !this.elements[key]);
        if (missing.length > 0) {
            this.utils.error(`Critical DOM elements missing: ${missing.join(', ')}.`);
            return false;
        }
        return true;
    },

    initSyncModules: function() {
        Object.values(this.modules).forEach(module => {
            if (module.init) {
                try {
                    this.utils.log(`Initializing sync module: ${module.name || 'Anonymous Module'}`);
                    module.init();
                } catch (e) {
                    this.utils.error(`Error initializing sync module ${module.name || ''}:`, e);
                }
            }
        });
        this.utils.setCopyrightYear();
    },

    initVisualLibraries: function() {
        if (this.state.librariesLoaded.aos) {
            try {
                this.utils.log("Init AOS...");
                AOS.init(this.config.AOS_CONFIG);
            } catch (e) {
                this.utils.error("AOS Init failed:", e);
            }
        }
    },

runAsyncInits: async function() {
    this.utils.log("Starting Async Initializations...");
    const promises = [
        this.modules.hero.loadBackgroundAndContent(true),
        this.modules.shelves.loadAllShelves(),
        this.modules.analyticsDashboard.loadAnalyticsData(),
        this.modules.universeExplorer.loadContent(),
        this.modules.creatorsCorner.loadContent() // ===== ADD THIS LINE =====
    ];
    await Promise.allSettled(promises);
    this.modules.hero.startBackgroundUpdates();
    this.utils.log("Async Inits settled.");
},

    // --- Modules ---
    modules: {
        loadingScreen: {
            name: 'LoadingScreen',
            hide: function() {
                const el = AuraStreamApp.elements.loadingScreen;
                if (el) {
                    el.classList.add('hidden');
                }
            },
            showError: function(message) {
                const el = AuraStreamApp.elements.loadingScreen;
                if (el) {
                    el.innerHTML = `<div class="loading-text" style="color: var(--tertiary-accent);">${AuraStreamApp.utils.escapeHtml(message)}</div>`;
                }
            }
        },

        backToTop: {
    name: 'BackToTop',
    init: function() {
        const btn = AuraStreamApp.elements.backToTopBtn;
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        const scrollHandler = () => {
            if (window.scrollY > 300) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        };

        window.addEventListener('scroll', AuraStreamApp.utils.debounce(scrollHandler, 100), { passive: true });
    }
},

discoverPanel: {
    name: 'DiscoverPanel',
    state: {
        isSpinning: false,
        gemFinderMovies: []
    },

    init: function() {
        const { discoverTabs } = AuraStreamApp.elements;
        if (!discoverTabs || discoverTabs.length === 0) return;

        discoverTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleTabClick(e));
        });

        AuraStreamApp.elements.gemFinderButton?.addEventListener('click', () => this.spinGemFinder());

        // Initial load for the active tab
        this.loadTrending();
    },

    handleTabClick: function(e) {
        const { discoverTabs, discoverContentPanels } = AuraStreamApp.elements;
        const targetTab = e.currentTarget.dataset.tab;

        discoverTabs.forEach(t => t.classList.remove('active'));
        discoverContentPanels.forEach(p => p.classList.remove('active'));

        e.currentTarget.classList.add('active');
        const targetPanel = document.getElementById(`panel-${targetTab}`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        // Load content only if it hasn't been loaded yet
        if (targetTab === 'upcoming' && !targetPanel.dataset.loaded) {
            this.loadUpcoming();
        } else if (targetTab === 'gem-finder' && !targetPanel.dataset.loaded) {
            this.loadGemFinder();
        }
    },

    loadTrending: async function() {
        const { utils, elements } = AuraStreamApp;
        const container = elements.panelTrending;
        try {
            const data = await utils.fetchTMDB('/trending/movie/week');
            if (data?.results) {
                container.innerHTML = this.renderTrendingList(data.results.slice(0, 10));
                this.attachModalListeners(container);
                container.dataset.loaded = 'true';
            } else { throw new Error('No trending data'); }
        } catch (error) {
            container.innerHTML = utils.getErrorTextHTML('Could not load trending list.');
        }
    },

    renderTrendingList: function(movies) {
        const { utils } = AuraStreamApp;
        return `<ul class="trending-list">${movies.map((movie, index) => `
            <li class="trending-item detail-modal-trigger" data-item-id="${movie.id}" data-item-type="movie">
                <span class="trending-rank">${index + 1}</span>
                <img class="trending-poster" src="${AuraStreamApp.config.IMAGE_BASE_URL}w92${movie.poster_path}" alt="${utils.escapeHtml(movie.title)}">
                <div class="trending-info">
                    <h5>${utils.escapeHtml(movie.title)}</h5>
                    <p>${utils.getYear(movie.release_date)}</p>
                </div>
                <div class="trending-rating">
                    <i class="bi bi-star-fill"></i> ${movie.vote_average.toFixed(1)}
                </div>
            </li>
        `).join('')}</ul>`;
    },

    loadUpcoming: async function() {
        const { utils, elements } = AuraStreamApp;
        const container = elements.panelUpcoming;
        try {
            const data = await utils.fetchTMDB('/movie/upcoming');
            if (data?.results) {
                container.innerHTML = this.renderUpcomingGrid(data.results);
                this.attachModalListeners(container);
                container.dataset.loaded = 'true';
            } else { throw new Error('No upcoming data'); }
        } catch (error) {
            container.innerHTML = utils.getErrorTextHTML('Could not load upcoming movies.');
        }
    },

    renderUpcomingGrid: function(movies) {
        const { utils } = AuraStreamApp;
        return `<div class="upcoming-grid">${movies.map(movie => `
            <div class="upcoming-item detail-modal-trigger" data-item-id="${movie.id}" data-item-type="movie">
                <img src="${AuraStreamApp.config.IMAGE_BASE_URL}w342${movie.poster_path}" alt="${utils.escapeHtml(movie.title)}">
                <div class="upcoming-overlay">
                    <h6>${utils.escapeHtml(movie.title)}</h6>
                    <span>${utils.formatDate(movie.release_date)}</span>
                </div>
            </div>
        `).join('')}</div>`;
    },

    loadGemFinder: async function() {
        const { utils, elements } = AuraStreamApp;
        try {
            // Fetch several pages of highly-rated but not blockbuster movies
            const promises = [1, 2, 3].map(page => 
                utils.fetchTMDB('/discover/movie', {
                    'vote_average.gte': 7.5,
                    'vote_count.gte': 500,
                    'vote_count.lte': 5000,
                    sort_by: 'popularity.desc',
                    page: page
                })
            );
            const results = await Promise.all(promises);
            this.state.gemFinderMovies = results.flatMap(res => res.results).filter(m => m.poster_path);
            this.renderGemFinderStrip();
            elements.panelGemFinder.dataset.loaded = 'true';
        } catch (error) {
            elements.gemFinderStrip.innerHTML = `<p class="text-danger">Could not load gems.</p>`;
        }
    },
    
    renderGemFinderStrip: function() {
        const { gemFinderStrip } = AuraStreamApp.elements;
        if (this.state.gemFinderMovies.length < 20) return;
        // Shuffle and create a long strip for spinning
        const shuffled = [...this.state.gemFinderMovies].sort(() => 0.5 - Math.random());
        this.state.gemFinderMovies = shuffled; // Keep the shuffled order
        gemFinderStrip.innerHTML = shuffled.map(movie => 
            `<img src="${AuraStreamApp.config.IMAGE_BASE_URL}w342${movie.poster_path}" alt="">`
        ).join('');
    },

    spinGemFinder: function() {
        if (this.state.isSpinning) return;
        this.state.isSpinning = true;

        const { gemFinderStrip, gemFinderButton, gemFinderResult } = AuraStreamApp.elements;
        gemFinderResult.classList.add('d-none'); // Hide previous result
        gemFinderButton.disabled = true;
        gemFinderButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Spinning...`;

        // Pick a random movie (not the first few)
        const randomIndex = Math.floor(Math.random() * (this.state.gemFinderMovies.length - 10)) + 10;
        const targetMovie = this.state.gemFinderMovies[randomIndex];
        const targetPosition = randomIndex * 300; // 300px is the height of each poster

        // Add extra spins for effect
        const extraSpins = 300 * 20; // 20 full spins
        gemFinderStrip.style.transition = 'transform 5s cubic-bezier(0.25, 1, 0.5, 1)';
        gemFinderStrip.style.transform = `translateY(-${targetPosition + extraSpins}px)`;

        setTimeout(() => {
            this.state.isSpinning = false;
            gemFinderButton.disabled = false;
            gemFinderButton.innerHTML = `<i class="bi bi-shuffle"></i> Spin Again`;
            this.showGemFinderResult(targetMovie);
        }, 5000);
    },
    
    showGemFinderResult: function(movie) {
        const { gemFinderResult } = AuraStreamApp.elements;
        gemFinderResult.classList.remove('d-none');
        gemFinderResult.innerHTML = `
            <h5>${AuraStreamApp.utils.escapeHtml(movie.title)}</h5>
            <p>A hidden gem for you to discover!</p>
            <button class="btn btn-secondary-outline btn-sm detail-modal-trigger" data-item-id="${movie.id}" data-item-type="movie">
                View Details
            </button>
        `;
        this.attachModalListeners(gemFinderResult);
    },
    
    attachModalListeners: function(container) {
        container.querySelectorAll('.detail-modal-trigger').forEach(trigger => {
            trigger.addEventListener('click', e => {
                const itemId = e.currentTarget.dataset.itemId;
                const itemType = e.currentTarget.dataset.itemType;
                AuraStreamApp.modules.modals.openDetailModal(itemId, itemType);
            });
        });
    }
},

aiEngine: {
    name: 'AIEngine',
    state: {
        // Store user choices
        keywords: [],
        // Canvas state
        ctx: null,
        particles: [],
        mouse: { x: null, y: null, radius: 100 },
        animationFrame: null,
    },

    init: function() {
        const canvas = AuraStreamApp.elements.aiCanvas;
        if (canvas) {
            this.state.ctx = canvas.getContext('2d');
            this._setupCanvas();
            window.addEventListener('resize', AuraStreamApp.utils.debounce(() => this._setupCanvas(), 250));
        } else {
            AuraStreamApp.utils.warn("AI Canvas not found, background animation disabled.");
        }
        this._attachStepListeners();
    },

    // --- Canvas Neural Network Animation ---
    _setupCanvas: function() {
        const canvas = AuraStreamApp.elements.aiCanvas;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        this.state.ctx.scale(dpr, dpr);

        this.state.particles = [];
        let numberOfParticles = (canvas.width * canvas.height) / 9000;
        if (numberOfParticles > 150) numberOfParticles = 150; // Cap particles

        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 1.5 + 0.5;
            let x = Math.random() * (canvas.offsetWidth - size * 2) + size;
            let y = Math.random() * (canvas.offsetHeight - size * 2) + size;
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            this.state.particles.push({ x, y, directionX, directionY, size });
        }

        if (this.state.animationFrame) cancelAnimationFrame(this.state.animationFrame);
        this._animateCanvas();
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.state.mouse.x = e.clientX - rect.left;
            this.state.mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mouseleave', () => {
            this.state.mouse.x = null;
            this.state.mouse.y = null;
        });
    },

    _animateCanvas: function() {
        const { ctx, particles, mouse } = this.state;
        const canvas = AuraStreamApp.elements.aiCanvas;
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        particles.forEach(p => {
            // Movement
            if (p.x + p.size > canvas.offsetWidth || p.x - p.size < 0) p.directionX = -p.directionX;
            if (p.y + p.size > canvas.offsetHeight || p.y - p.size < 0) p.directionY = -p.directionY;
            p.x += p.directionX;
            p.y += p.directionY;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
            ctx.fill();
        });

        // Draw connections
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = Math.sqrt(Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2));
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(168, 85, 247, ${1 - (distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[b].x);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
        
        this.state.animationFrame = requestAnimationFrame(() => this._animateCanvas());
    },

    // --- Interactive Step Logic ---
    _attachStepListeners: function() {
        const { aiHubContainer } = AuraStreamApp.elements;
        if (!aiHubContainer) return;

        aiHubContainer.addEventListener('click', (e) => {
            const optionCard = e.target.closest('.ai-option-card');
            if (optionCard) {
                const nextStep = optionCard.dataset.nextStep;
                const keyword = optionCard.dataset.keyword;
                this.state.keywords.push(keyword);
                this.goToStep(nextStep);
            }
        });
    },

    goToStep: function(stepNumber) {
        const { aiHubContainer } = AuraStreamApp.elements;
        aiHubContainer.querySelectorAll('.ai-step').forEach(step => step.classList.remove('active'));
        const nextStepEl = aiHubContainer.querySelector(`.ai-step[data-step="${stepNumber}"]`);
        if(nextStepEl) nextStepEl.classList.add('active');

        if (stepNumber === "3") { // Analysis step
            this._runAnalysis();
        }
    },

    _runAnalysis: async function() {
        const { utils } = AuraStreamApp;

        // Display selected keywords
        const keyword1El = document.getElementById('keyword1');
        const keyword2El = document.getElementById('keyword2');
        if(keyword1El) keyword1El.textContent = this.state.keywords[0] || '';
        if(keyword2El) keyword2El.textContent = this.state.keywords[1] || '';

        // Map user keywords to TMDb genre IDs
        const genreMap = {
            adventure: '12', comedy: '35', thriller: '53', drama: '18',
            space: '878', magic: '14', crime: '80', future: '878' // Using Sci-Fi for space and future
        };

        const genreIds = this.state.keywords.map(kw => genreMap[kw]).join(',');

        // Wait for the analysis animation (2s) then fetch movie
        setTimeout(async () => {
            try {
                const data = await utils.fetchTMDB('/discover/movie', {
                    with_genres: genreIds,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 500,
                    page: 1
                });
                
                if (data?.results?.length > 0) {
                    const movie = data.results[Math.floor(Math.random() * Math.min(data.results.length, 10))];
                    this._renderRecommendation(movie);
                    this.goToStep("4");
                } else {
                    throw new Error("No movies found for these criteria.");
                }
            } catch(err) {
                this._renderError();
                this.goToStep("4");
            }
        }, 2200);
    },

    _renderRecommendation: function(movie) {
        const { utils, config, modules } = AuraStreamApp;
        const container = document.querySelector('.ai-recommendation-wrapper');
        if (!container) return;

        const title = utils.escapeHtml(movie.title);
        const overview = utils.escapeHtml(movie.overview.substring(0, 150) + '...');
        const posterUrl = `${config.IMAGE_BASE_URL}${config.POSTER_SIZE}${movie.poster_path}`;

        container.innerHTML = `
            <div class="rec-card">
                <img src="${posterUrl}" alt="${title} Poster">
                <div class="rec-card-overlay"></div>
            </div>
            <div class="rec-info">
                <h3>${title}</h3>
                <p>${overview}</p>
                <button class="btn btn-primary-gradient btn-lg detail-modal-trigger" data-item-id="${movie.id}" data-item-type="movie">
                    <i class="bi bi-info-circle"></i> View Details
                </button>
            </div>
        `;
        // Re-attach listener for the new button
        container.querySelector('.detail-modal-trigger').addEventListener('click', (e) => {
            modules.modals.openDetailModal(e.currentTarget.dataset.itemId, e.currentTarget.dataset.itemType);
        });
    },

    _renderError: function() {
         const container = document.querySelector('.ai-recommendation-wrapper');
         if (!container) return;
         container.innerHTML = `<div class="rec-info"><h3 class="text-danger">Analysis Failed</h3><p>AuraLens couldn't find a perfect match. Please try a different combination.</p></div>`;
    }
},

// Inside AuraStreamApp.modules = { ... }
genreSpotlight: {
    name: 'GenreSpotlight',
    init: function() {
        const { genreFilterButtons } = AuraStreamApp.elements;
        if (!genreFilterButtons || genreFilterButtons.length === 0) {
            AuraStreamApp.utils.warn("Genre filter buttons not found. Spotlight disabled.");
            return;
        }

        genreFilterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const genreId = e.currentTarget.dataset.genreId;
                this.loadGenre(genreId, e.currentTarget);
            });
        });

        // Load the initial active genre on page load
        const initialActiveButton = document.querySelector('.genre-filters .btn.active');
        if (initialActiveButton) {
            this.loadGenre(initialActiveButton.dataset.genreId, initialActiveButton);
        }
    },

    loadGenre: async function(genreId, activeBtnEl) {
        const { utils, elements } = AuraStreamApp;
        if (!genreId) return;

        utils.log(`Loading genre spotlight for ID: ${genreId}`);

        // Update active button state
        elements.genreFilterButtons.forEach(btn => btn.classList.remove('active', 'btn-primary-gradient'));
        activeBtnEl.classList.add('active', 'btn-primary-gradient');

        const grid = elements.spotlightGridContainer;
        grid.classList.add('loading');
        grid.innerHTML = `<div class="loading-placeholder"><div class="loading-spinner"></div><span>Loading ${utils.escapeHtml(activeBtnEl.textContent)}...</span></div>`;

        try {
            const data = await utils.fetchTMDB('/discover/movie', {
                with_genres: genreId,
                sort_by: 'popularity.desc',
                'vote_count.gte': 200, // Ensure movies are somewhat known
                page: 1
            });

            if (data?.results) {
                this.renderGrid(data.results.slice(0, 14)); // Show a good number of movies
            } else {
                throw new Error("No results found.");
            }

        } catch (error) {
            utils.error("Failed to load genre spotlight:", error);
            grid.innerHTML = utils.getErrorTextHTML("Could not load movies for this genre.");
        } finally {
            grid.classList.remove('loading');
        }
    },

     renderGrid: function(movies) {
            const { utils, config, elements, modules } = AuraStreamApp;
            const grid = elements.spotlightGridContainer;
            grid.innerHTML = ''; // Clear previous content

            const fragment = document.createDocumentFragment();

            movies.forEach((movie, index) => {
                if (!movie.poster_path) return; // Skip movies without a poster

                const title = utils.escapeHtml(movie.title || 'Untitled');
                const year = utils.getYear(movie.release_date);
                const posterUrl = `${config.IMAGE_BASE_URL}${config.POSTER_SIZE}${movie.poster_path}`;

                const item = document.createElement('a');
                item.href = '#';
                item.className = 'spotlight-item detail-modal-trigger';
                item.dataset.itemId = movie.id;
                item.dataset.itemType = 'movie';
                item.style.animationDelay = `${index * 50}ms`; // Staggered animation
                
                item.innerHTML = `
                    <img src="${posterUrl}" alt="${title} Poster" loading="lazy">
                    <div class="spotlight-overlay">
                        <h4 class="spotlight-title">${title}</h4>
                        <p class="spotlight-year">${year || ''}</p>
                    </div>
                `;

                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Re-use the existing modal functionality
                    modules.modals.openDetailModal(movie.id, 'movie');
                });
                
                fragment.appendChild(item);
            });

            grid.appendChild(fragment);

            // Call the tilt effect function on the newly created items
            this._attachTiltEffect(grid.querySelectorAll('.spotlight-item'));
        },
    // ===== NEW: ADD THIS ENTIRE FUNCTION TO THE MODULE =====
       _attachTiltEffect: function(items) {
                items.forEach(item => {
                    item.addEventListener('mousemove', (e) => {
                        const rect = item.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = (y - centerY) / centerY * -8; // Max rotation 8 degrees
                        const rotateY = (x - centerX) / centerX * 8;  // Max rotation 8 degrees
                        
                        // Tilt the entire item
                        item.style.transform = `perspective(1000px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                        // Set CSS Custom Properties for the glare effect
                        item.style.setProperty('--glare-x', `${x}px`);
                        item.style.setProperty('--glare-y', `${y}px`);
                        item.classList.add('is-hovered');
                    });

                    item.addEventListener('mouseleave', () => {
                        // Reset transformations smoothly
                        item.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
                        item.classList.remove('is-hovered');
                    });
                });
            }
        },
        cursorSpotlight: {
            name: 'CursorSpotlight',
            init: function() {
                const spotlightEl = AuraStreamApp.elements.spotlight;
                if (!spotlightEl) return;
                
                const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
                const rendered = { x: mouse.x, y: mouse.y };
                
                window.addEventListener('mousemove', e => {
                    mouse.x = e.clientX;
                    mouse.y = e.clientY;
                }, { passive: true });
                
                const updateSpotlight = () => {
                    rendered.x += (mouse.x - rendered.x) * 0.08;
                    rendered.y += (mouse.y - rendered.y) * 0.08;
                    spotlightEl.style.transform = `translate(calc(${rendered.x}px - 50%), calc(${rendered.y}px - 50%))`;
                    requestAnimationFrame(updateSpotlight);
                };
                updateSpotlight();
            }
        },
        
        phoneDemo: {
            name: 'PhoneDemo',
            init: function() {
                const { youtubePlayer, playButtonOverlay } = AuraStreamApp.elements;
                if (playButtonOverlay && youtubePlayer) {
                    playButtonOverlay.addEventListener('click', () => {
                        if (!youtubePlayer.src.includes('autoplay')) {
                            youtubePlayer.src += "?autoplay=1&mute=1&rel=0";
                        }
                        playButtonOverlay.classList.add('hidden');
                    });
                }
            }
        },

        navbar: {
            name: 'Navbar',
            init: function() {
                const { navbar, mobileMenuToggle, mobileMenuClose, mobileMenu, offcanvasOverlay } = AuraStreamApp.elements;
                if (!navbar) return;
                window.addEventListener('scroll', AuraStreamApp.utils.debounce(() => this.handleScroll(), 50), { passive: true });
                this.handleScroll();
                mobileMenuToggle?.addEventListener('click', () => this.openMobileMenu());
                mobileMenuClose?.addEventListener('click', () => this.closeMobileMenu());
                offcanvasOverlay?.addEventListener('click', () => this.closeMobileMenu());
                mobileMenu?.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => this.closeMobileMenu()));
            },
            handleScroll: function() {
                const navbar = AuraStreamApp.elements.navbar;
                if (navbar) window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
            },
            openMobileMenu: function() { AuraStreamApp.elements.mobileMenu?.classList.add('active'); AuraStreamApp.elements.offcanvasOverlay?.classList.add('active'); document.body.classList.add('offcanvas-open'); },
            closeMobileMenu: function() { AuraStreamApp.elements.mobileMenu?.classList.remove('active'); AuraStreamApp.elements.offcanvasOverlay?.classList.remove('active'); document.body.classList.remove('offcanvas-open'); }
        },

        hero: {
            name: 'Hero',
            updateIntervalId: null,
            init: function() { this.setupButtonListeners(); },
            loadBackgroundAndContent: async function(isInitial = false) {
                const { utils, state, modules } = AuraStreamApp;
                if (document.hidden && !isInitial) return;
                const data = await utils.fetchTMDB('/movie/popular', { page: 1 });
                const suitableMovies = data?.results?.filter(m => m.backdrop_path && m.overview);
                if (suitableMovies?.length > 0) {
                    const movie = suitableMovies[Math.floor(Math.random() * suitableMovies.length)];
                    state.heroMovie = movie;
                    this.updateHeroBackground(movie.backdrop_path, isInitial);
                    const [details, videos] = await Promise.all([ utils.fetchTMDB(`/movie/${movie.id}`), utils.fetchMovieVideos(movie.id) ]);
                    this.updateHeroContent(details || movie, videos || []);
                    if (state.featuredTrailerMovieId !== movie.id) modules.trailerFeature.loadContent(movie);
                } else if (isInitial) {
                    this.handleInitialLoadFailure();
                }
            },
            updateHeroBackground: function(path, isInitial) {
                const { heroBgImage, heroSection } = AuraStreamApp.elements;
                if (!heroBgImage || !path) return;
                const url = `${AuraStreamApp.config.IMAGE_BASE_URL}${AuraStreamApp.config.HERO_BACKDROP_SIZE}${path}`;
                const img = new Image();
                img.onload = () => {
                    heroBgImage.style.opacity = 0;
                    setTimeout(() => {
                        heroBgImage.style.backgroundImage = `url('${url}')`;
                        heroBgImage.style.opacity = 0.4;
                        if(isInitial) heroSection?.classList.add('loaded');
                    }, 350);
                };
                img.src = url;
            },
            updateHeroContent: function(movie, videos = []) {
                const { heroTitle, heroOverview, heroInfoContainer, heroWatchTrailerBtn, heroMoreInfoBtn } = AuraStreamApp.elements;
                const { utils } = AuraStreamApp;
                heroTitle.textContent = utils.escapeHtml(movie.title || 'Featured Content');
                heroOverview.textContent = utils.escapeHtml(movie.overview || 'No description.');
                heroInfoContainer.innerHTML = `<div class="hero-info-item"><i class="bi bi-calendar3"></i><span>${utils.formatDate(movie.release_date)}</span></div><div class="hero-info-item"><i class="bi bi-star-fill"></i><span>${movie.vote_average?.toFixed(1) || 'N/A'}/10</span></div><div class="hero-info-item"><i class="bi bi-film"></i><span>${movie.genres?.map(g => g.name).join(', ') || 'N/A'}</span></div>`;
                const bestTrailer = utils.getBestTrailer(videos);
                heroWatchTrailerBtn.disabled = !bestTrailer;
                heroWatchTrailerBtn.dataset.movieId = movie.id;
                heroMoreInfoBtn.disabled = false;
                heroMoreInfoBtn.dataset.movieId = movie.id;
            },
            handleInitialLoadFailure: function(message = "Could not load featured content.") {
                const { heroSection, heroTitle, heroOverview, heroInfoContainer } = AuraStreamApp.elements;
                heroSection?.classList.add('loaded');
                if (heroTitle) heroTitle.textContent = "AuraStream";
                if (heroOverview) heroOverview.innerHTML = `<span class="text-danger">${AuraStreamApp.utils.escapeHtml(message)}</span>`;
                if (heroInfoContainer) heroInfoContainer.innerHTML = '';
            },
            startBackgroundUpdates: function() {
                if (this.updateIntervalId) clearInterval(this.updateIntervalId);
                this.updateIntervalId = setInterval(() => this.loadBackgroundAndContent(), AuraStreamApp.config.HERO_UPDATE_INTERVAL);
            },
            setupButtonListeners: function() {
                const { heroWatchTrailerBtn, heroMoreInfoBtn } = AuraStreamApp.elements;
                heroWatchTrailerBtn?.addEventListener('click', e => {
                    const movieId = e.currentTarget.dataset.movieId;
                    if (movieId) AuraStreamApp.modules.modals.openTrailer(movieId);
                });
                // More info button is handled by conceptual links module
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

       expandingGallery: {
            name: 'ExpandingGallery',
            init: function() {
                const { elements, modules } = AuraStreamApp; // Destructure modules here
                const container = elements.expandingGallery;
                if (!container) return;

                const items = container.querySelectorAll('.gallery-item');

                container.addEventListener('click', (e) => {
                    const targetItem = e.target.closest('.gallery-item');
                    if (!targetItem) return;

                    // --- NEW LOGIC FOR BUTTON CLICKS ---
                    const learnMoreButton = e.target.closest('.gallery-learn-more');
                    if (learnMoreButton) {
                        e.stopPropagation(); // Prevent the card from collapsing if it's already open
                        const itemId = targetItem.dataset.itemId;
                        const itemType = targetItem.dataset.itemType;
                        
                        if (itemId && itemType) {
                            AuraStreamApp.utils.log(`Gallery 'Learn More' clicked for item: ${itemId}`);
                            // Call the existing, powerful modal function
                            modules.modals.openDetailModal(itemId, itemType);
                        } else {
                            // Fallback to conceptual link if data attributes are missing
                            modules.conceptualLinks.handleClick(learnMoreButton, "Details for this feature would open here.");
                        }
                        return; // Stop further execution
                    }

                    // --- EXISTING LOGIC FOR EXPAND/COLLAPSE ---
                    const rect = targetItem.getBoundingClientRect();
                    // A more robust way to detect close clicks
                    const isCloseClick = e.target.matches('.gallery-item::after') || (e.clientX > rect.right - 48 && e.clientY < rect.top + 48);

                    if (targetItem.classList.contains('active') && isCloseClick) {
                        targetItem.classList.remove('active');
                    } else if (!targetItem.classList.contains('active')) {
                        items.forEach(item => item.classList.remove('active'));
                        targetItem.classList.add('active');
                    }
                });

                // Tilt effect remains the same
                items.forEach(item => {
                    item.addEventListener('mousemove', (e) => {
                        if (item.classList.contains('active')) return;
                        const rect = item.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = (y - centerY) / centerY * -5;
                        const rotateY = (x - centerX) / centerX * 5;

                        item.style.transform = `scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    });

                    item.addEventListener('mouseleave', () => {
                        item.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
                    });
                });
            }
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

        // ====================================================
        // ===== NEW: UNIVERSE EXPLORER (HORIZONTAL JOURNEY) =====
        // ====================================================
        universeExplorer: {
            name: 'UniverseExplorer',
            collectionId: 10, // Star Wars Collection ID

            init: function() {
                // Main logic is handled by loadContent and event listeners attached after render
            },

            loadContent: async function() {
                const { utils, elements } = AuraStreamApp;
                if (!elements.universeExplorerSection) return;
                
                utils.log(`Loading Cinematic Universe for Collection ID: ${this.collectionId}`);
                try {
                    const [collectionData, imageData] = await Promise.all([
                        utils.fetchTMDB(`/collection/${this.collectionId}`),
                        utils.fetchTMDB(`/collection/${this.collectionId}/images`)
                    ]);
                    
                    if (collectionData?.parts?.length > 0) {
                        this.render(collectionData, imageData);
                    } else {
                        throw new Error("Collection data not found or is empty.");
                    }
                } catch (error) {
                    utils.error("Failed to load Cinematic Universe:", error);
                    elements.universeTimelineContainer.innerHTML = utils.getErrorTextHTML("Could not assemble this universe.");
                }
            },

            render: function(collection, images) {
                const { utils, config, elements, modules } = AuraStreamApp;

                // Safely decode HTML entities from the overview text
                const decodeHtmlEntities = (text) => {
                    if (!text) return '';
                    const textarea = document.createElement('textarea');
                    textarea.innerHTML = text;
                    return textarea.value;
                };
                
                if (images?.backdrops?.length > 0) {
                    const backdrop = images.backdrops[Math.floor(Math.random() * images.backdrops.length)];
                    elements.universeBgImage.style.backgroundImage = `url(${config.IMAGE_BASE_URL}original${backdrop.file_path})`;
                }

                if (images?.logos?.length > 0) {
                    const logo = images.logos.find(l => l.iso_639_1 === 'en') || images.logos[0];
                    elements.universeLogoContainer.innerHTML = `<img src="${config.IMAGE_BASE_URL}w500${logo.file_path}" alt="${collection.name} Logo">`;
                    elements.universeTitle.style.display = 'none';
                } else {
                    elements.universeTitle.innerHTML = utils.escapeHtml(collection.name);
                }
                elements.universeOverview.textContent = decodeHtmlEntities(collection.overview);

                const sortedMovies = collection.parts.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

                elements.universeTimelineContainer.innerHTML = sortedMovies.map(movie => {
                    const title = utils.escapeHtml(movie.title);
                    const year = utils.getYear(movie.release_date);
                    const overview = movie.overview ? utils.escapeHtml(movie.overview.substring(0, 150) + '...') : 'No overview available.';
                    const bgUrl = movie.backdrop_path ? `${config.IMAGE_BASE_URL}${config.BACKDROP_SIZE}${movie.backdrop_path}` : '';

                    return `
                        <div class="timeline-card-wrapper" data-aos="fade-up">
                            <div class="timeline-card">
                                <div class="timeline-card__bg" style="background-image: url('${bgUrl}');"></div>
                                <div class="timeline-card__content">
                                    <div class="timeline-card__year">${year}</div>
                                    <h3>${title}</h3>
                                    <p>${overview}</p>
                                    <div class="timeline-card__cta">
                                        <button class="btn btn-secondary-outline btn-sm detail-modal-trigger" data-item-id="${movie.id}" data-item-type="movie">
                                            <i class="bi bi-info-circle"></i> More Info
                                        </button>
                                    </div>
                                </div>
                                <div class="timeline-card__node"></div>
                            </div>
                        </div>
                    `;
                }).join('');

                this._attachEventListeners();
            },

            _attachEventListeners: function() {
                const { elements, modules, utils } = AuraStreamApp;
                const container = elements.universeTimelineContainer;
                const trackProgress = document.getElementById('universe-track-progress');
                const scrollHintLeft = document.querySelector('.scroll-hint.left');
                const scrollHintRight = document.querySelector('.scroll-hint.right');
                
                if (!container) return;
                
                // 1. Detail Modal Triggers
                container.querySelectorAll('.detail-modal-trigger').forEach(trigger => {
                    trigger.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const itemId = e.currentTarget.dataset.itemId;
                        modules.modals.openDetailModal(itemId, 'movie');
                    });
                });

                // 2. 3D Parallax Tilt Effect on Cards
                container.querySelectorAll('.timeline-card-wrapper').forEach(wrapper => {
                    const card = wrapper.querySelector('.timeline-card');
                    const bg = card.querySelector('.timeline-card__bg');

                    wrapper.addEventListener('mousemove', (e) => {
                        const rect = wrapper.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = (y - centerY) / centerY * -6; // Reduced rotation
                        const rotateY = (x - centerX) / centerX * 6;

                        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                        bg.style.transform = `translateX(${-rotateY * 1.5}px) translateY(${-rotateX * 1.5}px) translateZ(-20px) scale(1.1)`;
                    });

                    wrapper.addEventListener('mouseleave', () => {
                        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
                        bg.style.transform = 'translateX(0) translateY(0) translateZ(-20px) scale(1.1)';
                    });
                });

                // 3. Timeline Progress and Scroll Hint Handler
                const handleScroll = () => {
                    const scrollLeft = container.scrollLeft;
                    const scrollWidth = container.scrollWidth - container.clientWidth;
                    if (scrollWidth <= 0) return; // Avoid division by zero
                    
                    const progress = (scrollLeft / scrollWidth) * 100;
                    if (trackProgress) trackProgress.style.width = `${progress}%`;
                    
                    // Hide/show scroll hints
                    if (scrollHintLeft) scrollHintLeft.classList.toggle('hidden', scrollLeft > 50);
                    if (scrollHintRight) scrollHintRight.classList.toggle('hidden', scrollLeft >= scrollWidth - 50);
                };
                
                container.addEventListener('scroll', utils.debounce(handleScroll, 10), { passive: true });
                handleScroll(); // Initial check
            }
        },

        creatorsCorner: {
    name: 'CreatorsCorner',
    init: function() {
        // The loading is asynchronous, triggered by runAsyncInits
    },

    loadContent: async function() {
        const { utils, elements } = AuraStreamApp;
        if (!elements.creatorsGrid) return;
        
        utils.log("Loading Creator's Corner content...");
        elements.creatorsGrid.innerHTML = `<div class="loading-placeholder py-5"><div class="loading-spinner"></div><span>Finding visionaries...</span></div>`;

        try {
            const data = await utils.fetchTMDB('/person/popular', { page: 1 });
            if (data?.results) {
                // Filter for people who are known for acting/directing and have an image
                const creators = data.results.filter(person => 
                    (person.known_for_department === 'Acting' || person.known_for_department === 'Directing') &&
                    person.profile_path &&
                    person.known_for.length > 0
                ).slice(0, 4); // Get the top 4 qualifying creators

                if (creators.length > 0) {
                    this.renderCreators(creators);
                } else {
                    throw new Error("No suitable creators found in API response.");
                }
            } else {
                throw new Error("API did not return results for popular people.");
            }
        } catch (error) {
            utils.error("Failed to load Creator's Corner:", error);
            elements.creatorsGrid.innerHTML = utils.getErrorTextHTML("Could not load creator profiles.");
        }
    },

    renderCreators: function(creators) {
        const { utils, config, elements, modules } = AuraStreamApp;
        elements.creatorsGrid.innerHTML = ''; // Clear loading placeholder

        creators.forEach((person, index) => {
            const card = document.createElement('article');
            card.className = 'creator-card';
            card.dataset.aos = "flip-left";
            card.dataset.aosDelay = `${100 * (index + 1)}`;
            card.dataset.personId = person.id;

            const name = utils.escapeHtml(person.name);
            const role = utils.escapeHtml(person.known_for_department);
            const profileUrl = `${config.IMAGE_BASE_URL}h632${person.profile_path}`;
            
            // Find a primary movie they are known for to use as a bio
            const primaryWork = person.known_for.find(work => work.title || work.name);
            const bio = primaryWork ? `Star of <em>${utils.escapeHtml(primaryWork.title || primaryWork.name)}</em> and fan favorite.` : 'A prominent figure in the film industry.';

            card.innerHTML = `
                <div class="creator-card-front">
                    <div class="creator-photo">
                        <img src="${profileUrl}" alt="${name} Portrait" loading="lazy">
                    </div>
                    <div class="creator-info">
                        <h4 class="creator-name">${name}</h4>
                        <span class="creator-role">${role}</span>
                        <p class="creator-bio">${bio}</p>
                    </div>
                </div>
                <div class="creator-card-back">
                    <h5 class="known-for-title">Known For</h5>
                    <div class="known-for-grid">
                        ${person.known_for.slice(0, 3).map(work => `
                            <a href="#" class="known-for-item detail-modal-trigger" data-item-id="${work.id}" data-item-type="${work.media_type}">
                                <img src="${config.IMAGE_BASE_URL}w185${work.poster_path}" alt="${utils.escapeHtml(work.title || work.name)}" loading="lazy">
                            </a>
                        `).join('')}
                    </div>
                    <button class="btn btn-primary-gradient conceptual-link" title="This would open a dedicated page for ${name}"><i class="bi bi-person-video3"></i> Explore Works</button>
                </div>
            `;
            
            // Attach event listeners for the modal triggers on the back
            card.querySelectorAll('.detail-modal-trigger').forEach(trigger => {
                trigger.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent the card flip from misfiring
                    const itemId = e.currentTarget.dataset.itemId;
                    const itemType = e.currentTarget.dataset.itemType;
                    modules.modals.openDetailModal(itemId, itemType);
                });
            });
            
            elements.creatorsGrid.appendChild(card);
        });
        
        // Re-initialize AOS if it's used, to catch the new elements
        if (window.AOS) {
            AOS.refresh();
        }
    }
},
 
 conceptualLinks: { // Using robust version
          init: function() { const utils = AuraStreamApp.utils; document.body.addEventListener('click', (e) => { const link = e.target.closest('.conceptual-link'); if (link && !link.disabled) this.handleClick(link, link.title || 'Conceptual', e); }); utils.log("ConceptualLinks Initialized."); },
          handleClick: function(link, msg = null, e = null) { if(e) e.preventDefault(); alert(msg || "This feature is conceptual."); AuraStreamApp.utils.log(`Conceptual link clicked: ${link.title || link.textContent.trim()}`); }
      },

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


        analyticsDashboard: {
            name: 'AnalyticsDashboard',
            init: function() {
                this.setupCounterAnimations();
            },
            loadAnalyticsData: async function() {
                await Promise.allSettled([
                    this.updateKpis(),
                    this.fetchAndRenderTopActors(),
                    this.updateGauge(),
                    this.updateNetworkChart()
                ]);
            },
            setupCounterAnimations: function() {
                const counters = AuraStreamApp.elements.kpiCounters;
                if (!counters || counters.length === 0) return;

                const animateCount = (el) => {
                    const target = parseFloat(el.dataset.target);
                    const suffix = el.dataset.suffix || '';
                    const duration = 2000;
                    const stepTime = 16;
                    const totalSteps = duration / stepTime;
                    const increment = target / totalSteps;
                    let current = 0;
                    
                    const step = () => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            el.textContent = Number.isInteger(target) ? target.toLocaleString() + suffix : target.toFixed(1) + suffix;
                        } else {
                            el.textContent = Number.isInteger(target) ? Math.floor(current).toLocaleString() + suffix : current.toFixed(1) + suffix;
                            requestAnimationFrame(step);
                        }
                    };
                    step();
                };

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateCount(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.7 });

                counters.forEach(counter => observer.observe(counter));
            },
            updateKpis: async function() { /* Values are set via data-target in HTML now */ },
            updateGauge: function() {
                const { gaugeFillElement, gaugeValueElement } = AuraStreamApp.elements;
                const val = Math.floor(Math.random() * 26) + 60;
                if (gaugeFillElement) gaugeFillElement.style.transform = `rotate(${val / 100}turn)`;
                if (gaugeValueElement) gaugeValueElement.textContent = `${val}%`;
            },
            updateNetworkChart: function() {
                const { networkBarChart } = AuraStreamApp.elements;
                if (!networkBarChart) return;
                const data = [ {l:"Netflix",v:75},{l:"HBO",v:70},{l:"Disney+",v:65},{l:"Prime",v:60},{l:"Apple+",v:45}];
                let html = '';
                data.forEach((item, i) => {
                    html += `<div class="bar-item" data-aos="fade-left" data-aos-delay="${i*50}"><div class="bar-label">${AuraStreamApp.utils.escapeHtml(item.l)}</div><div class="bar" style="width: 0%;" data-target-width="${item.v}%"></div></div>`;
                });
                networkBarChart.innerHTML = html;
                setTimeout(() => {
                    networkBarChart.querySelectorAll('.bar').forEach(bar => bar.style.width = bar.dataset.targetWidth);
                }, 100);
            },
            fetchAndRenderTopActors: async function() {
                const { topActorsList } = AuraStreamApp.elements;
                if (!topActorsList) return;
                topActorsList.innerHTML = AuraStreamApp.utils.getLoadingTextHTML("Loading actors...");
                const data = await AuraStreamApp.utils.fetchTMDB('/person/popular');
                if (data?.results?.length) {
                    this.renderTopActors(data.results.slice(0, 6));
                } else {
                    topActorsList.innerHTML = AuraStreamApp.utils.getErrorTextHTML("Could not load actors.");
                }
            },
            renderTopActors: function(actors) {
                const { topActorsList } = AuraStreamApp.elements;
                const { utils, config } = AuraStreamApp;
                if (!topActorsList) return;
                let html = '';
                actors.forEach(actor => {
                    const img = actor.profile_path ? `${config.IMAGE_BASE_URL}${config.PROFILE_SIZE}${actor.profile_path}` : 'data:image/svg+xml,...';
                    html += `<div class="actor-item"><img src="${img}" alt="${utils.escapeHtml(actor.name)}"><span class="actor-name">${utils.escapeHtml(actor.name)}</span><span class="actor-popularity"><i class="bi bi-graph-up"></i> ${actor.popularity?.toFixed(1)}</span></div>`;
                });
                topActorsList.innerHTML = html;
            },
            displayError: function(message) {
                const { topActorsList, networkBarChart } = AuraStreamApp.elements;
                const errorHtml = AuraStreamApp.utils.getErrorTextHTML(message);
                if (topActorsList) topActorsList.innerHTML = errorHtml;
                if (networkBarChart) networkBarChart.innerHTML = errorHtml;
            }
        },
        /**
         * auth: {
            name: 'Authentication',
            init: function() {
                const els = AuraStreamApp.elements;
                els.loginForm?.addEventListener('submit', e => this.handleEmailLogin(e));
                els.signupForm?.addEventListener('submit', e => this.handleEmailSignup(e));
                els.googleLoginButton?.addEventListener('click', () => this.handleGoogleAuth(false));
                els.googleSignupButton?.addEventListener('click', () => this.handleGoogleAuth(true));
                els.logoutButton?.addEventListener('click', () => this.handleLogout());
                document.querySelectorAll('#authTabs button[data-bs-toggle="tab"]').forEach(tab => {
                    tab.addEventListener('shown.bs.tab', () => this.clearAuthError());
                });
            },
            handleEmailLogin: function(e) {
                e.preventDefault();
                const { loginEmailInput, loginPasswordInput } = AuraStreamApp.elements;
                const email = loginEmailInput.value.trim();
                const password = loginPasswordInput.value;
                if (!email || !password) { this.showAuthError("Please enter email and password."); return; }
                AuraStreamApp.state.firebaseAuth.signInWithEmailAndPassword(email, password)
                    .then(() => window.location.href = AuraStreamApp.config.AUTH_REDIRECT_URL)
                    .catch(err => this.showAuthError(this.mapFirebaseError(err)));
            },
            handleEmailSignup: function(e) {
                e.preventDefault();
                const { signupNameInput, signupAgeInput, signupEmailInput, signupPasswordInput, signupAvatarInput } = AuraStreamApp.elements;
                const name = signupNameInput.value.trim();
                const age = parseInt(signupAgeInput.value, 10);
                const email = signupEmailInput.value.trim();
                const password = signupPasswordInput.value;
                const avatarFile = signupAvatarInput.files[0];

                if (!name || !age || !email || !password) { this.showAuthError("Please fill all required fields."); return; }
                if (password.length < 6) { this.showAuthError("Password must be at least 6 characters."); return; }

                AuraStreamApp.state.firebaseAuth.createUserWithEmailAndPassword(email, password)
                    .then(userCredential => this.updateProfileAndStoreData(userCredential.user, name, age, avatarFile))
                    .then(() => window.location.href = AuraStreamApp.config.AUTH_REDIRECT_URL)
                    .catch(err => this.showAuthError(this.mapFirebaseError(err)));
            },
            handleGoogleAuth: function(isSignup = false) {
                const provider = new firebase.auth.GoogleAuthProvider();
                AuraStreamApp.state.firebaseAuth.signInWithPopup(provider)
                    .then(result => {
                        if (result.additionalUserInfo?.isNewUser) {
                            const user = result.user;
                            return this.updateProfileAndStoreData(user, user.displayName, null, null, user.photoURL);
                        }
                    })
                    .then(() => window.location.href = AuraStreamApp.config.AUTH_REDIRECT_URL)
                    .catch(err => this.showAuthError(this.mapFirebaseError(err)));
            },
            handleLogout: function() {
                AuraStreamApp.state.firebaseAuth.signOut().catch(err => AuraStreamApp.utils.error("Logout failed:", err));
            },
            updateProfileAndStoreData: async function(user, name, age, avatarFile = null, photoURLFromProvider = null) {
                let photoURL = photoURLFromProvider;
                if (avatarFile && AuraStreamApp.state.firebaseStorage) {
                    const filePath = `profile_images/${user.uid}/${Date.now()}_${avatarFile.name}`;
                    const snapshot = await AuraStreamApp.state.firebaseStorage.ref(filePath).put(avatarFile);
                    photoURL = await snapshot.ref.getDownloadURL();
                }
                await user.updateProfile({ displayName: name, photoURL: photoURL });
                if (age && AuraStreamApp.state.firebaseFirestore) {
                    await AuraStreamApp.state.firebaseFirestore.collection('users').doc(user.uid).set({ age: age }, { merge: true });
                }
            },
            updateAuthUI: function() {
                const { isLoggedIn, currentUser } = AuraStreamApp.state;
                const { loginSignupButton, userInfoArea, userDisplayName, userAvatarImage, userAvatarInitials } = AuraStreamApp.elements;
                if (isLoggedIn && currentUser) {
                    loginSignupButton.classList.add('d-none');
                    userInfoArea.classList.remove('d-none');
                    userDisplayName.textContent = currentUser.displayName || currentUser.email;
                    if (currentUser.photoURL) {
                        userAvatarImage.src = currentUser.photoURL;
                        userAvatarImage.classList.remove('d-none');
                        userAvatarInitials.classList.add('d-none');
                    } else {
                        userAvatarInitials.textContent = AuraStreamApp.utils.getInitials(currentUser.displayName, currentUser.email);
                        userAvatarInitials.classList.remove('d-none');
                        userAvatarImage.classList.add('d-none');
                    }
                } else {
                    loginSignupButton.classList.remove('d-none');
                    userInfoArea.classList.add('d-none');
                }
            },
            showAuthError: function(message) {
                const el = AuraStreamApp.elements.authErrorMessage;
                if (el) { el.textContent = message; el.classList.remove('d-none'); }
            },
            clearAuthError: function() {
                const el = AuraStreamApp.elements.authErrorMessage;
                if (el) { el.textContent = ''; el.classList.add('d-none'); }
            },
            mapFirebaseError: function(error) {
                const codeMap = {
                    'auth/invalid-email': 'Invalid email format.', 'auth/user-not-found': 'No user found with this email.',
                    'auth/wrong-password': 'Incorrect password.', 'auth/email-already-in-use': 'This email is already registered.',
                    'auth/weak-password': 'Password must be at least 6 characters.', 'auth/popup-closed-by-user': 'Sign-in cancelled.',
                };
                return codeMap[error.code] || error.message || 'An unknown error occurred.';
            }
        }
         */

        auth: {
    name: 'Authentication',
    init: function() {
        const els = AuraStreamApp.elements;
        // Listeners for Forms
        els.loginForm?.addEventListener('submit', e => this.handleEmailLogin(e));
        els.signupForm?.addEventListener('submit', e => this.handleEmailSignup(e));
        
        // Listeners for Social Auth
        els.googleLoginButton?.addEventListener('click', () => this.handleGoogleAuth(false));
        els.googleSignupButton?.addEventListener('click', () => this.handleGoogleAuth(true));
        
        // Listeners for Logout (Legacy and new dropdown)
        els.logoutButton?.addEventListener('click', () => this.handleLogout());
        document.getElementById('logout-button-dropdown')?.addEventListener('click', () => this.handleLogout()); 

        // Clear error on tab change
        document.querySelectorAll('#authTabs button[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', () => this.clearAuthError());
        });
    },
    
    handleEmailLogin: function(e) {
        e.preventDefault();
        const { loginEmailInput, loginPasswordInput } = AuraStreamApp.elements;
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value;
        if (!email || !password) { this.showAuthError("Please enter email and password."); return; }
        
        AuraStreamApp.state.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                AuraStreamApp.utils.log("Login successful. Redirecting...");
                window.location.href = AuraStreamApp.config.AUTH_REDIRECT_URL;
            })
            .catch(err => this.showAuthError(this.mapFirebaseError(err)));
    },
    
    handleEmailSignup: function(e) {
        e.preventDefault();
        const { signupNameInput, signupAgeInput, signupEmailInput, signupPasswordInput, signupAvatarInput } = AuraStreamApp.elements;
        const name = signupNameInput.value.trim();
        const age = parseInt(signupAgeInput.value, 10);
        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value;
        const avatarFile = signupAvatarInput.files[0];

        // Robust validation for required fields
        if (!name || name.length < 2 || !email || !password || isNaN(age) || age < 5 || age > 120) { 
            this.showAuthError("Please enter a valid name, email, age (5-120), and password (min 6 chars)."); 
            return; 
        }
        if (password.length < 6) { this.showAuthError("Password must be at least 6 characters."); return; }

        AuraStreamApp.state.firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => this.updateProfileAndStoreData(userCredential.user, name, age, avatarFile))
            .then(() => {
                AuraStreamApp.utils.log("Signup successful. Redirecting...");
                window.location.href = AuraStreamApp.config.AUTH_REDIRECT_URL;
            })
            .catch(err => this.showAuthError(this.mapFirebaseError(err)));
    },
    
    handleGoogleAuth: function(isSignup = false) {
        const provider = new firebase.auth.GoogleAuthProvider();
        AuraStreamApp.state.firebaseAuth.signInWithPopup(provider)
            .then(result => {
                if (result.additionalUserInfo?.isNewUser) {
                    const user = result.user;
                    // For social signup, we pass null for age (not collected via popup)
                    return this.updateProfileAndStoreData(user, user.displayName, null, null, user.photoURL);
                }
            })
            .then(() => window.location.href = AuraStreamApp.config.AUTH_REDIRECT_URL)
            .catch(err => this.showAuthError(this.mapFirebaseError(err)));
    },
    
    handleLogout: function() {
        AuraStreamApp.state.firebaseAuth.signOut().catch(err => AuraStreamApp.utils.error("Logout failed:", err));
    },
    
    /**
     * Updates the Firebase Auth profile and stores a detailed record in Firestore.
     * @param {firebase.User} user - The Firebase User object.
     * @param {string} name - User's display name.
     * @param {number|null} age - User's age (can be null for social login).
     * @param {File|null} avatarFile - Optional avatar file.
     * @param {string|null} photoURLFromProvider - Optional photo URL from a social provider.
     */
    updateProfileAndStoreData: async function(user, name, age, avatarFile = null, photoURLFromProvider = null) {
        const utils = AuraStreamApp.utils;
        const { firebaseStorage, firebaseFirestore } = AuraStreamApp.state;

        let photoURL = photoURLFromProvider;

        // 1. Upload Avatar if provided
        if (avatarFile && firebaseStorage) {
            utils.log("Uploading avatar to Firebase Storage...");
            try {
                const filePath = `profile_images/${user.uid}/${Date.now()}_${avatarFile.name}`;
                const snapshot = await firebaseStorage.ref(filePath).put(avatarFile);
                photoURL = await snapshot.ref.getDownloadURL();
                utils.log("Avatar uploaded successfully.");
            } catch (e) {
                utils.error("Avatar upload failed:", e);
                // Continue even if upload fails
            }
        }

        // 2. Update Auth Profile
        await user.updateProfile({ displayName: name, photoURL: photoURL });
        utils.log("Firebase Auth profile updated with name and photoURL.");

        // 3. Save ALL detailed info to Firestore (if available)
        if (firebaseFirestore) {
            const serverTimestamp = (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) 
                ? firebase.firestore.FieldValue.serverTimestamp() 
                : new Date(); 

            const userData = { 
                uid: user.uid,
                name: name, 
                email: user.email, 
                photoURL: photoURL,
                lastLogin: serverTimestamp,
                // Only include age if valid
                ...(age && !isNaN(age) ? { age: age } : {})
            };

            // Set creation timestamp
            if (user.metadata.creationTime) {
                userData.createdAt = firebase.firestore.Timestamp.fromDate(new Date(user.metadata.creationTime));
            } else {
                 userData.createdAt = serverTimestamp;
            }
            
            await firebaseFirestore.collection('users').doc(user.uid).set(userData, { merge: true });
            utils.log(`User data saved/merged in Firestore for UID: ${user.uid}`);
        }
    },
    
    updateAuthUI: function() {
        const { isLoggedIn, currentUser } = AuraStreamApp.state;
        const { 
            loginSignupButton, userInfoArea, 
            userAvatarImage, userAvatarInitials
        } = AuraStreamApp.elements;
        
        // Fetch new dropdown elements dynamically
        const dropdownUserNameEl = document.getElementById('dropdown-user-name');
        const dropdownUserEmailEl = document.getElementById('dropdown-user-email');

        if (isLoggedIn && currentUser) {
            loginSignupButton.classList.add('d-none');
            userInfoArea.classList.remove('d-none'); 

            // Update dropdown header info
            if (dropdownUserNameEl) dropdownUserNameEl.textContent = currentUser.displayName || 'User';
            if (dropdownUserEmailEl) dropdownUserEmailEl.textContent = currentUser.email || '';
            
            // Update avatar visuals
            if (currentUser.photoURL) {
                userAvatarImage.src = currentUser.photoURL;
                userAvatarImage.classList.remove('d-none');
                userAvatarInitials.classList.add('d-none');
            } else {
                userAvatarInitials.textContent = AuraStreamApp.utils.getInitials(currentUser.displayName, currentUser.email);
                userAvatarInitials.classList.remove('d-none');
                userAvatarImage.classList.add('d-none');
            }
            
            // Legacy logout button cleanup
            const oldLogoutBtn = document.getElementById('logout-button');
            if(oldLogoutBtn) oldLogoutBtn.classList.add('d-none');

        } else {
            loginSignupButton.classList.remove('d-none');
            userInfoArea.classList.add('d-none');
        }
    },
    
    showAuthError: function(message) {
        const el = AuraStreamApp.elements.authErrorMessage;
        if (el) { el.textContent = message; el.classList.remove('d-none'); }
    },
    
    clearAuthError: function() {
        const el = AuraStreamApp.elements.authErrorMessage;
        if (el) { el.textContent = ''; el.classList.add('d-none'); }
    },
    
    mapFirebaseError: function(error) {
        const codeMap = {
            'auth/invalid-email': 'Invalid email format.', 
            'auth/user-not-found': 'No user found with this email.',
            'auth/wrong-password': 'Incorrect password.', 
            'auth/email-already-in-use': 'This email is already registered.',
            'auth/weak-password': 'Password must be at least 6 characters.', 
            'auth/popup-closed-by-user': 'Sign-in cancelled.',
        };
        return codeMap[error.code] || error.message || 'An unknown error occurred.';
    }
}

        
    }
};

/**
 * Internal Website Search Manager v2.0
 * - Refined event handling using delegation for better performance.
 * - Improved robustness against missing DOM elements.
 * - Cleaner navigation and action handling logic.
 */
class InternalSearchManager {
    constructor() {
        this.searchData = this.initializeSearchData();
        this.recentSearches = this.loadRecentSearches();
        this.maxRecentSearches = 5;
        this.minSearchLength = 1;
        
        // --- Cache DOM elements for performance ---
        this.desktopSearchInput = document.getElementById('nav-search-input');
        this.desktopSearchResults = document.getElementById('nav-search-results');
        this.mobileSearchInput = document.getElementById('mobile-search-input');
        // Mobile search results container is not defined in the HTML yet, but we can prepare for it.
        // For now, we will assume it might be added later or just focus on desktop.
        // Let's create a placeholder for it if it exists
        this.mobileSearchResults = document.getElementById('mobile-search-results');

        // Check if essential elements exist before proceeding
        if (!this.desktopSearchInput || !this.desktopSearchResults) {
            console.warn("AuraStream Search: Desktop search elements not found. Search will be disabled.");
            return; // Abort initialization
        }
        
        this.init();
    }

    initializeSearchData() {
        // This data structure is excellent, no changes needed here.
        return [
            { title: "Home", description: "Welcome to AuraStream", type: "section", icon: "bi-house", url: "#hero", keywords: ["home", "main", "welcome"] },
            { title: "Discover Content", description: "Explore trending movies and shows", type: "section", icon: "bi-compass", url: "#discover-panel", keywords: ["discover", "explore", "find", "movies"] },
            { title: "Features", description: "Learn about AuraStream's capabilities", type: "section", icon: "bi-stars", url: "#features", keywords: ["features", "capabilities", "functionality"] },
            { title: "AI Recommendation", description: "Get personalized movie recommendations", type: "section", icon: "bi-robot", url: "#ai-engine", keywords: ["ai", "recommendation", "mood"] },
            { title: "Genre Spotlight", description: "Dive deep into specific movie genres", type: "section", icon: "bi-collection-play", url: "#genre-spotlight", keywords: ["genre", "categories", "types"] },
            { title: "Creator's Corner", description: "Meet directors and actors", type: "section", icon: "bi-person-video", url: "#creators-corner", keywords: ["creators", "directors", "actors"] },
            { title: "Gallery & UI", description: "Explore AuraStream's interface", type: "section", icon: "bi-grid-3x3-gap", url: "#gallery-section", keywords: ["gallery", "ui", "interface", "screenshots"] },
            { title: "Analytics & Insights", description: "View platform statistics", type: "section", icon: "bi-graph-up", url: "#analytics-dashboard", keywords: ["analytics", "insights", "statistics"] },
            { title: "FAQ", description: "Find answers to questions", type: "section", icon: "bi-question-circle", url: "#faq", keywords: ["faq", "help", "support", "questions"] },
            { title: "Unified Discovery", description: "Find content across services", type: "feature", icon: "bi-search", url: "#features", keywords: ["discovery", "search", "unified"] },
            { title: "Personalized Recommendations", description: "Smart system learns your taste", type: "feature", icon: "bi-heart", url: "#ai-engine", keywords: ["personalized", "recommendations", "suggestions"] },
            { title: "Watchlist Tracking", description: "Manage your watchlist", type: "feature", icon: "bi-bookmark-check", url: "#features", keywords: ["watchlist", "tracking", "progress"] },
            { title: "Community Features", description: "Connect with fans and share reviews", type: "feature", icon: "bi-people", url: "#features", keywords: ["community", "social", "reviews"] },
            { title: "Release Notifications", description: "Never miss new episodes or movies", type: "feature", icon: "bi-bell", url: "#features", keywords: ["notifications", "releases", "alerts"] },
            { title: "Cross-Device Sync", description: "Your data stays synced everywhere", type: "feature", icon: "bi-phone", url: "#features", keywords: ["sync", "cross-device", "cloud"] },
            { title: "What is AuraStream?", description: "Learn about our platform", type: "faq", icon: "bi-info-circle", url: "#faq", keywords: ["what is", "about", "platform"] },
            { title: "Is AuraStream free?", description: "Information about pricing", type: "faq", icon: "bi-currency-dollar", url: "#faq", keywords: ["free", "pricing", "cost"] },
            { title: "Platform Availability", description: "Where to access AuraStream", type: "faq", icon: "bi-devices", url: "#available-everywhere", keywords: ["platforms", "devices", "mobile"] },
            { title: "Launch App", description: "Open the AuraStream application", type: "action", icon: "bi-rocket-takeoff", action: "launchApp", keywords: ["launch", "open app", "start"] },
            { title: "Contact Support", description: "Get help from our team", type: "action", icon: "bi-headset", action: "contactSupport", keywords: ["contact", "support", "help"] },
            { title: "View GitHub", description: "Check out the project source code", type: "action", icon: "bi-github", url: "https://github.com/MEDELBOU3/AuraStream-Concept", keywords: ["github", "source code", "repository"] }
        ];
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // --- Desktop Search ---
        this.desktopSearchInput.addEventListener('input', (e) => this.handleSearch(e.target.value, this.desktopSearchResults));
        this.desktopSearchInput.addEventListener('focus', () => this.showRecentSearches(this.desktopSearchResults));
        // Use event delegation for result clicks
        this.desktopSearchResults.addEventListener('click', (e) => this.handleResultClick(e.target.closest('.search-result-item')));
        
        // --- Mobile Search (if it exists) ---
        if (this.mobileSearchInput && this.mobileSearchResults) {
            this.mobileSearchInput.addEventListener('input', (e) => this.handleSearch(e.target.value, this.mobileSearchResults));
            this.mobileSearchInput.addEventListener('focus', () => this.showRecentSearches(this.mobileSearchResults));
            this.mobileSearchResults.addEventListener('click', (e) => this.handleResultClick(e.target.closest('.search-result-item')));
        }

        // --- Global listener to close dropdowns ---
        document.addEventListener('click', (e) => {
            const searchBar = e.target.closest('.search-bar');
            if (!searchBar) {
                this.closeAllResults();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
            if (e.key === '/' && !this.isInputFocused()) {
                e.preventDefault();
                this.focusSearch();
            }
            if (e.key === 'Escape') {
                this.closeAllResults();
            }
        });
    }

    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
    }

    focusSearch() {
        this.desktopSearchInput.focus();
        this.desktopSearchInput.select();
    }

    handleSearch(query, resultsContainer) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length < this.minSearchLength) {
            this.showRecentSearches(resultsContainer);
            return;
        }

        const results = this.search(trimmedQuery);
        this.displayResults(results, resultsContainer, trimmedQuery);
    }

    search(query) {
        // The scoring logic is excellent, no changes needed.
        const lowerQuery = query.toLowerCase();
        const scoredResults = [];

        this.searchData.forEach(item => {
            let score = 0;
            if (item.title.toLowerCase().includes(lowerQuery)) score += 100;
            if (item.description.toLowerCase().includes(lowerQuery)) score += 50;
            const keywordMatches = item.keywords.filter(k => k.toLowerCase().includes(lowerQuery)).length;
            score += keywordMatches * 25;
            if (item.title.toLowerCase() === lowerQuery) score += 200;
            
            if (score > 0) {
                scoredResults.push({ ...item, score });
            }
        });

        return scoredResults.sort((a, b) => b.score - a.score).slice(0, 10);
    }

    displayResults(results, container, query) {
        if (!container) return;
        if (results.length === 0) {
            container.innerHTML = this.getNoResultsHTML(query);
        } else {
            const groupedResults = this.groupResultsByType(results);
            container.innerHTML = this.buildResultsHTML(groupedResults);
        }
        container.classList.add('active');
    }

    groupResultsByType(results) {
        // Grouping logic is perfect.
        return results.reduce((groups, result) => {
            (groups[result.type] = groups[result.type] || []).push(result);
            return groups;
        }, {});
    }

    buildResultsHTML(groupedResults) {
        let html = '';
        const groupOrder = ['section', 'feature', 'faq', 'action']; // Define render order
        
        groupOrder.forEach(groupKey => {
            if (groupedResults[groupKey] && groupedResults[groupKey].length > 0) {
                const headerText = {
                    section: 'Sections',
                    feature: 'Features',
                    faq: 'Help & Support',
                    action: 'Actions'
                }[groupKey];
                
                html += `<div class="search-section-header">${headerText}</div>`;
                html += groupedResults[groupKey].map(item => this.buildResultItemHTML(item)).join('');
            }
        });
        
        return html;
    }

    buildResultItemHTML(item) {
        return `
            <button class="search-result-item" data-type="${item.type}" data-url="${item.url || ''}" data-action="${item.action || ''}">
                <div class="search-result-icon ${item.type}">
                    <i class="bi ${item.icon}"></i>
                </div>
                <div class="search-result-info">
                    <div class="search-result-title">
                        ${item.title}
                        <span class="search-result-type">${item.type}</span>
                    </div>
                    <div class="search-result-description">${item.description}</div>
                </div>
            </button>
        `;
    }

    getNoResultsHTML(query) {
        // This is well-designed.
        return `
            <div class="search-no-results">
                <i class="bi bi-search"></i>
                <div>No results for "<strong>${this.escapeHtml(query)}</strong>"</div>
                <div style="font-size: 0.8rem; margin-top: 8px; opacity: 0.7;">
                    Try searching for sections, features, or help topics.
                </div>
            </div>
        `;
    }

    showRecentSearches(container) {
        if (!container) return;
        if (this.recentSearches.length === 0) {
            container.innerHTML = `
                <div class="search-no-results">
                    <i class="bi bi-compass"></i>
                    <div>Search for sections, features, and more.</div>
                </div>
            `;
        } else {
            let html = '<div class="search-section-header">Recent Searches</div>';
            html += this.recentSearches.map(term => `
                <button class="search-result-item" data-recent-search="${this.escapeHtml(term)}">
                    <div class="search-result-icon">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <div class="search-result-info">
                        <div class="search-result-title">${this.escapeHtml(term)}</div>
                    </div>
                </button>
            `).join('');
            container.innerHTML = html;
        }
        container.classList.add('active');
    }

    handleResultClick(item) {
        if (!item) return; // Exit if the click was not on an item
        
        const url = item.dataset.url;
        const action = item.dataset.action;
        const recentSearch = item.dataset.recentSearch;
        
        if (recentSearch) {
            this.desktopSearchInput.value = recentSearch;
            this.handleSearch(recentSearch, this.desktopSearchResults);
            // Do not close or clear, let the user see the new results
            return;
        }
        
        // Add to recent searches if it was a direct result click
        const query = this.desktopSearchInput.value.trim();
        if(query) this.addToRecentSearches(query);
        
        this.closeAllResults();
        this.clearSearchInputs();
        
        if (action) {
            this.handleAction(action);
        } else if (url) {
            this.navigateTo(url);
        }
    }

    handleAction(action) {
        switch (action) {
            case 'launchApp':
                // Safely trigger the modal
                const modalEl = document.getElementById('launchAppModal');
                if (modalEl && typeof bootstrap !== 'undefined') {
                    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                    modal.show();
                }
                break;
            case 'contactSupport':
                alert("Contact support is a conceptual feature.");
                break;
        }
    }

    navigateTo(url) {
        if (url.startsWith('#')) {
            const target = document.querySelector(url);
            if (target) {
                // Temporarily highlight the section for user feedback
                target.style.transition = 'box-shadow 0.3s ease-in-out';
                target.style.boxShadow = '0 0 0 3px rgba(var(--primary-accent-rgb), 0.5)';
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    target.style.boxShadow = '';
                }, 1500);
            }
        } else if (url.startsWith('http')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    addToRecentSearches(term) {
        const normalizedTerm = term.trim().toLowerCase();
        if (!normalizedTerm) return;
        
        this.recentSearches = this.recentSearches.filter(t => t !== normalizedTerm);
        this.recentSearches.unshift(normalizedTerm);
        this.recentSearches = this.recentSearches.slice(0, this.maxRecentSearches);
        
        this.saveRecentSearches();
    }

    loadRecentSearches() {
        try {
            const stored = localStorage.getItem('auraStreamRecentSearches');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    saveRecentSearches() {
        try {
            localStorage.setItem('auraStreamRecentSearches', JSON.stringify(this.recentSearches));
        } catch (error) {
            console.warn('Could not save recent searches:', error);
        }
    }

    clearSearchInputs() {
        if (this.desktopSearchInput) this.desktopSearchInput.value = '';
        if (this.mobileSearchInput) this.mobileSearchInput.value = '';
    }

    closeAllResults() {
        if (this.desktopSearchResults) this.desktopSearchResults.classList.remove('active');
        if (this.mobileSearchResults) this.mobileSearchResults.classList.remove('active');
    }
    
    // Simple HTML escaper
    escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
}

// Initialize the search manager when the app is ready
// This should be integrated into your main app's initialization flow.
// For example, within AuraStreamApp.init():
// this.internalSearch = new InternalSearchManager();
// For now, we'll keep the DOMContentLoaded listener for standalone testing.
document.addEventListener('DOMContentLoaded', function() {
    if (!window.AuraStreamApp) { // Prevents re-initialization if already part of a larger app object
        window.internalSearch = new InternalSearchManager();
    }
});



// --- Start the Main Application ---
AuraStreamApp.init();
