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
.app {
  display: flex;
  height: 100vh;
  background: #050510;
  position: relative;
  overflow: hidden;
}

/* App-level constellation + blobs behind everything */
.app::before {
  content: '';
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(ellipse at 30% 30%, rgba(4, 4, 12, 0.95) 0%, transparent 35%),
    radial-gradient(ellipse at 70% 70%, rgba(3, 3, 10, 0.9) 0%, transparent 40%),
    radial-gradient(circle at 25% 60%, rgba(3, 12, 60, 0.5) 0%, transparent 40%),
    radial-gradient(circle at 75% 35%, rgba(8, 30, 80, 0.4) 0%, transparent 35%),
    radial-gradient(circle at 50% 80%, rgba(2, 8, 40, 0.45) 0%, transparent 40%);
  filter: blur(60px);
  z-index: 0;
  animation: lavaLamp 25s ease-in-out infinite alternate;
}

.app::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cline x1='50' y1='75' x2='200' y2='150' stroke='rgba(255,255,255,0.08)' stroke-width='0.5'/%3E%3Cline x1='200' y1='150' x2='350' y2='100' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='350' y1='100' x2='450' y2='200' stroke='rgba(255,255,255,0.07)' stroke-width='0.5'/%3E%3Cline x1='200' y1='150' x2='250' y2='300' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='250' y1='300' x2='400' y2='350' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='100' y1='400' x2='250' y2='300' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='80' y1='250' x2='250' y2='300' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='75' r='2' fill='white' opacity='0.7'/%3E%3Ccircle cx='50' cy='75' r='5' fill='white' opacity='0.1'/%3E%3Ccircle cx='200' cy='150' r='2.5' fill='white' opacity='0.8'/%3E%3Ccircle cx='200' cy='150' r='6' fill='white' opacity='0.12'/%3E%3Ccircle cx='350' cy='100' r='2' fill='white' opacity='0.6'/%3E%3Ccircle cx='350' cy='100' r='5' fill='white' opacity='0.08'/%3E%3Ccircle cx='450' cy='200' r='1.5' fill='white' opacity='0.5'/%3E%3Ccircle cx='250' cy='300' r='2.5' fill='white' opacity='0.75'/%3E%3Ccircle cx='250' cy='300' r='6' fill='white' opacity='0.1'/%3E%3Ccircle cx='400' cy='350' r='1.8' fill='white' opacity='0.55'/%3E%3Ccircle cx='80' cy='250' r='1.5' fill='white' opacity='0.45'/%3E%3Ccircle cx='100' cy='400' r='2' fill='white' opacity='0.6'/%3E%3Ccircle cx='420' cy='50' r='1.5' fill='white' opacity='0.5'/%3E%3Ccircle cx='150' cy='50' r='1' fill='white' opacity='0.3'/%3E%3Ccircle cx='300' cy='250' r='1' fill='white' opacity='0.25'/%3E%3Ccircle cx='470' cy='130' r='1' fill='white' opacity='0.3'/%3E%3Ccircle cx='30' cy='180' r='0.8' fill='white' opacity='0.2'/%3E%3Ccircle cx='450' cy='450' r='2' fill='white' opacity='0.5'/%3E%3C/svg%3E");
  background-size: 500px 500px;
  animation: constellationDrift 80s linear infinite;
}

.app > * { position: relative; z-index: 1; }

