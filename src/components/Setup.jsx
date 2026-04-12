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

    // Detect raw IP addresses — Cloudflare Workers can't fetch IPs directly
    try {
      const hostname = new URL(cleanUrl).hostname;
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        setError(
          'Cloudflare Workers cannot connect to raw IP addresses. ' +
          'Add a DNS-only (grey cloud) A record in Cloudflare pointing to your VPS IP, ' +
          'then use that hostname instead (e.g. http://vps.example.com:7681).'
        );
        return;
      }
    } catch {
      setError('Invalid URL format.');
      return;
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
                navigator.clipboard.writeText('curl -fsSL https://viewaible.app/setup.sh | bash');
              }}
              title="Click to copy"
            >
              curl -fsSL https://viewaible.app/setup.sh | bash
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
          Your VPS address is proxied through viewAIble and never exposed to the browser.
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
          <label>Terminal Hostname</label>
          <input
            type="text"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(''); }}
            placeholder="http://vps.example.com:7681"
            required
          />
          <div className="hint">
            A DNS hostname pointing at your VPS with ttyd port.
          </div>
        </div>

        <div style={{
          padding: '10px 12px',
          background: 'var(--cd2)',
          borderRadius: 6,
          fontSize: 11,
          color: 'var(--tx2)',
          lineHeight: 1.6,
          marginBottom: 16,
        }}>
          <strong style={{ color: 'var(--gold)', display: 'block', marginBottom: 4 }}>
            Cloudflare DNS Setup
          </strong>
          1. Add an <strong>A record</strong> for a subdomain (e.g. <code style={{ color: 'var(--tx)' }}>vps.example.com</code>)
             pointing to your VPS IP<br/>
          2. Set it to <strong style={{ color: 'var(--tx)' }}>DNS only</strong> (grey
             cloud) — <strong style={{ color: 'var(--red)' }}>not proxied</strong><br/>
          3. Enter <code style={{ color: 'var(--tx)' }}>http://vps.example.com:7681</code> above<br/><br/>
          <span style={{ color: 'var(--tx3)' }}>
            Why grey cloud? viewAIble's server connects to your VPS directly.
            If the DNS is proxied (orange cloud), the request loops through Cloudflare
            and fails. Your hostname is stored server-side only — never visible in the browser.
          </span>
        </div>

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
