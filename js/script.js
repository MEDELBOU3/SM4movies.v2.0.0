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
                {
                    title: "Continue Watching",
                    id: 'continue-watching', // Special ID to identify it
                    display_style: 'horizontal_backdrop'
                     // No 'endpoint' or 'type' needed here
                },
                { // <<< NEW SECTION >>>
                    title: "Popular on AuraStream", // Or "Your Most Viewed"
                    id: 'most-viewed', // Special ID
                    display_style: 'horizontal_poster', // Or vertical 'default'
                    max_items: 15 // How many top items to show
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


        // --- DOM References ---
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
                person: document.getElementById('person-view'), // NEW: Person view
                watchlist: document.getElementById('watchlist-view'), 
                analytics: document.getElementById('analytics-view'),
            },
            // Navbar
            navbarMenu: document.getElementById('navbarNav'),
            tmdbSearchForm: document.getElementById('tmdb-search-form'),
            tmdbSearchInput: document.getElementById('tmdb-search-input'),
            spotifyStatusNavMessage: document.getElementById('spotify-auth-nav-message'),
            genreDropdownMenu: document.getElementById('genre-dropdown-menu'),
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
            // --- NEW: Gemini refs for Details View ---
            detailsAiInsightBtn: null, // Will be selected dynamically after render
            detailsAiInsightContainer: null, // Will be selected dynamically after render
            // Genre Results View
            genreResultsGrid: document.getElementById('genre-results-grid'),
            genreResultsTitle: document.getElementById('genre-results-title'),
            loadMoreGenreBtn: document.getElementById('load-more-genre-btn'),
            genreLoadingSpinner: document.getElementById('genre-loading-more-spinner'),
            // Network Results View
            networkResultsGrid: document.getElementById('network-results-grid'),
            networkResultsTitle: document.getElementById('network-results-title'),
            loadMoreNetworkBtn: document.getElementById('load-more-network-btn'),
            networkLoadingSpinner: document.getElementById('network-loading-more-spinner'),
            //Lives
            liveSportsGrid: document.getElementById('livesports-grid'),
            // Person View (NEW)
            personWrapper: document.getElementById('person-content-wrapper'),
            //Analytics
            analyticsNavLink: document.querySelector('.nav-link[href="#analytics"]'),
            // --- NEW: Gemini refs for Person View ---
            personAiBioBtn: null, // Will be selected dynamically
            personAiBioContainer: null, // Will be selected dynamically
            // Movie Player View
            playerTitleEl: document.getElementById('player-title'),
            playerSourceBtnsContainer: document.getElementById('stream-source-buttons'),
            playerEpisodeSelectorContainer: document.getElementById('episode-selector-container'),
            playerIframe: document.getElementById('streaming-iframe'),
            playerIframePlaceholder: document.getElementById('iframe-placeholder'),

            trailerModalElement: document.getElementById('trailerModal'),
            trailerModalIframe: document.getElementById('trailerModalIframe'),

            watchlistGrid: document.getElementById('watchlist-grid'), // NEW
            clearWatchlistBtn: document.getElementById('clear-watchlist-btn'),

            connectionExplorerModal: document.getElementById('connectionExplorerModal'),
            connectionGraphContainer: document.getElementById('connection-graph-container'),
            connectionGraphLoading: document.getElementById('connection-graph-loading'),
            connectionGraphError: document.getElementById('connection-graph-error'),
            connectionExplorerTitle: document.getElementById('connectionExplorerModalLabel'), // To set title


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
        };

        // --- State Variables ---
        const State = {
            currentGenre: null, // { type: 'movie' | 'tv', id: number, name: string }
            currentNetwork: null, // { id: number, name: string, logo?: string }
            tmdbWatchProviders: null,
            currentPersonId: null, // NEW: Track current person being viewed
            allMovieGenres: [],
            allTvGenres: [],
            watchlist: [],
            continueWatching: [],
            horizontalScrollContainers: [],
            tmdbSearchTimeout: null,
            activeSeasonAbortController: null, // To cancel previous season loads
            moviePlayerContext: { // Context for the player page
                 itemId: null, itemType: null, currentSeason: null, currentEpisode: null
            },
            spotifyAppAccessToken: null,
            spotifyAppTokenExpiresAt: null, // Timestamp when token expires
            spotifyTokenPromise: null, // To prevent multiple token requests
            visualizerAudioContext: null,
            visualizerAnalyser: null,
            visualizerSource: null, // MediaElementAudioSourceNode
            visualizerDataArray: null, // Uint8Array
            isGraphLoading: false,
            visualizerRafId: null, // requestAnimationFrame ID
            isVisualizerSetup: false,
            isVisualizerConnected: false,
            visNetworkInstance: null, // Reference to the vis.js Network
            currentExplorerItem: null, // { id: ..., type: ... } for the graph
            // Helper function to check if token is valid
            hasValidSpotifyAppToken: () => !!(State.spotifyAppAccessToken && State.spotifyAppTokenExpiresAt && Date.now() < State.spotifyAppTokenExpiresAt),
        };

        // --- Bootstrap Instance Cache ---
        const bsInstances = {
            navbarCollapse: null,
            tooltips: [], // Store tooltip instances if needed for cleanup
            tabs: [], // Store tab instances if needed
            trailerModal: null,
            connectionModal: null,
        };

        const Watchlist = {
            STORAGE_KEY: 'auraStreamWatchlist',

            // Load watchlist from localStorage into State
            load: () => {
                try {
                    const storedList = localStorage.getItem(Watchlist.STORAGE_KEY);
                    State.watchlist = storedList ? JSON.parse(storedList) : [];
                    console.log("Watchlist loaded:", State.watchlist.length, "items");
                } catch (error) {
                    console.error("Failed to load watchlist from localStorage:", error);
                    State.watchlist = [];
                    localStorage.removeItem(Watchlist.STORAGE_KEY); // Clear corrupted data
                }
            },

             // Save current State.watchlist to localStorage
             save: () => {
                try {
                    localStorage.setItem(Watchlist.STORAGE_KEY, JSON.stringify(State.watchlist));
                } catch (error) {
                    console.error("Failed to save watchlist to localStorage:", error);
                    Utils.showToast("Error saving watchlist.", "danger");
                }
            },

            // Add an item to the watchlist
            add: (itemData) => {
                if (!itemData || !itemData.id || !itemData.type) return false;

                // Check if already exists
                if (Watchlist.isInWatchlist(itemData.id, itemData.type)) {
                    console.log("Item already in watchlist:", itemData.id);
                    // Optionally remove if clicked again (like a toggle)
                     // Watchlist.remove(itemData.id, itemData.type);
                     // return false; // Indicate removal
                     return true; // Indicate it's already there or logic handles it
                }

                // Extract necessary data
                const watchlistItem = {
                    id: itemData.id,
                    type: itemData.type,
                    title: itemData.title || itemData.name || 'Unknown Title',
                    poster_path: itemData.poster_path || null,
                    backdrop_path: itemData.backdrop_path || null, // Also store backdrop
                    vote_average: itemData.vote_average || null,
                };

                State.watchlist.push(watchlistItem);
                Watchlist.save();
                console.log("Added to watchlist:", watchlistItem.title);
                Utils.showToast(`${watchlistItem.title} added to watchlist!`, "success");
                return true; // Indicate addition
            },

            // Remove an item from the watchlist by id and type
            remove: (id, type) => {
                 const initialLength = State.watchlist.length;
                 const itemId = parseInt(id); // Ensure ID is number for comparison
                 State.watchlist = State.watchlist.filter(item =>
                     !(item.id === itemId && item.type === type)
                 );

                if (State.watchlist.length < initialLength) {
                    Watchlist.save();
                    console.log("Removed item from watchlist:", id, type);
                    Utils.showToast("Item removed from watchlist.", "info");
                    return true; // Indicate removal
                }
                return false; // Item not found
            },

            // Clear the entire watchlist
            clear: () => {
                State.watchlist = [];
                Watchlist.save();
                console.log("Watchlist cleared.");
                 Utils.showToast("Watchlist cleared.", "info");
            },

            // Check if an item is in the current watchlist State
            isInWatchlist: (id, type) => {
                const itemId = parseInt(id); // Ensure comparison uses numbers
                return State.watchlist.some(item => item.id === itemId && item.type === type);
            }
        };

        const ContinueWatching = {
            STORAGE_KEY: 'auraStreamContinueWatching',
            MAX_ITEMS: 20, // Max number of items to keep in the list

            // Load from localStorage
            load: () => {
                try {
                    const storedList = localStorage.getItem(ContinueWatching.STORAGE_KEY);
                    State.continueWatching = storedList ? JSON.parse(storedList) : [];
                    // Ensure it's sorted on load (might not be if saved improperly before)
                    State.continueWatching.sort((a, b) => b.lastWatchedTimestamp - a.lastWatchedTimestamp);
                    console.log("Continue Watching loaded:", State.continueWatching.length, "items");
                } catch (error) {
                    console.error("Failed to load Continue Watching list:", error);
                    State.continueWatching = [];
                    localStorage.removeItem(ContinueWatching.STORAGE_KEY);
                }
            },

            // Save to localStorage
            save: () => {
                try {
                    // Ensure list is sorted before saving
                    State.continueWatching.sort((a, b) => b.lastWatchedTimestamp - a.lastWatchedTimestamp);
                    // Limit the list size
                    const limitedList = State.continueWatching.slice(0, ContinueWatching.MAX_ITEMS);
                    localStorage.setItem(ContinueWatching.STORAGE_KEY, JSON.stringify(limitedList));
                } catch (error) {
                    console.error("Failed to save Continue Watching list:", error);
                    // Don't show toast here, might be too frequent
                }
            },

            // Update or Add an item (moves to top)
            // itemDetails should include: id, type, title, poster_path, backdrop_path
            // tvDetails should include: seasonNumber, episodeNumber, episodeTitle (if type is 'tv')
            // progressPercent: A dummy value (e.g., 15) or calculated if possible
            updateItem: (itemDetails, tvDetails = {}, progressPercent = 15) => { // Add default dummy progress
                if (!itemDetails || !itemDetails.id || !itemDetails.type) return;

                const itemId = parseInt(itemDetails.id);
                const itemType = itemDetails.type;
                const now = Date.now();

                // Remove existing entry if present
                State.continueWatching = State.continueWatching.filter(item =>
                    !(item.id === itemId && item.type === itemType &&
                      (itemType === 'movie' || (item.seasonNumber === tvDetails.seasonNumber && item.episodeNumber === tvDetails.episodeNumber)))
                );

                // Create new entry data
                const newItem = {
                    id: itemId,
                    type: itemType,
                    lastWatchedTimestamp: now,
                    title: itemDetails.title || itemDetails.name || 'Unknown Title',
                    poster_path: itemDetails.poster_path || null,
                    backdrop_path: itemDetails.backdrop_path || null,
                    vote_average: itemDetails.vote_average || null,
                    progressPercent: progressPercent, // Store the dummy progress
                     // TV Specific details
                    seasonNumber: itemType === 'tv' ? tvDetails.seasonNumber : null,
                    episodeNumber: itemType === 'tv' ? tvDetails.episodeNumber : null,
                    episodeTitle: itemType === 'tv' ? tvDetails.episodeTitle : null,
                };

                // Add to the beginning of the array
                State.continueWatching.unshift(newItem);

                // Limit size and save
                ContinueWatching.save();
                console.log("Updated Continue Watching:", newItem.title, tvDetails.episodeTitle || '');

                // Refresh the home section if currently visible (optional)
                if(location.hash === '#home' || location.hash === '') {
                    App.loadContinueWatchingSection(); // Reload the specific section
                }
            },

            // Get the current list (already sorted by load/save)
            getList: () => {
                return State.continueWatching;
            },

             // Remove an item explicitly (optional)
             remove: (id, type, seasonNumber = null, episodeNumber = null) => {
                 const itemId = parseInt(id);
                 const initialLength = State.continueWatching.length;

                 State.continueWatching = State.continueWatching.filter(item =>
                     !(item.id === itemId && item.type === type &&
                       (type === 'movie' || (item.seasonNumber === seasonNumber && item.episodeNumber === episodeNumber)))
                 );

                 if (State.continueWatching.length < initialLength) {
                     ContinueWatching.save();
                     console.log("Removed from Continue Watching:", id, type, seasonNumber, episodeNumber);
                     // Optionally refresh the list display
                     if(location.hash === '#home' || location.hash === '') {
                        App.loadContinueWatchingSection();
                    }
                     return true;
                 }
                 return false;
             },

        };

        // --- Utilities ---
        const Utils = {
             // Debounce function to limit rate of function calls
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
            escapeHtml: (unsafe) => {
                 return unsafe === null || unsafe === undefined ? '' : String(unsafe)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
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
            init: () => {
               console.log("🚀 App Init Starting..."); // Use an emoji for fun!

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


            applyTheme: (themeName) => {
                const body = document.body;
                // Remove any existing theme classes
                body.classList.remove(
                    'theme-midnight',
                    'theme-forest',
                    'theme-crimson',
                    'theme-nebula',
                    'theme-ocean',
                    'theme-desert',
                    'theme-solarized',
                    'theme-solarflare',
                    'theme-cyberpunk',
                    'theme-light'
                );


                if (themeName && themeName !== 'default') {
                    body.classList.add(`theme-${themeName}`);
                     console.log(`Applied theme: ${themeName}`);
                } else {
                    console.log('Applied default theme');
                }

                if (!localStorage.getItem(App.THEME_STORAGE_KEY)) {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        App.applyTheme('midnight');
                    } else {
                       App.applyTheme('light');
                    }
                }


                // Optional: Update active state in dropdown (if needed)
                 document.querySelectorAll('#theme-selector-menu .dropdown-item').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.theme === themeName);
                 });
            },

            applySavedTheme: () => {
                const savedTheme = localStorage.getItem(App.THEME_STORAGE_KEY);
                // Apply saved theme, or default if nothing is saved
                App.applyTheme(savedTheme || 'default');
            },

            addThemeSwitcherListeners: () => {
                const themeMenu = document.getElementById('theme-selector-menu');
                if (themeMenu) {
                    themeMenu.addEventListener('click', (e) => {
                        if (e.target.classList.contains('theme-select-btn')) {
                            const theme = e.target.dataset.theme;
                            if (theme) {
                                App.applyTheme(theme);
                                localStorage.setItem(App.THEME_STORAGE_KEY, theme); // Save preference
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
            handleAddOrRemoveFavorite: (button) => {
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

        // Toggle Favorite State
        if (Favorites.isFavorite(idNum, itemType)) {
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
        }

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

             loadHomePageContent: async () => {
                 console.log("Loading home page content...");
                 if (DOM.views.hero) DOM.views.hero.innerHTML = Utils.getSkeletonHeroHTML();
                 if (DOM.homeContentSectionsContainer) DOM.homeContentSectionsContainer.innerHTML = ''; // Clear section area first
                 if (DOM.networkLogosContainer) DOM.networkLogosContainer.innerHTML = Utils.getSkeletonNetworkLogoHTML(10); 
                 if (DOM.views.hero) DOM.views.hero.innerHTML = Utils.getSpinnerHTML("Loading hero...", true);
                 if (DOM.homeContentSectionsContainer) DOM.homeContentSectionsContainer.innerHTML = Utils.getSpinnerHTML("Loading sections...", true);
                 if (DOM.networkLogosContainer) DOM.networkLogosContainer.innerHTML = Utils.getSpinnerHTML("Loading networks...");

                 // Load concurrently
                 await Promise.all([
                     App.loadHeroItem(),
                     App.loadHomeSections(),
                     App.renderNetworkLogos() // Renders curated logos directly
                 ]);

                 // Update scroll buttons AFTER logos are rendered
                 App.updateNetworkScrollButtons();

                 setTimeout(() => {
                     State.horizontalScrollContainers?.forEach(({ container, prevBtn, nextBtn }) => {
                         App.updateHScrollButtons(container, prevBtn, nextBtn);
                     });
                 }, 200);
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

             loadHomeSections: async () => {
        console.log("[Home Sections] Starting load (Firebase Version)...");
        const mainContainer = DOM.homeContentSectionsContainer;
        if (!mainContainer) {
            console.error("[Home Sections] Main container (#home-content-sections) not found!");
            return;
        }

        // 1. Clear Container & Reset State
        mainContainer.innerHTML = Utils.getSpinnerHTML("Loading content sections...", true);
        State.horizontalScrollContainers = [];
        await new Promise(resolve => setTimeout(resolve, 50)); // Allow spinner to render
        mainContainer.innerHTML = ''; // Clear spinner

        // --- Prepare Promises for sections that require async checks BEFORE rendering structure ---
        let continueWatchingPromise = ContinueWatching.getList(); // Get list sync (already loaded in init)
        let mostViewedCheckPromise = (async () => { // Wrap Firestore check in async IIFE
            if (!db) return []; // Firestore not ready
            try {
                 const querySnapshot = await db.collection("viewCounts").limit(1).get(); // Check if *any* document exists
                 return querySnapshot.empty ? [] : [{}]; // Return non-empty array if views exist
             } catch(e){ console.error("Firestore check failed:", e); return []; }
        })();


        // 2. Iterate through Section Configurations
        for (const sectionConfig of config.HOME_SECTIONS) {
            console.log(`[Home Sections] Processing config: "${sectionConfig.title}"`);
            let shouldCreateSection = false;
            let sectionDiv = null; // Will be created or found

            // --- Handle Special Section Logic ---
            if (sectionConfig.id === 'continue-watching') {
                if (continueWatchingPromise.length > 0) { // Use loaded list
                     console.log(`[Home Sections] Creating "Continue Watching" section.`);
                     shouldCreateSection = true;
                     sectionDiv = document.createElement('section');
                     sectionDiv.id = 'continue-watching-section';
                 } else {
                     console.log(`[Home Sections] Skipping "Continue Watching" (list is empty).`);
                 }
            } else if (sectionConfig.id === 'most-viewed') {
                console.log('[Home Sections] Processing "Most Viewed" section (HTML expected).');
                sectionDiv = document.getElementById('most-viewed-section'); // Find existing
                if (!sectionDiv) {
                    console.warn('[Home Sections] Pre-defined HTML section "most-viewed-section" not found.');
                } else {
                     const mostViewedExists = (await mostViewedCheckPromise).length > 0; // Check result of Firestore query
                     if (mostViewedExists) {
                        console.log('[Home Sections] Global views found, "Most Viewed" section will be populated.');
                         shouldCreateSection = false; // Structure exists, just need to make visible & load
                         Utils.setElementVisibility(sectionDiv, true); // Make it visible now
                         const container = sectionDiv.querySelector('.most-viewed-container');
                         if(container){ // Add skeletons before load
                             const isHorizontal = container.classList.contains('horizontal-card-container');
                             container.innerHTML = isHorizontal ? Utils.getSkeletonHorizontalCardHTML(5) : Utils.getSkeletonCardHTML(6);
                         }
                         // Load function will be called below if sectionDiv is valid
                     } else {
                         console.log('[Home Sections] No global views tracked, hiding "Most Viewed" section.');
                         Utils.setElementVisibility(sectionDiv, false); // Ensure it's hidden
                         shouldCreateSection = false; // Do not proceed further
                     }
                 }
            } else if (sectionConfig.endpoint) {
                // Standard sections are always created (might show 'no results' later)
                console.log(`[Home Sections] Creating standard section: "${sectionConfig.title}"`);
                shouldCreateSection = true;
                sectionDiv = document.createElement('section');
            } else {
                // Skip misconfigured sections
                console.warn(`[Home Sections] Skipping section "${sectionConfig.title}" - Invalid config.`);
            }


            // --- If section should be displayed (created or found & visible) ---
            if (sectionDiv && (shouldCreateSection || sectionConfig.id === 'most-viewed')) {

                 // Common setup for sections that *will* be added or populated
                 sectionDiv.className = sectionDiv.className || 'content-section mb-5'; // Add default class if needed
                 let isHorizontal = sectionConfig.display_style?.startsWith('horizontal');
                 let containerSelector = sectionConfig.id === 'continue-watching' ? '.continue-watching-container'
                                     : sectionConfig.id === 'most-viewed' ? '.most-viewed-container'
                                     : isHorizontal ? '.horizontal-card-container' : '.row';
                 let skeletonHtml = '';

                 // --- Build Inner Structure (If section was dynamically created) ---
                 if (shouldCreateSection) { // Only build if we created it dynamically
                     if (sectionConfig.id === 'continue-watching') {
                         skeletonHtml = Utils.getSkeletonHorizontalCardHTML(Math.min(continueWatchingPromise.length, 5));
                         sectionDiv.innerHTML = `
                            <h2 class="section-title">${Utils.escapeHtml(sectionConfig.title)}</h2>
                            <div class="horizontal-scroll-wrapper">
                                <button class="btn h-scroll-btn prev disabled"><i class="bi bi-chevron-left"></i></button>
                                <div class="horizontal-card-container continue-watching-container">${skeletonHtml}</div>
                                <button class="btn h-scroll-btn next disabled"><i class="bi bi-chevron-right"></i></button>
                            </div>`;
                     } else { // Standard endpoint section
                         const skeletonCount = isHorizontal ? 5 : 6;
                         skeletonHtml = isHorizontal ? Utils.getSkeletonHorizontalCardHTML(skeletonCount) : Utils.getSkeletonCardHTML(skeletonCount);
                         sectionDiv.innerHTML = `
                             <h2 class="section-title">${Utils.escapeHtml(sectionConfig.title)}</h2>
                             ${isHorizontal ? `
                                <div class="horizontal-scroll-wrapper">
                                    <button class="btn h-scroll-btn prev disabled"><i class="bi bi-chevron-left"></i></button>
                                    <div class="horizontal-card-container">${skeletonHtml}</div>
                                    <button class="btn h-scroll-btn next disabled"><i class="bi bi-chevron-right"></i></button>
                                </div>
                             ` : `
                                <div class="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">${skeletonHtml}</div>
                             `}
                         `;
                    }
                 }

                 // Append *dynamically created* sections to the DOM
                  if (shouldCreateSection && !sectionDiv.parentNode) {
                       mainContainer.appendChild(sectionDiv);
                  }


                // --- Trigger Asynchronous Load Function for the Section ---
                if (sectionConfig.id === 'continue-watching') {
                     App.loadContinueWatchingSection(sectionDiv); // Function loads data and replaces skeleton
                } else if (sectionConfig.id === 'most-viewed') {
                     App.loadMostViewedSection(sectionDiv, sectionConfig); // Function loads data and replaces skeleton
                } else if (sectionConfig.endpoint) {
                     // Load standard section using IIFE
                    (async (currentSectionDiv, currentConfig, currentContainerSelector, isH) => {
                         try {
                             console.log(`[Home Sections][Async Load] Fetching standard data for "${currentConfig.title}"...`);
                             const data = await API.fetchTMDB(currentConfig.endpoint, { page: 1 });
                             const resultsContainer = currentSectionDiv.querySelector(currentContainerSelector);

                             if (data?.results && resultsContainer) {
                                if(data.results.length > 0){
                                     if (isH) {
                                         App.renderHorizontalCards(data.results.slice(0, 20), resultsContainer, currentConfig.type || null, currentConfig.show_trailer_button || false);
                                          // --- Setup horizontal scroll ---
                                          const scrollWrapper = currentSectionDiv.querySelector('.horizontal-scroll-wrapper');
                                          const prevBtn = scrollWrapper?.querySelector('.h-scroll-btn.prev');
                                          const nextBtn = scrollWrapper?.querySelector('.h-scroll-btn.next');
                                          if (resultsContainer && prevBtn && nextBtn) {
                                              if (!State.horizontalScrollContainers.some(c => c.container === resultsContainer)) {
                                                   State.horizontalScrollContainers.push({ container: resultsContainer, prevBtn, nextBtn });
                                                   resultsContainer.addEventListener('scroll', Utils.debounce(() => App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn), 100), { passive: true });
                                                   prevBtn.addEventListener('click', () => App.handleHScrollPrev(resultsContainer));
                                                   nextBtn.addEventListener('click', () => App.handleHScrollNext(resultsContainer));
                                              }
                                              App.updateHScrollButtons(resultsContainer, prevBtn, nextBtn); // Update buttons immediately
                                          }
                                          // -----------------------------
                                     } else { // Vertical
                                         App.renderTmdbCards(data.results.slice(0, 12), resultsContainer, currentConfig.type || null, false);
                                     }
                                 } else { // No API results
                                      console.log(`[Home Sections][Async Load] No results for "${currentConfig.title}".`);
                                      if(resultsContainer) resultsContainer.innerHTML = '<p class="text-muted px-3 col-12">No content found.</p>';
                                      if(isH){ App.updateHScrollButtons(resultsContainer, currentSectionDiv.querySelector('.prev'), currentSectionDiv.querySelector('.next'));}
                                 }
                             } else { // API Error or invalid data
                                throw new Error(`Invalid data received for "${currentConfig.title}".`);
                            }
                         } catch (error) {
                             console.error(`[Home Sections][Async Load] Error loading "${currentConfig.title}":`, error);
                             const resultsContainer = currentSectionDiv.querySelector(currentContainerSelector);
                             if (resultsContainer) resultsContainer.innerHTML = Utils.getErrorHTML(`Could not load "${currentConfig.title}".`);
                             if(isH){ App.updateHScrollButtons(resultsContainer, currentSectionDiv.querySelector('.prev'), currentSectionDiv.querySelector('.next'));} // Update buttons on error too
                         }
                    })(sectionDiv, sectionConfig, containerSelector, isHorizontal); // Pass current context to IIFE
                 } // End standard endpoint handler

            } // End if (sectionDiv is valid)

        } // End for loop

        console.log("[Home Sections] Finished setting up all section structures and initiated async loads.");
    }, 
   
             
    loadMostViewedSection: async (sectionDiv, sectionConfig) => {
        const container = sectionDiv.querySelector('.most-viewed-container');
        if (!container) { /* ... handle missing container error ... */ return; }
        const isHorizontal = container.classList.contains('horizontal-card-container');
        const maxItems = sectionConfig.max_items || (isHorizontal ? 15 : 12);
        const skeletonCount = isHorizontal ? 5 : 6;

        console.log('[Most Viewed Load] Loading global most viewed items from Firestore...');
        // Skeletons should have already been added by loadHomeSections

        if (!db) { // Check if Firestore is initialized
            container.innerHTML = Utils.getErrorHTML("Database service unavailable.");
            if (isHorizontal) App.updateHScrollButtons(container, sectionDiv.querySelector('.prev'), sectionDiv.querySelector('.next'));
            return;
        }

        try {
            // --- Query Firestore ---
            const querySnapshot = await db.collection("viewCounts")
                .orderBy("viewCount", "desc") // Order by count
                .limit(maxItems) // Limit to top N
                .get();
            // ---------------------

            if (querySnapshot.empty) {
                console.log('[Most Viewed Load] No view data found in Firestore.');
                container.innerHTML = `<p class="text-muted px-3 col-12">Be the first to watch something popular!</p>`;
                 if(isHorizontal){ App.updateHScrollButtons(container, sectionDiv.querySelector('.prev'), sectionDiv.querySelector('.next'));}
                return;
            }

            // Extract data needed for TMDB lookup
            const topItemsData = querySnapshot.docs.map(doc => ({
                id: doc.data().tmdbId, // Assumes you store 'tmdbId' field
                type: doc.data().type,   // Assumes you store 'type' field
                count: doc.data().viewCount // Get the count
            }));

             console.log('[Most Viewed Load] Fetched top items from Firestore:', topItemsData);


            // --- Fetch TMDB Details for these items (Similar to before) ---
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
            // -----------------------------------------------------------

            // Combine TMDB details with view counts (Optional, if displaying count)
             const itemsToRender = detailedItems.map(item => {
                  const type = item.title ? 'movie' : 'tv';
                  // Find the original view data to get the count back
                  const originalViewData = topItemsData.find(v => v.id === item.id && v.type === type);
                  return {
                       ...item,
                       media_type: type,
                       viewCount: originalViewData ? originalViewData.count : '?', // Add count back
                   };
              });

            // --- Render using appropriate function (replace skeletons) ---
             console.log(`[Most Viewed Load] Rendering ${itemsToRender.length} items.`);
             if (isHorizontal) {
                 App.renderHorizontalCards(itemsToRender, container, null, false);
                 // Setup scroll for THIS specific section
                 const scrollWrapper = sectionDiv.querySelector('.horizontal-scroll-wrapper');
                 const prevBtn = scrollWrapper?.querySelector('.h-scroll-btn.prev');
                 const nextBtn = scrollWrapper?.querySelector('.h-scroll-btn.next');
                 if (container && prevBtn && nextBtn) {
                      if (!State.horizontalScrollContainers.some(c => c.container === container)) {
                          State.horizontalScrollContainers.push({ container, prevBtn, nextBtn });
                          container.addEventListener('scroll', Utils.debounce(() => App.updateHScrollButtons(container, prevBtn, nextBtn), 100), { passive: true });
                          prevBtn.addEventListener('click', () => App.handleHScrollPrev(container));
                          nextBtn.addEventListener('click', () => App.handleHScrollNext(container));
                      }
                      App.updateHScrollButtons(container, prevBtn, nextBtn);
                  }
             } else {
                 App.renderTmdbCards(itemsToRender, container, null, false);
                 // If you want to show counts on vertical cards, add logic here
             }
            // --------------------------------------------------------------

        } catch (error) {
            console.error("[Most Viewed Load] Error fetching or processing items:", error);
            container.innerHTML = Utils.getErrorHTML(`Could not display popular items: ${error.message}`);
            if(isHorizontal){ App.updateHScrollButtons(container, sectionDiv.querySelector('.prev'), sectionDiv.querySelector('.next'));}
        }
    }, 
              // --- NEW: Function to specifically load and render Continue Watching ---
              loadContinueWatchingSection: (sectionDiv) => {
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
                             ${ /* Progress Bar */ ''}
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

             }, 

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
                // *** Show Skeleton ***
                DOM.detailsWrapper.innerHTML = Utils.getSkeletonDetailsHTML();
 
                try {
                     const itemData = await API.fetchTMDB(`/${type}/${id}`, {
                     append_to_response: 'credits,similar,videos,watch/providers'
                 });

                if (itemData && db) { // Check if data loaded and db is available
                    // Pass title for potential storage in Firestore doc
                    const title = itemData.title || itemData.name || 'Unknown Title';
                    App.recordGlobalView(type, id, title); // Call the global tracking function
                }
              

            } catch (error) {
                console.error(`Failed to load details for ${type} ${id}:`, error);
                DOM.detailsWrapper.innerHTML = Utils.getErrorHTML(`Failed to load details: ${error.message}`); // Replace skeleton with error
            }
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

             State.moviePlayerContext = { itemId: id, itemType: type, currentSeason: season, currentEpisode: episode }; // Store context

             try {
                 const itemData = await API.fetchTMDB(`/${type}/${id}`);
                 if (!itemData) throw new Error("Media item not found.");

                 const title = Utils.escapeHtml(itemData.title || itemData.name || 'Media Item');
                 DOM.playerTitleEl.textContent = title;


                 // Render source buttons (always show these)
                 App.renderStreamingSourceButtons();

                 // If TV show, render episode selectors
                 if (type === 'tv') {
                     const seasonData = await API.fetchTMDB(`/tv/${id}/season/${season || 1}`); // Fetch first season by default or specified one
                     if (!seasonData || !seasonData.episodes) throw new Error("Season data not found.");
                     App.renderEpisodeSelectors(itemData, seasonData);
                     Utils.setElementVisibility(DOM.playerEpisodeSelectorContainer, true);
                 } else {
                     // For movies, directly set the source for the first button (if available)
                     const firstButton = DOM.playerSourceBtnsContainer.querySelector('button');
                     if (firstButton) {
                         App.setStreamingSource(firstButton.dataset.sourceIndex);
                     } else {
                          DOM.playerIframePlaceholder.innerHTML = `<span class="text-muted">No streaming sources available.</span>`;
                     }
                 }

             } catch (error) {
                 console.error("Failed to load player context:", error);
                 DOM.playerTitleEl.textContent = 'Error Loading Player';
                 DOM.playerIframePlaceholder.innerHTML = Utils.getErrorHTML(`Error: ${error.message}`);
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
                     const bodyHtml = `<div class="card-body d-flex flex-column flex-grow-1 p-3"> <h3 class="card-title fs-6 fw-medium mb-2">${title}</h3> ${rating && parseFloat(rating) > 0 ? `<span class="card-rating mt-auto"><i class="bi bi-star-fill me-1"></i>${rating}</span>` : '<span class="card-rating text-muted small mt-auto">NR</span>'} </div>`;


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
                         <h1 class="hero-title">${title}</h1>
                         <div class="hero-meta mb-3">
                             ${rating && parseFloat(rating) > 0 ? `<span class="rating me-3 d-flex align-items-center"><i class="bi bi-star-fill me-1"></i> ${rating}/10</span>` : ''}
                             ${year ? `<span class="me-3 d-flex align-items-center"><i class="bi bi-calendar3 me-1"></i> ${year}</span>` : ''}
                             ${runtime ? `<span class="me-3 d-flex align-items-center"><i class="bi bi-clock me-1"></i> ${runtime}</span>` : ''}
                             ${seasons ? `<span class="me-3 d-flex align-items-center"><i class="bi bi-collection-play me-1"></i> ${seasons} Season${seasons > 1 ? 's' : ''}</span>` : ''}

                         </div>
                         <p class="hero-description lead">${overview.length > 250 ? overview.substring(0, 250) + '...' : overview}</p>
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

            // Renders episodes into a specific season pane
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
                             <img src="${stillUrl}" alt="${epTitle} Still" loading="lazy" style="width: 100%; max-width: 240px; border-radius: var(--radius-md);">
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

             recordGlobalView: async (type, id) => {
                const db = firebase.firestore();
                if (!db) { // Check if Firestore is initialized
                   console.warn("Firestore not available, cannot record global view.");
                    return;
                 }
             if (!type || !id) return;

            const docId = `${type}-${id}`; // e.g., "movie-12345"
            const viewDocRef = db.collection("viewCounts").doc(docId);

             console.log(`[Global Views] Incrementing count for ${docId}...`);

            try {
                // Use a transaction or batched write for potential future enhancements,
                // but FieldValue.increment is atomic and usually sufficient for a counter.
                 await viewDocRef.set({
                    // Use set with merge:true to create the document if it doesn't exist
                    // or update it if it does.
                    type: type,
                    tmdbId: parseInt(id),
                    title: title, // Assuming title is available in the context
                    viewCount: firebase.firestore.FieldValue.increment(1), // Atomically increments
                    lastViewed: firebase.firestore.FieldValue.serverTimestamp() // Track last view time
                }, { merge: true }); // Merge ensures we don't overwrite type/id if doc exists

                console.log(`[Global Views] Successfully recorded view for ${docId}`);
                } catch (error) {
                     console.error(`[Global Views] Error recording view for ${docId}:`, error);
                    // Optionally retry or log this error to a monitoring service in production
                }
            },

             // Sets the iframe source based on selected provider and context
             setStreamingSource: (sourceIndex) => {
                 const provider = config.STREAMING_PROVIDERS[sourceIndex];
                 const { itemId, itemType, currentSeason, currentEpisode } = State.moviePlayerContext;

                 if (!provider || !itemId || !itemType || !DOM.playerIframe || !DOM.playerIframePlaceholder) return;
                 App.recordGlobalView(itemType, itemId);
                try {
                    let episodeIdentifier = null;
                    if (itemType === 'tv' && currentSeason && currentEpisode) {
                       episodeIdentifier = `s${currentSeason}-e${currentEpisode}`;
                    }
                    // Record the view *when a source is successfully selected/loaded*
                    ViewTracker.recordView(itemType, itemId, episodeIdentifier);
                } catch (e) {
                    console.error("Error during view tracking:", e);
                }
                 const url = provider.urlFormat(itemId, itemType, currentSeason, currentEpisode);

                 if (url && DOM.playerIframe) {
                     DOM.playerIframe.src = url;
                     Utils.setElementVisibility(DOM.playerIframe, true);
                     Utils.setElementVisibility(DOM.playerIframePlaceholder, false);
                 } else {
                     console.warn("Could not generate URL for provider:", provider.name);
                     Utils.showToast(`Could not load source: ${provider.name}`, 'warning');
                     DOM.playerIframe.src = 'about:blank';
                     Utils.setElementVisibility(DOM.playerIframe, false);
                     Utils.setElementVisibility(DOM.playerIframePlaceholder, true);
                     DOM.playerIframePlaceholder.innerHTML = `<span class="text-muted">Failed to load source: ${provider.name}</span>`;
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
        document.addEventListener('DOMContentLoaded', App.init);
