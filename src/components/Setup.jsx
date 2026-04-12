import { useState } from 'react';
import { supportedDistros } from '../distros';
import Logo from './Logo';
import { distroIconMap } from './DistroIcons';

function CopyBlock({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleCopy}
        title="Copy"
        style={{
          position: 'absolute',
          top: -10,
          right: -4,
          background: copied ? 'var(--green)' : 'var(--cd2)',
          border: '1px solid var(--bd)',
          borderRadius: 6,
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
          zIndex: 1,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={copied ? '#fff' : 'var(--tx2)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {copied ? (
            <polyline points="20 6 9 17 4 12"/>
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </>
          )}
        </svg>
      </button>
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--bd)',
        borderRadius: 'var(--radius)',
        padding: '10px 14px',
        fontFamily: 'var(--mono)',
        fontSize: 12,
        color: 'var(--gold)',
        wordBreak: 'break-all',
        lineHeight: 1.6,
      }}>
        {text}
      </div>
    </div>
  );
}

export default function Setup({ onSave, onCancel, initial }) {
  const [step, setStep] = useState(initial ? 'connect' : 'setup');
  const [name, setName] = useState(initial?.name || '');
  const [host, setHost] = useState(initial?.host || '');
  const [port, setPort] = useState(initial?.port || '7681');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    const h = host.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:.*$/, '');
    if (!h) return;

    const p = parseInt(port) || 7681;

    // If raw IP, convert to sslip.io hostname (Workers can't fetch IPs directly)
    let resolved = h;
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) {
      resolved = `${h}.sslip.io`;
    }

    const url = `http://${resolved}:${p}`;

    setChecking(true);
    setError('');

    try {
      const resp = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save connection');
      }

      onSave({
        name: name.trim() || h,
        host: h,
        port: p,
        url,
      });
    } catch (e) {
      setError(e.message || 'Could not set up connection.');
    } finally {
      setChecking(false);
    }
  };

  if (step === 'setup') {
    return (
      <div className="setup-overlay">
        <div className="setup-card" style={{ maxWidth: 540 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Logo size={72} />
            <div style={{
              fontFamily: 'var(--fd)',
              fontSize: 22,
              fontWeight: 500,
              color: 'var(--tx2)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginTop: 10,
            }}>
              view<span style={{ color: 'var(--gold)', fontWeight: 900 }}>AI</span>ble
            </div>
            <div style={{
              fontSize: 10,
              color: 'var(--tx3)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: 4,
            }}>
              divide and conquer, anywhere
            </div>
          </div>
          <h2>Set Up Your VPS</h2>
          <p>
            Run this on your VPS to install Claude Code + terminal server.
          </p>

          <div className="field">
            <label>1. Run on your VPS</label>
            <CopyBlock text="curl -fsSL https://viewaible.app/setup.sh | bash" />
          </div>

          <div className="field">
            <label>Supported</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {supportedDistros.map(d => {
                const Icon = distroIconMap[d.id];
                return (
                  <span key={d.id} style={{
                    background: 'var(--cd2)',
                    border: '1px solid var(--bd)',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: 10,
                    color: 'var(--tx2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                    {Icon && <Icon size={14} />}
                    {d.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label>2. DNS Setup</label>
            <div className="hint">
              Add a <strong>DNS-only</strong> (grey cloud) A record in Cloudflare pointing to your VPS IP.
            </div>
          </div>

          <div className="setup-actions">
            <button type="button" className="btn btn-gold btn-full" onClick={() => setStep('connect')}>
              Done, connect &rarr;
            </button>
            {onCancel && (
              <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-overlay">
      <div className="setup-card" style={{ maxWidth: 460 }}>
        <h2>{initial ? 'Edit' : 'Connect'}</h2>
        <p>Enter your VPS hostname (DNS-only, grey cloud in Cloudflare).</p>

        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My VPS"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Hostname</label>
            <input
              type="text"
              value={host}
              onChange={e => { setHost(e.target.value); setError(''); }}
              placeholder="vps.example.com"
              required
            />
          </div>
          <div className="field" style={{ maxWidth: 100 }}>
            <label>Port</label>
            <input
              type="number"
              value={port}
              onChange={e => setPort(e.target.value)}
              placeholder="7681"
            />
          </div>
        </div>

        <div className="hint" style={{ marginBottom: 12 }}>
          IP address or hostname. If using Cloudflare DNS, set to DNS-only (grey cloud).
        </div>

        {error && (
          <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        <div className="setup-actions">
          <button
            type="button"
            className="btn btn-gold btn-full"
            onClick={handleConnect}
            disabled={checking}
          >
            {checking ? 'Connecting...' : 'Connect'}
          </button>
          {!initial && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep('setup')}>
              &larr; Back
            </button>
          )}
          {onCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </div>
    </div>
  );
}
