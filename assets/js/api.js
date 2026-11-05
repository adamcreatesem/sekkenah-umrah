/* Sekkenah, booking transport.
 *
 * The wizard always worked offline: it wrote the request into the visitor's browser and
 * offered WhatsApp. That lost every booking where the visitor did not also press the
 * WhatsApp button, so the request is now posted to the booking API as well, and the
 * reference comes back from the server. If the API is not configured, or is unreachable,
 * the old behaviour is kept exactly: local copy, WhatsApp handoff, nothing broken.
 *
 * The endpoint is set once in index.html:
 *   <meta name="sekkenah-api" content="https://sekkenah-api.<account>.workers.dev">
 * Empty content means "not deployed yet" and no network call is made.
 */

const ENDPOINT = (document.querySelector('meta[name="sekkenah-api"]')?.content || '').replace(/\/+$/, '');

export const apiReady = () => Boolean(ENDPOINT);

async function post(path, payload) {
  if (!ENDPOINT) throw new Error('api not configured');
  const res = await fetch(ENDPOINT + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout ? AbortSignal.timeout(9000) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'request failed');
    err.status = res.status;
    err.fields = data.fields || [];
    throw err;
  }
  return data;
}

export const submitBooking = (payload) => post('/api/bookings', payload);
export const submitEnquiry = (payload) => post('/api/enquiries', payload);
