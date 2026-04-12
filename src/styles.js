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

.setup-overlay::before {
  content: '';
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(40, 40, 50, 0.8) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 30%, rgba(30, 30, 45, 0.7) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(50, 45, 55, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(35, 35, 50, 0.5) 0%, transparent 55%),
    radial-gradient(ellipse at 30% 20%, rgba(45, 40, 50, 0.4) 0%, transparent 50%);
  filter: blur(80px);
  z-index: -1;
  animation: auroraShift 20s ease-in-out infinite alternate;
}

[data-theme="light"] .setup-overlay::before {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(180, 180, 190, 0.3) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 30%, rgba(160, 160, 175, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(170, 170, 180, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(150, 150, 165, 0.2) 0%, transparent 55%);
}

@keyframes auroraShift {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-3%, 2%) scale(1.05); }
  100% { transform: translate(2%, -2%) scale(1); }
}

.setup-card {
  width: 440px;
  max-width: 90vw;
  background: var(--cd);
  border: 1px solid var(--bd);
  border-radius: 14px;
  padding: 28px;
  animation: fadeIn 0.25s ease;
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

.empty::before {
  content: '';
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(40, 40, 50, 0.8) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 30%, rgba(30, 30, 45, 0.7) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(50, 45, 55, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(35, 35, 50, 0.5) 0%, transparent 55%);
  filter: blur(80px);
  z-index: 0;
  animation: auroraShift 20s ease-in-out infinite alternate;
}

[data-theme="light"] .empty::before {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(180, 180, 190, 0.3) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 30%, rgba(160, 160, 175, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(170, 170, 180, 0.2) 0%, transparent 50%);
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
