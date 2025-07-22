// service-worker.js

// Versioning the service worker cache (important for updates)
const CACHE_NAME = 'auraStream-v1';
// List files to pre-cache (optional, but good for offline experience)
const urlsToCache = [
    '/', // Root page
    'sm4movies.html',
    'css/style.css', // If you extract your style block
    'js/firebase.js',
    'js/analytics.js',
    // Add other essential static assets: fonts, main images etc.
];

// Install event: cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all app shell');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('[Service Worker] Cache installation failed:', error);
            })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the service worker takes control of the page immediately
    return self.clients.claim();
});

// Fetch event: serve from cache, then network
self.addEventListener('fetch', (event) => {
    // Only handle HTTP/HTTPS requests
    if (event.request.url.startsWith('http')) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    // Not in cache - fetch from network
                    return fetch(event.request)
                        .then((fetchResponse) => {
                            // If response is valid, clone it and cache it
                            if (fetchResponse.ok) {
                                const responseToCache = fetchResponse.clone();
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                            }
                            return fetchResponse;
                        });
                })
                .catch((error) => {
                    console.error('[Service Worker] Fetch failed:', error);
                    // You can return a fallback page here for offline
                    // return caches.match('/offline.html');
                })
        );
    }
});


// Push notification event: handle incoming push messages
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received.');
    // Parse the push message payload
    const data = event.data ? event.data.json() : {};

    const title = data.title || 'AuraStream Notification';
    const options = {
        body: data.body || 'A new update or reminder from AuraStream.',
        icon: data.icon || '/path/to/your/app-icon-192x192.png', // Replace with your app icon
        badge: data.badge || '/path/to/your/app-badge-72x72.png', // Optional: smaller icon for mobile status bar
        image: data.image || '', // Optional: large image for richer notifications
        data: {
            url: data.url || '/', // URL to open when notification is clicked
        },
        actions: data.actions || [], // Optional: notification action buttons
        vibrate: [200, 100, 200], // Optional: vibration pattern
        tag: data.tag, // Optional: tag to group/replace notifications
        renotify: data.renotify || false, // Optional: renotify if tag matches existing notification
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event: handle user interaction with the notification
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click received.');
    event.notification.close(); // Close the notification

    const targetUrl = event.notification.data.url || '/'; // Get URL from notification data

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's an existing client (tab/window) for the app
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    // If an existing client matches, focus it and navigate to URL
                    return client.focus().then(focusedClient => focusedClient.navigate(targetUrl));
                }
            }
            // If no existing client, open a new window
            return clients.openWindow(targetUrl);
        })
    );
});
