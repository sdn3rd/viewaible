import { useState } from 'react';
import { supportedDistros } from '../distros';

export default function Setup({ onSave, onCancel, initial }) {
  const [step, setStep] = useState(initial ? 'connect' : 'setup');
  const [name, setName] = useState(initial?.name || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [method, setMethod] = useState('ip');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    let cleanUrl = url.trim();
    if (!cleanUrl) return;
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'http://' + cleanUrl;
    }

    setChecking(true);
    setError('');

    try {
      const resp = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });

      if (!resp.ok) throw new Error('Failed to save connection');

      onSave({
        name: name.trim() || new URL(cleanUrl).hostname,
        url: cleanUrl,
      });
    } catch {
      setError('Could not set up connection. Check the URL and try again.');
    } finally {
      setChecking(false);
    }
  };

  if (step === 'setup') {
    return (
      <div className="setup-overlay">
        <div className="setup-card" style={{ maxWidth: 560 }}>
          <h2>Set Up Your VPS</h2>
          <p>
            Run this command on your VPS to install Claude Code, ttyd, and nginx.
            Works on any supported Linux distro — auto-detected.
          </p>

          <div className="field">
            <label>1. Run on your VPS</label>
            <div style={{
              background: 'var(--bg)',
              border: '1px solid var(--bd)',
              borderRadius: 6,
              padding: '12px 14px',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 12,
              color: 'var(--gold)',
              wordBreak: 'break-all',
              lineHeight: 1.6,
              cursor: 'pointer',
              position: 'relative',
            }}
              onClick={() => {
                navigator.clipboard.writeText('curl -fsSL https://paine.pages.dev/setup.sh | bash');
              }}
              title="Click to copy"
            >
              curl -fsSL https://paine.pages.dev/setup.sh | bash
              <span style={{
                position: 'absolute',
                top: 8,
                right: 10,
                fontSize: 10,
                color: 'var(--tx3)',
              }}>click to copy</span>
            </div>
          </div>

          <div className="field">
            <label>Supported Distros</label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginTop: 4,
            }}>
              {supportedDistros.map(d => (
                <span key={d.id} style={{
                  background: 'var(--cd2)',
                  border: '1px solid var(--bd)',
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 11,
                  color: 'var(--tx2)',
                }}>{d.name}</span>
              ))}
            </div>
            <div className="hint" style={{ marginTop: 8 }}>
              Missing your distro? Add support via the GitHub repo.
            </div>
          </div>

          <div className="field" style={{ marginTop: 20 }}>
            <label>2. Authenticate Claude Code</label>
            <div className="hint">
              SSH into your VPS and run:<br/>
              <code style={{ color: 'var(--gold)', fontSize: 12 }}>
                su - claude -c 'claude auth login'
              </code>
            </div>
          </div>

          <div className="setup-actions">
            <button
              type="button"
              className="btn btn-gold btn-full"
              onClick={() => setStep('connect')}
            >
              I've run the setup &rarr;
            </button>
            {onCancel && (
              <button type="button" className="btn btn-ghost" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-overlay">
      <div className="setup-card" style={{ maxWidth: 520 }}>
        <h2>{initial ? 'Edit Connection' : 'Connect Terminal'}</h2>
        <p>
          Your VPS address is proxied through pAIne and never exposed to the browser.
        </p>

        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My VPS"
          />
        </div>

        {/* Connection method selector */}
        <div className="field">
          <label>Connection Method</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              className={`btn btn-sm ${method === 'ip' ? 'btn-gold' : 'btn-ghost'}`}
              onClick={() => { setMethod('ip'); setUrl(''); }}
              style={{ flex: 1 }}
            >
              Direct IP (recommended)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${method === 'dns' ? 'btn-gold' : 'btn-ghost'}`}
              onClick={() => { setMethod('dns'); setUrl(''); }}
              style={{ flex: 1 }}
            >
              DNS hostname
            </button>
          </div>
        </div>

        {method === 'ip' ? (
          <div className="field">
            <label>VPS IP + Port</label>
            <input
              type="text"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              placeholder="http://203.0.113.50:7681"
              required
            />
            <div className="hint">
              Enter your VPS IP with ttyd port 7681. The setup script configures
              UFW to only allow Cloudflare and localhost — direct browser access is blocked.
            </div>
            <div style={{
              marginTop: 8,
              padding: '8px 10px',
              background: 'var(--cd2)',
              borderRadius: 4,
              fontSize: 11,
              color: 'var(--tx2)',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: 'var(--gold)' }}>How it works:</strong> pAIne's
              server connects to your VPS on your behalf. Your IP address never
              appears in the browser, page source, or network tab. The connection
              is stored in a secure server-side cookie.
            </div>
          </div>
        ) : (
          <div className="field">
            <label>Hostname + Port</label>
            <input
              type="text"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              placeholder="https://vps.example.com"
              required
            />
            <div className="hint">
              Use a DNS record pointing at your VPS. Must be <strong>DNS-only</strong> (grey
              cloud) in Cloudflare — not proxied — to avoid routing loops.
            </div>
            <div style={{
              marginTop: 8,
              padding: '8px 10px',
              background: 'var(--cd2)',
              borderRadius: 4,
              fontSize: 11,
              color: 'var(--tx2)',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: 'var(--gold)' }}>DNS setup:</strong> Add an A
              record for your subdomain pointing to your VPS IP. Set it to <strong>DNS
              only</strong> (grey cloud icon). If you use the orange cloud (proxied),
              the connection will loop and fail. The hostname is only used server-side
              and never exposed to the browser.
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12, marginTop: 8 }}>
            {error}
          </div>
        )}

        <div className="setup-actions">
          <button
            type="button"
            className="btn btn-gold btn-full"
            onClick={handleVerify}
            disabled={checking}
          >
            {checking ? 'Connecting...' : 'Connect'}
          </button>
          {!initial && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep('setup')}
            >
              &larr; Back
            </button>
          )}
          {onCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
