import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to top on route changes, or to a hash target when the URL includes #section-id
 * (e.g. Discover the Hardware → /#section-meet-argo). Retries briefly so the home page can mount.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return undefined;
    }

    const id = hash.replace(/^#/, '');
    let attempts = 0;
    const maxAttempts = 12;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
      return false;
    };

    if (tryScroll()) return undefined;

    const timer = window.setInterval(() => {
      attempts += 1;
      if (tryScroll() || attempts >= maxAttempts) {
        window.clearInterval(timer);
        if (attempts >= maxAttempts && !document.getElementById(id)) {
          window.scrollTo(0, 0);
        }
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
}
