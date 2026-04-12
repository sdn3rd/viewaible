export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap');

:root {
  --bg: #0B0B14;
  --bg2: #12121F;
  --cd: #1A1A2E;
  --cd2: #222240;
  --bd: #2A2A45;
  --tx: #E8E8F0;
  --tx2: #8888AA;
  --tx3: #555570;
  --gold: #D4AF37;
  --gold2: #F0D060;
  --red: #C0392B;
  --green: #2ECC71;
  --fd: 'Cinzel', serif;
  --fb: 'Source Sans 3', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body, #root {
  height: 100%;
  width: 100%;
  background: var(--bg);
  color: var(--tx);
  font-family: var(--fb);
  overflow: hidden;
}

/* Layout */
.app { display: flex; height: 100vh; }

.sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--bg2);
  border-right: 1px solid var(--bd);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.sidebar-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--bd);
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-header h1 {
  font-family: var(--fd);
  font-size: 22px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 2px;
}

.sidebar-header h1 span {
  color: var(--tx);
  font-weight: 400;
}

.vps-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.vps-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.15s;
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
  font-size: 14px;
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
  padding: 12px;
  border-top: 1px solid var(--bd);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-family: var(--fb);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
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

.btn-danger {
  background: transparent;
  color: var(--red);
  border: 1px solid var(--red);
}
.btn-danger:hover { background: rgba(192,57,43,0.1); }

/* Main content */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.terminal-bar {
  height: 40px;
  background: var(--bg2);
  border-bottom: 1px solid var(--bd);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  font-size: 13px;
  color: var(--tx2);
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

/* Setup wizard */
.setup-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  z-index: 20;
}

.setup-card {
  width: 440px;
  max-width: 90vw;
  background: var(--cd);
  border: 1px solid var(--bd);
  border-radius: 12px;
  padding: 32px;
}

.setup-card h2 {
  font-family: var(--fd);
  font-size: 20px;
  color: var(--gold);
  margin-bottom: 4px;
}

.setup-card p {
  font-size: 13px;
  color: var(--tx2);
  margin-bottom: 20px;
  line-height: 1.5;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--tx2);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg);
  border: 1px solid var(--bd);
  border-radius: 6px;
  color: var(--tx);
  font-family: var(--fb);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--gold);
}

.field textarea {
  resize: vertical;
  min-height: 80px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
}

.field .hint {
  font-size: 11px;
  color: var(--tx3);
  margin-top: 4px;
}

.field-row {
  display: flex;
  gap: 12px;
}
.field-row .field { flex: 1; }

.setup-actions {
  display: flex;
  gap: 8px;
  margin-top: 24px;
}

/* Empty state */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--tx3);
  gap: 16px;
}

.empty svg { opacity: 0.3; }

.empty p {
  font-size: 14px;
  max-width: 300px;
  text-align: center;
  line-height: 1.6;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bd); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--tx3); }

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.setup-card { animation: fadeIn 0.3s ease; }
`;