.sidebar {
  width: 260px;
  min-width: 260px;
  background: rgba(10, 10, 20, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
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
  background: rgba(10, 10, 20, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
  background: #050510;
  overflow: hidden;
}

/* Starfield behind terminals */
.terminal-frame::before {
  content: '';
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(ellipse at 30% 30%, rgba(8, 8, 20, 0.9) 0%, transparent 35%),
    radial-gradient(ellipse at 70% 70%, rgba(5, 5, 15, 0.85) 0%, transparent 40%),
    radial-gradient(circle at 25% 60%, rgba(5, 25, 120, 0.5) 0%, transparent 40%),
    radial-gradient(circle at 75% 35%, rgba(15, 60, 150, 0.4) 0%, transparent 35%),
    radial-gradient(circle at 50% 80%, rgba(3, 15, 70, 0.45) 0%, transparent 40%);
  filter: blur(60px);
  z-index: 0;
  animation: lavaLamp 25s ease-in-out infinite alternate;
}

.terminal-frame::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cline x1='50' y1='75' x2='200' y2='150' stroke='rgba(255,255,255,0.08)' stroke-width='0.5'/%3E%3Cline x1='200' y1='150' x2='350' y2='100' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='350' y1='100' x2='450' y2='200' stroke='rgba(255,255,255,0.07)' stroke-width='0.5'/%3E%3Cline x1='200' y1='150' x2='250' y2='300' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='250' y1='300' x2='400' y2='350' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='100' y1='400' x2='250' y2='300' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='75' r='2' fill='white' opacity='0.7'/%3E%3Ccircle cx='50' cy='75' r='5' fill='white' opacity='0.1'/%3E%3Ccircle cx='200' cy='150' r='2.5' fill='white' opacity='0.8'/%3E%3Ccircle cx='200' cy='150' r='6' fill='white' opacity='0.12'/%3E%3Ccircle cx='350' cy='100' r='2' fill='white' opacity='0.6'/%3E%3Ccircle cx='350' cy='100' r='5' fill='white' opacity='0.08'/%3E%3Ccircle cx='450' cy='200' r='1.5' fill='white' opacity='0.5'/%3E%3Ccircle cx='250' cy='300' r='2.5' fill='white' opacity='0.75'/%3E%3Ccircle cx='250' cy='300' r='6' fill='white' opacity='0.1'/%3E%3Ccircle cx='400' cy='350' r='1.8' fill='white' opacity='0.55'/%3E%3Ccircle cx='100' cy='400' r='2' fill='white' opacity='0.6'/%3E%3Ccircle cx='420' cy='50' r='1.5' fill='white' opacity='0.5'/%3E%3Ccircle cx='150' cy='50' r='1' fill='white' opacity='0.3'/%3E%3Ccircle cx='300' cy='250' r='1' fill='white' opacity='0.25'/%3E%3Ccircle cx='470' cy='130' r='1' fill='white' opacity='0.3'/%3E%3Ccircle cx='30' cy='180' r='0.8' fill='white' opacity='0.2'/%3E%3C/svg%3E");
  background-size: 500px 500px;
  animation: constellationDrift 80s linear infinite;
}

.terminal-frame iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: rgba(0, 0, 0, 0.95);
  position: relative;
  z-index: 1;
}

/* ── Setup wizard ────────────────────────────────────────────── */
.setup-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050510;
  z-index: 20;
  overflow: hidden;
}

[data-theme="light"] .setup-overlay {
  background: #e8eaf0;
}

/* Lava lamp blobs — matches terminal area darkness */
.setup-overlay::before,
.empty::before {
  content: '';
  position: absolute;
  inset: -40%;
  background:
    /* Dark clouds */
    radial-gradient(ellipse at 30% 30%, rgba(8, 8, 20, 0.9) 0%, transparent 35%),
    radial-gradient(ellipse at 70% 70%, rgba(5, 5, 15, 0.85) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 50%, rgba(10, 10, 25, 0.7) 0%, transparent 30%),
    /* Blue blobs — dark, subtle */
    radial-gradient(circle at 25% 60%, rgba(3, 12, 60, 0.5) 0%, transparent 40%),
    radial-gradient(circle at 75% 35%, rgba(8, 30, 80, 0.4) 0%, transparent 35%),
    radial-gradient(circle at 50% 80%, rgba(2, 8, 40, 0.45) 0%, transparent 40%);
  filter: blur(60px);
  z-index: -1;
  animation: lavaLamp 25s ease-in-out infinite alternate;
}

