import Logo from './Logo';

export default function Sidebar({ connections, activeId, onSelect, onAdd, onRemove, onSettings, collapsed, onToggle }) {
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        title="Show connections"
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 24,
          height: 60,
          background: 'var(--bg2)',
          border: '1px solid var(--bd)',
          borderLeft: 'none',
          borderRadius: '0 8px 8px 0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--tx3)',
          fontSize: 14,
          zIndex: 11,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.target.style.color = 'var(--gold)'; e.target.style.width = '28px'; }}
        onMouseLeave={e => { e.target.style.color = 'var(--tx3)'; e.target.style.width = '24px'; }}
      >
        &#9654;
      </button>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header" style={{ justifyContent: 'center', position: 'relative' }}>
        <Logo size={38} />
        <button
          onClick={onToggle}
          title="Hide connections"
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--tx3)',
            fontSize: 14,
            cursor: 'pointer',
            padding: '4px',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--tx)'}
          onMouseLeave={e => e.target.style.color = 'var(--tx3)'}
        >
          &#9664;
        </button>
      </div>

      <div className="vps-list">
        {connections.length === 0 && (
          <div style={{ padding: '16px 8px', color: 'var(--tx3)', fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
            No connections yet
          </div>
        )}
        {connections.map(c => (
          <div
            key={c.id}
            className={`vps-item${c.id === activeId ? ' active' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            {/* Mini spiral icon for each connection */}
            <svg width="16" height="16" viewBox="0 0 680 400" fill="none" style={{ flexShrink: 0 }}>
              <g transform="translate(340,200)">
                <path d="M0,0 C22,0 40,-22 40,-46 C40,-74 18,-98 -12,-104 C-46,-104 -76,-74 -80,-36 C-80,4 -48,40 -8,48 C36,52 72,18 80,-22 C86,-64 50,-106 6,-116 C-46,-120 -96,-78 -104,-26 C-110,32 -70,84 -14,96 C48,104 100,60 112,-2 C92,54 44,92 -12,86 C-62,76 -96,28 -92,-24 C-84,-68 -42,-104 6,-106 C48,-100 78,-58 72,-18 C64,22 30,44 -8,40 C-36,34 -56,8 -54,-24 C-50,-48 -28,-66 -6,-64 C14,-60 26,-46 24,-30 C20,-18 10,-10 0,-8 L0,0Z" fill="var(--green, #2ECC71)"/>
                <circle cx="0" cy="-4" r="14" fill="var(--green, #2ECC71)"/>
              </g>
            </svg>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="vps-name">{c.name}</div>
              <div className="vps-host">{c.host || 'connected'}</div>
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
        <button className="btn btn-ghost btn-full btn-sm" onClick={onSettings}>
          Settings
        </button>
      </div>
    </div>
  );
}
