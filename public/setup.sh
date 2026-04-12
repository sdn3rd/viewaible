#!/usr/bin/env bash
# ============================================================================
# viewAIble VPS Setup — Run this on your VPS
#
#   curl -fsSL https://viewaible.app/setup.sh | bash
#
# Idempotent — safe to re-run. Cleans up previous installs automatically.
# Installs: Node.js 22, Claude Code CLI, ttyd, nginx, UFW firewall
# ============================================================================
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo ""
echo "============================================"
echo "  viewAIble VPS Setup"
echo "============================================"
echo ""

# ── Detect OS ──────────────────────────────────────────────────────────────
if ! command -v apt-get &>/dev/null; then
    echo "ERROR: This script requires a Debian/Ubuntu VPS."
    echo "See https://github.com/sdn3rd/viewaible for other distros."
    exit 1
fi

# ── Cleanup from previous runs ────────────────────────────────────────────
echo "[0/7] Cleaning up previous install..."
systemctl stop claude-terminal.service 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true
# Flush old iptables rules for 7681
iptables -D INPUT -p tcp --dport 7681 -j DROP 2>/dev/null || true
iptables -D INPUT -p tcp --dport 7681 -s 127.0.0.1 -j ACCEPT 2>/dev/null || true
echo "  done"

# ── 1. System packages ───────────────────────────────────────────────────
echo "[1/7] System packages..."
apt-get update -qq
apt-get install -y -qq tmux curl wget nginx openssl ufw >/dev/null 2>&1
echo "  done"

