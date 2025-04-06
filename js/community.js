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

// Button Ripple Effect Enhancement (Optional for Visual Feedback)
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

// Mock Activity Feed Updates (Simulate Dynamic Content)
const activityContainer = document.querySelector('.activity-feed-section .col-lg-8');
if (activityContainer) {
    const mockActivities = [
        {
            type: 'review',
            content: '"Rewatched Interstellar - still gives me chills every time!"',
            user: 'Jake P.',
            avatar: 'https://via.placeholder.com/30/e0f2fe/1e40af?text=JP',
            time: '3 hours ago'
        },
        {
            type: 'watchlist',
            content: 'Added <a href="#">Stranger Things (Season 5)</a> to watchlist.',
            user: 'Emma T.',
            avatar: 'https://via.placeholder.com/30/fce7f3/e11d48?text=ET',
            time: '6 hours ago'
        }
    ];

    let activityIndex = 0;
    const addMockActivity = () => {
        if (activityIndex < mockActivities.length) {
            const activity = mockActivities[activityIndex];
            const item = document.createElement('div');
            item.classList.add('activity-item');
            item.setAttribute('data-aos', 'fade-up');
            item.setAttribute('data-aos-delay', `${150 + activityIndex * 50}`);
            if (activity.type === 'review') {
                item.innerHTML = `
                    <blockquote>${activity.content}</blockquote>
                    <div class="meta">
                        <img src="${activity.avatar}" alt="User Avatar"> Reviewed by <a href="#">${activity.user}</a> - ${activity.time}
                    </div>
                `;
            } else {
                item.innerHTML = `
                    <p><i class="bi bi-plus-circle-fill text-gradient me-1"></i> ${activity.content}</p>
                    <div class="meta">
                        <img src="${activity.avatar}" alt="User Avatar"> Activity by <a href="#">${activity.user}</a> - ${activity.time}
                    </div>
                `;
            }
            activityContainer.insertBefore(item, activityContainer.querySelector('.text-center'));
            AOS.refresh(); // Refresh AOS to animate new elements
            activityIndex++;
        }
    };

    // Simulate adding activities every 5 seconds (for demo purposes)
    setInterval(addMockActivity, 5000);
    addMockActivity(); // Add first one immediately
}

// Mock Sign-Up Handling (For Join CTA)
const joinButtons = document.querySelectorAll('a[href="#signup"]');
joinButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Simulate a signup modal or redirect - replace with actual logic
        const username = prompt('Enter a username to join the community:');
        if (username) {
            localStorage.setItem('auraStreamUser', username);
            alert(`Welcome to the AuraStream Community, ${username}!`);
            window.location.href = 'msc.html#community'; // Redirect to app community section
        }
    });
});

// CSS for Ripple Effect (Add this to community.css if not present)
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
`;
document.head.appendChild(style);
