// Proxies all requests under /terminal/* to the VPS ttyd instance.
// The target URL comes from the HttpOnly cookie set by /api/connect.
// Supports WebSocket upgrades for ttyd.

function getTargetUrl(request) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/paine_target=([^;]+)/);
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
    return new Response('Not connected. Set up a connection first.', { status: 401 });
  }

  const path = params.path ? params.path.join('/') : '';
  const url = new URL(request.url);
  const targetUrl = new URL(path + url.search, targetBase);

  // Check if this is a WebSocket upgrade
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader && upgradeHeader.toLowerCase() === 'websocket') {
    const resp = await fetch(targetUrl.toString(), {
      headers: request.headers,
    });
    return resp;
  }

  // Regular HTTP proxy — connect directly to origin, skip CF proxy loop
  const proxyHeaders = new Headers(request.headers);
  proxyHeaders.delete('Cookie');
  proxyHeaders.set('Host', new URL(targetBase).host);

  const resp = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: proxyHeaders,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  });

  const respHeaders = new Headers(resp.headers);
  respHeaders.delete('Set-Cookie');

  return new Response(resp.body, {
    status: resp.status,
    headers: respHeaders,
  });
}
