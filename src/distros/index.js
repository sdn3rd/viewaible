// Modular distro support — each distro defines its package manager commands.
// Users can add new distros by following this pattern.
// The setup script detects the distro at runtime and uses the right commands.

export const distros = {
  'debian': {
    name: 'Debian / Ubuntu',
    detect: 'command -v apt-get',
    update: 'apt-get update -qq',
    install: 'apt-get install -y -qq',
    packages: 'tmux curl wget nginx openssl',
    nodeSetup: 'curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null 2>&1 && apt-get install -y -qq nodejs',
  },
  'rhel': {
    name: 'RHEL / CentOS / Fedora / Rocky / Alma',
    detect: 'command -v dnf || command -v yum',
    update: '(command -v dnf && dnf check-update || yum check-update) 2>/dev/null || true',
    install: 'command -v dnf &>/dev/null && dnf install -y -q || yum install -y -q',
    packages: 'tmux curl wget nginx openssl',
    nodeSetup: 'curl -fsSL https://rpm.nodesource.com/setup_22.x | bash - >/dev/null 2>&1 && (dnf install -y -q nodejs 2>/dev/null || yum install -y -q nodejs)',
  },
  'arch': {
    name: 'Arch Linux / Manjaro',
    detect: 'command -v pacman',
    update: 'pacman -Sy --noconfirm',
    install: 'pacman -S --noconfirm --needed',
    packages: 'tmux curl wget nginx openssl',
    nodeSetup: 'pacman -S --noconfirm --needed nodejs npm',
  },
  'alpine': {
    name: 'Alpine Linux',
    detect: 'command -v apk',
    update: 'apk update',
    install: 'apk add --no-cache',
    packages: 'tmux curl wget nginx openssl bash',
    nodeSetup: 'apk add --no-cache nodejs npm',
  },
  'suse': {
    name: 'openSUSE / SLES',
    detect: 'command -v zypper',
    update: 'zypper refresh',
    install: 'zypper install -y',
    packages: 'tmux curl wget nginx openssl',
    nodeSetup: 'zypper install -y nodejs22 npm22',
  },
};

// Generate the auto-detect block for the setup script
export function generateDetectBlock() {
  const checks = Object.entries(distros).map(([key, d]) => {
    return `  ${key}) # ${d.name}
    PKG_UPDATE="${d.update}"
    PKG_INSTALL="${d.install}"
    PACKAGES="${d.packages}"
    NODE_SETUP="${d.nodeSetup}"
    ;;`;
  });

  const detects = Object.entries(distros).map(([key, d]) => {
    return `if ${d.detect} &>/dev/null; then DISTRO="${key}"`;
  });

  return `# Auto-detect distro
${detects.join('\nel')}
else
  echo "ERROR: Unsupported distro. See https://github.com/YOUR_ORG/YOUR_REPO for adding support."
  exit 1
fi

echo "  Detected: $DISTRO"

case "$DISTRO" in
${checks.join('\n')}
esac`;
}

// Generate the full setup script
export function generateSetupScript(options = {}) {
  const { ttydPass = '' } = options;

  const credFlag = ttydPass
    ? `--credential user:${ttydPass}`
    : '';

  return `#!/usr/bin/env bash
# ============================================================================
# viewAIble VPS Setup — Auto-generated
# Installs: Node.js 22, Claude Code CLI, ttyd, nginx (SSL reverse proxy)
# ============================================================================
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo ""
echo "============================================"
echo "  viewAIble VPS Setup"
echo "============================================"
echo ""

${generateDetectBlock()}

echo ""
echo "[1/6] System packages..."
$PKG_UPDATE >/dev/null 2>&1
$PKG_INSTALL $PACKAGES >/dev/null 2>&1

echo "[2/6] Node.js 22..."
if ! command -v node &>/dev/null || [[ "$(node -v)" != v22* ]]; then
    eval "$NODE_SETUP" >/dev/null 2>&1
fi
echo "  $(node -v) / npm $(npm -v)"

echo "[3/6] Claude Code CLI..."
npm install -g @anthropic-ai/claude-code >/dev/null 2>&1 || true

echo "[4/6] ttyd..."
systemctl stop claude-terminal.service 2>/dev/null || true
wget -qO /usr/local/bin/ttyd https://github.com/tsl0922/ttyd/releases/latest/download/ttyd.x86_64
chmod +x /usr/local/bin/ttyd

echo "[5/6] Session user + service..."
if ! id "claude" &>/dev/null; then useradd -m -s /bin/bash "claude"; fi
cat > /home/claude/.bash_profile << 'BPEOF'
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
export PATH="$(npm config get prefix 2>/dev/null)/bin:$PATH" 2>/dev/null || true
BPEOF
chmod 600 /home/claude/.bash_profile
chown claude:claude /home/claude/.bash_profile
mkdir -p /home/claude/.claude
echo '{"hasCompletedOnboarding":true}' > /home/claude/.claude.json
chown -R claude:claude /home/claude/.claude /home/claude/.claude.json

cat > /etc/systemd/system/claude-terminal.service << 'SVEOF'
[Unit]
Description=viewAIble Claude Code Terminal
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ttyd --port 7681 ${credFlag} --writable --terminal-type xterm-256color --client-option fontSize=13 --client-option fontFamily='JetBrains Mono,Fira Code,Consolas,monospace' su - claude -c 'claude; exec bash'
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
SVEOF
systemctl daemon-reload
systemctl enable claude-terminal.service >/dev/null 2>&1

echo "[6/6] Nginx SSL proxy..."
mkdir -p /etc/nginx/certs
if [ ! -f /etc/nginx/certs/origin.pem ]; then
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \\
        -keyout /etc/nginx/certs/origin-key.pem \\
        -out /etc/nginx/certs/origin.pem \\
        -subj '/CN=viewaible-terminal' >/dev/null 2>&1
fi
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
systemctl restart nginx
systemctl restart claude-terminal.service

echo ""
echo "============================================"
echo "  Setup complete!"
echo "============================================"
echo ""
echo "  1. Go to https://yourdomain.app"
echo "  2. Click '+ Add VPS' and enter your IP, port, and token"
echo "  3. Run /login in the terminal to authenticate Claude"
echo ""
echo "  Auth: ssh root@<vps> then: su - claude -c 'claude auth login'"
echo "============================================"
`;
}

export const supportedDistros = Object.entries(distros).map(([key, d]) => ({
  id: key,
  name: d.name,
}));
