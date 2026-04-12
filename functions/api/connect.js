// POST /api/connect — stores the target VPS URL in an HttpOnly cookie
// The /terminal proxy reads this cookie to know where to forward requests.
export async function onRequestPost({ request }) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 });
    }

    // Validate it's a proper URL
    new URL(url);

    // Encode to base64 for cookie safety
    const encoded = btoa(url);

    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `paine_target=${encoded}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid url' }), { status: 400 });
  }
}
