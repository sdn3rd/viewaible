// POST /api/connect — stores the target VPS URL in an HttpOnly cookie
// The /terminal proxy reads this cookie to know where to forward requests.
export async function onRequestPost({ request }) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 });
    }

    // Validate it's a proper URL
    const parsed = new URL(url);

    // Reject raw IP addresses — Workers can't fetch them
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
      return new Response(JSON.stringify({
        error: 'Raw IP addresses are not supported. Use a DNS-only (grey cloud) hostname instead.'
      }), { status: 400 });
    }

    // Encode to base64 for cookie safety
    const encoded = btoa(url);

    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `viewaible_target=${encoded}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid url' }), { status: 400 });
  }
}
