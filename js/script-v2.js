   // --- Configuration ---
        const config = {
            TMDB_API_KEY: '431fb541e27bceeb9db2f4cab69b54e1', // Replace with your actual TMDB API Key
            TMDB_BASE_URL: 'https://api.themoviedb.org/3',
            IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
            BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/original',
            STILL_BASE_URL: 'https://image.tmdb.org/t/p/w300',
            LOGO_BASE_URL: 'https://image.tmdb.org/t/p/w185',
            PROFILE_BASE_URL: 'https://image.tmdb.org/t/p/h632', // Larger profile pic for person page
            GEMINI_API_KEY: 'AIzaSyC581OIEWWS2Op7wUPtIVRGCSe0hr9btAg', // YOUR ACTUAL KEY HERE
            GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash', 
            STREAMING_PROVIDERS: [ // Providers for the player view iframe
                 { name: 'VidSrc.to', urlFormat: (id, type, season, episode) => `https://vidsrc.to/embed/${type}/${id}${type==='tv'&&season?`/${season}-${episode||1}`:''}` },
                 { name: 'SuperEmbed', urlFormat: (id, type, season, episode) => `https://multiembed.mov/?video_id=${id}&tmdb=1${type==='tv'&&season?`&s=${season}&e=${episode||1}`:''}` },
                 // Add more player sources if desired, e.g., 2embed.cc
                 // { name: '2Embed', urlFormat: (id, type, season, episode) => `https://www.2embed.cc/embed${type==='tv'?'tv':' películas'}/${id}${type==='tv'&&season?`?s=${season}&e=${episode||1}`:''}` }
            ],
            HOME_SECTIONS: [
                { // <<< NEW SECTION >>>
                    title: "Popular on AuraStream", // Or "Your Most Viewed"
                    id: 'most-viewed', // Special ID
                    display_style: 'horizontal_poster', // Or vertical 'default'
                    max_items: 15 // How many top items to show
                },
                {
                    title: "Continue Watching",
                    id: 'continue-watching', // Special ID to identify it
                    display_style: 'horizontal_backdrop'
                }, 
                {
                    title: "Latest Trailers",
                    endpoint: "/movie/now_playing", // Fetch movies likely to have trailers
                    type: 'movie',
                    display_style: 'horizontal_backdrop', // Special style for horizontal
                    show_trailer_button: true // Flag to add trailer button
                },
                { title: "Trending Today", endpoint: "/trending/all/day" },
                {
                    title: "Top Movies",
                    endpoint: "/movie/top_rated",
                    type: 'movie',
                    display_style: 'horizontal_backdrop'
                },
                { title: "Popular Movies", endpoint: "/movie/popular", type:'movie' },
                {
                    title: "Top TV Shows",
                    endpoint: "/tv/top_rated",
                    type: 'tv',
                    display_style: 'horizontal_backdrop'
                },
                { title: "Top Rated TV Shows", endpoint: "/tv/top_rated", type:'tv' },
                {
                    title: "New Releases",
                    endpoint: "/movie/upcoming", // Upcoming movies
                    type: 'movie',
                    display_style: 'horizontal_backdrop'
                },
                { title: "Upcoming Movies", endpoint: "/movie/upcoming", type:'movie' },
            ],

            //Notification
            UPCOMING_SECTION_ITEMS: 15, // Number of items to show in the Upcoming section
            // VAPID keys for Web Push. YOU MUST GENERATE YOUR OWN FOR PRODUCTION!
            // These are public keys, keep your private key secure on the server.
            VAPID_PUBLIC_KEY: 'BHxnfKBkk1FQKPerLOSdUucEGpZYuonj-pbX7k9ihm3YgxPWjw3iGmy_82BbeogwQ2qAgc1fLmHizfX439Nkk80', // REPLACE WITH YOUR ACTUAL KEY
            // A placeholder URL for your push subscription endpoint (server-side)
            PUSH_SUBSCRIPTION_ENDPOINT: 'YOUR_BACKEND_PUSH_SUBSCRIPTION_URL', // E.g., /api/subscribe_push
            // A placeholder URL for your push notification triggering endpoint (server-side)
            PUSH_TRIGGER_ENDPOINT: 'YOUR_BACKEND_TRIGGER_NOTIFICATION_URL', // E.g., /api/trigger_notification
            
            SPORTRADAR_BASE_URL: 'https://api.sportradar.com/soccer/trial/v4/en', // Adjust if needed (e.g., /soccer/production/v4/en or api.sportradar.us)
            SPORTRADAR_API_KEY: 'VEv4okaElakk1DyeLIAWsojBisfHllWzPRx3ARjI',
            // ----------------------------------------------------

            SPOTIFY_CLIENT_ID: '414c70fe6b3e4d5f9a8fe0fc8d91a86d', // Replace with your Spotify Client ID
            SPOTIFY_CLIENT_SECRET: 'bf45a79db80444cca0a5e9d85d6cb62f', // Replace with your Spotify Client Secret
            SPOTIFY_TOKEN_URL: 'https://accounts.spotify.com/api/token',
            SPOTIFY_API_BASE_URL: 'https://api.spotify.com/v1',
            CURATED_WATCH_PROVIDERS: [ // Providers for the 'Browse by Network' section
                { id: 8, name: 'Netflix', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/wwemzKWzjKYJFfCeiB57q3r4Bcm.png' },
                { id: 9, name: 'Amazon Prime', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/w7HfLNm9CWwRmAMU58udl2L7We7.png' },
                { id: 337, name: 'Disney+', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/gJ8VX6JSu3ciXHuC2dDGAo2lvwM.png' },
                { id: 1899, name: 'Max', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/rAb4M1LjGpWASxpk6Va791A7Nkw.png' },
                { id: 15, name: 'Hulu', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/pqUTCleNUiTLAVlelGxUgWn1ELh.png' },
                { id: 350, name: 'Apple TV+', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/4KAy34EHvRM25Ih8wb82AuGU7zJ.png' },
                { id: 531, name: 'Paramount+', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/fi83B1oztoS47xxcemFdPMhIzK.png' },
                // Add Buy/Rent links if desired, but maybe filter discover by these?
                { id: 2, name: 'Apple TV', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/bnlD5KJ5oSzBYbEpDkwi6w8SoBO.png' }, // Rent/Buy
                { id: 221, name: 'HBO Max', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/tHZkDWta1FJBG2stKi2aXqwqKYt.png' }, 
                { id: 10, name: 'Amazon Video', logo: '/5NyLm42TmCqCMOZFvH4fcoSNKEW.jpg' }, // Rent/Buy
                { id: 203, name: 'Crunchyroll', logo: 'https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/gNZh44MgDBwipGA9LwozlALjSdE.png' }, // Rent/Buy
            ],
            TARGET_REGION: 'US', // For watch providers and release dates
            // Add bg-primary RGB for overlay gradient
            BG_PRIMARY_RGB: '11, 12, 16', 
            MIN_SKELETON_DISPLAY_TIME: 5000,
        };

        const DOM = {
        // Views
        views: {
            hero: document.getElementById('hero-view'),
            discover: document.getElementById('discover-view'),
            details: document.getElementById('details-view'),
            player: document.getElementById('player-view'),
            genre: document.getElementById('genre-results-view'),
            music: document.getElementById('music-view'),
            livesports: document.getElementById('livesports-view'),
            network: document.getElementById('network-results-view'),
            person: document.getElementById('person-view'),
            watchlist: document.getElementById('watchlist-view'),
            analytics: document.getElementById('analytics-view'),
        },
        // Navbar
        navbarMenu: document.getElementById('navbarNav'),
        tmdbSearchForm: document.getElementById('tmdb-search-form'),
        tmdbSearchInput: document.getElementById('tmdb-search-input'),
        spotifyStatusNavMessage: document.getElementById('spotify-auth-nav-message'),
        genreDropdownMenu: document.getElementById('genre-dropdown-menu'),
        analyticsNavLink: document.querySelector('.nav-link[href="#analytics"]'), // Link to activate analytics view
        // Discover/Home View
        homeContentWrapper: document.getElementById('home-content-wrapper'),
        networkLogosContainer: document.getElementById('network-logos-container'),
        networkPrevBtn: document.getElementById('network-prev-btn'),
        networkNextBtn: document.getElementById('network-next-btn'),
        homeContentSectionsContainer: document.getElementById('home-content-sections'),
        tmdbSearchResultsContainer: document.getElementById('tmdb-search-results-container'),
        tmdbSearchResultsGrid: document.getElementById('tmdb-search-results-grid'),
        tmdbSearchResultsTitle: document.getElementById('tmdb-search-results-title'),
        clearTmdbSearchResultsBtn: document.getElementById('clear-tmdb-search-results'),
        // Details View
        detailsWrapper: document.getElementById('details-content-wrapper'),
        // Genre Results View
        genreResultsGrid: document.getElementById('genre-results-grid'),
        genreResultsTitle: document.getElementById('genre-results-title'),
        loadMoreGenreBtn: document.getElementById('load-more-genre-btn'),
        genreLoadingSpinner: document.getElementById('genre-loading-more-spinner'),
        genreHeaderSection : document.getElementById('genre-header-section'), // New DOM element
        genreResultsTitleDynamic : document.getElementById('genre-results-title-dynamic'), // New title target
        // Network Results View
        networkResultsGrid: document.getElementById('network-results-grid'),
        networkResultsTitle: document.getElementById('network-results-title'),
        loadMoreNetworkBtn: document.getElementById('load-more-network-btn'),
        networkLoadingSpinner: document.getElementById('network-loading-more-spinner'),
        // Livesports
        liveSportsGrid: document.getElementById('livesports-grid'),
        // Person View
        personWrapper: document.getElementById('person-content-wrapper'),
        // Watchlist View
        watchlistGrid: document.getElementById('watchlist-grid'),
        clearWatchlistBtn: document.getElementById('clear-watchlist-btn'),
        // Analytics View Elements (Ensure these IDs are in your HTML's #analytics-view section)
        analyticsContent: document.getElementById('analytics-content'),
        analyticsGenreChartCanvas: document.getElementById('analyticsGenreChartCanvas'),
        analyticsActorChartCanvas: document.getElementById('analyticsActorChartCanvas'),
        analyticsGenreChartPlaceholder: document.getElementById('analyticsGenreChartPlaceholder'),
        analyticsActorChartPlaceholder: document.getElementById('analyticsActorChartPlaceholder'),
        analyticsRecommendedGrid: document.getElementById('analyticsRecommendedGrid'),
        clearAnalyticsHistoryBtn: document.getElementById('clearAnalyticsHistoryBtn'), // Button to clear analytics data
        // Player View
        playerTitleEl: document.getElementById('player-title'),
        playerSourceBtnsContainer: document.getElementById('stream-source-buttons'),
        playerEpisodeSelectorContainer: document.getElementById('episode-selector-container'),
        playerIframe: document.getElementById('streaming-iframe'),
        playerIframePlaceholder: document.getElementById('iframe-placeholder'),
        // Trailer Modal
        trailerModalElement: document.getElementById('trailerModal'),
        trailerModalIframe: document.getElementById('trailerModalIframe'),
        // Connection Explorer Modal
        connectionExplorerModal: document.getElementById('connectionExplorerModal'),
        connectionGraphContainer: document.getElementById('connection-graph-container'),
        connectionGraphLoading: document.getElementById('connection-graph-loading'),
        connectionGraphError: document.getElementById('connection-graph-error'),
        connectionExplorerTitle: document.getElementById('connectionExplorerModalLabel'),
        // Music View
        spotifyStatusArea: document.getElementById('spotify-status-area'),
        spotifyStatusText: document.getElementById('spotify-status-text'),
        spotifyStatusSpinner: document.getElementById('spotify-status-spinner'),
        spotifySearchForm: document.getElementById('spotify-search-form'),
        spotifySearchInput: document.getElementById('spotify-search-input'),
        spotifySearchResultsContainer: document.getElementById('spotify-search-results'),
        spotifySearchLoadingSpinner: document.getElementById('spotify-search-loading'),
        // Visualizer
        visualizerCanvas: document.getElementById('music-visualizer-canvas'),
        visualizerCtx: document.getElementById('music-visualizer-canvas')?.getContext('2d'),
        demoAudioElement: document.getElementById('demo-audio'),
        startVisualizerButton: document.getElementById('start-visualizer-button'),
        // Global Loader/Error (Assume these exist or add them)
        globalLoader: document.getElementById('global-loader') || document.body, // Fallback to body for class toggle
        globalErrorDisplay: document.getElementById('global-error-display'),
        globalErrorMessage: document.getElementById('global-error-message'),
        //Profile
        profileView: document.getElementById('profile-view'),
        profileUserAvatar: document.getElementById('profile-user-avatar'),
        profileUserAvatarInitials: document.getElementById('profile-user-avatar-initials'),
        profileUserAvatarImage: document.getElementById('profile-user-avatar-image'),
        profileDisplayName: document.getElementById('profile-display-name'),
        profileEmail: document.getElementById('profile-email'),
        updateProfileForm: document.getElementById('update-profile-form'),
        profileNameInput: document.getElementById('profile-name-input'),
        updateNameBtn: document.getElementById('update-name-btn'),
        resetPasswordBtn: document.getElementById('reset-password-btn'),
        deleteAccountBtn: document.getElementById('delete-account-btn'),
        profileRecentWatchedWrapper: document.getElementById('profile-recent-watched-wrapper'),
        profileRecentWatchedContainer: document.getElementById('profile-recent-watched-container'),
        profileWatchlistGrid: document.getElementById('profile-watchlist-grid'),
        profileFavoritesGrid: document.getElementById('profile-favorites-grid'),

        // Upcoming Section Elements
        upcomingSection: document.getElementById('upcoming-section'),
        upcomingContainer: document.getElementById('upcoming-container'),

        // Notifications Page Elements
        notificationsView: document.getElementById('notifications-view'),
        notificationSubscriptionsList: document.getElementById('notification-subscriptions-list'),
        requestNotificationPermissionBtn: document.getElementById('request-notification-permission-btn'),
        notificationPermissionStatus: document.getElementById('notification-permission-status'),

    };
        // --- State Variables ---
        const State = {
        currentGenre: null,
        currentNetwork: null,
        tmdbWatchProviders: null,
        currentPersonId: null,
        allMovieGenres: [],
        allTvGenres: [],
        watchlist: [],
        continueWatching: [],
        activeNotificationSubscriptions: [],
        favorites: [], // Assuming AuraStream has a separate favorites list
        horizontalScrollContainers: [],
        tmdbSearchTimeout: null,
        activeSeasonAbortController: null,
        moviePlayerContext: { itemId: null, itemType: null, currentSeason: null, currentEpisode: null },
        spotifyAppAccessToken: null,
        spotifyAppTokenExpiresAt: null,
        spotifyTokenPromise: null,
        visualizerAudioContext: null,
        visualizerAnalyser: null,
        visualizerSource: null,
        visualizerDataArray: null,
        isGraphLoading: false,
        visualizerRafId: null,
        isVisualizerSetup: false,
        isVisualizerConnected: false,
        visNetworkInstance: null,
        currentExplorerItem: null,
        // Analytics State
        userPreferences: { genres: {}, actors: {}, directors: {}, keywords: {} }, // For analytics
        watchHistory: [], // For analytics and continue watching seeds
        genreChartInstance: null, // Chart.js instances
        actorChartInstance: null,
        previousViewHash: null,
        // Helper function to check token validity
        hasValidSpotifyAppToken: () => !!(State.spotifyAppAccessToken && State.spotifyAppTokenExpiresAt && Date.now() < State.spotifyAppTokenExpiresAt),
    };

    const bsInstances = {
        navbarCollapse: null,
        tooltips: [],
        tabs: [],
        trailerModal: null,
        connectionModal: null,
    };

    const Watchlist = {
        STORAGE_KEY: 'auraStreamWatchlist',
        load: () => { try { const d = localStorage.getItem(Watchlist.STORAGE_KEY); State.watchlist = d ? JSON.parse(d) : []; } catch (e) { console.error("Watchlist load failed:", e); State.watchlist = []; localStorage.removeItem(Watchlist.STORAGE_KEY); } },
        save: () => { try { localStorage.setItem(Watchlist.STORAGE_KEY, JSON.stringify(State.watchlist)); } catch (e) { console.error("Watchlist save failed:", e); } },
        add: (d) => { if (!d?.id || !d?.type || Watchlist.isInWatchlist(d.id, d.type)) return false; const i = { id: d.id, type: d.type, title: d.title || d.name || 'N/A', poster_path: d.poster_path, backdrop_path: d.backdrop_path, vote_average: d.vote_average }; State.watchlist.push(i); Watchlist.save(); Utils.showToast(`${i.title} added to watchlist!`, "success"); return true; },
        remove: (id, t) => { const l = State.watchlist.length; const i = parseInt(id); State.watchlist = State.watchlist.filter(d => !(d.id === i && d.type === t)); if (State.watchlist.length < l) { Watchlist.save(); Utils.showToast("Item removed from watchlist.", "info"); return true; } return false; },
        clear: () => { State.watchlist = []; Watchlist.save(); Utils.showToast("Watchlist cleared.", "info"); },
        isInWatchlist: (id, t) => { const i = parseInt(id); return State.watchlist.some(d => d.id === i && d.type === t); }
    };

 


    
    // V V V REPLACE THE ENTIRE OLD ContinueWatching OBJECT WITH THIS V V V
const ContinueWatching = {
    _cache: [], // In-memory cache for fast UI rendering.
    _trackingInterval: null, // Holds the setInterval ID for progress saving.
    _currentItem: null, // Holds details of the item currently being tracked.

    /**
     * Loads the user's watch history from Firestore into the local cache.
     * Called on user login.
     */
    load: async () => {
        if (!appAuth?.currentUser || !appDb) {
            console.warn("[CW] Cannot load from Firestore: User not logged in or DB not ready.");
            ContinueWatching._cache = [];
            return;
        }
        const userId = appAuth.currentUser.uid;
        console.log(`[CW] Loading watch history for user: ${userId}`);
        try {
            const snapshot = await appDb.collection("users").doc(userId).collection("watchHistory")
                .orderBy("lastWatchedTimestamp", "desc")
                .limit(20) // Get the 20 most recently watched items
                .get();

            ContinueWatching._cache = snapshot.docs.map(doc => {
                const data = doc.data();
                // Convert Firestore timestamp to JS milliseconds
                data.lastWatchedTimestamp = data.lastWatchedTimestamp?.toDate().getTime();
                return data;
            });
            console.log(`[CW] Loaded ${ContinueWatching._cache.length} items from Firestore.`);
        } catch (error) {
            console.error("Error loading watch history from Firestore:", error);
            ContinueWatching._cache = [];
            Utils.showToast("Could not load your watch history.", "danger");
        }
    },
    
    /**
     * Clears the local cache and stops any tracking. Called on logout.
     */
    clear: () => {
        ContinueWatching.stopTracking();
        ContinueWatching._cache = [];
        console.log("[CW] Local cache cleared on logout.");
    },

    /**
     * Starts tracking viewing progress for a specific item.
     * Called when the player view is loaded.
     * @param {object} itemDetails - Full TMDB object for the movie/show.
     * @param {object} tvDetails - Contains seasonNumber and episodeNumber for TV shows.
     */
    startTracking: (itemDetails, tvDetails) => {
        ContinueWatching.stopTracking(); // Stop any previous tracking first.

        if (!appAuth?.currentUser) {
            console.log("[CW] User not logged in. Skipping progress tracking.");
            return;
        }

        const duration = itemDetails.runtime || itemDetails.episode_run_time?.[0];
        if (!duration) {
            console.warn("[CW] Cannot track progress: item duration is unknown.", itemDetails);
            return;
        }

        ContinueWatching._currentItem = {
            id: itemDetails.id,
            type: itemDetails.title ? 'movie' : 'tv',
            title: itemDetails.title || itemDetails.name,
            poster_path: itemDetails.poster_path,
            backdrop_path: itemDetails.backdrop_path,
            vote_average: itemDetails.vote_average,
            totalDurationMinutes: duration,
            seasonNumber: tvDetails?.seasonNumber || null,
            episodeNumber: tvDetails?.episodeNumber || null,
            episodeTitle: tvDetails?.episodeTitle || null,
            startTime: Date.now(), // Record when tracking started
        };
        
        console.log("[CW] Started tracking:", ContinueWatching._currentItem.title);
        
        // Save progress every 30 seconds
        ContinueWatching._trackingInterval = setInterval(ContinueWatching._saveProgress, 30000);
    },

    /**
     * Stops the progress tracking timer, performs a final save, and clears the current item.
     * Called when the user navigates away from the player.
     */
    stopTracking: () => {
        if (ContinueWatching._trackingInterval) {
            clearInterval(ContinueWatching._trackingInterval);
            ContinueWatching._trackingInterval = null;
        }
        if (ContinueWatching._currentItem) {
            console.log("[CW] Stopping tracking. Performing final save for:", ContinueWatching._currentItem.title);
            ContinueWatching._saveProgress(); // Perform one final save.
            ContinueWatching._currentItem = null;
        }
    },

    /**
     * Internal function to calculate progress and save it to Firestore.
     */
    _saveProgress: async () => {
        const item = ContinueWatching._currentItem;
        if (!item || !appAuth?.currentUser || !appDb) return;

        const userId = appAuth.currentUser.uid;
        
        // Create a unique ID for the document (e.g., "tv-1399-s1-e5")
        const docId = item.type === 'movie'
            ? `movie-${item.id}`
            : `tv-${item.id}-s${item.seasonNumber}-e${item.episodeNumber}`;

        const elapsedSeconds = (Date.now() - item.startTime) / 1000;
        // For this demo, we'll assume progress is linear from when they start.
        // A more complex system might try to get progress from a video element if it were not an iframe.
        let progressPercent = Math.round((elapsedSeconds / (item.totalDurationMinutes * 60)) * 100);
        progressPercent = Math.min(Math.max(progressPercent, 0), 100); // Clamp between 0-100

        const dataToSave = {
            ...item, // includes id, type, title, poster, etc.
            lastWatchedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            progressPercent: progressPercent,
        };
        delete dataToSave.startTime; // We don't need to store this part in Firestore.

        try {
            const docRef = appDb.collection("users").doc(userId).collection("watchHistory").doc(docId);
            await docRef.set(dataToSave, { merge: true });

            console.log(`[CW] Saved progress for ${docId}: ${progressPercent}%`);

            // Update the in-memory cache for immediate UI updates
            const cacheIndex = ContinueWatching._cache.findIndex(i => i.docId === docId);
            const cacheItem = { ...dataToSave, docId, lastWatchedTimestamp: Date.now() };
            if (cacheIndex > -1) {
                ContinueWatching._cache[cacheIndex] = cacheItem;
            } else {
                ContinueWatching._cache.unshift(cacheItem);
            }
            // Re-sort and trim the cache
            ContinueWatching._cache.sort((a, b) => b.lastWatchedTimestamp - a.lastWatchedTimestamp);
            ContinueWatching._cache = ContinueWatching._cache.slice(0, 20);

        } catch (error) {
            console.error(`[CW] Failed to save progress for ${docId}:`, error);
        }
    },

    /**
     * Gets the current list from the in-memory cache.
     */
    getCache: () => {
        return ContinueWatching._cache;
    }
};


        // --- Utilities ---
        const Utils = {
            // Debounce function to limit rate of function calls
            /*debounce: (func, delay) => {
                let timeoutId;
                return (...args) => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        func.apply(this, args);
                    }, delay);
                };
            },*/ 

             debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    },

            // Generate HTML for a loading spinner
            getSpinnerHTML: (text = 'Loading...', large = false) => `
                <div class="loading-spinner" style="min-height: ${large ? '300px':'150px'};">
                    <div class="spinner-border ${large ? 'spinner-border-lg ':''}text-primary" role="status">
                        <span class="visually-hidden">${text}</span>
                    </div>
                </div>`,

            // Generate HTML for an error message
            getErrorHTML: (message) => `
                <div class="alert alert-danger d-flex align-items-center my-3" role="alert">
                    <i class="bi bi-exclamation-circle-fill me-2 flex-shrink-0"></i>
                    <div>${Utils.escapeHtml(message)}</div>
                </div>`,

             // Navigate back or to home if history is empty
             goBackOrHome: () => {
                 if (history.length > 1) {
                     history.back();
                 } else {
                     location.hash = '#home'; // Go home if no history
                 }
             },

             // --- NEW: Skeleton Generator Functions ---

            // Generates HTML for vertical skeleton cards
            getSkeletonCardHTML: (count = 6) => {
                let cardsHtml = '';
                for (let i = 0; i < count; i++) {
                    cardsHtml += `
                        <div class="col">
                            <div class="skeleton-card">
                                <div class="skeleton skeleton-card-img"></div>
                                <div class="skeleton-card-body">
                                    <div class="skeleton skeleton-title"></div>
                                    <div class="skeleton skeleton-text-sm"></div>
                                </div>
                            </div>
                        </div>`;
                }
                // Note: Container should be the <div class="row ...">
                return cardsHtml;
            },

            // Generates HTML for Live Score skeleton cards
            getSkeletonLiveScoreCardHTML: (count = 4) => {
                let cardsHtml = '';
                for (let i = 0; i < count; i++) {
                    // Uses col classes directly to match the final layout
                    cardsHtml += `
                        <div class="col-12 col-md-6 col-lg-4"> 
                            <div class="skeleton-livescore-card">
                                <div class="skeleton-league-info">
                                    <div class="skeleton skeleton-league-logo"></div>
                                    <div class="skeleton skeleton-league-name"></div>
                                    <div class="skeleton skeleton-status-indicator ms-auto"></div>
                                </div>
                                <div class="skeleton-match-details">
                                    <div class="skeleton-team">
                                        <div class="skeleton skeleton-team-logo"></div>
                                        <div class="skeleton skeleton-team-name"></div>
                                    </div>
                                    <div class="skeleton-score-info">
                                        <div class="skeleton skeleton-score"></div>
                                    </div>
                                    <div class="skeleton-team">
                                        <div class="skeleton skeleton-team-logo"></div>
                                        <div class="skeleton skeleton-team-name"></div>
                                    </div>
                                </div>
                                <div class="skeleton-card-actions">
                                    <div class="skeleton skeleton-card-button"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                return cardsHtml; // Return the columns directly
            },

            // Generates HTML for horizontal skeleton cards
            getSkeletonHorizontalCardHTML: (count = 5) => {
                let cardsHtml = '';
                for (let i = 0; i < count; i++) {
                    cardsHtml += `
                        <div class="skeleton-h-card">
                            <div class="skeleton skeleton-h-card-backdrop"></div>
                            <div class="skeleton-h-card-overlay">
                                <div class="skeleton skeleton-h-title"></div>
                                <div class="skeleton skeleton-h-text-sm"></div>
                            </div>
                        </div>`;
                }
                // Container should be the flexbox .horizontal-card-container
                return cardsHtml;
            },

            // Generates HTML for the Hero section skeleton
            getSkeletonHeroHTML: () => {
            // Use consistent structure with real render
            return `
                <div class="skeleton skeleton-hero-backdrop"></div> 
                <div class="hero-overlay"></div> 
                <div class="container hero-content">
                  
                    <div class="hero-genres mb-3">
                       <span class="skeleton skeleton-badge" style="width: 70px;"></span>
                       <span class="skeleton skeleton-badge" style="width: 90px;"></span>
                       <span class="skeleton skeleton-badge" style="width: 60px;"></span>
                    </div>
            
                    <div class="skeleton skeleton-title mb-3" style="height: 2.5em; width: 65%; max-width: 500px;"></div>
                    <div class="hero-meta mb-3">
                        <span class="skeleton skeleton-text-sm" style="width: 90px;"></span> 
                        <span class="skeleton skeleton-text-sm" style="width: 70px;"></span>
                        <span class="skeleton skeleton-text-sm" style="width: 100px;"></span> 
                    </div>
                  
                    <div class="skeleton skeleton-text mb-1" style="width: 95%; max-width: 650px;"></div>
                    <div class="skeleton skeleton-text mb-1" style="width: 90%; max-width: 620px;"></div>
                    <div class="skeleton skeleton-text mb-4" style="width: 80%; max-width: 580px;"></div>
    
                    <div class="hero-actions mt-4">
                        <div class="skeleton skeleton-button" style="height: 48px; width: 150px;"></div>
                        <div class="skeleton skeleton-button" style="height: 48px; width: 140px;"></div>
                    </div>
                </div>`;
        },

            // Generates HTML for the Details page skeleton
            getSkeletonDetailsHTML: () => {
                 // Pre-generate skeleton grids for cast/similar
                 const skeletonCastGrid = Utils.getSkeletonCardHTML(6); // 6 cards for cast/similar sections
                 const skeletonSimilarGrid = Utils.getSkeletonCardHTML(6);
                 const skeletonSeasonTabs = `
                    <li class="nav-item"><span class="skeleton skeleton-button" style="width: 100px; height: 40px; margin-right: 0.5rem;"></span></li>
                    <li class="nav-item"><span class="skeleton skeleton-button" style="width: 100px; height: 40px; margin-right: 0.5rem;"></span></li>
                    <li class="nav-item"><span class="skeleton skeleton-button" style="width: 100px; height: 40px;"></span></li>
                 `;
                 const skeletonEpisodePane = Utils.getSkeletonEpisodeHTML(1); // Show one loading episode

                 return `
                    <div class="skeleton skeleton-details-backdrop"></div>
                    <div class="container details-content-overlay">
                         <div class="skeleton skeleton-button mb-4" style="height: 31px; width: 80px;"></div>
                         <div class="details-header row mb-5 align-items-center">
                             <div class="details-poster col-lg-3 col-md-4 text-center text-md-start mb-4 mb-md-0">
                                 <div class="skeleton skeleton-details-poster"></div>
                             </div>
                             <div class="details-info col-lg-9 col-md-8">
                                 <div class="skeleton skeleton-details-title"></div>
                                 <div class="skeleton-details-meta">
                                     <span class="skeleton skeleton-text-sm" style="width: 60px; display:inline-block; margin-right: 1rem;"></span>
                                     <span class="skeleton skeleton-text-sm" style="width: 80px; display:inline-block; margin-right: 1rem;"></span>
                                     <span class="skeleton skeleton-text-sm" style="width: 90px; display:inline-block;"></span>
                                 </div>
                                 <div class="skeleton-details-genres mb-3">
                                     <div class="skeleton skeleton-details-genre-badge"></div>
                                     <div class="skeleton skeleton-details-genre-badge"></div>
                                     <div class="skeleton skeleton-details-genre-badge"></div>
                                 </div>
                                 <div class="skeleton skeleton-details-heading" style="width: 150px;"></div>
                                 <div class="skeleton skeleton-details-text"></div>
                                 <div class="skeleton skeleton-details-text"></div>
                                 <div class="skeleton skeleton-details-text-short mb-4"></div>

                                 <div class="skeleton skeleton-details-text-short mb-1" style="width: 200px;"></div>
                                 <div class="skeleton skeleton-details-text-short mb-3" style="width: 250px;"></div>

                        
                                 <div class="skeleton skeleton-details-heading" style="width: 120px; margin-top: 1rem;"></div>
                                 <div class="skeleton mb-3" style="height: 70px; width: 100%;"></div>
                                 <div class="skeleton skeleton-button mb-4" style="height: 31px; width: 160px;"></div>


                                 <div class="details-actions mt-4">
                                     <div class="skeleton skeleton-details-button"></div>
                                     <div class="skeleton skeleton-details-button" style="width: 160px;"></div>
                                 </div>
                             </div>
                         </div>
                        <div class="details-section season-episode-section mt-5">
                             <div class="skeleton skeleton-details-heading" style="width: 280px;"></div>
                             <ul class="nav nav-pills mb-4 flex-nowrap" style="overflow-x: auto; white-space: nowrap;">${skeletonSeasonTabs}</ul>
                             <div class="tab-content">
                                <div class="tab-pane fade show active">${skeletonEpisodePane}</div>
                             </div>
                         </div>

                         <div class="details-section mt-5">
                             <div class="skeleton skeleton-details-heading"></div>
                             <div class="row g-3 row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6">
                                 ${skeletonCastGrid}
                             </div>
                         </div>

                         <div class="details-section mt-5">
                             <div class="skeleton skeleton-details-heading" style="width: 250px;"></div>
                             <div class="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">
                                 ${skeletonSimilarGrid}
                             </div>
                         </div>

                          <div class="details-section mt-5">
                             <div class="skeleton skeleton-details-heading" style="width: 300px;"></div>
                             <div class="d-flex flex-wrap gap-3 align-items-center">
                                <div class="skeleton" style="width: 50px; height: 50px; border-radius: var(--radius-sm);"></div>
                                <div class="skeleton" style="width: 50px; height: 50px; border-radius: var(--radius-sm);"></div>
                                <div class="skeleton" style="width: 50px; height: 50px; border-radius: var(--radius-sm);"></div>
                             </div>
                          </div>

                    </div>
                 `;
            },

            // Generates HTML for the Person page skeleton
            getSkeletonPersonHTML: () => {
                const skeletonCardGrid = Utils.getSkeletonCardHTML(6); // For known for
                return `
                <div class="row person-header mb-4 mb-md-5">
                    <div class="col-md-4 col-lg-3 person-profile-pic text-center text-md-start mb-4 mb-md-0">
                         <div class="skeleton skeleton-person-profile mx-auto mx-md-0"></div>
                    </div>
                    <div class="col-md-8 col-lg-9 person-info">
                        <div class="skeleton skeleton-person-name mb-3"></div>
                    
                        <div class="person-social-links mt-2 mb-3">
                            <span class="skeleton skeleton-button" style="width: 30px; height: 30px; border-radius: 50%;"></span>
                            <span class="skeleton skeleton-button" style="width: 30px; height: 30px; border-radius: 50%;"></span>
                        </div>
                        <div class="person-meta mb-4">
                           <div class="skeleton skeleton-person-meta mb-2"></div>
                           <div class="skeleton skeleton-person-meta mb-2"></div>
                           <div class="skeleton skeleton-person-meta" style="width: 60%;"></div>
                        </div>

                     
                        <div class="details-section mt-4">
                            <div class="skeleton skeleton-details-heading" style="width: 180px;"></div>
                            <div class="skeleton mb-3" style="min-height: 60px; width: 100%;"></div>
                            <div class="skeleton skeleton-button mb-4" style="height: 31px; width: 180px;"></div>
                        </div>

                        <div class="skeleton skeleton-details-heading" style="width: 150px; margin-top: 2rem;"></div>
                        <div class="person-bio">
                             <div class="skeleton skeleton-bio-line"></div>
                             <div class="skeleton skeleton-bio-line"></div>
                             <div class="skeleton skeleton-bio-line short"></div>
                             <div class="skeleton skeleton-bio-line"></div>
                             <div class="skeleton skeleton-bio-line final"></div>
                        </div>
                    </div>
                </div>
                 <div class="filmography-section mt-5">
                     <div class="skeleton skeleton-details-heading" style="width: 180px;"></div>
                     <div id="person-known-for-grid" class="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">
                         ${skeletonCardGrid}
                     </div>
                 </div>
                `;
            },

            // Generates HTML for episode item skeletons
            getSkeletonEpisodeHTML: (count = 3) => {
                let episodesHtml = '';
                for (let i = 0; i < count; i++) {
                    episodesHtml += `<div class="skeleton-episode">
                             <div class="skeleton skeleton-episode-still flex-shrink-0"></div>
                             <div class="episode-details flex-grow-1">
                                 <div class="skeleton skeleton-episode-title mb-1"></div>
                                 <div class="skeleton skeleton-episode-meta mb-2"></div>
                                 <div class="skeleton skeleton-episode-text mb-1"></div>
                                 <div class="skeleton skeleton-episode-text short mb-3"></div>
                                 <div class="skeleton skeleton-episode-button"></div>
                             </div>
                         </div>`;
                }
                return episodesHtml;
            },

             // Generates HTML for Spotify track list skeletons
             getSkeletonSpotifyTrackHTML: (count = 5) => {
                 let tracksHtml = '';
                 for (let i = 0; i < count; i++) {
                     tracksHtml += `
                         <li class="list-group-item d-flex align-items-center skeleton-spotify-item">
                             <div class="skeleton skeleton-spotify-img"></div>
                             <div class="track-info flex-grow-1 overflow-hidden me-2">
                                 <div class="skeleton skeleton-spotify-title"></div>
                                 <div class="skeleton skeleton-spotify-artist"></div>
                             </div>
                             <div class="skeleton skeleton-spotify-button"></div>
                         </li>
                     `;
                 }
                 // Assuming the container is the <ul>
                 return tracksHtml; // Return list items directly
             },

             // Generates HTML for network logo skeletons
             getSkeletonNetworkLogoHTML: (count = 8) => {
                 let logosHtml = '';
                 for (let i = 0; i < count; i++) {
                     logosHtml += `<div class="skeleton skeleton-network-logo"></div>`;
                 }
                 // Return directly as they are usually in a flex container
                 return logosHtml;
             },

            setElementVisibility: (element, isVisible) => {
                if (element) {
                    element.classList.toggle('d-none', !isVisible);
                    // Optional: Set aria-hidden for accessibility
                    element.setAttribute('aria-hidden', String(!isVisible));
                } else {
                  // console.warn("Attempted to set visibility on null element");
                }
            },

             // Format date string (e.g., "Jan 1, 2023")
            formatAirDate: (dateString) => {
                try {
                    if (!dateString) return 'N/A';
                    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                } catch (e) {
                    console.warn("Date formatting failed:", dateString, e);
                    return dateString || 'N/A'; // Fallback
                }
            },

            // Format runtime from minutes (e.g., "1h 30m")
            formatRuntime: (minutes) => {
                if (!minutes || minutes < 1) return '';
                const h = Math.floor(minutes / 60);
                const m = minutes % 60;
                const parts = [];
                if (h > 0) parts.push(`${h}h`);
                if (m > 0) parts.push(`${m}m`);
                return parts.join(' ') || 'N/A';
            },

            // Find genre name from ID and type
            findGenreName: (type, id) => {
                const list = type === 'movie' ? State.allMovieGenres : State.allTvGenres;
                return list.find(g => g.id === id)?.name || 'Unknown';
            },

             // Format milliseconds to m:ss
            formatTime: (ms) => {
                if (isNaN(ms) || ms < 0) return '0:00';
                const totalSeconds = Math.floor(ms / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            },

            // Show a Bootstrap toast notification
            showToast: (message, type = 'danger') => {
                const toastId = 'toast-' + Date.now();
                const toastWrapper = document.createElement('div');
                toastWrapper.style.cssText = 'position:fixed; top:80px; right:20px; z-index:2050; min-width:300px; max-width:400px;';
                toastWrapper.innerHTML = `
                    <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0 fade" role="alert" aria-live="assertive" aria-atomic="true">
                      <div class="d-flex">
                        <div class="toast-body">${message}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                      </div>
                    </div>`;
                document.body.appendChild(toastWrapper);
                const toastEl = document.getElementById(toastId);
                if (!toastEl) return;
                const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 6000 });
                toastInstance.show();
                // Clean up after hide
                toastEl.addEventListener('hidden.bs.toast', () => toastWrapper.remove());
            },

            // Toggle visibility using d-none class
            setElementVisibility: (element, isVisible) => {
                if (element) {
                    element.classList.toggle('d-none', !isVisible);
                }
            },

            // Basic HTML escaping
            /*escapeHtml: (unsafe) => {
                 return unsafe === null || unsafe === undefined ? '' : String(unsafe)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            },*/

             escapeHtml: (unsafe) => {
        return unsafe === null || unsafe === undefined ? '' : String(unsafe)
            .replace(/&/g, "&")
            .replace(/</g, "<")
            .replace(/>/g, ">")
            .replace(/"/g, '"')
            .replace(/'/g, "'");
    },
        };

        // --- API Fetching ---
        const API = {
            // Get Spotify App Token (Client Credentials Flow)
            getSpotifyAppToken: async () => {
                // Return immediately if valid token exists
                if (State.hasValidSpotifyAppToken()) {
                    return State.spotifyAppAccessToken;
                }
                // If a request is already in progress, return its promise
                if (State.spotifyTokenPromise) {
                    return State.spotifyTokenPromise;
                }

                 App.setSpotifyStatus("Authorizing App...", "info", true);

                // Encode Client ID and Secret
                const credentials = `${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`;
                const encodedCredentials = btoa(credentials); // Base64 encode

                // Start the fetch request and store the promise
                State.spotifyTokenPromise = fetch(config.SPOTIFY_TOKEN_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${encodedCredentials}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'grant_type=client_credentials'
                })
                .then(async response => {
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(`Token Request Failed (${response.status}): ${errorData.error_description || response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    State.spotifyAppAccessToken = data.access_token;
                    // Set expiry time (e.g., 60 seconds buffer before actual expiry)
                    State.spotifyAppTokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
                    App.setSpotifyStatus("Authorized", "success", false);
                    State.spotifyTokenPromise = null; // Clear promise on success
                    return State.spotifyAppAccessToken;
                })
                .catch(error => {
                    console.error("Spotify Token Acquisition Failed:", error);
                    Utils.showToast(`Auth Error: ${error.message}`, "danger");
                    App.setSpotifyStatus(`Spotify Auth Failed: ${error.message}`, "danger", false);
                    State.spotifyAppAccessToken = null;
                    State.spotifyAppTokenExpiresAt = null;
                    State.spotifyTokenPromise = null; // Clear promise on error
                    throw error; // Re-throw for calling functions to handle
                });

                return State.spotifyTokenPromise;
            },



            /*fetchSportMonks: async (endpoint, params = {}) => {
                // --- PRODUCTION WARNING ---
               if (!config.SPORTMONKS_API_TOKEN || config.SPORTMONKS_API_TOKEN === 'YOUR_SPORTMONKS_API_TOKEN_HERE') {
                    console.error("SportMonks API Token missing or is still the placeholder value in the 'config' object. Please add your valid token.");
                    Utils.showToast("Live Sports configuration error. Check API Token.", "danger");
                    return null;
                }

                if (!config.SPORTMONKS_BASE_URL) {
                    console.error("SportMonks Base URL (SPORTMONKS_BASE_URL) is missing in the 'config' object.");
                    Utils.showToast("Live Sports configuration error. Check Base URL.", "danger");
                    return null;
                }

                // In production, replace direct token usage with a call to your backend proxy.
                const urlParams = new URLSearchParams({
                    api_token: config.SPORTMONKS_API_TOKEN, // Use the configured token
                    ...params
                });
               // Clean up null/empty params
                Object.keys(params).forEach(key => {
                    if (params[key] == null || params[key] === '') {
                        urlParams.delete(key);
                    }
                });
                // Handle includes array correctly
                if (Array.isArray(params.include)) {
                    urlParams.set('include', params.include.join(','));
                } else if (params.include === '') {
                // If include was explicitly set to empty string, remove it
                urlParams.delete('include');
            }


            const url = `${config.SPORTMONKS_BASE_URL}${endpoint}?${urlParams.toString()}`;


            try {
                    const response = await fetch(url, { signal: params.signal });
                    const data = await response.json();

                    if (!response.ok) {
                        const errorMessage = data?.message || `SportMonks API Error ${response.status}`;
                        console.error("SportMonks API Error:", response.status, errorMessage, data);
                        if (response.status === 401 || response.status === 403) {
                             throw new Error(`SportMonks Auth Error: ${errorMessage}. Check API Token/Permissions.`);
                         }
                         if (response.status === 429) {
                             throw new Error(`SportMonks Rate Limit Exceeded: ${errorMessage}`);
                         }
                        throw new Error(errorMessage);
                    }
                    return data?.data || data;

                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error(`SportMonks Fetch Error (${endpoint}):`, error);
                        Utils.showToast(`Live Sports Error: ${error.message}`, "danger");
                    } else {
                        console.log(`SportMonks Request Aborted (${endpoint})`);
                    }
                    return null; // Indicate failure
                }
            },*/
    
            
            fetchSportradar: async (endpoint, params = {}) => {
                // Check configuration
                if (!config.SPORTRADAR_API_KEY || config.SPORTRADAR_API_KEY === 'YOUR_SPORTRADAR_API_KEY_HERE') { // Check for placeholder too
                    console.error("Sportradar API Key (SPORTRADAR_API_KEY) missing or placeholder in 'config'.");
                    Utils.showToast("Live Sports configuration error. Check API Key.", "danger");
                    return null;
                }
                if (!config.SPORTRADAR_BASE_URL) {
                    console.error("Sportradar Base URL (SPORTRADAR_BASE_URL) is missing in 'config'.");
                    Utils.showToast("Live Sports configuration error. Check Base URL.", "danger");
                    return null;
                }
                  // --- SECURITY WARNING ---
                // Exposing API keys client-side is generally insecure for production apps.
                // Consider a backend proxy to handle API requests.
                // console.warn("Sportradar API key is used directly client-side. Use a backend proxy for production.");

                // Add API key to parameters
                const urlParams = new URLSearchParams({
                    ...params,
                    api_key: config.SPORTRADAR_API_KEY // Add the API key here
                });

                // Clean up null/empty params (optional, Sportradar might ignore them)
                 Object.keys(params).forEach(key => {
                     if (params[key] == null || params[key] === '') {
                         urlParams.delete(key);
                     }
                 });

                // Construct the full URL
                const url = `${config.SPORTRADAR_BASE_URL}${endpoint}?${urlParams.toString()}`;

                try {
                    const response = await fetch(url, { signal: params.signal }); // Support cancellation
                    const data = await response.json();

                    if (!response.ok) {
                        // Attempt to get a specific error message from Sportradar response
                        const errorMessage = data?.message || `Sportradar API Error ${response.status}`;
                        console.error("Sportradar API Error:", response.status, errorMessage, data);
                        if (response.status === 401 || response.status === 403) {
                             throw new Error(`Sportradar Auth Error: ${errorMessage}. Check API Key/Permissions.`);
                         }
                         if (response.status === 404) {
                            throw new Error(`Sportradar Endpoint Not Found (404): ${endpoint}`);
                         }
                        throw new Error(errorMessage);
                    }

                    // Sportradar endpoints often wrap results. Return the relevant part.
                    // For /live/summaries.json, it's usually data.summaries
                    // Adjust this based on the specific endpoint used.
                    // If the root object IS the array, just return data.
                    return data.summaries || data; // COMMON: Return 'summaries' array, fallback to data itself

                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error(`Sportradar Fetch Error (${endpoint}):`, error);
                        Utils.showToast(`Live Sports Error: ${error.message}`, "danger");
                    } else {
                        console.log(`Sportradar Request Aborted (${endpoint})`);
                    }
                    return null; // Indicate failure
                }
            },

        

            // Generic Spotify API Fetcher (uses App Token)
            fetchSpotify: async (endpoint, method = 'GET', body = null) => {
                 let accessToken;
                 try {
                     accessToken = await API.getSpotifyAppToken();
                 } catch (tokenError) {
                     return null; // Token fetching failed
                 }

                 if (!accessToken) {
                     // This case should ideally be handled by getSpotifyAppToken's error throwing
                     // but added as a safeguard.
                     Utils.showToast("Spotify token missing.", "danger");
                     return null;
                 }

                const url = `${config.SPOTIFY_API_BASE_URL}${endpoint}`;
                const options = {
                    method: method,
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                };

                if (body && method !== 'GET') {
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(body);
                }

                try {
                    const response = await fetch(url, options);

                    // Handle responses with no content (e.g., 204 No Content, 202 Accepted)
                    if (response.status === 204 || response.status === 202) {
                        return { success: true }; // Indicate success with no body
                    }

                    // Try to parse JSON, clone response as .json() consumes the body
                    const responseBody = await response.clone().json().catch(() => null);

                    if (!response.ok) {
                        const errorMessage = responseBody?.error?.message || `Spotify API Error ${response.status}`;
                        console.error("Spotify API Error:", response.status, errorMessage, responseBody);
                        // Handle potential token expiration/invalidation
                        if (response.status === 401 || response.status === 403) {
                             State.spotifyAppAccessToken = null; // Force re-auth on next call
                             State.spotifyAppTokenExpiresAt = null;
                        }
                        Utils.showToast(`Spotify API Error: ${errorMessage}`, "warning");
                        return null; // Indicate failure
                    }

                    return responseBody || { success: true }; // Return parsed body or success object if body was empty but OK

                } catch (error) {
                    console.error("Spotify Network Fetch Error:", error);
                    Utils.showToast("Network error fetching Spotify data.", "danger");
                    return null;
                }
            },

            // Generic TMDB API Fetcher
            fetchTMDB: async (endpoint, params = {}) => {
                const urlParams = new URLSearchParams({
                    api_key: config.TMDB_API_KEY,
                    language: 'en-US', // Or make dynamic if needed
                    ...params
                });

                // Clean up null/empty params
                 Object.keys(params).forEach(key => {
                     if (params[key] == null || params[key] === '') {
                         urlParams.delete(key);
                     }
                 });
                // Ensure append_to_response is comma-separated if it's an array
                if (Array.isArray(params.append_to_response)) {
                    urlParams.set('append_to_response', params.append_to_response.join(','));
                }


                const url = `${config.TMDB_BASE_URL}${endpoint}?${urlParams.toString()}`;

                try {
                    const response = await fetch(url, { signal: params.signal }); // Pass signal for cancellation
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(`TMDB API Error ${response.status}: ${errorData.status_message || 'Failed to fetch'}`);
                    }
                    return await response.json();
                } catch (error) {
                     if (error.name !== 'AbortError') { // Don't show toast for deliberate cancellations
                        console.error(`TMDB Fetch Error (${endpoint}):`, error);
                        Utils.showToast(`TMDB API Error: ${error.message}`, "danger");
                     } else {
                         console.log(`TMDB Request Aborted (${endpoint})`);
                     }
                    return null; // Indicate failure
                }
            },

             // --- NEW: Fetch from Gemini API ---
             fetchGemini: async (prompt) => {
                // --- SECURITY WARNING ---
                // This function uses the API key directly client-side.
                // THIS IS UNSAFE FOR PRODUCTION. Use a backend proxy.
                if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
                     console.error("Gemini API Key is missing or placeholder.");
                     Utils.showToast("AI Feature Configuration Error.", "danger");
                     return null;
                 }

                const url = `${config.GEMINI_API_URL}:generateContent?key=${config.GEMINI_API_KEY}`;
                const requestBody = {
                    // Using the simpler v1beta structure for basic text prompts
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    // Optional: Add safety settings if needed
                    // "safetySettings": [
                    //   { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" }
                    // ],
                    // Optional: Configure generation parameters
                    // "generationConfig": {
                    //   "temperature": 0.7,
                    //   "maxOutputTokens": 150
                    // }
                };

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error("Gemini API Error Response:", errorData);
                        throw new Error(`Gemini API Error ${response.status}: ${errorData?.error?.message || response.statusText}`);
                    }

                    const data = await response.json();

                    // --- Process Gemini Response ---
                    // Check for safety blocks or lack of content
                    if (!data.candidates || data.candidates.length === 0) {
                        const blockReason = data.promptFeedback?.blockReason;
                        if (blockReason) {
                            console.warn("Gemini response blocked due to safety:", blockReason);
                            throw new Error(`AI response blocked (${blockReason}). Try a different request.`);
                        } else {
                            console.warn("Gemini response missing candidates:", data);
                            throw new Error("AI returned no content.");
                        }
                    }

                    // Basic check for safety ratings on the first candidate
                     const safetyRatings = data.candidates[0]?.safetyRatings;
                     if (safetyRatings) {
                         const blocked = safetyRatings.some(rating => rating.probability !== 'NEGLIGIBLE' && rating.probability !== 'LOW');
                         // You might want stricter checks depending on the probability levels
                         if (blocked) {
                             const blockedCategories = safetyRatings.filter(r => r.probability !== 'NEGLIGIBLE' && r.probability !== 'LOW').map(r => r.category).join(', ');
                             console.warn("Gemini response potentially unsafe:", blockedCategories);
                             // Decide whether to block or show warning - blocking is safer
                             throw new Error(`AI response flagged for safety (${blockedCategories}).`);
                         }
                     }

                    // Extract text content
                    const text = data.candidates[0]?.content?.parts?.[0]?.text;
                    if (!text) {
                         console.warn("Could not extract text from Gemini response:", data.candidates[0]);
                         throw new Error("AI returned an unexpected response format.");
                    }

                    return text.trim(); // Return the generated text

                } catch (error) {
                    console.error("Gemini Fetch Error:", error);
                    Utils.showToast(`AI Request Failed: ${error.message}`, "warning");
                    return null; // Indicate failure
                }
            },
        };

        // --- Routing Module ---
        const Router = {
             updateView: (hash) => {
                 console.log("Routing to:", hash);
                 hash = hash || location.hash || '#home'; // Default to #home
                 if (hash === '#') hash = '#home'; // Handle empty hash

                // <<< FIX: STOP TRACKING WHEN LEAVING THE PLAYER VIEW
                if (State.previousViewHash && State.previousViewHash.startsWith('#player=')) {
                    console.log("[Router] Navigating away from player, stopping progress tracking.");
                    ContinueWatching.stopTracking();
                }
                // >>> END FIX
                // Stop visualizer if running
                Visualizer.stop();

                 // Hide all views and deactivate nav links
                 Object.values(DOM.views).forEach(view => { if(view) { view.classList.remove('active'); view.style.display = 'none';} });
                 document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

                 let targetViewElement = null;
                 let activeNavLinkHref = '#home'; // Default active nav link
                 let runOnViewLoad = () => {}; // Function to run after view is shown

                 // Default visibility for home/search sections
                 Utils.setElementVisibility(DOM.tmdbSearchResultsContainer, false);
                 Utils.setElementVisibility(DOM.homeContentWrapper, true);


                 // --- Route Matching ---
                 if (hash === '#home') {
                     // Home shows Hero + Discover views
                     targetViewElement = [DOM.views.hero, DOM.views.discover];
                     activeNavLinkHref = '#home';
                     runOnViewLoad = () => {
                         Utils.setElementVisibility(DOM.views.hero, true); // Show hero
                         DOM.views.hero?.classList.remove('loaded'); // Reset animation state
                         // Check if home content needs loading (first load or cleared)
                         const needsLoad = !DOM.homeContentSectionsContainer?.hasChildNodes ||
                                           DOM.homeContentSectionsContainer?.innerHTML.includes('spinner') ||
                                           !DOM.networkLogosContainer?.hasChildNodes ||
                                           DOM.networkLogosContainer?.innerHTML.includes('spinner');
                         if (needsLoad) {
                             App.loadHomePageContent();
                         } else {
                            // Content exists, just trigger hero animation and update scroll buttons
                            setTimeout(() => DOM.views.hero?.classList.add('loaded'), 50);
                            App.updateNetworkScrollButtons(); // Ensure buttons are correct state
                         }
                     };
                 }
                 else if (hash.startsWith('#details=')) {
                     targetViewElement = DOM.views.details;
                     activeNavLinkHref = '#home'; // Keep home active in nav for details
                     const [type, id] = hash.substring('#details='.length).split('/');
                     if (id && (type === 'movie' || type === 'tv')) {
                         runOnViewLoad = () => App.loadDetailsPage(type, id);
                     } else {
                         Utils.showToast("Invalid details link.", "warning");
                         location.hash = '#home'; // Redirect invalid links
                         return; // Stop further processing
                     }
                 }
                 else if (hash.startsWith('#player=')) {
                     targetViewElement = DOM.views.player;
                     activeNavLinkHref = '#home'; // Keep home active
                     const match = hash.match(/#player=(movie|tv)\/(\d+)(?:\/(\d+)\/(\d+))?/); // tv/ID/S/E or movie/ID
                     if (match) {
                         const [, type, id, season, episode] = match;
                         runOnViewLoad = () => App.loadPlayerPageContext(type, id, season ? parseInt(season) : null, episode ? parseInt(episode) : null);
                     } else {
                         Utils.showToast("Invalid player link.", "warning");
                         location.hash = '#home';
                         return;
                     }
                 }
                 else if (hash.startsWith('#genre=')) {
                     targetViewElement = DOM.views.genre;
                     activeNavLinkHref = '#genreDropdownLink'; // Target the dropdown toggle
                     const [type, idString] = hash.substring('#genre='.length).split('/');
                     const idNum = parseInt(idString);
                     if (idNum && (type === 'movie' || type === 'tv')) {
                         // Store current genre info for pagination/title
                         State.currentGenre = { type, id: idNum, name: Utils.findGenreName(type, idNum) || `Genre ${idNum}` };
                         runOnViewLoad = () => App.loadGenreResultsPage(1); // Load first page
                     } else {
                         Utils.showToast("Invalid genre link.", "warning");
                         location.hash = '#home';
                         return;
                     }
                 }
                 else if (hash.startsWith('#network=')) {
                     targetViewElement = DOM.views.network;
                     activeNavLinkHref = '#home';

                     const providerIdString = hash.substring('#network='.length);
                     const providerId = parseInt(providerIdString);

                     if (isNaN(providerId) || providerId <= 0) {
                         console.error("Invalid network ID in hash:", providerIdString);
                         Utils.showToast("Invalid network link.", "warning");
                         location.hash = '#home';
                         return;
                     }

                     console.log(`Routing to network page for Provider ID: ${providerId}`);

                     // --- MODIFICATION ---
                     // Make runOnViewLoad async to await provider loading if needed
                     runOnViewLoad = async () => {
                         // Ensure view elements are ready
                         if (!DOM.networkResultsGrid || !DOM.networkResultsTitle || !DOM.loadMoreNetworkBtn || !DOM.networkLoadingSpinner) {
                            console.error("Network view elements missing, cannot load results.");
                            Utils.showToast("Error displaying network results page.", "danger");
                            location.hash = '#home';
                            return;
                         }

                         // 1. Ensure the provider lists are loaded/cached (awaits only first time)
                         const providersLoaded = await App.ensureTmdbWatchProvidersLoaded();

                         // If loading providers failed, maybe show an error or stop
                         if (!providersLoaded && !State.tmdbWatchProviders) { // Check explicitly if cache is still null
                            // The ensure function already shows a toast on error
                            // Optionally, redirect or display error message on the network page itself
                            DOM.networkResultsGrid.innerHTML = Utils.getErrorHTML("Could not load required provider information.");
                            Utils.setElementVisibility(DOM.networkLoadingSpinner, false); // Hide spinner
                            Utils.setElementVisibility(DOM.loadMoreNetworkBtn, false); // Hide load more
                            DOM.networkResultsTitle.textContent = "Error";
                            return; // Stop further processing
                         }

                         // 2. Get provider details using the helper function
                         const providerInfo = App.getProviderDetails(providerId);

                         // 3. Store the retrieved/fallback info in state
                         State.currentNetwork = providerInfo;

                         // 4. Proceed to load the results page (this now uses the potentially detailed providerInfo)
                         // loadNetworkResultsPage itself doesn't need to be async for this part
                         App.loadNetworkResultsPage(1);
                     };
                }
            
                else if (hash === '#profile') { // NEW ROUTE
                    targetViewElement = DOM.profileView;
                    activeNavLinkHref = '#profile-settings'; // Assuming your dropdown link has this href
                    runOnViewLoad = () => App.loadProfilePage();
                }

                 // NEW: Handle Person Route
                 else if (hash.startsWith('#person=')) {
                    targetViewElement = DOM.views.person;
                    activeNavLinkHref = '#home'; // Keep home active
                    const personIdString = hash.substring('#person='.length);
                    const personId = parseInt(personIdString);
                    if (personId) {
                        State.currentPersonId = personId; // Store current person ID
                        runOnViewLoad = () => App.loadPersonPage(personId);
                    } else {
                        Utils.showToast("Invalid person ID.", "warning");
                        location.hash = '#home';
                        return;
                    }
                 }
                 else if (hash === '#search') {
                     // Show discover view, hide home content, show search results area
                     targetViewElement = DOM.views.discover;
                     activeNavLinkHref = '#home';
                     runOnViewLoad = () => {
                         Utils.setElementVisibility(DOM.tmdbSearchResultsContainer, true);
                         Utils.setElementVisibility(DOM.homeContentWrapper, false);
                         const currentQuery = DOM.tmdbSearchInput?.value.trim();
                         // Only perform search if query exists, otherwise show prompt
                         if (currentQuery) {
                             App.loadTmdbSearchResults(currentQuery);
                         } else if (DOM.tmdbSearchResultsGrid) {
                             DOM.tmdbSearchResultsGrid.innerHTML = '<p class="text-muted col-12 py-5 text-center">Please enter a search term.</p>';
                             if(DOM.tmdbSearchResultsTitle) DOM.tmdbSearchResultsTitle.textContent = 'Search';
                         }
                         DOM.tmdbSearchInput?.focus(); // Focus search input
                     };
                 }
                 else if (hash === '#music') {
                     targetViewElement = DOM.views.music;
                     activeNavLinkHref = '#music';
                     runOnViewLoad = () => {
                         API.getSpotifyAppToken().catch(()=>{}); // Initiate token fetch if needed
                         App.resizeVisualizerCanvas(); // Ensure canvas size is correct
                     };
                }
                else if (hash === '#watchlist') {
                     targetViewElement = DOM.views.watchlist;
                     activeNavLinkHref = '#watchlist'; // Highlight watchlist nav link
                     runOnViewLoad = () => App.loadWatchlistPage();
                }
                else if (hash === '#notifications') { // NEW ROUTE
                    targetViewElement = DOM.notificationsView;
                    activeNavLinkHref = '#notifications'; // Highlight the nav link
                    runOnViewLoad = () => App.loadNotificationsPage();
                }
                 else if (hash === '#livesports') {
                    targetViewElement = DOM.views.livesports;
                     activeNavLinkHref = '#livesports'; // Highlight the new link
                    runOnViewLoad = () => App.loadLiveSportsPage();
                 }
                else if (hash === '#analytics') {
                    targetViewElement = DOM.views.analytics;
                    activeNavLinkHref = '#analytics'; // Highlight the analytics link
                    runOnViewLoad = () => {
                        // Ensure analytics content area exists
                        Analytics.dom.content = document.getElementById('analytics-content'); // Re-select in case view was removed/re-added
                        Analytics.updateAnalyticsDisplay(); // Calculate and render/update stats & charts
                    };
                }
                 else {
                     // Unknown hash, redirect to home
                     console.warn("Unknown hash detected:", hash);
                     location.hash = '#home';
                     return; // Stop processing
                 }


                 // --- Show Target View(s) ---
                 const viewsToShow = Array.isArray(targetViewElement) ? targetViewElement : [targetViewElement];
                 viewsToShow.forEach(view => {
                     if (view) {
                         // Special display 'flex' for hero view, 'block' for others
                         view.style.display = (view === DOM.views.hero) ? 'flex' : 'block';
                         // Use requestAnimationFrame to ensure display change is applied before adding class
                         requestAnimationFrame(() => view.classList.add('active'));
                     } else {
                         console.error("Target view element not found for hash:", hash);
                         Utils.showToast("Navigation error: View not found.", "danger");
                         if (location.hash !== '#home') location.hash = '#home'; // Redirect if error occurs
                     }
                 });


                 // --- Activate Correct Nav Link ---
                 // Handle dropdown link activation separately
                 const navLinkSelector = activeNavLinkHref === '#genreDropdownLink'
                     ? '.nav-link.dropdown-toggle'
                     : `.nav-link[href="${activeNavLinkHref}"]`;
                 const activeNavLink = document.querySelector(navLinkSelector);
                 if (activeNavLink) {
                    activeNavLink.classList.add('active');
                    // If it's the dropdown, ensure parent li also looks active if needed (optional)
                    if (activeNavLinkHref === '#genreDropdownLink') {
                        activeNavLink.closest('.nav-item')?.classList.add('active'); // Example
                    }
                 }
                 // Remove active state from dropdown parent if another link is active
                 if (activeNavLinkHref !== '#genreDropdownLink') {
                    document.querySelector('#genreDropdownLink')?.closest('.nav-item')?.classList.remove('active');
                 }


                 // --- Run Post-Load Action & Scroll ---
                 runOnViewLoad(); // Execute the specific loading function for the view

                 // Scroll to top for all views except home, music, player (handled internally)
                 if (hash !== '#home' && hash !== '#music' && !hash.startsWith('#player=')) {
                     window.scrollTo(0, 0);
                 }

                 State.previousViewHash = hash;
             },

             // Listener for hash changes
             handleHashChange: () => Router.updateView()
            
        };

        // --- Visualizer Module ---
        const Visualizer = {
            setup: () => {
                if (State.isVisualizerSetup) return true;
                if (!DOM.visualizerCtx || !DOM.visualizerCanvas) return false; // Canvas context needed

                // Create AudioContext if it doesn't exist
                if (!State.visualizerAudioContext) {
                    try {
                        State.visualizerAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                    } catch (e) {
                        Utils.showToast("Web Audio API not supported in this browser.", "warning");
                        return false;
                    }
                }
                // Resume context if suspended (required by some browsers)
                 if (State.visualizerAudioContext.state === 'suspended') {
                     State.visualizerAudioContext.resume().catch(e => console.warn("Audio context resume failed:", e));
                 }

                // Create AnalyserNode if it doesn't exist
                if (!State.visualizerAnalyser) {
                    State.visualizerAnalyser = State.visualizerAudioContext.createAnalyser();
                    State.visualizerAnalyser.fftSize = 1024; // Power of 2, affects detail vs performance
                    State.visualizerAnalyser.smoothingTimeConstant = 0.8; // 0-1, visual smoothing
                    // Create data array based on frequency bin count
                    const bufferLength = State.visualizerAnalyser.frequencyBinCount;
                    State.visualizerDataArray = new Uint8Array(bufferLength);
                }

                State.isVisualizerSetup = true;
                return true;
            },

            connectSource: (audioElement) => {
                if (!State.isVisualizerSetup || !audioElement || !State.visualizerAudioContext || !State.visualizerAnalyser) return false;

                // Avoid reconnecting the same source
                if (State.isVisualizerConnected && State.visualizerSource?.mediaElement === audioElement) {
                    return true;
                }

                // Disconnect previous source if any
                if (State.visualizerSource) {
                    try { State.visualizerSource.disconnect(); } catch (e) {}
                }

                try {
                    // Resume context if needed
                     if (State.visualizerAudioContext.state === 'suspended') {
                         State.visualizerAudioContext.resume().catch(e => console.warn("Audio context resume failed:", e));
                     }
                    // Create MediaElementSourceNode if it doesn't exist for this element
                    if (!audioElement.audioSourceNode) {
                        audioElement.audioSourceNode = State.visualizerAudioContext.createMediaElementSource(audioElement);
                    }
                    State.visualizerSource = audioElement.audioSourceNode;

                    // Connect the graph: Source -> Analyser -> Destination (speakers)
                    State.visualizerSource.connect(State.visualizerAnalyser);
                    State.visualizerAnalyser.connect(State.visualizerAudioContext.destination);

                    State.isVisualizerConnected = true;
                    console.log("Visualizer connected to audio source.");
                    return true;
                } catch (error) {
                    console.error("Error connecting visualizer source:", error);
                    Utils.showToast("Failed to connect audio source to visualizer.", "danger");
                    State.isVisualizerConnected = false;
                    return false;
                }
            },

            start: (audioElement) => {
                if (!audioElement) return; // Need an audio element
                if (!State.isVisualizerSetup && !Visualizer.setup()) return; // Setup if needed
                if (State.visualizerAudioContext?.state === 'suspended') {
                     State.visualizerAudioContext.resume().catch(e => console.warn("Audio context resume failed:", e));
                 }
                if (!Visualizer.connectSource(audioElement)) return; // Connect the source

                // Start drawing loop if not already running
                if (!State.visualizerRafId) {
                    console.log("Starting visualizer draw loop.");
                    Visualizer.draw();
                }
            },

            startDemo: () => {
                 if (!DOM.demoAudioElement) return;
                 DOM.demoAudioElement.play()
                    .then(() => Visualizer.start(DOM.demoAudioElement))
                    .catch(error => Utils.showToast(error.name === 'NotAllowedError' ? "User interaction needed to play audio." : "Demo audio playback failed.", "warning"));
            },

            stop: () => {
                if (State.visualizerRafId) {
                    cancelAnimationFrame(State.visualizerRafId);
                    State.visualizerRafId = null;
                    // Clear canvas when stopped
                    if (DOM.visualizerCtx && DOM.visualizerCanvas) {
                         DOM.visualizerCtx.clearRect(0, 0, DOM.visualizerCanvas.width, DOM.visualizerCanvas.height);
                    }
                    console.log("Visualizer stopped.");
                }
                 // Optionally disconnect analyser to save resources, but might need reconnecting
                 // if (State.visualizerAnalyser) State.visualizerAnalyser.disconnect();
                 // State.isVisualizerConnected = false;
            },

            draw: () => {
                // Request next frame BEFORE processing current one
                // Use !== null check as ID 0 is valid but falsy
                if (State.visualizerRafId !== null) {
                    State.visualizerRafId = requestAnimationFrame(Visualizer.draw);
                } else {
                    // If stop() was called elsewhere, ensure we exit
                    return;
                }


                if (!State.visualizerAnalyser || !State.visualizerDataArray || !DOM.visualizerCtx || !DOM.visualizerCanvas) {
                    console.warn("Visualizer draw called without necessary components.");
                    Visualizer.stop();
                    return;
                }

                // Get frequency data
                State.visualizerAnalyser.getByteFrequencyData(State.visualizerDataArray);

                const ctx = DOM.visualizerCtx;
                const canvas = DOM.visualizerCanvas;
                const bufferLength = State.visualizerAnalyser.frequencyBinCount;

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Simple bar visualizer example
                const barWidth = (canvas.width / bufferLength) * 1.2; // Adjust multiplier for spacing
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = State.visualizerDataArray[i] * (canvas.height / 255) * 0.9; // Scale height, 0.9 factor to avoid touching top

                    // Color based on frequency (hue rotation)
                    const hue = (i / bufferLength) * 360; // Full spectrum
                    const gradient = ctx.createLinearGradient(x, canvas.height, x, canvas.height - barHeight);
                    gradient.addColorStop(0, `hsla(${hue}, 80%, 30%, 0.6)`); // Darker at base
                    gradient.addColorStop(1, `hsla(${hue}, 90%, 60%, 0.9)`); // Brighter at top
                    ctx.fillStyle = gradient;

                    // Draw bar from bottom up
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                    x += barWidth + 1; // Add 1px spacing between bars
                }
            }
        };


        // --- Main App Module ---
        const App = {
            THEME_STORAGE_KEY: 'auraStreamTheme',
            init: () => {
               console.log("🚀 App Init Starting..."); // Use an emoji for fun!
                // --- NEW: Register Service Worker for Push Notifications ---
                if ('serviceWorker' in navigator) {
                    // V V V CHANGE THIS LINE V V V
                    navigator.serviceWorker.register('service-worker.js') // REMOVE the leading slash "/"
                    // ^ ^ ^ CHANGE THIS LINE ^ ^ ^
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                        Utils.showToast("Notifications may not work. Service Worker failed to register.", "danger");
                    });
                }  else {
                   console.warn("Service Worker not supported by this browser. Push notifications will be disabled.");
                   Utils.showToast("Your browser does not support notifications.", "warning");
                   // Disable notification features if SW not supported
                   if (DOM.requestNotificationPermissionBtn) DOM.requestNotificationPermissionBtn.disabled = true;
                   if (DOM.notificationPermissionStatus) DOM.notificationPermissionStatus.textContent = "Notifications not supported.";
                }

                // --- 1. Essential Initializations (Must Happen First) ---
                 try {
                    console.log("  Initializing Bootstrap components...");
                    bsInstances.navbarCollapse = DOM.navbarMenu ? new bootstrap.Collapse(DOM.navbarMenu, { toggle: false }) : null;

                    console.log("  Initializing global tooltips...");
                    App.initializeTooltips(document.body);

                    // Initialize Trailer Modal Instance
                    if (DOM.trailerModalElement) {
                       console.log("  Initializing Trailer Modal...");
                       bsInstances.trailerModal = new bootstrap.Modal(DOM.trailerModalElement);
                       DOM.trailerModalElement.addEventListener('hidden.bs.modal', () => {
                           if (DOM.trailerModalIframe) DOM.trailerModalIframe.src = 'about:blank';
                       });
                    } else { console.warn("  Trailer Modal element not found."); }

                // Initialize Connection Explorer Modal
                if (DOM.connectionExplorerModal) {
                  console.log("  Initializing Connection Modal & listeners...");
                  bsInstances.connectionModal = new bootstrap.Modal(DOM.connectionExplorerModal);
                  DOM.connectionExplorerModal.addEventListener('shown.bs.modal', () => {
                     if (State.currentExplorerItem && State.isGraphLoading) {
                         console.log("[Modal Event] 'shown' triggered, loading graph for:", State.currentExplorerItem);
                         App.loadAndDisplayConnections(State.currentExplorerItem);
                     } else {
                         console.warn("[Modal Event] 'shown' triggered without active item/loading state.");
                         if(!State.isGraphLoading && DOM.connectionGraphLoading) Utils.setElementVisibility(DOM.connectionGraphLoading, false);
                     }
                  });
                  DOM.connectionExplorerModal.addEventListener('hidden.bs.modal', () => {
                      console.log("[Modal Event] 'hidden' triggered, cleaning up graph.");
                      App.destroyVisNetwork();
                      State.currentExplorerItem = null;
                      State.isGraphLoading = false;
                      // Reset internal states safely
                       if (DOM.connectionGraphContainer) DOM.connectionGraphContainer.innerHTML = '';
                       Utils.setElementVisibility(DOM.connectionGraphContainer, false);
                       Utils.setElementVisibility(DOM.connectionGraphError, false);
                       Utils.setElementVisibility(DOM.connectionGraphLoading, false);
                  });
            } else { console.warn("  Connection Explorer Modal element not found."); }

            } catch (error) {
                console.error("💥 ERROR during essential UI initialization:", error);
                // Display a user-facing error if critical UI fails?
                // e.g., document.body.innerHTML = "<h2>Application failed to initialize. Please refresh.</h2>";
                return; // Stop initialization if basic UI components fail
            }


        // --- 2. Initialize Firebase (with Try/Catch) ---
        try {
            if (typeof firebase !== 'undefined' && typeof firebase.initializeApp === 'function') {
                console.log("  Initializing Firebase...");
                firebaseApp = firebase.initializeApp(firebaseConfig); // Use firebaseConfig defined elsewhere
                db = firebase.firestore(); // Get Firestore instance
                console.log("  ✅ Firebase Initialized Successfully.");
                // <<< --- ADD THE TEST CODE HERE --- >>>
                (async () => { // Use an async IIFE to await the get()
                    try {
                        console.log("  [Firebase Test] Attempting basic read...");
                        const testDoc = await db.collection('testCollection').doc('testDoc').get(); // Use distinct names
                        console.log(`  [Firebase Test] Basic read successful. Document 'testDoc' exists: ${testDoc.exists}`);
                    } catch (testError){
                        console.error("  [Firebase Test] Basic read FAILED:", testError);
                    }
                })();
                // <<< --- END TEST CODE --- >>>
            } else {
                console.warn("  Firebase SDK not fully loaded. Backend features (Global Views) will be disabled.");
                Utils.showToast("Global features unavailable (Service Load Error).", "warning");
            }
        } catch (error) {
            console.error("💥 Firebase initialization FAILED:", error);
            db = null; // Ensure db is null if init fails
            Utils.showToast("Failed to connect to backend services. Global features disabled.", "danger");
        }

        // --- 3. Load Local Data & Init Modules ---
        try {
            console.log("  Loading local storage data...");
            Watchlist.load();
            ContinueWatching.load();
            Favorites.load();
            // REMOVED ViewTracker.load(); - Use Firebase now

            console.log("  Initializing Analytics...");
            Analytics.init(); // Analytics might rely on genre data, but calculates lazily

        } catch (error) {
             console.error("💥 ERROR loading local data or initializing modules:", error);
             // Depending on the error, decide if the app can continue
        }

        // --- 4. Initial API Calls & UI Setup ---
        // These can often run even if Firebase failed (degraded experience)
         try {
             console.log("  Starting initial API calls & theme setup...");
             App.loadTmdbGenres(); // Essential for analytics and genre pages - loads async
             App.applySavedTheme(); // Apply theme early
             App.addThemeSwitcherListeners();
             App.resizeVisualizerCanvas();
             API.getSpotifyAppToken().catch(() => {}); // Start Spotify auth early, ignore errors here

         } catch (error) {
              console.error("💥 ERROR during initial API calls/UI setup:", error);
         }

        window.addEventListener('scroll', Utils.debounce(App.handleNavbarScroll, 50)); // Debounce for performance

        // --- 5. Setup Routing and Event Listeners ---
        try {
             console.log("  Setting up Router and Event Listeners...");
             Router.updateView(); // Initial view based on hash or default
             window.addEventListener('hashchange', Router.handleHashChange);

            // TMDB Search Listeners
            DOM.tmdbSearchForm?.addEventListener('submit', App.handleTmdbSearchSubmit);
            DOM.tmdbSearchInput?.addEventListener('input', Utils.debounce(App.handleTmdbSearchInput, 400));
            DOM.clearTmdbSearchResultsBtn?.addEventListener('click', App.clearTmdbSearch);

            // Pagination Listeners
            DOM.loadMoreGenreBtn?.addEventListener('click', App.handleLoadMoreGenres);
            DOM.loadMoreNetworkBtn?.addEventListener('click', App.handleLoadMoreNetworkResults);

            // Network Carousel Listeners
            DOM.networkPrevBtn?.addEventListener('click', App.handleNetworkScrollPrev);
            DOM.networkNextBtn?.addEventListener('click', App.handleNetworkScrollNext);
            DOM.networkLogosContainer?.addEventListener('scroll', Utils.debounce(App.updateNetworkScrollButtons, 100), { passive: true });

            // Spotify Search Listener
            DOM.spotifySearchForm?.addEventListener('submit', App.handleSpotifySearchSubmit);

             // Visualizer Listeners
             DOM.startVisualizerButton?.addEventListener('click', Visualizer.startDemo);
             DOM.demoAudioElement?.addEventListener('play', () => Visualizer.start(DOM.demoAudioElement));
             DOM.demoAudioElement?.addEventListener('pause', Visualizer.stop);
             DOM.demoAudioElement?.addEventListener('ended', Visualizer.stop);

             // General UI Listeners
             document.querySelectorAll('#navbarNav .nav-link:not(.dropdown-toggle), #navbarNav .dropdown-item').forEach(link => {
                 link.addEventListener('click', () => bsInstances.navbarCollapse?.hide());
             });
             // Specific listeners for nav links if needed (e.g., analytics, livesports)
             DOM.analyticsNavLink?.addEventListener('click', () => bsInstances.navbarCollapse?.hide());
             document.querySelector('.nav-link[href="#livesports"]')?.addEventListener('click', () => bsInstances.navbarCollapse?.hide());


            // Watchlist Clear Listener
            DOM.clearWatchlistBtn?.addEventListener('click', App.handleClearWatchlist);

            // Resize Listener (debounced)
            window.addEventListener('resize', Utils.debounce(() => {
                App.resizeVisualizerCanvas();
                App.updateNetworkScrollButtons();
                State.horizontalScrollContainers?.forEach(({ container, prevBtn, nextBtn }) => {
                    App.updateHScrollButtons(container, prevBtn, nextBtn);
                });
            }, 150));

        } catch(error) {
            console.error("💥 ERROR setting up event listeners:", error);
        }

        console.log("✅ App Init Complete.");
         if (DOM.requestNotificationPermissionBtn) {
            DOM.requestNotificationPermissionBtn.addEventListener('click', App.requestNotificationPermission);
        }
        }, 

        handleAuthReady: (user, dbInstance) => {
         console.log(`✅ App.handleAuthReady received. User: ${user ? user.email : 'None'}, DB: ${dbInstance ? 'Ready' : 'Unavailable'}`);
         State.currentUser = user; // Store user state within App if needed
         // Make dbInstance available within App scope if preferred,
         // though `appDb` is already available globally from firebase-app.js
         // App.db = dbInstance;

         if (user && dbInstance) {
            // User is logged in AND Firestore is ready
            // Now is the safe time to:
             // 1. Load data that DEPENDS on the user (e.g., fetch user-specific recommendations)
             // fetchUserSpecificData(user.uid, dbInstance);
             // 2. Enable features requiring login/db
             // enablePremiumFeatures();
             // 3. Trigger initial view update via Router *now* that we know auth state
              Router.updateView();

             console.log("🚀 App is fully ready for authenticated user.");

         } else if (user && !dbInstance) {
              // Logged in, but DB failed? Less likely if init was okay
             console.warn("App Ready, user logged in BUT Firestore is unavailable!");
             // Allow navigation but show warnings for DB features?
             Router.updateView(); // Update view based on auth anyway
              Utils.showToast("Data features (like view tracking) are unavailable.", "warning");

         } else {
              // User is logged out (handled by firebase-app.js redirect/UI)
             // No specific App actions needed here if redirect happens,
             // but if guest mode allowed, maybe load public content here.
             console.log("App Ready, user is logged out.");
             // Potentially load default/public content
              Router.updateView(); // Update view for guest state if applicable
         }

     },

       handleNavbarScroll: () => {
        const navbar = document.querySelector('.navbar'); // Get a reference to your navbar
        if (!navbar) return;

        // Define the scroll threshold (e.g., 50 pixels from the top)
        const scrollThreshold = 50;

        // Check if the user has scrolled past the threshold
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('navbar-scrolled'); // Add the scrolled class
        } else {
            navbar.classList.remove('navbar-scrolled'); // Remove the scrolled class
        }
    },
      applyTheme: (themeName) => {
        const body = document.body;
        // Remove any existing theme classes
        body.classList.remove(
            'theme-midnight', 'theme-forest', 'theme-crimson', 'theme-nebula',
            'theme-ocean', 'theme-desert', 'theme-solarized', 'theme-solarflare',
            'theme-cyberpunk', 'theme-light'
        );

        if (themeName && themeName !== 'default') {
            body.classList.add(`theme-${themeName}`);
            console.log(`Applied theme: ${themeName}`);
        } else {
            // 'default' case, which maps to your Aura theme (no specific class needed)
            console.log('Applied default theme (Aura)');
        }

        // Optional: Update active state in dropdown
        document.querySelectorAll('#theme-selector-menu .dropdown-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === themeName);
        });

        // ONLY save to localStorage when applyTheme is called directly by user action
        // or a confirmed initial preference, NOT from the internal applyTheme loop itself.
        // This is handled by addThemeSwitcherListeners's event listener.
    },

    // New logic for applySavedTheme: Determine which theme to load initially.
    applySavedTheme: () => {
        const savedTheme = localStorage.getItem(App.THEME_STORAGE_KEY);
        if (savedTheme) {
            // If a theme is saved, apply it directly.
            App.applyTheme(savedTheme);
        } else {
            // If no theme is saved, apply based on system preference.
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                App.applyTheme('midnight');
                localStorage.setItem(App.THEME_STORAGE_KEY, 'midnight'); // Save this preference
            } else {
               App.applyTheme('light');
               localStorage.setItem(App.THEME_STORAGE_KEY, 'light'); // Save this preference
            }
        }
    },

    addThemeSwitcherListeners: () => {
        const themeMenu = document.getElementById('theme-selector-menu');
        if (themeMenu) {
            themeMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('theme-select-btn')) {
                    const theme = e.target.dataset.theme;
                    if (theme) {
                        App.applyTheme(theme);
                        localStorage.setItem(App.THEME_STORAGE_KEY, theme); // Save user's explicit choice
                    }
                }
            });
        }
    },


           

             // Update Router to track player state for saving progress
             handlePlayerExit: async () => {
                 // Check if the user was actually playing something
                 const context = State.moviePlayerContext;
                 if (context && context.itemId && context.itemType) {
                     console.log("Exiting player for:", context.itemType, context.itemId);
                     try {
                         // Fetch minimal details needed to save the item
                         const itemData = await API.fetchTMDB(`/${context.itemType}/${context.itemId}`);
                         if (itemData) {
                             let tvDetails = {};
                             if (context.itemType === 'tv' && context.currentSeason && context.currentEpisode) {
                                 // Fetch episode title if needed (might require another API call or clever caching)
                                 // For demo, we might just use S/E numbers
                                  const seasonData = await API.fetchTMDB(`/tv/${context.itemId}/season/${context.currentSeason}`);
                                  const episodeData = seasonData?.episodes?.find(ep => ep.episode_number === context.currentEpisode);

                                 tvDetails = {
                                     seasonNumber: context.currentSeason,
                                     episodeNumber: context.currentEpisode,
                                     episodeTitle: episodeData?.name || `Episode ${context.currentEpisode}` // Fetch or default
                                 };
                             }
                             // Use a dummy progress value (e.g., 15%)
                             const dummyProgress = 15;
                             ContinueWatching.updateItem(itemData, tvDetails, dummyProgress);
                         }
                     } catch (error) {
                         console.error("Failed to fetch details for continue watching save:", error);
                     } finally {
                          // Clear player context after saving attempt
                          State.moviePlayerContext = { itemId: null, itemType: null, currentSeason: null, currentEpisode: null };
                     }
                 }
            },

            loadWatchlistPage: () => {
                if (!DOM.watchlistGrid || !DOM.clearWatchlistBtn) return;

                // *** Show Skeleton Loading ***
                const skeletonCount = State.watchlist.length > 0 ? Math.min(State.watchlist.length, 12) : 6; // Show skel based on current count (max 12) or default 6
                DOM.watchlistGrid.innerHTML = Utils.getSkeletonCardHTML(skeletonCount);
                Utils.setElementVisibility(DOM.clearWatchlistBtn, false); // Hide clear button during load

                // Use setTimeout to allow skeleton to render before potentially blocking localStorage reads (minor)
                setTimeout(() => {
                    // Clear skeletons *just before* rendering real content (or checking if empty)
                    DOM.watchlistGrid.innerHTML = ''; // Clear previous/skeleton content

                    if (State.watchlist.length === 0) {
                        DOM.watchlistGrid.innerHTML = `
                            <div class="col-12">
                                <div class="empty-watchlist text-center py-5">
                                    <i class="bi bi-bookmark-x display-1 mb-3 text-muted"></i>
                                    <h4 class="text-white">Your Watchlist is Empty</h4>
                                    <p class="text-muted">Add movies and TV shows you want to watch later!</p>
                                </div>
                            </div>`;
                        Utils.setElementVisibility(DOM.clearWatchlistBtn, false); // Hide clear button
                    } else {
                        // Render cards using the standard vertical card renderer
                        const itemsForRendering = State.watchlist.map(item => ({
                             id: item.id,
                             media_type: item.type,
                             title: item.title,
                             name: item.title,
                             poster_path: item.poster_path,
                             vote_average: item.vote_average,
                             overview: null,
                             release_date: null,
                             first_air_date: null,
                        }));

                        App.renderTmdbCards(itemsForRendering, DOM.watchlistGrid, null, false);

                        // Add "Remove" buttons AFTER cards are rendered
                        DOM.watchlistGrid.querySelectorAll('.card').forEach((cardElement, index) => {
                            const item = State.watchlist[index];
                            if (!item) return;

                            const removeBtn = document.createElement('button');
                            // Style this button appropriately - similar to watchlist-btn but maybe 'x'
                            removeBtn.className = 'btn btn-sm btn-danger remove-watchlist-page-btn';
                            removeBtn.innerHTML = '<i class="bi bi-trash3-fill"></i>'; // Trash icon maybe?
                            removeBtn.title = `Remove ${item.title} from Watchlist`;
                            removeBtn.setAttribute('aria-label', `Remove ${item.title} from Watchlist`);
                            removeBtn.dataset.itemId = item.id;
                            removeBtn.dataset.itemType = item.type;
                            removeBtn.style.position = 'absolute'; // Position it on card
                            removeBtn.style.top = '0.5rem';
                            removeBtn.style.left = '5px'
                            removeBtn.style.zIndex = '5';


                            removeBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                App.handleRemoveFromWatchlist(e.currentTarget, cardElement);
                            });

                            cardElement.appendChild(removeBtn); // Add button to card
                        });

                         Utils.setElementVisibility(DOM.clearWatchlistBtn, true); // Show clear button
                    }
                 }, 10); // Small delay
            },

             // --- Add Handlers for Watchlist Actions ---
             handleAddOrRemoveWatchlist: (button) => {
                const { itemId, itemType, itemTitle, itemPoster, itemBackdrop, itemRating } = button.dataset;
                const idNum = parseInt(itemId);
                 if (!idNum || !itemType) return;

                const itemData = {
                    id: idNum,
                    type: itemType,
                    title: itemTitle,
                    poster_path: itemPoster !== 'null' ? itemPoster : null, // Handle 'null' string from dataset
                    backdrop_path: itemBackdrop !== 'null' ? itemBackdrop : null,
                    vote_average: itemRating !== 'null' ? parseFloat(itemRating) : null
                };

                 // Toggle: If it's already in, remove it. Otherwise, add it.
                 if (Watchlist.isInWatchlist(idNum, itemType)) {
                     if (Watchlist.remove(idNum, itemType)) {
                         // Update button state visually
                         button.classList.remove('in-watchlist');
                         button.innerHTML = '<i class="bi bi-bookmark-plus"></i>'; // Plus icon
                         button.title = "Add to Watchlist";
                     }
                 } else {
                     if (Watchlist.add(itemData)) {
                         // Update button state visually
                         button.classList.add('in-watchlist');
                         button.innerHTML = '<i class="bi bi-bookmark-check-fill"></i>'; // Checkmark icon
                         button.title = "In Watchlist (Click to remove)";
                     }
                 }
            },

            handleRemoveFromWatchlist: (button, cardElement) => {
                const { itemId, itemType } = button.dataset;
                if (!itemId || !itemType) return;

                if (Watchlist.remove(itemId, itemType)) {
                    // Remove the card element from the DOM
                    cardElement.remove();

                    // Check if watchlist is now empty
                    if (State.watchlist.length === 0 && DOM.watchlistGrid && DOM.clearWatchlistBtn) {
                         DOM.watchlistGrid.innerHTML = `
                         <div class="col-12">
                             <div class="empty-watchlist text-center py-5">
                                 <i class="bi bi-bookmark-x"></i>
                                 <h4>Your Watchlist is Empty</h4>
                                 <p>Add movies and TV shows you want to watch later!</p>
                             </div>
                         </div>`;
                        Utils.setElementVisibility(DOM.clearWatchlistBtn, false); // Hide clear button
                    }
                }
            },

            handleClearWatchlist: () => {
                if (confirm("Are you sure you want to clear your entire watchlist?")) {
                    Watchlist.clear();
                    // Reload the watchlist page to show the empty state
                    App.loadWatchlistPage();
                }
            },

            loadLiveSportsPage: async () => {
                if (!DOM.liveSportsGrid) {
                    console.error("Live sports grid container not found in DOM.");
                    return;
                }
                console.log("Loading Live Sports page using Sportradar...");
                // Show skeleton loaders
                DOM.liveSportsGrid.innerHTML = Utils.getSkeletonLiveScoreCardHTML(6); // Show 6 skeletons

                try {
                    // Fetch live summaries from Sportradar
                    // Common endpoint for live soccer matches. Check docs if this differs for your key.
                    const liveSummaries = await API.fetchSportradar('/live/summaries.json');

                    // Check if the fetch was successful and returned an array
                    // fetchSportradar is designed to return the array directly (e.g., data.summaries)
                    if (liveSummaries && Array.isArray(liveSummaries)) {
                        // Call the rendering function (needs to be adapted for Sportradar structure)
                        App.renderLiveSportsCards(liveSummaries); // <<< Will modify this function next
                    } else if (liveSummaries === null) {
                         // Error handled by fetchSportradar, message already shown
                         // Display error in the grid
                         DOM.liveSportsGrid.innerHTML = Utils.getErrorHTML("Could not load live sports events. Please try again later.");
                    }
                    else {
                        // Handle cases where fetch succeeded but returned no data or wrong format
                        console.warn("No live fixtures found or invalid API response from Sportradar:", liveSummaries);
                         DOM.liveSportsGrid.innerHTML = `
                             <div class="col-12 text-center py-5 text-muted">
                                 <i class="bi bi-moon-stars fs-1 mb-3"></i>
                                 <h4 class="text-white">No Live Sports Events Currently</h4>
                                 <p>Check back later for live matches!</p>
                             </div>`;
                    }

                } catch (error) {
                    // Catch errors not handled within fetchSportradar (unlikely but possible)
                    console.error("Unexpected error loading live sports:", error);
                    DOM.liveSportsGrid.innerHTML = Utils.getErrorHTML("An unexpected error occurred loading live sports.");
                }
            },


            // --- Spotify Methods ---
            setSpotifyStatus: (message, type = "info", showSpinner = false) => {
                 // Update Navbar status
                 if (DOM.spotifyStatusNavMessage) {
                     DOM.spotifyStatusNavMessage.textContent = message;
                     // Basic styling based on type (could be more elaborate)
                     DOM.spotifyStatusNavMessage.className = `d-flex align-items-center my-2 my-lg-0 small ${type === 'danger' ? 'text-danger' : type === 'warning' ? 'text-warning' : 'text-muted'}`;
                 }
                 // Update Music page status area
                 if (DOM.spotifyStatusArea && DOM.spotifyStatusText) {
                    DOM.spotifyStatusText.textContent = message;
                    DOM.spotifyStatusArea.className = `alert alert-${type} d-flex align-items-center`; // Update alert class
                    Utils.setElementVisibility(DOM.spotifyStatusSpinner, showSpinner);
                 }
             },

            handleSpotifySearchSubmit: async (event) => {
                event.preventDefault();
                if (!DOM.spotifySearchInput || !DOM.spotifySearchResultsContainer || !DOM.spotifySearchLoadingSpinner) return;

                const query = DOM.spotifySearchInput.value.trim();
                if (!query) {
                    Utils.showToast("Please enter a search query.", "warning");
                    return;
                }

                Utils.setElementVisibility(DOM.spotifySearchLoadingSpinner, true);
                DOM.spotifySearchResultsContainer.innerHTML = ''; // Clear previous results

                try {
                    const results = await API.fetchSpotify(`/search?q=${encodeURIComponent(query)}&type=track&limit=20`);
                    if (results && results.tracks && results.tracks.items) {
                        App.renderSpotifySearchResults(results.tracks.items);
                    } else {
                        DOM.spotifySearchResultsContainer.innerHTML = '<p class="text-muted p-3">No tracks found.</p>';
                    }
                } catch (error) {
                    // Error handled in fetchSpotify, toast shown there
                    DOM.spotifySearchResultsContainer.innerHTML = Utils.getErrorHTML("Failed to fetch Spotify search results.");
                } finally {
                    Utils.setElementVisibility(DOM.spotifySearchLoadingSpinner, false);
                }
            },

             renderSpotifySearchResults: (tracks) => {
                 if (!DOM.spotifySearchResultsContainer) return;
                 DOM.spotifySearchResultsContainer.innerHTML = ''; // Clear previous

                 if (!tracks || tracks.length === 0) {
                     DOM.spotifySearchResultsContainer.innerHTML = '<li class="list-group-item text-muted">No tracks found.</li>';
                     return;
                 }

                 tracks.forEach(track => {
                     const trackItem = document.createElement('li');
                     trackItem.className = 'list-group-item d-flex align-items-center';

                     const imgUrl = track.album.images?.[2]?.url || track.album.images?.[0]?.url || 'https://via.placeholder.com/50'; // Smallest image
                     const trackName = Utils.escapeHtml(track.name);
                     const artistName = Utils.escapeHtml(track.artists.map(a => a.name).join(', '));
                     const albumName = Utils.escapeHtml(track.album.name);
                     const duration = Utils.formatTime(track.duration_ms);
                     const previewUrl = track.preview_url;

                     trackItem.innerHTML = `
                         <img src="${imgUrl}" alt="${albumName}" width="50" height="50" class="me-3 rounded-1 flex-shrink-0">
                         <div class="track-info flex-grow-1 overflow-hidden me-2">
                             <div class="track-name text-truncate">${trackName}</div>
                             <div class="artist-name text-muted text-truncate small">${artistName}</div>
                         </div>
                         <span class="badge bg-secondary bg-opacity-25 text-light me-3 flex-shrink-0 d-none d-md-inline-block">${duration}</span>
                         ${previewUrl ? `
                             <button class="btn btn-sm btn-outline-secondary play-preview-btn flex-shrink-0" data-preview-url="${previewUrl}" title="Play Preview">
                                 <i class="bi bi-play-fill"></i>
                             </button>` : `
                             <button class="btn btn-sm btn-outline-secondary play-preview-btn flex-shrink-0 disabled" title="No Preview Available">
                                 <i class="bi bi-play-fill"></i>
                             </button>
                         `}
                     `;

                     // Add event listener for the play button
                     const playButton = trackItem.querySelector('.play-preview-btn:not(.disabled)');
                     if (playButton) {
                         playButton.addEventListener('click', (e) => App.playPreview(e.currentTarget));
                     }

                     DOM.spotifySearchResultsContainer.appendChild(trackItem);
                 });
            },

            playPreview: (button) => {
                 const previewUrl = button.dataset.previewUrl;
                 if (!previewUrl) return;

                 // Stop any currently playing preview
                 const currentAudio = document.getElementById('spotify-preview-audio');
                 if (currentAudio) {
                     currentAudio.pause();
                     // Reset previous button icon if it exists
                     const previousButton = document.querySelector('.play-preview-btn i.bi-pause-fill');
                     if (previousButton) {
                         previousButton.classList.remove('bi-pause-fill');
                         previousButton.classList.add('bi-play-fill');
                     }
                     if (currentAudio.src === previewUrl) { // If clicking the same button again, just stop
                         currentAudio.remove();
                         return;
                     }
                     currentAudio.remove(); // Remove the old audio element
                 }

                 // Create and play new audio
                 const audio = new Audio(previewUrl);
                 audio.id = 'spotify-preview-audio'; // Assign an ID for easy selection
                 audio.volume = 0.7; // Set volume

                 // Change button icon to pause
                 const icon = button.querySelector('i');
                 icon.classList.remove('bi-play-fill');
                 icon.classList.add('bi-pause-fill');

                 // Event listeners for audio playback
                 audio.addEventListener('ended', () => {
                     icon.classList.remove('bi-pause-fill');
                     icon.classList.add('bi-play-fill');
                     audio.remove(); // Clean up element
                 });
                 audio.addEventListener('error', () => {
                     Utils.showToast('Error playing preview.', 'danger');
                     icon.classList.remove('bi-pause-fill');
                     icon.classList.add('bi-play-fill');
                     audio.remove();
                 });

                 // Append and play
                 document.body.appendChild(audio); // Append to body to ensure playback
                 audio.play().catch(err => {
                     Utils.showToast('Playback failed. User interaction might be needed.', 'warning');
                     console.error('Audio play failed:', err);
                     icon.classList.remove('bi-pause-fill');
                     icon.classList.add('bi-play-fill');
                     audio.remove();
                 });
             },

             renderLiveSportsCards: (summaries) => {
                if (!DOM.liveSportsGrid) return;
                DOM.liveSportsGrid.innerHTML = ''; // Clear loading/previous

                if (!summaries || summaries.length === 0) {
                    DOM.liveSportsGrid.innerHTML = `
                        <div class="col-12 text-center py-5 text-muted">
                            <i class="bi bi-moon-stars fs-1 mb-3"></i>
                            <h4 class="text-white">No Live Sports Events Found</h4>
                            <p>Check back later for live matches!</p>
                        </div>`;
                    return;
                }

                summaries.forEach(summary => {
                    try {
                        const sportEvent = summary.sport_event;
                        const statusInfo = summary.sport_event_status;
                        const competition = sportEvent.sport_event_context.competition;
                        const competitors = sportEvent.competitors || [];

                        // --- Extract Data (adjust field names based on actual Sportradar response) ---
                        const leagueName = Utils.escapeHtml(competition?.name || 'Unknown League');
                        // Sportradar often doesn't provide league logos easily in basic summaries
                        const leagueLogo = null; // Placeholder - finding logos might require extra calls or mapping

                        const homeTeam = competitors.find(c => c.qualifier === 'home');
                        const awayTeam = competitors.find(c => c.qualifier === 'away');

                        const homeTeamName = Utils.escapeHtml(homeTeam?.name || 'Home Team');
                        const awayTeamName = Utils.escapeHtml(awayTeam?.name || 'Away Team');
                        // Team logos often aren't in the summary endpoint
                        const homeTeamLogo = null; // Placeholder
                        const awayTeamLogo = null; // Placeholder

                        const homeScore = statusInfo?.home_score ?? '-';
                        const awayScore = statusInfo?.away_score ?? '-';

                        // --- Determine Status and Time ---
                        let statusText = statusInfo?.status?.toUpperCase() || 'LIVE'; // Default to LIVE
                        let statusClass = 'text-danger'; // Default for LIVE
                        let minuteText = '';

                        switch (statusInfo?.status) {
                            case 'live':
                                statusText = 'LIVE';
                                statusClass = 'text-danger';
                                // Extract match clock if available
                                if (statusInfo.clock?.match_clock) {
                                     // Format clock (e.g., "45:00" -> "45'")
                                     const matchClockParts = statusInfo.clock.match_clock.split(':');
                                     minuteText = `<span class="minute ms-1">${matchClockParts[0]}</span>`; // Show only minutes + '
                                }
                                break;
                            case 'closed':
                            case 'ended':
                                statusText = 'FT'; // Full Time
                                statusClass = 'text-muted';
                                break;
                            case 'halftime_break':
                            case 'paused': // Sportradar might use 'paused' for HT
                                statusText = 'HT'; // Half Time
                                statusClass = 'text-warning';
                                break;
                            case 'postponed':
                                statusText = 'POSTP';
                                statusClass = 'text-info';
                                break;
                            case 'cancelled':
                                statusText = 'CANC';
                                statusClass = 'text-muted';
                                break;
                            // Add more cases as needed based on Sportradar documentation (e.g., 'interrupted', 'aet', 'penalties')
                            default:
                                statusText = statusInfo?.status?.toUpperCase() || 'N/A'; // Show the status if unknown mapping
                                statusClass = 'text-info';
                                break;
                        }


                        // --- Create Card HTML ---
                        const card = document.createElement('div');
                        card.className = 'col-12 col-md-6 col-lg-4'; // Responsive columns

                        card.innerHTML = `
                            <div class="card live-sport-card h-100 shadow-sm border-light border-opacity-10 overflow-hidden" style="background: rgba(var(--surface-rgb), 0.5);">
                                <div class="live-card-header p-2 px-3 d-flex justify-content-between align-items-center border-bottom border-light border-opacity-10" style="background: rgba(var(--surface-rgb), 0.3);">
                                    <div class="league-info d-flex align-items-center gap-2 text-truncate">
                                        ${leagueLogo ? `<img src="${leagueLogo}" alt="${leagueName} Logo" width="20" height="20" style="object-fit: contain;">` : '<i class="bi bi-shield-shaded"></i>'}
                                        <span class="small fw-medium text-muted text-truncate">${leagueName}</span>
                                    </div>
                                    <div class="live-indicator small fw-bold ${statusClass}">
                                        ${statusClass === 'text-danger' ? '<span class="live-dot me-1"></span>' : ''}
                                        ${statusText} ${minuteText}
                                    </div>
                                </div>
                                <div class="card-body p-3">
                                    <div class="row align-items-center text-center g-2">
                                        <!-- Home Team -->
                                        <div class="col-5 team-info">
                                             ${homeTeamLogo ? `<img src="${homeTeamLogo}" alt="${homeTeamName}" class="team-logo mb-1" loading="lazy">` : '<i class="bi bi-people-fill fs-2 mb-1 text-muted"></i>'}
                                            <span class="team-name d-block small text-truncate text-light">${homeTeamName}</span>
                                        </div>
                                        <!-- Score -->
                                        <div class="col-2 score-info">
                                            <span class="fs-4 fw-bold text-light">${homeScore} - ${awayScore}</span>
                                        </div>
                                        <!-- Away Team -->
                                        <div class="col-5 team-info">
                                             ${awayTeamLogo ? `<img src="${awayTeamLogo}" alt="${awayTeamName}" class="team-logo mb-1" loading="lazy">` : '<i class="bi bi-people-fill fs-2 mb-1 text-muted"></i>'}
                                            <span class="team-name d-block small text-truncate text-light">${awayTeamName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer p-2 text-center bg-transparent border-top border-light border-opacity-10">
                                     <button class="btn btn-sm btn-outline-secondary event-web-search-btn"
                                             data-hometeam="${homeTeamName}"
                                             data-awayteam="${awayTeamName}"
                                             data-league="${leagueName}"
                                             title="Search web for event information">
                                         <i class="bi bi-search me-1"></i> Search Web
                                     </button>
                                </div>
                            </div>
                        `;

                        // Add listener for the "Search Web" button
                        const webSearchBtn = card.querySelector('.event-web-search-btn');
                        if (webSearchBtn) {
                            webSearchBtn.addEventListener('click', (e) => {
                                const home = e.currentTarget.dataset.hometeam;
                                const away = e.currentTarget.dataset.awayteam;
                                const league = e.currentTarget.dataset.league;
                                const searchQuery = `${home} vs ${away} ${league} live event info`;
                                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank', 'noopener,noreferrer');
                            });
                        }

                        DOM.liveSportsGrid.appendChild(card);
                    } catch (cardError) {
                        console.error("Error rendering live sport card for summary:", summary, cardError);
                        // Optionally append an error card placeholder
                         const errorCard = document.createElement('div');
                         errorCard.className = 'col-12 col-md-6 col-lg-4';
                         errorCard.innerHTML = `<div class="card h-100"><div class="card-body">${Utils.getErrorHTML("Error displaying this event.")}</div></div>`;
                         DOM.liveSportsGrid.appendChild(errorCard);
                    }
                });
            },

            // NEW: Handler for Like/Favorite Button Click
            handleAddOrRemoveFavorite: async (button) => {
                const { itemId, itemType, itemTitle, itemPoster, itemRating, itemGenres } = button.dataset;
                const idNum = parseInt(itemId);
                if (!idNum || !itemType) return;

                let genreIds = [];
                try {
                    // Parse genre IDs safely
                    genreIds = JSON.parse(itemGenres || '[]');
                    if (!Array.isArray(genreIds)) genreIds = []; // Ensure it's an array
                } catch (e) {
                    console.error("Failed to parse genre IDs from button data:", itemGenres, e);
                    genreIds = []; // Default to empty array on error
                }

                const itemData = {
                    id: idNum,
                    type: itemType,
                    title: itemTitle,
                    poster_path: itemPoster !== 'null' ? itemPoster : null,
                    vote_average: itemRating !== 'null' ? parseFloat(itemRating) : null,
                    genre_ids: genreIds // Pass genre IDs
                };

                // V V V MODIFY THE LOGIC TO USE AWAIT V V V
                button.disabled = true; // Disable button during the async operation

                if (Favorites.isFavorite(idNum, itemType)) {
                    const success = await Favorites.remove(idNum, itemType); // Await the result
                    if (success) {
                        button.classList.remove('is-favorite');
                        button.innerHTML = '<i class="bi bi-heart"></i>';
                        button.title = "Add to Favorites";
                    }
                } else {
                const success = await Favorites.add(itemData); // Await the result
                if (success) {
                    button.classList.add('is-favorite');
                    button.innerHTML = '<i class="bi bi-heart-fill"></i>';
                    button.title = "Favorited (Click to unfavorite)";
                }
                }
    
                button.disabled = false; // Re-enable the button
                // ^ ^ ^ END OF MODIFICATIONS ^ ^ ^

                // Toggle Favorite State
                /* if (Favorites.isFavorite(idNum, itemType)) {
                    if (Favorites.remove(idNum, itemType)) {
                        // Update button visually
                        button.classList.remove('is-favorite');
                        button.innerHTML = '<i class="bi bi-heart"></i>'; // Empty heart
                        button.title = "Add to Favorites";
                    }
                } else {
                    if (Favorites.add(itemData)) {
                       // Update button visually
                       button.classList.add('is-favorite');
                       button.innerHTML = '<i class="bi bi-heart-fill"></i>'; // Filled heart
                       button.title = "Favorited (Click to unfavorite)";
                    }
                }*/

                // --- IMPORTANT: Update Analytics Display ---
                // Only update if the analytics view exists (or maybe always update in background?)
                if (DOM.views.analytics && DOM.views.analytics.classList.contains('active')) {
                    Analytics.updateAnalyticsDisplay(); // Update charts if view is active
                } else {
                    console.log("Favorite changed, analytics view not active.");
                    // Optionally, you could still recalculate data in the background
                    // without rendering if needed for other features.
                }
            },
       
            // --- TMDB Methods ---
            loadTmdbGenres: async () => {
        let success = false; // Flag to track success
        try {
            console.log("Fetching TMDB genres...");
            const [movieGenresData, tvGenresData] = await Promise.all([
                API.fetchTMDB('/genre/movie/list'),
                API.fetchTMDB('/genre/tv/list')
            ]);
            State.allMovieGenres = movieGenresData?.genres || [];
            State.allTvGenres = tvGenresData?.genres || [];
            App.renderGenreList(State.allMovieGenres, State.allTvGenres);
            console.log("Genres loaded:", State.allMovieGenres.length, "movie,", State.allTvGenres.length, "TV");
            success = true; // Mark as successful
        } catch (error) {
            console.error("Failed to load TMDB genres:", error);
            Utils.showToast("Could not load genres.", "warning");
            App.renderGenreList([], []); // Render empty list on error
        } finally {
             // --- NEW: Trigger analytics update AFTER genres are loaded (or failed) ---
             // Check if the analytics view is currently the active one
             if (DOM.views.analytics?.classList.contains('active')) {
                 console.log("Analytics view is active, triggering update after genre load.");
                 // Small delay to ensure DOM is settled if called very early
                 setTimeout(Analytics.updateAnalyticsDisplay, 50);
             }
        }
    },

             renderGenreList: (movieGenres, tvGenres) => {
                 if (!DOM.genreDropdownMenu) return;
                 DOM.genreDropdownMenu.innerHTML = ''; // Clear loading/previous

                 if (!movieGenres.length && !tvGenres.length) {
                     DOM.genreDropdownMenu.innerHTML = '<li><span class="dropdown-item disabled">Failed to load genres</span></li>';
                     return;
                 }

                 if (movieGenres.length > 0) {
                     DOM.genreDropdownMenu.innerHTML += '<li><h6 class="dropdown-header">Movie Genres</h6></li>';
                     movieGenres.forEach(genre => {
                         DOM.genreDropdownMenu.innerHTML += `<li><a class="dropdown-item" href="#genre=movie/${genre.id}">${Utils.escapeHtml(genre.name)}</a></li>`;
                     });
                 }
                 if (tvGenres.length > 0) {
                     if (movieGenres.length > 0) DOM.genreDropdownMenu.innerHTML += '<li><hr class="dropdown-divider"></li>';
                     DOM.genreDropdownMenu.innerHTML += '<li><h6 class="dropdown-header" >TV Show Genres</h6></li>';
                     tvGenres.forEach(genre => {
                         DOM.genreDropdownMenu.innerHTML += `<li><a class="dropdown-item" href="#genre=tv/${genre.id}">${Utils.escapeHtml(genre.name)}</a></li>`;
                     });
                 }
            },

            /*loadHomePageContent: async () => {
                console.log("Loading home page content...");

                // Show Skeletons or Spinners
                if (DOM.views.hero) DOM.views.hero.innerHTML = Utils.getSkeletonHeroHTML();
                if (DOM.homeContentSectionsContainer) DOM.homeContentSectionsContainer.innerHTML = Utils.getSpinnerHTML("Loading sections...", true);
                if (DOM.networkLogosContainer) DOM.networkLogosContainer.innerHTML = Utils.getSkeletonNetworkLogoHTML(10);

                // Helper delay function
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                try {
                // Wait for data and 5s delay together
                await Promise.all([
                    Promise.all([
                       App.loadHeroItem(),
                       App.loadHomeSections(),
                       App.renderNetworkLogos()
                    ]),
                delay(5000) // ⏱️ Hold skeletons/spinners for 5 seconds
                ]);

                // Update scroll buttons AFTER logos are rendered
                App.updateNetworkScrollButtons();

                // Minor UI update delay
                setTimeout(() => {
                    State.horizontalScrollContainers?.forEach(({ container, prevBtn, nextBtn }) => {
                        App.updateHScrollButtons(container, prevBtn, nextBtn);
                    });
                }, 200);

                } catch (error) {
                  console.error("Error loading home page content:", error);
                  if (DOM.views.hero) DOM.views.hero.innerHTML = Utils.getErrorHTML("Failed to load hero section.");
                  if (DOM.homeContentSectionsContainer) DOM.homeContentSectionsContainer.innerHTML = Utils.getErrorHTML("Failed to load sections.");
                  if (DOM.networkLogosContainer) DOM.networkLogosContainer.innerHTML = Utils.getErrorHTML("Failed to load networks.");
                } finally {
                    // Hide skeletons/spinners after loading
                    setTimeout(() => {
                        DOM.views.hero?.classList.add('loaded');
                        DOM.homeContentSectionsContainer?.classList.add('loaded');
                        DOM.networkLogosContainer?.classList.add('loaded');
                    }, 50); // Minor delay for smooth transition
                }
            },*/

            loadHomePageContent: async () => {
        console.log("Loading home page content...");

        // Show Skeletons or Spinners
        if (DOM.views.hero) DOM.views.hero.innerHTML = Utils.getSkeletonHeroHTML();
        if (DOM.homeContentSectionsContainer) DOM.homeContentSectionsContainer.innerHTML = Utils.getSpinnerHTML("Loading sections...", true);
        if (DOM.networkLogosContainer) DOM.networkLogosContainer.innerHTML = Utils.getSkeletonNetworkLogoHTML(10);

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            // Concurrently load continue watching data (from Firebase or local)
            const [continueWatchingData] = await Promise.all([
                App.loadContinueWatchingData(), // <<< NEW FUNCTION CALL
                App.loadHeroItem(),
                App.renderNetworkLogos()
            ]);

            // Now, call loadHomeSections with the fetched continueWatchingData
            // Pass it as the `continueWatchingList` to avoid re-fetching in the loop.
            await App.loadHomeSections(continueWatchingData); // <<< Pass data to loadHomeSections

            await delay(config.MIN_SKELETON_DISPLAY_TIME); // ⏱️ Hold skeletons/spinners

            // Update scroll buttons AFTER logos and sections are rendered
            App.updateNetworkScrollButtons();
            setTimeout(() => {
                State.horizontalScrollContainers?.forEach(({ container, prevBtn, nextBtn }) => {
                    App.updateHScrollButtons(container, prevBtn, nextBtn);
                });
            }, 200);

        } catch (error) {
            console.error("Error loading home page content:", error);
            if (DOM.views.hero) DOM.views.hero.innerHTML = Utils.getErrorHTML("Failed to load hero section.");
            if (DOM.homeContentSectionsContainer) DOM.homeContentSectionsContainer.innerHTML = Utils.getErrorHTML("Failed to load sections.");
            if (DOM.networkLogosContainer) DOM.networkLogosContainer.innerHTML = Utils.getErrorHTML("Failed to load networks.");
        } finally {
            setTimeout(() => {
                DOM.views.hero?.classList.add('loaded');
                DOM.homeContentSectionsContainer?.classList.add('loaded');
                DOM.networkLogosContainer?.classList.add('loaded');
            }, 50);
        }
    },

    // --- NEW: Function to load Continue Watching data from Firebase/Local ---
    loadContinueWatchingData: async () => {
        if (typeof appAuth === 'undefined' || !appAuth.currentUser || typeof appDb === 'undefined' || !appDb) {
            console.log("[Continue Watching] User not logged in or Firebase not ready. Using local storage (if any).");
            // Fallback to local storage if user not logged in or Firebase not ready
            // (You might need to re-implement a simple local storage load for this fallback,
            // or just return an empty array if localStorage isn't the primary source anymore)
            // For now, let's assume if not logged in, there's no data to 'continue' from Firebase.
            return [];
        }

        const userId = appAuth.currentUser.uid;
        const watchHistoryRef = appDb.collection("users").doc(userId).collection("watchHistory");

         try {
        console.log("[CW Debug] Attempting to fetch watch history for user:", userId);
        const querySnapshot = await watchHistoryRef.orderBy("lastWatchedTimestamp", "desc").limit(config.CONTINUE_WATCHING_MAX_ITEMS || 20).get();

        const fetchedItems = querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log("[CW Debug] Fetched doc data:", data); // Log each fetched document
            return {
                continueWatchingId: doc.id,
                id: data.tmdbId,
                type: data.type,
                lastWatchedTimestamp: data.lastWatchedTimestamp?.toDate().getTime(),
                title: data.title,
                poster_path: data.poster_path,
                backdrop_path: data.backdrop_path,
                vote_average: data.vote_average,
                progressPercent: data.estimatedProgressPercent,
                seasonNumber: data.seasonNumber,
                episodeNumber: data.episodeNumber,
                episodeTitle: data.episodeTitle,
                totalDurationMinutes: data.totalDurationMinutes,
            };
        }).filter(item => item.lastWatchedTimestamp);
        console.log("[CW Debug] Final fetched items (length):", fetchedItems.length, fetchedItems); // Log the final array
        State.continueWatching = fetchedItems;
        return fetchedItems;
    } catch (error) {
        console.error("[CW Debug] Error fetching user watch history from Firebase:", error);
        return [];
    }
    },
        
            loadHeroItem: async () => {
                 if (!DOM.views.hero) return;
                 try {
                     const trending = await API.fetchTMDB('/trending/all/week');
                     const heroCandidates = trending?.results?.filter(item => item.backdrop_path && (item.media_type === 'movie' || item.media_type === 'tv')) || [];

                     if (heroCandidates.length > 0) {
                         const randomIndex = Math.floor(Math.random() * Math.min(heroCandidates.length, 5));
                         const heroItem = heroCandidates[randomIndex];
                         const itemDetails = await API.fetchTMDB(`/${heroItem.media_type}/${heroItem.id}`);
                         if (itemDetails) {
                             App.renderHeroItem(itemDetails); // Replaces skeleton
                         } else {
                             throw new Error("Failed to fetch hero item details.");
                         }
                     } else {
                        DOM.views.hero.innerHTML = Utils.getErrorHTML("Could not find a suitable item for the hero section.");
                     }
                 } catch (error) {
                     console.error("Failed to load hero item:", error);
                     DOM.views.hero.innerHTML = Utils.getErrorHTML(`Failed to load hero section: ${error.message}`);
                 } finally {
                     setTimeout(() => DOM.views.hero?.classList.add('loaded'), 50);
                 }
             },

            


            /*loadHomeSections: async () => {
                console.log("[Home Sections] Starting home sections load...");
                const mainContainer = DOM.homeContentSectionsContainer;
                if (!mainContainer) {
                   console.error("[Home Sections] Main container (#home-content-sections) not found!");
                   return;
                }

                // 1. Clear Container & Reset State
                mainContainer.innerHTML = Utils.getSpinnerHTML("Loading content sections...", true); // Show initial spinner
                State.horizontalScrollContainers = []; // Reset scroll container tracking
                // Short delay to allow spinner to render before potentially heavy operations
                await new Promise(resolve => setTimeout(resolve, 50));
                mainContainer.innerHTML = ''; // Clear spinner before adding sections
 
                // 2. Prepare Promises/Data Needed Before the Loop
                const continueWatchingList = ContinueWatching.getList(); // Get list synchronously

                // Check ONCE if any global view data exists in Firestore
                const mostViewedCheckPromise = (async () => {
                    if (typeof appDb === 'undefined' || !appDb) {
                        console.warn("[Home Sections] Firestore (appDb) not available for 'Most Viewed' check.");
                        return false; // Assume no data if DB is not ready
                    }
                    try {
                        console.log("[Home Sections] Checking Firestore for 'viewCounts' existence...");
                        const querySnapshot = await appDb.collection("viewCounts").limit(1).get();
                        const exists = !querySnapshot.empty;
                        console.log(`[Home Sections] Firestore 'viewCounts' check complete. Data exists: ${exists}`);
                        return exists;
                    } catch (e) {
                       console.error("[Home Sections] Firestore check for 'viewCounts' failed:", e);
                       return false; // Assume no data on error
                    }
                })(); // Immediately invoke the async function

                // Await the Firestore check result *before* starting the loop
                const globalViewsExist = await mostViewedCheckPromise;
                console.log(`[Home Sections] Proceeding with loop. Global views exist: ${globalViewsExist}`);

                // 3. Iterate Through Section Configurations and Build Structure
                for (const sectionConfig of config.HOME_SECTIONS) {
                    console.log(`[Home Sections] Processing config: "${sectionConfig.title}" (ID: ${sectionConfig.id || 'N/A'})`);
                    let sectionDiv = null;
                    let shouldRender = false; // Flag to determine if the section needs rendering/population

                    // --- Determine if section should be rendered/populated ---
                    if (sectionConfig.id === 'continue-watching') {
                        // This is where it checks if there's data in State.continueWatching
                        if (continueWatchingList.length > 0) {
                            console.log(`[Home Sections] 'Continue Watching' has ${continueWatchingList.length} items. Will render.`);
                            sectionDiv = document.createElement('section'); // <--- THIS CREATES THE <section> ELEMENT
                            sectionDiv.id = 'continue-watching-section';   // <--- GIVES IT THE ID
                            shouldRender = true;
                        } else {
                            console.log(`[Home Sections] Skipping 'Continue Watching' (list is empty).`);
                            // If the list is empty, this sectionDiv will remain null, and thus not be appended.
                        }
                    }
                   if (sectionConfig.id === 'continue-watching') {
                if (continueWatchingList.length > 0) {
                    console.log(`[Home Sections] 'Continue Watching' has ${continueWatchingList.length} items. Will render.`);
                    sectionDiv = document.createElement('section'); // Create dynamically
                    sectionDiv.id = 'continue-watching-section'; // Assign ID
                    shouldRender = true;
                } else {
                    console.log(`[Home Sections] Skipping 'Continue Watching' (list is empty).`);
                }
            } else if (sectionConfig.id === 'most-viewed') {
                sectionDiv = document.getElementById('most-viewed-section'); // Find existing HTML element
                if (!sectionDiv) {
                    console.warn('[Home Sections] Pre-defined HTML section "most-viewed-section" not found.');
                } else {
                    if (globalViewsExist) {
                        console.log('[Home Sections] Global views found. Will populate "Most Viewed" section.');
                        Utils.setElementVisibility(sectionDiv, true); // Make sure it's visible
                        shouldRender = true; // Mark for population (skeletons added below)
                    } else {
                        console.log('[Home Sections] No global views tracked. Hiding "Most Viewed" section.');
                        Utils.setElementVisibility(sectionDiv, false); // Ensure it's hidden
                        shouldRender = false; // Skip population
                    }
                }
            } else if (sectionConfig.endpoint) {
                // Standard sections fetched from TMDB endpoint
                console.log(`[Home Sections] Standard section "${sectionConfig.title}". Will render.`);
                sectionDiv = document.createElement('section'); // Create dynamically
                shouldRender = true;
            } else {
                // Skip sections without ID or endpoint
                console.warn(`[Home Sections] Skipping section "${sectionConfig.title}" due to invalid configuration (missing ID or endpoint).`);
            }

            // --- If section needs rendering/population, build its structure ---
            if (shouldRender && sectionDiv) {
                // Common setup
                sectionDiv.className = sectionDiv.className || 'content-section mb-5'; // Default class if new
                const isHorizontal = sectionConfig.display_style?.startsWith('horizontal');
                const skeletonCount = isHorizontal ? 5 : 6; // Skeletons per section
                let skeletonHtml = isHorizontal
                    ? Utils.getSkeletonHorizontalCardHTML(skeletonCount)
                    : Utils.getSkeletonCardHTML(skeletonCount);
                let containerHtml = '';

                // Build the inner HTML structure with title and skeleton container
                if (isHorizontal) {
                    // Special container class for specific sections if needed
                    let containerClass = 'horizontal-card-container';
                    if (sectionConfig.id === 'continue-watching') containerClass += ' continue-watching-container';
                    if (sectionConfig.id === 'most-viewed') containerClass += ' most-viewed-container';

                    containerHtml = `
                        <div class="horizontal-scroll-wrapper">
                            <button class="btn h-scroll-btn prev disabled" aria-label="Scroll Previous"><i class="bi bi-chevron-left"></i></button>
                            <div class="${containerClass}">${skeletonHtml}</div>
                            <button class="btn h-scroll-btn next disabled" aria-label="Scroll Next"><i class="bi bi-chevron-right"></i></button>
                        </div>`;
                } else {
                    // Vertical grid layout
                    containerHtml = `
                        <div class="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">${skeletonHtml}</div>`;
                }

                // Set the inner HTML for the sectionDiv
                // Avoid replacing if it's the 'most-viewed' section (already has structure)
                if (sectionConfig.id !== 'most-viewed') {
                     sectionDiv.innerHTML = `
                        <h2 class="section-title">${Utils.escapeHtml(sectionConfig.title)}</h2>
                        ${containerHtml}`;
                } else {
                    // For 'most-viewed', just inject skeletons into existing container
                    const existingContainer = sectionDiv.querySelector('.most-viewed-container');
                    if (existingContainer) {
                        existingContainer.innerHTML = skeletonHtml;
                    } else {
                         console.error(`[Home Sections] Could not find .most-viewed-container within #most-viewed-section`);
                    }
                }


                // Append dynamically created sections to the main container
                if (!sectionDiv.parentNode) { // Append only if it's not already in the DOM
                    mainContainer.appendChild(sectionDiv);
                }

                // --- Trigger Asynchronous Data Loading for This Section ---
                // Use IIFE to capture current loop variables (sectionDiv, sectionConfig)
                (async (currentSectionDiv, currentConfig) => {
                    const currentIsHorizontal = currentConfig.display_style?.startsWith('horizontal');
                    // Determine the selector for the content container within this specific section
                    let currentContainerSelector = '.row'; // Default for vertical
                    if (currentIsHorizontal) {
                         if (currentConfig.id === 'continue-watching') currentContainerSelector = '.continue-watching-container';
                         else if (currentConfig.id === 'most-viewed') currentContainerSelector = '.most-viewed-container';
                         else currentContainerSelector = '.horizontal-card-container';
                    }
                    const resultsContainer = currentSectionDiv.querySelector(currentContainerSelector);
                    const prevBtn = currentIsHorizontal ? currentSectionDiv.querySelector('.h-scroll-btn.prev') : null;
                    const nextBtn = currentIsHorizontal ? currentSectionDiv.querySelector('.h-scroll-btn.next') : null;

                    if (!resultsContainer) {
                        console.error(`[Home Sections Load] Could not find results container ('${currentContainerSelector}') for "${currentConfig.title}"`);
                        return;
                    }

                    try {
                        console.log(`[Home Sections Load] Starting async load for "${currentConfig.title}"`);
                        if (currentConfig.id === 'continue-watching') {
                            // Use the pre-fetched list
                            App.loadContinueWatchingSection(currentSectionDiv, continueWatchingList); // Pass list
                        } else if (currentConfig.id === 'most-viewed') {
                            // Fetch from Firestore and TMDB
                            await App.loadMostViewedSection(currentSectionDiv, currentConfig);
                        } else if (currentConfig.endpoint) {
                            // Fetch from TMDB endpoint
                            const data = await API.fetchTMDB(currentConfig.endpoint, { page: 1 });
                            if (data?.results && data.results.length > 0) {
                                const itemsToRender = data.results.slice(0, currentIsHorizontal ? 20 : 12); // Limit items
                                if (currentIsHorizontal) {
                                    App.renderHorizontalCards(itemsToRender, resultsContainer, currentConfig.type || null, currentConfig.show_trailer_button || false);
                                } else {
                                    App.renderTmdbCards(itemsToRender, resultsContainer, currentConfig.type || null, false);
                                }
                            } else {
                                console.log(`[Home Sections Load] No results from API for "${currentConfig.title}".`);
                                resultsContainer.innerHTML = `<p class="text-muted px-3 ${currentIsHorizontal ? '' : 'col-12'}">No content found for this section.</p>`;
                            }
                        }

                        // Setup/Update horizontal scroll AFTER rendering content for horizontal sections
                        if (currentIsHorizontal && resultsContainer && prevBtn && nextBtn) {
                            // Add to state tracking if not already present
                            if (!State.horizontalScrollContainers.some(c => c.container === resultsContainer)) {
                                State.horizontalScrollContainers.push({ container: resultsContainer, prevBtn, nextBtn });
                                // Add scroll listener only once
                                resultsContainer.addEventListener('scroll', Utils.debounce(() => App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn), 100), { passive: true });
                                prevBtn.addEventListener('click', () => App.handleHScrollPrev(resultsContainer));
                                nextBtn.addEventListener('click', () => App.handleHScrollNext(resultsContainer));
                                console.log(`[Home Sections Load] Added scroll listeners for "${currentConfig.title}"`);
                            }
                            // Update button state immediately after rendering/loading
                            App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn);
                        }

                    } catch (error) {
                        console.error(`[Home Sections Load] Error loading data for "${currentConfig.title}":`, error);
                        if (resultsContainer) {
                            resultsContainer.innerHTML = Utils.getErrorHTML(`Could not load "${currentConfig.title}".`);
                        }
                        // Ensure buttons are updated even on error for horizontal sections
                        if (currentIsHorizontal && resultsContainer && prevBtn && nextBtn) {
                             App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn);
                        }
                    }
                })(sectionDiv, sectionConfig); // Pass current section element and config to the IIFE

            } // End if(shouldRender && sectionDiv)

        } // End for...of loop

        console.log("[Home Sections] Finished processing all section configurations.");
    },*/// End loadHomeSections
             
        loadHomeSections: async (preFetchedContinueWatchingList = []) => {
        console.log("[Home Sections] Starting home sections load...");
        const mainContainer = DOM.homeContentSectionsContainer;
        if (!mainContainer) {
            console.error("[Home Sections] Main container (#home-content-sections) not found!");
            return;
        }

        // Clear any previous dynamic content that might have been loaded here,
        // but preserve static sections if they are present.
        // This line might need adjustment if you have other static sections
        // that are children of mainContainer besides the ones we're managing.
        // For now, let's assume we clean up dynamically added ones but preserve the ones above.
        // A safer approach might be to specifically remove old dynamic children,
        // rather than blindly clearing mainContainer.innerHTML if it contains static children.
        // For simplicity for now, we'll let the individual section logic handle their innerHTML.
        // mainContainer.innerHTML = Utils.getSpinnerHTML("Loading content sections...", true); // This line is likely problematic if you have static children now. Remove or adjust.

        State.horizontalScrollContainers = []; // Reset scroll container tracking
        await new Promise(resolve => setTimeout(resolve, 50));
        // mainContainer.innerHTML = ''; // DO NOT clear mainContainer here if it contains static HTML

        const continueWatchingList = preFetchedContinueWatchingList;

        // Ensure the 'Most Viewed' section is initially hidden or shown based on global data
        const mostViewedCheckPromise = (async () => {
            if (typeof appDb === 'undefined' || !appDb) return false;
            try {
                const querySnapshot = await appDb.collection("viewCounts").limit(1).get();
                return !querySnapshot.empty;
            } catch (e) {
                console.error("[Home Sections] Firestore check for 'viewCounts' failed:", e);
                return false;
            }
        })();
        const globalViewsExist = await mostViewedCheckPromise;
 
        App.loadUpcomingSection(); 

        for (const sectionConfig of config.HOME_SECTIONS) {
            console.log(`[Home Sections] Processing config: "${sectionConfig.title}" (ID: ${sectionConfig.id || 'N/A'})`);

            let sectionElement = null; // Renamed from sectionDiv to sectionElement
            let contentContainer = null;
            let prevBtn = null;
            let nextBtn = null;
            let shouldRenderContent = false; // Flag to indicate if this section's content needs populating

            // --- Determine the target element and its content container ---
            if (sectionConfig.id === 'continue-watching') {
                sectionElement = document.getElementById('continue-watching-section'); // FIND THE STATIC ELEMENT
                if (!sectionElement) { console.warn("[Home Sections] Static #continue-watching-section not found."); continue; }
                contentContainer = sectionElement.querySelector('.continue-watching-container');
                prevBtn = sectionElement.querySelector('.h-scroll-btn.prev');
                nextBtn = sectionElement.querySelector('.h-scroll-btn.next');

                if (continueWatchingList.length > 0) {
                    Utils.setElementVisibility(sectionElement, true); // Ensure section is visible
                    shouldRenderContent = true;
                } else {
                    Utils.setElementVisibility(sectionElement, false); // Hide if no content
                }
            } else if (sectionConfig.id === 'most-viewed') {
                sectionElement = document.getElementById('most-viewed-section'); // FIND THE STATIC ELEMENT
                if (!sectionElement) { console.warn("[Home Sections] Static #most-viewed-section not found."); continue; }
                contentContainer = sectionElement.querySelector('.most-viewed-container');
                prevBtn = sectionElement.querySelector('.h-scroll-btn.prev');
                nextBtn = sectionElement.querySelector('.h-scroll-btn.next');

                if (globalViewsExist) {
                    Utils.setElementVisibility(sectionElement, true); // Ensure section is visible
                    shouldRenderContent = true;
                } else {
                    Utils.setElementVisibility(sectionElement, false); // Hide if no global views
                }
            } else if (sectionConfig.endpoint) {
                // Dynamically create and append other sections as before
                sectionElement = document.createElement('section');
                sectionElement.className = 'content-section mb-5';
                const isHorizontal = sectionConfig.display_style?.startsWith('horizontal');
                let skeletonHtml = isHorizontal ? Utils.getSkeletonHorizontalCardHTML(5) : Utils.getSkeletonCardHTML(6);
                let containerClass = isHorizontal ? 'horizontal-card-container' : `row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6`;

                sectionElement.innerHTML = `
                    <h2 class="section-title">${Utils.escapeHtml(sectionConfig.title)}</h2>
                    <div class="${isHorizontal ? 'horizontal-scroll-wrapper' : ''}">
                        ${isHorizontal ? `<button class="btn h-scroll-btn prev disabled" aria-label="Scroll Previous"><i class="bi bi-chevron-left"></i></button>` : ''}
                        <div class="${containerClass}">${skeletonHtml}</div>
                        ${isHorizontal ? `<button class="btn h-scroll-btn next disabled" aria-label="Scroll Next"><i class="bi bi-chevron-right"></i></button>` : ''}
                    </div>`;
                mainContainer.appendChild(sectionElement); // Append dynamic sections
                contentContainer = sectionElement.querySelector(`.${containerClass.split(' ')[0]}`); // Get content container
                prevBtn = isHorizontal ? sectionElement.querySelector('.h-scroll-btn.prev') : null;
                nextBtn = isHorizontal ? sectionElement.querySelector('.h-scroll-btn.next') : null;
                shouldRenderContent = true; // Always try to render content for dynamic sections
            } else {
                console.warn(`[Home Sections] Skipping section "${sectionConfig.title}" due to invalid configuration.`);
                continue; // Skip this iteration
            }

            // If we found/created a section and it should have content:
            if (shouldRenderContent && sectionElement && contentContainer) {
                // Add skeletons to the contentContainer immediately (unless it's already a placeholder)
                // For static sections, if they have an initial placeholder, we'll keep that
                if (contentContainer.innerHTML.includes('initial-placeholder')) {
                    // Placeholder already exists, leave it for now until actual content is ready.
                } else if (!contentContainer.querySelector('.spinner-border')) {
                    // Only add skeleton if it's not already spinning/loading
                    let skeletonHtml = (sectionConfig.display_style?.startsWith('horizontal')) ? Utils.getSkeletonHorizontalCardHTML(5) : Utils.getSkeletonCardHTML(6);
                    contentContainer.innerHTML = skeletonHtml;
                }


                // --- Trigger Asynchronous Data Loading for This Section ---
                (async (currentSectionElement, currentConfig, currentContentContainer, currentPrevBtn, currentNextBtn) => {
                    try {
                        console.log(`[Home Sections Load] Starting async load for "${currentConfig.title}"`);
                        if (currentConfig.id === 'continue-watching') {
                            App.loadContinueWatchingSection(currentSectionElement, continueWatchingList); // Pass list
                        } else if (currentConfig.id === 'most-viewed') {
                            await App.loadMostViewedSection(currentSectionElement, currentConfig);
                        } else if (currentConfig.endpoint) {
                            const data = await API.fetchTMDB(currentConfig.endpoint, { page: 1 });
                            if (data?.results && data.results.length > 0) {
                                const itemsToRender = data.results.slice(0, currentConfig.display_style?.startsWith('horizontal') ? 20 : 12);
                                if (currentConfig.display_style?.startsWith('horizontal')) {
                                    App.renderHorizontalCards(itemsToRender, currentContentContainer, currentConfig.type || null, currentConfig.show_trailer_button || false);
                                } else {
                                    App.renderTmdbCards(itemsToRender, currentContentContainer, currentConfig.type || null, false);
                                }
                            } else {
                                console.log(`[Home Sections Load] No results from API for "${currentConfig.title}".`);
                                currentContentContainer.innerHTML = `<p class="text-muted px-3 ${currentConfig.display_style?.startsWith('horizontal') ? '' : 'col-12'}">No content found for this section.</p>`;
                            }
                        }

                        // Setup/Update horizontal scroll AFTER rendering content
                        if (currentConfig.display_style?.startsWith('horizontal') && currentContentContainer && currentPrevBtn && currentNextBtn) {
                            if (!State.horizontalScrollContainers.some(c => c.container === currentContentContainer)) {
                                State.horizontalScrollContainers.push({ container: currentContentContainer, prevBtn: currentPrevBtn, nextBtn: currentNextBtn });
                                currentContentContainer.addEventListener('scroll', Utils.debounce(() => App.updateHScrollButtons(currentContentContainer, currentPrevBtn, currentNextBtn), 100), { passive: true });
                                currentPrevBtn.addEventListener('click', () => App.handleHScrollPrev(currentContentContainer));
                                currentNextBtn.addEventListener('click', () => App.handleHScrollNext(currentContentContainer));
                                console.log(`[Home Sections Load] Added scroll listeners for "${currentConfig.title}"`);
                            }
                            App.updateHScrollButtons(currentContentContainer, currentPrevBtn, currentNextBtn);
                        }

                    } catch (error) {
                        console.error(`[Home Sections Load] Error loading data for "${currentConfig.title}":`, error);
                        if (currentContentContainer) {
                            currentContentContainer.innerHTML = Utils.getErrorHTML(`Could not load "${currentConfig.title}".`);
                        }
                        if (currentConfig.display_style?.startsWith('horizontal') && currentContentContainer && currentPrevBtn && currentNextBtn) {
                             App.updateHScrollButtons(currentContentContainer, currentPrevBtn, currentNextBtn);
                        }
                    }
                })(sectionElement, sectionConfig, contentContainer, prevBtn, nextBtn);
            }
        }
        console.log("[Home Sections] Finished processing all section configurations.");
    },
    loadMostViewedSection: async (sectionDiv, sectionConfig) => {
    const container = sectionDiv.querySelector('.most-viewed-container');
    const isHorizontal = container?.classList.contains('horizontal-card-container');
    const maxItems = sectionConfig.max_items || (isHorizontal ? 15 : 12);
    const prevBtn = isHorizontal ? sectionDiv.querySelector('.h-scroll-btn.prev') : null;
    const nextBtn = isHorizontal ? sectionDiv.querySelector('.h-scroll-btn.next') : null;


    if (!container) {
         console.error('[Most Viewed Load] Container .most-viewed-container not found within section.');
         return;
    }
    console.log('[Most Viewed Load] Loading global most viewed items from Firestore...');
    // Skeletons should have been added by loadHomeSections

    if (typeof appDb === 'undefined' || !appDb) { // Check if Firestore is initialized
        container.innerHTML = Utils.getErrorHTML("Database service unavailable for popular items.");
        if (isHorizontal && prevBtn && nextBtn) App.updateHScrollButtons(container, prevBtn, nextBtn);
        return;
    }

    try {
        // --- Query Firestore ---
        const querySnapshot = await appDb.collection("viewCounts")
            .orderBy("viewCount", "desc") // Order by count
            .limit(maxItems) // Limit to top N
            .get();
        // ---------------------

        if (querySnapshot.empty) {
            console.log('[Most Viewed Load] No view data found in Firestore.');
            container.innerHTML = `<p class="text-muted px-3 col-12">Be the first to watch something popular!</p>`;
            if(isHorizontal && prevBtn && nextBtn){ App.updateHScrollButtons(container, prevBtn, nextBtn);}
            return;
        }

        // Extract data needed for TMDB lookup
        const topItemsData = querySnapshot.docs.map(doc => ({
            id: doc.data().tmdbId,
            type: doc.data().type,
            count: doc.data().viewCount
        }));

        console.log('[Most Viewed Load] Fetched top items from Firestore:', topItemsData.map(i => `${i.type}-${i.id}(${i.count})`));

        // --- Fetch TMDB Details for these items ---
        const itemDetailPromises = topItemsData.map(viewData =>
            API.fetchTMDB(`/${viewData.type}/${viewData.id}`).catch(err => {
                console.warn(`[Most Viewed Load] Failed to fetch TMDB details for ${viewData.type}-${viewData.id}`, err);
                return null; // Return null on error
            })
        );
        const detailedItems = (await Promise.all(itemDetailPromises))
                                  .filter(item => item !== null); // Filter out failed fetches

        if (detailedItems.length === 0) {
             throw new Error("Could not fetch details for popular items from TMDB.");
        }

        // --- Combine TMDB details with view counts (Optional) ---
         const itemsToRender = detailedItems.map(item => {
              const type = item.title ? 'movie' : 'tv'; // Re-determine type just in case
              const originalViewData = topItemsData.find(v => v.id === item.id && v.type === type);
              return {
                   ...item,
                   media_type: type, // Ensure media_type is set
                   viewCount: originalViewData ? originalViewData.count : '?',
               };
          });

        // --- Render using appropriate function (replace skeletons) ---
         console.log(`[Most Viewed Load] Rendering ${itemsToRender.length} items.`);
         if (isHorizontal) {
             App.renderHorizontalCards(itemsToRender, container, null, false); // Pass items, container
             // Setup scroll for THIS specific section
             if (container && prevBtn && nextBtn) {
                  if (!State.horizontalScrollContainers.some(c => c.container === container)) {
                      State.horizontalScrollContainers.push({ container, prevBtn, nextBtn });
                      container.addEventListener('scroll', Utils.debounce(() => App.updateHScrollButtons(container, prevBtn, nextBtn), 100), { passive: true });
                      prevBtn.addEventListener('click', () => App.handleHScrollPrev(container));
                      nextBtn.addEventListener('click', () => App.handleHScrollNext(container));
                  }
                  App.updateHScrollButtons(container, prevBtn, nextBtn); // Update immediately after render
              }
         } else {
             // Assuming default is vertical card grid
             App.renderTmdbCards(itemsToRender, container, null, false); // Pass items, container
             // Optional: Add view count display logic for vertical cards here if needed
         }

    } catch (error) {
        console.error("[Most Viewed Load] Error fetching or processing items:", error);
        container.innerHTML = Utils.getErrorHTML(`Could not display popular items: ${error.message}`);
        if(isHorizontal && prevBtn && nextBtn){ App.updateHScrollButtons(container, prevBtn, nextBtn);}
    }
},


 /**
     * Loads and renders the "Highly Anticipated & Upcoming" section.
     */
    loadUpcomingSection: async () => {
        if (!DOM.upcomingSection || !DOM.upcomingContainer) {
            console.warn("Upcoming section DOM elements not found.");
            return;
        }

        Utils.setElementVisibility(DOM.upcomingSection, true); // Ensure section is visible
        DOM.upcomingContainer.innerHTML = Utils.getSkeletonHorizontalCardHTML(5); // Show skeletons

        try {
            // Fetch upcoming movies (most reliable "upcoming" data from TMDB)
            const upcomingMoviesData = await API.fetchTMDB('/movie/upcoming', {
                language: 'en-US',
                region: config.TARGET_REGION,
                page: 1
            });

            // For TV shows, "upcoming" is harder. We might use highly anticipated new shows
            // or popular shows that are airing. For simplicity, let's start with movies.
            // A more advanced approach might involve searching for new seasons of popular shows.

            const upcomingItems = upcomingMoviesData?.results?.filter(item => item.backdrop_path)
                .slice(0, config.UPCOMING_SECTION_ITEMS || 15) || [];

            if (upcomingItems.length > 0) {
                App.renderUpcomingCards(upcomingItems, DOM.upcomingContainer);
            } else {
                DOM.upcomingContainer.innerHTML = '<p class="text-muted px-3" style="width: 100%;">No upcoming content found.</p>';
                Utils.setElementVisibility(DOM.upcomingContainer.previousElementSibling, false); // Hide prev/next buttons
                Utils.setElementVisibility(DOM.upcomingContainer.nextElementSibling, false);
            }

            // Update scroll buttons
            const prevBtn = DOM.upcomingSection.querySelector('.h-scroll-btn.prev');
            const nextBtn = DOM.upcomingSection.querySelector('.h-scroll-btn.next');
            App.updateHScrollButtons(DOM.upcomingContainer, prevBtn, nextBtn);
            if (!State.horizontalScrollContainers.some(c => c.container === DOM.upcomingContainer)) {
                State.horizontalScrollContainers.push({
                    container: DOM.upcomingContainer,
                    prevBtn,
                    nextBtn
                });
                DOM.upcomingContainer.addEventListener('scroll', Utils.debounce(() => App.updateHScrollButtons(DOM.upcomingContainer, prevBtn, nextBtn), 100), {
                    passive: true
                });
                prevBtn.addEventListener('click', () => App.handleHScrollPrev(DOM.upcomingContainer));
                nextBtn.addEventListener('click', () => App.handleHScrollNext(DOM.upcomingContainer));
            }

        } catch (error) {
            console.error("Error loading upcoming section:", error);
            DOM.upcomingContainer.innerHTML = Utils.getErrorHTML("Failed to load upcoming content.");
            Utils.setElementVisibility(DOM.upcomingContainer.previousElementSibling, false);
            Utils.setElementVisibility(DOM.upcomingContainer.nextElementSibling, false);
        }
    },

    /**
     * Renders upcoming movie/TV show cards with release dates and notify buttons.
     * @param {Array} items - List of TMDB items.
     * @param {HTMLElement} containerElement - The container to render into.
     */
    renderUpcomingCards: (items, containerElement) => {
        if (!containerElement) return;
        containerElement.innerHTML = ''; // Clear existing content/skeletons

        items.forEach(item => {
            const itemType = item.media_type || 'movie'; // Assuming mostly movies from /movie/upcoming
            if (itemType === 'person' || !item.id) return; // Skip persons

            const title = Utils.escapeHtml(item.title || item.name || 'N/A');
            const imagePath = item.backdrop_path || item.poster_path;
            const imageUrl = imagePath ? `${config.BACKDROP_BASE_URL}${imagePath}` : null;
            const releaseDateStr = item.release_date || item.first_air_date; // Use specific release date for upcoming
            const releaseDate = releaseDateStr ? new Date(releaseDateStr) : null;

            let releaseStatus = '';
            let releaseBadgeClass = '';
            let notifyButtonText = '<i class="bi bi-bell-fill"></i> Notify Me';
            let notifyButtonClass = 'btn-primary'; // Default color
            let isSubscribed = false;

            if (releaseDate) {
                const now = new Date();
                const diffDays = Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    releaseStatus = 'Released!';
                    releaseBadgeClass = 'released';
                    notifyButtonText = 'Released';
                    notifyButtonClass = 'btn-success disabled'; // Disable button if already released
                } else if (diffDays <= 7) {
                    releaseStatus = `${diffDays === 0 ? 'Today!' : diffDays === 1 ? 'Tomorrow!' : `In ${diffDays} days`}`;
                    releaseBadgeClass = 'imminent';
                } else {
                    releaseStatus = Utils.formatAirDate(releaseDateStr); // Format full date
                }
            } else {
                releaseStatus = 'TBD';
            }

            // Check if user is already subscribed to notifications for this item
            if (appAuth.currentUser) { // Only check if logged in
                isSubscribed = State.activeNotificationSubscriptions.some(
                    sub => sub.tmdbId === item.id && sub.type === itemType
                );
                if (isSubscribed) {
                    notifyButtonText = '<i class="bi bi-check-lg"></i> Subscribed';
                    notifyButtonClass = 'subscribed';
                }
                if (releaseDate && new Date() > releaseDate) { // Item already released
                     notifyButtonText = 'Released';
                     notifyButtonClass = 'disabled'; // Disable notify button for released content
                 }
            } else {
                // If not logged in, disable notify button and hint
                notifyButtonClass = 'disabled';
                notifyButtonText = '<i class="bi bi-box-arrow-in-right"></i> Log In';
            }


            const cardLink = document.createElement('a');
            cardLink.href = `#details=${itemType}/${item.id}`;
            cardLink.className = 'h-card upcoming-card'; // Add upcoming-card specific class
            cardLink.title = title;

            const imageHtml = imageUrl
                ? `<img src="${imageUrl}" class="h-card-backdrop" alt="${title}" loading="lazy">`
                : `<div class="d-flex align-items-center justify-content-center h-100"><i class="bi bi-film fs-1 text-muted"></i></div>`;

            const overlayHtml = `
                <div class="h-card-overlay">
                    <h3 class="h-card-title">${title}</h3>
                    <p class="h-card-meta small opacity-80">
                        ${item.vote_average && parseFloat(item.vote_average) > 0 ? `<span class="me-2"><i class="bi bi-star-fill text-warning"></i> ${item.vote_average.toFixed(1)}</span>` : ''}
                    </p>
                </div>
            `;

            const notifyButtonHtml = `
                <button class="notify-me-btn ${notifyButtonClass}"
                        data-item-id="${item.id}"
                        data-item-type="${itemType}"
                        data-item-title="${Utils.escapeHtml(title)}"
                        data-release-date="${releaseDateStr || ''}"
                        ${isSubscribed ? 'data-subscribed="true"' : ''}
                        ${notifyButtonClass.includes('disabled') ? 'disabled' : ''}>
                    ${notifyButtonText}
                </button>
            `;

            const releaseBadgeHtml = releaseDate ? `
                <span class="release-date-badge ${releaseBadgeClass}">
                    <i class="bi bi-calendar-check-fill"></i> ${releaseStatus}
                </span>` : '';

            cardLink.innerHTML = imageHtml + overlayHtml + notifyButtonHtml + releaseBadgeHtml;
            containerElement.appendChild(cardLink);

            // Add event listener for the Notify Me button
            const notifyBtn = cardLink.querySelector('.notify-me-btn');
            if (notifyBtn && !notifyBtn.disabled) {
                notifyBtn.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent navigating to details page
                    e.stopPropagation(); // Stop event bubbling
                    App.handleNotifyMeClick(e.currentTarget);
                });
            }
        });
        App.initializeTooltips(containerElement);
    },

     /**
     * Request browser notification permission from the user.
     */
    requestNotificationPermission: async () => {
        if (!('Notification' in window)) {
            Utils.showToast("This browser does not support desktop notifications.", "danger");
            DOM.notificationPermissionStatus.textContent = "Notifications not supported.";
            if (DOM.requestNotificationPermissionBtn) DOM.requestNotificationPermissionBtn.disabled = true;
            return;
        }

        if (Notification.permission === 'granted') {
            Utils.showToast("Notification permission already granted!", "success");
            DOM.notificationPermissionStatus.textContent = "Permission Granted.";
            return;
        }

        if (Notification.permission === 'denied') {
            Utils.showToast("Notification permission denied by user. Please enable it in browser settings.", "danger");
            DOM.notificationPermissionStatus.textContent = "Permission Denied.";
            if (DOM.requestNotificationPermissionBtn) DOM.requestNotificationPermissionBtn.disabled = true; // Disable if denied
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                Utils.showToast("Notification permission granted!", "success");
                DOM.notificationPermissionStatus.textContent = "Permission Granted.";
                // Now try to subscribe to push notifications
                await App.subscribeUserToPush();
            } else {
                Utils.showToast("Notification permission denied.", "warning");
                DOM.notificationPermissionStatus.textContent = "Permission Denied.";
                if (DOM.requestNotificationPermissionBtn) DOM.requestNotificationPermissionBtn.disabled = true;
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            Utils.showToast("Error requesting notification permission.", "danger");
        }
    },

    /**
     * Subscribes the user's browser to push notifications and saves the subscription to Firebase.
     */
    subscribeUserToPush: async () => {
        if (!('serviceWorker' in navigator) || !navigator.serviceWorker.ready || !('PushManager' in window)) {
            console.warn("Push messaging not supported/ready.");
            Utils.showToast("Push notifications not supported or service worker not ready.", "warning");
            return;
        }
        if (!appAuth.currentUser || !appDb) {
            Utils.showToast("Log in to enable push notifications.", "info");
            return;
        }

        DOM.notificationPermissionStatus.textContent = "Subscribing to push...";
        try {
            const registration = await navigator.serviceWorker.ready;
            const pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: App.urlBase64ToUint8Array(config.VAPID_PUBLIC_KEY)
            });

            // Save pushSubscription to Firebase
            const userId = appAuth.currentUser.uid;
            await appDb.collection("users").doc(userId).update({
                pushSubscription: pushSubscription.toJSON() // Save the subscription object
            });

            Utils.showToast("Successfully subscribed to push notifications!", "success");
            DOM.notificationPermissionStatus.textContent = "Subscribed.";
            console.log("Push subscription saved:", pushSubscription);
            return pushSubscription;

        } catch (error) {
            console.error("Failed to subscribe user to push:", error);
            Utils.showToast(`Failed to subscribe to push: ${error.message}`, "danger");
            DOM.notificationPermissionStatus.textContent = "Subscription Failed.";
        }
    },

    /**
     * Helper function to convert VAPID public key to Uint8Array.
     */
    urlBase64ToUint8Array: (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    /**
     * Handles the "Notify Me" button click to add/remove notification subscription for a content item.
     * @param {HTMLElement} button - The clicked notify button.
     */
    handleNotifyMeClick: async (button) => {
        if (!appAuth.currentUser || !appDb) {
            Utils.showToast("Log in to set notifications.", "info");
            location.hash = '#'; // Redirect to login/home
            return;
        }

        const userId = appAuth.currentUser.uid;
        const itemId = parseInt(button.dataset.itemId);
        const itemType = button.dataset.itemType;
        const itemTitle = button.dataset.itemTitle;
        const releaseDate = button.dataset.releaseDate; // YYYY-MM-DD string

        // Create a unique ID for the notification subscription
        const subId = `${itemType}-${itemId}`;
        const notificationSubRef = appDb.collection("users").doc(userId).collection("notificationSubscriptions").doc(subId);

        button.disabled = true;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';

        try {
            if (button.dataset.subscribed === "true") {
                // User wants to UNSUBSCRIBE
                await notificationSubRef.delete();
                State.activeNotificationSubscriptions = State.activeNotificationSubscriptions.filter(s => s.tmdbId !== itemId || s.type !== itemType);
                button.dataset.subscribed = "false";
                button.classList.remove('subscribed');
                button.innerHTML = '<i class="bi bi-bell-fill"></i> Notify Me';
                Utils.showToast(`Notification removed for "${itemTitle}".`, "info");
            } else {
                // User wants to SUBSCRIBE
                // Ensure notification permission is granted before subscribing
                if (Notification.permission !== 'granted') {
                    await App.requestNotificationPermission(); // Request permission first
                    if (Notification.permission !== 'granted') {
                        Utils.showToast("Notification permission required to subscribe.", "warning");
                        button.innerHTML = originalText;
                        button.disabled = false;
                        return; // Exit if permission not granted
                    }
                }
                // Check if browser is subscribed to push
                const registration = await navigator.serviceWorker.ready;
                const pushSubscription = await registration.pushManager.getSubscription();
                if (!pushSubscription) {
                     Utils.showToast("Please 'Enable Browser Notifications' on the Notifications page first.", "warning");
                     button.innerHTML = originalText;
                     button.disabled = false;
                     return;
                }

                // Save subscription for this item in Firestore
                await notificationSubRef.set({
                    tmdbId: itemId,
                    type: itemType,
                    title: itemTitle,
                    releaseDate: releaseDate, // Store as string for easier comparison/parsing server-side
                    subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'active',
                    // You might also save the pushSubscription endpoint/keys here if not already at user root.
                    // Or, the server will read the pushSubscription from users/{userId} directly.
                });
                State.activeNotificationSubscriptions.push({ tmdbId: itemId, type: itemType, title: itemTitle });
                button.dataset.subscribed = "true";
                button.classList.add('subscribed');
                button.innerHTML = '<i class="bi bi-check-lg"></i> Subscribed';
                Utils.showToast(`You will be notified for "${itemTitle}"!`, "success");
            }
        } catch (error) {
            console.error("Error handling notification subscription:", error);
            Utils.showToast(`Failed to update notification: ${error.message}`, "danger");
            button.innerHTML = originalText; // Revert text on error
        } finally {
            button.disabled = false;
            // Re-render upcoming section to reflect updated state of buttons
            // App.loadUpcomingSection(); // This might cause a flicker, only do if necessary
        }
    },

    /**
     * Loads the user's active notification subscriptions from Firebase and displays them.
     */
    loadNotificationsPage: async () => {
        if (!DOM.notificationsView || !appAuth.currentUser || !appDb) {
            Utils.showToast("Please log in to manage notifications.", "info");
            location.hash = '#home';
            return;
        }
        const userId = appAuth.currentUser.uid;

        // Check and display current Notification permission status
        const currentPermission = Notification.permission;
        DOM.notificationPermissionStatus.textContent = `Permission: ${currentPermission.charAt(0).toUpperCase() + currentPermission.slice(1)}`;
        if (currentPermission === 'granted') {
             Utils.setElementVisibility(DOM.requestNotificationPermissionBtn, false); // Hide if granted
        } else {
             Utils.setElementVisibility(DOM.requestNotificationPermissionBtn, true); // Show if not granted
        }

        DOM.notificationSubscriptionsList.innerHTML = Utils.getSpinnerHTML("Loading subscriptions...");

        try {
            // Fetch user's push subscription (if any)
            const userDoc = await appDb.collection("users").doc(userId).get();
            const pushSubscriptionData = userDoc.data()?.pushSubscription;

            if (currentPermission === 'granted' && pushSubscriptionData) {
                DOM.notificationPermissionStatus.textContent += " (Push Subscribed)";
            } else if (currentPermission === 'granted' && !pushSubscriptionData) {
                DOM.notificationPermissionStatus.textContent += " (Not Push Subscribed)";
                // Prompt user to subscribe if permission is granted but no push subscription
                Utils.setElementVisibility(DOM.requestNotificationPermissionBtn, true); // Show button
                DOM.requestNotificationPermissionBtn.textContent = 'Complete Push Subscription';
            } else if (currentPermission === 'denied') {
                 DOM.notificationPermissionStatus.textContent = "Permission Denied. Enable in browser settings.";
                 Utils.setElementVisibility(DOM.requestNotificationPermissionBtn, false);
            }

            // Fetch notification subscriptions for content items
            const subscriptionsSnapshot = await appDb.collection("users").doc(userId).collection("notificationSubscriptions")
                .orderBy("subscribedAt", "desc")
                .get();

            State.activeNotificationSubscriptions = subscriptionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            DOM.notificationSubscriptionsList.innerHTML = ''; // Clear spinner

            if (State.activeNotificationSubscriptions.length === 0) {
                DOM.notificationSubscriptionsList.innerHTML = '<p class="text-muted text-center py-4">You have no active notification subscriptions.</p>';
            } else {
                State.activeNotificationSubscriptions.forEach(sub => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'notification-item';

                    const releaseDate = sub.releaseDate ? Utils.formatAirDate(sub.releaseDate) : 'N/A';
                    let statusBadge = `<span class="item-status-badge bg-primary">Upcoming</span>`;
                    if (sub.releaseDate && new Date(sub.releaseDate) < new Date()) {
                        statusBadge = `<span class="item-status-badge bg-success">Released</span>`;
                    }

                    itemElement.innerHTML = `
                        <img src="${config.IMAGE_BASE_URL}${sub.poster_path || ''}" alt="${Utils.escapeHtml(sub.title)}" class="item-poster" onerror="this.onerror=null;this.src='https://via.placeholder.com/60x90/1a1d24/666?text=N/A';">
                        <div class="item-info">
                            <h5><a href="#details=${sub.type}/${sub.tmdbId}" class="text-light text-decoration-none">${Utils.escapeHtml(sub.title)}</a></h5>
                            <p>Release: ${releaseDate} ${statusBadge}</p>
                            <p>Subscribed: ${sub.subscribedAt ? Utils.formatAirDate(sub.subscribedAt.toDate()) : 'N/A'}</p>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-danger unsubscribe-btn" data-sub-id="${sub.id}" data-item-title="${Utils.escapeHtml(sub.title)}">
                                <i class="bi bi-trash"></i> Unsubscribe
                            </button>
                        </div>
                    `;
                    DOM.notificationSubscriptionsList.appendChild(itemElement);
                });

                // Add unsubscribe button listeners
                DOM.notificationSubscriptionsList.querySelectorAll('.unsubscribe-btn').forEach(button => {
                    button.addEventListener('click', App.unsubscribeNotification);
                });
            }

        } catch (error) {
            console.error("Error loading notification subscriptions:", error);
            DOM.notificationSubscriptionsList.innerHTML = Utils.getErrorHTML("Failed to load your subscriptions.");
        }
    },

    /**
     * Handles unsubscribing from a specific content notification.
     * @param {Event} event - The click event from the unsubscribe button.
     */
    unsubscribeNotification: async (event) => {
        const button = event.currentTarget;
        const subId = button.dataset.subId;
        const itemTitle = button.dataset.itemTitle;
        if (!subId || !appAuth.currentUser || !appDb) return;

        if (!confirm(`Are you sure you want to unsubscribe from notifications for "${itemTitle}"?`)) return;

        button.disabled = true;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';

        try {
            const userId = appAuth.currentUser.uid;
            await appDb.collection("users").doc(userId).collection("notificationSubscriptions").doc(subId).delete();

            State.activeNotificationSubscriptions = State.activeNotificationSubscriptions.filter(s => s.id !== subId);
            button.closest('.notification-item').remove(); // Remove item from DOM

            Utils.showToast(`Unsubscribed from "${itemTitle}".`, "info");
            // If list becomes empty, show empty message
            if (State.activeNotificationSubscriptions.length === 0) {
                 DOM.notificationSubscriptionsList.innerHTML = '<p class="text-muted text-center py-4">You have no active notification subscriptions.</p>';
            }
        } catch (error) {
            console.error("Error unsubscribing notification:", error);
            Utils.showToast(`Failed to unsubscribe: ${error.message}`, "danger");
            button.innerHTML = originalText;
            button.disabled = false;
        }
    },
        

    // V V V REPLACE the entire `loadContinueWatchingSection` function with this one V V V
