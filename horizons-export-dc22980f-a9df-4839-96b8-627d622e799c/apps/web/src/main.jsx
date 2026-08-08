import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// Automatically unregister legacy Service Workers and clear browser CacheStorage
if (typeof window !== 'undefined') {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			for (const registration of registrations) {
				registration.unregister();
			}
		}).catch(() => {});
	}

	if ('caches' in window) {
		caches.keys().then((keys) => {
			for (const key of keys) {
				caches.delete(key);
			}
		}).catch(() => {});
	}

	// Auto-reload page when Vite chunk loading fails due to a new deployment update
	window.addEventListener('vite:preloadError', () => {
		window.location.reload();
	});
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<App />
);

