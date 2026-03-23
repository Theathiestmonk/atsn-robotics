/**
 * Contact + invite forms POST target.
 * In dev, if VITE_CONTACT_API_URL is set, use `/api/contact` so Vite proxies to that host (avoids CORS).
 * Production: same-origin `/api/contact` on Vercel unless an explicit absolute URL is set.
 */
export function getContactApiUrl() {
  const explicit = import.meta.env.VITE_CONTACT_API_URL?.trim();
  if (import.meta.env.DEV && explicit) return '/api/contact';
  return explicit || '/api/contact';
}
