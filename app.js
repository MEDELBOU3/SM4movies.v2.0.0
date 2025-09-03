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
    init: function() {
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
            phoneDemoPlayer: document.getElementById('interactive-demo'),
            youtubePlayer: document.getElementById('youtubePlayer'),
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
            this.modules.analyticsDashboard.loadAnalyticsData()
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

        auth: {
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
    }
};

// --- Start the Main Application ---
AuraStreamApp.init();
