// POST /api/disconnect — clears both the target and session token cookies
export async function onRequestPost() {
  const expire = 'Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
  return new Response(JSON.stringify({ ok: true }), {
    headers: [
      ['Content-Type', 'application/json'],
      ['Set-Cookie', `viewaible_target=; ${expire}`],
      ['Set-Cookie', `viewaible_token=; ${expire}`],
    ],
  });
}
