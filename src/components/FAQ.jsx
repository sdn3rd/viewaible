import { useState } from 'react';

const FAQS = [
  {
    q: 'What is viewAIble?',
    a: 'A browser-based terminal manager that lets you run Claude Code on any VPS. No installs on your machine — just connect and code.',
  },
  {
    q: 'What do I need to get started?',
    a: 'A VPS (any provider — DigitalOcean, Hetzner, Linode, etc.) running a supported Linux distro. Enter your IP here, run the generated command on your VPS, and it auto-connects.',
  },
  {
    q: 'Is my VPS connection secure?',
    a: 'Your VPS address and session token are stored in HttpOnly cookies — never visible in the browser, page source, or dev tools. A unique token binds your browser 1-to-1 with your VPS. Clearing cookies means you need to re-run the setup command. No root access is required on the VPS.',
  },
  {
    q: 'How many terminals can I run?',
    a: 'Up to 4 per VPS. Each terminal is an independent Claude Code session. The layout auto-adapts: side-by-side for 2, T-shape for 3, 2x2 grid for 4.',
  },
  {
    q: 'How do I authenticate Claude?',
    a: 'Just type /login in the terminal once connected. Complete the OAuth flow in your browser and paste the code back in the terminal.',
  },
  {
    q: 'Can I connect to multiple VPS servers?',
    a: 'Yes. Add as many VPS connections as you want from the sidebar. Each has its own set of terminals.',
  },
  {
    q: 'Which Linux distros are supported?',
    a: 'Debian/Ubuntu, RHEL/CentOS/Fedora/Rocky/Alma, Arch/Manjaro, Alpine, and openSUSE/SLES. The setup script auto-detects your distro.',
  },
  {
    q: 'Is this free?',
    a: 'viewAIble is free and open source. You just need your own VPS and a Claude account (free tier or paid).',
  },
  {
    q: 'Where is my data stored?',
    a: 'Connection details are in your browser\'s localStorage and a server-side cookie. Nothing is stored on our servers. Clear cookies = fresh start.',
  },
];

export default function FAQ({ onClose }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="settings-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="settings-panel" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>FAQ</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>&times;</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: open === i ? 'var(--cd2)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: 'var(--fb)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--tx)',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{
                  color: 'var(--gold)',
                  fontSize: 11,
                  transition: 'transform 0.2s',
                  transform: open === i ? 'rotate(90deg)' : 'rotate(0)',
                  display: 'inline-block',
                }}>&#9654;</span>
                {faq.q}
              </button>
              {open === i && (
                <div style={{
                  padding: '4px 14px 14px 38px',
                  fontSize: 13,
                  color: 'var(--tx2)',
                  lineHeight: 1.6,
                  animation: 'fadeIn 0.15s ease',
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
