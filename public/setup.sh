#!/usr/bin/env bash
# ============================================================================
# pAIne VPS Setup — Run this on your VPS
#
#   curl -fsSL https://paine.pages.dev/setup.sh | bash
#
# Installs: Node.js 22, Claude Code CLI, ttyd, nginx (SSL reverse proxy)
# After: Point a Cloudflare DNS record at this VPS, then connect via pAIne.
# ============================================================================
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo ""
echo "============================================"
echo "  pAIne VPS Setup"
echo "============================================"
echo ""

# ── Detect OS ──────────────────────────────────────────────────────────────
if ! command -v apt-get &>/dev/null; then
    echo "ERROR: This script requires a Debian/Ubuntu VPS."
    exit 1
fi

# ── 1. System packages ────────────────────────────────────────────────────
echo "[1/6] System packages..."
apt-get update -qq
apt-get install -y -qq tmux curl wget nginx openssl >/dev/null 2>&1
echo "  done"

# ── 2. Node.js 22 ────────────────────────────────────────────────────────
echo "[2/6] Node.js 22..."
if ! command -v node &>/dev/null || [[ "$(node -v)" != v22* ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x 2>/dev/null | bash - >/dev/null 2>&1
    apt-get install -y -qq nodejs >/dev/null 2>&1
fi
echo "  $(node -v) / npm $(npm -v)"

# ── 3. Claude Code CLI ───────────────────────────────────────────────────
echo "[3/6] Claude Code CLI..."
npm install -g @anthropic-ai/claude-code >/dev/null 2>&1 || true
echo "  $(claude --version 2>/dev/null || echo 'installed')"

# ── 4. ttyd ───────────────────────────────────────────────────────────────
echo "[4/6] ttyd..."
systemctl stop claude-terminal.service 2>/dev/null || true
wget -qO /usr/local/bin/ttyd https://github.com/tsl0922/ttyd/releases/latest/download/ttyd.x86_64
chmod +x /usr/local/bin/ttyd

# ── 5. Create session user + systemd service ─────────────────────────────
echo "[5/6] Session user + service..."
if ! id "claude" &>/dev/null; then
    useradd -m -s /bin/bash "claude"
fi

cat > /home/claude/.bash_profile << 'BPEOF'
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
export PATH="$(npm config get prefix 2>/dev/null)/bin:$PATH" 2>/dev/null || true
BPEOF
chmod 600 /home/claude/.bash_profile
chown claude:claude /home/claude/.bash_profile

mkdir -p /home/claude/.claude
echo '{"hasCompletedOnboarding":true}' > /home/claude/.claude.json
chown -R claude:claude /home/claude/.claude /home/claude/.claude.json

# Prompt for ttyd password
TTYD_PASS=""
if [[ -t 0 ]]; then
    read -rp "  Set a ttyd password (leave empty for none): " TTYD_PASS
fi

CRED_FLAG=""
if [[ -n "$TTYD_PASS" ]]; then
    CRED_FLAG="--credential claude:$TTYD_PASS"
fi

cat > /etc/systemd/system/claude-terminal.service << SVEOF
[Unit]
Description=pAIne Claude Code Terminal
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ttyd \\
    --port 7681 \\
    $CRED_FLAG \\
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

# ── 6. Nginx reverse proxy with self-signed cert ─────────────────────────
echo "[6/6] Nginx SSL proxy..."
mkdir -p /etc/nginx/certs
if [[ ! -f /etc/nginx/certs/origin.pem ]]; then
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout /etc/nginx/certs/origin-key.pem \
        -out /etc/nginx/certs/origin.pem \
        -subj '/CN=paine-terminal' >/dev/null 2>&1
fi

cat > /etc/nginx/sites-available/paine << 'NGEOF'
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

ln -sf /etc/nginx/sites-available/paine /etc/nginx/sites-enabled/paine
rm -f /etc/nginx/sites-enabled/default

# Start services
systemctl restart nginx
systemctl restart claude-terminal.service

echo ""
echo "============================================"
echo "  pAIne VPS Setup Complete"
echo "============================================"
echo ""
echo "  Next steps:"
echo "  1. Point a Cloudflare DNS record at this VPS IP"
echo "  2. Set Cloudflare SSL mode to 'Full'"
echo "  3. Go to https://paine.pages.dev"
echo "  4. Enter your domain as the terminal URL"
echo ""
echo "  ttyd is on port 7681 (direct)"
echo "  nginx proxies port 443 (SSL)"
echo ""
echo "  To authenticate Claude Code:"
echo "    ssh root@<this-vps>"
echo "    su - claude -c 'claude auth login'"
echo ""
echo "============================================"
