import { useEffect, useRef } from 'react';

const CHECK_INTERVAL = 3 * 60 * 1000; // check every 3 minutes

export function useVersionCheck() {
  const currentVersion = useRef(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
        });
        const data = await res.json();

        if (currentVersion.current === null) {
          currentVersion.current = data.version;
          return;
        }

        if (data.version !== currentVersion.current) {
          window.location.reload();
        }
      } catch (err) {
        // fail silently, don't disrupt the user
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);
}
