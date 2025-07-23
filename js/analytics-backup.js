const ChartColors = {
    // Function to get CSS variable value
    getCssVar: (varName) => getComputedStyle(document.documentElement).getPropertyValue(varName).trim(),

    // Define chart colors dynamically using CSS variables
    get primary() { return this.getCssVar('--primary-accent'); },
    get secondary() { return this.getCssVar('--secondary-accent'); },
    get tertiary() { return this.getCssVar('--tertiary-accent'); },
    get textMedium() { return this.getCssVar('--text-medium'); },
    get textLight() { return this.getCssVar('--text-light'); },
    get surface() { return this.getCssVar('--surface-color'); },
    get border() { return this.getCssVar('--border-color'); },

    // Predefined palette derived from CSS vars for charts
    get palette() {
        const colors = [
           this.primary,
           this.secondary,
           this.tertiary,
           '#3b82f6', // Blue
           '#10b981', // Emerald
           '#f59e0b', // Amber
           '#8b5cf6', // Violet
       ];
       // Ensure all palette colors are full hex or RGB strings from getCssVar
       // Or you can make a version of transparent that takes direct values
       return colors; // No change here, but the transparent method needs to handle these.
    },
    // Function to get semi-transparent colors
   transparent: (color, alpha = 0.2) => {
    if (!color) return `rgba(0,0,0,${alpha})`; // Fallback

    // Create a temporary element to let the browser parse the color
    const tempDiv = document.createElement('div');
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    const computedColor = getComputedStyle(tempDiv).color; // This will be in rgb(a) format
    tempDiv.remove();

    const rgbaMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
        // Use the original RGB values and apply the new alpha
        return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${alpha})`;
    }
    return `rgba(0,0,0,${alpha})`; // Fallback if color parsing fails
}
};

        // --- NEW: Favorites Module ---
        const Favorites = {
    _list: [], // In-memory cache for performance

    /**
     * Loads the user's favorites from Firestore into the local cache.
     * Should be called on user login.
     */
    load: async () => {
        if (!appAuth?.currentUser || !appDb) {
            console.warn("[Favorites] Cannot load from Firestore: User not logged in or DB not ready.");
            Favorites._list = []; // Ensure list is empty if not logged in
            return;
        }
        const userId = appAuth.currentUser.uid;
        console.log(`[Favorites] Loading for user: ${userId}`);
        try {
            const snapshot = await appDb.collection("users").doc(userId).collection("favorites").orderBy("dateAdded", "desc").get();
            Favorites._list = snapshot.docs.map(doc => ({ fbId: doc.id, ...doc.data() }));
            console.log(`[Favorites] Loaded ${Favorites._list.length} items from Firestore.`);
        } catch (error) {
            console.error("Error loading favorites from Firestore:", error);
            Favorites._list = [];
            Utils.showToast("Could not load your favorites.", "danger");
        }
    },

    /**
     * Adds an item to favorites in Firestore and the local cache.
     * @param {object} itemData - Must contain id, type, title, etc.
     * @returns {Promise<boolean>}
     */
    add: async (itemData) => {
        if (!appAuth?.currentUser || !appDb) {
            Utils.showToast("You must be logged in to add favorites.", "warning");
            return false;
        }
        if (!itemData || !itemData.id || !itemData.type) return false;

        const userId = appAuth.currentUser.uid;
        const itemId = parseInt(itemData.id);
        const docId = `${itemData.type}-${itemId}`; // Create a unique document ID like "movie-123"

        if (Favorites.isFavorite(itemId, itemData.type)) return true; // Already exists

        const favoriteItem = {
            id: itemId,
            type: itemData.type,
            title: itemData.title || 'Unknown Title',
            poster_path: itemData.poster_path || null,
            vote_average: itemData.vote_average || null,
            genre_ids: Array.isArray(itemData.genre_ids) ? itemData.genre_ids : [],
            dateAdded: firebase.firestore.FieldValue.serverTimestamp() // Use server time
        };

        try {
            await appDb.collection("users").doc(userId).collection("favorites").doc(docId).set(favoriteItem);
            // Add to local cache immediately for UI responsiveness (with a placeholder date)
            Favorites._list.unshift({ ...favoriteItem, dateAdded: Date.now() });
            Utils.showToast(`${favoriteItem.title} added to favorites!`, "success");
            return true;
        } catch (error) {
            console.error("Error adding favorite to Firestore:", error);
            Utils.showToast("Failed to add favorite.", "danger");
            return false;
        }
    },

    /**
     * Removes an item from favorites in Firestore and the local cache.
     * @param {number} id
     * @param {string} type
     * @returns {Promise<boolean>}
     */
    remove: async (id, type) => {
        if (!appAuth?.currentUser || !appDb) {
            Utils.showToast("You must be logged in to remove favorites.", "warning");
            return false;
        }
        const userId = appAuth.currentUser.uid;
        const itemId = parseInt(id);
        const docId = `${type}-${itemId}`;

        try {
            await appDb.collection("users").doc(userId).collection("favorites").doc(docId).delete();
            // Remove from local cache
            const initialLength = Favorites._list.length;
            Favorites._list = Favorites._list.filter(item => !(item.id === itemId && item.type === type));
            if (Favorites._list.length < initialLength) {
                Utils.showToast("Removed from favorites.", "info");
                return true;
            }
        } catch (error) {
            console.error("Error removing favorite from Firestore:", error);
            Utils.showToast("Failed to remove favorite.", "danger");
            return false;
        }
        return false;
    },

    // (isFavorite and getFavorites methods remain the same, they use the local cache)
    isFavorite: (id, type) => {
        const itemId = parseInt(id);
        return Favorites._list.some(item => item.id === itemId && item.type === type);
    },

    getFavorites: () => {
        return Favorites._list;
    },

    // New method to clear local cache on logout
    clear: () => {
        Favorites._list = [];
        console.log("[Favorites] Local cache cleared on logout.");
    }
};

/*const Favorites = {
    STORAGE_KEY: 'auraStreamFavorites',
    _list: [], // Internal cache

    // Load favorites from localStorage into internal cache
    load: () => {
        try {
            const storedList = localStorage.getItem(Favorites.STORAGE_KEY);
            Favorites._list = storedList ? JSON.parse(storedList) : [];
            console.log("Favorites loaded:", Favorites._list.length, "items");
        } catch (error) {
            console.error("Failed to load favorites from localStorage:", error);
            Favorites._list = [];
            localStorage.removeItem(Favorites.STORAGE_KEY); // Clear corrupted data
        }
    },

    // Save internal cache to localStorage
    save: () => {
        try {
            localStorage.setItem(Favorites.STORAGE_KEY, JSON.stringify(Favorites._list));
        } catch (error) {
            console.error("Failed to save favorites to localStorage:", error);
            Utils.showToast("Error saving favorites.", "danger");
        }
    },

    // Add an item to favorites
    // itemData needs: id, type, title, poster_path, genre_ids (array)
    add: (itemData) => {
        if (!itemData || !itemData.id || !itemData.type) {
             console.warn("Attempted to add invalid favorite item:", itemData);
             return false;
        }
        const itemId = parseInt(itemData.id);
        if (Favorites.isFavorite(itemId, itemData.type)) {
            console.log("Item already in favorites:", itemId);
            return true; // Already exists
        }

        // Ensure genre_ids is an array
        const genreIds = Array.isArray(itemData.genre_ids) ? itemData.genre_ids : [];

        const favoriteItem = {
            id: itemId,
            type: itemData.type,
            title: itemData.title || 'Unknown Title',
            poster_path: itemData.poster_path || null,
            vote_average: itemData.vote_average || null,
            genre_ids: genreIds, // Store genre IDs for analytics
            dateAdded: Date.now() // Track when added
        };

        Favorites._list.push(favoriteItem);
        Favorites.save();
        console.log("Added to favorites:", favoriteItem.title);
        Utils.showToast(`${favoriteItem.title} added to favorites!`, "success", "bi-heart-fill text-danger"); // Success with heart
        return true; // Indicate addition
    },

    // Remove an item from favorites by id and type
    remove: (id, type) => {
        const itemId = parseInt(id);
        const initialLength = Favorites._list.length;
        Favorites._list = Favorites._list.filter(item =>
            !(item.id === itemId && item.type === type)
        );

        if (Favorites._list.length < initialLength) {
            Favorites.save();
            console.log("Removed item from favorites:", id, type);
            Utils.showToast("Removed from favorites.", "info", "bi-heartbreak-fill text-muted"); // Info with broken heart
            return true; // Indicate removal
        }
        return false; // Item not found
    },

    // Check if an item is in the current favorites list
    isFavorite: (id, type) => {
        const itemId = parseInt(id); // Ensure comparison uses numbers
        return Favorites._list.some(item => item.id === itemId && item.type === type);
    },

    // Get the current list of favorites
    getFavorites: () => {
        return Favorites._list;
    }
};*/


        // --- NEW: Analytics Module ---
const Analytics = {
    chartInstances: {}, // Store chart instances for updates/destruction
    dom: { // Cache DOM elements for analytics view
        // Main content area for analytics
        content: document.getElementById('analytics-content'),
        totalCount: null,
        movieCount: null,
        tvCount: null,
        averageRating: null, // <<< NEW
        genreChartCanvas: null,
        typeChartCanvas: null,
        ratingDistChartCanvas: null, // <<< NEW
        timelineChartCanvas: null,   // <<< NEW
        recentFavoritesList: null,   // <<< NEW
        // Containers for empty messages
        genreChartContainer: null,
        typeChartContainer: null,
        ratingDistChartContainer: null,
        timelineChartContainer: null,
    },

    // Calculates analytics data from the Favorites list
    calculateAnalytics: () => {
        const favorites = Favorites.getFavorites();
        const stats = {
            total: favorites.length,
            movieCount: 0,
            tvCount: 0,
            genreCounts: {},
            genreIdCounts: {},
            // --- NEW STATS ---
            ratingSum: 0,
            ratingValidCount: 0, // Count items with valid rating > 0
            ratingDistribution: {
                "8-10": 0, "6-8": 0, "4-6": 0, "2-4": 0, "0-2": 0, "NR": 0
            },
            addedTimeline: {} // { "YYYY-MM": count }
        };

        // Pre-populate genreCounts with known genres to ensure all appear if needed
        State.allMovieGenres.forEach(g => stats.genreCounts[g.name] = 0);
        State.allTvGenres.forEach(g => { if (!stats.genreCounts[g.name]) stats.genreCounts[g.name] = 0; });

        favorites.forEach(item => {
            // Type Count
            if (item.type === 'movie') stats.movieCount++;
            else if (item.type === 'tv') stats.tvCount++;


            // Count Genres
            item.genre_ids?.forEach(genreId => {
                const genreName = Utils.findGenreName(item.type, genreId);
                if (genreName && genreName !== 'Unknown') {
                    stats.genreCounts[genreName] = (stats.genreCounts[genreName] || 0) + 1;
                }
                stats.genreIdCounts[genreId] = (stats.genreIdCounts[genreId] || 0) + 1;
            });

               // --- NEW: Rating Calculation ---
               const rating = item.vote_average;
               if (rating !== null && rating !== undefined && rating > 0) { // Only count valid, positive ratings
                   stats.ratingSum += rating;
                   stats.ratingValidCount++;
                   // Rating Distribution
                   if (rating >= 8) stats.ratingDistribution["8-10"]++;
                   else if (rating >= 6) stats.ratingDistribution["6-8"]++;
                   else if (rating >= 4) stats.ratingDistribution["4-6"]++;
                   else if (rating >= 2) stats.ratingDistribution["2-4"]++;
                   else stats.ratingDistribution["0-2"]++;
               } else {
                   stats.ratingDistribution["NR"]++; // Count Not Rated
               }
   
               // --- NEW: Timeline Calculation ---
               if (item.dateAdded) {
                   try {
                       const addedDate = new Date(item.dateAdded);
                       const monthKey = `${addedDate.getFullYear()}-${(addedDate.getMonth() + 1).toString().padStart(2, '0')}`; // Format YYYY-MM
                       stats.addedTimeline[monthKey] = (stats.addedTimeline[monthKey] || 0) + 1;
                   } catch (e) {
                        console.warn("Could not parse dateAdded for timeline:", item.dateAdded, e);
                   }
               }
  

            // Optional: Count Ratings (Requires storing vote_average)
            // const rating = item.vote_average;
            // if (rating) {
            //     const range = rating >= 8 ? '8-10' : rating >= 6 ? '6-8' : rating >= 4 ? '4-6' : rating >= 2 ? '2-4' : '0-2';
            //     stats.ratingCounts[range] = (stats.ratingCounts[range] || 0) + 1;
            // }

            // Optional: Count Added Timeline
            // const addedDate = new Date(item.dateAdded);
            // const monthKey = `${addedDate.getFullYear()}-${(addedDate.getMonth() + 1).toString().padStart(2, '0')}`;
            // stats.addedTimeline[monthKey] = (stats.addedTimeline[monthKey] || 0) + 1;
        });

        // Filter out genres with 0 count
        // Calculate Average Rating
        stats.averageRating = stats.ratingValidCount > 0 ? (stats.ratingSum / stats.ratingValidCount) : 0;

        // Filter zero-count genres
        const filteredGenreCounts = {};
        for (const genre in stats.genreCounts) {
            if (stats.genreCounts[genre] > 0) {
                filteredGenreCounts[genre] = stats.genreCounts[genre];
            }
        }
        stats.genreCounts = filteredGenreCounts;


        console.log("Calculated Analytics:", stats);
        return stats;
    },

    // Updates the entire Analytics view (stats and charts)
    updateAnalyticsDisplay: () => {
        if (!Analytics.dom.content) return;

        const stats = Analytics.calculateAnalytics();
        const hasFavorites = stats.total > 0;

        // Render layout if needed (or if switching from empty to non-empty state)
        const needsLayoutRender = !Analytics.dom.totalCount || Analytics.dom.content.innerHTML.includes('spinner') ||
                                (!document.getElementById('genreChart') && hasFavorites); // Check if chart canvas is missing when it shouldn't be

        if (needsLayoutRender) {
            Analytics.renderAnalyticsLayout(stats); // Render layout first
        }

        // Update Stat Cards
        if (Analytics.dom.totalCount) Analytics.dom.totalCount.textContent = stats.total;
        if (Analytics.dom.movieCount) Analytics.dom.movieCount.textContent = stats.movieCount;
        if (Analytics.dom.tvCount) Analytics.dom.tvCount.textContent = stats.tvCount;
        if (Analytics.dom.averageRating) Analytics.dom.averageRating.textContent = stats.averageRating.toFixed(1); // Format avg rating

        // Update Charts and Recent List
        if (hasFavorites) {
            // Ensure canvas elements are selected again after layout render if it happened
            Analytics.dom.genreChartCanvas = document.getElementById('genreChart');
            Analytics.dom.typeChartCanvas = document.getElementById('typeChart');
            Analytics.dom.ratingDistChartCanvas = document.getElementById('ratingDistChart');
            Analytics.dom.timelineChartCanvas = document.getElementById('timelineChart');
            Analytics.dom.recentFavoritesList = document.getElementById('recent-favorites-list');

            // Get container elements too for empty messages
            Analytics.dom.genreChartContainer = document.getElementById('genreChartContainer');
            Analytics.dom.typeChartContainer = document.getElementById('typeChartContainer');
            Analytics.dom.ratingDistChartContainer = document.getElementById('ratingDistChartContainer');
            Analytics.dom.timelineChartContainer = document.getElementById('timelineChartContainer');


            Analytics.renderGenreChart(stats.genreCounts);
            Analytics.renderTypeChart(stats.movieCount, stats.tvCount);
            Analytics.renderRatingDistributionChart(stats.ratingDistribution); // <<< NEW
            Analytics.renderTimelineChart(stats.addedTimeline);           // <<< NEW
            Analytics.renderRecentFavoritesList(Favorites.getFavorites()); // <<< NEW

        } else {
            // Clear charts and lists if no favorites
            Analytics.destroyChart('genreChart');
            Analytics.destroyChart('typeChart');
            Analytics.destroyChart('ratingDistChart'); // <<< NEW
            Analytics.destroyChart('timelineChart');   // <<< NEW

             // Show empty messages in chart containers
             const emptyChartMsg = '<p class="text-center text-muted mt-5 pt-4 small">Favorite items to see stats!</p>';
             if(Analytics.dom.genreChartContainer) Analytics.dom.genreChartContainer.innerHTML = `<h3 class="chart-title">Favorite Genres Distribution</h3>${emptyChartMsg}`;
             if(Analytics.dom.typeChartContainer) Analytics.dom.typeChartContainer.innerHTML = `<h3 class="chart-title">Movies vs. TV Shows</h3>${emptyChartMsg}`;
             if(Analytics.dom.ratingDistChartContainer) Analytics.dom.ratingDistChartContainer.innerHTML = `<h3 class="chart-title">Rating Distribution</h3>${emptyChartMsg}`;
             if(Analytics.dom.timelineChartContainer) Analytics.dom.timelineChartContainer.innerHTML = `<h3 class="chart-title">Favorites Added Over Time</h3>${emptyChartMsg}`;

            if(Analytics.dom.recentFavoritesList) Analytics.dom.recentFavoritesList.innerHTML = '<div class="col-12"><p class="text-muted">Favorite items to see them here!</p></div>';
        }
    },

    // Renders the basic layout for the Analytics page
    renderAnalyticsLayout: (initialStats) => {
        if (!Analytics.dom.content) return;
        const hasFavorites = initialStats.total > 0;

        // Stat Card Skeletons (4 cards)
        let statSkeletons = '';
        for(let i=0; i<4; i++) {
           statSkeletons += `<div class="col-md-6 col-lg-3"><div class="stat-card skeleton-card"><div class="skeleton skeleton-icon"></div><div class="skeleton skeleton-value"></div><div class="skeleton skeleton-label"></div></div></div>`;
        }
        // Chart Skeletons (4 charts)
         let chartSkeletons = '';
        for(let i=0; i<4; i++) {
           chartSkeletons += `<div class="col-lg-6"><div class="chart-container skeleton-chart"><div class="spinner-border text-primary"></div></div></div>`;
        }


        Analytics.dom.content.innerHTML = `
            <!-- Stat Cards Row -->
            <div class="row mb-4 g-4" id="stat-card-row">
                ${statSkeletons}
            </div>

            <!-- Charts Rows (Combined for Skeleton) -->
            <div class="row g-4 g-lg-5" id="chart-rows-container">
                ${chartSkeletons}
            </div>

            <!-- Recently Added Section (Skeleton or Empty Message) -->
            <div class="col-12 mt-4">
                <h3 class="mb-3 text-white">Recently Added Favorites</h3>
                <div id="recent-favorites-list" class="row g-3 row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6">
                    ${!hasFavorites ? '<div class="col-12"><p class="text-muted">Favorite items to see them here!</p></div>' : Utils.getSkeletonCardHTML(6)} {/* Skeleton for recent */}
                </div>
            </div>
        `;

        // --- Render Actual Stat Cards (replace skeletons) ---
        const statCardRow = document.getElementById('stat-card-row');
        if(statCardRow) {
            statCardRow.innerHTML = `
               <div class="col-md-6 col-lg-3"><div class="stat-card"><i class="bi bi-heart-fill stat-icon" style="color: var(--tertiary-accent);"></i><div id="total-favorites" class="stat-value">${initialStats.total}</div><div class="stat-label">Total Favorites</div></div></div>
               <div class="col-md-6 col-lg-3"><div class="stat-card"><i class="bi bi-film stat-icon" style="color: var(--secondary-accent);"></i><div id="movie-favorites" class="stat-value">${initialStats.movieCount}</div><div class="stat-label">Favorite Movies</div></div></div>
               <div class="col-md-6 col-lg-3"><div class="stat-card"><i class="bi bi-tv-fill stat-icon" style="color: var(--primary-accent);"></i><div id="tv-favorites" class="stat-value">${initialStats.tvCount}</div><div class="stat-label">Favorite TV Shows</div></div></div>
               <div class="col-md-6 col-lg-3"><div class="stat-card"><i class="bi bi-star-half stat-icon" style="color: #f59e0b;"></i><div id="average-rating" class="stat-value">${initialStats.averageRating.toFixed(1)}</div><div class="stat-label">Avg. Favorite Rating</div></div></div>
            `;
             // Cache new elements after rendering
            Analytics.dom.totalCount = document.getElementById('total-favorites');
            Analytics.dom.movieCount = document.getElementById('movie-favorites');
            Analytics.dom.tvCount = document.getElementById('tv-favorites');
            Analytics.dom.averageRating = document.getElementById('average-rating');
        }

        // --- Render Actual Chart Containers (replace skeletons) ---
        const chartRowsContainer = document.getElementById('chart-rows-container');
        if (chartRowsContainer) {
           if (hasFavorites) {
                chartRowsContainer.innerHTML = `
                    <div class="col-lg-7"> <div class="chart-container" id="genreChartContainer"> <h3 class="chart-title">Favorite Genres Distribution</h3> <canvas id="genreChart"></canvas> </div> </div>
                    <div class="col-lg-5"> <div class="chart-container" id="typeChartContainer"> <h3 class="chart-title">Movies vs. TV Shows</h3> <canvas id="typeChart"></canvas> </div> </div>
                    <div class="col-lg-7"> <div class="chart-container" id="timelineChartContainer"> <h3 class="chart-title">Favorites Added Over Time</h3> <canvas id="timelineChart"></canvas> </div> </div>
                    <div class="col-lg-5"> <div class="chart-container" id="ratingDistChartContainer"> <h3 class="chart-title">Rating Distribution</h3> <canvas id="ratingDistChart"></canvas> </div> </div>
                `;
                // Cache canvas elements
                Analytics.dom.genreChartCanvas = document.getElementById('genreChart');
                Analytics.dom.typeChartCanvas = document.getElementById('typeChart');
                Analytics.dom.ratingDistChartCanvas = document.getElementById('ratingDistChart');
                Analytics.dom.timelineChartCanvas = document.getElementById('timelineChart');
                Analytics.dom.genreChartContainer = document.getElementById('genreChartContainer');
                Analytics.dom.typeChartContainer = document.getElementById('typeChartContainer');
                Analytics.dom.ratingDistChartContainer = document.getElementById('ratingDistChartContainer');
                Analytics.dom.timelineChartContainer = document.getElementById('timelineChartContainer');
           } else {
                // Show single empty message if no favorites
                chartRowsContainer.innerHTML = `
                    <div class="col-12 text-center py-5 mt-4">
                         <i class="bi bi-bar-chart-line-fill display-1 text-muted mb-3"></i>
                         <h4 class="text-white">No Favorites Yet</h4>
                         <p class="text-muted">Like some movies or TV shows to see your personalized analytics!</p>
                     </div>`;
           }
        }
       // Cache recent list container
       Analytics.dom.recentFavoritesList = document.getElementById('recent-favorites-list');
    },

    // Renders or updates the Genre Distribution Chart
    renderGenreChart: (genreCounts) => {
        if (!Analytics.dom.genreChartCanvas) return;
        const ctx = Analytics.dom.genreChartCanvas.getContext('2d');
        if (!ctx) return;

        // Sort genres by count desc, take top N (e.g., 10)
        const sortedGenres = Object.entries(genreCounts)
                                .sort(([, countA], [, countB]) => countB - countA)
                                .slice(0, 10); // Limit to top 10 genres

        const labels = sortedGenres.map(([name]) => name);
        const data = sortedGenres.map(([, count]) => count);

        // Generate colors dynamically from palette
        const backgroundColors = labels.map((_, index) => ChartColors.palette[index % ChartColors.palette.length]);
        const borderColors = backgroundColors; // Use same color for border initially
        const hoverBackgroundColors = backgroundColors.map(color => ChartColors.transparent(color, 0.8)); // Slightly darker on hover

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Favorite Genres',
                data: data,
                backgroundColor: backgroundColors.map(color => ChartColors.transparent(color, 0.7)), // More transparency
                borderColor: borderColors,
                hoverBackgroundColor: hoverBackgroundColors,
                borderWidth: 1,
                hoverOffset: 8 // Pop out slice on hover
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // Or 'right'
                    labels: {
                        color: ChartColors.textMedium,
                        boxWidth: 15,
                        padding: 15,
                         font: { size: 13 }
                    }
                },
                tooltip: {
                    backgroundColor: ChartColors.transparent(ChartColors.surface, 0.9),
                    titleColor: ChartColors.textLight,
                    bodyColor: ChartColors.textLight,
                    borderColor: ChartColors.border,
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: ChartColors.getCssVar('--radius-sm'), // Use CSS var
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed !== null) {
                                label += context.parsed;
                                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                                const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                                label += ` (${percentage}%)`;
                            }
                            return label;
                        }
                    }
                }
            },
            animation: {
                 animateRotate: true,
                 animateScale: true,
                 duration: 800 // Faster animation
            },
            layout: { padding: 5 }
        };

        // Destroy previous chart if exists, then create new one
        Analytics.destroyChart('genreChart');
        Analytics.chartInstances.genreChart = new Chart(ctx, {
            type: 'doughnut', // 'pie' is also an option
            data: chartData,
            options: chartOptions
        });
    },

    // Renders or updates the Movie vs TV Chart
    renderTypeChart: (movieCount, tvCount) => {
        if (!Analytics.dom.typeChartCanvas) return;
        const ctx = Analytics.dom.typeChartCanvas.getContext('2d');
        if (!ctx) return;

        const labels = ['Movies', 'TV Shows'];
        const data = [movieCount, tvCount];
        const backgroundColors = [
            ChartColors.transparent(ChartColors.secondary, 0.7),
            ChartColors.transparent(ChartColors.primary, 0.7),
        ];
        const borderColors = [ChartColors.secondary, ChartColors.primary];
        const hoverBackgroundColors = [
             ChartColors.transparent(ChartColors.secondary, 0.9),
             ChartColors.transparent(ChartColors.primary, 0.9),
        ];

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Content Type',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                hoverBackgroundColor: hoverBackgroundColors,
                borderWidth: 1,
                hoverOffset: 8
            }]
        };

        const chartOptions = { // Reuse options from genre chart or customize
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                 legend: { display: false }, // Hide legend for simple pie
                 tooltip: { /* Reuse tooltip options from renderGenreChart */
                    backgroundColor: ChartColors.transparent(ChartColors.surface, 0.9),
                    titleColor: ChartColors.textLight,
                    bodyColor: ChartColors.textLight,
                    borderColor: ChartColors.border,
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: ChartColors.getCssVar('--radius-sm'), // Use CSS var+
                    callbacks: {
                        label: function(context) {
                            // context.label holds the slice name (e.g., "Movies", "Action")
                            // context.parsed is the data value (e.g., 10, 5)
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${value} (${percentage}%)`; // More direct and clear
                        }
                    }
                 }
             },
             animation: { animateRotate: true, animateScale: true, duration: 800 },
             layout: { padding: 5 }
        };

        Analytics.destroyChart('typeChart');
        Analytics.chartInstances.typeChart = new Chart(ctx, {
            type: 'pie', // Pie chart for simple comparison
            data: chartData,
            options: chartOptions
        });
    },

    renderRatingDistributionChart: (ratingDist) => {
        if (!Analytics.dom.ratingDistChartCanvas) return;
        const ctx = Analytics.dom.ratingDistChartCanvas.getContext('2d');
        if (!ctx) return;

        const labels = ["NR", "0-2", "2-4", "4-6", "6-8", "8-10"];
        const data = [
            ratingDist["NR"], ratingDist["0-2"], ratingDist["2-4"],
            ratingDist["4-6"], ratingDist["6-8"], ratingDist["8-10"]
        ];

        // Colors for rating scale (e.g., grey, red, orange, yellow, light green, green)
        const backgroundColors = [
            ChartColors.transparent(ChartColors.textMedium, 0.6), // NR
            ChartColors.transparent(ChartColors.tertiary, 0.6), // 0-2 (Reddish)
            ChartColors.transparent('#f59e0b', 0.6), // 2-4 (Amber)
            ChartColors.transparent('#eab308', 0.6), // 4-6 (Yellow)
            ChartColors.transparent('#84cc16', 0.6), // 6-8 (Lime)
            ChartColors.transparent('#22c55e', 0.6)  // 8-10 (Green)
        ];
        const borderColors = backgroundColors.map(c => c.replace(/[\d.]+\)$/, '1)'));
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Rating Distribution',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 4, // Slightly rounded bars
                 barThickness: 'flex', // Adjust bar thickness automatically
                 maxBarThickness: 40 // Max thickness
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Optional: Make it horizontal bar chart
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: ChartColors.textMedium, stepSize: 1 }, // Ensure integer steps
                    grid: { color: ChartColors.transparent(ChartColors.border, 0.3) }
                },
                y: {
                    ticks: { color: ChartColors.textMedium },
                    grid: { display: false } // Hide y-axis grid lines
                }
            },
            plugins: {
                legend: { display: false }, // No legend needed for single dataset bar
                tooltip: { /* Reuse tooltip options */
                     backgroundColor: ChartColors.transparent(ChartColors.surface, 0.9), titleColor: ChartColors.textLight, bodyColor: ChartColors.textLight, borderColor: ChartColors.border, borderWidth: 1, padding: 10, cornerRadius: 4,
                     callbacks: { label: (c) => ` ${c.parsed.x} items` } // Simple tooltip
                 }
            }
        };

        Analytics.destroyChart('ratingDistChart');
        Analytics.chartInstances.ratingDistChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    },

    renderTimelineChart: (timelineData) => {
        if (!Analytics.dom.timelineChartCanvas) return;
        const ctx = Analytics.dom.timelineChartCanvas.getContext('2d');
        if (!ctx) return;

        // Sort timeline keys (YYYY-MM) chronologically
        const sortedKeys = Object.keys(timelineData).sort();
        const labels = sortedKeys;
        const data = sortedKeys.map(key => timelineData[key]);

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Favorites Added',
                data: data,
                fill: true, // Fill area under line
                borderColor: ChartColors.primary,
                backgroundColor: ChartColors.transparent(ChartColors.primary, 0.2),
                tension: 0.3, // Smoother curve
                pointBackgroundColor: ChartColors.primary,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: ChartColors.textMedium, stepSize: 1 }, // Integer steps
                    grid: { color: ChartColors.transparent(ChartColors.border, 0.3) }
                },
                x: {
                    ticks: { color: ChartColors.textMedium },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: { /* Reuse tooltip options */
                     backgroundColor: ChartColors.transparent(ChartColors.surface, 0.9), titleColor: ChartColors.textLight, bodyColor: ChartColors.textLight, borderColor: ChartColors.border, borderWidth: 1, padding: 10, cornerRadius: 4,
                     callbacks: { label: (c) => ` Added: ${c.parsed.y}` } // Simple tooltip
                 }
            }
        };

        Analytics.destroyChart('timelineChart');
        Analytics.chartInstances.timelineChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    },

    // --- NEW: Render Recent Favorites List ---
    renderRecentFavoritesList: (favorites) => {
        if (!Analytics.dom.recentFavoritesList) return;

        // Sort by dateAdded descending, take top N (e.g., 6)
        const recentItems = [...favorites] // Create shallow copy to sort
                            .sort((a, b) => b.dateAdded - a.dateAdded)
                            .slice(0, 6);

        Analytics.dom.recentFavoritesList.innerHTML = ''; // Clear previous/skeleton

        if (recentItems.length === 0) {
            Analytics.dom.recentFavoritesList.innerHTML = '<div class="col-12"><p class="text-muted">Favorite items to see them here!</p></div>';
            return;
        }

        recentItems.forEach(item => {
            const title = Utils.escapeHtml(item.title);
            const posterUrl = item.poster_path ? `${config.IMAGE_BASE_URL}${item.poster_path}` : null;

            const colDiv = document.createElement('div');
            // Use Bootstrap columns defined in the parent row
             colDiv.className = 'col mb-3'; // Rely on parent row for column counts

            const link = document.createElement('a');
            link.href = `#details=${item.type}/${item.id}`;
            link.className = 'recent-favorite-item';
            link.title = title;

            const imgHtml = posterUrl
                ? `<img src="${posterUrl}" alt="${title}" loading="lazy">`
                : `<div class="card-img-placeholder d-flex align-items-center justify-content-center" style="aspect-ratio: 2/3;"><i class="bi bi-film fs-1"></i></div>`; // Placeholder with aspect ratio

            const titleHtml = `<div class="recent-favorite-title">${title}</div>`;

            link.innerHTML = imgHtml + titleHtml;
            colDiv.appendChild(link);
            Analytics.dom.recentFavoritesList.appendChild(colDiv);
        });
         App.initializeTooltips(Analytics.dom.recentFavoritesList); // Init tooltips for titles
    },

    // Utility to safely destroy a chart instance
    destroyChart: (chartId) => {
        const instance = Analytics.chartInstances[chartId];
        if (instance) {
            instance.destroy();
            delete Analytics.chartInstances[chartId];
            console.log(`Chart destroyed: ${chartId}`);
        }
    },

    // Initialization specific to Analytics (called by App.init)
    init: () => {
        console.log("Initializing Analytics module...");
        // Analytics display is updated by the Router when the view loads
        // or when a favorite is added/removed.
    }
};