loadContinueWatchingSection: (sectionDiv) => {
    if (!sectionDiv) return;

    const resultsContainer = sectionDiv.querySelector('.continue-watching-container');
    const prevBtn = sectionDiv.querySelector('.h-scroll-btn.prev');
    const nextBtn = sectionDiv.querySelector('.h-scroll-btn.next');
    if (!resultsContainer || !prevBtn || !nextBtn) return;

    const continueWatchingList = ContinueWatching.getCache(); // Use the cache

    if (continueWatchingList.length === 0) {
        Utils.setElementVisibility(sectionDiv, false); // Hide the whole section if empty
        return;
    }

    Utils.setElementVisibility(sectionDiv, true); // Ensure section is visible
    resultsContainer.innerHTML = ''; // Clear any skeletons or old content

    continueWatchingList.forEach(item => {
        const title = Utils.escapeHtml(item.title);
        const imagePath = item.backdrop_path || item.poster_path;
        const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w780${imagePath}` : null;
        const progressPercent = item.progressPercent || 0;

        let cardHref = `#player=${item.type}/${item.id}`;
        if (item.type === 'tv' && item.seasonNumber && item.episodeNumber) {
            cardHref += `/${item.seasonNumber}/${item.episodeNumber}`;
        }
        
        const cardLink = document.createElement('a');
        cardLink.href = cardHref;
        cardLink.className = 'h-card';
        cardLink.title = title + (item.episodeTitle ? ` - ${Utils.escapeHtml(item.episodeTitle)}` : '');

        const imageHtml = imageUrl
            ? `<img src="${imageUrl}" class="h-card-backdrop" alt="${title}" loading="lazy">`
            : `<div class="d-flex align-items-center justify-content-center h-100"><i class="bi bi-film fs-1 text-muted"></i></div>`;

        const overlayHtml = `
            <div class="h-card-overlay">
                <h3 class="h-card-title">${title}</h3>
                ${item.type === 'tv' && item.episodeTitle ? `<span class="h-card-episode-title">S${item.seasonNumber} E${item.episodeNumber} - ${Utils.escapeHtml(item.episodeTitle)}</span>` : ''}
                <div class="progress-bar-container mt-2">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%;" title="${progressPercent}% Watched"></div>
                </div>
            </div>
        `;
        
        cardLink.innerHTML = imageHtml + overlayHtml;
        resultsContainer.appendChild(cardLink);
    });

    // Setup horizontal scrolling
    App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn);
    if (!State.horizontalScrollContainers.some(c => c.container === resultsContainer)) {
        State.horizontalScrollContainers.push({ container: resultsContainer, prevBtn, nextBtn });
        resultsContainer.addEventListener('scroll', Utils.debounce(() => App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn), 100));
        prevBtn.addEventListener('click', () => App.handleHScrollPrev(resultsContainer));
        nextBtn.addEventListener('click', () => App.handleHScrollNext(resultsContainer));
    }
},
    
            /*loadContinueWatchingSection: (sectionDiv) => {
                if (!sectionDiv) {
                    sectionDiv = document.getElementById('continue-watching-section'); // Try to find it if not passed
                }
                 if (!sectionDiv) return; // Section doesn't exist

                 const resultsContainer = sectionDiv.querySelector('.horizontal-card-container');
                 const prevBtn = sectionDiv.querySelector('.h-scroll-btn.prev');
                 const nextBtn = sectionDiv.querySelector('.h-scroll-btn.next');
                 const scrollWrapper = sectionDiv.querySelector('.horizontal-scroll-wrapper');


                 if (!resultsContainer || !prevBtn || !nextBtn || !scrollWrapper) return; // Needed elements missing

                 const continueWatchingList = ContinueWatching.getList();

                 if (continueWatchingList.length === 0) {
                    sectionDiv.remove();
                    State.horizontalScrollContainers = State.horizontalScrollContainers.filter(c => c.container !== resultsContainer);
                    return;
                }

                 // Render cards using a modified horizontal renderer or directly build HTML
                 resultsContainer.innerHTML = ''; // Clear spinner
                 continueWatchingList.forEach(item => {
                     const title = Utils.escapeHtml(item.title);
                     const imagePath = item.backdrop_path || item.poster_path; // Prefer backdrop
                     const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w780${imagePath}` : null;
                     const year = item.lastWatchedTimestamp ? new Date(item.lastWatchedTimestamp).getFullYear() : ''; // Or fetch year if needed
                     const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
                     const progressPercent = item.progressPercent || 0; // Use stored dummy progress
                     resultsContainer.appendChild(cardLink);
                     // Determine link based on type
                     let cardHref = `#player=${item.type}/${item.id}`;
                     if (item.type === 'tv' && item.seasonNumber && item.episodeNumber) {
                         cardHref += `/${item.seasonNumber}/${item.episodeNumber}`;
                     }

                     const cardLink = document.createElement('a');
                     cardLink.href = cardHref;
                     cardLink.className = 'h-card';
                     cardLink.title = title + (item.episodeTitle ? ` - ${item.episodeTitle}` : '');

                     const imageHtml = imageUrl
                        ? `<img src="${imageUrl}" class="h-card-backdrop" alt="${title}" loading="lazy">`
                        : `<div class="d-flex align-items-center justify-content-center h-100"><i class="bi bi-film fs-1 text-muted"></i></div>`;

                     const overlayHtml = `
                         <div class="h-card-overlay">
                             <h3 class="h-card-title">${title}</h3>
                              ${item.type === 'tv' && item.episodeTitle ? `<span class="h-card-episode-title">S${item.seasonNumber} E${item.episodeNumber} - ${Utils.escapeHtml(item.episodeTitle)}</span>` : ''}
                             <p class="h-card-meta small opacity-80">
                                 ${rating ? `<span class="me-2"><i class="bi bi-star-fill text-warning"></i> ${rating}</span>` : ''}
                                 <span>Last watched: ${new Date(item.lastWatchedTimestamp).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</span>
                             </p>
                             ${ ''}
                             <div class="progress-bar-container">
                                 <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                             </div>
                         </div>
                     `;

                     // Add Watchlist button (optional, maybe remove from here?)
                     // const isInList = Watchlist.isInWatchlist(item.id, item.type);
                     // const watchlistBtnHtml = `...`; // Copied from renderHorizontalCards if needed

                     cardLink.innerHTML = imageHtml + overlayHtml; // + watchlistBtnHtml;

                    // Add remove from continue watching button? (Maybe better elsewhere)

                    resultsContainer.appendChild(cardLink);
                 });

                 // --- Add Listeners and Update Buttons ---
                  // Store container for resize listener
                  // Avoid duplicates if already added
                  if (!State.horizontalScrollContainers.some(c => c.container === resultsContainer)) {
                      State.horizontalScrollContainers.push({ container: resultsContainer, prevBtn, nextBtn });
                  }

                 App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn);
                 resultsContainer.removeEventListener('scroll', App.updateHScrollButtonsForContainer); // Remove old listener if any
                 resultsContainer.addEventListener('scroll', Utils.debounce(() => { App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn);}, 100), { passive: true });
                 prevBtn.removeEventListener('click', App.handleHScrollPrevForContainer);
                 prevBtn.addEventListener('click', () => App.handleHScrollPrev(resultsContainer));
                 nextBtn.removeEventListener('click', App.handleHScrollNextForContainer);
                 nextBtn.addEventListener('click', () => App.handleHScrollNext(resultsContainer));

            },*/

            handleHScrollPrev: (container) => {
                if (!container) return;
                const scrollAmount = container.clientWidth * 0.8; // Scroll ~80%
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            },

            handleHScrollNext: (container) => {
                if (!container) return;
                const scrollAmount = container.clientWidth * 0.8;
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            },

            updateHScrollButtons: (container, prevBtn, nextBtn) => {
                if (!container || !prevBtn || !nextBtn) {
                     console.warn("Missing elements for scroll button update");
                     return; // Exit if elements aren't found
                 }

                const { scrollLeft, scrollWidth, clientWidth } = container;
                const tolerance = 5; // Pixel tolerance

                // Check if scrolling is possible
                const canScroll = scrollWidth > clientWidth + tolerance;

                // Disable prev button if at the beginning
                prevBtn.classList.toggle('disabled', !canScroll || scrollLeft <= tolerance);

                // Disable next button if at the end
                nextBtn.classList.toggle('disabled', !canScroll || scrollLeft >= (scrollWidth - clientWidth - tolerance));
            },

           

            // --- NEW Rendering Function for Horizontal Cards ---
            renderHorizontalCards: (items, containerElement, defaultType = null, showTrailerButton = false) => {
                 if (!containerElement) return;
                 containerElement.innerHTML = ''; // Clear spinner/previous

                 if (!items || items.length === 0) {
                     containerElement.innerHTML = `<p class="text-muted px-3" style="width: 100%;">No items found.</p>`;
                     return;
                 }

                 items.forEach(item => {
                    // Determine type (movie/tv)
                    let itemType = item.media_type || defaultType;
                    if (!itemType) {
                        if (item.title) itemType = 'movie';
                        else if (item.name) itemType = 'tv';
                        else return; // Skip if unknown
                    }
                    if (itemType === 'person' || !item.id) return; // Skip people or items without ID

                    const title = Utils.escapeHtml(item.title || item.name || 'N/A');
                    // Use backdrop for horizontal cards, fallback to poster if needed
                    const imagePath = item.backdrop_path || item.poster_path;
                    // Use a larger backdrop size (w780)
                    const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w780${imagePath}` : null;
                    const year = (item.release_date || item.first_air_date || '').substring(0, 4);
                    const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

                    const cardLink = document.createElement('a');
                    cardLink.href = `#details=${itemType}/${item.id}`;
                    cardLink.className = 'h-card';
                    cardLink.title = title;

                    // Image or Placeholder
                    const imageHtml = imageUrl
                        ? `<img src="${imageUrl}" class="h-card-backdrop" alt="${title}" loading="lazy">`
                        : `<div class="d-flex align-items-center justify-content-center h-100"><i class="bi bi-film fs-1 text-muted"></i></div>`; // Placeholder icon

                     // Overlay Content
                    const overlayHtml = `
                        <div class="h-card-overlay">
                            <h3 class="h-card-title">${title}</h3>
                             <p class="h-card-meta small opacity-80">
                                ${year ? `<span>${year}</span>` : ''}
                                ${rating && parseFloat(rating) > 0 ? `<span class="ms-2"><i class="bi bi-star-fill text-warning"></i> ${rating}</span>` : ''}
                             </p>
                        </div>
                    `;

                    // Trailer Button (only added if showTrailerButton is true)
                    const trailerButtonHtml = showTrailerButton
                        ? `<button class="h-card-play-trailer-btn"
                                   aria-label="Play Trailer for ${title}"
                                   data-item-id="${item.id}"
                                   data-item-type="${itemType}">
                              <i class="bi bi-play-fill"></i>
                          </button>`
                        : '';
                    
                    const isInList = Watchlist.isInWatchlist(item.id, itemType);
                    const watchlistBtnHtml = `
                         <button class="btn watchlist-btn ${isInList ? 'in-watchlist' : ''}"
                                 title="${isInList ? 'In Watchlist (Click to remove)' : 'Add to Watchlist'}"
                                 aria-label="${isInList ? 'Remove from Watchlist' : 'Add to Watchlist'}"
                                 data-item-id="${item.id}"
                                 data-item-type="${itemType}"
                                 data-item-title="${Utils.escapeHtml(item.title || item.name || '')}"
                                 data-item-poster="${item.poster_path || null}"
                                 data-item-backdrop="${item.backdrop_path || null}"
                                 data-item-rating="${item.vote_average || null}"
                                 style="/* Adjust positioning if needed for h-card */ top: 0.6rem; right: 0.6rem;"
                                 >
                             <i class="bi ${isInList ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}"></i>
                         </button>
                    `;

                    cardLink.innerHTML = imageHtml + overlayHtml + trailerButtonHtml + watchlistBtnHtml;


                    // Add click listener for trailer button IF it exists
                    const trailerButton = cardLink.querySelector('.h-card-play-trailer-btn');
                    if (trailerButton) {
                        trailerButton.addEventListener('click', (e) => {
                            e.preventDefault(); // Prevent navigation from the link
                            e.stopPropagation(); // Stop event bubbling
                            App.handlePlayTrailerClick(e.currentTarget);
                        });
                    }

                    const addedWatchlistButton = cardLink.querySelector('.watchlist-btn');
                    if (addedWatchlistButton) {
                        addedWatchlistButton.addEventListener('click', (e) => {
                            e.preventDefault(); // Prevent link navigation
                            e.stopPropagation();
                            App.handleAddOrRemoveWatchlist(e.currentTarget);
                        });
                    }


                    containerElement.appendChild(cardLink);
                });
            },

             // --- NEW: Handler for Trailer Button Click ---
             handlePlayTrailerClick: async (button) => {
                 const itemId = button.dataset.itemId;
                 const itemType = button.dataset.itemType;
                 if (!itemId || !itemType) return;

                 // Show loading state on the button
                 button.disabled = true;
                 button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

                 try {
                     const videoData = await API.fetchTMDB(`/${itemType}/${itemId}/videos`);
                     // Find the official YouTube trailer
                     const trailer = videoData?.results?.find(vid =>
                         vid.site === 'YouTube' &&
                         (vid.type === 'Trailer' || vid.type === 'Teaser') && // Accept Teasers too
                         vid.official === true
                     ) || videoData?.results?.find(vid => // Fallback to any YouTube trailer/teaser
                         vid.site === 'YouTube' &&
                         (vid.type === 'Trailer' || vid.type === 'Teaser')
                     );


                     if (trailer && trailer.key) {
                         App.playTrailer(trailer.key); // Call the modal player
                     } else {
                         Utils.showToast("No official trailer found for this item.", "info");
                     }
                 } catch (error) {
                     console.error("Failed to fetch videos:", error);
                     Utils.showToast("Could not fetch trailer information.", "warning");
                 } finally {
                     // Reset button state
                     button.disabled = false;
                     button.innerHTML = `<i class="bi bi-play-fill"></i>`;
                 }
             },


            // Updated playTrailer to use the modal
            playTrailer: (youtubeKey) => {
                if (!youtubeKey || !DOM.trailerModalIframe || !bsInstances.trailerModal) {
                    console.error("Trailer key or modal components missing.");
                    return;
                };

                 // Set the iframe source with autoplay
                 DOM.trailerModalIframe.src = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0&modestbranding=1`; // Added params

                 // Show the modal
                 bsInstances.trailerModal.show();
            },

            loadDetailsPage: async (type, id) => {
                if (!DOM.detailsWrapper) return;

                // Show Skeleton
                DOM.detailsWrapper.innerHTML = Utils.getSkeletonDetailsHTML();

                // Wait for data and timeout in parallel
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                try {
                    const [itemData] = await Promise.all([
                        API.fetchTMDB(`/${type}/${id}`, {
                        append_to_response: 'credits,similar,videos,watch/providers'
                    }),
                        delay(4500) // ⏱️ Delay rendering for 5 seconds
                    ]);

                    if (!itemData) {
                       throw new Error("Item details not found.");
                    }

                    App.renderDetailsPage(itemData);

                } catch (error) {
                    console.error(`Failed to load details for ${type} ${id}:`, error);
                    DOM.detailsWrapper.innerHTML = Utils.getErrorHTML(`Failed to load details: ${error.message}`);
                }
         },

           /**
     * Loads and renders the user's profile dashboard page.
     * Fetches user info, watch history, watchlist, and favorites.
     */
    loadProfilePage: async () => {
        if (!DOM.profileView || !appAuth.currentUser || !appDb) {
            Utils.showToast("Please log in to view your profile.", "info");
            location.hash = '#home'; // Redirect if not logged in
            return;
        }

        const user = appAuth.currentUser;
        const userId = user.uid;

        // Display user info
        DOM.profileDisplayName.textContent = user.displayName || 'AuraStream User';
        DOM.profileEmail.textContent = user.email || 'N/A';
        DOM.profileNameInput.value = user.displayName || '';

        if (user.photoURL) {
            DOM.profileUserAvatarImage.src = user.photoURL;
            Utils.setElementVisibility(DOM.profileUserAvatarImage, true);
            Utils.setElementVisibility(DOM.profileUserAvatarInitials, false);
        } else {
            const initials = (user.displayName || user.email || 'A')
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            DOM.profileUserAvatarInitials.textContent = initials;
            Utils.setElementVisibility(DOM.profileUserAvatarImage, false);
            Utils.setElementVisibility(DOM.profileUserAvatarInitials, true);
        }

        // Handle Update Profile Name
        DOM.updateProfileForm.onsubmit = async (e) => {
            e.preventDefault();
            const newDisplayName = DOM.profileNameInput.value.trim();
            if (newDisplayName && newDisplayName !== user.displayName) {
                DOM.updateNameBtn.disabled = true;
                DOM.updateNameBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Updating...';
                try {
                    await user.updateProfile({ displayName: newDisplayName });
                    Utils.showToast("Display name updated!", "success");
                    // Update UI immediately
                    DOM.profileDisplayName.textContent = newDisplayName;
                    // Re-render avatar if needed (e.g., if initials changed)
                    App.loadProfilePage(); // Reload the whole page for simplicity
                } catch (error) {
                    console.error("Error updating profile:", error);
                    Utils.showToast(`Failed to update name: ${error.message}`, "danger");
                } finally {
                    DOM.updateNameBtn.disabled = false;
                    DOM.updateNameBtn.innerHTML = 'Update';
                }
            } else {
                Utils.showToast("Enter a new display name.", "info");
            }
        };

        // Handle Password Reset
        DOM.resetPasswordBtn.onclick = async () => {
            if (confirm("Send password reset email to " + user.email + "?")) {
                try {
                    await appAuth.sendPasswordResetEmail(user.email);
                    Utils.showToast("Password reset email sent!", "info");
                } catch (error) {
                    console.error("Error sending password reset:", error);
                    Utils.showToast(`Failed to send reset email: ${error.message}`, "danger");
                }
            }
        };

        // Handle Account Deletion
        DOM.deleteAccountBtn.onclick = async () => {
            if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
                try {
                    // It's a good practice to re-authenticate user before deletion
                    // This typically requires user to log in again via a popup or redirect.
                    // For simplicity in this example, we proceed directly, but be aware of security implications.
                    await user.delete();
                    Utils.showToast("Account deleted successfully.", "success");
                    location.hash = '#home'; // Redirect to home or login page
                    // Firebase Auth listener will handle logout UI
                } catch (error) {
                    console.error("Error deleting account:", error);
                    Utils.showToast(`Failed to delete account: ${error.message}. Please re-authenticate if recent.`, "danger");
                    // Often, Firebase requires recent authentication for deletion.
                    // If 'auth/requires-recent-login' error, prompt user to re-login.
                }
            }
        };


        // --- Load User Activity & Lists ---

        // 1. Recently Watched (from Firebase watchHistory)
        DOM.profileRecentWatchedContainer.innerHTML = Utils.getSkeletonHorizontalCardHTML(5); // Skeletons
        try {
            const recentWatchedSnapshot = await appDb.collection("users").doc(userId).collection("watchHistory")
                .orderBy("lastWatchedTimestamp", "desc")
                .limit(10) // Limit to 10 most recent
                .get();

            const recentWatchedItems = recentWatchedSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: data.tmdbId,
                    type: data.type,
                    title: data.title,
                    name: data.title, // For renderHorizontalCards compatibility
                    poster_path: data.poster_path,
                    backdrop_path: data.backdrop_path,
                    vote_average: data.vote_average,
                    lastWatchedTimestamp: data.lastWatchedTimestamp?.toDate().getTime(),
                    progressPercent: data.estimatedProgressPercent,
                    seasonNumber: data.seasonNumber,
                    episodeNumber: data.episodeNumber,
                    episodeTitle: data.episodeTitle,
                };
            }).filter(item => item.lastWatchedTimestamp);

            if (recentWatchedItems.length > 0) {
                App.renderHorizontalCards(recentWatchedItems, DOM.profileRecentWatchedContainer, null, false);
                // Update scroll buttons
                App.updateHScrollButtons(
                    DOM.profileRecentWatchedContainer,
                    DOM.profileRecentWatchedWrapper.querySelector('.h-scroll-btn.prev'),
                    DOM.profileRecentWatchedWrapper.querySelector('.h-scroll-btn.next')
                );
            } else {
                DOM.profileRecentWatchedContainer.innerHTML = '<p class="text-muted text-center col-12 py-4">No recent viewing activity.</p>';
            }
        } catch (error) {
            console.error("Error loading profile recent watched:", error);
            DOM.profileRecentWatchedContainer.innerHTML = Utils.getErrorHTML("Failed to load recent activity.");
        }


        // 2. Watchlist (from local storage, or migrate to Firebase)
        DOM.profileWatchlistGrid.innerHTML = Utils.getSkeletonCardHTML(4); // Skeletons
        try {
            // For simplicity, we'll use local storage version directly for now
            // For multi-device sync, you'd load from Firebase here similar to watchHistory
            const userWatchlist = Watchlist.getList(); // This gets from State.watchlist (populated from local storage)

            if (userWatchlist.length > 0) {
                // Render a subset for summary, provide link to full watchlist page
                const itemsToRender = userWatchlist.slice(0, 4); // Show first 4
                App.renderTmdbCards(itemsToRender, DOM.profileWatchlistGrid, null, false);
                // Watchlist cards have their own remove buttons
            } else {
                DOM.profileWatchlistGrid.innerHTML = '<p class="text-muted text-center col-12 py-4">Your watchlist is empty.</p>';
            }
        } catch (error) {
            console.error("Error loading profile watchlist:", error);
            DOM.profileWatchlistGrid.innerHTML = Utils.getErrorHTML("Failed to load watchlist.");
        }


        // 3. Favorites (from local storage, or migrate to Firebase)
        DOM.profileFavoritesGrid.innerHTML = Utils.getSkeletonCardHTML(4); // Skeletons
        try {
            // Similar to watchlist, currently local storage
            const userFavorites = Favorites.getList(); // Assuming Favorites.getList() exists and works

            if (userFavorites.length > 0) {
                // Render a subset for summary, provide link to full analytics/favorites page
                const itemsToRender = userFavorites.slice(0, 4); // Show first 4
                App.renderTmdbCards(itemsToRender, DOM.profileFavoritesGrid, null, false);
            } else {
                DOM.profileFavoritesGrid.innerHTML = '<p class="text-muted text-center col-12 py-4">You have no favorites yet.</p>';
            }
        } catch (error) {
            console.error("Error loading profile favorites:", error);
            DOM.profileFavoritesGrid.innerHTML = Utils.getErrorHTML("Failed to load favorites.");
        }

        // Add event listener for horizontal scroll container if it's not already added
        if (!State.horizontalScrollContainers.some(c => c.container === DOM.profileRecentWatchedContainer)) {
            State.horizontalScrollContainers.push({
                container: DOM.profileRecentWatchedContainer,
                prevBtn: DOM.profileRecentWatchedWrapper.querySelector('.h-scroll-btn.prev'),
                nextBtn: DOM.profileRecentWatchedWrapper.querySelector('.h-scroll-btn.next')
            });
            DOM.profileRecentWatchedContainer.addEventListener('scroll', Utils.debounce(() => {
                App.updateHScrollButtons(
                    DOM.profileRecentWatchedContainer,
                    DOM.profileRecentWatchedWrapper.querySelector('.h-scroll-btn.prev'),
                    DOM.profileRecentWatchedWrapper.querySelector('.h-scroll-btn.next')
                );
            }, 100), { passive: true });
        }
        DOM.profileRecentWatchedWrapper.querySelector('.h-scroll-btn.prev').addEventListener('click', () => App.handleHScrollPrev(DOM.profileRecentWatchedContainer));
        DOM.profileRecentWatchedWrapper.querySelector('.h-scroll-btn.next').addEventListener('click', () => App.handleHScrollNext(DOM.profileRecentWatchedContainer));

        App.initializeTooltips(DOM.profileView); // Initialize tooltips for the new content
    },

         loadPlayerPageContext: async (type, id, season = null, episode = null) => {
             if (!DOM.playerTitleEl || !DOM.playerSourceBtnsContainer || !DOM.playerIframe || !DOM.playerIframePlaceholder || !DOM.playerEpisodeSelectorContainer) return;

             // Reset player view
             DOM.playerTitleEl.textContent = 'Loading Player...';
             DOM.playerSourceBtnsContainer.innerHTML = '';
             Utils.setElementVisibility(DOM.playerIframe, false);
             Utils.setElementVisibility(DOM.playerIframePlaceholder, true);
             Utils.setElementVisibility(DOM.playerEpisodeSelectorContainer, false);
             DOM.playerEpisodeSelectorContainer.innerHTML = '';

             State.moviePlayerContext = { 
                itemId: id,
                itemType: type, 
                currentSeason: season, 
                currentEpisode: episode,
                itemData: null 
            }; // Store context

            try {
                // Fetch with append_to_response to get runtime for movies, episode_run_time for TV
                const itemData = await API.fetchTMDB(`/${type}/${id}`, { append_to_response: 'videos,credits' });
                if (!itemData) throw new Error("Media item not found.");

                // Store the full itemData for use by recordUserWatchActivity
                State.moviePlayerContext.itemData = itemData; // <<< STORE FULL itemData

                const title = Utils.escapeHtml(itemData.title || itemData.name || 'Media Item');
                DOM.playerTitleEl.textContent = title;

                App.renderStreamingSourceButtons();

                let tvDetails = {};

            if (type === 'tv') {
                const targetSeasonNum = season || (itemData.last_episode_to_air?.season_number || 1);
                const seasonDetails = await API.fetchTMDB(`/tv/${id}/season/${targetSeasonNum}`);
                    
                //if (!seasonDetails || !seasonDetails.episodes) throw new Error("Season data not found.");
                if (!seasonDetails?.episodes) throw new Error("Season data not found.");

                // If no specific episode, try to find the last watched one for that season from Firebase, or default to 1
                if (!episode && appAuth.currentUser && appDb) {
                    const userId = appAuth.currentUser.uid;
                    const docIdPrefix = `tv-${id}-s${targetSeasonNum}-e`; // Pattern for episodes
                    const watchHistorySnapshot = await appDb.collection("users").doc(userId).collection("watchHistory")
                        .orderBy("lastWatchedTimestamp", "desc")
                        .where("tmdbId", "==", id)
                        .where("seasonNumber", "==", targetSeasonNum)
                        .limit(1) // Get the most recent watched episode for this season
                        .get();

                    if (!watchHistorySnapshot.empty) {
                        const lastWatchedEp = watchHistorySnapshot.docs[0].data();
                        State.moviePlayerContext.currentEpisode = lastWatchedEp.episodeNumber;
                        console.log(`[Player] Resuming TV show: Season ${targetSeasonNum}, Episode ${lastWatchedEp.episodeNumber}`);
                    } else {
                        State.moviePlayerContext.currentEpisode = 1; // Default to first episode
                    }
                }

                   const currentEpisodeDetails = seasonDetails.episodes.find(ep => ep.episode_number === State.moviePlayerContext.currentEpisode);
                    tvDetails = {
                        seasonNumber: targetSeasonNum,
                        episodeNumber: State.moviePlayerContext.currentEpisode,
                        episodeTitle: currentEpisodeDetails?.name || `Episode ${State.moviePlayerContext.currentEpisode}`
                    };
                    App.renderEpisodeSelectors(itemData, seasonDetails);
                    Utils.setElementVisibility(DOM.playerEpisodeSelectorContainer, true);

            } else { // For movies
                const firstButton = DOM.playerSourceBtnsContainer.querySelector('button');
                if (firstButton) {
                    App.setStreamingSource(parseInt(firstButton.dataset.sourceIndex));
                } else {
                    DOM.playerIframePlaceholder.innerHTML = `<span class="text-muted">No streaming sources available.</span>`;
                }
            }

                // V V V THIS IS THE NEW LINE TO START TRACKING V V V
                ContinueWatching.startTracking(itemData, tvDetails);
                // ^ ^ ^ THIS IS THE NEW LINE TO START TRACKING ^ ^ ^

        } catch (error) {
            console.error("Failed to load player context:", error);
            DOM.playerTitleEl.textContent = 'Error Loading Player';
            DOM.playerIframePlaceholder.innerHTML = Utils.getErrorHTML(`Error: ${error.message}`);
            State.moviePlayerContext.itemData = null; // Clear on error
        }
    },

        

          

             loadTmdbSearchResults: async (query) => {
                 if (!DOM.tmdbSearchResultsGrid || !DOM.tmdbSearchResultsTitle) return;

                 DOM.tmdbSearchResultsTitle.textContent = `Search Results for "${query}"`;
                 // *** Show Skeleton ***
                 DOM.tmdbSearchResultsGrid.innerHTML = Utils.getSkeletonCardHTML(50); // Show 12 skeletons for search

                 try {
                     const searchData = await API.fetchTMDB('/search/multi', { query: query, page: 1, include_adult: false });
                     // *** Render function replaces skeleton ***
                     if (searchData && searchData.results) {
                         const mediaResults = searchData.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
                         App.renderTmdbCards(mediaResults, DOM.tmdbSearchResultsGrid, null, false); // renderTmdbCards clears container
                     } else {
                         DOM.tmdbSearchResultsGrid.innerHTML = '<p class="text-muted col-12 py-4 text-center">No results found.</p>'; // Replace skeleton
                     }
                 } catch (error) {
                     console.error("Search failed:", error);
                     DOM.tmdbSearchResultsGrid.innerHTML = Utils.getErrorHTML(`Search failed: ${error.message}`); // Replace skeleton
                 }
             },


            /**
     * Loads and renders results for a specific genre.
     * Handles initial loading, pagination, header background, and skeleton/spinner display.
     * @param {number} [page=1] - The page number to fetch.
     */
    loadGenreResultsPage: async (page = 1) => {
        // --- 1. Initial Validation & Error Handling Setup ---
        // Check if all necessary DOM elements and current genre state are available.
        // If not, log an error, ensure loaders are hidden/shown appropriately, and exit.
        if (!State.currentGenre || !DOM.genreResultsGrid || !DOM.genreResultsTitleDynamic || !DOM.loadMoreGenreBtn || !DOM.genreLoadingSpinner || !DOM.genreHeaderSection) {
            console.error("loadGenreResultsPage: Missing critical DOM elements or State.currentGenre is not set.");
            // Ensure the loading spinner is hidden and the load more button is visible (as a retry or no-more-items indicator).
            if (DOM.genreLoadingSpinner) Utils.setElementVisibility(DOM.genreLoadingSpinner, false);
            if (DOM.loadMoreGenreBtn) Utils.setElementVisibility(DOM.loadMoreGenreBtn, true);
            return; // Exit the function immediately as we cannot proceed.
        }

        // Destructure current genre details for easier access.
        const { type, id, name } = State.currentGenre;
        // Determine if this is the first page load or a subsequent "Load More" action.
        const isLoadingMore = page > 1;
        let startTime = null; // Used to measure loading time for minimum skeleton display.

        // --- 2. Set Initial Loading UI State ---
        // Hide the "Load More" button and show the spinner at the start of any data fetch.
        Utils.setElementVisibility(DOM.loadMoreGenreBtn, false);
        Utils.setElementVisibility(DOM.genreLoadingSpinner, true); // Show the spinner next to the load more button.

        // --- 3. Initial Load Specific Setup (Only on page 1) ---
        // If it's the first page being loaded:
        if (!isLoadingMore) {
            // Populate the results grid with skeletons to indicate loading content.
            DOM.genreResultsGrid.innerHTML = Utils.getSkeletonCardHTML(80); // Show a generous number of skeletons.

            // Reset the genre header's background and show its skeleton.
            DOM.genreHeaderSection.style.backgroundImage = 'none'; // Clear any previous background image.
            // Remove 'd-none' from the header's skeleton to make it visible.
            DOM.genreHeaderSection.querySelector('.skeleton-genre-header').classList.remove('d-none');
            DOM.genreResultsTitleDynamic.textContent = ''; // Clear the title text temporarily.

            startTime = performance.now(); // Record the start time for skeleton display duration.
        }

        let genreData = null; // Initialize genreData to null for scope.

        // --- 4. Data Fetching Logic (Try Block) ---
        try {
            // Fetch genre-specific data from TMDb.
            genreData = await API.fetchTMDB(`/discover/${type}`, {
                with_genres: id,
                page: page,
                sort_by: 'popularity.desc', // Sort by popularity in descending order.
                include_adult: false // Exclude adult content from results.
            });

            // --- Handle Header Background Image (Only for initial load, page 1) ---
            // If it's the initial load AND data was successfully fetched AND there are results:
            if (!isLoadingMore && genreData && genreData.results && genreData.results.length > 0) {
                // Find the first item in the results that has a `backdrop_path`.
                const itemWithBackdrop = genreData.results.find(item => item.backdrop_path);
                if (itemWithBackdrop) {
                    // Construct the full URL for the backdrop image.
                    const backdropUrl = `${config.BACKDROP_BASE_URL}${itemWithBackdrop.backdrop_path}`;
                    // Set the background image of the genre header section.
                    // This will trigger the CSS transition for a smooth visual effect.
                    DOM.genreHeaderSection.style.backgroundImage = `url('${backdropUrl}')`;
                } else {
                    // If no item with a backdrop is found, use a fallback background (e.g., solid color).
                    DOM.genreHeaderSection.style.backgroundImage = 'none'; // Ensure no image is set.
                    DOM.genreHeaderSection.style.backgroundColor = 'rgba(var(--surface-rgb), 0.5)'; // Apply a semi-transparent surface color.
                }
            }

            // --- Render Results to the Grid ---
            // If data was fetched successfully and there are results:
            if (genreData && genreData.results) {
                // Render the cards into the genre results grid.
                // `isLoadingMore` acts as the `append` flag: true to append, false to replace.
                App.renderTmdbCards(genreData.results, DOM.genreResultsGrid, type, isLoadingMore);
            } else {
                // If no results were found for the current query (and it's the initial load):
                if (!isLoadingMore) {
                    // Display a "No results found" message in the grid area.
                    DOM.genreResultsGrid.innerHTML = '<p class="text-muted col-12 py-4 text-center">No results found for this genre.</p>';
                }
                // If no results or no more pages, the "Load More" button will remain hidden by default.
            }

        } catch (error) {
            // --- 5. Error Handling (Catch Block) ---
            console.error("Genre results loading failed:", error); // Log the error for debugging.
            // If it's the initial load and an error occurred:
            if (!isLoadingMore) {
                // Display a user-friendly error message in the grid.
                DOM.genreResultsGrid.innerHTML = Utils.getErrorHTML(`Failed to load genre results: ${error.message}`);
                // Apply a visual error state to the header (e.g., red background).
                DOM.genreHeaderSection.style.backgroundImage = 'none';
                DOM.genreHeaderSection.style.backgroundColor = 'var(--danger-color)';
                // Ensure the header skeleton is hidden on error.
                DOM.genreHeaderSection.querySelector('.skeleton-genre-header').classList.add('d-none');
            } else {
                // If it's a "Load More" request that failed, show a toast notification.
                Utils.showToast(`Failed to load more results: ${error.message}`, 'warning');
            }
        } finally {
            // --- 6. Final UI State Management (Finally Block) ---
            // This block always executes, regardless of try/catch outcome, to ensure UI is consistent.

            // Debugging logs to inspect the final state of genreData and pagination.
            console.log("--- Genre Load Finally Block ---");
            console.log("genreData:", genreData); // Log the full API response.
            console.log("Current Page:", genreData?.page, "Total Pages:", genreData?.total_pages);

            // Determine if there are more pages to load.
            // `canLoadMore` is true if the current page is less than the total available pages.
            const canLoadMore = (genreData?.page || 0) < (genreData?.total_pages || 0);
            console.log("Can Load More:", canLoadMore); // Log the critical `canLoadMore` flag.

            // Update the genre title in the header.
            DOM.genreResultsTitleDynamic.textContent = `${Utils.escapeHtml(name)} ${type === 'tv' ? 'TV Shows' : 'Movies'}`;
            // Hide the header skeleton now that content (or an error) is displayed.
            DOM.genreHeaderSection.querySelector('.skeleton-genre-header').classList.add('d-none');

            // Set the visibility of the "Load More" button based on `canLoadMore`.
            Utils.setElementVisibility(DOM.loadMoreGenreBtn, canLoadMore);
            if (canLoadMore) {
                // If more pages are available, update the `data-page` attribute
                // of the "Load More" button to the *next* page number to be fetched.
                DOM.loadMoreGenreBtn.dataset.page = (genreData?.page || 1) + 1;
            } else {
                // If no more pages, remove the `data-page` attribute to prevent stale data.
                delete DOM.loadMoreGenreBtn.dataset.page;
            }

            // Hide the loading spinner.
            Utils.setElementVisibility(DOM.genreLoadingSpinner, false);

            // Implement a minimum display time for skeletons on the initial load.
            // This prevents a "flicker" effect on very fast connections.
            if (!isLoadingMore && startTime) {
                const endTime = performance.now();
                const elapsedTime = endTime - startTime;
                const remainingTime = Math.max(0, (config.MIN_SKELETON_DISPLAY_TIME || 3000) - elapsedTime);
                if (remainingTime > 0) {
                     console.log(`Delaying genre render by ${remainingTime.toFixed(0)}ms for skeleton display.`);
                     // Wait for the remaining time before truly finishing the load process.
                     await new Promise(resolve => setTimeout(resolve, remainingTime));
                }
            }
            console.log("--- Genre Load Finally Block END ---");
        }
    },

           /*
              loadGenreResultsPage: async (page = 1) => {
                 if (!State.currentGenre || !DOM.genreResultsGrid || !DOM.genreResultsTitle || !DOM.loadMoreGenreBtn || !DOM.genreLoadingSpinner) return;

                 const { type, id, name } = State.currentGenre;
                 DOM.genreResultsTitle.textContent = `${Utils.escapeHtml(name)} ${type === 'tv' ? 'TV Shows' : 'Movies'}`;

                 const isLoadingMore = page > 1;
                 Utils.setElementVisibility(DOM.loadMoreGenreBtn, false);
                 Utils.setElementVisibility(DOM.genreLoadingSpinner, true); // Show spinner *near* button

                 // *** Show Skeleton ONLY on first load ***
                 if (!isLoadingMore) {
                     DOM.genreResultsGrid.innerHTML = Utils.getSkeletonCardHTML(80); // Show 12 skeletons initially
                 }

                 try {
                     const genreData = await API.fetchTMDB(`/discover/${type}`, {
                         with_genres: id,
                         page: page,
                         sort_by: 'popularity.desc'
                     });

                     // *** Render function replaces skeleton (if page 1) or appends ***
                     if (genreData && genreData.results) {
                         // Pass 'append' flag correctly to renderTmdbCards
                         App.renderGenreResultsPage(genreData.results, genreData.page, genreData.total_pages);
                     } else {
                         if (!isLoadingMore) DOM.genreResultsGrid.innerHTML = '<p class="text-muted col-12 py-4 text-center">No results found for this genre.</p>'; // Replace skeleton
                         Utils.setElementVisibility(DOM.loadMoreGenreBtn, false);
                     }
                 } catch (error) {
                    console.error("Genre results loading failed:", error);
                     if (!isLoadingMore) {
                         DOM.genreResultsGrid.innerHTML = Utils.getErrorHTML(`Failed to load genre results: ${error.message}`); // Replace skeleton
                     } else {
                          Utils.showToast(`Failed to load more results: ${error.message}`, 'warning');
                          // Leave existing cards, spinner will hide below
                     }
                 } finally {
                     Utils.setElementVisibility(DOM.genreLoadingSpinner, false);
                 }
             },
*/
            handleTmdbSearchSubmit: (event) => {
                 event.preventDefault();
                 const query = DOM.tmdbSearchInput?.value.trim();
                 if (query) {
                     // Change hash to trigger search view via Router
                     location.hash = '#search';
                     // Router will call loadTmdbSearchResults if query exists
                 } else {
                     Utils.showToast("Please enter something to search for.", "warning");
                 }
             },

             handleTmdbSearchInput: () => {
                // Optional: Can implement live search suggestions here
                // For now, just allows typing until submit
                console.log("Search input changed:", DOM.tmdbSearchInput?.value);
                 // Example: Clear previous timeout if exists
                 // clearTimeout(State.tmdbSearchTimeout);
                 // State.tmdbSearchTimeout = setTimeout(() => {
                 //     const query = DOM.tmdbSearchInput?.value.trim();
                 //     if (query.length > 2) { /* Fetch suggestions */ }
                 // }, 500);
             },

             clearTmdbSearch: (event) => {
                 event.preventDefault();
                 if (DOM.tmdbSearchInput) DOM.tmdbSearchInput.value = '';
                 // Navigate back to home view
                 location.hash = '#home';
                 // Hide search results container (Router will handle view switching)
                 // Utils.setElementVisibility(DOM.tmdbSearchResultsContainer, false);
                 // Utils.setElementVisibility(DOM.homeContentWrapper, true);
             },

             handleLoadMoreGenres: () => {
                 if (!DOM.loadMoreGenreBtn) return;
                 const currentPage = parseInt(DOM.loadMoreGenreBtn.dataset.page || '1');
                 App.loadGenreResultsPage(currentPage + 1);
             },

              /**
     * Fetches TMDB watch provider lists for movie/tv in the target region
     * and caches them in State.tmdbWatchProviders if not already loaded.
     * Uses Maps for efficient lookup.
     * @returns {Promise<boolean>} True if providers are loaded/cached, false on error.
     */
    ensureTmdbWatchProvidersLoaded: async () => {
        if (State.tmdbWatchProviders) {
            return true; // Already loaded
        }
        console.log("Fetching TMDB watch provider lists for caching...");
        try {
            const [movieProvidersResponse, tvProvidersResponse] = await Promise.all([
                API.fetchTMDB(`/watch/providers/movie`, { watch_region: config.TARGET_REGION }),
                API.fetchTMDB(`/watch/providers/tv`, { watch_region: config.TARGET_REGION })
            ]);

            const movieProviders = movieProvidersResponse?.results || [];
            const tvProviders = tvProvidersResponse?.results || [];

            // Use Maps for efficient ID lookup. Store both lists.
            // If a provider exists in both, the details are usually the same.
            State.tmdbWatchProviders = {
                movie: new Map(movieProviders.map(p => [p.provider_id, p])),
                tv: new Map(tvProviders.map(p => [p.provider_id, p]))
            };

            console.log(`Cached ${State.tmdbWatchProviders.movie.size} movie providers and ${State.tmdbWatchProviders.tv.size} TV providers.`);
            return true;

        } catch (error) {
            console.error("Failed to fetch or cache TMDB watch providers:", error);
            State.tmdbWatchProviders = null; // Ensure it's null on error
            Utils.showToast("Could not load provider information.", "warning");
            return false;
        }
    },

    /**
     * Gets provider details by ID, checking curated list first, then cached TMDB lists.
     * @param {number} providerId - The ID of the provider.
     * @returns {object} Object with { id, name, logo } or fallback if not found.
     */
    getProviderDetails: (providerId) => {
        if (!providerId) return null;

        // 1. Check Curated List First (using your config)
        const curatedProvider = config.CURATED_WATCH_PROVIDERS.find(p => p.id === providerId);
        if (curatedProvider) {
            console.log(`Provider ${providerId} found in curated list: ${curatedProvider.name}`);
            // Ensure logo URL is correctly formed (handle relative paths if any)
             const logoUrl = curatedProvider.logo
                           ? (curatedProvider.logo.startsWith('/') ? `${config.LOGO_BASE_URL}${curatedProvider.logo}` : curatedProvider.logo)
                           : null; // Or a default placeholder image URL
            return {
                id: curatedProvider.id,
                name: curatedProvider.name,
                logo: logoUrl
            };
        }

        // 2. Check Cached TMDB Lists (ensure they are loaded)
        if (State.tmdbWatchProviders) {
            // Look in movie providers first, then tv providers
            const tmdbProvider = State.tmdbWatchProviders.movie.get(providerId) || State.tmdbWatchProviders.tv.get(providerId);
            if (tmdbProvider) {
                console.log(`Provider ${providerId} found in cached TMDB list: ${tmdbProvider.provider_name}`);
                return {
                    id: tmdbProvider.provider_id,
                    name: tmdbProvider.provider_name,
                    logo: tmdbProvider.logo_path ? `${config.LOGO_BASE_URL}${tmdbProvider.logo_path}` : null // Construct URL
                };
            }
        }

        // 3. Fallback if not found anywhere
        console.warn(`Provider ${providerId} not found in curated or cached TMDB lists. Using fallback.`);
        return {
            id: providerId,
            name: `Provider ${providerId}`, // Generic name
            logo: null // Or a default placeholder image URL: 'https://via.placeholder.com/50x50/cccccc/808080?text=?'
        };
    },

            // --- Network Functions ---
            renderNetworkLogos: async () => { // Ensure this is async if it wasn't already
    if (!DOM.networkLogosContainer) {
         console.warn("Network logos container not found.");
         return;
     }
    DOM.networkLogosContainer.innerHTML = ''; // Clear previous

    if (!config.CURATED_WATCH_PROVIDERS || config.CURATED_WATCH_PROVIDERS.length === 0) {
        DOM.networkLogosContainer.innerHTML = '<p class="text-muted small px-3">No networks defined.</p>';
        App.updateNetworkScrollButtons();
        return;
    }

    // --- Loop ONCE to create and append ---
    config.CURATED_WATCH_PROVIDERS.forEach(provider => {
        const logoPath = provider.logo;
        // Handle potential absolute URLs vs relative paths needing IMAGE_BASE_URL/LOGO_BASE_URL
        const logoUrl = logoPath
            ? (logoPath.startsWith('/') ? `${config.LOGO_BASE_URL}${logoPath}` : logoPath) // Check if path starts with '/'
            : 'https://via.placeholder.com/100x50/1a1d24/666?text=No+Logo';

        const item = document.createElement('div'); // <<< Create the 'item' div
        item.className = 'network-logo-item';
        item.dataset.providerId = provider.id;
        item.dataset.providerName = provider.name;
        item.innerHTML = `
            <img src="${logoUrl}" alt="${Utils.escapeHtml(provider.name)}" loading="lazy" title="${Utils.escapeHtml(provider.name)}">
            <span>${Utils.escapeHtml(provider.name)}</span>
        `;
        item.addEventListener('click', App.handleNetworkLogoClick);
        DOM.networkLogosContainer.appendChild(item); // <<< Append the created 'item'
    });
    // --- REMOVE THE DUPLICATE LOOP THAT WAS HERE ---

    // Update scroll buttons AFTER logos are added
    App.updateNetworkScrollButtons();
},
          

             handleNetworkLogoClick: (event) => {
                 const providerId = event.currentTarget.dataset.providerId;
                 if (providerId) {
                     location.hash = `#network=${providerId}`; // Navigate to network results view
                 }
             },

                /**
     * Loads and displays content for the currently selected network provider.
     * Shows skeleton loaders for a minimum duration on initial load.
     * @param {number} [page=1] - The page number to fetch.
     */
    loadNetworkResultsPage: async (page = 1) => {
        // --- 1. Initial Checks ---
        if (!State.currentNetwork || !DOM.networkResultsGrid || !DOM.networkResultsTitle || !DOM.loadMoreNetworkBtn || !DOM.networkLoadingSpinner) {
            console.error("loadNetworkResultsPage: Missing state or required DOM elements.");
            if (DOM.networkResultsGrid) { // Attempt to show error in grid if possible
                 DOM.networkResultsGrid.innerHTML = Utils.getErrorHTML("Page setup error. Cannot load results.");
            }
            // Optionally hide spinner/button if they exist
            if (DOM.networkLoadingSpinner) Utils.setElementVisibility(DOM.networkLoadingSpinner, false);
            if (DOM.loadMoreNetworkBtn) Utils.setElementVisibility(DOM.loadMoreNetworkBtn, false);
            return;
        }

        // --- 2. State and Flags ---
        const { id, name, logo } = State.currentNetwork;
        const isInitialLoad = (page === 1);
        let startTime = null;

        // --- 3. Setup Loading State ---
        Utils.setElementVisibility(DOM.loadMoreNetworkBtn, false); // Always hide 'Load More' at the start of any load
        Utils.setElementVisibility(DOM.networkLoadingSpinner, true); // Show spinner

        if (isInitialLoad) {
            // a. Set Title (only on initial load)
            let titleHtml = Utils.escapeHtml(name);
            if (logo && DOM.networkResultsTitle) {
                 // Example: Logo first, then name
                 titleHtml = `<img src="${logo}" alt="${Utils.escapeHtml(name)}" style="height: 30px; width: auto; margin-right: 10px; vertical-align: middle; border-radius: 4px;"> ${titleHtml}`;
                 DOM.networkResultsTitle.innerHTML = `Content on ${titleHtml}`;
            } else if (DOM.networkResultsTitle) {
                 DOM.networkResultsTitle.textContent = `Content on ${titleHtml}`;
            }

            // b. Show Skeletons
            DOM.networkResultsGrid.innerHTML = Utils.getSkeletonCardHTML(24); // Use a sufficiently large number

            // c. Start Timer
            startTime = performance.now();
        }

        // --- 4. Data Fetching ---
        let networkData = null;
        let fetchError = null;
        let discoveryType = 'movie'; // Default

        try {
            // Determine content type (simple example, adjust as needed)
            const tvFocusedProviders = [203]; // e.g., Crunchyroll ID
            if (tvFocusedProviders.includes(id)) {
                 discoveryType = 'tv';
            }
            console.log(`Fetching page ${page} of /discover/${discoveryType} for provider ${id} (${name})`);

            networkData = await API.fetchTMDB(`/discover/${discoveryType}`, {
                 with_watch_providers: id,
                 watch_region: config.TARGET_REGION,
                 page: page,
                 sort_by: 'popularity.desc' // Or other relevant sorting
            });
            // Store type for rendering phase if needed (optional, depends if renderContent needs it)
             State.currentNetwork.lastDiscoveryType = discoveryType;

        } catch (error) {
            fetchError = error;
            console.error(`Failed to fetch network results (page ${page}):`, error);
        }

        // --- 5. Render Content Function ---
        const renderContent = () => {
            // Hide spinner *before* potentially replacing grid content
            Utils.setElementVisibility(DOM.networkLoadingSpinner, false);

            if (fetchError) {
                 // Handle fetch error display
                 if (isInitialLoad) {
                     DOM.networkResultsGrid.innerHTML = Utils.getErrorHTML(`Failed to load results: ${fetchError.message}`);
                 } else {
                     // Show toast for "Load More" errors, don't clear existing results
                     Utils.showToast(`Failed to load more results: ${fetchError.message}`, 'warning');
                     // Optionally re-enable the button to allow retry?
                     // Utils.setElementVisibility(DOM.loadMoreNetworkBtn, true);
                 }
            } else if (networkData && networkData.results && networkData.results.length > 0) {
                 // Render successful results
                 // Retrieve the type determined during fetch
                 const fetchedType = State.currentNetwork.lastDiscoveryType || 'movie';
                 App.renderNetworkResultsPage(
                     networkData.results,
                     networkData.page,
                     networkData.total_pages,
                     fetchedType, // Pass the correct type
                     !isInitialLoad // Pass append flag (true if not initial load)
                 );
            } else {
                 // Handle case where fetch was successful but no results found
                 if (isInitialLoad) {
                     DOM.networkResultsGrid.innerHTML = '<p class="text-muted col-12 py-4 text-center">No results found for this network.</p>';
                 }
                 // If no results on page 1, or no more results on subsequent pages, keep 'Load More' hidden
                 Utils.setElementVisibility(DOM.loadMoreNetworkBtn, false);
            }
        };

        // --- 6. Delay Logic ---
        if (isInitialLoad && startTime) {
            const endTime = performance.now();
            const elapsedTime = endTime - startTime;
            // Calculate remaining time, ensuring it's not negative
            const remainingTime = Math.max(0, (config.MIN_SKELETON_DISPLAY_TIME || 3000) - elapsedTime); // Use config or default

            console.log(`Data fetch took ${elapsedTime.toFixed(0)}ms. Waiting additional ${remainingTime.toFixed(0)}ms.`);
            setTimeout(renderContent, remainingTime);
        } else {
            // Render immediately for "Load More" (page > 1) or if timer logic failed
            renderContent();
        }
    },

    /**
     * Renders the fetched network results into the grid and updates the 'Load More' button.
     * @param {Array} results - Array of movie/TV show objects from TMDB.
     * @param {number} currentPage - The current page number that was loaded.
     * @param {number} totalPages - The total number of pages available.
     * @param {string} [itemType='movie'] - The type of items ('movie' or 'tv').
     * @param {boolean} [append=false] - Whether to append results or replace grid content.
     */
    renderNetworkResultsPage: (results, currentPage, totalPages, itemType = 'movie', append = false) => {
        if (!DOM.networkResultsGrid || !DOM.loadMoreNetworkBtn) {
            console.error("renderNetworkResultsPage: Missing required DOM elements.");
            return;
        }

        // --- 1. Render Cards ---
        // Pass the append flag to renderTmdbCards
        App.renderTmdbCards(results, DOM.networkResultsGrid, itemType, append);

        // --- 2. Update Load More Button ---
        const canLoadMore = currentPage < totalPages;
        Utils.setElementVisibility(DOM.loadMoreNetworkBtn, canLoadMore);

        if (canLoadMore) {
            // Update button state for the *next* potential load
            DOM.loadMoreNetworkBtn.dataset.page = currentPage; // Store the page just loaded
            DOM.loadMoreNetworkBtn.dataset.itemType = itemType; // Store type for next load
            // The actual loading of currentPage + 1 happens in handleLoadMoreNetworkResults
        }
    },

          

            handleLoadMoreNetworkResults: () => {
                 if (!DOM.loadMoreNetworkBtn) return;
                 const currentPage = parseInt(DOM.loadMoreNetworkBtn.dataset.page || '1');
                 App.loadNetworkResultsPage(currentPage + 1);
            },

             // --- Network Carousel Scrolling ---
            handleNetworkScrollPrev: () => {
                if (!DOM.networkLogosContainer) return;
                // Scroll left by roughly 80% of the container width
                const scrollAmount = DOM.networkLogosContainer.clientWidth * 0.8;
                DOM.networkLogosContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            },

            handleNetworkScrollNext: () => {
                if (!DOM.networkLogosContainer) return;
                // Scroll right by roughly 80% of the container width
                const scrollAmount = DOM.networkLogosContainer.clientWidth * 0.8;
                DOM.networkLogosContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            },

            updateNetworkScrollButtons: () => {
                if (!DOM.networkLogosContainer || !DOM.networkPrevBtn || !DOM.networkNextBtn) return;

                const { scrollLeft, scrollWidth, clientWidth } = DOM.networkLogosContainer;
                const tolerance = 2; // Pixels tolerance for scroll limits

                // Check if scrolling is possible at all
                const canScroll = scrollWidth > clientWidth + tolerance;

                // Disable prev button if at the beginning
                DOM.networkPrevBtn.classList.toggle('disabled', !canScroll || scrollLeft <= tolerance);
                // Disable next button if at the end
                DOM.networkNextBtn.classList.toggle('disabled', !canScroll || scrollLeft >= (scrollWidth - clientWidth - tolerance));

                // Optional: Make buttons slightly more visible if scrollable, even without hover
                DOM.networkPrevBtn.classList.toggle('visible', !DOM.networkPrevBtn.classList.contains('disabled'));
                DOM.networkNextBtn.classList.toggle('visible', !DOM.networkNextBtn.classList.contains('disabled'));
            },

            /* --- NEW Person Page Functions --- */
            loadPersonPage: async (personId) => {
                if (!DOM.personWrapper) return;
                // *** Show Skeleton ***
                DOM.personWrapper.innerHTML = Utils.getSkeletonPersonHTML();
                State.currentPersonId = personId;

                try {
                    const personData = await API.fetchTMDB(`/person/${personId}`, {
                        append_to_response: 'combined_credits,external_ids'
                    });

                    if (!personData) {
                        throw new Error("Person details not found.");
                    }
                    // *** Render function replaces skeleton ***
                    App.renderPersonPage(personData); // This sets innerHTML, replacing skeleton

                } catch (error) {
                    console.error(`Failed to load details for person ${personId}:`, error);
                    DOM.personWrapper.innerHTML = Utils.getErrorHTML(`Failed to load person details: ${error.message}`); // Replace skeleton with error
                }
            },

        renderPersonPage: (personData) => {
            if (!DOM.personWrapper) return;

            const {
                id: personId,
                name, profile_path, biography, birthday, place_of_birth,
                known_for_department, combined_credits,
                // --- Add these ---
                external_ids, // The whole object
                homepage      // The person's homepage URL
                // ---------------
                // gender, deathday // Add if needed later
            } = personData;

            // --- Extract specific IDs from external_ids (with fallback) ---
            const {
                imdb_id,
                facebook_id,
                instagram_id,
                twitter_id,
                wikidata_id
            } = external_ids || {}; // Use || {} as fallback if external_ids is null/undefined

            // Profile URLs (no changes needed here)
            const profileUrlLarge = profile_path
                ? `${config.PROFILE_BASE_URL_LARGE || config.PROFILE_BASE_URL}${profile_path}`
                : null;
            const profileUrl = profile_path
                ? `${config.PROFILE_BASE_URL}${profile_path}`
                : 'https://via.placeholder.com/250x375/1a1d24/808080?text=No+Image';

            // Known Credits (no changes needed here)
            const knownCredits = combined_credits?.cast
                ?.filter(c => c.poster_path && (c.media_type === 'movie' || c.media_type === 'tv'))
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .slice(0, 18) || [];

             // --- Update Social Links HTML ---
             // Now use the extracted imdb_id and homepage variables
            let socialLinksHtml = '<div class="person-social-links mt-2 mb-3">'; // Start div

            if (imdb_id) {
                socialLinksHtml += `<a href="https://www.imdb.com/name/${imdb_id}" target="_blank" rel="noopener noreferrer" class="text-white-50 me-3 fs-5" title="IMDb"><i class="bi bi-imdb"></i></a>`;
            } else {
                 // Optional: Show disabled link if no ID
                socialLinksHtml += `<a href="#" class="text-white-50 me-3 fs-5 disabled opacity-50" title="IMDb (Not Available)"><i class="bi bi-imdb"></i></a>`;
            }

            if (homepage) {
                socialLinksHtml += `<a href="${homepage}" target="_blank" rel="noopener noreferrer" class="text-white-50 fs-5" title="Homepage"><i class="bi bi-link-45deg"></i></a>`;
            } else {
                socialLinksHtml += `<a href="#" class="text-white-50 fs-5 disabled opacity-50" title="Homepage (Not Available)"><i class="bi bi-link-45deg"></i></a>`;
            }

            // Add placeholders/logic for other social links (Twitter, Instagram etc.) if needed
             socialLinksHtml += `<a href="#" class="text-white-50 me-3 fs-5 disabled opacity-50" title="Twitter (Coming Soon)"><i class="bi bi-twitter-x"></i></a>`;
             socialLinksHtml += `<a href="#" class="text-white-50 me-3 fs-5 disabled opacity-50" title="Instagram (Coming Soon)"><i class="bi bi-instagram"></i></a>`;
            socialLinksHtml += '</div>'; // End div


            // --- The rest of your personHtml generation ---
            let personHtml = `
            <div class="row person-header mb-4 mb-md-5">
                <div class="col-md-4 col-lg-3 person-profile-pic text-center text-md-start mb-4 mb-md-0">
                    <img src="${profileUrl}" alt="${Utils.escapeHtml(name)}" class="img-fluid" loading="lazy" onerror="this.onerror=null; this.src=''; this.classList.add('img-fallback');">
                    <i class="bi bi-person-circle img-fallback-icon d-none"></i>
                </div>
                <div class="col-md-8 col-lg-9 person-info">
                    <h1 class="text-white mb-2 custom-color">${Utils.escapeHtml(name)}</h1>
                     ${socialLinksHtml}
                    <div class="person-meta mb-4">
                        ${known_for_department ? `<p><strong class="text-white-50 custom-color-st">Known For:</strong> ${Utils.escapeHtml(known_for_department)}</p>` : ''}
                        ${birthday ? `<p><strong class="text-white-50 custom-color-st">Born:</strong> ${Utils.formatAirDate(birthday)}</p>` : ''}
                        ${place_of_birth ? `<p><strong class="text-white-50 custom-color-st">Place of Birth:</strong> ${Utils.escapeHtml(place_of_birth)}</p>` : ''}
                        
                    </div>

                    
                    <div class="details-section mt-4">
                    
                        <h4 class="text-white fw-semibold custom-color">AI Bio Highlight</h4>
                        <div id="ai-bio-container" class="ai-insight-box p-3 rounded border border-secondary border-opacity-25 bg-dark bg-opacity-10 mb-3" style="min-height: 60px;">
                             <p class="text-muted small mb-0">Click the button for an AI-generated career highlight.</p>
                        </div>
                        <button id="get-ai-bio-btn" class="btn btn-sm btn-outline-info"
                                data-person-id="${personId}"
                                data-person-name="${Utils.escapeHtml(name)}">
                            <i class="bi bi-magic me-1"></i> Get AI Highlight
                        </button>
                        <small class="d-block text-muted mt-1">Powered by Google Gemini. May contain inaccuracies.</small>
                    </div>

                    
                    ${biography ? `
                        <h4 class="text-white mt-4 fw-semibold custom-color">Biography</h4>
                        <div class="person-bio" id="person-bio-text">
                            <p>${Utils.escapeHtml(biography).replace(/\r?\n\r?\n/g, '</p><p>').replace(/\r?\n/g, '<br>')}</p>
                        </div>
                        <a href="#" class="btn btn-sm btn-link read-more-bio d-none" id="read-more-bio-btn">Read More</a>
                    ` : '<p class="text-muted mt-4">No biography available.</p>'}
                </div>
            </div>
            `;

            const connectionButtonHtml = `
            <div class="mt-4"> 
                <button class="btn btn-outline-info btn-connection-explorer"
                        data-item-id="${personData.id}"
                        data-item-type="person"
                        data-item-title="${Utils.escapeHtml(personData.name || '')}">
                    <i class="bi bi-diagram-3-fill me-1"></i> Show Connections
                </button>
            </div>
            `;

            // Known For Section (Filmography)
            // ... (rest of your code for known for, setting background, post-render actions) ...
            if (knownCredits.length > 0) {
                    personHtml += `
                        <div class="filmography-section mt-5">
                            <h2 class="filmography-title">Known For</h2>
                            <div id="person-known-for-grid" class="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">
                            </div>
                        </div>
                    `;
                }

            DOM.personWrapper.innerHTML = personHtml;
            // --- Post-Render Actions ---

            // Set Background Image Effect
            const headerElement = DOM.personWrapper.querySelector('.person-header');
            if (headerElement && profileUrlLarge) {
                 headerElement.style.setProperty('--person-bg-image', `url(${profileUrlLarge})`);
            } else if (headerElement) {
                 headerElement.style.removeProperty('--person-bg-image');
            }

            // Render Known For cards
            if (knownCredits.length > 0) {
                    const knownForGrid = document.getElementById('person-known-for-grid');
                    if (knownForGrid) {
                        // RenderTmdbCards clears the container before adding cards
                        App.renderTmdbCards(knownCredits, knownForGrid, null, false);
                    }
            }
             // Add "Read More" functionality for biography
             const bioText = document.getElementById('person-bio-text');
             const readMoreBtn = document.getElementById('read-more-bio-btn');
             if (bioText && readMoreBtn) {
                setTimeout(() => {
                    const contentHeight = bioText.scrollHeight;
                    const containerHeight = bioText.clientHeight;
                    const isOverflowing = contentHeight > (containerHeight + 5);

                    if (isOverflowing) {
                        Utils.setElementVisibility(readMoreBtn, true);
                        readMoreBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            bioText.classList.toggle('expanded');
                            readMoreBtn.textContent = bioText.classList.contains('expanded') ? 'Read Less' : 'Read More';
                        });
                    } else {
                         Utils.setElementVisibility(readMoreBtn, false);
                         bioText.classList.remove('expanded');
                    }
                }, 150);
             }

            // Add AI Button Listener
            DOM.personAiBioBtn = DOM.personWrapper.querySelector('#get-ai-bio-btn');
            DOM.personAiBioContainer = DOM.personWrapper.querySelector('#ai-bio-container');
            if (DOM.personAiBioBtn) {
                 DOM.personAiBioBtn.addEventListener('click', (e) => {
                    const btn = e.currentTarget;
                    App.handleGetAiBio(
                        btn.dataset.personId,
                        btn.dataset.personName
                    );
                });
            }

            const infoContainer = DOM.personWrapper.querySelector('.person-info'); // Find container
            if (infoContainer) {
                const btnDiv = document.createElement('div');
                btnDiv.innerHTML = connectionButtonHtml.trim();
                const connectionButton = btnDiv.firstChild;
                connectionButton.addEventListener('click', App.handleShowConnectionsClick);
                infoContainer.appendChild(connectionButton); // Append button to info section
            }

            App.initializeTooltips(DOM.personWrapper);
        },

        // --- NEW Connection Explorer Methods ---

        handleShowConnectionsClick: (event) => {
        console.log("--- handleShowConnectionsClick TRIGGERED ---");
        const button = event.currentTarget;
        const { itemId, itemType, itemTitle } = button.dataset;

        // Basic validation
        if (!itemId || !itemType) {
             console.error("Connection button missing required data- attributes.");
             Utils.showToast("Cannot show connections for this item.", "warning");
             return;
         }
        // Check if modal instance exists
        if (!bsInstances.connectionModal) {
             console.error("Connection Modal instance not initialized.");
             Utils.showToast("Connection explorer component error.", "danger");
             return;
        }
        // Prevent multiple rapid clicks from starting parallel loads
        if (State.isGraphLoading) {
            console.warn("Graph loading already in progress.");
            return;
        }

        // Store context and set loading flag
        State.currentExplorerItem = { id: parseInt(itemId), type: itemType, title: itemTitle };
        State.isGraphLoading = true; // <<< SET LOADING FLAG

        // Prepare modal UI for loading state *before* showing
        console.log("[Modal Prep] Setting title and showing loading state.");
        if (DOM.connectionExplorerTitle) DOM.connectionExplorerTitle.textContent = `Connections for ${itemTitle || 'Item'}`;
        Utils.setElementVisibility(DOM.connectionGraphContainer, false);
        Utils.setElementVisibility(DOM.connectionGraphError, false);
        Utils.setElementVisibility(DOM.connectionGraphLoading, true); // <<< SHOW LOADING
        if (DOM.connectionGraphContainer) DOM.connectionGraphContainer.innerHTML = ''; // Clear old canvas
        App.destroyVisNetwork(); // Destroy just in case

        console.log("[Modal Prep] Showing Bootstrap modal.");
        bsInstances.connectionModal.show();
        // >>> Data loading now happens in the 'shown.bs.modal' event handler <<<
    },


    loadAndDisplayConnections: async ({ id, type }) => {
        console.log(`--- loadAndDisplayConnections STARTED for ${type}/${id} ---`);
        const container = DOM.connectionGraphContainer;
        const loadingEl = DOM.connectionGraphLoading;
        const errorEl = DOM.connectionGraphError;

        // Elements check - should have been caught earlier if null, but good practice
        if (!container || !loadingEl || !errorEl) {
           console.error("Modal graph elements missing in loadAndDisplayConnections!");
           State.isGraphLoading = false; // Reset flag
           return;
        }
        // *** Visibility is now handled by the 'shown' event and this function's completion ***

        try {
            console.log(`[Graph Load] Fetching data for ${type}/${id}...`);
            let appendData = (type === 'person') ? ['combined_credits'] : ['credits', 'similar'];
            const itemData = await API.fetchTMDB(`/${type}/${id}`, { append_to_response: appendData.join(',') });

            if (!itemData) throw new Error("Could not fetch item data from API.");

            console.log("[Graph Load] Creating graph data...");
            const graphData = App.createGraphData(itemData);
            // console.log("[Graph Load] Graph Data:", graphData); // Keep if needed

            if (!graphData || graphData.nodes.length <= 1) {
                throw new Error("No significant connections found to visualize.");
            }

            console.log("[Graph Load] Calling initializeVisNetwork...");
            // initializeVisNetwork now handles its own errors more gracefully
            App.initializeVisNetwork(graphData);

            // Only show container if instance was *successfully* created
            if (State.visNetworkInstance) {
                console.log("[Graph Load] Success, showing graph container.");
                // --- SET VISIBILITY ON SUCCESS ---
                Utils.setElementVisibility(container, true);
                Utils.setElementVisibility(loadingEl, false);
                Utils.setElementVisibility(errorEl, false);
            } else {
                // Initialization must have failed if instance is null here
                 console.error("[Graph Load] visNetworkInstance is null after initialization attempt.");
                 // The error should be displayed by initializeVisNetwork's catch block
                 // Just ensure loading is hidden if error element isn't shown for some reason
                 Utils.setElementVisibility(loadingEl, false);
                 Utils.setElementVisibility(errorEl, !DOM.connectionGraphError?.classList.contains('d-none')); // Show error if not already visible
            }

        } catch (error) {
            console.error("[Graph Load] Error:", error);
            // --- SET VISIBILITY ON ERROR ---
            Utils.setElementVisibility(loadingEl, false);
            Utils.setElementVisibility(errorEl, true);
            Utils.setElementVisibility(container, false);
            if (errorEl) errorEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i><span>Error loading connections: ${Utils.escapeHtml(error.message)}</span>`;
        } finally {
            State.isGraphLoading = false; // <<< RESET LOADING FLAG
            console.log(`--- loadAndDisplayConnections FINISHED for ${type}/${id} ---`);
        }
    },

    createGraphData: (itemData) => {
        const nodes = new vis.DataSet();
        const edges = new vis.DataSet();
        const type = itemData.title ? 'movie' : (itemData.name && itemData.known_for_department) ? 'person' : 'tv'; // Determine type

        // --- Central Node ---
        const centralNodeId = `${type}-${itemData.id}`;
        let centralNodeLabel = Utils.escapeHtml(itemData.title || itemData.name);
        if (type !== 'person') {
             const year = (itemData.release_date || itemData.first_air_date || '').substring(0, 4);
             if(year) centralNodeLabel += `\n(${year})`; // Add year to label
        }
        let centralNodeImage = null;
        if (type === 'person') centralNodeImage = itemData.profile_path ? `${config.PROFILE_BASE_URL.replace('h632','w185')}${itemData.profile_path}` : null;
        else centralNodeImage = itemData.poster_path ? `${config.IMAGE_BASE_URL}${itemData.poster_path}` : null;

        nodes.add({
            id: centralNodeId,
            label: centralNodeLabel,
            shape: centralNodeImage ? 'image' : 'ellipse',
            image: centralNodeImage || undefined, // Use image if available
            group: type, // Group by type (movie, tv, person)
            size: centralNodeImage ? 35 : 25, // Larger size for image nodes
            font: { size: 16, face: 'Poppins', color: ChartColors.textLight },
            borderWidth: 3,
            color: {
                 border: type === 'movie' ? ChartColors.secondary : (type === 'tv' ? ChartColors.primary : ChartColors.tertiary),
                 background: ChartColors.surface,
                 highlight: { border: ChartColors.textLight, background: ChartColors.getCssVar('--border-color')},
                 hover: { border: ChartColors.textLight, background: ChartColors.getCssVar('--border-color')}
            },
            title: `<h4>${Utils.escapeHtml(itemData.title || itemData.name)}</h4>(${type})` // HTML Tooltip
        });

        // --- Connections ---
        let credits = itemData.credits || itemData.combined_credits; // Use combined_credits for person

        // Add Cast (Limit N)
        const castLimit = 8;
        credits?.cast?.slice(0, castLimit).forEach(person => {
            if (!person.id) return;
            const personNodeId = `person-${person.id}`;
            if (!nodes.get(personNodeId)) { // Add node only if it doesn't exist
                nodes.add({
                    id: personNodeId,
                    label: Utils.escapeHtml(person.name),
                    shape: person.profile_path ? 'image' : 'dot',
                    image: person.profile_path ? `${config.PROFILE_BASE_URL.replace('h632','w185')}${person.profile_path}` : undefined,
                    group: 'person', size: person.profile_path ? 25 : 15,
                    color: { border: ChartColors.tertiary, background: ChartColors.surface },
                    font: { size: 12, color: ChartColors.textMedium },
                    title: `<b>${Utils.escapeHtml(person.name)}</b><br>as ${Utils.escapeHtml(person.character || '(Character)')}`
                });
            }
            // Add edge from Person to Movie/TV
             edges.add({ from: personNodeId, to: centralNodeId, arrows: 'to', color: { color: ChartColors.transparent(ChartColors.tertiary, 0.5), highlight: ChartColors.tertiary }, dashes: true });
        });

        // Add Director/Creator (if movie/tv)
        if (type !== 'person') {
            const director = credits?.crew?.find(p => p.job === 'Director');
            const creator = type === 'tv' ? credits?.crew?.find(p => p.department === 'Creator' || p.job === 'Creator') : null;
            const keyPerson = director || creator; // Prioritize Director

            if (keyPerson && keyPerson.id) {
                 const keyPersonNodeId = `person-${keyPerson.id}`;
                if (!nodes.get(keyPersonNodeId)) { // Add node only if it doesn't exist
                    nodes.add({
                        id: keyPersonNodeId,
                        label: Utils.escapeHtml(keyPerson.name),
                        shape: keyPerson.profile_path ? 'image' : 'star', // Use star shape for director/creator without image
                        image: keyPerson.profile_path ? `${config.PROFILE_BASE_URL.replace('h632','w185')}${keyPerson.profile_path}` : undefined,
                        group: 'person', size: keyPerson.profile_path ? 28 : 20,
                        color: { border: ChartColors.secondaryAccent, background: ChartColors.surface },
                        font: { size: 13, color: ChartColors.textLight },
                        title: `<b>${Utils.escapeHtml(keyPerson.name)}</b><br>(${Utils.escapeHtml(keyPerson.job)})`
                    });
                }
                 // Add edge from Key Person to Movie/TV (different style)
                 edges.add({ from: keyPersonNodeId, to: centralNodeId, arrows: 'to', color: { color: ChartColors.secondaryAccent, highlight: ChartColors.secondaryAccent }, width: 2 });
            }
        }

        // Add Similar Items (if movie/tv)
        if (type !== 'person') {
            const similarLimit = 5;
            itemData.similar?.results?.slice(0, similarLimit).forEach(similarItem => {
                if (!similarItem.id) return;
                const similarType = similarItem.media_type || type; // Assume same type if media_type missing
                if (similarType === 'person') return; // Skip people in similar results

                const similarNodeId = `${similarType}-${similarItem.id}`;
                 if (!nodes.get(similarNodeId)) { // Add node only if it doesn't exist
                     const similarTitle = Utils.escapeHtml(similarItem.title || similarItem.name);
                     const similarYear = (similarItem.release_date || similarItem.first_air_date || '').substring(0, 4);
                     nodes.add({
                         id: similarNodeId,
                         label: `${similarTitle}${similarYear ? `\n(${similarYear})` : ''}`,
                         shape: similarItem.poster_path ? 'image' : 'ellipse',
                         image: similarItem.poster_path ? `${config.IMAGE_BASE_URL}${similarItem.poster_path}` : undefined,
                         group: similarType, size: similarItem.poster_path ? 30 : 20,
                         color: { border: similarType === 'movie' ? ChartColors.secondary : ChartColors.primary, background: ChartColors.surface, opacity: 0.8 },
                         font: { size: 12, color: ChartColors.textMedium },
                         title: `<b>${similarTitle}</b><br>(Similar ${similarType})`
                     });
                 }
                 // Add edge from Central Node to Similar Item (dashed)
                 edges.add({ from: centralNodeId, to: similarNodeId, dashes: true, arrows: 'to', color: { color: ChartColors.transparent(ChartColors.textMedium, 0.4), highlight: ChartColors.textMedium } });
            });
        }

        // Add Known For (if person)
        if (type === 'person') {
             const knownForLimit = 8;
             credits?.cast // Prioritize things they acted in
                 ?.filter(c => c.poster_path && (c.media_type === 'movie' || c.media_type === 'tv'))
                 .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                 .slice(0, knownForLimit)
                 .forEach(knownForItem => {
                     if (!knownForItem.id) return;
                     const itemType = knownForItem.media_type;
                     const itemNodeId = `${itemType}-${knownForItem.id}`;
                     if (!nodes.get(itemNodeId)) { // Add node only if it doesn't exist
                         const itemTitle = Utils.escapeHtml(knownForItem.title || knownForItem.name);
                         const itemYear = (knownForItem.release_date || knownForItem.first_air_date || '').substring(0, 4);
                         nodes.add({
                             id: itemNodeId,
                             label: `${itemTitle}${itemYear ? `\n(${itemYear})` : ''}`,
                             shape: knownForItem.poster_path ? 'image' : 'ellipse',
                             image: knownForItem.poster_path ? `${config.IMAGE_BASE_URL}${knownForItem.poster_path}` : undefined,
                             group: itemType, size: knownForItem.poster_path ? 30 : 20,
                             color: { border: itemType === 'movie' ? ChartColors.secondary : ChartColors.primary, background: ChartColors.surface },
                             font: { size: 12, color: ChartColors.textMedium },
                             title: `<b>${itemTitle}</b><br>(${itemType}, as ${Utils.escapeHtml(knownForItem.character || '?')})`
                         });
                     }
                     // Add edge from Person to Known For item
                     edges.add({ from: centralNodeId, to: itemNodeId, arrows: 'to', color: { color: ChartColors.transparent(ChartColors.tertiary, 0.5), highlight: ChartColors.tertiary } });
                 });
         }


        return { nodes, edges };
    },


    initializeVisNetwork: (graphData) => {
        console.log("--- initializeVisNetwork STARTED ---"); 
        const container = DOM.connectionGraphContainer;
        if (!container) { console.error("[Graph Init] Container missing!"); return; }
        App.destroyVisNetwork(); // Destroy previous instance if any

        const options = {
            nodes: {
                borderWidth: 2,
                borderWidthSelected: 4,
                shapeProperties: {
                    useBorderWithImage: true
                },
                 font: { // Default font settings
                     color: ChartColors.textLight,
                     face: 'Inter',
                     strokeWidth: 0, // No text stroke
                 },
                 imagePadding: 4, // Padding around image inside node border
            },
            edges: {
                width: 1.5,
                color: {
                    color: ChartColors.transparent(ChartColors.textMedium, 0.4), // Default edge color
                    highlight: ChartColors.primary,
                    hover: ChartColors.secondary,
                    inherit: false // Don't inherit color from nodes
                },
                smooth: {
                    enabled: true,
                    type: "continuous", // Or 'dynamic', 'cubicBezier' etc.
                    roundness: 0.5
                },
                arrows: { to: { enabled: true, scaleFactor: 0.7 } }
            },
            physics: {
                enabled: true,
                solver: 'barnesHut', // Good general-purpose physics solver
                barnesHut: {
                    gravitationalConstant: -15000, // Adjust repulsion strength
                    centralGravity: 0.1, // Pull towards center
                    springLength: 150, // Desired edge length
                    springConstant: 0.05,
                    damping: 0.15, // Settle faster
                    avoidOverlap: 0.3 // Avoid node overlap
                },
                stabilization: { // Speed up initial layout
                    iterations: 1000,
                    fit: true
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                navigationButtons: true, // Show zoom/fit buttons
                keyboard: true,
            },
            layout: {
                 improvedLayout: true // Use improved layout algorithm
            }
        };

        const rect = container.getBoundingClientRect();
        console.log(`[Graph Init] Container Dimensions: Width=${rect.width}, Height=${rect.height}`);
        if (rect.width <= 0 || rect.height <= 0) {
             console.warn("[Graph Init] Container has zero dimensions! Vis.js rendering may fail or be incorrect.");
        }

        if (!DOM.connectionGraphContainer) {
             console.error("[Graph] Graph container missing in initializeVisNetwork");
             return; // Don't try to initialize
         }
        App.destroyVisNetwork();

        try {
             State.visNetworkInstance = new vis.Network(DOM.connectionGraphContainer, graphData, options);

            // <<< ADD REDRAW AFTER DELAY >>>
            setTimeout(() => {
                if (State.visNetworkInstance) {
                    console.log("[Graph Init] Redrawing network...");
                    State.visNetworkInstance.redraw();
                }
            }, 100); // Redraw after 100ms
            // <<< ADD STABILIZE CALL >>>
            console.log("[Graph Init] Stabilizing network...");
            State.visNetworkInstance.stabilize(); // Trigger physics calculation explicitly
             // --- Optional: Add Click Listener ---
             State.visNetworkInstance.on("click", (params) => {
                 if (params.nodes.length > 0) {
                    const clickedNodeId = params.nodes[0];
                    const nodeData = graphData.nodes.get(clickedNodeId); // Get node data
                    console.log("Clicked node:", clickedNodeId, nodeData);

                    // Example: Navigate to details page if it's a movie/tv node
                    const [type, id] = clickedNodeId.split('-');
                    if ((type === 'movie' || type === 'tv') && id && clickedNodeId !== State.currentExplorerItem.id) { // Don't navigate if clicking central node
                         location.hash = `#details=${type}/${id}`;
                         bsInstances.connectionModal?.hide(); // Hide modal on navigation
                    } else if (type === 'person' && id && clickedNodeId !== State.currentExplorerItem.id) {
                         location.hash = `#person=${id}`;
                         bsInstances.connectionModal?.hide();
                    }
                    // TODO: Implement graph expansion logic here if desired later
                }
            });

        } catch (error) {
             console.error("Error initializing vis.Network:", error);
             State.visNetworkInstance = null;
             App.destroyVisNetwork(); 
             Utils.setElementVisibility(DOM.connectionGraphContainer, false);
             Utils.setElementVisibility(DOM.connectionGraphError, true);
             if(DOM.connectionGraphError) DOM.connectionGraphError.textContent = `Graph Init Error: ${error.message}`;
             throw new Error(`Graph library failed: ${error.message}`);
            }
        console.log("--- initializeVisNetwork FINISHED ---");
    },

    destroyVisNetwork: () => {
        if (State.visNetworkInstance) {
            State.visNetworkInstance.destroy();
            State.visNetworkInstance = null;
            console.log("vis.Network destroyed.");
        }
         // Also clear the container's content
         if(DOM.connectionGraphContainer) DOM.connectionGraphContainer.innerHTML = '';
    },



            /* --- Rendering Functions --- */

             // Renders a grid of TMDB movie/TV cards
            renderTmdbCards: (items, containerElement, defaultType = null, append = false) => {
                if (!containerElement) return;

                if (!append) { // Clear container if not appending
                    containerElement.innerHTML = '';
                }

                if (!items || items.length === 0) {
                    if (!append) { // Show 'No items' only if container was cleared
                         containerElement.innerHTML = `<p class="col-12 py-4 text-center text-muted">No items found.</p>`;
                    }
                    return;
                }

                items.forEach(item => {
                    // Determine media_type if missing (common in person credits)
                    let itemType = item.media_type || defaultType;
                    if (!itemType) { // Infer from presence of title/name
                        if (item.title) itemType = 'movie';
                        else if (item.name) itemType = 'tv';
                        else {
                            console.warn("Skipping item without determinable type:", item);
                            return; // Skip if cannot determine type
                        }
                    }

                    // Skip persons in general lists (they should go to #person view)
                    if (itemType === 'person') return;
                    // Basic check for essential data
                    if (!item.id) return;


                     const title = Utils.escapeHtml(item.title || item.name || 'N/A');
                     const posterPath = item.poster_path;
                     const posterUrl = posterPath ? `${config.IMAGE_BASE_URL}${posterPath}` : null;
                     const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
                     const genreIds = item.genre_ids || [];

                     // Create card elements
                     const colDiv = document.createElement('div');
                     colDiv.className = 'col'; // Let the row's classes handle sizing

                     const cardLink = document.createElement('a');
                     cardLink.href = `#details=${itemType}/${item.id}`;
                     cardLink.className = 'card text-decoration-none h-100 d-flex flex-column'; // Use flex for structure
                     cardLink.title = title; // Tooltip with full title

                     // Image or Placeholder
                     const imageHtml = posterUrl ? `<img src="${posterUrl}" class="card-img-top" alt="${title} Poster" loading="lazy">` : `<div class="card-img-placeholder d-flex align-items-center justify-content-center"><i class="bi bi-film fs-1"></i></div>`;
                     // Card Body
                     const bodyHtml = `<div class="card-body d-flex flex-column flex-grow-1 p-3"> <h3 class="card-title fs-6 fw-medium mb-2">${title}</h3> ${rating && parseFloat(rating) > 0 ? `<span class="card-rating mt-auto"><i class="bi bi-star-fill me-1"></i>${rating}</span>` : `<span class="card-rating not-rated mt-auto"><i class="bi bi-star me-1"></i>NR</span>`}  </div>`;


                      // --- NEW: Add Watchlist Button ---
                    const isInWatchlist = Watchlist.isInWatchlist(item.id, itemType);
                    const watchlistBtnHtml = `
                        <button class="btn action-btn watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}"
                            title="${isInWatchlist ? 'In Watchlist (Click to remove)' : 'Add to Watchlist'}"
                            aria-label="${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}"
                            data-item-id="${item.id}" data-item-type="${itemType}"
                            data-item-title="${Utils.escapeHtml(item.title || item.name || '')}" data-item-poster="${item.poster_path || null}"
                            data-item-backdrop="${item.backdrop_path || null}" data-item-rating="${item.vote_average || null}"
                            style="top: 0.6rem; right: 0.6rem;">
                            <i class="bi ${isInWatchlist ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}"></i>
                        </button>`;

                        const isFavorite = Favorites.isFavorite(item.id, itemType);
                        const likeBtnHtml = `
                            <button class="btn action-btn like-btn ${isFavorite ? 'is-favorite' : ''}"
                                title="${isFavorite ? 'Favorited (Click to unfavorite)' : 'Add to Favorites'}"
                                aria-label="${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}"
                                data-item-id="${item.id}" data-item-type="${itemType}"
                                data-item-title="${Utils.escapeHtml(item.title || item.name || '')}" data-item-poster="${item.poster_path || null}"
                                data-item-rating="${item.vote_average || null}"
                                data-item-genres="${JSON.stringify(genreIds)}"> 
                                <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                            </button>`;

                    cardLink.innerHTML = imageHtml + bodyHtml;
                    cardLink.style.position = 'relative'; // Needed for absolute positioning of button
                    cardLink.innerHTML += watchlistBtnHtml + likeBtnHtml ; // Append button HTM
                    colDiv.appendChild(cardLink);
                    containerElement.appendChild(colDiv);

                    // Add listener AFTER appending
                    const addedWatchlistButton = colDiv.querySelector('.watchlist-btn');
                    if (addedWatchlistButton) {
                        addedWatchlistButton.addEventListener('click', (e) => {
                            e.preventDefault(); e.stopPropagation();
                            App.handleAddOrRemoveWatchlist(e.currentTarget);
                        });
                    }

                    // Add listener for the NEW like button
                    const addedLikeButton = colDiv.querySelector('.like-btn');
                    if (addedLikeButton) {
                        addedLikeButton.addEventListener('click', (e) => {
                           e.preventDefault(); e.stopPropagation();
                           App.handleAddOrRemoveFavorite(e.currentTarget); // Call new handler
                        });
                    }
                });
                App.initializeTooltips(containerElement); 
            },

             // Renders the Hero section item
             renderHeroItem: (item) => {
                 if (!DOM.views.hero) return;

                 const backdropUrl = item.backdrop_path ? `${config.BACKDROP_BASE_URL}${item.backdrop_path}` : '';
                 const title = Utils.escapeHtml(item.title || item.name || 'N/A');
                 const overview = Utils.escapeHtml(item.overview || 'No description available.');
                 const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
                 const year = (item.release_date || item.first_air_date || '').substring(0, 4);
                 const type = item.title ? 'movie' : 'tv'; // Determine type based on title/name presence
                 const genres = item.genres?.slice(0, 3) || []; // Max 3 genres
                 const runtime = type === 'movie' && item.runtime ? Utils.formatRuntime(item.runtime) : null;
                 const seasons = type === 'tv' && item.number_of_seasons ? item.number_of_seasons : null;
  

                 DOM.views.hero.innerHTML = `
                     <img src="${backdropUrl}" class="hero-backdrop" alt="${title} backdrop" loading="eager">
                     <div class="hero-overlay"></div>
                     <div class="container hero-content">
                         <div class="hero-genres mb-3">
                             ${genres.map(g => `<span>${Utils.escapeHtml(g.name)}</span>`).join('')}
                         </div>
                         <h1 class="hero-title" style="color: #fff;">${title}</h1>
                         <div class="hero-meta mb-3" style="color: #fff;">
                             ${rating && parseFloat(rating) > 0 ? `<span class="rating me-3 d-flex align-items-center"><i class="bi bi-star-fill me-1"></i> ${rating}/10</span>` : ''}
                             ${year ? `<span class="me-3 d-flex align-items-center"><i class="bi bi-calendar3 me-1"></i> ${year}</span>` : ''}
                             ${runtime ? `<span class="me-3 d-flex align-items-center"><i class="bi bi-clock me-1"></i> ${runtime}</span>` : ''}
                             ${seasons ? `<span class="me-3 d-flex align-items-center"><i class="bi bi-collection-play me-1"></i> ${seasons} Season${seasons > 1 ? 's' : ''}</span>` : ''}

                         </div>
                         <p class="hero-description lead" style="color: #fff;">${overview.length > 250 ? overview.substring(0, 250) + '...' : overview}</p>
                         <div class="hero-actions mt-4">
                             <a href="#details=${type}/${item.id}" class="btn btn-primary btn-lg me-2"><i class="bi bi-info-circle-fill me-2"></i> More Info</a>
                             <a href="#player=${type}/${item.id}" class="btn btn-outline-light btn-lg"><i class="bi bi-play-circle me-2"></i> Watch Now</a>
                        </div>
                     </div>
                 `;
             },

             // Renders the details page content
             renderDetailsPage: (itemData) => {
                 if (!DOM.detailsWrapper) return;
                 DOM.detailsWrapper.innerHTML = ''; // Clear previous

                 const type = itemData.title ? 'movie' : 'tv';
                 const displayTitle = Utils.escapeHtml(itemData.title || itemData.name || 'N/A');
                 const backdropUrl = itemData.backdrop_path ? `${config.BACKDROP_BASE_URL}${itemData.backdrop_path}` : '';
                 const posterUrl = itemData.poster_path ? `${config.IMAGE_BASE_URL}${itemData.poster_path}` : '';
                 const rating = itemData.vote_average ? itemData.vote_average.toFixed(1) : null;
                 const year = (itemData.release_date || itemData.first_air_date || '').substring(0, 4);
                 const formattedRuntime = type === 'movie' && itemData.runtime ? Utils.formatRuntime(itemData.runtime) : null;
                 const numberOfSeasons = type === 'tv' && itemData.number_of_seasons ? itemData.number_of_seasons : null;
                 const displayOverview = Utils.escapeHtml(itemData.overview || 'No overview available.');

                // --- Add Connection Explorer Button near Actions ---
                const connectionButtonHtml = `
                    <button class="btn btn-outline-info btn-connection-explorer mt-3 mt-lg-0 ms-lg-2"
                       data-item-id="${itemData.id}"
                       data-item-type="${type}"
                       data-item-title="${Utils.escapeHtml(itemData.title || itemData.name || '')}">
                       <i class="bi bi-diagram-3-fill me-1"></i> Show Connections
                    </button>
                 `;

                 // Extract credits
                 const credits = itemData.credits;
                 const director = credits?.crew?.find(p => p.job === 'Director')?.name;
                 const creators = type === 'tv' ? credits?.crew?.filter(p => p.department === 'Writing' && (p.job === 'Creator' || p.job === 'Writer')).map(c => Utils.escapeHtml(c.name)).slice(0, 3).join(', ') : ''; // Get up to 3 creators/writers
                 const castList = credits?.cast?.slice(0, 12) || []; // Top 12 cast members

                 // Similar items
                 const similarList = itemData.similar?.results?.slice(0, 12) || [];

                
                // Watch Providers (US Flatrate only)
                const usSubProviders = itemData['watch/providers']?.results?.[config.TARGET_REGION]?.flatrate || [];

                const actionsContainerSelector = '.details-actions';
                 let detailsHtml = `
                     <div class="details-backdrop-container mb-5" style="${backdropUrl ? `background-image: url('${backdropUrl}');` : 'background-color: var(--bg-secondary);'}"></div>
                     <div class="container details-content-overlay">
                         <button onclick="Utils.goBackOrHome();" class="btn btn-outline-light btn-sm mb-4 back-button"><i class="bi bi-arrow-left me-1"></i> Back</button>
                         <div class="details-header row mb-5 align-items-center">
                             <div class="details-poster col-lg-3 col-md-4 text-center text-md-start mb-4 mb-md-0">
                                 ${posterUrl ? `<img src="${posterUrl}" alt="${displayTitle} Poster" class="img-fluid shadow-lg" style="border-radius: var(--radius-lg); border: 3px solid rgba(255,255,255,0.1);" loading="lazy">` : `<div class="bg-secondary rounded-3 d-flex align-items-center justify-content-center mx-auto" style="width:100%; aspect-ratio:2/3; max-width:280px;">No Poster</div>`}
                             </div>
                             <div class="details-info col-lg-9 col-md-8">
                                 <h1 class="text-white mb-2 custom-color">${displayTitle}</h1>
                                 <div class="details-meta mb-3 d-flex align-items-center flex-wrap">
                                     ${rating && parseFloat(rating) > 0 ? `<span class="d-flex align-items-center me-3"><i class="bi bi-star-fill text-warning me-1"></i> ${rating}/10</span>` : ''}
                                     ${year ? `<span class="d-flex align-items-center me-3"><i class="bi bi-calendar3 me-1"></i> ${year}</span>` : ''}
                                     ${formattedRuntime ? `<span class="d-flex align-items-center me-3"><i class="bi bi-clock me-1"></i> ${formattedRuntime}</span>` : ''}
                                     ${numberOfSeasons ? `<span class="d-flex align-items-center"><i class="bi bi-collection-play me-1"></i> ${numberOfSeasons} Season${numberOfSeasons > 1 ? 's' : ''}</span>` : ''}
                                 </div>
                                 <div class="genres mb-3">
                                     ${itemData.genres?.map(g => `<span class="badge bg-light bg-opacity-10 text-light border border-light border-opacity-25 me-1 mb-1">${Utils.escapeHtml(g.name)}</span>`).join('') || ''}
                                 </div>
                                 ${displayOverview !== 'No overview available.' ? `<h4 id="text-white" class="text-white mt-4 fw-semibold custom-color">Overview</h4><p class="details-overview mb-4 opacity-90">${displayOverview}</p>` : ''}
                                 ${director ? `<p class="small mb-1"><strong class="text-white-50"">Director:</strong> ${Utils.escapeHtml(director)}</p>` : ''}
                                 ${creators ? `<p class="small mb-1"><strong class="text-white-50">Created by:</strong> ${creators}</p>` : ''}
                                <div class="details-section mt-4">
                                    <h4 class="text-white fw-semibold custom-color">AI Insight</h4>
                                    <div id="ai-insight-container" class="ai-insight-box p-3 rounded border border-secondary border-opacity-25 bg-dark bg-opacity-10 mb-3" style="min-height: 70px;">
                                        <p class="text-muted small mb-0">Click the button to generate AI-powered insights.</p>
                                    </div>
                                    <button id="get-ai-insight-btn" class="btn btn-sm btn-outline-info"
                                        data-item-id="${itemData.id}"
                                        data-item-type="${type}"
                                        data-item-title="${displayTitle}"
                                        data-item-year="${year}">
                                        <i class="bi bi-magic me-1"></i> Get AI Insight
                                    </button>
                                    <small class="d-block text-muted mt-1">Powered by Google Gemini. May contain inaccuracies.</small>
                                </div>
                                 <div class="details-actions mt-4">
                                     <a href="#player=${type}/${itemData.id}" class="btn btn-primary btn-lg me-2"><i class="bi bi-play-circle-fill me-2"></i> Watch Now</a>
                                      <!-- Add Trailer Button if videos exist -->
                                      ${itemData.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') ?
                                          `<button class="btn btn-outline-secondary btn-lg" onclick="App.playTrailer('${itemData.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer').key}')"><i class="bi bi-film me-2"></i> Play Trailer</button>` : ''
                                      }
                                 </div>
                             </div>
                         </div>
                 `;

                 // Seasons & Episodes Section (for TV only)
                 if (type === 'tv' && itemData.seasons && itemData.seasons.length > 0) {
                     // Filter out "Specials" (season 0) unless it's the only season
                     const validSeasons = itemData.seasons.filter(s => s.season_number > 0 || itemData.seasons.length === 1);
                     if (validSeasons.length > 0) {
                         detailsHtml += App.renderTVSeasonsSection(itemData.id, validSeasons);
                     }
                 }

                // Cast Section - UPDATED to use links to #person view
                if (castList.length > 0) {
                    detailsHtml += `
                        <div class="details-section mt-5">
                            <h2 class="details-section-title">Cast</h2>
                            <div class="row g-3 row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6">
                                ${castList.map(member => {
                                    const profileUrl = member.profile_path ? `${config.PROFILE_BASE_URL.replace('h632', 'w185')}${member.profile_path}` : 'https://via.placeholder.com/120x180/1a1d24/808080?text=N/A'; // Use smaller image for cast grid
                                    // Wrap in an anchor tag linking to the person view
                                return `
                            <div class="col mb-3">
                                <a href="#person=${member.id}" class="cast-member-link">
                                    <i class="bi bi-person-circle img-fallback-icon-init d-none"></i>
                                   <img src="${profileUrl}" alt="${Utils.escapeHtml(member.name)}" loading="lazy" onerror="this.previousElementSibling.classList.remove('d-none'); this.classList.add('d-none');">
                                   <div class="actor-name text-truncate">${Utils.escapeHtml(member.name)}</div>
                                   <div class="character-name text-truncate">${Utils.escapeHtml(member.character)}</div>
                                </a>
                                <style>
                                    .d-none {
                                        display: none;
                                    }

                                    .img-fallback-icon-init {
                                        font-size: 8rem;  /* Adjust size of the fallback icon */
                                        color: #ccc;  /* You can adjust the color to match your design */
                                        display: inline-block;
                                        width: 120px;  /* Match the size of your images */
                                        height: 180px; /* Match the size of your images */
                                        text-align: center;
                                        line-height: 180px;  /* Center the icon vertically */
                                    }

                                </style>
                           </div>
                        `;
                           }).join('')}
                         </div>
                      </div>
                    `;
                }


                 // Similar Section
                 if (similarList.length > 0) {
                     detailsHtml += `
                         <div class="details-section mt-5">
                             <h2 class="details-section-title">You Might Also Like</h2>
                             <div id="similar-grid" class="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">
                                 <!-- Similar items rendered after main HTML insertion -->
                                 ${Utils.getSpinnerHTML("Loading recommendations...")}
                             </div>
                         </div>
                     `;
                 }

                 // Streaming Providers Section
                 if (usSubProviders.length > 0) {
                     detailsHtml += `
                          <div class="details-section mt-5">
                              <h2 class="details-section-title">Stream on (US Subscriptions)</h2>
                              <div class="d-flex flex-wrap gap-3 align-items-center">
                                  ${usSubProviders.map(p => `
                                      <a href="#network=${p.provider_id}" title="Browse ${Utils.escapeHtml(p.provider_name)}">
                                          <img src="${config.LOGO_BASE_URL}${p.logo_path}" alt="${Utils.escapeHtml(p.provider_name)}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;" loading="lazy">
                                      </a>`).join('')}
                              </div>
                              <small class="d-block mt-2 text-muted">Streaming availability via JustWatch/TMDb.</small>
                          </div>
                      `;
                  }


                 detailsHtml += `</div>`; // Close main container
                 DOM.detailsWrapper.innerHTML = detailsHtml;

                 // --- Post-Render Actions ---
                 // Render similar cards
                 if (similarList.length > 0) {
                     const similarGrid = document.getElementById('similar-grid');
                     if (similarGrid) {
                         App.renderTmdbCards(similarList, similarGrid, type, false); // Pass type hint
                     }
                 }

                 // Initialize season tabs and load first season if TV
                 if (type === 'tv' && itemData.seasons?.filter(s => s.season_number > 0 || itemData.seasons.length === 1).length > 0) {
                     App.addSeasonTabListeners(itemData.id);
                     // Trigger click on the first non-disabled tab to load its content
                     const firstTab = DOM.detailsWrapper.querySelector('.nav-pills .nav-link:not(.disabled)');
                     firstTab?.click();
                 }

                // Add listener for the connection button *after* rendering
                const actionsContainer = DOM.detailsWrapper.querySelector(actionsContainerSelector);
                if (actionsContainer) {
                   // Create button element and add listener
                   const btnDiv = document.createElement('div'); // Temporary div
                   btnDiv.innerHTML = connectionButtonHtml.trim();
                   const connectionButton = btnDiv.firstChild;
                   connectionButton.addEventListener('click', App.handleShowConnectionsClick);
                   actionsContainer.appendChild(connectionButton); // Append the button
                }


                // --- NEW: Add AI Button Listener ---
                DOM.detailsAiInsightBtn = DOM.detailsWrapper.querySelector('#get-ai-insight-btn');
                DOM.detailsAiInsightContainer = DOM.detailsWrapper.querySelector('#ai-insight-container');
                if (DOM.detailsAiInsightBtn) {
                    DOM.detailsAiInsightBtn.addEventListener('click', (e) => {
                        const btn = e.currentTarget;
                        App.handleGetAiInsight(
                            btn.dataset.itemType,
                            btn.dataset.itemId,
                            btn.dataset.itemTitle,
                            btn.dataset.itemYear
                        );
                    });
                }

                 App.initializeTooltips(DOM.detailsWrapper); // Activate tooltips within details view
             },

            // Renders the Season Tabs and Episode Panes structure
            renderTVSeasonsSection: (tvId, seasons) => {
                 if (!seasons || seasons.length === 0) return '';

                 let seasonTabsHtml = '';
                 let seasonPanesHtml = '';

                 seasons.sort((a,b) => a.season_number - b.season_number).forEach((season, index) => {
                     const seasonNum = season.season_number;
                     const isActive = index === 1; // Make first tab active by default
                     const tabId = `season-${seasonNum}-tab`;
                     const paneId = `season-${seasonNum}-pane`;

                     seasonTabsHtml += `
                         <li class="nav-item" role="presentation">
                             <button class="nav-link ${isActive ? 'active' : ''}" id="${tabId}" data-bs-toggle="pill" data-bs-target="#${paneId}" type="button" role="tab" aria-controls="${paneId}" aria-selected="${isActive}" data-season-number="${seasonNum}">
                                 ${Utils.escapeHtml(season.name)}
                             </button>
                         </li>
                     `;
                     seasonPanesHtml += `
                         <div class="tab-pane fade ${isActive ? 'show active' : ''}" id="${paneId}" role="tabpanel" aria-labelledby="${tabId}" tabindex="0">
                             <!-- Episodes loaded here -->
                             ${Utils.getSpinnerHTML(`Loading ${season.name}...`)}
                         </div>
                     `;
                 });

                 return `
                     <div class="details-section season-episode-section mt-5">
                         <h2 class="details-section-title mb-4">Seasons & Episodes</h2>
                         <ul class="nav nav-pills mb-4 flex-nowrap" style="overflow-x: auto; white-space: nowrap;" id="seasons-tablist" role="tablist">
                             ${seasonTabsHtml}
                         </ul>
                         <div class="tab-content" id="seasons-tabcontent">
                             ${seasonPanesHtml}
                         </div>
                     </div>
                 `;
             },

             /*
                 renderSeasonEpisodes: (episodes, paneElement, tvId, seasonNum) => {
                if (!paneElement) return;
                paneElement.innerHTML = ''; // Clear spinner
                 if (!episodes || episodes.length === 0) {
                    paneElement.innerHTML = '<p class="text-muted p-3">No episode data available for this season.</p>';
                    return;
                 }

                 episodes.sort((a,b) => a.episode_number - b.episode_number).forEach(ep => {
                     const stillUrl = ep.still_path ? `${config.STILL_BASE_URL}${ep.still_path}` : 'https://via.placeholder.com/240x135/1a1d24/666?text=No+Still';
                     const epTitle = Utils.escapeHtml(ep.name || `Episode ${ep.episode_number}`);
                     const epOverview = Utils.escapeHtml(ep.overview || 'No description.');
                     const epAirDate = ep.air_date ? Utils.formatAirDate(ep.air_date) : 'N/A';
                     const epRating = ep.vote_average ? ep.vote_average.toFixed(1) : null;
                     const epRuntime = ep.runtime ? Utils.formatRuntime(ep.runtime) : null;

                     const episodeDiv = document.createElement('div');
                     episodeDiv.className = 'episode-item';
                     episodeDiv.innerHTML = `
                        <div class="episode-still flex-shrink-0">
                            <img 
                                src="${stillUrl}" 
                                alt="${epTitle} Still" 
                                loading="lazy"
                                style="width: 100%; max-width: 240px; border-radius: var(--radius-md);"
                                onerror="this.onerror=null;this.src='https://sdmntprnortheu.oaiusercontent.com/files/00000000-82b8-61f4-b635-0e690386afbc/raw?se=2025-07-22T21%3A58%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=5928490a-9559-5166-af23-2432e1b351da&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-22T07%3A02%3A19Z&ske=2025-07-23T07%3A02%3A19Z&sks=b&skv=2024-08-04&sig=KxpuDEAZ/5uj2UkCgf8OumWj2OPvjYcNUPh6umRzL6Y%3D';"
                            >
                        </div>

                         <div class="episode-details flex-grow-1">
                             <h5 class="mb-1">${ep.episode_number}. ${epTitle}</h5>
                             <div class="episode-meta text-muted small mb-2">
                                 <span><i class="bi bi-calendar3 me-1"></i> ${epAirDate}</span>
                                 ${epRating && parseFloat(epRating) > 0 ? `<span class="ms-3"><i class="bi bi-star-fill text-warning me-1"></i> ${epRating}/10</span>` : ''}
                                 ${epRuntime ? `<span class="ms-3"><i class="bi bi-clock me-1"></i> ${epRuntime}</span>` : ''}
                             </div>
                             <p class="episode-overview mb-3">${epOverview.length > 150 ? epOverview.substring(0, 150) + '...' : epOverview}</p>
                             <a href="#player=tv/${tvId}/${seasonNum}/${ep.episode_number}" class="btn btn-sm btn-primary"><i class="bi bi-play-fill me-1"></i> Watch Ep ${ep.episode_number}</a>
                             <!-- Add trailer button if episode has videos -->
                             ${ep.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') ?
                                 `<button class="btn btn-sm btn-outline-secondary ms-2 watch-trailer-btn" data-video-key="${ep.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer').key}"><i class="bi bi-film me-1"></i> Trailer</button>` : ''
                             }
                         </div>
                     `;
                     // Add trailer click listener
                     const trailerBtn = episodeDiv.querySelector('.watch-trailer-btn');
                     if (trailerBtn) {
                         trailerBtn.addEventListener('click', App.handleEpisodeTrailerClick);
                     }

                     paneElement.appendChild(episodeDiv);
                 });
             },
*/
            // Renders episodes into a specific season pane
            renderSeasonEpisodes: (episodes, paneElement, tvId, seasonNum) => {
    if (!paneElement) return;
    paneElement.innerHTML = '';

    if (!episodes || episodes.length === 0) {
        paneElement.innerHTML = '<p class="text-muted p-3">No episode data available for this season.</p>';
        return;
    }

    episodes.sort((a, b) => a.episode_number - b.episode_number).forEach(ep => {
        const isFuture = ep.air_date && new Date(ep.air_date) > new Date();
        const epTitle = Utils.escapeHtml(ep.name || `Episode ${ep.episode_number}`);
        const epOverview = Utils.escapeHtml(ep.overview || 'No description.');
        const epAirDate = ep.air_date ? Utils.formatAirDate(ep.air_date) : 'N/A';
        const epRating = ep.vote_average ? ep.vote_average.toFixed(1) : null;
        const epRuntime = ep.runtime ? Utils.formatRuntime(ep.runtime) : null;

        let stillImg = '';
        if (ep.still_path) {
            // Valid episode image
            stillImg = `
                    <img 
                       src="${config.STILL_BASE_URL}${ep.still_path}" 
                       alt="${epTitle} Still" 
                       loading="lazy"
                       style=" border-radius: var(--radius-md); object-fit: cover;"
                       onerror="this.onerror=null;this.src='https://via.placeholder.com/240x135/1a1d24/666?text=Image+Not+Available';"
                    >
            `;
        } else {
            // Placeholder box with optional air date
            stillImg = `
                <div style="
                    width: 100%; 
                    max-width: 280px; 
                    height: 135px; 
                    border-radius: var(--radius-md); 
                    background-color: #1a1d24; 
                    color: #aaa; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center; 
                    text-align: center; 
                    font-size: 0.9rem;
                ">
                    <div>Image Not Available</div>
                    ${isFuture ? `<div style="font-size: 0.75rem; margin-top: 0.25rem; color: #ccc;">Airing: ${epAirDate}</div>` : ''}
                </div>
            `;
        }

        const episodeDiv = document.createElement('div');
        episodeDiv.className = 'episode-item d-flex gap-3 mb-4';
        episodeDiv.innerHTML = `
            <div class="episode-still flex-shrink-0">
                ${stillImg}
            </div>

            <div class="episode-details flex-grow-1">
                <h5 class="mb-1">${ep.episode_number}. ${epTitle}</h5>
                <div class="episode-meta text-muted small mb-2">
                    <span><i class="bi bi-calendar3 me-1"></i> ${epAirDate}</span>
                    ${epRating && parseFloat(epRating) > 0 ? `<span class="ms-3"><i class="bi bi-star-fill text-warning me-1"></i> ${epRating}/10</span>` : ''}
                    ${epRuntime ? `<span class="ms-3"><i class="bi bi-clock me-1"></i> ${epRuntime}</span>` : ''}
                </div>
                <p class="episode-overview mb-3">${epOverview.length > 150 ? epOverview.substring(0, 150) + '...' : epOverview}</p>
                <a href="#player=tv/${tvId}/${seasonNum}/${ep.episode_number}" class="btn btn-sm btn-primary">
                    <i class="bi bi-play-fill me-1"></i> Watch Ep ${ep.episode_number}
                </a>
                ${ep.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') ? `
                    <button 
                        class="btn btn-sm btn-outline-secondary ms-2 watch-trailer-btn" 
                        data-video-key="${ep.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer').key}">
                        <i class="bi bi-film me-1"></i> Trailer
                    </button>
                ` : ''}
            </div>
        `;

        const trailerBtn = episodeDiv.querySelector('.watch-trailer-btn');
        if (trailerBtn) {
            trailerBtn.addEventListener('click', App.handleEpisodeTrailerClick);
        }

        paneElement.appendChild(episodeDiv);
    });
},

         
             // Renders the player page source buttons
             renderStreamingSourceButtons: () => {
                 if (!DOM.playerSourceBtnsContainer) return;
                 DOM.playerSourceBtnsContainer.innerHTML = '<p class="text-muted small mb-2">Select streaming source:</p>'; // Reset

                 config.STREAMING_PROVIDERS.forEach((provider, index) => {
                     const button = document.createElement('button');
                     button.className = 'btn btn-outline-secondary btn-sm me-2 mb-2';
                     button.textContent = provider.name;
                     button.dataset.sourceIndex = index; // Store index to find provider later
                     button.addEventListener('click', (e) => {
                         // Remove active class from other buttons
                         DOM.playerSourceBtnsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                         // Add active class to clicked button
                         e.currentTarget.classList.add('active');
                         App.setStreamingSource(index);
                     });
                     DOM.playerSourceBtnsContainer.appendChild(button);
                 });
             },

             recordGlobalView: async (type, id, title) => {
        // Use the globally initialized appDb from firebase.js
        /*if (typeof appDb === 'undefined' || !appDb) {
            console.warn("Firestore (appDb) not available, cannot record global view.");
            return; // Exit if Firestore instance isn't ready
        }*/
       if (typeof appAuth === 'undefined' || !appAuth.currentUser || typeof appDb === 'undefined' || !appDb) {
    console.log("[Continue Watching] User not logged in or Firebase not ready. Using local storage (if any).");
    return []; // Returns an empty array if not logged in
}
        if (!type || !id || !title) {
            console.warn(`recordGlobalView skipped: Missing type (${type}), id (${id}), or title (${title}).`);
            return; // Exit if required info is missing
        }

        const docId = `${type}-${id}`; // e.g., "movie-12345"
        const viewDocRef = appDb.collection("viewCounts").doc(docId);

        console.log(`[App.recordGlobalView] Attempting to increment count for ${docId} (${title})...`);

        try {
            // Use set with merge:true to create/update atomically.
            // This ensures the document is created if it doesn't exist,
            // and the counter is incremented correctly if it does.
            await viewDocRef.set({
                type: type,
                tmdbId: parseInt(id), // Store ID as number if possible
                title: title, // Store the title
                viewCount: firebase.firestore.FieldValue.increment(1), // Atomically increments
                lastViewed: firebase.firestore.FieldValue.serverTimestamp() // Track last view time
            }, { merge: true }); // Merge ensures we don't overwrite type/id/title if doc exists

            console.log(`[App.recordGlobalView] Successfully recorded global view for ${docId}`);
        } catch (error) {
            console.error(`[App.recordGlobalView] Error recording global view for ${docId}:`, error);
            // Optional: Show a non-critical error toast to the user?
            // Utils.showToast("Could not update global view count.", "info");
        }
    },


             // Sets the iframe source based on selected provider and context
             setStreamingSource: (sourceIndex) => {
        // 1. Get Context and Provider
        const provider = config.STREAMING_PROVIDERS[sourceIndex];
        const { itemId, itemType, currentSeason, currentEpisode } = State.moviePlayerContext;

        // 2. Validate Inputs and DOM Elements
        if (!provider || !itemId || !itemType || !DOM.playerIframe || !DOM.playerIframePlaceholder || !DOM.playerTitleEl) {
            console.error("setStreamingSource: Missing provider, context, or essential DOM elements.");
            Utils.showToast("Cannot load stream: essential information missing.", "danger");
            return;
        }

        // 3. Get Item Title (needed for global tracking)
        const itemTitle = DOM.playerTitleEl.textContent || 'Unknown Title'; // Get current title

        // 4. Trigger User-Specific View Tracking (if user is logged in)
        // Assumes trackView is globally available from firebase.js
        if (typeof trackView === 'function' && typeof appAuth !== 'undefined' && appAuth.currentUser && typeof appDb !== 'undefined' && appDb) {
            const userId = appAuth.currentUser.uid;
            const contentId = `${itemType}-${itemId}`; // Unique ID for user's view subcollection
            console.log(`[App.setStreamingSource] Calling trackView for user ${userId}, content ${contentId}`);
            trackView(appDb, userId, contentId)
                .catch(err => console.error("Error occurred during trackView execution:", err)); // Catch errors from the async function
        } else {
            console.warn("[App.setStreamingSource] User-specific view tracking skipped: User not logged in, trackView function not found, or DB not ready.");
        }

        // 5. Trigger Global View Tracking
        // Call the App's own method, passing the necessary info
        App.recordGlobalView(itemType, itemId, itemTitle);

        // 6. Generate Streaming URL
        const url = provider.urlFormat(itemId, itemType, currentSeason, currentEpisode);

        // 7. Update Iframe
        if (url && DOM.playerIframe) {
            console.log(`[App.setStreamingSource] Setting iframe src to: ${url}`);
            DOM.playerIframe.src = url;
            Utils.setElementVisibility(DOM.playerIframe, true);
            Utils.setElementVisibility(DOM.playerIframePlaceholder, false);
        } else {
            // Handle cases where URL generation failed
            console.warn(`[App.setStreamingSource] Could not generate URL for provider: ${provider.name}`);
            Utils.showToast(`Could not load source: ${provider.name}`, 'warning');
            DOM.playerIframe.src = 'about:blank'; // Clear src
            Utils.setElementVisibility(DOM.playerIframe, false);
            Utils.setElementVisibility(DOM.playerIframePlaceholder, true);
            // Update placeholder text
            if (DOM.playerIframePlaceholder) {
                DOM.playerIframePlaceholder.innerHTML = `<span class="text-muted">Failed to load source: ${provider.name}</span>`;
            }
        }
    },

            // Renders episode dropdowns for the player page
            renderEpisodeSelectors: async (itemData, initialSeasonData) => {
                 if (!DOM.playerEpisodeSelectorContainer) return;
                 DOM.playerEpisodeSelectorContainer.innerHTML = ''; // Clear

                const tvId = itemData.id;
                const currentS = State.moviePlayerContext.currentSeason || initialSeasonData.season_number;
                const currentE = State.moviePlayerContext.currentEpisode || 1;

                // Filter valid seasons (non-zero or only season)
                const validSeasons = itemData.seasons?.filter(s => s.season_number > 0 || itemData.seasons?.length === 1) || [];
                 if (validSeasons.length === 0) return; // No seasons to select

                 // --- Season Dropdown ---
                 const seasonDropdownHtml = `
                     <div class="dropdown">
                         <button class="btn btn-outline-light dropdown-toggle" type="button" id="seasonDropdownPlayer" data-bs-toggle="dropdown" aria-expanded="false">
                             Season ${currentS}
                         </button>
                         <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="seasonDropdownPlayer">
                             ${validSeasons.map(s => `<li><a class="dropdown-item season-select-item ${s.season_number === currentS ? 'active' : ''}" href="#" data-season="${s.season_number}">${Utils.escapeHtml(s.name)}</a></li>`).join('')}
                         </ul>
                     </div>
                 `;

                 // --- Episode Dropdown (initially populated for current season) ---
                 const episodeDropdownHtml = `
                     <div class="dropdown">
                         <button class="btn btn-outline-light dropdown-toggle" type="button" id="episodeDropdownPlayer" data-bs-toggle="dropdown" aria-expanded="false">
                             Episode ${currentE}
                         </button>
                         <ul class="dropdown-menu dropdown-menu-dark" id="episode-select-list" aria-labelledby="episodeDropdownPlayer">
                             <!-- Episodes loaded dynamically -->
                             ${initialSeasonData.episodes.map(ep => `<li><a class="dropdown-item episode-select-item ${ep.episode_number === currentE ? 'active' : ''}" href="#" data-episode="${ep.episode_number}">${ep.episode_number}. ${Utils.escapeHtml(ep.name)}</a></li>`).join('')}
                         </ul>
                     </div>
                 `;

                 DOM.playerEpisodeSelectorContainer.innerHTML = seasonDropdownHtml + episodeDropdownHtml;

                 // --- Add Listeners ---
                 // Season selection listener
                 DOM.playerEpisodeSelectorContainer.querySelectorAll('.season-select-item').forEach(item => {
                     item.addEventListener('click', async (e) => {
                         e.preventDefault();
                         const selectedSeason = parseInt(e.currentTarget.dataset.season);
                         if (selectedSeason === State.moviePlayerContext.currentSeason) return; // No change

                         State.moviePlayerContext.currentSeason = selectedSeason;
                         State.moviePlayerContext.currentEpisode = 1; // Reset to episode 1

                         // Update button text
                         document.getElementById('seasonDropdownPlayer').textContent = `Season ${selectedSeason}`;
                         document.getElementById('episodeDropdownPlayer').textContent = `Episode 1`;
                         // Update active state in dropdown
                         DOM.playerEpisodeSelectorContainer.querySelectorAll('.season-select-item.active').forEach(el => el.classList.remove('active'));
                         e.currentTarget.classList.add('active');

                         // Reload episode list and set source for S / E 1
                         await App.loadEpisodeOptions(tvId, selectedSeason);
                         const firstButton = DOM.playerSourceBtnsContainer.querySelector('button.active') || DOM.playerSourceBtnsContainer.querySelector('button');
                         if (firstButton) App.setStreamingSource(parseInt(firstButton.dataset.sourceIndex));
                     });
                 });

                 // Episode selection listener (delegated)
                 const episodeList = document.getElementById('episode-select-list');
                 if (episodeList) {
                     episodeList.addEventListener('click', (e) => {
                         if (e.target.classList.contains('episode-select-item')) {
                             e.preventDefault();
                             const selectedEpisode = parseInt(e.target.dataset.episode);
                             if (selectedEpisode === State.moviePlayerContext.currentEpisode) return; // No change

                             State.moviePlayerContext.currentEpisode = selectedEpisode;

                             // Update button text
                             document.getElementById('episodeDropdownPlayer').textContent = `Episode ${selectedEpisode}`;
                             // Update active state
                             episodeList.querySelectorAll('.episode-select-item.active').forEach(el => el.classList.remove('active'));
                             e.target.classList.add('active');

                             // Set source for the selected episode
                             const firstButton = DOM.playerSourceBtnsContainer.querySelector('button.active') || DOM.playerSourceBtnsContainer.querySelector('button');
                              if (firstButton) App.setStreamingSource(parseInt(firstButton.dataset.sourceIndex));
                         }
                     });
                 }

                 // Set initial source based on context
                 const firstButton = DOM.playerSourceBtnsContainer.querySelector('button');
                  if (firstButton) {
                       firstButton.classList.add('active'); // Make first source active by default
                       App.setStreamingSource(parseInt(firstButton.dataset.sourceIndex));
                   } else {
                       DOM.playerIframePlaceholder.innerHTML = `<span class="text-muted">No streaming sources available.</span>`;
                   }

            },

            // Loads episodes for a given season into the player dropdown
            loadEpisodeOptions: async (tvId, seasonNum) => {
                const episodeList = document.getElementById('episode-select-list');
                 if (!episodeList) return;

                 episodeList.innerHTML = '<li><span class="dropdown-item disabled">Loading episodes...</span></li>'; // Loading state

                try {
                    const seasonData = await API.fetchTMDB(`/tv/${tvId}/season/${seasonNum}`);
                    if (!seasonData || !seasonData.episodes) throw new Error("Could not load season data.");

                    episodeList.innerHTML = ''; // Clear loading/previous
                    seasonData.episodes.forEach(ep => {
                         // Make episode 1 active by default when season changes
                         const isActive = ep.episode_number === State.moviePlayerContext.currentEpisode;
                         episodeList.innerHTML += `<li><a class="dropdown-item episode-select-item ${isActive ? 'active' : ''}" href="#" data-episode="${ep.episode_number}">${ep.episode_number}. ${Utils.escapeHtml(ep.name)}</a></li>`;
                     });
                     // Ensure Ep 1 is selected visually if state was reset
                      if (!episodeList.querySelector('.active')) {
                          episodeList.querySelector('.episode-select-item[data-episode="1"]')?.classList.add('active');
                      }

                } catch (error) {
                    console.error(`Failed to load episodes for S${seasonNum}:`, error);
                    episodeList.innerHTML = '<li><span class="dropdown-item disabled text-danger">Error loading episodes</span></li>';
                    Utils.showToast(`Failed to load episodes for Season ${seasonNum}.`, 'warning');
                }
            },


             // Renders genre results page content
             renderGenreResultsPage: (results, currentPage, totalPages) => {
                 if (!DOM.genreResultsGrid || !DOM.loadMoreGenreBtn) return;

                 const append = currentPage > 1; // Append if loading more
                 App.renderTmdbCards(results, DOM.genreResultsGrid, State.currentGenre.type, append);

                 // Update Load More Button state
                 const canLoadMore = currentPage < totalPages;
                 Utils.setElementVisibility(DOM.loadMoreGenreBtn, canLoadMore);
                 if (canLoadMore) {
                     DOM.loadMoreGenreBtn.dataset.page = currentPage;
                 }
             },

            addSeasonTabListeners: (tvId) => {
                const seasonTabs = DOM.detailsWrapper?.querySelectorAll('#seasons-tablist .nav-link');
                if (!seasonTabs) return;

                seasonTabs.forEach(tab => {
                    // Remove previous listeners if any (simple approach)
                     // const newTab = tab.cloneNode(true);
                     // tab.parentNode.replaceChild(newTab, tab);
                     // tab = newTab; // Use the new node

                    tab.addEventListener('show.bs.tab', async (event) => { // Use 'show' to load before it's fully visible
                        const seasonNum = event.target.dataset.seasonNumber;
                        const paneId = event.target.getAttribute('data-bs-target');
                        if (!seasonNum || !paneId) return;

                        const paneElement = DOM.detailsWrapper.querySelector(paneId);
                        if (paneElement && paneElement.innerHTML.includes('spinner')) { // Load only if not already loaded
                            await App.loadSeasonData(tvId, seasonNum);
                        }
                    });
                });
            },

             // Fetches and renders data for a specific season
             loadSeasonData: async (tvId, seasonNum) => {
                 const paneId = `#season-${seasonNum}-pane`;
                 const paneElement = DOM.detailsWrapper?.querySelector(paneId);
                 if (!paneElement) return;

                 // Cancel previous request if still loading a different season
                 if (State.activeSeasonAbortController) {
                     State.activeSeasonAbortController.abort();
                     console.log("Aborted previous season load.");
                 }
                 State.activeSeasonAbortController = new AbortController();

                 paneElement.innerHTML = Utils.getSpinnerHTML(`Loading Season ${seasonNum}...`);

                 try {
                     const seasonData = await API.fetchTMDB(`/tv/${tvId}/season/${seasonNum}`, {
                         append_to_response: 'videos', // Get episode videos if available
                         signal: State.activeSeasonAbortController.signal // Pass signal
                     });

                     // Clear controller after fetch completes or fails (but not if aborted)
                     State.activeSeasonAbortController = null;

                     if (seasonData && seasonData.episodes) {
                         App.renderSeasonEpisodes(seasonData.episodes, paneElement, tvId, seasonNum);
                     } else {
                         throw new Error("Season data not found or invalid.");
                     }
                 } catch (error) {
                     if (error.name !== 'AbortError') {
                        console.error(`Failed to load season ${seasonNum}:`, error);
                        paneElement.innerHTML = Utils.getErrorHTML(`Failed to load Season ${seasonNum}: ${error.message}`);
                        State.activeSeasonAbortController = null; // Clear on non-abort error
                     } else {
                         // Request was aborted, do nothing or log message
                         console.log(`Load aborted for season ${seasonNum}`);
                     }
                 }
             },

            handleEpisodeTrailerClick: (event) => {
                const videoKey = event.currentTarget.dataset.videoKey;
                if (videoKey) {
                    App.playTrailer(videoKey);
                }
            },

          
            handleGetAiInsight: async (itemType, itemId, itemTitle, itemYear) => {
                const container = DOM.detailsWrapper?.querySelector('#ai-insight-container'); // Select dynamically
                const button = DOM.detailsWrapper?.querySelector('#get-ai-insight-btn'); // Select dynamically

                if (!container || !button) return;

                // Indicate loading
                container.innerHTML = Utils.getSpinnerHTML("Generating insight...", false);
                button.disabled = true;
                button.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Generating...`;

                const prompt = `Provide a unique and engaging insight or alternative summary for the ${itemType === 'tv' ? 'TV show' : 'movie'} "${itemTitle}" (${itemYear}). Focus on themes, tone, target audience, or what makes it stand out from similar titles. Keep it concise (around 2-4 sentences) and avoid major spoilers.`;

                let success = false;
                try {
                    const insightText = await API.fetchGemini(prompt);

                    if (insightText) {
                        container.innerHTML = `<p class="mb-0">${Utils.escapeHtml(insightText).replace(/\n/g, '<br>')}</p>`;
                        success = true; // Mark as successful
                    } else {
                        // Error handled in fetchGemini, show specific message here
                        container.innerHTML = `<p class="text-warning small mb-0">Could not generate AI insight at this time. Please try again later.</p>`;
                    }
                } catch (error) {
                     console.error("Error in handleGetAiInsight:", error);
                     container.innerHTML = `<p class="text-danger small mb-0">An unexpected error occurred generating the insight.</p>`;
                } finally {
                    // --- Button State ---
                    if (success) {
                        // Keep button disabled indefinitely after success for this session
                        button.innerHTML = `<i class="bi bi-check-lg me-1"></i> Insight Generated`;
                        // You might want to persist this state (e.g., sessionStorage)
                        // so it remains disabled if the user navigates away and back.
                    } else {
                        // Re-enable button ONLY on failure
                        button.disabled = false;
                        button.innerHTML = `<i class="bi bi-magic me-1"></i> Get AI Insight`;
                    }
                }
            },

            handleGetAiBio: async (personId, personName) => {
                const container = DOM.personWrapper?.querySelector('#ai-bio-container'); // Select dynamically
                const button = DOM.personWrapper?.querySelector('#get-ai-bio-btn'); // Select dynamically

                
                if (container) container.innerHTML = Utils.getSpinnerHTML("Generating highlight...", false);

                // Indicate loading
                container.innerHTML = Utils.getSpinnerHTML("Generating highlight...", false);
                button.disabled = true;
                button.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Generating...`;

                const prompt = `Provide a brief highlight of the actor ${personName}'s career. Mention one or two of their most significant or well-known roles or contributions. Keep it very concise (1-2 sentences).`;

                let success = false;
                try {
                    const bioHighlight = await API.fetchGemini(prompt);

                    if (bioHighlight) {
                        container.innerHTML = `<p class="mb-0">${Utils.escapeHtml(bioHighlight).replace(/\n/g, '<br>')}</p>`;
                        success = true; // Mark as successful
                    } else {
                        container.innerHTML = `<p class="text-warning small mb-0">Could not generate AI highlight at this time. Please try again later.</p>`;
                    }
                 } catch (error) {
                     console.error("Error in handleGetAiBio:", error);
                     container.innerHTML = `<p class="text-danger small mb-0">An unexpected error occurred generating the highlight.</p>`;
                 } finally {
                     // --- Button State ---
                    if (success) {
                        // Keep button disabled indefinitely after success for this session
                        button.innerHTML = `<i class="bi bi-check-lg me-1"></i> Highlight Generated`;
                    } else {
                        // Re-enable button ONLY on failure
                        button.disabled = false;
                        button.innerHTML = `<i class="bi bi-magic me-1"></i> Get AI Highlight`;
                    }
                 }
            },

             // Resizes the visualizer canvas based on container width
            resizeVisualizerCanvas: () => {
                if (DOM.visualizerCanvas && DOM.visualizerCanvas.parentElement) {
                    DOM.visualizerCanvas.width = DOM.visualizerCanvas.parentElement.clientWidth;
                    // Height is fixed via CSS, but could be dynamic too:
                    // DOM.visualizerCanvas.height = 200;
                }
            },

            // Initialize Bootstrap Tooltips within a given container
            initializeTooltips: (containerElement) => {
                 if (!containerElement) return;
                 // Dispose previous tooltips in this container if tracked (more complex)
                 // bsInstances.tooltips = bsInstances.tooltips.filter(t => !containerElement.contains(t.element));

                 const tooltipTriggerList = [].slice.call(containerElement.querySelectorAll('[data-bs-toggle="tooltip"]'));
                 tooltipTriggerList.map(tooltipTriggerEl => {
                      // Store instances if specific disposal is needed later
                      // bsInstances.tooltips.push(new bootstrap.Tooltip(tooltipTriggerEl));
                      return new bootstrap.Tooltip(tooltipTriggerEl); // Simple initialization
                 });
            },
        };

   

        if (!State.horizontalScrollContainers) {
             State.horizontalScrollContainers = [];
         }

        // --- Start the Application ---
        //document.addEventListener('DOMContentLoaded', App.init);
