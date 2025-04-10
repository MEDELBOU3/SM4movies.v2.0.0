     /**
         * AuraStream Landing Page Application
         * Handles: Core UI Effects (Navbar, AOS, Smooth Scroll) & Google Authentication
         * Author: Mohamed El-bouanani (Concept) & AI Assistant
         * Version: 3.0.0
         */

        /**
         * Module: Core UI Effects
         * Handles general page interactions and animations.
         */
        const AuraUICore = (() => {
            const SELECTORS = {
                navbar: '.navbar-landing',
                navCollapse: '#navbarNav',
                navLink: '.navbar-nav .nav-link',
                smoothScrollAnchor: 'a[href^="#"]',
                navbarFixedTop: '.navbar-landing.fixed-top'
            };

            const initNavbar = () => {
                const navbar = document.querySelector(SELECTORS.navbar);
                const navCollapseElement = document.getElementById(SELECTORS.navCollapse.substring(1)); // Remove # for getElementById
                const navLinks = document.querySelectorAll(SELECTORS.navLink);

                if (!navbar) {
                    console.warn('Navbar element not found.');
                    return;
                }

                const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60); // Increased threshold
                handleScroll(); // Initial check
                window.addEventListener('scroll', handleScroll, { passive: true });

                if (navCollapseElement && typeof bootstrap !== 'undefined') {
                    const bsCollapse = new bootstrap.Collapse(navCollapseElement, { toggle: false });
                    navLinks.forEach(link => {
                        link.addEventListener('click', () => {
                            if (navCollapseElement.classList.contains('show')) bsCollapse.hide();
                        });
                    });
                } else if (!navCollapseElement) {
                    console.warn('Navbar collapse element not found.');
                } else if (typeof bootstrap === 'undefined') {
                    console.warn('Bootstrap JS not loaded, cannot control navbar collapse on click.');
                }
            };

            const initAOS = () => {
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 750, // Slightly longer duration
                        once: true,
                        offset: 80, // Adjust offset
                        easing: 'ease-out-cubic',
                        disable: window.innerWidth < 768 // Optionally disable on mobile
                    });
                } else {
                    console.warn('AOS library not loaded.');
                }
            };

            const initSmoothScroll = () => {
                document.querySelectorAll(SELECTORS.smoothScrollAnchor).forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        const targetId = this.getAttribute('href');
                        if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                            try {
                                const targetElement = document.querySelector(targetId);
                                if (targetElement) {
                                    e.preventDefault();
                                    const navbarHeight = document.querySelector(SELECTORS.navbarFixedTop)?.offsetHeight || 65;
                                    const elementPosition = targetElement.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 15; // Fine-tune offset

                                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                                } else {
                                    console.warn(`Smooth scroll target element not found: ${targetId}`);
                                }
                             } catch (error) {
                                console.error(`Error finding smooth scroll target ${targetId}:`, error);
                            }
                        }
                    });
                });
            };

            const initialize = () => {
                try {
                    initNavbar();
                    initAOS();
                    initSmoothScroll();
                    console.info("AuraUICore initialized successfully.");
                } catch (error) {
                    console.error("Error initializing AuraUICore:", error);
                }
            };

            return { init: initialize };
        })();


        /**
         * Module: Google Authentication Handler
         * Manages Google Sign-In/Sign-Out flow and UI updates.
         */
        const AuraAuth = (() => {
            const CLIENT_ID = '886921214537-35pg2kb0qjfnd807cpjbk1bgi41dfhf5.apps.googleusercontent.com';
            const PLACEHOLDER_AVATAR = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

            // Cache DOM Elements for performance
            const ui = {
                signInBtnContainer: document.getElementById('googleSignInButtonContainer'),
                userInfoDiv: document.getElementById('userInfo'),
                userPicture: document.getElementById('userPicture'),
                userName: document.getElementById('userName'),
                signOutButton: document.getElementById('signOutButton'),
                signInBtnContainerMobile: document.getElementById('googleSignInButtonContainerMobile'),
                userInfoDivMobile: document.getElementById('userInfoMobile'),
                userPictureMobile: document.getElementById('userPictureMobile'),
                userNameMobile: document.getElementById('userNameMobile'),
                signOutButtonMobile: document.getElementById('signOutButtonMobile'),
                loggedOutViews: document.querySelectorAll('.logged-out-view'),
                loggedInViews: document.querySelectorAll('.logged-in-view'),
                authHiddenClass: 'auth-hidden' // CSS class for hiding elements
            };

            // Ensure all critical elements exist
            const checkUIElements = () => {
                let allFound = true;
                for (const key in ui) {
                    // NodeLists are okay if empty, check individual elements
                    if (!(ui[key] instanceof NodeList) && !ui[key]) {
                         console.warn(`Auth UI element not found: ${key}`);
                         // Decide if this is critical, maybe set a flag to disable auth?
                         // allFound = false;
                     }
                }
                return allFound;
            };

            /** Decode JWT - Client-side inspection ONLY. */
            const decodeJwtResponse = (token) => { /* ... (keep existing implementation) ... */
                if (!token) return null; try { const base64Url = token.split('.')[1]; const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); return JSON.parse(jsonPayload); } catch (error) { console.error("Error decoding JWT:", error); return null; }
            };


            const updateAuthUI = (isLoggedIn, userData = null) => {
                console.info(`Updating Auth UI - Logged In: ${isLoggedIn}`);
                const action = isLoggedIn ? 'remove' : 'add';
                ui.loggedInViews.forEach(el => el?.classList[action](ui.authHiddenClass));
                ui.loggedOutViews.forEach(el => el?.classList[isLoggedIn ? 'add' : 'remove'](ui.authHiddenClass));

                if (isLoggedIn && userData) {
                    const displayName = userData.given_name || userData.name || 'Aura User';
                    const displayPicture = userData.picture || PLACEHOLDER_AVATAR;
                    const fullName = userData.name || '';

                    if (ui.userPicture) ui.userPicture.src = displayPicture;
                    if (ui.userName) { ui.userName.textContent = displayName; ui.userName.title = fullName; }
                    if (ui.userPictureMobile) ui.userPictureMobile.src = displayPicture;
                    if (ui.userNameMobile) { ui.userNameMobile.textContent = displayName; ui.userNameMobile.title = fullName; }
                    console.info("User profile updated in UI.");
                } else {
                    if (ui.userPicture) ui.userPicture.src = PLACEHOLDER_AVATAR;
                    if (ui.userName) { ui.userName.textContent = ''; ui.userName.title = ''; }
                    if (ui.userPictureMobile) ui.userPictureMobile.src = PLACEHOLDER_AVATAR;
                    if (ui.userNameMobile) { ui.userNameMobile.textContent = ''; ui.userNameMobile.title = ''; }
                    console.info("Auth UI reset to logged-out state.");
                }
            };

            const handleCredentialResponse = (response) => {
                console.info("Google Sign-In Credential Response received.");
                const decodedToken = decodeJwtResponse(response.credential);

                if (decodedToken) {
                    // --- BACKEND VERIFICATION IS CRUCIAL FOR REAL APPS ---
                    console.warn("SECURITY NOTE: Client-side decoding is for display ONLY. Send token to backend for verification!");

                    const userData = { id: decodedToken.sub, name: decodedToken.name, given_name: decodedToken.given_name, family_name: decodedToken.family_name, picture: decodedToken.picture, email: decodedToken.email, email_verified: decodedToken.email_verified };

                    try {
                        localStorage.setItem('auraUserLoggedIn', 'true');
                        localStorage.setItem('auraUserData', JSON.stringify(userData));
                        console.info("User data persisted to localStorage.");
                    } catch (e) { console.error("Failed to save to localStorage:", e); }

                    updateAuthUI(true, userData);
                } else {
                    console.error("Failed to decode Google ID token.");
                    updateAuthUI(false); // Show logged-out state on error
                }
            };

            const renderGoogleButton = () => {
                if (typeof google === 'undefined' || !google.accounts?.id?.renderButton) {
                    console.error("GSI client not ready for renderButton."); return;
                }
                const buttonOptions = { theme: "outline", size: "medium", type: "standard", text: "signin_with", shape: "pill" }; // Pill shape

                [ui.signInBtnContainer, ui.signInBtnContainerMobile].forEach(container => {
                    if (container && !container.classList.contains(ui.authHiddenClass)) { // Only render if visible
                         container.innerHTML = ''; // Clear previous
                         try {
                             google.accounts.id.renderButton(container, buttonOptions);
                             console.info(`Google button rendered in ${container.id}.`);
                         } catch (error) {
                              console.error(`Error rendering button in ${container.id}:`, error);
                         }
                    }
                });
            };

            const handleSignOut = () => {
                console.info("Signing out user...");
                if (typeof google !== 'undefined' && google.accounts?.id) {
                    // google.accounts.id.disableAutoSelect(); // Consider if needed
                }
                try {
                    localStorage.removeItem('auraUserLoggedIn');
                    localStorage.removeItem('auraUserData');
                    console.info("User data removed from localStorage.");
                } catch (e) { console.error("Failed to remove localStorage data:", e); }

                updateAuthUI(false);
                // Debounce or delay rendering slightly to prevent potential flicker
                setTimeout(renderGoogleButton, 100);
            };

            const checkInitialLoginState = () => {
                console.info("Checking initial login state...");
                let isLoggedIn = false; let userData = null;
                try {
                    isLoggedIn = localStorage.getItem('auraUserLoggedIn') === 'true';
                    if (isLoggedIn) userData = JSON.parse(localStorage.getItem('auraUserData') || 'null');
                    if (!userData) isLoggedIn = false; // If data is missing/invalid, treat as logged out
                } catch (e) {
                    console.error("Error reading localStorage state:", e);
                    isLoggedIn = false; userData = null;
                    localStorage.removeItem('auraUserLoggedIn'); localStorage.removeItem('auraUserData'); // Clear bad data
                }
                updateAuthUI(isLoggedIn, userData);
                return isLoggedIn; // Return status for GSI init logic
            };

            const initializeGSI = () => {
                if (!checkUIElements()) {
                     console.error("Auth UI elements missing, cannot initialize GSI properly.");
                     return; // Prevent initialization if crucial elements are missing
                }

                if (typeof google === 'undefined' || !google.accounts?.id?.initialize) {
                    console.error("GSI client not loaded or ready for initialization.");
                    updateAuthUI(false); // Ensure logged-out UI
                    return;
                }

                try {
                    console.info("Initializing Google Identity Services...");
                    google.accounts.id.initialize({
                        client_id: CLIENT_ID,
                        callback: handleCredentialResponse,
                        // context: "signin", // Optional: context for prompts
                        // ux_mode: "popup",
                        // nonce: 'YOUR_SECURE_NONCE' // IMPORTANT for replay protection if sending to backend
                    });
                    console.info("GSI Initialized.");

                    const initiallyLoggedIn = checkInitialLoginState();

                    // Add sign-out listeners
                     [ui.signOutButton, ui.signOutButtonMobile].forEach(btn => {
                         if (btn) btn.addEventListener('click', handleSignOut);
                     });

                    // Render button only if initially logged out
                    if (!initiallyLoggedIn) {
                        renderGoogleButton();
                    }

                    // Optional: Google One Tap
                    // google.accounts.id.prompt(notification => { /* ... handle prompt notifications ... */ });

                } catch (error) {
                    console.error("Error initializing Google Identity Services:", error);
                    updateAuthUI(false);
                }
            };

            return { init: initializeGSI }; // Expose only the init function
        })();


        // --- Global Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
             console.info("DOM Loaded. Initializing AuraStream modules...");
             AuraUICore.init();
             // GSI script has `defer`, so it should execute after DOMContentLoaded,
             // but window.onload is a safer bet to ensure the `google` object is available.
        });

         window.onload = () => {
            console.info("Window Loaded. Initializing Google Sign-In...");
            // Check if GSI object exists before initializing
            if (typeof google !== 'undefined' && google.accounts?.id) {
                 AuraAuth.init();
            } else {
                 // If GSI hasn't loaded yet (unlikely with defer but possible), wait a bit more or handle error
                 console.warn("GSI client not found on window.onload, retrying initialization shortly or login may fail.");
                 // Optional: Add a timeout fallback, but ideally defer handles this.
                  setTimeout(() => {
                      if (typeof google !== 'undefined' && google.accounts?.id) {
                          AuraAuth.init();
                      } else {
                           console.error("GSI client failed to load. Google Sign-In unavailable.");
                           // Update UI to show login is unavailable?
                      }
                  }, 1500); // Wait 1.5 seconds as a fallback
            }
         };