# ── 2. Node.js 22 ────────────────────────────────────────────────────────
echo "[2/7] Node.js 22..."
if ! command -v node &>/dev/null || [[ "$(node -v)" != v22* ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x 2>/dev/null | bash - >/dev/null 2>&1
    apt-get install -y -qq nodejs >/dev/null 2>&1
fi
echo "  $(node -v) / npm $(npm -v)"

# ── 3. Claude Code CLI ──────────────────────────────────────────────────
echo "[3/7] Claude Code CLI..."
npm install -g @anthropic-ai/claude-code >/dev/null 2>&1 || true
echo "  $(claude --version 2>/dev/null || echo 'installed')"

# ── 4. ttyd ──────────────────────────────────────────────────────────────
echo "[4/7] ttyd..."
wget -qO /usr/local/bin/ttyd https://github.com/tsl0922/ttyd/releases/latest/download/ttyd.x86_64
chmod +x /usr/local/bin/ttyd

# ── 5. Session user + service ────────────────────────────────────
echo "[5/7] Session user + service..."
if ! id "claude" &>/dev/null; then
    useradd -m -s /bin/bash "claude"
fi

# Generate a strong random password for ttyd auth
TTYD_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 20)
TTYD_USER="claude"
echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │  Terminal Credentials (SAVE THESE)       │"
echo "  │                                          │"
echo "  │  User: $TTYD_USER"
echo "  │  Pass: $TTYD_PASS"
echo "  │                                          │"
echo "  │  You'll need these to connect via        │"
echo "  │  viewAIble. The browser will prompt.     │"
echo "  └─────────────────────────────────────────┘"
echo ""

cat > /home/claude/.bash_profile << 'BPEOF'
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
export PATH="$(npm config get prefix 2>/dev/null)/bin:$PATH" 2>/dev/null || true
BPEOF
chmod 600 /home/claude/.bash_profile
chown claude:claude /home/claude/.bash_profile

mkdir -p /home/claude/.claude
echo '{"hasCompletedOnboarding":true}' > /home/claude/.claude.json
chown -R claude:claude /home/claude/.claude /home/claude/.claude.json

# ttyd launches a fresh Claude session per browser connection.
# Auth is REQUIRED — without it anyone on Cloudflare's network could connect.
cat > /etc/systemd/system/claude-terminal.service << SVEOF
[Unit]
Description=viewAIble Claude Code Terminal
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ttyd \\
    --port 7681 \\
    --credential ${TTYD_USER}:${TTYD_PASS} \\
    --writable \\
    --terminal-type xterm-256color \\
    --client-option fontSize=13 \\
    --client-option fontFamily='JetBrains Mono,Fira Code,Consolas,monospace' \\
    su - claude -c 'claude; exec bash'
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
SVEOF

systemctl daemon-reload
systemctl enable claude-terminal.service >/dev/null 2>&1

# ── 6. Nginx reverse proxy with self-signed cert ────────────────────────
echo "[6/7] Nginx SSL proxy..."
mkdir -p /etc/nginx/certs

# Always regenerate cert (idempotent)
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/origin-key.pem \
    -out /etc/nginx/certs/origin.pem \
    -subj '/CN=viewaible-terminal' >/dev/null 2>&1

cat > /etc/nginx/sites-available/viewaible << 'NGEOF'
server {
    listen 443 ssl;
    server_name _;

    ssl_certificate     /etc/nginx/certs/origin.pem;
    ssl_certificate_key /etc/nginx/certs/origin-key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://127.0.0.1:7681;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
NGEOF

ln -sf /etc/nginx/sites-available/viewaible /etc/nginx/sites-enabled/viewaible 2>/dev/null || true
rm -f /etc/nginx/sites-enabled/default
nginx -t 2>/dev/null

# ── 7. UFW Firewall ─────────────────────────────────────────────────────
echo "[7/7] UFW firewall..."

# Reset UFW to clean state (keep SSH!)
ufw --force reset >/dev/null 2>&1

# SSH — open to everywhere
ufw allow 22/tcp >/dev/null 2>&1

# HTTPS (443) — Cloudflare IPs only
# Cloudflare IPv4 ranges: https://www.cloudflare.com/ips-v4
for ip in \
    173.245.48.0/20 \
    103.21.244.0/22 \
    103.22.200.0/22 \
    103.31.4.0/22 \
    141.101.64.0/18 \
    108.162.192.0/18 \
    190.93.240.0/20 \
    188.114.96.0/20 \
    197.234.240.0/22 \
    198.41.128.0/17 \
    162.158.0.0/15 \
    104.16.0.0/13 \
    104.24.0.0/14 \
    172.64.0.0/13 \
    131.0.72.0/22; do
    ufw allow from "$ip" to any port 443 proto tcp >/dev/null 2>&1
done

# ttyd (7681) — Cloudflare IPs + localhost (Worker connects here directly)
ufw allow from 127.0.0.1 to any port 7681 proto tcp >/dev/null 2>&1
for ip in \
    173.245.48.0/20 \
    103.21.244.0/22 \
    103.22.200.0/22 \
    103.31.4.0/22 \
    141.101.64.0/18 \
    108.162.192.0/18 \
    190.93.240.0/20 \
    188.114.96.0/20 \
    197.234.240.0/22 \
    198.41.128.0/17 \
    162.158.0.0/15 \
    104.16.0.0/13 \
    104.24.0.0/14 \
    172.64.0.0/13 \
    131.0.72.0/22; do
    ufw allow from "$ip" to any port 7681 proto tcp >/dev/null 2>&1
done

# Enable UFW
ufw default deny incoming >/dev/null 2>&1
ufw default allow outgoing >/dev/null 2>&1
ufw --force enable >/dev/null 2>&1

echo "  SSH: open everywhere"
echo "  443: Cloudflare IPs only"
echo "  7681: Cloudflare IPs + localhost only"

# ── Start services ───────────────────────────────────────────────────────
systemctl restart nginx
systemctl restart claude-terminal.service

# ── Verify ───────────────────────────────────────────────────────────────
echo ""
TTYD_OK="no"
NGINX_OK="no"
systemctl is-active --quiet claude-terminal.service && TTYD_OK="yes"
systemctl is-active --quiet nginx && NGINX_OK="yes"

echo "============================================"
echo "  viewAIble VPS Setup Complete"
echo "============================================"
echo ""
echo "  Services:"
echo "    ttyd:  $TTYD_OK"
echo "    nginx: $NGINX_OK"
echo ""
VPS_IP=$(curl -s4 ifconfig.me)

echo "  Firewall:"
echo "    SSH (22):   open"
echo "    HTTPS (443): Cloudflare only"
echo "    ttyd (7681): Cloudflare IPs + localhost only"
echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │  Connect in viewAIble:                   │"
echo "  │                                          │"
echo "  │  Hostname:  $VPS_IP"
echo "  ���  Port:      7681                         │"
echo "  ��                                          │"
echo "  │  Or use a DNS name (grey cloud in CF):   │"
echo "  │  Hostname:  vps.yourdomain.com           │"
echo "  │  Port:      7681                         │"
echo "  └─────��──────────────────────────────��────┘"
echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │  Terminal Auth (browser will prompt):   │"
echo "  │                                         │"
echo "  │  User: $TTYD_USER"
echo "  │  Pass: $TTYD_PASS"
echo "  └─────────────────────────────────────────┘"
echo ""
echo "  Go to: https://yourdomain.com"
echo "  Click '+ Add VPS' and enter hostname + port."
echo "  Browser will prompt for the credentials above."
echo ""
echo "  Claude auth: type /login in the terminal."
echo ""
echo "============================================"
