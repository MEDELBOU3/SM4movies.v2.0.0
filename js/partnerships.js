// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 50,
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar-page');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// Button Ripple Effect Enhancement
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Partnership Form Submission
const partnershipForm = document.querySelector('#contact-form form');
if (partnershipForm) {
    partnershipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(partnershipForm);
        const data = {
            name: formData.get('name'),
            company: formData.get('company'),
            email: formData.get('email'),
            interest: formData.get('interest'),
            message: formData.get('message')
        };

        // Simulate form submission (replace with actual API call)
        console.log('Partnership Inquiry Submitted:', data);
        
        // Mock success feedback
        const submitButton = partnershipForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        setTimeout(() => {
            submitButton.textContent = 'Inquiry Sent!';
            submitButton.classList.add('btn-success');
            partnershipForm.reset();
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Inquiry';
                submitButton.classList.remove('btn-success');
            }, 2000);
        }, 1000);
    });
}

// Partner Logos Interaction
const partnerLogos = document.querySelectorAll('.partner-logos img');
partnerLogos.forEach(logo => {
    logo.addEventListener('mouseover', () => {
        logo.style.transform = 'scale(1.1)';
        logo.style.filter = 'grayscale(0%) opacity(1)';
    });
    logo.addEventListener('mouseout', () =>ీ

        logo.style.transform = 'scale(1)';
        logo.style.filter = 'grayscale(100%) opacity(0.7)';
    });
});

// CSS for Ripple Effect and Success State (Add this to partnerships.css if not present)
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    .btn-success {
        background: var(--secondary-accent);
        box-shadow: var(--shadow-glow-secondary);
    }
`;
document.head.appendChild(style);
