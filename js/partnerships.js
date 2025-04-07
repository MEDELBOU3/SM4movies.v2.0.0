   document.addEventListener('DOMContentLoaded', () => {

            // Initialize AOS
            AOS.init({
                duration: 700, // Slightly faster duration
                once: true,
                offset: 80, // Trigger sooner
                easing: 'ease-out-cubic', // Smoother easing
            });

            // Navbar Scroll Effect
            const navbar = document.querySelector('.navbar-page');
            if (navbar) {
                 // Set initial state in case page loads already scrolled
                navbar.classList.toggle('scrolled', window.scrollY > 30);
                 // Add scroll listener
                window.addEventListener('scroll', () => {
                    navbar.classList.toggle('scrolled', window.scrollY > 30);
                }, { passive: true });
            }

            // Button Ripple Effect
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    // Remove existing ripples first
                    const existingRipple = btn.querySelector('.ripple');
                    if(existingRipple) existingRipple.remove();

                    const ripple = document.createElement('span');
                    ripple.classList.add('ripple');
                    const rect = btn.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height) * 1.5; // Make ripple larger
                    ripple.style.width = ripple.style.height = `${size}px`;

                    // Calculate position relative to button, centering the ripple effect
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;

                    ripple.style.left = `${x}px`;
                    ripple.style.top = `${y}px`;

                    // Using `this` refers to the button clicked
                    this.appendChild(ripple);

                    // Clean up the ripple element after animation
                    ripple.addEventListener('animationend', () => {
                         ripple.remove();
                     });
                });
            });

            // Bootstrap Form Validation Initialization
            const forms = document.querySelectorAll('.needs-validation');
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });


            // Enhanced (Simulated) Partnership Form Submission Feedback
            const partnershipForm = document.querySelector('#contact-form form');
            if (partnershipForm) {
                partnershipForm.addEventListener('submit', (e) => {
                    // Prevent default ONLY if validation passes for simulation
                     if (!partnershipForm.checkValidity()) {
                        // Bootstrap validation will handle visual feedback
                        return;
                    }
                     // Prevent actual submission for this demo
                    e.preventDefault();

                    const formData = new FormData(partnershipForm);
                    const data = Object.fromEntries(formData.entries()); // More modern way

                    console.log('Simulating Partnership Inquiry Submission:', data);

                    const submitButton = partnershipForm.querySelector('button[type="submit"]');
                    const originalButtonText = submitButton.textContent;
                    const originalButtonClasses = submitButton.className; // Store original classes

                    submitButton.disabled = true;
                    submitButton.innerHTML = `
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Submitting...`;

                    // Simulate network delay
                    setTimeout(() => {
                        submitButton.textContent = 'Inquiry Sent Successfully!';
                        // Temporarily add a success class (ensure this class is defined in CSS)
                        submitButton.className = originalButtonClasses.replace('btn-primary-gradient', 'btn-success'); // Swap classes


                        // Reset form after showing success
                         partnershipForm.reset();
                         partnershipForm.classList.remove('was-validated'); // Remove validation states


                        // Revert button back after a delay
                        setTimeout(() => {
                             submitButton.disabled = false;
                             submitButton.textContent = originalButtonText;
                             submitButton.className = originalButtonClasses; // Restore original classes

                        }, 2500); // Time success message is shown

                    }, 1500); // Simulate 1.5 second submission time
                });
             }

             // Smooth scroll for internal links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                     const targetId = this.getAttribute('href');
                     if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                        const targetElement = document.querySelector(targetId);
                         if (targetElement) {
                            e.preventDefault();
                             const navbarHeight = document.querySelector('.navbar-page')?.offsetHeight || 70; // Get dynamic height or fallback
                             const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 15; // Add slight offset below navbar

                             window.scrollTo({
                                top: offsetPosition,
                                 behavior: "smooth"
                            });
                         }
                     }
                });
            });

        }); // End DOMContentLoaded
