import { useState } from 'react';

export default function Setup({ onSave, onCancel, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [host, setHost] = useState(initial?.host || '');
  const [port, setPort] = useState(initial?.port || '22');
  const [user, setUser] = useState(initial?.user || 'root');
  const [ttydPort, setTtydPort] = useState(initial?.ttydPort || '7681');
  const [ttydUser, setTtydUser] = useState(initial?.ttydUser || '');
  const [ttydPass, setTtydPass] = useState(initial?.ttydPass || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!host.trim()) return;
    onSave({
      name: name.trim() || host.trim(),
      host: host.trim(),
      port: parseInt(port) || 22,
      user: user.trim() || 'root',
      ttydPort: parseInt(ttydPort) || 7681,
      ttydUser: ttydUser.trim(),
      ttydPass: ttydPass.trim(),
    });
  };

  return (
    <div className="setup-overlay">
      <form className="setup-card" onSubmit={handleSubmit}>
        <h2>{initial ? 'Edit Connection' : 'Add VPS'}</h2>
        <p>
          Connect to a VPS running ttyd + Claude Code.
          Your connection details are stored locally in your browser.
        </p>

        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My VPS"
          />
          <div className="hint">A friendly name for this connection</div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Host / IP</label>
            <input
              type="text"
              value={host}
              onChange={e => setHost(e.target.value)}
              placeholder="192.168.1.100 or vps.example.com"
              required
            />
          </div>
          <div className="field" style={{ maxWidth: 100 }}>
            <label>SSH Port</label>
            <input
              type="number"
              value={port}
              onChange={e => setPort(e.target.value)}
              placeholder="22"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>SSH User</label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="root"
            />
          </div>
          <div className="field" style={{ maxWidth: 120 }}>
            <label>ttyd Port</label>
            <input
              type="number"
              value={ttydPort}
              onChange={e => setTtydPort(e.target.value)}
              placeholder="7681"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>ttyd Username</label>
            <input
              type="text"
              value={ttydUser}
              onChange={e => setTtydUser(e.target.value)}
              placeholder="(optional)"
            />
          </div>
          <div className="field">
            <label>ttyd Password</label>
            <input
              type="password"
              value={ttydPass}
              onChange={e => setTtydPass(e.target.value)}
              placeholder="(optional)"
            />
          </div>
        </div>

        <div className="setup-actions">
          <button type="submit" className="btn btn-gold btn-full">
            {initial ? 'Save Changes' : 'Connect'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
