export const CSS = `
/* Fonts loaded via <link> in index.html for reliability */

/* ── Dark theme (default) ───────────────────────────────────── */
[data-theme="dark"] {
  --bg: #0B0B14;
  --bg2: #10101C;
  --cd: #161625;
  --cd2: #1E1E32;
  --bd: #252540;
  --tx: #E8E8F0;
  --tx2: #8888AA;
  --tx3: #555570;
  --gold: #D4AF37;
  --gold2: #F0D060;
  --red: #E74C3C;
  --green: #2ECC71;
  --ac: var(--gold);
}

/* ── Light theme ────────────────────────────────────────────── */
[data-theme="light"] {
  --bg: #F5F5F7;
  --bg2: #EBEBEF;
  --cd: #FFFFFF;
  --cd2: #F0F0F4;
  --bd: #D0D0DA;
  --tx: #1A1A2E;
  --tx2: #555566;
  --tx3: #888899;
  --gold: #B8941F;
  --gold2: #D4AF37;
  --red: #C0392B;
  --green: #27AE60;
  --ac: var(--gold);
}

:root {
  --fd: 'Orbitron', sans-serif;
  --fb: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  --radius: 10px;
  --transition: 0.2s ease;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body, #root {
  height: 100%;
  width: 100%;
  background: var(--bg);
  color: var(--tx);
  font-family: var(--fb);
  overflow: hidden;
  transition: background var(--transition), color var(--transition);
}

/* ── Layout ──────────────────────────────────────────────────── */
.app { display: flex; height: 100vh; }

.sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--bg2);
  border-right: 1px solid var(--bd);
  display: flex;
  flex-direction: column;
  z-index: 10;
  transition: background var(--transition), border-color var(--transition);
}

.sidebar-header {
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--bd);
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-header h1 {
  font-family: var(--fd);
  font-size: 14px;
  font-weight: 500;
  color: var(--tx2);
  letter-spacing: 4px;
  text-transform: uppercase;
}

.sidebar-header h1 span {
  color: var(--gold);
  font-weight: 900;
}

.vps-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.vps-item {
  padding: 10px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background var(--transition);
  margin-bottom: 2px;
}

.vps-item:hover { background: var(--cd); }
.vps-item.active { background: var(--cd2); border: 1px solid var(--bd); }

.vps-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tx3);
  flex-shrink: 0;
}
.vps-dot.connected { background: var(--green); }

.vps-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--tx);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vps-host {
  font-size: 11px;
  color: var(--tx3);
}

.sidebar-footer {
  padding: 10px 12px;
  border-top: 1px solid var(--bd);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ── Buttons ─────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 16px;
  border: none;
  border-radius: var(--radius);
  font-family: var(--fb);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
}

.btn-gold {
  background: var(--gold);
  color: #0B0B14;
}
.btn-gold:hover { background: var(--gold2); }

.btn-ghost {
  background: transparent;
  color: var(--tx2);
  border: 1px solid var(--bd);
}
.btn-ghost:hover { background: var(--cd); color: var(--tx); }

.btn-sm { padding: 6px 12px; font-size: 12px; }
.btn-full { width: 100%; }

/* ── Main content ────────────────────────────────────────────── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.terminal-bar {
  height: 38px;
  background: var(--bg2);
  border-bottom: 1px solid var(--bd);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  font-size: 12px;
  color: var(--tx2);
  transition: background var(--transition), border-color var(--transition);
}

.terminal-bar .status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.terminal-frame {
  flex: 1;
  position: relative;
}

.terminal-frame iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
}

/* ── Setup wizard ────────────────────────────────────────────── */
.setup-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  z-index: 20;
  overflow: hidden;
}

/* Lava lamp blobs — blue gradients */
.setup-overlay::before,
.empty::before {
  content: '';
  position: absolute;
  inset: -60%;
  background:
    radial-gradient(ellipse at 25% 45%, rgba(20, 60, 140, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse at 75% 25%, rgba(40, 100, 180, 0.5) 0%, transparent 45%),
    radial-gradient(ellipse at 55% 75%, rgba(15, 40, 100, 0.55) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 65%, rgba(60, 130, 200, 0.35) 0%, transparent 45%),
    radial-gradient(ellipse at 15% 20%, rgba(30, 80, 160, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 90%, rgba(10, 30, 80, 0.5) 0%, transparent 55%);
  filter: blur(90px);
  z-index: -1;
  animation: lavaLamp 25s ease-in-out infinite alternate;
}

[data-theme="light"] .setup-overlay::before,
[data-theme="light"] .empty::before {
  background:
    radial-gradient(ellipse at 25% 45%, rgba(100, 150, 220, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 75% 25%, rgba(120, 170, 230, 0.18) 0%, transparent 45%),
    radial-gradient(ellipse at 55% 75%, rgba(80, 130, 200, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 65%, rgba(140, 180, 240, 0.12) 0%, transparent 45%);
}

/* Constellation dots overlay */
.setup-overlay::after,
.empty::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.15;
  background-image:
    radial-gradient(circle at 10% 15%, #fff 1px, transparent 1px),
    radial-gradient(circle at 25% 60%, #fff 0.8px, transparent 0.8px),
    radial-gradient(circle at 40% 30%, #fff 1.2px, transparent 1.2px),
    radial-gradient(circle at 55% 80%, #fff 0.6px, transparent 0.6px),
    radial-gradient(circle at 70% 20%, #fff 1px, transparent 1px),
    radial-gradient(circle at 85% 55%, #fff 0.8px, transparent 0.8px),
    radial-gradient(circle at 15% 85%, #fff 1px, transparent 1px),
    radial-gradient(circle at 45% 50%, #fff 0.7px, transparent 0.7px),
    radial-gradient(circle at 65% 45%, #fff 1.1px, transparent 1.1px),
    radial-gradient(circle at 90% 80%, #fff 0.9px, transparent 0.9px),
    radial-gradient(circle at 30% 10%, #fff 0.8px, transparent 0.8px),
    radial-gradient(circle at 78% 90%, #fff 1px, transparent 1px),
    radial-gradient(circle at 50% 15%, #fff 0.6px, transparent 0.6px),
    radial-gradient(circle at 20% 40%, #fff 1px, transparent 1px),
    radial-gradient(circle at 92% 35%, #fff 0.7px, transparent 0.7px);
  background-size: 400px 400px;
  animation: constellationDrift 60s linear infinite;
}

[data-theme="light"] .setup-overlay::after,
[data-theme="light"] .empty::after {
  opacity: 0.06;
  background-image:
    radial-gradient(circle at 10% 15%, #000 1px, transparent 1px),
    radial-gradient(circle at 25% 60%, #000 0.8px, transparent 0.8px),
    radial-gradient(circle at 40% 30%, #000 1.2px, transparent 1.2px),
    radial-gradient(circle at 55% 80%, #000 0.6px, transparent 0.6px),
    radial-gradient(circle at 70% 20%, #000 1px, transparent 1px),
    radial-gradient(circle at 85% 55%, #000 0.8px, transparent 0.8px),
    radial-gradient(circle at 15% 85%, #000 1px, transparent 1px),
    radial-gradient(circle at 45% 50%, #000 0.7px, transparent 0.7px),
    radial-gradient(circle at 65% 45%, #000 1.1px, transparent 1.1px),
    radial-gradient(circle at 90% 80%, #000 0.9px, transparent 0.9px);
  background-size: 400px 400px;
}

@keyframes lavaLamp {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(-4%, 3%) scale(1.06) rotate(1deg); }
  66% { transform: translate(3%, -2%) scale(0.97) rotate(-1deg); }
  100% { transform: translate(-1%, 4%) scale(1.03) rotate(0.5deg); }
}

@keyframes constellationDrift {
  0% { background-position: 0 0; }
  100% { background-position: 400px 400px; }
}

.setup-card {
  width: 440px;
  max-width: 90vw;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.03) 100%),
    rgba(22, 22, 37, 0.72);
  backdrop-filter: blur(24px) saturate(1.3);
  -webkit-backdrop-filter: blur(24px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.15);
  border-left-color: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  animation: fadeIn 0.25s ease;
}

[data-theme="light"] .setup-card {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%),
    rgba(255, 255, 255, 0.6);
  border-color: rgba(0, 0, 0, 0.08);
  border-top-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.5);
}

.setup-card h2 {
  font-family: var(--fd);
  font-size: 16px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.setup-card p {
  font-size: 13px;
  color: var(--tx2);
  margin-bottom: 20px;
  line-height: 1.5;
}

.field { margin-bottom: 14px; }

.field label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--tx2);
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 9px 12px;
  background: var(--bg);
  border: 1px solid var(--bd);
  border-radius: var(--radius);
  color: var(--tx);
  font-family: var(--fb);
  font-size: 13px;
  outline: none;
  transition: border-color var(--transition), background var(--transition);
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: var(--gold);
}

.field .hint {
  font-size: 11px;
  color: var(--tx3);
  margin-top: 4px;
}

.field-row { display: flex; gap: 10px; }
.field-row .field { flex: 1; }

.setup-actions { display: flex; gap: 8px; margin-top: 20px; }

/* ── Settings panel ──────────────────────────────────────────── */
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.15s ease;
}

.settings-panel {
  width: 480px;
  max-width: 92vw;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--cd);
  border: 1px solid var(--bd);
  border-radius: 14px;
  padding: 28px;
  animation: fadeIn 0.2s ease;
}

.settings-panel h2 {
  font-family: var(--fd);
  font-size: 14px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.settings-section {
  margin-bottom: 20px;
}

.settings-section h3 {
  font-size: 11px;
  font-weight: 600;
  color: var(--tx3);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.preset-btn {
  padding: 10px 8px;
  border-radius: var(--radius);
  border: 1px solid var(--bd);
  cursor: pointer;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--fb);
  transition: all var(--transition);
}
.preset-btn:hover { border-color: var(--gold); }
.preset-btn.active { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold); }

.color-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.color-row label {
  font-size: 12px;
  color: var(--tx2);
  width: 100px;
  flex-shrink: 0;
}

.color-row input[type="color"] {
  width: 36px;
  height: 28px;
  border: 1px solid var(--bd);
  border-radius: 6px;
  padding: 2px;
  background: var(--bg);
  cursor: pointer;
}

/* ── Empty state ─────────────────────────────────────────────── */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--tx3);
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.empty > * { position: relative; z-index: 1; }

.empty svg { opacity: 0.25; }

.empty p {
  font-size: 13px;
  max-width: 280px;
  text-align: center;
  line-height: 1.6;
}

/* ── Scrollbar ───────────────────────────────────────────────── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bd); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--tx3); }

/* ── Animations ──────────────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
