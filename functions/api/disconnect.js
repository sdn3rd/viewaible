// POST /api/disconnect — clears the target cookie
export async function onRequestPost() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'viewaible_target=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}
