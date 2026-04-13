import { useState, useEffect, useRef, useCallback } from 'react';
import { supportedDistros } from '../distros';
import Logo from './Logo';
import { distroIconMap } from './DistroIcons';

// Strict IP validation — no hostnames, no injection
const IPV4_RE = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
const IPV6_RE = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,6}:$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1}(?::[0-9a-fA-F]{1,4}){1,6}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/;
const PORT_RE = /^[1-9]\d{0,4}$/;

function isValidIP(str) {
  return IPV4_RE.test(str) || IPV6_RE.test(str);
}

function isValidPort(str) {
  return PORT_RE.test(str) && parseInt(str, 10) <= 65535;
}

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

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
        fontSize: 11,
        color: 'var(--gold)',
        wordBreak: 'break-all',
        lineHeight: 1.6,
      }}>
        {text}
      </div>
    </div>
  );
}

function PulsingDot() {
  return (
    <span style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--gold)',
      animation: 'pulse 1.5s ease-in-out infinite',
      marginRight: 8,
      verticalAlign: 'middle',
    }} />
  );
}

export default function Setup({ onSave, onCancel }) {
  const [step, setStep] = useState('setup');
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('7681');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [polling, setPolling] = useState(false);
  const [pollStatus, setPollStatus] = useState('');
  const pollRef = useRef(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const handleGenerate = async () => {
    const addr = ip.trim();
    if (!addr || !isValidIP(addr)) {
      setError('Enter a valid IPv4 or IPv6 address.');
      return;
    }
    const p = port.trim();
    if (!isValidPort(p)) {
      setError('Port must be between 1 and 65535.');
      return;
    }

    setError('');
    const t = generateToken();
    setToken(t);

    // Build the URL for the Worker proxy (sslip.io needed for Worker fetch)
    const sslipHost = IPV6_RE.test(addr)
      ? `${addr.replace(/:/g, '-')}.sslip.io`
      : `${addr}.sslip.io`;
    const url = `http://${sslipHost}:${p}`;

    // Set the cookie now so polling works through the proxy
    try {
      const resp = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, token: t }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        setError(data.error || 'Failed to set up connection');
        return;
      }
    } catch (e) {
      setError('Failed to save connection: ' + e.message);
      return;
    }

    setStep('command');
    startPolling(addr, p, t, url);
  };

  const startPolling = useCallback((addr, p, t, url) => {
    setPolling(true);
    setPollStatus('Waiting for VPS...');
    let attempts = 0;

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const resp = await fetch('/terminal/', {
          signal: AbortSignal.timeout(5000),
        });
        if (resp.ok || resp.status === 200) {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setPolling(false);
          setPollStatus('Connected!');
          onSave({
            name: name.trim() || addr,
            ip: addr,
            port: parseInt(p, 10),
            url,
          });
        } else if (resp.status === 403) {
          setPollStatus('VPS is up but token was rejected. Re-run the setup command.');
        } else {
          setPollStatus(`Waiting for VPS... (attempt ${attempts})`);
        }
      } catch {
        setPollStatus(`Waiting for VPS... (attempt ${attempts})`);
      }
    }, 4000);
  }, [name, onSave]);

  const handleBack = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setPolling(false);
    setStep('setup');
    setToken('');
  };

  // Construct the one-liner
  const oneLiners = token ? `curl -fsSL https://yourdomain.app/setup.sh | bash -s -- ${token} ${port.trim()}` : '';

  if (step === 'command') {
    return (
      <div className="setup-overlay">
        <div className="setup-card" style={{ maxWidth: 560 }}>
          <h2>Run on Your VPS</h2>
          <p>
            SSH into your VPS and run this command. No root required.
          </p>

          <div className="field">
            <label>Setup command</label>
            <CopyBlock text={oneLiners} />
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

          <div style={{
            background: 'var(--cd2)',
            border: '1px solid var(--bd)',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            fontSize: 13,
            color: polling ? 'var(--tx2)' : 'var(--green)',
          }}>
            {polling ? <PulsingDot /> : (
              <span style={{ color: 'var(--green)', marginRight: 8, fontSize: 16 }}>&#10003;</span>
            )}
            {pollStatus}
          </div>

          <div className="setup-actions" style={{ marginTop: 16 }}>
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              &larr; Change IP
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

        <h2>Add Your VPS</h2>
        <p>Enter your VPS IP address. We'll generate a setup command.</p>

        <div className="field">
          <label>Name <span style={{ color: 'var(--tx3)', fontWeight: 400 }}>(optional)</span></label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My VPS"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>IP Address</label>
            <input
              type="text"
              value={ip}
              onChange={e => { setIp(e.target.value); setError(''); }}
              placeholder="203.0.113.10 or 2001:db8::1"
              required
              style={{ fontFamily: 'var(--mono)', fontSize: 12 }}
            />
          </div>
          <div className="field" style={{ maxWidth: 100 }}>
            <label>Port</label>
            <input
              type="text"
              value={port}
              onChange={e => setPort(e.target.value)}
              placeholder="7681"
              style={{ fontFamily: 'var(--mono)', fontSize: 12 }}
            />
          </div>
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
            onClick={handleGenerate}
          >
            Generate Setup Command &rarr;
          </button>
          {onCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </div>
    </div>
  );
}
