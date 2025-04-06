 // Initialize AOS (if used)
        AOS.init({
            duration: 700,
            once: true,
            offset: 100,
            easing: 'ease-out-quad',
        });

         // Add any page-specific JS here (e.g., handling sign-up modal clicks)

         // Example: If you have a sign-up modal with id="signUpModal"
         // const signUpButtons = document.querySelectorAll('a[href="#signup"]');
         // const signUpModalEl = document.getElementById('signUpModal');
         // if (signUpModalEl) {
         //     const signUpModal = new bootstrap.Modal(signUpModalEl);
         //     signUpButtons.forEach(button => {
         //         button.addEventListener('click', (e) => {
         //             e.preventDefault();
         //             signUpModal.show();
         //         });
         //     });
         // }
