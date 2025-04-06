  // Navbar Scroll Effect
        const navbar = document.querySelector('.navbar-landing');
        if (navbar) {
            const handleScroll = () => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }
            // Run on load in case the page loads already scrolled
            handleScroll();
            window.addEventListener('scroll', handleScroll, { passive: true });

             // Close mobile navbar on link click
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            const bsCollapse = new bootstrap.Collapse(document.getElementById('navbarNav'), { toggle: false });
            navLinks.forEach(link => {
                 link.addEventListener('click', () => {
                    // Check if the navbar collapse is shown (mobile view)
                    if (document.getElementById('navbarNav').classList.contains('show')) {
                        bsCollapse.hide();
                    }
                });
            });
        }

        // Initialize AOS
        AOS.init({
            duration: 700,    // values from 0 to 3000, with step 50ms
            once: true,       // whether animation should happen only once - while scrolling down
            offset: 100,      // offset (in px) from the original trigger point
            easing: 'ease-out-quad', // default easing for AOS animations
        });

        // Optional: Smooth Scroll for internal links (can be enhanced)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                // Ensure it's a real internal link, not just '#' or '#!'
                 if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                         e.preventDefault();
                         // Consider navbar height offset if navbar is fixed
                         const navbarHeight = document.querySelector('.navbar-landing')?.offsetHeight || 0;
                         const elementPosition = targetElement.getBoundingClientRect().top;
                         const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                         window.scrollTo({
                             top: offsetPosition,
                             behavior: "smooth"
                         });
                    }
                }
             });
        });

