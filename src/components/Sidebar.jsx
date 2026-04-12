import Logo from './Logo';

export default function Sidebar({ connections, activeId, onSelect, onAdd, onRemove }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Logo size={32} />
        <h1>view<span>AI</span>ble</h1>
      </div>

      <div className="vps-list">
        {connections.length === 0 && (
          <div style={{ padding: '16px 8px', color: 'var(--tx3)', fontSize: 13, textAlign: 'center' }}>
            No connections yet
          </div>
        )}
        {connections.map(c => (
          <div
            key={c.id}
            className={`vps-item${c.id === activeId ? ' active' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <div className={`vps-dot connected`} />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="vps-name">{c.name}</div>
              <div className="vps-host">{c.url?.replace(/^https?:\/\//, '') || 'unknown'}</div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={e => { e.stopPropagation(); onRemove(c.id); }}
              title="Remove"
              style={{ padding: '4px 8px', minWidth: 0 }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="btn btn-gold btn-full btn-sm" onClick={onAdd}>
          + Add VPS
        </button>
      </div>
    </div>
  );
}
