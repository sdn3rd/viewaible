// Proxies all requests under /terminal/* to the VPS ttyd instance.
// The target URL comes from the HttpOnly cookie set by /api/connect.
// The session token is forwarded as X-Viewaible-Token — Nginx on the VPS
// validates it before allowing access. No valid token = 403.
// Supports WebSocket upgrades for ttyd.

const ERROR_PAGE = `<!DOCTYPE html>
<html><head><style>
  body { background: #0B0B14; color: #E8E8F0; font-family: 'Source Sans 3', sans-serif;
    display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  .box { background: #1A1A2E; border: 1px solid #2A2A45; border-radius: 12px; padding: 32px;
    max-width: 400px; text-align: center; }
  h2 { color: #D4AF37; margin: 0 0 8px; }
  p { color: #8888AA; font-size: 14px; line-height: 1.6; margin: 0; }
  code { color: #D4AF37; font-size: 12px; }
</style></head><body><div class="box">
  <h2>CONNECTION_TITLE</h2>
  <p>CONNECTION_MSG</p>
</div></body></html>`;

function errorPage(title, msg, status = 502) {
  return new Response(
    ERROR_PAGE.replace('CONNECTION_TITLE', title).replace('CONNECTION_MSG', msg),
    { status, headers: { 'Content-Type': 'text/html' } }
  );
}

function parseCookies(request) {
  const cookie = request.headers.get('Cookie') || '';
  let target = null;
  let token = null;

  const targetMatch = cookie.match(/viewaible_target=([^;]+)/);
  if (targetMatch) {
    try { target = atob(targetMatch[1]); } catch {}
  }

  const tokenMatch = cookie.match(/viewaible_token=([^;]+)/);
  if (tokenMatch) {
    token = tokenMatch[1];
  }

  return { target, token };
}

export async function onRequest({ request, params }) {
  const { target: targetBase, token } = parseCookies(request);

  if (!targetBase) {
    return errorPage(
      'Not Connected',
      'No VPS connection configured. Go back and add a connection through the setup wizard.'
    );
  }

  if (!token) {
    return errorPage(
      'Session Expired',
      'Your session token is missing — cookies may have been cleared.<br><br>' +
      'Go back and reconnect through the setup wizard with your session token.',
      403
    );
  }

  // Validate target URL
  try {
    new URL(targetBase);
  } catch {
    return errorPage('Invalid Target', 'The stored connection URL is malformed.');
  }

  const path = params.path ? params.path.join('/') : '';
  const url = new URL(request.url);
  const targetUrl = new URL(path + url.search, targetBase);

  try {
    // Check if this is a WebSocket upgrade
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader && upgradeHeader.toLowerCase() === 'websocket') {
      const wsHeaders = new Headers(request.headers);
      wsHeaders.delete('Cookie');
      wsHeaders.set('X-Viewaible-Token', token);
      return await fetch(targetUrl.toString(), { headers: wsHeaders });
    }

    // Regular HTTP proxy
    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.delete('Cookie');
    proxyHeaders.set('Host', new URL(targetBase).host);
    proxyHeaders.set('X-Viewaible-Token', token);

    const resp = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    // If VPS rejected the token
    if (resp.status === 403) {
      return errorPage(
        'Invalid Session',
        'Your session token was rejected by the VPS.<br><br>' +
        'This can happen if the VPS was re-setup with a new token.<br>' +
        'Disconnect and reconnect with the correct token.',
        403
      );
    }

    // Check for Cloudflare error pages (1xxx errors)
    if (resp.status >= 520 && resp.status <= 530) {
      return errorPage(
        'VPS Unreachable',
        `Could not connect to your VPS (HTTP ${resp.status}).<br><br>` +
        'Check that:<br>' +
        '&bull; Your VPS is running<br>' +
        '&bull; ttyd is active on port 7681<br>' +
        '&bull; UFW allows Cloudflare IPs on port 7681<br>' +
        '&bull; UFW allows Cloudflare IPs on port 443'
      );
    }

    const respHeaders = new Headers(resp.headers);
    respHeaders.delete('Set-Cookie');

    return new Response(resp.body, {
      status: resp.status,
      headers: respHeaders,
    });
  } catch (e) {
    return errorPage(
      'Connection Failed',
      `Could not reach your VPS: ${e.message}<br><br>` +
      'Make sure the VPS is online and the IP is correct.'
    );
  }
}
