# AuraStream - Movie & TV Show Streaming Web Application

AuraStream is a feature-rich, client-side web application designed to provide a modern and engaging interface for discovering, tracking, and (conceptually) streaming movies and TV shows. It leverages the TMDB API for metadata, Firebase for user-specific data and global analytics, and integrates various third-party services for content embedding and additional features.

**Live Demo :** https://medelbou3.github.io/SM4movies.v2.0.0/

**Disclaimer:**
*This project is for educational and demonstration purposes. The streaming functionality relies on embedding content from third-party providers. Users are responsible for ensuring they comply with all applicable copyright laws and the terms of service of any third-party providers they access through AuraStream. The developers of AuraStream do not host any copyrighted video content and are not responsible for the content provided by third-party embed sources.*

## Features

*   **Dynamic Home Page:**
    *   Hero section with trending or popular content.
    *   "Continue Watching" list (localStorage).
    *   "Popular on AuraStream" (powered by Firestore global view counts).
    *   "Top Rated on AuraStream" (powered by Firestore user ratings).
    *   Multiple curated sections for trending, top-rated, popular movies & TV shows.
    *   Horizontal carousels for "Latest Trailers" and "New Releases."
    *   Browse by Network/Streaming Provider logos.
*   **Comprehensive Details Pages:**
    *   Detailed information for movies and TV shows (overview, rating, runtime, genres, cast, crew).
    *   Backdrop and poster images.
    *   AI-powered insights and bio highlights (via Google Gemini API).
    *   Season and episode browser for TV shows.
    *   Embedded YouTube trailer player.
    *   Spotify soundtrack integration (search and preview).
    *   Cast and "You Might Also Like" recommendations.
    *   Streaming provider information (TMDB Watch Providers API).
    *   **User Rating System:** Logged-in users can rate content (1-5 stars), with ratings stored and aggregated in Firestore. Community average ratings are displayed.
    *   **Conceptual Download Button:** UI element for download, with a message indicating it's not a functional download from embed sources.
*   **Player View:**
    *   Integrates with multiple third-party embed providers (e.g., VidSrc.to, SuperEmbed).
    *   Source switcher.
    *   Episode selector for TV shows.
*   **Search Functionality:**
    *   Live search suggestions as the user types.
    *   Full search results page for movies and TV shows.
*   **User-Specific Features (Powered by Firebase & LocalStorage):**
    *   **User Authentication:** (Handled via a separate landing page, with user state passed to this app).
    *   **Watchlist:** Add/remove movies and TV shows to a personal watchlist (localStorage).
    *   **View Tracking (User-Specific):** Tracks what a user has watched via Firestore.
    *   **Favorites:** (Conceptual - if `Favorites.js` module is implemented).
*   **Genre & Network Browsing:**
    *   Dedicated pages for browsing content by specific genres or streaming networks.
    *   "Load More" pagination.
*   **Person Detail Pages:**
    *   Information about actors/crew, biography, known for credits.
    *   AI-powered career highlights.
*   **Music Section:**
    *   Spotify API integration for searching tracks.
    *   Audio preview for tracks.
    *   Music visualizer for demo audio.
*   **Live Sports Section (Conceptual):**
    *   Integration with Sportradar API to display live soccer scores and upcoming matches (API key required).
*   **Analytics Dashboard (Conceptual):**
    *   Visualizations of user preferences (e.g., top genres, actors - if `Analytics.js` is fully implemented with data tracking).
*   **Connection Explorer:**
    *   Visualize connections between movies, TV shows, and people (cast/crew) using Vis Network.
*   **Theming:** Multiple pre-defined themes with a theme switcher.
*   **Responsive Design:** Built with Bootstrap 5 for adaptability across devices.
*   **Skeleton Loaders:** Provides a better user experience while content is loading.

## Technologies Used

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Styling:** Bootstrap 5, Custom CSS
*   **APIs:**
    *   **TMDB (The Movie Database):** For movie/TV show metadata, posters, backdrops, cast, crew, recommendations, etc.
    *   **Firebase (Authentication & Firestore):** For user authentication (via landing page), user-specific data (view history, potentially future favorites/custom lists), global view counts, and user-submitted ratings.
    *   **Google Gemini:** For AI-powered insights and bio highlights.
    *   **Spotify API:** For music search and soundtrack integration.
    *   **Sportradar API:** For live sports data (soccer).
    *   **Third-Party Embed Services (VidSrc.to, SuperEmbed):** For conceptual video streaming.
*   **Libraries:**
    *   **Vis Network:** For the Connection Explorer graph visualization.
    *   (Potentially Chart.js if analytics charts are implemented)

## Setup & Configuration

1.  **Clone the Repository (if applicable):**
    ```bash
    git clone https://github.com/MEDELBOU3/SM4movies.v2.0.0
    cd SM4movies.v2.0.0
    ```
2.  **API Keys:**
    *   **TMDB API Key:** Open `script.js` and replace the placeholder in `config.TMDB_API_KEY` with your valid TMDB API key.
    *   **Firebase Configuration:**
        *   Open `firebase.js` (and your landing page's Firebase script).
        *   Replace all placeholder values in `firebaseConfigApp` (and the landing page's equivalent) with your actual Firebase project configuration details (apiKey, authDomain, projectId, etc.).
        *   Set up Firestore in your Firebase project and configure security rules (see `firestore.rules` example or provided rules).
    *   **Google Gemini API Key:** Open `script.js` and replace the placeholder in `config.GEMINI_API_KEY`. Ensure the Gemini API (Generative Language API) is enabled for your Google Cloud project.
    *   **Spotify API Credentials:** Open `script.js` and replace placeholders in `config.SPOTIFY_CLIENT_ID` and `config.SPOTIFY_CLIENT_SECRET`.
    *   **Sportradar API Key:** Open `script.js` and replace the placeholder in `config.SPORTRADAR_API_KEY`.
3.  **HTML Structure for Home Sections (Optional but Recommended):**
    *   For sections like "Popular on AuraStream" (`most-viewed`) and "Top Rated on AuraStream" (`top-rated-aurastream`), it's recommended to have placeholder `<section>` divs in your `app2.html` (or main app HTML file) with the corresponding IDs (`most-viewed-section`, `top-rated-aurastream-section`). This allows the JavaScript to target them correctly and manage their visibility. See `script.js` (`App.loadHomeSections`) for details.
    *   Example:
        ```html
        <section id="most-viewed-section" class="content-section mb-5" style="display: none;">
            <h2 class="section-title">Popular on AuraStream</h2>
            <div class="horizontal-scroll-wrapper">
                <button class="btn h-scroll-btn prev disabled" aria-label="Scroll Previous"><i class="bi bi-chevron-left"></i></button>
                <div class="horizontal-card-container most-viewed-container"></div>
                <button class="btn h-scroll-btn next disabled" aria-label="Scroll Next"><i class="bi bi-chevron-right"></i></button>
            </div>
        </section>
        ```
4.  **Firebase Firestore Security Rules:**
    *   Deploy the necessary Firestore security rules to protect your data. Ensure rules allow:
        *   Authenticated users to write their own data (e.g., under `/users/{userId}`).
        *   Public or authenticated writes to `viewCounts` (depending on your design).
        *   Public reads and authenticated writes for `item_ratings`.
    *   An example set of rules has been discussed during development. **Always review and test your security rules thoroughly.**
5.  **Run Locally:** Open `app2.html` (or your main app HTML file) in a modern web browser. An internet connection is required for API calls.

## Made By MOHAMED EL-BOUANANI
