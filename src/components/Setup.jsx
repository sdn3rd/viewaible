import { useState } from 'react';
import { supportedDistros } from '../distros';

export default function Setup({ onSave, onCancel, initial }) {
  const [step, setStep] = useState(initial ? 'connect' : 'setup');
  const [name, setName] = useState(initial?.name || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    let cleanUrl = url.trim();
    if (!cleanUrl) return;
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    setChecking(true);
    setError('');

    try {
      // Store the target URL in an HttpOnly cookie via the backend
      const resp = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });

      if (!resp.ok) {
        throw new Error('Failed to save connection');
      }

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
            <label>Run on your VPS</label>
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
              Missing your distro? Add a YAML config — see the GitHub repo.
            </div>
          </div>

          <div className="field" style={{ marginTop: 20 }}>
            <label>After Setup</label>
            <div className="hint">
              1. Point a Cloudflare DNS record at your VPS IP<br/>
              2. Set SSL mode to "Full" in Cloudflare<br/>
              3. Click "I've done this" below and enter your domain
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
      <div className="setup-card">
        <h2>{initial ? 'Edit Connection' : 'Connect Terminal'}</h2>
        <p>
          Enter the HTTPS domain pointing at your VPS.
          The browser will prompt for ttyd credentials if set.
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

        <div className="field">
          <label>Terminal URL</label>
          <input
            type="text"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(''); }}
            placeholder="https://terminal.example.com"
            required
          />
          <div className="hint">
            Your domain with Cloudflare proxy enabled, SSL mode "Full"
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>
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
            {checking ? 'Checking...' : 'Connect'}
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
