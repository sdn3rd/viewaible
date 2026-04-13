// POST /api/connect — stores the target VPS URL and session token in HttpOnly cookies.
// The /terminal proxy reads these cookies to authenticate and route requests.
// Clearing cookies = must redo setup (1-to-1 browser binding).

// Token must be hex-only to prevent injection
const TOKEN_RE = /^[0-9a-fA-F]{16,128}$/;

// URL must be an sslip.io hostname (Worker fetch can't use raw IPs)
// Matches: http://1.2.3.4.sslip.io:PORT or http://2001-db8--1.sslip.io:PORT
const SSLIP_URL_RE = /^http:\/\/[0-9a-fA-F.:_-]+\.sslip\.io:\d{1,5}$/;

export async function onRequestPost({ request }) {
  try {
    const { url, token } = await request.json();

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 });
    }
    if (!token || typeof token !== 'string' || !TOKEN_RE.test(token)) {
      return new Response(JSON.stringify({ error: 'Invalid session token' }), { status: 400 });
    }

    // Validate URL format — must be sslip.io with a port
    if (!SSLIP_URL_RE.test(url)) {
      return new Response(JSON.stringify({ error: 'Invalid url format' }), { status: 400 });
    }

    // Double-check it parses as a valid URL
    let parsed;
    try { parsed = new URL(url); } catch {
      return new Response(JSON.stringify({ error: 'Invalid url' }), { status: 400 });
    }

    // Validate port range
    const port = parseInt(parsed.port, 10);
    if (!port || port < 1 || port > 65535) {
      return new Response(JSON.stringify({ error: 'Invalid port' }), { status: 400 });
    }

    const encoded = btoa(url);

    // Both cookies are HttpOnly + Secure — JS can't read them, only the Worker proxy can.
    // Max-Age = 10 years (effectively permanent until cookies are cleared).
    const cookieOpts = 'Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=315360000';

    return new Response(JSON.stringify({ ok: true }), {
      headers: [
        ['Content-Type', 'application/json'],
        ['Set-Cookie', `viewaible_target=${encoded}; ${cookieOpts}`],
        ['Set-Cookie', `viewaible_token=${token}; ${cookieOpts}`],
      ],
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
}