[data-theme="light"] .setup-overlay::before,
[data-theme="light"] .empty::before {
  background:
    radial-gradient(circle at 20% 40%, rgba(80, 130, 240, 0.3) 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(100, 160, 250, 0.25) 0%, transparent 35%),
    radial-gradient(circle at 60% 80%, rgba(60, 100, 200, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 85% 60%, rgba(120, 180, 255, 0.18) 0%, transparent 35%);
}

/* Constellation: glowing stars + connecting lines */
.setup-overlay::after,
.empty::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3C!-- Lines --%3E%3Cline x1='50' y1='75' x2='200' y2='150' stroke='rgba(255,255,255,0.08)' stroke-width='0.5'/%3E%3Cline x1='200' y1='150' x2='350' y2='100' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='350' y1='100' x2='450' y2='200' stroke='rgba(255,255,255,0.07)' stroke-width='0.5'/%3E%3Cline x1='200' y1='150' x2='250' y2='300' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='250' y1='300' x2='400' y2='350' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='100' y1='400' x2='250' y2='300' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='50' y1='75' x2='80' y2='250' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='80' y1='250' x2='250' y2='300' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='350' y1='100' x2='420' y2='50' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='400' y1='350' x2='450' y2='450' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='100' y1='400' x2='50' y2='450' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E%3C!-- Stars (bright dots with glow) --%3E%3Ccircle cx='50' cy='75' r='2' fill='white' opacity='0.7'/%3E%3Ccircle cx='50' cy='75' r='5' fill='white' opacity='0.1'/%3E%3Ccircle cx='200' cy='150' r='2.5' fill='white' opacity='0.8'/%3E%3Ccircle cx='200' cy='150' r='6' fill='white' opacity='0.12'/%3E%3Ccircle cx='350' cy='100' r='2' fill='white' opacity='0.6'/%3E%3Ccircle cx='350' cy='100' r='5' fill='white' opacity='0.08'/%3E%3Ccircle cx='450' cy='200' r='1.5' fill='white' opacity='0.5'/%3E%3Ccircle cx='450' cy='200' r='4' fill='white' opacity='0.08'/%3E%3Ccircle cx='250' cy='300' r='2.5' fill='white' opacity='0.75'/%3E%3Ccircle cx='250' cy='300' r='6' fill='white' opacity='0.1'/%3E%3Ccircle cx='400' cy='350' r='1.8' fill='white' opacity='0.55'/%3E%3Ccircle cx='400' cy='350' r='4' fill='white' opacity='0.08'/%3E%3Ccircle cx='80' cy='250' r='1.5' fill='white' opacity='0.45'/%3E%3Ccircle cx='80' cy='250' r='4' fill='white' opacity='0.07'/%3E%3Ccircle cx='100' cy='400' r='2' fill='white' opacity='0.6'/%3E%3Ccircle cx='100' cy='400' r='5' fill='white' opacity='0.09'/%3E%3Ccircle cx='420' cy='50' r='1.5' fill='white' opacity='0.5'/%3E%3Ccircle cx='420' cy='50' r='4' fill='white' opacity='0.07'/%3E%3Ccircle cx='450' cy='450' r='2' fill='white' opacity='0.5'/%3E%3Ccircle cx='450' cy='450' r='5' fill='white' opacity='0.08'/%3E%3Ccircle cx='50' cy='450' r='1.5' fill='white' opacity='0.4'/%3E%3C!-- Dim scattered stars --%3E%3Ccircle cx='150' cy='50' r='1' fill='white' opacity='0.3'/%3E%3Ccircle cx='300' cy='250' r='1' fill='white' opacity='0.25'/%3E%3Ccircle cx='470' cy='130' r='1' fill='white' opacity='0.3'/%3E%3Ccircle cx='30' cy='180' r='0.8' fill='white' opacity='0.2'/%3E%3Ccircle cx='320' cy='430' r='1' fill='white' opacity='0.25'/%3E%3Ccircle cx='180' cy='380' r='0.8' fill='white' opacity='0.2'/%3E%3Ccircle cx='480' cy='320' r='1' fill='white' opacity='0.2'/%3E%3Ccircle cx='270' cy='30' r='0.8' fill='white' opacity='0.25'/%3E%3C/svg%3E");
  background-size: 500px 500px;
  animation: constellationDrift 80s linear infinite;
}

[data-theme="light"] .setup-overlay::after,
[data-theme="light"] .empty::after {
  opacity: 0.3;
  filter: invert(1);
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
    rgba(22, 22, 37, 0.18);
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
