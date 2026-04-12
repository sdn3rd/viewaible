#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PROJECT="viewaible"
ACCOUNT_ID="1958a44c637f9061a6cf574141164146"
export CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID"

echo ""
echo "============================================"
echo "  viewAIble Deploy"
echo "============================================"
echo ""

# ── 1. Pre-flight checks ──────────────────────────────────────────────���────

echo "[1/4] Pre-flight checks..."

if [[ ! -f "wrangler.toml" ]]; then
    echo "  ERROR: wrangler.toml not found"
    exit 1
fi
echo "  wrangler.toml ✓"

if [[ ! -f "src/App.jsx" ]]; then
    echo "  ERROR: src/App.jsx not found"
    exit 1
fi
echo "  src/App.jsx ✓"

if ! npx wrangler whoami &>/dev/null; then
    echo "  ERROR: Not logged in to Wrangler"
    echo "  Run: npx wrangler login"
    exit 1
fi
echo "  Wrangler auth ✓"

VERSION=$(node -p "require('./src/version.js').VERSION" 2>/dev/null || grep -oP "VERSION = '\\K[^']+" src/version.js)
echo "  Version: $VERSION"
echo ""

# ── 2. Dependencies ────────────────────────────────────────────────────────

echo "[2/4] Dependencies..."
if [[ ! -d "node_modules" ]]; then
    npm install
else
    echo "  node_modules ✓"
fi
echo ""

# ── 3. Build ───────────────────────────────────────────────────────────────

echo "[3/4] Build..."
rm -rf dist/
npx vite build
FILE_COUNT=$(find dist -type f | wc -l | tr -d ' ')
echo "  $FILE_COUNT files in dist/"
echo ""

# ── 4. Deploy ──────────────────────────────────────────────────────────────

echo "[4/4] Deploy..."
npx wrangler pages deploy dist \
    --project-name "$PROJECT" \
    --commit-dirty=true

echo ""
echo "============================================"
echo "  Deployed viewAIble v$VERSION"
echo "  https://viewaible.app"
echo "============================================"
