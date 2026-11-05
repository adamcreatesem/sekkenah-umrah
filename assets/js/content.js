/* Sekkenah, catalogue transport.
 *
 * The site ships a full catalogue in data.js, generated from the portal. This asks the
 * booking API whether the office has published a newer one, and returns it. If the API is
 * not configured, unreachable, slow or empty, nothing happens and the shipped catalogue
 * stands. That is the same rule api.js follows, so an offline visitor still sees a site.
 */

const ENDPOINT = (document.querySelector('meta[name="sekkenah-api"]')?.content || '').replace(/\/+$/, '');

export async function loadCatalogue(timeoutMs = 2500) {
  if (!ENDPOINT) return null;
  try {
    const res = await fetch(ENDPOINT + '/api/content', {
      signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const c = data && data.content;
    if (!c || !Array.isArray(c.tours) || !Array.isArray(c.stays)) return null;
    if (!c.tours.length) return null; // never let an empty catalogue blank the site
    return c;
  } catch {
    return null;
  }
}
