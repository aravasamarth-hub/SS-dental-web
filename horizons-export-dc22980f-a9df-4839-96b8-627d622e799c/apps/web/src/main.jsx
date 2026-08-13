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

	// ── Auto version-check: detect new deployments and reload silently ──
	// Fetches /version.json (stamped at build time) every 2 minutes.
	// If the build hash changes, the page reloads so visitors always see
	// the latest version — no manual refresh needed.
	let __currentBuildHash = null;

	async function checkForUpdates() {
		try {
			const res = await fetch('/version.json?_t=' + Date.now(), {
				cache: 'no-store'
			});
			if (!res.ok) return;
			const data = await res.json();
			if (__currentBuildHash === null) {
				// First check — just store the hash, don't reload
				__currentBuildHash = data.hash;
			} else if (data.hash !== __currentBuildHash) {
				// New deploy detected — reload silently
				window.location.reload();
			}
		} catch {
			// Network error — skip silently, try again next interval
		}
	}

	// Initial check after 5 seconds (let the page finish loading first)
	setTimeout(checkForUpdates, 5000);
	// Then poll every 2 minutes
	setInterval(checkForUpdates, 2 * 60 * 1000);
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<App />
);

