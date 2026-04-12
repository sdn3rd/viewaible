// Proxies all requests under /terminal/* to the VPS ttyd instance.
// The target URL comes from the HttpOnly cookie set by /api/connect.
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

function errorPage(title, msg) {
  return new Response(
    ERROR_PAGE.replace('CONNECTION_TITLE', title).replace('CONNECTION_MSG', msg),
    { status: 502, headers: { 'Content-Type': 'text/html' } }
  );
}

function getTargetUrl(request) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/viewaible_target=([^;]+)/);
  if (!match) return null;
  try {
    return atob(match[1]);
  } catch {
    return null;
  }
}

export async function onRequest({ request, params }) {
  const targetBase = getTargetUrl(request);
  if (!targetBase) {
    return errorPage(
      'Not Connected',
      'No VPS connection configured. Go back and add a connection through the setup wizard.'
    );
  }

  // Reject raw IP targets early
  try {
    const hostname = new URL(targetBase).hostname;
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return errorPage(
        'IP Address Not Supported',
        'Cloudflare Workers cannot connect to raw IP addresses. ' +
        'Use a DNS-only (grey cloud) hostname instead.<br><br>' +
        'Add an A record in Cloudflare: <code>vps.yourdomain.com → your IP</code><br>' +
        'Set it to DNS only (grey cloud), then reconnect with that hostname.'
      );
    }
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
      return await fetch(targetUrl.toString(), { headers: request.headers });
    }

    // Regular HTTP proxy
    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.delete('Cookie');
    proxyHeaders.set('Host', new URL(targetBase).host);

    const resp = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    // Check for Cloudflare error pages (1xxx errors)
    const cfError = resp.headers.get('cf-error');
    if (resp.status >= 520 && resp.status <= 530) {
      return errorPage(
        'VPS Unreachable',
        `Could not connect to your VPS (HTTP ${resp.status}).<br><br>` +
        'Check that:<br>' +
        '&bull; Your VPS is running<br>' +
        '&bull; ttyd is active on port 7681<br>' +
        '&bull; UFW allows Cloudflare IPs on port 7681<br>' +
        '&bull; DNS record is DNS-only (grey cloud)'
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
      'Make sure the hostname resolves and the VPS is online.'
    );
  }
}
